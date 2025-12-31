// lib/damiettaPlaces.ts
// Single Source of Truth for New Damietta Geography
// التيسير للعقارات - البيانات الجغرافية الأساسية

export interface PlaceCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  districts: string[];
  color: string; // For UI badges
}

// Category 1: الأحياء السكنية (Residential Districts)
export const RESIDENTIAL_DISTRICTS = [
  "الحي الأول",
  "الحي الثاني",
  "الحي الثالث",
  "الحي الرابع",
  "الحي الخامس",
  "الحي السادس (المتميز)",
] as const;

// Category 2: المشروعات القومية (National Projects)
export const NATIONAL_PROJECTS = [
  "مشروع جنة",
  "دار مصر - موقع 1",
  "دار مصر - موقع 2",
  "سكن مصر - جنوب الحي الأول",
  "سكن مصر - غرب الجامعات",
] as const;

// Category 3: مناطق بيت الوطن (Bayt Al-Watan)
export const BAYT_AL_WATAN = [
  "بيت الوطن - شرق",
  "بيت الوطن - غرب",
  "بيت الوطن - امتداد الشاطئ",
] as const;

// Category 4: المناطق المركزية والاستثمارية (Central & Investment)
export const CENTRAL_INVESTMENT = [
  "المنطقة المركزية (أ)",
  "المنطقة المركزية (ب)",
  "المنطقة المركزية (ج)",
  "شمال الجامعة",
  "المنطقة الصناعية",
] as const;

// Category 5: المناطق الساحلية (Coastal)
export const COASTAL_AREAS = [
  "منطقة الشاليهات",
] as const;

// All Place Categories with metadata
export const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: "residential",
    nameAr: "الأحياء السكنية",
    nameEn: "Residential Districts",
    districts: [...RESIDENTIAL_DISTRICTS],
    color: "bg-orange-500",
  },
  {
    id: "national",
    nameAr: "المشروعات القومية",
    nameEn: "National Projects",
    districts: [...NATIONAL_PROJECTS],
    color: "bg-blue-500",
  },
  {
    id: "bayt-al-watan",
    nameAr: "بيت الوطن",
    nameEn: "Bayt Al-Watan",
    districts: [...BAYT_AL_WATAN],
    color: "bg-amber-500",
  },
  {
    id: "central",
    nameAr: "المناطق المركزية والاستثمارية",
    nameEn: "Central & Investment",
    districts: [...CENTRAL_INVESTMENT],
    color: "bg-purple-500",
  },
  {
    id: "coastal",
    nameAr: "المناطق الساحلية",
    nameEn: "Coastal",
    districts: [...COASTAL_AREAS],
    color: "bg-cyan-500",
  },
];

// All districts flat array
export const ALL_DISTRICTS = [
  ...RESIDENTIAL_DISTRICTS,
  ...NATIONAL_PROJECTS,
  ...BAYT_AL_WATAN,
  ...CENTRAL_INVESTMENT,
  ...COASTAL_AREAS,
] as const;

export type District = typeof ALL_DISTRICTS[number];

// Helper function to get category by district
export function getCategoryByDistrict(district: string): PlaceCategory | undefined {
  return PLACE_CATEGORIES.find(cat => cat.districts.includes(district));
}

// Helper function to get category color by district
export function getDistrictColor(district: string): string {
  const category = getCategoryByDistrict(district);
  return category?.color || "bg-gray-500";
}

// Property Types by Zone Logic
export const PROPERTY_TYPES = {
  residential: ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس"],
  national: ["شقة"],
  baytAlWatan: ["أرض", "مبنى تحت الإنشاء"],
  central: ["محل تجاري", "مقر إداري", "عيادة"],
  coastal: ["شاليه", "روف"],
  luxury: ["فيلا منفصلة", "شقة فاخرة", "تاون هاوس"],
} as const;

// Finishing Types
export const FINISHING_TYPES = [
  "طوب أحمر",
  "نصف تشطيب",
  "تشطيب كامل",
  "سوبر لوكس",
  "الترا سوبر لوكس",
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
  "قريب من المسجد",
  "قريب من المدارس",
  "قريب من الجامعة",
] as const;

// Floor Levels
export const FLOOR_LEVELS = [
  "أرضي",
  "الدور الأول",
  "الدور الثاني",
  "الدور الثالث",
  "الدور الرابع",
  "الدور الخامس",
  "الأخير",
  "روف",
] as const;

// Street Names for address generation
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
] as const;
