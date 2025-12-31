"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Footer } from "@/components/Footer";
import { Property } from "@/lib/mockData";
import { getAllProperties } from "@/lib/propertyStore";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, SlidersHorizontal, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("الكل");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("الكل");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(13);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allProperties = getAllProperties();
    setProperties(allProperties);
    // Log 3 examples to console
    console.log("🏠 التيسير للعقارات - Sample Properties:");
    allProperties.slice(0, 3).forEach((p: Property, i: number) => {
      console.log(`\n${i + 1}. ${p.title}`);
      console.log(`   📍 ${p.location.district} - ${p.location.address}`);
      console.log(`   💰 ${p.price.toLocaleString()} ${p.currency} (${p.category})`);
      console.log(`   🏷️ ${p.type} | ${p.details.area_sqm}م² | ${p.details.finishing}`);
      console.log(`   ✅ Verified: ${p.isVerified}`);
    });
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
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
  }, [properties, selectedDistricts, selectedTypes, priceRange, selectedStatus, selectedPaymentMethod]);

  // Visible properties (for infinite scroll)
  const visibleProperties = useMemo(() => {
    return filteredProperties.slice(0, visibleCount);
  }, [filteredProperties, visibleCount]);

  // Load more function
  const loadMore = useCallback(() => {
    if (visibleCount >= filteredProperties.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 12, filteredProperties.length));
      setIsLoadingMore(false);
    }, 300);
  }, [visibleCount, filteredProperties.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isLoadingMore]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(13);
  }, [selectedDistricts, selectedTypes, priceRange, selectedStatus, selectedPaymentMethod]);

  const handleHeroSearch = (filters: {
    district: string;
    type: string;
  }) => {
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
    setSelectedDistricts([]);
    setSelectedTypes([]);
    setSelectedStatus("الكل");
    setSelectedPaymentMethod("الكل");
    setPriceRange({ min: 0, max: 50000000 });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <HeroSection onSearch={handleHeroSearch} />

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
                selectedDistricts={selectedDistricts}
                selectedTypes={selectedTypes}
                selectedStatus={selectedStatus}
                selectedPaymentMethod={selectedPaymentMethod}
                priceRange={priceRange}
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
                      selectedDistricts={selectedDistricts}
                      selectedTypes={selectedTypes}
                      selectedStatus={selectedStatus}
                      selectedPaymentMethod={selectedPaymentMethod}
                      priceRange={priceRange}
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
                    {visibleProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Load More Trigger */}
                  {visibleCount < filteredProperties.length && (
                    <div
                      ref={loadMoreRef}
                      className="flex justify-center items-center py-8"
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2 text-orange-500">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>جاري التحميل...</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={loadMore}
                          className="gap-2"
                        >
                          عرض المزيد ({filteredProperties.length - visibleCount} عقار)
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Show count */}
                  <div className="text-center text-sm text-gray-500 mt-4">
                    عرض {visibleProperties.length} من {filteredProperties.length} عقار
                  </div>

                  {/* View All Link */}
                  <div className="text-center mt-6">
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

      <Footer />
    </div>
  );
}
