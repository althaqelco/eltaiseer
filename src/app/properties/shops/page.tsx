"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Home, ChevronLeft, Store, ChevronRight } from "lucide-react";
import { getAllProperties } from "@/lib/propertyStore";
import { PLACE_CATEGORIES } from "@/lib/damiettaPlaces";
import { Property } from "@/lib/mockData";

const ITEMS_PER_PAGE = 12;
const COMMERCIAL_TYPES = ["محل تجاري", "مقر إداري", "مكتب"];

export default function ShopsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  useEffect(() => {
    const allProperties = getAllProperties();
    const shops = allProperties.filter(p => COMMERCIAL_TYPES.includes(p.type));
    setProperties(shops);
  }, []);

  const filteredProperties = useMemo(() => {
    if (selectedDistrict === "all") return properties;
    return properties.filter(p => p.location.district === selectedDistrict);
  }, [properties, selectedDistrict]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 flex items-center gap-1"><Home className="h-4 w-4" />الرئيسية</Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/properties" className="hover:text-orange-600">جميع العقارات</Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-orange-600 font-medium">محلات تجارية</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-l from-blue-900 via-blue-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Store className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">محلات تجارية للبيع في دمياط الجديدة</h1>
              <p className="text-gray-300 mt-2">{filteredProperties.length} محل تجاري ومقر إداري متاح للبيع</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            اكتشف أفضل المحلات التجارية والمقرات الإدارية للبيع في دمياط الجديدة. مواقع استراتيجية على الشوارع الرئيسية.
            مساحات متنوعة تناسب جميع الأنشطة التجارية.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-4">
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="اختر الحي" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأحياء</SelectItem>
                {PLACE_CATEGORIES.map((cat) => (
                  <SelectGroup key={cat.id}>
                    <SelectLabel className="text-orange-600">{cat.nameAr}</SelectLabel>
                    {cat.districts.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="mb-6"><p className="text-gray-600">عرض {paginatedProperties.length} من {filteredProperties.length} محل</p></div>

        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProperties.map((property) => (<PropertyCard key={property.id} property={property} />))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد محلات متاحة حالياً</p>
            <Button asChild className="mt-4 bg-orange-500"><Link href="/properties">تصفح جميع العقارات</Link></Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronRight className="h-4 w-4" /></Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon" onClick={() => setCurrentPage(page)} className={currentPage === page ? "bg-orange-500" : ""}>{page}</Button>
            ))}
            <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronLeft className="h-4 w-4" /></Button>
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">محلات تجارية ومقرات إدارية للبيع</h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
            <p>ابدأ مشروعك التجاري في دمياط الجديدة مع أفضل المحلات والمقرات الإدارية. مواقع استراتيجية وإطلالات مميزة.</p>
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">أنواع العقارات التجارية</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>محلات تجارية:</strong> على الشوارع الرئيسية والمولات</li>
              <li><strong>مقرات إدارية:</strong> مكاتب جاهزة للشركات</li>
              <li><strong>معارض:</strong> مساحات كبيرة للعرض</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
