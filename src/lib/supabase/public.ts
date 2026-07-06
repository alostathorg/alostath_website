import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookieless anon client for public content reads. Because it never touches
 * cookies, pages that use it can be statically generated and served via ISR.
 *
 * Returns null (so pages render empty and revalidate later) when the env vars
 * are absent OR malformed — a bad value must never crash a static build. This
 * matters on the first deploy: a URL pasted with stray whitespace/quotes would
 * otherwise make `createClient` throw during static generation.
 */
export function publicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^["']|["']$/g, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!url || !key) return null;
  try {
    return createClient(url, key, { auth: { persistSession: false } });
  } catch (err) {
    console.error("publicClient: invalid Supabase config —", (err as Error).message);
    return null;
  }
}
