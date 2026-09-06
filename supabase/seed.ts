/**
 * One-time seed: mirrors the content that was hardcoded in the original static
 * site into Supabase. Idempotent — re-running upserts on the natural keys.
 *
 * Usage:
 *   1. Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 *   2. npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Minimal .env loader (no dotenv dependency).
try {
  const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* rely on ambient env */
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const FRAMER = "https://framerusercontent.com/images";

// ── AWARDS ───────────────────────────────────────────────────────────────────
const awards = [
  {
    slug: "resha",
    name: "جائزة ريشة معلّم",
    tagline: "المعلّم صانعٌ للجمال ورافدٌ للثقافة — منصّةٌ وطنية تحتفي بإبداعه.",
    type: "جائزة فنّية وطنية",
    badge_label: "جائزة فنّية",
    beneficiaries: "معلّمو ومعلّمات الوطن",
    status: "open",
    theme: "gold",
    overview:
      "إيماناً بأنّ المعلّم ليس حاملاً لعلمٍ فحسب، بل صانعاً للجمال ورافداً للثقافة، تُنشئ مؤسسة الأستاذ غير الربحية «جائزة ريشة المعلّم» لتكون منصّةً وطنية تحتفي بالفنّانين من المعلّمين والمعلّمات السعوديين، وتشجّعهم على الإبداع والإنتاج الفنّي الراقي.",
    goal:
      "إبراز الفنّان المعلّم في المشهد الثقافي السعودي، وتمكينه من التعبير عن دوره الإنساني والتربوي عبر الأعمال الفنية الحديثة والمعاصرة.",
    categories: ["الرسم", "التصوير", "الفنون البصرية المعاصرة"],
    steps: [
      { title: "سجّل اهتمامك", body: "عبّر عن رغبتك بالمشاركة وتعرّف على الشروط." },
      { title: "قدّم عملك الفنّي", body: "ارفع أعمالك وفق المجالات والمعايير المعتمدة." },
      { title: "التحكيم", body: "تُقيّم لجنة متخصصة الأعمال بمعايير فنية." },
      { title: "التكريم", body: "يُحتفى بالفائزين في المشهد الثقافي." },
    ],
    hero_image_url: `${FRAMER}/Oufg4V3LnCZ23EQvXyw818N7P8.png?width=1237&height=628`,
    partnership_note:
      "تُنفَّذ الجائزة في إطارٍ تكاملي مع وزارة التعليم ووزارة الثقافة وهيئاتها المتخصصة، بما يدعم استدامة أثرها الثقافي والتربوي.",
    sort_order: 1,
    phases: [
      { label: "التسجيل وتقديم الأعمال", date_text: "حتى 30 رمضان 1447هـ", state: "now", tag_text: "مفتوح الآن" },
      { label: "تحكيم الأعمال", date_text: "شوال 1447هـ", state: "next" },
      { label: "إعلان النتائج", date_text: "ذو القعدة 1447هـ", state: "next" },
      { label: "حفل التكريم", date_text: "ذو الحجة 1447هـ", state: "next" },
    ],
  },
  {
    slug: "qissa",
    name: "جائزة الأستاذ للقصة القصيرة",
    tagline: "بالكلمة والقدوة يضيء المعلّم الدروب — حضورٌ أدبيٌّ يليق بمكانته.",
    type: "جائزة أدبية وطنية",
    badge_label: "جائزة أدبية",
    beneficiaries: "معلّمو ومعلّمات الوطن",
    status: "soon",
    theme: "sage",
    overview:
      "إيماناً من مؤسسة الأستاذ غير الربحية بأنّ المعلّم هو حجر الأساس في تشكيل الوعي، وحارس المعرفة الذي يضيء الدروب بفعل الكلمة والقدوة، تُنشئ «جائزة الأستاذ للقصة القصيرة» تعزيزاً لصورة المعلّم في الأدب، وتمثيلاً لمكانته في الذاكرة الثقافية من خلال القصة القصيرة.",
    goal:
      "ترسيخ صورة المعلّم في الأدب، وتمثيل مكانته في الذاكرة الثقافية بوصفه صانعاً للوعي وحارساً للمعرفة.",
    categories: ["القصة القصيرة", "السرد الأدبي"],
    steps: [
      { title: "سجّل اهتمامك", body: "تعرّف على شروط الجائزة وموعد فتح الترشّح." },
      { title: "اكتب قصّتك", body: "قدّم عملاً سردياً وفق المعايير الأدبية المعتمدة." },
      { title: "التحكيم", body: "تُقيّم لجنة أدبية متخصصة الأعمال المشاركة." },
      { title: "التكريم والنشر", body: "يُحتفى بالفائزين وتُبرز أعمالهم ثقافياً." },
    ],
    hero_image_url: `${FRAMER}/2yxfICYwCUINVvjVkCoNu5Muyc.png?width=988&height=502`,
    partnership_note:
      "تُنفَّذ الجائزة في إطارٍ تكاملي مع وزارة التعليم ووزارة الثقافة وهيئاتها المتخصصة، بما يعزّز مواءمتها مع التوجّهات الوطنية.",
    sort_order: 2,
    phases: [
      { label: "فتح باب التسجيل", date_text: "يُعلَن عن الموعد قريباً", state: "now", tag_text: "قريباً" },
      { label: "فترة تقديم الأعمال", date_text: "تُحدَّد لاحقاً", state: "next" },
      { label: "التحكيم", date_text: "تُحدَّد لاحقاً", state: "next" },
      { label: "إعلان النتائج والتكريم", date_text: "تُحدَّد لاحقاً", state: "next" },
    ],
  },
];

