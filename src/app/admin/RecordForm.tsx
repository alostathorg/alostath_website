"use client";

import { useState, useTransition } from "react";
import { saveRecord, uploadMedia } from "./actions";
import type { Collection, Field } from "./config";

type Values = Record<string, unknown>;

const WIDE_TYPES = new Set(["textarea", "lines", "json", "image", "tags"]);
const isWide = (f: Field) => WIDE_TYPES.has(f.type);
// Text inputs that hold latin/code values and should read left-to-right.
const isLtrField = (f: Field) => f.name === "slug" || f.name.endsWith("_at");

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

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-card">
        <div className="admin-form-grid">
          {collection.fields.map((f) => (
            <FieldRow key={f.name} field={f} value={initial[f.name]} />
          ))}
        </div>
      </div>

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
      return Array.isArray(value) ? (value as string[]).join(", ") : "";
    case "lines":
      return Array.isArray(value) ? (value as string[]).join("\n") : "";
    case "json":
      return JSON.stringify(value, null, 2);
    default:
      return String(value);
  }
}

function FieldRow({ field, value }: { field: Field; value: unknown }) {
  const display = toDisplay(field, value);
  const wide = isWide(field);

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
        <select className="admin-select" name={field.name} defaultValue={display || field.options?.[0]}>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {field.help && <p className="admin-hint">{field.help}</p>}
      </div>
    );
  }

  if (field.type === "image") {
    return <ImageField field={field} initial={display} />;
  }

  const isArea = field.type === "textarea" || field.type === "lines" || field.type === "json";
  const areaClass = field.type === "json" ? "admin-textarea is-code" : "admin-textarea";
  const inputClass = isLtrField(field) ? "admin-input is-ltr" : "admin-input";

  return (
    <div className={`admin-field${wide ? " is-wide" : ""}`}>
      <label className="admin-label">{field.label}</label>
      {isArea ? (
        <textarea className={areaClass} name={field.name} defaultValue={display} rows={field.type === "json" ? 9 : 4} />
      ) : (
        <input className={inputClass} name={field.name} type={field.type === "number" ? "number" : "text"} defaultValue={display} />
      )}
      {field.help && <p className="admin-hint">{field.help}</p>}
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
