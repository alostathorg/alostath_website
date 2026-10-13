import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getFeaturedIdeas, getInitiatives, getSettings } from "@/lib/queries";
import JoinForm from "./JoinForm";
import IdeaForm from "./IdeaForm";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "مجتمع الأستاذ",
  description:
    "مساحة تجمع معلمي الوطن، وتقرّب صوتهم من كل ما يُسهم في تطوير المهنة وتعزيز مكانة المعلم.",
};

const BENEFITS = [
  {
    n: "01",
    k: "تصل إليك أولًا",
    t: "كن أول من يعرف",
    d: "تصلك أخبار مبادرات الأستاذ وجوائزه وفعالياته، وتبقى قريبًا من كل ما يخص مجتمع المعلمين.",
    bg: "var(--gold-50)",
    fg: "var(--gold-700)",
    Icon: IconBell,
  },
  {
    n: "02",
    k: "صوتك في المبادرات",
    t: "شارك في صناعة الأثر",
    d: "شارك برأيك وتجربتك وأفكارك، وساهم في تطوير مبادرات الأستاذ بما يلامس احتياجات المعلم.",
    bg: "var(--olive-50)",
    fg: "var(--olive-600)",
    Icon: IconChat,
  },
  {
    n: "03",
    k: "دعوات ولقاءات",
    t: "كن حاضرًا في المشهد",
    d: "أولوية المشاركة في لقاءات مجلس الأستاذ وفعاليات المؤسسة وورشها، حيث تلتقي الخبرات وتتبادل التجارب.",
    bg: "var(--sage-50)",
    fg: "var(--sage-700)",
    Icon: IconCalendar,
  },
  {
    n: "04",
    k: "فرص تليق بك",
    t: "خبرتك تستحق أن تُستثمر",
    d: "تعرّف على فرص للمشاركة والتعاون والاستفادة من خبرتك، بما يحقق لك قيمة مهنية وفرص تعزز حضورك في مجتمع الأستاذ.",
    bg: "var(--olive-50)",
    fg: "var(--olive-600)",
    Icon: IconStar,
  },
];

// What happens after the form is sent.
const JOIN_STEPS = [
  { t: "سجّل بياناتك", d: "دقائق قليلة تكفي لتعريفنا بك وبما يهمّك." },
  { t: "نتعرّف عليك", d: "نفهم تخصّصك ومنطقتك وكيف تودّ المساهمة." },
  { t: "تصلك الفرص", d: "المبادرات والجوائز والدعوات التي تناسبك أولاً بأول." },
];

