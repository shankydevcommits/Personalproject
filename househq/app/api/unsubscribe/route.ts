import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyUnsubscribeToken } from "@/lib/tokens";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const siteUrl = process.env.SITE_URL || new URL(req.url).origin;

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.redirect(`${siteUrl}/unsubscribed?ok=0`);
  }

  const supabase = supabaseAdmin();
  await supabase
    .from("marketing_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email.toLowerCase());

  return NextResponse.redirect(`${siteUrl}/unsubscribed?ok=1`);
}
