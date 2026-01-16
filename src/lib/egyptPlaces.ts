// lib/egyptPlaces.ts
// Single Source of Truth for Egypt New Cities Geography
// التيسير للعقارات - البيانات الجغرافية الأساسية للمدن الجديدة

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  governorate: string;
  description: string;
  coordinates: { lat: number; lng: number };
  isActive: boolean;
}

export interface PlaceCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  districts: string[];
  color: string;
}

export interface CityData {
  city: City;
  categories: PlaceCategory[];
  allDistricts: readonly string[];
  propertyTypes: Record<string, readonly string[]>;
  priceMultipliers: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CITIES DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

export const CITIES: Record<string, City> = {
  "new-damietta": {
    id: "new-damietta",
    nameAr: "دمياط الجديدة",
    nameEn: "New Damietta",
    slug: "new-damietta",
    governorate: "دمياط",
    description: "مدينة دمياط الجديدة - مدينة صناعية وسكنية متكاملة على ساحل البحر المتوسط",
    coordinates: { lat: 31.4175, lng: 31.8144 },
    isActive: true,
  },
  "new-mansoura": {
    id: "new-mansoura",
    nameAr: "المنصورة الجديدة",
    nameEn: "New Mansoura",
    slug: "new-mansoura",
    governorate: "الدقهلية",
    description: "مدينة المنصورة الجديدة - مدينة الجيل الرابع على ساحل البحر المتوسط بمحافظة الدقهلية",
    coordinates: { lat: 31.4500, lng: 31.7000 },
    isActive: true,
  },
};

export const CITY_IDS = Object.keys(CITIES) as Array<keyof typeof CITIES>;
export type CityId = keyof typeof CITIES;

// ═══════════════════════════════════════════════════════════════════════════════
// دمياط الجديدة - NEW DAMIETTA
// ═══════════════════════════════════════════════════════════════════════════════

// Category 1: الأحياء السكنية (Residential Districts)
export const ND_RESIDENTIAL_DISTRICTS = [
  "الحي الأول",
  "الحي الثاني",
  "الحي الثالث",
  "الحي الرابع",
  "الحي الخامس",
  "الحي السادس (المتميز)",
] as const;

// Category 2: المشروعات القومية (National Projects)
export const ND_NATIONAL_PROJECTS = [
  "مشروع جنة",
  "دار مصر - موقع 1",
  "دار مصر - موقع 2",
  "سكن مصر - جنوب الحي الأول",
  "سكن مصر - غرب الجامعات",
] as const;

// Category 3: مناطق بيت الوطن (Bayt Al-Watan)
export const ND_BAYT_AL_WATAN = [
  "بيت الوطن - شرق",
  "بيت الوطن - غرب",
  "بيت الوطن - امتداد الشاطئ",
] as const;

// Category 4: المناطق المركزية والاستثمارية (Central & Investment)
export const ND_CENTRAL_INVESTMENT = [
  "المنطقة المركزية (أ)",
  "المنطقة المركزية (ب)",
  "المنطقة المركزية (ج)",
  "شمال الجامعة",
  "المنطقة الصناعية",
] as const;

// Category 5: المناطق الساحلية (Coastal)
export const ND_COASTAL_AREAS = [
  "منطقة الشاليهات",
] as const;

// New Damietta Categories
export const ND_PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: "nd-residential",
    nameAr: "الأحياء السكنية",
    nameEn: "Residential Districts",
    districts: [...ND_RESIDENTIAL_DISTRICTS],
    color: "bg-orange-500",
  },
  {
    id: "nd-national",
    nameAr: "المشروعات القومية",
    nameEn: "National Projects",
    districts: [...ND_NATIONAL_PROJECTS],
    color: "bg-blue-500",
  },
  {
    id: "nd-bayt-al-watan",
    nameAr: "بيت الوطن",
    nameEn: "Bayt Al-Watan",
    districts: [...ND_BAYT_AL_WATAN],
    color: "bg-amber-500",
  },
  {
    id: "nd-central",
    nameAr: "المناطق المركزية والاستثمارية",
    nameEn: "Central & Investment",
    districts: [...ND_CENTRAL_INVESTMENT],
    color: "bg-purple-500",
  },
  {
    id: "nd-coastal",
    nameAr: "المناطق الساحلية",
    nameEn: "Coastal",
    districts: [...ND_COASTAL_AREAS],
    color: "bg-cyan-500",
  },
];

// All New Damietta Districts
export const ND_ALL_DISTRICTS = [
  ...ND_RESIDENTIAL_DISTRICTS,
  ...ND_NATIONAL_PROJECTS,
  ...ND_BAYT_AL_WATAN,
  ...ND_CENTRAL_INVESTMENT,
  ...ND_COASTAL_AREAS,
] as const;

