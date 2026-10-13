import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { NATIONAL_AWARD as A } from "@/lib/award";

export const metadata: Metadata = { title: A.name };

// ── الجائزة الوطنية للمعلم ──
// The foundation's only award, so this page is the award itself, not a list.
// Public summary only: the founding study behind it stays internal.

const regProps = { "data-register": A.name, "data-register-status": A.status };

export default function AwardsPage() {
  return (
    <PageShell active="awards">
      <PageHero
        size="lg"
        badge={<span className="ph-badge"><span className="live-dot" />{A.badge}</span>}
        title={A.name}
        lede={A.tagline}
        meta={<div className="dp-status is-soon"><span className="dot" />{A.statusLabel}</div>}
        actions={
          <>
            <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
            <a href="#overview" className="btn btn-outline btn-on-dark btn-lg">عن الجائزة</a>
          </>
        }
      />

      <section id="overview" className="aw-wrap aw-about" data-reveal="1">
        <div className="aw-intro">
          <div>
            <div className="kicker">عن الجائزة</div>
            <h2 className="aw-title">تقديرٌ يتحوّل إلى تمكين</h2>
            <p className="aw-lead">{A.overview}</p>
          </div>
          <figure className="aw-intro-fig">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={A.image} alt={A.name} />
          </figure>
        </div>
        <dl className="aw-keys">
          <div><dt>تستهدف</dt><dd>{A.beneficiaries}</dd></div>
          <div><dt>النطاق</dt><dd>{A.scope}</dd></div>
          <div><dt>منهجية التقييم</dt><dd>التحقّق الميداني من الممارسة وأثرها</dd></div>
        </dl>
      </section>

      <section className="aw-close">
        <div className="aw-close-in" data-reveal="1">
          <div className="kicker is-gold is-center">{A.statusLabel}</div>
          <h2>كن أول من يعلم</h2>
          <p>سجّل اهتمامك ليصلك إشعار فور فتح باب الترشّح. ونرحّب بالجهات الراغبة في دعم الجائزة الوطنية للمعلّم والشراكة فيها.</p>
          <div className="aw-close-actions">
            <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
            <Link href="/contact" className="btn btn-outline btn-on-dark btn-lg">تواصل معنا للشراكة</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
