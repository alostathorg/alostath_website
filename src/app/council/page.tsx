import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "المجلس" };

const CARDS = [
  { t: "تعارفٌ وتكامل", d: "منصّة تجمع المعلّم بالجهات المؤثّرة في منظومة التعليم.", bg: "var(--olive-50)", fg: "var(--olive-600)" },
  { t: "صناعة الحلول", d: "تحويل قضايا الميدان إلى حلولٍ عملية ومبادرات ذات أثر.", bg: "var(--sage-50)", fg: "var(--sage-700)" },
  { t: "توعية المجتمع", d: "تعريف المجتمع بقضايا الميدان التعليمي ودور المعلّم فيه.", bg: "var(--gold-50)", fg: "var(--gold-700)" },
  { t: "إبراز دور المعلّم", d: "تعزيز حضور المعلّم في صناعة قرارات التعليم.", bg: "var(--olive-50)", fg: "var(--olive-600)" },
];

const PILLS = [
  { t: "المعلّمون المتميّزون", c: "var(--olive-500)" },
  { t: "الخبراء والمختصّون", c: "var(--sage-500)" },
  { t: "الجهات الحكومية", c: "var(--gold-500)" },
  { t: "القطاع الخاص", c: "var(--olive-500)" },
];

export default async function CouncilPage() {
  const settings = await getSettings();
  const council = (settings.council as Record<string, string>) ?? {};
  const nextSession = council.next_session ?? "2026-08-05T19:00:00+03:00";

  return (
    <PageShell active="council">
      {/* HERO */}
      <section className="dp-hero">
        <span className="dp-orb dp-orb-gold" />
        <span className="dp-orb dp-orb-sage" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden style={{ position: "absolute", bottom: -70, left: -70, width: "min(540px,50%)", height: "auto", opacity: 0.05, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", zIndex: 2, maxWidth: "var(--container-max)", margin: "0 auto", padding: "clamp(60px,9vh,96px) 32px clamp(76px,11vh,116px)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 18 }}><span className="live-dot" />الركيزة الثانية · ديوانيّة شهريّة</div>
          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.15, margin: 0, maxWidth: "16ch" }}>مجلس الأستاذ</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "24px 0 0", maxWidth: "64ch" }}>منصّة حوارٍ مهني تجمع المعلّمين مع الخبراء والجهات الحكومية والخاصة، لتحويل صوت المعلّم إلى شراكةٍ فاعلة في مناقشة القضايا التعليمية وصناعة المبادرات ذات الأثر.</p>
        </div>
      </section>

      {/* FACTS */}
      <div className="dp-facts" data-reveal="1">
        <div className="dp-facts-inner">
          <div className="dp-fact"><div className="dp-fact-ico"><IconCal /></div><div><div className="dp-fact-k">الدورية</div><div className="dp-fact-v">ديوانيّة شهريّة</div></div></div>
          <div className="dp-fact"><div className="dp-fact-ico"><IconUsers /></div><div><div className="dp-fact-k">المشاركون</div><div className="dp-fact-v">4 فئات حول طاولة واحدة</div></div></div>
          <div className="dp-fact"><div className="dp-fact-ico" style={{ background: "var(--sage-50)", color: "var(--sage-700)" }}><IconCompass /></div><div><div className="dp-fact-k">المخرجات</div><div className="dp-fact-v" style={{ color: "var(--sage-700)" }}>حلولٌ ومبادرات</div></div></div>
        </div>
      </div>

      {/* INTRO */}
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "72px 32px 24px" }}>
        <div data-reveal="1">
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 }}>عن المجلس</div>
          <p style={{ fontSize: "clamp(19px,2.2vw,24px)", lineHeight: 1.85, color: "var(--text-body)", fontWeight: 500, margin: 0 }}>ديوانيّةٌ شهريّة تجمع المعلّمين المتميّزين بنخبةٍ من الخبراء والممارسين والمختصّين من القطاعات الحكومية والخاصة، إلى جانب ممثّلي تحدّيات الميدان — بهدف الاطّلاع على مستجدّات التعليم وتحويلها إلى حلولٍ عملية ومبادرات تتكامل مع الطموحات الوطنية.</p>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)", margin: "24px 0 0" }}>يعمل المجلس كمنصّة تعارفٍ وتكامل بين المعلّم والجهات المؤثّرة في منظومة التعليم، بما يُسهم في إبراز دور المعلّم وتعزيز مشاركته في صناعة الحلول وتوعية المجتمع بقضايا الميدان التعليمي.</p>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "56px 32px" }}>
        <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {CARDS.map((c) => (
            <div key={c.t} className="c-card card-lift" style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 16, padding: 30 }}>
              <div className="c-ico" style={{ width: 46, height: 46, borderRadius: 12, background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}><IconUsers /></div>
              <h3 style={{ fontSize: 19, fontWeight: 600, margin: "0 0 8px" }}>{c.t}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO PARTICIPATES */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "72px 32px" }}>
          <div className="council-row" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 }}>طاولةٌ واحدة</div>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 700, margin: "0 0 14px" }}>من يجلس إلى المجلس؟</h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 }}>يلتقي في ديوانيّة المجلس صنّاع التعليم من مختلف المواقع، فيتحوّل الحوار إلى شراكةٍ تصنع الأثر.</p>
            </div>
            <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
              {PILLS.map((p) => (
                <div key={p.t} className="c-pill" style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 12, fontSize: 16, fontWeight: 600 }}>
                  <span className="c-dot" style={{ width: 9, height: 9, borderRadius: 9999, background: p.c, flex: "none" }} />{p.t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section id="next" style={{ maxWidth: "var(--container-max)", margin: "64px auto 0", padding: "0 32px" }}>
        <div data-reveal="1" data-countdown-target={nextSession} style={{ position: "relative", overflow: "hidden", borderRadius: 24, background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
          {council.hero_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={council.hero_image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
          )}
          <div style={{ position: "relative", padding: "clamp(40px,6vw,72px) clamp(28px,5vw,64px)", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 14 }}>الجلسة القادمة</div>
            <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 700, margin: "0 0 36px" }}>مجلسنا القادم قـــــــــرب</h2>
            <div style={{ display: "flex", gap: "clamp(10px,2vw,20px)", justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
              {[["secs", "ثوانٍ"], ["mins", "دقائق"], ["hours", "ساعات"], ["days", "أيام"]].map(([k, label]) => (
                <div key={k} style={{ background: "rgba(244,246,238,0.06)", border: "1px solid rgba(244,246,238,0.14)", borderRadius: 16, padding: "20px 8px", minWidth: 96 }}>
                  <div data-countdown={k} style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, color: "var(--gold-500)", lineHeight: 1 }}>--</div>
                  <div style={{ fontSize: 14, color: "var(--inverse-subtle)", marginTop: 8 }}>{label}</div>
                </div>
              ))}
            </div>
            <button type="button" data-register="مجلس الأستاذ" data-register-status="council" className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px" }}>
        <div data-reveal="1" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, margin: "0 0 14px" }}>صوتك جزءٌ من الحوار</h2>
          <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 auto 32px", maxWidth: "56ch" }}>انضمّ إلى مجلس الأستاذ، أو رشّح قضيّةً من الميدان تستحقّ النقاش في جلستنا القادمة.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">تواصل معنا</Link>
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
