// The foundation has one award — الجائزة الوطنية للمعلم (2026 detailed profile,
// القسم الثالث). It lives in code rather than in the `awards` table so the site
// can never show a list of awards again; /awards is its page, and the old
// /awards/[slug] URLs redirect there.

export const AWARD_PATH = "/awards";

export const NATIONAL_AWARD = {
  name: "الجائزة الوطنية للمعلّم",
  badge: "جائزة وطنية",
  status: "soon" as const,
  statusLabel: "التقديم يفتح قريباً",
  beneficiaries: "المعلّمون والمعلّمات الممارسون للتدريس",
  scope: "وطني عبر إدارات التعليم",
  tagline:
    "تقديرٌ يتحوّل إلى تمكين — جائزةٌ وطنية مستدامة تحتفي بالمعلّمين الممارسين للتدريس وتنقل أثرهم إلى الميدان.",
  overview:
    "تُمثّل الجائزة الوطنية للمعلّم أداةً استراتيجية لتعزيز مكانة مهنة التدريس في المجتمع، تتجاوز الاحتفاء السنوي بالمتميّزين، ويُقاس نجاحها بحجم الأثر الذي تُحدثه في المهنة ومكانتها لا بعدد المكرَّمين. تستهدف المعلّمين والمعلّمات الممارسين للتدريس حصراً في التعليم العام، وتعتمد التحقّق الميداني من ممارسة المعلّم وأثرها، وتتبنّاها مؤسسة الأستاذ في مرحلتها الحالية.",
  goal:
    "التعرّف على المعلّمين المتميّزين الذين يُحدثون أثراً ملموساً في تعلّم طلابهم، وتحويل تميّزهم إلى فرصٍ مهنية مستدامة، ونقل ممارساتهم إلى الميدان التعليمي للاستفادة والتطبيق.",
  image: "https://framerusercontent.com/images/5tFDyWZl3YM715jhXBbKzLNeJw.jpeg?width=1408&height=736",
};
