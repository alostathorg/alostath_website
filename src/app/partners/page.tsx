import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CriteriaBand from "@/components/CriteriaBand";
import { getBrandPartners } from "@/lib/queries";
import {
  PARTNERS_DISCLAIMER,
  PARTNERS_NAV_LABEL,
  PARTNERS_PATH,
} from "@/lib/brandPartners";
import PartnersDirectory from "./PartnersDirectory";

export const revalidate = 60;
export const metadata: Metadata = {
  title: PARTNERS_NAV_LABEL,
  description:
    "علاماتٌ تجارية تقدّم للمعلّم أدواتٍ وخدماتٍ وحلولاً تعليمية، اختارتها مؤسسة الأستاذ لأنها تخدم المعلّم فعلاً.",
};

// The trust layer above the cards: why a brand is here at all. Copy lives in
// code because it is editorial policy, not per-partner content.
const CRITERIA = [
  { t: "تخدم المعلّم فعلاً", d: "منتج أو خدمة يستخدمها المعلّم في عمله أو حياته" },
  { t: "عرضٌ واضح", d: "نعرض ما تقدّمه ولمن وبأي كلفة دون غموض" },
  { t: "جهةٌ موثوقة", d: "نتحقّق من العلامة قبل إدراجها" },
];


// What a brand gets, and what it gives in return.
const JOIN = [
  { t: "صفحةٌ تعريفية", d: "تعرض منتجك ولمن هو وبأي كلفة، بلغةٍ يفهمها المعلّم." },
  { t: "ظهورٌ أمام المعلّمين", d: "في دليل الإعلامات وأمام أعضاء مجتمع الأستاذ." },
  { t: "مقابل عرضٍ واضح", d: "ميزةٌ حقيقية للمعلّم: خصم أو فترة مجانية أو خدمة إضافية." },
];

function EmptyState() {
  return (
    <div className="bp-empty" data-reveal="1">
      <div className="bp-empty-ico">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 9l1.5-5h15L21 9" />
          <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
          <path d="M4 12v8h16v-8" />
          <path d="M9 20v-5h6v5" />
        </svg>
      </div>
      <h2>نُعدّ قائمة شركاء المعلّم</h2>
      <p>
        نراجع الآن العلامات التي تقدّم أدواتٍ وخدماتٍ وعروضاً حقيقية للمعلّم، وسنعرضها هنا فور
        اعتمادها. إن كنت تمثّل علامةً تخدم المعلّمين والمعلّمات، فنرحّب بطلبك.
      </p>
      <div className="bp-empty-actions">
        <Link href="/contact" className="btn btn-primary btn-md">كن شريكاً للمعلّم</Link>
        <Link href="/initiatives" className="btn btn-outline btn-md">تصفّح مبادرات الأستاذ</Link>
      </div>
    </div>
  );
}

export default async function PartnersPage() {
  const partners = await getBrandPartners();
  const empty = partners.length === 0;

  return (
    <PageShell active="partners">
      <PageHero
        eyebrow={`${PARTNERS_NAV_LABEL} — شركاء المعلّم`}
        title="علاماتٌ تجارية تدعم المعلّم"
        lede="أدواتٌ وخدماتٌ وحلولٌ تعليمية اختارتها مؤسسة الأستاذ لأنها تخدم المعلّم فعلاً. كل بطاقة تخبرك بما تقدّمه العلامة، ولمن، وبأي كلفة، وهل لديها عرضٌ خاص للمعلّم — ثم تنتقل إلى موقعها مباشرة."
        actions={
          <>
            {!empty && <a href="#grid" className="btn btn-secondary btn-lg">تصفّح الشركاء</a>}
            <Link href="/contact" className={`btn btn-lg ${empty ? "btn-secondary" : "btn-outline btn-on-dark"}`}>
              كن شريكاً للمعلّم
            </Link>
          </>
        }
      />

      {/* SELECTION CRITERIA */}
      <CriteriaBand title="كيف نختار الشركاء" note="كل علامة هنا استوفت ثلاثة شروط" items={CRITERIA} />

      {/* PARTNERS */}
      <section id="grid" className="pt-wrap pt-directory">
        {empty ? (
          <EmptyState />
        ) : (
          <>
            <div className="pt-head" data-reveal="1">
              <div className="kicker">شركاء المعلّم</div>
              <h2>العلامات الشريكة</h2>
            </div>
            <PartnersDirectory partners={partners} />
            <p className="bp-disclaimer">{PARTNERS_DISCLAIMER}</p>
          </>
        )}
      </section>

      {/* BECOME A PARTNER — hidden in the empty state, which already invites brands */}
      {!empty && (
        <section className="pt-wrap pt-join-wrap">
          <div className="pt-join" data-reveal="1">
            <div className="pt-join-text">
              <div className="kicker is-gold">للعلامات التجارية</div>
              <h2>هل تقدّم علامتك ما يخدم المعلّم؟</h2>
              <p>تخضع الطلبات للمراجعة وفق معايير المؤسسة قبل النشر.</p>
              <div className="pt-join-actions">
                <Link href="/contact" className="btn btn-secondary btn-lg">قدّم طلب شراكة</Link>
                <Link href="/press" className="pt-join-link">المواد التعريفية: الملف الإعلامي ←</Link>
              </div>
            </div>
            <ul className="pt-join-gets">
              {JOIN.map((j) => (
                <li key={j.t}>
                  <strong>{j.t}</strong>
                  <span>{j.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PageShell>
  );
}
