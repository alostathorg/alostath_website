import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getInitiatives, getNews, getPosts } from "@/lib/queries";
import { NEWS_PATH } from "@/lib/news";
import NewsCard from "./news/NewsCard";
import { AWARD_PATH, NATIONAL_AWARD } from "@/lib/award";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;

const FR = "https://framerusercontent.com/images";

// The system as the 2026 profile lays it out: the community, the presence &
// content platforms, the national award, the initiatives, and the research
// centre that ties them together.
const BENTO = [
  { t: "مجتمع الأستاذ", d: "يجمع مجتمع الأستاذ معلّمي الوطن ومعلّماته في مساحةٍ مهنية واحدة تصلهم بالمعرفة والخبرات والفرص، وتقرّب صوتهم من كل ما يُسهم في تطوير المهنة، بما يعزّز حضورهم وأثرهم في الميدان التعليمي والمجتمع.", ico: "/assets/community-ico.svg", full: true, href: "/community", cta: "انضم إلى المجتمع", bg: "var(--olive-50)", border: "var(--olive-100)", ink: "var(--ink)", muted: "var(--text-muted)" },
  { t: "منصات الحضور والمحتوى", d: "مجلس الأستاذ منصة تعارفٍ وتكامل بين المعلّم والجهات المؤثّرة في منظومة التعليم، و«يوميات معلّم» أعمالٌ وثائقية ودرامية وحوارية تنقل صوت المعلّم، وبودكاست «حديث الأستاذ» يرسّخ صورته في الوجدان العام.", ico: `${FR}/oW8wZAFatzZf7ir8MDTyUDhp3M.png?width=597&height=596`, span2: true, bg: "var(--sage-50)", border: "var(--sage-100)", ink: "var(--ink)", muted: "var(--text-muted)" },
  { t: "الجائزة الوطنية للمعلّم", d: "جائزةٌ وطنية مستدامة تتعرّف على المعلّمين الممارسين المتميّزين، وتحوّل تميّزهم إلى فرصٍ مهنية، وتنقل ممارساتهم إلى الميدان — ويُقاس نجاحها بأثرها في المهنة لا بعدد المكرَّمين.", ico: `${FR}/WbdvWBZBTjJHiAqQ6PYvjlZi8.png?width=596&height=596`, span2: true, bg: "var(--gold-50)", border: "var(--gold-100)", ink: "var(--ink)", muted: "var(--text-muted)" },
  { t: "مبادرات الأستاذ", d: "حزمةٌ من البرامج والخدمات والفرص التي تعزّز جودة حياة المعلّم المهنية والمعيشية: ناصية لتأهيل المعلّمين سفراءَ في الفعاليات الكبرى، واتحداك مدارس للنشاط البدني، والجمعية التعاونية للمعلّمين.", ico: `${FR}/u3gZvgjooyNzqcrahQkvdPHl0.png?width=596&height=596`, span2: true, bg: "var(--surface-1)", border: undefined, ink: "var(--ink)", muted: "var(--text-muted)" },
  { t: "مركز الأستاذ للتطوير والأبحاث", d: "القطب البحثي والمعرفي لمنظومة الأستاذ: يرصد الميدان التعليمي من منظور المعلّم، ويُجري الدراسات التطبيقية التي تخدم المؤسسة وشركاءها في اتخاذ قراراتٍ مستنيرة، ويوثّق أثر المبادرات والبرامج.", ico: `${FR}/qgC0zLqifmgun1NVVyhrXhBGkM.png?width=596&height=596`, span2: true, bg: "var(--olive-900)", border: "transparent", ink: "var(--ink-inverse)", muted: "var(--inverse-muted)" },
];

