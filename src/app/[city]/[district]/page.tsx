"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
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
import { getAllProperties, getAllPropertiesAsync } from "@/lib/propertyStore";
import { getCategoryByDistrict, CITIES, CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";

const VALID_CITIES = ["new-damietta", "new-mansoura"];
const ITEMS_PER_PAGE = 12;

// District slug mapping
const DISTRICT_SLUGS: Record<string, string> = {
  // New Damietta
  "first-district": "الحي الأول",
  "second-district": "الحي الثاني",
  "third-district": "الحي الثالث",
  "fourth-district": "الحي الرابع",
  "fifth-district": "الحي الخامس",
  "sixth-district": "الحي السادس (المتميز)",
  "janna-project": "مشروع جنة",
  "dar-misr-1": "دار مصر - موقع 1",
  "dar-misr-2": "دار مصر - موقع 2",
  "sakan-misr-south": "سكن مصر - جنوب الحي الأول",
  "sakan-misr-west": "سكن مصر - غرب الجامعات",
  "beit-al-watan-east": "بيت الوطن - شرق",
  "beit-al-watan-west": "بيت الوطن - غرب",
  "beit-al-watan-beach": "بيت الوطن - امتداد الشاطئ",
  "central-area-a": "المنطقة المركزية (أ)",
  "central-area-b": "المنطقة المركزية (ب)",
  "central-area-c": "المنطقة المركزية (ج)",
  "chalets": "منطقة الشاليهات",
  // New Mansoura - Residential
  "r1": "R1",
  "r2": "R2",
  "r3": "R3",
  "r4": "R4",
  "r5": "R5",
  "r6": "R6",
  "r7": "R7",
  "residential-1": "الحي السكني الأول",
  "residential-2": "الحي السكني الثاني",
  "residential-3": "الحي السكني الثالث",
  // New Mansoura - National Projects
  "sakan-kol-misryeen": "سكن لكل المصريين",
  "sakan-kol-misryeen-2": "سكن لكل المصريين 2",
  "sakan-kol-misryeen-3": "سكن لكل المصريين 3",
  "dar-misr": "دار مصر",
  "janna": "جنة",
  "medium-housing": "الإسكان المتوسط",
  "social-housing": "الإسكان الاجتماعي",
  // New Mansoura - Villas
  "villas-district": "حي الفيلات",
  "villas-d": "منطقة الفيلات D",
  "golf-villas": "فيلات الجولف",
  "lake-villas": "فيلات البحيرات",
  // New Mansoura - Commercial
  "downtown": "داون تاون",
  "central-mall": "المول التجاري المركزي",
  "cbd": "منطقة الأعمال المركزية CBD",
  "commercial-axis": "المحور التجاري",
  "services-zone": "منطقة الخدمات",
  // New Mansoura - Entertainment
  "central-park": "الحديقة المركزية",
  "corniche": "منطقة الكورنيش",
  "social-club": "النادي الاجتماعي",
  "touristic-zone": "المنطقة السياحية",
  // New Mansoura - Coastal
  "waterfront": "الواجهة البحرية",
  "beach": "شاطئ المنصورة الجديدة",
  "coastal-resorts": "منتجعات الساحل",
};

const PROPERTY_TYPES = ["الكل", "شقة", "شقة فاخرة", "فيلا منفصلة", "دوبلكس", "محل تجاري", "أرض"];

export default function DistrictPage() {
  const params = useParams();
  const citySlug = params.city as string;
  const districtSlug = params.district as string;
  
  // Validate city
  if (!VALID_CITIES.includes(citySlug)) {
    notFound();
  }
  
  const cityId = citySlug as CityId;
  const city = CITIES[cityId];
  const districtName = DISTRICT_SLUGS[districtSlug] || decodeURIComponent(districtSlug).replace(/-/g, " ");
  const isNM = citySlug === "new-mansoura";
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("الكل");

  const category = getCategoryByDistrict(districtName, cityId);

  // Load properties
  useEffect(() => {
    const loadProps = async () => {
      let allProperties = getAllProperties();
      
      // Try to get from Firestore
      try {
        const firestoreProps = await getAllPropertiesAsync();
        if (firestoreProps.length > 0) {
          allProperties = firestoreProps;
        }
      } catch (e) {
        console.error(e);
      }
      
      // Filter by city first
      const cityFiltered = allProperties.filter(p => 
        (p.location.cityId || "new-damietta") === cityId
      );
      
      // Then filter by exact district name
      const filtered = cityFiltered.filter(p => {
        // Exact match or partial match for the specific district
        const propertyDistrict = p.location.district;
        
        // Check exact match first
        if (propertyDistrict === districtName) {
          return true;
        }
        
        // Check if property district contains the district name (for partial matches)
        if (propertyDistrict.includes(districtName) || districtName.includes(propertyDistrict)) {
          return true;
        }
        
        // For districts like "الحي الأول", check if it starts with the same prefix
        const districtPrefix = districtName.split(" ")[0];
        if (districtPrefix && propertyDistrict.startsWith(districtPrefix) && 
            districtName.startsWith(districtPrefix)) {
          // Make sure it's the same district number
          return propertyDistrict === districtName || 
                 propertyDistrict.replace(/\s*\(.*\)/, "") === districtName.replace(/\s*\(.*\)/, "");
        }
        
        return false;
      });
      
      setProperties(filtered);
    };
    
    loadProps();
  }, [districtName, category, cityId]);

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
    if (districtName && city) {
      document.title = `عقارات ${districtName} - ${city.nameAr} | شقق وفيلات للبيع - التيسير للعقارات`;
    }
  }, [districtName, city]);

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
            <p>
              اكتشف أفضل الفرص العقارية في {districtName} ب{city?.nameAr}. 
              نوفر لك مجموعة متنوعة من العقارات تشمل الشقق السكنية والفيلات والدوبلكس 
              بأسعار تنافسية وخيارات دفع مرنة.
            </p>
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
      </main>

      <Footer />
    </div>
  );
}
