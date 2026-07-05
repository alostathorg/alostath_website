"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLLECTIONS } from "./config";
import { signOut } from "./actions";

const linkBase: React.CSSProperties = {
  display: "block",
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 15,
  color: "var(--text-body)",
  textDecoration: "none",
};

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const item = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link href={href} style={{ ...linkBase, background: active ? "var(--olive-50)" : "transparent", color: active ? "var(--olive-700)" : "var(--text-body)", fontWeight: active ? 600 : 400 }}>
        {label}
      </Link>
    );
  };

  return (
    <aside style={{ width: 240, flex: "none", borderInlineStart: "1px solid var(--hairline)", background: "var(--canvas)", padding: 20, display: "flex", flexDirection: "column", gap: 4, minHeight: "100vh", position: "sticky", top: 0 }}>
      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, textDecoration: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo.png" alt="" style={{ height: 34 }} />
      </Link>
      {item("/admin", "لوحة التحكم")}
      {item("/admin/registrations", "الطلبات والاشتراكات")}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-subtle)", padding: "14px 14px 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>المحتوى</div>
      {COLLECTIONS.map((c) => (
        <span key={c.slug}>{item(`/admin/collections/${c.slug}`, c.labelPlural)}</span>
      ))}
      {item("/admin/settings", "إعدادات الموقع")}
      {item("/admin/media", "الوسائط")}
      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, direction: "ltr", textAlign: "start", wordBreak: "break-all" }}>{email}</div>
        <form action={signOut}>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>تسجيل الخروج</button>
        </form>
      </div>
    </aside>
  );
}
