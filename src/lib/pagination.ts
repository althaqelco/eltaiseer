// lib/pagination.ts
// ترقيم صفحات القوائم بروابط حقيقية ?page=N يراها الزاحف — نفس الأرقام في الخادم والعميل
//
// - الصفحة 1 هي الرابط الأساسي بلا ?page (الروابط لا تشير أبداً إلى ?page=1)
// - الصفحات 2+ يخدمها rewrite في next.config.mjs إلى مسار داخلي /…/p/N/ بنظام ISR،
//   لأن قراءة searchParams في الصفحة الأساسية تحوّلها لعرض ديناميكي عند كل طلب وتلغي التخزين
// - كل صفحة لها canonical ذاتي (الصفحة 2 تشير لنفسها لا للصفحة 1)
// - الفلاتر في المتصفح تبقى تحسيناً إضافياً: عند تفعيل فلتر يصبح الترقيم محلياً بأزرار

export const CITY_PAGE_SIZE = 20;
export const HUB_PAGE_SIZE = 20;
export const CATEGORY_PAGE_SIZE = 12;

// أقصى رقم صفحة مقبول — يطابق قيمة has في rewrites بـ next.config.mjs (2..9999)
const PAGE_PARAM_RE = /^(?:[2-9]|[1-9][0-9]{1,3})$/;

export function totalPages(count: number, size: number): number {
  return Math.max(1, Math.ceil(count / size));
}

// "2".."9999" فقط؛ الصفحة 1 والأصفار البادئة وأي قيمة أخرى ليست صفحة مستقلة
export function parsePageParam(raw: string | undefined | null): number | null {
  if (!raw || !PAGE_PARAM_RE.test(raw)) return null;
  return Number(raw);
}

// basePath ينتهي دائماً بـ / (trailingSlash) — مثال: "/new-damietta/"
export function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export function slicePage<T>(items: readonly T[], page: number, size: number): T[] {
  return items.slice((page - 1) * size, page * size);
}

// أرقام الصفحات الظاهرة: الكل حتى 7 صفحات، وإلا الأولى والأخيرة ونافذة حول الحالية
export function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("gap");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("gap");
  pages.push(total);
  return pages;
}

// الصفحة N ترث title وog من الصفحة الأولى؛ نضيف «صفحة N» ونجعل og:url ذاتيًا حتى لا تتكرر العناوين
// ولا تشير المشاركة للصفحة الأولى (الـ canonical ذاتي أصلًا)
export async function pagedMetadata(
  parent: import("next").ResolvingMetadata,
  canonical: string,
  page: number
): Promise<import("next").Metadata> {
  const prev = await parent;
  const base = prev.title?.absolute || "";
  const title = base ? `${base} - صفحة ${page}` : undefined;
  return {
    ...(title ? { title: { absolute: title } } : {}),
    alternates: { canonical },
    openGraph: {
      ...(prev.openGraph || {}),
      url: canonical,
      ...(title ? { title } : {}),
    } as import("next").Metadata["openGraph"],
  };
}
