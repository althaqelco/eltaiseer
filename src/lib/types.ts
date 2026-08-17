// lib/types.ts
// نوع العقار الأساسي — انتقل من mockData حتى لا تستورد 19 وحدة نوعها من ملف بيانات تجريبية

import type { CityId } from "./egyptPlaces";

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
