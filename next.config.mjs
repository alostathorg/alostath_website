/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Media uploads go through a Server Action (admin → الوسائط, and the cover
  // image on a translation). The default 1 MB cap rejected ordinary photos;
  // 4 MB stays under Vercel's 4.5 MB request limit. Covers are also resized
  // to WebP in the browser before upload, so they are usually far smaller.
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: {
    // Remote hero/editorial imagery (Framer CDN today; Supabase Storage once
    // uploads land). Extend this list when new image hosts are introduced.
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
