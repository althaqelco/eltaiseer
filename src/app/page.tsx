import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { HOME_FAQ, buildFaqSchema } from "@/lib/homeFaq";
import {
  getPropertiesServer,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";

// ISR كل 5 دقائق — عقارات الرئيسية تظهر في HTML الخادم
export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة 2026",
  },
  description: "أفضل عقارات دمياط الجديدة والمنصورة الجديدة للبيع 2026 — شقق وفيلات وأراضي بأسعار تنافسية وتقسيط حتى 10 سنوات. أكثر من 100 عقار في جميع الأحياء.",
  keywords: [
    "عقارات دمياط الجديدة",
    "شقق للبيع في دمياط الجديدة",
    "فيلات دمياط الجديدة",
    "أراضي للبيع دمياط الجديدة",
    "شقق تمليك دمياط الجديدة",
    "دوبلكس دمياط الجديدة",
    "محلات تجارية دمياط الجديدة",
    "أسعار الشقق في دمياط الجديدة 2026",
    "شقق بالتقسيط دمياط الجديدة",
    "عقارات المنصورة الجديدة",
    "شقق للبيع في المنصورة الجديدة",
    "فيلات المنصورة الجديدة",
    "أسعار الشقق في المنصورة الجديدة 2026",
    "الاستثمار في المنصورة الجديدة",
    "التيسير للعقارات",
    "عقارات مصر",
    "real estate new damietta",
    "apartments for sale new damietta",
    "real estate new mansoura",
    "apartments for sale new mansoura",
  ],
  alternates: {
    canonical: "https://eltaiseer.com/",
  },
  openGraph: {
    title: "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة 2026",
    description: "أفضل عقارات دمياط الجديدة والمنصورة الجديدة للبيع 2026 - شقق، فيلات، دوبلكس، محلات تجارية، أراضي. أسعار تنافسية وتقسيط مريح.",
    url: "https://eltaiseer.com/",
    type: "website",
    locale: "ar_EG",
    siteName: "التيسير للعقارات",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "التيسير للعقارات | عقارات دمياط الجديدة والمنصورة الجديدة 2026",
    description: "شقق، فيلات، دوبلكس، أراضي للبيع في دمياط الجديدة والمنصورة الجديدة. أسعار تنافسية وتقسيط مريح.",
    images: ["/og-image.jpg"],
  },
};

export default async function Home() {
  const homepageFaqSchema = buildFaqSchema(HOME_FAQ);
  const allProperties = await getPropertiesServer();
  const itemListSchema = buildItemListSchema(
    allProperties.filter((p) => p.status !== "تم البيع"),
    "أحدث عقارات دمياط الجديدة والمنصورة الجديدة"
  );

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".hero-description"]
    },
    "url": "https://eltaiseer.com/"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      {allProperties.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <HomeClient initialProperties={serializeProperties(allProperties)} />
    </>
  );
}
