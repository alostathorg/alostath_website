import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getPressAssets } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "الملف الإعلامي" };

// Fixed light/dark preview backdrops for logo cards, matched to the original.
const LOGO_BG = ["var(--surface-1)", "var(--olive-900)", "var(--gold-50)"];

export default async function PressPage() {
  const assets = await getPressAssets();
  const logos = assets.filter((a) => a.kind === "logo");
  const colors = assets.filter((a) => a.kind === "color");
  const pdf = assets.find((a) => a.kind === "pdf");
  const zip = assets.find((a) => a.kind === "zip");

  return (
    <PageShell active="press">
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" aria-hidden style={{ position: "absolute", top: "50%", left: -60, transform: "translateY(-50%)", width: "min(820px,72%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "104px 32px 64px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16 }}>الهوية والمصادر الإعلامية</div>
          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.15, margin: 0, maxWidth: "18ch" }}>الملف الإعلامي</h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "24px 0 0", maxWidth: "64ch" }}>شعار مؤسسة الأستاذ وهويتها البصرية وألوانها الرسمية، جاهزةٌ للتحميل والاستخدام في المواد الإعلامية والشراكات وفق إرشادات الاستخدام.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
            <a href={zip?.file_url ?? "#"} className="btn btn-secondary btn-lg" download>تحميل الحزمة الكاملة (ZIP)</a>
            <a href="#colors" className="btn btn-outline btn-lg" style={{ background: "transparent", color: "var(--ink-inverse)", borderColor: "rgba(244,246,238,0.4)" }}>استعراض الألوان</a>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section id="logos" className="press-section">
        <div className="press-head" data-reveal="1">
          <div className="eyebrow">الشعار</div>
          <h2 className="h-accent" style={{ display: "inline-block" }}>شعار المؤسسة</h2>
          <p>استخدم الشعار وفق المساحات الآمنة المحيطة به، ولا تُعِد تلوينه أو تشويهه أو تغيير نسبه. اختر النسخة المناسبة حسب خلفية التصميم.</p>
        </div>
        <div className="logo-grid" data-reveal="1">
          {logos.map((logo, i) => (
            <div key={logo.id} className="logo-card">
              <div className="logo-preview" style={{ background: LOGO_BG[i % LOGO_BG.length] }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.file_url ?? "/assets/alostath-logo.png"} alt={logo.title} />
              </div>
              <div className="logo-meta">
                <h3>{logo.title}</h3>
                <p>{logo.description}</p>
                <div className="dl-row">
                  <a className="dl-btn" href={logo.file_url ?? "#"} download>⬇ تحميل</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLORS */}
      <section id="colors" style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="press-section">
          <div className="press-head" data-reveal="1">
            <div className="eyebrow">الألوان</div>
            <h2 className="h-accent" style={{ display: "inline-block" }}>لوحة الألوان الرسمية</h2>
            <p>تعتمد هوية الأستاذ على تدرّجات الزيتوني والذهبي والمريمي. استخدم القيم التالية لضمان اتساق الهوية عبر المواد المطبوعة والرقمية.</p>
          </div>
          <div className="swatch-grid" data-reveal="1">
            {colors.map((c) => {
              const hex = String((c.meta as { hex?: string })?.hex ?? "#000000");
              const light = hex.toUpperCase() === "#F4F6EE";
              return (
                <div key={c.id} className="swatch">
                  <div className="swatch-chip" style={{ background: hex, ...(light ? { borderBottom: "1px solid var(--hairline)" } : {}) }} />
                  <div className="swatch-info"><p className="nm">{c.title}</p><p className="hx">{hex}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TYPOGRAPHY + GUIDELINES */}
      <section className="press-section">
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 28 }} data-reveal="1">
          <div style={{ border: "1px solid var(--hairline)", borderRadius: 20, padding: "clamp(28px,4vw,44px)", background: "var(--canvas)" }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>الخطوط</div>
            <div style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.1, color: "var(--ink)", marginBottom: 8 }}>الأستاذ</div>
            <div style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 14 }}>أ ب ت ث ج ح خ &nbsp; ABCD &nbsp; ٠١٢٣٤٥٦٧٨٩</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--olive-700)", background: "var(--olive-50)", border: "1px solid var(--olive-100)", borderRadius: 9, padding: "7px 13px", marginBottom: 20 }}>IBM Plex Sans Arabic</div>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-muted)", margin: 0 }}>تعتمد هوية المؤسسة على خط <strong style={{ color: "var(--ink)" }}>IBM Plex Sans Arabic</strong> بأوزانه المختلفة، بما يضمن وضوح القراءة واتساق النبرة البصرية في العربية واللاتينية.</p>
          </div>
          <div style={{ border: "1px solid var(--hairline)", borderRadius: 20, padding: "clamp(28px,4vw,44px)", background: "var(--olive-900)", color: "var(--ink-inverse)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", marginBottom: 12 }}>دليل الهوية</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 12px", color: "var(--ink-inverse)" }}>حمّل الدليل الكامل</h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--inverse-muted)", margin: "0 0 24px" }}>إرشادات الاستخدام، والمساحات الآمنة، والاستخدامات الممنوعة، والشعارات والألوان والخطوط في ملفٍ واحد.</p>
            <a href={pdf?.file_url ?? "#"} className="btn btn-secondary btn-md" download style={{ alignSelf: "flex-start" }}>{pdf ? "تحميل الدليل (PDF)" : "قريباً"}</a>
          </div>
        </div>
      </section>

      {/* PRESS CONTACT */}
      <section style={{ background: "var(--surface-1)", borderTop: "1px solid var(--hairline)" }}>
        <div className="press-section" style={{ textAlign: "center" }}>
          <div data-reveal="1" style={{ maxWidth: 620, margin: "0 auto" }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>للتواصل الإعلامي</div>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, margin: "0 0 14px", color: "var(--ink)" }}>طلبات الصحافة والإعلام</h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: "var(--text-muted)", margin: "0 0 28px" }}>لطلبات المقابلات أو الأصول الإضافية أو الاستفسارات الإعلامية، تواصل مع الفريق مباشرة.</p>
            <a href="mailto:contact@ostath.sa" className="btn btn-primary btn-md">contact@ostath.sa</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
