import { Metadata } from "next";

type Props = {
  params: Promise<{ city: string }>;
  children: React.ReactNode;
};

const cityMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  "new-damietta": {
    title: "عقارات دمياط الجديدة للبيع | شقق وفيلات وأراضي 2026",
    description: "شقق وفيلات وأراضي للبيع في جميع أحياء دمياط الجديدة — الحي الأول للسادس ومشاريع جنة ودار مصر وسكن مصر. أسعار تبدأ من 500,000 جنيه وتقسيط مريح.",
    keywords: [
      "عقارات دمياط الجديدة",
      "شقق للبيع في دمياط الجديدة",
      "فيلات دمياط الجديدة",
      "أراضي للبيع دمياط الجديدة",
      "شقق الحي الأول دمياط الجديدة",
      "شقق الحي الثاني دمياط الجديدة",
      "شقق الحي الثالث دمياط الجديدة",
      "مشروع جنة دمياط الجديدة",
      "دار مصر دمياط الجديدة",
      "سكن مصر دمياط الجديدة",
      "بيت الوطن دمياط الجديدة",
      "أسعار الشقق دمياط الجديدة 2026",
      "شقق بالتقسيط دمياط الجديدة",
      "عقارات للبيع دمياط",
      "apartments for sale new damietta",
      "real estate new damietta egypt",
    ],
  },
  "new-mansoura": {
    title: "عقارات المنصورة الجديدة للبيع | شقق وفيلات 2026",
    description: "شقق وفيلات للبيع في المنصورة الجديدة — R1 حتى R7 وحي الفيلات وداون تاون وسكن لكل المصريين. مدينة الجيل الرابع بأسعار استثمارية وتقسيط مريح.",
    keywords: [
      "عقارات المنصورة الجديدة",
      "شقق للبيع في المنصورة الجديدة",
      "فيلات المنصورة الجديدة",
      "أراضي للبيع المنصورة الجديدة",
      "شقق R1 المنصورة الجديدة",
      "شقق R2 المنصورة الجديدة",
      "شقق R3 المنصورة الجديدة",
      "حي الفيلات المنصورة الجديدة",
      "داون تاون المنصورة الجديدة",
      "سكن لكل المصريين المنصورة الجديدة",
      "دار مصر المنصورة الجديدة",
      "جنة المنصورة الجديدة",
      "أسعار الشقق المنصورة الجديدة 2026",
      "الاستثمار في المنصورة الجديدة",
      "apartments for sale new mansoura",
      "real estate new mansoura egypt",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;

  // مدينة غير معروفة = 404 — لا نمنحها metadata قابلة للفهرسة
  if (!cityMetadata[city]) {
    return { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };
  }

  const meta = cityMetadata[city];
  const citySlug = city === "new-mansoura" ? "new-mansoura" : "new-damietta";

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://eltaiseer.com/${citySlug}/`,
      type: "website",
      locale: "ar_EG",
      siteName: "التيسير للعقارات",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}/`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CityLayout({ children, params }: { children: React.ReactNode; params: Promise<{ city: string }> }) {
  const { city } = await params;

  const cityName = city === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "City",
    name: cityName,
    url: `https://eltaiseer.com/${city === "new-mansoura" ? "new-mansoura" : "new-damietta"}/`,
    // ربط الكيان بمصادر موثوقة — يساعد محركات البحث ووكلاء AI على تمييز المدينة
    sameAs:
      city === "new-mansoura"
        ? [
            "https://ar.wikipedia.org/wiki/المنصورة_الجديدة",
            "https://en.wikipedia.org/wiki/New_Mansoura",
          ]
        : [
            "https://ar.wikipedia.org/wiki/دمياط_الجديدة",
            "https://en.wikipedia.org/wiki/New_Damietta",
          ],
    containedInPlace: {
      "@type": "Country",
      name: "مصر",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      {children}
    </>
  );
}
