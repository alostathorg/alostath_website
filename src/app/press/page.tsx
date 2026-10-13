import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getPressAssets, getSettings } from "@/lib/queries";
import { LICENSE } from "@/lib/org";
import CopyButton from "./CopyButton";

export const revalidate = 60;
export const metadata: Metadata = { title: "الملف الإعلامي" };

// The backdrop each logo version is meant for, in asset order.
const LOGO_STAGE = ["light", "dark", "gold"];

// The boilerplate a journalist can paste as-is — the foundation's own words.
const BOILERPLATE =
  "مؤسسة الأستاذ مؤسسة أهلية سعودية غير ربحية، انطلقت عام 2023م، ومرخّصة من المركز الوطني لتنمية القطاع غير الربحي، وتعمل تحت إشراف وزارة التعليم. تسعى إلى أن تكون مرجعاً وطنياً في خدمة المعلّم والتعليم، وشريكاً فاعلاً لمنظومة التعليم والمجتمع في تحقيق رؤية المملكة 2030، عبر الجائزة الوطنية للمعلّم ومبادرات الأستاذ ومنصات الحضور والمحتوى ومجلس الأستاذ.";

const SHEET = [
  ...LICENSE.filter((r) => ["اسم المنظمة", "نوع المنظمة", "جهة الإشراف", "رقم الترخيص"].includes(r.k)),
  { k: "سنة الانطلاق", v: "2023", mono: true },
  { k: "المقر", v: "الرياض، المملكة العربية السعودية" },
];

