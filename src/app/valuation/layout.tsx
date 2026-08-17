import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تقييم العقارات مجاناً | اعرف سعر عقارك في دمياط الجديدة والمنصورة الجديدة",
  description: "احصل على تقييم مجاني لعقارك في دمياط الجديدة أو المنصورة الجديدة. خبراء التيسير للعقارات يقدمون تقييماً دقيقاً بناءً على أسعار السوق الحالية 2026. شقق، فيلات، أراضي، محلات.",
  keywords: [
    "تقييم عقارات دمياط الجديدة",
    "سعر المتر في دمياط الجديدة",
    "تقييم عقاري مجاني",
    "أسعار العقارات دمياط الجديدة 2026",
    "تقييم شقة دمياط الجديدة",
    "سعر المتر المنصورة الجديدة",
    "تقييم عقارات المنصورة الجديدة",
    "كم سعر شقتي",
  ],
  openGraph: {
    title: "تقييم العقارات مجاناً | التيسير للعقارات",
    description: "احصل على تقييم مجاني لعقارك في دمياط الجديدة أو المنصورة الجديدة من خبراء التيسير للعقارات",
    url: "https://eltaiseer.com/valuation/",
    type: "website",
    locale: "ar_EG",
    siteName: "التيسير للعقارات",
  },
  twitter: {
    card: "summary_large_image",
    title: "تقييم العقارات مجاناً | التيسير للعقارات",
    description: "تقييم عقاري مجاني ودقيق في دمياط الجديدة والمنصورة الجديدة",
  },
  alternates: {
    canonical: "https://eltaiseer.com/valuation/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ValuationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "تقييم عقاري مجاني",
    description: "خدمة تقييم العقارات المجانية من التيسير للعقارات. نقدم تقييماً دقيقاً لعقارك بناءً على أسعار السوق الحالية في دمياط الجديدة والمنصورة الجديدة.",
    provider: {
      "@type": "RealEstateAgent",
      "@id": "https://eltaiseer.com/#organization",
      name: "التيسير للعقارات",
    },
    areaServed: [
      { "@type": "City", name: "دمياط الجديدة" },
      { "@type": "City", name: "المنصورة الجديدة" },
    ],
    serviceType: "تقييم عقاري",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EGP",
      description: "تقييم عقاري مجاني بالكامل",
    },
    url: "https://eltaiseer.com/valuation/",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
