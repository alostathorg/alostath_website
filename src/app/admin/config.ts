// Declarative schema that drives the generic admin CRUD engine.
// Each collection maps 1:1 to a Supabase table; fields describe how to render
// and coerce each column.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "tags" // text[]
  | "lines" // textarea → string[] (one per line), e.g. blog body paragraphs
  | "json" // arbitrary jsonb, edited as JSON text
  | "image"; // text URL with an upload helper

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  listColumn?: boolean; // show in the list table
}

export interface Collection {
  table: string;
  slug: string;
  labelSingular: string;
  labelPlural: string;
  orderBy?: { column: string; ascending?: boolean };
  fields: Field[];
}

const THEME_OPTIONS = ["gold", "olive", "sage"];

export const COLLECTIONS: Collection[] = [
  {
    table: "awards",
    slug: "awards",
    labelSingular: "جائزة",
    labelPlural: "الجوائز",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "الاسم", type: "text", listColumn: true },
      { name: "slug", label: "المُعرّف (slug)", type: "text", help: "يُستخدم في الرابط، بالإنجليزية بدون مسافات", listColumn: true },
      { name: "status", label: "حالة التقديم", type: "select", options: ["open", "soon", "closed"], listColumn: true },
      { name: "published", label: "منشور", type: "boolean", listColumn: true },
      { name: "badge_label", label: "وسم الفئة", type: "text" },
      { name: "type", label: "النوع", type: "text" },
      { name: "beneficiaries", label: "المستفيدون", type: "text" },
      { name: "theme", label: "الطابع اللوني", type: "select", options: THEME_OPTIONS },
      { name: "tagline", label: "الوصف المختصر", type: "textarea" },
      { name: "overview", label: "نبذة (عن الجائزة)", type: "textarea" },
      { name: "goal", label: "الهدف", type: "textarea" },
      { name: "categories", label: "المجالات", type: "tags", help: "افصل بينها بفواصل" },
      { name: "steps", label: "خطوات المشاركة", type: "json", help: '[{ "title": "...", "body": "..." }]' },
      { name: "phases", label: "الجدول الزمني", type: "json", help: '[{ "label": "...", "date_text": "...", "state": "now|next|done", "tag_text": "" }]' },
      { name: "hero_image_url", label: "صورة الغلاف", type: "image" },
      { name: "partnership_note", label: "ملاحظة الشراكة", type: "textarea" },
      { name: "sort_order", label: "الترتيب", type: "number" },
    ],
  },
  {
    table: "initiatives",
    slug: "initiatives",
    labelSingular: "مبادرة",
    labelPlural: "المبادرات",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "الاسم", type: "text", listColumn: true },
      { name: "slug", label: "المُعرّف (slug)", type: "text", listColumn: true },
      { name: "published", label: "منشور", type: "boolean", listColumn: true },
      { name: "badge", label: "الوسم", type: "text" },
      { name: "theme", label: "الطابع اللوني", type: "select", options: THEME_OPTIONS },
      { name: "tagline", label: "العبارة التعريفية", type: "textarea" },
      { name: "overview", label: "نظرة عامة", type: "textarea" },
      { name: "goal", label: "الهدف", type: "textarea" },
      { name: "facts", label: "حقائق سريعة", type: "json", help: '[{ "k": "النوع", "v": "..." }]' },
      { name: "value_cards", label: "القيمة المضافة", type: "json", help: '[{ "title": "...", "body": "..." }]' },
      { name: "steps", label: "كيف تعمل", type: "json", help: '[{ "title": "...", "body": "..." }]' },
      { name: "partners", label: "الشركاء", type: "tags" },
      { name: "logo_url", label: "الشعار", type: "image" },
      { name: "hero_image_url", label: "صورة الغلاف", type: "image" },
      { name: "sort_order", label: "الترتيب", type: "number" },
    ],
  },
  {
    table: "blog_posts",
    slug: "posts",
    labelSingular: "مقال",
    labelPlural: "المدونة",
    orderBy: { column: "published_at", ascending: false },
    fields: [
      { name: "title", label: "العنوان", type: "text", listColumn: true },
      { name: "slug", label: "المُعرّف (slug)", type: "text", listColumn: true },
      { name: "published", label: "منشور", type: "boolean", listColumn: true },
      { name: "category", label: "التصنيف", type: "text", listColumn: true },
      { name: "published_at", label: "تاريخ النشر", type: "text", help: "YYYY-MM-DD" },
      { name: "excerpt", label: "المقتطف", type: "textarea" },
      { name: "cover_url", label: "صورة الغلاف", type: "image" },
      { name: "body", label: "نص المقال", type: "lines", help: "كل فقرة في سطر مستقل" },
    ],
  },
  {
    table: "partners",
    slug: "partners",
    labelSingular: "شريك",
    labelPlural: "الشركاء",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "الاسم", type: "text", listColumn: true },
      { name: "logo_url", label: "الشعار", type: "image" },
      { name: "sort_order", label: "الترتيب", type: "number", listColumn: true },
    ],
  },
  {
    table: "press_assets",
    slug: "press",
    labelSingular: "أصل إعلامي",
    labelPlural: "الملف الإعلامي",
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title", label: "العنوان", type: "text", listColumn: true },
      { name: "kind", label: "النوع", type: "select", options: ["logo", "color", "pdf", "zip", "font"], listColumn: true },
      { name: "description", label: "الوصف", type: "textarea" },
      { name: "file_url", label: "الملف", type: "image" },
      { name: "meta", label: "بيانات إضافية", type: "json", help: 'مثال للّون: { "hex": "#BF9B2F" }' },
      { name: "sort_order", label: "الترتيب", type: "number", listColumn: true },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
