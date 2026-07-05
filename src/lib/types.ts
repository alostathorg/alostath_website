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
  consent: boolean;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
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
