import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and guards /admin.
 * Unauthenticated users hitting /admin (except the login page) are redirected
 * to /admin/login. Admin *authorization* (membership in `admins`) is enforced
 * again server-side by RLS and by the admin layout.
 *
 * Fails OPEN: if the Supabase env is missing/invalid or auth lookup throws, we
 * must never 500 the entire site (middleware runs on every route). We treat the
 * request as unauthenticated — public pages render, and /admin still redirects
 * to the login page — instead of crashing with MIDDLEWARE_INVOCATION_FAILED.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^["']|["']$/g, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^["']|["']$/g, "");

  let user: { id: string } | null = null;
  if (url && key) {
    try {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      });
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (err) {
      // Bad env or transient auth failure — degrade to anonymous, don't crash.
      console.error("middleware: supabase auth failed —", (err as Error).message);
      user = null;
    }
  }

  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  if (isAdminArea && !isLogin && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
