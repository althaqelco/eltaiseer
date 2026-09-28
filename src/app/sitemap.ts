import { MetadataRoute } from "next";
import { fetchAllPropertiesStrict } from "@/lib/firestoreProperties";
import { getCityDistrictSlugs, getPropertyUrl, SLUG_TO_DISTRICT } from "@/lib/districtSlugs";
import { filterByCity, filterByDistrict } from "@/lib/serverProperties";
import { CATEGORY_SLUGS, categoryProperties, isAvailable } from "@/lib/listingCategories";
import { isCategoryIndexable, isDistrictIndexable } from "@/lib/indexRules";
import { getActiveListings } from "@/lib/bw/listings";
import { isLive, listingPath } from "@/lib/bw/calc";
import { BW_BASE } from "@/lib/bw/constants";
import type { Property } from "@/lib/types";

const BASE_URL = "https://eltaiseer.com";

// كان الـ sitemap يُبنى مرة وقت النشر فقط؛ إعلانات بيت الوطن الموثّقة تُنشر وتُباع يوميًا فيُعاد بناؤه كل ساعة
export const revalidate = 3600;

// trailingSlash:true في next.config — كل الروابط يجب أن تنتهي بـ / لتطابق canonical بدون تحويلات 301
function url(path: string): string {
  if (path === "") return `${BASE_URL}/`;
  return `${BASE_URL}/${path.replace(/^\/|\/$/g, "")}/`;
}

// ── lastmod ──────────────────────────────────────────────────────────────────
// لا "الآن" أبداً: وقت التوليد يتغير كل ساعة فيتعلم جوجل تجاهل lastmod الموقع كله.
// - الإعلان: أحدث من updatedAt (يُكتب عند كل تعديل من لوحة التحكم) وcreatedAt
// - صفحة تجمع إعلانات (الرئيسية، المدن، الأحياء، الفئات، الأسعار): أحدث lastmod بين إعلاناتها
//   (المباعة ضمنها — تغيير الحالة لمباع يغير محتوى الصفحة). صفحة بلا إعلانات: بلا lastmod
// - الصفحات الثابتة: تاريخ ثابت يُحدَّث يدوياً عند تعديل محتواها
const LEGAL_UPDATED = new Date("2026-01-12");
// نموذج التقييم يسلم الطلب إلى واتساب منذ 28/9/2026
const VALUATION_UPDATED = new Date("2026-09-28");
// الشروط والخصوصية حُدِّثتا 28/9/2026 بقسم بيع وشراء أراضي بيت الوطن
const TERMS_UPDATED = new Date("2026-09-28");
const BW_UPDATED = new Date("2026-09-28");

// تاريخ آخر تعديل لكل مقال: الأحدث بين تاريخه في feed.xml وdatePublished في صفحته وتاريخه السابق هنا
const BLOG_POSTS: Record<string, string> = {
  "buying-steps-legal": "2026-08-17",
  "damietta-vs-mansoura": "2026-08-17",
  "buying-apartment-guide": "2026-01-18",
  "best-districts": "2026-01-18",
  "national-housing-projects": "2026-01-18",
  "investment-guide": "2026-01-18",
  "finishing-tips": "2026-01-28",
  "new-mansoura-districts": "2026-01-18",
  "new-mansoura-investment": "2026-01-18",
};

function validDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value as string);
  return isNaN(d.getTime()) ? undefined : d;
}

function maxDate(dates: (Date | undefined)[]): Date | undefined {
  let best: Date | undefined;
  for (const d of dates) if (d && (!best || d > best)) best = d;
  return best;
}

function propertyLastmod(p: Property): Date | undefined {
  return maxDate([validDate(p.updatedAt), validDate(p.createdAt)]);
}

function hubLastmod(properties: Property[]): Date | undefined {
  return maxDate(properties.map(propertyLastmod));
}

