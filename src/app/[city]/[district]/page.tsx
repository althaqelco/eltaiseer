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
  const prices = available.map((p) => p.price).filter((n) => n > 0);
  const perSqm = available
    .filter((p) => p.price > 0 && p.details?.area_sqm > 0)
    .map((p) => Math.round(p.price / p.details.area_sqm));
  const districtStats =
    available.length > 0
      ? {
          count: available.length,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          avgPerSqm: perSqm.length
            ? Math.round(perSqm.reduce((a, b) => a + b, 0) / perSqm.length)
            : null,
          types: Array.from(new Set(available.map((p) => p.type))),
        }
      : null;

  const itemListSchema = buildItemListSchema(available, `عقارات للبيع في ${districtName}`);

  return (
    <>
      {districtProperties.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <DistrictClient
        citySlug={city}
        districtSlug={district}
        initialProperties={serializeProperties(districtProperties)}
        districtStats={districtStats}
      />
    </>
  );
}
