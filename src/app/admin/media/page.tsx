import { createClient } from "@/lib/supabase/server";
import MediaUploader from "./MediaUploader";

export const dynamic = "force-dynamic";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "media";

export default async function MediaPage() {
  const supabase = await createClient();
  const { data: files } = await supabase.storage.from(BUCKET).list("", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  const items = (files ?? [])
    .filter((f) => f.name && !f.name.startsWith("."))
    .map((f) => ({ name: f.name, url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl }));

  const isImage = (n: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(n);

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">الوسائط</h1>
          <p className="admin-subtitle">الملفات المرفوعة إلى مخزن Supabase — {items.length} ملف.</p>
        </div>
      </div>

      <MediaUploader />

      <div className="admin-media-grid">
        {items.map((it) => (
          <div key={it.name} className="admin-media-card">
            <div className="admin-media-preview">
              {isImage(it.name) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.url} alt={it.name} />
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>ملف</span>
              )}
            </div>
            <a href={it.url} target="_blank" rel="noopener" className="admin-media-name">{it.name}</a>
          </div>
        ))}
        {items.length === 0 && <p style={{ color: "var(--text-muted)" }}>لا توجد ملفات بعد.</p>}
      </div>
    </div>
  );
}