export default async function HomePage() {
  const [initiatives, news, posts] = await Promise.all([
    getInitiatives(),
    getNews(),
    getPosts(),
  ]);
  const featuredPosts = posts.slice(0, 3);
  const latestNews = news.slice(0, 3);
  const featuredInitiatives = initiatives.slice(0, 3);

  return (
    <PageShell active="home">
      <PageHero
        id="hero"
        size="xl"
        full
        image={`${FR}/5tFDyWZl3YM715jhXBbKzLNeJw.jpeg?width=1408&height=736`}
        imageOpacity={1}
        eyebrow="مؤسسة الأستاذ"
        title="المعلم"
        accent="ناظر القيم"
        lede="مؤسسة أهلية سعودية غير ربحية لتعزيز مكانة المعلّم، تسعى لأن تكون مرجعاً وطنياً في خدمة المعلّم والتعليم، وشريكاً فاعلاً لمنظومة التعليم والمجتمع في تحقيق رؤية المملكة 2030، من خلال مبادرات خلّاقة وفعّالة وذات أثر بالتكامل مع وزارة التعليم والمؤسسات العامة المختصة."
        actions={
          <>
            <Link href="/community" className="btn btn-secondary btn-lg">انضم لمجتمع الأستاذ</Link>
            <Link href="/initiatives" className="btn btn-outline btn-on-dark btn-lg">المبادرات</Link>
          </>
        }
        scrollCue="#about"
      />

      {/* ABOUT */}
      <section id="about" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 24px" }}>
        <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 56, alignItems: "center" }}>
          <div className="media-zoom" style={{ position: "relative", borderRadius: 16, border: "1px solid var(--hairline)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${FR}/kvi7PxaoGkKKK99CbnbOWiTUDY.jpeg?width=1492&height=1024`} alt="طلاب أمام مبنى" style={{ width: "100%", height: "auto", borderRadius: 16, display: "block" }} />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>من نحن</div>
            <h2 className="h-accent" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 700, margin: "0 0 22px", color: "var(--color-primary)" }}>عن الأستاذ</h2>
            <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)", margin: "0 0 18px" }}>مؤسسة الأستاذ مؤسسة أهلية سعودية غير ربحية، انطلقت عام 2023م من إيمانٍ عميق بأن المعلّم ركيزةٌ أساسية من ركائز العملية التعليمية والقيمية. ورُخّصت رسمياً من المركز الوطني لتنمية القطاع غير الربحي بتاريخ 20/04/2024م، وتعمل تحت إشراف وزارة التعليم، ضمن المجموعة الثانية للمنظمات والأنشطة التي تقود وتدير وتقدّم وتشجّع وتدعم الخدمات التعليمية والبحثية.</p>
            <p style={{ fontSize: 17, lineHeight: 1.9, color: "var(--text-muted)", margin: "0 0 28px" }}>وتسعى المؤسسة إلى أن تكون مرجعاً وطنياً في خدمة المعلّم والتعليم، ومركز خبرةٍ وشريكاً فاعلاً لمنظومة التعليم والمجتمع في بناء جيلٍ من المتعلّمين يحققون رؤية المملكة 2030 ومستهدفاتها.</p>
            <Link href="/about" className="btn btn-primary btn-md">أعرف أكثر</Link>
          </div>
        </div>
      </section>

      {/* SYSTEM (bento) */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 40px" }}>
        <div data-reveal="1" style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>حلولٌ متكاملة</div>
          <h2 className="h-accent is-center" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 700, margin: "0 auto 16px", display: "inline-block" }}>منظومة الأستاذ</h2>
          <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--text-muted)", maxWidth: "70ch", margin: "0 auto" }}>منظومة الأستاذ المتكاملة تعزّز مكانة المعلّم المهنية والمجتمعية، وتوفّر له بيئةً داعمة للتطوير المستمر وتحسين جودة حياته المهنية والمعيشية، وذلك عبر المكوّنات التالية:</p>
        </div>
        <div className="bento" data-reveal-group>
          {BENTO.map((b) => (
            <div key={b.t} data-reveal="1" className={`bento-cell${b.full ? " span-full" : b.span2 ? " span2" : ""}`} style={{ background: b.bg, ...(b.border ? { borderColor: b.border } : {}), ...(b.ink === "var(--ink-inverse)" ? { color: "var(--ink-inverse)" } : {}) }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bento-ico" src={b.ico} alt={b.t} />
              <div>
                <h3 style={{ color: b.ink }}>{b.t}</h3>
                <p style={{ color: b.muted }}>{b.d}</p>
              </div>
              {b.href && (
                <Link href={b.href} className="btn btn-primary btn-md bento-cta">{b.cta}</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AWARDS */}
      <section id="awards" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 40px" }}>
        {/* The card below is the link; a second "عن الجائزة" button would point to the same page. */}
        <SectionHead eyebrow="تقديرٌ يتحوّل إلى تمكين" title={NATIONAL_AWARD.name} />
        <div data-reveal="1">
          <Link href={AWARD_PATH} className="card-lift" style={{ ...cardStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
            <div className="media-zoom">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NATIONAL_AWARD.image} alt={NATIONAL_AWARD.name} style={{ width: "100%", height: "100%", minHeight: 260, objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ padding: "clamp(28px,4vw,44px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="badge badge-gold" style={{ alignSelf: "flex-start", marginBottom: 16 }}>{NATIONAL_AWARD.statusLabel}</span>
              <p style={{ fontSize: 17, lineHeight: 1.95, color: "var(--text-muted)", margin: 0 }}>{NATIONAL_AWARD.overview}</p>
              <span className="arrow-link" style={{ marginTop: 20, fontSize: 15 }}>التفاصيل <span className="arrow-link__a">←</span></span>
            </div>
          </Link>
        </div>
      </section>

      {/* INITIATIVES */}
      <section id="initiatives" style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", marginTop: 56 }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px" }}>
          <SectionHead eyebrow="الريادة في تعزيز مكانة المعلّم" title="أبرز مبادرات الأستاذ" href="/initiatives" cta="كل المبادرات ←" />
          {featuredInitiatives.length > 0 ? (
          <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
            {featuredInitiatives.map((it) => (
              <Link key={it.id} href={`/initiatives/${it.slug}`} className="card-lift" style={cardStyle}>
                <div className="media-zoom">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.hero_image_url ?? it.logo_url ?? "/assets/alostath-logo.png"} alt={it.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: 30, display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: 23, fontWeight: 700, margin: "0 0 12px" }}>{it.name}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 }}>{it.overview ?? it.tagline}</p>
                  <span className="arrow-link" style={{ marginTop: 16, fontSize: 14 }}>التفاصيل <span className="arrow-link__a">←</span></span>
                </div>
              </Link>
            ))}
          </div>
          ) : (
            <p className="home-empty">تُنشر المبادرات هنا قريباً.</p>
          )}
        </div>
      </section>

      {/* NEWS — always present so the section is discoverable; before the
          first item is published it says so instead of disappearing. */}
      <section id="news" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 0" }}>
        <SectionHead eyebrow="المركز الإعلامي" title="آخر الأخبار" href={NEWS_PATH} cta="كل الأخبار ←" />
        {latestNews.length > 0 ? (
          <div className="news-grid is-fit" data-reveal-group>
            {latestNews.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        ) : (
          <p className="news-empty">لا توجد أخبار منشورة بعد.</p>
        )}
      </section>

      {/* BLOG */}
      <section id="blog" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 40px" }}>
        <SectionHead eyebrow="مقالات وقراءات" title="من مدونة الأستاذ" href="/blog" cta="كل المقالات ←" />
        {featuredPosts.length > 0 ? (
        <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
          {featuredPosts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="card-lift" style={cardStyle}>
              <div className="media-zoom">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover_url ?? "/assets/alostath-logo.png"} alt={p.title} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: 30, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--olive-600)", marginBottom: 10 }}>{p.category}</div>
                <h3 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.45, color: "var(--ink)" }}>{p.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 0 16px", flex: 1 }}>{p.excerpt}</p>
                <div style={{ fontSize: 13, color: "var(--ink-subtle)" }}>{formatArabicDate(p.published_at)}</div>
              </div>
            </Link>
          ))}
        </div>
        ) : (
          <p className="home-empty">لا توجد مقالات منشورة بعد.</p>
        )}
      </section>

      {/* JOIN — one closing band instead of two back-to-back asks: membership
          is the main offer (it takes a teacher), the newsletter beside it is the
          lighter option (it takes only an email). */}
      <section id="join" className="home-join">
        <div className="home-join-in">
          <div data-reveal="1">
            <div className="home-join-kicker">مجتمع الأستاذ</div>
            <h2>كن جزءاً من صناعة القرار، لا متابعاً له فقط</h2>
            <p className="home-join-lede">
              انضمّ إلى مجتمع الأستاذ لتصلك أخبار الجوائز والمبادرات والمجلس أولاً بأول، ولتشارك
              بأفكارك في تطوير ما نعمل عليه. العضوية مجانية، والانسحاب بضغطةٍ واحدة.
            </p>
            <ul className="home-join-perks">
              {["أخبار الجوائز والمبادرات أولاً", "صوتك في تطوير المبادرات", "دعوات جلسات المجلس", "فرص التطوّع والتحكيم"].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="home-join-actions">
              <Link href="/community#join" className="btn btn-secondary btn-lg">انضمّ إلى المجتمع</Link>
              <Link href="/community#idea" className="btn btn-outline btn-on-dark btn-lg">شارك فكرتك</Link>
            </div>
          </div>

          <div className="home-nl" data-reveal="1">
            <h3>أو اكتفِ بالنشرة البريدية</h3>
            <p>أحدث المبادرات التعليمية والبرامج التطويرية والفرص المخصّصة للمعلّمين والطلاب، في بريدك.</p>
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
        </div>
      </section>
    </PageShell>
  );
}

const cardStyle = {
  background: "var(--canvas)",
  border: "1px solid var(--hairline)",
  borderRadius: 18,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  textDecoration: "none",
  color: "inherit",
} as const;

function SectionHead({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href?: string; cta?: string }) {
  return (
    <div data-reveal="1" className="home-head">
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>
        <h2 className="h-accent">{title}</h2>
      </div>
      {href && cta && <Link href={href} className="btn btn-secondary btn-md">{cta}</Link>}
    </div>
  );
}
