import { Metadata } from "next";

type Props = {
  params: Promise<{ city: string; district: string }>;
  children: React.ReactNode;
};

const DISTRICT_NAMES: Record<string, string> = {
  "first-district": "الحي الأول",
  "second-district": "الحي الثاني",
  "third-district": "الحي الثالث",
  "fourth-district": "الحي الرابع",
  "fifth-district": "الحي الخامس",
  "sixth-district": "الحي السادس المتميز",
  "janna-project": "مشروع جنة",
  "dar-misr-1": "دار مصر موقع 1",
  "dar-misr-2": "دار مصر موقع 2",
  "sakan-misr-south": "سكن مصر جنوب",
  "sakan-misr-west": "سكن مصر غرب",
  "beit-al-watan-east": "بيت الوطن شرق",
  "beit-al-watan-west": "بيت الوطن غرب",
  "beit-al-watan-beach": "بيت الوطن الشاطئ",
  "central-area-a": "المنطقة المركزية أ",
  "central-area-b": "المنطقة المركزية ب",
  "central-area-c": "المنطقة المركزية ج",
  "chalets": "منطقة الشاليهات",
  "r1": "R1",
  "r2": "R2",
  "r3": "R3",
  "r4": "R4",
  "r5": "R5",
  "r6": "R6",
  "r7": "R7",
  "residential-1": "الحي السكني الأول",
  "residential-2": "الحي السكني الثاني",
  "residential-3": "الحي السكني الثالث",
  "sakan-kol-misryeen": "سكن لكل المصريين",
  "sakan-kol-misryeen-2": "سكن لكل المصريين 2",
  "sakan-kol-misryeen-3": "سكن لكل المصريين 3",
  "dar-misr": "دار مصر",
  "janna": "جنة",
  "medium-housing": "الإسكان المتوسط",
  "social-housing": "الإسكان الاجتماعي",
  "villas-district": "حي الفيلات",
  "villas-d": "منطقة الفيلات D",
  "golf-villas": "فيلات الجولف",
  "lake-villas": "فيلات البحيرات",
  "downtown": "داون تاون",
  "central-mall": "المول المركزي",
  "cbd": "منطقة الأعمال CBD",
  "commercial-axis": "المحور التجاري",
  "services-zone": "منطقة الخدمات",
  "central-park": "الحديقة المركزية",
  "corniche": "الكورنيش",
  "social-club": "النادي الاجتماعي",
  "touristic-zone": "المنطقة السياحية",
  "waterfront": "الواجهة البحرية",
  "beach": "الشاطئ",
  "coastal-resorts": "منتجعات الساحل",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district } = await params;
  const districtName = DISTRICT_NAMES[district] || district.replace(/-/g, " ");
  const isNM = city === "new-mansoura";
  const cityName = isNM ? "المنصورة الجديدة" : "دمياط الجديدة";
  const citySlug = isNM ? "new-mansoura" : "new-damietta";

  const title = `عقارات ${districtName} - ${cityName} | شقق وفيلات للبيع 2026`;
  const description = `شقق وفيلات وأراضي للبيع في ${districtName} ب${cityName}. أسعار تنافسية وتقسيط مريح. تصفح أفضل العقارات المتاحة في ${districtName}. التيسير للعقارات - شريكك الموثوق.`;

  const keywords = [
    `عقارات ${districtName}`,
    `شقق للبيع ${districtName}`,
    `فيلات ${districtName}`,
    `أراضي للبيع ${districtName}`,
    `${districtName} ${cityName}`,
    `شقق ${districtName} ${cityName}`,
    `أسعار الشقق ${districtName}`,
    `عقارات ${cityName}`,
    `شقق بالتقسيط ${districtName}`,
    isNM ? `apartments ${district} new mansoura` : `apartments ${district} new damietta`,
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://eltaiseer.com/${citySlug}/${district}`,
      type: "website",
      locale: "ar_EG",
      siteName: "التيسير للعقارات",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}/${district}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DistrictLayout({ children, params }: { children: React.ReactNode; params: Promise<{ city: string; district: string }> }) {
  const { city, district } = await params;
  const districtName = DISTRICT_NAMES[district] || district.replace(/-/g, " ");
  const isNM = city === "new-mansoura";
  const cityName = isNM ? "المنصورة الجديدة" : "دمياط الجديدة";
  const citySlug = isNM ? "new-mansoura" : "new-damietta";

  const neighborhoodSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    additionalType: "https://schema.org/Neighborhood",
    name: districtName,
    url: `https://eltaiseer.com/${citySlug}/${district}`,
    description: `${districtName} - منطقة سكنية في ${cityName}. تصفح شقق وفيلات وأراضي للبيع في ${districtName} بأسعار تنافسية.`,
    containedInPlace: {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "Country",
        name: "مصر",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://eltaiseer.com" },
      { "@type": "ListItem", position: 2, name: cityName, item: `https://eltaiseer.com/${citySlug}` },
      { "@type": "ListItem", position: 3, name: districtName, item: `https://eltaiseer.com/${citySlug}/${district}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
