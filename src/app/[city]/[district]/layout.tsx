import { Metadata } from "next";
import { SLUG_TO_DISTRICT } from "@/lib/districtSlugs";
import { getPropertiesServer, filterByCity, filterByDistrict } from "@/lib/serverProperties";
import { computeDistrictStats, buildDistrictTitle } from "@/lib/districtFaq";
import { formatNumber } from "@/lib/propertySummary";
import { getDistrictEditorial } from "@/lib/districtContent";
import { ogImages } from "@/lib/site";

type Props = {
  params: Promise<{ city: string; district: string }>;
  children: React.ReactNode;
};

const VALID_CITIES = ["new-damietta", "new-mansoura"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district } = await params;

  // slug غير معروف = صفحة غير موجودة — يمنع فهرسة عدد لا نهائي من الروابط الوهمية
  const districtName = SLUG_TO_DISTRICT[district];
  if (!VALID_CITIES.includes(city) || !districtName) {
    return {
      title: "الصفحة غير موجودة",
      robots: { index: false, follow: false },
    };
  }

  const isNM = city === "new-mansoura";
  const cityName = isNM ? "المنصورة الجديدة" : "دمياط الجديدة";
  const citySlug = isNM ? "new-mansoura" : "new-damietta";

  // وصف وعنوان من المعروض الفعلي في الحي (كان نصاً واحداً مكرراً في 53 صفحة بلا أي معلومة عن الحي)
  const all = await getPropertiesServer();
  const stats = computeDistrictStats(
    filterByDistrict(filterByCity(all, citySlug), districtName).filter((p) => p.status !== "تم البيع")
  );
  // العنوان يذكر الأنواع المعروضة فعلاً في الحي بصيغة البحث ("شقق للبيع في …")
  const title = buildDistrictTitle(districtName, cityName, stats);
  // حي بلا أي معروض = صفحة "لا توجد عقارات" يصنفها جوجل soft 404 وتضعف تقييم الموقع ككل:
  // لا تُفهرس (مع بقاء روابطها متبوعة) وتعود للفهرسة تلقائياً مع أول عقار.
  // all.length === 0 يعني تعذر جلب البيانات لا حياً فارغاً — لا نُخرج صفحات من الفهرس بسبب عطل مؤقت.
  const indexable = stats !== null || all.length === 0;
  const description = stats
    ? `عدد العقارات المعروضة للبيع الآن في ${districtName} ب${cityName}: ${stats.count}${
        stats.minPrice
          ? stats.minPrice === stats.maxPrice
            ? `، السعر ${formatNumber(stats.minPrice)} جنيه`
            : `، الأسعار بين ${formatNumber(stats.minPrice)} و${formatNumber(stats.maxPrice)} جنيه`
          : ""
      }. الأنواع: ${stats.typeCounts.map((t) => t.type).join("، ")}. متوسط سعر المتر ومواصفات كل وحدة وطريقة الدفع على التيسير للعقارات.`
    : `تعريف بـ${districtName} في ${cityName} والمناطق المجاورة له. لا يوجد معروض للبيع في الحي حالياً على التيسير للعقارات — المعروض يتحدث باستمرار.`;

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
    title: { absolute: title },
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://eltaiseer.com/${citySlug}/${district}/`,
      type: "website",
      locale: "ar_EG",
      siteName: "التيسير للعقارات",
      images: ogImages(citySlug, `${districtName} - ${cityName}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages(citySlug).map((i) => i.url),
    },
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}/${district}/`,
    },
    robots: {
      index: indexable,
      follow: true,
    },
  };
}

export default async function DistrictLayout({ children, params }: { children: React.ReactNode; params: Promise<{ city: string; district: string }> }) {
  const { city, district } = await params;
  const districtName = SLUG_TO_DISTRICT[district];

  // التحقق من صحة الحي يتم في صفحة الحي نفسها (notFound هناك) وليس هنا —
  // لأن هذا الـ layout يغلف أيضاً صفحات العقارات، وعقار بحي غير مُعرّف
  // (مثل حي فارغ في البيانات) يجب أن يظل قابلاً للوصول عبر رابطه
  if (!VALID_CITIES.includes(city) || !districtName) {
    return children;
  }

  const isNM = city === "new-mansoura";
  const cityName = isNM ? "المنصورة الجديدة" : "دمياط الجديدة";
  const citySlug = isNM ? "new-mansoura" : "new-damietta";

  const neighborhoodSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    additionalType: "https://schema.org/Neighborhood",
    name: districtName,
    url: `https://eltaiseer.com/${citySlug}/${district}/`,
    // التعريف التحريري للحي إن وُجد (كان نصاً تسويقياً واحداً يصف كل حي بأنه "منطقة سكنية" حتى المناطق التجارية)
    description: getDistrictEditorial(district)?.intro || `${districtName} — أحد أحياء ${cityName}.`,
    containedInPlace: {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "Country",
        name: "مصر",
      },
    },
  };



  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(neighborhoodSchema) }}
      />
      {children}
    </>
  );
}
