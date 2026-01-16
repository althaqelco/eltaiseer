// lib/mockData.ts
// Mock Data Engine for El Taiseer Real Estate
// التيسير للعقارات - محرك البيانات التجريبية
// يدعم: دمياط الجديدة + المنصورة الجديدة

import {
  // New Damietta
  ND_RESIDENTIAL_DISTRICTS,
  ND_NATIONAL_PROJECTS,
  ND_BAYT_AL_WATAN,
  ND_CENTRAL_INVESTMENT,
  ND_COASTAL_AREAS,
  ND_PROPERTY_TYPES,
  // New Mansoura
  NM_RESIDENTIAL_DISTRICTS,
  NM_NATIONAL_PROJECTS,
  NM_VILLAS_AREAS,
  NM_COMMERCIAL_AREAS,
  NM_ENTERTAINMENT_AREAS,
  NM_COASTAL_AREAS,
  NM_PROPERTY_TYPES,
  // Common
  FINISHING_TYPES,
  AMENITIES,
  FLOOR_LEVELS,
  STREET_NAMES,
  // Helpers
  CITIES,
  CityId,
  getBasePricePerSqm,
  getPriceMultiplier,
} from "./egyptPlaces";

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: "EGP";
  category: "بيع"; // الموقع متخصص فقط في البيع
  type: string;
  location: {
    city: "دمياط الجديدة" | "المنصورة الجديدة";
    cityId: CityId;
    district: string;
    address: string;
  };
  details: {
    area_sqm: number;
    bedrooms: number;
    bathrooms: number;
    level: string;
    finishing: string;
  };
  payment: {
    type: "كاش" | "تقسيط" | "كاش أو تقسيط";
    downPayment?: number; // المقدم
    monthlyInstallment?: number; // القسط الشهري
    installmentYears?: number; // مدة التقسيط بالسنوات
  };
  status: "جاهز" | "تحت الإنشاء" | "تم البيع"; // حالة العقار
  amenities: string[];
  images: string[];
  contact_whatsapp: string;
  isVerified: boolean;
  createdAt: Date;
}

