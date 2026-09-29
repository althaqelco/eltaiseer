import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ID, cityId, graph, node, ref, webPage } from "@/lib/seo/schema";
import { editorialIso } from "@/lib/seo/editorial";
import { ROBOTS_INDEX } from "@/lib/seo/robots";
import { SITE_NAME } from "@/lib/seo/owner-flags";

export const metadata: Metadata = {
  title: "تقييم العقارات مجاناً | اعرف سعر عقارك في دمياط الجديدة والمنصورة الجديدة",
  description: "تقييم مجاني لعقارك في دمياط الجديدة أو المنصورة الجديدة: نقارنه بوسيط سعر المتر لنفس النوع في نفس الحي من العروض الحالية، ثم نعدّل حسب الدور والتشطيب والإطلالة. شقق، فيلات، أراضٍ، محلات.",
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
    description: "تقييم مجاني لعقارك في دمياط الجديدة أو المنصورة الجديدة مقارنة بوسيط سعر المتر في الحي",
    url: "https://eltaiseer.com/valuation/",
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "تقييم عقاري مجاني" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "تقييم العقارات مجاناً | التيسير للعقارات",
    description: "تقييم عقاري مجاني في دمياط الجديدة والمنصورة الجديدة",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://eltaiseer.com/valuation/",
  },
  robots: ROBOTS_INDEX,
};

export default function ValuationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // خدمة التقييم كيان واحد (#service-valuation) معرّف في رسم الموقع؛ هنا تفاصيل الصفحة فقط
  const valuationGraph = graph(
    node(ID.serviceValuation, {
      "@type": "Service",
      serviceType: "تقييم عقاري",
      description:
        "تقييم مجاني لعقارك: نقارنه بوسيط سعر المتر لنفس النوع في نفس الحي من العروض الحالية على التيسير، ثم نعدّل حسب الدور والتشطيب والإطلالة.",
      areaServed: [ref(cityId("new-damietta")), ref(cityId("new-mansoura"))],
      offers: { "@type": "Offer", price: 0, priceCurrency: "EGP", description: "التقييم مجاني" },
    }),
    webPage({
      path: "/valuation/",
      name: "تقييم العقارات مجاناً",
      about: ref(ID.serviceValuation),
      breadcrumb: false,
      dateModified: editorialIso("/valuation/", "modified"),
    })
  );

  return (
    <>
      <JsonLd graph={valuationGraph} />
      {children}
    </>
  );
}
