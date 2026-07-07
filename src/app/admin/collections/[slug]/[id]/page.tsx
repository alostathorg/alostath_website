import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCollection } from "../../../config";
import RecordForm from "../../../RecordForm";

export const dynamic = "force-dynamic";

export default async function EditRecord({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const isNew = id === "new";
  let initial: Record<string, unknown> = {};

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from(collection.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    initial = data;

    // Awards: load timeline phases into the `phases` pseudo-field.
    if (collection.table === "awards") {
      const { data: phases } = await supabase
        .from("award_timeline_phases")
        .select("label, date_text, state, tag_text, sort_order")
        .eq("award_id", id)
        .order("sort_order");
      initial.phases = (phases ?? []).map(({ label, date_text, state, tag_text }) => ({ label, date_text, state, tag_text }));
    }
  }

  return (
    <div>
      <Link href={`/admin/collections/${slug}`} className="admin-back">→ رجوع إلى {collection.labelPlural}</Link>
      <h1 className="admin-title" style={{ marginBottom: 24 }}>
        {isNew ? `إضافة ${collection.labelSingular}` : `تعديل: ${initial.name ?? initial.title ?? ""}`}
      </h1>
      <RecordForm collection={collection} id={isNew ? null : id} initial={initial} />
    </div>
  );
}
