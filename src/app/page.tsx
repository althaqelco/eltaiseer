"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Footer } from "@/components/Footer";
import { Property } from "@/lib/mockData";
import { getAllProperties, getAllPropertiesAsync } from "@/lib/propertyStore";
import { CityId } from "@/lib/egyptPlaces";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityId | "all">("all");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("الكل");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("الكل");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    // Initial load from cache/mock
    const cachedProperties = getAllProperties();
    setProperties(cachedProperties);
    
    // Then fetch from Firestore
    getAllPropertiesAsync().then((firestoreProperties) => {
      if (firestoreProperties.length > 0) {
        setProperties(firestoreProperties);
        console.log(`🏠 تم تحميل ${firestoreProperties.length} عقار من Firestore`);
      }
    }).catch(console.error);
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Filter by city - العقارات بدون cityId تعتبر من دمياط الجديدة
      if (selectedCity !== "all") {
        const propertyCityId = property.location.cityId || "new-damietta";
        if (propertyCityId !== selectedCity) {
          return false;
        }
      }

      // Filter by district
      if (
        selectedDistricts.length > 0 &&
        !selectedDistricts.includes(property.location.district)
      ) {
        return false;
      }

      // Filter by type
      if (
        selectedTypes.length > 0 &&
        !selectedTypes.includes(property.type)
      ) {
        return false;
      }

      // Filter by price range
      if (property.price < priceRange.min || property.price > priceRange.max) {
        return false;
      }

      // Filter by status
      if (selectedStatus !== "الكل" && property.status !== selectedStatus) {
        return false;
      }

      // Filter by payment method
      if (selectedPaymentMethod !== "الكل" && property.payment.type !== selectedPaymentMethod) {
        return false;
      }

      return true;
    });
  }, [properties, selectedCity, selectedDistricts, selectedTypes, priceRange, selectedStatus, selectedPaymentMethod]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  
  // Get properties for current page
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, endIndex);
  }, [filteredProperties, currentPage, ITEMS_PER_PAGE]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, selectedDistricts, selectedTypes, priceRange, selectedStatus, selectedPaymentMethod]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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

  const handleHeroSearch = (filters: {
    city: CityId | "all";
    district: string;
    type: string;
  }) => {
    // Set city
    setSelectedCity(filters.city);

    // Set districts
    if (filters.district !== "all") {
      setSelectedDistricts([filters.district]);
    } else {
      setSelectedDistricts([]);
    }

    // Set types
    if (filters.type !== "all") {
      setSelectedTypes([filters.type]);
    } else {
      setSelectedTypes([]);
    }

    // Scroll to properties section
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedCity("all");
    setSelectedDistricts([]);
    setSelectedTypes([]);
    setSelectedStatus("الكل");
    setSelectedPaymentMethod("الكل");
    setPriceRange({ min: 0, max: 50000000 });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <HeroSection 
        onSearch={handleHeroSearch} 
        totalProperties={properties.length}
        totalDistricts={new Set(properties.map(p => p.location.district)).size}
      />


      {/* Properties Section */}
      <section id="properties" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                العقارات المتاحة
              </h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                {filteredProperties.length} عقار متاح
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="md:hidden gap-2"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                الفلاتر
              </Button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-orange-500" : ""}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-orange-500" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-8">
            {/* Desktop Sidebar - Right side for RTL */}
            <aside className="hidden md:block w-80 flex-shrink-0 order-first">
              <FilterSidebar
                selectedCity={selectedCity}
                selectedDistricts={selectedDistricts}
                selectedTypes={selectedTypes}
                selectedStatus={selectedStatus}
                selectedPaymentMethod={selectedPaymentMethod}
                priceRange={priceRange}
                onCityChange={setSelectedCity}
                onDistrictChange={setSelectedDistricts}
                onTypeChange={setSelectedTypes}
                onStatusChange={setSelectedStatus}
                onPaymentMethodChange={setSelectedPaymentMethod}
                onPriceChange={setPriceRange}
                onClearFilters={clearFilters}
                totalResults={filteredProperties.length}
              />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowMobileFilters(false)}
                />
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-auto">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold">الفلاتر</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar
                      selectedCity={selectedCity}
                      selectedDistricts={selectedDistricts}
                      selectedTypes={selectedTypes}
                      selectedStatus={selectedStatus}
                      selectedPaymentMethod={selectedPaymentMethod}
                      priceRange={priceRange}
                      onCityChange={setSelectedCity}
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

            {/* Properties Grid */}
            <div className="flex-1">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12 md:py-16 bg-white rounded-xl">
                  <p className="text-gray-500 text-base md:text-lg">لا توجد نتائج مطابقة</p>
                  <Button
                    variant="link"
                    onClick={clearFilters}
                    className="text-orange-500 mt-2"
                  >
                    مسح جميع الفلاتر
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                        : "flex flex-col gap-3 md:gap-4"
                    }
                  >
                    {paginatedProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Show count */}
                  <div className="text-center text-sm text-gray-500 mt-6">
                    عرض {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} من {filteredProperties.length} عقار
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      {/* Previous Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-10 w-10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          <Button
                            key={index}
                            variant={page === currentPage ? "default" : "outline"}
                            size="icon"
                            onClick={() => typeof page === "number" && handlePageChange(page)}
                            disabled={page === "..."}
                            className={`h-10 w-10 ${
                              page === currentPage
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : page === "..."
                                ? "cursor-default hover:bg-transparent"
                                : ""
                            }`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      {/* Next Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-10 w-10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* View All Link */}
                  <div className="text-center mt-8">
                    <Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600">
                      <Link href="/properties">
                        عرض جميع العقارات
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section - Before Footer */}
      <WhyUsSection />

      <Footer />
    </div>
  );
}
