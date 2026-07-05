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
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>الوسائط</h1>
      <p style={{ color: "var(--text-muted)", margin: "0 0 24px" }}>الملفات المرفوعة إلى مخزن Supabase.</p>

      <MediaUploader />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
        {items.map((it) => (
          <div key={it.name} style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 120, background: "var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isImage(it.name) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.url} alt={it.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>ملف</span>
              )}
            </div>
            <div style={{ padding: 10 }}>
              <a href={it.url} target="_blank" rel="noopener" dir="ltr" style={{ fontSize: 12, color: "var(--olive-700)", textDecoration: "none", wordBreak: "break-all", display: "block" }}>{it.name}</a>
            </div>
          </div>
        ))}
        {items.length === 0 && <p style={{ color: "var(--text-muted)" }}>لا توجد ملفات بعد.</p>}
      </div>
    </div>
  );
}
