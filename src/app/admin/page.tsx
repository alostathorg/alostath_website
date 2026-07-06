import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { COLLECTIONS } from "./config";

export const dynamic = "force-dynamic";

async function count(table: string) {
  const supabase = await createClient();
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [awards, initiatives, posts, registrations] = await Promise.all([
    count("awards"),
    count("initiatives"),
    count("blog_posts"),
    count("registrations"),
  ]);

  const tiles = [
    { label: "الجوائز", value: awards, href: "/admin/collections/awards" },
    { label: "المبادرات", value: initiatives, href: "/admin/collections/initiatives" },
    { label: "المقالات", value: posts, href: "/admin/collections/posts" },
    { label: "الطلبات والاشتراكات", value: registrations, href: "/admin/registrations" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>لوحة التحكم</h1>
      <p style={{ color: "var(--text-muted)", margin: "0 0 28px" }}>أهلاً بك — من هنا تُدير محتوى موقع مؤسسة الأستاذ.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, marginBottom: 36 }}>
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card-lift" style={{ textDecoration: "none", color: "inherit", background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: "var(--olive-700)", fontFamily: "var(--font-mono)" }}>{t.value}</div>
            <div style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 6 }}>{t.label}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>إدارة المحتوى</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} href={`/admin/collections/${c.slug}`} style={{ textDecoration: "none", color: "var(--text-body)", background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "16px 18px", fontWeight: 600 }}>
            {c.labelPlural} ←
          </Link>
        ))}
      </div>
    </div>
  );
}
