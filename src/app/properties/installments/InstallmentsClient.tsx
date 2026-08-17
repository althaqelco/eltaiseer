"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getAllPropertiesAsync } from "@/lib/propertyStore";
import { Property } from "@/lib/mockData";
import type { FaqItem } from "@/lib/homeFaq";

const ITEMS_PER_PAGE = 12;

interface InstallmentsClientProps {
  initialProperties: Property[];
  faq: FaqItem[];
}

export default function InstallmentsClient({ initialProperties, faq }: InstallmentsClientProps) {
  const [properties, setProperties] = useState<Property[]>(
    () => initialProperties.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))
  );
  const [selectedCity, setSelectedCity] = useState("all");
  const [maxDownPayment, setMaxDownPayment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // البيانات الأولية من الخادم؛ تحديث حي من Firestore بعد التحميل
    getAllPropertiesAsync().then((all) => {
      const filtered = all.filter(
        (p) => p.payment?.type !== "كاش" && p.status !== "تم البيع"
      );
      if (filtered.length > 0) setProperties(filtered);
    }).catch(console.error);
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedCity !== "all") {
        if ((p.location.cityId || "new-damietta") !== selectedCity) return false;
      }
      if (maxDownPayment !== "all" && p.payment?.downPayment) {
        if (p.payment.downPayment > Number(maxDownPayment)) return false;
      }
      return true;
    });
  }, [properties, selectedCity, maxDownPayment]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, maxDownPayment]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "العقارات", href: "/properties" },
          { label: "عقارات بالتقسيط" },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة
              </h1>
              <p className="text-gray-300 mt-2">
                {filteredProperties.length} عقاراً متاحاً بالتقسيط — مقدم من 10% وأقساط حتى 10 سنوات
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-3xl">
            كل عقار هنا يقبل التقسيط فعلاً ويعرض مقدمه وقسطه الشهري ومدته بأرقام حقيقية —
            لا وعود عامة. التقسيط في أغلب الوحدات مباشر مع المالك دون إجراءات بنكية.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="المدينة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المدن</SelectItem>
              <SelectItem value="new-damietta">دمياط الجديدة</SelectItem>
              <SelectItem value="new-mansoura">المنصورة الجديدة</SelectItem>
            </SelectContent>
          </Select>

          <Select value={maxDownPayment} onValueChange={setMaxDownPayment}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="أقصى مقدم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">أي مقدم</SelectItem>
              <SelectItem value="100000">حتى 100 ألف جنيه</SelectItem>
              <SelectItem value="200000">حتى 200 ألف جنيه</SelectItem>
              <SelectItem value="500000">حتى 500 ألف جنيه</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Grid */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد عقارات مطابقة للفلاتر المحددة</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mb-12">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <span className="text-sm text-gray-600">
              صفحة {currentPage} من {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* SEO Content + FAQ */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            الشراء بالتقسيط في المدن الجديدة — كيف يعمل؟
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed mb-8">
            <p>
              التقسيط في{" "}
              <Link href="/new-damietta" className="text-orange-600 hover:underline">دمياط الجديدة</Link>{" "}
              و<Link href="/new-mansoura" className="text-emerald-600 hover:underline">المنصورة الجديدة</Link>{" "}
              نوعان: تقسيط مباشر مع المالك أو المطور (الأسرع والأبسط — اتفاق وعقد دون بنوك)،
              وتمويل عقاري بنكي بمدد أطول وفوائد أعلى. مشاريع الإسكان القومي مثل{" "}
              <Link href="/new-damietta/janna-project" className="text-orange-600 hover:underline">جنة</Link> و
              <Link href="/new-mansoura/sakan-kol-misryeen" className="text-emerald-600 hover:underline">سكن لكل المصريين</Link>{" "}
              تقدم أفضل شروط تقسيط مدعومة بمقدمات تبدأ من 10%.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">أسئلة شائعة عن التقسيط</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.question} className="group bg-gray-50 rounded-xl border border-gray-200 p-5">
                <summary className="cursor-pointer list-none font-semibold text-gray-800 flex items-center justify-between">
                  <h3 className="text-base font-semibold">{item.question}</h3>
                  <span className="text-orange-500 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
