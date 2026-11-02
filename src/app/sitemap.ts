import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/queries";
import { TOGGLEABLE_PAGES, isPageOn } from "@/lib/pages";

// Static routes only. The [slug] children are deliberately not enumerated:
// src/lib/queries.ts returns [] when the Supabase env vars are absent, so a
// build without secrets would silently ship a truncated sitemap rather than
// fail — worse than listing the section pages and letting the crawler follow.
const ROUTES = [
  "/",
  "/community",
  "/council",
  "/awards",
  "/initiatives",
  "/partners",
  "/about",
  "/news",
  "/translations",
  "/blog",
  "/press",
  "/contact",
];

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ostath.sa";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Sections switched off in /admin/pages leave the sitemap with the nav.
  const settings = await getSettings();
  const off = new Set(TOGGLEABLE_PAGES.filter((p) => !isPageOn(settings, p.key)).map((p) => p.path));
  return ROUTES.filter((path) => !off.has(path)).map((path) => ({
    url: new URL(path, BASE).toString(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
