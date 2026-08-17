"use client";

import { useState, useEffect, useMemo } from "react";
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
import { MapPin, ChevronRight, ChevronLeft, Building2 } from "lucide-react";
import { getAllPropertiesAsync } from "@/lib/propertyStore";
import { getCategoryByDistrict, CITIES, CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { SLUG_TO_DISTRICT, getDistrictSlug } from "@/lib/districtSlugs";
import type { DistrictEditorial } from "@/lib/districtContent";

const ITEMS_PER_PAGE = 12;

// District slug mapping
const PROPERTY_TYPES = ["الكل", "شقة", "شقة فاخرة", "فيلا منفصلة", "دوبلكس", "محل تجاري", "أرض"];

export interface DistrictStats {
  count: number;
  minPrice: number;
  maxPrice: number;
  avgPerSqm: number | null;
  types: string[];
}

interface DistrictClientProps {
  citySlug: string;
  districtSlug: string;
  initialProperties: Property[];
  districtStats?: DistrictStats | null;
  editorial?: DistrictEditorial | null;
}

export default function DistrictClient({ citySlug, districtSlug, initialProperties, districtStats, editorial }: DistrictClientProps) {
  const cityId = citySlug as CityId;
  const city = CITIES[cityId];
  const districtName = SLUG_TO_DISTRICT[districtSlug] || decodeURIComponent(districtSlug).replace(/-/g, " ");
  const isNM = citySlug === "new-mansoura";

  const [properties, setProperties] = useState<Property[]>(
    () => initialProperties.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("الكل");

  const category = getCategoryByDistrict(districtName, cityId);

  // البيانات الأولية من الخادم؛ تحديث حي من Firestore بمطابقة تامة لاسم الحي
  // (المطابقة الضبابية القديمة كانت تخلط "الحي الأول" مع "سكن مصر - جنوب الحي الأول")
  useEffect(() => {
    getAllPropertiesAsync()
      .then((all) => {
        if (all.length > 0) {
          const filtered = all.filter(
            (p) =>
              (p.location.cityId || "new-damietta") === cityId &&
              p.location.district?.trim() === districtName.trim()
          );
          setProperties(filtered);
        }
      })
      .catch(console.error);
  }, [districtName, cityId]);

  const filteredProperties = useMemo(() => {
    if (selectedType === "الكل") return properties;
    return properties.filter(p => p.type === selectedType);
  }, [properties, selectedType]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const themeColor = isNM ? "emerald" : "orange";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb items={getDistrictBreadcrumb(districtName, city?.nameAr)} />

      {/* Hero */}
      <div className={`bg-gradient-to-l from-slate-900 via-slate-800 ${isNM ? "to-emerald-900" : "to-orange-900"} py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className={`h-10 w-10 ${isNM ? "text-emerald-400" : "text-orange-400"}`} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                عقارات {districtName}
              </h1>
              <p className="text-gray-300 mt-2">
                {filteredProperties.length} عقار متاح للبيع في {districtName}
              </p>
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
                عرض {paginatedProperties.length} من {filteredProperties.length} عقار
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProperties.map((property) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button 
                key={page} 
                variant={currentPage === page ? "default" : "outline"} 
                size="icon" 
                onClick={() => setCurrentPage(page)} 
                className={currentPage === page ? `bg-${themeColor}-500` : ""}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            عقارات للبيع في {districtName} - {city?.nameAr}
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
            {editorial ? (
              <>
                <p className="text-base leading-loose">{editorial.intro}</p>
                <div className="not-prose flex flex-wrap gap-2 my-4">
                  {editorial.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className={`text-sm px-3 py-1.5 rounded-full ${
                        isNM ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      ✓ {tag}
                    </span>
                  ))}
                  {editorial.pricePerSqm && (
                    <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                      سعر المتر: {editorial.pricePerSqm}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p>
                اكتشف أفضل الفرص العقارية في {districtName} ب{city?.nameAr}. 
                نوفر لك مجموعة متنوعة من العقارات تشمل الشقق السكنية والفيلات والدوبلكس 
                بأسعار تنافسية وخيارات دفع مرنة.
              </p>
            )}
            {districtStats && (
              <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className={`text-2xl font-bold text-${themeColor}-600`}>{districtStats.count}</p>
                  <p className="text-sm text-gray-500">عقار متاح الآن</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className={`text-2xl font-bold text-${themeColor}-600`} dir="ltr">
                    {(districtStats.minPrice / 1000000).toFixed(1)}م - {(districtStats.maxPrice / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-sm text-gray-500">نطاق الأسعار (جنيه)</p>
                </div>
                {districtStats.avgPerSqm && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className={`text-2xl font-bold text-${themeColor}-600`}>
                      {districtStats.avgPerSqm.toLocaleString("ar-EG")}
                    </p>
                    <p className="text-sm text-gray-500">متوسط سعر المتر (جنيه)</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-base font-bold text-gray-700 leading-relaxed">
                    {districtStats.types.slice(0, 3).join("، ")}
                  </p>
                  <p className="text-sm text-gray-500">الأنواع المتاحة</p>
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
              لماذا {districtName}؟
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>موقع استراتيجي في قلب {city?.nameAr}</li>
              <li>قريب من الخدمات والمرافق الأساسية</li>
              <li>بنية تحتية متطورة وشوارع واسعة</li>
              <li>مجتمع آمن ومناسب للعائلات</li>
              {isNM && <li>مدينة الجيل الرابع بتصميم عصري</li>}
            </ul>
          </div>
        </div>

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
