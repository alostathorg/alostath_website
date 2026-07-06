import { createClient } from "@/lib/supabase/server";
import { saveSettings } from "../actions";

export const dynamic = "force-dynamic";

const SECTIONS = [
  { key: "contact", label: "معلومات التواصل", help: "العنوان والهاتف والبريد وروابط التواصل الاجتماعي، وحقوق النشر في التذييل." },
  { key: "council", label: "المجلس", help: "next_session: موعد الجلسة القادمة (ISO)، وhero_image: صورة الخلفية." },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const map = new Map((data ?? []).map((r: { key: string; value: unknown }) => [r.key, r.value]));

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>إعدادات الموقع</h1>
      <p style={{ color: "var(--text-muted)", margin: "0 0 28px" }}>قيمٌ عامة تظهر عبر الموقع، تُحرَّر بصيغة JSON.</p>

      {SECTIONS.map((s) => (
        <form key={s.key} action={saveSettings.bind(null, s.key)} style={{ marginBottom: 32, maxWidth: 720, background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{s.label}</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 14px" }}>{s.help}</p>
          <textarea
            name="value"
            defaultValue={JSON.stringify(map.get(s.key) ?? {}, null, 2)}
            rows={10}
            className="ct-field"
            style={{ fontFamily: "var(--font-mono)", direction: "ltr", textAlign: "left", resize: "vertical" }}
          />
          <div style={{ marginTop: 14 }}>
            <button type="submit" className="btn btn-primary btn-md">حفظ</button>
          </div>
        </form>
      ))}
    </div>
  );
}
