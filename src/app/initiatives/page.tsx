import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CriteriaBand from "@/components/CriteriaBand";
import { getInitiatives } from "@/lib/queries";
import type { Initiative } from "@/lib/types";

export const revalidate = 60;
export const metadata: Metadata = { title: "المبادرات" };

const CONDITIONS = [
  { t: "تخدم المعلّم وتكون مستدامة", d: "موجّهة لاحتياجاته بنموذجٍ قابل للاستمرار" },
  { t: "تتكامل مع وزارة التعليم", d: "مع برامجها وتوجّهاتها الوطنية" },
  { t: "يقودها شريكٌ مختص", d: "يضمن جودة التنفيذ واستمرارية الأثر" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One programme in the portfolio. The cover is its photograph when it has
 * one; otherwise it is cut from the brand stage in the programme's own theme,
 * with its logo on a plate or, failing that, its name set large.
 */
function ProgramCard({ initiative, index, featured = false }: { initiative: Initiative; index: number; featured?: boolean }) {
  const name = initiative.name.replace(/^مبادرة\s/, "");
  const facts = (initiative.facts ?? []).slice(0, featured ? 3 : 2);
  return (
    <Link
      id={initiative.slug}
      href={`/initiatives/${initiative.slug}`}
      className={`in-card is-${initiative.theme === "sage" ? "sage" : "gold"}${featured ? " is-featured" : ""}`}
      data-reveal="1"
    >
      <div className="in-cover">
        {initiative.hero_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="in-cover-photo" src={initiative.hero_image_url} alt="" loading={featured ? "eager" : "lazy"} />
        ) : initiative.logo_url ? (
          <span className="in-cover-plate">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={initiative.logo_url} alt="" loading="lazy" />
          </span>
        ) : (
          <span className="in-cover-word" aria-hidden>{name}</span>
        )}
        <span className="in-cover-n" aria-hidden>{pad(index + 1)}</span>
        {initiative.badge && <span className="in-badge">{initiative.badge}</span>}
      </div>
      <div className="in-body">
        <h2 className="in-name">{initiative.name}</h2>
        {initiative.tagline && <p className="in-tagline">{initiative.tagline}</p>}
        {facts.length > 0 && (
          <dl className="in-facts">
            {facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className="in-go">
          استكشف المبادرة
          <span className="in-go-arrow" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          </span>
        </span>
      </div>
    </Link>
  );
}

// The path a proposal takes, read off the three conditions above.
const PROPOSE = [
  { t: "شاركنا الفكرة", d: "عرّفنا بالمبادرة والجهة المختصة التي ستقودها." },
  { t: "نراجعها مع الشروط", d: "خدمة المعلّم، والاستدامة، والتكامل مع وزارة التعليم." },
  { t: "نطلقها معاً", d: "ضمن منظومة الأستاذ، بأثرٍ يُقاس ويُوثَّق." },
];

export default async function InitiativesPage() {
  const initiatives = await getInitiatives();
  return (
    <PageShell active="initiatives">
      <PageHero
        eyebrow="الريادة في تعزيز مكانة المعلّم"
        title="أبرز مبادرات الأستاذ"
        lede="حزمةٌ من البرامج والخدمات والفرص المتنوّعة التي تعزّز جودة حياة المعلّم المهنية والمعيشية، إلى جانب منصات الحضور والمحتوى التي تنقل صوت المعلّم إلى الوجدان العام."
        below={initiatives.map((i) => (
          <a key={i.id} className="idx-pill" href={`#${i.slug}`}>{i.name}</a>
        ))}
      />

      <CriteriaBand title="شروط قبول المبادرة" note="تستوفي كل مبادرة شرطاً أساسياً" items={CONDITIONS} />

      <section className="in-wrap in-portfolio">
        <div className="in-portfolio-head" data-reveal="1">
          <div>
            <div className="kicker">المحفظة</div>
            <h2>مبادراتٌ ومنصاتٌ في خدمة المعلّم <span className="in-count">{initiatives.length}</span></h2>
          </div>
          <p>كل مبادرةٍ هنا تستوفي شروط القبول، ويقودها شريكٌ مختص بالتكامل مع وزارة التعليم.</p>
        </div>
        <div className="in-grid">
          {initiatives.map((initiative, i) => (
            <ProgramCard key={initiative.id} initiative={initiative} index={i} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* PROPOSE — the invitation, with the path a proposal takes */}
      <section className="in-wrap in-propose-wrap">
        <div className="in-propose" data-reveal="1">
          <div className="in-propose-text">
            <div className="kicker is-gold">للشركاء المتخصصين</div>
            <h2>هل لديك فكرة مبادرةٍ تخدم المعلّم؟</h2>
            <p>نرحّب بالشركاء المتخصصين الراغبين في إطلاق مبادراتٍ مستدامة ضمن منظومة الأستاذ.</p>
            <Link href="/contact" className="btn btn-secondary btn-lg">تواصل معنا للشراكة</Link>
          </div>
          <ol className="in-propose-steps">
            {PROPOSE.map((p, i) => (
              <li key={p.t}>
                <span>{i + 1}</span>
                <div>
                  <strong>{p.t}</strong>
                  <p>{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
