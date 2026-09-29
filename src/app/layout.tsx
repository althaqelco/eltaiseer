import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { MetaPixel } from "@/components/MetaPixel";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ID, ORG, SITE, cityId, node, ref, siteGraph } from "@/lib/seo/schema";
import { D11_OFFICE, IN_LANGUAGE, SITE_NAME } from "@/lib/seo/owner-flags";

// display "optional": لا تبديل للخط بعد أول رسم، فلا إزاحة تخطيط (CLS كان 0.224 في صفحات الأحياء
// و0.141 في الرئيسية عند وصول Cairo). إن لم يصل الخط خلال ~100ms في الزيارة الأولى تبقى الصفحة
// بخط النظام، ويظهر Cairo من الكاش عند التحميل الكامل التالي.
// "latin" مع "arabic": المسافة والأرقام 0–9 في نطاق latin وتظهر في كل صفحة، فتُحمَّل مسبقًا أيضًا.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "600", "700"],
  display: "optional",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f97316",
};

// [OWNER D11] لا عنوان شارع ولا دبوس خريطة ولا رمز بريدي حتى يعطي المالك قيمها: الإحداثيات القديمة
// (31.4175, 31.8144 / 34511) تشير إلى دمياط القديمة. geo.region = EG-DT (محافظة دمياط).
const DEFAULT_DESCRIPTION =
  "عقارات للبيع في دمياط الجديدة والمنصورة الجديدة: شقق وفيلات وأراضٍ ومحلات بأسعارها الفعلية، وجدول سعر المتر لكل حي، وإعلانات موثّقة لإعادة بيع أراضي بيت الوطن.";

export const metadata: Metadata = {
  metadataBase: new URL("https://eltaiseer.com"),
  title: {
    default: "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة",
    template: "%s | التيسير للعقارات",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "عقارات دمياط الجديدة",
    "شقق للبيع في دمياط الجديدة",
    "فيلات دمياط الجديدة",
    "أراضي للبيع دمياط الجديدة",
    "شقق تمليك دمياط الجديدة",
    "دوبلكس دمياط الجديدة",
    "محلات تجارية دمياط الجديدة",
    "أسعار الشقق في دمياط الجديدة",
    "شقق بالتقسيط دمياط الجديدة",
    "عقارات للبيع دمياط",
    "شقة للبيع الحي الأول دمياط الجديدة",
    "شقة للبيع الحي الثاني دمياط الجديدة",
    "شقة للبيع الحي الثالث دمياط الجديدة",
    "شقة للبيع الحي الرابع دمياط الجديدة",
    "شقة للبيع الحي الخامس دمياط الجديدة",
    "فيلا مستقلة دمياط الجديدة",
    "روف للبيع دمياط الجديدة",
    "بنتهاوس دمياط الجديدة",
    "شاليه دمياط الجديدة",
    "عقارات المنصورة الجديدة",
    "شقق للبيع في المنصورة الجديدة",
    "فيلات المنصورة الجديدة",
    "أراضي للبيع المنصورة الجديدة",
    "التيسير للعقارات",
    "عقارات مصر",
    "real estate damietta",
    "real estate new mansoura",
    "apartments for sale new damietta",
    "apartments for sale new mansoura",
  ],
  authors: [{ name: "التيسير للعقارات", url: "https://eltaiseer.com" }],
  creator: "التيسير للعقارات",
  publisher: "التيسير للعقارات",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://eltaiseer.com/",
    siteName: SITE_NAME,
    title: "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: DEFAULT_DESCRIPTION,
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
    title: "التيسير للعقارات | عقارات دمياط الجديدة والمنصورة الجديدة للبيع",
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=yes",
  },
  category: "real estate",
  classification: "Business",
};

