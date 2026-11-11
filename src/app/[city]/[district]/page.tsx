import { notFound } from "next/navigation";
import DistrictClient from "./DistrictClient";
import {
  getPropertiesServer,
  serializeProperties,
  filterByCity,
  filterByDistrict,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { SLUG_TO_DISTRICT, getCityDistrictSlugs } from "@/lib/districtSlugs";
import { getDistrictEditorial } from "@/lib/districtContent";
import { computeDistrictStats, buildDistrictFaq } from "@/lib/districtFaq";
import { buildFaqSchema } from "@/lib/homeFaq";

// ISR كل 5 دقائق — العقارات تظهر في HTML الخادم مع بقاء البيانات حديثة
export const revalidate = 300;
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"] as const;

// بناء مسبق لكل صفحات الأحياء الـ53 — استجابة فورية للزوار والزواحف
export function generateStaticParams() {
  return VALID_CITIES.flatMap((city) =>
    getCityDistrictSlugs(city).map((district) => ({ city, district }))
  );
}

export default async function DistrictPage({
  params,
}: {
  params: { city: string; district: string };
}) {
  const { city, district } = params;
  const districtName = SLUG_TO_DISTRICT[district];

  if (!(VALID_CITIES as readonly string[]).includes(city) || !districtName) {
    notFound();
  }

  const all = await getPropertiesServer();
  const districtProperties = filterByDistrict(filterByCity(all, city), districtName);
  const available = districtProperties.filter((p) => p.status !== "تم البيع");

  // إحصاءات حية تجعل محتوى كل حي فريداً ومحدثاً تلقائياً (بدل النص المكرر في 53 صفحة)
  const districtStats = computeDistrictStats(available);
  const editorial = getDistrictEditorial(district);
  const cityName = city === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
  // أسئلة وأجوبة من نفس الأرقام — القسم المرئي والـ schema من مصدر واحد
  const faq = buildDistrictFaq(districtName, cityName, districtStats, editorial);

  const itemListSchema = buildItemListSchema(available, `عقارات للبيع في ${districtName}`);

  return (
    <>
      {districtProperties.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      {faq.length >= 2 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faq)) }}
        />
      )}
      <DistrictClient
        citySlug={city}
        districtSlug={district}
        initialProperties={serializeProperties(districtProperties)}
        districtStats={districtStats}
        editorial={editorial}
        faq={faq}
      />
    </>
  );
}
