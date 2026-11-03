import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatArabicDate, latinDigitsDeep } from "@/lib/format";
import RegDeleteButton from "./RegDeleteButton";
import { Icon } from "../icons";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  award: "جائزة",
  initiative: "مبادرة",
  council: "المجلس",
  newsletter: "نشرة بريدية",
  contact: "رسالة تواصل",
};

type Reg = Record<string, string | null>;

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q: rawQ = "", type: rawType = "" } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  const all = (latinDigitsDeep(data) ?? []) as Reg[];

  // Filter in memory: the list is capped at 500, and this keeps the per-type
  // counts on the tabs exact.
  const q = rawQ.trim().toLowerCase();
  const searched = q
    ? all.filter((r) => ["name", "email", "phone", "program_name", "message"].some((k) => (r[k] ?? "").toLowerCase().includes(q)))
    : all;
  const presentTypes = Object.keys(TYPE_LABEL).filter((t) => all.some((r) => r.program_type === t));
  const type = presentTypes.includes(rawType) ? rawType : "";
  const rows = type ? searched.filter((r) => r.program_type === type) : searched;

  const href = (next: { type?: string }) => {
    const p = new URLSearchParams();
    if (rawQ.trim()) p.set("q", rawQ.trim());
    const t = next.type ?? type;
    if (t) p.set("type", t);
    const s = p.toString();
    return `/admin/registrations${s ? `?${s}` : ""}`;
  };

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">الطلبات والاشتراكات</h1>
          <p className="admin-subtitle">كل ما يصل من نماذج التسجيل والتواصل والنشرة البريدية — {all.length} إدخال.</p>
        </div>
      </div>

      {all.length > 0 && (
        <div className="admin-filterbar">
          <form method="get" className="admin-search" role="search">
            {type && <input type="hidden" name="type" value={type} />}
            <span className="admin-search-ico">{Icon.search}</span>
            <input
              className="admin-input"
              type="search"
              name="q"
              defaultValue={rawQ}
              placeholder="ابحث بالاسم أو البريد أو الجوال…"
              aria-label="بحث في الطلبات"
            />
          </form>
          {presentTypes.length > 1 && (
            <nav className="admin-tabs" aria-label="تصفية حسب النوع">
              <Link href={href({ type: "" })} className={`admin-tab${!type ? " is-active" : ""}`}>
                الكل<span className="admin-tab-n">{searched.length}</span>
              </Link>
              {presentTypes.map((t) => (
                <Link key={t} href={href({ type: t })} className={`admin-tab${type === t ? " is-active" : ""}`}>
                  {TYPE_LABEL[t]}
                  <span className="admin-tab-n">{searched.filter((r) => r.program_type === t).length}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      )}

      {all.length === 0 ? (
        <div className="admin-emptystate">
          <span className="admin-emptystate-ico">{Icon.inbox}</span>
          <h2>لا توجد طلبات بعد</h2>
          <p>ستظهر هنا نماذج التسجيل في الجوائز والمبادرات، ورسائل التواصل، واشتراكات النشرة البريدية فور وصولها.</p>
        </div>
      ) : (
        <div className="admin-tablewrap">
          <table className="admin-table is-stack" aria-label="الطلبات والاشتراكات">
            <thead>
              <tr>
                {["الاسم", "البرنامج", "النوع", "البريد", "الجوال", "الرسالة", "التاريخ"].map((h) => (
                  <th key={h} scope="col">{h}</th>
                ))}
                <th scope="col" className="admin-th-actions"><span className="sr-only">إجراءات</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id as string}>
                  <td className="col-name" data-label="الاسم">{r.name || <span className="admin-nil">—</span>}</td>
                  <td data-label="البرنامج">{r.program_name || <span className="admin-nil">—</span>}</td>
                  <td data-label="النوع">
                    <span className="admin-badge is-type">{TYPE_LABEL[r.program_type ?? ""] ?? r.program_type ?? "—"}</span>
                  </td>
                  <td className="admin-cell-ltr" data-label="البريد">
                    {r.email ? <a href={`mailto:${r.email}`} className="admin-link">{r.email}</a> : <span className="admin-nil">—</span>}
                  </td>
                  <td className="admin-cell-ltr" data-label="الجوال">
                    {r.phone ? <a href={`tel:${r.phone}`} className="admin-link">{r.phone}</a> : <span className="admin-nil">—</span>}
                  </td>
                  <td className="admin-cell-message" data-label="الرسالة">
                    {r.message ? <span title={r.message}>{r.message}</span> : <span className="admin-nil">—</span>}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }} data-label="التاريخ">
                    {r.created_at ? formatArabicDate(r.created_at.slice(0, 10)) : "—"}
                  </td>
                  <td className="admin-td-actions">
                    <span className="admin-rowactions">
                      <RegDeleteButton id={r.id as string} name={r.name ?? undefined} />
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={8} className="admin-empty">
                    لا نتائج مطابقة. <Link href="/admin/registrations" className="admin-link">مسح البحث والتصفية</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
