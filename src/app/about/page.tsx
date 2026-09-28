import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PersonAvatar from "@/components/PersonAvatar";
import { BOARD, LICENSE, PARTNERS, SCALE, TEAM } from "@/lib/org";

export const revalidate = 300;
export const metadata: Metadata = { title: "من نحن" };

const FR = "https://framerusercontent.com/images";

const VALUES = [
  { t: "الالتزام", d: "وفاءٌ بالعهد تجاه المعلّم والوطن ورسالة المؤسسة.", ico: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></> },
  { t: "الشراكة", d: "نصنع الأثر بالتكامل مع المجتمع والجهات المعنية.", ico: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
  { t: "التميّز", d: "معايير عالية في كل ما نقدّمه من خدمات ومنتجات.", ico: <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></> },
  { t: "الإبداع", d: "حلولٌ نوعية ومبتكرة تواكب احتياجات المعلّم وتطلّعاته.", ico: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></> },
  { t: "المهنية", d: "انضباطٌ وحوكمة ناضجة في الأداء والتنفيذ.", ico: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></> },
  { t: "تحقيق الأثر", d: "قيمةٌ نوعية مستدامة وقابلة للقياس في خدمة المعلّم.", ico: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></> },
];

const AREAS = [
  {
    n: "01",
    t: "القدرات المؤسسية واستدامتها",
    goals: [
      { t: "بناء القدرات المؤسسية والاستدامة المالية للمؤسسة", d: "إرساء منظومة حوكمة ناضجة وقاعدة موارد مالية متنوعة تضمن استمرارية عمل المؤسسة بمعزل عن تقلّبات أي مصدر تمويل واحد." },
      { t: "نضوج الممارسات المؤسسية وتميّزها في تعزيز مكانة المعلّم", d: "الانتقال التدريجي من كيان ناشئ إلى مؤسسة ذات ممارسات إدارية وتشغيلية راسخة يُحتذى بها." },
    ],
  },
  {
    n: "02",
    t: "التميّز في الخدمات والمنتجات",
    goals: [
      { t: "تطوير منتجات وخدمات نوعية في تعزيز مكانة المعلّم", d: "توسيع محفظة المبادرات بما يلبّي احتياجات المعلّم المتعددة، من التطوير المهني إلى الاستقرار الاقتصادي." },
      { t: "دعم المنتجات الثقافية والإبداعية والإعلامية في إثراء هيبة المعلّم", d: "الاستثمار في المحتوى والإنتاج الإعلامي كأداة لإعادة تشكيل صورة المعلّم في الوجدان العام." },
      { t: "دعم البحوث والابتكار في تعزيز مكانة المعلّم ورضاه المهني", d: "تأسيس قاعدة معرفية وطنية تستند إليها قرارات المؤسسة وشركائها." },
    ],
  },
  {
    n: "03",
    t: "العمل المجتمعي في تحفيز مكانة المعلّم",
    goals: [
      { t: "إثراء مكانة المعلّم من خلال منظومة القيم والشراكة المجتمعية", d: "بناء شبكة شراكات مع القطاعين العام والخاص تُعلي من شأن المعلّم مجتمعياً." },
      { t: "تعزيز رسالة المؤسسة نحو قيمة نوعية إقليمياً", d: "تجاوز الأثر المحلي إلى موقع مرجعي على مستوى المنطقة." },
      { t: "تنظيم فعاليات في برامج التكريم والاحتفاء بالمعلّم", d: "ترسيخ ثقافة تقدير المعلّم كممارسة مؤسسية دورية لا مناسبة استثنائية." },
    ],
  },
];

const IMPACT = [
  "تعزيز مكانة المعلّم المهنية والمجتمعية، عبر مبادرات ومنصات تبرز دوره وتحتفي بأثره.",
  "رفع جودة التعليم، من خلال تطوير قدرات المعلّم وربطه بأدوات وشراكات نوعية.",
  "إبراز المواهب والإبداعات، سواء لدى المعلّمين أنفسهم أو لدى طلبتهم.",
  "تحقيق الاستقرار الاقتصادي والمعيشي للمعلّم، عبر نماذج تعاونية وفرص دخل إضافية مشروعة.",
  "التكامل مع جهود الجهات العامة والأنظمة والبرامج الوطنية، بما يخدم مستهدفات رؤية المملكة 2030.",
  "تفعيل مشاركة القطاع الثالث في منظومة التعليم، بوصف مؤسسة الأستاذ نموذجاً لهذه المشاركة.",
];

export default function AboutPage() {
  return (
    <PageShell active="about">
      <PageHero
        eyebrow="مؤسسة أهلية سعودية غير ربحية"
        title="من نحن"
        lede="مرخّصة من المركز الوطني لتنمية القطاع غير الربحي، وتعمل تحت إشراف وزارة التعليم — لتعزيز مكانة المعلّم وخدمة رؤية المملكة 2030."
      />

      {/* عن المؤسسة */}
      <section style={wrap("96px 32px 56px")}>
        <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 56, alignItems: "center" }}>
          <div>
            <div style={eyebrowStyle}>عن المؤسسة</div>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, margin: "0 0 22px" }}>المعلّم ركيزةُ التعليم</h2>
            <p style={{ ...prose, margin: "0 0 18px" }}>مؤسسة الأستاذ مؤسسة أهلية سعودية غير ربحية، انطلقت عام 2023م من إيمانٍ عميق بأن المعلّم ركيزةٌ أساسية من ركائز العملية التعليمية والقيمية. ورُخّصت رسمياً من المركز الوطني لتنمية القطاع غير الربحي بتاريخ 20/04/2024م، وتعمل تحت إشراف وزارة التعليم، ضمن المجموعة الثانية للمنظمات والأنشطة التي تقود وتدير وتقدّم وتشجّع وتدعم الخدمات التعليمية والبحثية.</p>
            <p style={{ ...prose, margin: 0 }}>وتسعى المؤسسة إلى أن تكون مرجعاً وطنياً في خدمة المعلّم والتعليم، ومركز خبرةٍ وشريكاً فاعلاً لمنظومة التعليم والمجتمع في بناء جيلٍ من المتعلّمين يحققون رؤية المملكة 2030 ومستهدفاتها، من خلال مبادرات خلّاقة وفعّالة وذات أثر، بالتكامل مع وزارة التعليم والمؤسسات العامة المختصة.</p>
          </div>
          <div style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${FR}/kvi7PxaoGkKKK99CbnbOWiTUDY.jpeg?width=1492&height=1024`} alt="طلاب أمام مبنى" style={{ width: "100%", height: "auto", borderRadius: 16, display: "block", border: "1px solid var(--hairline)" }} />
          </div>
        </div>
      </section>

      {/* رؤية / رسالة */}
      <section style={wrap("0 32px 56px")}>
        <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          <div style={{ background: "var(--olive-900)", color: "var(--ink-inverse)", borderRadius: 18, padding: 44 }}>
            <div style={{ ...eyebrowStyle, color: "var(--gold-500)", marginBottom: 16 }}>رؤيتنا</div>
            <p style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, lineHeight: 1.55, margin: 0 }}>الريادة في تعزيز مكانة المعلّم.</p>
          </div>
          <div style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: 18, padding: 44 }}>
            <div style={{ ...eyebrowStyle, marginBottom: 16 }}>رسالتنا</div>
            <p style={{ fontSize: 18, lineHeight: 1.9, color: "var(--text-muted)", margin: 0 }}>مؤسسة الأستاذ كيانٌ غير ربحي مستقل في تقديم خدمات ومنتجات نوعية ومبتكرة في تعزيز مكانة المعلّم، بالشراكة مع المجتمع والجهات المعنية، من خلال قنوات خدمة مباشرة وغير مباشرة، في سبيل تحقيق قيمة نوعية مستدامة.</p>
          </div>
        </div>
      </section>

      {/* لماذا الأستاذ؟ */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div style={wrap("84px 32px")}>
          <div data-reveal="1" style={{ marginBottom: 32 }}>
            <div style={eyebrowStyle}>لماذا الأستاذ؟</div>
            <h2 style={h2}>حجمٌ غير مسبوق، وتوقيتٌ استراتيجي</h2>
          </div>
          <div data-reveal-group style={{ ...grid(220), marginBottom: 24 }}>
            {SCALE.map((s) => (
              <div key={s.u} style={card}>
                <div style={{ fontSize: "clamp(36px,4.4vw,50px)", fontWeight: 700, lineHeight: 1, color: s.accent ? "var(--gold-600)" : "var(--olive-600)", marginBottom: 12 }}>{s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{s.u}</div>
                <div style={cardBody}>{s.d}</div>
              </div>
            ))}
          </div>
          <div data-reveal="1" style={grid(300)}>
            <div style={card}>
              <h3 style={cardTitle}>نضوج البنية المؤسسية</h3>
              <p style={cardBody}>صدور نظام التعليم العام، وإنشاء مجلس التعليم العام، ونضج البنية المؤسسية لقطاع التعليم (هيئة تقويم التعليم والتدريب، والمعهد الوطني للتطوير المهني التعليمي)، يجعل المرحلة الحالية الأنسب لبناء لبنة جديدة تُعنى بمكانة المعلّم نفسه.</p>
            </div>
            <div style={{ ...card, background: "var(--olive-900)", borderColor: "transparent" }}>
              <h3 style={{ ...cardTitle, color: "var(--ink-inverse)" }}>انسجام تام مع رؤية 2030</h3>
              <p style={{ ...cardBody, color: "var(--inverse-muted)" }}>كل مبادرة من مبادرات المؤسسة تصبّ في تنمية رأس المال البشري، وتنويع مسارات المعلّم المهنية، والتنويع الاقتصادي، والمشاركة المجتمعية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={wrap("96px 32px 56px")}>
        <div data-reveal="1" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={eyebrowStyle}>ما يحرّكنا</div>
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

      {/* المجالات الاستراتيجية */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div style={wrap("84px 32px")}>
          <div data-reveal="1" style={{ marginBottom: 32 }}>
            <div style={eyebrowStyle}>التطلّعات الاستراتيجية</div>
            <h2 style={h2}>ثلاثة مجالات استراتيجية</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {AREAS.map((a) => (
              <div key={a.n} data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, alignItems: "start" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 600, color: "var(--sage-500)", marginBottom: 8 }}>{a.n}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.45 }}>{a.t}</h3>
                </div>
                {a.goals.map((g) => (
                  <div key={g.t} style={card}>
                    <h4 style={cardTitle}>{g.t}</h4>
                    <p style={cardBody}>{g.d}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* مركز الأستاذ للتطوير والأبحاث */}
      <section style={wrap("84px 32px 40px")}>
        <div data-reveal="1" style={{ background: "var(--olive-900)", color: "var(--ink-inverse)", borderRadius: 22, padding: "clamp(36px,5vw,56px)" }}>
          <div style={{ ...eyebrowStyle, color: "var(--gold-500)" }}>القطب البحثي والمعرفي</div>
          <h2 style={{ ...h2, color: "var(--ink-inverse)" }}>مركز الأستاذ للتطوير والأبحاث</h2>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--inverse-muted)", margin: "0 0 16px", maxWidth: "80ch" }}>يعمل المركز بالتوازي مع مكوّنات منظومة الأستاذ لتحقيق أهدافها الاستراتيجية، ويتخصّص في رصد ودراسة الميدان التعليمي من منظور المعلّم، وإجراء الدراسات والأبحاث التطبيقية التي تخدم المؤسسة وشركاءها في اتخاذ قراراتٍ مستنيرة.</p>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--inverse-muted)", margin: 0, maxWidth: "80ch" }}>وهو ما انعكس فعلياً في دراسات ومقترحات صادرة عن المؤسسة، من بينها الدراسة التي بُني عليها مقترح «المرجعية المهنية الوطنية للمعلّم» المرفوع لولي العهد. ويتولّى المركز أيضاً توثيق أثر المبادرات والبرامج، وتطوير الأدلّة والآليات التي تسهم في التوسّع المستمر لمنظومة الأستاذ وتعزيز أثرها على المعلّم والمنظومة التعليمية والوطن.</p>
        </div>
      </section>

      {/* الأثر الاجتماعي */}
      <section style={wrap("40px 32px 56px")}>
        <div data-reveal="1" style={{ marginBottom: 28 }}>
          <div style={eyebrowStyle}>الأثر</div>
          <h2 style={h2}>الأثر الاجتماعي</h2>
        </div>
        <div data-reveal-group style={grid(300)}>
          {IMPACT.map((t, i) => (
            <div key={i} style={{ ...card, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600, color: "var(--gold-600)", flex: "none", marginTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>
              <p style={{ ...cardBody, color: "var(--text-body, var(--ink))" }}>{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* بيانات الترخيص + الملف التعريفي */}
      <section style={wrap("40px 32px 56px")}>
        <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28, alignItems: "stretch" }}>
          <div>
            <div style={eyebrowStyle}>المؤسسة</div>
            <h2 style={h2}>بيانات الترخيص</h2>
            <dl style={{ margin: 0, border: "1px solid var(--hairline)", borderRadius: 16, overflow: "hidden", background: "var(--canvas)" }}>
              {LICENSE.map((r, i) => (
                <div key={r.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 20px", borderTop: i ? "1px solid var(--hairline)" : "none", fontSize: 15 }}>
                  <dt style={{ color: "var(--text-muted)" }}>{r.k}</dt>
                  <dd style={{ margin: 0, fontWeight: 600, fontFamily: r.mono ? "var(--font-mono)" : undefined }}>{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, background: "var(--olive-900)", color: "var(--ink-inverse)", display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/alostath-logo-inverse.png" alt="" style={{ position: "absolute", bottom: -30, left: -40, width: "min(320px,60%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
            <div style={{ position: "relative", padding: "clamp(32px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                الملف التعريفي
              </div>
              <h2 style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, lineHeight: 1.4, margin: 0 }}>تعرّف على المؤسسة عن قرب</h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--inverse-muted)", margin: 0 }}>حمّل الملف التعريفي المفصّل لمؤسسة الأستاذ: التطلّعات الاستراتيجية، ومنصات الحضور والمحتوى، والجائزة الوطنية للمعلّم، والمبادرات، والأثر والفريق.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginTop: 6 }}>
                <a href="/assets/alostath-profile.pdf" download className="btn btn-secondary btn-lg" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  تحميل الملف التعريفي (PDF)
                </a>
                <Link href="/press" style={{ fontSize: 15, fontWeight: 500, color: "var(--gold-500)", textDecoration: "none" }}>الهوية البصرية: الملف الإعلامي ←</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* شركاء النجاح */}
      <section style={wrap("40px 32px 84px")}>
        <div data-reveal="1" style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={eyebrowStyle}>الشراكات</div>
          <h2 style={{ ...h2, margin: 0 }}>شركاء النجاح</h2>
        </div>
        <div data-reveal-group style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {PARTNERS.map((p) => (
            <div key={p} style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "20px 28px", fontSize: 17, fontWeight: 700, textAlign: "center" }}>{p}</div>
          ))}
        </div>
      </section>

      {/* BOARD + TEAM */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div data-reveal="1" style={{ ...wrap("96px 32px"), textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, margin: "0 0 48px" }}>مجــلس أمـــناء المــؤسسة</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 28, maxWidth: 1140, margin: "0 auto" }}>
            {BOARD.map((m) => (
              <div key={m.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <PersonAvatar person={m} size={144} radius={16} />
                <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5 }}>{m.name}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-subtle)", marginTop: -10 }}>{m.role}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, margin: "72px 0 28px" }}>فريق الأستاذ</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 980, margin: "0 auto" }}>
            {TEAM.map((n) => (
              <div key={n} style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "14px 24px", fontSize: 16, fontWeight: 600 }}>{n}</div>
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

const wrap = (padding: string) => ({ maxWidth: "var(--container-max)", margin: "0 auto", padding }) as const;
const grid = (min: number) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 20 }) as const;
const eyebrowStyle = { fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 } as const;
const h2 = { fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, margin: "0 0 18px", lineHeight: 1.35 } as const;
const prose = { fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)" } as const;
const card = { background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 16, padding: 26 } as const;
const cardTitle = { fontSize: 18, fontWeight: 700, margin: "0 0 10px", color: "var(--ink)", lineHeight: 1.5 } as const;
const cardBody = { fontSize: 15, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 } as const;