// ── INITIATIVES ──────────────────────────────────────────────────────────────
const initiatives = [
  {
    slug: "nasiyah",
    name: "مبادرة ناصية",
    tagline: "من الفصل الدراسي إلى واجهة المشهد الوطني — تمكينُ المعلّم ليقود.",
    badge: "مبادرة وطنية",
    theme: "gold",
    overview:
      "مبادرة وطنية تهدف إلى توظيف مهارات المعلّم والمعلّمة السعوديين من خلال تمكينهم للمشاركة المؤسسية في الاستضافات الوطنية الكبرى بشكلٍ قيادي فاعل — عبر برامج تدريبية معتمدة وتجارب عملية تُسهم في بناء معلّمٍ منافسٍ عالميّاً وعضوٍ مجتمعي فاعل.",
    goal:
      "تمكين المعلّم من الانتقال بمهاراته وكفاءاته خارج حدود الفصل الدراسي، وإتاحة الفرصة له للمشاركة الفاعلة في المشهد الوطني الكبير بما يُثري تجربته المهنية ويرفع مكانته في المجتمع.",
    facts: [
      { k: "النوع", v: "مبادرة وطنية" },
      { k: "المجال", v: "القيادة والتمثيل" },
      { k: "الحالة", v: "مبادرة قائمة" },
    ],
    value_cards: [
      { title: "أثرٌ وطني", body: "فرصٌ ذات أثرٍ اجتماعي ومهني ووطني تُبرز دور المعلّم القيادي." },
      { title: "حضورٌ خارج الفصل", body: "منصّة للمشاركة في الاستضافات الوطنية الكبرى بصفةٍ قيادية." },
      { title: "تأهيلٌ معتمد", body: "برامج تدريبية معتمدة تبني معلّماً منافساً عالميّاً." },
    ],
    steps: [
      { title: "الترشيح والاختيار", body: "اختيار نخبة من المعلّمين والمعلّمات وفق معايير الكفاءة." },
      { title: "التأهيل والتدريب", body: "برامج معتمدة تبني المهارات القيادية والتمثيلية." },
      { title: "المشاركة الميدانية", body: "انخراط قيادي فاعل في الاستضافات الوطنية الكبرى." },
      { title: "الأثر والاستمرار", body: "نموذج غير ربحي يضمن الاستدامة وتوسيع النطاق." },
    ],
    partners: ["جهات الاستضافة الوطنية الكبرى", "وزارة التعليم", "جهات حكومية وخاصة"],
    hero_image_url: `${FRAMER}/v1dJdT3sKhUDYCR574juSpMYW4.jpg?width=1600&height=720`,
    logo_url: null,
    sort_order: 1,
  },
  {
    slug: "wathba",
    name: "مبادرة وثبة",
    tagline: "صحّةُ المعلّم أولاً — رحلةٌ رقمية نحو جودة حياةٍ أفضل.",
    badge: "تطبيق رقمي وطني",
    theme: "sage",
    overview:
      "مبادرة رقمية وطنية تشاركية تهدف إلى تحسين جودة حياة منسوبي التعليم والمعلّمين في المملكة، من خلال رفع مستوى الصحة البدنية والنفسية والوعي الصحي — عبر تطبيقٍ سعودي تفاعلي يُقدّم تحديات صحية وبرامج وقاية ولوحات بيانات تدعم اتخاذ القرار.",
    goal:
      "معالجة التحديات الصحية التي يواجهها المعلّم بأسلوبٍ تقني عملي وتشاركي، وتوفير بيئةٍ رقمية داعمة تُعينه على تحقيق الاستقرار الجسدي والنفسي بما ينعكس إيجاباً على أدائه ورسالته التعليمية.",
    facts: [
      { k: "النوع", v: "تطبيق رقمي وطني" },
      { k: "المجال", v: "الصحة وجودة الحياة" },
      { k: "الحالة", v: "مبادرة قائمة" },
    ],
    value_cards: [
      { title: "قابلٌ للقياس", body: "تحسينٌ ملموس لجودة الحياة بأدواتٍ رقمية تفاعلية." },
      { title: "رحلةٌ مستدامة", body: "تحديات وبرامج وقاية تُشرك المعلّم في عادةٍ صحية دائمة." },
      { title: "استقرارٌ مهني", body: "صحةٌ نفسية وجسدية تنعكس على الأداء والرسالة التعليمية." },
    ],
    steps: [
      { title: "التسجيل في التطبيق", body: "انضمام المعلّم إلى المنصّة الصحية التفاعلية." },
      { title: "تحديات وبرامج", body: "تحديات صحية وبرامج وقاية مصمّمة للمعلّم." },
      { title: "لوحات البيانات", body: "مؤشرات تدعم اتخاذ القرار الفردي والمؤسسي." },
      { title: "شراكاتٌ مستدامة", body: "توظيف البيانات لتعزيز الشراكات الصحية والتعليمية." },
    ],
    partners: ["وزارة التعليم", "جهات صحية متخصصة", "شريك تقني للتطبيق"],
    hero_image_url: `${FRAMER}/GQFfJ4TINOZjZebXiIyGjLKlaI.jpg?width=1600&height=720`,
    logo_url: null,
    sort_order: 2,
  },
  {
    slug: "musheer",
    name: "مبادرة مُشير",
    tagline: "المعلّم مرشداً أكاديميًا — يقود الطلبة الموهوبين نحو الجامعات العالمية المرموقة.",
    badge: "برنامج وطني نوعي",
    theme: "gold",
    overview:
      "برنامج وطني نوعي يُؤهّل نخبةً مختارة من المعلّمين والمعلّمات ليكونوا مرشدين أكاديميين متخصصين في دعم الطلبة الموهوبين وذوي الدافعية العالية، ومساعدتهم في الاستعداد المبكّر والمنظّم للتنافس على القبول في الجامعات العالمية المرموقة.",
    goal:
      "بناء قدرةٍ مؤسسية داخل المدارس من خلال تمكين المعلّم من أداء دورٍ إرشادي نوعي يسدّ فجوةً قائمة في منظومة دعم الطلبة المتميّزين، ويرفع من أثر المعلّم المهني ومكانته داخل المجتمع التعليمي.",
    facts: [
      { k: "النوع", v: "برنامج وطني نوعي" },
      { k: "المجال", v: "الإرشاد الأكاديمي" },
      { k: "الحالة", v: "مبادرة قائمة" },
    ],
    value_cards: [
      { title: "تأهيلٌ دولي متخصص", body: "تأهيل أكاديمي متخصص في الإرشاد الجامعي الدولي." },
      { title: "أدواتٌ مهنية عملية", body: "بناء خطط فردية للطلبة ومتابعة تقدّمهم بأدوات مهنية." },
      { title: "مجتمع «مُشير» المهني", body: "انتساب لمجتمعٍ مهني يمنح المعلّم دوراً يوسّع أثره خارج الفصل." },
    ],
    steps: [
      { title: "تأهيل المعلّم", body: "برنامج إرشاد جامعي معتمد للمعلّم المرشد." },
      { title: "إرشاد الطلاب", body: "خطط فردية ومتابعة نحو القبول الجامعي." },
      { title: "تدريب المدرّبين", body: "نموذج يضمن استمرار بناء الكفاءات محلياً." },
      { title: "منصّة المتابعة", body: "منصّة رقمية ونشرة معرفية دورية للمرشدين." },
    ],
    partners: ["وزارة التعليم", "مؤسسة موهبة", "شريك دولي للإرشاد الأكاديمي"],
    hero_image_url: null,
    logo_url: "/assets/musheer-logo.svg",
    sort_order: 3,
  },
];

