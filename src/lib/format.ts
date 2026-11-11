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

// ===== تصحيح بيانات الإعلان عند القراءة =====
// محسّن العناوين القديم كان يُلحق "- دمياط الجديدة" بكل عنوان حتى لعقارات المنصورة الجديدة،
// فظهرت إعلانات في /new-mansoura/ بعنوان ينتهي بـ"دمياط الجديدة" — خطأ واقعي تنقله محركات البحث والإجابة كما هو.
// نصحح اللاحقة فقط (ما بعد آخر " - ") ولا نمس ما كتبه المعلن نفسه.
const CITY_AR: Record<string, string> = {
  "new-damietta": "دمياط الجديدة",
  "new-mansoura": "المنصورة الجديدة",
};

function fixCitySuffix(text: string, cityId?: string): string {
  const right = cityId ? CITY_AR[cityId] : undefined;
  if (!right) return text;
  const wrong = cityId === "new-mansoura" ? CITY_AR["new-damietta"] : CITY_AR["new-mansoura"];
  const suffix = new RegExp(`(\\s[-–—]\\s)${wrong}\\s*$`);
  return text.replace(suffix, `$1${right}`);
}

export function normalizeListingTitle(title: string, cityId?: string): string {
  const clean = (title || "").replace(/\s+/g, " ").replace(/\s*\|\s*/g, " | ").trim();
  return fixCitySuffix(clean, cityId);
}

// الوصف: نصحح فقط توقيع العلامة الذي يضيفه المحسّن في آخر النص
export function normalizeListingDescription(description: string | undefined, cityId?: string): string | undefined {
  if (!description) return description;
  return fixCitySuffix(description.trim(), cityId);
}
