import { MetadataRoute } from "next";
import { getPropertiesFromFirestore } from "@/lib/firestoreProperties";
import { getCityDistrictSlugs, getDistrictSlug } from "@/lib/districtSlugs";

const BASE_URL = "https://eltaiseer.com";

// trailingSlash:true في next.config — كل الروابط يجب أن تنتهي بـ / لتطابق canonical بدون تحويلات 301
function url(path: string): string {
  if (path === "") return `${BASE_URL}/`;
  return `${BASE_URL}/${path.replace(/^\/|\/$/g, "")}/`;
}

// تواريخ ثابتة للمحتوى الثابت — lastModified وهمي "الآن" لكل الصفحات يفقد مصداقية الـ sitemap
const BLOG_PUBLISHED = new Date("2026-01-18");
const LEGAL_UPDATED = new Date("2026-01-12");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listingsDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: url(""), lastModified: listingsDate, changeFrequency: "daily", priority: 1.0 },
    { url: url("properties"), lastModified: listingsDate, changeFrequency: "daily", priority: 0.9 },
    { url: url("blog"), lastModified: BLOG_PUBLISHED, changeFrequency: "weekly", priority: 0.8 },
    { url: url("valuation"), lastModified: LEGAL_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: url("about"), lastModified: LEGAL_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("contact"), lastModified: LEGAL_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("careers"), lastModified: LEGAL_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("terms"), lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: url("privacy"), lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: url("cookies"), lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: url("sitemap-page"), lastModified: LEGAL_UPDATED, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Blog posts
  const blogSlugs = [
    "damietta-vs-mansoura",
    "buying-apartment-guide",
    "best-districts",
    "national-housing-projects",
    "investment-guide",
    "finishing-tips",
    "new-mansoura-districts",
    "new-mansoura-investment",
  ];
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: url(`blog/${slug}`),
    lastModified: BLOG_PUBLISHED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Category pages
  const categorySlugs = ["apartments", "villas", "lands", "shops", "clinics", "chalets"];
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: url(`properties/${slug}`),
    lastModified: listingsDate,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // City pages
  const cityPages: MetadataRoute.Sitemap = [
    { url: url("new-damietta"), lastModified: listingsDate, changeFrequency: "daily", priority: 0.95 },
    { url: url("new-mansoura"), lastModified: listingsDate, changeFrequency: "daily", priority: 0.95 },
  ];

  // District pages — مشتقة من نفس مصدر البيانات المستخدم في المسارات (لا قوائم يدوية)
  const districtPages: MetadataRoute.Sitemap = (
    [
      ["new-damietta", getCityDistrictSlugs("new-damietta")],
      ["new-mansoura", getCityDistrictSlugs("new-mansoura")],
    ] as const
  ).flatMap(([city, slugs]) =>
    slugs.map((slug) => ({
      url: url(`${city}/${slug}`),
      lastModified: listingsDate,
      changeFrequency: "daily" as const,
      priority: 0.85,
    }))
  );

  // Property detail pages — صفحات المال الحقيقية، تُجلب من Firestore
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const properties = await getPropertiesFromFirestore();
    propertyPages = properties
      .filter((p) => p.status !== "تم البيع")
      .map((p) => {
        const citySlug = p.location.cityId || "new-damietta";
        const districtSlug = getDistrictSlug(p.location.district);
        return {
          url: url(`${citySlug}/${districtSlug}/${p.id}`),
          lastModified: p.createdAt ? new Date(p.createdAt) : listingsDate,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      });
  } catch {
    // فشل الاتصال بـ Firestore وقت البناء لا يجب أن يكسر بقية الـ sitemap
  }

  return [
    ...staticPages,
    ...cityPages,
    ...categoryPages,
    ...districtPages,
    ...blogPages,
    ...propertyPages,
  ];
}
