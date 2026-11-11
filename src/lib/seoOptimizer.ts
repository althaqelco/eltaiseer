/**
 * SEO Optimizer for Property Listings
 * Optimized for Search Engines & AI Search (2026-2027)
 * 
 * Features:
 * - Semantic keyword optimization
 * - Schema.org structured data support
 * - Arabic language SEO best practices
 * - AI-friendly content structure
 */

import { getDistrictSlug } from "./districtSlugs";
import { buildPropertySummary, pricePerSqm } from "./propertySummary";
import { ORG_ID, ORG_NAME, SITE_URL, WEBSITE_ID, cityNameOf } from "./site";
import type { Property } from "./types";

interface PropertySEOInput {
  type: string;
  district: string;
  area_sqm: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  level: string;
  finishing: string;
  amenities: string[];
  status: string;
  paymentType?: string;
  description?: string;
  cityId?: string;
}

// Primary SEO keywords for real estate in New Damietta
const PRIMARY_KEYWORDS = [
  "دمياط الجديدة",
  "عقارات",
  "للبيع",
];

// Property type keywords mapping
const PROPERTY_TYPE_KEYWORDS: Record<string, string[]> = {
  "شقة": ["شقة للبيع", "شقق", "سكني"],
  "شقة فاخرة": ["شقة فاخرة", "لوكس", "تشطيب سوبر لوكس"],
  "فيلا منفصلة": ["فيلا", "فيلات", "منفصلة", "حديقة خاصة"],
  "دوبلكس": ["دوبلكس", "طابقين", "روف"],
  "بنتهاوس": ["بنتهاوس", "روف", "إطلالة"],
  "تاون هاوس": ["تاون هاوس", "منزل", "حديقة"],
  "محل تجاري": ["محل", "تجاري", "استثمار", "إيجار"],
  "مقر إداري": ["مكتب", "إداري", "تجاري"],
  "عيادة": ["عيادة", "طبي", "مجمع طبي"],
  "أرض": ["أرض", "قطعة أرض", "بناء"],
  "مبنى تحت الإنشاء": ["تحت الإنشاء", "استلام", "تقسيط"],
  "شاليه": ["شاليه", "مصيف", "بحر"],
  "روف": ["روف", "سطح", "تراس"],
};

// District keywords for local SEO
const DISTRICT_KEYWORDS: Record<string, string[]> = {
  "الحي الأول": ["الحي الأول", "منطقة راقية", "قريب من الخدمات"],
  "الحي الثاني": ["الحي الثاني", "موقع متميز"],
  "الحي الثالث": ["الحي الثالث", "منطقة هادئة"],
  "الحي الرابع": ["الحي الرابع", "قريب من المدارس"],
  "الحي الخامس": ["الحي الخامس", "منطقة جديدة"],
  "الحي المتميز": ["الحي المتميز", "فيلات", "راقي"],
  "مشروع جنة": ["جنة", "مشروع جنة", "إسكان اجتماعي"],
  "الإسكان الاجتماعي": ["إسكان اجتماعي", "دعم حكومي"],
  "المنصورة الجديدة": ["المنصورة الجديدة", "سكن لكل المصريين", "دار مصر"],
};

/**
 * Format price in Arabic with SEO-friendly text
 */
function formatPriceSEO(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    if (millions === Math.floor(millions)) {
      return `${millions} مليون جنيه`;
    }
    return `${millions.toFixed(1)} مليون جنيه`;
  }
  return `${price.toLocaleString("ar-EG")} جنيه`;
}

/**
 * Generate SEO-optimized title for property
 * Format: [نوع العقار] [المساحة] متر [الحي] - [السعر] | دمياط الجديدة / المنصورة الجديدة
 */
export function generateSEOTitle(input: PropertySEOInput): string {
  const { type, district, area_sqm, price, bedrooms, level } = input;

  // Build title components
  const typeText = type;
  const areaText = `${area_sqm} متر`;
  const districtText = district;
  const priceText = formatPriceSEO(price);

  // Add bedroom info for residential
  const bedroomText = bedrooms > 0 ? `${bedrooms} غرف` : "";

  // Add level for apartments
  const levelText = level && !["أرض", "فيلا منفصلة"].includes(type)
    ? `${level}`
    : "";

  // Construct SEO title (max ~60 chars for search engines)
  let title = `${typeText} ${areaText}`;

  if (bedroomText) {
    title += ` ${bedroomText}`;
  }

  title += ` ${districtText}`;

  if (levelText) {
    title += ` ${levelText}`;
  }

  // Add price and location brand
  const cityLabel = input.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
  title += ` - ${priceText} | ${cityLabel}`;

  return title;
}

/**
 * Generate SEO-optimized description for property
 * Includes semantic keywords, structured content, and AI-friendly formatting
 */
