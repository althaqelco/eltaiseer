// src/content/corrections.ts
// سجل التصحيحات العام الوحيد للموقعين (يُعرض في /about/#corrections-log؛ صفحة المنصة /baitelwatan/about/ تحيل إليه).
// تصحيح = رقم أو ادعاء كان خاطئًا أو قديمًا أو بلا مصدر ثم صُحّح. التاريخ بتوقيت القاهرة «YYYY-MM-DD» = يوم نشر التصحيح.
// كل سطر هنا يقابله سطر في src/content/changelog.ts ورفع modified للصفحة في src/lib/seo/editorial.ts. (spec-final A2.7)

export type Correction = { date: string; page: string; what: string; why: string };

export const CORRECTIONS: Correction[] = [
  {
    date: "2026-09-29",
    page: "الموقع وملفا llms.txt",
    what: "حذفنا من الموقع وملفات llms عبارات عن عوائد ونمو أسعار متوقعة، وأعدنا حساب جدول الأسعار بالوسيط لكل حي ونوع عقار.",
    why: "العبارات ليست حقائق موثقة، والمتوسط البسيط القديم خلط أنواع العقارات وأظهر قيمًا شاذة.",
  },
  {
    date: "2026-09-29",
    page: "/about/",
    what: "حذفنا أرقامًا ثابتة عن عدد العقارات والمناطق وسنوات الخبرة والعملاء، وحلّت محلها أرقام محسوبة من العروض الحالية.",
    why: "أرقام لا يمكن التحقق منها ولم تعد محدثة.",
  },
];
