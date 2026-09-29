"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, getDistrictBreadcrumb } from "@/components/Breadcrumb";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MapPin, ChevronRight, Building2 } from "lucide-react";
import { getCategoryByDistrict, CITIES, CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { SLUG_TO_DISTRICT, getDistrictSlug } from "@/lib/districtSlugs";

// كل عروض الحي تُعرض في صفحة واحدة بلا ترقيم (أكبر حي اليوم 25 عرضاً) —
// الترقيم بالأزرار كان يخفي عن الزاحف كل ما بعد أول 12 عرضاً
const PROPERTY_TYPES = ["الكل", "شقة", "شقة فاخرة", "فيلا منفصلة", "دوبلكس", "محل تجاري", "أرض"];

interface DistrictClientProps {
  citySlug: string;
  districtSlug: string;
  initialProperties: Property[];
  // مقدمة الإجابة (answer-lede): النص التحريري + المعروض الآن، محسوبة في الخادم وتُعرض بعد H1 مباشرة
  lede?: string;
  // «آخر تحديث للعروض» يُبنى في الخادم (page.tsx) بتاريخ يطابق dateModified في JSON-LD
  freshnessSlot?: React.ReactNode;
  // أسئلة الحي (سعر المتر، لمن يناسب، وصندوق بيت الوطن) من الخادم — لا نصوص إجابات في حزمة المتصفح
  answersSlot?: React.ReactNode;
}

export default function DistrictClient({ citySlug, districtSlug, initialProperties, lede, freshnessSlot, answersSlot }: DistrictClientProps) {
  const cityId = citySlug as CityId;
  const city = CITIES[cityId];
  const districtName = SLUG_TO_DISTRICT[districtSlug] || decodeURIComponent(districtSlug).replace(/-/g, " ");
  const isNM = citySlug === "new-mansoura";

  const [properties] = useState<Property[]>(
    () => initialProperties.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
  );
  const [selectedType, setSelectedType] = useState("الكل");

  const category = getCategoryByDistrict(districtName, cityId);

  // البيانات تأتي من الخادم (ISR يحدّثها كل 300 ث)، فلا نعيد جلبها من Firestore في المتصفح:
  // إعادة الجلب كانت تحمّل Firebase SDK وتقرأ المجموعة كاملة في كل زيارة لبيانات موجودة في HTML.

  const filteredProperties = useMemo(() => {
    if (selectedType === "الكل") return properties;
    return properties.filter(p => p.type === selectedType);
  }, [properties, selectedType]);

  const themeColor = isNM ? "emerald" : "orange";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb items={getDistrictBreadcrumb(districtName, city?.nameAr)} schema={false} />

      {/* Hero */}
      <div className={`bg-gradient-to-l from-slate-900 via-slate-800 ${isNM ? "to-emerald-900" : "to-orange-900"} py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className={`h-10 w-10 ${isNM ? "text-emerald-400" : "text-orange-400"}`} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                عقارات {districtName}
              </h1>
              {lede ? (
                <p className="answer-lede text-gray-200 mt-3 leading-loose max-w-4xl">{lede}</p>
              ) : (
                <p className="text-gray-300 mt-2">
                  {filteredProperties.length} عقار متاح للبيع في {districtName}
                </p>
              )}
            </div>
          </div>
          {category && (
            <p className="text-gray-400 text-sm">
              {category.nameAr} - {city?.nameAr}
            </p>
          )}
          
          {/* Back to city link */}
          <Link 
            href={`/${citySlug}`}
            prefetch={false}
            className={`inline-flex items-center gap-1 mt-4 text-sm ${isNM ? "text-emerald-300 hover:text-emerald-200" : "text-orange-300 hover:text-orange-200"}`}
          >
            <ChevronRight className="h-4 w-4" />
            العودة إلى {city?.nameAr}
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-gray-500 text-sm">
                عرض {filteredProperties.length} من {properties.length} عقار
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد عقارات متاحة في {districtName}</p>
            <Button asChild className={`mt-4 bg-${themeColor}-500`}>
              <Link href={`/${citySlug}`}>تصفح عقارات {city?.nameAr}</Link>
            </Button>
          </div>
        )}

        {/* أسئلة الحي وأرقامه من الخادم (page.tsx) */}
        {answersSlot}

        {freshnessSlot}

        {/* روابط المناطق المجاورة — ربط داخلي دلالي بين أحياء نفس الفئة */}
        {category && category.districts.length > 1 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              مناطق مجاورة في {category.nameAr}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.districts
                .filter((d) => d !== districtName)
                .map((d) => (
                  <Link
                    key={d}
                    href={`/${citySlug}/${getDistrictSlug(d)}`}
                    prefetch={false}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      isNM
                        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        : "border-orange-200 text-orange-700 hover:bg-orange-50"
                    }`}
                  >
                    عقارات {d}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
