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
 * Format: [نوع العقار] [المساحة] متر [الحي] - [السعر] | دمياط الجديدة
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
  title += ` - ${priceText} | دمياط الجديدة`;
  
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
  } = input;

  const priceText = formatPriceSEO(price);
  
  // Opening statement with primary keywords
  let seoDescription = `${type} للبيع في ${district} - دمياط الجديدة. `;
  
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
  seoDescription += `التيسير للعقارات - شريكك الموثوق في عقارات دمياط الجديدة.`;
  
  return seoDescription;
}

/**
 * Generate meta keywords for property
 */
export function generateMetaKeywords(input: PropertySEOInput): string[] {
  const { type, district, area_sqm, finishing, amenities } = input;
  
  const keywords: string[] = [
    ...PRIMARY_KEYWORDS,
    type,
    `${type} للبيع`,
    `${type} ${district}`,
    `${type} دمياط الجديدة`,
    district,
    `عقارات ${district}`,
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

/**
 * Generate Schema.org structured data for property (JSON-LD)
 * Optimized for Google and AI search engines
 */
export function generatePropertySchema(
  input: PropertySEOInput & { 
    id: string; 
    title: string; 
    images: string[];
    contact_whatsapp: string;
  }
): object {
  const {
    id,
    title,
    district,
    area_sqm,
    price,
    bedrooms,
    bathrooms,
    images,
    status,
  } = input;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `https://eltaiseer.com/property/${id}`,
    name: title,
    description: generateSEODescription(input),
    url: `https://eltaiseer.com/property/${id}`,
    datePosted: new Date().toISOString(),
    
    // Property details
    about: {
      "@type": "Residence",
      name: title,
      numberOfRooms: bedrooms,
      numberOfBathroomsTotal: bathrooms,
      floorSize: {
        "@type": "QuantitativeValue",
        value: area_sqm,
        unitCode: "MTK", // Square meters
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: district,
        addressRegion: "دمياط الجديدة",
        addressCountry: "EG",
      },
    },
    
    // Price
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "EGP",
      availability: status === "تم البيع" 
        ? "https://schema.org/SoldOut" 
        : "https://schema.org/InStock",
    },
    
    // Images
    image: images.length > 0 ? images : undefined,
    
    // Seller info
    seller: {
      "@type": "RealEstateAgent",
      name: "التيسير للعقارات",
      telephone: "+201558245974",
      url: "https://eltaiseer.com",
    },
    
    // Location
    contentLocation: {
      "@type": "Place",
      name: `${district}، دمياط الجديدة`,
      address: {
        "@type": "PostalAddress",
        addressLocality: district,
        addressRegion: "دمياط الجديدة",
        addressCountry: "مصر",
      },
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
  
  // Check if title has key SEO elements
  const hasLocation = userTitle.includes("دمياط") || userTitle.includes(input.district);
  const hasType = userTitle.includes(input.type);
  
  // If missing important elements, enhance the title
  if (!hasLocation && !hasType) {
    return `${userTitle} | ${input.type} ${input.district} - دمياط الجديدة`;
  }
  
  if (!hasLocation) {
    return `${userTitle} | ${input.district} - دمياط الجديدة`;
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
    enhanced += " | التيسير للعقارات - دمياط الجديدة";
  }
  
  return enhanced;
}
