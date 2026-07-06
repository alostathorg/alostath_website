import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCollection } from "../../config";
import DeleteButton from "../../DeleteButton";

export const dynamic = "force-dynamic";

export default async function CollectionList({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const supabase = await createClient();
  let query = supabase.from(collection.table).select("*");
  if (collection.orderBy) query = query.order(collection.orderBy.column, { ascending: collection.orderBy.ascending ?? true });
  const { data: rows } = await query;

  const cols = collection.fields.filter((f) => f.listColumn);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{collection.labelPlural}</h1>
        <Link href={`/admin/collections/${slug}/new`} className="btn btn-primary btn-md">+ إضافة {collection.labelSingular}</Link>
      </div>

      <div style={{ overflowX: "auto", background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "start", background: "var(--surface-1)" }}>
              {cols.map((c) => (
                <th key={c.name} style={thStyle}>{c.label}</th>
              ))}
              <th style={{ ...thStyle, textAlign: "end" }}></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row: Record<string, unknown>) => (
              <tr key={row.id as string} style={{ borderTop: "1px solid var(--hairline)" }}>
                {cols.map((c) => (
                  <td key={c.name} style={tdStyle}>{renderCell(row[c.name], c.type)}</td>
                ))}
                <td style={{ ...tdStyle, textAlign: "end", whiteSpace: "nowrap" }}>
                  <Link href={`/admin/collections/${slug}/${row.id}`} style={{ color: "var(--olive-700)", fontWeight: 600, textDecoration: "none", marginInlineEnd: 14 }}>تعديل</Link>
                  <DeleteButton slug={slug} id={row.id as string} />
                </td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={cols.length + 1} style={{ ...tdStyle, textAlign: "center", color: "var(--text-muted)" }}>لا توجد عناصر بعد.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell(value: unknown, type: string) {
  if (type === "boolean") return value ? "✓ منشور" : "— مسودة";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

const thStyle: React.CSSProperties = { padding: "12px 16px", fontWeight: 600, color: "var(--ink-subtle)", textAlign: "start" };
const tdStyle: React.CSSProperties = { padding: "12px 16px", color: "var(--text-body)", textAlign: "start" };
