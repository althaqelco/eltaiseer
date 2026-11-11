import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { buildFaqSchema } from "@/lib/homeFaq";
import { buildHomeFaq } from "@/lib/liveFacts";
import {
  getPropertiesServer,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { buildMarketSnapshot, buildHomeSummary } from "@/lib/marketSnapshot";
import { ORG_ID, WEBSITE_ID } from "@/lib/site";

// ISR كل 5 دقائق — عقارات الرئيسية تظهر في HTML الخادم
export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة 2026",
  },
  description: "عقارات للبيع في دمياط الجديدة والمنصورة الجديدة 2026 — شقق ودوبلكس ومحلات وعيادات ومقرات إدارية بأسعار وصور ومواصفات كل وحدة، كاش أو تقسيط، مع متوسط سعر المتر لكل حي.",
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
  const allProperties = await getPropertiesServer();
  // الأسئلة الشائعة تُبنى من المعروض الفعلي — لا أرقام ثابتة تناقض قائمة العقارات في نفس الصفحة
  const homeFaq = buildHomeFaq(allProperties);
  const homepageFaqSchema = buildFaqSchema(homeFaq);
  const itemListSchema = buildItemListSchema(
    allProperties.filter((p) => p.status !== "تم البيع"),
    "أحدث عقارات دمياط الجديدة والمنصورة الجديدة"
  );

  const snapshot = buildMarketSnapshot(allProperties);
  const marketSummary = buildHomeSummary(snapshot);

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://eltaiseer.com/#webpage",
    "name": "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة",
    "url": "https://eltaiseer.com/",
    "inLanguage": "ar-EG",
    "isPartOf": { "@id": WEBSITE_ID },
    "about": { "@id": ORG_ID },
    "dateModified": snapshot.asOf,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".hero-description", ".market-summary"]
    }
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
      <HomeClient
        initialProperties={serializeProperties(allProperties)}
        marketSummary={marketSummary}
        faq={homeFaq}
      />
    </>
  );
}
