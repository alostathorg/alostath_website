"use client";

import { useState } from "react";
import { AI_FIELDS, buildAiPrompt, type Collection } from "./config";

// Pulls the JSON object out of whatever the AI returned (handles ```json fences
// and any stray text around it).
function parseAiJson(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    const obj = JSON.parse(cleaned.slice(start, end + 1));
    return obj && typeof obj === "object" ? (obj as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

// Keeps only the known writing fields, coerced to the shape the form expects,
// dropping anything the AI left empty.
function coerceImported(collection: Collection, parsed: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const name of AI_FIELDS[collection.slug] ?? []) {
    if (!(name in parsed)) continue;
    const field = collection.fields.find((f) => f.name === name);
    let v = parsed[name];
    if (field?.type === "tags") {
      if (typeof v === "string") v = v.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
      if (Array.isArray(v) && v.length) out[name] = v.map(String);
    } else if (field?.type === "repeater") {
      // Cells are stored as strings; an unquoted number from the AI must not reach jsonb as-is.
      if (Array.isArray(v) && v.length) {
        out[name] = v
          .filter((r) => r && typeof r === "object")
          .map((r) => Object.fromEntries(Object.entries(r as Record<string, unknown>).map(([k, x]) => [k, x == null ? "" : String(x)])));
      }
    } else if (field?.type === "select") {
      if (typeof v === "string" && (field.options ?? []).includes(v.trim())) out[name] = v.trim();
    } else if (typeof v === "string" && v.trim()) {
      out[name] = v.trim();
    } else if (typeof v === "number") {
      out[name] = String(v);
    }
  }
  return out;
}

export default function AiAssist({
  collection,
  onImport,
}: {
  collection: Collection;
  onImport: (values: Record<string, unknown>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [raw, setRaw] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function copyPrompt() {
    const prompt = buildAiPrompt(collection);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked — fall back to selecting the text area so the editor can copy manually.
      setMsg({ ok: false, text: "تعذّر النسخ التلقائي. انسخ النص من المربع بالأسفل يدوياً." });
      setRaw(prompt);
    }
  }

  function doImport() {
    const parsed = parseAiJson(raw);
    if (!parsed) {
      setMsg({ ok: false, text: "تعذّرت قراءة المحتوى. تأكد من لصق ردّ الأداة كاملاً." });
      return;
    }
    const values = coerceImported(collection, parsed);
    if (Object.keys(values).length === 0) {
      setMsg({ ok: false, text: "لم يُعثر على حقول معروفة في النص الملصق." });
      return;
    }
    onImport(values);
    const count = Object.keys(values).length;
    setMsg({ ok: true, text: `تم ملء ${count} حقلاً ✓ راجع الحقول بالأسفل ثم اضغط حفظ.` });
    setRaw("");
  }

  return (
    <div className="admin-ai">
      <button type="button" className="admin-ai-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="admin-ai-toggle-title">✨ كتابة المحتوى بمساعدة الذكاء الاصطناعي</span>
        <span className="admin-ai-chev" aria-hidden>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="admin-ai-body">
          <ol className="admin-ai-steps">
            <li>اضغط «نسخ التعليمات».</li>
            <li>افتح أي أداة ذكاء اصطناعي (مثل ChatGPT)، ألصق التعليمات، وأرفق ملف {collection.labelSingular}.</li>
            <li>انسخ ردّ الأداة، ألصقه في المربع بالأسفل، ثم اضغط «تعبئة الحقول».</li>
          </ol>

          <button type="button" className="admin-btn admin-btn-primary admin-ai-copy" onClick={copyPrompt}>
            {copied ? "تم نسخ التعليمات ✓" : "نسخ التعليمات"}
          </button>

          <label className="admin-label" style={{ marginTop: 14 }}>الصق ردّ الذكاء الاصطناعي هنا</label>
          <textarea
            className="admin-textarea"
            rows={5}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="ألصق ما نسخته من أداة الذكاء الاصطناعي…"
          />

          <div style={{ marginTop: 12 }}>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={doImport} disabled={!raw.trim()}>
              تعبئة الحقول
            </button>
          </div>

          {msg && (
            <p className="admin-hint admin-ai-msg" style={{ color: msg.ok ? "var(--olive-700)" : "#b3261e" }}>
              {msg.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
