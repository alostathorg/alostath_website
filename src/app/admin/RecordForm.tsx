"use client";

import { useState, useTransition } from "react";
import { saveRecord, uploadMedia } from "./actions";
import type { Collection, Field } from "./config";

type Values = Record<string, unknown>;
type Row = Record<string, unknown>;

const WIDE_TYPES = new Set(["textarea", "lines", "json", "image", "tags", "repeater", "keyvalue"]);
const isWide = (f: Field) => WIDE_TYPES.has(f.type);
const isLtrField = (f: Field) => f.name === "slug" || f.name.endsWith("_at");

// Friendly "add" button labels per repeater / key-value field.
const ADD_NOUN: Record<string, string> = {
  steps: "خطوة",
  phases: "مرحلة",
  value_cards: "بطاقة",
  facts: "حقيقة",
  meta: "حقل",
};

export default function RecordForm({
  collection,
  id,
  initial,
}: {
  collection: Collection;
  id: string | null;
  initial: Values;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    start(async () => {
      try {
        await saveRecord(collection.slug, id, form);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ غير متوقع");
      }
    });
  }

  // Group fields into titled sections, preserving first-seen order.
  const groups: { name: string; fields: Field[] }[] = [];
  for (const f of collection.fields) {
    const name = f.group ?? "الحقول";
    let g = groups.find((x) => x.name === name);
    if (!g) { g = { name, fields: [] }; groups.push(g); }
    g.fields.push(f);
  }

  return (
    <form onSubmit={onSubmit}>
      {groups.map((g) => (
        <div className="admin-card" key={g.name}>
          <h2 className="admin-section-title" style={{ marginBottom: 18 }}>{g.name}</h2>
          <div className="admin-form-grid">
            {g.fields.map((f) => (
              <FieldRow key={f.name} field={f} value={initial[f.name]} />
            ))}
          </div>
        </div>
      ))}

      {error && <div className="admin-error" style={{ marginTop: 16 }}>{error}</div>}

      <div className="admin-actionbar">
        <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
          {pending ? "جارٍ الحفظ…" : "حفظ التغييرات"}
        </button>
        <a href={`/admin/collections/${collection.slug}`} className="admin-btn admin-btn-ghost">إلغاء</a>
      </div>
    </form>
  );
}

function toDisplay(field: Field, value: unknown): string {
  if (value === null || value === undefined) return "";
  switch (field.type) {
    case "tags":
      return Array.isArray(value) ? (value as string[]).join("، ") : "";
    case "lines":
      return Array.isArray(value) ? (value as string[]).join("\n") : "";
    case "json":
      return JSON.stringify(value, null, 2);
    default:
      return String(value);
  }
}

function FieldRow({ field, value }: { field: Field; value: unknown }) {
  if (field.type === "repeater") return <Repeater field={field} value={value} />;
  if (field.type === "keyvalue") return <KeyValue field={field} value={value} />;
  if (field.type === "tags") return <TagInput field={field} value={value} />;
  if (field.type === "image") return <ImageField field={field} initial={toDisplay(field, value)} />;

  if (field.type === "date") {
    return (
      <div className="admin-field">
        <label className="admin-label">{field.label}</label>
        <input className="admin-input" type="date" name={field.name} defaultValue={String(value ?? "").slice(0, 10)} />
        {field.help && <p className="admin-hint">{field.help}</p>}
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="admin-field">
        <label className="admin-toggle">
          <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} />
          <span className="track" />
          {field.label}
        </label>
        {field.help && <p className="admin-hint">{field.help}</p>}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="admin-field">
        <label className="admin-label">{field.label}</label>
        <select className="admin-select" name={field.name} defaultValue={String(value ?? field.options?.[0] ?? "")}>
          {field.options?.map((o) => <option key={o} value={o}>{field.optionLabels?.[o] ?? o}</option>)}
        </select>
        {field.help && <p className="admin-hint">{field.help}</p>}
      </div>
    );
  }

  const display = toDisplay(field, value);
  const isArea = field.type === "textarea" || field.type === "lines" || field.type === "json";
  const areaClass = field.type === "json" ? "admin-textarea is-code" : "admin-textarea";
  const inputClass = isLtrField(field) ? "admin-input is-ltr" : "admin-input";

  return (
    <div className={`admin-field${isWide(field) ? " is-wide" : ""}`}>
      <label className="admin-label">{field.label}</label>
      {isArea ? (
        <textarea className={areaClass} name={field.name} defaultValue={display} rows={field.type === "json" ? 9 : 4} placeholder={field.placeholder} />
      ) : (
        <input className={inputClass} name={field.name} type={field.type === "number" ? "number" : "text"} defaultValue={display} placeholder={field.placeholder} />
      )}
      {field.help && <p className="admin-hint">{field.help}</p>}
    </div>
  );
}

