import type { Metadata } from "next";
import "./admin.css";
import { getUser, isAdmin } from "@/lib/supabase/auth";
import { signOut } from "./actions";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  // Unauthenticated requests only reach here for /admin/login (middleware
  // redirects the rest) — render the login page bare.
  if (!user) return <div className="admin" dir="rtl">{children}</div>;

  if (!(await isAdmin())) {
    return (
      <div className="admin" dir="rtl">
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div className="admin-card" style={{ maxWidth: 460 }}>
            <h1 className="admin-title" style={{ marginBottom: 10 }}>لا تملك صلاحية الوصول</h1>
            <p style={{ color: "var(--text-muted)", margin: "0 0 20px" }}>
              هذا الحساب ليس ضمن مديري الموقع. تواصل مع مسؤول النظام لإضافتك إلى جدول <code>admins</code>.
            </p>
            <form action={signOut}>
              <button className="admin-btn admin-btn-ghost" type="submit">تسجيل الخروج</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin" dir="rtl">
      <div className="admin-shell">
        <AdminNav email={user.email ?? ""} />
        <main className="admin-main">
          <div className="admin-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
