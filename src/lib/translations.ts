// «الترجمات» — shared vocabulary for the «مليون كلمة» translation section.
// The public pages, the home-page counter, the nav, the dashboard and the PDF
// templates all read from here, so renaming the section (its name is still to
// be chosen) or adding a category is a one-file change.

import type { Translation, TranslationStatus } from "@/lib/types";
import { normalizeExternalUrl, hostnameOf, text } from "@/lib/brandPartners";

/** The nav / section label. Provisional until the section's name is chosen. */
export const TRANSLATIONS_NAV_LABEL = "الترجمات";

/** The public section title shown in the hero and on the PDFs. */
export const TRANSLATIONS_TITLE = "مليون كلمة للأستاذ";

/** Public route of the section. */
export const TRANSLATIONS_PATH = "/translations";

/** The goal the counter measures against. */
export const WORDS_GOAL = 1_000_000;

/** One line under every translation, on the page and in the PDF. */
export const MACHINE_NOTE = "ترجمة آلية بمراجعة فريق مؤسسة الأستاذ";

/** The eight categories. Order is the order of the filter tabs. */
export const TRANSLATION_CATEGORIES = [
  "استراتيجيات التدريس",
  "إدارة الصف والسلوك",
  "التقويم والقياس",
  "التقنية والذكاء الاصطناعي في التعليم",
  "التطوير المهني للمعلّم",
  "علم النفس التربوي وعلوم التعلّم",
  "تجارب الأنظمة التعليمية في العالم",
  "جودة حياة المعلّم",
] as const;

export const MODE_LABELS: Record<string, string> = {
  full: "ترجمة كاملة",
  summary: "ملخّص مترجم",
};
export const modeLabel = (m: string | null | undefined) => MODE_LABELS[m ?? ""] ?? MODE_LABELS.summary;

export const STATUS_LABELS: Record<TranslationStatus, string> = {
  draft: "بانتظار المراجعة",
  revise: "إعادة صياغة",
  rejected: "مرفوضة",
  published: "منشورة",
};
export const STATUSES = Object.keys(STATUS_LABELS) as TranslationStatus[];

export const LANGUAGE_LABELS: Record<string, string> = {
  en: "الإنجليزية",
  fr: "الفرنسية",
  es: "الإسبانية",
  de: "الألمانية",
};
export const languageLabel = (code: string | null | undefined) =>
  LANGUAGE_LABELS[code ?? ""] ?? code ?? "الإنجليزية";

/** Counters and figures: Western digits with thousands separators (1,250,000). */
const NUM = new Intl.NumberFormat("en-US");
export const formatCount = (n: number | null | undefined) => NUM.format(Math.max(0, Math.round(n ?? 0)));

/** Share of the million, 0–100, one decimal place — never shows 0 once anything is published. */
export function goalPercent(words: number): number {
  if (words <= 0) return 0;
  const pct = (words / WORDS_GOAL) * 100;
  return Math.min(100, Math.max(0.1, Math.round(pct * 10) / 10));
}

/** Where the original lives, safe to render as an outbound href. */
export function sourceOf(t: Pick<Translation, "source_name" | "source_url">) {
  const href = normalizeExternalUrl(t.source_url);
  return { href, name: text(t.source_name) ?? hostnameOf(href) };
}

export function licenseOf(t: Pick<Translation, "license" | "license_url">) {
  return { name: text(t.license), href: normalizeExternalUrl(t.license_url) };
}

/** Paragraphs as stored (jsonb array of strings), defensively. */
export function paragraphs(value: unknown): string[] {
  return Array.isArray(value) ? value.map((p) => String(p ?? "").trim()).filter(Boolean) : [];
}
