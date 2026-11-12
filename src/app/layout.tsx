import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { MetaPixel } from "@/components/MetaPixel";
import { Suspense } from "react";
import { ORG_EMAIL, ORG_SOCIAL } from "@/lib/site";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f97316",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://eltaiseer.com"),
  title: {
    default: "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة",
    template: "%s | التيسير للعقارات",
  },
  description: "شقق ودوبلكس ومحلات وعيادات ومقرات إدارية للبيع في دمياط الجديدة والمنصورة الجديدة، بأسعار ومواصفات كل وحدة وطريقة الدفع (كاش أو تقسيط) مع التيسير للعقارات.",
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
    siteName: "التيسير للعقارات",
    title: "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "أفضل عقارات دمياط الجديدة والمنصورة الجديدة للبيع - شقق، فيلات، دوبلكس، محلات تجارية، أراضي. أسعار تنافسية وتقسيط مريح.",
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
    description: "شقق، فيلات، دوبلكس، أراضي للبيع في دمياط الجديدة والمنصورة الجديدة. أسعار تنافسية وتقسيط مريح.",
    images: ["/og-image.jpg"],
    creator: "@eltaiseer",
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
  // إثبات ملكية Bing Webmaster Tools (وسم msvalidate.01) — لا يُحذف حتى بعد نجاح التحقق.
  // Google مُثبت بالملف public/googlefd6145e8df2ffd46.html، وBing أيضاً بالملف public/BingSiteAuth.xml
  verification: {
    other: { "msvalidate.01": "7899AB68C2F333DA156C7F106AB93956" },
  },
  category: "real estate",
  classification: "Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // كيان واحد موحّد: RealEstateAgent هو نوع فرعي من LocalBusiness — لا داعي لكيانين منفصلين
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://eltaiseer.com/#organization",
    name: "التيسير للعقارات",
    alternateName: "El Taiseer Real Estate",
    description: "شركة التيسير للعقارات - أفضل عقارات دمياط الجديدة والمنصورة الجديدة للبيع. شقق، فيلات، دوبلكس، محلات تجارية، أراضي بأسعار تنافسية.",
    url: "https://eltaiseer.com/",
    logo: "https://eltaiseer.com/logo.png",
    image: "https://eltaiseer.com/logo.png",
    telephone: "+201500775974",
    email: ORG_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "دمياط الجديدة",
      addressRegion: "دمياط",
      postalCode: "34511",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.4175,
      longitude: 31.8144,
    },
    hasMap: "https://maps.google.com/?q=31.4175,31.8144",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "21:00",
    },
    areaServed: [
      { "@type": "City", name: "دمياط الجديدة" },
      { "@type": "City", name: "المنصورة الجديدة" }
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+201500775974",
      email: ORG_EMAIL,
      contactType: "sales",
      areaServed: "EG",
      availableLanguage: ["Arabic"],
    },
    // الحسابات الرسمية — بها يربط محرك البحث ومحركات الإجابة الموقع بكيان واحد معروف
    sameAs: [...ORG_SOCIAL, "https://wa.me/201500775974"],
    priceRange: "$$",
    paymentAccepted: "Cash, Bank Transfer",
    currenciesAccepted: "EGP",
    foundingDate: "2024",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 5, maxValue: 10 },
    knowsAbout: ["عقارات دمياط الجديدة", "عقارات المنصورة الجديدة", "بيع شقق", "بيع فيلات", "بيع أراضي"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://eltaiseer.com/#website",
    url: "https://eltaiseer.com/",
    name: "التيسير للعقارات",
    description: "أفضل عقارات دمياط الجديدة والمنصورة الجديدة للبيع",
    publisher: { "@id": "https://eltaiseer.com/#organization" },
    inLanguage: "ar-EG",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://eltaiseer.com/properties?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="مدونة التيسير للعقارات" href="/feed.xml" />
        <meta name="geo.region" content="EG-DK" />
        <meta name="geo.placename" content="دمياط الجديدة" />
        <meta name="geo.position" content="31.4175;31.8144" />
        <meta name="ICBM" content="31.4175, 31.8144" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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