// ── BLOG POSTS (from data/posts.js) ──────────────────────────────────────────
const posts = [
  {
    slug: "makanat-almuallim",
    title: "كيف تُبنى مكانة المعلّم في مجتمعٍ متغيّر؟",
    excerpt: "قراءة في الأدوار المتجدّدة للمعلّم، وكيف تتكامل المنظومات الداعمة لتعزيز حضوره المهني والمجتمعي.",
    published_at: "2026-05-12",
    category: "مقالات",
    cover_url: `${FRAMER}/kvi7PxaoGkKKK99CbnbOWiTUDY.jpeg?width=1492&height=1024`,
    body: [
      "تشهد منظومة التعليم تحوّلاتٍ متسارعة تفرض على المعلّم أدواراً تتجاوز التلقين إلى القيادة والتوجيه وبناء القيم. وفي خضمّ هذا التحوّل، تصبح مكانة المعلّم مسؤوليةً مشتركة بين الجهات التعليمية والمجتمع ككل.",
      "تسعى مؤسسة الأستاذ من خلال منظومتها المتكاملة إلى ترجمة هذا الفهم إلى برامجٍ وخدماتٍ ملموسة، تبدأ من تمكين المعلّم مهنيّاً وتنتهي بالاحتفاء بإنجازاته عبر جوائز الأستاذ ومبادراتها الوطنية.",
      "إنّ الاستثمار في مكانة المعلّم ليس ترفاً، بل هو استثمارٌ مباشر في جودة العملية التعليمية وفي مستقبل الأجيال القادمة.",
    ],
  },
  {
    slug: "tajribat-nasiyah",
    title: "تجربة مبادرة ناصية: حين يقود المعلّم المشهد الوطني",
    excerpt: "نظرة على كيفية تمكين مبادرة ناصية للمعلّمين والمعلّمات من المشاركة القيادية في الاستضافات الوطنية الكبرى.",
    published_at: "2026-04-03",
    category: "مبادرات",
    cover_url: `${FRAMER}/v1dJdT3sKhUDYCR574juSpMYW4.jpg?width=1600&height=900`,
    body: [
      "انطلقت مبادرة ناصية من فكرةٍ بسيطة: أنّ المعلّم، بما يمتلكه من مهاراتٍ تنظيمية وقيادية، قادرٌ على أن يكون صوتاً فاعلاً في الاستضافات الوطنية الكبرى، لا مجرّد حضورٍ هامشي.",
      "من خلال برامج تأهيلٍ نوعية وشراكاتٍ مع الجهات المختصة، تمكّن عددٌ من المعلّمين والمعلّمات من المشاركة في فرقٍ تنظيمية بمناسباتٍ وطنية مفصلية، وعادوا بخبراتٍ أعادوا تدويرها داخل مدارسهم.",
      "تستمر المبادرة في فتح المجال لمزيدٍ من المعلّمين عاماً بعد عام، بما يرسّخ حضورهم في المشهد الوطني بشكلٍ مستدام.",
    ],
  },
  {
    slug: "majlis-alostath-2026",
    title: "مجلس الأستاذ: متى يتحوّل الحوار إلى أثرٍ ملموس؟",
    excerpt: "كيف يجمع مجلس الأستاذ المعلّمين بالخبراء والجهات المختصة لصياغة مبادراتٍ تعليمية ذات أثر حقيقي.",
    published_at: "2026-02-18",
    category: "المجلس",
    cover_url: `${FRAMER}/mCslxKkFLteZMFGp4F7hgasq1c.jpg?width=1600&height=900`,
    body: [
      "يمثّل مجلس الأستاذ منصّة حوارٍ مهني غير مسبوقة، تُحوّل صوت المعلّم من رأيٍ فردي إلى شراكةٍ مؤسسية في صناعة القرار التعليمي.",
      "في كل دورة، يجتمع معلّمون ومعلّمات مع خبراء وممثّلين عن الجهات الحكومية والخاصة لمناقشة قضايا تعليمية محدّدة، والخروج بتوصياتٍ قابلة للتنفيذ.",
      "النتيجة ليست توصياتٍ على الورق فحسب، بل مبادراتٍ فعلية—كما هو الحال مع مبادرتي وثبة وطموح—نشأت من رحم هذه الجلسات الحوارية.",
    ],
  },
];

