/* Al-Ostath site.js — vanilla JS replacing the dc-runtime logic blocks. */
(function () {
  'use strict';

  // Signal that JS is active so CSS can safely hide-then-reveal staggered groups.
  document.documentElement.classList.add('has-js');

  var SEL_REVEAL = '[data-reveal], [data-reveal-group]';

  /* ============ SCROLL REVEAL ============ */
  function initReveal() {
    var els = document.querySelectorAll(SEL_REVEAL);
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
      // Safety net: a passive scroll/resize check guarantees nothing is ever
      // left hidden if the observer misses a fast scroll jump.
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
      requestAnimationFrame(check);
    } else {
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
      requestAnimationFrame(function () { check(); requestAnimationFrame(check); });
    }

    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight || 800;
      document.querySelectorAll('[data-reveal]:not(.in), [data-reveal-group]:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('in');
      });
    }
  }

  /* ============ HEADER SCROLL ELEVATION ============ */
  function initHeaderScroll() {
    var header = document.querySelector('header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============ COUNT-UP STATS ============ */
  var EA = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  function toArabicNumerals(str) {
    return String(str).replace(/[0-9]/g, function (d) { return EA[+d]; });
  }
  function initCountUp() {
    var nums = document.querySelectorAll('[data-count-to]');
    if (!nums.length) return;

    function run(el) {
      if (el.dataset.counted === '1') return;
      el.dataset.counted = '1';
      var target = parseFloat(el.getAttribute('data-count-to')) || 0;
      var suffix = el.getAttribute('data-count-suffix') || '';
      var prefix = el.getAttribute('data-count-prefix') || '';
      var dur = 1100;
      var start = null;
      function frame(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = prefix + toArabicNumerals(val) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      nums.forEach(function (el) { io.observe(el); });
    } else {
      nums.forEach(run);
    }
  }

  /* ============ MOBILE NAV ============ */
  function initMobileNav() {
    document.querySelectorAll('nav[data-mainnav]').forEach(function (nav) {
      if (nav.dataset.navInit === '1') return;
      nav.dataset.navInit = '1';
      var header = nav.closest('header');
      if (!header) return;
      var bar = nav.parentElement;
      if (bar) bar.style.position = bar.style.position || 'relative';

      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-toggle';
      toggle.setAttribute('aria-label', 'فتح القائمة');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.insertAdjacentElement('afterend', toggle);
    });
  }

  /* ============ COUNTDOWN ============ */
  function initCountdowns() {
    var containers = document.querySelectorAll('[data-countdown-target]');
    if (!containers.length) return;
    function pad(n) { return String(n).padStart(2, '0'); }
    containers.forEach(function (container) {
      var targetStr = container.getAttribute('data-countdown-target');
      var target = new Date(targetStr).getTime();
      var dayEl = container.querySelector('[data-countdown="days"]');
      var hourEl = container.querySelector('[data-countdown="hours"]');
      var minEl = container.querySelector('[data-countdown="mins"]');
      var secEl = container.querySelector('[data-countdown="secs"]');
      function tick() {
        var diff = Math.max(0, target - Date.now());
        var D = Math.floor(diff / 86400000); diff -= D * 86400000;
        var H = Math.floor(diff / 3600000); diff -= H * 3600000;
        var M = Math.floor(diff / 60000); diff -= M * 60000;
        var S = Math.floor(diff / 1000);
        if (dayEl) dayEl.textContent = pad(D);
        if (hourEl) hourEl.textContent = pad(H);
        if (minEl) minEl.textContent = pad(M);
        if (secEl) secEl.textContent = pad(S);
      }
      tick();
      setInterval(tick, 1000);
    });
  }

  /* ============ NEWSLETTER FORM ============ */
  function initNewsletterForms() {
    document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
      var formState = form.querySelector('[data-nl-form-state]');
      var successState = form.querySelector('[data-nl-success-state]');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = form.querySelector('input[type="email"]');
        var value = email ? email.value.trim() : '';
        if (value.indexOf('@') === -1) return;
        if (formState) formState.hidden = true;
        if (successState) { successState.hidden = false; successState.style.display = 'inline-flex'; }
      });
    });
  }

  /* ============ CONTACT FORM ============ */
  function initContactForms() {
    document.querySelectorAll('[data-contact-form]').forEach(function (form) {
      var formState = form.querySelector('[data-ct-form-state]');
      var successState = form.querySelector('[data-ct-success-state]');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstName = form.querySelector('[name="firstName"]');
        var email = form.querySelector('[name="email"]');
        var firstVal = firstName ? firstName.value.trim() : '';
        var emailVal = email ? email.value.trim() : '';
        if (!firstVal || emailVal.indexOf('@') === -1) return;
        if (formState) formState.hidden = true;
        if (successState) successState.hidden = false;
      });
    });
  }

  /* ============ INITIATIVES FILTER TABS ============ */
  function initInitiativeTabs() {
    var tabsWrap = document.querySelector('[data-initiative-tabs]');
    if (!tabsWrap) return;
    var tabs = tabsWrap.querySelectorAll('[data-filter]');
    var sections = document.querySelectorAll('[data-initiative]');
    var map = { nasiyah: [0, 1], wathba: [0, 2], tumooh: [0, 3] };

    function applyFilter(filterIndex) {
      tabs.forEach(function (t) {
        var isActive = parseInt(t.getAttribute('data-filter'), 10) === filterIndex;
        t.classList.toggle('is-active', isActive);
      });
      sections.forEach(function (sec) {
        var key = sec.getAttribute('data-initiative');
        var allowed = map[key] || [0];
        sec.style.display = allowed.indexOf(filterIndex) !== -1 ? '' : 'none';
      });
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        applyFilter(parseInt(t.getAttribute('data-filter'), 10));
      });
    });

    applyFilter(0);
  }

  /* ============ INTEREST REGISTRATION MODAL ============ */
  // The flow adapts to each award's application status so the action always
  // matches reality: apply when open, notify-me when soon, waitlist when closed.
  var REG_CONFIG = {
    open: {
      eyebrow: 'التقديم مفتوح',
      title: 'التقديم على الجائزة',
      sub: 'أكمل بياناتك للتقديم على «{name}»، وسيتواصل معك الفريق بخطوات التقديم.',
      fields: ['name', 'email', 'phone', 'category', 'consent'],
      submit: 'إرسال الطلب',
      note: 'سنستخدم بياناتك للتواصل بخصوص هذه الجائزة فقط.',
      successTitle: 'تم استلام طلبك!',
      successMsg: 'شكراً لك — سيتواصل معك فريق «{name}» قريباً بخطوات إكمال التقديم.'
    },
    interest: {
      eyebrow: 'المشاركة متاحة',
      title: 'سجّل اهتمامك بالمبادرة',
      sub: 'أكمل بياناتك للانضمام إلى «{name}»، وسيتواصل معك الفريق بتفاصيل المشاركة.',
      fields: ['name', 'email', 'phone', 'consent'],
      submit: 'إرسال الطلب',
      note: 'سنستخدم بياناتك للتواصل بخصوص هذه المبادرة فقط.',
      successTitle: 'تم تسجيل اهتمامك!',
      successMsg: 'شكراً لك — سيتواصل معك فريق «{name}» قريباً بتفاصيل المشاركة.'
    },
    council: {
      eyebrow: 'دعوة للمشاركة',
      title: 'سجّل اهتمامك بالمجلس',
      sub: 'اترك بياناتك لحضور الجلسة القادمة من «{name}»، وسيتواصل معك الفريق بالتفاصيل.',
      fields: ['name', 'email', 'phone', 'consent'],
      submit: 'إرسال الطلب',
      note: 'سنستخدم بياناتك للتواصل بخصوص جلسات المجلس فقط.',
      successTitle: 'تم تسجيل اهتمامك!',
      successMsg: 'شكراً لك — سيتواصل معك الفريق بتفاصيل الجلسة القادمة من «{name}».'
    },
    soon: {
      eyebrow: 'التسجيل يفتح قريباً',
      title: 'أشعرني عند فتح التسجيل',
      sub: 'اترك بريدك وسنُشعرك فور فتح باب التسجيل لـ«{name}».',
      fields: ['name', 'email'],
      submit: 'أشعرني عند الفتح',
      note: 'سنراسلك مرة واحدة فقط عند فتح باب التسجيل.',
      successTitle: 'سجّلناك بنجاح!',
      successMsg: 'سنُشعرك فور فتح باب التسجيل لـ«{name}» — ترقّب رسالتنا.'
    },
    closed: {
      eyebrow: 'أُغلق التقديم',
      title: 'انضمّ لقائمة الدورة القادمة',
      sub: 'انتهى التقديم لهذه الدورة من «{name}». اترك بريدك لإشعارك فور فتح الدورة القادمة.',
      fields: ['name', 'email'],
      submit: 'أشعرني بالدورة القادمة',
      note: '',
      successTitle: 'تم تسجيلك!',
      successMsg: 'سنُشعرك فور فتح الدورة القادمة من «{name}».'
    }
  };

  function initRegisterFlow() {
    var triggers = document.querySelectorAll('[data-register]');
    if (!triggers.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'reg-overlay';
    overlay.innerHTML = ''
      + '<div class="reg-modal" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="reg-title">'
      +   '<button type="button" class="reg-close" aria-label="إغلاق"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'
      +   '<div data-reg-form>'
      +     '<div class="reg-eyebrow" data-reg-eyebrow></div>'
      +     '<h3 class="reg-title" id="reg-title" data-reg-title></h3>'
      +     '<p class="reg-sub" data-reg-sub></p>'
      +     '<form novalidate>'
      +       '<div class="reg-field" data-field="name"><label class="reg-label" for="reg-name">الاسم الكامل</label><input class="reg-input" id="reg-name" name="name" type="text" placeholder="مثال: سارة المطيري"><div class="reg-error">الرجاء إدخال الاسم الكامل.</div></div>'
      +       '<div class="reg-field" data-field="email"><label class="reg-label" for="reg-email">البريد الإلكتروني</label><input class="reg-input" id="reg-email" name="email" type="email" dir="ltr" placeholder="name@example.com"><div class="reg-error">الرجاء إدخال بريد إلكتروني صحيح.</div></div>'
      +       '<div class="reg-field" data-field="phone"><label class="reg-label" for="reg-phone">رقم الجوال <span style="color:var(--ink-subtle);font-weight:400">(اختياري)</span></label><input class="reg-input" id="reg-phone" name="phone" type="tel" dir="ltr" placeholder="05xxxxxxxx"><div class="reg-error">الرجاء إدخال رقم جوال صحيح.</div></div>'
      +       '<div class="reg-field" data-field="category"><label class="reg-label" for="reg-category">مجال المشاركة</label><select class="reg-input" id="reg-category" name="category"><option value="">اختر المجال</option></select><div class="reg-error">الرجاء اختيار مجال المشاركة.</div></div>'
      +       '<div class="reg-field" data-field="consent"><label class="reg-consent"><input type="checkbox" name="consent"><span>أوافق على <a href="#" tabindex="-1">سياسة الخصوصية</a> وشروط المشاركة.</span></label><div class="reg-error">يجب الموافقة على الشروط للمتابعة.</div></div>'
      +       '<button type="submit" class="btn btn-primary btn-lg reg-submit" data-reg-submit></button>'
      +       '<p class="reg-note" data-reg-note></p>'
      +     '</form>'
      +   '</div>'
      +   '<div class="reg-success" data-reg-success hidden>'
      +     '<div class="ic"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
      +     '<h3 data-reg-success-title></h3>'
      +     '<p data-reg-success-msg></p>'
      +     '<button type="button" class="btn btn-secondary btn-md" data-reg-done>تمام</button>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(overlay);

    var formWrap = overlay.querySelector('[data-reg-form]');
    var successWrap = overlay.querySelector('[data-reg-success]');
    var form = overlay.querySelector('form');
    var submitBtn = overlay.querySelector('[data-reg-submit]');
    var categorySelect = overlay.querySelector('[name="category"]');
    var lastFocus = null;
    var current = null;

    function tpl(str, name) { return str.replace(/\{name\}/g, name); }
    function fieldEl(key) { return overlay.querySelector('[data-field="' + key + '"]'); }
    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function validPhone(v) { return /^[0-9+\-\s]{7,}$/.test(v); }
    function clearError(field) { if (field) field.classList.remove('has-error'); }

    // Live-clear a field's error as the user corrects it.
    form.addEventListener('input', function (e) {
      var field = e.target.closest ? e.target.closest('.reg-field') : null;
      clearError(field);
    });

    function open(trigger) {
      var name = trigger.getAttribute('data-register') || 'هذه الجائزة';
      var status = trigger.getAttribute('data-register-status') || 'open';
      var cfg = REG_CONFIG[status] || REG_CONFIG.open;
      var cats = (trigger.getAttribute('data-register-categories') || '').split(',')
        .map(function (s) { return s.trim(); }).filter(Boolean);

      current = { name: name, cfg: cfg, status: status };
      lastFocus = trigger;

      // Text
      overlay.querySelector('[data-reg-eyebrow]').textContent = cfg.eyebrow;
      overlay.querySelector('[data-reg-title]').textContent = cfg.title;
      overlay.querySelector('[data-reg-sub]').textContent = tpl(cfg.sub, name);
      submitBtn.textContent = cfg.submit;
      overlay.querySelector('[data-reg-note]').textContent = cfg.note;

      // Category options — only relevant when the award defines them.
      var showCategory = cfg.fields.indexOf('category') !== -1 && cats.length > 0;
      categorySelect.innerHTML = '<option value="">اختر المجال</option>';
      cats.forEach(function (c) {
        var o = document.createElement('option'); o.value = c; o.textContent = c; categorySelect.appendChild(o);
      });

      // Field visibility per status
      ['name', 'email', 'phone', 'category', 'consent'].forEach(function (key) {
        var el = fieldEl(key);
        if (!el) return;
        var show = cfg.fields.indexOf(key) !== -1 && (key !== 'category' || showCategory);
        el.hidden = !show;
        clearError(el);
      });

      formWrap.hidden = false;
      successWrap.hidden = true;
      form.reset();
      submitBtn.classList.remove('is-pending');
      document.body.classList.add('reg-lock');
      overlay.classList.add('is-open');
      setTimeout(function () { var f = form.querySelector('[data-field="name"] input'); if (f) f.focus(); }, 60);
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('reg-lock');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function validate() {
      if (!current) return false;
      var ok = true, firstBad = null;
      current.cfg.fields.forEach(function (key) {
        var field = fieldEl(key);
        if (!field || field.hidden) return;
        var input = field.querySelector('input, select');
        var val = input ? (input.type === 'checkbox' ? input.checked : input.value.trim()) : '';
        var bad = false;
        if (key === 'name') bad = !val;
        else if (key === 'email') bad = !validEmail(val);
        else if (key === 'phone') bad = val && !validPhone(val); // optional
        else if (key === 'category') bad = !val;
        else if (key === 'consent') bad = !val;
        if (bad) { field.classList.add('has-error'); ok = false; if (!firstBad) firstBad = input; }
        else field.classList.remove('has-error');
      });
      if (firstBad) firstBad.focus();
      return ok;
    }

    triggers.forEach(function (t) {
      t.addEventListener('click', function (e) { e.preventDefault(); open(t); });
    });
    overlay.querySelector('.reg-close').addEventListener('click', close);
    overlay.querySelector('[data-reg-done]').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      // Simulate the request round-trip. Replace with a real POST of
      // { program, status, name, email, phone, category } once the DB is wired.
      submitBtn.classList.add('is-pending');
      submitBtn.textContent = 'جارٍ الإرسال…';
      setTimeout(function () {
        overlay.querySelector('[data-reg-success-title]').textContent = current.cfg.successTitle;
        overlay.querySelector('[data-reg-success-msg]').textContent = tpl(current.cfg.successMsg, current.name);
        formWrap.hidden = true;
        successWrap.hidden = false;
      }, 550);
    });
  }

  function init() {
    initReveal();
    initHeaderScroll();
    initCountUp();
    initMobileNav();
    initCountdowns();
    initNewsletterForms();
    initContactForms();
    initInitiativeTabs();
    initRegisterFlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
