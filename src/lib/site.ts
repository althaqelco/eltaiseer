// lib/site.ts
// هوية الموقع في مكان واحد: المعرّفات (@id) التي تربط كل schema بكيان واحد،
// وروابط الحسابات الرسمية. محركات الإجابة تبني "الكيان" من تطابق هذه القيم عبر كل الصفحات.

export const SITE_URL = "https://eltaiseer.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORG_NAME = "التيسير للعقارات";
export const ORG_NAME_EN = "El Taiseer Real Estate";
export const ORG_EMAIL = "info@eltaiseer.com";

// نفس الحسابات المعروضة في الفوتر — أي حساب جديد يُضاف هنا وفي الفوتر معاً
export const ORG_SOCIAL = [
  "https://www.facebook.com/profile.php?id=61586663700452",
  "https://www.instagram.com/eltaiseercom",
  "https://www.tiktok.com/@eltaiseer.com",
];

// رابط مطلق بشرطة ختامية — يطابق trailingSlash:true فلا يمر الزاحف بتحويل 308
// الملفات (‎.xml ‎.txt ‎.jpg) والروابط التي تحمل ? أو # تبقى كما هي
export function absUrl(path: string): string {
  // رابط مطلق لنفس الموقع يُطبَّع أيضاً (المقالات تمرره بدون شرطة ختامية)؛ الروابط الخارجية تبقى كما هي
  if (path.startsWith(SITE_URL)) path = path.slice(SITE_URL.length) || "/";
  else if (/^https?:\/\//.test(path)) return path;
  const clean = `/${path.replace(/^\/+/, "")}`;
  if (clean === "/") return `${SITE_URL}/`;
  if (/[?#]/.test(clean) || /\.[a-z0-9]{2,5}$/i.test(clean)) return `${SITE_URL}${clean}`;
  return `${SITE_URL}${clean.replace(/\/+$/, "")}/`;
}

// صورة المشاركة (og:image): openGraph في أي صفحة فرعية يستبدل openGraph الجذر كاملاً ولا يدمجه،
// فكل صفحة تعرّف openGraph يجب أن تضع images بنفسها وإلا خرجت بلا صورة (كان هذا حال 59 صفحة)
export function ogImages(cityId?: string, alt: string = "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة") {
  const url =
    cityId === "new-mansoura" ? "/og-new-mansoura.jpg" : cityId === "new-damietta" ? "/og-new-damietta.jpg" : "/og-image.jpg";
  return [{ url, width: 1200, height: 630, alt }];
}

export function cityNameOf(cityId?: string): "دمياط الجديدة" | "المنصورة الجديدة" {
  return cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
}
