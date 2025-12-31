import { MetadataRoute } from "next";
import { MOCK_PROPERTIES } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eltaiseer.com";
  const currentDate = new Date().toISOString();

  // Get property IDs excluding sold properties
  const propertyIds = MOCK_PROPERTIES
    .filter(property => property.status !== "تم البيع")
    .map(property => property.id);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/buying-apartment-guide`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/best-districts`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/national-housing-projects`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/investment-guide`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/finishing-tips`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/valuation`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sitemap-page`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Category pages - High priority for SEO
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/properties/apartments`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/properties/villas`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/properties/lands`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/properties/shops`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/properties/clinics`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/chalets`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Property detail pages
  const propertyPages: MetadataRoute.Sitemap = propertyIds.map((id) => ({
    url: `${baseUrl}/property/${id}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // District pages with clean English URLs
  const districtSlugs = [
    "first-district",
    "second-district", 
    "third-district",
    "fourth-district",
    "fifth-district",
    "sixth-district",
    "janna-project",
    "dar-misr",
    "sakan-misr",
    "beit-al-watan",
    "central-area",
    "chalets",
  ];

  const districtPages: MetadataRoute.Sitemap = districtSlugs.map((slug) => ({
    url: `${baseUrl}/properties/district/${slug}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...districtPages, ...propertyPages];
}
