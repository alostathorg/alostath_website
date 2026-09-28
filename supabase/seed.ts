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
// From the 2026 detailed profile (القسم الثالث · الجائزة الوطنية للمعلم). The
// profile's benchmarking, reward structure, governance and funding sections are
// set on /awards itself; this row is what the CMS edits.
const awards = [
  {
    slug: "national-teacher-award",
    name: "الجائزة الوطنية للمعلّم",
    tagline: "تقديرٌ يتحوّل إلى تمكين — جائزةٌ وطنية مستدامة تحتفي بالمعلّمين الممارسين للتدريس وتنقل أثرهم إلى الميدان.",
    type: "جائزة وطنية",
    badge_label: "جائزة وطنية",
    beneficiaries: "المعلّمون والمعلّمات الممارسون للتدريس",
    status: "soon",
    theme: "gold",
    overview:
      "تُمثّل الجائزة الوطنية للمعلّم أداةً استراتيجية لتعزيز مكانة مهنة التدريس في المجتمع، تتجاوز الاحتفاء السنوي بالمتميّزين، ويُقاس نجاحها بحجم الأثر الذي تُحدثه في المهنة ومكانتها لا بعدد المكرَّمين. تستهدف المعلّمين والمعلّمات الممارسين للتدريس حصراً في التعليم العام عبر إدارات التعليم، وتعتمد التحقّق الميداني من ممارسة المعلّم وأثرها، وتتبنّاها مؤسسة الأستاذ في مرحلتها الحالية.",
    goal:
      "التعرّف على المعلّمين المتميّزين الذين يُحدثون أثراً ملموساً في تعلّم طلابهم، وتحويل تميّزهم إلى فرصٍ مهنية مستدامة، ونقل ممارساتهم إلى الميدان التعليمي للاستفادة والتطبيق.",
    categories: [],
    steps: [],
    hero_image_url: `${FRAMER}/5tFDyWZl3YM715jhXBbKzLNeJw.jpeg?width=1408&height=736`,
    partnership_note:
      "أعدّت شركة تام للتطوير الدراسة المعيارية والإطار المرجعي للجائزة، بالتنسيق مع المعهد الوطني للتطوير المهني التعليمي ومؤسسة الأستاذ.",
    sort_order: 1,
    phases: [] as { label: string; date_text: string; state: string; tag_text?: string }[],
  },
];

// Programmes the 2026 profile no longer lists. They are unpublished, never
// deleted, so the team can restore one from the dashboard with the منشور toggle.
const retiredAwards = ["resha", "qissa"];
const retiredInitiatives = ["wathba", "musheer"];

