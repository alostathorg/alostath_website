import type { MetadataRoute } from "next";

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
  "/blog",
  "/press",
  "/contact",
];

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ostath.sa";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: new URL(path, BASE).toString(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
