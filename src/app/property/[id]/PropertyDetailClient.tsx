"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/mockData";
import { getPropertyByIdAsync, getRelatedProperties } from "@/lib/propertyStore";

import { getDistrictColor, getCategoryByDistrict } from "@/lib/egyptPlaces";
import { isFavorite, toggleFavorite } from "@/lib/favoritesStore";
import { PropertyCard } from "@/components/PropertyCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Building2,
  Phone,
  CheckCircle2,
  Share2,
  Heart,
  Home,
  Layers,
  PaintBucket,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PropertyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [isFav, setIsFav] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      // Extract ID from URL pathname instead of params (for static export compatibility)
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const idIndex = pathParts.indexOf('property') + 1;
      const id = pathParts[idIndex] || (params.id as string);
      
      // Skip if no valid ID
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      // Fetch from Firestore (async)
      const found = await getPropertyByIdAsync(id);
      setProperty(found || null);
      if (found) {
        setRelatedProperties(getRelatedProperties(found, 4));
        setIsFav(isFavorite(found.id));
        
        // Dynamic SEO - Update document title for new properties
        const formatPrice = (price: number) => {
          if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)} مليون جنيه`;
          }
          return `${price.toLocaleString("ar-EG")} جنيه`;
        };
        
        const cityName = found.location.city || "دمياط الجديدة";
        document.title = `${found.title} | ${found.type} للبيع في ${found.location.district} - ${cityName} - التيسير للعقارات`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", 
            `${found.type} للبيع في ${found.location.district} - ${cityName}. المساحة: ${found.details.area_sqm} م². السعر: ${formatPrice(found.price)}. ${found.details.bedrooms} غرف، ${found.details.bathrooms} حمام. تشطيب ${found.details.finishing}.`
          );
        }
        
        // Update OG title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute("content", `${found.title} - ${formatPrice(found.price)}`);
        }
      }
      setIsLoading(false);
    };
    
    loadProperty();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            العقار غير موجود
          </h1>
          <p className="text-gray-600 mb-8">
            عذراً، لم نتمكن من العثور على العقار المطلوب
          </p>
          <Button onClick={() => router.push("/")} className="bg-orange-500">
            <ArrowRight className="h-4 w-4 ms-2" />
            العودة للرئيسية
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const districtColor = getDistrictColor(property.location.district);
  const category = getCategoryByDistrict(property.location.district);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} مليون`;
    }
    return price.toLocaleString("ar-EG");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `مرحباً، أنا مهتم بـ: ${property.title}\nالسعر: ${formatPrice(property.price)} جنيه\nالموقع: ${property.location.district}\nرابط العقار: ${window.location.href}`
    );
    window.open(
      `https://wa.me/2${property.contact_whatsapp}?text=${message}`,
      "_blank"
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${formatPrice(property.price)} جنيه`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Sold Alert Banner */}
      {property.status === "تم البيع" && (
        <div className="bg-red-600 text-white py-3">
          <div className="container mx-auto px-4 flex items-center justify-center gap-3">
            <span className="font-bold text-lg">⚠️ هذا العقار تم بيعه</span>
            <span className="text-red-100">|</span>
            <Link href="/properties" className="underline hover:no-underline">
              تصفح عقارات مشابهة
            </Link>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/properties" className="hover:text-orange-600">
              جميع العقارات
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-gray-400 truncate max-w-[200px]">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-orange-500 hover:bg-orange-600">
                    للبيع
                  </Badge>
                  {property.isVerified && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      موثق
                    </Badge>
                  )}
                </div>

                {/* Sold Overlay */}
                {property.status === "تم البيع" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-2xl transform -rotate-12 shadow-2xl">
                      تم البيع
                    </div>
                  </div>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                        index === currentImageIndex
                          ? "ring-2 ring-orange-500"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`صورة ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Location */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {property.title}
                  </h1>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      title="مشاركة"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="حفظ">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge
                    className={`${districtColor} text-white text-sm px-3 py-1`}
                  >
                    <MapPin className="h-4 w-4 ms-1" />
                    {property.location.district}
                  </Badge>
                  {category && (
                    <Badge variant="outline" className="text-sm border-gray-300 text-gray-700">
                      {category.nameAr}
                    </Badge>
                  )}
                  {/* Status Badge */}
                  <Badge className={`text-sm px-3 py-1 ${
                    property.status === "جاهز" 
                      ? "bg-green-500 hover:bg-green-600" 
                      : property.status === "تم البيع"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}>
                    {property.status || "جاهز"}
                  </Badge>
                </div>

                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {property.location.address}
                </p>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Home className="h-5 w-5 text-orange-500" />
                  تفاصيل العقار
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Maximize className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">
                      {property.details.area_sqm}
                    </p>
                    <p className="text-gray-500 text-sm">متر مربع</p>
                  </div>

                  {property.details.bedrooms > 0 && (
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Bed className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800">
                        {property.details.bedrooms}
                      </p>
                      <p className="text-gray-500 text-sm">غرف نوم</p>
                    </div>
                  )}

                  {property.details.bathrooms > 0 && (
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Bath className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-800">
                        {property.details.bathrooms}
                      </p>
                      <p className="text-gray-500 text-sm">حمام</p>
                    </div>
                  )}

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Building2 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-800">
                      {property.type}
                    </p>
                    <p className="text-gray-500 text-sm">نوع العقار</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Layers className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-gray-500 text-sm">الدور</p>
                      <p className="font-semibold">{property.details.level}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <PaintBucket className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-gray-500 text-sm">التشطيب</p>
                      <p className="font-semibold">
                        {property.details.finishing}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {property.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    وصف العقار
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Options */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  خيارات الدفع
                </h2>

                <div className="space-y-4">
                  {/* Payment Type Badge */}
                  <div className="flex items-center gap-3">
                    <Badge className={`text-sm px-4 py-2 ${
                      property.payment?.type === "كاش" 
                        ? "bg-green-500" 
                        : property.payment?.type === "تقسيط" 
                        ? "bg-orange-500" 
                        : "bg-blue-500"
                    }`}>
                      {property.payment?.type || "كاش"}
                    </Badge>
                  </div>

                  {/* Installment Details */}
                  {property.payment?.type !== "كاش" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      {property.payment?.downPayment && (
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                          <p className="text-gray-500 text-sm mb-1">المقدم</p>
                          <p className="text-xl font-bold text-orange-600">
                            {formatPrice(property.payment.downPayment)}
                          </p>
                          <p className="text-xs text-gray-400">جنيه</p>
                        </div>
                      )}
                      
                      {property.payment?.monthlyInstallment && (
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                          <p className="text-gray-500 text-sm mb-1">القسط الشهري</p>
                          <p className="text-xl font-bold text-orange-600">
                            {formatPrice(property.payment.monthlyInstallment)}
                          </p>
                          <p className="text-xs text-gray-400">جنيه/شهر</p>
                        </div>
                      )}
                      
                      {property.payment?.installmentYears && (
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                          <p className="text-gray-500 text-sm mb-1">مدة التقسيط</p>
                          <p className="text-xl font-bold text-orange-600">
                            {property.payment.installmentYears}
                          </p>
                          <p className="text-xs text-gray-400">سنوات</p>
                        </div>
                      )}
                    </div>
                  )}

                  {property.payment?.type === "كاش" && (
                    <p className="text-gray-500 text-sm">
                      هذا العقار متاح للشراء نقداً فقط
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  المميزات والخدمات
                </h2>

                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100"
                    >
                      <CheckCircle2 className="h-4 w-4 ms-2" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-500 mb-2">السعر</p>
                  <p className="text-4xl font-bold text-orange-600">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-xl text-gray-600">جنيه مصري</p>
                </div>

                <Separator className="my-4" />

                {/* Contact Buttons - New Design */}
                <div className="flex items-center gap-2 justify-center">
                  {/* Call Button */}
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold"
                    onClick={() => {
                      window.location.href = `tel:${property.contact_whatsapp}`;
                    }}
                  >
                    <Phone className="h-5 w-5" />
                    إتصل
                  </Button>

                  {/* WhatsApp Button */}
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold"
                    onClick={handleWhatsApp}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    واتس آب
                  </Button>

                  {/* Favorite Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 border-2 ${
                      isFav 
                        ? "border-red-500 bg-red-50 text-red-500" 
                        : "border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500"
                    }`}
                    onClick={() => {
                      const newState = toggleFavorite(property.id);
                      setIsFav(newState);
                    }}
                  >
                    <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                  </Button>

                  {/* Share Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-2 border-gray-300 text-gray-400 hover:border-orange-500 hover:text-orange-500"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-2 text-gray-500 text-sm justify-center">
                  <Calendar className="h-4 w-4" />
                  <span>
                    تاريخ الإضافة:{" "}
                    {property.createdAt.toLocaleDateString("ar-EG")}
                  </span>
                </div>

                {property.isVerified && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">عقار موثق</span>
                    </div>
                    <p className="text-sm text-blue-500 mt-1">
                      تم التحقق من صحة البيانات
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">معلومات سريعة</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">رقم العقار</span>
                    <span className="font-mono">{property.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">النوع</span>
                    <span>{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المساحة</span>
                    <span>{property.details.area_sqm} م²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المنطقة</span>
                    <span>{property.location.district}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              عقارات مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty.id} property={relatedProperty} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