// ── INITIATIVES ──────────────────────────────────────────────────────────────
// القسم الرابع (مبادرات الأستاذ) plus the two content platforms of القسم الثاني
// (يوميات معلم، بودكاست حديث الأستاذ). مجلس الأستاذ keeps its own page.
const initiatives = [
  {
    slug: "nasiyah",
    name: "مبادرة ناصية",
    tagline: "من الفصل الدراسي إلى واجهة المشهد الوطني — المعلّم سفيراً ثقافياً مدرَّباً في الفعاليات الكبرى.",
    badge: "مبادرة وطنية",
    theme: "gold",
    overview:
      "تؤهّل ناصية المعلّمين والمعلّمات ليكونوا سفراء ثقافيين مدرَّبين في الفعاليات الكبرى التي تستضيفها المملكة. فالفعاليات الكبرى تنمو بسرعة هائلة، ولا يوجد سوقٌ منظّم لكفاءات الضيافة، وشركات الفعاليات تتخبّط في التوظيف المؤقت؛ إذ يحتاج إكسبو 2030 وحده إلى 25,000 مضيف، والمتاح اليوم 2,000 مدرّب فقط. وتمضي خارطة الطريق من انطلاق التطوير في يوليو 2026، وإطلاق المنصة في مارس 2027، وتأهيل أول 10,000 معلّم خلال 2027—2028، وصولاً إلى 25,000 سفير في إكسبو 2030، ثم كأس العالم 2034 كمؤسسة دائمة راسخة.",
    goal:
      "سدّ فجوةٍ تبلغ 23,000 كفاءة غير موجودة؛ فتفعيل 5% فقط من أكثر من 500,000 معلّم — أكبر قوى عاملة مهنية من نوعها — يخلق 25,000 سفير مدرَّب، بحجمٍ لا تستطيع أي مهنة أخرى مجاراته، وبارتباطٍ مباشر بالركائز الثلاث لرؤية المملكة 2030.",
    facts: [
      { k: "النوع", v: "مبادرة وطنية" },
      { k: "المجال", v: "الضيافة والفعاليات الكبرى" },
      { k: "المستهدف", v: "25,000 سفير بحلول 2030" },
    ],
    value_cards: [
      { title: "الثقة والعمق الثقافي", body: "من أكثر المهنيين ثقةً في المجتمع السعودي، بمعرفة عميقة بالتراث الوطني والقيم الإسلامية والتنوّع الإقليمي، ما يجعلهم مفسّرين ثقافيين طبيعيين للزوار الدوليين." },
      { title: "التواصل والقيادة", body: "الخبرة اليومية في الفصول تصقل الخطابة العامة وإدارة الحشود وشرح المواضيع المعقّدة ببساطة والتكيّف مع جماهير متنوعة." },
      { title: "الحجم والاستدامة", body: "أكبر قوى عاملة مهنية من نوعها؛ وتفعيل نسبة صغيرة منها يصنع حجماً مستداماً من السفراء المدرَّبين." },
    ],
    steps: [
      { title: "سفير معتمد · 172 ساعة", body: "مؤهّل للفعاليات متوسطة الحجم والمهرجانات الموسمية وأدوار الضيافة." },
      { title: "مرشد أول · +80 ساعة", body: "أدوار قيادية واستقبال كبار الشخصيات وتنسيق الفرق." },
      { title: "سفير خبير · +120 ساعة", body: "إكسبو 2030 وكأس العالم 2034 والتمثيل الدولي وإدارة الأزمات." },
    ],
    partners: ["وزارة التعليم", "وزارة السياحة", "منظّمو الفعاليات", "القطاع الخاص"],
    hero_image_url: `${FRAMER}/v1dJdT3sKhUDYCR574juSpMYW4.jpg?width=1600&height=720`,
    logo_url: null,
    sort_order: 1,
  },
  {
    slug: "itahadak-madaris",
    name: "مبادرة اتحداك مدارس",
    tagline: "صحّة الطالب تبدأ من معلّم التربية البدنية — تحدّياتٌ رقمية تبني عاداتٍ يومية قابلة للقياس.",
    badge: "منصة رقمية مدرسية",
    theme: "sage",
    overview:
      "تقدّم منصة أتحداك — منصة تقنية سعودية متخصصة في تطوير حلول رقمية تعزّز الصحة والنشاط البدني بما يتماشى مع مستهدفات رؤية 2030 — نظاماً متكاملاً يربط بين معلّمي ومعلّمات التربية البدنية والطلاب وأولياء الأمور عبر تحدّيات تفاعلية محفّزة، تُمكّن المدارس من قياس مستوى النشاط البدني وبناء عادات صحية يومية بطريقة عملية وقابلة للمتابعة والتحليل. وتأتي المبادرة في سياقٍ صحي واضح: 8 ملايين في المملكة دون سن 18 عاماً، و18% فقط من الأطفال يحققون الحد الأدنى من النشاط البدني اليومي (60 دقيقة)، وطفلٌ من كل ثلاثة يعاني السمنة المفرطة، فيما تعود 45% من إجمالي الوفيات إلى أمراض القلب والأوعية الدموية.",
    goal:
      "تمكين معلّم التربية البدنية من رفع مستوى التفاعل البدني للطلاب والطالبات، وتفعيل مادة الرياضة البدنية، وقياس التتبّع والنتائج قبل وبعد.",
    facts: [
      { k: "النوع", v: "منصة رقمية مدرسية" },
      { k: "المجال", v: "الصحة والنشاط البدني" },
      { k: "الشريك المنفّذ", v: "منصة أتحداك" },
    ],
    value_cards: [
      { title: "علامة تجارية مخصصة", body: "تطبيق White-label بهوية المؤسسة وألوانها." },
      { title: "نظام تحدّيات ونقاط", body: "لوحات متصدّرين لتعزيز التفاعل والتحفيز." },
      { title: "تدريب بالذكاء الاصطناعي", body: "يصحّح الأداء في الوقت الفعلي عبر كاميرا الجوال: أخضر للأداء الصحيح، أحمر للتصحيح." },
      { title: "ربط بالأجهزة الذكية", body: "الأجهزة القابلة للارتداء ومنصات الصحة الرقمية." },
    ],
    steps: [
      { title: "تفعيل النظام", body: "ورشة عمل لمعلّمي التربية البدنية، وإنشاء حسابات المدرسة والصفوف، وتسجيل الطلاب في التطبيق، وقياس المؤشرات المبدئية للياقة." },
      { title: "تشغيل النظام", body: "أداء التمارين اليومية داخل الحصص وخارجها، ومتابعة الالتزام وجمع النقاط، وإطلاق التحدّيات بين الصفوف مع تقارير أسبوعية للمعلّم." },
      { title: "قياس الأثر", body: "مقارنة مؤشرات اللياقة والنشاط قبل التطبيق وبعده، وتقرير أثر للمدرسة والإدارة، وتحديد المتفوّقين والمواهب لتكريمهم وتوجيههم." },
    ],
    partners: ["منصة أتحداك"],
    hero_image_url: `${FRAMER}/GQFfJ4TINOZjZebXiIyGjLKlaI.jpg?width=1600&height=720`,
    logo_url: null,
    sort_order: 2,
  },
  {
    slug: "teachers-cooperative",
    name: "الجمعية التعاونية للمعلّمين",
    tagline: "كيانٌ تعاوني يشارك المعلّمون في ملكيته وإدارته — لاستقرارٍ وظيفي ورفاهٍ معيشي أفضل.",
    badge: "نموذج تعاوني",
    theme: "gold",
    overview:
      "الجمعية التعاونية للمعلّمين كيانٌ مؤسسي مهني غير ربحي يُدار وفق مبادئ الاقتصاد التعاوني، يهدف إلى تنظيم جهود المعلّمين في إطارٍ جماعي يدمج بين الدعم الاقتصادي والخدمات المهنية والاجتماعية، بما يسهم في تعزيز الاستقرار الوظيفي والرفاه المعيشي لهم، ورفع كفاءتهم المهنية بوصفهم أحد أهم ركائز المنظومة التعليمية والتنموية. وتمثّل الجمعية مشروعاً وطنياً استراتيجياً يسهم في تحقيق مستهدفات التنمية المستدامة من خلال تمكين المعلّم اقتصادياً ومهنياً.",
    goal:
      "أن تصبح الجمعية التعاونية للمعلّمين منصةً رائدة وفاعلة في تمكين المعلّمين بالمملكة، تسهم في تعزيز كفاءتهم المهنية وجودة حياتهم، وتشكّل نموذجاً مستداماً للتكامل بين البعدين الاقتصادي والاجتماعي للعمل التعليمي.",
    facts: [
      { k: "النوع", v: "جمعية تعاونية مهنية" },
      { k: "المجال", v: "الاستقرار الاقتصادي والمعيشي" },
      { k: "النموذج", v: "غير ربحي وفق مبادئ الاقتصاد التعاوني" },
    ],
    value_cards: [
      { title: "العدالة الاجتماعية", body: "تكافؤ الفرص في الاستفادة من خدمات الجمعية." },
      { title: "المساءلة والشفافية", body: "أعلى معايير الحوكمة والتقارير المالية المفتوحة." },
      { title: "التمكين", body: "تعزيز القدرات المهنية والمادية للمعلّم." },
      { title: "الاستدامة", body: "نموذج اقتصادي تشاركي طويل الأمد." },
      { title: "الانتماء", body: "مجتمع مهني متماسك يقوم على التعاون والاحترام المتبادل." },
    ],
    steps: [
      { title: "المشاركة الطوعية", body: "ينضمّ المعلّمون أعضاءً في الجمعية بمحض إرادتهم." },
      { title: "الملكية والإدارة المشتركة", body: "يشارك الأعضاء في ملكية الجمعية وإدارتها." },
      { title: "القرار الجماعي", body: "يُتّخذ القرار وفق أسس الحوكمة الرشيدة والمشاركة المجتمعية." },
      { title: "توجيه الفوائض", body: "تُوجَّه الفوائض الاقتصادية نحو تحسين جودة الخدمات المقدّمة للأعضاء." },
    ],
    partners: [],
    hero_image_url: null,
    logo_url: null,
    sort_order: 3,
  },
  {
    slug: "yawmiyat-muallim",
    name: "يوميات معلّم",
    tagline: "قصصٌ إنسانية حقيقية من قلب الميدان التعليمي — تنقل صوت المعلّم إلى جمهورٍ أوسع من حدود الفصل.",
    badge: "منصة حضور ومحتوى",
    theme: "sage",
    overview:
      "مبادرة محتوى إعلامي شاملة تهدف إلى الاحتفاء بأثر المعلّم عبر أعمال متعددة الصيغ (وثائقية، درامية، حوارية رقمية)، تُبرز قصصاً إنسانية حقيقية من قلب الميدان التعليمي، وتنقل صوت المعلّم إلى جمهورٍ أوسع من حدود الفصل الدراسي. ويستند المشروع إلى أساسٍ بحثي حلّل 55 عملاً سينمائياً ودرامياً ووثائقياً على مدى زمني من 1939 إلى 2026، لم تتجاوز حصة المحتوى العربي والخليجي منها 18%.",
    goal:
      "إعادة تشكيل صورة المعلّم في الوجدان العام: المعلّم صانعاً للأثر، والتعليم أداةً للتغيير، والمعلّم قدوةً أخلاقية بدورٍ تربوي وإنساني يتجاوز نقل المعرفة.",
    facts: [
      { k: "النوع", v: "مبادرة محتوى إعلامي" },
      { k: "الصيغ", v: "وثائقية · درامية · حوارية رقمية" },
      { k: "الأساس البحثي", v: "55 عملاً (1939—2026)" },
    ],
    value_cards: [
      { title: "التكريم والإلهام", body: "المعلّم كصانع أثر." },
      { title: "الإصلاح والمساواة", body: "التعليم كأداة للتغيير." },
      { title: "المعلّم كقدوة أخلاقية", body: "دورٌ تربوي وإنساني يتجاوز نقل المعرفة." },
    ],
    steps: [
      { title: "برامج وثائقية قصيرة", body: "أعمال قصيرة توثّق قصص المعلّمين في الميدان." },
      { title: "مسلسل درامي بحلقات منفصلة", body: "كل حلقة قصة إنسانية مستقلة يجمعها وجود معلّم في قلبها." },
      { title: "برنامج رقمي حواري واقعي", body: "يُصوَّر داخل غرف معلّمين حقيقية، بأسئلة تأملية عن التجربة الإنسانية للمهنة: الطالب الذي لا يُنسى، اليوم الذي كاد يُستقال بعده، الجملة التي يُندم عليها." },
    ],
    partners: [],
    hero_image_url: null,
    logo_url: null,
    sort_order: 4,
  },
  {
    slug: "hadith-alostath",
    name: "بودكاست حديث الأستاذ",
    tagline: "حوارٌ مسموع ومرئي يرسّخ صورة المعلّم قيمةً وطنية جديرة بالتقدير والاحتفاء.",
    badge: "منصة حضور ومحتوى",
    theme: "gold",
    overview:
      "بودكاست يستضيف المعلّمين والمعلّمات المتميّزين، والأكاديميين المتخصصين من التربويين والباحثين وخبراء المناهج، وصنّاع المحتوى المعلّمين المؤثّرين، والقادة والمسؤولين في القطاع التعليمي. يُبثّ عبر Apple Podcasts وSpotify وAnghami، مع نسخة مرئية على YouTube ومقاطع تسويقية قصيرة لمنصات التواصل الاجتماعي.",
    goal:
      "تعزيز الحضور المجتمعي والثقافي للمعلّم عبر منصات المحتوى الصوتي والمرئي، وترسيخ صورته في الوجدان العام بوصفه قيمةً وطنية جديرة بالتقدير والاحتفاء.",
    facts: [
      { k: "النوع", v: "بودكاست صوتي ومرئي" },
      { k: "قنوات البث", v: "Apple Podcasts · Spotify · Anghami · YouTube" },
      { k: "الضيوف", v: "4 فئات من الميدان التعليمي" },
    ],
    value_cards: [
      { title: "توثيق قصير", body: "توثيق قصير لحلقات مختارة." },
      { title: "فقرة «لقاء الأثر»", body: "مع شخصيات بارزة تستعيد قصتها مع معلّم أثّر بها." },
      { title: "حملة رقمية مصاحبة", body: "لكل حلقة، توظّف مقاطع قصيرة على منصات التواصل." },
    ],
    steps: [],
    partners: [],
    hero_image_url: null,
    logo_url: null,
    sort_order: 5,
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
      "والنتيجة ليست توصياتٍ على الورق فحسب، بل قناة تواصلٍ مباشرة ومنتظمة بين صنّاع القرار التعليمي والمعلّمين أنفسهم، ومبادراتٌ فعلية تنشأ من رحم هذه الجلسات الحوارية.",
    ],
  },
];

