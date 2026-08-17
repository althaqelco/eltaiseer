"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { CITIES } from "@/lib/egyptPlaces";
import { getPropertyByIdAsync, updatePropertyAsync } from "@/lib/propertyStore";
import { Property } from "@/lib/mockData";
import { enhanceTitle, enhanceDescription } from "@/lib/seoOptimizer";
import { PropertyForm } from "@/components/property-form/PropertyForm";
import { usePropertyForm } from "@/components/property-form/usePropertyForm";

export default function EditPropertyClient() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const form = usePropertyForm();
  const { formData, selectedAmenities, imageUrls, buildSeoInput, loadFromProperty } = form;

  useEffect(() => {
    const loadProperty = async () => {
      // Extract ID from URL pathname instead of params (for static export compatibility)
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const idIndex = pathParts.indexOf("edit") + 1;
      const id = pathParts[idIndex] || (params.id as string);

      // Skip placeholder ID
      if (id === "placeholder") {
        setIsLoading(false);
        return;
      }

      const foundProperty = await getPropertyByIdAsync(id);

      if (foundProperty) {
        setProperty(foundProperty);
        loadFromProperty(foundProperty);
      }
      setIsLoading(false);
    };

    loadProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setIsSubmitting(true);

    try {
      // SEO optimization for title and description
      const seoInput = buildSeoInput();
      const optimizedTitle = enhanceTitle(formData.title, seoInput);
      const optimizedDescription = enhanceDescription(formData.description || "", seoInput);

      const result = await updatePropertyAsync(property.id, {
        title: optimizedTitle,
        description: optimizedDescription,
        price: Number(formData.price),
        type: formData.type,
        location: {
          city: CITIES[formData.city].nameAr as "دمياط الجديدة" | "المنصورة الجديدة",
          cityId: formData.city,
          district: formData.district,
          address: formData.address,
        },
        details: {
          area_sqm: Number(formData.area_sqm),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          level: formData.level,
          finishing: formData.finishing,
        },
        payment: {
          type: formData.paymentType,
          downPayment: formData.downPayment ? Number(formData.downPayment) : undefined,
          monthlyInstallment: formData.monthlyInstallment ? Number(formData.monthlyInstallment) : undefined,
          installmentYears: formData.installmentYears ? Number(formData.installmentYears) : undefined,
        },
        status: formData.status as "جاهز" | "تحت الإنشاء" | "تم البيع",
        amenities: selectedAmenities,
        images: imageUrls.length > 0 ? imageUrls : property.images,
        contact_whatsapp: formData.contact_whatsapp,
        isVerified: formData.isVerified,
      });

      if (result.success) {
        alert("تم تحديث العقار بنجاح!");
        router.push("/dashboard");
      } else {
        alert(result.error || "حدث خطأ أثناء تحديث العقار");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("حدث خطأ أثناء تحديث العقار");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            العقار غير موجود
          </h1>
          <p className="text-gray-600 mb-8">
            عذراً، لم نتمكن من العثور على العقار المطلوب
          </p>
          <Button onClick={() => router.push("/dashboard")} className="bg-orange-500">
            <ArrowRight className="h-4 w-4 ms-2" />
            العودة للوحة التحكم
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">تعديل العقار</h1>
            <p className="text-gray-600 mt-1">
              {property.id} - {property.title}
            </p>
          </div>
        </div>

        <PropertyForm
          mode="edit"
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          extraSidebar={
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">معلومات العقار</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">رقم العقار</span>
                    <span className="font-mono">{property.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ الإضافة</span>
                    <span>{property.createdAt.toLocaleDateString("ar-EG")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          }
        />
      </main>

      <Footer />
    </div>
  );
}
