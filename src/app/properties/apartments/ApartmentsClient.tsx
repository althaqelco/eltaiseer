"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { Breadcrumb, breadcrumbPresets } from "@/components/Breadcrumb";
import { PLACE_CATEGORIES } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { ListingPagination } from "@/components/ListingPagination";
import { CATEGORY_PAGE_SIZE } from "@/lib/pagination";

const ITEMS_PER_PAGE = CATEGORY_PAGE_SIZE;
const APARTMENT_TYPES = ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس", "روف"];

export default function ApartmentsClient({ initialProperties, page = 1 }: { initialProperties: Property[]; page?: number }) {
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
      <Breadcrumb items={breadcrumbPresets.apartments} />

      {/* Hero Section */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                شقق للبيع في دمياط الجديدة والمنصورة الجديدة
              </h1>
              <p className="text-gray-300 mt-2">
                {filteredProperties.length} شقة متاحة للبيع - شقق تمليك، دوبلكس، بنتهاوس، روف
              </p>
            </div>
          </div>
          
          {/* SEO Content */}
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            شقق معروضة للبيع في دمياط الجديدة والمنصورة الجديدة بمساحات وتشطيبات مختلفة، ولكل شقة صفحة بسعرها ومساحتها وطريقة الدفع.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
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

              <div className="flex gap-2">
                {APARTMENT_TYPES.map(type => (
                  <Badge key={type} variant="outline" className="cursor-pointer hover:bg-orange-50 border-gray-300 text-gray-700">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">عرض {paginatedProperties.length} من {filteredProperties.length} شقة</p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Pagination — روابط ?page=N حقيقية، أو أزرار محلية عند تفعيل فلتر الحي */}
        <ListingPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/properties/apartments/"
          onPageChange={filtersActive ? setFilterPage : undefined}
        />

        {/* SEO Content Section */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">شقق للبيع في دمياط الجديدة والمنصورة الجديدة 2026</h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
            <p>
              دمياط الجديدة مدينة على ساحل البحر المتوسط بأحياء مخططة ومساحات خضراء. نعرض في التيسير للعقارات شققًا للبيع في أحيائها بأسعارها كما يعرضها البائعون، ووسيط سعر المتر لكل حي في صفحة أسعار العقارات.
            </p>
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">أنواع الشقق المتوفرة</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>شقق تمليك:</strong> مساحات من 80 إلى 200 متر مربع</li>
              <li><strong>دوبلكس:</strong> شقق دورين بمساحات واسعة</li>
              <li><strong>بنتهاوس:</strong> شقق بالدور الأخير مع روف خاص</li>
              <li><strong>روف:</strong> شقق بسطح خاص ومساحات مفتوحة</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">مميزات الشقق في دمياط الجديدة</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>تشطيبات سوبر لوكس ونصف تشطيب</li>
              <li>مواقف سيارات خاصة</li>
              <li>أمن وحراسة 24 ساعة</li>
              <li>قريبة من المدارس والخدمات</li>
              <li>عقارات تقبل التقسيط بشروط يحددها البائع</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