export function generateSEODescription(input: PropertySEOInput): string {
  const {
    type,
    district,
    area_sqm,
    price,
    bedrooms,
    bathrooms,
    level,
    finishing,
    amenities,
    status,
    paymentType,
    description,
    cityId,
  } = input;

  const priceText = formatPriceSEO(price);

  const cityName = cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";

  // Opening statement with primary keywords
  let seoDescription = `${type} للبيع في ${district} - ${cityName}. `;

  // Property details section
  seoDescription += `المساحة: ${area_sqm} متر مربع. `;

  if (bedrooms > 0) {
    seoDescription += `${bedrooms} غرف نوم و ${bathrooms} حمام. `;
  }

  if (level) {
    seoDescription += `الدور: ${level}. `;
  }

  if (finishing) {
    seoDescription += `التشطيب: ${finishing}. `;
  }

  // Status and payment info
  if (status === "تحت الإنشاء") {
    seoDescription += `العقار تحت الإنشاء. `;
  } else if (status === "جاهز") {
    seoDescription += `جاهز للسكن والتسليم الفوري. `;
  }

  if (paymentType) {
    if (paymentType === "تقسيط" || paymentType === "كاش أو تقسيط") {
      seoDescription += `متاح التقسيط. `;
    }
  }

  // Amenities section (important for AI search)
  if (amenities && amenities.length > 0) {
    const topAmenities = amenities.slice(0, 5).join("، ");
    seoDescription += `المميزات: ${topAmenities}. `;
  }

  // Price call-to-action
  seoDescription += `السعر: ${priceText}. `;

  // Add user description if provided
  if (description && description.trim()) {
    seoDescription += description.trim() + " ";
  }

  // Closing with brand and location keywords
  seoDescription += `التيسير للعقارات - شريكك الموثوق في عقارات ${cityName}.`;

  return seoDescription;
}

/**
 * Generate meta keywords for property
 */
export function generateMetaKeywords(input: PropertySEOInput): string[] {
  const { type, district, area_sqm, finishing, amenities } = input;

  const cityName = input.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";

  const keywords: string[] = [
    ...PRIMARY_KEYWORDS,
    type,
    `${type} للبيع`,
    `${type} ${district}`,
    `${type} ${cityName}`,
    district,
    `عقارات ${district}`,
    `عقارات ${cityName}`,
    `${area_sqm} متر`,
  ];

  // Add type-specific keywords
  const typeKeywords = PROPERTY_TYPE_KEYWORDS[type] || [];
  keywords.push(...typeKeywords);

  // Add district-specific keywords
  const districtKeywords = DISTRICT_KEYWORDS[district] || [];
  keywords.push(...districtKeywords);

  // Add finishing keyword
  if (finishing) {
    keywords.push(finishing);
    keywords.push(`تشطيب ${finishing}`);
  }

  // Add top amenities as keywords
  if (amenities && amenities.length > 0) {
    keywords.push(...amenities.slice(0, 3));
  }

  // Remove duplicates
  return Array.from(new Set(keywords));
}

// نوع schema.org الصحيح لكل نوع عقار — كان كل شيء يُعلن "Residence" حتى المحل والأرض والعيادة
const SCHEMA_TYPE: Record<string, string> = {
  "شقة": "Apartment",
  "شقة فاخرة": "Apartment",
  "دوبلكس": "Apartment",
  "بنتهاوس": "Apartment",
  "روف": "Apartment",
  "فيلا منفصلة": "SingleFamilyResidence",
  "تاون هاوس": "House",
  "شاليه": "House",
};

/**
 * Schema.org structured data for a property page (JSON-LD).
 * RealEstateListing (الصفحة) → mainEntity (العقار نفسه بنوعه الصحيح) + Offer بالسعر وسعر المتر.
 * كل القيم حقائق من بيانات الإعلان؛ لا عبارات تسويقية داخل الـ schema.
 */
