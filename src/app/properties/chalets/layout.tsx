import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شاليهات للبيع في دمياط الجديدة | شاليهات على البحر",
  description: "شاليهات فاخرة للبيع في دمياط الجديدة بإطلالات بحرية مباشرة. شاليهات بحمامات سباحة ومرافق متكاملة. أسعار تنافسية وتقسيط مريح.",
  keywords: [
    "شاليهات للبيع في دمياط الجديدة",
    "شاليه على البحر دمياط",
    "شاليهات دمياط الجديدة",
    "شاليه بحمام سباحة",
    "شاليهات المنصورة الجديدة",
    "شاليه الواجهة البحرية المنصورة الجديدة",
  ],
  openGraph: {
    title: "شاليهات للبيع في دمياط الجديدة",
    description: "شاليهات فاخرة بإطلالات بحرية مباشرة",
    url: "https://eltaiseer.com/properties/chalets",
  },
  alternates: { canonical: "https://eltaiseer.com/properties/chalets" },
};

export default function ChaletsLayout({ children }: { children: React.ReactNode }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "شاليهات للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "شاليهات فاخرة بإطلالات بحرية مباشرة",
    url: "https://eltaiseer.com/properties/chalets",
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
