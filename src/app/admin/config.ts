import {
  BRAND_CATEGORIES,
  BRAND_CATEGORY_LABELS,
  BRAND_PRICINGS,
  BRAND_PRICING_LABELS,
  PARTNERS_NAV_LABEL,
} from "@/lib/brandPartners";

// Declarative schema that drives the generic admin CRUD engine.
// Each collection maps 1:1 to a Supabase table; fields describe how to render
// and coerce each column. Fields are grouped into titled sections and complex
// values (steps, timeline, cards…) use friendly add/remove row editors instead
// of raw JSON so non-technical editors can use them.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "tags" // text[] (comma separated)
  | "lines" // textarea → string[] (one per line)
  | "repeater" // array of objects, edited as add/remove rows (itemFields)
  | "keyvalue" // object of {key: value}, edited as add/remove rows
  | "json" // raw jsonb fallback
  | "image"; // URL with upload helper

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  optionLabels?: Record<string, string>;
  itemFields?: Field[]; // for repeater
  help?: string;
  placeholder?: string;
  listColumn?: boolean; // show in the list table
  group?: string; // section heading in the edit form
}

export interface Collection {
  table: string;
  slug: string;
  labelSingular: string;
  labelPlural: string;
  orderBy?: { column: string; ascending?: boolean };
  fields: Field[];
}

const THEME = { options: ["gold", "olive", "sage"], optionLabels: { gold: "ذهبي", olive: "زيتوني", sage: "مريمي" } };

const G_BASIC = "المعلومات الأساسية";
const G_TEXT = "النصوص";
const G_CONTENT = "المحتوى";
const G_MEDIA = "الصور والملفات";
const G_TIMELINE = "الجدول الزمني";
const G_OFFER = "عرض المعلّم";
const G_LINKS = "الروابط";

// Reusable row schemas for the repeater editors.
const STEP_ITEM: Field[] = [
  { name: "title", label: "العنوان", type: "text" },
  { name: "body", label: "الوصف", type: "textarea" },
];
const CARD_ITEM: Field[] = [
  { name: "title", label: "العنوان", type: "text" },
  { name: "body", label: "الوصف", type: "textarea" },
];
const FACT_ITEM: Field[] = [
  { name: "k", label: "الحقل", type: "text", placeholder: "مثال: النوع" },
  { name: "v", label: "القيمة", type: "text", placeholder: "مثال: مبادرة وطنية" },
];
const PHASE_ITEM: Field[] = [
  { name: "label", label: "المرحلة", type: "text", placeholder: "مثال: التسجيل وتقديم الأعمال" },
  { name: "date_text", label: "التاريخ", type: "text", placeholder: "مثال: حتى 30 رمضان 1447هـ" },
  { name: "state", label: "الحالة", type: "select", options: ["next", "now", "done"], optionLabels: { next: "قادمة", now: "الحالية", done: "منتهية" } },
  { name: "tag_text", label: "وسم (اختياري)", type: "text", placeholder: "مثال: مفتوح الآن" },
];

