import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عيادات للبيع في دمياط الجديدة والمنصورة الجديدة | عيادات طبية جاهزة",
  description: "عيادات طبية للبيع في دمياط الجديدة والمنصورة الجديدة. عيادات جاهزة بتراخيص في مجمعات طبية. مساحات مناسبة لجميع التخصصات الطبية.",
  keywords: [
    "عيادات للبيع في دمياط الجديدة والمنصورة الجديدة",
    "عيادة طبية دمياط",
    "مجمع طبي دمياط الجديدة",
    "عيادة أسنان للبيع",
    "عقارات طبية دمياط",
    "عيادات للبيع المنصورة الجديدة",
    "مجمع طبي المنصورة الجديدة",
  ],
  openGraph: {
    title: "عيادات للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "عيادات طبية جاهزة بتراخيص ومواقع مميزة",
    url: "https://eltaiseer.com/properties/clinics/",
  },
  alternates: { canonical: "https://eltaiseer.com/properties/clinics/" },
};

export default function ClinicsLayout({ children }: { children: React.ReactNode }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "عيادات للبيع في دمياط الجديدة والمنصورة الجديدة والمنصورة الجديدة",
    description: "عيادات طبية جاهزة بتراخيص في مجمعات طبية",
    url: "https://eltaiseer.com/properties/clinics/",
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
