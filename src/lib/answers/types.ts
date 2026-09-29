// src/lib/answers/types.ts
// نموذج الإجابة المفهرسة برقم السؤال: نص الصفحة وFAQPage في JSON-LD وملفات llms تُبنى من نفس المصدر
// فلا تنحرف عن بعضها. مكوّنات الخادم فقط — لا يُستورد من أي ملف "use client". (spec-final A2.0 / B5)

import type { PriceStats } from "../seo/prices";

export type InstallmentFacts = { k: number; maxYears: number | null; minDown: number | null };

/** بيانات الصفحة المحسوبة على الخادم؛ كل حقل اختياري والإجابة ترجع null إن نقصها ما تحتاجه */
export type PageData = {
  prices?: PriceStats;
  /** ISO — أحدث تغيير في الإعلانات المعنية */
  dataModified?: string | null;
  installments?: Record<string, InstallmentFacts>;
  ndDistrictCount?: number;
  /** عدد العروض النشطة لكل مدينة في الصفحة المعنية (مثل الأراضي في /properties/lands/) */
  counts?: Record<string, number>;
};

export type Answer = {
  /** رقم السؤال في questions.json (Q…) أو M-… لأسئلة الموقع الرئيسي وحده */
  id: string;
  q: string;
  /**
   * النص المرئي. الفقرات تفصلها "\n\n"، والفقرة الأولى وحدها هي acceptedAnswer (≤ 300 حرف).
   * روابط بصيغة [النص](/مسار/) تُعرض روابط في HTML وتُحذف (يبقى النص) في JSON-LD وllms.
   * null = البيانات ناقصة → لا شيء يُعرض ولا JSON-LD.
   */
  a: (d: PageData) => string | null;
  sources: string[];
  /** pending = [VERIFY] أو قرار مالك مفتوح → لا يُعرض أبدًا */
  status: "verified" | "pending";
  /** المسار المالك بشرطة أخيرة؛ السؤال وإجابته لا يظهران إلا عليه (غيره: رابط تشويقي فقط) */
  owner: string;
  /** معرّف العنصر في الصفحة (جزء الرابط في questions.json يغلب) */
  anchor?: string;
  /** false = يظهر في الصفحة بلا Question في FAQPage */
  faq?: boolean;
};

export type RenderedAnswer = {
  id: string;
  q: string;
  a: string;
  sources: string[];
  anchor?: string;
  faq: boolean;
};
