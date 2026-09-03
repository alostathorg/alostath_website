import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const revalidate = 300;
export const metadata: Metadata = { title: "من نحن" };

const FR = "https://framerusercontent.com/images";

const VALUES = [
  { t: "الولاء", d: "انتماءٌ صادق للوطن وللمعلّم ولرسالة المؤسسة.", ico: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
  { t: "الشراكات", d: "نصنع الأثر بالتكامل مع الجهات المختصة.", ico: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
  { t: "التميّز", d: "معايير عالية في كل ما نقدّمه من برامج وخدمات.", ico: <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></> },
  { t: "الابتكار", d: "حلولٌ نوعية تواكب احتياجات المعلّم وتطلّعاته.", ico: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></> },
  { t: "المهنيّة", d: "التزامٌ وانضباطٌ في الأداء والتنفيذ.", ico: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></> },
  { t: "تحقيق الأثر", d: "قيمةٌ ملموسة وقابلة للقياس في خدمة المعلّم.", ico: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></> },
];

const BOARD = [
  { name: "د. عبدالإله الصالح", img: `${FR}/j0X0zJyXfEroP129Xo0aCS03jtA.jpeg?width=213&height=228`, role: "رئيس مجلس الأمناء" },
  { name: "د. خالد العواد", img: `${FR}/NMoq9rbaVdr8bBZzseUNUpJIws.png?width=374&height=410` },
  { name: "د. زياد الدريس", img: `${FR}/m74hlEDKVe2RKWKLIMtvUKWhc.png?width=512&height=512` },
  { name: "م. سامي الحصيّن", img: `${FR}/910EvdMGyQXgtbyN7rLmXIXR5eU.png?width=435&height=440` },
];

export default function AboutPage() {
  return (
    <PageShell active="about">
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" style={{ position: "absolute", top: "50%", left: -60, transform: "translateY(-50%)", width: "min(760px,70%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16, textAlign: "right" }}>مؤسسة غير ربحيّة</div>
          <h1 style={{ fontSize: "clamp(38px,5.4vw,60px)", fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: "right" }}>من نحن</h1>
          <p style={{ fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "20px auto 0", textAlign: "justify" }}>نُعزّز مكانة المعلّم ودوره، تكاملاً مع منظومة التعليم، وفي خدمة رؤية المملكة 2030.</p>
        </div>
      </section>

      {/* عن المؤسسة */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 56px" }}>
        <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 }}>عن المؤسسة</div>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, margin: "0 0 22px" }}>المعلّم ركيزةُ التعليم</h2>
            <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)", margin: "0 0 18px" }}>مؤسسة غير ربحيّة أُسّست عام 2023 بهدف خلق منظومةٍ شاملة تتكامل مع برامج وزارة التعليم لتعزيز مكانة ودور المعلّم، إيماناً بأنّ المعلّم ركيزةٌ أساسية من ركائز العملية التعليمية والقيمية.</p>
            <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)", margin: 0 }}>وتسعى لتكون مركز خبرةٍ في هذا المجال، وشريكاً لمنظومة التعليم والمجتمع في تحقيق أهداف الرؤية ومستهدفاتها في خدمة المعلّم والتعليم.</p>
          </div>
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${FR}/kvi7PxaoGkKKK99CbnbOWiTUDY.jpeg?width=1492&height=1024`} alt="طلاب أمام مبنى" style={{ width: "100%", height: "auto", borderRadius: 16, display: "block", border: "1px solid var(--hairline)" }} />
          </div>
        </div>
      </section>

      {/* رؤية / رسالة */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 32px 56px" }}>
        <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          <div style={{ background: "var(--olive-900)", color: "var(--ink-inverse)", borderRadius: 18, padding: 44 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16 }}>رؤيتنا</div>
            <p style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, lineHeight: 1.55, margin: 0 }}>الريادة في تعزيز مكانة المعلّم.</p>
          </div>
          <div style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: 18, padding: 44 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 16 }}>رسالتنا</div>
            <p style={{ fontSize: 18, lineHeight: 1.9, color: "var(--text-muted)", margin: 0 }}>كيانٌ غير ربحي مستقل يقدّم خدماتٍ ومنتجاتٍ نوعيّة ومبتكرة في تعزيز مكانة المعلّم، بالشراكة مع المجتمع والجهات المعنيّة عبر قنواتٍ مباشرة وغير مباشرة، لتحقيق قيمةٍ نوعيّة ومستدامة.</p>
          </div>
        </div>
      </section>

      {/* PROFILE DOWNLOAD */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "40px 32px 56px" }}>
        <div data-reveal="1" style={{ position: "relative", overflow: "hidden", borderRadius: 22, background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/alostath-logo-inverse.png" alt="" style={{ position: "absolute", top: "50%", left: -50, transform: "translateY(-50%)", width: "min(420px,42%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap", padding: "clamp(36px,5vw,56px) clamp(28px,4vw,52px)" }}>
            <div style={{ flex: "1 1 340px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 14 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                الملف التعريفي
              </div>
              <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, lineHeight: 1.4, margin: "0 0 10px" }}>تعرّف على المؤسسة عن قرب</h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--inverse-muted)", margin: 0, maxWidth: "54ch" }}>حمّل الملف التعريفي لمؤسسة الأستاذ للاطّلاع على رؤيتنا ورسالتنا وبرامجنا ومبادراتنا في وثيقةٍ واحدة.</p>
            </div>
            <div style={{ flex: "none" }}>
              <a href="/assets/alostath-profile.pdf" download className="btn btn-secondary btn-lg" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                تحميل الملف التعريفي (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 56px" }}>
        <div data-reveal="1" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 }}>ما يحرّكنا</div>
          <h2 style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 700, margin: 0 }}>قيمنا</h2>
        </div>
        <div data-reveal="1" className="values-grid">
          {VALUES.map((v) => (
            <div key={v.t} className="value-card">
              <div className="value-ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{v.ico}</svg></div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "var(--ink)" }}>{v.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--text-muted)", margin: 0 }}>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOARD */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, margin: "0 0 48px" }}>مجــلس أمـــناء المــؤسسة</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28, maxWidth: 980, margin: "0 auto" }}>
            {BOARD.map((m) => (
              <div key={m.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.name} style={{ width: 150, height: 150, borderRadius: 16, objectFit: "cover", border: "3px solid var(--canvas)", boxShadow: "0 4px 12px rgba(35,39,26,0.10)" }} />
                <div style={{ fontSize: 18, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 14, color: "var(--text-subtle)", marginTop: -10 }}>{m.role ?? "عضو مجلس الأمناء"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${FR}/5tFDyWZl3YM715jhXBbKzLNeJw.jpeg?width=1408&height=736`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "96px 32px", textAlign: "center", color: "var(--ink-inverse)" }}>
          <h2 style={{ fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 700, lineHeight: 1.35, margin: "0 0 18px" }}>اشترك في النشرة البريدية لمؤسسة الأستاذ</h2>
          <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 0 36px" }}>انضمّ إلى النشرة البريدية لمؤسسة الأستاذ وكن على اطّلاعٍ دائم بأحدث المبادرات التعليمية، والبرامج التطويرية، والفرص المخصّصة للمعلّمين والطلاب.</p>
          <form data-newsletter-form>
            <div data-nl-success-state hidden style={{ gap: 12, alignItems: "center", background: "rgba(120,161,131,0.18)", border: "1px solid rgba(120,161,131,0.4)", color: "var(--ink-inverse)", borderRadius: 12, padding: "18px 28px", fontSize: 17, fontWeight: 600 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9999, background: "var(--sage-500)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span> شكراً لاشتراكك — سيصلك كلّ جديد.
            </div>
            <div data-nl-form-state>
              <div style={{ display: "flex", gap: 12, maxWidth: 520, margin: "0 auto", flexWrap: "wrap" }}>
                <input type="email" required dir="ltr" placeholder="name@example.com" style={{ flex: "1 1 240px", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--ink)", background: "var(--canvas)", border: "1px solid transparent", borderRadius: 8, padding: "14px 16px", textAlign: "left" }} />
                <button type="submit" className="btn btn-secondary btn-lg">اشترك الآن</button>
              </div>
              <div style={{ fontSize: 13, color: "var(--inverse-subtle)", marginTop: 16 }}>نحن نحترم خصوصيتك — يمكنك إلغاء الاشتراك بضغطةٍ واحدة.</div>
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
