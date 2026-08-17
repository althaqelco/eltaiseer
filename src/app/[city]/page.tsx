import { notFound } from "next/navigation";
import CityClient from "./CityClient";
import {
  getPropertiesServer,
  serializeProperties,
  filterByCity,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { CITIES, CityId } from "@/lib/egyptPlaces";

// ISR كل 5 دقائق: العقارات تظهر في HTML الخادم للزواحف مع بقاء البيانات حديثة
export const revalidate = 300;
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"];

export function generateStaticParams() {
  return VALID_CITIES.map((city) => ({ city }));
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const { city } = params;

  if (!VALID_CITIES.includes(city)) {
    notFound();
  }

  const all = await getPropertiesServer();
  const cityProperties = filterByCity(all, city);
  const cityName = CITIES[city as CityId]?.nameAr || "دمياط الجديدة";

  const itemListSchema = buildItemListSchema(
    cityProperties.filter((p) => p.status !== "تم البيع"),
    `عقارات للبيع في ${cityName}`
  );

  return (
    <>
      {cityProperties.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <CityClient
        citySlug={city}
        initialProperties={serializeProperties(cityProperties)}
      />
    </>
  );
}
