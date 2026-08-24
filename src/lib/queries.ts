import { publicClient } from "@/lib/supabase/public";
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

export async function getAwards(): Promise<Award[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("awards")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return data ?? [];
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
  return (data as Award | null) ?? null;
}

export async function getInitiatives(): Promise<Initiative[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("initiatives")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return data ?? [];
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
  return (data as Initiative | null) ?? null;
}

export async function getPosts(): Promise<BlogPost[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
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
  return (data as BlogPost | null) ?? null;
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("partners").select("*").order("sort_order");
  return data ?? [];
}

export async function getPressAssets(): Promise<PressAsset[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("press_assets").select("*").order("sort_order");
  return data ?? [];
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = publicClient();
  if (!supabase) return {};
  const { data } = await supabase.from("site_settings").select("key, value");
  const out: SiteSettings = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return out;
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
  return (data as CommunityIdea[] | null) ?? [];
}
