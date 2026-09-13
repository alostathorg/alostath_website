import { publicClient } from "@/lib/supabase/public";
import { latinDigitsDeep } from "@/lib/format";
import type {
  Award,
  BlogPost,
  BrandPartner,
  CommunityIdea,
  Initiative,
  Partner,
  PressAsset,
  SiteSettings,
} from "@/lib/types";

// Public reads use a cookieless anon client, so pages statically generate and
// revalidate (ISR). RLS returns only published rows. When env vars are missing
// (CI build without secrets) the client is null and we return empty results.
//
// Every CMS row reaches a page through this module, so every read ends in
// latinDigitsDeep — the site's "Western digits only" rule applied to content it
// does not author. The dashboard normalises a row on save; this pass covers the
// rows stored before it did. See lib/format.ts for what is rewritten and what
// (identifiers, addresses) is left alone.

export async function getAwards(): Promise<Award[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("awards")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return latinDigitsDeep(data ?? []);
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
  return latinDigitsDeep((data as Award | null) ?? null);
}

export async function getInitiatives(): Promise<Initiative[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("initiatives")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return latinDigitsDeep(data ?? []);
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
  return latinDigitsDeep((data as Initiative | null) ?? null);
}

export async function getPosts(): Promise<BlogPost[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return latinDigitsDeep(data ?? []);
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
  return latinDigitsDeep((data as BlogPost | null) ?? null);
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("partners").select("*").order("sort_order");
  return latinDigitsDeep(data ?? []);
}

/**
 * «الإعلامات» — published brand partners, spotlighted ones first. RLS already
 * hides drafts from the anon client; the filter here keeps an admin session on
 * the same page a visitor sees.
 */
export async function getBrandPartners(): Promise<BrandPartner[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("brand_partners")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order")
    .order("name");
  return latinDigitsDeep((data as BrandPartner[] | null) ?? []);
}

export async function getBrandPartner(slug: string): Promise<BrandPartner | null> {
  const supabase = publicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("brand_partners")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return latinDigitsDeep((data as BrandPartner | null) ?? null);
}

export async function getPressAssets(): Promise<PressAsset[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("press_assets").select("*").order("sort_order");
  return latinDigitsDeep(data ?? []);
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = publicClient();
  if (!supabase) return {};
  const { data } = await supabase.from("site_settings").select("key, value");
  const out: SiteSettings = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return latinDigitsDeep(out);
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
  return latinDigitsDeep((data as CommunityIdea[] | null) ?? []);
}
