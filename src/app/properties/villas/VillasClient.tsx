"use client";

import { useState, useEffect, useMemo } from "react";
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
import { getAllPropertiesAsync } from "@/lib/propertyStore";
import { PLACE_CATEGORIES } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { ListingPagination } from "@/components/ListingPagination";
import { CATEGORY_PAGE_SIZE } from "@/lib/pagination";

const ITEMS_PER_PAGE = CATEGORY_PAGE_SIZE;
const VILLA_TYPES = ["فيلا منفصلة", "تاون هاوس", "توين هاوس"];

export default function VillasClient({ initialProperties, page = 1 }: { initialProperties: Property[]; page?: number }) {
  const [properties, setProperties] = useState<Property[]>(
    () => initialProperties.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
  );
  // صفحة الترقيم المحلي عند تفعيل فلتر الحي؛ بدونه الصفحة تأتي من الرابط (?page=N)
  const [filterPage, setFilterPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  useEffect(() => {
    // البيانات الأولية من الخادم؛ تحديث حي من Firestore بعد التحميل
    getAllPropertiesAsync().then((allProperties) => {
      const villas = allProperties.filter(p => VILLA_TYPES.includes(p.type));
      if (villas.length > 0) setProperties(villas);
    }).catch(console.error);
  }, []);

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
      <Breadcrumb items={breadcrumbPresets.villas} />

      {/* Hero Section */}
      <div className="bg-gradient-to-l from-emerald-900 via-emerald-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Castle className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                فيلات للبيع في دمياط الجديدة والمنصورة الجديدة
              </h1>
              <p className="text-gray-300 mt-2">
                {filteredProperties.length} فيلا متاحة للبيع - فيلات مستقلة، تاون هاوس، توين هاوس
              </p>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            اكتشف أفخم الفيلات للبيع في دمياط الجديدة والمنصورة الجديدة. فيلات مستقلة بحدائق خاصة، تاون هاوس، 
            توين هاوس بمساحات من 200 متر حتى 1000 متر. تشطيبات فاخرة وحمامات سباحة خاصة.
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

        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">فيلات فاخرة للبيع في دمياط الجديدة والمنصورة الجديدة</h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
            <p>
              استمتع بالفخامة والخصوصية مع أفضل الفيلات للبيع في دمياط الجديدة والمنصورة الجديدة. نقدم لكم فيلات 
              مستقلة بحدائق خاصة ومسابح، تاون هاوس بتصميمات عصرية، وتوين هاوس بأسعار مميزة.
            </p>
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">مميزات الفيلات</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>حدائق خاصة ومساحات خضراء</li>
              <li>حمامات سباحة خاصة</li>
              <li>جراجات لعدة سيارات</li>
              <li>غرف خدم وسائقين</li>
              <li>تشطيبات فاخرة ألترا سوبر لوكس</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
