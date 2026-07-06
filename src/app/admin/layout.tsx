import type { Metadata } from "next";
import { getUser, isAdmin } from "@/lib/supabase/auth";
import { signOut } from "./actions";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  // Unauthenticated requests only reach here for /admin/login (middleware
  // redirects the rest) — render the login page bare.
  if (!user) return <>{children}</>;

  if (!(await isAdmin())) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>لا تملك صلاحية الوصول</h1>
          <p style={{ color: "var(--text-muted)", margin: "0 0 20px", maxWidth: "44ch" }}>
            هذا الحساب ليس ضمن مديري الموقع. تواصل مع مسؤول النظام لإضافتك إلى جدول <code>admins</code>.
          </p>
          <form action={signOut}>
            <button className="btn btn-secondary btn-md" type="submit">تسجيل الخروج</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ display: "flex", flexDirection: "row-reverse", background: "var(--surface-1)", minHeight: "100vh" }}>
      <AdminNav email={user.email ?? ""} />
      <main style={{ flex: 1, padding: "32px clamp(20px,4vw,48px)", maxWidth: 1100 }}>{children}</main>
    </div>
  );
}
