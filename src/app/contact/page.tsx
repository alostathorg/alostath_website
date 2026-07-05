import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "تواصل معنا" };

export default async function ContactPage() {
  const settings = await getSettings();
  const c = (settings.contact as Record<string, string>) ?? {};
  const phone = c.phone ?? "+966 55 075 7424";
  const email = c.email ?? "contact@ostath.sa";
  const address = c.address ?? "طريق الأمير محمد بن عبدالعزيز، المعذر الشمالي، الرياض ١٢٣١٤";

  return (
    <PageShell active="contact">
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)", color: "var(--ink-inverse)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/alostath-logo-inverse.png" alt="" style={{ position: "absolute", top: "50%", left: -60, transform: "translateY(-50%)", width: "min(760px,70%)", height: "auto", opacity: 0.06, pointerEvents: "none" }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "96px 32px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", color: "var(--gold-500)", textTransform: "uppercase", marginBottom: 16, textAlign: "right" }}>نسعد بتواصلك</div>
          <h1 style={{ fontSize: "clamp(38px,5.4vw,60px)", fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: "right" }}>تواصل معنا</h1>
          <p style={{ fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.85, color: "var(--inverse-muted)", margin: "20px auto 0", textAlign: "right" }}>للشراكة، أو الانضمام كمعلّم، أو الاستفسار عن المبادرات والبرامج — فريق الأستاذ في خدمتك.</p>
        </div>
      </section>

      {/* BODY */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "80px 32px 56px" }}>
        <div data-reveal="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40, alignItems: "start" }}>
          {/* info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InfoCard label="الهاتف" icon={<IconPhone />}>
              <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" style={{ fontSize: 18, fontWeight: 600, color: "var(--olive-700)", textDecoration: "none", display: "block", textAlign: "start" }}>{phone}</a>
            </InfoCard>
            <InfoCard label="البريد الإلكتروني" icon={<IconMail />}>
              <a href={`mailto:${email}`} dir="ltr" style={{ fontSize: 18, fontWeight: 600, color: "var(--olive-700)", textDecoration: "none", display: "block", textAlign: "start" }}>{email}</a>
            </InfoCard>
            <InfoCard label="العنوان" icon={<IconPin />}>
              <div style={{ fontSize: 16, fontWeight: 500, color: "var(--text-body)", lineHeight: 1.7 }}>{address}</div>
            </InfoCard>
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--hairline)", height: 240 }}>
              <iframe title="الموقع على الخريطة" src="https://www.google.com/maps?q=Prince+Mohammed+Bin+Abdulaziz+Road,+Al+Maather,+Riyadh+12314&output=embed" style={{ width: "100%", height: "100%", border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>

          {/* form */}
          <div style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 18, padding: "clamp(28px,4vw,44px)" }}>
            <form data-contact-form>
              <div data-ct-success-state hidden style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: 9999, background: "var(--sage-100)", color: "var(--sage-700)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 30, fontWeight: 700 }}>✓</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 10px" }}>وصلتنا رسالتك</h3>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>شكراً لتواصلك مع مؤسسة الأستاذ — سيردّ عليك فريقنا في أقرب وقت.</p>
              </div>
              <div data-ct-form-state>
                <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>أرسل لنا رسالة</h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 28px" }}>املأ النموذج وسنعاود التواصل معك في أقرب فرصة.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <Field label="الاسم الأول"><input className="ct-field" name="firstName" placeholder="اكتب اسمك" /></Field>
                  <Field label="اسم العائلة"><input className="ct-field" name="lastName" placeholder="اسم العائلة" /></Field>
                </div>
                <Field label="البريد الإلكتروني" mb><input className="ct-field" dir="ltr" type="email" name="email" placeholder="name@example.com" style={{ textAlign: "left" }} /></Field>
                <Field label="رقم الهاتف" mb><input className="ct-field" dir="ltr" type="tel" name="phone" placeholder="05xxxxxxxx" style={{ textAlign: "left" }} /></Field>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>نص الرسالة</label>
                  <textarea className="ct-field" rows={5} name="message" placeholder="كيف يمكننا مساعدتك؟" style={{ resize: "vertical", lineHeight: 1.7 }} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>إرسال الرسالة</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--olive-900)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://framerusercontent.com/images/5tFDyWZl3YM715jhXBbKzLNeJw.jpeg?width=1408&height=736" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
        <div data-reveal="1" style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "88px 32px", textAlign: "center", color: "var(--ink-inverse)" }}>
          <h2 style={{ fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 700, lineHeight: 1.35, margin: "0 0 18px" }}>اشترك في النشرة البريدية لمؤسسة الأستاذ</h2>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "var(--inverse-muted)", margin: "0 0 36px" }}>كن على اطّلاعٍ دائم بأحدث المبادرات التعليمية والبرامج التطويرية والفرص المخصّصة للمعلّمين والطلاب.</p>
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

function InfoCard({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: 14, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--olive-50)", color: "var(--olive-600)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{icon}</div>
      <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-subtle)", marginBottom: 4 }}>{label}</div>{children}</div>
    </div>
  );
}

function Field({ label, mb, children }: { label: string; mb?: boolean; children: React.ReactNode }) {
  return (
    <div style={mb ? { marginBottom: 16 } : undefined}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
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
