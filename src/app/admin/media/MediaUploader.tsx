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
    <div className="admin-card" style={{ maxWidth: 720, marginBottom: 26 }}>
      <h2 className="admin-card-title">رفع ملف</h2>
      <p className="admin-card-hint">الصور والشعارات وملفات PDF. بعد الرفع انسخ الرابط والصقه في الحقل المناسب.</p>
      <input className="admin-file" type="file" accept="image/*,application/pdf,application/zip" onChange={onFile} />
      {busy && <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 12 }}>جارٍ الرفع…</div>}
      {err && <div className="admin-error" style={{ marginTop: 12 }}>{err}</div>}
      {url && (
        <div className="admin-upload-result">
          <input className="admin-input is-ltr" readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}
    </div>
  );
}
