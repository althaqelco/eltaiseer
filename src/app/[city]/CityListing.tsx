import { notFound } from "next/navigation";
import CityClient from "./CityClient";
import {
  getPropertiesServer,
  serializeProperties,
  filterByCity,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { CITIES, CityId } from "@/lib/egyptPlaces";
import { CITY_PAGE_SIZE, totalPages } from "@/lib/pagination";

const VALID_CITIES = ["new-damietta", "new-mansoura"];

// صفحة مدينة (الأساسية أو ?page=N) — كل صفحة ترقيم تعرض شريحتها من الخادم بروابط حقيقية لما بعدها
export default async function CityListing({ city, page }: { city: string; page: number }) {
  if (!VALID_CITIES.includes(city)) {
    notFound();
  }

  const all = await getPropertiesServer();
  const cityProperties = filterByCity(all, city);
  // رقم صفحة أبعد من آخر صفحة = 404 (الصفحة الأولى تبقى دائماً حتى بلا عقارات)
  if (page > totalPages(cityProperties.length, CITY_PAGE_SIZE)) {
    notFound();
  }
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
        page={page}
      />
    </>
  );
}
