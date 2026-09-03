import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getInitiatives } from "@/lib/queries";
import type { Initiative } from "@/lib/types";

export const revalidate = 60;
export const metadata: Metadata = { title: "المبادرات" };

const CONDITIONS = [
  { t: "تخدم المعلّم", d: "موجّهة لاحتياجاته الحقيقية" },
  { t: "مستدامة", d: "نموذج قابل للاستمرار" },
  { t: "شريكٌ مختص", d: "يضمن جودة التنفيذ" },
];

function Row({ initiative, reverse }: { initiative: Initiative; reverse: boolean }) {
  const media = (
    <div className="initiative-row-media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={initiative.hero_image_url ?? initiative.logo_url ?? "/assets/alostath-logo.png"}
        alt={initiative.name}
        style={initiative.logo_url && !initiative.hero_image_url ? { background: "var(--surface-1)" } : undefined}
      />
    </div>
  );
  return (
    <div className={`initiative-row${reverse ? " is-rev" : ""}`}>
      {media}
      <div className="initiative-row-body">
        <h2 style={{ fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 700, margin: "0 0 16px", color: "var(--ink)" }}>{initiative.name}</h2>
        <p style={{ fontSize: "clamp(16px,1.6vw,18px)", lineHeight: 1.95, color: "var(--text-body)", margin: "0 0 28px" }}>{initiative.overview ?? initiative.tagline}</p>
        <Link href={`/initiatives/${initiative.slug}`} className="btn btn-secondary btn-md">اقرأ صفحة المبادرة الكاملة ←</Link>
      </div>
    </div>
  );
}

export default async function InitiativesPage() {
  const initiatives = await getInitiatives();
  return (
    <PageShell active="initiatives">
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" style={{ position: "absolute", top: "50%", left: -60, transform: "translateY(-50%)", width: "min(820px,72%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "104px 32px 64px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16 }}>الريادة في تعزيز مكانة المعلّم</div>
          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.15, margin: 0, maxWidth: "18ch" }}>أبرز مبادرات الأستاذ</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "24px 0 0", maxWidth: "64ch" }}>
            حزمةٌ من البرامج والخدمات والفرص المتنوّعة التي تعزّز جودة حياة المعلّم وتمكّنه مهنيّاً ومعيشيّاً — وتنقل خدمته من البُعد التربوي إلى الأبعاد الثقافية والتراثية والإعلامية.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
            {initiatives.map((i) => (
              <a key={i.id} className="idx-pill" href={`#${i.slug}`} style={{ textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "9px 18px", borderRadius: 9999, background: "rgba(244,246,238,0.06)", border: "1px solid rgba(244,246,238,0.18)", color: "var(--inverse-muted)", whiteSpace: "nowrap" }}>{i.name}</a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--hairline)" }}>
        <div data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "48px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 700, alignSelf: "center" }}>
            شروط قبول المبادرة
            <div style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.7 }}>كل مبادرة تستوفي معايير المنظومة</div>
          </div>
          {CONDITIONS.map((c) => (
            <div key={c.t} style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 600, color: "var(--olive-600)", marginBottom: 4 }}>{c.t}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {initiatives.map((initiative, i) => {
        const shaded = i % 2 === 1;
        return (
          <section
            key={initiative.id}
            id={initiative.slug}
            data-reveal="1"
            style={shaded
              ? { background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }
              : { maxWidth: "var(--container-max)", margin: "0 auto", padding: "56px 32px" }}
          >
            {shaded ? (
              <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "64px 32px" }}>
                <Row initiative={initiative} reverse />
              </div>
            ) : (
              <Row initiative={initiative} reverse={false} />
            )}
          </section>
        );
      })}

      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        <div data-reveal="1" style={{ position: "relative", maxWidth: 820, margin: "0 auto", padding: "84px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, lineHeight: 1.4, margin: "0 0 14px" }}>هل لديك فكرة مبادرةٍ تخدم المعلّم؟</h2>
          <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 0 32px" }}>نرحّب بالشركاء المتخصصين الراغبين في إطلاق مبادراتٍ مستدامة ضمن منظومة الأستاذ.</p>
          <Link href="/contact" className="btn btn-secondary btn-lg">تواصل معنا للشراكة</Link>
        </div>
      </section>
    </PageShell>
  );
}
