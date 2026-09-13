import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { DetailFigure, DetailPager, Monument, SectionHead } from "@/components/DetailKit";
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

export default async function InitiativeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, all] = await Promise.all([getInitiative(slug), getInitiatives()]);
  if (!item) notFound();

  const sage = item.theme === "sage";
  const tone = sage ? "sage" : "gold";
  const idx = all.findIndex((i) => i.slug === item.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const nextItem = idx !== -1 && idx < all.length - 1 ? all[idx + 1] : null;

  const regProps = { "data-register": item.name, "data-register-status": "interest" };
  const vcardStyle = sage
    ? { background: "var(--sage-50)", borderColor: "var(--sage-100)" }
    : { background: "var(--gold-50)", borderColor: "var(--gold-100)" };
  const stepNodeStyle = sage ? { background: "var(--sage-600)", color: "#fff" } : undefined;

  // A photograph gets the letterbox; a wordmark (مُشير) is set on a light well
  // instead, so it is never cropped to fit a crop it was not drawn for.
  const plate = item.hero_image_url
    ? { src: item.hero_image_url, mark: false }
    : item.logo_url
      ? { src: item.logo_url, mark: true }
      : null;

  let chapter = 0;
  const next = () => (chapter += 1);

  return (
    <PageShell active="initiatives">
      <PageHero
        size="lg"
        tone={tone}
        crumbs={[{ label: "المبادرات", href: "/initiatives" }, { label: item.name }]}
        badge={
          <span className={`ph-badge${sage ? " is-sage" : ""}`}>
            <span className="live-dot" />
            {item.badge}
          </span>
        }
        title={item.name.replace(/^مبادرة\s/, "")}
        lede={item.tagline}
        actions={
          <>
            <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
            <a href="#overview" className="btn btn-outline btn-on-dark btn-lg">اقرأ التفاصيل</a>
          </>
        }
      />

      {/* FACTS */}
      {item.facts.length > 0 && (
        <div className="dp-facts" data-reveal="1">
          <div className="dp-facts-inner">
            {item.facts.map((f, i) => (
              <div key={i} className="dp-fact">
                <div className="dp-fact-ico" style={i === 2 ? { background: "var(--sage-50)", color: "var(--sage-700)" } : undefined}>
                  {FACT_ICONS[i % FACT_ICONS.length]}
                </div>
                <div><div className="dp-fact-k">{f.k}</div><div className="dp-fact-v" style={i === 2 ? { color: "var(--sage-700)" } : undefined}>{f.v}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OVERVIEW */}
      <section id="overview" className="dp-sec is-narrow" data-reveal="1">
        <SectionHead index={next()} eyebrow="نظرة عامة" tone={tone} />
        <p className="dp-prose">{item.overview}</p>
      </section>

      {/* PLATE */}
      {plate && (
        <section className="dp-sec is-tight" data-reveal="1">
          <DetailFigure src={plate.src} alt={item.name} mark={plate.mark} tone={tone} />
        </section>
      )}

      {/* GOAL */}
      {item.goal && (
        <section className="dp-sec" data-reveal="1">
          <Monument
            tone={tone}
            head={<SectionHead index={next()} eyebrow="الهدف" onDark />}
            quote={item.goal}
          />
        </section>
      )}

      {/* VALUE CARDS */}
      {item.value_cards.length > 0 && (
        <section className="dp-sec" data-reveal="1">
          <SectionHead
            index={next()}
            eyebrow="ما الذي يكسبه المعلّم"
            title="القيمة المضافة للمعلّم"
            tone={tone}
          />
          <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 18 }}>
            {item.value_cards.map((v, i) => (
              <div key={i} className="dp-vcard" style={vcardStyle}>
                <div className="dp-vcard-num">{String(i + 1).padStart(2, "0")}</div>
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "var(--ink)" }}>{v.title}</div>
                  <div className="txt-justify" style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)" }}>{v.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEPS */}
      {item.steps.length > 0 && (
        <section className="dp-shade" data-reveal="1">
          <div className="dp-sec">
            <SectionHead
              index={next()}
              eyebrow="من الترشيح إلى الأثر"
              title="كيف تعمل المبادرة"
              tone={tone}
              center
            />
            <div className="dp-steps" data-reveal-group style={{ ["--step-count" as string]: item.steps.length }}>
              {item.steps.map((s, i) => (
                <div key={i} className="dp-step"><div className="dp-step-node" style={stepNodeStyle}>{i + 1}</div><h3>{s.title}</h3><p>{s.body}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNERS */}
      {item.partners.length > 0 && (
        <section className="dp-sec" data-reveal="1">
          <SectionHead index={next()} eyebrow="الشريك المختص" tone={tone} />
          <div className="dp-panel is-split">
            <div>
              <h2 style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, margin: "0 0 14px" }}>شراكةٌ تصنع الأثر</h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 }}>تُنفَّذ المبادرة بالتكامل مع جهاتٍ متخصصة تضمن جودة التنفيذ واستمرارية الأثر.</p>
            </div>
            <div className="dp-chips">
              {item.partners.map((p) => (
                <span key={p} className="dp-chip">{p}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COMMUNITY — the concrete "help develop this initiative" path.
          Deep-links the idea form with this initiative preselected. */}
      <section className="dp-sec is-tight" data-reveal="1">
        <div className="dp-panel is-split is-olive">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>صوت الميدان</div>
            <h2 style={{ fontSize: "clamp(22px,2.8vw,30px)", fontWeight: 700, margin: "0 0 10px" }}>لديك فكرة تطوّر «{item.name}»؟</h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 }}>
              أنت الأقرب إلى الميدان. شارك أعضاء مجتمع الأستاذ رأيك في هذه المبادرة أو اقترح ما
              يجعلها أقرب إلى حاجة المعلّم.
            </p>
          </div>
          <div style={{ justifySelf: "end" }}>
            <Link href={`/community?initiative=${item.slug}#idea`} className="btn btn-primary btn-lg">
              شارك بفكرة
            </Link>
          </div>
        </div>
      </section>

      {/* RAIL */}
      <section className="dp-sec is-tight" style={{ paddingBottom: "clamp(56px,7vw,84px)" }}>
        <DetailPager
          all={{ href: "/initiatives", label: "كل المبادرات" }}
          prev={prev ? { href: `/initiatives/${prev.slug}`, label: "المبادرة السابقة", title: prev.name } : null}
          next={nextItem ? { href: `/initiatives/${nextItem.slug}`, label: "المبادرة التالية", title: nextItem.name } : null}
        />
      </section>
    </PageShell>
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

/** The facts are CMS-authored key/value pairs, so the icons index the slot
    (النوع / المجال / الحالة) rather than claim to read the value. */
const FACT_ICONS = [
  <svg key="compass" {...ico}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>,
  <svg key="grid" {...ico}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  <svg key="pulse" {...ico}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
];