/** Light swatches get dark ink. */
function isLight(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default async function PressPage() {
  const [assets, settings] = await Promise.all([getPressAssets(), getSettings()]);
  const email = (settings.contact as Record<string, string> | undefined)?.email ?? "contact@ostath.sa";
  const logos = assets.filter((a) => a.kind === "logo");
  const colors = assets.filter((a) => a.kind === "color");
  const pdf = assets.find((a) => a.kind === "pdf");
  const zip = assets.find((a) => a.kind === "zip");

  return (
    <PageShell active="press">
      <PageHero
        eyebrow="الهوية والمصادر الإعلامية"
        title="الملف الإعلامي"
        lede="شعار مؤسسة الأستاذ وهويتها البصرية وألوانها الرسمية، جاهزةٌ للتحميل والاستخدام في المواد الإعلامية والشراكات وفق إرشادات الاستخدام."
        actions={
          <>
            <a href={zip?.file_url ?? "#"} className="btn btn-secondary btn-lg" download>تحميل الحزمة الكاملة (ZIP)</a>
            <a href="#colors" className="btn btn-outline btn-lg btn-on-dark">استعراض الألوان</a>
          </>
        }
      />

      {/* FACT SHEET — what a journalist needs first, ready to copy */}
      <section className="pr-wrap pr-facts-sec">
        <div className="pr-facts" data-reveal="1">
          <div className="pr-boiler">
            <div className="kicker">نبذة جاهزة للنشر</div>
            <p>{BOILERPLATE}</p>
            <CopyButton text={BOILERPLATE} label="نسخ النبذة" />
          </div>
          <dl className="pr-sheet">
            {SHEET.map((r) => (
              <div key={r.k}>
                <dt>{r.k}</dt>
                <dd className={r.mono ? "is-mono" : undefined}>{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* LOGOS */}
      <section id="logos" className="pr-wrap pr-sec">
        <div className="pr-head" data-reveal="1">
          <div className="kicker">الشعار</div>
          <h2>شعار المؤسسة</h2>
          <p>استخدم الشعار وفق المساحات الآمنة المحيطة به، ولا تُعِد تلوينه أو تشويهه أو تغيير نسبه. اختر النسخة المناسبة حسب خلفية التصميم.</p>
        </div>
        <div className="pr-logos" data-reveal-group>
          {logos.map((logo, i) => (
            <article key={logo.id} className="pr-logo">
              <div className={`pr-logo-stage is-${LOGO_STAGE[i % LOGO_STAGE.length]}`}>
                <span className="pr-logo-safe">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.file_url ?? "/assets/alostath-logo.png"} alt={logo.title} />
                </span>
              </div>
              <div className="pr-logo-meta">
                <div>
                  <h3>{logo.title}</h3>
                  <p>{logo.description}</p>
                </div>
                <a className="pr-dl" href={logo.file_url ?? "#"} download aria-label={`تحميل ${logo.title}`}>
                  <DownloadIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="pr-rules" data-reveal="1">
          <div className="is-do">
            <h3>افعل</h3>
            <ul>
              <li>اترك مساحةً آمنة حول الشعار</li>
              <li>استخدم النسخة المعكوسة على الخلفيات الداكنة</li>
              <li>حافظ على نسب الشعار الأصلية</li>
            </ul>
          </div>
          <div className="is-dont">
            <h3>لا تفعل</h3>
            <ul>
              <li>لا تُعِد تلوين الشعار</li>
              <li>لا تمدّه أو تضغطه أو تميله</li>
              <li>لا تضعه على خلفيةٍ مزدحمة تُضعف وضوحه</li>
            </ul>
          </div>
        </div>
      </section>

      {/* COLORS */}
      <section id="colors" className="pr-colors-sec">
        <div className="pr-wrap pr-sec">
          <div className="pr-head" data-reveal="1">
            <div className="kicker">الألوان</div>
            <h2>لوحة الألوان الرسمية</h2>
            <p>تعتمد هوية الأستاذ على تدرّجات الزيتوني والذهبي والمريمي. انقر على اللون لنسخ قيمته.</p>
          </div>
          <div className="pr-palette" data-reveal-group>
            {colors.map((c) => {
              const hex = String((c.meta as { hex?: string })?.hex ?? "#000000").toUpperCase();
              return (
                <div key={c.id} className={`pr-swatch${isLight(hex) ? " is-light" : ""}`} style={{ "--sw": hex } as React.CSSProperties}>
                  <span className="pr-swatch-nm">{c.title}</span>
                  <CopyButton text={hex} label={hex} className="pr-swatch-hex" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TYPE + DOWNLOADS */}
      <section className="pr-wrap pr-sec pr-type-grid">
        <div className="pr-type" data-reveal="1">
          <div className="kicker">الخطوط</div>
          <div className="pr-type-big">الأستاذ</div>
          <div className="pr-type-weights">
            {[["Regular", 400], ["Medium", 500], ["SemiBold", 600], ["Bold", 700]].map(([n, w]) => (
              <span key={n} style={{ fontWeight: w as number }}>أبجد <small>{n}</small></span>
            ))}
          </div>
          <p>تعتمد هوية المؤسسة على خط <strong>IBM Plex Sans Arabic</strong> بأوزانه المختلفة، بما يضمن وضوح القراءة واتساق النبرة البصرية في العربية واللاتينية، ويرافقه IBM Plex Mono للأرقام والقيم.</p>
          <div className="pr-type-glyphs" dir="ltr">ABCD abcd 0123456789</div>
        </div>
        <div className="pr-downloads" data-reveal="1">
          <div className="kicker is-gold">التحميل</div>
          <h2>كل ما تحتاجه في ملف</h2>
          <a href={zip?.file_url ?? "#"} download className="pr-file">
            <span className="pr-file-type">ZIP</span>
            <span><strong>الحزمة الكاملة</strong>الشعارات بصيغها، والألوان، والخطوط</span>
            <DownloadIcon />
          </a>
          <a href={pdf?.file_url ?? "#"} download={pdf ? true : undefined} className={`pr-file${pdf ? "" : " is-soon"}`} aria-disabled={!pdf || undefined}>
            <span className="pr-file-type">PDF</span>
            <span><strong>دليل الهوية</strong>{pdf ? "إرشادات الاستخدام والمساحات الآمنة" : "قريباً"}</span>
            <DownloadIcon />
          </a>
        </div>
      </section>

      {/* PRESS CONTACT */}
      <section className="pr-wrap">
        <div className="pr-contact" data-reveal="1">
          <div>
            <div className="kicker">للتواصل الإعلامي</div>
            <h2>طلبات الصحافة والإعلام</h2>
            <p>لطلبات المقابلات أو الأصول الإضافية أو الاستفسارات الإعلامية، تواصل مع الفريق مباشرة.</p>
          </div>
          <div className="pr-contact-mail">
            <a href={`mailto:${email}`} dir="ltr">{email}</a>
            <CopyButton text={email} label="نسخ البريد" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
