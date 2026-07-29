import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateVerificationCode, hashCode, generateMagicToken, hashToken } from "@/lib/tokens";
import { findProduct } from "@/lib/catalog";
import { sendVerificationEmail } from "@/lib/resend";

export const runtime = "nodejs";

const VERIFICATION_TTL_MINUTES = 15;

export async function POST(req: Request) {
  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { orderId } = body;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json(
      { error: "This order isn't awaiting verification." },
      { status: 409 }
    );
  }

  const code = generateVerificationCode();
  const magicToken = generateMagicToken();
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MINUTES * 60 * 1000).toISOString();

  await supabase
    .from("orders")
    .update({
      verification_code_hash: hashCode(code),
      verification_token_hash: hashToken(magicToken),
      verification_expires_at: expiresAt,
      verification_attempts: 0,
    })
    .eq("id", orderId);

  const siteUrl = process.env.SITE_URL || new URL(req.url).origin;
  const magicLink = `${siteUrl}/verify?order=${orderId}&token=${magicToken}`;
  const productName =
    order.kind === "bundle"
      ? `The Complete ${order.state.toUpperCase()} Bundle`
      : findProduct(order.product_slug)?.name || "your checklist";

  await sendVerificationEmail({ to: order.email, code, magicLink, productName });

  return NextResponse.json({ ok: true });
}
