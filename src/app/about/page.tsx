import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PersonAvatar from "@/components/PersonAvatar";
import { BOARD, LICENSE, PARTNERS, SCALE, TEAM, monogram } from "@/lib/org";

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

// The dates the profile itself gives, read as a short rail under the intro.
const MILESTONES = [
  { y: "2023", t: "الانطلاق", d: "تأسيس مؤسسة الأستاذ من إيمانٍ بأن المعلّم ركيزة التعليم" },
  { y: "2024", t: "الترخيص الرسمي", d: "من المركز الوطني لتنمية القطاع غير الربحي في 20 أبريل" },
  { y: "اليوم", t: "تحت إشراف وزارة التعليم", d: "ضمن المجموعة الثانية: التعليم والأبحاث" },
  { y: "2030", t: "رؤية المملكة", d: "شريكٌ فاعل في بناء جيلٍ يحقق مستهدفاتها" },
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

      {/* MANIFESTO — who we are, and the dates that made it official */}
      <section className="ab-manifesto">
        <div className="ab-wrap ab-manifesto-grid" data-reveal="1">
          <div className="ab-manifesto-text">
            <div className="kicker">عن المؤسسة</div>
            <h2 className="ab-display">المعلّم <em>ركيزةُ</em> التعليم</h2>
            <p className="ab-lead">مؤسسة الأستاذ مؤسسة أهلية سعودية غير ربحية، انطلقت عام 2023م من إيمانٍ عميق بأن المعلّم ركيزةٌ أساسية من ركائز العملية التعليمية والقيمية.</p>
            <p className="ab-prose">ورُخّصت رسمياً من المركز الوطني لتنمية القطاع غير الربحي بتاريخ 20/04/2024م، وتعمل تحت إشراف وزارة التعليم، ضمن المجموعة الثانية للمنظمات والأنشطة التي تقود وتدير وتقدّم وتشجّع وتدعم الخدمات التعليمية والبحثية.</p>
            <p className="ab-prose">وتسعى المؤسسة إلى أن تكون مرجعاً وطنياً في خدمة المعلّم والتعليم، ومركز خبرةٍ وشريكاً فاعلاً لمنظومة التعليم والمجتمع في بناء جيلٍ من المتعلّمين يحققون رؤية المملكة 2030 ومستهدفاتها، من خلال مبادرات خلّاقة وفعّالة وذات أثر، بالتكامل مع وزارة التعليم والمؤسسات العامة المختصة.</p>
          </div>
          <figure className="ab-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${FR}/kvi7PxaoGkKKK99CbnbOWiTUDY.jpeg?width=1492&height=1024`} alt="طلاب أمام مبنى مدرسي" />
            <figcaption className="ab-portrait-seal">
              <span>منذ</span>
              <strong>2023</strong>
            </figcaption>
          </figure>
        </div>
        <ol className="ab-wrap ab-milestones" data-reveal-group>
          {MILESTONES.map((m) => (
            <li key={m.y}>
              <span className="ab-ms-year">{m.y}</span>
              <span className="ab-ms-t">{m.t}</span>
              <span className="ab-ms-d">{m.d}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* VISION / MISSION — the one line the foundation stands on */}
      <section className="ab-vision">
        <div className="ab-wrap ab-vision-grid" data-reveal="1">
          <div>
            <div className="kicker is-gold">رؤيتنا</div>
            <p className="ab-vision-q">الريادة في تعزيز مكانة <em>المعلّم.</em></p>
          </div>
          <div className="ab-mission">
            <div className="kicker is-gold">رسالتنا</div>
            <p>مؤسسة الأستاذ كيانٌ غير ربحي مستقل في تقديم خدمات ومنتجات نوعية ومبتكرة في تعزيز مكانة المعلّم، بالشراكة مع المجتمع والجهات المعنية، من خلال قنوات خدمة مباشرة وغير مباشرة، في سبيل تحقيق قيمة نوعية مستدامة.</p>
          </div>
        </div>
      </section>

      {/* WHY — the scale, set as a ledger of figures */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Head kicker="لماذا الأستاذ؟" title="حجمٌ غير مسبوق، وتوقيتٌ استراتيجي" />
          <div className="ab-ledger" data-reveal-group>
            {SCALE.map((s) => (
              <div key={s.u} className={`ab-figure${s.accent ? " is-accent" : ""}`}>
                <div className="ab-figure-n">{s.n}</div>
                <div className="ab-figure-u">{s.u}</div>
                <div className="ab-figure-d">{s.d}</div>
              </div>
            ))}
          </div>
          <div className="ab-why" data-reveal-group>
            <article>
              <span className="ab-why-tag">التوقيت</span>
              <h3>نضوج البنية المؤسسية</h3>
              <p>صدور نظام التعليم العام، وإنشاء مجلس التعليم العام، ونضج البنية المؤسسية لقطاع التعليم (هيئة تقويم التعليم والتدريب، والمعهد الوطني للتطوير المهني التعليمي)، يجعل المرحلة الحالية الأنسب لبناء لبنة جديدة تُعنى بمكانة المعلّم نفسه.</p>
            </article>
            <article className="is-dark">
              <span className="ab-why-tag">الاتجاه</span>
              <h3>انسجام تام مع رؤية 2030</h3>
              <p>كل مبادرة من مبادرات المؤسسة تصبّ في تنمية رأس المال البشري، وتنويع مسارات المعلّم المهنية، والتنويع الاقتصادي، والمشاركة المجتمعية.</p>
            </article>
          </div>
        </div>
      </section>

      {/* VALUES — six cells of one ruled sheet */}
      <section className="ab-sec is-shade">
        <div className="ab-wrap">
          <Head kicker="ما يحرّكنا" title="قيمنا" center />
          <div className="ab-values" data-reveal-group>
            {VALUES.map((v, i) => (
              <div key={v.t} className="ab-value">
                <span className="ab-value-n">{String(i + 1).padStart(2, "0")}</span>
                <div className="ab-value-ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{v.ico}</svg></div>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRATEGY — three pillars, each with its goals */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Head kicker="التطلّعات الاستراتيجية" title="ثلاثة مجالات استراتيجية" />
          <div className="ab-pillars">
            {AREAS.map((a) => (
              <article key={a.n} className="ab-pillar" data-reveal="1">
                <header>
                  <span className="ab-pillar-n">{a.n}</span>
                  <h3>{a.t}</h3>
                </header>
                <ul>
                  {a.goals.map((g) => (
                    <li key={g.t}>
                      <h4>{g.t}</h4>
                      <p>{g.d}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH CENTRE */}
      <section className="ab-wrap ab-research-wrap">
        <div className="ab-research" data-reveal="1">
          <div className="ab-research-main">
            <div className="kicker is-gold">القطب البحثي والمعرفي</div>
            <h2>مركز الأستاذ للتطوير والأبحاث</h2>
            <p>يعمل المركز بالتوازي مع مكوّنات منظومة الأستاذ لتحقيق أهدافها الاستراتيجية، ويتخصّص في رصد ودراسة الميدان التعليمي من منظور المعلّم، وإجراء الدراسات والأبحاث التطبيقية التي تخدم المؤسسة وشركاءها في اتخاذ قراراتٍ مستنيرة.</p>
            <p>ويتولّى المركز أيضاً توثيق أثر المبادرات والبرامج، وتطوير الأدلّة والآليات التي تسهم في التوسّع المستمر لمنظومة الأستاذ وتعزيز أثرها على المعلّم والمنظومة التعليمية والوطن.</p>
          </div>
          <aside className="ab-research-note">
            <span className="ab-research-tag">من أعمال المركز</span>
            <p>الدراسة التي بُني عليها مقترح <strong>«المرجعية المهنية الوطنية للمعلّم»</strong> المرفوع لولي العهد.</p>
          </aside>
        </div>
      </section>

      {/* IMPACT */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Head kicker="الأثر" title="الأثر الاجتماعي" />
          <ol className="ab-impact" data-reveal-group>
            {IMPACT.map((t, i) => {
              const [lead, ...rest] = t.split("،");
              return (
                <li key={i}>
                  <span className="ab-impact-n">{String(i + 1).padStart(2, "0")}</span>
                  <p><strong>{lead}</strong>{rest.length ? `،${rest.join("،")}` : ""}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* LICENCE — set as a certificate, beside the profile download */}
      <section className="ab-sec is-shade">
        <div className="ab-wrap ab-licence-grid" data-reveal="1">
          <div className="ab-cert">
            <div className="ab-cert-head">
              <span className="ab-cert-seal" aria-hidden>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
              </span>
              <div>
                <div className="kicker">المؤسسة</div>
                <h2>بيانات الترخيص</h2>
              </div>
            </div>
            <dl className="ab-cert-list">
              {LICENSE.map((r) => (
                <div key={r.k}>
                  <dt>{r.k}</dt>
                  <dd className={r.mono ? "is-mono" : undefined}>{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="ab-profile">
            <div className="ab-profile-doc" aria-hidden>
              <span>PDF</span>
            </div>
            <div className="kicker is-gold">الملف التعريفي</div>
            <h2>تعرّف على المؤسسة عن قرب</h2>
            <p>حمّل الملف التعريفي المفصّل لمؤسسة الأستاذ: التطلّعات الاستراتيجية، ومنصات الحضور والمحتوى، والجائزة الوطنية للمعلّم، والمبادرات، والأثر والفريق.</p>
            <div className="ab-profile-actions">
              <a href="/assets/alostath-profile.pdf" download className="btn btn-secondary btn-lg">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                تحميل الملف التعريفي (PDF)
              </a>
              <Link href="/press" className="ab-profile-link">الهوية البصرية: الملف الإعلامي ←</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Head kicker="الشراكات" title="شركاء النجاح" center />
          <ul className="ab-partners" data-reveal-group>
            {PARTNERS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* BOARD + TEAM */}
      <section className="ab-sec is-shade">
        <div className="ab-wrap">
          <Head kicker="قيادة المؤسسة" title="مجلس أمناء المؤسسة" center />
          <div className="ab-board" data-reveal-group>
            {BOARD.map((m, i) => (
              <figure key={m.name} className={`ab-member${i === 0 ? " is-chair" : ""}`}>
                <div className="ab-member-frame">
                  <PersonAvatar person={m} size={i === 0 ? 168 : 140} radius="var(--radius-round)" />
                </div>
                <figcaption>
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="ab-team" data-reveal="1">
            <h3>فريق الأستاذ</h3>
            <ul>
              {TEAM.map((n) => (
                <li key={n}><span aria-hidden>{monogram(n)}</span>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="ab-news">
        <div className="ab-news-in" data-reveal="1">
          <div className="kicker is-gold">النشرة البريدية</div>
          <h2>اشترك في النشرة البريدية لمؤسسة الأستاذ</h2>
          <p>كن على اطّلاعٍ دائم بأحدث المبادرات التعليمية، والبرامج التطويرية، والفرص المخصّصة للمعلّمين والطلاب.</p>
          <form data-newsletter-form>
            <div data-nl-success-state hidden className="ab-news-ok">
              <span>✓</span> شكراً لاشتراكك — سيصلك كلّ جديد.
            </div>
            <div data-nl-form-state>
              <div className="ab-news-field">
                <input type="email" required dir="ltr" placeholder="name@example.com" aria-label="البريد الإلكتروني" />
                <button type="submit" className="btn btn-secondary btn-lg">اشترك الآن</button>
              </div>
              <div className="ab-news-fine">نحن نحترم خصوصيتك — يمكنك إلغاء الاشتراك بضغطةٍ واحدة.</div>
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Head({ kicker, title, center = false }: { kicker: string; title: string; center?: boolean }) {
  return (
    <div className={`ab-head${center ? " is-center" : ""}`} data-reveal="1">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
    </div>
  );
}
