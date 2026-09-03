import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate } from "@/lib/format";
import { MEMBER_STATUS_LABEL, safeSearchTerm } from "@/lib/community";
import type { CommunityMember, MemberStatus } from "@/lib/types";
import MemberStatusSelect from "./MemberStatusSelect";
import MemberDeleteButton from "./MemberDeleteButton";

export const dynamic = "force-dynamic";

const STATUS_CLASS: Record<string, string> = {
  active: "is-pub",
  pending: "is-soon",
  unsubscribed: "is-draft",
  blocked: "is-closed",
};

const TABS: { key: string; label: string }[] = [
  { key: "", label: "الكل" },
  { key: "active", label: MEMBER_STATUS_LABEL.active },
  { key: "pending", label: MEMBER_STATUS_LABEL.pending },
  { key: "unsubscribed", label: MEMBER_STATUS_LABEL.unsubscribed },
  { key: "blocked", label: MEMBER_STATUS_LABEL.blocked },
];

export default async function CommunityMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status: rawStatus = "" } = await searchParams;
  const status = TABS.some((t) => t.key === rawStatus) ? rawStatus : "";
  const supabase = await createClient();

  let query = supabase
    .from("community_members")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(500);

  if (status) query = query.eq("status", status);
  const term = safeSearchTerm(q);
  if (term) {
    const like = `%${term}%`;
    query = query.or(
      `full_name.ilike.${like},email.ilike.${like},specialization.ilike.${like},workplace.ilike.${like},city.ilike.${like}`,
    );
  }

  const { data, count } = await query;
  const rows = (data ?? []) as CommunityMember[];

  const exportHref = `/api/admin/community/export?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}) })}`;
  const tabHref = (key: string) =>
    `/admin/community?${new URLSearchParams({ ...(q ? { q } : {}), ...(key ? { status: key } : {}) })}`;

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">أعضاء المجتمع</h1>
          <p className="admin-subtitle">
            المعلّمون والمعلّمات المنضمّون إلى «مجتمع الأستاذ» — {count ?? rows.length} عضو
            {status ? ` ضمن «${MEMBER_STATUS_LABEL[status] ?? status}»` : ""}.
          </p>
        </div>
        <a href={exportHref} className="admin-btn admin-btn-primary">تصدير CSV</a>
      </div>

      <div className="admin-filterbar">
        <form method="get" className="admin-search">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            className="admin-input"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="ابحث بالاسم أو البريد أو التخصص…"
            aria-label="بحث في الأعضاء"
          />
          <button type="submit" className="admin-btn admin-btn-ghost admin-btn-sm">بحث</button>
        </form>
        <div className="admin-tabs">
          {TABS.map((t) => (
            <Link
              key={t.key || "all"}
              href={tabHref(t.key)}
              className={`admin-tab${status === t.key ? " is-active" : ""}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-tablewrap">
        <table className="admin-table" aria-label="أعضاء المجتمع">
          <thead>
            <tr>
              {["الاسم", "البريد", "المنطقة", "المرحلة", "الاهتمامات", "الحالة", "التاريخ"].map((h) => (
                <th key={h}>{h}</th>
              ))}
              <th style={{ textAlign: "end" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td className="col-name">
                  <Link href={`/admin/community/${m.id}`} className="admin-edit">{m.full_name}</Link>
                </td>
                <td className="admin-cell-ltr">{m.email}</td>
                <td>{m.region || "—"}</td>
                <td>{m.school_stage || "—"}</td>
                <td>
                  {m.interests?.length ? (
                    <span className="admin-chiprow">
                      {m.interests.slice(0, 2).map((i) => (
                        <span key={i} className="admin-badge is-type">{i}</span>
                      ))}
                      {m.interests.length > 2 && (
                        <span className="admin-chip-more">+{m.interests.length - 2}</span>
                      )}
                    </span>
                  ) : (
                    <span style={{ color: "var(--ink-subtle)" }}>—</span>
                  )}
                </td>
                <td>
                  <span className={`admin-badge ${STATUS_CLASS[m.status] ?? "is-type"}`}>
                    <span className="dot" />{MEMBER_STATUS_LABEL[m.status]}
                  </span>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{formatArabicDate(m.created_at.slice(0, 10))}</td>
                <td style={{ textAlign: "end" }}>
                  <span className="admin-rowactions">
                    <MemberStatusSelect id={m.id} status={m.status as MemberStatus} />
                    <MemberDeleteButton id={m.id} name={m.full_name} />
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="admin-empty">
                  {q || status ? "لا نتائج مطابقة لهذا البحث." : "لا يوجد أعضاء بعد — شارك رابط صفحة المجتمع لتبدأ العضويات."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rows.length >= 500 && (
        <p className="admin-hint" style={{ marginTop: 14 }}>
          يعرض هذا الجدول أحدث 500 عضو. استخدم البحث أو التصفية للوصول إلى البقية، أو صدّر الملف كاملاً.
        </p>
      )}
    </div>
  );
}
