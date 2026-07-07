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
      <div className="admin-head">
        <div>
          <h1 className="admin-title">إعدادات الموقع</h1>
          <p className="admin-subtitle">قيمٌ عامة تظهر عبر الموقع، تُحرَّر بصيغة JSON.</p>
        </div>
      </div>

      {SECTIONS.map((s) => (
        <form key={s.key} action={saveSettings.bind(null, s.key)} className="admin-card">
          <h2 className="admin-card-title">{s.label}</h2>
          <p className="admin-card-hint">{s.help}</p>
          <div className="admin-field">
            <textarea
              name="value"
              defaultValue={JSON.stringify(map.get(s.key) ?? {}, null, 2)}
              rows={10}
              className="admin-textarea is-code"
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="admin-btn admin-btn-primary">حفظ</button>
          </div>
        </form>
      ))}
    </div>
  );
}
