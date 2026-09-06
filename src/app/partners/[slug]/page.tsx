import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getBrandPartner, getBrandPartners } from "@/lib/queries";
import {
  PARTNERS_DISCLAIMER,
  PARTNERS_NAV_LABEL,
  PARTNERS_PATH,
  blurbFor,
  categoryLabel,
  ctaFor,
  normalizeExternalUrl,
  pricingLabel,
  text,
} from "@/lib/brandPartners";
import { PartnerCta, PartnerLogo } from "../PartnerBits";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getBrandPartners();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getBrandPartner(slug);
  return { title: p?.name ?? PARTNERS_NAV_LABEL, description: p ? blurbFor(p) : undefined };
}

const FACT_ICONS = [
  // category — tag
  <svg key="tag" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
  // pricing — wallet
  <svg key="wallet" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M16 12h4" /><path d="M2 10h20" /></svg>,
  // audience — users
  <svg key="users" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
];

export default async function PartnerDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, all] = await Promise.all([getBrandPartner(slug), getBrandPartners()]);
  if (!p) notFound();

  const cta = ctaFor(p);
  const website = normalizeExternalUrl(p.website_url);
  const offer = text(p.teacher_offer);
  const code = text(p.offer_code);
  const note = text(p.offer_note);
  const tagline = text(p.tagline);
  const overview = text(p.overview) ?? tagline ?? blurbFor(p);
  const location = text(p.location);
  const heroImage = text(p.hero_image_url);
  const audience = (p.audience ?? []).map((a) => a.trim()).filter(Boolean);
  const highlights = (p.highlights ?? []).filter((h) => h && (text(h.title) || text(h.body)));

  const idx = all.findIndex((i) => i.slug === p.slug);
  const hasPager = idx !== -1 && all.length > 1;
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  // Derived, never blank: the three answers a teacher wants before clicking through.
  const facts = [
    { k: "الفئة", v: categoryLabel(p.category) },
    { k: "التكلفة", v: offer ? `${pricingLabel(p.pricing)} — مع عرض للمعلّم` : pricingLabel(p.pricing) },
    { k: "لمن", v: audience.length ? audience.join("، ") : "المعلّمون والمعلّمات" },
  ];

  const outlineOnDark = { background: "transparent", color: "var(--ink-inverse)", borderColor: "rgba(244,246,238,0.4)" } as const;
  const eyebrow = { fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 14 } as const;

  return (
    <PageShell active="partners">
      {/* HERO */}
      <section className="dp-hero">
        <span className="dp-orb dp-orb-gold" />
        <span className="dp-orb dp-orb-sage" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden style={{ position: "absolute", bottom: -70, left: -70, width: "min(540px,50%)", height: "auto", opacity: 0.05, pointerEvents: "none" }} />
        <div className="dp-hero-inner hero-in">
          <div className="bp-hero-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--inverse-muted)", marginBottom: 26 }}>
                <Link href={PARTNERS_PATH} style={{ color: "var(--inverse-muted)", textDecoration: "none" }}>{PARTNERS_NAV_LABEL}</Link>
                <span style={{ opacity: 0.6 }}>/</span>
                <span style={{ color: "var(--gold-500)" }}>{p.name}</span>
              </div>
              <div className="bp-pills">
                {p.featured && (
                  <span className="bp-pill is-gold"><span className="live-dot" />شريك مميّز</span>
                )}
                <span className="bp-pill">{categoryLabel(p.category)}</span>
                <span className="bp-pill">{pricingLabel(p.pricing)}</span>
              </div>
              <h1 style={{ fontSize: "clamp(40px,6.4vw,76px)", fontWeight: 700, lineHeight: 1.1, margin: 0, overflowWrap: "anywhere" }}>{p.name}</h1>
              <div className="dp-rule" style={{ margin: "30px 0 0" }} />
              {tagline && (
                <p style={{ fontSize: "clamp(18px,2.2vw,24px)", lineHeight: 1.7, color: "var(--inverse-muted)", margin: "26px 0 0", maxWidth: "54ch" }}>{tagline}</p>
              )}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 36 }}>
                <PartnerCta partner={p} className="btn btn-secondary btn-lg" fallback="disabled" />
                <a href="#overview" className="btn btn-outline btn-lg" style={outlineOnDark}>اقرأ عن الشريك</a>
              </div>
              {cta.hostname && (
                <div className="bp-domain-line">الموقع: <span className="bp-domain" dir="ltr">{cta.hostname}</span></div>
              )}
            </div>
            <div className="bp-hero-plate">
              <PartnerLogo partner={p} eager />
            </div>
          </div>
        </div>
      </section>

      {/* FACTS — derived, always three */}
      <div className="dp-facts" data-reveal="1">
        <div className="dp-facts-inner">
          {facts.map((f, i) => (
            <div key={f.k} className="dp-fact">
              <div className="dp-fact-ico" style={i === 1 && offer ? { background: "var(--gold-50)", color: "var(--gold-700)" } : i === 2 ? { background: "var(--sage-50)", color: "var(--sage-700)" } : undefined}>
                {FACT_ICONS[i]}
              </div>
              <div>
                <div className="dp-fact-k">{f.k}</div>
                <div className="dp-fact-v" style={i === 2 ? { color: "var(--sage-700)" } : undefined}>{f.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TEACHER OFFER — the deal is the teacher's first question, so it sits right under the facts */}
      {offer && (
        <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "72px 32px 24px" }}>
          <div className="bp-offer-panel">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>عرض خاص للمعلّم</div>
              <h2>{offer}</h2>
              {note && <p>{note}</p>}
            </div>
            <div className="bp-offer-side">
              {code && (
                <div>
                  <div className="bp-code-k">رمز العرض</div>
                  <code className="bp-code" dir="ltr">{code}</code>
                </div>
              )}
              <PartnerCta partner={p} className="btn btn-primary btn-md" fallback="none" />
            </div>
          </div>
        </section>
      )}

      {/* OVERVIEW */}
      <section id="overview" data-reveal="1" style={{ maxWidth: 880, margin: "0 auto", padding: offer ? "48px 32px 32px" : "72px 32px 32px" }}>
        <div className="eyebrow" style={eyebrow}>عن {p.name}</div>
        <p style={{ fontSize: "clamp(20px,2.4vw,26px)", lineHeight: 1.85, color: "var(--text-body)", fontWeight: 500, margin: 0 }}>{overview}</p>
        {(location || (website && cta.hostname)) && (
          <div className="bp-meta-row">
            {location && <span>المقر: {location}</span>}
            {website && cta.hostname && (
              <span>
                الموقع:{" "}
                <a className="bp-domain" dir="ltr" href={website} target="_blank" rel="noopener noreferrer">{cta.hostname}</a>
              </span>
            )}
          </div>
        )}
      </section>

      {/* PRODUCT IMAGE */}
      {heroImage && (
        <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px" }}>
          <div className="bp-shot media-zoom">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt={`${p.name} — لقطة من المنتج`} />
          </div>
        </section>
      )}

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "32px 32px 56px" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, margin: "0 0 28px" }}>ماذا يقدّم للمعلّم</h2>
          <div data-reveal-group style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 18 }}>
            {highlights.map((h, i) => (
              <div key={i} className="dp-vcard" style={{ background: "var(--gold-50)", borderColor: "var(--gold-100)" }}>
                <div className="dp-vcard-num">{String(i + 1).padStart(2, "0")}</div>
                <div style={{ position: "relative" }}>
                  {text(h.title) && <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "var(--ink)" }}>{h.title}</div>}
                  {text(h.body) && <div className="txt-justify" style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)" }}>{h.body}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OUTBOUND — after the teacher has read everything */}
      <section data-reveal="1" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "24px 32px 56px" }}>
        <div className="bp-band" style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)", borderRadius: 20, padding: "clamp(36px,5vw,64px)", textAlign: "center" }}>
          <div className="bp-plate-sm">
            <PartnerLogo partner={p} />
          </div>
          <div style={{ ...eyebrow, color: "var(--gold-500)" }}>الخطوة التالية</div>
          <h2 style={{ fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 700, margin: "0 0 12px" }}>
            {cta.href ? `انتقل إلى ${p.name}` : `اسأل عن ${p.name}`}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 auto 28px", maxWidth: "52ch" }}>
            {cta.href ? "يفتح الرابط في نافذة جديدة على موقع الشريك." : "سيُضاف رابط الشريك قريباً — وحتى ذلك الحين يسعدنا الإجابة عن استفسارك."}
          </p>
          <PartnerCta partner={p} className="btn btn-secondary btn-lg" fallback="contact" />
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--inverse-subtle)", margin: "24px auto 0", maxWidth: "60ch" }}>{PARTNERS_DISCLAIMER}</p>
        </div>
      </section>

      {/* PAGER */}
      {hasPager && (
        <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 32px 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            <Link href={`${PARTNERS_PATH}/${prev.slug}`} className="dp-pager is-prev">
              <span className="dp-pager-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
              <span className="dp-pager-text"><div className="k">الشريك السابق</div><div className="t">{prev.name}</div></span>
            </Link>
            <Link href={`${PARTNERS_PATH}/${next.slug}`} className="dp-pager is-next">
              <span className="dp-pager-text"><div className="k">الشريك التالي</div><div className="t">{next.name}</div></span>
              <span className="dp-pager-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg></span>
            </Link>
          </div>
        </section>
      )}
    </PageShell>
  );
}
