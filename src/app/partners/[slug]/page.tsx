import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { DetailFigure, DetailPager, Monument, SectionHead } from "@/components/DetailKit";
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
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx !== -1 && idx < all.length - 1 ? all[idx + 1] : null;

  // Derived, never blank: the three answers a teacher wants before clicking through.
  const facts = [
    { k: "الفئة", v: categoryLabel(p.category) },
    { k: "التكلفة", v: offer ? `${pricingLabel(p.pricing)} — مع عرض للمعلّم` : pricingLabel(p.pricing) },
    { k: "لمن", v: audience.length ? audience.join("، ") : "المعلّمون والمعلّمات" },
  ];

  let chapter = 0;
  const chapterNo = () => (chapter += 1);

  return (
    <PageShell active="partners">
      <PageHero
        size="lg"
        crumbs={[{ label: PARTNERS_NAV_LABEL, href: PARTNERS_PATH }, { label: p.name }]}
        badge={
          <div className="bp-pills">
            {p.featured && (
              <span className="bp-pill is-gold"><span className="live-dot" />شريك مميّز</span>
            )}
            <span className="bp-pill">{categoryLabel(p.category)}</span>
            <span className="bp-pill">{pricingLabel(p.pricing)}</span>
          </div>
        }
        title={p.name}
        lede={tagline || undefined}
        actions={
          <>
            <PartnerCta partner={p} className="btn btn-secondary btn-lg" fallback="disabled" />
            <a href="#overview" className="btn btn-outline btn-on-dark btn-lg">اقرأ عن الشريك</a>
          </>
        }
        below={
          cta.hostname ? (
            <div className="bp-domain-line">الموقع: <span className="bp-domain" dir="ltr">{cta.hostname}</span></div>
          ) : undefined
        }
        aside={
          <div className="bp-hero-plate">
            <PartnerLogo partner={p} eager />
          </div>
        }
      />

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
        <section className="dp-sec" data-reveal="1">
          <SectionHead index={chapterNo()} eyebrow="عرض خاص للمعلّم" />
          <div className="bp-offer-panel">
            <div>
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
      <section id="overview" className="dp-sec is-narrow" data-reveal="1">
        <SectionHead index={chapterNo()} eyebrow={`عن ${p.name}`} />
        <p className="dp-prose">{overview}</p>
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
        <section className="dp-sec is-tight" data-reveal="1">
          <DetailFigure
            src={heroImage}
            alt={`${p.name} — لقطة من المنتج`}
            caption={`لقطة من ${p.name}`}
            ratio="16 / 9"
          />
        </section>
      )}

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="dp-sec" data-reveal="1">
          <SectionHead index={chapterNo()} eyebrow="الفائدة العملية" title="ماذا يقدّم للمعلّم" />
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
      <section className="dp-sec" data-reveal="1">
        <Monument
          center
          media={<div className="bp-plate-sm"><PartnerLogo partner={p} /></div>}
          head={<SectionHead eyebrow="الخطوة التالية" onDark center />}
          quote={cta.href ? `انتقل إلى ${p.name}` : `اسأل عن ${p.name}`}
          note={
            cta.href
              ? "يفتح الرابط في نافذة جديدة على موقع الشريك."
              : "سيُضاف رابط الشريك قريباً — وحتى ذلك الحين يسعدنا الإجابة عن استفسارك."
          }
          actions={<PartnerCta partner={p} className="btn btn-secondary btn-lg" fallback="contact" />}
          fine={PARTNERS_DISCLAIMER}
        />
      </section>

      {/* RAIL */}
      <section className="dp-sec is-tight" style={{ paddingBottom: "clamp(56px,7vw,84px)" }}>
        <DetailPager
          all={{ href: PARTNERS_PATH, label: `كل ${PARTNERS_NAV_LABEL}` }}
          prev={prev ? { href: `${PARTNERS_PATH}/${prev.slug}`, label: "الشريك السابق", title: prev.name } : null}
          next={next ? { href: `${PARTNERS_PATH}/${next.slug}`, label: "الشريك التالي", title: next.name } : null}
        />
      </section>
    </PageShell>
  );
}
