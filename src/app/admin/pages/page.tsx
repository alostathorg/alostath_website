import { createClient } from "@/lib/supabase/server";
import { HOME_SECTIONS, TOGGLEABLE_PAGES, isHomeSectionOn, isPageOn } from "@/lib/pages";
import type { SiteSettings } from "@/lib/types";
import VisibilitySwitch from "./VisibilitySwitch";

export const dynamic = "force-dynamic";

export default async function PagesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", ["pages", "home_sections"]);
  const settings: SiteSettings = {};
  for (const r of data ?? []) settings[r.key] = r.value;

  const pagesOff = TOGGLEABLE_PAGES.filter((p) => !isPageOn(settings, p.key)).length;

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">الصفحات والأقسام</h1>
          <p className="admin-subtitle">
            فعّل أو أوقف صفحات الموقع وأقسام الصفحة الرئيسية. يسري التغيير فوراً.
          </p>
        </div>
      </div>

      <section className="admin-card">
        <h2 className="admin-card-title">صفحات الموقع</h2>
        <p className="admin-card-hint">
          الصفحة الموقوفة تختفي من القائمة العلوية والتذييل وخريطة الموقع، ويظهر لمن يفتح رابطها صفحة «غير موجودة» —
          بما في ذلك صفحات التفاصيل تحتها. المحتوى نفسه لا يُحذف، ويعود كما هو عند التفعيل.
          {pagesOff > 0 && <> الموقوف الآن: <strong>{pagesOff}</strong>.</>}
        </p>
        <ul className="admin-vis-list">
          {TOGGLEABLE_PAGES.map((p) => (
            <li key={p.key} className="admin-vis-row">
              <div className="admin-vis-body">
                <div className="admin-vis-name">{p.label}</div>
                <a className="admin-vis-path" href={p.path} target="_blank" rel="noopener" dir="ltr">{p.path}</a>
                {p.hint && <p className="admin-hint">{p.hint}</p>}
              </div>
              <VisibilitySwitch group="pages" itemKey={p.key} label={p.label} on={isPageOn(settings, p.key)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-card">
        <h2 className="admin-card-title">أقسام الصفحة الرئيسية</h2>
        <p className="admin-card-hint">
          القسم المرتبط بصفحة يختفي تلقائياً إذا أُوقفت صفحته، مهما كان مفتاحه هنا.
        </p>
        <ul className="admin-vis-list">
          {HOME_SECTIONS.map((s) => {
            const parent = s.page ? TOGGLEABLE_PAGES.find((p) => p.key === s.page) : undefined;
            const parentOff = !!s.page && !isPageOn(settings, s.page);
            const own = (settings.home_sections as Record<string, unknown> | undefined)?.[s.key] !== false;
            return (
              <li key={s.key} className="admin-vis-row">
                <div className="admin-vis-body">
                  <div className="admin-vis-name">{s.label}</div>
                  {parentOff && parent && (
                    <p className="admin-hint">مخفي لأن صفحة «{parent.label}» موقوفة.</p>
                  )}
                </div>
                <VisibilitySwitch
                  group="home_sections"
                  itemKey={s.key}
                  label={s.label}
                  on={own}
                  dimmed={!isHomeSectionOn(settings, s.key)}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