// ── PRESS ASSETS ─────────────────────────────────────────────────────────────
const pressAssets = [
  { title: "الشعار الأساسي", kind: "logo", description: "للاستخدام على الخلفيات الفاتحة.", file_url: "/assets/alostath-logo.png", sort_order: 1 },
  { title: "الشعار المعكوس", kind: "logo", description: "للاستخدام على الخلفيات الداكنة والصور.", file_url: "/assets/alostath-logo-inverse.png", sort_order: 2 },
  { title: "الملف التعريفي", kind: "pdf", description: "الملف التعريفي لمؤسسة الأستاذ.", file_url: "/assets/alostath-profile.pdf", sort_order: 3 },
  { title: "الزيتوني الداكن", kind: "color", description: null, meta: { hex: "#1E2814" }, sort_order: 10 },
  { title: "الزيتوني", kind: "color", description: null, meta: { hex: "#4E5B30" }, sort_order: 11 },
  { title: "الذهبي", kind: "color", description: null, meta: { hex: "#BF9B2F" }, sort_order: 12 },
  { title: "المريمي", kind: "color", description: null, meta: { hex: "#78A183" }, sort_order: 13 },
  { title: "العاجي الفاتح", kind: "color", description: null, meta: { hex: "#F4F6EE" }, sort_order: 14 },
  { title: "الحبر", kind: "color", description: null, meta: { hex: "#23271A" }, sort_order: 15 },
];

