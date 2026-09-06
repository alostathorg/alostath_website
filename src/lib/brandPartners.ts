// «الإعلامات» — shared vocabulary and helpers for the brand-partner showcase.
// The public pages, the header/footer, and the admin collection all read from
// here so a rename or a new category is a one-file change.

import type { BrandPartner } from "@/lib/types";

/** The nav tab / section label. Kept as one constant so it can be renamed. */
export const PARTNERS_NAV_LABEL = "الإعلامات";

/** Public route of the showcase. */
export const PARTNERS_PATH = "/partners";

export const BRAND_CATEGORY_LABELS: Record<string, string> = {
  edtech: "منصّات وتطبيقات تعليمية",
  content: "محتوى ومصادر تعليمية",
  training: "تدريب وتطوير مهني",
  supplies: "أدوات وتجهيزات صفية",
  services: "خدمات ومزايا للمعلّم",
  wellbeing: "صحة وجودة حياة",
  other: "أخرى",
};
export const BRAND_CATEGORIES = Object.keys(BRAND_CATEGORY_LABELS);

export const BRAND_PRICING_LABELS: Record<string, string> = {
  paid: "مدفوع",
  freemium: "مجاني مع خطط مدفوعة",
  free: "مجاني",
};
export const BRAND_PRICINGS = Object.keys(BRAND_PRICING_LABELS);

export const categoryLabel = (key: string | null | undefined) =>
  BRAND_CATEGORY_LABELS[key ?? ""] ?? BRAND_CATEGORY_LABELS.other;
export const pricingLabel = (key: string | null | undefined) =>
  BRAND_PRICING_LABELS[key ?? ""] ?? BRAND_PRICING_LABELS.paid;

/** Default label of the outbound button when the editor leaves it blank. */
export const DEFAULT_CTA_LABEL = "انتقل إلى موقع الشريك";

/** Shown under the card grid and in the outbound band of every partner page. */
export const PARTNERS_DISCLAIMER = `${PARTNERS_NAV_LABEL} شراكات تعريفية تهدف إلى تعريف المعلّم بما يخدمه. تعاملك مع أي علامة يخضع لشروطها وسياساتها.`;

/**
 * The admin engine stores a blank text field as "" (only *_url / *_at columns
 * become null), so every optional string is normalised through here: trimmed,
 * and empty becomes null. It accepts `unknown` because jsonb cells (highlights)
 * are not type-checked at runtime — a number that slipped through an import
 * must render as text, not crash the prerender.
 */
export const text = (v: unknown): string | null => {
  const s = typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
  return s ? s : null;
};

/**
 * Makes an editor-typed URL safe to render as an outbound href: trims, adds
 * https:// when no scheme was typed, and accepts only http(s). Anything else
 * (javascript:, data:, garbage) becomes null so the page falls back gracefully.
 */
export function normalizeExternalUrl(raw: string | null | undefined): string | null {
  const s = (raw ?? "").trim();
  if (!s) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** «example.com» for display next to an outbound link; null when unparsable. */
export function hostnameOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** The single source of truth for the outbound CTA: where it goes and what it says. */
export function ctaFor(p: Pick<BrandPartner, "cta_url" | "website_url" | "cta_label">) {
  const href = normalizeExternalUrl(p.cta_url) ?? normalizeExternalUrl(p.website_url);
  return {
    href,
    label: text(p.cta_label) ?? DEFAULT_CTA_LABEL,
    hostname: hostnameOf(normalizeExternalUrl(p.website_url) ?? href),
  };
}

/** Card / hero blurb with fallbacks so a card is never blank. */
export function blurbFor(p: Pick<BrandPartner, "tagline" | "overview">, max = 120): string {
  const t = text(p.tagline);
  if (t) return t;
  const o = text(p.overview);
  if (o) return o.length > max ? `${o.slice(0, max).trimEnd()}…` : o;
  return "حلول تعليمية للمعلّم";
}

/** First letter of the name, for the monogram shown when there is no logo. */
export const monogramOf = (name: string) => (name.trim()[0] ?? "؟");