// New Damietta Property Types by Zone
export const ND_PROPERTY_TYPES = {
  residential: ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس"],
  national: ["شقة"],
  baytAlWatan: ["أرض", "مبنى تحت الإنشاء"],
  central: ["محل تجاري", "مقر إداري", "عيادة"],
  coastal: ["شاليه", "روف"],
  luxury: ["فيلا منفصلة", "شقة فاخرة", "تاون هاوس"],
} as const;

// New Damietta Price Multipliers
export const ND_PRICE_MULTIPLIERS: Record<string, number> = {
  "الحي السادس (المتميز)": 1.5,
  "مشروع جنة": 1.4,
  "منطقة الشاليهات": 1.3,
  "المنطقة المركزية (أ)": 1.2,
  "بيت الوطن - شرق": 1.15,
  "بيت الوطن - غرب": 1.15,
};

// ═══════════════════════════════════════════════════════════════════════════════
// المنصورة الجديدة - NEW MANSOURA
// ═══════════════════════════════════════════════════════════════════════════════

// Category 1: الأحياء السكنية (Residential Districts)
export const NM_RESIDENTIAL_DISTRICTS = [
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "R6",
  "R7",
  "الحي السكني الأول",
  "الحي السكني الثاني",
  "الحي السكني الثالث",
] as const;

// Category 2: المشروعات القومية (National Projects)
export const NM_NATIONAL_PROJECTS = [
  "سكن لكل المصريين",
  "سكن لكل المصريين 2",
  "سكن لكل المصريين 3",
  "دار مصر",
  "جنة",
  "الإسكان المتوسط",
  "الإسكان الاجتماعي",
] as const;

// Category 3: مناطق الفيلات (Villas Areas)
export const NM_VILLAS_AREAS = [
  "حي الفيلات",
  "منطقة الفيلات D",
  "فيلات الجولف",
  "فيلات البحيرات",
] as const;

// Category 4: المناطق التجارية والإدارية (Commercial & Business)
export const NM_COMMERCIAL_AREAS = [
  "داون تاون",
  "المول التجاري المركزي",
  "منطقة الأعمال المركزية CBD",
  "المحور التجاري",
  "منطقة الخدمات",
] as const;

// Category 5: المناطق الترفيهية والخدمية (Entertainment & Services)
export const NM_ENTERTAINMENT_AREAS = [
  "الحديقة المركزية",
  "منطقة الكورنيش",
  "النادي الاجتماعي",
  "المنطقة السياحية",
] as const;

// Category 6: المناطق الساحلية (Coastal)
export const NM_COASTAL_AREAS = [
  "الواجهة البحرية",
  "شاطئ المنصورة الجديدة",
  "منتجعات الساحل",
] as const;

// New Mansoura Categories
export const NM_PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: "nm-residential",
    nameAr: "الأحياء السكنية",
    nameEn: "Residential Districts",
    districts: [...NM_RESIDENTIAL_DISTRICTS],
    color: "bg-emerald-500",
  },
  {
    id: "nm-national",
    nameAr: "المشروعات القومية",
    nameEn: "National Projects",
    districts: [...NM_NATIONAL_PROJECTS],
    color: "bg-blue-500",
  },
  {
    id: "nm-villas",
    nameAr: "مناطق الفيلات",
    nameEn: "Villas Areas",
    districts: [...NM_VILLAS_AREAS],
    color: "bg-amber-600",
  },
  {
    id: "nm-commercial",
    nameAr: "المناطق التجارية والإدارية",
    nameEn: "Commercial & Business",
    districts: [...NM_COMMERCIAL_AREAS],
    color: "bg-purple-500",
  },
  {
    id: "nm-entertainment",
    nameAr: "المناطق الترفيهية",
    nameEn: "Entertainment & Services",
    districts: [...NM_ENTERTAINMENT_AREAS],
    color: "bg-pink-500",
  },
  {
    id: "nm-coastal",
    nameAr: "المناطق الساحلية",
    nameEn: "Coastal",
    districts: [...NM_COASTAL_AREAS],
    color: "bg-cyan-500",
  },
];

// All New Mansoura Districts
export const NM_ALL_DISTRICTS = [
  ...NM_RESIDENTIAL_DISTRICTS,
  ...NM_NATIONAL_PROJECTS,
  ...NM_VILLAS_AREAS,
  ...NM_COMMERCIAL_AREAS,
  ...NM_ENTERTAINMENT_AREAS,
  ...NM_COASTAL_AREAS,
] as const;

