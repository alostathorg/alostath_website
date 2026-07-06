"use client";

import { useState } from "react";
import { uploadMedia } from "../actions";

export default function MediaUploader() {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    setUrl(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setBusy(false);
    if (res.error) setErr(res.error);
    else setUrl(res.url ?? null);
  }

  return (
    <div style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 14, padding: 24, marginBottom: 28, maxWidth: 720 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>رفع ملف</h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 14px" }}>الصور والشعارات وملفات PDF. بعد الرفع انسخ الرابط والصقه في الحقل المناسب.</p>
      <input type="file" accept="image/*,application/pdf,application/zip" onChange={onFile} />
      {busy && <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 12 }}>جارٍ الرفع…</div>}
      {err && <div style={{ fontSize: 14, color: "#b3261e", marginTop: 12 }}>{err}</div>}
      {url && (
        <div style={{ marginTop: 14 }}>
          <input readOnly value={url} dir="ltr" className="ct-field" onFocus={(e) => e.currentTarget.select()} style={{ textAlign: "left" }} />
        </div>
      )}
    </div>
  );
}