// ── PRESS ASSETS ─────────────────────────────────────────────────────────────
const pressAssets = [
  { title: "الشعار الأساسي", kind: "logo", description: "للاستخدام على الخلفيات الفاتحة.", file_url: "/assets/alostath-logo.png", sort_order: 1 },
  { title: "الشعار المعكوس", kind: "logo", description: "للاستخدام على الخلفيات الداكنة والصور.", file_url: "/assets/alostath-logo-inverse.png", sort_order: 2 },
  { title: "الملف التعريفي", kind: "pdf", description: "الملف التعريفي المفصّل لمؤسسة الأستاذ.", file_url: "/assets/alostath-profile.pdf", sort_order: 3 },
  { title: "الزيتوني الداكن", kind: "color", description: null, meta: { hex: "#1E2814" }, sort_order: 10 },
  { title: "الزيتوني", kind: "color", description: null, meta: { hex: "#4E5B30" }, sort_order: 11 },
  { title: "الذهبي", kind: "color", description: null, meta: { hex: "#BF9B2F" }, sort_order: 12 },
  { title: "المريمي", kind: "color", description: null, meta: { hex: "#78A183" }, sort_order: 13 },
  { title: "العاجي الفاتح", kind: "color", description: null, meta: { hex: "#F4F6EE" }, sort_order: 14 },
  { title: "الحبر", kind: "color", description: null, meta: { hex: "#23271A" }, sort_order: 15 },
];