// New Mansoura Property Types by Zone
export const NM_PROPERTY_TYPES = {
  residential: ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس", "استوديو"],
  national: ["شقة"],
  villas: ["فيلا منفصلة", "فيلا توين", "تاون هاوس", "تاون ميدل", "تاون كورنر"],
  commercial: ["محل تجاري", "مكتب إداري", "عيادة", "صيدلية", "مطعم"],
  entertainment: ["شاليه", "استوديو"],
  coastal: ["شاليه", "فيلا شاطئية", "روف بحري"],
} as const;

// New Mansoura Price Multipliers (أسعار أعلى كمدينة جيل رابع)
export const NM_PRICE_MULTIPLIERS: Record<string, number> = {
  "الواجهة البحرية": 1.8,
  "فيلات الجولف": 1.7,
  "حي الفيلات": 1.6,
  "داون تاون": 1.5,
  "منطقة الأعمال المركزية CBD": 1.5,
  "منتجعات الساحل": 1.45,
  "R1": 1.3,
  "R2": 1.25,
  "جنة": 1.4,
  "دار مصر": 1.35,
};

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════════════════

// City Data Map
export const CITY_DATA: Record<CityId, CityData> = {
  "new-damietta": {
    city: CITIES["new-damietta"],
    categories: ND_PLACE_CATEGORIES,
    allDistricts: ND_ALL_DISTRICTS,
    propertyTypes: ND_PROPERTY_TYPES,
    priceMultipliers: ND_PRICE_MULTIPLIERS,
  },
  "new-mansoura": {
    city: CITIES["new-mansoura"],
    categories: NM_PLACE_CATEGORIES,
    allDistricts: NM_ALL_DISTRICTS,
    propertyTypes: NM_PROPERTY_TYPES,
    priceMultipliers: NM_PRICE_MULTIPLIERS,
  },
};

// All Districts from All Cities (for global filters)
export const ALL_DISTRICTS_GLOBAL = [
  ...ND_ALL_DISTRICTS,
  ...NM_ALL_DISTRICTS,
] as const;

// All Categories from All Cities
export const ALL_PLACE_CATEGORIES = [
  ...ND_PLACE_CATEGORIES,
  ...NM_PLACE_CATEGORIES,
];

// ═══════════════════════════════════════════════════════════════════════════════
// DISTRICT SLUG MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════════

// New Damietta District Slugs
export const ND_DISTRICT_SLUGS: Record<string, string> = {
  "first-district": "الحي الأول",
  "second-district": "الحي الثاني",
  "third-district": "الحي الثالث",
  "fourth-district": "الحي الرابع",
  "fifth-district": "الحي الخامس",
  "sixth-district": "الحي السادس (المتميز)",
  "janna-project": "مشروع جنة",
  "dar-misr-1": "دار مصر - موقع 1",
  "dar-misr-2": "دار مصر - موقع 2",
  "sakan-misr-south": "سكن مصر - جنوب الحي الأول",
  "sakan-misr-west": "سكن مصر - غرب الجامعات",
  "beit-al-watan-east": "بيت الوطن - شرق",
  "beit-al-watan-west": "بيت الوطن - غرب",
  "beit-al-watan-beach": "بيت الوطن - امتداد الشاطئ",
  "central-area-a": "المنطقة المركزية (أ)",
  "central-area-b": "المنطقة المركزية (ب)",
  "central-area-c": "المنطقة المركزية (ج)",
  "north-university": "شمال الجامعة",
  "industrial-zone": "المنطقة الصناعية",
  "chalets": "منطقة الشاليهات",
};

// New Mansoura District Slugs
export const NM_DISTRICT_SLUGS: Record<string, string> = {
  "r1": "R1",
  "r2": "R2",
  "r3": "R3",
  "r4": "R4",
  "r5": "R5",
  "r6": "R6",
  "r7": "R7",
  "residential-1": "الحي السكني الأول",
  "residential-2": "الحي السكني الثاني",
  "residential-3": "الحي السكني الثالث",
  "sakan-kol-misryeen": "سكن لكل المصريين",
  "sakan-kol-misryeen-2": "سكن لكل المصريين 2",
  "sakan-kol-misryeen-3": "سكن لكل المصريين 3",
  "dar-misr": "دار مصر",
  "janna": "جنة",
  "middle-housing": "الإسكان المتوسط",
  "social-housing": "الإسكان الاجتماعي",
  "villas-district": "حي الفيلات",
  "villas-d": "منطقة الفيلات D",
  "golf-villas": "فيلات الجولف",
  "lakes-villas": "فيلات البحيرات",
  "downtown": "داون تاون",
  "central-mall": "المول التجاري المركزي",
  "cbd": "منطقة الأعمال المركزية CBD",
  "commercial-axis": "المحور التجاري",
  "services-zone": "منطقة الخدمات",
  "central-park": "الحديقة المركزية",
  "corniche": "منطقة الكورنيش",
  "social-club": "النادي الاجتماعي",
  "touristic-zone": "المنطقة السياحية",
  "waterfront": "الواجهة البحرية",
  "beach": "شاطئ المنصورة الجديدة",
  "coastal-resorts": "منتجعات الساحل",
};

