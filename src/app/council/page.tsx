import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "المجلس" };

// «ما يسهم فيه المجلس» — the 2026 profile's three contributions, after the
// council's own definition (منصة تعارف وتكامل).
const CARDS = [
  { t: "تعارفٌ وتكامل", d: "منصّة تعارفٍ وتكامل بين المعلّم والجهات المؤثّرة في منظومة التعليم.", ico: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
  { t: "إبراز دور المعلّم", d: "إبراز دور المعلّم وتعزيز مشاركته في صناعة الحلول التعليمية.", ico: <><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9z" /></> },
  { t: "توعية المجتمع", d: "توعية المجتمع بقضايا الميدان التعليمي من منظور من يعيشه يومياً.", ico: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></> },
  { t: "قناة تواصل مباشرة", d: "خلق قناة تواصل مباشرة ومنتظمة بين صنّاع القرار التعليمي والمعلّمين أنفسهم.", ico: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8" /><path d="M8 13h5" /></> },
];

// The four seats around the table.
const SEATS = [
  { t: "المعلّمون المتميّزون", d: "صوت الميدان" },
  { t: "الخبراء والمختصّون", d: "المعرفة والتجربة" },
  { t: "الجهات الحكومية", d: "القرار والسياسات" },
  { t: "القطاع الخاص", d: "الشراكة والتنفيذ" },
];

// What a session does, read off the council's own definition.
const FLOW = [
  { t: "الاطّلاع", d: "على مستجدّات التعليم وتحدّيات الميدان كما يعيشها المعلّم." },
  { t: "الحوار", d: "بين المعلّم وصنّاع القرار والخبراء حول طاولةٍ واحدة." },
  { t: "الأثر", d: "حلولٌ عملية ومبادرات تتكامل مع الطموحات الوطنية." },
];

export default async function CouncilPage() {
  const settings = await getSettings();
  const council = (settings.council as Record<string, string>) ?? {};

  return (
    <PageShell active="council">
      <PageHero
        eyebrow="منصات الحضور والمحتوى · ديوانيّة شهريّة"
        live
        title="مجلس الأستاذ"
        lede="منصّة حوارٍ مهني تجمع المعلّمين مع الخبراء والجهات الحكومية والخاصة، لتحويل صوت المعلّم إلى شراكةٍ فاعلة في مناقشة القضايا التعليمية وصناعة المبادرات ذات الأثر."
      />

      {/* FACTS */}
      <div className="dp-facts" data-reveal="1">
        <div className="dp-facts-inner">
          <div className="dp-fact"><div className="dp-fact-ico"><IconCal /></div><div><div className="dp-fact-k">الدورية</div><div className="dp-fact-v">ديوانيّة شهريّة</div></div></div>
          <div className="dp-fact"><div className="dp-fact-ico"><IconUsers /></div><div><div className="dp-fact-k">المشاركون</div><div className="dp-fact-v">4 فئات حول طاولة واحدة</div></div></div>
          <div className="dp-fact"><div className="dp-fact-ico" style={{ background: "var(--sage-50)", color: "var(--sage-700)" }}><IconCompass /></div><div><div className="dp-fact-k">المخرجات</div><div className="dp-fact-v" style={{ color: "var(--sage-700)" }}>حلولٌ ومبادرات</div></div></div>
        </div>
      </div>

      {/* INTRO — the definition, beside the majlis itself */}
      <section className="cn-wrap cn-intro" data-reveal="1">
        <div className="cn-intro-text">
          <div className="kicker">عن المجلس</div>
          <p className="cn-lead">ديوانيّةٌ شهريّة تجمع المعلّمين المتميّزين بنخبةٍ من الخبراء والممارسين والمختصّين من القطاعات الحكومية والخاصة، إلى جانب ممثّلي تحدّيات الميدان — بهدف الاطّلاع على مستجدّات التعليم وتحويلها إلى حلولٍ عملية ومبادرات تتكامل مع الطموحات الوطنية.</p>
          <p className="cn-p">يعمل المجلس كمنصّة تعارفٍ وتكامل بين المعلّم والجهات المؤثّرة في منظومة التعليم، بما يُسهم في إبراز دور المعلّم وتعزيز مشاركته في صناعة الحلول التعليمية، وتوعية المجتمع بقضايا الميدان من منظور من يعيشه يومياً، وخلق قناة تواصل مباشرة ومنتظمة بين صنّاع القرار التعليمي والمعلّمين أنفسهم.</p>
        </div>
        {council.hero_image && (
          <figure className="cn-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={council.hero_image} alt="جلسة من جلسات مجلس الأستاذ" />
            <figcaption>من جلسات مجلس الأستاذ</figcaption>
          </figure>
        )}
      </section>

      {/* THE TABLE — who sits at the majlis */}
      <section className="cn-table-sec">
        <div className="cn-wrap cn-table-grid">
          <div className="cn-table-text" data-reveal="1">
            <div className="kicker is-gold">طاولةٌ واحدة</div>
            <h2>من يجلس إلى المجلس؟</h2>
            <p>يلتقي في ديوانيّة المجلس صنّاع التعليم من مختلف المواقع، فيتحوّل الحوار إلى شراكةٍ تصنع الأثر.</p>
          </div>
          <div className="cn-table" data-reveal="1" aria-label="المشاركون في المجلس">
            <div className="cn-table-ring" aria-hidden />
            <div className="cn-table-center">
              <strong>المجلس</strong>
              <span>ديوانيّة شهريّة</span>
            </div>
            {SEATS.map((seat, i) => (
              <div key={seat.t} className={`cn-seat is-${i + 1}`}>
                <strong>{seat.t}</strong>
                <span>{seat.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="cn-wrap cn-sec">
        <div className="cn-head" data-reveal="1">
          <div className="kicker">ما يُسهم فيه المجلس</div>
          <h2>أربع إسهامات لصوت المعلّم</h2>
        </div>
        <div className="cn-cards" data-reveal-group>
          {CARDS.map((c, i) => (
            <article key={c.t} className="cn-card">
              <span className="cn-card-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="cn-card-ico" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{c.ico}</svg>
              </span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FLOW — from conversation to impact */}
      <section className="cn-wrap cn-sec is-tight">
        <div className="cn-head" data-reveal="1">
          <div className="kicker">من الحوار إلى الأثر</div>
          <h2>ما الذي يحدث في الجلسة؟</h2>
        </div>
        <ol className="cn-flow" data-reveal-group>
          {FLOW.map((f, i) => (
            <li key={f.t}>
              <span>{i + 1}</span>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CLOSE — register for the next session */}
      <section id="next" className="cn-wrap cn-close">
        <div className="cn-close-main" data-reveal="1">
          {council.hero_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={council.hero_image} alt="" aria-hidden />
          )}
          <div>
            <div className="kicker is-gold">الجلسة القادمة</div>
            <h2>كن أول من يعلم</h2>
            <p>سجّل اهتمامك بحضور مجلس الأستاذ، وسنُبلغك بموعد الجلسة القادمة فور الإعلان عنه.</p>
            <button type="button" data-register="مجلس الأستاذ" data-register-status="council" className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function IconCal() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function IconUsers() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function IconCompass() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;
}
