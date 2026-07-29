import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Service-role Supabase client. Only ever import this from server-side
 * code (API routes) - the service role key bypasses row-level security,
 * so it must never reach the browser.
 */
export function supabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}

export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "checklists";
