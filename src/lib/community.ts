// مجتمع الأستاذ — option lists shared by the public join form, the admin
// filters, and the broadcast audience picker. One source of truth so a value
// saved by a teacher always matches what the team can segment on later.

export const REGIONS = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "القصيم",
  "الشرقية",
  "عسير",
  "تبوك",
  "حائل",
  "الحدود الشمالية",
  "جازان",
  "نجران",
  "الباحة",
  "الجوف",
] as const;

export const SCHOOL_STAGES = [
  "رياض الأطفال",
  "المرحلة الابتدائية",
  "المرحلة المتوسطة",
  "المرحلة الثانوية",
  "التعليم الجامعي",
  "التربية الخاصة والموهوبين",
  "أخرى",
] as const;

/** ما يودّ العضو متابعته — يُستخدم لاحقاً لتوجيه الرسائل للفئة المعنيّة فقط. */
export const INTERESTS = [
  "الجوائز",
  "المبادرات",
  "مجلس الأستاذ",
  "التطوير المهني",
  "البحث والدراسات",
  "الفعاليات واللقاءات",
] as const;

/** كيف يرغب العضو بالمساهمة. */
export const CONTRIBUTIONS = [
  "تقديم الأفكار",
  "تطوير المبادرات",
  "التطوّع في الفعاليات",
  "التحكيم في الجوائز",
  "تقديم ورش ودورات",
  "المشاركة في الاستبيانات",
] as const;

export const MEMBER_STATUS_LABEL: Record<string, string> = {
  active: "عضو فعّال",
  pending: "بانتظار المراجعة",
  unsubscribed: "ألغى الاشتراك",
  blocked: "محظور",
};

export const IDEA_STATUS_LABEL: Record<string, string> = {
  new: "جديدة",
  reviewing: "قيد المراجعة",
  accepted: "مقبولة",
  archived: "مؤرشفة",
};

export const BROADCAST_STATUS_LABEL: Record<string, string> = {
  draft: "مسودة",
  sending: "جارٍ الإرسال",
  sent: "أُرسلت",
  failed: "فشل الإرسال",
};

/** Arabic error text for the codes the SQL RPCs return. */
export const RPC_ERROR_LABEL: Record<string, string> = {
  name_required: "الرجاء إدخال الاسم الكامل.",
  email_invalid: "الرجاء إدخال بريد إلكتروني صحيح.",
  consent_required: "يجب الموافقة على الشروط للمتابعة.",
  content_required: "الرجاء كتابة عنوان الفكرة وتفاصيلها.",
  rate_limited: "تم استلام عدة طلبات متتالية — يرجى المحاولة بعد قليل.",
  not_found: "الرابط غير صالح أو انتهت صلاحيته.",
};

export function rpcErrorMessage(code: unknown): string {
  return RPC_ERROR_LABEL[String(code)] ?? "تعذّر إتمام العملية — يرجى المحاولة مرة أخرى.";
}

/**
 * Strips the characters PostgREST treats as syntax inside an `.or()` filter.
 * Without this, a search term containing a comma or a dot would be parsed as
 * additional filter clauses rather than as text to match.
 */
export function safeSearchTerm(raw: string): string {
  return raw.trim().replace(/[,.()"\\*:]/g, " ").replace(/\s+/g, " ").trim();
}
