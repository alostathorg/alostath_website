import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslation } from "@/lib/queries";
import PrintFrame from "@/components/translations/PrintFrame";
import TranslationDocument from "@/components/translations/TranslationDocument";

// The visitor PDF: the same A4 template as the review copy, published items
// only, no watermark. Linked from the «تحميل PDF» button on each item.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslation(slug);
  return { title: { absolute: t?.title ?? "ترجمة" }, robots: { index: false, follow: true } };
}

export default async function PublicTranslationPrintPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslation(slug);
  if (!t) notFound();
  return (
    <PrintFrame>
      <TranslationDocument t={t} />
    </PrintFrame>
  );
}
