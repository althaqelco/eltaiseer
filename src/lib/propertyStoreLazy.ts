// lib/propertyStoreLazy.ts
// واجهة تحميل متأخر لدوال propertyStore المستخدمة في الصفحات العامة.
// الصفحات تأتي من الخادم بعقاراتها كاملة (SSR/ISR)؛ Firestore في المتصفح يُستخدم فقط للتحديث الحي بعد التحميل.
// الاستيراد المباشر من propertyStore كان يضع مكتبة Firebase كلها (~160KB) في حزمة JavaScript الأولى لكل صفحة
// قوائم، فتتأخر التفاعلية على الجوال بلا حاجة. import() هنا يؤجلها إلى ما بعد ظهور الصفحة.
// لوحة التحكم تستورد من propertyStore مباشرة كما هي.

import type { Property } from "./types";

export async function getAllPropertiesAsync(): Promise<Property[]> {
  const m = await import("./propertyStore");
  return m.getAllPropertiesAsync();
}

export async function getPropertyByIdAsync(id: string): Promise<Property | null> {
  const m = await import("./propertyStore");
  return m.getPropertyByIdAsync(id);
}

export async function getRelatedPropertiesAsync(property: Property, limit = 4): Promise<Property[]> {
  const m = await import("./propertyStore");
  return m.getRelatedPropertiesAsync(property, limit);
}
