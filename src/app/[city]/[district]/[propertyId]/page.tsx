"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb, getPropertyBreadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  CheckCircle2,
  Calendar,
  Building2,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import { getPropertyByIdAsync } from "@/lib/propertyStore";
import { CITIES, CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";

const VALID_CITIES = ["new-damietta", "new-mansoura"];

export default function PropertyDetailPage() {
  const params = useParams();
  const citySlug = params.city as string;
  const districtSlug = params.district as string;
  const propertyId = params.propertyId as string;
  
  // Validate city
  if (!VALID_CITIES.includes(citySlug)) {
    notFound();
  }
  
  const cityId = citySlug as CityId;
  const city = CITIES[cityId];
  const isNM = citySlug === "new-mansoura";
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load property
  useEffect(() => {
    const loadProperty = async () => {
      setIsLoading(true);
      try {
        const prop = await getPropertyByIdAsync(propertyId);
        setProperty(prop);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };
    
    loadProperty();
  }, [propertyId]);

  // Check favorite status
  useEffect(() => {
    if (typeof window !== "undefined" && property) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(property.id));
    }
  }, [property]);

  const toggleFavorite = () => {
    if (!property) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const newFavs = favorites.filter((id: string) => id !== property.id);
      localStorage.setItem("favorites", JSON.stringify(newFavs));
    } else {
      favorites.push(property.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share && property) {
      navigator.share({
        title: property.title,
        text: `${property.type} للبيع في ${property.location.district}`,
        url: window.location.href,
      });
    }
  };

  const handleWhatsApp = () => {
    if (!property) return;
    const message = encodeURIComponent(
      `مرحباً، أريد الاستفسار عن هذا العقار:\n${property.title}\n${property.type} في ${property.location.district}\nالسعر: ${formatPrice(property.price)}\nالرابط: ${window.location.href}`
    );
    window.open(`https://wa.me/${property.contact_whatsapp}?text=${message}`, "_blank");
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} مليون جنيه`;
    }
    return `${price.toLocaleString("ar-EG")} جنيه`;
  };

  // Dynamic SEO
  useEffect(() => {
    if (property) {
      document.title = `${property.title} | ${property.type} للبيع في ${property.location.district} - التيسير للعقارات`;
    }
  }, [property]);

  const themeColor = isNM ? "emerald" : "orange";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">العقار غير موجود</h1>
          <p className="text-gray-600 mb-4">عذراً، لم نتمكن من العثور على هذا العقار</p>
          <Button asChild className={`bg-${themeColor}-500`}>
            <Link href={`/${citySlug}`}>تصفح عقارات {city?.nameAr}</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb 
        items={getPropertyBreadcrumb(
          property.title, 
          property.location.district,
          property.location.city || city?.nameAr,
          districtSlug
        )} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {property.images.length > 0 ? (
                  <Image
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="h-24 w-24 text-gray-300" />
                  </div>
                )}
                
                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => setCurrentImageIndex(i => (i + 1) % property.images.length)}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => setCurrentImageIndex(i => (i - 1 + property.images.length) % property.images.length)}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {property.images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                          onClick={() => setCurrentImageIndex(idx)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {property.isVerified && (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 ml-1" />
                      موثق
                    </Badge>
                  )}
                  <Badge className={property.status === "جاهز" ? "bg-blue-500" : "bg-amber-500"}>
                    {property.status}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location.district} - {property.location.city || city?.nameAr}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-${themeColor}-600 border-${themeColor}-600`}>
                    {property.type}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">المساحة</p>
                      <p className="font-bold">{property.details.area_sqm} م²</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">غرف النوم</p>
                      <p className="font-bold">{property.details.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">الحمامات</p>
                      <p className="font-bold">{property.details.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">الدور</p>
                      <p className="font-bold">{property.details.level}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 mb-2">الوصف</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 mb-3">المميزات</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className={`border-t-4 border-${themeColor}-500`}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">السعر</p>
                  <p className={`text-3xl font-bold text-${themeColor}-600`}>
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {Math.round(property.price / property.details.area_sqm).toLocaleString()} جنيه/م²
                  </p>
                </div>

                {/* Payment Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>طريقة الدفع: {property.payment.type}</span>
                  </div>
                  {property.payment.downPayment && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>مقدم: {property.payment.downPayment.toLocaleString()} جنيه</span>
                    </div>
                  )}
                  {property.payment.monthlyInstallment && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>قسط شهري: {property.payment.monthlyInstallment.toLocaleString()} جنيه</span>
                    </div>
                  )}
                </div>

                {/* Contact Button */}
                <Button 
                  className={`w-full bg-${themeColor}-500 hover:bg-${themeColor}-600`}
                  size="lg"
                  onClick={handleWhatsApp}
                >
                  <Phone className="h-5 w-5 ml-2" />
                  تواصل عبر واتساب
                </Button>
              </CardContent>
            </Card>

            {/* Back Link */}
            <Link 
              href={`/${citySlug}/${districtSlug}`}
              className={`flex items-center gap-2 text-${themeColor}-600 hover:text-${themeColor}-700`}
            >
              <ChevronRight className="h-4 w-4" />
              العودة إلى عقارات {property.location.district}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
