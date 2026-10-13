import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { NATIONAL_AWARD as A } from "@/lib/award";
import AwardToc from "./AwardToc";

export const metadata: Metadata = { title: A.name };

// ── الجائزة الوطنية للمعلم — from the 2026 detailed profile (القسم الثالث) ──
// The foundation's only award, so this page is the award itself, not a list.

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

const regProps = { "data-register": A.name, "data-register-status": A.status };

export default function AwardsPage() {
  return (
    <PageShell active="awards">
      <PageHero
        size="lg"
        badge={<span className="ph-badge"><span className="live-dot" />{A.badge}</span>}
        title={A.name}
        lede={A.tagline}
        meta={<div className="dp-status is-soon"><span className="dot" />{A.statusLabel}</div>}
        actions={
          <>
            <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
            <a href="#overview" className="btn btn-outline btn-on-dark btn-lg">عن الجائزة</a>
          </>
        }
      />

      <div className="aw-wrap aw-dossier">
        <AwardToc chapters={CHAPTERS} />

        <div className="aw-chapters">
          {/* 01 — عن الجائزة */}
          <section id="overview" className="aw-ch" data-reveal="1">
            <ChapterHead n={1} eyebrow="عن الجائزة" title="تقديرٌ يتحوّل إلى تمكين" />
            <div className="aw-intro">
              <p className="aw-lead">{A.overview}</p>
              <figure className="aw-intro-fig">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={A.image} alt={A.name} />
              </figure>
            </div>
            <dl className="aw-keys">
              <div><dt>تستهدف</dt><dd>{A.beneficiaries}</dd></div>
              <div><dt>النطاق</dt><dd>{A.scope}</dd></div>
              <div><dt>منهجية التقييم</dt><dd>التحقّق الميداني من الممارسة وأثرها</dd></div>
            </dl>
          </section>

          {/* 02 — السياق */}
          <section id="history" className="aw-ch" data-reveal="1">
            <ChapterHead n={2} eyebrow="السياق والمسوّغ الاستراتيجي" title="التجربة السابقة — جائزة التعليم للتميّز" />
            <p className="aw-p">سبق للمملكة أن أطلقت «جائزة التعليم للتميّز» بقرار وزاري عام 1431هـ، وشملت سبع فئات: المعلّم المتميّز، المرشد الطلابي، المشرف التربوي، الإدارة المدرسية، المدرسة المتميّزة، الطالب المتميّز، العمل التطوعي المتميّز، والتميّز الإداري. ولم تعد الجائزة إلى الميدان منذ ذلك الحين.</p>
            <div className="aw-ledger">
              {HISTORY.map((h) => (
                <div key={h.l} className={h.dark ? "is-stop" : undefined}>
                  <strong>{h.n}</strong>
                  <span>{h.l}</span>
                </div>
              ))}
            </div>
            <aside className="aw-lesson">
              <span className="aw-lesson-k">الدرس المستخلص</span>
              <p className="aw-lesson-q">الخلل الذي أوقف الجائزة السابقة خللٌ في الحوكمة والاستمرارية، لا في المعايير.</p>
              <p>فقد توفّرت لها الميزانية والتغطية الوزارية والإقبال الميداني، وتوقّفت رغم ذلك، لأنها كانت أمانة عامة داخل الوزارة بلا شخصية اعتبارية مستقلة تُلزم بتسليم الدورة. والمطلوب كيانٌ مالكٌ للجائزة، لا نشاطٌ داخل جهة يظل عرضة للتوقف.</p>
            </aside>
          </section>

          {/* 03 — الدراسة المعيارية */}
          <section id="benchmark" className="aw-ch" data-reveal="1">
            <ChapterHead n={3} eyebrow="الدراسة المعيارية · 13 جائزة" title="ما تعلّمناه من التجارب الدولية والإقليمية" />
            <p className="aw-p">اختيرت بناءً على طول عمرها المؤسسي وحجم مشاركتها ومدى ملاءمة نموذج تصميمها لجائزة وطنية حكومية في سياق خليجي.</p>
            <div className="aw-bench">
              <BenchList title="سبع جوائز دولية" items={INTERNATIONAL} />
              <BenchList title="ست جوائز إقليمية وعربية" items={REGIONAL} />
            </div>
            <h3 className="aw-h3">أبرز خلاصات المقارنة المرجعية</h3>
            <ol className="aw-findings">
              {FINDINGS.map((f, i) => (
                <li key={f.t}>
                  <span className="aw-findings-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 04 — التكامل مع اليونسكو */}
          <section id="unesco" className="aw-ch" data-reveal="1">
            <ChapterHead n={4} eyebrow="الموقع الاستراتيجي والتمايز" title="التكامل مع الجائزة العالمية للجودة والتميّز في التعليم" />
            <p className="aw-p">أطلق المركز الإقليمي لليونسكو للجودة والتميّز في التعليم، ومقرّه الرياض، «الجائزة العالمية للجودة والتميّز في التعليم» بقيمة مليون دولار أمريكي، وأُعلن عنها رسمياً بمناسبة اليوم الدولي للتعليم لعام 2026 تحت شعار «معلّم مُتمكّن ومُمكِّن». والجائزتان لا تتنافسان بل تتكاملان:</p>
            <div className="aw-versus">
              <div className="aw-versus-col is-ours">
                <div className="aw-versus-head">الجائزة الوطنية للمعلّم</div>
                {COMPARE.map((r) => (
                  <div key={r.k} className="aw-versus-row"><span>{r.k}</span><strong>{r.a}</strong></div>
                ))}
              </div>
              <span className="aw-versus-vs" title="تتكاملان">⇄</span>
              <div className="aw-versus-col">
                <div className="aw-versus-head">الجائزة العالمية لليونسكو</div>
                {COMPARE.map((r) => (
                  <div key={r.k} className="aw-versus-row"><span>{r.k}</span><strong>{r.b}</strong></div>
                ))}
              </div>
            </div>
          </section>

          {/* 05 — النطاق */}
          <section id="scope" className="aw-ch" data-reveal="1">
            <ChapterHead n={5} eyebrow="الجائزة الوطنية للمعلّم" title="نطاق الجائزة وحدودها" />
            <div className="aw-scope">
              <div className="is-in">
                <span className="aw-scope-ico" aria-hidden>✓</span>
                <h4>تستهدف</h4>
                <p>المعلّمين والمعلّمات الممارسين للتدريس حصراً.</p>
              </div>
              <div className="is-out">
                <span className="aw-scope-ico" aria-hidden>✕</span>
                <h4>لا تشمل</h4>
                <p>الطلاب، والمشرفين التربويين، والموجّهين الطلابيين، والقيادات المدرسية، والإدارات.</p>
              </div>
            </div>
            <p className="aw-p aw-note">هذا التضييق المتعمّد في النطاق لا يمثّل تقليصاً لأثر الجائزة، بل وسيلة لتعزيز هويتها ومكانتها لدى المعلّمين، وتركيز مواردها على اكتشاف التميّز في الممارسة التعليمية وإبرازه وتوسيع أثره.</p>
          </section>

          {/* 06 — الغاية */}
          <section id="purpose" className="aw-ch" data-reveal="1">
            <ChapterHead n={6} eyebrow="غاية الجائزة" title="ثلاث وظائف متكاملة" />
            <ol className="aw-chain">
              {FUNCTIONS.map((f, i) => (
                <li key={f.t}>
                  <span className="aw-chain-n">{i + 1}</span>
                  <h4>{f.t}</h4>
                  <p>{f.d}</p>
                </li>
              ))}
            </ol>
            <p className="aw-p aw-note">وتركّز الجائزة على تقدير التميّز المهني للمعلّمين وتعزيز أثره في الميدان التعليمي، دون أن تحلّ محلّ أنظمة تقويم الأداء أو الترقيات، أو تمتدّ لتكريم الجهات والمؤسسات.</p>
          </section>

          {/* 07 — بنية القيمة */}
          <section id="reward" className="aw-ch" data-reveal="1">
            <ChapterHead n={7} eyebrow="بنية القيمة" title="ما يحصل عليه الفائز" />
            <p className="aw-p">تُثبَّت في وثيقة التأسيس بنية ما يحصل عليه الفائز، لأن البنية هي ما يحدّد ماهية الجائزة، والمقدار مسألة ميزانية تُحسم لاحقاً.</p>
            <ol className="aw-layers">
              {REWARD.map((r, i) => (
                <li key={r.t} style={{ "--i": i } as React.CSSProperties}>
                  <span className="aw-layers-n">الطبقة {i + 1}</span>
                  <h4>{r.t}</h4>
                  <p>{r.d}</p>
                </li>
              ))}
            </ol>
            <p className="aw-p aw-note">وإفراد هذه البنية في الوثيقة يمنع انحدار الجائزة في الدورات اللاحقة إلى مبلغ نقدي يُصرف مرة واحدة، وهو انحدارٌ قد يُبطل وظيفة التمكين.</p>
          </section>

          {/* 08 — الحوكمة */}
          <section id="governance" className="aw-ch" data-reveal="1">
            <ChapterHead n={8} eyebrow="نموذج الحوكمة" title="تبنّي مؤسسة الأستاذ للجائزة في مرحلتها الحالية" />
            <p className="aw-p">بناءً على التطابق شبه التام بين غاية الجائزة ورسالة مؤسسة الأستاذ، يُقترح أن تتبنّى المؤسسة إدارة الجائزة والعناية بها، تجنّباً لتأخير الانطلاق بعامل الوقت اللازم لتأسيس كيان مستقل وتسجيله رسمياً.</p>
            <div className="aw-org">
              <div className="aw-org-root">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden />
                <strong>مؤسسة الأستاذ</strong>
                <span>الجهة المتبنّية للجائزة</span>
              </div>
              <ul>
                {GOVERNANCE.map((g) => (
                  <li key={g.t}>
                    <h4>{g.t}</h4>
                    <p>{g.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 09 — التمويل */}
          <section id="funding" className="aw-ch" data-reveal="1">
            <ChapterHead n={9} eyebrow="التمويل" title="ثلاثة مسارات لبناء قاعدة أصول مدرّة للدخل" />
            <p className="aw-p">لا يُبنى تمويل الجائزة على مخصّص سنوي معتمد وحده، لأن الاعتماد على بند سنوي قابل للإيقاف هو أحد أوجه الهشاشة التي أوقفت الجائزة السابقة. والمسارات قابلة للتطبيق منفردة أو مجتمعة.</p>
            <div className="aw-funding">
              {FUNDING.map((f, i) => (
                <article key={f.t}>
                  <span className="aw-funding-n">المسار {i + 1}</span>
                  <h4>{f.t}</h4>
                  <p>{f.d}</p>
                  <p className="aw-funding-note">{f.note}</p>
                </article>
              ))}
            </div>
          </section>

          {/* 10 — تصور مستقبلي */}
          <section id="future" className="aw-ch" data-reveal="1">
            <ChapterHead n={10} eyebrow="تصوّر مستقبلي" title="تطوّر الجائزة إلى كيان مستقل بشخصية اعتبارية" />
            <div className="aw-future">
              <span className="aw-future-k">الاسم المقترح · رهن الاعتماد</span>
              <p className="aw-future-name">مؤسسة جائزة خادم الحرمين الشريفين للمعلّم</p>
              <p>تكون مؤسسة الأستاذ أحد أعضاء مجلس أمنائه. ويُؤسَّس منذ نشأته بأهلية قبول الأوقاف والهبات والوصايا وتملّك الأصول الاستثمارية، حتى لا يُضطر لاحقاً لتعديل وثيقته لاستقبال هذا النوع من الموارد.</p>
            </div>
          </section>
        </div>
      </div>

      {/* QUOTE + CTA — one closing stage */}
      <section className="aw-close">
        <div className="aw-close-in" data-reveal="1">
          <blockquote>
            <p>«أهم ما يمكن أن تثبته الجائزة في عامها الأول أنها ستظل قائمة في عامها السادس.»</p>
            <footer>الشريك المعرفي الذي أعدّ الدراسة المعيارية والإطار المرجعي: شركة تام للتطوير، بالتنسيق مع المعهد الوطني للتطوير المهني التعليمي ومؤسسة الأستاذ.</footer>
          </blockquote>
          <div className="aw-close-cta">
            <h2>شريكٌ في صناعة جائزةٍ تبقى؟</h2>
            <p>نرحّب بالجهات والمانحين والمستثمرين الراغبين في دعم الجائزة الوطنية للمعلّم. وإن كنت معلّماً، سجّل اهتمامك ليصلك إشعار فور فتح باب الترشّح.</p>
            <div className="aw-close-actions">
              <button type="button" {...regProps} className="btn btn-secondary btn-lg">سجّل اهتمامك</button>
              <Link href="/contact" className="btn btn-outline btn-on-dark btn-lg">تواصل معنا للشراكة</Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const CHAPTERS = [
  { id: "overview", t: "عن الجائزة" },
  { id: "history", t: "التجربة السابقة" },
  { id: "benchmark", t: "الدراسة المعيارية" },
  { id: "unesco", t: "التكامل مع اليونسكو" },
  { id: "scope", t: "النطاق والحدود" },
  { id: "purpose", t: "الغاية" },
  { id: "reward", t: "بنية القيمة" },
  { id: "governance", t: "الحوكمة" },
  { id: "funding", t: "التمويل" },
  { id: "future", t: "تصوّر مستقبلي" },
];

function ChapterHead({ n, eyebrow, title }: { n: number; eyebrow: string; title: string }) {
  return (
    <header className="aw-ch-head">
      <span className="aw-ch-n" aria-hidden>{String(n).padStart(2, "0")}</span>
      <div>
        <div className="kicker">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
    </header>
  );
}

/** A benchmark list, read as a chronology: oldest first, the year set large. */
function BenchList({ title, items }: { title: string; items: { t: string; y: string; muted?: boolean }[] }) {
  const rows = items
    .map((it) => {
      const parts = it.y.split("·").map((x) => x.trim());
      const year = parts[parts.length - 1];
      const place = parts.length > 1 ? parts.slice(0, -1).join(" · ") : null;
      const [where, name] = it.t.includes("·") ? it.t.split("·").map((x) => x.trim()) : [place, it.t];
      return { name, where: where ?? place, year, muted: it.muted };
    })
    .sort((a, b) => Number(a.year) - Number(b.year));
  return (
    <div className="aw-bench-col">
      <h3>{title}</h3>
      <ul>
        {rows.map((r) => (
          <li key={r.name} className={r.muted ? "is-muted" : undefined}>
            <span className="aw-bench-y">{r.year}</span>
            <span className="aw-bench-t">
              <strong>{r.name}</strong>
              {r.where && <span>{r.where}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
