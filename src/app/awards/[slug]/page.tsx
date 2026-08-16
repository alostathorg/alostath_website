import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getAward, getAwards } from "@/lib/queries";
import type { Award } from "@/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const awards = await getAwards();
  return awards.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const award = await getAward(slug);
  return { title: award?.name ?? "الجوائز" };
}

const HERO_STATUS = {
  open: { cls: "is-open", label: "التقديم مفتوح الآن" },
  soon: { cls: "is-soon", label: "التقديم يفتح قريباً" },
  closed: { cls: "is-closed", label: "أُغلق التقديم" },
} as const;

const EA = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const ar = (n: number) => String(n).replace(/[0-9]/g, (d) => EA[+d]);

const PHASE_CLS = { done: "is-done", now: "is-now", next: "is-next" } as const;

export default async function AwardDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [award, all] = await Promise.all([getAward(slug), getAwards()]);
  if (!award) notFound();

  const sage = award.theme === "sage";
  const status = HERO_STATUS[award.status];
  const cats = award.categories.join(",");
  const phases = award.award_timeline_phases ?? [];

  const idx = all.findIndex((a) => a.slug === award.slug);
  const other = all[(idx + 1) % all.length];
  const showPager = other && other.slug !== award.slug;

  const regProps = {
    "data-register": award.name,
    "data-register-status": award.status,
    "data-register-categories": cats,
  };

  return (
    <PageShell active="awards">
      {/* HERO */}
      <section className="dp-hero">
        <span className="dp-orb dp-orb-gold" />
        <span className="dp-orb dp-orb-sage" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden style={{ position: "absolute", bottom: -70, left: -70, width: "min(540px,50%)", height: "auto", opacity: 0.05, pointerEvents: "none" }} />
        <div className="dp-hero-inner hero-in">
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--inverse-muted)", marginBottom: 26 }}>
            <Link href="/awards" style={{ color: "var(--inverse-muted)", textDecoration: "none" }}>الجوائز</Link>
            <span style={{ opacity: 0.6 }}>/</span>
            <span style={{ color: "var(--gold-500)" }}>{award.name}</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, background: sage ? "rgba(120,161,131,0.22)" : "rgba(191,155,47,0.16)", border: `1px solid ${sage ? "rgba(120,161,131,0.5)" : "rgba(191,155,47,0.4)"}`, color: sage ? "#cfe3d5" : "var(--gold-500)", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 999, marginBottom: 22 }}>
            <span className="live-dot" />{award.badge_label}
          </span>
          <h1 style={{ fontSize: "clamp(40px,7vw,84px)", fontWeight: 700, lineHeight: 1.06, margin: 0, maxWidth: "18ch" }}>{award.name}</h1>
          <div className="dp-rule" style={{ margin: "30px 0 0", ...(sage ? { background: "var(--sage-500)" } : {}) }} />
          <p style={{ fontSize: "clamp(18px,2.2vw,24px)", lineHeight: 1.7, color: "var(--inverse-muted)", margin: "26px 0 0", maxWidth: "54ch" }}>{award.tagline}</p>
          <div className={`dp-status ${status.cls}`} style={{ marginTop: 30 }}><span className="dot" />{status.label}</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 20 }}>
            <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
            <a href="#overview" className="btn btn-outline btn-lg" style={{ background: "transparent", color: "var(--ink-inverse)", borderColor: "rgba(244,246,238,0.4)" }}>عن الجائزة</a>
          </div>
        </div>
      </section>

      {/* FACTS */}
      <div className="dp-facts" data-reveal="1">
        <div className="dp-facts-inner">
          <Fact k="النوع" v={award.type ?? ""} />
          <Fact k="المجالات" v={award.categories.join(" · ")} />
          <Fact k="المستفيدون" v={award.beneficiaries ?? ""} />
        </div>
      </div>

      {/* OVERVIEW */}
      <section id="overview" data-reveal="1" style={{ maxWidth: 880, margin: "0 auto", padding: "72px 32px 40px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 16 }}>عن الجائزة</div>
        <p style={{ fontSize: "clamp(20px,2.4vw,26px)", lineHeight: 1.9, color: "var(--text-body)", fontWeight: 500, margin: 0 }}>{award.overview}</p>
      </section>

      {/* GOAL */}
      <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px 56px" }}>
        <div style={{ position: "relative", overflow: "hidden", background: sage ? "var(--olive-50)" : "var(--gold-50)", border: `1px solid ${sage ? "var(--olive-100)" : "var(--gold-100)"}`, borderRadius: 20, padding: "clamp(36px,5vw,60px)" }}>
          <div style={{ maxWidth: "64ch" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: sage ? "var(--olive-700)" : "var(--gold-700)", textTransform: "uppercase", marginBottom: 14 }}>الهدف</div>
            <p style={{ fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 600, lineHeight: 1.6, margin: 0, color: "var(--ink)" }}>{award.goal}</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {award.categories.length > 0 && (
        <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px 56px" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, margin: "0 0 24px" }}>مجالات الجائزة</h2>
          <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18 }}>
            {award.categories.map((c) => (
              <div key={c} className="dp-cat"><div className="dp-cat-ico"><IconTag /></div><h3>{c}</h3></div>
            ))}
          </div>
        </section>
      )}

      {/* STEPS */}
      {award.steps.length > 0 && (
        <section data-reveal="1" style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "72px 32px" }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, margin: "0 0 48px", textAlign: "center" }}>كيف تشارك؟</h2>
            <div className="dp-steps" data-reveal-group style={{ ["--step-count" as string]: award.steps.length }}>
              {award.steps.map((s, i) => (
                <div key={i} className="dp-step"><div className="dp-step-node">{ar(i + 1)}</div><h3>{s.title}</h3><p>{s.body}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE */}
      {phases.length > 0 && (
        <section data-reveal="1" style={{ maxWidth: 820, margin: "0 auto", padding: "64px 32px 24px" }}>
          <div className="dp-flow">
            <div className="dp-flow-head">
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 12 }}>مسار التقديم</div>
              <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 700, margin: 0 }}>الجدول الزمني للجائزة</h2>
            </div>
            <div className="dp-timeline">
              {phases.map((p, i) => (
                <div key={p.id} className={`dp-tl-item ${PHASE_CLS[p.state]}`}>
                  <div className="dp-tl-rail"><div className="dp-tl-dot">{ar(i + 1)}</div></div>
                  <div className="dp-tl-body">
                    <div className="dp-tl-top">
                      <span className="dp-tl-phase">{p.label}</span>
                      {p.tag_text ? <span className="dp-tl-tag">{p.tag_text}</span> : null}
                    </div>
                    <div className="dp-tl-date">{p.date_text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="dp-flow-cta">
              <div className="msg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                {award.status === "open" ? "باب التسجيل مفتوح — لا تفوّت الموعد." : "سجّل اهتمامك ليصلك إشعار فور فتح الباب."}
              </div>
              <button type="button" {...regProps} className="btn btn-primary btn-md">
                {award.status === "open" ? "قدّم عملك الآن" : "سجّل اهتمامك"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PARTNERSHIP */}
      {award.partnership_note && (
        <section data-reveal="1" style={{ maxWidth: 920, margin: "0 auto", padding: "48px 32px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 }}>تكاملٌ وطني</div>
          <p style={{ fontSize: "clamp(19px,2.4vw,26px)", fontWeight: 600, lineHeight: 1.7, margin: 0, color: "var(--text-body)" }}>{award.partnership_note}</p>
        </section>
      )}

      {/* PAGER */}
      {showPager && (
        <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px 72px" }}>
          <Link href={`/awards/${other.slug}`} className="dp-pager is-next">
            <span className="dp-pager-text"><div className="k">الجائزة التالية</div><div className="t">{other.name}</div></span>
            <span className="dp-pager-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg></span>
          </Link>
        </section>
      )}
    </PageShell>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="dp-fact">
      <div className="dp-fact-ico"><IconTag /></div>
      <div><div className="dp-fact-k">{k}</div><div className="dp-fact-v">{v}</div></div>
    </div>
  );
}

function IconTag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><circle cx="11" cy="11" r="2" />
    </svg>
  );
}
