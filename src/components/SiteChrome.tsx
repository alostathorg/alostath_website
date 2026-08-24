"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { validEmail, validPhone } from "@/lib/validate";

/**
 * Client-side interactions ported from the original site.js:
 * scroll-reveal, header elevation, count-up stats, mobile nav, countdowns,
 * initiative filter tabs, and the interest-registration modal.
 *
 * The only behavioural change vs. the static site: form submissions now POST
 * to /api/register (which writes to Supabase) instead of being simulated.
 */
export default function SiteChrome() {
  // Re-init interactions after client-side navigation (new DOM per route).
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("has-js");
    const cleanups: Array<() => void> = [];

    const EA = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    const toArabic = (str: string | number) =>
      String(str).replace(/[0-9]/g, (d) => EA[+d]);

    /* ---------- scroll reveal ---------- */
    (function initReveal() {
      const els = document.querySelectorAll("[data-reveal], [data-reveal-group]");
      if (!els.length) return;
      function check() {
        const vh = window.innerHeight || document.documentElement.clientHeight || 800;
        document
          .querySelectorAll("[data-reveal]:not(.in), [data-reveal-group]:not(.in)")
          .forEach((el) => {
            if ((el as HTMLElement).getBoundingClientRect().top < vh * 0.92)
              el.classList.add("in");
          });
      }
      if (typeof IntersectionObserver !== "undefined") {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("in");
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0, rootMargin: "0px 0px -8% 0px" },
        );
        els.forEach((el) => io.observe(el));
        window.addEventListener("scroll", check, { passive: true });
        window.addEventListener("resize", check);
        requestAnimationFrame(check);
        cleanups.push(() => io.disconnect());
      } else {
        window.addEventListener("scroll", check, { passive: true });
        window.addEventListener("resize", check);
        requestAnimationFrame(() => {
          check();
          requestAnimationFrame(check);
        });
      }
      cleanups.push(() => {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      });
    })();

    /* ---------- header elevation ---------- */
    (function initHeaderScroll() {
      const header = document.querySelector("header");
      if (!header) return;
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    })();

    /* ---------- count-up ---------- */
    (function initCountUp() {
      const nums = document.querySelectorAll("[data-count-to]");
      if (!nums.length) return;
      function run(el: Element) {
        const node = el as HTMLElement;
        if (node.dataset.counted === "1") return;
        node.dataset.counted = "1";
        const target = parseFloat(node.getAttribute("data-count-to") || "0") || 0;
        const suffix = node.getAttribute("data-count-suffix") || "";
        const prefix = node.getAttribute("data-count-prefix") || "";
        const dur = 1100;
        let start: number | null = null;
        function frame(ts: number) {
          if (start === null) start = ts;
          const p = Math.min(1, (ts - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          node.textContent = prefix + toArabic(Math.round(target * eased)) + suffix;
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }
      if (typeof IntersectionObserver !== "undefined") {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                run(entry.target);
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 },
        );
        nums.forEach((el) => io.observe(el));
        cleanups.push(() => io.disconnect());
      } else {
        nums.forEach(run);
      }
    })();

    /* ---------- mobile nav ---------- */
    (function initMobileNav() {
      document.querySelectorAll("nav[data-mainnav]").forEach((nav) => {
        const el = nav as HTMLElement;
        if (el.dataset.navInit === "1") return;
        el.dataset.navInit = "1";
        const bar = el.parentElement;
        if (bar) bar.style.position = bar.style.position || "relative";
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "nav-toggle";
        toggle.setAttribute("aria-label", "فتح القائمة");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        toggle.addEventListener("click", () => {
          const open = el.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        el.insertAdjacentElement("afterend", toggle);
        cleanups.push(() => toggle.remove());
      });
    })();

    /* ---------- countdowns ---------- */
    (function initCountdowns() {
      const containers = document.querySelectorAll("[data-countdown-target]");
      if (!containers.length) return;
      const pad = (n: number) => String(n).padStart(2, "0");
      containers.forEach((container) => {
        const target = new Date(
          container.getAttribute("data-countdown-target") || "",
        ).getTime();
        const q = (s: string) => container.querySelector(`[data-countdown="${s}"]`);
        const dayEl = q("days"), hourEl = q("hours"), minEl = q("mins"), secEl = q("secs");
        function tick() {
          let diff = Math.max(0, target - Date.now());
          const D = Math.floor(diff / 86400000); diff -= D * 86400000;
          const H = Math.floor(diff / 3600000); diff -= H * 3600000;
          const M = Math.floor(diff / 60000); diff -= M * 60000;
          const S = Math.floor(diff / 1000);
          if (dayEl) dayEl.textContent = pad(D);
          if (hourEl) hourEl.textContent = pad(H);
          if (minEl) minEl.textContent = pad(M);
          if (secEl) secEl.textContent = pad(S);
        }
        tick();
        const id = window.setInterval(tick, 1000);
        cleanups.push(() => clearInterval(id));
      });
    })();

    /* ---------- initiative filter tabs ---------- */
    (function initInitiativeTabs() {
      const tabsWrap = document.querySelector("[data-initiative-tabs]");
      if (!tabsWrap) return;
      const tabs = tabsWrap.querySelectorAll("[data-filter]");
      const sections = document.querySelectorAll("[data-initiative]");
      const map: Record<string, number[]> = { nasiyah: [0, 1], wathba: [0, 2], tumooh: [0, 3] };
      function applyFilter(idx: number) {
        tabs.forEach((t) =>
          t.classList.toggle("is-active", parseInt(t.getAttribute("data-filter") || "0", 10) === idx),
        );
        sections.forEach((sec) => {
          const allowed = map[sec.getAttribute("data-initiative") || ""] || [0];
          (sec as HTMLElement).style.display = allowed.indexOf(idx) !== -1 ? "" : "none";
        });
      }
      tabs.forEach((t) =>
        t.addEventListener("click", () =>
          applyFilter(parseInt(t.getAttribute("data-filter") || "0", 10)),
        ),
      );
      applyFilter(0);
    })();

    /* ---------- interest registration modal ---------- */
    initRegisterFlow(cleanups);

    /* ---------- newsletter + contact forms ---------- */
    initNewsletterForms(cleanups);
    initContactForms(cleanups);

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

type Cfg = {
  eyebrow: string; title: string; sub: string; fields: string[];
  submit: string; note: string; successTitle: string; successMsg: string;
};

const REG_CONFIG: Record<string, Cfg> = {
  open: { eyebrow: "التقديم مفتوح", title: "التقديم على الجائزة", sub: "أكمل بياناتك للتقديم على «{name}»، وسيتواصل معك الفريق بخطوات التقديم.", fields: ["name", "email", "phone", "category", "consent"], submit: "إرسال الطلب", note: "سنستخدم بياناتك للتواصل بخصوص هذه الجائزة فقط.", successTitle: "تم استلام طلبك!", successMsg: "شكراً لك — سيتواصل معك فريق «{name}» قريباً بخطوات إكمال التقديم." },
  interest: { eyebrow: "المشاركة متاحة", title: "سجّل اهتمامك بالمبادرة", sub: "أكمل بياناتك للانضمام إلى «{name}»، وسيتواصل معك الفريق بتفاصيل المشاركة.", fields: ["name", "email", "phone", "consent"], submit: "إرسال الطلب", note: "سنستخدم بياناتك للتواصل بخصوص هذه المبادرة فقط.", successTitle: "تم تسجيل اهتمامك!", successMsg: "شكراً لك — سيتواصل معك فريق «{name}» قريباً بتفاصيل المشاركة." },
  council: { eyebrow: "دعوة للمشاركة", title: "سجّل اهتمامك بالمجلس", sub: "اترك بياناتك لحضور الجلسة القادمة من «{name}»، وسيتواصل معك الفريق بالتفاصيل.", fields: ["name", "email", "phone", "consent"], submit: "إرسال الطلب", note: "سنستخدم بياناتك للتواصل بخصوص جلسات المجلس فقط.", successTitle: "تم تسجيل اهتمامك!", successMsg: "شكراً لك — سيتواصل معك الفريق بتفاصيل الجلسة القادمة من «{name}»." },
  soon: { eyebrow: "التسجيل يفتح قريباً", title: "أشعرني عند فتح التسجيل", sub: "اترك بريدك وسنُشعرك فور فتح باب التسجيل لـ«{name}».", fields: ["name", "email"], submit: "أشعرني عند الفتح", note: "سنراسلك مرة واحدة فقط عند فتح باب التسجيل.", successTitle: "سجّلناك بنجاح!", successMsg: "سنُشعرك فور فتح باب التسجيل لـ«{name}» — ترقّب رسالتنا." },
  closed: { eyebrow: "أُغلق التقديم", title: "انضمّ لقائمة الدورة القادمة", sub: "انتهى التقديم لهذه الدورة من «{name}». اترك بريدك لإشعارك فور فتح الدورة القادمة.", fields: ["name", "email"], submit: "أشعرني بالدورة القادمة", note: "", successTitle: "تم تسجيلك!", successMsg: "سنُشعرك فور فتح الدورة القادمة من «{name}»." },
};

// Maps a modal status to the registrations.program_type dimension.
function programTypeFor(status: string) {
  if (status === "council") return "council";
  if (status === "interest") return "initiative";
  return "award";
}

function initRegisterFlow(cleanups: Array<() => void>) {
  const triggers = document.querySelectorAll("[data-register]");
  if (!triggers.length) return;

  const overlay = document.createElement("div");
  overlay.className = "reg-overlay";
  overlay.innerHTML =
    '<div class="reg-modal" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="reg-title">' +
    '<button type="button" class="reg-close" aria-label="إغلاق"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
    '<div data-reg-form>' +
    '<div class="reg-eyebrow" data-reg-eyebrow></div>' +
    '<h3 class="reg-title" id="reg-title" data-reg-title></h3>' +
    '<p class="reg-sub" data-reg-sub></p>' +
    '<form novalidate>' +
    '<div class="reg-field" data-field="name"><label class="reg-label" for="reg-name">الاسم الكامل</label><input class="reg-input" id="reg-name" name="name" type="text" placeholder="مثال: سارة المطيري"><div class="reg-error">الرجاء إدخال الاسم الكامل.</div></div>' +
    '<div class="reg-field" data-field="email"><label class="reg-label" for="reg-email">البريد الإلكتروني</label><input class="reg-input" id="reg-email" name="email" type="email" dir="ltr" placeholder="name@example.com"><div class="reg-error">الرجاء إدخال بريد إلكتروني صحيح.</div></div>' +
    '<div class="reg-field" data-field="phone"><label class="reg-label" for="reg-phone">رقم الجوال <span style="color:var(--ink-subtle);font-weight:400">(اختياري)</span></label><input class="reg-input" id="reg-phone" name="phone" type="tel" dir="ltr" placeholder="05xxxxxxxx"><div class="reg-error">الرجاء إدخال رقم جوال صحيح.</div></div>' +
    '<div class="reg-field" data-field="category"><label class="reg-label" for="reg-category">مجال المشاركة</label><select class="reg-input" id="reg-category" name="category"><option value="">اختر المجال</option></select><div class="reg-error">الرجاء اختيار مجال المشاركة.</div></div>' +
    '<div class="reg-field" data-field="consent"><label class="reg-consent"><input type="checkbox" name="consent"><span>أوافق على <a href="#" tabindex="-1">سياسة الخصوصية</a> وشروط المشاركة.</span></label><div class="reg-error">يجب الموافقة على الشروط للمتابعة.</div></div>' +
    '<button type="submit" class="btn btn-primary btn-lg reg-submit" data-reg-submit></button>' +
    '<p class="reg-note" data-reg-note></p>' +
    '</form>' +
    '</div>' +
    '<div class="reg-success" data-reg-success hidden>' +
    '<div class="ic"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' +
    '<h3 data-reg-success-title></h3>' +
    '<p data-reg-success-msg></p>' +
    '<button type="button" class="btn btn-secondary btn-md" data-reg-done>تمام</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  cleanups.push(() => overlay.remove());

  const $ = (s: string) => overlay.querySelector(s) as HTMLElement;
  const formWrap = $("[data-reg-form]");
  const successWrap = $("[data-reg-success]");
  const form = overlay.querySelector("form") as HTMLFormElement;
  const submitBtn = $("[data-reg-submit]") as HTMLButtonElement;
  const categorySelect = overlay.querySelector('[name="category"]') as HTMLSelectElement;
  let lastFocus: HTMLElement | null = null;
  let current: { name: string; cfg: Cfg; status: string } | null = null;

  const tpl = (str: string, name: string) => str.replace(/\{name\}/g, name);
  const fieldEl = (key: string) => overlay.querySelector(`[data-field="${key}"]`) as HTMLElement;
  const clearError = (field: Element | null) => field && field.classList.remove("has-error");

  form.addEventListener("input", (e) => {
    const t = e.target as HTMLElement;
    clearError(t.closest ? t.closest(".reg-field") : null);
  });

  function open(trigger: HTMLElement) {
    const name = trigger.getAttribute("data-register") || "هذه الجائزة";
    const status = trigger.getAttribute("data-register-status") || "open";
    const cfg = REG_CONFIG[status] || REG_CONFIG.open;
    const cats = (trigger.getAttribute("data-register-categories") || "")
      .split(",").map((s) => s.trim()).filter(Boolean);

    current = { name, cfg, status };
    lastFocus = trigger;

    $("[data-reg-eyebrow]").textContent = cfg.eyebrow;
    $("[data-reg-title]").textContent = cfg.title;
    $("[data-reg-sub]").textContent = tpl(cfg.sub, name);
    submitBtn.textContent = cfg.submit;
    $("[data-reg-note]").textContent = cfg.note;

    const showCategory = cfg.fields.indexOf("category") !== -1 && cats.length > 0;
    categorySelect.innerHTML = '<option value="">اختر المجال</option>';
    cats.forEach((cat) => {
      const o = document.createElement("option");
      o.value = cat; o.textContent = cat; categorySelect.appendChild(o);
    });

    ["name", "email", "phone", "category", "consent"].forEach((key) => {
      const el = fieldEl(key);
      if (!el) return;
      const show = cfg.fields.indexOf(key) !== -1 && (key !== "category" || showCategory);
      (el as HTMLElement).hidden = !show;
      clearError(el);
    });

    formWrap.hidden = false;
    successWrap.hidden = true;
    form.reset();
    submitBtn.classList.remove("is-pending");
    document.body.classList.add("reg-lock");
    overlay.classList.add("is-open");
    setTimeout(() => {
      const f = form.querySelector('[data-field="name"] input') as HTMLInputElement;
      if (f) f.focus();
    }, 60);
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("reg-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function validate() {
    if (!current) return false;
    let ok = true;
    let firstBad: HTMLElement | null = null;
    current.cfg.fields.forEach((key) => {
      const field = fieldEl(key);
      if (!field || (field as HTMLElement).hidden) return;
      const input = field.querySelector("input, select") as HTMLInputElement | null;
      const val = input ? (input.type === "checkbox" ? input.checked : input.value.trim()) : "";
      let bad = false;
      if (key === "name") bad = !val;
      else if (key === "email") bad = !validEmail(val as string);
      else if (key === "phone") bad = !!val && !validPhone(val as string);
      else if (key === "category") bad = !val;
      else if (key === "consent") bad = !val;
      if (bad) { field.classList.add("has-error"); ok = false; if (!firstBad) firstBad = input; }
      else field.classList.remove("has-error");
    });
    if (firstBad) (firstBad as HTMLElement).focus();
    return ok;
  }

  triggers.forEach((t) =>
    t.addEventListener("click", (e) => { e.preventDefault(); open(t as HTMLElement); }),
  );
  overlay.querySelector(".reg-close")!.addEventListener("click", close);
  overlay.querySelector("[data-reg-done]")!.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  };
  document.addEventListener("keydown", onKey);
  cleanups.push(() => document.removeEventListener("keydown", onKey));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate() || !current) return;
    submitBtn.classList.add("is-pending");
    submitBtn.textContent = "جارٍ الإرسال…";
    const fd = new FormData(form);
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program_name: current.name,
          program_type: programTypeFor(current.status),
          status: current.status,
          name: (fd.get("name") as string) || null,
          email: (fd.get("email") as string) || null,
          phone: (fd.get("phone") as string) || null,
          category: (fd.get("category") as string) || null,
          consent: fd.get("consent") === "on",
        }),
      });
    } catch {
      /* best-effort — still show confirmation so the visitor isn't blocked */
    }
    $("[data-reg-success-title]").textContent = current.cfg.successTitle;
    $("[data-reg-success-msg]").textContent = tpl(current.cfg.successMsg, current.name);
    formWrap.hidden = true;
    successWrap.hidden = false;
  });
}

