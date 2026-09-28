import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getAwards } from "@/lib/queries";
import type { Award } from "@/lib/types";

export const revalidate = 60;
export const metadata: Metadata = { title: "الجوائز" };

const STATUS = {
  open: { cls: "is-open", label: "التقديم مفتوح" },
  soon: { cls: "is-soon", label: "التقديم يفتح قريباً" },
  closed: { cls: "is-closed", label: "أُغلق التقديم" },
} as const;

const THEME = {
  gold: { badge: "badge-gold", accent: "var(--gold-500)", shadow: "var(--gold-100)", offset: "translate(14px,14px)" },
  olive: { badge: "badge-olive", accent: "var(--olive-500)", shadow: "var(--olive-100)", offset: "translate(-14px,14px)" },
  sage: { badge: "badge-olive", accent: "var(--olive-500)", shadow: "var(--olive-100)", offset: "translate(-14px,14px)" },
} as const;

// ── الجائزة الوطنية للمعلم — from the 2026 detailed profile (القسم الثالث) ──

const HISTORY = [
  { n: "8,000", l: "متقدّم تقريباً في الدورة الأولى" },
  { n: "5", l: "ملايين ريال وُزّعت في الدورة التاسعة" },
  { n: "114", l: "فائزاً، إلى جانب 26 سيارة" },
  { n: "10", l: "الدورة التي لم تُعلن نتائجها قط", dark: true },
];

const INTERNATIONAL = [
  { t: "الجائزة العالمية للمعلّم", y: "2015" },
  { t: "الولايات المتحدة · معلّم العام الوطني", y: "1952" },
  { t: "المملكة المتحدة · جوائز بيرسون الوطنية للتدريس", y: "1998" },
  { t: "أستراليا · جوائز بنك كومنولث للتدريس", y: "2016" },
  { t: "سنغافورة · جائزة الرئيس للمعلّمين", y: "1998" },
  { t: "الهند · الجائزة الوطنية للمعلّمين", y: "1958" },
  { t: "تسع مناطق · جوائز كامبريدج للمعلّم المتفاني", y: "2019" },
];

const REGIONAL = [
  { t: "جائزة محمد بن زايد لأفضل معلّم", y: "الإمارات · 2018" },
  { t: "جائزة حمدان بن راشد آل مكتوم", y: "دبي · 1998" },
  { t: "جائزة خليفة التربوية", y: "أبوظبي · 2007" },
  { t: "جائزة اليونسكو-حمدان لتطوير أداء المعلّمين", y: "عالمية بوقف إماراتي · 2008" },
  { t: "جائزة الملكة رانيا للتميّز التربوي", y: "الأردن · 2006" },
  { t: "جائزة التميّز التعليمي السعودية السابقة", y: "متوقفة · 2009", muted: true },
];

const FINDINGS = [
  { t: "الجائزة النقدية ليست الرافعة الأساسية دولياً", d: "تتمحور الجوائز العربية حول مبالغ نقدية كبيرة، بينما تعتمد الجوائز الدولية الرائدة في الولايات المتحدة والمملكة المتحدة وسنغافورة وكامبريدج على التقدير والتطوير المهني بلا مبالغ نقدية كبيرة." },
  { t: "الصرف المشروط يحوّل الجائزة إلى أداة استبقاء", d: "الجائزة العالمية للمعلّم تدفع مليون دولار على عشر سنوات مشروطة باستمرار الفائز في التدريس، وجائزة محمد بن زايد توزّع المليون درهم على خمس سنوات بواقع 200 ألف درهم سنوياً." },
  { t: "تعدّد المسارات مقابل الفائز الوحيد", d: "تتوسّع الجوائز العربية في الفئات والمستويات، مقابل مسار واحد وفائز وحيد في الجوائز الدولية." },
  { t: "الترشيح العام يصنع الحجم والمشروعية", d: "استقطبت جائزة الرئيس في سنغافورة 12,460 ترشيحاً، وجوائز كامبريدج 12,000 ترشيح من 129 دولة، وجائزة محمد بن زايد 9,546 مشاركاً." },
];

