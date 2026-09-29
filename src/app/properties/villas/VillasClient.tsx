"use client";

import { useState, useMemo, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Castle } from "lucide-react";
import { Breadcrumb, breadcrumbPresets } from "@/components/Breadcrumb";
import { PLACE_CATEGORIES } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { ListingPagination } from "@/components/ListingPagination";
import { CATEGORY_PAGE_SIZE } from "@/lib/pagination";

const ITEMS_PER_PAGE = CATEGORY_PAGE_SIZE;

// lede وanswersSlot يُبنيان في الخادم (CategoryListing) للصفحة الأولى — لا نصوص إجابات في حزمة المتصفح
export default function VillasClient({
  initialProperties,
  page = 1,
  lede,
  answersSlot,
}: {
  initialProperties: Property[];
  page?: number;
  lede?: string;
  answersSlot?: ReactNode;
}) {
  const [properties] = useState<Property[]>(
    () => initialProperties.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
  );
  // صفحة الترقيم المحلي عند تفعيل فلتر الحي؛ بدونه الصفحة تأتي من الرابط (?page=N)
  const [filterPage, setFilterPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  // البيانات تأتي من الخادم (ISR يحدّثها كل 300 ث)، فلا نعيد جلبها من Firestore في المتصفح:
  // إعادة الجلب كانت تحمّل Firebase SDK وتقرأ المجموعة كاملة في كل زيارة لبيانات موجودة في HTML.

  const filteredProperties = useMemo(() => {
    if (selectedDistrict === "all") return properties;
    return properties.filter(p => p.location.district === selectedDistrict);
  }, [properties, selectedDistrict]);

  const filtersActive = selectedDistrict !== "all";
  const currentPage = filtersActive ? filterPage : page;
  useEffect(() => {
    setFilterPage(1);
  }, [selectedDistrict]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbPresets.villas} schema={false} />

      {/* Hero Section */}
      <div className="bg-gradient-to-l from-emerald-900 via-emerald-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Castle className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                فيلات للبيع في دمياط الجديدة والمنصورة الجديدة
              </h1>
              {lede ? (
                <p className="answer-lede text-gray-200 mt-3 leading-loose max-w-4xl">{lede}</p>
              ) : (
                <p className="text-gray-300 mt-2">
                  {filteredProperties.length} فيلا متاحة للبيع - فيلات مستقلة، تاون هاوس، توين هاوس
                </p>
              )}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            فيلات مستقلة وتاون هاوس وتوين هاوس معروضة للبيع في دمياط الجديدة والمنصورة الجديدة، ولكل فيلا صفحة بمساحتها وسعرها ومواصفاتها.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="اختر الحي" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأحياء</SelectItem>
                {PLACE_CATEGORIES.map((category) => (
                  <SelectGroup key={category.id}>
                    <SelectLabel className="text-orange-600">{category.nameAr}</SelectLabel>
                    {category.districts.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">عرض {paginatedProperties.length} من {filteredProperties.length} فيلا</p>
        </div>

        {/* Properties Grid */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Castle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد فيلات متاحة حالياً</p>
            <Button asChild className="mt-4 bg-orange-500">
              <Link href="/properties">تصفح جميع العقارات</Link>
            </Button>
          </div>
        )}

        {/* Pagination — روابط ?page=N حقيقية، أو أزرار محلية عند تفعيل فلتر الحي */}
        <ListingPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/properties/villas/"
          onPageChange={filtersActive ? setFilterPage : undefined}
        />

        {/* سؤال السعر وسطر التحديث من الخادم (الصفحة الأولى) */}
        {answersSlot}
      </main>

      <Footer />
    </div>
  );
}
