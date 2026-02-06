import { Metadata } from "next";

export const metadata: Metadata = {
  title: "محلات تجارية للبيع في دمياط الجديدة | مقرات إدارية ومكاتب",
  description: "أفضل المحلات التجارية والمقرات الإدارية للبيع في دمياط الجديدة. مواقع استراتيجية على الشوارع الرئيسية. مساحات متنوعة تناسب جميع الأنشطة.",
  keywords: [
    "محلات للبيع في دمياط الجديدة",
    "محل تجاري دمياط",
    "مقر إداري دمياط الجديدة",
    "مكتب للبيع دمياط",
    "عقارات تجارية دمياط الجديدة",
    "محلات للبيع المنصورة الجديدة",
    "داون تاون المنصورة الجديدة",
    "CBD المنصورة الجديدة",
    "محلات تجارية المنصورة الجديدة",
  ],
  openGraph: {
    title: "محلات تجارية للبيع في دمياط الجديدة",
    description: "محلات ومقرات إدارية بمواقع استراتيجية",
    url: "https://eltaiseer.com/properties/shops",
  },
  alternates: { canonical: "https://eltaiseer.com/properties/shops" },
};

export default function ShopsLayout({ children }: { children: React.ReactNode }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "محلات تجارية للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "محلات ومقرات إدارية بمواقع استراتيجية",
    url: "https://eltaiseer.com/properties/shops",
    itemListOrder: "https://schema.org/ItemListUnordered",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {children}
    </>
  );
}
