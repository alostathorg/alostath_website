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
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>الطلبات والاشتراكات</h1>
      <p style={{ color: "var(--text-muted)", margin: "0 0 24px" }}>كل ما يصل من نماذج التسجيل والتواصل والنشرة البريدية.</p>

      <div style={{ overflowX: "auto", background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--surface-1)" }}>
              {["البرنامج", "النوع", "الاسم", "البريد", "الجوال", "التاريخ", ""].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r: Record<string, unknown>) => (
              <tr key={r.id as string} style={{ borderTop: "1px solid var(--hairline)" }}>
                <td style={td}>{(r.program_name as string) || "—"}</td>
                <td style={td}>{TYPE_LABEL[r.program_type as string] ?? (r.program_type as string) ?? "—"}</td>
                <td style={td}>{(r.name as string) || "—"}</td>
                <td style={{ ...td, direction: "ltr", textAlign: "start" }}>{(r.email as string) || "—"}</td>
                <td style={{ ...td, direction: "ltr", textAlign: "start" }}>{(r.phone as string) || "—"}</td>
                <td style={td}>{formatArabicDate((r.created_at as string).slice(0, 10))}</td>
                <td style={{ ...td, textAlign: "end" }}><RegDeleteButton id={r.id as string} /></td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={7} style={{ ...td, textAlign: "center", color: "var(--text-muted)" }}>لا توجد طلبات بعد.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "12px 16px", fontWeight: 600, color: "var(--ink-subtle)", textAlign: "start", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 16px", color: "var(--text-body)", textAlign: "start" };