// Combined slugs for all cities
export const ALL_DISTRICT_SLUGS: Record<string, { district: string; cityId: CityId }> = {
  // New Damietta
  ...Object.fromEntries(
    Object.entries(ND_DISTRICT_SLUGS).map(([slug, district]) => [
      slug,
      { district, cityId: "new-damietta" as CityId },
    ])
  ),
  // New Mansoura (with nm- prefix to avoid conflicts)
  ...Object.fromEntries(
    Object.entries(NM_DISTRICT_SLUGS).map(([slug, district]) => [
      `nm-${slug}`,
      { district, cityId: "new-mansoura" as CityId },
    ])
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON DATA (Shared between cities)
// ═══════════════════════════════════════════════════════════════════════════════

// Finishing Types
export const FINISHING_TYPES = [
  "طوب أحمر",
  "نصف تشطيب",
  "تشطيب كامل",
  "سوبر لوكس",
  "الترا سوبر لوكس",
  "لوكس",
] as const;

// Amenities
export const AMENITIES = [
  "عداد مياه",
  "عداد كهرباء",
  "عداد غاز",
  "أسانسير",
  "جراج خاص",
  "حديقة خاصة",
  "أمن وحراسة",
  "انتركم",
  "تكييف مركزي",
  "فيو بحر",
  "فيو حديقة",
  "فيو بحيرات",
  "قريب من المسجد",
  "قريب من المدارس",
  "قريب من الجامعة",
  "قريب من المستشفى",
  "قريب من المول",
  "كلوب هاوس",
  "حمام سباحة",
  "جيم",
  "سبا",
  "ملاعب رياضية",
] as const;

// Floor Levels
export const FLOOR_LEVELS = [
  "أرضي",
  "الدور الأول",
  "الدور الثاني",
  "الدور الثالث",
  "الدور الرابع",
  "الدور الخامس",
  "الدور السادس",
  "الدور السابع",
  "الدور الثامن",
  "الأخير",
  "روف",
  "متعدد الأدوار",
] as const;

// All Property Types
export const ALL_PROPERTY_TYPES = [
  "شقة",
  "شقة فاخرة",
  "فيلا منفصلة",
  "فيلا توين",
  "دوبلكس",
  "بنتهاوس",
  "تاون هاوس",
  "تاون ميدل",
  "تاون كورنر",
  "محل تجاري",
  "مكتب إداري",
  "مقر إداري",
  "عيادة",
  "صيدلية",
  "مطعم",
  "أرض",
  "مبنى تحت الإنشاء",
  "شاليه",
  "روف",
  "استوديو",
  "فيلا شاطئية",
  "روف بحري",
] as const;

// Street Names (Common)
export const STREET_NAMES = [
  "شارع الجمهورية",
  "شارع النصر",
  "شارع الجلاء",
  "شارع التحرير",
  "شارع المستشفى",
  "شارع الجامعة",
  "شارع البحر",
  "شارع النيل",
  "شارع الكورنيش",
  "الشارع الرئيسي",
  "شارع المدارس",
  "شارع السوق",
  "المحور المركزي",
  "الممشى السياحي",
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get city data by ID
 */
export function getCityData(cityId: CityId): CityData {
  return CITY_DATA[cityId];
}

/**
 * Get city by district name
 */
export function getCityByDistrict(district: string): City | undefined {
  if (ND_ALL_DISTRICTS.includes(district as typeof ND_ALL_DISTRICTS[number])) {
    return CITIES["new-damietta"];
  }
  if (NM_ALL_DISTRICTS.includes(district as typeof NM_ALL_DISTRICTS[number])) {
    return CITIES["new-mansoura"];
  }
  return undefined;
}

/**
 * Get category by district
 */
export function getCategoryByDistrict(district: string, cityId?: CityId): PlaceCategory | undefined {
  const categories = cityId 
    ? CITY_DATA[cityId].categories 
    : ALL_PLACE_CATEGORIES;
  return categories.find((cat) => cat.districts.includes(district));
}

/**
 * Get district color by district name
 */
export function getDistrictColor(district: string): string {
  const category = getCategoryByDistrict(district);
  return category?.color || "bg-gray-500";
}

/**
 * Get categories by city
 */
export function getCategoriesByCity(cityId: CityId): PlaceCategory[] {
  return CITY_DATA[cityId].categories;
}

/**
 * Get districts by city
 */
export function getDistrictsByCity(cityId: CityId): readonly string[] {
  return CITY_DATA[cityId].allDistricts;
}

/**
 * Get price multiplier for a district
 */
export function getPriceMultiplier(district: string, cityId?: CityId): number {
  if (cityId) {
    return CITY_DATA[cityId].priceMultipliers[district] || 1;
  }
  // Check both cities
  return ND_PRICE_MULTIPLIERS[district] || NM_PRICE_MULTIPLIERS[district] || 1;
}

/**
 * Get district from slug
 */
export function getDistrictFromSlug(slug: string, cityId?: CityId): string | undefined {
  if (cityId === "new-damietta") {
    return ND_DISTRICT_SLUGS[slug];
  }
  if (cityId === "new-mansoura") {
    return NM_DISTRICT_SLUGS[slug];
  }
  // Check both
  return ND_DISTRICT_SLUGS[slug] || NM_DISTRICT_SLUGS[slug.replace("nm-", "")];
}

/**
 * Get slug from district name
 */
export function getSlugFromDistrict(district: string): string | undefined {
  // Check New Damietta
  const ndEntry = Object.entries(ND_DISTRICT_SLUGS).find(([, d]) => d === district);
  if (ndEntry) return ndEntry[0];
  
  // Check New Mansoura
  const nmEntry = Object.entries(NM_DISTRICT_SLUGS).find(([, d]) => d === district);
  if (nmEntry) return `nm-${nmEntry[0]}`;
  
  return undefined;
}

/**
 * Get all active cities
 */
export function getActiveCities(): City[] {
  return Object.values(CITIES).filter((city) => city.isActive);
}

/**
 * Check if district belongs to city
 */
export function isDistrictInCity(district: string, cityId: CityId): boolean {
  const districts = CITY_DATA[cityId].allDistricts;
  return districts.includes(district as typeof districts[number]);
}

/**
 * Get base price per sqm by property type and city
 */
export function getBasePricePerSqm(type: string, cityId: CityId): number {
  // Base prices (New Mansoura is generally higher as 4th generation city)
  const basePrices: Record<string, { nd: number; nm: number }> = {
    "شقة": { nd: 25000, nm: 35000 },
    "شقة فاخرة": { nd: 40000, nm: 55000 },
    "فيلا منفصلة": { nd: 50000, nm: 70000 },
    "فيلا توين": { nd: 45000, nm: 60000 },
    "تاون هاوس": { nd: 40000, nm: 55000 },
    "دوبلكس": { nd: 35000, nm: 48000 },
    "بنتهاوس": { nd: 45000, nm: 60000 },
    "محل تجاري": { nd: 60000, nm: 85000 },
    "مكتب إداري": { nd: 45000, nm: 65000 },
    "مقر إداري": { nd: 45000, nm: 65000 },
    "عيادة": { nd: 50000, nm: 70000 },
    "أرض": { nd: 15000, nm: 25000 },
    "مبنى تحت الإنشاء": { nd: 20000, nm: 30000 },
    "شاليه": { nd: 35000, nm: 50000 },
    "روف": { nd: 30000, nm: 42000 },
    "استوديو": { nd: 28000, nm: 40000 },
  };

  const prices = basePrices[type] || { nd: 25000, nm: 35000 };
  return cityId === "new-damietta" ? prices.nd : prices.nm;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKWARDS COMPATIBILITY (with damiettaPlaces.ts)
// ═══════════════════════════════════════════════════════════════════════════════

// Re-export New Damietta data with original names for backwards compatibility
export const RESIDENTIAL_DISTRICTS = ND_RESIDENTIAL_DISTRICTS;
export const NATIONAL_PROJECTS = ND_NATIONAL_PROJECTS;
export const BAYT_AL_WATAN = ND_BAYT_AL_WATAN;
export const CENTRAL_INVESTMENT = ND_CENTRAL_INVESTMENT;
export const COASTAL_AREAS = ND_COASTAL_AREAS;
export const PLACE_CATEGORIES = ND_PLACE_CATEGORIES;
export const ALL_DISTRICTS = ND_ALL_DISTRICTS;
export const PROPERTY_TYPES = ND_PROPERTY_TYPES;

export type District = typeof ALL_DISTRICTS_GLOBAL[number];
