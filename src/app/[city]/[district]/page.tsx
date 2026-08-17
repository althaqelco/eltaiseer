import { notFound } from "next/navigation";
import DistrictClient from "./DistrictClient";
import {
  getPropertiesServer,
  serializeProperties,
  filterByCity,
  filterByDistrict,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { SLUG_TO_DISTRICT } from "@/lib/districtSlugs";

// ISR كل 5 دقائق — العقارات تظهر في HTML الخادم مع بقاء البيانات حديثة
export const revalidate = 300;
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"];

export default async function DistrictPage({
  params,
}: {
  params: { city: string; district: string };
}) {
  const { city, district } = params;
  const districtName = SLUG_TO_DISTRICT[district];

  if (!VALID_CITIES.includes(city) || !districtName) {
    notFound();
  }

  const all = await getPropertiesServer();
  const districtProperties = filterByDistrict(filterByCity(all, city), districtName);

  const itemListSchema = buildItemListSchema(
    districtProperties.filter((p) => p.status !== "تم البيع"),
    `عقارات للبيع في ${districtName}`
  );

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
      />
    </>
  );
}