// رسم الموقع (spec-final A1.2): كيان واحد لكل @id، وقيم الكيانات المشتركة من schema-registry.json.
// ليس هنا #program-beit-al-watan ولا #phase-11 (صفحاتهما على المنصة لم تُطلق)، ولا SearchAction
// (أوقفته جوجل في نوفمبر 2024 والبحث في /properties/ يتم في المتصفح).
const CITY_ND = cityId("new-damietta");
const CITY_NM = cityId("new-mansoura");
const office = D11_OFFICE;
const SITE_GRAPH = siteGraph(
  node(ID.organization, {
    "@type": "RealEstateAgent",
    image: ref(ID.logo),
    description:
      "وسيط عقاري في دمياط الجديدة والمنصورة الجديدة يعرض عقارات للبيع في المدينتين، ويقدم وساطة موثّقة لإعادة بيع أراضي بيت الوطن بالتنازل الرسمي، ويدير أداة «التيسير — الحجز الذكي» المجانية للحاجزين.",
    telephone: "+201500775974",
    email: "info@eltaiseer.com",
    address: {
      "@type": "PostalAddress",
      ...(office ? { streetAddress: office.streetAddress, ...(office.postalCode ? { postalCode: office.postalCode } : {}) } : {}),
      addressLocality: "دمياط الجديدة",
      addressRegion: "محافظة دمياط",
      addressCountry: "EG",
    },
    ...(office?.geo ? { geo: { "@type": "GeoCoordinates", ...office.geo } } : {}),
    ...(office?.hasMap ? { hasMap: office.hasMap } : {}),
    ...(office?.foundingDate ? { foundingDate: office.foundingDate } : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "21:00",
    },
    areaServed: [ref(CITY_ND), ref(CITY_NM)],
    knowsAbout: [
      "بيت الوطن (برنامج أراضي المصريين بالخارج)",
      "المرحلة 11 من بيت الوطن",
      "عقارات دمياط الجديدة",
      "عقارات المنصورة الجديدة",
      "إعادة بيع أراضي بيت الوطن بالتنازل",
      "التنازل عن أراضي بيت الوطن",
    ],
    makesOffer: [
      { "@type": "Offer", itemOffered: ref(ID.serviceResale) },
      { "@type": "Offer", itemOffered: ref(ID.serviceValuation) },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "وساطة بيع العقارات في دمياط الجديدة والمنصورة الجديدة",
          areaServed: [ref(CITY_ND), ref(CITY_NM)],
        },
      },
    ],
    brand: ref(ID.brand),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+201500775974",
      contactType: "sales",
      availableLanguage: ["Arabic"],
      url: "https://wa.me/201500775974",
    },
    // مصادر الأرقام وسياسة التصحيح: قسما #sources و#corrections في /about/ (spec-final A1.2 / A2.7)
    publishingPrinciples: `${SITE}/about/#sources`,
    correctionsPolicy: `${SITE}/about/#corrections`,
  }),
  node(ID.logo, { caption: "شعار التيسير" }),
  node(ID.website, {
    description:
      "عقارات للبيع في دمياط الجديدة والمنصورة الجديدة، وإعلانات موثّقة لإعادة بيع أراضي بيت الوطن، ودليل مستقل لبيت الوطن.",
    publisher: ORG,
    inLanguage: IN_LANGUAGE,
  }),
  node(ID.brand, { alternateName: ["الحجز الذكي", "التيسير بيت الوطن"] }),
  node(ID.serviceResale),
  node(ID.serviceValuation),
  // geo = Wikidata P625 (أول قيمة)، جُلبت 29/9/2026 — مصدر إحداثيات واحد لكل مدينة
  node(CITY_ND, {
    alternateName: "New Damietta",
    containedInPlace: ref(`${SITE}/#gov-damietta`),
    geo: { "@type": "GeoCoordinates", latitude: 31.4368, longitude: 31.667 },
  }),
  node(CITY_NM, {
    alternateName: "New Mansoura",
    containedInPlace: ref(`${SITE}/#gov-dakahlia`),
    geo: { "@type": "GeoCoordinates", latitude: 31.47969, longitude: 31.43267 },
  }),
  node(`${SITE}/#gov-damietta`),
  node(`${SITE}/#gov-dakahlia`)
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="alternate" type="application/rss+xml" title="مدونة التيسير للعقارات" href="/feed.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <meta name="geo.region" content="EG-DT" />
        <meta name="geo.placename" content="دمياط الجديدة" />
        <JsonLd graph={SITE_GRAPH} />
      </head>
      <body
        className={`${cairo.variable} font-sans antialiased bg-gray-50`}
      >
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
