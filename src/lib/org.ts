// Foundation facts from the 2026 detailed profile (الملف التعريفي المفصّل), shared
// by the home page, «من نحن» and the footer so one edit updates every surface.

const FR = "https://framerusercontent.com/images";

export type Person = { name: string; role: string; img?: string };

/** مجلس الأمناء — profile order. A member without a photo gets a monogram. */
export const BOARD: Person[] = [
  { name: "د. عبدالإله بن عثمان الصالح", role: "رئيس مجلس الأمناء والمشرف التنفيذي", img: `${FR}/j0X0zJyXfEroP129Xo0aCS03jtA.jpeg?width=213&height=228` },
  { name: "د. خالد العواد", role: "عضو رئيسي", img: `${FR}/NMoq9rbaVdr8bBZzseUNUpJIws.png?width=374&height=410` },
  { name: "د. زياد الدريس", role: "عضو رئيسي", img: `${FR}/m74hlEDKVe2RKWKLIMtvUKWhc.png?width=512&height=512` },
  { name: "م. سامي الحصيّن", role: "عضو رئيسي", img: `${FR}/910EvdMGyQXgtbyN7rLmXIXR5eU.png?width=435&height=440` },
];

/** فريق الأستاذ */
export const TEAM: string[] = [
  "د. سلطان الحربي",
  "أ. متعب الرشيد",
  "أ. منيف العنزي",
  "م. سالم باوزير",
  "د. فيصل الحمود",
  "أ. عبدالرحمن بامقدم",
];

/** شركاء النجاح */
export const PARTNERS: string[] = [
  "وزارة التعليم",
  "المعهد الوطني للتطوير المهني التعليمي",
  "مدارس دلتا",
  "مدارس الرواد العالمية",
  "شركة شبه الجزيرة",
];

/** لماذا الأستاذ؟ — حجم غير مسبوق */
export const SCALE = [
  { n: "500", u: "ألف معلّم ومعلّمة", d: "أكبر قوة مهنية من نوعها في المملكة" },
  { n: "8", u: "ملايين طالب وطالبة", d: "يمتد إليهم أثر المعلّم مباشرة" },
  { n: "33", u: "ألف مدرسة", d: "في مختلف مناطق المملكة" },
  { n: "1:1000", u: "نسبة تأثير المعلّم", d: "تقريباً على الطالب", accent: true },
];

/** بيانات الترخيص */
export const LICENSE = [
  { k: "اسم المنظمة", v: "مؤسسة الأستاذ" },
  { k: "نوع المنظمة", v: "مؤسسة أهلية" },
  { k: "جهة الإشراف", v: "وزارة التعليم" },
  { k: "التصنيف", v: "التعليم والأبحاث: المجموعة الثانية" },
  { k: "الرقم الوطني الموحد", v: "7040377488", mono: true },
  { k: "رقم الترخيص", v: "1100509000", mono: true },
  { k: "تاريخ الترخيص", v: "2024/04/20", mono: true },
  { k: "ساري حتى", v: "2028/04/19", mono: true },
];

export const LICENSE_LINE = "مؤسسة أهلية سعودية غير ربحية · مرخّصة من المركز الوطني لتنمية القطاع غير الربحي · رقم الترخيص 1100509000";

export function monogram(name: string) {
  return name.replace(/^(د|م|أ)\.\s*/, "").trim().charAt(0);
}
