import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate, latinDigitsDeep } from "@/lib/format";
import { TRANSLATIONS_NAV_LABEL } from "@/lib/translations";
import { COLLECTIONS } from "./config";
import { Icon, type IconName } from "./icons";

export const dynamic = "force-dynamic";

const COLLECTION_ICON: Record<string, IconName> = {
  awards: "awards",
  initiatives: "initiatives",
  posts: "posts",
  news: "news",
  brands: "brands",
  partners: "partners",
  press: "press",
};

const REG_TYPE_LABEL: Record<string, string> = {
  award: "جائزة",
  initiative: "مبادرة",
  council: "المجلس",
  newsletter: "نشرة بريدية",
  contact: "رسالة تواصل",
};

type Supabase = Awaited<ReturnType<typeof createClient>>;
type Filter = { eq?: [string, string | boolean]; gte?: [string, string] };

async function countRows(supabase: Supabase, table: string, filter: Filter = {}) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter.eq) q = q.eq(...filter.eq);
  if (filter.gte) q = q.gte(...filter.gte);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();

  const hasPublished = (slug: string) =>
    COLLECTIONS.find((c) => c.slug === slug)?.fields.some((f) => f.name === "published") ?? false;

  const [content, members, newIdeas, draftTranslations, weekRegs, recent] = await Promise.all([
    Promise.all(
      COLLECTIONS.map(async (c) => ({
        collection: c,
        total: await countRows(supabase, c.table),
        drafts: hasPublished(c.slug) ? await countRows(supabase, c.table, { eq: ["published", false] }) : 0,
      })),
    ),
    countRows(supabase, "community_members"),
    countRows(supabase, "community_ideas", { eq: ["status", "new"] }),
    countRows(supabase, "translations", { eq: ["status", "draft"] }),
    countRows(supabase, "registrations", { gte: ["created_at", weekAgo] }),
    supabase
      .from("registrations")
      .select("id, program_name, program_type, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const latest = latinDigitsDeep((recent.data ?? []) as Record<string, string | null>[]);
  const totalDrafts = content.reduce((n, c) => n + c.drafts, 0);

  const attention = [
    {
      n: newIdeas,
      label: "أفكار جديدة من المجتمع",
      cta: "راجع الأفكار",
      href: "/admin/community/ideas?status=new",
      icon: "ideas" as IconName,
      tone: "gold",
    },
    {
      n: draftTranslations,
      label: `${TRANSLATIONS_NAV_LABEL} بانتظار المراجعة`,
      cta: "راجع الترجمات",
      href: "/admin/translations?status=draft",
      icon: "translations" as IconName,
      tone: "gold",
    },
    {
      n: weekRegs,
      label: "طلبات ورسائل هذا الأسبوع",
      cta: "افتح الطلبات",
      href: "/admin/registrations",
      icon: "inbox" as IconName,
      tone: "olive",
    },
    {
      n: totalDrafts,
      label: "مسودات غير منشورة",
      cta: "اعرض المسودات",
      href: firstWithDrafts(content),
      icon: "posts" as IconName,
      tone: "muted",
    },
  ];

  const quick = [
    { href: "/admin/collections/news/new", label: "خبر جديد", icon: "news" as IconName },
    { href: "/admin/collections/posts/new", label: "مقال جديد", icon: "posts" as IconName },
    { href: "/admin/collections/awards/new", label: "جائزة جديدة", icon: "awards" as IconName },
    { href: "/admin/community/broadcasts", label: "رسالة للمجتمع", icon: "broadcasts" as IconName },
  ];

  const today = formatArabicDate(new Date().toISOString().slice(0, 10));

  return (
    <div className="admin-dash">
      <div className="admin-head">
        <div>
          <p className="admin-eyebrow">{today}</p>
          <h1 className="admin-title">أهلاً بك في لوحة التحكم</h1>
          <p className="admin-subtitle">ما يحتاج انتباهك اليوم، واختصارات لأكثر المهام تكراراً.</p>
        </div>
        <a href="/" target="_blank" rel="noopener" className="admin-btn admin-btn-ghost">
          {Icon.external}
          عرض الموقع
        </a>
      </div>

      {/* 1 — What needs action */}
      <section aria-labelledby="dash-attn" className="admin-dash-section">
        <h2 id="dash-attn" className="admin-section-head">بانتظار إجراء منك</h2>
        <div className="admin-attn">
          {attention.map((a) => (
            <Link key={a.label} href={a.href} className={`admin-attn-card is-${a.n ? a.tone : "zero"}`}>
              <span className="admin-attn-ico">{Icon[a.icon]}</span>
              <span className="admin-attn-num">{a.n}</span>
              <span className="admin-attn-label">{a.label}</span>
              <span className="admin-attn-cta">
                {a.n ? a.cta : "لا شيء جديد"}
                {a.n ? Icon.chevron : null}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2 — Quick actions */}
      <section aria-labelledby="dash-quick" className="admin-dash-section">
        <h2 id="dash-quick" className="admin-section-head">إجراءات سريعة</h2>
        <div className="admin-quick">
          {quick.map((q) => (
            <Link key={q.href} href={q.href} className="admin-quick-btn">
              <span className="admin-quick-ico">{Icon[q.icon]}</span>
              <span>{q.label}</span>
              <span className="admin-quick-plus">{Icon.plus}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 — Content overview + latest submissions */}
      <div className="admin-dash-cols">
        <section aria-labelledby="dash-content" className="admin-panel">
          <div className="admin-panel-head">
            <h2 id="dash-content" className="admin-panel-title">المحتوى</h2>
          </div>
          <ul className="admin-overview">
            {content.map(({ collection: c, total, drafts }) => (
              <li key={c.slug}>
                <Link href={`/admin/collections/${c.slug}`} className="admin-overview-row">
                  <span className="admin-overview-ico">{Icon[COLLECTION_ICON[c.slug] ?? "posts"]}</span>
                  <span className="admin-overview-name">{c.labelPlural}</span>
                  {drafts > 0 && <span className="admin-badge is-draft">{drafts} مسودة</span>}
                  <span className="admin-overview-num">{total}</span>
                  <span className="admin-overview-chev">{Icon.chevron}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin/community" className="admin-overview-row">
                <span className="admin-overview-ico">{Icon.members}</span>
                <span className="admin-overview-name">أعضاء المجتمع</span>
                <span className="admin-overview-num">{members}</span>
                <span className="admin-overview-chev">{Icon.chevron}</span>
              </Link>
            </li>
          </ul>
        </section>

        <section aria-labelledby="dash-latest" className="admin-panel">
          <div className="admin-panel-head">
            <h2 id="dash-latest" className="admin-panel-title">أحدث الطلبات</h2>
            <Link href="/admin/registrations" className="admin-panel-link">عرض الكل</Link>
          </div>
          {latest.length === 0 ? (
            <div className="admin-emptystate is-compact">
              <span className="admin-emptystate-ico">{Icon.inbox}</span>
              <p>لم يصل أي طلب بعد. ستظهر هنا نماذج التسجيل والتواصل فور وصولها.</p>
            </div>
          ) : (
            <ul className="admin-feed">
              {latest.map((r) => (
                <li key={r.id ?? ""} className="admin-feed-row">
                  <span className="admin-avatar is-sm" aria-hidden="true">{(r.name || r.email || "؟").trim()[0]}</span>
                  <span className="admin-feed-body">
                    <span className="admin-feed-name">{r.name || r.email || "—"}</span>
                    <span className="admin-feed-meta">
                      {r.program_name || REG_TYPE_LABEL[r.program_type ?? ""] || "—"}
                    </span>
                  </span>
                  <span className="admin-feed-date">{r.created_at ? formatArabicDate(r.created_at.slice(0, 10)) : ""}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function firstWithDrafts(content: { collection: { slug: string }; drafts: number }[]) {
  const hit = content.find((c) => c.drafts > 0);
  return hit ? `/admin/collections/${hit.collection.slug}?status=draft` : "/admin/collections/posts";
}