const COMPARE = [
  { k: "محور التكريم", a: "معلّم ممارس للتدريس", b: "مبادرة أو مؤسسة أو شخصية ريادية" },
  { k: "النطاق الجغرافي", a: "وطني عبر إدارات التعليم", b: "إقليمي وعالمي" },
  { k: "النطاق التعليمي", a: "التعليم العام المدرسي", b: "العام والجامعي والفني والتقني" },
  { k: "منهجية التقييم", a: "التحقّق الميداني من ممارسة المعلّم وأثرها", b: "تقييم المبادرة وأثرها" },
];

const FUNCTIONS = [
  { t: "التعرّف", d: "التعرّف على المعلّمين المتميّزين الذين يُحدثون أثراً ملموساً وقابلاً للقياس في تعلّم طلابهم، استناداً إلى معايير وأدوات تقييم واضحة وموثوقة." },
  { t: "التمكين", d: "تحويل التميّز إلى فرص مهنية مستدامة للفائزين، من خلال دعم تطوّرهم المهني، وتوفير فرص التأهيل والتقدّم الوظيفي، وتعزيز مكانتهم المهنية والمجتمعية، بما يتجاوز المكافأة المالية الآنية." },
  { t: "نقل الأثر", d: "توسيع أثر الممارسات التعليمية المتميّزة لتتجاوز أصحابها إلى الميدان التعليمي، من خلال توثيقها ونشرها وإتاحتها للاستفادة والتطبيق." },
];

const GOVERNANCE = [
  { t: "مجلس أمناء المؤسسة", d: "يعمل كمجلس أمناء الجائزة، مع إضافة مقاعد للجهات ذات العلاقة." },
  { t: "الجهاز الإداري للمؤسسة", d: "يدير الجائزة من النواحي الإدارية واللوجستية." },
  { t: "الشخصية القانونية للمؤسسة", d: "تُيسّر عملية استلام الهبات والتبرعات والأوقاف." },
];

const REWARD = [
  { t: "مبلغ نقدي على دفعات", d: "يُصرف على دفعات سنوية مرتبطة باستمرار الفائز في التدريس، فيتحوّل التكريم إلى أداة بقاء في المهنة لا مكافأة تُصرف مرة واحدة." },
  { t: "حصة مشروع مدرسي", d: "مخصّصة لمشروع تطويري داخل مدرسة الفائز، لا تُصرف له شخصياً، فينتقل الأثر من الفرد إلى المؤسسة." },
  { t: "حوافز مهنية من الوزارة", d: "الترقية، ونقاط الأداء الوظيفي، وأولوية الابتعاث والتدريب — أعلى الطبقات قيمة للمعلّم وأقلها كلفة نقدية على الجائزة." },
  { t: "تقدير غير نقدي متدرّج", d: "مستويات تقدير دون الجائزة الكبرى، تتيح تكريم أعداد أوسع بكلفة محدودة، وتجعل بلوغ المراحل النهائية ذا قيمة في ذاته." },
];

const FUNDING = [
  { t: "نادي المعلّم — أصل عقاري بشراكة استثمارية", d: "تُخصّص الدولة أرضاً للكيان، ويدخل في شراكة مع مستثمر لتطويرها إلى مرفق فندقي يضم نادياً للمعلّم، يجمع بين مرافق مدرّة للدخل وامتيازات مهنية واجتماعية لمعلّمي المملكة.", note: "يبني أصلاً رأسمالياً يبقى ملكاً للكيان، وهو الأطول أفقاً زمنياً." },
  { t: "محفظة استثمارية وقفية", d: "تُوجَّه المبالغ الواردة من المستثمرين والمانحين إلى محفظة استثمارية مُدارة، تُصرف عوائدها السنوية على الجائزة مع الحفاظ على أصلها.", note: "الأسرع تفعيلاً والأنسب لتأمين الدورات الأولى." },
  { t: "مدرسة — أصل تشغيلي مؤجَّر", d: "تقدّم وزارة التعليم للكيان مبنى مدرسياً في منطقة مأهولة أو تؤجّره له بقيمة رمزية، ويتولّى الكيان تشغيله وتأجيره لأغراض مدرّة للدخل.", note: "منخفض الكلفة وسريع التحصيل ومحدود السقف." },
];

