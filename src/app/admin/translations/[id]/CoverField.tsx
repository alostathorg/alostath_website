"use client";

import { useState } from "react";
import { uploadMedia } from "../../actions";
import type { Translation } from "@/lib/types";

/** Longest edge of a stored cover. 1600×900 is the house 16:9 size. */
const MAX_W = 1600;

/**
 * Resizes an image to at most 1600px wide and re-encodes it as WebP in the
 * browser, so a 3 MB PNG straight out of an image model uploads as a few
 * hundred KB and pages stay fast. Falls back to the original file if the
 * browser cannot encode WebP.
 */
async function toWebp(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_W / bmp.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
    if (!blob || blob.type !== "image/webp") return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="admin-btn admin-btn-ghost admin-btn-sm"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard blocked — the text is still selectable in the box */
        }
      }}
    >
      {done ? "نُسخ ✓" : label}
    </button>
  );
}

/**
 * «صورة المقال». The weekly task writes the prompt (English, for the image
 * model), its Arabic translation (for the editor) and a model recommendation;
 * the editor generates the image elsewhere and uploads it here. All fields are
 * editable and saved with the rest of the review form.
 */
export default function CoverField({ item }: { item: Translation }) {
  const [url, setUrl] = useState(item.cover_url ?? "");
  const [prompt, setPrompt] = useState(item.cover_prompt ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", await toWebp(file));
    const res = await uploadMedia(fd);
    setBusy(false);
    if (res.error) setErr(res.error);
    else if (res.url) setUrl(res.url);
  }

  return (
    <div className="admin-card">
      <div className="tr-paras-head">
        <div>
          <h2 className="admin-card-title">صورة المقال</h2>
          <p className="admin-card-hint" style={{ margin: 0 }}>
            انسخ البرومت إلى أداة التوليد، ثم ارفع الصورة هنا. المقاس 16:9 (1600×900)، وتُضغط تلقائياً قبل الرفع.
          </p>
        </div>
        {!url && <span className="admin-badge is-soon"><span className="dot" />بدون صورة</span>}
      </div>

      <div className="tr-cover">
        <div className="tr-cover-preview">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" />
          ) : (
            <span>لم تُرفع صورة بعد</span>
          )}
        </div>
        <div className="tr-cover-controls">
          <label className="admin-btn admin-btn-primary admin-btn-sm tr-upload">
            {busy ? "جارٍ الرفع…" : url ? "استبدال الصورة" : "رفع الصورة"}
            <input type="file" accept="image/*" onChange={onFile} disabled={busy} hidden />
          </label>
          {url && (
            <button type="button" className="tr-link is-danger" onClick={() => setUrl("")}>إزالة الصورة</button>
          )}
          {err && <p className="admin-hint" style={{ color: "#b3261e" }}>{err}</p>}
          <input type="hidden" name="cover_url" value={url} readOnly />
          <label className="admin-label sm" htmlFor="cover_alt" style={{ marginTop: 14 }}>وصف الصورة (لقارئات الشاشة)</label>
          <input className="admin-input" id="cover_alt" name="cover_alt" defaultValue={item.cover_alt ?? ""} placeholder="مثال: معلّم يراجع بطاقات الخروج مع طلابه" />
          <label className="admin-label sm" htmlFor="cover_credit" style={{ marginTop: 12 }}>نسبة الصورة (اختياري)</label>
          <input className="admin-input" id="cover_credit" name="cover_credit" defaultValue={item.cover_credit ?? ""} placeholder="فقط عند استخدام صورة جاهزة برخصة، مثل: غلاف التقرير — UNESCO, CC BY-SA 3.0 IGO" />
        </div>
      </div>

      <div className="tr-prompt">
        <div className="tr-prompt-head">
          <label className="admin-label" htmlFor="cover_prompt" style={{ margin: 0 }}>البرومت (بالإنجليزية — يُنسخ كما هو)</label>
          <CopyButton text={prompt} label="نسخ البرومت" />
        </div>
        <textarea
          className="admin-textarea is-ltr"
          id="cover_prompt"
          name="cover_prompt"
          dir="ltr"
          rows={7}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="تكتبه المهمة الأسبوعية تلقائياً لكل مادة."
        />
      </div>

      <div className="admin-form-grid" style={{ marginTop: 14 }}>
        <div className="admin-field is-wide">
          <label className="admin-label" htmlFor="cover_prompt_ar">ترجمة البرومت</label>
          <textarea className="admin-textarea" id="cover_prompt_ar" name="cover_prompt_ar" rows={5} defaultValue={item.cover_prompt_ar ?? ""} />
        </div>
        <div className="admin-field is-wide">
          <label className="admin-label" htmlFor="cover_model">النموذج المقترح والصور المرجعية</label>
          <textarea className="admin-textarea" id="cover_model" name="cover_model" rows={3} defaultValue={item.cover_model ?? ""} />
        </div>
      </div>
    </div>
  );
}
