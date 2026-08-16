import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only run on the gated /admin area. Public pages read from Supabase via ISR
  // and never need a per-request auth refresh — running the auth lookup on
  // every public request risked a site-wide MIDDLEWARE_INVOCATION_TIMEOUT (504)
  // whenever Supabase Auth was slow or paused.
  matcher: ["/admin/:path*"],
};
