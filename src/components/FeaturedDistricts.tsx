"use client";

import { MapPin, ArrowLeft, Home, Building2, TreePine, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DistrictData {
  id: string;
  name: string;
  slug: string;
  description: string;
  propertyCount: number;
  icon: React.ElementType;
  gradient: string;
  features: string[];
}

const featuredDistricts: DistrictData[] = [
  {
    id: "1",
    name: "الحي الأول",
    slug: "first-district",
    description: "من أقدم وأرقى أحياء دمياط الجديدة، يتميز بالهدوء والخدمات المتكاملة",
    propertyCount: 12,
    icon: Home,
    gradient: "from-blue-500 to-blue-600",
    features: ["خدمات متكاملة", "موقع مميز", "أسعار مناسبة"],
  },
  {
    id: "2",
    name: "الحي السادس (المتميز)",
    slug: "sixth-district",
    description: "الحي الأكثر تميزاً، يضم الفيلات والشقق الفاخرة بتصميمات عصرية",
    propertyCount: 8,
    icon: Building2,
    gradient: "from-orange-500 to-orange-600",
    features: ["فيلات فاخرة", "تصميم عصري", "مساحات خضراء"],
  },
  {
    id: "3",
    name: "مشروع جنة",
    slug: "janna-project",
    description: "مشروع سكني متكامل بأعلى معايير الجودة والتشطيب الفاخر",
    propertyCount: 10,
    icon: TreePine,
    gradient: "from-green-500 to-green-600",
    features: ["تشطيب سوبر لوكس", "أمن وحراسة", "حدائق"],
  },
  {
    id: "4",
    name: "منطقة الشاليهات",
    slug: "chalets-area",
    description: "منطقة ساحلية مميزة للاستمتاع بإطلالة البحر والاسترخاء",
    propertyCount: 5,
    icon: Waves,
    gradient: "from-cyan-500 to-cyan-600",
    features: ["إطلالة بحرية", "شاليهات", "منتجعات"],
  },
];

interface FeaturedDistrictsProps {
  propertiesByDistrict?: Record<string, number>;
}

export function FeaturedDistricts({ propertiesByDistrict }: FeaturedDistrictsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            <MapPin className="inline-block h-8 w-8 text-orange-500 ml-2" />
            الأحياء <span className="text-orange-500">المميزة</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            اكتشف أفضل الأحياء والمناطق في دمياط الجديدة واختر ما يناسب احتياجاتك
          </p>
        </div>

        {/* Districts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDistricts.map((district) => {
            const count = propertiesByDistrict?.[district.name] || district.propertyCount;
            return (
              <Link
                key={district.id}
                href={`/properties/district/${district.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-orange-200">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${district.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <district.icon className="h-10 w-10 opacity-90" />
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        {count} عقار
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{district.name}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {district.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {district.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-orange-500 font-medium text-sm group-hover:gap-2 transition-all">
                      <span>عرض العقارات</span>
                      <ArrowLeft className="h-4 w-4 mr-1 group-hover:mr-2 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50">
            <Link href="/properties">
              عرض جميع المناطق
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
