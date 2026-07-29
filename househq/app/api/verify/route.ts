import { NextResponse } from "next/server";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabaseAdmin";
import { hashCode, hashToken } from "@/lib/tokens";
import { bundleProductsFor, findProduct } from "@/lib/catalog";
import { sendDownloadBackupEmail } from "@/lib/resend";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const SIGNED_URL_TTL_SECONDS = 600; // 10 minutes

export async function POST(req: Request) {
  let body: { orderId?: string; code?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { orderId, code, token } = body;
  if (!orderId || (!code && !token)) {
    return NextResponse.json({ error: "Missing order or code." }, { status: 400 });
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

  if (order.status === "pending_payment") {
    return NextResponse.json(
      { error: "This order hasn't completed payment yet." },
      { status: 409 }
    );
  }

  // Already verified this session - just re-issue fresh signed links.
  if (order.status === "verified") {
    const links = await signedLinksFor(order);
    return NextResponse.json({ ok: true, links });
  }

  if (order.verification_expires_at && new Date(order.verification_expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Your code has expired. Request a new one." },
      { status: 410 }
    );
  }

  if (order.verification_attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many incorrect attempts. Request a new code." },
      { status: 429 }
    );
  }

  let matched = false;
  if (token) {
    matched = hashToken(token) === order.verification_token_hash;
  } else if (code) {
    matched = hashCode(code) === order.verification_code_hash;
  }

  if (!matched) {
    await supabase
      .from("orders")
      .update({ verification_attempts: order.verification_attempts + 1 })
      .eq("id", orderId);
    return NextResponse.json({ error: "Incorrect code." }, { status: 401 });
  }

  await supabase
    .from("orders")
    .update({ status: "verified", verified_at: new Date().toISOString() })
    .eq("id", orderId);

  const links = await signedLinksFor(order);

  try {
    await sendDownloadBackupEmail({ to: order.email, links });
  } catch (err) {
    console.error("Failed to send backup download email", err);
  }

  return NextResponse.json({ ok: true, links });
}

async function signedLinksFor(order: {
  kind: string;
  state: string;
  product_slug: string | null;
}): Promise<{ name: string; url: string }[]> {
  const supabase = supabaseAdmin();
  const items =
    order.kind === "bundle"
      ? bundleProductsFor(order.state)
      : [findProduct(order.product_slug || "")].filter(
          (p): p is NonNullable<typeof p> => Boolean(p)
        );

  const links: { name: string; url: string }[] = [];
  for (const product of items) {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(product.pdfPath, SIGNED_URL_TTL_SECONDS);
    if (error || !data) {
      console.error("Failed to sign URL for", product.pdfPath, error);
      continue;
    }
    links.push({ name: product.name, url: data.signedUrl });
  }
  return links;
}