function AwardRow({ award, reverse }: { award: Award; reverse: boolean }) {
  const t = THEME[award.theme] ?? THEME.gold;
  const s = STATUS[award.status];
  const media = (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, transform: t.offset, background: t.shadow, borderRadius: 18, zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={award.hero_image_url ?? "/assets/alostath-logo.png"}
        alt={award.name}
        style={{ position: "relative", zIndex: 1, width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 18, display: "block", border: "1px solid var(--hairline)" }}
      />
    </div>
  );
  const body = (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ width: 40, height: 2, background: t.accent }} />
        <span className={`badge ${t.badge}`}>{award.badge_label}</span>
        <span className={`dp-status on-light ${s.cls}`} style={{ fontSize: 13, padding: "6px 13px 6px 11px" }}>
          <span className="dot" />
          {s.label}
        </span>
      </div>
      <h2 style={{ fontSize: "clamp(30px,4vw,48px)", fontWeight: 700, margin: "0 0 18px" }}>{award.name}</h2>
      <p style={{ fontSize: 18, lineHeight: 1.95, color: "var(--text-muted)", margin: "0 0 20px" }}>{award.tagline}</p>
      <Link href={`/awards/${award.slug}`} className="btn btn-secondary btn-md">صفحة الجائزة الكاملة ←</Link>
    </div>
  );
  return (
    <div className="award-row" style={{ display: "grid", gridTemplateColumns: reverse ? "0.95fr 1.05fr" : "1.05fr 0.95fr", gap: 52, alignItems: "center" }}>
      {reverse ? <>{body}{media}</> : <>{media}{body}</>}
    </div>
  );
}

