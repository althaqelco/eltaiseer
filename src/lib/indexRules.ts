// lib/indexRules.ts
// قاعدة فهرسة صفحات القوائم في الموقع الرئيسي (أحياء /{city}/{district}/ وفئات /properties/{category}/)
//
// - صفحة بلا أي عرض متاح (غير مباع) = robots noindex,follow، وتُحذف من sitemap.xml
// - استثناء الأحياء فقط: حي له دليل تحريري فريد لا يقل عن 250 كلمة في districtContent.ts
//   يبقى قابلاً للفهرسة وفي الخريطة حتى بلا عروض (محتواه قائم بذاته)
// - فئة بلا عروض: noindex وخارج الخريطة دائماً (لا استثناء)
// - العدّ يُحسب من نفس بيانات الخادم التي تعرضها الصفحة (getPropertiesServerResult)،
//   فمع ISR كل 300 ث تعود الصفحة للفهرسة وللخريطة تلقائياً مع أول عرض متاح
// - إن فشل جلب Firestore لا تُطبق القاعدة (تبقى الصفحة index وفي الخريطة) حتى لا يُسقط خطأ مؤقت صفحات حقيقية

import { DISTRICT_EDITORIAL } from "./districtContent";

export const MIN_EDITORIAL_WORDS = 250;

function countWords(value: unknown): number {
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(value)) return value.reduce((n: number, v) => n + countWords(v), 0);
  if (value && typeof value === "object") {
    return Object.values(value).reduce((n: number, v) => n + countWords(v), 0);
  }
  return 0;
}

// كل نصوص الدليل التحريري للحي (المقدمة والوسوم وأي أقسام تُضاف لاحقاً)
export function districtEditorialWords(slug: string): number {
  const editorial = DISTRICT_EDITORIAL[slug];
  return editorial ? countWords(editorial) : 0;
}

export function isDistrictIndexable(slug: string, availableCount: number): boolean {
  return availableCount > 0 || districtEditorialWords(slug) >= MIN_EDITORIAL_WORDS;
}

export function isCategoryIndexable(availableCount: number): boolean {
  return availableCount > 0;
}

export const NOINDEX_FOLLOW = { index: false, follow: true } as const;
