// lib/format.ts
// تنسيق الأسعار وروابط الواتساب — كانت مكررة في 7 ملفات بصيغ متضاربة
// (إحداها بدون كود الدولة فكانت تفتح واتساب برقم غير صالح)

export const COMPANY_WHATSAPP = "201500775974";
export const COMPANY_TEL = "+201500775974";

// "1.5 مليون" أو "850,000" — للبطاقات والقوائم
export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)} مليون`;
  }
  return price.toLocaleString("ar-EG");
}

// "1.5 مليون جنيه" أو "850,000 جنيه" — لصفحات التفاصيل والعناوين
export function formatPriceFull(price: number): string {
  if (price >= 1000000) {
    const m = price / 1000000;
    return m === Math.floor(m) ? `${m} مليون جنيه` : `${m.toFixed(1)} مليون جنيه`;
  }
  return `${price.toLocaleString("ar-EG")} جنيه`;
}

// تطبيع رقم مصري لصيغة wa.me الدولية: "01500775974" → "201500775974"
export function normalizeEgyptPhone(contact: string): string {
  const digits = (contact || "").replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `2${digits}`;
  return `20${digits}`;
}

export function getWhatsAppUrl(contact: string, text?: string): string {
  const phone = normalizeEgyptPhone(contact);
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${phone}${query}`;
}

// العنوان المخزن قد يحمل لاحقة سيو بعد « | » (مثل «| شقة الحي الأول - دمياط الجديدة») أضافها enhanceTitle،
// وبعض إعلانات المنصورة الجديدة حملت اسم دمياط فيها. العنوان المعروض (H1 وبطاقة العقار) بلا لاحقة.
export function displayTitle(title: string): string {
  return (title || "").split(" | ")[0].trim();
}

// وصف قديم لإعلان في المنصورة الجديدة أُضيفت له خاتمة «التيسير للعقارات - دمياط الجديدة» خطأً
export function fixBrandSuffix(description: string, cityId?: string): string {
  if (cityId !== "new-mansoura") return description;
  return description.replace("التيسير للعقارات - دمياط الجديدة", "التيسير للعقارات - المنصورة الجديدة");
}
