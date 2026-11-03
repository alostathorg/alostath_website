import type { Metadata } from "next";
import { Suspense } from "react";
import "./admin.css";
import { getUser, isAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import AdminNav, { type NavCounts } from "./AdminNav";
import Toaster from "./Toaster";

export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

/** Items waiting on an editor — shown as badges in the sidebar. */
async function navCounts(): Promise<NavCounts> {
  const supabase = await createClient();
  const pending = (table: string, status: string) =>
    supabase.from(table).select("*", { count: "exact", head: true }).eq("status", status);
  // review_status arrives with migration 0006; before that the query errors
  // and the badge simply stays at 0.
  const [ideas, drafts, regs] = await Promise.all([
    pending("community_ideas", "new"),
    pending("translations", "draft"),
    supabase.from("registrations").select("*", { count: "exact", head: true }).eq("review_status", "new"),
  ]);
  return {
    newIdeas: ideas.count ?? 0,
    draftTranslations: drafts.count ?? 0,
    newRegistrations: regs.error ? 0 : regs.count ?? 0,
  };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  // Unauthenticated requests only reach here for /admin/login (middleware
  // redirects the rest) — render the login page bare.
  if (!user) return <div className="admin" dir="rtl">{children}</div>;

  if (!(await isAdmin())) {
    return (
      <div className="admin" dir="rtl">
        <div className="admin-login">
          <div className="admin-login-card" style={{ textAlign: "center" }}>
            <h1 className="admin-title" style={{ marginBottom: 10 }}>لا تملك صلاحية الوصول</h1>
            <p style={{ color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.8 }}>
              هذا الحساب ليس ضمن مديري الموقع. تواصل مع مسؤول النظام لإضافتك إلى جدول <code>admins</code>.
            </p>
            <form action={signOut}>
              <button className="admin-btn admin-btn-ghost admin-btn-block" type="submit">تسجيل الخروج</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const counts = await navCounts();

  return (
    <div className="admin" dir="rtl">
      <a href="#admin-main" className="admin-skip">تخطَّ إلى المحتوى</a>
      <div className="admin-shell">
        <AdminNav email={user.email ?? ""} counts={counts} />
        <main className="admin-main" id="admin-main">
          <div className="admin-main-inner">{children}</div>
        </main>
      </div>
      <Suspense fallback={null}>
        <Toaster />
      </Suspense>
    </div>
  );
}
