import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_LISTS = ["agents", "guides", "tools"];

export async function POST(req: Request) {
  let body: { email?: string; list?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const list = body.list?.trim();

  if (!email || !EMAIL_RE.test(email) || !list || !VALID_LISTS.includes(list)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("notify_signups").insert({ email, list });

  if (error) {
    console.error("Failed to store notify signup", error);
    return NextResponse.json({ error: "Could not save your email." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
