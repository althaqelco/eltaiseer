"use client";

import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Schema.org BreadcrumbList للـ SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://eltaiseer.com${item.href}` }),
    })),
  };

  return (
    <>
      {/* Schema.org JSON-LD للـ SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Breadcrumb UI */}
      <nav 
        aria-label="مسار التنقل" 
        className={`bg-white border-b ${className}`}
      >
        <div className="container mx-auto px-4 py-3">
          <ol 
            className="flex items-center flex-wrap gap-1 sm:gap-2 text-sm"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isFirst = index === 0;
              
              return (
                <li 
                  key={index}
                  className="flex items-center"
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {/* Separator */}
                  {!isFirst && (
                    <ChevronLeft className="h-4 w-4 text-gray-400 mx-1 flex-shrink-0" />
                  )}
                  
                  {/* Link or Text */}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors"
                      itemProp="item"
                    >
                      {item.icon || (isFirst && <Home className="h-4 w-4" />)}
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  ) : (
                    <span 
                      className={`flex items-center gap-1 ${
                        isLast 
                          ? "text-orange-600 font-medium" 
                          : "text-gray-600"
                      }`}
                      itemProp="name"
                    >
                      {item.icon}
                      {item.label}
                    </span>
                  )}
                  
                  <meta itemProp="position" content={String(index + 1)} />
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}

// Preset breadcrumbs للصفحات الشائعة
export const breadcrumbPresets = {
  home: [
    { label: "الرئيسية", href: "/" },
  ],
  
  properties: [
    { label: "الرئيسية", href: "/" },
    { label: "جميع العقارات" },
  ],
  
  apartments: [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: "شقق للبيع" },
  ],
  
  villas: [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: "فيلات للبيع" },
  ],
  
  lands: [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: "أراضي للبيع" },
  ],
  
  shops: [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: "محلات تجارية" },
  ],
  
  chalets: [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: "شاليهات" },
  ],
  
  clinics: [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: "عيادات" },
  ],
  
  favorites: [
    { label: "الرئيسية", href: "/" },
    { label: "المفضلة" },
  ],
  
  blog: [
    { label: "الرئيسية", href: "/" },
    { label: "المدونة" },
  ],
  
  valuation: [
    { label: "الرئيسية", href: "/" },
    { label: "تقييم عقارك" },
  ],
  
  dashboard: [
    { label: "الرئيسية", href: "/" },
    { label: "لوحة التحكم" },
  ],
  
  addProperty: [
    { label: "الرئيسية", href: "/" },
    { label: "لوحة التحكم", href: "/dashboard" },
    { label: "إضافة عقار جديد" },
  ],
};

// Helper لإنشاء breadcrumb للمدينة
export function getCityBreadcrumb(cityName: string): BreadcrumbItem[] {
  return [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: `عقارات ${cityName}` },
  ];
}

// Helper لإنشاء breadcrumb للمنطقة
export function getDistrictBreadcrumb(districtName: string, cityName?: string): BreadcrumbItem[] {
  const citySlug = cityName === "المنصورة الجديدة" ? "new-mansoura" : "new-damietta";
  return [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    ...(cityName ? [{ label: cityName, href: `/${citySlug}` }] : []),
    { label: `عقارات ${districtName}` },
  ];
}

// Helper لإنشاء breadcrumb للعقار
export function getPropertyBreadcrumb(
  propertyTitle: string, 
  districtName: string,
  cityName?: string,
  districtSlug?: string
): BreadcrumbItem[] {
  const citySlug = cityName === "المنصورة الجديدة" ? "new-mansoura" : "new-damietta";
  const finalDistrictSlug = districtSlug || districtName.toLowerCase().replace(/\s+/g, "-");
  return [
    { label: "الرئيسية", href: "/" },
    { label: "العقارات", href: "/properties" },
    { label: cityName || "دمياط الجديدة", href: `/${citySlug}` },
    { label: districtName, href: `/${citySlug}/${finalDistrictSlug}` },
    { label: propertyTitle.length > 30 ? propertyTitle.substring(0, 30) + "..." : propertyTitle },
  ];
}

// Helper لإنشاء breadcrumb للمدونة
export function getBlogPostBreadcrumb(postTitle: string): BreadcrumbItem[] {
  return [
    { label: "الرئيسية", href: "/" },
    { label: "المدونة", href: "/blog" },
    { label: postTitle.length > 40 ? postTitle.substring(0, 40) + "..." : postTitle },
  ];
}
