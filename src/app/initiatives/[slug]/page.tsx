import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getInitiative, getInitiatives } from "@/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getInitiatives();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getInitiative(slug);
  return { title: item?.name ?? "المبادرات" };
}

const EA = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const ar = (n: number) => String(n).replace(/[0-9]/g, (d) => EA[+d]);

export default async function InitiativeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, all] = await Promise.all([getInitiative(slug), getInitiatives()]);
  if (!item) notFound();

  const sage = item.theme === "sage";
  const idx = all.findIndex((i) => i.slug === item.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  const regProps = { "data-register": item.name, "data-register-status": "interest" };
  const vcardStyle = sage
    ? { background: "var(--sage-50)", borderColor: "var(--sage-100)" }
    : { background: "var(--gold-50)", borderColor: "var(--gold-100)" };
  const stepNodeStyle = sage ? { background: "var(--sage-600)", color: "#fff" } : undefined;

  return (
    <PageShell active="initiatives">
      {/* HERO */}
      <section className="dp-hero">
        <span className="dp-orb dp-orb-gold" />
        <span className="dp-orb dp-orb-sage" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden style={{ position: "absolute", bottom: -70, left: -70, width: "min(540px,50%)", height: "auto", opacity: 0.05, pointerEvents: "none" }} />
        <div className="dp-hero-inner hero-in">
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--inverse-muted)", marginBottom: 26 }}>
            <Link href="/initiatives" style={{ color: "var(--inverse-muted)", textDecoration: "none" }}>المبادرات</Link>
            <span style={{ opacity: 0.6 }}>/</span>
            <span style={{ color: "var(--gold-500)" }}>{item.name}</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(191,155,47,0.16)", border: "1px solid rgba(191,155,47,0.4)", color: "var(--gold-500)", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 999, marginBottom: 22 }}>
            <span className="live-dot" />{item.badge}
          </span>
          <h1 style={{ fontSize: "clamp(44px,8vw,96px)", fontWeight: 700, lineHeight: 1.05, margin: 0 }}>{item.name.replace(/^مبادرة\s/, "")}</h1>
          <div className="dp-rule" style={{ margin: "30px 0 0", ...(sage ? { background: "var(--sage-500)" } : {}) }} />
          <p style={{ fontSize: "clamp(18px,2.2vw,24px)", lineHeight: 1.7, color: "var(--inverse-muted)", margin: "26px 0 0", maxWidth: "54ch" }}>{item.tagline}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 36 }}>
            <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
            <a href="#overview" className="btn btn-outline btn-lg" style={{ background: "transparent", color: "var(--ink-inverse)", borderColor: "rgba(244,246,238,0.4)" }}>اقرأ التفاصيل</a>
          </div>
        </div>
      </section>

      {/* FACTS */}
      {item.facts.length > 0 && (
        <div className="dp-facts" data-reveal="1">
          <div className="dp-facts-inner">
            {item.facts.map((f, i) => (
              <div key={i} className="dp-fact">
                <div className="dp-fact-ico" style={i === 2 ? { background: "var(--sage-50)", color: "var(--sage-700)" } : undefined}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
                </div>
                <div><div className="dp-fact-k">{f.k}</div><div className="dp-fact-v" style={i === 2 ? { color: "var(--sage-700)" } : undefined}>{f.v}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OVERVIEW */}
      <section id="overview" data-reveal="1" style={{ maxWidth: 880, margin: "0 auto", padding: "72px 32px 40px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 16 }}>نظرة عامة</div>
        <p style={{ fontSize: "clamp(20px,2.4vw,26px)", lineHeight: 1.85, color: "var(--text-body)", fontWeight: 500, margin: 0 }}>{item.overview}</p>
      </section>

      {/* GOAL */}
      {item.goal && (
        <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px 56px" }}>
          <div style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)", borderRadius: 20, padding: "clamp(36px,5vw,64px)" }}>
            <div style={{ position: "relative", maxWidth: "62ch" }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 14 }}>الهدف</div>
              <p style={{ fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{item.goal}</p>
            </div>
          </div>
        </section>
      )}

      {/* VALUE CARDS */}
      {item.value_cards.length > 0 && (
        <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px 56px" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, margin: "0 0 28px" }}>القيمة المضافة للمعلّم</h2>
          <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 18 }}>
            {item.value_cards.map((v, i) => (
              <div key={i} className="dp-vcard" style={vcardStyle}>
                <div className="dp-vcard-num">{ar(i + 1).padStart(2, "٠")}</div>
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "var(--ink)" }}>{v.title}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)" }}>{v.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEPS */}
      {item.steps.length > 0 && (
        <section data-reveal="1" style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "72px 32px" }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, margin: "0 0 48px", textAlign: "center" }}>كيف تعمل المبادرة</h2>
            <div className="dp-steps" data-reveal-group style={{ ["--step-count" as string]: item.steps.length }}>
              {item.steps.map((s, i) => (
                <div key={i} className="dp-step"><div className="dp-step-node" style={stepNodeStyle}>{ar(i + 1)}</div><h3>{s.title}</h3><p>{s.body}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNERS */}
      {item.partners.length > 0 && (
        <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "72px 32px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 }}>الشريك المختص</div>
              <h2 style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, margin: "0 0 16px" }}>شراكةٌ تصنع الأثر</h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 }}>تُنفَّذ المبادرة بالتكامل مع جهاتٍ متخصصة تضمن جودة التنفيذ واستمرارية الأثر.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {item.partners.map((p) => (
                <span key={p} style={{ fontSize: 15, fontWeight: 500, background: "var(--surface-1)", border: "1px solid var(--hairline)", padding: "12px 20px", borderRadius: 12 }}>{p}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PAGER */}
      {all.length > 1 && (
        <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            <Link href={`/initiatives/${prev.slug}`} className="dp-pager is-prev">
              <span className="dp-pager-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
              <span className="dp-pager-text"><div className="k">المبادرة السابقة</div><div className="t">{prev.name}</div></span>
            </Link>
            <Link href={`/initiatives/${next.slug}`} className="dp-pager is-next">
              <span className="dp-pager-text"><div className="k">المبادرة التالية</div><div className="t">{next.name}</div></span>
              <span className="dp-pager-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg></span>
            </Link>
          </div>
        </section>
      )}
    </PageShell>
  );
}
