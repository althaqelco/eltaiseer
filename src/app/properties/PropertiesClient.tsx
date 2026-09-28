"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  List,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  Eye,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { Breadcrumb, breadcrumbPresets } from "@/components/Breadcrumb";
import { getAllPropertiesAsync } from "@/lib/propertyStore";
import { CITIES, CITY_DATA, CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { getDistrictColor } from "@/lib/egyptPlaces";
import { getPropertyUrl } from "@/lib/districtSlugs";
import { formatPriceShort as formatPrice, getWhatsAppUrl, COMPANY_WHATSAPP } from "@/lib/format";
import { ListingPagination } from "@/components/ListingPagination";
import { HUB_PAGE_SIZE } from "@/lib/pagination";

const PROPERTY_TYPES = [
  "شقة",
  "شقة فاخرة",
  "فيلا منفصلة",
  "دوبلكس",
  "بنتهاوس",
  "محل تجاري",
  "مقر إداري",
  "عيادة",
  "أرض",
  "مبنى تحت الإنشاء",
  "شاليه",
  "روف",
];

const ITEMS_PER_PAGE = HUB_PAGE_SIZE;
const DEFAULT_PRICE_RANGE = { min: 0, max: 100000000 };

// يقرأ فلاتر الرابط (?district= ?type= ?search= التي يستخدمها SearchAction) داخل Suspense خاص به —
// useSearchParams في صفحة ثابتة يحوّل أقرب Suspense لعرض عميل فقط، وكان يغلف الصفحة كلها
// فيرسل الخادم «جاري تحميل العقارات...» بلا H1 ولا روابط إعلانات
function UrlFilterSync({
  onChange,
}: {
  onChange: (filters: { district: string | null; type: string | null; search: string | null }) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onChange({
      district: searchParams.get("district"),
      type: searchParams.get("type"),
      search: searchParams.get("search"),
    });
  }, [searchParams, onChange]);
  return null;
}

interface PropertiesClientProps {
  initialProperties: Property[];
  // رقم الصفحة من الرابط (?page=N) — يُعرض من الخادم
  page?: number;
}

