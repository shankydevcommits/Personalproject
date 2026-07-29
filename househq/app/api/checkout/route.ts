import { NextResponse } from "next/server";
import { findProduct } from "@/lib/catalog";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: {
    slug?: string;
    email?: string;
    phone?: string;
    marketingConsent?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { slug, email, phone, marketingConsent } = body;

  if (!slug || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address and product are required." },
      { status: 400 }
    );
  }

  const product = findProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }

  const siteUrl = process.env.SITE_URL || new URL(req.url).origin;
  const supabase = supabaseAdmin();

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      kind: "single",
      state: product.state,
      product_slug: product.slug,
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      marketing_consent: Boolean(marketingConsent),
      amount_cents: product.priceCents,
      status: "pending_payment",
    })
    .select()
    .single();

  if (insertError || !order) {
    console.error("Failed to create order", insertError);
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
          unit_amount: product.priceCents,
          product_data: {
            name: `${product.name} (${product.stateName})`,
            description: product.description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id, kind: "single", productSlug: product.slug },
    success_url: `${siteUrl}/verify?order=${order.id}`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
  });

  await supabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