// ── PARTNERS ─────────────────────────────────────────────────────────────────
// «شركاء النجاح» in the 2026 profile. Upsert only: rows for partners the
// profile no longer lists are left for the team to remove.
const partners = [
  { name: "وزارة التعليم", logo_url: null, sort_order: 1 },
  { name: "المعهد الوطني للتطوير المهني التعليمي", logo_url: null, sort_order: 2 },
  { name: "مدارس دلتا", logo_url: null, sort_order: 3 },
  { name: "مدارس الرواد العالمية", logo_url: null, sort_order: 4 },
  { name: "شركة شبه الجزيرة", logo_url: null, sort_order: 5 },
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
    if (phases.length) {
      await db.from("award_timeline_phases").insert(
        phases.map((p, i) => ({ ...p, award_id: data.id, sort_order: i + 1 })),
      );
    }
    console.log(`✓ award ${a.slug} + ${phases.length} phases`);
  }

  await upsert("initiatives", initiatives, "slug");

  // Unpublish (never delete) programmes the current profile dropped.
  for (const [table, slugs] of [
    ["awards", retiredAwards],
    ["initiatives", retiredInitiatives],
  ] as const) {
    const { error } = await db.from(table).update({ published: false }).in("slug", [...slugs]);
    if (error) throw new Error(`${table} retire: ${error.message}`);
    console.log(`✓ ${table}: unpublished ${slugs.join(", ")}`);
  }
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
