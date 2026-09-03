import { publicClient } from "@/lib/supabase/public";
import { toLatinDigits } from "@/lib/format";
import type {
  Award,
  BlogPost,
  CommunityIdea,
  Initiative,
  Partner,
  PressAsset,
  SiteSettings,
} from "@/lib/types";

// Public reads use a cookieless anon client, so pages statically generate and
// revalidate (ISR). RLS returns only published rows. When env vars are missing
// (CI build without secrets) the client is null and we return empty results.

/**
 * Every CMS row reaches a page through this module, so it is where the site's
 * "Western digits only" rule is enforced on content it does not author. An
 * editor typing on an Arabic keyboard can leave Arabic-Indic digits (٢٠٢٦,
 * ١٤٤٧هـ) in any text field; those are rewritten to 2026 / 1447 on read, which
 * also covers rows that were stored before the rule existed. Numbers, booleans,
 * nulls and dates pass through untouched — only strings are rewritten.
 */
function latinDigits<T>(value: T): T {
  if (typeof value === "string") return toLatinDigits(value);
  if (Array.isArray(value)) return value.map(latinDigits) as unknown as T;
  // Object.fromEntries defines each key as a plain data property. A `for` loop
  // with `out[k] = …` would not: a jsonb column holding a literal "__proto__"
  // key would hit the inherited setter, silently dropping the key and swapping
  // the rebuilt object's prototype.
  if (value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, latinDigits(v)]),
    ) as T;
  }
  return value;
}

export async function getAwards(): Promise<Award[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("awards")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return latinDigits(data ?? []);
}

export async function getAward(slug: string): Promise<Award | null> {
  const supabase = publicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("awards")
    .select("*, award_timeline_phases(*)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (data?.award_timeline_phases) {
    data.award_timeline_phases.sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
    );
  }
  return latinDigits((data as Award | null) ?? null);
}

export async function getInitiatives(): Promise<Initiative[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("initiatives")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return latinDigits(data ?? []);
}

export async function getInitiative(slug: string): Promise<Initiative | null> {
  const supabase = publicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("initiatives")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return latinDigits((data as Initiative | null) ?? null);
}

export async function getPosts(): Promise<BlogPost[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return latinDigits(data ?? []);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = publicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return latinDigits((data as BlogPost | null) ?? null);
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("partners").select("*").order("sort_order");
  return latinDigits(data ?? []);
}

export async function getPressAssets(): Promise<PressAsset[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("press_assets").select("*").order("sort_order");
  return latinDigits(data ?? []);
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = publicClient();
  if (!supabase) return {};
  const { data } = await supabase.from("site_settings").select("key, value");
  const out: SiteSettings = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return latinDigits(out);
}

/**
 * «أصوات المجتمع» — the ideas the team chose to showcase. RLS already limits
 * anonymous reads to `featured = true and status = 'accepted'`; the filters
 * here are belt-and-braces so an admin session sees the same page as a visitor.
 */
export async function getFeaturedIdeas(limit = 6): Promise<CommunityIdea[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("community_ideas")
    .select("*")
    .eq("featured", true)
    .eq("status", "accepted")
    .order("created_at", { ascending: false })
    .limit(limit);
  return latinDigits((data as CommunityIdea[] | null) ?? []);
}
