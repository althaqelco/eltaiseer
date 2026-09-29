import { Metadata } from "next";
import { SLUG_TO_DISTRICT, isCityDistrictSlug } from "@/lib/districtSlugs";
import { JsonLd } from "@/components/JsonLd";
import { ROBOTS_INDEX } from "@/lib/seo/robots";
import { SITE_NAME } from "@/lib/seo/owner-flags";
import { cityId, districtPlaceId, graph, node, pageUrl, ref } from "@/lib/seo/schema";

type Props = {
  params: Promise<{ city: string; district: string }>;
  children: React.ReactNode;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district } = await params;

  // slug غير معروف أو حي من المدينة الأخرى = صفحة غير موجودة — يمنع فهرسة عدد لا نهائي من الروابط الوهمية
  const districtName = SLUG_TO_DISTRICT[district];
  if (!districtName || !isCityDistrictSlug(city, district)) {
    return {
      title: "الصفحة غير موجودة",
      robots: { index: false, follow: false },
    };
  }

  const isNM = city === "new-mansoura";
  const cityName = isNM ? "المنصورة الجديدة" : "دمياط الجديدة";
  const citySlug = isNM ? "new-mansoura" : "new-damietta";

  const title = `عقارات ${districtName} - ${cityName} | شقق وفيلات للبيع 2026`;
  const description = `عقارات للبيع في ${districtName} ب${cityName}: شقق وفيلات وأراضٍ ومحلات بأسعارها الفعلية كما يعرضها البائعون، مع عدد العروض الحالية ونطاق أسعارها. التيسير للعقارات.`;

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
      url: `https://eltaiseer.com/${citySlug}/${district}/`,
      type: "website",
      locale: "ar_EG",
      siteName: SITE_NAME,
      images: [{ url: `/og-${citySlug}.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og-${citySlug}.jpg`],
    },
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}/${district}/`,
    },
    robots: ROBOTS_INDEX,
  };
}

export default async function DistrictLayout({ children, params }: { children: React.ReactNode; params: Promise<{ city: string; district: string }> }) {
  const { city, district } = await params;
  const districtName = SLUG_TO_DISTRICT[district];

  // التحقق من صحة الحي يتم في صفحة الحي نفسها (notFound هناك) وليس هنا —
  // لأن هذا الـ layout يغلف أيضاً صفحات العقارات، وعقار بحي غير مُعرّف
  // (مثل حي فارغ في البيانات) يجب أن يظل قابلاً للوصول عبر رابطه
  if (!districtName || !isCityDistrictSlug(city, district)) {
    return children;
  }

  const isNM = city === "new-mansoura";
  const cityName = isNM ? "المنصورة الجديدة" : "دمياط الجديدة";
  const citySlug = isNM ? "new-mansoura" : "new-damietta";

  // كيان الحي بمعرّف ثابت، داخل كيان المدينة المعرّف في رسم الموقع. أحياء «بيت الوطن» أسماء أماكن سكنية
  // قائمة (ليست البرنامج) ولها قالبها في السجل. يُعرَّف هنا لأن صفحات العقارات تحت الحي تشير إليه أيضًا.
  const path = `/${citySlug}/${district}/`;
  const placeGraph = graph(
    node(districtPlaceId(citySlug, district), {
      "@type": "Place",
      additionalType: "https://schema.org/Neighborhood",
      name: `${districtName}، ${cityName}`,
      url: pageUrl(path),
      description: `${districtName}: منطقة في ${cityName}، وفيها عقارات معروضة للبيع على التيسير.`,
      containedInPlace: ref(cityId(citySlug)),
      // لا relatedLink هنا: خاصية WebPage لا Place، ووجهتها (/beit-al-watan-for-sale/new-damietta/) noindex الآن
    })
  );

  return (
    <>
      <JsonLd graph={placeGraph} />
      {children}
    </>
  );
}