export default async function AwardsPage() {
  const awards = await getAwards();
  return (
    <PageShell active="awards">
      <PageHero
        eyebrow="تقديرٌ يتحوّل إلى تمكين"
        title="الجائزة الوطنية للمعلّم"
        lede="أداةٌ استراتيجية لتعزيز مكانة مهنة التدريس في المجتمع، تتجاوز الاحتفاء السنوي بالمتميّزين، ويُقاس نجاحها بحجم الأثر الذي تُحدثه في المهنة ومكانتها لا بعدد المكرَّمين."
      />

      {awards.map((award, i) => {
        const shaded = i % 2 === 1;
        return (
          <section
            key={award.id}
            id={award.slug}
            data-reveal="1"
            style={shaded
              ? { background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }
              : { maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px 56px" }}
          >
            {shaded ? (
              <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px" }}>
                <AwardRow award={award} reverse />
              </div>
            ) : (
              <AwardRow award={award} reverse={false} />
            )}
          </section>
        );
      })}

      {/* السياق — التجربة السابقة */}
      <section style={wrap("72px 32px 32px")}>
        <div data-reveal="1">
          <Head eyebrow="السياق والمسوّغ الاستراتيجي" title="التجربة السابقة — جائزة التعليم للتميّز" />
          <p style={{ ...lede, marginBottom: 32 }}>سبق للمملكة أن أطلقت «جائزة التعليم للتميّز» بقرار وزاري عام 1431هـ، وشملت سبع فئات: المعلّم المتميّز، المرشد الطلابي، المشرف التربوي، الإدارة المدرسية، المدرسة المتميّزة، الطالب المتميّز، العمل التطوعي المتميّز، والتميّز الإداري. ولم تعد الجائزة إلى الميدان منذ ذلك الحين.</p>
          <div data-reveal-group style={grid(220)}>
            {HISTORY.map((h) => (
              <div key={h.l} style={{ ...card, ...(h.dark ? { background: "var(--olive-900)", borderColor: "transparent", color: "var(--ink-inverse)" } : {}) }}>
                <div style={{ fontSize: "clamp(34px,4vw,46px)", fontWeight: 700, lineHeight: 1, color: h.dark ? "var(--gold-500)" : "var(--olive-600)", marginBottom: 12 }}>{h.n}</div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: h.dark ? "var(--inverse-muted)" : "var(--text-muted)" }}>{h.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الدرس المستخلص */}
      <section style={wrap("32px 32px")}>
        <div data-reveal="1" style={{ background: "var(--olive-900)", color: "var(--ink-inverse)", borderRadius: 22, padding: "clamp(36px,5vw,60px)" }}>
          <div style={{ ...eyebrowStyle, color: "var(--gold-500)" }}>الدرس المستخلص</div>
          <p style={{ fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 700, lineHeight: 1.55, margin: "0 0 18px" }}>الخلل الذي أوقف الجائزة السابقة خللٌ في الحوكمة والاستمرارية، لا في المعايير.</p>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--inverse-muted)", margin: 0, maxWidth: "80ch" }}>فقد توفّرت لها الميزانية والتغطية الوزارية والإقبال الميداني، وتوقّفت رغم ذلك، لأنها كانت أمانة عامة داخل الوزارة بلا شخصية اعتبارية مستقلة تُلزم بتسليم الدورة. والمطلوب كيانٌ مالكٌ للجائزة، لا نشاطٌ داخل جهة يظل عرضة للتوقف.</p>
        </div>
      </section>

      {/* الدراسة المعيارية */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", marginTop: 40 }}>
        <div style={wrap("80px 32px")}>
          <div data-reveal="1">
            <Head eyebrow="الدراسة المعيارية · 13 جائزة" title="ما تعلّمناه من التجارب الدولية والإقليمية" />
            <p style={{ ...lede, marginBottom: 32 }}>اختيرت بناءً على طول عمرها المؤسسي وحجم مشاركتها ومدى ملاءمة نموذج تصميمها لجائزة وطنية حكومية في سياق خليجي.</p>
          </div>
          <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28, marginBottom: 40 }}>
            <BenchList title="سبع جوائز دولية" items={INTERNATIONAL} />
            <BenchList title="ست جوائز إقليمية وعربية" items={REGIONAL} />
          </div>
          <h3 data-reveal="1" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>أبرز خلاصات المقارنة المرجعية</h3>
          <div data-reveal-group style={grid(280)}>
            {FINDINGS.map((f) => (
              <div key={f.t} style={card}>
                <h4 style={cardTitle}>{f.t}</h4>
                <p style={cardBody}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* التكامل مع جائزة اليونسكو */}
      <section style={wrap("80px 32px 40px")}>
        <div data-reveal="1">
          <Head eyebrow="الموقع الاستراتيجي والتمايز" title="التكامل مع الجائزة العالمية للجودة والتميّز في التعليم" />
          <p style={{ ...lede, marginBottom: 28 }}>أطلق المركز الإقليمي لليونسكو للجودة والتميّز في التعليم، ومقرّه الرياض، «الجائزة العالمية للجودة والتميّز في التعليم» بقيمة مليون دولار أمريكي، وأُعلن عنها رسمياً بمناسبة اليوم الدولي للتعليم لعام 2026 تحت شعار «معلّم مُتمكّن ومُمكِّن». والجائزتان لا تتنافسان بل تتكاملان:</p>
          <div style={{ overflowX: "auto", border: "1px solid var(--hairline)", borderRadius: 16, background: "var(--canvas)" }}>
            <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "var(--surface-1)" }}>
                  <th style={th}>وجه المقارنة</th>
                  <th style={th}>الجائزة الوطنية للمعلّم</th>
                  <th style={th}>الجائزة العالمية لليونسكو</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.k}>
                    <td style={{ ...td, color: "var(--text-muted)" }}>{r.k}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{r.a}</td>
                    <td style={td}>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* النطاق */}
      <section style={wrap("40px 32px")}>
        <div data-reveal="1">
          <Head eyebrow="الجائزة الوطنية للمعلّم" title="نطاق الجائزة وحدودها" />
          <div style={grid(280)}>
            <div style={card}>
              <h4 style={{ ...cardTitle, color: "var(--olive-600)" }}>تستهدف</h4>
              <p style={{ ...cardBody, color: "var(--ink)", fontSize: 17 }}>المعلّمين والمعلّمات الممارسين للتدريس حصراً.</p>
            </div>
            <div style={{ ...card, background: "var(--surface-1)" }}>
              <h4 style={{ ...cardTitle, color: "var(--text-subtle)" }}>لا تشمل</h4>
              <p style={cardBody}>الطلاب، والمشرفين التربويين، والموجّهين الطلابيين، والقيادات المدرسية، والإدارات.</p>
            </div>
          </div>
          <p style={{ ...lede, marginTop: 22 }}>هذا التضييق المتعمّد في النطاق لا يمثّل تقليصاً لأثر الجائزة، بل وسيلة لتعزيز هويتها ومكانتها لدى المعلّمين، وتركيز مواردها على اكتشاف التميّز في الممارسة التعليمية وإبرازه وتوسيع أثره.</p>
        </div>
      </section>

      {/* الغاية */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", marginTop: 40 }}>
        <div style={wrap("80px 32px")}>
          <div data-reveal="1">
            <Head eyebrow="غاية الجائزة" title="ثلاث وظائف متكاملة" />
          </div>
          <div data-reveal-group style={grid(260)}>
            {FUNCTIONS.map((f, i) => (
              <div key={f.t} style={card}>
                <div style={num}>{String(i + 1).padStart(2, "0")}</div>
                <h4 style={{ ...cardTitle, color: "var(--olive-600)" }}>{f.t}</h4>
                <p style={cardBody}>{f.d}</p>
              </div>
            ))}
          </div>
          <p data-reveal="1" style={{ ...lede, marginTop: 22, fontSize: 15 }}>وتركّز الجائزة على تقدير التميّز المهني للمعلّمين وتعزيز أثره في الميدان التعليمي، دون أن تحلّ محلّ أنظمة تقويم الأداء أو الترقيات، أو تمتدّ لتكريم الجهات والمؤسسات.</p>
        </div>
      </section>

      {/* بنية القيمة */}
      <section style={wrap("80px 32px 40px")}>
        <div data-reveal="1">
          <Head eyebrow="بنية القيمة" title="ما يحصل عليه الفائز" />
          <p style={{ ...lede, marginBottom: 28 }}>تُثبَّت في وثيقة التأسيس بنية ما يحصل عليه الفائز، لأن البنية هي ما يحدّد ماهية الجائزة، والمقدار مسألة ميزانية تُحسم لاحقاً.</p>
        </div>
        <div data-reveal-group style={grid(260)}>
          {REWARD.map((r) => (
            <div key={r.t} style={card}>
              <h4 style={cardTitle}>{r.t}</h4>
              <p style={cardBody}>{r.d}</p>
            </div>
          ))}
        </div>
        <p data-reveal="1" style={{ ...lede, marginTop: 22, fontSize: 15 }}>وإفراد هذه البنية في الوثيقة يمنع انحدار الجائزة في الدورات اللاحقة إلى مبلغ نقدي يُصرف مرة واحدة، وهو انحدارٌ قد يُبطل وظيفة التمكين.</p>
      </section>

      {/* الحوكمة */}
      <section style={wrap("40px 32px")}>
        <div data-reveal="1">
          <Head eyebrow="نموذج الحوكمة" title="تبنّي مؤسسة الأستاذ للجائزة في مرحلتها الحالية" />
          <p style={{ ...lede, marginBottom: 28 }}>بناءً على التطابق شبه التام بين غاية الجائزة ورسالة مؤسسة الأستاذ، يُقترح أن تتبنّى المؤسسة إدارة الجائزة والعناية بها، تجنّباً لتأخير الانطلاق بعامل الوقت اللازم لتأسيس كيان مستقل وتسجيله رسمياً.</p>
        </div>
        <div data-reveal-group style={grid(260)}>
          {GOVERNANCE.map((g) => (
            <div key={g.t} style={card}>
              <h4 style={cardTitle}>{g.t}</h4>
              <p style={cardBody}>{g.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* التمويل */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", marginTop: 40 }}>
        <div style={wrap("80px 32px")}>
          <div data-reveal="1">
            <Head eyebrow="التمويل" title="ثلاثة مسارات لبناء قاعدة أصول مدرّة للدخل" />
            <p style={{ ...lede, marginBottom: 28 }}>لا يُبنى تمويل الجائزة على مخصّص سنوي معتمد وحده، لأن الاعتماد على بند سنوي قابل للإيقاف هو أحد أوجه الهشاشة التي أوقفت الجائزة السابقة. والمسارات قابلة للتطبيق منفردة أو مجتمعة.</p>
          </div>
          <div data-reveal-group style={grid(280)}>
            {FUNDING.map((f, i) => (
              <div key={f.t} style={card}>
                <div style={num}>{String(i + 1).padStart(2, "0")}</div>
                <h4 style={cardTitle}>{f.t}</h4>
                <p style={{ ...cardBody, marginBottom: 14 }}>{f.d}</p>
                <p style={{ ...cardBody, fontSize: 14, color: "var(--text-subtle)" }}>{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تصور مستقبلي */}
      <section style={wrap("80px 32px 40px")}>
        <div data-reveal="1">
          <Head eyebrow="تصوّر مستقبلي" title="تطوّر الجائزة إلى كيان مستقل بشخصية اعتبارية" />
          <p style={lede}>يُقترح له مبدئياً اسم «مؤسسة جائزة خادم الحرمين الشريفين للمعلّم» — اسمٌ مقترح رهن الاعتماد ومسار الهوية — وتكون مؤسسة الأستاذ أحد أعضاء مجلس أمنائه. ويُؤسَّس منذ نشأته بأهلية قبول الأوقاف والهبات والوصايا وتملّك الأصول الاستثمارية، حتى لا يُضطر لاحقاً لتعديل وثيقته لاستقبال هذا النوع من الموارد.</p>
        </div>
      </section>

      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)", marginTop: 40 }}>
        <div data-reveal="1" style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "84px 32px", textAlign: "center" }}>
          <p className="txt-justify is-center" style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, lineHeight: 1.6, margin: "0 0 20px" }}>«أهم ما يمكن أن تثبته الجائزة في عامها الأول أنها ستظل قائمة في عامها السادس.»</p>
          <p className="txt-justify is-center" style={{ fontSize: 15, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 auto", maxWidth: "62ch" }}>الشريك المعرفي الذي أعدّ الدراسة المعيارية والإطار المرجعي: شركة تام للتطوير، بالتنسيق مع المعهد الوطني للتطوير المهني التعليمي ومؤسسة الأستاذ.</p>
        </div>
      </section>

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "84px 32px" }}>
        <div data-reveal="1" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, margin: "0 0 14px" }}>شريكٌ في صناعة جائزةٍ تبقى؟</h2>
          <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 auto 32px", maxWidth: "56ch" }}>نرحّب بالجهات والمانحين والمستثمرين الراغبين في دعم الجائزة الوطنية للمعلّم، وتابع إعلانات فتح باب الترشّح عبر نشرتنا البريدية وقنواتنا الرسمية.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">تواصل معنا</Link>
        </div>
      </section>
    </PageShell>
  );
}

