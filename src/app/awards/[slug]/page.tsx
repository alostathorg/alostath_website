import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { DetailFigure, DetailPager, Monument, SectionHead } from "@/components/DetailKit";
import { getAward, getAwards } from "@/lib/queries";

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

const PHASE_CLS = { done: "is-done", now: "is-now", next: "is-next" } as const;

export default async function AwardDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [award, all] = await Promise.all([getAward(slug), getAwards()]);
  if (!award) notFound();

  const sage = award.theme === "sage";
  const tone = sage ? "sage" : "gold";
  const status = HERO_STATUS[award.status];
  const cats = award.categories.join(",");
  const phases = award.award_timeline_phases ?? [];

  const idx = all.findIndex((a) => a.slug === award.slug);
  const prevAward = idx > 0 ? all[idx - 1] : null;
  const nextAward = idx !== -1 && idx < all.length - 1 ? all[idx + 1] : null;

  const regProps = {
    "data-register": award.name,
    "data-register-status": award.status,
    "data-register-categories": cats,
  };

  // The chapters are numbered in the order they appear, and a chapter that has
  // no content for this award (no categories, no phases) never takes a number.
  let chapter = 0;
  const next = () => (chapter += 1);

  return (
    <PageShell active="awards">
      <PageHero
        size="lg"
        tone={tone}
        crumbs={[{ label: "الجوائز", href: "/awards" }, { label: award.name }]}
        badge={
          <span className={`ph-badge${sage ? " is-sage" : ""}`}>
            <span className="live-dot" />
            {award.badge_label}
          </span>
        }
        title={award.name}
        lede={award.tagline}
        meta={<div className={`dp-status ${status.cls}`}><span className="dot" />{status.label}</div>}
        actions={
          <>
            <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
            <a href="#overview" className="btn btn-outline btn-on-dark btn-lg">عن الجائزة</a>
          </>
        }
      />

      {/* FACTS */}
      <div className="dp-facts" data-reveal="1">
        <div className="dp-facts-inner">
          <Fact k="النوع" v={award.type ?? ""} icon={<IconAward />} />
          <Fact k="المجالات" v={award.categories.join(" · ")} icon={<IconTag />} />
          <Fact k="المستفيدون" v={award.beneficiaries ?? ""} icon={<IconPeople />} tone="sage" />
        </div>
      </div>

      {/* OVERVIEW */}
      <section id="overview" className="dp-sec is-narrow" data-reveal="1">
        <SectionHead index={next()} eyebrow="عن الجائزة" tone={tone} />
        <p className="dp-prose">{award.overview}</p>
      </section>

      {/* PLATE — the photograph the listing row shows and this page never did */}
      {award.hero_image_url && (
        <section className="dp-sec is-tight" data-reveal="1">
          <DetailFigure src={award.hero_image_url} alt={award.name} tone={tone} />
        </section>
      )}

      {/* GOAL */}
      {award.goal && (
        <section className="dp-sec" data-reveal="1">
          <Monument
            tone={tone}
            head={<SectionHead index={next()} eyebrow="الهدف" onDark />}
            quote={award.goal}
          />
        </section>
      )}

      {/* CATEGORIES */}
      {award.categories.length > 0 && (
        <section className="dp-sec" data-reveal="1">
          <SectionHead
            index={next()}
            eyebrow="مجالات المشاركة"
            title="مجالات الجائزة"
            tone={tone}
          />
          <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
            {award.categories.map((c, i) => (
              <div key={c} className="dp-cat">
                <span className="dp-cat-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{c}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEPS */}
      {award.steps.length > 0 && (
        <section className="dp-shade" data-reveal="1">
          <div className="dp-sec">
            <SectionHead
              index={next()}
              eyebrow="خطوة بخطوة"
              title="كيف تشارك؟"
              tone={tone}
              center
            />
            <div className="dp-steps" data-reveal-group style={{ ["--step-count" as string]: award.steps.length }}>
              {award.steps.map((s, i) => (
                <div key={i} className="dp-step"><div className="dp-step-node">{i + 1}</div><h3>{s.title}</h3><p>{s.body}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE — prose and sequence stay narrow; only grids take the full width */}
      {phases.length > 0 && (
        <section className="dp-sec is-narrow" data-reveal="1">
          <SectionHead
            index={next()}
            eyebrow="مسار التقديم"
            title="الجدول الزمني للجائزة"
            tone={tone}
          />
          <div className="dp-flow">
            <div className="dp-timeline">
              {phases.map((p, i) => (
                <div key={p.id} className={`dp-tl-item ${PHASE_CLS[p.state]}`}>
                  <div className="dp-tl-rail"><div className="dp-tl-dot">{i + 1}</div></div>
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

      {/* PARTNERSHIP — the closing statement, not a chapter */}
      {award.partnership_note && (
        <section className="dp-sec" data-reveal="1">
          <Monument
            tone={tone}
            center
            head={<SectionHead eyebrow="تكاملٌ وطني" onDark center />}
            quote={award.partnership_note}
          />
        </section>
      )}

      {/* RAIL */}
      <section className="dp-sec is-tight" style={{ paddingBottom: "clamp(56px,7vw,84px)" }}>
        <DetailPager
          all={{ href: "/awards", label: "كل الجوائز" }}
          prev={prevAward ? { href: `/awards/${prevAward.slug}`, label: "الجائزة السابقة", title: prevAward.name } : null}
          next={nextAward ? { href: `/awards/${nextAward.slug}`, label: "الجائزة التالية", title: nextAward.name } : null}
        />
      </section>
    </PageShell>
  );
}

function Fact({ k, v, icon, tone }: { k: string; v: string; icon: React.ReactNode; tone?: "sage" }) {
  const tinted = tone === "sage";
  return (
    <div className="dp-fact">
      <div className="dp-fact-ico" style={tinted ? { background: "var(--sage-50)", color: "var(--sage-700)" } : undefined}>
        {icon}
      </div>
      <div>
        <div className="dp-fact-k">{k}</div>
        <div className="dp-fact-v" style={tinted ? { color: "var(--sage-700)" } : undefined}>{v}</div>
      </div>
    </div>
  );
}

const ico = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function IconAward() {
  return (
    <svg {...ico}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
  );
}

function IconTag() {
  return (
    <svg {...ico}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  );
}

function IconPeople() {
  return (
    <svg {...ico}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  );
}
