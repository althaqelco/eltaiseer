// lib/mockData.ts
// Mock Data Engine for El Taiseer Real Estate
// التيسير للعقارات - محرك البيانات التجريبية

import {
  RESIDENTIAL_DISTRICTS,
  NATIONAL_PROJECTS,
  BAYT_AL_WATAN,
  CENTRAL_INVESTMENT,
  COASTAL_AREAS,
  PROPERTY_TYPES,
  FINISHING_TYPES,
  AMENITIES,
  FLOOR_LEVELS,
  STREET_NAMES,
} from "./damiettaPlaces";

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: "EGP";
  category: "بيع"; // الموقع متخصص فقط في البيع
  type: string;
  location: {
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
    "محل تجاري": [
      `${baseUrl}/photo-1441986300917-64674bd600d8?w=800`,
      `${baseUrl}/photo-1604719312566-8912e9227c6a?w=800`,
    ],
    "مقر إداري": [
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
  };
  
  return imagesByType[type] || imagesByType["شقة"];
}

// Generate title based on type and district
function generateTitle(type: string, district: string, area: number, level: string): string {
  const titles: Record<string, (d: string, a: number, l: string) => string> = {
    "شقة": (d, a) => `شقة ${a} متر ${d}`,
    "شقة فاخرة": (d, a) => `شقة فاخرة ${a} متر بـ${d}`,
    "فيلا منفصلة": (d, a) => `فيلا منفصلة ${a} متر ${d}`,
    "محل تجاري": (d, a) => `محل تجاري ${a} متر ب${d}`,
    "مقر إداري": (d, a) => `مقر إداري ${a} متر ${d}`,
    "عيادة": (d, a) => `عيادة ${a} متر ب${d}`,
    "أرض": (d, a) => `قطعة أرض ${a} متر ${d}`,
    "مبنى تحت الإنشاء": (d, a) => `مبنى تحت الإنشاء ${a} متر ${d}`,
    "شاليه": (d, a) => `شاليه ${a} متر ${d}`,
    "روف": (d, a, l) => `روف ${a} متر ${l} ${d}`,
    "دوبلكس": (d, a) => `دوبلكس ${a} متر ${d}`,
    "بنتهاوس": (d, a) => `بنتهاوس ${a} متر ${d}`,
    "تاون هاوس": (d, a) => `تاون هاوس ${a} متر ${d}`,
  };
  
  return titles[type]?.(district, area, level) || `عقار ${area} متر ${district}`;
}

// Price ranges by type and zone
function generatePrice(type: string, area: number, district: string): number {
  // Base price per sqm by type (in EGP for sale)
  const basePrices: Record<string, number> = {
    "شقة": 25000,
    "شقة فاخرة": 40000,
    "فيلا منفصلة": 50000,
    "محل تجاري": 60000,
    "مقر إداري": 45000,
    "عيادة": 50000,
    "أرض": 15000,
    "مبنى تحت الإنشاء": 20000,
    "شاليه": 35000,
    "روف": 30000,
    "دوبلكس": 35000,
    "بنتهاوس": 45000,
    "تاون هاوس": 40000,
  };
  
  // Location multipliers
  const locationMultiplier: Record<string, number> = {
    "الحي السادس (المتميز)": 1.5,
    "مشروع جنة": 1.4,
    "منطقة الشاليهات": 1.3,
    "المنطقة المركزية (أ)": 1.2,
  };
  
  const basePrice = basePrices[type] || 25000;
  const multiplier = locationMultiplier[district] || 1;
  const variance = 0.8 + Math.random() * 0.4; // 80% - 120%
  
  return Math.round((basePrice * area * multiplier * variance) / 10000) * 10000;
}