export default function PropertiesClient({ initialProperties, page = 1 }: PropertiesClientProps) {
  const [properties, setProperties] = useState<Property[]>(
    () => initialProperties.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  // صفحة الترقيم المحلي عند تفعيل فلتر؛ بدون فلاتر الصفحة تأتي من الرابط (?page=N)
  const [filterPage, setFilterPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityId | "all">("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);

  useEffect(() => {
    // البيانات الأولية من الخادم؛ تحديث حي من Firestore بعد التحميل
    getAllPropertiesAsync().then((firestoreProperties) => {
      if (firestoreProperties.length > 0) {
        setProperties(firestoreProperties);
      }
    }).catch(console.error);
  }, []);

  // Check URL params (يدعم search الذي يستخدمه SearchAction schema)
  const applyUrlFilters = useCallback(
    ({ district, type, search }: { district: string | null; type: string | null; search: string | null }) => {
      if (district) setSelectedDistrict(district);
      if (type) setSelectedType(type);
      if (search) setSearchQuery(search);
      if (district || type || search) setFilterPage(1);
    },
    []
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedCity !== "all") {
        const propertyCityId = p.location.cityId || "new-damietta";
        if (propertyCityId !== selectedCity) return false;
      }
      if (selectedDistrict !== "all" && p.location.district !== selectedDistrict)
        return false;
      if (selectedType !== "all" && p.type !== selectedType) return false;
      if (selectedStatus !== "all" && p.status !== selectedStatus) return false;
      if (selectedPaymentMethod !== "all" && p.payment.type !== selectedPaymentMethod) return false;
      if (p.price < priceRange.min || p.price > priceRange.max) return false;
      if (
        searchQuery &&
        !p.title.includes(searchQuery) &&
        !p.location.district.includes(searchQuery) &&
        !(p.location.city && p.location.city.includes(searchQuery))
      )
        return false;
      return true;
    });
  }, [properties, selectedCity, selectedDistrict, selectedType, selectedStatus, selectedPaymentMethod, priceRange, searchQuery]);

  const filtersActive =
    searchQuery !== "" ||
    selectedCity !== "all" ||
    selectedDistrict !== "all" ||
    selectedType !== "all" ||
    selectedStatus !== "all" ||
    selectedPaymentMethod !== "all" ||
    priceRange.min !== DEFAULT_PRICE_RANGE.min ||
    priceRange.max !== DEFAULT_PRICE_RANGE.max;
  const currentPage = filtersActive ? filterPage : page;
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const handleWhatsApp = (property: Property) => {
    const message =
      `مرحباً، أنا مهتم بـ: ${property.title}\nالسعر: ${formatPrice(property.price)} جنيه\nالموقع: ${property.location.district}`;
    window.open(getWhatsAppUrl(COMPANY_WHATSAPP, message), "_blank");
  };

  const clearFilters = () => {
    setSelectedCity("all");
    setSelectedDistrict("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedPaymentMethod("all");
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSearchQuery("");
    setFilterPage(1);
  };

  // Get categories based on selected city
  const getCategories = () => {
    if (selectedCity === "all") {
      return [
        { city: CITIES["new-damietta"], categories: CITY_DATA["new-damietta"].categories },
        { city: CITIES["new-mansoura"], categories: CITY_DATA["new-mansoura"].categories },
      ];
    }
    return [{ city: CITIES[selectedCity], categories: CITY_DATA[selectedCity].categories }];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <UrlFilterSync onChange={applyUrlFilters} />
      </Suspense>
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbPresets.properties} />

      {/* Page Header */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            جميع العقارات
          </h1>
          <p className="text-gray-300">
            تصفح {filteredProperties.length} عقار متاح للبيع في دمياط الجديدة والمنصورة الجديدة
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative md:col-span-2 lg:col-span-2">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن عقار..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFilterPage(1);
                  }}
                  className="pr-10"
                />
              </div>

              {/* City Filter */}
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value as CityId | "all");
                  setSelectedDistrict("all");
                  setFilterPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="المدينة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المدن</SelectItem>
                  {Object.values(CITIES).map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* District Filter */}
              <Select
                value={selectedDistrict}
                onValueChange={(value) => {
                  setSelectedDistrict(value);
                  setFilterPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="المنطقة" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectItem value="all">جميع المناطق</SelectItem>
                  {getCategories().map(({ city, categories }) => (
                    <SelectGroup key={city.id}>
                      <SelectLabel className={`font-bold ${city.id === "new-damietta" ? "text-orange-600" : "text-emerald-600"
                        }`}>
                        {city.nameAr}
                      </SelectLabel>
                      {categories.map((category) =>
                        category.districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value);
                  setFilterPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Second Row of Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setFilterPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="حالة العقار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="جاهز">جاهز للتسليم</SelectItem>
                  <SelectItem value="تحت الإنشاء">تحت الإنشاء</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Method Filter */}
              <Select
                value={selectedPaymentMethod}
                onValueChange={(value) => {
                  setSelectedPaymentMethod(value);
                  setFilterPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع طرق الدفع</SelectItem>
                  <SelectItem value="كاش">كاش (نقدي)</SelectItem>
                  <SelectItem value="تقسيط">تقسيط</SelectItem>
                  <SelectItem value="كاش أو تقسيط">كاش أو تقسيط</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle & Clear */}
              <div className="flex items-center gap-2 lg:col-span-2 justify-end">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
                <Button variant="outline" onClick={clearFilters} className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            عرض {paginatedProperties.length} من {filteredProperties.length} عقار
          </p>
          <p className="text-gray-500 text-sm">
            صفحة {currentPage} من {totalPages || 1}
          </p>
        </div>

        {/* Properties Grid/List */}
        {paginatedProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة</p>
            <Button
              variant="link"
              onClick={clearFilters}
              className="text-orange-600 mt-2"
            >
              مسح جميع الفلاتر
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <Link
                    href={getPropertyUrl(property)}
                    className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0"
                  >
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-orange-500">
                      للبيع
                    </Badge>
                    {property.isVerified && (
                      <Badge className="absolute top-3 left-3 bg-blue-500 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        موثق
                      </Badge>
                    )}
                  </Link>

                  {/* Content */}
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        {/* Title & Price */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                          <Link
                            href={getPropertyUrl(property)}
                            className="hover:text-orange-600 transition-colors"
                          >
                            <h3 className="text-xl font-bold text-gray-800">
                              {property.title}
                            </h3>
                          </Link>
                          <div className="text-left">
                            <p className="text-2xl font-bold text-orange-600">
                              {formatPrice(property.price)}
                            </p>
                            <p className="text-sm text-gray-500">جنيه مصري</p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-4">
                          <Badge
                            className={`${getDistrictColor(property.location.district)} text-white`}
                          >
                            <MapPin className="h-3 w-3 ms-1" />
                            {property.location.district}
                          </Badge>
                          <span className="text-gray-500 text-sm">
                            {property.location.address}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{property.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            <span>{property.details.area_sqm} م²</span>
                          </div>
                          {property.details.bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4" />
                              <span>{property.details.bedrooms} غرف</span>
                            </div>
                          )}
                          {property.details.bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              <span>{property.details.bathrooms} حمام</span>
                            </div>
                          )}
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {property.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {property.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{property.amenities.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Button
                          onClick={() => handleWhatsApp(property)}
                          className="bg-orange-500 hover:bg-orange-600 gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          واتساب
                        </Button>
                        <Button asChild variant="outline" className="gap-2">
                          <Link href={getPropertyUrl(property)}>
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </Link>
                        </Button>
                        <span className="text-xs text-gray-400 ms-auto">
                          {property.id}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination — روابط ?page=N حقيقية، أو أزرار محلية عند تفعيل فلتر */}
        <ListingPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/properties/"
          onPageChange={filtersActive ? setFilterPage : undefined}
        />
      </main>

      <Footer />
    </div>
  );
}
