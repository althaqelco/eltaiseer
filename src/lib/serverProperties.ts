// lib/serverProperties.ts
// جلب العقارات من جهة الخادم لصفحات القوائم — حتى ترى محركات البحث
// ووكلاء الذكاء الاصطناعي العقارات في HTML مباشرة بدل صفحات فارغة

import { cache } from "react";
import { getPropertiesFromFirestore } from "./firestoreProperties";
import { getPropertyUrl } from "./districtSlugs";
import type { Property } from "./mockData";

const BASE_URL = "https://eltaiseer.com";

// cache() يوحّد الجلب داخل الطلب الواحد (metadata + الصفحة + الـ schema)
export const getPropertiesServer = cache(async (): Promise<Property[]> => {
  try {
    return await getPropertiesFromFirestore();
  } catch {
    return [];
  }
});

// تحويل لكائنات قابلة للتمرير من Server Component إلى Client Component
export function serializeProperties(properties: Property[]): Property[] {
  return JSON.parse(JSON.stringify(properties)) as Property[];
}

export function filterByCity(properties: Property[], cityId: string): Property[] {
  return properties.filter(
    (p) => (p.location.cityId || "new-damietta") === cityId
  );
}

// مطابقة تامة لاسم الحي — المطابقة الضبابية السابقة كانت تخلط
// "الحي الأول" مع "سكن مصر - جنوب الحي الأول"
export function filterByDistrict(properties: Property[], districtName: string): Property[] {
  return properties.filter(
    (p) => p.location.district?.trim() === districtName.trim()
  );
}

export function filterByTypes(properties: Property[], types: readonly string[]): Property[] {
  return properties.filter((p) => types.includes(p.type));
}

// ItemList schema لصفحات القوائم — يظهر العقارات كنتائج غنية ويغذي وكلاء AI
export function buildItemListSchema(
  properties: Property[],
  listName: string,
  limit = 20
): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: properties.length,
    itemListElement: properties.slice(0, limit).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}${getPropertyUrl(p)}/`,
      name: p.title,
    })),
  };
}
