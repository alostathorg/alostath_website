import { createClient } from "@/lib/supabase/server";
import { formatArabicDate } from "@/lib/format";
import RegDeleteButton from "./RegDeleteButton";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  award: "جائزة",
  initiative: "مبادرة",
  council: "المجلس",
  newsletter: "نشرة بريدية",
  contact: "رسالة تواصل",
};

export default async function RegistrationsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">الطلبات والاشتراكات</h1>
          <p className="admin-subtitle">كل ما يصل من نماذج التسجيل والتواصل والنشرة البريدية — {(rows?.length ?? 0)} إدخال.</p>
        </div>
      </div>

      <div className="admin-tablewrap">
        <table className="admin-table">
          <thead>
            <tr>
              {["البرنامج", "النوع", "الاسم", "البريد", "الجوال", "الرسالة", "التاريخ", "إجراءات"].map((h) => (
                <th key={h} style={h === "إجراءات" ? { textAlign: "end" } : undefined}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r: Record<string, unknown>) => (
              <tr key={r.id as string}>
                <td className="col-name">{(r.program_name as string) || "—"}</td>
                <td><span className="admin-badge is-type">{TYPE_LABEL[r.program_type as string] ?? (r.program_type as string) ?? "—"}</span></td>
                <td>{(r.name as string) || "—"}</td>
                <td className="admin-cell-ltr">{(r.email as string) || "—"}</td>
                <td className="admin-cell-ltr">{(r.phone as string) || "—"}</td>
                <td className="admin-cell-message">
                  {(r.message as string) ? (
                    <span title={r.message as string}>{r.message as string}</span>
                  ) : (
                    <span style={{ color: "var(--ink-subtle)" }}>—</span>
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{formatArabicDate((r.created_at as string).slice(0, 10))}</td>
                <td style={{ textAlign: "end" }}><RegDeleteButton id={r.id as string} /></td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={8} className="admin-empty">لا توجد طلبات بعد.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
