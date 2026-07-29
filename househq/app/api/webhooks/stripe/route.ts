import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeClient } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { findProduct } from "@/lib/catalog";
import {
  generateVerificationCode,
  hashCode,
  generateMagicToken,
  hashToken,
} from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/resend";

export const runtime = "nodejs";

const VERIFICATION_TTL_MINUTES = 15;

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("Stripe session missing orderId metadata", session.id);
      return NextResponse.json({ received: true });
    }

    const supabase = supabaseAdmin();
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) {
      console.error("Order not found for completed session", orderId);
      return NextResponse.json({ received: true });
    }

    // Idempotency: Stripe may retry webhook delivery.
    if (order.status === "paid" || order.status === "verified") {
      return NextResponse.json({ received: true });
    }

    const code = generateVerificationCode();
    const magicToken = generateMagicToken();
    const expiresAt = new Date(
      Date.now() + VERIFICATION_TTL_MINUTES * 60 * 1000
    ).toISOString();

    await supabase
      .from("orders")
      .update({
        status: "paid",
        stripe_payment_intent:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        verification_code_hash: hashCode(code),
        verification_token_hash: hashToken(magicToken),
        verification_expires_at: expiresAt,
        verification_attempts: 0,
      })
      .eq("id", orderId);

    if (order.marketing_consent) {
      await supabase
        .from("marketing_subscribers")
        .upsert(
          { email: order.email, consent_source: "checkout" },
          { onConflict: "email", ignoreDuplicates: true }
        );
    }

    const siteUrl = process.env.SITE_URL || new URL(req.url).origin;
    const magicLink = `${siteUrl}/verify?order=${orderId}&token=${magicToken}`;
    const productName =
      order.kind === "bundle"
        ? `The Complete ${order.state.toUpperCase()} Bundle`
        : findProduct(order.product_slug)?.name || "your checklist";

    try {
      await sendVerificationEmail({
        to: order.email,
        code,
        magicLink,
        productName,
      });
    } catch (err) {
      console.error("Failed to send verification email", err);
    }
  }

  return NextResponse.json({ received: true });
}
