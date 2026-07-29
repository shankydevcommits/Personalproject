import { NextResponse } from "next/server";
import { findBundle } from "@/lib/catalog";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: {
    state?: string;
    email?: string;
    phone?: string;
    marketingConsent?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { state, email, phone, marketingConsent } = body;

  if (!state || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address and state are required." },
      { status: 400 }
    );
  }

  const bundle = findBundle(state);
  if (!bundle) {
    return NextResponse.json({ error: "Unknown state." }, { status: 404 });
  }

  const siteUrl = process.env.SITE_URL || new URL(req.url).origin;
  const supabase = supabaseAdmin();

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      kind: "bundle",
      state: bundle.state,
      product_slug: null,
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      marketing_consent: Boolean(marketingConsent),
      amount_cents: bundle.priceCents,
      status: "pending_payment",
    })
    .select()
    .single();

  if (insertError || !order) {
    console.error("Failed to create bundle order", insertError);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }

  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "aud",
          unit_amount: bundle.priceCents,
          product_data: {
            name: `The Complete ${bundle.stateName} Bundle (12 checklists)`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id, kind: "bundle", state: bundle.state },
    success_url: `${siteUrl}/verify?order=${order.id}`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
  });

  await supabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