// lastModified اختياري: الصفحة بلا تاريخ معروف تُدرج بلا <lastmod> بدل تاريخ مختلق
function entry(
  path: string,
  lastModified: Date | undefined,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: url(path),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ok=false: فشل جلب Firestore — لا نطبق قاعدة القوائم الفارغة (تبقى الأحياء والفئات مدرجة كما كانت)
  let all: Property[] = [];
  let ok = false;
  try {
    all = await fetchAllPropertiesStrict();
    ok = true;
  } catch {
    // فشل الاتصال بـ Firestore وقت البناء لا يجب أن يكسر بقية الـ sitemap
  }
  const listingsLastmod = hubLastmod(all);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    entry("", listingsLastmod, "daily", 1.0),
    entry("properties", listingsLastmod, "daily", 0.9),
    entry("prices", listingsLastmod, "daily", 0.85),
    entry("blog", maxDate(Object.values(BLOG_POSTS).map((d) => new Date(d))), "weekly", 0.8),
    entry("valuation", VALUATION_UPDATED, "monthly", 0.8),
    entry("about", LEGAL_UPDATED, "monthly", 0.7),
    entry("contact", LEGAL_UPDATED, "monthly", 0.7),
    entry("careers", LEGAL_UPDATED, "monthly", 0.6),
    entry("terms", TERMS_UPDATED, "yearly", 0.3),
    entry("privacy", TERMS_UPDATED, "yearly", 0.3),
    entry("cookies", LEGAL_UPDATED, "yearly", 0.3),
    entry("sitemap-page", LEGAL_UPDATED, "monthly", 0.5),
  ];

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = Object.entries(BLOG_POSTS).map(([slug, date]) =>
    entry(`blog/${slug}`, new Date(date), "monthly", 0.7)
  );

  // Category pages (ومنها التقسيط) — فئة بلا عروض متاحة خارج الخريطة (lib/indexRules.ts)
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.flatMap((slug) => {
    const list = categoryProperties(all, slug);
    if (ok && !isCategoryIndexable(list.filter(isAvailable).length)) return [];
    return [entry(`properties/${slug}`, hubLastmod(list), "daily", 0.9)];
  });

  // City pages
  const cities = ["new-damietta", "new-mansoura"] as const;
  const cityPages: MetadataRoute.Sitemap = cities.map((city) =>
    entry(city, hubLastmod(filterByCity(all, city)), "daily", 0.95)
  );

  // District pages — مشتقة من نفس مصدر البيانات المستخدم في المسارات (لا قوائم يدوية)،
  // وحي بلا عروض متاحة ولا دليل تحريري ≥ 250 كلمة خارج الخريطة (lib/indexRules.ts)
  const districtPages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    getCityDistrictSlugs(city).flatMap((slug) => {
      const list = filterByDistrict(filterByCity(all, city), SLUG_TO_DISTRICT[slug]);
      if (ok && !isDistrictIndexable(slug, list.filter(isAvailable).length)) return [];
      return [entry(`${city}/${slug}`, hubLastmod(list), "daily", 0.85)];
    })
  );

  // Property detail pages — صفحات المال الحقيقية، تُجلب من Firestore
  // (إعلان بحي غير مُعرّف يبقى مدرجاً: صفحته قابلة للفهرسة، وإن صُحح حيه يحوَّل رابطه 308 للجديد)
  const propertyPages: MetadataRoute.Sitemap = all
    .filter(isAvailable)
    .map((p) => entry(getPropertyUrl(p), propertyLastmod(p), "weekly", 0.8));

  // أراضي بيت الوطن للبيع: الصفحات الثابتة، والإعلانات الموثّقة النشطة، والمدن القابلة للفهرسة فقط (5 إعلانات أو حي فيه 3)
  let bwPages: MetadataRoute.Sitemap = [];
  let bwListingsLastmod: Date | undefined;
  try {
    const now = Date.now();
    const live = (await getActiveListings()).filter((l) => isLive(l, now));
    const listingLastmod = (l: (typeof live)[number]) =>
      maxDate([validDate(l.updatedAt), validDate(l.verifiedAt)]);
    bwListingsLastmod = maxDate(live.map(listingLastmod));
    const byCity: Record<string, { districts: Record<string, number>; lastmod?: Date }> = {};
    for (const l of live) {
      const c = (byCity[l.citySlug] ||= { districts: {} });
      const key = l.districtSlug || l.district;
      c.districts[key] = (c.districts[key] || 0) + 1;
      c.lastmod = maxDate([c.lastmod, listingLastmod(l)]);
    }
    const bwCities = Object.entries(byCity)
      .filter(([, c]) => {
        const counts = Object.values(c.districts);
        return counts.reduce((a, b) => a + b, 0) >= 5 || counts.some((n) => n >= 3);
      })
      .map(([city, c]) => entry(`${BW_BASE}/${city}`, c.lastmod, "daily", 0.8));
    const items = live.map((l) => ({
      url: url(listingPath(l)),
      lastModified: new Date(l.verifiedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    bwPages = [...bwCities, ...items];
  } catch {
    // فشل Firestore لا يكسر بقية الـ sitemap
  }
  bwPages = [
    entry(BW_BASE, maxDate([BW_UPDATED, bwListingsLastmod]), "daily", 0.9),
    entry(`${BW_BASE}/buy-request`, BW_UPDATED, "monthly", 0.7),
    entry(`${BW_BASE}/sell`, BW_UPDATED, "monthly", 0.7),
    entry(`${BW_BASE}/how-we-verify`, BW_UPDATED, "monthly", 0.6),
    entry(`${BW_BASE}/phase-11`, BW_UPDATED, "daily", 0.8),
    ...bwPages,
  ];

  return [
    ...staticPages,
    ...bwPages,
    ...cityPages,
    ...categoryPages,
    ...districtPages,
    ...blogPages,
    ...propertyPages,
  ];
}