/* ── Repeater: array of objects as add/remove rows ─────────────────────────── */
function Repeater({ field, value }: { field: Field; value: unknown }) {
  const initialRows: Row[] = Array.isArray(value) ? (value as Row[]).map((r) => ({ ...r })) : [];
  const [rows, setRows] = useState<Row[]>(initialRows);
  const items = field.itemFields ?? [];
  const noun = ADD_NOUN[field.name] ?? "عنصر";

  const setCell = (i: number, name: string, val: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [name]: val } : r)));
  const addRow = () =>
    setRows((rs) => [...rs, Object.fromEntries(items.map((it) => [it.name, it.type === "select" ? it.options?.[0] ?? "" : ""]))]);
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  return (
    <div className="admin-field is-wide">
      <label className="admin-label">{field.label}</label>
      <input type="hidden" name={field.name} value={JSON.stringify(rows)} readOnly />
      <div className="admin-repeater">
        {rows.length === 0 && <div className="admin-repeater-empty">لا توجد عناصر بعد.</div>}
        {rows.map((row, i) => (
          <div className="admin-repeater-row" key={i}>
            <div className="admin-repeater-index">{i + 1}</div>
            <div className="admin-repeater-fields">
              {items.map((it) => (
                <div className={`admin-field${it.type === "textarea" ? " is-wide-item" : ""}`} key={it.name}>
                  <label className="admin-label sm">{it.label}</label>
                  {it.type === "textarea" ? (
                    <textarea className="admin-textarea" rows={2} value={String(row[it.name] ?? "")} onChange={(e) => setCell(i, it.name, e.target.value)} placeholder={it.placeholder} />
                  ) : it.type === "select" ? (
                    <select className="admin-select" value={String(row[it.name] ?? it.options?.[0] ?? "")} onChange={(e) => setCell(i, it.name, e.target.value)}>
                      {it.options?.map((o) => <option key={o} value={o}>{it.optionLabels?.[o] ?? o}</option>)}
                    </select>
                  ) : (
                    <input className="admin-input" value={String(row[it.name] ?? "")} onChange={(e) => setCell(i, it.name, e.target.value)} placeholder={it.placeholder} />
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="admin-repeater-remove" onClick={() => removeRow(i)} title="حذف" aria-label="حذف">✕</button>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm admin-repeater-add" onClick={addRow}>
          + إضافة {noun}
        </button>
      </div>
      {field.help && <p className="admin-hint">{field.help}</p>}
    </div>
  );
}

/* ── Key/value editor → object ─────────────────────────────────────────────── */
function KeyValue({ field, value }: { field: Field; value: unknown }) {
  const obj = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const [rows, setRows] = useState<{ k: string; v: string }[]>(Object.entries(obj).map(([k, v]) => ({ k, v: String(v) })));
  const serialized = JSON.stringify(Object.fromEntries(rows.filter((r) => r.k.trim()).map((r) => [r.k.trim(), r.v])));

  const setCell = (i: number, key: "k" | "v", val: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const addRow = () => setRows((rs) => [...rs, { k: "", v: "" }]);
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  return (
    <div className="admin-field is-wide">
      <label className="admin-label">{field.label}</label>
      <input type="hidden" name={field.name} value={serialized} readOnly />
      <div className="admin-repeater">
        {rows.length === 0 && <div className="admin-repeater-empty">لا توجد حقول.</div>}
        {rows.map((row, i) => (
          <div className="admin-repeater-row" key={i}>
            <div className="admin-repeater-fields">
              <div className="admin-field">
                <label className="admin-label sm">المفتاح</label>
                <input className="admin-input is-ltr" value={row.k} onChange={(e) => setCell(i, "k", e.target.value)} placeholder="hex" />
              </div>
              <div className="admin-field">
                <label className="admin-label sm">القيمة</label>
                <input className="admin-input is-ltr" value={row.v} onChange={(e) => setCell(i, "v", e.target.value)} placeholder="#BF9B2F" />
              </div>
            </div>
            <button type="button" className="admin-repeater-remove" onClick={() => removeRow(i)} title="حذف" aria-label="حذف">✕</button>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm admin-repeater-add" onClick={addRow}>+ إضافة حقل</button>
      </div>
      {field.help && <p className="admin-hint">{field.help}</p>}
    </div>
  );
}

/* ── Tag / chip input → comma-joined text[] ────────────────────────────────── */
function TagInput({ field, value }: { field: Field; value: unknown }) {
  const initialTags = Array.isArray(value) ? (value as string[]) : [];
  const [tags, setTags] = useState<string[]>(initialTags);
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const t = raw.trim().replace(/،$/, "").trim();
    if (t && !tags.includes(t)) setTags((ts) => [...ts, t]);
    setDraft("");
  };
  const remove = (i: number) => setTags((ts) => ts.filter((_, idx) => idx !== i));

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "،") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && tags.length) {
      remove(tags.length - 1);
    }
  };

  return (
    <div className="admin-field is-wide">
      <label className="admin-label">{field.label}</label>
      <input type="hidden" name={field.name} value={tags.join(",")} readOnly />
      <div className="admin-tags">
        {tags.map((t, i) => (
          <span className="admin-tag" key={i}>
            {t}
            <button type="button" onClick={() => remove(i)} aria-label="حذف">✕</button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => add(draft)}
          placeholder={tags.length ? "أضف المزيد…" : field.placeholder || "اكتب واضغط Enter"}
        />
      </div>
      <p className="admin-hint">{field.help ?? "اكتب كل عنصر ثم اضغط Enter لإضافته."}</p>
    </div>
  );
}

function ImageField({ field, initial }: { field: Field; initial: string }) {
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
    else if (res.url) setUrl(res.url);
  }

  const showThumb = url && /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);

  return (
    <div className="admin-field is-wide">
      <label className="admin-label">{field.label}</label>
      <div className="admin-imagefield">
        {showThumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="admin-thumb" />
        )}
        <div className="admin-imagefield-body">
          <input
            className="admin-input is-ltr"
            name={field.name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            style={{ marginBottom: 10 }}
          />
          <input className="admin-file" type="file" accept="image/*,application/pdf" onChange={onFile} />
          {busy && <span style={{ fontSize: 12, color: "var(--text-muted)", marginInlineStart: 8 }}>جارٍ الرفع…</span>}
          {err && <p className="admin-hint" style={{ color: "#b3261e" }}>{err}</p>}
        </div>
      </div>
      {field.help && <p className="admin-hint">{field.help}</p>}
    </div>
  );
}
