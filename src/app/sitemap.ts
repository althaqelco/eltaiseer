import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eltaiseer.com";
  const currentDate = new Date().toISOString();

  // العقارات يتم جلبها من Firebase - صفحات العقارات ديناميكية

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

  // City pages - New URL structure
  const cityPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/new-damietta`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/new-mansoura`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
  ];

  // District pages - New Damietta
  const ndDistrictSlugs = [
    "first-district",
    "second-district", 
    "third-district",
    "fourth-district",
    "fifth-district",
    "sixth-district",
    "janna-project",
    "dar-misr-1",
    "dar-misr-2",
    "sakan-misr-south",
    "sakan-misr-west",
    "beit-al-watan-east",
    "beit-al-watan-west",
    "beit-al-watan-beach",
    "central-area-a",
    "central-area-b",
    "central-area-c",
    "chalets",
  ];

  // District pages - New Mansoura
  const nmDistrictSlugs = [
    // Residential
    "r1", "r2", "r3", "r4", "r5", "r6", "r7",
    "residential-1", "residential-2", "residential-3",
    // National Projects
    "sakan-kol-misryeen", "sakan-kol-misryeen-2", "sakan-kol-misryeen-3",
    "dar-misr", "janna", "medium-housing", "social-housing",
    // Villas
    "villas-district", "villas-d", "golf-villas", "lake-villas",
    // Commercial
    "downtown", "central-mall", "cbd", "commercial-axis", "services-zone",
    // Entertainment
    "central-park", "corniche", "social-club", "touristic-zone",
    // Coastal
    "waterfront", "beach", "coastal-resorts",
  ];

  // New Damietta districts
  const ndDistrictPages: MetadataRoute.Sitemap = ndDistrictSlugs.map((slug) => ({
    url: `${baseUrl}/new-damietta/${slug}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // New Mansoura districts
  const nmDistrictPages: MetadataRoute.Sitemap = nmDistrictSlugs.map((slug) => ({
    url: `${baseUrl}/new-mansoura/${slug}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...cityPages, ...categoryPages, ...ndDistrictPages, ...nmDistrictPages];
}
