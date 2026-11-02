import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import { latinDigitsDeep } from "@/lib/format";
import { paragraphs } from "@/lib/translations";
import type { Translation } from "@/lib/types";
import PrintFrame from "@/components/translations/PrintFrame";
import TranslationDocument from "@/components/translations/TranslationDocument";

// The review PDF of one translation, in any status. Lives outside /admin so it
// prints without the dashboard chrome; the admin check is done here instead
// (and RLS hides unpublished rows from anyone else regardless).
export const dynamic = "force-dynamic";

async function load(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("translations").select("*").eq("id", id).maybeSingle();
  return data ? latinDigitsDeep(data as Translation) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = (await isAdmin()) ? await load(id) : null;
  // The document title becomes the PDF's default file name.
  return { title: { absolute: t ? `${t.title} — مسودة` : "ترجمة" }, robots: { index: false, follow: false } };
}

export default async function TranslationPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bilingual?: string }>;
}) {
  const { id } = await params;
  const { bilingual } = await searchParams;
  if (!(await isAdmin())) redirect(`/admin/login?next=${encodeURIComponent(`/print/translations/${id}`)}`);

  const t = await load(id);
  if (!t) notFound();

  const twoCol = bilingual === "1" && paragraphs(t.original_body).length > 0;
  const draft = t.status !== "published";

  return (
    <PrintFrame
      draft={draft}
      tools={
        paragraphs(t.original_body).length > 0 && (
          <a className="tp-toolbtn" href={`/print/translations/${t.id}${twoCol ? "" : "?bilingual=1"}`}>
            {twoCol ? "العربية فقط" : "ثنائي اللغة"}
          </a>
        )
      }
    >
      <TranslationDocument t={t} bilingual={twoCol} />
    </PrintFrame>
  );
}
