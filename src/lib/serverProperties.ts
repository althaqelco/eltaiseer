// lib/serverProperties.ts
// جلب العقارات من جهة الخادم لصفحات القوائم — حتى ترى محركات البحث
// ووكلاء الذكاء الاصطناعي العقارات في HTML مباشرة بدل صفحات فارغة

import { cache } from "react";
import { fetchAllPropertiesStrict, fetchPropertyStrict } from "./firestoreProperties";
import { getPropertyUrl } from "./districtSlugs";
import type { Property } from "./mockData";

const BASE_URL = "https://eltaiseer.com";

// cache() يوحّد الجلب داخل الطلب الواحد (metadata + الصفحة + الـ schema)
// ok=false يعني فشل الجلب (لا "صفر عقارات") — قواعد noindex وsitemap لا تُطبق عليه
export const getPropertiesServerResult = cache(
  async (): Promise<{ ok: boolean; properties: Property[] }> => {
    try {
      return { ok: true, properties: await fetchAllPropertiesStrict() };
    } catch (error) {
      console.error("Error fetching properties from Firestore:", error);
      return { ok: false, properties: [] };
    }
  }
);

// نفس السلوك السابق: قائمة فارغة عند الفشل (للأجزاء الثانوية في صفحات ديناميكية، مثل «عقارات مشابهة»)
export const getPropertiesServer = cache(
  async (): Promise<Property[]> => (await getPropertiesServerResult()).properties
);

// لصفحات القوائم المخزنة (ISR): الفشل يُرمى بدل قائمة فارغة، فيُبقي Next آخر نسخة سليمة ويعيد المحاولة لاحقًا —
// القائمة الفارغة كانت تُخزَّن 300 ث أو أكثر للزوار وجوجل (وبعد إزالة إعادة الجلب من المتصفح لا شيء يصلحها).
// أثناء البناء فقط نقبل الفارغ حتى لا يفشل النشر بسبب انقطاع مؤقت (تُعاد الصفحة بعد 300 ث).
export const getPropertiesForIsr = cache(async (): Promise<Property[]> => {
  const r = await getPropertiesServerResult();
  if (!r.ok && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("Firestore unavailable: keeping the last good page");
  }
  return r.properties;
});

// معرفات Firestore في هذا المشروع: 8 أحرف مخصصة أو 20 تلقائية — أي شيء آخر ليس عقاراً
const PROPERTY_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

// عقار واحد لصفحته: null = غير موجود (404)، وخطأ الاتصال يُرمى (500 يعيد الزاحف المحاولة لاحقاً)
export const getPropertyServer = cache(async (id: string): Promise<Property | null> => {
  if (!PROPERTY_ID_RE.test(id)) return null;
  return fetchPropertyStrict(id);
});

// تحويل لكائنات قابلة للتمرير من Server Component إلى Client Component
// - أرقام التواصل لا تُرسل (كل الأزرار تستخدم رقم الشركة الموحد)
// - الوصف الطويل لا يُرسل لصفحات القوائم (البطاقات لا تعرضه) — يوفر عشرات KB من الـ HTML
export function serializeProperties(properties: Property[]): Property[] {
  return (JSON.parse(JSON.stringify(properties)) as Property[]).map((p) => ({
    ...p,
    contact_whatsapp: "",
    description: "",
    // البطاقات تعرض الصورة الأولى فقط — التحديث الحي من المتصفح يجلب الباقي عند الحاجة
    images: p.images.slice(0, 1),
  }));
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