function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <div style={eyebrowStyle}>{eyebrow}</div>
      <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, margin: "0 0 18px", lineHeight: 1.35 }}>{title}</h2>
    </>
  );
}

function BenchList({ title, items }: { title: string; items: { t: string; y: string; muted?: boolean }[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 14px" }}>{title}</h3>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it) => (
          <li key={it.t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, background: it.muted ? "var(--surface-2, var(--surface-1))" : "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "14px 18px", fontSize: 15 }}>
            <span style={{ fontWeight: 600, color: it.muted ? "var(--text-muted)" : "var(--ink)" }}>{it.t}</span>
            <span style={{ fontSize: 13, color: "var(--text-subtle)", whiteSpace: "nowrap" }}>{it.y}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const wrap = (padding: string) => ({ maxWidth: "var(--container-max)", margin: "0 auto", padding }) as const;
const grid = (min: number) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 20 }) as const;
const eyebrowStyle = { fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-600)", textTransform: "uppercase", marginBottom: 14 } as const;
const lede = { fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)", margin: 0, maxWidth: "80ch" } as const;
const card = { background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 16, padding: 28 } as const;
const cardTitle = { fontSize: 19, fontWeight: 700, margin: "0 0 10px", color: "var(--ink)", lineHeight: 1.5 } as const;
const cardBody = { fontSize: 15, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 } as const;
const num = { fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, color: "var(--sage-500)", marginBottom: 12 } as const;
const th = { textAlign: "right", padding: "16px 20px", fontWeight: 700, borderBottom: "1px solid var(--hairline)" } as const;
const td = { padding: "16px 20px", borderBottom: "1px solid var(--hairline)", lineHeight: 1.7 } as const;
