import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { latinDigitsDeep } from "@/lib/format";
import { getCollection, NEW_DEFAULTS, publicPath } from "../../../config";
import RecordForm from "../../../RecordForm";
import { Icon } from "../../../icons";

export const dynamic = "force-dynamic";

export default async function EditRecord({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const isNew = id === "new";
  // New records start from the ready template (steps/timeline) when one exists.
  let initial: Record<string, unknown> = isNew ? { ...(NEW_DEFAULTS[slug] ?? {}) } : {};

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from(collection.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    initial = latinDigitsDeep(data);

    // Awards: load timeline phases into the `phases` pseudo-field.
    if (collection.table === "awards") {
      const { data: phases } = await supabase
        .from("award_timeline_phases")
        .select("label, date_text, state, tag_text, sort_order")
        .eq("award_id", id)
        .order("sort_order");
      initial.phases = latinDigitsDeep(
        (phases ?? []).map(({ label, date_text, state, tag_text }) => ({ label, date_text, state, tag_text })),
      );
    }
  }

  const hasPublished = collection.fields.some((f) => f.name === "published");
  const live = !isNew && initial.published !== false ? publicPath(slug, initial) : null;
  const name = String(initial.name ?? initial.title ?? "");

  return (
    <div>
      <nav className="admin-crumbs" aria-label="مسار التنقل">
        <Link href={`/admin/collections/${slug}`} className="admin-back">
          {Icon.back}
          {collection.labelPlural}
        </Link>
      </nav>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">
            {isNew ? `إضافة ${collection.labelSingular}` : name || `تعديل ${collection.labelSingular}`}
          </h1>
          <div className="admin-head-meta">
            {isNew ? (
              <span className="admin-badge is-type">جديد — لم يُحفظ بعد</span>
            ) : hasPublished ? (
              initial.published ? (
                <span className="admin-badge is-pub"><span className="dot" />منشور على الموقع</span>
              ) : (
                <span className="admin-badge is-draft"><span className="dot" />مسودة — غير ظاهر للزوّار</span>
              )
            ) : null}
          </div>
        </div>
        {live && (
          <a href={live} target="_blank" rel="noopener" className="admin-btn admin-btn-ghost">
            {Icon.external}
            عرض على الموقع
          </a>
        )}
      </div>
      <RecordForm collection={collection} id={isNew ? null : id} initial={initial} />
    </div>
  );
}
