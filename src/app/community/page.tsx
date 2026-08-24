import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
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
    n: "٠١",
    k: "تصل إليك أولًا",
    t: "كن أول من يعرف",
    d: "تصلك أخبار مبادرات الأستاذ وجوائزه وفعالياته، وتبقى قريبًا من كل ما يخص مجتمع المعلمين.",
    bg: "var(--gold-50)",
    fg: "var(--gold-700)",
    Icon: IconBell,
  },
  {
    n: "٠٢",
    k: "صوتك في المبادرات",
    t: "شارك في صناعة الأثر",
    d: "شارك برأيك وتجربتك وأفكارك، وساهم في تطوير مبادرات الأستاذ بما يلامس احتياجات المعلم.",
    bg: "var(--olive-50)",
    fg: "var(--olive-600)",
    Icon: IconChat,
  },
  {
    n: "٠٣",
    k: "دعوات ولقاءات",
    t: "كن حاضرًا في المشهد",
    d: "أولوية المشاركة في لقاءات مجلس الأستاذ وفعاليات المؤسسة وورشها، حيث تلتقي الخبرات وتتبادل التجارب.",
    bg: "var(--sage-50)",
    fg: "var(--sage-700)",
    Icon: IconCalendar,
  },
  {
    n: "٠٤",
    k: "فرص تليق بك",
    t: "خبرتك تستحق أن تُستثمر",
    d: "تعرّف على فرص للمشاركة والتعاون والاستفادة من خبرتك، بما يحقق لك قيمة مهنية وفرص تعزز حضورك في مجتمع الأستاذ.",
    bg: "var(--olive-50)",
    fg: "var(--olive-600)",
    Icon: IconStar,
  },
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
      {/* HERO */}
      <section className="dp-hero">
        <span className="dp-orb dp-orb-gold" />
        <span className="dp-orb dp-orb-sage" />
        {community.hero_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={community.hero_image}
            alt=""
            aria-hidden
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }}
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/alostath-logo-inverse.png"
          alt=""
          aria-hidden
          style={{ position: "absolute", bottom: -70, left: -70, width: "min(540px,50%)", height: "auto", opacity: 0.05, pointerEvents: "none" }}
        />
        <div data-reveal="1" style={{ position: "relative", zIndex: 2, maxWidth: "var(--container-max)", margin: "0 auto", padding: "clamp(60px,9vh,96px) 32px clamp(76px,11vh,116px)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 18 }}>
            <span className="live-dot" />العضوية مفتوحة · مجانية
          </div>
          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.15, margin: 0, maxWidth: "16ch" }}>
            مجتمع الأستاذ
          </h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "24px 0 0", maxWidth: "60ch" }}>
            {community.intro ??
              "مساحة تجمع معلمي الوطن، وتقرّب صوتهم من كل ما يُسهم في تطوير المهنة وتعزيز مكانة المعلم."}
          </p>
          <p style={{ fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.9, color: "var(--inverse-subtle)", margin: "18px 0 0", maxWidth: "66ch" }}>
            «مجتمع الأستاذ» هو المساحة التي تلتقي فيها خبرات المعلمين، وأفكارهم، واحتياجاتهم؛ ليكون
            المعلم شريكًا فاعلًا في تطوير المهنة، وصناعة المبادرات، وتعزيز أثر التعليم.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
            <a href="#join" className="btn btn-secondary btn-lg">انضم إلى المجتمع</a>
            <a href="#idea" className="btn btn-outline btn-lg" style={{ background: "transparent", color: "var(--ink-inverse)", borderColor: "rgba(244,246,238,0.4)" }}>شارك فكرتك</a>
          </div>
        </div>
      </section>

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

      {/* INTRO */}
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "72px 32px 24px" }}>
        <div data-reveal="1">
          <div className="eyebrow" style={{ color: "var(--gold-600)", marginBottom: 14 }}>عن المجتمع</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 700, color: "var(--ink)", margin: "0 0 20px" }}>
            المعلم شريك في صناعة القرار
          </h2>
          <p style={{ fontSize: "clamp(19px,2.2vw,24px)", lineHeight: 1.85, color: "var(--text-body)", fontWeight: 500, margin: 0 }}>
            أسست مؤسسة الأستاذ «مجتمع الأستاذ» ليكون قناة مباشرة تجمع المعلمين، وتستمع إلى آرائهم
            وتجاربهم، وتفتح المجال أمامهم للمشاركة في تطوير المبادرات والبرامج التي تمسّ مهنتهم
            وحياتهم.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)", margin: "24px 0 0" }}>
            فالمعلم ليس متلقيًا للمبادرات فحسب؛ بل شريك في بنائها، وصوتٌ حاضر في تطوير منظومة
            التعليم.
          </p>
          <p style={{ fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.8, color: "var(--olive-600)", fontWeight: 600, margin: "32px 0 0", paddingInlineStart: 18, borderInlineStart: "3px solid var(--gold-500)" }}>
            حين نقترب من المعلم، نفهم احتياجه أكثر، ونصنع مبادرات أكثر أثرًا.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "40px 32px 16px" }}>
        <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {BENEFITS.map((b) => (
            <div key={b.t} className="c-card card-lift" style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 16, padding: 30 }}>
              <div className="c-ico" style={{ width: 46, height: 46, borderRadius: 12, background: b.bg, color: b.fg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <b.Icon />
              </div>
              <div className="cm-benefit-kicker">
                <span className="cm-benefit-num">{b.n}</span>
                {b.k}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 600, margin: "0 0 8px" }}>{b.t}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN */}
      <section id="join" style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", marginTop: 56 }}>
        <div data-reveal="1" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(56px,8vw,84px) 32px" }}>
          <JoinForm />
        </div>
      </section>

      {/* IDEAS */}
      <section id="idea" style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(56px,8vw,84px) 32px 0" }}>
        <div data-reveal="1">
          <IdeaForm initiatives={initiatives.map((i) => ({ slug: i.slug, name: i.name }))} />
        </div>
      </section>

      {/* VOICES — only rendered once the team has showcased something */}
      {ideas.length > 0 && (
        <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "clamp(56px,8vw,84px) 32px 0" }}>
          <div data-reveal="1" style={{ marginBottom: 32 }}>
            <div className="eyebrow" style={{ color: "var(--gold-600)", marginBottom: 12 }}>من الميدان</div>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 700, margin: 0 }}>أصوات المجتمع</h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: "12px 0 0", maxWidth: "62ch" }}>
              أفكارٌ وصلتنا من معلّمين ومعلّمات، اخترنا أن نشاركها معكم.
            </p>
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
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px" }}>
        <div data-reveal="1" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, margin: "0 0 14px" }}>لديك سؤال قبل الانضمام؟</h2>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 auto 32px", maxWidth: "56ch" }}>
            فريق المؤسسة سعيدٌ بالإجابة عن أي استفسار يخصّ المجتمع أو برامج المؤسسة.
          </p>
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
