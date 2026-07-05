"use client";

import { useState, useTransition } from "react";
import { saveRecord, uploadMedia } from "./actions";
import type { Collection, Field } from "./config";

type Values = Record<string, unknown>;

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
    <form onSubmit={onSubmit} style={{ maxWidth: 720 }}>
      {collection.fields.map((f) => (
        <FieldRow key={f.name} field={f} value={initial[f.name]} />
      ))}
      {error && <div style={{ color: "#b3261e", fontSize: 14, margin: "8px 0 16px" }}>{error}</div>}
      <div style={{ display: "flex", gap: 12, marginTop: 24, position: "sticky", bottom: 0, background: "var(--surface-1)", padding: "16px 0" }}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>{pending ? "جارٍ الحفظ…" : "حفظ"}</button>
        <a href={`/admin/collections/${collection.slug}`} className="btn btn-secondary btn-lg">إلغاء</a>
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

const labelStyle: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 };
const helpStyle: React.CSSProperties = { fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" };
const wrapStyle: React.CSSProperties = { marginBottom: 20 };

function FieldRow({ field, value }: { field: Field; value: unknown }) {
  const display = toDisplay(field, value);

  if (field.type === "boolean") {
    return (
      <div style={wrapStyle}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} style={{ width: 18, height: 18 }} />
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div style={wrapStyle}>
        <label style={labelStyle}>{field.label}</label>
        <select className="ct-field" name={field.name} defaultValue={display || field.options?.[0]}>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {field.help && <p style={helpStyle}>{field.help}</p>}
      </div>
    );
  }

  if (field.type === "image") {
    return <ImageField field={field} initial={display} />;
  }

  const isArea = field.type === "textarea" || field.type === "lines" || field.type === "json";
  return (
    <div style={wrapStyle}>
      <label style={labelStyle}>{field.label}</label>
      {isArea ? (
        <textarea className="ct-field" name={field.name} defaultValue={display} rows={field.type === "json" ? 8 : 4} style={{ resize: "vertical", ...(field.type === "json" ? { fontFamily: "var(--font-mono)", direction: "ltr", textAlign: "left" } : {}) }} />
      ) : (
        <input className="ct-field" name={field.name} type={field.type === "number" ? "number" : "text"} defaultValue={display} />
      )}
      {field.help && <p style={helpStyle}>{field.help}</p>}
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

  return (
    <div style={wrapStyle}>
      <label style={labelStyle}>{field.label}</label>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 10, border: "1px solid var(--hairline)", background: "var(--surface-1)" }} />
        )}
        <div style={{ flex: 1, minWidth: 220 }}>
          <input className="ct-field" name={field.name} dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" style={{ textAlign: "left", marginBottom: 8 }} />
          <input type="file" accept="image/*,application/pdf" onChange={onFile} style={{ fontSize: 13 }} />
          {busy && <span style={{ fontSize: 12, color: "var(--text-muted)", marginInlineStart: 8 }}>جارٍ الرفع…</span>}
          {err && <p style={{ ...helpStyle, color: "#b3261e" }}>{err}</p>}
        </div>
      </div>
      {field.help && <p style={helpStyle}>{field.help}</p>}
    </div>
  );
}
