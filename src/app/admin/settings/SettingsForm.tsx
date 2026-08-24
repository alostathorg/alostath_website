"use client";

import { useState } from "react";
import { uploadMedia } from "../actions";

type FieldDef = { name: string; label: string; type: "text" | "textarea" | "tel" | "email" | "url" | "datetime" | "image"; hint?: string };

const SCHEMAS: Record<string, { title: string; hint: string; fields: FieldDef[] }> = {
  contact: {
    title: "معلومات التواصل",
    hint: "تظهر في تذييل الموقع وصفحة تواصل معنا.",
    fields: [
      { name: "address", label: "العنوان", type: "text" },
      { name: "phone", label: "رقم الهاتف", type: "tel" },
      { name: "email", label: "البريد الإلكتروني", type: "email" },
      { name: "instagram", label: "رابط إنستغرام", type: "url" },
      { name: "linkedin", label: "رابط لينكدإن", type: "url" },
      { name: "x", label: "رابط منصة X (تويتر)", type: "url" },
      { name: "copyright", label: "نص حقوق النشر (أسفل الصفحة)", type: "text" },
    ],
  },
  council: {
    title: "المجلس",
    hint: "يُستخدم في العدّاد التنازلي للجلسة القادمة على الصفحة الرئيسية وصفحة المجلس.",
    fields: [
      { name: "next_session", label: "موعد الجلسة القادمة", type: "datetime", hint: "اختر التاريخ والوقت (بتوقيت السعودية)." },
      { name: "hero_image", label: "صورة الخلفية", type: "image" },
    ],
  },
  community: {
    title: "مجتمع الأستاذ",
    hint: "تظهر في صدر صفحة المجتمع. اتركها فارغة لاستخدام النص الافتراضي.",
    fields: [
      { name: "intro", label: "نص التعريف", type: "textarea", hint: "الفقرة التي تظهر أسفل عنوان «مجتمع الأستاذ»." },
      { name: "hero_image", label: "صورة الخلفية", type: "image" },
    ],
  },
};

// "2026-08-05T19:00:00+03:00" → "2026-08-05T19:00" for <input type=datetime-local>
const toLocalInput = (iso: string) => (iso ? iso.slice(0, 16) : "");
// input value back to a stored ISO with KSA offset
const toIso = (local: string) => (local ? `${local}:00+03:00` : "");

export default function SettingsForm({
  sectionKey,
  value,
  action,
}: {
  sectionKey: string;
  value: Record<string, unknown>;
  action: (formData: FormData) => void;
}) {
  const schema = SCHEMAS[sectionKey];
  const initial: Record<string, string> = {};
  for (const f of schema.fields) initial[f.name] = value?.[f.name] != null ? String(value[f.name]) : "";
  const [state, setState] = useState<Record<string, string>>(initial);

  const set = (name: string, v: string) => setState((s) => ({ ...s, [name]: v }));

  // Serialize to the { key: value } object the saveSettings action expects,
  // converting the datetime field back to a full ISO string.
  const out: Record<string, string> = {};
  for (const f of schema.fields) {
    const v = state[f.name] ?? "";
    if (!v) continue;
    out[f.name] = f.type === "datetime" ? toIso(v) : v;
  }

  return (
    <form action={action} className="admin-card">
      <h2 className="admin-card-title">{schema.title}</h2>
      <p className="admin-card-hint">{schema.hint}</p>
      <input type="hidden" name="value" value={JSON.stringify(out)} readOnly />

      <div className="admin-form-grid">
        {schema.fields.map((f) => (
          <FieldControl key={f.name} field={f} value={state[f.name] ?? ""} onChange={(v) => set(f.name, v)} />
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <button type="submit" className="admin-btn admin-btn-primary">حفظ</button>
      </div>
    </form>
  );
}

function FieldControl({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  const ltr = field.type === "tel" || field.type === "email" || field.type === "url";

  if (field.type === "image") {
    return (
      <div className="admin-field is-wide">
        <label className="admin-label">{field.label}</label>
        <ImageControl value={value} onChange={onChange} />
        {field.hint && <p className="admin-hint">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="admin-field is-wide">
        <label className="admin-label">{field.label}</label>
        <textarea className="admin-textarea" rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
        {field.hint && <p className="admin-hint">{field.hint}</p>}
      </div>
    );
  }

  const wide = field.type === "datetime" || field.name === "address" || field.name === "copyright";

  return (
    <div className={`admin-field${wide ? " is-wide" : ""}`}>
      <label className="admin-label">{field.label}</label>
      <input
        className={`admin-input${ltr ? " is-ltr" : ""}`}
        type={field.type === "datetime" ? "datetime-local" : field.type === "email" ? "email" : field.type === "url" ? "url" : field.type === "tel" ? "tel" : "text"}
        value={field.type === "datetime" ? toLocalInput(value) : value}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.hint && <p className="admin-hint">{field.hint}</p>}
    </div>
  );
}

function ImageControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const showThumb = value && /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(value);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setBusy(false);
    if (res.error) setErr(res.error);
    else if (res.url) onChange(res.url);
  }

  return (
    <div className="admin-imagefield">
      {showThumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="admin-thumb" />
      )}
      <div className="admin-imagefield-body">
        <input className="admin-input is-ltr" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" style={{ marginBottom: 10 }} />
        <input className="admin-file" type="file" accept="image/*" onChange={onFile} />
        {busy && <span style={{ fontSize: 12, color: "var(--text-muted)", marginInlineStart: 8 }}>جارٍ الرفع…</span>}
        {err && <p className="admin-hint" style={{ color: "#b3261e" }}>{err}</p>}
      </div>
    </div>
  );
}
