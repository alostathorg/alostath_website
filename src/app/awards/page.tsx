import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getAwards } from "@/lib/queries";
import type { Award } from "@/lib/types";

export const revalidate = 60;
export const metadata: Metadata = { title: "الجوائز" };

const STATUS = {
  open: { cls: "is-open", label: "التقديم مفتوح" },
  soon: { cls: "is-soon", label: "التقديم يفتح قريباً" },
  closed: { cls: "is-closed", label: "أُغلق التقديم" },
} as const;

const THEME = {
  gold: { badge: "badge-gold", accent: "var(--gold-500)", shadow: "var(--gold-100)", offset: "translate(14px,14px)" },
  olive: { badge: "badge-olive", accent: "var(--olive-500)", shadow: "var(--olive-100)", offset: "translate(-14px,14px)" },
  sage: { badge: "badge-olive", accent: "var(--olive-500)", shadow: "var(--olive-100)", offset: "translate(-14px,14px)" },
} as const;

function AwardRow({ award, reverse }: { award: Award; reverse: boolean }) {
  const t = THEME[award.theme] ?? THEME.gold;
  const s = STATUS[award.status];
  const media = (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, transform: t.offset, background: t.shadow, borderRadius: 18, zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={award.hero_image_url ?? "/assets/alostath-logo.png"}
        alt={award.name}
        style={{ position: "relative", zIndex: 1, width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 18, display: "block", border: "1px solid var(--hairline)" }}
      />
    </div>
  );
  const body = (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ width: 40, height: 2, background: t.accent }} />
        <span className={`badge ${t.badge}`}>{award.badge_label}</span>
        <span className={`dp-status on-light ${s.cls}`} style={{ fontSize: 13, padding: "6px 13px 6px 11px" }}>
          <span className="dot" />
          {s.label}
        </span>
      </div>
      <h2 style={{ fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, margin: "0 0 18px" }}>{award.name}</h2>
      <p style={{ fontSize: 18, lineHeight: 1.95, color: "var(--text-muted)", margin: "0 0 20px" }}>{award.tagline}</p>
      <Link href={`/awards/${award.slug}`} className="btn btn-secondary btn-md">صفحة الجائزة الكاملة ←</Link>
    </div>
  );
  return (
    <div className="award-row" style={{ display: "grid", gridTemplateColumns: reverse ? "0.95fr 1.05fr" : "1.05fr 0.95fr", gap: 52, alignItems: "center" }}>
      {reverse ? <>{body}{media}</> : <>{media}{body}</>}
    </div>
  );
}

export default async function AwardsPage() {
  const awards = await getAwards();
  return (
    <PageShell active="awards">
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" style={{ position: "absolute", top: "50%", left: -60, transform: "translateY(-50%)", width: "min(820px,72%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "104px 32px 64px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16 }}>تقديرٌ واحتفاء</div>
          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.15, margin: 0, maxWidth: "16ch" }}>جوائز الأستاذ</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "24px 0 0", maxWidth: "64ch" }}>
            جوائز ومسابقات ثقافية تنافسية تكتشف وتُبرز المواهب الكامنة لدى المعلّمين والمعلّمات، وتنقلها إلى واجهة المشهد الثقافي والتربوي — بما يعزّز مكانة المعلّم ويُرسّخ ثقافة التقدير.
          </p>
        </div>
      </section>

      {awards.map((award, i) => {
        const shaded = i % 2 === 1;
        return (
          <section
            key={award.id}
            id={award.slug}
            data-reveal="1"
            style={shaded
              ? { background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }
              : { maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px 56px" }}
          >
            {shaded ? (
              <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px" }}>
                <AwardRow award={award} reverse />
              </div>
            ) : (
              <AwardRow award={award} reverse={false} />
            )}
          </section>
        );
      })}

      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        <div data-reveal="1" style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "84px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16 }}>تكاملٌ وطني</div>
          <p style={{ fontSize: "clamp(20px,2.6vw,28px)", fontWeight: 600, lineHeight: 1.65, margin: "0 0 18px" }}>تُنفَّذ جوائز الأستاذ في إطارٍ تكاملي مع وزارة التعليم ووزارة الثقافة وهيئاتها المتخصصة.</p>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 auto", maxWidth: "60ch" }}>بما يعزّز مواءمتها مع التوجّهات الوطنية، ويدعم استدامة أثرها الثقافي والتربوي على مكانة المعلّم.</p>
        </div>
      </section>

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px" }}>
        <div data-reveal="1" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, margin: "0 0 14px" }}>معلّمٌ صانعٌ للجمال والكلمة؟</h2>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 auto 32px", maxWidth: "56ch" }}>تابع إعلانات فتح باب الترشّح لجوائز الأستاذ عبر نشرتنا البريدية وقنواتنا الرسمية.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">تواصل معنا</Link>
        </div>
      </section>
    </PageShell>
  );
}
