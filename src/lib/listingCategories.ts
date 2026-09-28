// lib/listingCategories.ts
// ما تعرضه كل صفحة فئة تحت /properties/ بالضبط — مصدر واحد للصفحات وsitemap.xml
// (كانت قوائم الأنواع مكررة داخل كل page.tsx فلا يعرف الـ sitemap أي فئة فارغة)

import type { Property } from "./types";

export const SOLD_STATUS = "تم البيع";

export function isAvailable(p: Property): boolean {
  return p.status !== SOLD_STATUS;
}

export const TYPE_CATEGORY_SLUGS = ["apartments", "villas", "lands", "shops", "clinics", "chalets"] as const;
export type TypeCategorySlug = (typeof TYPE_CATEGORY_SLUGS)[number];

export const CATEGORY_SLUGS = [...TYPE_CATEGORY_SLUGS, "installments"] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_TYPES: Record<TypeCategorySlug, readonly string[]> = {
  apartments: ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس", "روف"],
  villas: ["فيلا منفصلة", "تاون هاوس", "توين هاوس"],
  lands: ["أرض"],
  shops: ["محل تجاري", "مقر إداري", "مكتب"],
  clinics: ["عيادة"],
  chalets: ["شاليه"],
};

// قائمة الصفحة كما تُعرض: فئات الأنواع تعرض المباع أيضاً (كما كانت)، والتقسيط يستبعده
export function categoryProperties(all: Property[], slug: CategorySlug): Property[] {
  if (slug === "installments") {
    return all.filter((p) => p.payment?.type !== "كاش" && isAvailable(p));
  }
  const types = CATEGORY_TYPES[slug];
  return all.filter((p) => types.includes(p.type));
}
