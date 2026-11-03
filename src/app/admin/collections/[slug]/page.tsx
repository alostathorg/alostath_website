import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { latinDigitsDeep } from "@/lib/format";
import { getCollection, publicPath, titleField, type Field } from "../../config";
import DeleteButton from "../../DeleteButton";
import PublishToggle from "../../PublishToggle";
import { Icon } from "../../icons";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  open: { label: "التقديم مفتوح", cls: "is-open" },
  soon: { label: "يفتح قريباً", cls: "is-soon" },
  closed: { label: "مغلق", cls: "is-closed" },
};

type Row = Record<string, unknown>;

export default async function CollectionList({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { slug } = await params;
  const { q: rawQ = "", status: rawStatus = "" } = await searchParams;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const supabase = await createClient();
  let query = supabase.from(collection.table).select("*");
  if (collection.orderBy) query = query.order(collection.orderBy.column, { ascending: collection.orderBy.ascending ?? true });
  // The dashboard reads in the same digits the site renders in, so a row saved
  // before that rule existed does not look different from a row saved today —
  // and re-saving it in the editor is what finally normalises it in the table.
  const { data } = await query;
  const all = (latinDigitsDeep(data) ?? []) as Row[];

  const cols = collection.fields.filter((f) => f.listColumn);
  const hasPublished = collection.fields.some((f) => f.name === "published");
  const nameKey = titleField(collection);

  // Collections are small (tens of rows), so search and filter in memory: it
  // keeps the counts on the tabs exact without extra round-trips.
  const q = rawQ.trim();
  const status = hasPublished && (rawStatus === "published" || rawStatus === "draft") ? rawStatus : "";
  const needle = q.toLowerCase();
  const matchesQ = (r: Row) =>
    !needle || [r[nameKey], r.slug].some((v) => typeof v === "string" && v.toLowerCase().includes(needle));
  const searched = all.filter(matchesQ);
  const nPub = searched.filter((r) => r.published).length;
  const rows = searched.filter((r) => (status === "published" ? r.published : status === "draft" ? !r.published : true));

  const tabs = [
    { key: "", label: "الكل", n: searched.length },
    { key: "published", label: "منشور", n: nPub },
    { key: "draft", label: "مسودة", n: searched.length - nPub },
  ];
  const href = (next: { q?: string; status?: string }) => {
    const p = new URLSearchParams();
    const nq = next.q ?? q;
    const ns = next.status ?? status;
    if (nq) p.set("q", nq);
    if (ns) p.set("status", ns);
    const s = p.toString();
    return `/admin/collections/${slug}${s ? `?${s}` : ""}`;
  };

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{collection.labelPlural}</h1>
          <p className="admin-subtitle">
            {all.length} عنصر{hasPublished ? ` — ${all.filter((r) => r.published).length} منشور على الموقع` : ""}
          </p>
        </div>
        <Link href={`/admin/collections/${slug}/new`} className="admin-btn admin-btn-primary">
          {Icon.plus}
          إضافة {collection.labelSingular}
        </Link>
      </div>

      {all.length > 0 && (
        <div className="admin-filterbar">
          <form method="get" className="admin-search" role="search">
            {status && <input type="hidden" name="status" value={status} />}
            <span className="admin-search-ico">{Icon.search}</span>
            <input
              className="admin-input"
              type="search"
              name="q"
              defaultValue={q}
              placeholder={`ابحث في ${collection.labelPlural}…`}
              aria-label={`بحث في ${collection.labelPlural}`}
            />
          </form>
          {hasPublished && (
            <nav className="admin-tabs" aria-label="تصفية حسب حالة النشر">
              {tabs.map((t) => (
                <Link
                  key={t.key || "all"}
                  href={href({ status: t.key })}
                  className={`admin-tab${status === t.key ? " is-active" : ""}`}
                  aria-current={status === t.key ? "page" : undefined}
                >
                  {t.label}
                  <span className="admin-tab-n">{t.n}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      )}

      {all.length === 0 ? (
        <div className="admin-emptystate">
          <span className="admin-emptystate-ico">{Icon.posts}</span>
          <h2>لا توجد {collection.labelPlural} بعد</h2>
          <p>ابدأ بإضافة أول {collection.labelSingular}، وستظهر هنا لتعديلها أو نشرها لاحقاً.</p>
          <Link href={`/admin/collections/${slug}/new`} className="admin-btn admin-btn-primary">
            {Icon.plus}
            إضافة {collection.labelSingular}
          </Link>
        </div>
      ) : (
        <div className="admin-tablewrap">
          <table className="admin-table is-stack" aria-label={collection.labelPlural}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c.name} scope="col">{c.label}</th>
                ))}
                <th scope="col" className="admin-th-actions"><span className="sr-only">إجراءات</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const itemLabel = String(row.name ?? row.title ?? "") || undefined;
                const editHref = `/admin/collections/${slug}/${row.id}`;
                const live = row.published !== false ? publicPath(slug, row) : null;
                return (
                  <tr key={row.id as string}>
                    {cols.map((c, i) => (
                      <td key={c.name} className={cellClass(c, i)} data-label={c.label}>
                        {i === 0 ? (
                          <Link href={editHref} className="admin-rowtitle">{renderCell(row[c.name], c, row)}</Link>
                        ) : (
                          renderCell(row[c.name], c, row)
                        )}
                      </td>
                    ))}
                    <td className="admin-td-actions">
                      <span className="admin-rowactions">
                        {hasPublished && (
                          <PublishToggle slug={slug} id={row.id as string} published={Boolean(row.published)} label={itemLabel} />
                        )}
                        {live && (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener"
                            className="admin-iconbtn"
                            title="عرض على الموقع"
                            aria-label={itemLabel ? `عرض ${itemLabel} على الموقع` : "عرض على الموقع"}
                          >
                            {Icon.external}
                          </a>
                        )}
                        <Link
                          href={editHref}
                          className="admin-iconbtn"
                          title="تعديل"
                          aria-label={itemLabel ? `تعديل ${itemLabel}` : "تعديل"}
                        >
                          {Icon.edit}
                        </Link>
                        <DeleteButton slug={slug} id={row.id as string} label={itemLabel} />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={cols.length + 1} className="admin-empty">
                    لا نتائج مطابقة. <Link href={href({ q: "", status: "" })} className="admin-link">مسح البحث والتصفية</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function cellClass(field: Field, index: number) {
  const parts: string[] = [];
  if (index === 0) parts.push("col-name");
  if (field.name === "slug") parts.push("admin-cell-ltr", "admin-cell-slug");
  if (field.type === "number") parts.push("admin-cell-num");
  return parts.join(" ");
}

function renderCell(value: unknown, field: Field, row: Row) {
  const dash = <span className="admin-nil">—</span>;
  if (field.type === "boolean") {
    // Only `published` means published; any other flag (e.g. featured) is a plain yes/no.
    if (field.name !== "published") return value ? "نعم" : dash;
    return value
      ? <span className="admin-badge is-pub"><span className="dot" />منشور</span>
      : <span className="admin-badge is-draft"><span className="dot" />مسودة</span>;
  }
  if (field.name === "status") {
    const s = STATUS_LABEL[String(value)];
    return s ? <span className={`admin-badge ${s.cls}`}><span className="dot" />{s.label}</span> : String(value ?? "—");
  }
  if (field.type === "select" && field.optionLabels) {
    if (value === null || value === undefined || value === "") return dash;
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
  if (value === null || value === undefined || value === "") return dash;
  return String(value);
}
