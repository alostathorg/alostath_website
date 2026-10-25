import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getInitiatives, getNews, getPosts } from "@/lib/queries";
import { NEWS_PATH, newsKindLabel } from "@/lib/news";
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
  const latestPosts = posts.slice(0, 3);
  const [leadNews, ...moreNews] = news.slice(0, 4);
  const featuredInitiatives = initiatives.slice(0, 5);

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
        actions={
          <>
            <Link href="/community" className="btn btn-secondary btn-lg">انضم لمجتمع الأستاذ</Link>
            <Link href="/initiatives" className="btn btn-outline btn-on-dark btn-lg">المبادرات</Link>
          </>
        }
        scrollCue="#about"
      />

      {/* ABOUT — the foundation's introduction lives here, not in the hero (the
          hero carries only the headline). The photo sits in a gold offset frame
          with a «since» seal; the founding facts are set as a ledger. */}
      <section id="about" className="home-about">
        <div className="home-about-in">
          <figure className="home-about-media" data-reveal="1">
            <div className="home-about-frame media-zoom">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${FR}/kvi7PxaoGkKKK99CbnbOWiTUDY.jpeg?width=1492&height=1024`} alt="طلاب أمام مبنى" />
            </div>
            <figcaption className="home-about-seal">
              <span>منذ</span>
              <strong>2023</strong>
            </figcaption>
          </figure>
          <div data-reveal="1">
            <div className="eyebrow" style={{ marginBottom: 14 }}>من نحن</div>
            <h2 className="h-accent home-about-title">عن الأستاذ</h2>
            <p className="home-about-lede">مؤسسة الأستاذ مؤسسة أهلية سعودية غير ربحية، انطلقت عام 2023م من إيمانٍ عميق بأن المعلّم ركيزةٌ أساسية من ركائز العملية التعليمية والقيمية. ورُخّصت رسمياً من المركز الوطني لتنمية القطاع غير الربحي بتاريخ 20/04/2024م، وتعمل تحت إشراف وزارة التعليم، ضمن المجموعة الثانية للمنظمات والأنشطة التي تقود وتدير وتقدّم وتشجّع وتدعم الخدمات التعليمية والبحثية.</p>
            <dl className="home-facts">
              {ABOUT_FACTS.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
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

      {/* AWARD — a light panel in the award's gold tint (the same pairing as
          its bento cell), set in the page's own heading, ledger and button.
          The photo is NATIONAL_AWARD.image, so the award page and this panel
          change together. */}
      <section id="awards" className="home-award">
        <div className="home-award-panel" data-reveal="1">
          <div className="home-award-copy">
            <div className="eyebrow" style={{ marginBottom: 14 }}>تقديرٌ يتحوّل إلى تمكين</div>
            <h2 className="h-accent">{NATIONAL_AWARD.name}</h2>
            <span className="badge badge-gold home-award-status">{NATIONAL_AWARD.statusLabel}</span>
            <p>{NATIONAL_AWARD.goal}</p>
            <dl className="home-facts">
              <div><dt>المستهدفون</dt><dd>المعلّمون الممارسون</dd></div>
              <div><dt>النطاق</dt><dd>{NATIONAL_AWARD.scope}</dd></div>
              <div><dt>معيار النجاح</dt><dd>الأثر في المهنة</dd></div>
            </dl>
            <Link href={AWARD_PATH} className="btn btn-primary btn-md">تعرّف على الجائزة</Link>
          </div>
          <figure className="home-award-photo">
            <div className="home-award-photo-frame media-zoom">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NATIONAL_AWARD.image} alt={NATIONAL_AWARD.name} />
            </div>
            <figcaption className="home-award-tag">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/alostath-logo-inverse.png" alt="مؤسسة الأستاذ" />
              <span>{NATIONAL_AWARD.badge}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* INITIATIVES — an editorial index. Most initiatives have no photo, so
          each row stands on its number, name and line; a photo, when there is
          one, shows as a thumbnail, and a themed pattern tile when there isn't. */}
      <section id="initiatives" className="home-init">
        <div className="home-init-in">
          <SectionHead eyebrow="الريادة في تعزيز مكانة المعلّم" title="أبرز مبادرات الأستاذ" href="/initiatives" cta="كل المبادرات ←" />
          {featuredInitiatives.length > 0 ? (
            <ol className="home-init-list" data-reveal-group>
              {featuredInitiatives.map((it, i) => {
                const img = it.hero_image_url ?? it.logo_url;
                return (
                  <li key={it.id}>
                    <Link href={`/initiatives/${it.slug}`} className={`home-init-row is-${it.theme === "sage" ? "sage" : "gold"}`}>
                      <span className="home-init-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="home-init-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {img && <img src={img} alt="" loading="lazy" />}
                      </span>
                      <span className="home-init-main">
                        {it.badge && <span className="home-init-badge">{it.badge}</span>}
                        <h3>{it.name}</h3>
                        {(it.tagline ?? it.overview) && <p>{it.tagline ?? it.overview}</p>}
                      </span>
                      <span className="home-init-arrow" aria-hidden>←</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="home-empty">تُنشر المبادرات هنا قريباً.</p>
          )}
        </div>
      </section>

      {/* MEDIA — the news leads: the latest item as a feature (image-led
          when it has a cover, a tinted type-led panel when it doesn't, as most
          don't), the next ones beneath it; the blog sits beside it as a compact
          column. Both stay present before anything is published and say so. */}
      <section id="media" className="home-media">
        <SectionHead eyebrow="المركز الإعلامي" title="الأخبار والمقالات" />
        <div className="home-media-grid">
          <div id="news" className="home-media-news" data-reveal="1">
            <div className="home-col-head">
              <h3>آخر الأخبار</h3>
              <Link href={NEWS_PATH} className="arrow-link">كل الأخبار <span className="arrow-link__a">←</span></Link>
            </div>
            {leadNews ? (
              <>
                <Link href={`${NEWS_PATH}/${leadNews.slug}`} className={`home-news-lead${leadNews.cover_url ? " has-cover" : ""}`}>
                  {leadNews.cover_url && (
                    <span className="home-news-lead-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={leadNews.cover_url} alt={leadNews.title} />
                    </span>
                  )}
                  <span className="home-news-lead-body">
                    <span className="home-news-meta">
                      <span className={`home-news-kind is-${leadNews.kind}`}>{newsKindLabel(leadNews.kind)}</span>
                      <span>{formatArabicDate(leadNews.published_at)}</span>
                    </span>
                    <strong>{leadNews.title}</strong>
                    {leadNews.excerpt && <span className="home-news-excerpt">{leadNews.excerpt}</span>}
                    <span className="arrow-link">اقرأ الخبر <span className="arrow-link__a">←</span></span>
                  </span>
                </Link>
                {moreNews.length > 0 && (
                  <ul className="home-news-list">
                    {moreNews.map((n) => (
                      <li key={n.id}>
                        <Link href={`${NEWS_PATH}/${n.slug}`} className="home-news-item">
                          <span className="home-news-meta">
                            <span className={`home-news-kind is-${n.kind}`}>{newsKindLabel(n.kind)}</span>
                            <span>{formatArabicDate(n.published_at)}</span>
                          </span>
                          <strong>{n.title}</strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="home-empty">لا توجد أخبار منشورة بعد.</p>
            )}
          </div>

          <div id="blog" className="home-media-blog" data-reveal="1">
            <div className="home-col-head">
              <h3>من مدونة الأستاذ</h3>
              <Link href="/blog" className="arrow-link">كل المقالات <span className="arrow-link__a">←</span></Link>
            </div>
            {latestPosts.length > 0 ? (
              <div className="home-post-list">
                {latestPosts.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="home-post-mini">
                    <span className="home-post-mini-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover_url ?? "/assets/alostath-logo.png"} alt={p.title} loading="lazy" />
                    </span>
                    <span>
                      {p.category && <span className="home-post-cat">{p.category}</span>}
                      <strong>{p.title}</strong>
                      <span className="home-post-date">{formatArabicDate(p.published_at)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="home-empty">لا توجد مقالات منشورة بعد.</p>
            )}
          </div>
        </div>
      </section>

      {/* JOIN — one closing band instead of two back-to-back asks: membership
          is the main offer (it takes a teacher), the newsletter beside it is the
          lighter option (it takes only an email). */}
      <section id="join" className="home-join">
        <span className="home-join-orb" aria-hidden />
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

// The founding facts, from the licence (lib/org LICENSE) — set as a ledger.
const ABOUT_FACTS = [
  { k: "الانطلاقة", v: "2023م" },
  { k: "الترخيص الرسمي", v: "20/04/2024م" },
  { k: "جهة الإشراف", v: "وزارة التعليم" },
];

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