// Utility functions
function randomFrom<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSubset<T>(arr: readonly T[] | T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateWhatsApp(): string {
  const prefixes = ["0100", "0101", "0102", "0106", "0109", "0111", "0112", "0114", "0115", "0120", "0122", "0127", "0128"];
  return `${randomFrom(prefixes)}${randomInt(1000000, 9999999)}`;
}

function generateAddress(): string {
  const streetName = randomFrom(STREET_NAMES);
  const buildingNum = randomInt(1, 150);
  return `${buildingNum} ${streetName}`;
}

// Placeholder images based on property type
function getImages(type: string): string[] {
  const baseUrl = "https://images.unsplash.com";
  
  const imagesByType: Record<string, string[]> = {
    "شقة": [
      `${baseUrl}/photo-1522708323590-d24dbb6b0267?w=800`,
      `${baseUrl}/photo-1502672260266-1c1ef2d93688?w=800`,
      `${baseUrl}/photo-1560448204-e02f11c3d0e2?w=800`,
    ],
    "شقة فاخرة": [
      `${baseUrl}/photo-1600596542815-ffad4c1539a9?w=800`,
      `${baseUrl}/photo-1600607687939-ce8a6c25118c?w=800`,
      `${baseUrl}/photo-1600566753190-17f0baa2a6c3?w=800`,
    ],
    "فيلا منفصلة": [
      `${baseUrl}/photo-1613490493576-7fde63acd811?w=800`,
      `${baseUrl}/photo-1600585154340-be6161a56a0c?w=800`,
      `${baseUrl}/photo-1600047509807-ba8f99d2cdde?w=800`,
    ],
    "فيلا توين": [
      `${baseUrl}/photo-1613490493576-7fde63acd811?w=800`,
      `${baseUrl}/photo-1600585154340-be6161a56a0c?w=800`,
    ],
    "محل تجاري": [
      `${baseUrl}/photo-1441986300917-64674bd600d8?w=800`,
      `${baseUrl}/photo-1604719312566-8912e9227c6a?w=800`,
    ],
    "مقر إداري": [
      `${baseUrl}/photo-1497366216548-37526070297c?w=800`,
      `${baseUrl}/photo-1497366811353-6870744d04b2?w=800`,
    ],
    "مكتب إداري": [
      `${baseUrl}/photo-1497366216548-37526070297c?w=800`,
      `${baseUrl}/photo-1497366811353-6870744d04b2?w=800`,
    ],
    "عيادة": [
      `${baseUrl}/photo-1629909613654-28e377c37b09?w=800`,
      `${baseUrl}/photo-1631217868264-e5b90bb7e133?w=800`,
    ],
    "أرض": [
      `${baseUrl}/photo-1500382017468-9049fed747ef?w=800`,
      `${baseUrl}/photo-1628624747186-a941c476b7ef?w=800`,
    ],
    "مبنى تحت الإنشاء": [
      `${baseUrl}/photo-1504307651254-35680f356dfd?w=800`,
      `${baseUrl}/photo-1541888946425-d81bb19240f5?w=800`,
    ],
    "شاليه": [
      `${baseUrl}/photo-1499793983690-e29da59ef1c2?w=800`,
      `${baseUrl}/photo-1520250497591-112f2f40a3f4?w=800`,
    ],
    "روف": [
      `${baseUrl}/photo-1600566753086-00f18fb6b3ea?w=800`,
      `${baseUrl}/photo-1600585154526-990dced4db0d?w=800`,
    ],
    "دوبلكس": [
      `${baseUrl}/photo-1600047509358-9dc75507daeb?w=800`,
      `${baseUrl}/photo-1600566752355-35792bedcfea?w=800`,
    ],
    "بنتهاوس": [
      `${baseUrl}/photo-1600607687644-c7171b42498f?w=800`,
      `${baseUrl}/photo-1600566752734-2a0e4f51d0a0?w=800`,
    ],
    "تاون هاوس": [
      `${baseUrl}/photo-1600585154363-67eb9e2e2099?w=800`,
      `${baseUrl}/photo-1600047509782-20d39509f26d?w=800`,
    ],
    "استوديو": [
      `${baseUrl}/photo-1522708323590-d24dbb6b0267?w=800`,
      `${baseUrl}/photo-1502672260266-1c1ef2d93688?w=800`,
    ],
    "فيلا شاطئية": [
      `${baseUrl}/photo-1499793983690-e29da59ef1c2?w=800`,
      `${baseUrl}/photo-1613490493576-7fde63acd811?w=800`,
    ],
  };
  
  return imagesByType[type] || imagesByType["شقة"];
}

// Generate title based on type, district and city
function generateTitle(type: string, district: string, area: number, level: string, cityName?: string): string {
  const cityPrefix = cityName ? ` - ${cityName}` : "";
  const titles: Record<string, (d: string, a: number, l: string) => string> = {
    "شقة": (d, a) => `شقة ${a} متر ${d}${cityPrefix}`,
    "شقة فاخرة": (d, a) => `شقة فاخرة ${a} متر بـ${d}${cityPrefix}`,
    "فيلا منفصلة": (d, a) => `فيلا منفصلة ${a} متر ${d}${cityPrefix}`,
    "فيلا توين": (d, a) => `فيلا توين ${a} متر ${d}${cityPrefix}`,
    "محل تجاري": (d, a) => `محل تجاري ${a} متر ب${d}${cityPrefix}`,
    "مقر إداري": (d, a) => `مقر إداري ${a} متر ${d}${cityPrefix}`,
    "مكتب إداري": (d, a) => `مكتب إداري ${a} متر ${d}${cityPrefix}`,
    "عيادة": (d, a) => `عيادة ${a} متر ب${d}${cityPrefix}`,
    "أرض": (d, a) => `قطعة أرض ${a} متر ${d}${cityPrefix}`,
    "مبنى تحت الإنشاء": (d, a) => `مبنى تحت الإنشاء ${a} متر ${d}${cityPrefix}`,
    "شاليه": (d, a) => `شاليه ${a} متر ${d}${cityPrefix}`,
    "روف": (d, a, l) => `روف ${a} متر ${l} ${d}${cityPrefix}`,
    "دوبلكس": (d, a) => `دوبلكس ${a} متر ${d}${cityPrefix}`,
    "بنتهاوس": (d, a) => `بنتهاوس ${a} متر ${d}${cityPrefix}`,
    "تاون هاوس": (d, a) => `تاون هاوس ${a} متر ${d}${cityPrefix}`,
    "استوديو": (d, a) => `استوديو ${a} متر ${d}${cityPrefix}`,
    "فيلا شاطئية": (d, a) => `فيلا شاطئية ${a} متر ${d}${cityPrefix}`,
  };
  
  return titles[type]?.(district, area, level) || `عقار ${area} متر ${district}${cityPrefix}`;
}

// Price ranges by type, zone and city
function generatePrice(type: string, area: number, district: string, cityId: CityId): number {
  // Get base price from egyptPlaces
  const basePrice = getBasePricePerSqm(type, cityId);
  
  // Get location multiplier
  const multiplier = getPriceMultiplier(district, cityId);
  
  // Random variance (80% - 120%)
  const variance = 0.8 + Math.random() * 0.4;
  
  return Math.round((basePrice * area * multiplier * variance) / 10000) * 10000;
}

// Generate property based on district type and city
function generatePropertyForDistrict(district: string, id: number, cityId: CityId): Property {
  let type: string;
  const category = "بيع" as const; // الموقع متخصص فقط في البيع
  let area: number;
  let bedrooms: number;
  let bathrooms: number;
  let level: string;
  let finishing: string;
  let amenities: string[];
  
  const city = CITIES[cityId];
  const cityName = city.nameAr;
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // NEW DAMIETTA LOGIC
  // ═══════════════════════════════════════════════════════════════════════════════
  if (cityId === "new-damietta") {
    if (ND_CENTRAL_INVESTMENT.includes(district as typeof ND_CENTRAL_INVESTMENT[number])) {
      // Central & Investment - Commercial properties
      type = randomFrom([...ND_PROPERTY_TYPES.central]);
      area = randomInt(30, 200);
      bedrooms = 0;
      bathrooms = type === "عيادة" ? randomInt(1, 2) : 1;
      level = randomFrom(["أرضي", "الدور الأول", "الدور الثاني"]);
      finishing = randomFrom(["تشطيب كامل", "نصف تشطيب", "طوب أحمر"]);
      amenities = randomSubset(["عداد مياه", "عداد كهرباء", "أسانسير", "أمن وحراسة"], randomInt(2, 4));
      
    } else if (ND_BAYT_AL_WATAN.includes(district as typeof ND_BAYT_AL_WATAN[number])) {
      // Bayt Al-Watan - Land and Under Construction
      type = Math.random() > 0.4 ? "أرض" : "مبنى تحت الإنشاء";
      area = randomInt(200, 600);
      bedrooms = type === "أرض" ? 0 : randomInt(3, 6);
      bathrooms = type === "أرض" ? 0 : randomInt(2, 4);
      level = type === "أرض" ? "-" : "متعدد الأدوار";
      finishing = type === "أرض" ? "-" : "طوب أحمر";
      amenities = type === "أرض" 
        ? randomSubset(["عداد مياه", "عداد كهرباء"], randomInt(1, 2))
        : randomSubset(["عداد مياه", "عداد كهرباء", "جراج خاص"], randomInt(2, 3));
      
    } else if (ND_NATIONAL_PROJECTS.includes(district as typeof ND_NATIONAL_PROJECTS[number])) {
      // National Projects - Apartments in compounds
      type = "شقة";
      area = randomInt(90, 180);
      bedrooms = randomInt(2, 4);
      bathrooms = randomInt(1, 2);
      level = randomFrom(FLOOR_LEVELS.filter(l => l !== "روف" && l !== "أرضي" && l !== "متعدد الأدوار"));
      finishing = district === "مشروع جنة" ? "سوبر لوكس" : randomFrom(["تشطيب كامل", "سوبر لوكس"]);
      amenities = randomSubset(["عداد مياه", "عداد كهرباء", "عداد غاز", "أسانسير", "أمن وحراسة", "حديقة خاصة"], randomInt(3, 5));
      
    } else if (ND_COASTAL_AREAS.includes(district as typeof ND_COASTAL_AREAS[number])) {
      // Coastal - Chalets and Roofs
      type = randomFrom([...ND_PROPERTY_TYPES.coastal]);
      area = randomInt(60, 150);
      bedrooms = randomInt(2, 3);
      bathrooms = randomInt(1, 2);
      level = type === "روف" ? "روف" : randomFrom(["أرضي", "الدور الأول", "الدور الثاني"]);
      finishing = randomFrom(["تشطيب كامل", "سوبر لوكس"]);
      amenities = ["فيو بحر", ...randomSubset(["عداد مياه", "عداد كهرباء", "تكييف مركزي", "حديقة خاصة"], randomInt(2, 4))];
      
    } else if (district === "الحي السادس (المتميز)") {
      // District 6 - Luxury properties
      type = randomFrom([...ND_PROPERTY_TYPES.luxury]);
      area = type === "فيلا منفصلة" ? randomInt(250, 500) : randomInt(150, 300);
      bedrooms = type === "فيلا منفصلة" ? randomInt(4, 6) : randomInt(3, 4);
      bathrooms = randomInt(2, 4);
      level = type === "فيلا منفصلة" ? "متعدد الأدوار" : randomFrom(FLOOR_LEVELS.filter(l => l !== "متعدد الأدوار"));
      finishing = randomFrom(["سوبر لوكس", "الترا سوبر لوكس"]);
      amenities = randomSubset([...AMENITIES], randomInt(5, 8));
      
    } else {
      // Regular residential districts
      type = randomFrom([...ND_PROPERTY_TYPES.residential]);
      area = randomInt(80, 200);
      bedrooms = randomInt(2, 4);
      bathrooms = randomInt(1, 2);
      level = randomFrom(FLOOR_LEVELS.filter(l => l !== "متعدد الأدوار"));
      finishing = randomFrom([...FINISHING_TYPES]);
      amenities = randomSubset([...AMENITIES], randomInt(3, 6));
    }
  }
  // ═══════════════════════════════════════════════════════════════════════════════
  // NEW MANSOURA LOGIC
  // ═══════════════════════════════════════════════════════════════════════════════
  else {
    if (NM_VILLAS_AREAS.includes(district as typeof NM_VILLAS_AREAS[number])) {
      // Villas Areas - Luxury villas
      type = randomFrom([...NM_PROPERTY_TYPES.villas]);
      area = type === "فيلا منفصلة" ? randomInt(300, 600) : randomInt(200, 400);
      bedrooms = randomInt(4, 6);
      bathrooms = randomInt(3, 5);
      level = "متعدد الأدوار";
      finishing = randomFrom(["سوبر لوكس", "الترا سوبر لوكس"]);
      amenities = randomSubset(["حديقة خاصة", "حمام سباحة", "جراج خاص", "أمن وحراسة", "كلوب هاوس", "فيو بحيرات"], randomInt(4, 6));
      
    } else if (NM_COMMERCIAL_AREAS.includes(district as typeof NM_COMMERCIAL_AREAS[number])) {
      // Commercial - Shops and offices
      type = randomFrom([...NM_PROPERTY_TYPES.commercial]);
      area = randomInt(40, 300);
      bedrooms = 0;
      bathrooms = type === "عيادة" ? randomInt(1, 3) : 1;
      level = randomFrom(["أرضي", "الدور الأول", "الدور الثاني", "الدور الثالث"]);
      finishing = randomFrom(["تشطيب كامل", "سوبر لوكس"]);
      amenities = randomSubset(["أسانسير", "أمن وحراسة", "تكييف مركزي", "جراج خاص"], randomInt(2, 4));
      
    } else if (NM_COASTAL_AREAS.includes(district as typeof NM_COASTAL_AREAS[number])) {
      // Coastal - Beach properties
      type = randomFrom([...NM_PROPERTY_TYPES.coastal]);
      area = type === "فيلا شاطئية" ? randomInt(200, 400) : randomInt(70, 150);
      bedrooms = type === "فيلا شاطئية" ? randomInt(4, 5) : randomInt(2, 3);
      bathrooms = randomInt(2, 3);
      level = type === "روف بحري" ? "روف" : randomFrom(["أرضي", "الدور الأول", "الدور الثاني"]);
      finishing = randomFrom(["سوبر لوكس", "الترا سوبر لوكس"]);
      amenities = ["فيو بحر", ...randomSubset(["حمام سباحة", "تكييف مركزي", "حديقة خاصة", "أمن وحراسة"], randomInt(3, 4))];
      
    } else if (NM_NATIONAL_PROJECTS.includes(district as typeof NM_NATIONAL_PROJECTS[number])) {
      // National Projects
      type = "شقة";
      area = randomInt(90, 180);
      bedrooms = randomInt(2, 4);
      bathrooms = randomInt(1, 2);
      level = randomFrom(FLOOR_LEVELS.filter(l => l !== "روف" && l !== "أرضي" && l !== "متعدد الأدوار"));
      finishing = district.includes("جنة") ? "سوبر لوكس" : randomFrom(["تشطيب كامل", "سوبر لوكس"]);
      amenities = randomSubset(["عداد مياه", "عداد كهرباء", "عداد غاز", "أسانسير", "أمن وحراسة"], randomInt(3, 5));
      
    } else if (NM_ENTERTAINMENT_AREAS.includes(district as typeof NM_ENTERTAINMENT_AREAS[number])) {
      // Entertainment areas
      type = randomFrom([...NM_PROPERTY_TYPES.entertainment]);
      area = randomInt(50, 120);
      bedrooms = randomInt(1, 2);
      bathrooms = 1;
      level = randomFrom(["أرضي", "الدور الأول", "الدور الثاني"]);
      finishing = randomFrom(["تشطيب كامل", "سوبر لوكس"]);
      amenities = randomSubset(["فيو حديقة", "قريب من المول", "أمن وحراسة"], randomInt(2, 3));
      
    } else {
      // Regular residential (R1-R7)
      type = randomFrom([...NM_PROPERTY_TYPES.residential]);
      area = randomInt(100, 220);
      bedrooms = randomInt(2, 4);
      bathrooms = randomInt(1, 3);
      level = randomFrom(FLOOR_LEVELS.filter(l => l !== "متعدد الأدوار"));
      finishing = randomFrom([...FINISHING_TYPES]);
      amenities = randomSubset([...AMENITIES], randomInt(4, 7));
    }
  }
  
  const price = generatePrice(type, area, district, cityId);
  
  // Generate payment options
  const paymentTypes: Array<"كاش" | "تقسيط" | "كاش أو تقسيط"> = ["كاش", "تقسيط", "كاش أو تقسيط"];
  const paymentType = randomFrom(paymentTypes);
  const hasInstallment = paymentType === "تقسيط" || paymentType === "كاش أو تقسيط";
  const installmentYears = hasInstallment ? randomFrom([3, 5, 7, 10]) : undefined;
  const downPaymentPercent = hasInstallment ? randomFrom([10, 15, 20, 25, 30]) : undefined;
  const downPayment = hasInstallment && downPaymentPercent ? Math.round(price * downPaymentPercent / 100) : undefined;
  const remainingAmount = hasInstallment && downPayment ? price - downPayment : undefined;
  const monthlyInstallment = hasInstallment && remainingAmount && installmentYears 
    ? Math.round(remainingAmount / (installmentYears * 12)) 
    : undefined;

  // Generate description
  const descriptions = [
    `${type} مميزة في ${district} - ${cityName} بمساحة ${area} متر مربع، تشطيب ${finishing}، موقع متميز وقريب من جميع الخدمات.`,
    `فرصة استثمارية رائعة! ${type} في قلب ${district} بـ${cityName}، ${bedrooms} غرف نوم، تشطيب راقي ومميز.`,
    `${type} للبيع بموقع حيوي في ${district} - ${cityName}، مساحة ${area} م²، تصميم عصري وإطلالة مميزة.`,
    `عرض خاص! ${type} فاخرة في ${district} بـ${cityName}، ${finishing}، قريبة من المدارس والمستشفيات.`,
    `${type} جاهزة للسكن في ${district} - ${cityName}، ${bedrooms} غرف + ${bathrooms} حمام، سعر مميز جداً.`,
  ];
  
  return {
    id: `prop-${String(id).padStart(3, "0")}`,
    title: generateTitle(type, district, area, level, cityName),
    description: randomFrom(descriptions),
    price,
    currency: "EGP",
    category,
    type,
    location: {
      city: cityName as "دمياط الجديدة" | "المنصورة الجديدة",
      cityId,
      district,
      address: generateAddress(),
    },
    details: {
      area_sqm: area,
      bedrooms,
      bathrooms,
      level,
      finishing,
    },
    payment: {
      type: paymentType,
      downPayment,
      monthlyInstallment,
      installmentYears,
    },
    status: Math.random() < 0.7 ? "جاهز" : "تحت الإنشاء", // 70% ready, 30% under construction
    amenities,
    images: getImages(type),
    contact_whatsapp: generateWhatsApp(),
    isVerified: Math.random() < 0.3, // 30% verified
    createdAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000), // Last 30 days
  };
}

