import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendContactNotification } from "@/lib/resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const message = body.message?.trim();

  if (!name || !email || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json(
      { error: "Name, a valid email and a message are required." },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, phone: phone || null, message });

  if (error) {
    console.error("Failed to store contact message", error);
    return NextResponse.json({ error: "Could not send your message." }, { status: 500 });
  }

  try {
    await sendContactNotification({ name, email, phone, message });
  } catch (err) {
    console.error("Failed to send contact notification email", err);
  }

  return NextResponse.json({ ok: true });
}
