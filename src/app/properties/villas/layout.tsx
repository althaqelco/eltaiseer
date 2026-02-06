import { Metadata } from "next";

export const metadata: Metadata = {
  title: "فيلات للبيع في دمياط الجديدة | فيلات مستقلة وتاون هاوس",
  description: "أفخم فيلات للبيع في دمياط الجديدة والمنصورة الجديدة 2026. فيلات مستقلة بحدائق خاصة، تاون هاوس، توين هاوس. مساحات من 200 إلى 1000 متر. تشطيبات فاخرة وحمامات سباحة.",
  keywords: [
    "فيلات للبيع في دمياط الجديدة",
    "فيلا مستقلة دمياط",
    "تاون هاوس دمياط الجديدة",
    "توين هاوس للبيع",
    "فيلات فاخرة دمياط",
    "فيلا بحديقة دمياط الجديدة",
    "فيلا بمسبح خاص",
    "فيلات المنصورة الجديدة",
    "فيلات الجولف المنصورة الجديدة",
    "فيلات البحيرات المنصورة الجديدة",
    "حي الفيلات المنصورة الجديدة",
  ],
  openGraph: {
    title: "فيلات للبيع في دمياط الجديدة | التيسير للعقارات",
    description: "أفخم فيلات للبيع في دمياط الجديدة - فيلات مستقلة وتاون هاوس بتشطيبات فاخرة",
    url: "https://eltaiseer.com/properties/villas",
  },
  alternates: {
    canonical: "https://eltaiseer.com/properties/villas",
  },
};

export default function VillasLayout({ children }: { children: React.ReactNode }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "فيلات للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "أفخم فيلات للبيع - فيلات مستقلة، تاون هاوس، توين هاوس",
    url: "https://eltaiseer.com/properties/villas",
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
