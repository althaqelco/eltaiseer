"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Home, ChevronLeft, MapPin, ChevronRight, Building2 } from "lucide-react";
import { getAllProperties } from "@/lib/propertyStore";
import { getCategoryByDistrict } from "@/lib/damiettaPlaces";
import { Property } from "@/lib/mockData";

const ITEMS_PER_PAGE = 12;

// District slug mapping (English URLs)
const DISTRICT_SLUGS: Record<string, string> = {
  "first-district": "الحي الأول",
  "second-district": "الحي الثاني",
  "third-district": "الحي الثالث",
  "fourth-district": "الحي الرابع",
  "fifth-district": "الحي الخامس",
  "sixth-district": "الحي السادس (المتميز)",
  "janna-project": "مشروع جنة",
  "dar-misr": "دار مصر - موقع 1",
  "sakan-misr": "سكن مصر - جنوب الحي الأول",
  "beit-al-watan": "بيت الوطن - شرق",
  "central-area": "المنطقة المركزية (أ)",
  "chalets": "منطقة الشاليهات",
};

const PROPERTY_TYPES = ["الكل", "شقة", "فيلا منفصلة", "دوبلكس", "محل تجاري", "أرض"];

export default function DistrictPage() {
  const params = useParams();
  const slug = params.slug as string;
  const districtName = DISTRICT_SLUGS[slug] || decodeURIComponent(slug).replace(/-/g, " ");
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("الكل");

  const category = getCategoryByDistrict(districtName);

  useEffect(() => {
    const allProperties = getAllProperties();
    // Filter by district or category
    const filtered = allProperties.filter(p => {
      if (category) {
        return category.districts.some(d => p.location.district.includes(d.split(" ")[0]));
      }
      return p.location.district.includes(districtName.split(" ")[0]);
    });
    setProperties(filtered);
  }, [districtName, category]);

  const filteredProperties = useMemo(() => {
    if (selectedType === "الكل") return properties;
    return properties.filter(p => p.type === selectedType);
  }, [properties, selectedType]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Dynamic SEO
  useEffect(() => {
    if (districtName) {
      document.title = `عقارات ${districtName} | شقق وفيلات للبيع - التيسير للعقارات`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", 
          `اكتشف أفضل العقارات للبيع في ${districtName} - دمياط الجديدة. شقق، فيلات، دوبلكس، محلات تجارية بأسعار تنافسية. ${filteredProperties.length} عقار متاح.`
        );
      }
    }
  }, [districtName, filteredProperties.length]);

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
            <span className="text-orange-600 font-medium">{districtName}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-10 w-10 text-orange-400" />
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
              {category.nameAr} - دمياط الجديدة
            </p>
          )}
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
            <Button asChild className="mt-4 bg-orange-500">
              <Link href="/properties">تصفح جميع العقارات</Link>
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon" onClick={() => setCurrentPage(page)} className={currentPage === page ? "bg-orange-500" : ""}>
                {page}
              </Button>
            ))}
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            عقارات للبيع في {districtName}
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
            <p>
              اكتشف أفضل الفرص العقارية في {districtName} بدمياط الجديدة. 
              نوفر لك مجموعة متنوعة من العقارات تشمل الشقق السكنية والفيلات والدوبلكس 
              بأسعار تنافسية وخيارات دفع مرنة.
            </p>
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">
              لماذا {districtName}؟
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>موقع استراتيجي في قلب دمياط الجديدة</li>
              <li>قريب من الخدمات والمرافق الأساسية</li>
              <li>بنية تحتية متطورة وشوارع واسعة</li>
              <li>مجتمع آمن ومناسب للعائلات</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