export const COLLECTIONS: Collection[] = [
  {
    table: "awards",
    slug: "awards",
    labelSingular: "جائزة",
    labelPlural: "الجوائز",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "الاسم", type: "text", group: G_BASIC, listColumn: true },
      { name: "slug", label: "مُعرّف الرابط", type: "text", group: G_BASIC, listColumn: true },
      { name: "status", label: "حالة التقديم", type: "select", options: ["open", "soon", "closed"], optionLabels: { open: "التقديم مفتوح", soon: "يفتح قريباً", closed: "مغلق" }, group: G_BASIC, listColumn: true },
      { name: "published", label: "منشور على الموقع", type: "boolean", group: G_BASIC, listColumn: true },
      { name: "badge_label", label: "وسم الفئة", type: "text", placeholder: "مثال: جائزة فنّية", group: G_BASIC },
      { name: "type", label: "النوع", type: "text", placeholder: "مثال: جائزة فنّية وطنية", group: G_BASIC },
      { name: "beneficiaries", label: "المستفيدون", type: "text", placeholder: "مثال: معلّمو ومعلّمات الوطن", group: G_BASIC },
      { name: "theme", label: "الطابع اللوني", type: "select", ...THEME, group: G_BASIC },
      { name: "sort_order", label: "الترتيب", type: "number", help: "الأصغر يظهر أولاً", group: G_BASIC },
      { name: "tagline", label: "العبارة التعريفية", type: "textarea", group: G_TEXT },
      { name: "overview", label: "نبذة (عن الجائزة)", type: "textarea", group: G_TEXT },
      { name: "goal", label: "الهدف", type: "textarea", group: G_TEXT },
      { name: "partnership_note", label: "ملاحظة الشراكة", type: "textarea", group: G_TEXT },
      { name: "categories", label: "المجالات", type: "tags", help: "اكتب كل مجال وافصل بينها بفاصلة (،)", placeholder: "الرسم، التصوير، الفنون البصرية", group: G_TEXT },
      { name: "steps", label: "خطوات المشاركة", type: "repeater", itemFields: STEP_ITEM, group: G_CONTENT },
      { name: "phases", label: "مراحل الجدول الزمني", type: "repeater", itemFields: PHASE_ITEM, group: G_TIMELINE },
      { name: "hero_image_url", label: "صورة الغلاف", type: "image", group: G_MEDIA },
    ],
  },
  {
    table: "initiatives",
    slug: "initiatives",
    labelSingular: "مبادرة",
    labelPlural: "المبادرات",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "الاسم", type: "text", group: G_BASIC, listColumn: true },
      { name: "slug", label: "مُعرّف الرابط", type: "text", group: G_BASIC, listColumn: true },
      { name: "published", label: "منشور على الموقع", type: "boolean", group: G_BASIC, listColumn: true },
      { name: "badge", label: "الوسم", type: "text", placeholder: "مثال: مبادرة وطنية", group: G_BASIC },
      { name: "theme", label: "الطابع اللوني", type: "select", ...THEME, group: G_BASIC },
      { name: "sort_order", label: "الترتيب", type: "number", help: "الأصغر يظهر أولاً", group: G_BASIC },
      { name: "tagline", label: "العبارة التعريفية", type: "textarea", group: G_TEXT },
      { name: "overview", label: "نظرة عامة", type: "textarea", group: G_TEXT },
      { name: "goal", label: "الهدف", type: "textarea", group: G_TEXT },
      { name: "partners", label: "الشركاء", type: "tags", help: "افصل بين الأسماء بفاصلة (،)", group: G_TEXT },
      { name: "facts", label: "حقائق سريعة", type: "repeater", itemFields: FACT_ITEM, group: G_CONTENT },
      { name: "value_cards", label: "القيمة المضافة", type: "repeater", itemFields: CARD_ITEM, group: G_CONTENT },
      { name: "steps", label: "كيف تعمل المبادرة", type: "repeater", itemFields: STEP_ITEM, group: G_CONTENT },
      { name: "logo_url", label: "الشعار", type: "image", group: G_MEDIA },
      { name: "hero_image_url", label: "صورة الغلاف", type: "image", group: G_MEDIA },
    ],
  },
  {
    table: "blog_posts",
    slug: "posts",
    labelSingular: "مقال",
    labelPlural: "المدونة",
    orderBy: { column: "published_at", ascending: false },
    fields: [
      { name: "title", label: "العنوان", type: "text", group: G_BASIC, listColumn: true },
      { name: "slug", label: "مُعرّف الرابط", type: "text", group: G_BASIC, listColumn: true },
      { name: "published", label: "منشور على الموقع", type: "boolean", group: G_BASIC, listColumn: true },
      { name: "category", label: "التصنيف", type: "text", placeholder: "مثال: مقالات", group: G_BASIC, listColumn: true },
      { name: "published_at", label: "تاريخ النشر", type: "date", group: G_BASIC },
      { name: "excerpt", label: "المقتطف", type: "textarea", group: G_TEXT },
      { name: "body", label: "نص المقال", type: "lines", help: "اكتب كل فقرة في سطر مستقل", group: G_TEXT },
      { name: "cover_url", label: "صورة الغلاف", type: "image", group: G_MEDIA },
    ],
  },
  {
    // «الإعلامات» — brands whose products / services / offers help teachers.
    // Not the same thing as `partners` below (institutional partners, marquee).
    table: "brand_partners",
    slug: "brands",
    labelSingular: "علامة شريكة",
    labelPlural: PARTNERS_NAV_LABEL,
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "اسم العلامة", type: "text", placeholder: "مثال: منصّة درّس", group: G_BASIC, listColumn: true },
      { name: "slug", label: "مُعرّف الرابط", type: "text", group: G_BASIC, listColumn: true },
      { name: "published", label: "منشور على الموقع", type: "boolean", help: "تبقى العلامة مسودة حتى تُراجَع وتُعتمد", group: G_BASIC, listColumn: true },
      { name: "featured", label: "شريك مميّز", type: "boolean", help: "يظهر أولاً في بطاقة عريضة مع وسم ذهبي", group: G_BASIC },
      { name: "category", label: "الفئة", type: "select", options: BRAND_CATEGORIES, optionLabels: BRAND_CATEGORY_LABELS, group: G_BASIC, listColumn: true },
      { name: "pricing", label: "التكلفة", type: "select", options: BRAND_PRICINGS, optionLabels: BRAND_PRICING_LABELS, group: G_BASIC },
      { name: "sort_order", label: "الترتيب", type: "number", help: "الأصغر يظهر أولاً", group: G_BASIC },
      { name: "tagline", label: "ماذا تقدّم للمعلّم؟ (سطر واحد)", type: "textarea", help: "يظهر على البطاقة — حتى 90 حرفاً، يبدأ بالفائدة لا باسم الشركة", placeholder: "مثال: تحضير الدروس وبنك أسئلة متوافق مع المناهج في دقائق.", group: G_TEXT },
      { name: "overview", label: "نبذة عن العلامة", type: "textarea", group: G_TEXT },
      { name: "audience", label: "لمن؟ (الفئات المستهدفة)", type: "tags", help: "اكتب كل فئة واضغط Enter", placeholder: "معلّمو المرحلة الابتدائية", group: G_TEXT },
      { name: "location", label: "المقر", type: "text", placeholder: "الرياض، المملكة العربية السعودية", group: G_TEXT },
      { name: "teacher_offer", label: "عرض المعلّم (عنوان)", type: "text", help: "اتركه فارغاً إن لم يوجد عرض خاص", placeholder: "خصم 25% لأعضاء مجتمع الأستاذ", group: G_OFFER },
      { name: "offer_code", label: "رمز العرض", type: "text", placeholder: "OSTATH25", group: G_OFFER },
      { name: "offer_note", label: "شروط العرض", type: "textarea", help: "الصلاحية، كيفية التفعيل، من يستحقه", placeholder: "ساري حتى 30 يونيو 2027 عند التسجيل ببريد جهة العمل.", group: G_OFFER },
      { name: "highlights", label: "ماذا يقدّم للمعلّم (أبرز الميزات)", type: "repeater", itemFields: CARD_ITEM, help: "3 إلى 4 ميزات", group: G_CONTENT },
      { name: "website_url", label: "الموقع الرسمي", type: "text", help: "يظهر اسم النطاق للمعلّم قبل الانتقال", placeholder: "https://…", group: G_LINKS },
      { name: "cta_url", label: "رابط الزر (صفحة العرض)", type: "text", help: "اختياري — إن تُرك فارغاً يُستخدم الموقع الرسمي", placeholder: "https://…/teachers", group: G_LINKS },
      { name: "cta_label", label: "نص الزر", type: "text", help: "اختياري — الافتراضي: انتقل إلى موقع الشريك", placeholder: "فعّل العرض الآن", group: G_LINKS },
      { name: "logo_url", label: "الشعار", type: "image", help: "PNG شفاف أو SVG بأي نسبة أبعاد، بعرض 600 بكسل على الأقل — نسخة مناسبة للخلفيات الفاتحة", group: G_MEDIA },
      { name: "hero_image_url", label: "صورة المنتج (اختياري)", type: "image", group: G_MEDIA },
    ],
  },
  {
    table: "partners",
    slug: "partners",
    labelSingular: "شريك",
    labelPlural: "الشركاء",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "الاسم", type: "text", group: G_BASIC, listColumn: true },
      { name: "sort_order", label: "الترتيب", type: "number", group: G_BASIC, listColumn: true },
      { name: "logo_url", label: "الشعار", type: "image", group: G_MEDIA },
    ],
  },
  {
    table: "press_assets",
    slug: "press",
    labelSingular: "أصل إعلامي",
    labelPlural: "الملف الإعلامي",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title", label: "العنوان", type: "text", group: G_BASIC, listColumn: true },
      { name: "kind", label: "النوع", type: "select", options: ["logo", "color", "pdf", "zip", "font"], optionLabels: { logo: "شعار", color: "لون", pdf: "ملف PDF", zip: "حزمة ZIP", font: "خط" }, group: G_BASIC, listColumn: true },
      { name: "sort_order", label: "الترتيب", type: "number", group: G_BASIC, listColumn: true },
      { name: "description", label: "الوصف", type: "textarea", group: G_TEXT },
      { name: "meta", label: "بيانات إضافية", type: "keyvalue", help: "للألوان: أضف حقلاً باسم hex وقيمته مثل ‎#BF9B2F", group: G_CONTENT },
      { name: "file_url", label: "الملف", type: "image", group: G_MEDIA },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

// ── AI content helper ────────────────────────────────────────────────────────
// The writing-heavy fields the "copy prompt → paste back" flow fills. System
// fields (slug, status, theme, order, images, published) and the steps/timeline
// (which get a ready template on create) are intentionally excluded.
export const AI_FIELDS: Record<string, string[]> = {
  awards: ["name", "status", "badge_label", "type", "beneficiaries", "tagline", "overview", "goal", "partnership_note", "categories", "steps", "phases"],
  initiatives: ["name", "badge", "tagline", "overview", "goal", "partners", "facts", "value_cards", "steps"],
  brands: ["name", "tagline", "category", "pricing", "audience", "location", "teacher_offer", "offer_code", "offer_note", "overview", "highlights"],
};

// Ready-made starting content added to a NEW award / initiative so the steps
// and timeline are never blank. Editors adjust or replace them.
export const NEW_DEFAULTS: Record<string, Record<string, unknown>> = {
  awards: {
    steps: [
      { title: "سجّل اهتمامك", body: "عبّر عن رغبتك بالمشاركة وتعرّف على الشروط." },
      { title: "قدّم عملك", body: "ارفع أعمالك وفق المجالات والمعايير المعتمدة." },
      { title: "التحكيم", body: "تُقيّم لجنة متخصصة الأعمال بمعايير فنية." },
      { title: "إعلان النتائج", body: "يُعلن عن الفائزين وتُوزّع الجوائز." },
    ],
    phases: [
      { label: "التسجيل وتقديم الأعمال", date_text: "", state: "now", tag_text: "مفتوح الآن" },
      { label: "التحكيم", date_text: "", state: "next", tag_text: "" },
      { label: "إعلان النتائج", date_text: "", state: "next", tag_text: "" },
    ],
  },
  initiatives: {
    steps: [
      { title: "التخطيط", body: "نحدّد الأهداف والفئة المستهدفة." },
      { title: "التنفيذ", body: "نُطلق أنشطة المبادرة على أرض الواقع." },
      { title: "قياس الأثر", body: "نقيس النتائج ونطوّر التجربة." },
    ],
  },
};

// Builds the ready Arabic prompt an editor copies into any AI tool, together
// with the source file, to get back JSON that fills the form.
export function buildAiPrompt(collection: Collection): string {
  const names = AI_FIELDS[collection.slug] ?? [];
  const fields = names
    .map((n) => collection.fields.find((f) => f.name === n))
    .filter((f): f is Field => Boolean(f));

  const optsText = (f: Field) =>
    (f.options ?? []).map((o) => `"${o}"${f.optionLabels?.[o] ? ` (${f.optionLabels[o]})` : ""}`).join(" أو ");

  const skeleton: Record<string, unknown> = {};
  const legend: string[] = [];
  for (const f of fields) {
    if (f.type === "tags") {
      skeleton[f.name] = [];
      legend.push(`- «${f.label}» (${f.name}): قائمة نصوص. ${f.help ?? ""}`.trim());
    } else if (f.type === "repeater") {
      const item: Record<string, string> = {};
      const sub: string[] = [];
      for (const it of f.itemFields ?? []) {
        item[it.name] = "";
        sub.push(it.type === "select" ? `"${it.name}" (${it.label}): إحدى القيم ${optsText(it)}` : `"${it.name}" (${it.label})`);
      }
      skeleton[f.name] = [item];
      legend.push(`- «${f.label}» (${f.name}): قائمة عناصر، كل عنصر يحتوي: ${sub.join("، ")}.`);
    } else if (f.type === "select") {
      skeleton[f.name] = "";
      legend.push(`- «${f.label}» (${f.name}): إحدى القيم ${optsText(f)}. ${f.help ?? ""}`.trim());
    } else {
      skeleton[f.name] = "";
      legend.push(`- «${f.label}» (${f.name}): ${f.help ?? "نص"}.`);
    }
  }

  return [
    `أنت مساعد لكتابة محتوى موقع «مؤسسة الأستاذ» الرسمي.`,
    `سأزوّدك بمصدر (ملف أو صورة أو نص) يحتوي على معلومات عن ${collection.labelSingular}. ادرسه جيداً ثم اكتب المحتوى باللغة العربية الفصحى بأسلوب واضح ورسمي.`,
    ``,
    `أعِد النتيجة على هيئة JSON فقط، بنفس المفاتيح التالية تماماً، دون أي نص قبله أو بعده:`,
    ``,
    JSON.stringify(skeleton, null, 2),
    ``,
    `إرشادات الحقول:`,
    ...legend,
    ``,
    `قواعد مهمة:`,
    `- اكتب بالعربية الفصحى فقط.`,
    `- اعتمد فقط على المعلومات الواردة في المصدر المرفق. يمكنك تحسين الصياغة وتنظيم المعلومات وكتابتها بأسلوب احترافي، لكن لا تُضِف حقائق أو أسماء أو أرقاماً أو تواريخ غير موجودة في المصدر.`,
    `- إن لم تتوفّر معلومة تخصّ حقلاً ما، اتركه فارغاً ("" أو []) ولا تخمّن.`,
    `- املأ كل الحقول التي تجد لها معلومات في المصدر.`,
    `- حافظ على أسماء المفاتيح بالإنجليزية كما هي أعلاه.`,
    `- أعِد JSON صالحاً فقط دون أي شرح أو علامات إضافية.`,
  ].join("\n");
}
