import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DistrictClient from "./DistrictClient";
import {
  getPropertiesServerResult,
  serializeProperties,
  filterByCity,
  filterByDistrict,
} from "@/lib/serverProperties";
import { SLUG_TO_DISTRICT, getCityDistrictSlugs, getPropertyUrl, isCityDistrictSlug } from "@/lib/districtSlugs";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { computePriceStats, toPriceInput } from "@/lib/seo/prices";
import { breadcrumbNode, districtPlaceId, graphWith, itemListNode, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";
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
  // فشل الجلب في صفحة مخزنة (ISR): نرمي ليبقي Next آخر نسخة سليمة بدل تخزين قائمة فارغة (انظر getPropertiesForIsr)
  if (!ok && process.env.NEXT_PHASE !== "phase-production-build") throw new Error("Firestore unavailable: keeping the last good page");
  const districtName = SLUG_TO_DISTRICT[district];
  const districtProperties = filterByDistrict(filterByCity(all, city), districtName);
  const available = districtProperties.filter(isAvailable);
  return { ok, all, districtName, districtProperties, available };
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

  const { all, districtName, districtProperties, available } = await loadDistrict(city, district);
  const cityName = city === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";

  // إحصاءات حية تجعل محتوى كل حي فريداً ومحدثاً تلقائياً. سعر المتر = وسيط الشقق في الحي من 3 عروض فأكثر
  // (نفس حساب /prices/): المتوسط البسيط القديم خلط الشقق بالأراضي والمحلات وضخّمته قيمة شاذة واحدة.
  const prices = available.map((p) => p.price).filter((n) => n > 0);
  const aptRow = computePriceStats(all.map(toPriceInput)).rows.find(
    (r) => r.cityId === city && r.district === districtName.trim() && r.group === "apartment"
  );
  const districtStats =
    available.length > 0
      ? {
          count: available.length,
          minPrice: prices.length ? Math.min(...prices) : 0,
          maxPrice: prices.length ? Math.max(...prices) : 0,
          apartmentMedianPpm: aptRow ? { value: aptRow.medianPpm, n: aptRow.n } : null,
          types: Array.from(new Set(available.map((p) => p.type))),
        }
      : null;

  const path = `/${city}/${district}/`;
  const dataModified = maxIso(available.map((p) => p.updatedAt || p.createdAt));
  const placeId = districtPlaceId(city, district);
  const pageGraph = graphWith(
    [placeId], // معرّف في layout الحي
    webPage({
      path,
      type: "CollectionPage",
      name: `عقارات ${districtName} - ${cityName}`,
      about: ref(placeId),
      mainEntity: available.length > 0 ? ref(`${pageUrl(path)}#itemlist`) : undefined,
      dateModified: dataModified ? cairoIso(dataModified) : undefined,
    }),
    available.length > 0
      ? itemListNode(path, available.slice(0, 30).map((p) => getPropertyUrl(p)), {
          name: `عقارات للبيع في ${districtName}`,
          total: available.length,
        })
      : null,
    breadcrumbNode(path, [
      { name: "الرئيسية", path: "/" },
      { name: "العقارات", path: "/properties/" },
      { name: cityName, path: `/${city}/` },
      { name: `عقارات ${districtName}`, path },
    ])
  );

  return (
    <>
      <JsonLd graph={pageGraph} />
      {/* كل عروض الحي في HTML الخادم (بلا ترقيم) — كل إعلان له رابط يزحف إليه من صفحة حيه */}
      <DistrictClient
        citySlug={city}
        districtSlug={district}
        initialProperties={serializeProperties(districtProperties)}
        districtStats={districtStats}
        editorial={getDistrictEditorial(district)}
        freshnessSlot={
          <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-500 mt-4" />
        }
      />
    </>
  );
}
