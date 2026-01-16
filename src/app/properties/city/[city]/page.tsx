"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  ChevronLeft,
  MapPin,
  ChevronRight,
  Building2,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getAllProperties, getAllPropertiesAsync } from "@/lib/propertyStore";
import { CITIES, CITY_DATA, CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";

const ITEMS_PER_PAGE = 20;

export default function CityPage() {
  const params = useParams();
  const citySlug = params.city as string;
  
  // Get city data
  const cityId = citySlug as CityId;
  const city = CITIES[cityId];
  const cityData = CITY_DATA[cityId];
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("الكل");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("الكل");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load properties
  useEffect(() => {
    setIsLoading(true);
    const initialProperties = getAllProperties();
    // العقارات بدون cityId تعتبر من دمياط الجديدة
    const cityProperties = initialProperties.filter(p => (p.location.cityId || "new-damietta") === cityId);
    setProperties(cityProperties);
    setIsLoading(false);

    // Load from Firestore
    getAllPropertiesAsync().then((firestoreProperties) => {
      if (firestoreProperties.length > 0) {
        const filtered = firestoreProperties.filter(p => (p.location.cityId || "new-damietta") === cityId);
        setProperties(filtered);
      }
    }).catch(console.error);
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDistricts, selectedTypes, priceRange, selectedStatus, selectedPaymentMethod]);

  // Clear filters
  const clearFilters = () => {
    setSelectedDistricts([]);
    setSelectedTypes([]);
    setSelectedStatus("الكل");
    setSelectedPaymentMethod("الكل");
    setPriceRange({ min: 0, max: 50000000 });
  };

  // Dynamic SEO
  useEffect(() => {
    if (city) {
      document.title = `عقارات ${city.nameAr} | شقق وفيلات للبيع - التيسير للعقارات`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", 
          `اكتشف أفضل العقارات للبيع في ${city.nameAr}. ${city.description}. ${filteredProperties.length} عقار متاح. شقق، فيلات، دوبلكس، محلات تجارية.`
        );
      }
    }
  }, [city, filteredProperties.length]);

  // Page numbers for pagination
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
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/properties" className="hover:text-orange-600">
              العقارات
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className={`text-${themeColor}-600 font-medium`}>{city.nameAr}</span>
          </nav>
        </div>
      </div>

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
              onCityChange={() => {}} // City is fixed on this page
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
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {paginatedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
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
                    onCityChange={() => {}}
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
              أحياء ومناطق {city.nameAr}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
              {cityData.categories.map((category) => (
                <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className={`font-bold mb-2 ${category.color.replace("bg-", "text-")}`}>
                    {category.nameAr}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {category.districts.slice(0, 4).map((district) => (
                      <li key={district}>{district}</li>
                    ))}
                    {category.districts.length > 4 && (
                      <li className="text-gray-400">+{category.districts.length - 4} أخرى</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
              لماذا {city.nameAr}؟
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>موقع استراتيجي على ساحل البحر المتوسط</li>
              <li>بنية تحتية متطورة ومرافق حديثة</li>
              <li>مجتمعات سكنية متكاملة وآمنة</li>
              <li>فرص استثمارية واعدة</li>
              {isNewMansoura && <li>مدينة الجيل الرابع بمعايير عالمية</li>}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