// ── PARTNERS ─────────────────────────────────────────────────────────────────
const partners = [
  { name: "وزارة التعليم", logo_url: null, sort_order: 1 },
  { name: "وزارة الثقافة", logo_url: null, sort_order: 2 },
  { name: "مؤسسة موهبة", logo_url: null, sort_order: 3 },
];

// ── BRAND PARTNERS («الإعلامات») ─────────────────────────────────────────────
// Sample rows so the dashboard has templates to copy from. Every one is a
// DRAFT (published: false) with a fictional name and an example.com URL: they
// exist to show the shape of a good entry, never to go live. Unlike the other
// seeds these are inserted with ignoreDuplicates, so re-running the seed never
// flips a row an editor has since published back to draft.
const brandPartners = [
  {
    slug: "darris",
    name: "منصّة درّس",
    tagline: "تحضير الدروس وبنك أسئلة متوافق مع المناهج السعودية في دقائق.",
    category: "edtech",
    pricing: "freemium",
    audience: ["معلّمو التعليم العام", "المرحلتان المتوسطة والثانوية"],
    teacher_offer: "3 أشهر مجاناً على الخطة الكاملة للمعلّمين",
    offer_code: "OSTATH3",
    offer_note: "يُفعَّل العرض عند التسجيل ببريد جهة العمل. ساري حتى 30 يونيو 2027 ولا يُجمع مع عروض أخرى.",
    overview:
      "منصّة سعودية تساعد المعلّم على تحضير درسه وبناء اختباراته من بنك أسئلة مصنّف وفق المنهج والمخرجات، مع قوالب جاهزة للخطط الفصلية وتقارير متابعة للطلاب تُصدَّر بضغطة واحدة.",
    highlights: [
      { title: "تحضير في دقائق", body: "قوالب تحضير مرتبطة بأهداف المنهج تُملأ تلقائياً وتُعدَّل بحرّية." },
      { title: "بنك أسئلة مصنّف", body: "أكثر من 40,000 سؤال مصنّف حسب الصف والوحدة ومستوى الصعوبة." },
      { title: "تقارير جاهزة للمشاركة", body: "تقارير أداء الطلاب بصيغة PDF تُرسل لولي الأمر أو الإدارة مباشرة." },
    ],
    location: "الرياض، المملكة العربية السعودية",
    website_url: "https://example.com/darris",
    cta_url: "https://example.com/darris/teachers",
    cta_label: "فعّل العرض الآن",
    logo_url: null,
    hero_image_url: null,
    featured: true,
    sort_order: 1,
    published: false,
  },
  {
    slug: "maharah-academy",
    name: "أكاديمية مهارة",
    tagline: "دورات معتمدة في التدريس الفعّال والتقويم بشهادات ساعات تطوير مهني.",
    category: "training",
    pricing: "paid",
    audience: ["المعلّمون الجدد", "قادة المدارس"],
    teacher_offer: "خصم 25% لأعضاء مجتمع الأستاذ",
    offer_code: "OSTATH25",
    offer_note: "يُدخل الرمز في صفحة الدفع. يشمل جميع الدورات المسجّلة ولا يشمل البرامج الحضورية.",
    overview:
      "أكاديمية تدريب مهني تقدّم مسارات قصيرة للمعلّم في إدارة الصف، والتقويم من أجل التعلّم، وتوظيف التقنية في التدريس، بشهادات إتمام تُحتسب ضمن ساعات التطوير المهني.",
    highlights: [
      { title: "مسارات قصيرة", body: "دورات من 4 إلى 8 ساعات يمكن إكمالها في أسبوع واحد." },
      { title: "شهادات معتمدة", body: "شهادة إتمام رقمية قابلة للتحقّق لكل مسار." },
      { title: "مدرّبون من الميدان", body: "يقدّم الدورات معلّمون وقادة مدارس ممارسون." },
    ],
    location: "جدة، المملكة العربية السعودية",
    website_url: "https://example.com/maharah",
    cta_url: null,
    cta_label: null,
    logo_url: null,
    hero_image_url: null,
    featured: false,
    sort_order: 2,
    published: false,
  },
  {
    slug: "awraq",
    name: "مكتبة أوراق",
    tagline: "تجهيزات الفصل والوسائل التعليمية تصل إلى مدرستك خلال 48 ساعة.",
    category: "supplies",
    pricing: "paid",
    audience: ["معلّمو المرحلة الابتدائية", "معلّمات رياض الأطفال"],
    teacher_offer: "شحن مجاني للمعلّمين للطلبات فوق 150 ريالاً",
    offer_code: null,
    offer_note: "يُطبَّق تلقائياً عند اختيار «حساب معلّم» أثناء التسجيل. داخل المملكة فقط.",
    overview:
      "متجر متخصّص في مستلزمات الفصل الدراسي: لوحات تعليمية، بطاقات، أدوات تنظيم، ووسائل تعليمية محسوسة، مع توصيل سريع لجميع مناطق المملكة وفواتير باسم المدرسة عند الطلب.",
    highlights: [
      { title: "توصيل خلال 48 ساعة", body: "لجميع المدن الرئيسية، مع تتبّع للطلب." },
      { title: "فواتير باسم المدرسة", body: "خيار الفوترة المؤسسية لتسهيل الصرف من ميزانية المدرسة." },
      { title: "حزم جاهزة للفصل", body: "حزم مجمّعة لبداية العام حسب المرحلة الدراسية." },
    ],
    location: "الدمام، المملكة العربية السعودية",
    website_url: "https://example.com/awraq",
    cta_url: "https://example.com/awraq/teachers",
    cta_label: "تسوّق بحساب معلّم",
    logo_url: null,
    hero_image_url: null,
    featured: false,
    sort_order: 3,
    published: false,
  },
  {
    slug: "hissati",
    name: "تطبيق حصّتي",
    tagline: "إدارة الحصّة والحضور والتواصل مع أولياء الأمور في تطبيقٍ واحد مجاني.",
    category: "edtech",
    pricing: "free",
    audience: ["جميع المراحل"],
    teacher_offer: null,
    offer_code: null,
    offer_note: null,
    overview:
      "تطبيق مجاني للمعلّم يجمع تسجيل الحضور، وتوزيع الواجبات، وإرسال الملاحظات لأولياء الأمور في واجهة عربية بسيطة تعمل على الجوال دون الحاجة إلى حاسب.",
    highlights: [
      { title: "حضور بضغطة", body: "تسجيل الحضور والتأخّر لكل حصّة في ثوانٍ." },
      { title: "تواصل موثّق", body: "رسائل لأولياء الأمور مع سجلّ يمكن الرجوع إليه." },
    ],
    location: "الرياض، المملكة العربية السعودية",
    website_url: "https://example.com/hissati",
    cta_url: null,
    cta_label: "حمّل التطبيق",
    logo_url: null,
    hero_image_url: null,
    featured: false,
    sort_order: 4,
    published: false,
  },
];