export default async function CommunityPage() {
  const [initiatives, ideas, settings] = await Promise.all([
    getInitiatives(),
    getFeaturedIdeas(),
    getSettings(),
  ]);

  const community = (settings.community as Record<string, string>) ?? {};
  const initiativeName = new Map(initiatives.map((i) => [i.id, i.name]));

  return (
    <PageShell active="community">
      <PageHero
        image={community.hero_image}
        imageOpacity={0.3}
        eyebrow="العضوية مفتوحة · مجانية"
        live
        title="مجتمع الأستاذ"
        lede={
          community.intro ??
          "مساحة تجمع معلمي الوطن، وتقرّب صوتهم من كل ما يُسهم في تطوير المهنة وتعزيز مكانة المعلم."
        }
        note="«مجتمع الأستاذ» هو المساحة التي تلتقي فيها خبرات المعلمين، وأفكارهم، واحتياجاتهم؛ ليكون المعلم شريكًا فاعلًا في تطوير المهنة، وصناعة المبادرات، وتعزيز أثر التعليم."
        actions={
          <>
            <a href="#join" className="btn btn-primary btn-lg">انضم إلى المجتمع</a>
            <a href="#idea" className="btn btn-secondary btn-lg">شارك فكرتك</a>
          </>
        }
      />

      {/* FACTS */}
      <div className="dp-facts" data-reveal="1">
        <div className="dp-facts-inner">
          <div className="dp-fact">
            <div className="dp-fact-ico"><IconUsers /></div>
            <div><div className="dp-fact-k">من هم الأعضاء؟</div><div className="dp-fact-v">معلمو ومعلمات الوطن</div></div>
          </div>
          <div className="dp-fact">
            <div className="dp-fact-ico"><IconBell /></div>
            <div><div className="dp-fact-k">ماذا يصلك؟</div><div className="dp-fact-v">الفرص والمبادرات والجوائز</div></div>
          </div>
          <div className="dp-fact">
            <div className="dp-fact-ico" style={{ background: "var(--sage-50)", color: "var(--sage-700)" }}><IconSpark /></div>
            <div><div className="dp-fact-k">دورك</div><div className="dp-fact-v" style={{ color: "var(--sage-700)" }}>شريك في التطوير وصناعة الأثر</div></div>
          </div>
        </div>
      </div>

      {/* INTRO — the statement, and the four things a member gets */}
      <section className="cm-wrap cm-intro">
        <div className="cm-intro-text" data-reveal="1">
          <div className="kicker">عن المجتمع</div>
          <h2>المعلم شريك في صناعة القرار</h2>
          <p className="cm-lead">أسست مؤسسة الأستاذ «مجتمع الأستاذ» ليكون قناة مباشرة تجمع المعلمين، وتستمع إلى آرائهم وتجاربهم، وتفتح المجال أمامهم للمشاركة في تطوير المبادرات والبرامج التي تمسّ مهنتهم وحياتهم.</p>
          <p className="cm-p">فالمعلم ليس متلقيًا للمبادرات فحسب؛ بل شريك في بنائها، وصوتٌ حاضر في تطوير منظومة التعليم.</p>
          <p className="cm-pull">حين نقترب من المعلم، نفهم احتياجه أكثر، ونصنع مبادرات أكثر أثرًا.</p>
        </div>
        <ul className="cm-benefits" data-reveal-group>
          {BENEFITS.map((b) => (
            <li key={b.t}>
              <span className="cm-benefits-ico" aria-hidden><b.Icon /></span>
              <div>
                <span className="cm-benefits-k">{b.n} · {b.k}</span>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* JOIN — the form, beside the membership it grants */}
      <section id="join" className="cm-join-sec">
        <div className="cm-wrap cm-split">
          <aside className="cm-aside" data-reveal="1">
            <div className="cm-member" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/alostath-logo-inverse.png" alt="" />
              <span className="cm-member-k">بطاقة العضوية</span>
              <strong>عضو في مجتمع الأستاذ</strong>
              <div className="cm-member-foot">
                <span>مجانية</span>
                <span>معلّمو ومعلّمات الوطن</span>
              </div>
            </div>
            <ol className="cm-steps">
              {JOIN_STEPS.map((st, i) => (
                <li key={st.t}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{st.t}</strong>
                    <p>{st.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="cm-privacy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              بياناتك لدى المؤسسة وحدها، ويمكنك إلغاء الاشتراك بضغطة واحدة في أي وقت.
            </p>
          </aside>
          <div className="cm-form-col" data-reveal="1">
            <JoinForm />
          </div>
        </div>
      </section>

      {/* IDEAS — the second way in: bring an idea */}
      <section id="idea" className="cm-wrap cm-split is-idea">
        <aside className="cm-aside cm-idea-aside" data-reveal="1">
          <span className="cm-idea-ico" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>
          </span>
          <h2>الفكرة التي تبدأ من الفصل</h2>
          <p>أنت الأقرب إلى الميدان. كل فكرة تصلنا يقرؤها الفريق، وما يصلح منها قد يصبح مبادرةً أو يُطوِّر مبادرةً قائمة.</p>
          <ul className="cm-idea-list">
            <li>اقترح مبادرة جديدة لحاجةٍ تراها كل يوم</li>
            <li>أو طوّر مبادرةً قائمة من مبادرات الأستاذ</li>
            <li>وقد نشارك فكرتك في «أصوات المجتمع» بعد موافقتك</li>
          </ul>
        </aside>
        <div className="cm-form-col" data-reveal="1">
          <IdeaForm initiatives={initiatives.map((i) => ({ slug: i.slug, name: i.name }))} />
        </div>
      </section>

      {/* VOICES — only rendered once the team has showcased something */}
      {ideas.length > 0 && (
        <section className="cm-wrap cm-voices-sec">
          <div className="cm-voices-head" data-reveal="1">
            <div className="kicker">من الميدان</div>
            <h2>أصوات المجتمع</h2>
            <p>أفكارٌ وصلتنا من معلّمين ومعلّمات، اخترنا أن نشاركها معكم.</p>
          </div>
          <div data-reveal-group className="cm-voices">
            {ideas.map((idea) => (
              <article key={idea.id} className="cm-voice">
                <span className="cm-voice-quote" aria-hidden>&rdquo;</span>
                <h3>{idea.title}</h3>
                <p>{idea.body}</p>
                <div className="cm-voice-by">
                  <span>{idea.name || "عضو في المجتمع"}</span>
                  {idea.initiative_id && initiativeName.has(idea.initiative_id) && (
                    <span className="cm-voice-tag">{initiativeName.get(idea.initiative_id)}</span>
                  )}
                  {!idea.initiative_id && idea.topic && <span className="cm-voice-tag">{idea.topic}</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cm-wrap">
        <div className="cm-ask" data-reveal="1">
          <div>
            <h2>لديك سؤال قبل الانضمام؟</h2>
            <p>فريق المؤسسة سعيدٌ بالإجابة عن أي استفسار يخصّ المجتمع أو برامج المؤسسة.</p>
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg">تواصل معنا</Link>
        </div>
      </section>
    </PageShell>
  );
}

function IconUsers() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function IconBell() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function IconChat() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
}
function IconCalendar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function IconStar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function IconSpark() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg>;
}