function initNewsletterForms(cleanups: Array<() => void>) {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const f = form as HTMLFormElement;
    const formState = f.querySelector("[data-nl-form-state]") as HTMLElement | null;
    const successState = f.querySelector("[data-nl-success-state]") as HTMLElement | null;
    const handler = async (e: Event) => {
      e.preventDefault();
      const email = f.querySelector('input[type="email"]') as HTMLInputElement | null;
      const value = email ? email.value.trim() : "";
      if (value.indexOf("@") === -1) return;
      try {
        await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_name: "النشرة البريدية",
            program_type: "newsletter",
            email: value,
          }),
        });
      } catch { /* best-effort */ }
      if (formState) formState.hidden = true;
      if (successState) { successState.hidden = false; successState.style.display = "inline-flex"; }
    };
    f.addEventListener("submit", handler);
    cleanups.push(() => f.removeEventListener("submit", handler));
  });
}

function initContactForms(cleanups: Array<() => void>) {
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const f = form as HTMLFormElement;
    const formState = f.querySelector("[data-ct-form-state]") as HTMLElement | null;
    const successState = f.querySelector("[data-ct-success-state]") as HTMLElement | null;
    const handler = async (e: Event) => {
      e.preventDefault();
      const val = (n: string) =>
        ((f.querySelector(`[name="${n}"]`) as HTMLInputElement | null)?.value || "").trim();
      const firstVal = val("firstName");
      const emailVal = val("email");
      if (!firstVal || emailVal.indexOf("@") === -1) return;
      const fullName = [firstVal, val("lastName")].filter(Boolean).join(" ");
      try {
        await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program_name: val("subject") || "رسالة تواصل",
            program_type: "contact",
            name: fullName,
            email: emailVal,
            phone: val("phone") || null,
            message: val("message") || null,
          }),
        });
      } catch { /* best-effort */ }
      if (formState) formState.hidden = true;
      if (successState) successState.hidden = false;
    };
    f.addEventListener("submit", handler);
    cleanups.push(() => f.removeEventListener("submit", handler));
  });
}
