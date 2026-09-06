// Shared content types — mirror the SQL schema in supabase/migrations/0001_init.sql.

export type ApplicationStatus = "open" | "soon" | "closed";
export type PhaseState = "done" | "now" | "next";
export type Theme = "olive" | "gold" | "sage";

export interface Initiative {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  badge: string | null;
  overview: string | null;
  goal: string | null;
  facts: { k: string; v: string }[];
  value_cards: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  partners: string[];
  logo_url: string | null;
  hero_image_url: string | null;
  theme: Theme;
  sort_order: number;
  published: boolean;
}

export interface TimelinePhase {
  id: string;
  award_id: string;
  label: string;
  date_text: string | null;
  state: PhaseState;
  tag_text: string | null;
  sort_order: number;
}

export interface Award {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  type: string | null;
  badge_label: string | null;
  beneficiaries: string | null;
  status: ApplicationStatus;
  overview: string | null;
  goal: string | null;
  categories: string[];
  steps: { title: string; body: string }[];
  hero_image_url: string | null;
  theme: Theme;
  partnership_note: string | null;
  sort_order: number;
  published: boolean;
  award_timeline_phases?: TimelinePhase[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string[];
  cover_url: string | null;
  category: string | null;
  published_at: string | null;
  published: boolean;
}

export interface Registration {
  id: string;
  program_name: string;
  program_type: string | null;
  status: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  category: string | null;
  /** Contact-form body. Written by /api/register since day one. */
  message: string | null;
  consent: boolean;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
}

/**
 * «الإعلامات» — a brand whose products, services or offers help teachers.
 * Distinct from `Partner` (institutional partners in the home-page marquee).
 * Mirrors supabase/migrations/0003_brand_partners.sql.
 */
export interface BrandPartner {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  category: string;
  pricing: string;
  audience: string[];
  teacher_offer: string | null;
  offer_code: string | null;
  offer_note: string | null;
  overview: string | null;
  highlights: { title: string; body: string }[];
  location: string | null;
  website_url: string | null;
  cta_url: string | null;
  cta_label: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PressAsset {
  id: string;
  title: string;
  kind: string | null;
  description: string | null;
  file_url: string | null;
  meta: Record<string, unknown>;
  sort_order: number;
}

export type SiteSettings = Record<string, unknown>;

// ── مجتمع الأستاذ ─────────────────────────────────────────────────────────────

export type MemberStatus = "active" | "pending" | "unsubscribed" | "blocked";
export type IdeaStatus = "new" | "reviewing" | "accepted" | "archived";
export type BroadcastStatus = "draft" | "sending" | "sent" | "failed";

export interface CommunityMember {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  region: string | null;
  school_stage: string | null;
  specialization: string | null;
  years_experience: number | null;
  workplace: string | null;
  interests: string[];
  contribution: string[];
  bio: string | null;
  consent: boolean;
  wants_updates: boolean;
  status: MemberStatus;
  source: string | null;
  token: string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunityIdea {
  id: string;
  member_id: string | null;
  name: string | null;
  email: string | null;
  title: string;
  body: string;
  topic: string | null;
  initiative_id: string | null;
  status: IdeaStatus;
  featured: boolean;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

/** Who a broadcast goes to. Empty arrays mean "no filter on this dimension". */
export interface BroadcastAudience {
  interests?: string[];
  regions?: string[];
  stages?: string[];
}

export interface CommunityBroadcast {
  id: string;
  subject: string;
  preheader: string | null;
  body: string[];
  cta_label: string | null;
  cta_url: string | null;
  audience: BroadcastAudience;
  status: BroadcastStatus;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  error: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}
