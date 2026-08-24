import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { COLLECTIONS } from "./config";

export const dynamic = "force-dynamic";

async function count(table: string) {
  const supabase = await createClient();
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

async function countWhere(table: string, column: string, value: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(column, value);
  return count ?? 0;
}

const TrophyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
);
const FlagIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
);
const PenIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
);
const InboxIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
);
const UsersIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const BulbIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>
);
const Chevron = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);

export default async function AdminDashboard() {
  const [awards, initiatives, posts, registrations, members, newIdeas] = await Promise.all([
    count("awards"),
    count("initiatives"),
    count("blog_posts"),
    count("registrations"),
    count("community_members"),
    countWhere("community_ideas", "status", "new"),
  ]);

  const tiles = [
    { label: "الجوائز", value: awards, href: "/admin/collections/awards", icon: TrophyIcon },
    { label: "المبادرات", value: initiatives, href: "/admin/collections/initiatives", icon: FlagIcon },
    { label: "المقالات", value: posts, href: "/admin/collections/posts", icon: PenIcon },
    { label: "الطلبات والاشتراكات", value: registrations, href: "/admin/registrations", icon: InboxIcon },
    { label: "أعضاء المجتمع", value: members, href: "/admin/community", icon: UsersIcon },
    { label: "أفكار جديدة", value: newIdeas, href: "/admin/community/ideas?status=new", icon: BulbIcon },
  ];

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">لوحة التحكم</h1>
          <p className="admin-subtitle">أهلاً بك — من هنا تُدير محتوى موقع مؤسسة الأستاذ.</p>
        </div>
      </div>

      <div className="admin-stats">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="admin-stat">
            <div className="admin-stat-ico">{t.icon}</div>
            <div>
              <div className="admin-stat-num">{t.value}</div>
              <div className="admin-stat-label">{t.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="admin-card-title" style={{ marginBottom: 14 }}>إدارة المحتوى</h2>
      <div className="admin-quicklinks">
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} href={`/admin/collections/${c.slug}`} className="admin-quicklink">
            <span>{c.labelPlural}</span>
            {Chevron}
          </Link>
        ))}
      </div>

      <h2 className="admin-card-title" style={{ margin: "28px 0 14px" }}>مجتمع الأستاذ</h2>
      <div className="admin-quicklinks">
        {[
          { href: "/admin/community", label: "أعضاء المجتمع" },
          { href: "/admin/community/ideas", label: "أفكار المجتمع" },
          { href: "/admin/community/broadcasts", label: "رسائل المجتمع" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="admin-quicklink">
            <span>{l.label}</span>
            {Chevron}
          </Link>
        ))}
      </div>
    </div>
  );
}