// Generate property based on district type
function generatePropertyForDistrict(district: string, id: number): Property {
  let type: string;
  const category = "بيع" as const; // الموقع متخصص فقط في البيع
  let area: number;
  let bedrooms: number;
  let bathrooms: number;
  let level: string;
  let finishing: string;
  let amenities: string[];
  
  // Logic based on district category
  if (CENTRAL_INVESTMENT.includes(district as typeof CENTRAL_INVESTMENT[number])) {
    // Central & Investment - Commercial properties
    type = randomFrom(PROPERTY_TYPES.central);
    area = randomInt(30, 200);
    bedrooms = 0;
    bathrooms = type === "عيادة" ? randomInt(1, 2) : 1;
    level = randomFrom(["أرضي", "الدور الأول", "الدور الثاني"]);
    finishing = randomFrom(["تشطيب كامل", "نصف تشطيب", "طوب أحمر"]);
    amenities = randomSubset(["عداد مياه", "عداد كهرباء", "أسانسير", "أمن وحراسة"], randomInt(2, 4));
    
  } else if (BAYT_AL_WATAN.includes(district as typeof BAYT_AL_WATAN[number])) {
    // Bayt Al-Watan - Land and Under Construction
    type = Math.random() > 0.4 ? "أرض" : "مبنى تحت الإنشاء";
    area = randomInt(200, 600);
    bedrooms = type === "أرض" ? 0 : randomInt(3, 6);
    bathrooms = type === "أرض" ? 0 : randomInt(2, 4);
    level = type === "أرض" ? "-" : "متعدد الأدوار";
    finishing = type === "أرض" ? "-" : "طوب أحمر";
    amenities = type === "أرض" 
      ? randomSubset(["عداد مياه", "عداد كهرباء", "واجهة بحري", "ناصية"], randomInt(1, 3))
      : randomSubset(["عداد مياه", "عداد كهرباء", "جراج خاص"], randomInt(2, 3));
    
  } else if (NATIONAL_PROJECTS.includes(district as typeof NATIONAL_PROJECTS[number])) {
    // National Projects - Apartments in compounds
    type = "شقة";
    area = randomInt(90, 180);
    bedrooms = randomInt(2, 4);
    bathrooms = randomInt(1, 2);
    level = randomFrom(FLOOR_LEVELS.filter(l => l !== "روف" && l !== "أرضي"));
    finishing = district === "مشروع جنة" ? "سوبر لوكس" : randomFrom(["تشطيب كامل", "سوبر لوكس"]);
    amenities = randomSubset(["عداد مياه", "عداد كهرباء", "عداد غاز", "أسانسير", "أمن وحراسة", "حديقة خاصة"], randomInt(3, 5));
    
  } else if (COASTAL_AREAS.includes(district as typeof COASTAL_AREAS[number])) {
    // Coastal - Chalets and Roofs
    type = randomFrom(PROPERTY_TYPES.coastal);
    area = randomInt(60, 150);
    bedrooms = randomInt(2, 3);
    bathrooms = randomInt(1, 2);
    level = type === "روف" ? "روف" : randomFrom(["أرضي", "الدور الأول", "الدور الثاني"]);
    finishing = randomFrom(["تشطيب كامل", "سوبر لوكس"]);
    amenities = ["فيو بحر", ...randomSubset(["عداد مياه", "عداد كهرباء", "تكييف مركزي", "حديقة خاصة"], randomInt(2, 4))];
    
  } else if (district === "الحي السادس (المتميز)") {
    // District 6 - Luxury properties
    type = randomFrom(PROPERTY_TYPES.luxury);
    area = type === "فيلا منفصلة" ? randomInt(250, 500) : randomInt(150, 300);
    bedrooms = type === "فيلا منفصلة" ? randomInt(4, 6) : randomInt(3, 4);
    bathrooms = randomInt(2, 4);
    level = type === "فيلا منفصلة" ? "متعدد الأدوار" : randomFrom(FLOOR_LEVELS);
    finishing = randomFrom(["سوبر لوكس", "الترا سوبر لوكس"]);
    amenities = randomSubset(AMENITIES, randomInt(5, 8));
    
  } else {
    // Regular residential districts
    type = randomFrom(PROPERTY_TYPES.residential);
    area = randomInt(80, 200);
    bedrooms = randomInt(2, 4);
    bathrooms = randomInt(1, 2);
    level = randomFrom(FLOOR_LEVELS);
    finishing = randomFrom(FINISHING_TYPES);
    amenities = randomSubset(AMENITIES, randomInt(3, 6));
  }
  
  const price = generatePrice(type, area, district);
  
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
    `${type} مميزة في ${district} بمساحة ${area} متر مربع، تشطيب ${finishing}، موقع متميز وقريب من جميع الخدمات.`,
    `فرصة استثمارية رائعة! ${type} في قلب ${district}، ${bedrooms} غرف نوم، تشطيب راقي ومميز.`,
    `${type} للبيع بموقع حيوي في ${district}، مساحة ${area} م²، تصميم عصري وإطلالة مميزة.`,
    `عرض خاص! ${type} فاخرة في ${district}، ${finishing}، قريبة من المدارس والمستشفيات.`,
    `${type} جاهزة للسكن في ${district}، ${bedrooms} غرف + ${bathrooms} حمام، سعر مميز جداً.`,
  ];
  
  return {
    id: `prop-${String(id).padStart(3, "0")}`,
    title: generateTitle(type, district, area, level),
    description: randomFrom(descriptions),
    price,
    currency: "EGP",
    category,
    type,
    location: {
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

// Distribution of properties across districts
function getDistrictDistribution(): string[] {
  const distribution: string[] = [];
  
  // Residential Districts: 15 properties (3 each for first 5, 3 for district 6)
  RESIDENTIAL_DISTRICTS.slice(0, 5).forEach(d => {
    for (let i = 0; i < 2; i++) distribution.push(d);
  });
  for (let i = 0; i < 3; i++) distribution.push("الحي السادس (المتميز)");
  
  // National Projects: 12 properties
  NATIONAL_PROJECTS.forEach(d => {
    for (let i = 0; i < 2; i++) distribution.push(d);
  });
  distribution.push(randomFrom([...NATIONAL_PROJECTS]));
  distribution.push(randomFrom([...NATIONAL_PROJECTS]));
  
  // Bayt Al-Watan: 10 properties
  BAYT_AL_WATAN.forEach(d => {
    for (let i = 0; i < 3; i++) distribution.push(d);
  });
  distribution.push(randomFrom([...BAYT_AL_WATAN]));
  
  // Central & Investment: 8 properties
  CENTRAL_INVESTMENT.slice(0, 3).forEach(d => {
    for (let i = 0; i < 2; i++) distribution.push(d);
  });
  distribution.push("شمال الجامعة");
  distribution.push("المنطقة الصناعية");
  
  // Coastal: 5 properties
  for (let i = 0; i < 5; i++) {
    distribution.push("منطقة الشاليهات");
  }
  
  return distribution.sort(() => 0.5 - Math.random()); // Shuffle
}

// Generate all 50 properties
export function generateProperties(): Property[] {
  const districts = getDistrictDistribution();
  return districts.slice(0, 50).map((district, index) => 
    generatePropertyForDistrict(district, index + 1)
  );
}

// Cached properties
let cachedProperties: Property[] | null = null;

export function getProperties(): Property[] {
  if (!cachedProperties) {
    cachedProperties = generateProperties();
  }
  return cachedProperties;
}

// Filter functions
export function filterByDistrict(properties: Property[], district: string): Property[] {
  return properties.filter(p => p.location.district === district);
}

// الموقع متخصص فقط في البيع - لا حاجة لفلتر التصنيف

export function filterByType(properties: Property[], type: string): Property[] {
  return properties.filter(p => p.type === type);
}

export function filterByPriceRange(properties: Property[], min: number, max: number): Property[] {
  return properties.filter(p => p.price >= min && p.price <= max);
}

// Log 3 examples for verification
if (typeof window !== "undefined") {
  const examples = generateProperties().slice(0, 3);
  console.log("🏠 El Taiseer Real Estate - Sample Properties:");
  examples.forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.title}`);
    console.log(`   📍 ${p.location.district} - ${p.location.address}`);
    console.log(`   💰 ${p.price.toLocaleString()} ${p.currency} (${p.category})`);
    console.log(`   🏷️ ${p.type} | ${p.details.area_sqm}م² | ${p.details.finishing}`);
    console.log(`   ✅ Verified: ${p.isVerified}`);
  });
}

export const MOCK_PROPERTIES = generateProperties();