export function generatePropertySchema(property: Property): object {
  const cityId = property.location?.cityId || "new-damietta";
  const cityName = cityNameOf(cityId);
  const district = property.location?.district?.trim() || "";
  const districtSlug = getDistrictSlug(district);
  const propertyUrl = `${SITE_URL}/${cityId}/${districtSlug}/${property.id}/`;
  const d = property.details || ({} as Property["details"]);
  const images = property.images || [];
  const summary = buildPropertySummary(property);
  const sqm = pricePerSqm(property);
  const sold = property.status === "تم البيع";

  const schemaType = SCHEMA_TYPE[property.type] || "Place";
  const isAccommodation = schemaType !== "Place";

  const facts: Array<[string, string | number | undefined]> = [
    ["نوع العقار", property.type],
    ["المساحة (م²)", d.area_sqm > 0 ? d.area_sqm : undefined],
    ["الدور", d.level || undefined],
    ["التشطيب", d.finishing || undefined],
    ["حالة العقار", property.status],
    ["طريقة الدفع", property.payment?.type],
    ["المقدم (جنيه)", property.payment?.downPayment || undefined],
    ["القسط الشهري (جنيه)", property.payment?.monthlyInstallment || undefined],
    ["مدة التقسيط (سنوات)", property.payment?.installmentYears || undefined],
    ["سعر المتر (جنيه)", sqm || undefined],
  ];

  const address = {
    "@type": "PostalAddress",
    ...(district ? { addressLocality: district } : {}),
    addressRegion: cityName,
    addressCountry: "EG",
  };

  const mainEntity = {
    "@type": schemaType,
    name: property.title,
    ...(isAccommodation
      ? {
          ...(d.bedrooms > 0 ? { numberOfBedrooms: d.bedrooms, numberOfRooms: d.bedrooms } : {}),
          ...(d.bathrooms > 0 ? { numberOfBathroomsTotal: d.bathrooms } : {}),
          ...(d.area_sqm > 0
            ? { floorSize: { "@type": "QuantitativeValue", value: d.area_sqm, unitCode: "MTK" } }
            : {}),
        }
      : {}),
    address,
    containedInPlace: {
      "@type": "Place",
      name: district ? `${district}، ${cityName}` : cityName,
      ...(district ? { url: `${SITE_URL}/${cityId}/${districtSlug}/` } : {}),
    },
    additionalProperty: facts
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
    ...(property.amenities?.length
      ? {
          amenityFeature: property.amenities.map((a) => ({
            "@type": "LocationFeatureSpecification",
            name: a,
            value: true,
          })),
        }
      : {}),
    ...(images.length ? { image: images } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": propertyUrl,
    url: propertyUrl,
    name: property.title,
    description: summary,
    inLanguage: "ar-EG",
    isPartOf: { "@type": "WebSite", "@id": WEBSITE_ID },
    ...(property.createdAt ? { datePosted: new Date(property.createdAt).toISOString() } : {}),
    ...(images.length ? { image: images, primaryImageOfPage: { "@type": "ImageObject", url: images[0] } } : {}),
    mainEntity,
    offers: {
      "@type": "Offer",
      url: propertyUrl,
      price: property.price,
      priceCurrency: "EGP",
      businessFunction: "http://purl.org/goodrelations/v1#Sell",
      availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      ...(sqm
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: sqm,
              priceCurrency: "EGP",
              unitCode: "MTK",
              name: "سعر المتر المربع",
            },
          }
        : {}),
      // البائع هو نفس كيان الشركة المعرّف في كل الصفحات (@id) — لا نسخة مجهولة جديدة
      seller: { "@type": "RealEstateAgent", "@id": ORG_ID, name: ORG_NAME },
    },
  };
}

/**
 * Validate and enhance user-provided title for SEO
 */
export function enhanceTitle(userTitle: string, input: PropertySEOInput): string {
  // If user title is too short or generic, generate SEO title
  if (!userTitle || userTitle.length < 15) {
    return generateSEOTitle(input);
  }

  const cityName = input.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";

  // Check if title has key SEO elements
  const hasLocation =
    userTitle.includes("دمياط") ||
    userTitle.includes("المنصورة") ||
    userTitle.includes(input.district);
  const hasType = userTitle.includes(input.type);

  // If missing important elements, enhance the title
  if (!hasLocation && !hasType) {
    return `${userTitle} | ${input.type} ${input.district} - ${cityName}`;
  }

  if (!hasLocation) {
    return `${userTitle} | ${input.district} - ${cityName}`;
  }

  return userTitle;
}

/**
 * Validate and enhance user-provided description for SEO
 */
export function enhanceDescription(userDescription: string, input: PropertySEOInput): string {
  // If no user description, generate full SEO description
  if (!userDescription || userDescription.length < 30) {
    return generateSEODescription(input);
  }

  // Prepend key SEO info if missing
  const priceText = formatPriceSEO(input.price);
  const hasPrice = userDescription.includes("جنيه") || userDescription.includes("مليون");
  const hasAreaInfo = userDescription.includes("متر") || userDescription.includes("م²");

  let enhanced = userDescription;

  // Add property summary if key info missing
  if (!hasAreaInfo || !hasPrice) {
    const summary = `${input.type} ${input.area_sqm} متر في ${input.district}. السعر: ${priceText}. `;
    enhanced = summary + enhanced;
  }

  // Add closing brand if not present
  if (!enhanced.includes("التيسير")) {
    const cityName = input.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
    enhanced += ` | التيسير للعقارات - ${cityName}`;
  }

  return enhanced;
}