// ── SITE SETTINGS ────────────────────────────────────────────────────────────
const settings = [
  {
    key: "contact",
    value: {
      address: "طريق الأمير محمد بن عبدالعزيز، المعذر الشمالي، الرياض 12314",
      phone: "+966 55 075 7424",
      email: "contact@ostath.sa",
      instagram: "https://www.instagram.com/alostathorg/",
      linkedin: "https://www.linkedin.com/company/alostathorg",
      x: "https://x.com/AlOstathOrg",
      copyright: "جميع الحقوق محفوظة لمؤسسة الأستاذ 2026",
    },
  },
  {
    key: "council",
    value: {
      next_session: "2026-08-05T19:00:00+03:00",
      hero_image: `${FRAMER}/mCslxKkFLteZMFGp4F7hgasq1c.jpg?width=844&height=432`,
    },
  },
];

async function upsert(
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string,
) {
  const { error } = await db.from(table).upsert(rows as never, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table} (${rows.length})`);
}

async function main() {
  // Awards + their timeline phases (replace phases per award for idempotency).
  for (const { phases, ...a } of awards) {
    const { data, error } = await db
      .from("awards")
      .upsert(a, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) throw new Error(`awards ${a.slug}: ${error.message}`);
    await db.from("award_timeline_phases").delete().eq("award_id", data.id);
    await db.from("award_timeline_phases").insert(
      phases.map((p, i) => ({ ...p, award_id: data.id, sort_order: i + 1 })),
    );
    console.log(`✓ award ${a.slug} + ${phases.length} phases`);
  }

  await upsert("initiatives", initiatives, "slug");
  await upsert("blog_posts", posts, "slug");
  await upsert("press_assets", pressAssets.map((p) => ({ meta: {}, ...p })), "title");
  await upsert("partners", partners, "name");
  await upsert("site_settings", settings, "key");

  // Brand partner drafts: insert-if-missing only (see the note above the array).
  {
    const { error } = await db
      .from("brand_partners")
      .upsert(brandPartners as never, { onConflict: "slug", ignoreDuplicates: true });
    if (error) throw new Error(`brand_partners: ${error.message}`);
    console.log(`✓ brand_partners (${brandPartners.length} drafts, existing rows untouched)`);
  }

  console.log("\nSeed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
