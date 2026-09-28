import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PersonAvatar from "@/components/PersonAvatar";
import { getAwards, getInitiatives, getPosts, getSettings } from "@/lib/queries";
import { formatArabicDate } from "@/lib/format";
import { BOARD, PARTNERS, SCALE } from "@/lib/org";

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
  const [awards, initiatives, posts, settings] = await Promise.all([
    getAwards(),
    getInitiatives(),
    getPosts(),
    getSettings(),
  ]);
  const council = (settings.council as Record<string, string>) ?? {};
  const nextSession = council.next_session ?? "2026-08-05T19:00:00+03:00";
  const featuredPosts = posts.slice(0, 3);
  const featuredInitiatives = initiatives.slice(0, 3);
  const featuredAwards = awards.slice(0, 2);

  return (
    <PageShell active="home">
      <PageHero
        id="hero"
        size="xl"
        full
        image={`${FR}/5tFDyWZl3YM715jhXBbKzLNeJw.jpeg?width=1408&height=736`}
        imageOpacity={0.5}
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

      {/* PARTNERS */}
      <section style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--hairline)", padding: "44px 0", overflow: "hidden" }}>
        <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600, letterSpacing: "0.5px", color: "var(--ink-subtle)", marginBottom: 28 }}>شركاء النجاح</div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div className="marquee-track">
            {[0, 1].map((g) => (
              <div className="marquee-group" key={g} aria-hidden={g === 1}>
                {PARTNERS.map((name) => (
                  <span key={name} style={{ fontSize: 19, fontWeight: 700, color: "var(--olive-700, var(--ink))", whiteSpace: "nowrap", padding: "14px 26px", border: "1px solid var(--hairline)", borderRadius: 14, background: "var(--canvas)" }}>{name}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px" }}>
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

      {/* WHY — حجم غير مسبوق */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 32px 96px" }}>
        <div data-reveal="1" style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>لماذا الأستاذ؟</div>
          <h2 className="h-accent is-center" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, margin: 0, display: "inline-block" }}>حجمٌ غير مسبوق</h2>
        </div>
        <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {SCALE.map((s) => (
            <div key={s.u} className="card-lift" style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 18, padding: "28px 26px" }}>
              <div style={{ fontSize: "clamp(38px,4.6vw,54px)", fontWeight: 700, lineHeight: 1, color: s.accent ? "var(--gold-600)" : "var(--olive-600)", marginBottom: 14 }}>{s.n}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{s.u}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BOARD */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px", textAlign: "center" }}>
          <div data-reveal="1" style={{ marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>قيادة المؤسسة</div>
            <h2 className="h-accent is-center" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, margin: 0, display: "inline-block" }}>مجــلس أمـــناء المــؤسسة</h2>
          </div>
          <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 22, maxWidth: 1140, margin: "0 auto" }}>
            {BOARD.map((m) => (
              <div key={m.name} className="card-lift" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 18, padding: "28px 18px" }}>
                <PersonAvatar person={m} size={124} radius="var(--radius-round)" />
                <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5 }}>{m.name}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-subtle)", marginTop: -8 }}>{m.role}</div>
              </div>
            ))}
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

      {/* COUNCIL COUNTDOWN */}
      <section id="almajlis" style={{ maxWidth: "var(--container-max)", margin: "56px auto 0", padding: "0 32px" }}>
        <div data-reveal="1" data-countdown-target={nextSession} style={{ position: "relative", overflow: "hidden", borderRadius: 24, background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
          {council.hero_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={council.hero_image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} />
          )}
          <div style={{ position: "relative", padding: "clamp(40px,6vw,72px) clamp(28px,5vw,64px)", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 14 }}>مجلس الأستاذ</div>
            <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", fontWeight: 700, margin: "0 0 16px" }}>مجلسنا القادم قـــــــــرب</h2>
            <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--inverse-muted)", maxWidth: "62ch", margin: "0 auto 40px" }}>منصّة حوارٍ مهني تجمع المعلّمين مع الخبراء والجهات الحكومية والخاصة، لتحويل صوت المعلّم إلى شراكةٍ فاعلة في مناقشة القضايا التعليمية وصناعة المبادرات ذات الأثر.</p>
            <div style={{ display: "flex", gap: "clamp(10px,2vw,20px)", justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
              {[["secs", "ثوانٍ"], ["mins", "دقائق"], ["hours", "ساعات"], ["days", "أيام"]].map(([k, label]) => (
                <div key={k} style={{ background: "rgba(244,246,238,0.06)", border: "1px solid rgba(244,246,238,0.14)", borderRadius: 16, padding: "20px 8px", minWidth: 96 }}>
                  <div data-countdown={k} style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, color: "var(--gold-500)", lineHeight: 1 }}>--</div>
                  <div style={{ fontSize: 14, color: "var(--inverse-subtle)", marginTop: 8 }}>{label}</div>
                </div>
              ))}
            </div>
            <Link href="/council" className="btn btn-secondary btn-lg">سجّل اهتمامك</Link>
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section id="awards" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 40px" }}>
        <SectionHead eyebrow="تقديرٌ يتحوّل إلى تمكين" title="الجائزة الوطنية للمعلّم" href="/awards" cta="عن الجائزة ←" />
        <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28 }}>
          {featuredAwards.map((a) => (
            <Link key={a.id} href={`/awards/${a.slug}`} className="card-lift" style={cardStyle}>
              <div className="media-zoom">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.hero_image_url ?? "/assets/alostath-logo.png"} alt={a.name} style={{ width: "100%", height: 248, objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: 32, display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 14px" }}>{a.name}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.9, color: "var(--text-muted)", margin: 0 }}>{a.overview ?? a.tagline}</p>
                <span className="arrow-link" style={{ marginTop: 18, fontSize: 15 }}>التفاصيل <span className="arrow-link__a">←</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INITIATIVES */}
      <section id="initiatives" style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", marginTop: 56 }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px" }}>
          <SectionHead eyebrow="الريادة في تعزيز مكانة المعلّم" title="أبرز مبادرات الأستاذ" href="/initiatives" cta="كل المبادرات ←" />
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
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 40px" }}>
        <SectionHead eyebrow="مقالات وأخبار" title="من مدونة الأستاذ" href="/blog" cta="كل المقالات ←" />
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
      </section>

      {/* COMMUNITY — the richer counterpart to the newsletter band below:
          the newsletter takes an email, this takes a teacher. */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 32px 96px" }}>
        <div
          data-reveal="1"
          className="home-community"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--hairline)",
            borderRadius: 24,
            padding: "clamp(36px,5vw,60px)",
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: "var(--gold-600)", marginBottom: 14 }}>مجتمع الأستاذ</div>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, margin: "0 0 14px", lineHeight: 1.3 }}>
              كن جزءاً من صناعة القرار، لا متابعاً له فقط
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 0 28px", maxWidth: "58ch" }}>
              انضمّ إلى مجتمع الأستاذ لتصلك أخبار الجوائز والمبادرات والمجلس أولاً بأول، ولتشارك
              بأفكارك في تطوير ما نعمل عليه. العضوية مجانية، والانسحاب بضغطةٍ واحدة.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/community#join" className="btn btn-primary btn-lg">انضمّ إلى المجتمع</Link>
              <Link href="/community#idea" className="btn btn-outline btn-lg">شارك فكرتك</Link>
            </div>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {["أخبار الجوائز والمبادرات أولاً", "صوتك في تطوير المبادرات", "دعوات جلسات المجلس", "فرص التطوّع والتحكيم"].map((t) => (
              <li key={t} className="c-pill" style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 15.5, fontWeight: 600 }}>
                <span className="c-dot" style={{ width: 9, height: 9, borderRadius: 9999, background: "var(--gold-500)", flex: "none" }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${FR}/5tFDyWZl3YM715jhXBbKzLNeJw.jpeg?width=1408&height=736`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "96px 32px", textAlign: "center", color: "var(--ink-inverse)" }}>
          <h2 style={{ fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 700, lineHeight: 1.35, margin: "0 0 18px" }}>اشترك في النشرة البريدية لمؤسسة الأستاذ</h2>
          <p className="txt-justify is-center" style={{ fontSize: 17, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 0 36px" }}>انضمّ إلى النشرة البريدية لمؤسسة الأستاذ وكن على اطّلاعٍ دائم بأحدث المبادرات التعليمية، والبرامج التطويرية، والفرص المخصّصة للمعلّمين والطلاب. نشاركك كلّ جديدٍ يصنع أثراً في مستقبل التعليم.</p>
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

function SectionHead({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href: string; cta: string }) {
  return (
    <div data-reveal="1" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 48 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>
        <h2 className="h-accent" style={{ fontSize: "clamp(28px,3.8vw,46px)", fontWeight: 700, margin: 0, display: "inline-block" }}>{title}</h2>
      </div>
      <Link href={href} className="btn btn-secondary btn-md">{cta}</Link>
    </div>
  );
}
