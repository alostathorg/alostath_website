"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveRecord, uploadMedia } from "./actions";
import AiAssist from "./AiAssist";
import { AI_FIELDS, type Collection, type Field } from "./config";
import { latinDigitsDeep } from "@/lib/format";
import { Icon } from "./icons";

// Basic Arabic → Latin transliteration so a slug can be generated automatically
// from the (Arabic) name/title. Editors never have to type a URL by hand.
const AR_MAP: Record<string, string> = {
  ا: "a", أ: "a", إ: "i", آ: "a", ٱ: "a", ب: "b", ت: "t", ث: "th", ج: "j",
  ح: "h", خ: "kh", د: "d", ذ: "dh", ر: "r", ز: "z", س: "s", ش: "sh", ص: "s",
  ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "q", ك: "k", ل: "l",
  م: "m", ن: "n", ه: "h", و: "w", ي: "y", ى: "a", ة: "a", ء: "", ئ: "", ؤ: "",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[ً-ْ]/g, "") // strip Arabic diacritics
    .split("")
    .map((ch) => (ch in AR_MAP ? AR_MAP[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Values = Record<string, unknown>;
type Row = Record<string, unknown>;

const WIDE_TYPES = new Set(["textarea", "lines", "json", "image", "tags", "repeater", "keyvalue"]);
const isWide = (f: Field) => WIDE_TYPES.has(f.type);
// Slugs, dates, URLs and promo codes are Latin text — type them LTR.
const isLtrField = (f: Field) =>
  f.name === "slug" || f.name.endsWith("_at") || f.name.endsWith("_url") || f.name.endsWith("_code");

// Friendly "add" button labels per repeater / key-value field.
const ADD_NOUN: Record<string, string> = {
  steps: "خطوة",
  phases: "مرحلة",
  value_cards: "بطاقة",
  facts: "حقيقة",
  meta: "حقل",
  highlights: "ميزة",
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
  // Values are held in state so the AI "paste to fill" flow can populate every
  // field at once; a version bump remounts the fields to pick up new values.
  const [values, setValues] = useState<Values>(initial);
  const [version, setVersion] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  // Unsaved-changes tracking: any edit flips it; a successful save navigates
  // away (saveRecord redirects), so it never needs resetting by hand.
  const [dirty, setDirty] = useState(false);
  const submitting = useRef(false);

  // Warn before leaving with unsaved edits (tab close, reload, «إلغاء»).
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (submitting.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Ctrl/⌘ + S saves, as editors expect from any editor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);
  // The copy-prompt flow works for any collection that declares its writing fields.
  const aiEnabled = collection.slug in AI_FIELDS;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    submitting.current = true;
    start(async () => {
      try {
        const res = await saveRecord(collection.slug, id, form);
        if (res?.error) {
          submitting.current = false;
          setError(res.error);
        }
      } catch (err) {
        submitting.current = false;
        setError(err instanceof Error ? err.message : "خطأ غير متوقع");
      }
    });
  }

  // Reconstruct the current values from the live form so nothing already typed
  // is lost when we remount to apply the imported content.
  function readCurrentValues(): Values {
    const form = formRef.current;
    const out: Values = { ...values };
    if (!form) return out;
    const fd = new FormData(form);
    for (const f of collection.fields) {
      const raw = fd.get(f.name);
      if (f.type === "repeater" || f.type === "keyvalue" || f.type === "json") {
        try { out[f.name] = raw ? JSON.parse(String(raw)) : (f.type === "keyvalue" ? {} : []); } catch { /* keep */ }
      } else if (f.type === "tags") {
        out[f.name] = String(raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      } else if (f.type === "lines") {
        out[f.name] = String(raw ?? "").split("\n");
      } else if (f.type === "boolean") {
        out[f.name] = raw === "on";
      } else if (raw != null) {
        out[f.name] = String(raw);
      }
    }
    return out;
  }

  function handleImport(imported: Values) {
    // saveRecord normalises the digits anyway; doing it here too means the
    // editor reviews the text that will actually be stored, whatever the model
    // wrote.
    const merged = { ...readCurrentValues(), ...latinDigitsDeep(imported) };
    // Regenerate the slug from a freshly imported name if none was set yet.
    if (imported.name && !String(merged.slug ?? "").trim()) merged.slug = slugify(String(imported.name));
    setValues(merged);
    setVersion((v) => v + 1);
    setDirty(true);
  }

  // Group fields into titled sections, preserving first-seen order.
  const groups: { name: string; fields: Field[] }[] = [];
  for (const f of collection.fields) {
    const name = f.group ?? "الحقول";
    let g = groups.find((x) => x.name === name);
    if (!g) { g = { name, fields: [] }; groups.push(g); }
    g.fields.push(f);
  }

  // The AI helper's own paste box isn't record data — typing there isn't an edit.
  const markDirty = (e: React.SyntheticEvent) => {
    if (!(e.target as HTMLElement).closest(".admin-ai")) setDirty(true);
  };
  // Row add / remove / reorder buttons change state without an input event.
  const onClickCapture = (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest("button[type=button]");
    if (btn && !btn.closest(".admin-ai") && !btn.closest(".admin-formnav")) setDirty(true);
  };

  return (
    <form onSubmit={onSubmit} ref={formRef} onInput={markDirty} onChange={markDirty} onClickCapture={onClickCapture}>
      {aiEnabled && <AiAssist collection={collection} onImport={handleImport} />}

      {groups.length > 2 && (
        <nav className="admin-formnav" aria-label="أقسام النموذج">
          {groups.map((g, i) => (
            <a key={g.name} href={`#sec-${i}`} className="admin-formnav-link">{g.name}</a>
          ))}
        </nav>
      )}

      {groups.map((g, i) => (
        <section className="admin-card admin-formsec" key={g.name} id={`sec-${i}`} aria-labelledby={`sec-${i}-h`}>
          <h2 className="admin-section-title" id={`sec-${i}-h`}>{g.name}</h2>
          <div className="admin-form-grid">
            {g.fields.map((f) => (
              <FieldRow key={`${f.name}:${version}`} field={f} value={values[f.name]} />
            ))}
          </div>
        </section>
      ))}

      {error && (
        <div className="admin-error" role="alert" ref={errorRef} style={{ marginTop: 16 }}>
          {Icon.alert}
          <span>{error}</span>
        </div>
      )}

      <div className="admin-actionbar">
        <div className="admin-actionbar-inner">
          <span className={`admin-savestate${dirty ? " is-dirty" : ""}`} aria-live="polite">
            <span className="dot" aria-hidden="true" />
            {pending ? "جارٍ الحفظ…" : dirty ? "تغييرات غير محفوظة" : id ? "لا توجد تغييرات" : "عنصر جديد"}
          </span>
          <span className="admin-actionbar-gap" />
          <a href={`/admin/collections/${collection.slug}`} className="admin-btn admin-btn-ghost">إلغاء</a>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={pending}
            title="حفظ (Ctrl+S)"
          >
            {Icon.check}
            {pending ? "جارٍ الحفظ…" : id ? "حفظ التغييرات" : `إضافة ${collection.labelSingular}`}
          </button>
        </div>
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
  if (field.name === "slug") return <SlugField field={field} value={value} />;

  if (field.type === "date") {
    return (
      <div className="admin-field">
        <label className="admin-label" htmlFor={`f-${field.name}`}>{field.label}</label>
        <input id={`f-${field.name}`} className="admin-input" type="date" name={field.name} defaultValue={String(value ?? "").slice(0, 10)} />
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
        <label className="admin-label" htmlFor={`f-${field.name}`}>{field.label}</label>
        <select id={`f-${field.name}`} className="admin-select" name={field.name} defaultValue={String(value ?? field.options?.[0] ?? "")}>
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
      <label className="admin-label" htmlFor={`f-${field.name}`}>{field.label}</label>
      {isArea ? (
        <textarea id={`f-${field.name}`} className={areaClass} name={field.name} defaultValue={display} rows={field.type === "json" ? 9 : 4} placeholder={field.placeholder} />
      ) : (
        <input id={`f-${field.name}`} className={inputClass} name={field.name} type={field.type === "number" ? "number" : "text"} defaultValue={display} placeholder={field.placeholder} />
      )}
      {field.help && <p className="admin-hint">{field.help}</p>}
    </div>
  );
}

/* ── Slug: auto-generated from the name/title, still editable ──────────────── */
function SlugField({ field, value }: { field: Field; value: unknown }) {
  const [slug, setSlug] = useState(String(value ?? ""));
  const ref = useRef<HTMLInputElement>(null);
  // Auto-fill only while the editor hasn't taken it over. For an existing
  // record (slug already set) we leave it alone.
  const autoRef = useRef(!String(value ?? "").trim());

  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;
    const source = (form.elements.namedItem("name") ||
      form.elements.namedItem("title")) as HTMLInputElement | null;
    if (!source) return;
    const onInput = () => {
      if (autoRef.current) setSlug(slugify(source.value));
    };
    source.addEventListener("input", onInput);
    return () => source.removeEventListener("input", onInput);
  }, []);

  return (
    <div className="admin-field">
      <label className="admin-label" htmlFor={`f-${field.name}`}>{field.label}</label>
      <input
        id={`f-${field.name}`}
        ref={ref}
        className="admin-input is-ltr"
        name={field.name}
        value={slug}
        onChange={(e) => {
          autoRef.current = false;
          setSlug(e.target.value);
        }}
        placeholder="example-name"
        dir="ltr"
      />
      <p className="admin-hint">يُنشأ تلقائياً من الاسم — لا حاجة لتعبئته يدوياً.</p>
    </div>
  );
}

/* ── Repeater: array of objects as add/remove/reorder rows ─────────────────── */
function Repeater({ field, value }: { field: Field; value: unknown }) {
  const initialRows: Row[] = Array.isArray(value) ? (value as Row[]).map((r) => ({ ...r })) : [];
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const items = field.itemFields ?? [];
  const noun = ADD_NOUN[field.name] ?? "عنصر";

  const setCell = (i: number, name: string, val: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [name]: val } : r)));
  const addRow = () =>
    setRows((rs) => [...rs, Object.fromEntries(items.map((it) => [it.name, it.type === "select" ? it.options?.[0] ?? "" : ""]))]);
  const removeRow = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));
  const move = (from: number, to: number) =>
    setRows((rs) => {
      if (from === to || from < 0 || to < 0 || from >= rs.length || to >= rs.length) return rs;
      const copy = [...rs];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });

  const onDrop = () => {
    if (dragIndex !== null && overIndex !== null) move(dragIndex, overIndex);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="admin-field is-wide">
      <label className="admin-label">{field.label}</label>
      <input type="hidden" name={field.name} value={JSON.stringify(rows)} readOnly />
      <div className="admin-repeater">
        {rows.length === 0 && <div className="admin-repeater-empty">لا توجد عناصر بعد.</div>}
        {rows.map((row, i) => (
          <div
            className={`admin-repeater-row${dragIndex === i ? " is-dragging" : ""}${overIndex === i && dragIndex !== i ? " is-over" : ""}`}
            key={i}
            draggable={dragIndex === i}
            onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; }}
            onDragOver={(e) => { if (dragIndex !== null) { e.preventDefault(); setOverIndex(i); } }}
            onDrop={(e) => { e.preventDefault(); onDrop(); }}
            onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
          >
            <button
              type="button"
              className="admin-repeater-handle"
              title="اسحب لإعادة الترتيب"
              aria-label="اسحب لإعادة الترتيب"
              onMouseDown={() => setDragIndex(i)}
              onTouchStart={() => setDragIndex(i)}
            >
              <span className="admin-repeater-index">{i + 1}</span>
              <span className="admin-repeater-grip" aria-hidden>⠿</span>
            </button>
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
            <button type="button" className="admin-repeater-remove" onClick={() => removeRow(i)} title="حذف" aria-label="حذف">{Icon.close}</button>
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
                {row.k.trim().toLowerCase() === "hex" ? (
                  <div className="admin-color">
                    <input
                      type="color"
                      className="admin-color-swatch"
                      value={/^#[0-9a-f]{6}$/i.test(row.v.trim()) ? row.v.trim() : "#bf9b2f"}
                      onChange={(e) => setCell(i, "v", e.target.value.toUpperCase())}
                      aria-label="اختر اللون"
                    />
                    <input className="admin-input is-ltr" value={row.v} onChange={(e) => setCell(i, "v", e.target.value)} placeholder="#BF9B2F" />
                  </div>
                ) : (
                  <input className="admin-input is-ltr" value={row.v} onChange={(e) => setCell(i, "v", e.target.value)} placeholder="#BF9B2F" />
                )}
              </div>
            </div>
            <button type="button" className="admin-repeater-remove" onClick={() => removeRow(i)} title="حذف" aria-label="حذف">{Icon.close}</button>
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
            <button type="button" onClick={() => remove(i)} aria-label={`حذف ${t}`}>{Icon.close}</button>
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
      <label className="admin-label" htmlFor={`f-${field.name}`}>{field.label}</label>
      <div className="admin-imagefield">
        {showThumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="admin-thumb" />
        )}
        <div className="admin-imagefield-body">
          <input
            id={`f-${field.name}`}
            className="admin-input is-ltr"
            name={field.name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            style={{ marginBottom: 10 }}
          />
          <label className={`admin-btn admin-btn-ghost admin-btn-sm admin-upload${busy ? " is-busy" : ""}`}>
            {Icon.media}
            {busy ? "جارٍ الرفع…" : url ? "استبدال الملف" : "رفع ملف من جهازك"}
            <input className="sr-only" type="file" accept="image/*,application/pdf" onChange={onFile} disabled={busy} />
          </label>
          {err && <p className="admin-hint" role="alert" style={{ color: "var(--ad-danger)" }}>{err}</p>}
        </div>
      </div>
      {field.help && <p className="admin-hint">{field.help}</p>}
    </div>
  );
}
