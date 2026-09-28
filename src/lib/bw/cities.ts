// lib/bw/cities.ts
// مدن «بيت الوطن» كما يكتبها موقع الهيئة ↔ روابط لاتينية ثابتة.
// نفس الـ slugs المعتمدة لصفحات دليل المنصة (/baitelwatan/cities/{slug}/) حتى تتطابق الروابط بين الموقعين.

export interface BwCity {
  slug: string;
  nameAr: string;
  aliases?: string[];
}

export const BW_CITIES: BwCity[] = [
  { slug: "new-cairo", nameAr: "القاهرة الجديدة", aliases: ["التجمع الخامس", "التجمع"] },
  { slug: "new-october", nameAr: "أكتوبر الجديدة" },
  { slug: "6th-of-october", nameAr: "السادس من أكتوبر" },
  { slug: "sheikh-zayed", nameAr: "الشيخ زايد" },
  { slug: "new-obour", nameAr: "العبور الجديدة" },
  { slug: "obour", nameAr: "العبور" },
  { slug: "shorouk", nameAr: "الشروق" },
  { slug: "badr", nameAr: "بدر" },
  { slug: "15-may", nameAr: "15 مايو" },
  { slug: "10th-of-ramadan", nameAr: "العاشر من رمضان" },
  { slug: "hadayek-el-asher", nameAr: "حدائق العاشر" },
  { slug: "capital-gardens", nameAr: "حدائق العاصمة" },
  { slug: "sadat", nameAr: "السادات" },
  { slug: "new-damietta", nameAr: "دمياط الجديدة" },
  { slug: "new-mansoura", nameAr: "المنصورة الجديدة" },
  { slug: "new-alamein", nameAr: "العلمين الجديدة" },
  { slug: "new-borg-el-arab", nameAr: "برج العرب الجديدة" },
  { slug: "new-sphinx", nameAr: "سفنكس الجديدة" },
  { slug: "new-fayoum", nameAr: "الفيوم الجديدة" },
  { slug: "new-beni-suef", nameAr: "بني سويف الجديدة" },
  { slug: "new-minya", nameAr: "المنيا الجديدة" },
  { slug: "new-assiut", nameAr: "أسيوط الجديدة" },
  { slug: "new-sohag", nameAr: "سوهاج الجديدة" },
  { slug: "new-akhmim", nameAr: "أخميم الجديدة" },
  { slug: "new-qena", nameAr: "قنا الجديدة" },
  { slug: "new-aswan", nameAr: "أسوان الجديدة" },
];

const BY_SLUG = new Map(BW_CITIES.map((c) => [c.slug, c]));

// الهيئة تكتب «اكتوبر» و«بنى سويف» بلا همزة أو بياء غير منقوطة — نطابق بعد التطبيع
export function normalizeAr(s: string): string {
  return (s || "")
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

const BY_NAME = new Map<string, BwCity>();
for (const c of BW_CITIES) {
  BY_NAME.set(normalizeAr(c.nameAr), c);
  for (const a of c.aliases || []) BY_NAME.set(normalizeAr(a), c);
}

export function cityBySlug(slug: string): BwCity | undefined {
  return BY_SLUG.get(slug);
}

export function cityByArabic(name: string): BwCity | undefined {
  return BY_NAME.get(normalizeAr(name));
}

export function cityName(slug: string): string {
  return BY_SLUG.get(slug)?.nameAr || slug;
}

// أسماء الأحياء الشائعة → مقطع رابط لاتيني. غير المعروف يكتبه المسؤول يدويًا في لوحة التحكم.
const ORDINALS: Record<string, number> = {
  "الاول": 1, "الثاني": 2, "الثالث": 3, "الرابع": 4, "الخامس": 5,
  "السادس": 6, "السابع": 7, "الثامن": 8, "التاسع": 9, "العاشر": 10,
};

export function suggestDistrictSlug(district: string): string {
  const n = normalizeAr(district).replace(/^ال?حي\s+/, "").replace(/^ال?حى\s+/, "");
  if (ORDINALS[n]) return `district-${ORDINALS[n]}`;
  const digits = n.match(/^\d+$/);
  if (digits) return `district-${digits[0]}`;
  if (/شمال/.test(n)) return "north";
  if (/جنوب/.test(n)) return "south";
  return "";
}

// «٠١٠…» و«۴۵۰» و«5,000,000» كما يكتبها الناس → أرقام لاتينية
export function toAsciiDigits(s: string): string {
  return (s || "").replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export function parseNumber(s: string): number | null {
  let t = toAsciiDigits(s || "").trim();
  if (!t) return null;
  let mult = 1;
  if (/مليون/.test(t)) mult = 1_000_000;
  else if (/(ألف|الف)/.test(t)) mult = 1_000;
  t = t
    .replace(/(مليون|ألف|الف|جنيه|ج\.?م|متر|م2|م²|م)/g, "")
    .replace(/[\s,\u060C\u066C]/g, "") // مسافات وفواصل آلاف (، و٬)
    .replace(/\u066B/g, "."); // الفاصلة العشرية العربية
  // «5.000.000» أو «٥٫٠٠٠٫٠٠٠»: نقاط تفصل مجموعات من 3 أرقام = فواصل آلاف
  if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t) * mult;
  return isFinite(n) ? n : null;
}

export function isValidSlug(s: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 40;
}
