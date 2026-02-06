import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شقق للبيع في دمياط الجديدة | شقق تمليك ودوبلكس وبنتهاوس",
  description: "أفضل شقق للبيع في دمياط الجديدة والمنصورة الجديدة 2026. شقق تمليك، دوبلكس، بنتهاوس، روف بأسعار تبدأ من 500,000 جنيه. تشطيب سوبر لوكس ونصف تشطيب. تقسيط حتى 10 سنوات. تصفح أكثر من 50 شقة.",
  keywords: [
    "شقق للبيع في دمياط الجديدة",
    "شقق تمليك دمياط الجديدة",
    "دوبلكس للبيع دمياط",
    "بنتهاوس دمياط الجديدة",
    "روف للبيع دمياط",
    "شقق بالتقسيط دمياط الجديدة",
    "أسعار الشقق في دمياط الجديدة",
    "شقة للبيع الحي الأول",
    "شقة للبيع الحي الثاني",
    "شقة للبيع الحي الثالث",
    "شقق نصف تشطيب دمياط",
    "شقق سوبر لوكس دمياط الجديدة",
    "شقق للبيع في المنصورة الجديدة",
    "شقق R1 المنصورة الجديدة",
    "شقق سكن لكل المصريين المنصورة الجديدة",
    "أسعار الشقق في المنصورة الجديدة 2026",
  ],
  openGraph: {
    title: "شقق للبيع في دمياط الجديدة | التيسير للعقارات",
    description: "أفضل شقق للبيع في دمياط الجديدة - شقق تمليك، دوبلكس، بنتهاوس بأسعار تنافسية",
    url: "https://eltaiseer.com/properties/apartments",
    type: "website",
  },
  alternates: {
    canonical: "https://eltaiseer.com/properties/apartments",
  },
};

export default function ApartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "شقق للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "أفضل شقق للبيع في دمياط الجديدة والمنصورة الجديدة - شقق تمليك، دوبلكس، بنتهاوس، روف",
    url: "https://eltaiseer.com/properties/apartments",
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
