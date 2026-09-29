// src/lib/seo/owner-flags.ts
// قرارات المالك المعلّقة (spec-final Part D). كل مفتاح هنا مطفأ حتى يرد المالك كتابيًا: المحتوى المرتبط
// به لا يُعرض، ولا يدخل JSON-LD، ولا ملفات llms. تشغيل أي مفتاح = تعديل هنا + ما يذكره تعليقه، في commit مستقل.
// نقي بلا استيراد (يستخدمه test:seo).

/**
 * [OWNER D17] اسم الموقع في جوجل: «التيسير» (المقترح، ومعه og:site_name «التيسير») أم «التيسير للعقارات» (الحالي).
 * التشغيل: اجعله true، وغيّر name/alternateName لعقدة #website في schema-registry.json، ثم حدّث بصمة السجل في الاختبار.
 */
export const D17_SHORT_SITE_NAME = false;
export const SITE_NAME = D17_SHORT_SITE_NAME ? "التيسير" : "التيسير للعقارات";

/**
 * [OWNER D19 — PLAN CHANGE] inLanguage «ar-EG» بدل «ar» المعتمد في الخطة (seo_final §8.5).
 * مطفأ: كل عقد JSON-LD بـ «ar». كراسة الهيئة (#handbook-phase-11) تبقى «ar» في كل الأحوال.
 */
export const D19_IN_LANGUAGE_AR_EG = false;
export const IN_LANGUAGE = D19_IN_LANGUAGE_AR_EG ? "ar-EG" : "ar";

/**
 * [OWNER D11] عنوان المكتب ودبوسه والرمز البريدي وسنة التأسيس وحسابات يوتيوب/إكس/لينكدإن وعدد الموظفين.
 * null = لا geo ولا hasMap ولا postalCode ولا foundingDate في JSON-LD، ولا «سنوات خبرة» في الصفحة.
 * الإحداثيات القديمة 31.4175, 31.8144 / 34511 تشير إلى دمياط القديمة فحُذفت.
 */
export const D11_OFFICE: null | {
  streetAddress: string;
  postalCode?: string;
  geo?: { latitude: number; longitude: number };
  hasMap?: string;
  foundingDate?: string;
  extraSameAs?: string[];
} = null;

/** [OWNER D16] هل الوسيط «offeredBy» في عرض إعلان إعادة البيع؟ مطفأ: البائع الفرد هو البائع، فلا offeredBy. */
export const D16_BROKER_AS_OFFERER = false;

/**
 * [OWNER D8] عدد «محجوز» الصريح لمدينة أقل من 15 حجزًا. مطفأ: لا يُعرض رقم محجوز أقل من BOOKED_MIN_DISPLAY
 * (والأرقام المشتقة — نسب وفروق نوافذ وسرعة نفاد — تحتاج 15 حجزًا في نطاقها دائمًا، ليست جزءًا من هذا القرار).
 */
export const D8_SHOW_BOOKED_UNDER_15 = false;
export const BOOKED_MIN_DISPLAY = D8_SHOW_BOOKED_UNDER_15 ? 0 : 15;

/**
 * [OWNER D3 / D13] نموذج الربح (من يدفع للترتيب الذكي)، وصياغة عمولة الوساطة، ومدة تصحيح الأخطاء.
 * مطفأ: فقرة «كيف تربح التيسير؟» في /about/ معلّقة، ولا رقم لمدة التصحيح. (خارج صفحات هذه الحزمة؛ WP-09)
 */
export const D3_BUSINESS_MODEL_APPROVED = false;
export const D13_CORRECTIONS_TURNAROUND: string | null = null;

/** [OWNER D5 / D6 — PLAN CHANGE] ملفات البيانات المفتوحة وتقرير شهري. مطفأ (robots بلا Allow لـ /baitelwatan/data/). */
export const D5_OPEN_DATA_LIVE = false;
export const D6_MONTHLY_REPORT_LIVE = false;

/** [OWNER D18 — PLAN CHANGE] live.json من KV للأرقام الحية. مطفأ: لا مستهلك جديد لـ getBwLive، ولا أرقام حية في llms. */
export const D18_LIVE_JSON = false;
