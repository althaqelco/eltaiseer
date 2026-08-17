"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Breadcrumb, getCityBreadcrumb } from "@/components/Breadcrumb";
import {
  MapPin,
  ChevronRight,
  ChevronLeft,
  Building2,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getAllPropertiesAsync } from "@/lib/propertyStore";
import { CITIES, CITY_DATA, CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { getDistrictSlug } from "@/lib/districtSlugs";
import { CITY_FAQ } from "@/lib/cityFaq";
import { buildFaqSchema } from "@/lib/homeFaq";

const ITEMS_PER_PAGE = 20;

interface CityClientProps {
  citySlug: string;
  initialProperties: Property[];
}

export default function CityClient({ citySlug, initialProperties }: CityClientProps) {
  const cityId = citySlug as CityId;
  const city = CITIES[cityId];
  const cityData = CITY_DATA[cityId];

  const [properties, setProperties] = useState<Property[]>(
    () => initialProperties.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("الكل");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("الكل");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(initialProperties.length === 0);

  // البيانات الأولية تأتي من الخادم؛ التحديث الحي من Firestore بعد التحميل
  useEffect(() => {
    getAllPropertiesAsync().then((firestoreProperties) => {
      if (firestoreProperties.length > 0) {
        const filtered = firestoreProperties.filter(p => (p.location.cityId || "new-damietta") === cityId);
        setProperties(filtered);
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [cityId]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (selectedDistricts.length > 0 && !selectedDistricts.includes(property.location.district)) {
        return false;
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(property.type)) {
        return false;
      }
      if (property.price < priceRange.min || property.price > priceRange.max) {
        return false;
      }
      if (selectedStatus !== "الكل" && property.status !== selectedStatus) {
        return false;
      }
      if (selectedPaymentMethod !== "الكل" && property.payment.type !== selectedPaymentMethod) {
        return false;
      }
      return true;
    });
  }, [properties, selectedDistricts, selectedTypes, priceRange, selectedStatus, selectedPaymentMethod]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDistricts, selectedTypes, priceRange, selectedStatus, selectedPaymentMethod]);

  const clearFilters = () => {
    setSelectedDistricts([]);
    setSelectedTypes([]);
    setSelectedStatus("الكل");
    setSelectedPaymentMethod("الكل");
    setPriceRange({ min: 0, max: 50000000 });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (!city || !cityData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">المدينة غير موجودة</h1>
          <p className="text-gray-600 mb-4">عذراً، لم نتمكن من العثور على هذه المدينة</p>
          <Button asChild className="bg-orange-500">
            <Link href="/properties">تصفح جميع العقارات</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isNewMansoura = cityId === "new-mansoura";
  const themeColor = isNewMansoura ? "emerald" : "orange";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb items={getCityBreadcrumb(city.nameAr)} />

      {/* Hero */}
      <div className={`bg-gradient-to-l from-slate-900 via-slate-800 ${isNewMansoura ? "to-emerald-900" : "to-orange-900"} py-12`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className={`h-10 w-10 ${isNewMansoura ? "text-emerald-400" : "text-orange-400"}`} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                عقارات {city.nameAr}
              </h1>
              <p className="text-gray-300 mt-2">
                {filteredProperties.length} عقار متاح للبيع في {city.nameAr}
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">
            {city.description}
          </p>

          {/* Districts Quick Links */}
          <div className="mt-6 flex flex-wrap gap-2">
            {cityData.categories.slice(0, 2).flatMap(cat =>
              cat.districts.slice(0, 4).map(district => {
                const districtSlug = getDistrictSlug(district);
                return (
                  <Link
                    key={district}
                    href={`/${citySlug}/${districtSlug}`}
                    className={`px-3 py-1 rounded-full text-sm ${isNewMansoura
                        ? "bg-emerald-800/50 text-emerald-200 hover:bg-emerald-700/50"
                        : "bg-orange-800/50 text-orange-200 hover:bg-orange-700/50"
                      } transition-colors`}
                  >
                    {district}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4 ml-2" />
              الفلاتر
            </Button>
            <p className="text-gray-600 text-sm">
              {filteredProperties.length} نتيجة
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? `bg-${themeColor}-500` : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? `bg-${themeColor}-500` : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-row-reverse gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-80 flex-shrink-0 order-first">
            <FilterSidebar
              selectedCity={cityId}
              selectedDistricts={selectedDistricts}
              selectedTypes={selectedTypes}
              selectedStatus={selectedStatus}
              selectedPaymentMethod={selectedPaymentMethod}
              priceRange={priceRange}
              onCityChange={() => { }}
              onDistrictChange={setSelectedDistricts}
              onTypeChange={setSelectedTypes}
              onStatusChange={setSelectedStatus}
              onPaymentMethodChange={setSelectedPaymentMethod}
              onPriceChange={setPriceRange}
              onClearFilters={clearFilters}
              totalResults={filteredProperties.length}
            />
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : paginatedProperties.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
                }`}>
                {paginatedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد عقارات مطابقة للبحث</p>
                <Button onClick={clearFilters} className={`mt-4 bg-${themeColor}-500`}>
                  مسح الفلاتر
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, idx) =>
                  typeof page === "number" ? (
                    <Button
                      key={idx}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? `bg-${themeColor}-500` : ""}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span key={idx} className="px-2 text-gray-400">
                      {page}
                    </span>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold">الفلاتر</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    selectedCity={cityId}
                    selectedDistricts={selectedDistricts}
                    selectedTypes={selectedTypes}
                    selectedStatus={selectedStatus}
                    selectedPaymentMethod={selectedPaymentMethod}
                    priceRange={priceRange}
                    onCityChange={() => { }}
                    onDistrictChange={setSelectedDistricts}
                    onTypeChange={setSelectedTypes}
                    onStatusChange={setSelectedStatus}
                    onPaymentMethodChange={setSelectedPaymentMethod}
                    onPriceChange={setPriceRange}
                    onClearFilters={clearFilters}
                    totalResults={filteredProperties.length}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            عقارات للبيع في {city.nameAr}
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
            <p>{city.description}</p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
              جميع أحياء ومناطق {city.nameAr}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
              {cityData.categories.map((category) => (
                <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className={`font-bold mb-2 ${category.color.replace("bg-", "text-")}`}>
                    {category.nameAr}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {category.districts.map((district) => {
                      const districtSlug = getDistrictSlug(district);
                      return (
                        <li key={district}>
                          <Link
                            href={`/${citySlug}/${districtSlug}`}
                            className="hover:text-orange-600"
                          >
                            عقارات {district}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* الأسئلة الشائعة — محتوى مرئي مطابق للـ schema */}
        {(CITY_FAQ[citySlug] || []).length > 0 && (
          <section className="mt-8 bg-white rounded-xl p-6 shadow-sm" aria-labelledby="city-faq-heading">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(CITY_FAQ[citySlug])) }}
            />
            <h2 id="city-faq-heading" className="text-2xl font-bold text-gray-800 mb-4">
              أسئلة شائعة عن عقارات {city.nameAr}
            </h2>
            <div className="space-y-3">
              {CITY_FAQ[citySlug].map((item) => (
                <details key={item.question} className="group bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <summary className="cursor-pointer list-none font-semibold text-gray-800 flex items-center justify-between">
                    <h3 className="text-base font-semibold">{item.question}</h3>
                    <span className="text-orange-500 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
