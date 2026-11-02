import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import WordsCounter from "@/components/translations/WordsCounter";
import { getTranslationTotals, getTranslations } from "@/lib/queries";
import { MACHINE_NOTE, TRANSLATIONS_NAV_LABEL, TRANSLATIONS_TITLE } from "@/lib/translations";
import TranslationsFeed from "./TranslationsFeed";

export const revalidate = 60;
export const metadata: Metadata = {
  title: TRANSLATIONS_NAV_LABEL,
  description:
    "مبادرة «مليون كلمة» من مؤسسة الأستاذ: أبحاث وتقارير وتجارب تعليمية عالمية مترجمة إلى العربية لخدمة المعلّم.",
};

export default async function TranslationsPage() {
  const [items, totals] = await Promise.all([getTranslations(), getTranslationTotals()]);

  return (
    <PageShell active="translations">
      <PageHero
        eyebrow="مبادرة «مليون كلمة»"
        title={TRANSLATIONS_TITLE}
        lede="ننقل إلى العربية أبرز ما يُنشر عالمياً في التعليم — أبحاثاً وتقارير وتجارب — مختارةً لما يفيد المعلّم في صفّه ومهنته، ونمضي بها نحو مليون كلمة."
        below={
          <div style={{ maxWidth: 560 }}>
            <WordsCounter words={totals.words} items={totals.items} />
          </div>
        }
      />

      <div className="tl-wrap tl-layout">
        <div>
          {items.length === 0 ? (
            <div className="tl-empty">
              <h2>تُنشر أولى الترجمات قريباً</h2>
              <p>نراجع الدفعة الأولى الآن، وتُنشر هنا فور اعتمادها.</p>
            </div>
          ) : (
            <TranslationsFeed items={items} />
          )}
        </div>

        <aside className="tl-side" aria-label="عن المبادرة">
          <div className="tl-card is-dark">
            <span className="tl-card-k">عن المبادرة</span>
            <h2>مليون كلمة للمعلّم</h2>
            <p style={{ color: "var(--inverse-muted)" }}>
              نختار كل أسبوع موادَّ تعليمية من مصادر عالمية موثوقة، ونترجمها ترجمةً كاملة متى أتاحت رخصتها ذلك، أو نلخّصها
              بالعربية مع الإحالة إلى أصلها.
            </p>
          </div>
          <div className="tl-card">
            <span className="tl-card-k">منهجنا</span>
            <p>{MACHINE_NOTE}: تُنجز الترجمة آلياً وتُراجَع قبل النشر، ويُذكر مع كل مادة مصدرها ومؤلفها ورخصتها.</p>
            <p>
              لاقتراح مصدر أو ملاحظة على ترجمة: <Link href="/contact">تواصل معنا</Link>.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