// Distribution of properties across districts for a city
function getDistrictDistribution(cityId: CityId): Array<{ district: string; cityId: CityId }> {
  const distribution: Array<{ district: string; cityId: CityId }> = [];
  
  if (cityId === "new-damietta") {
    // New Damietta Distribution
    
    // Residential Districts: 13 properties
    ND_RESIDENTIAL_DISTRICTS.slice(0, 5).forEach(d => {
      for (let i = 0; i < 2; i++) distribution.push({ district: d, cityId });
    });
    for (let i = 0; i < 3; i++) distribution.push({ district: "الحي السادس (المتميز)", cityId });
    
    // National Projects: 12 properties
    ND_NATIONAL_PROJECTS.forEach(d => {
      for (let i = 0; i < 2; i++) distribution.push({ district: d, cityId });
    });
    distribution.push({ district: randomFrom([...ND_NATIONAL_PROJECTS]), cityId });
    distribution.push({ district: randomFrom([...ND_NATIONAL_PROJECTS]), cityId });
    
    // Bayt Al-Watan: 10 properties
    ND_BAYT_AL_WATAN.forEach(d => {
      for (let i = 0; i < 3; i++) distribution.push({ district: d, cityId });
    });
    distribution.push({ district: randomFrom([...ND_BAYT_AL_WATAN]), cityId });
    
    // Central & Investment: 8 properties
    ND_CENTRAL_INVESTMENT.slice(0, 3).forEach(d => {
      for (let i = 0; i < 2; i++) distribution.push({ district: d, cityId });
    });
    distribution.push({ district: "شمال الجامعة", cityId });
    distribution.push({ district: "المنطقة الصناعية", cityId });
    
    // Coastal: 5 properties
    for (let i = 0; i < 5; i++) {
      distribution.push({ district: "منطقة الشاليهات", cityId });
    }
    
  } else {
    // New Mansoura Distribution
    
    // Residential Districts (R1-R7): 14 properties
    NM_RESIDENTIAL_DISTRICTS.forEach(d => {
      distribution.push({ district: d, cityId });
      if (Math.random() > 0.5) distribution.push({ district: d, cityId });
    });
    
    // National Projects: 12 properties
    NM_NATIONAL_PROJECTS.forEach(d => {
      distribution.push({ district: d, cityId });
      if (d.includes("سكن لكل المصريين") || d === "جنة") {
        distribution.push({ district: d, cityId });
      }
    });
    
    // Villas Areas: 8 properties
    NM_VILLAS_AREAS.forEach(d => {
      for (let i = 0; i < 2; i++) distribution.push({ district: d, cityId });
    });
    
    // Commercial: 6 properties
    NM_COMMERCIAL_AREAS.slice(0, 3).forEach(d => {
      for (let i = 0; i < 2; i++) distribution.push({ district: d, cityId });
    });
    
    // Coastal: 6 properties
    NM_COASTAL_AREAS.forEach(d => {
      for (let i = 0; i < 2; i++) distribution.push({ district: d, cityId });
    });
    
    // Entertainment: 4 properties
    NM_ENTERTAINMENT_AREAS.slice(0, 2).forEach(d => {
      for (let i = 0; i < 2; i++) distribution.push({ district: d, cityId });
    });
  }
  
  return distribution.sort(() => 0.5 - Math.random()); // Shuffle
}

