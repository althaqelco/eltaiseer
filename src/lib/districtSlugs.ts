// lib/districtSlugs.ts
// المصدر الوحيد لخرائط تحويل أسماء الأحياء إلى slugs والعكس
// كان هذا الكود مكرراً في 9 ملفات — أي تعديل على الأحياء يتم هنا فقط

import type { Property } from "./mockData";
import { CITY_DATA, type CityId } from "./egyptPlaces";

// الاسم العربي للحي → slug فى الرابط
export const DISTRICT_TO_SLUG: Record<string, string> = {
  // دمياط الجديدة
  "الحي الأول": "first-district",
  "الحي الثاني": "second-district",
  "الحي الثالث": "third-district",
  "الحي الرابع": "fourth-district",
  "الحي الخامس": "fifth-district",
  "الحي السادس (المتميز)": "sixth-district",
  "مشروع جنة": "janna-project",
  "دار مصر - موقع 1": "dar-misr-1",
  "دار مصر - موقع 2": "dar-misr-2",
  "سكن مصر - جنوب الحي الأول": "sakan-misr-south",
  "سكن مصر - غرب الجامعات": "sakan-misr-west",
  "بيت الوطن - شرق": "beit-al-watan-east",
  "بيت الوطن - غرب": "beit-al-watan-west",
  "بيت الوطن - امتداد الشاطئ": "beit-al-watan-beach",
  "المنطقة المركزية (أ)": "central-area-a",
  "المنطقة المركزية (ب)": "central-area-b",
  "المنطقة المركزية (ج)": "central-area-c",
  "شمال الجامعة": "north-university",
  "المنطقة الصناعية": "industrial-zone",
  "منطقة الشاليهات": "chalets",
  // المنصورة الجديدة - سكني
  "R1": "r1", "R2": "r2", "R3": "r3", "R4": "r4", "R5": "r5", "R6": "r6", "R7": "r7",
  "الحي السكني الأول": "residential-1",
  "الحي السكني الثاني": "residential-2",
  "الحي السكني الثالث": "residential-3",
  // المنصورة الجديدة - مشاريع قومية
  "سكن لكل المصريين": "sakan-kol-misryeen",
  "سكن لكل المصريين 2": "sakan-kol-misryeen-2",
  "سكن لكل المصريين 3": "sakan-kol-misryeen-3",
  "دار مصر": "dar-misr",
  "جنة": "janna",
  "الإسكان المتوسط": "medium-housing",
  "الإسكان الاجتماعي": "social-housing",
  // المنصورة الجديدة - فيلات
  "حي الفيلات": "villas-district",
  "منطقة الفيلات D": "villas-d",
  "فيلات الجولف": "golf-villas",
  "فيلات البحيرات": "lake-villas",
  // المنصورة الجديدة - تجاري
  "داون تاون": "downtown",
  "المول التجاري المركزي": "central-mall",
  "منطقة الأعمال المركزية CBD": "cbd",
  "المحور التجاري": "commercial-axis",
  "منطقة الخدمات": "services-zone",
  // المنصورة الجديدة - ترفيهي
  "الحديقة المركزية": "central-park",
  "منطقة الكورنيش": "corniche",
  "النادي الاجتماعي": "social-club",
  "المنطقة السياحية": "touristic-zone",
  // المنصورة الجديدة - ساحلي
  "الواجهة البحرية": "waterfront",
  "شاطئ المنصورة الجديدة": "beach",
  "منتجعات الساحل": "coastal-resorts",
};

// slug فى الرابط → الاسم العربي للحي (مشتق تلقائياً)
export const SLUG_TO_DISTRICT: Record<string, string> = Object.fromEntries(
  Object.entries(DISTRICT_TO_SLUG).map(([name, slug]) => [slug, name])
);

// كل الـ slugs (تستخدم في sitemap و generateStaticParams)
export const ALL_DISTRICT_SLUGS: string[] = Object.values(DISTRICT_TO_SLUG);

export function getDistrictSlug(districtName: string): string {
  if (!districtName || districtName.trim() === "") {
    return "unknown-district";
  }
  return (
    DISTRICT_TO_SLUG[districtName] ||
    districtName.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")
  );
}

export function getDistrictFromSlug(slug: string): string | undefined {
  return SLUG_TO_DISTRICT[slug];
}

// كل slugs مدينة معينة (تستخدم في sitemap وgenerateStaticParams) — مشتقة من CITY_DATA
// فلا يمكن أن يظهر في الـ sitemap حي غير موجود فعلاً
export function getCityDistrictSlugs(cityId: CityId): string[] {
  return Array.from(
    new Set(CITY_DATA[cityId].allDistricts.map((d) => getDistrictSlug(d)))
  );
}

// رابط صفحة العقار بالهيكل الجديد /[city]/[district]/[propertyId]
export function getPropertyUrl(property: Property): string {
  const citySlug = property.location.cityId || "new-damietta";
  const districtSlug = getDistrictSlug(property.location.district);
  return `/${citySlug}/${districtSlug}/${property.id}`;
}
