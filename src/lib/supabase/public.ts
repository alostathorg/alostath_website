import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookieless anon client for public content reads. Because it never touches
 * cookies, pages that use it can be statically generated and served via ISR.
 * Returns null when env vars are absent (e.g. during a CI build with no
 * secrets) so pages render empty instead of crashing the build.
 */
export function publicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
