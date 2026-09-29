import { MetadataRoute } from "next";
import { fetchAllPropertiesStrict } from "@/lib/firestoreProperties";
import { getCityDistrictSlugs, getPropertyUrl, SLUG_TO_DISTRICT } from "@/lib/districtSlugs";
import { filterByCity, filterByDistrict } from "@/lib/serverProperties";
import { CATEGORY_SLUGS, categoryProperties, isAvailable } from "@/lib/listingCategories";
import { isCategoryIndexable, isDistrictIndexable } from "@/lib/indexRules";
import { getActiveListings } from "@/lib/bw/listings";
import { isLive, listingPath, resaleCityIndexable } from "@/lib/bw/calc";
import { BW_BASE } from "@/lib/bw/constants";
import type { Property } from "@/lib/types";
import { BLOG_SLUGS, editorialIso } from "@/lib/seo/editorial";
import { cairoIso, cairoLocalToIso } from "@/lib/seo/time";

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
// كل lastmod بصيغة cairoIso (إزاحة القاهرة السارية) ومن نفس مصدر dateModified في JSON-LD الصفحة (spec-final A3.2):
// - الإعلان: updatedAt (يُكتب عند كل تعديل من لوحة التحكم) وإلا createdAt
// - صفحة تجمع إعلانات (الرئيسية، المدن، الأحياء، الفئات، الأسعار): أحدث lastmod بين إعلاناتها المتاحة.
//   صفحة بلا إعلانات: بلا lastmod
// - الصفحات الثابتة والمقالات: تاريخ آخر تعديل حقيقي للنص من src/lib/seo/editorial.ts
// - إعلان بيت الوطن: تاريخ توثيقه بتوقيت القاهرة

function verifiedIso(d: string): string | undefined {
  try {
    return cairoLocalToIso(String(d).slice(0, 10));
  } catch {
    return undefined;
  }
}

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

// نفس تعريف dateModified في صفحة العقار: updatedAt إن وُجد وإلا createdAt
function propertyLastmod(p: Property): Date | undefined {
  return validDate(p.updatedAt) || validDate(p.createdAt);
}

// صفحات القوائم تحسب dateModified من الإعلانات المتاحة فقط، فالخريطة كذلك (lastmod ≤ dateModified)
function hubLastmod(properties: Property[]): Date | undefined {
  return maxDate(properties.filter(isAvailable).map(propertyLastmod));
}

// lastModified اختياري: الصفحة بلا تاريخ معروف تُدرج بلا <lastmod> بدل تاريخ مختلق
function entry(
  path: string,
  lastModified: string | Date | undefined,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: url(path),
    ...(lastModified ? { lastModified: typeof lastModified === "string" ? lastModified : cairoIso(lastModified) } : {}),
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
  const ed = (path: string) => editorialIso(path, "modified");

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    entry("", listingsLastmod, "daily", 1.0),
    entry("properties", listingsLastmod, "daily", 0.9),
    entry("prices", listingsLastmod, "daily", 0.85),
    entry("blog", ed("/blog/"), "weekly", 0.8),
    entry("valuation", ed("/valuation/"), "monthly", 0.8),
    entry("about", ed("/about/"), "monthly", 0.7),
    entry("contact", ed("/contact/"), "monthly", 0.7),
    entry("careers", ed("/careers/"), "monthly", 0.6),
    entry("terms", ed("/terms/"), "yearly", 0.3),
    entry("privacy", ed("/privacy/"), "yearly", 0.3),
    entry("cookies", ed("/cookies/"), "yearly", 0.3),
    entry("sitemap-page", ed("/sitemap-page/"), "monthly", 0.5),
  ];

  // Blog posts — آخر تعديل حقيقي لكل مقال (لا تاريخ النشر)
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) =>
    entry(`blog/${slug}`, ed(`/blog/${slug}/`), "monthly", 0.7)
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
    // نفس dateModified في صفحة الإعلان: تاريخ التوثيق (بتوقيت القاهرة)
    const listingLastmod = (l: (typeof live)[number]) => validDate(verifiedIso(l.verifiedAt));
    bwListingsLastmod = maxDate(live.map(listingLastmod));
    const byCity: Record<string, { lastmod?: Date }> = {};
    for (const l of live) {
      const c = (byCity[l.citySlug] ||= {});
      c.lastmod = maxDate([c.lastmod, listingLastmod(l)]);
    }
    const bwCities = Object.entries(byCity)
      .filter(([city]) => resaleCityIndexable(live.filter((l) => l.citySlug === city)))
      .map(([city, c]) => entry(`${BW_BASE}/${city}`, c.lastmod, "daily", 0.8));
    const items = live.map((l) => ({
      url: url(listingPath(l)),
      ...(verifiedIso(l.verifiedAt) ? { lastModified: verifiedIso(l.verifiedAt) as string } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    bwPages = [...bwCities, ...items];
  } catch {
    // فشل Firestore لا يكسر بقية الـ sitemap
  }
  bwPages = [
    entry(BW_BASE, maxDate([validDate(ed(`${BW_BASE}/`)), bwListingsLastmod]), "daily", 0.9),
    entry(`${BW_BASE}/buy-request`, ed(`${BW_BASE}/buy-request/`), "monthly", 0.7),
    entry(`${BW_BASE}/sell`, ed(`${BW_BASE}/sell/`), "monthly", 0.7),
    entry(`${BW_BASE}/how-we-verify`, ed(`${BW_BASE}/how-we-verify/`), "monthly", 0.6),
    entry(`${BW_BASE}/phase-11`, ed(`${BW_BASE}/phase-11/`), "daily", 0.8),
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
