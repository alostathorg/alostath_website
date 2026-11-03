import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate, latinDigitsDeep } from "@/lib/format";
import {
  REG_TYPE_LABEL,
  REVIEW_STATUS_CLASS,
  REVIEW_STATUS_LABEL,
  reviewStatusOf,
  type ReviewStatus,
} from "@/lib/registrations";
import RegDeleteButton from "./RegDeleteButton";
import { Icon } from "../icons";

export const dynamic = "force-dynamic";

type Reg = Record<string, string | null>;

// "" is the inbox: everything that isn't archived. Archived rows only show
// under their own tab, so handled-and-filed requests stay out of the way.
const STATUS_TABS: { key: "" | ReviewStatus; label: string }[] = [
  { key: "", label: "الكل" },
  { key: "new", label: REVIEW_STATUS_LABEL.new },
  { key: "in_progress", label: REVIEW_STATUS_LABEL.in_progress },
  { key: "done", label: REVIEW_STATUS_LABEL.done },
  { key: "archived", label: "الأرشيف" },
];

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; status?: string }>;
}) {
  const { q: rawQ = "", type: rawType = "", status: rawStatus = "" } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  const all = (latinDigitsDeep(data) ?? []) as Reg[];

  // Filter in memory: the list is capped at 500, and this keeps the counts on
  // every tab exact for the current search.
  const q = rawQ.trim().toLowerCase();
  const searched = q
    ? all.filter((r) =>
        ["name", "email", "phone", "program_name", "message", "category", "admin_note"].some((k) =>
          (r[k] ?? "").toLowerCase().includes(q),
        ),
      )
    : all;

  const status = STATUS_TABS.some((t) => t.key === rawStatus) ? (rawStatus as "" | ReviewStatus) : "";
  const inStatus = (r: Reg, s: "" | ReviewStatus) =>
    s ? reviewStatusOf(r) === s : reviewStatusOf(r) !== "archived";
  const statusCount = (s: "" | ReviewStatus) => searched.filter((r) => inStatus(r, s)).length;
  const byStatus = searched.filter((r) => inStatus(r, status));

  const presentTypes = Object.keys(REG_TYPE_LABEL).filter((t) => all.some((r) => r.program_type === t));
  const type = presentTypes.includes(rawType) ? rawType : "";
  const rows = type ? byStatus.filter((r) => r.program_type === type) : byStatus;

  const newCount = all.filter((r) => reviewStatusOf(r) === "new").length;

  const query = (next: { type?: string; status?: string }) => {
    const p = new URLSearchParams();
    if (rawQ.trim()) p.set("q", rawQ.trim());
    const s = next.status ?? status;
    if (s) p.set("status", s);
    const t = next.type ?? type;
    if (t) p.set("type", t);
    return p.toString();
  };
  const href = (next: { type?: string; status?: string }) => {
    const s = query(next);
    return `/admin/registrations${s ? `?${s}` : ""}`;
  };
  const exportQs = query({});

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">الطلبات والاشتراكات</h1>
          <p className="admin-subtitle">
            كل ما يصل من نماذج التسجيل والتواصل والنشرة البريدية — {all.length} إدخال
            {newCount > 0 && <>، منها <strong className="admin-strong-gold">{newCount} جديد</strong> لم يُتابَع بعد</>}.
          </p>
        </div>
        {all.length > 0 && (
          <a
            href={`/api/admin/registrations/export${exportQs ? `?${exportQs}` : ""}`}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            download
          >
            {Icon.download}
            تصدير CSV
          </a>
        )}
      </div>

      {all.length > 0 && (
        <>
          <div className="admin-filterbar">
            <form method="get" className="admin-search" role="search">
              {status && <input type="hidden" name="status" value={status} />}
              {type && <input type="hidden" name="type" value={type} />}
              <span className="admin-search-ico">{Icon.search}</span>
              <input
                className="admin-input"
                type="search"
                name="q"
                defaultValue={rawQ}
                placeholder="ابحث بالاسم أو البريد أو الجوال أو نص الرسالة…"
                aria-label="بحث في الطلبات"
              />
            </form>
            <nav className="admin-tabs" aria-label="تصفية حسب الحالة">
              {STATUS_TABS.map((t) => (
                <Link
                  key={t.key || "all"}
                  href={href({ status: t.key })}
                  className={`admin-tab${status === t.key ? " is-active" : ""}`}
                  aria-current={status === t.key ? "page" : undefined}
                >
                  {t.label}
                  <span className="admin-tab-n">{statusCount(t.key)}</span>
                </Link>
              ))}
            </nav>
          </div>

          {presentTypes.length > 1 && (
            <nav className="admin-chipfilter" aria-label="تصفية حسب النوع">
              <span className="admin-chipfilter-label">النوع:</span>
              <Link href={href({ type: "" })} className={`admin-chip${!type ? " is-active" : ""}`}>
                الكل
              </Link>
              {presentTypes.map((t) => (
                <Link key={t} href={href({ type: t })} className={`admin-chip${type === t ? " is-active" : ""}`}>
                  {REG_TYPE_LABEL[t]}
                  <span className="admin-chip-n">{byStatus.filter((r) => r.program_type === t).length}</span>
                </Link>
              ))}
            </nav>
          )}
        </>
      )}

      {all.length === 0 ? (
        <div className="admin-emptystate">
          <span className="admin-emptystate-ico">{Icon.inbox}</span>
          <h2>لا توجد طلبات بعد</h2>
          <p>ستظهر هنا نماذج التسجيل في الجوائز والمبادرات، ورسائل التواصل، واشتراكات النشرة البريدية فور وصولها.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="admin-emptystate is-compact">
          <span className="admin-emptystate-ico">{Icon.search}</span>
          <p>
            لا نتائج مطابقة.{" "}
            <Link href="/admin/registrations" className="admin-link">مسح البحث والتصفية</Link>
          </p>
        </div>
      ) : (
        <ul className="admin-inbox" aria-label="الطلبات">
          {rows.map((r) => {
            const st = reviewStatusOf(r);
            const who = r.name || r.email || "—";
            return (
              <li key={r.id as string} className={`admin-inbox-row${st === "new" ? " is-new" : ""}`}>
                <Link href={`/admin/registrations/${r.id}`} className="admin-inbox-link">
                  <span className="admin-avatar" aria-hidden="true">{(who.trim()[0] || "؟").toUpperCase()}</span>
                  <span className="admin-inbox-body">
                    <span className="admin-inbox-top">
                      <span className="admin-inbox-name">
                        {st === "new" && <span className="admin-inbox-dot" aria-label="جديد" />}
                        {who}
                      </span>
                      <span className="admin-inbox-date">
                        {r.created_at ? formatArabicDate(r.created_at.slice(0, 10)) : ""}
                      </span>
                    </span>
                    <span className="admin-inbox-meta">
                      <span className="admin-badge is-type">
                        {REG_TYPE_LABEL[r.program_type ?? ""] ?? r.program_type ?? "—"}
                      </span>
                      {r.program_name && <span className="admin-inbox-program">{r.program_name}</span>}
                      {st !== "new" && (
                        <span className={`admin-badge ${REVIEW_STATUS_CLASS[st]}`}>
                          <span className="dot" />
                          {REVIEW_STATUS_LABEL[st]}
                        </span>
                      )}
                    </span>
                    {r.message ? (
                      <span className="admin-inbox-preview">{r.message}</span>
                    ) : (
                      <span className="admin-inbox-contact">
                        {[r.name ? r.email : null, r.phone].filter(Boolean).join(" · ") || "بدون رسالة"}
                      </span>
                    )}
                  </span>
                  <span className="admin-inbox-chev" aria-hidden="true">{Icon.chevron}</span>
                </Link>
                <span className="admin-inbox-actions">
                  <RegDeleteButton id={r.id as string} name={r.name ?? undefined} />
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
