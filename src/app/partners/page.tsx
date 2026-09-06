import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getBrandPartners } from "@/lib/queries";
import type { BrandPartner } from "@/lib/types";
import {
  PARTNERS_DISCLAIMER,
  PARTNERS_NAV_LABEL,
  PARTNERS_PATH,
  blurbFor,
  categoryLabel,
  ctaFor,
  pricingLabel,
  text,
} from "@/lib/brandPartners";
import { PartnerLogo } from "./PartnerBits";

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

const outlineOnDark = { background: "transparent", color: "var(--ink-inverse)", borderColor: "rgba(244,246,238,0.4)" } as const;

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function PartnerCard({ p }: { p: BrandPartner }) {
  const offer = text(p.teacher_offer);
  const { hostname } = ctaFor(p);
  return (
    <Link href={`${PARTNERS_PATH}/${p.slug}`} className={`bp-card card-lift${p.featured ? " is-featured" : ""}`}>
      <div className="bp-logo-well">
        <PartnerLogo partner={p} />
        {p.featured && <span className="badge badge-gold bp-flag">شريك مميّز</span>}
      </div>
      <div className="bp-body">
        <div className="bp-meta">
          <span className="badge badge-olive">{categoryLabel(p.category)}</span>
          <span className={`badge ${p.pricing === "free" ? "badge-sage" : "badge-neutral"}`}>{pricingLabel(p.pricing)}</span>
        </div>
        <h3 className="bp-name">{p.name}</h3>
        <p className="bp-tagline">{blurbFor(p)}</p>
        {offer && (
          <div className="bp-offer">
            <TagIcon />
            <span>{offer}</span>
          </div>
        )}
        <div className="bp-foot">
          <span className="arrow-link" style={{ fontSize: 14 }}>
            تعرّف على الشريك <span className="arrow-link__a">←</span>
          </span>
          {hostname && <span className="bp-domain" dir="ltr">{hostname}</span>}
        </div>
      </div>
    </Link>
  );
}

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
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden style={{ position: "absolute", top: "50%", left: -60, transform: "translateY(-50%)", width: "min(820px,72%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "104px 32px 64px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16 }}>{PARTNERS_NAV_LABEL} — شركاء المعلّم</div>
          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.15, margin: 0, maxWidth: "18ch" }}>علاماتٌ تجارية تدعم المعلّم</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "24px 0 0", maxWidth: "64ch" }}>
            أدواتٌ وخدماتٌ وحلولٌ تعليمية اختارتها مؤسسة الأستاذ لأنها تخدم المعلّم فعلاً. كل بطاقة تخبرك بما تقدّمه العلامة، ولمن، وبأي كلفة، وهل لديها عرضٌ خاص للمعلّم — ثم تنتقل إلى موقعها مباشرة.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
            {!empty && <a href="#grid" className="btn btn-secondary btn-lg">تصفّح الشركاء</a>}
            <Link href="/contact" className={`btn ${empty ? "btn-secondary" : "btn-outline"} btn-lg`} style={empty ? undefined : outlineOnDark}>
              كن شريكاً للمعلّم
            </Link>
          </div>
        </div>
      </section>

      {/* SELECTION CRITERIA */}
      <section style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--hairline)" }}>
        <div data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "48px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 700, alignSelf: "center" }}>
            كيف نختار الشركاء
            <div style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.7 }}>كل علامة هنا استوفت ثلاثة شروط</div>
          </div>
          {CRITERIA.map((c) => (
            <div key={c.t} style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 600, color: "var(--olive-600)", marginBottom: 4 }}>{c.t}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section id="grid" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: empty ? "72px 32px 96px" : "64px 32px 24px" }}>
        {empty ? (
          <EmptyState />
        ) : (
          <>
            <div data-reveal="1" style={{ marginBottom: 40 }}>
              {/* .eyebrow is inline-block; the wrapper keeps it on its own line above the heading */}
              <div><span className="eyebrow" style={{ marginBottom: 14 }}>شركاء المعلّم</span></div>
              <h2 className="h-accent" style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 700, margin: 0, display: "inline-block" }}>العلامات الشريكة</h2>
            </div>
            <div className="bp-grid" data-reveal-group>
              {partners.map((p) => (
                <PartnerCard key={p.id} p={p} />
              ))}
            </div>
            <p className="bp-disclaimer">{PARTNERS_DISCLAIMER}</p>
          </>
        )}
      </section>

      {/* BECOME A PARTNER — hidden in the empty state, which already invites brands */}
      {!empty && (
        <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)", marginTop: 56 }}>
          <div data-reveal="1" style={{ position: "relative", maxWidth: 820, margin: "0 auto", padding: "84px 32px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, lineHeight: 1.4, margin: "0 0 14px" }}>هل تقدّم علامتك ما يخدم المعلّم؟</h2>
            <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 0 32px" }}>
              نمنح الشريك صفحةً تعريفية وظهوراً أمام مجتمع المعلّمين، مقابل عرضٍ واضح يخدمهم. تخضع الطلبات للمراجعة وفق معايير المؤسسة قبل النشر.
            </p>
            <Link href="/contact" className="btn btn-secondary btn-lg">قدّم طلب شراكة</Link>
          </div>
        </section>
      )}
    </PageShell>
  );
}
