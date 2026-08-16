import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCollection, type Field } from "../../config";
import DeleteButton from "../../DeleteButton";
import PublishToggle from "../../PublishToggle";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  open: { label: "التقديم مفتوح", cls: "is-open" },
  soon: { label: "يفتح قريباً", cls: "is-soon" },
  closed: { label: "مغلق", cls: "is-closed" },
};

export default async function CollectionList({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const supabase = await createClient();
  let query = supabase.from(collection.table).select("*");
  if (collection.orderBy) query = query.order(collection.orderBy.column, { ascending: collection.orderBy.ascending ?? true });
  const { data: rows } = await query;

  const cols = collection.fields.filter((f) => f.listColumn);
  const hasPublished = collection.fields.some((f) => f.name === "published");

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{collection.labelPlural}</h1>
          <p className="admin-subtitle">{(rows?.length ?? 0)} عنصر</p>
        </div>
        <Link href={`/admin/collections/${slug}/new`} className="admin-btn admin-btn-primary">+ إضافة {collection.labelSingular}</Link>
      </div>

      <div className="admin-tablewrap">
        <table className="admin-table" aria-label={collection.labelPlural}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.name}>{c.label}</th>
              ))}
              <th style={{ textAlign: "end" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row: Record<string, unknown>) => {
              const itemLabel = String(row.name ?? row.title ?? "") || undefined;
              return (
                <tr key={row.id as string}>
                  {cols.map((c, i) => (
                    <td key={c.name} className={cellClass(c, i)}>{renderCell(row[c.name], c, row)}</td>
                  ))}
                  <td style={{ textAlign: "end" }}>
                    <span className="admin-rowactions">
                      {hasPublished && (
                        <PublishToggle slug={slug} id={row.id as string} published={Boolean(row.published)} label={itemLabel} />
                      )}
                      <Link
                        href={`/admin/collections/${slug}/${row.id}`}
                        className="admin-edit"
                        aria-label={itemLabel ? `تعديل ${itemLabel}` : "تعديل"}
                      >
                        تعديل
                      </Link>
                      <DeleteButton slug={slug} id={row.id as string} label={itemLabel} />
                    </span>
                  </td>
                </tr>
              );
            })}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={cols.length + 1} className="admin-empty">لا توجد عناصر بعد — ابدأ بإضافة عنصر جديد.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cellClass(field: Field, index: number) {
  const parts: string[] = [];
  if (index === 0) parts.push("col-name");
  if (field.name === "slug") parts.push("admin-cell-ltr");
  if (field.type === "number") parts.push("admin-cell-num");
  return parts.join(" ");
}

function renderCell(value: unknown, field: Field, row: Record<string, unknown>) {
  if (field.type === "boolean") {
    return value
      ? <span className="admin-badge is-pub"><span className="dot" />منشور</span>
      : <span className="admin-badge is-draft">مسودة</span>;
  }
  if (field.name === "status") {
    const s = STATUS_LABEL[String(value)];
    return s ? <span className={`admin-badge ${s.cls}`}><span className="dot" />{s.label}</span> : String(value ?? "—");
  }
  if (field.type === "select" && field.optionLabels) {
    if (value === null || value === undefined || value === "") return <span style={{ color: "var(--ink-subtle)" }}>—</span>;
    const label = field.optionLabels[String(value)] ?? String(value);
    const meta = row.meta && typeof row.meta === "object" ? (row.meta as Record<string, unknown>) : null;
    const hex = value === "color" && meta && typeof meta.hex === "string" ? meta.hex : null;
    return (
      <span className="admin-badge is-type">
        {hex && <span className="admin-swatch" style={{ background: hex }} />}
        {label}
      </span>
    );
  }
  if (value === null || value === undefined || value === "") return <span style={{ color: "var(--ink-subtle)" }}>—</span>;
  return String(value);
}
