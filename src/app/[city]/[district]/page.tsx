import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DistrictClient from "./DistrictClient";
import {
  getPropertiesServerResult,
  serializeProperties,
  filterByCity,
  filterByDistrict,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { SLUG_TO_DISTRICT, getCityDistrictSlugs, isCityDistrictSlug } from "@/lib/districtSlugs";
import { getDistrictEditorial } from "@/lib/districtContent";
import { isAvailable } from "@/lib/listingCategories";
import { isDistrictIndexable, NOINDEX_FOLLOW } from "@/lib/indexRules";

// ISR كل 5 دقائق — العقارات تظهر في HTML الخادم مع بقاء البيانات حديثة
export const revalidate = 300;
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"] as const;

type Props = { params: { city: string; district: string } };

// بناء مسبق لكل صفحات الأحياء الـ53 — استجابة فورية للزوار والزواحف
export function generateStaticParams() {
  return VALID_CITIES.flatMap((city) =>
    getCityDistrictSlugs(city).map((district) => ({ city, district }))
  );
}

// نفس البيانات التي تعرضها الصفحة — العدّ هنا هو ما يراه الزائر
async function loadDistrict(city: string, district: string) {
  const { ok, properties: all } = await getPropertiesServerResult();
  const districtName = SLUG_TO_DISTRICT[district];
  const districtProperties = filterByDistrict(filterByCity(all, city), districtName);
  const available = districtProperties.filter(isAvailable);
  return { ok, districtName, districtProperties, available };
}

// حي بلا عروض متاحة = noindex,follow (القاعدة وشرحها في lib/indexRules.ts)؛
// العنوان والوصف والـ canonical تأتي من layout الحي
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district } = params;
  if (!SLUG_TO_DISTRICT[district] || !isCityDistrictSlug(city, district)) return {};
  const { ok, available } = await loadDistrict(city, district);
  if (ok && !isDistrictIndexable(district, available.length)) {
    return { robots: NOINDEX_FOLLOW };
  }
  return {};
}

export default async function DistrictPage({ params }: Props) {
  const { city, district } = params;

  // حي من المدينة الأخرى (/new-mansoura/sixth-district/) أو slug غير معروف = 404 حقيقي
  if (!SLUG_TO_DISTRICT[district] || !isCityDistrictSlug(city, district)) {
    notFound();
  }

  const { districtName, districtProperties, available } = await loadDistrict(city, district);

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
      {/* كل عروض الحي في HTML الخادم (بلا ترقيم) — كل إعلان له رابط يزحف إليه من صفحة حيه */}
      <DistrictClient
        citySlug={city}
        districtSlug={district}
        initialProperties={serializeProperties(districtProperties)}
        districtStats={districtStats}
        editorial={getDistrictEditorial(district)}
      />
    </>
  );
}
