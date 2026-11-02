// Page and home-section visibility, switched on and off from the dashboard
// (/admin/pages). Stored in site_settings under two keys:
//
//   pages          { [pageKey]: boolean }   — a whole public section
//   home_sections  { [sectionKey]: boolean } — a block on the home page
//
// A key that is missing counts as ON, so a fresh database (or a page added
// later) shows everything until an editor turns something off.

import { notFound } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { PARTNERS_NAV_LABEL, PARTNERS_PATH } from "@/lib/brandPartners";
import { NEWS_NAV_LABEL, NEWS_PATH } from "@/lib/news";
import { TRANSLATIONS_NAV_LABEL, TRANSLATIONS_PATH } from "@/lib/translations";

export type PageDef = { key: string; label: string; path: string; hint?: string };

/** Every public section that can be switched off. Keys match PageShell's `active`. */
export const TOGGLEABLE_PAGES: PageDef[] = [
  { key: "community", label: "المجتمع", path: "/community" },
  { key: "council", label: "المجلس", path: "/council" },
  { key: "awards", label: "الجائزة", path: "/awards" },
  { key: "initiatives", label: "المبادرات", path: "/initiatives" },
  { key: "partners", label: PARTNERS_NAV_LABEL, path: PARTNERS_PATH },
  { key: "news", label: NEWS_NAV_LABEL, path: NEWS_PATH },
  { key: "about", label: "من نحن", path: "/about" },
  { key: "translations", label: TRANSLATIONS_NAV_LABEL, path: TRANSLATIONS_PATH },
  { key: "blog", label: "المدونة", path: "/blog" },
  { key: "press", label: "الملف الإعلامي", path: "/press" },
  { key: "contact", label: "تواصل معنا", path: "/contact", hint: "يُخفي أيضاً زر «تواصل معنا» في رأس الصفحة." },
];

/** Blocks on the home page. `page` ties a block to a section: it hides with it. */
export const HOME_SECTIONS: Array<{ key: string; label: string; page?: string }> = [
  { key: "about", label: "التعريف بالمؤسسة" },
  { key: "programs", label: "منظومة الأستاذ (البطاقات)" },
  { key: "awards", label: "الجائزة الوطنية", page: "awards" },
  { key: "initiatives", label: "أبرز المبادرات", page: "initiatives" },
  { key: "translations", label: "عدّاد «مليون كلمة»", page: "translations" },
  { key: "media", label: "الأخبار والمقالات" },
  { key: "join", label: "الانضمام والنشرة البريدية" },
];

export type VisibilityGroup = "pages" | "home_sections";

function flag(settings: SiteSettings | undefined, group: VisibilityGroup, key: string) {
  const map = settings?.[group] as Record<string, unknown> | undefined;
  return map?.[key] !== false;
}

/** «home» is never switched off — the site needs a front door. */
export function isPageOn(settings: SiteSettings | undefined, key: string | undefined) {
  if (!key || key === "home") return true;
  return flag(settings, "pages", key);
}

export function isHomeSectionOn(settings: SiteSettings | undefined, key: string) {
  const def = HOME_SECTIONS.find((s) => s.key === key);
  if (def?.page && !isPageOn(settings, def.page)) return false;
  return flag(settings, "home_sections", key);
}

/** Keys of the pages that are off — what the header, footer and sitemap leave out. */
export function hiddenPages(settings: SiteSettings | undefined): Set<string> {
  return new Set(TOGGLEABLE_PAGES.filter((p) => !isPageOn(settings, p.key)).map((p) => p.key));
}

/** For routes that do not render through PageShell (e.g. print views). */
export function requirePageOn(settings: SiteSettings | undefined, key: string) {
  if (!isPageOn(settings, key)) notFound();
}