// Generate properties for a specific city
export function generatePropertiesForCity(cityId: CityId, count: number = 50): Property[] {
  const districts = getDistrictDistribution(cityId);
  return districts.slice(0, count).map((item, index) => 
    generatePropertyForDistrict(item.district, index + 1, item.cityId)
  );
}

// Generate all properties (both cities)
export function generateProperties(): Property[] {
  // 50 properties for New Damietta
  const ndProperties = generatePropertiesForCity("new-damietta", 50);
  
  // 50 properties for New Mansoura
  const nmProperties = generatePropertiesForCity("new-mansoura", 50).map((p, i) => ({
    ...p,
    id: `prop-${String(51 + i).padStart(3, "0")}`, // Continue IDs from 51
  }));
  
  // Combine and shuffle
  return [...ndProperties, ...nmProperties].sort(() => 0.5 - Math.random());
}

// Cached properties
let cachedProperties: Property[] | null = null;

export function getProperties(): Property[] {
  if (!cachedProperties) {
    cachedProperties = generateProperties();
  }
  return cachedProperties;
}

// Filter functions - العقارات بدون cityId تعتبر من دمياط الجديدة
export function filterByCity(properties: Property[], cityId: CityId): Property[] {
  return properties.filter(p => (p.location.cityId || "new-damietta") === cityId);
}

export function filterByDistrict(properties: Property[], district: string): Property[] {
  return properties.filter(p => p.location.district === district);
}

export function filterByCityAndDistrict(properties: Property[], cityId: CityId, district: string): Property[] {
  return properties.filter(p => (p.location.cityId || "new-damietta") === cityId && p.location.district === district);
}

// الموقع متخصص فقط في البيع - لا حاجة لفلتر التصنيف

export function filterByType(properties: Property[], type: string): Property[] {
  return properties.filter(p => p.type === type);
}

export function filterByPriceRange(properties: Property[], min: number, max: number): Property[] {
  return properties.filter(p => p.price >= min && p.price <= max);
}

// لا توجد عقارات وهمية - يتم جلب العقارات من Firebase فقط
export const MOCK_PROPERTIES: Property[] = [];
