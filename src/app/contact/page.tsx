import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getSettings } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "تواصل معنا" };

const MAP_LINK = "https://www.google.com/maps/search/?api=1&query=Prince+Mohammed+Bin+Abdulaziz+Road,+Al+Maather,+Riyadh+12314";

// Sent as the message's subject (program_name), so the team can sort the inbox.
const SUBJECTS = ["استفسار عام", "شراكة أو رعاية", "الانضمام كمعلّم", "استفسار عن مبادرة", "الجائزة الوطنية للمعلّم", "طلب إعلامي"];

// Requests with a shorter road than the form.
const ROUTES = [
  { t: "انضم كمعلّم", d: "سجّل في مجتمع الأستاذ", href: "/community#join" },
  { t: "عندك فكرة مبادرة؟", d: "شاركها مع فريق المؤسسة", href: "/community#idea" },
  { t: "الجائزة الوطنية للمعلّم", d: "سجّل اهتمامك بالترشّح", href: "/awards" },
  { t: "للإعلاميين", d: "الشعار والألوان والهوية البصرية", href: "/press" },
];

export default async function ContactPage() {
  const settings = await getSettings();
  const c = (settings.contact as Record<string, string>) ?? {};
  const phone = c.phone ?? "+966 55 075 7424";
  const email = c.email ?? "contact@ostath.sa";
  const address = c.address ?? "طريق الأمير محمد بن عبدالعزيز، المعذر الشمالي، الرياض 12314";

  return (
    <PageShell active="contact">
      <PageHero
        eyebrow="نسعد بتواصلك"
        title="تواصل معنا"
        lede="للشراكة، أو الانضمام كمعلّم، أو الاستفسار عن المبادرات والبرامج — فريق الأستاذ في خدمتك."
      />

      {/* CHANNELS — three ways to reach us, each one tap away */}
      <section className="ct-wrap ct-channels" data-reveal-group>
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="ct-channel">
          <span className="ct-channel-ico"><IconPhone /></span>
          <span className="ct-channel-k">اتصل بنا</span>
          <strong dir="ltr">{phone}</strong>
          <span className="ct-channel-go">اتصال ←</span>
        </a>
        <a href={`mailto:${email}`} className="ct-channel">
          <span className="ct-channel-ico"><IconMail /></span>
          <span className="ct-channel-k">راسلنا</span>
          <strong dir="ltr">{email}</strong>
          <span className="ct-channel-go">كتابة بريد ←</span>
        </a>
        <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="ct-channel is-dark">
          <span className="ct-channel-ico"><IconPin /></span>
          <span className="ct-channel-k">زرنا</span>
          <strong>{address}</strong>
          <span className="ct-channel-go">الاتجاهات ↗</span>
        </a>
      </section>

      {/* FORM + ROUTES */}
      <section className="ct-wrap ct-main">
        <div className="ct-form-card" data-reveal="1">
          <form data-contact-form>
            <div data-ct-success-state hidden className="ct-done">
              <span className="ct-done-ico">✓</span>
              <h3>وصلتنا رسالتك</h3>
              <p>شكراً لتواصلك مع مؤسسة الأستاذ — سيردّ عليك فريقنا في أقرب وقت.</p>
            </div>
            <div data-ct-form-state>
              <div className="kicker">نموذج التواصل</div>
              <h2>أرسل لنا رسالة</h2>
              <p className="ct-form-note">املأ النموذج وسنعاود التواصل معك في أقرب فرصة.</p>
              <div className="ct-grid">
                <div className="reg-field is-wide">
                  <label className="reg-label" htmlFor="ct-subject">موضوع الرسالة</label>
                  <select className="reg-input" id="ct-subject" name="subject" defaultValue="استفسار عام">
                    {SUBJECTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="reg-field">
                  <label className="reg-label" htmlFor="ct-first">الاسم الأول</label>
                  <input className="reg-input" id="ct-first" name="firstName" placeholder="اكتب اسمك" required />
                </div>
                <div className="reg-field">
                  <label className="reg-label" htmlFor="ct-last">اسم العائلة</label>
                  <input className="reg-input" id="ct-last" name="lastName" placeholder="اسم العائلة" />
                </div>
                <div className="reg-field">
                  <label className="reg-label" htmlFor="ct-email">البريد الإلكتروني</label>
                  <input className="reg-input" id="ct-email" dir="ltr" type="email" name="email" placeholder="name@example.com" required />
                </div>
                <div className="reg-field">
                  <label className="reg-label" htmlFor="ct-phone">رقم الهاتف <span className="cm-optional">(اختياري)</span></label>
                  <input className="reg-input" id="ct-phone" dir="ltr" type="tel" name="phone" placeholder="05xxxxxxxx" />
                </div>
                <div className="reg-field is-wide">
                  <label className="reg-label" htmlFor="ct-message">نص الرسالة</label>
                  <textarea className="reg-input" id="ct-message" rows={5} name="message" placeholder="كيف يمكننا مساعدتك؟" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg ct-submit">إرسال الرسالة</button>
            </div>
          </form>
        </div>

        <aside className="ct-routes" data-reveal="1">
          <h2>تبحث عن شيءٍ محدد؟</h2>
          <p>بعض الطلبات لها طريقٌ أقصر.</p>
          <ul>
            {ROUTES.map((r) => (
              <li key={r.href}>
                <Link href={r.href}>
                  <span>
                    <strong>{r.t}</strong>
                    {r.d}
                  </span>
                  <span aria-hidden>←</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* MAP */}
      <section className="ct-wrap ct-map-wrap">
        <div className="ct-map" data-reveal="1">
          <iframe title="موقع مؤسسة الأستاذ على الخريطة" src="https://www.google.com/maps?q=Prince+Mohammed+Bin+Abdulaziz+Road,+Al+Maather,+Riyadh+12314&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="ct-map-card">
            <span className="kicker">مقرّ المؤسسة</span>
            <strong>{address}</strong>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-md">افتح في الخرائط ↗</a>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="ab-news">
        <div className="ab-news-in" data-reveal="1">
          <div className="kicker is-gold is-center">النشرة البريدية</div>
          <h2>اشترك في النشرة البريدية لمؤسسة الأستاذ</h2>
          <p>كن على اطّلاعٍ دائم بأحدث المبادرات التعليمية والبرامج التطويرية والفرص المخصّصة للمعلّمين والطلاب.</p>
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

function IconPhone() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function IconMail() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}
function IconPin() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
