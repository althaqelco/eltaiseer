// src/lib/seo/editorial.ts
// تواريخ المحتوى التحريري لكل مسار: نُشر / آخر تعديل حقيقي للنص / آخر مراجعة.
// المصدر الوحيد لـ dateModified وlastmod في الصفحات الثابتة والمقالات (لا new Date() وقت العرض أبدًا).
// أي تعديل في نص صفحة هنا يرفع modified ويضيف سطرًا في src/content/changelog.ts. (spec-final A3.2)

import { cairoLocalToIso } from "./time";

export type EditorialDates = { published: string; modified: string; reviewed: string };

// التواريخ بتوقيت القاهرة «YYYY-MM-DD»
export const EDITORIAL: Record<string, EditorialDates> = {
  "/about/": { published: "2026-01-12", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/contact/": { published: "2026-01-12", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/careers/": { published: "2026-01-12", modified: "2026-01-12", reviewed: "2026-01-12" },
  "/cookies/": { published: "2026-01-12", modified: "2026-01-12", reviewed: "2026-01-12" },
  "/sitemap-page/": { published: "2026-01-12", modified: "2026-01-12", reviewed: "2026-01-12" },
  "/terms/": { published: "2026-01-12", modified: "2026-09-28", reviewed: "2026-09-28" },
  "/privacy/": { published: "2026-01-12", modified: "2026-09-28", reviewed: "2026-09-28" },
  "/valuation/": { published: "2026-01-12", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/blog/": { published: "2026-01-01", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/beit-al-watan-for-sale/": { published: "2026-09-28", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/beit-al-watan-for-sale/phase-11/": { published: "2026-09-28", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/beit-al-watan-for-sale/how-we-verify/": { published: "2026-09-28", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/beit-al-watan-for-sale/sell/": { published: "2026-09-28", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/beit-al-watan-for-sale/buy-request/": { published: "2026-09-28", modified: "2026-09-29", reviewed: "2026-09-29" },
  // صفحات تجمع إعلانات: dateModified من الإعلانات، وهذا لتاريخ مراجعة النص فقط
  "/": { published: "2026-01-01", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/prices/": { published: "2026-08-17", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/new-damietta/": { published: "2026-01-01", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/new-mansoura/": { published: "2026-01-01", modified: "2026-09-29", reviewed: "2026-09-29" },
  // المقالات: published = datePublished المنشور؛ modified = آخر تعديل فعلي للنص
  "/blog/buying-steps-legal/": { published: "2026-08-17", modified: "2026-08-17", reviewed: "2026-08-17" },
  "/blog/damietta-vs-mansoura/": { published: "2026-08-17", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/blog/buying-apartment-guide/": { published: "2026-01-15", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/blog/best-districts/": { published: "2026-01-10", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/blog/national-housing-projects/": { published: "2026-01-05", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/blog/investment-guide/": { published: "2026-01-01", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/blog/finishing-tips/": { published: "2026-01-28", modified: "2026-01-28", reviewed: "2026-01-28" },
  "/blog/new-mansoura-districts/": { published: "2026-01-17", modified: "2026-09-29", reviewed: "2026-09-29" },
  "/blog/new-mansoura-investment/": { published: "2026-01-17", modified: "2026-09-29", reviewed: "2026-09-29" },
};

export const BLOG_SLUGS = Object.keys(EDITORIAL)
  .filter((p) => p.startsWith("/blog/") && p !== "/blog/")
  .map((p) => p.slice("/blog/".length, -1));

/** تاريخ تحريري بصيغة ISO بإزاحة القاهرة (منتصف ليل اليوم المسجل)، أو undefined إن لم يُسجَّل المسار */
export function editorialIso(path: string, key: keyof EditorialDates): string | undefined {
  const e = EDITORIAL[path];
  return e ? cairoLocalToIso(`${e[key]} 00:00:00`) : undefined;
}
