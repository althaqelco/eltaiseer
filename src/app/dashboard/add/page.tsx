"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CITIES } from "@/lib/egyptPlaces";
import { addPropertyAsync } from "@/lib/propertyStore";
import { enhanceTitle, enhanceDescription } from "@/lib/seoOptimizer";
import { getPropertyUrl } from "@/lib/districtSlugs";
import { PropertyForm } from "@/components/property-form/PropertyForm";
import { usePropertyForm } from "@/components/property-form/usePropertyForm";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = usePropertyForm([DEFAULT_IMAGE]);
  const { formData, selectedAmenities, imageUrls, buildSeoInput } = form;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate district is selected
    if (!formData.district || formData.district.trim() === "") {
      alert("يرجى اختيار المنطقة");
      return;
    }

    setIsSubmitting(true);

    try {
      // SEO optimization for title and description
      const seoInput = buildSeoInput();
      const optimizedTitle = enhanceTitle(formData.title, seoInput);
      const optimizedDescription = enhanceDescription(formData.description || "", seoInput);

      const result = await addPropertyAsync({
        title: optimizedTitle,
        description: optimizedDescription,
        price: Number(formData.price),
        currency: "EGP",
        category: "بيع",
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
        status: formData.status,
        amenities: selectedAmenities,
        images: imageUrls.length > 0 ? imageUrls : [DEFAULT_IMAGE],
        contact_whatsapp: formData.contact_whatsapp,
        isVerified: formData.isVerified,
      });

      if (result.success && result.property) {
        alert("تم إضافة العقار بنجاح!");
        router.push(getPropertyUrl(result.property));
      } else {
        alert(result.error || "حدث خطأ أثناء إضافة العقار");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert("حدث خطأ أثناء إضافة العقار");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">إضافة عقار جديد</h1>
            <p className="text-gray-600 mt-1">أضف تفاصيل العقار الجديد</p>
          </div>
        </div>

        <PropertyForm
          mode="add"
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </main>

      <Footer />
    </div>
  );
}
