import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { MetaPixel } from "@/components/MetaPixel";
import { Suspense } from "react";

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
  description: "أفضل عقارات دمياط الجديدة والمنصورة الجديدة للبيع - شقق، فيلات، دوبلكس، محلات تجارية، أراضي. أسعار تنافسية وتقسيط مريح. تصفح أكثر من 100 عقار في جميع أحياء المدن الجديدة. التيسير للعقارات - شريكك الموثوق.",
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
  alternates: {
    canonical: "https://eltaiseer.com",
    languages: {
      "ar-EG": "https://eltaiseer.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://eltaiseer.com",
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
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=yes",
  },
  category: "real estate",
  classification: "Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://eltaiseer.com/#organization",
    name: "التيسير للعقارات",
    alternateName: "El Taiseer Real Estate",
    description: "شركة التيسير للعقارات - أفضل عقارات دمياط الجديدة والمنصورة الجديدة للبيع. شقق، فيلات، دوبلكس، محلات تجارية، أراضي بأسعار تنافسية.",
    url: "https://eltaiseer.com",
    logo: "https://eltaiseer.com/logo.png",
    telephone: "+201558245974",
    address: {
      "@type": "PostalAddress",
      addressLocality: "دمياط الجديدة",
      addressRegion: "دمياط",
      addressCountry: "EG",
    },
    areaServed: [
      { "@type": "City", name: "دمياط الجديدة" },
      { "@type": "City", name: "المنصورة الجديدة" }
    ],
    sameAs: [
      "https://wa.me/201558245974",
    ],
    priceRange: "$$",
    foundingDate: "2024",
    numberOfEmployees: { "@type": "QuantitativeValue", value: "5-10" },
    knowsAbout: ["عقارات دمياط الجديدة", "عقارات المنصورة الجديدة", "بيع شقق", "بيع فيلات", "بيع أراضي"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://eltaiseer.com/#website",
    url: "https://eltaiseer.com",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هي أسعار الشقق في دمياط الجديدة 2026؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تتراوح أسعار الشقق في دمياط الجديدة من 500,000 جنيه للشقق الصغيرة حتى 5 مليون جنيه للدوبلكس والبنتهاوس. الأسعار تختلف حسب الحي والمساحة ومستوى التشطيب."
        }
      },
      {
        "@type": "Question",
        name: "ما هي أفضل الأحياء للسكن في دمياط الجديدة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "أفضل الأحياء تشمل الحي الأول والثاني والثالث للموقع المتميز، ومشروع جنة ودار مصر وسكن مصر للمشاريع القومية بأسعار مدعومة."
        }
      },
      {
        "@type": "Question",
        name: "هل يوجد تقسيط للشقق في دمياط الجديدة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، توجد خيارات تقسيط تصل حتى 10 سنوات مع مقدمات تبدأ من 10%. التيسير للعقارات يوفر خيارات دفع مرنة تناسب جميع الميزانيات."
        }
      },
      {
        "@type": "Question",
        name: "ما هي أسعار الشقق في المنصورة الجديدة 2026؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تبدأ أسعار الشقق في المنصورة الجديدة من 600,000 جنيه في مشاريع سكن لكل المصريين، وتصل إلى 8 مليون جنيه للفيلات في حي الفيلات والداون تاون."
        }
      },
      {
        "@type": "Question",
        name: "ما الفرق بين دمياط الجديدة والمنصورة الجديدة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "دمياط الجديدة مدينة مكتملة بها جميع الخدمات، بينما المنصورة الجديدة مدينة الجيل الرابع قيد التطوير مع إمكانيات استثمارية عالية وتخطيط عالمي."
        }
      }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://eltaiseer.com/#localbusiness",
    name: "التيسير للعقارات",
    image: "https://eltaiseer.com/logo.png",
    telephone: "+201558245974",
    address: {
      "@type": "PostalAddress",
      streetAddress: "دمياط الجديدة",
      addressLocality: "دمياط الجديدة",
      addressRegion: "دمياط",
      postalCode: "34511",
      addressCountry: "EG"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.4175,
      longitude: 31.8144
    },
    url: "https://eltaiseer.com",
    openingHours: "Mo-Sa 09:00-21:00",
    priceRange: "$$",
    paymentAccepted: "Cash, Bank Transfer",
    currenciesAccepted: "EGP",
    hasMap: "https://maps.google.com/?q=31.4175,31.8144",
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="canonical" href="https://eltaiseer.com" />
        <link rel="alternate" hrefLang="ar-EG" href="https://eltaiseer.com" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className={`${cairo.variable} font-sans antialiased bg-gray-50`}
      >
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <AuthProvider>
          {children}
          <FloatingWhatsApp />
        </AuthProvider>
      </body>
    </html>
  );
}
