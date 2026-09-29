import { notFound } from "next/navigation";
import CityClient from "./CityClient";
import { getPropertiesForIsr, serializeProperties, filterByCity } from "@/lib/serverProperties";
import { CITIES, CityId } from "@/lib/egyptPlaces";
import { CITY_PAGE_SIZE, totalPages } from "@/lib/pagination";
import { getCityDistrictSlugs, getPropertyUrl } from "@/lib/districtSlugs";
import { JsonLd } from "@/components/JsonLd";
import { FaqList, TeaserLinks } from "@/components/Answers";
import { Freshness } from "@/components/Freshness";
import { answersFor, faqFrom, teaser } from "@/lib/answers";
import { computePriceStats, toPriceInput } from "@/lib/seo/prices";
import { breadcrumbNode, cityId, faqNode, graph, itemListNode, pageUrl, ref, SITE, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";

const VALID_CITIES = ["new-damietta", "new-mansoura"];

// أسئلة كل مدينة على صفحتها المالكة (faq-owners.json)، وأسئلة تملكها صفحات أخرى روابط فقط
const CITY_ANSWERS: Record<string, string[]> = {
  "new-damietta": ["Q169", "Q170", "Q183", "M-ND-01"],
  "new-mansoura": ["Q178", "Q179", "M-NM-01", "M-NM-02", "M-NM-03"],
};
const CITY_TEASERS: Record<string, [string, string][]> = {
  "new-damietta": [
    ["Q166", "كم أسعار الشقق في دمياط الجديدة؟"],
    ["Q167", "ما أفضل حي للسكن في دمياط الجديدة؟"],
    ["Q168", "هل توجد شقق بالتقسيط في دمياط الجديدة؟"],
  ],
  "new-mansoura": [
    ["Q176", "كم أسعار الشقق في المنصورة الجديدة؟"],
    ["Q177", "ما هي أفضل مناطق السكن في المنصورة الجديدة؟"],
    ["Q180", "هل توجد شقق بالتقسيط في المنصورة الجديدة؟"],
  ],
};
// «بيت الوطن» اسم مناطق سكنية قائمة في دمياط الجديدة (ليست البرنامج) — spec-final §0.3
const ND_PLACES = ["east", "west", "beach"].map((p) => ref(`${SITE}/#place-beit-al-watan-new-damietta-${p}`));

// صفحة مدينة (الأساسية أو ?page=N) — كل صفحة ترقيم تعرض شريحتها من الخادم بروابط حقيقية لما بعدها.
// الأسئلة وJSON-LD على الصفحة الأولى فقط (رابطها هو المالك).
export default async function CityListing({ city, page }: { city: string; page: number }) {
  if (!VALID_CITIES.includes(city)) {
    notFound();
  }

  const all = await getPropertiesForIsr();
  const cityProperties = filterByCity(all, city);
  // رقم صفحة أبعد من آخر صفحة = 404 (الصفحة الأولى تبقى دائماً حتى بلا عقارات)
  if (page > totalPages(cityProperties.length, CITY_PAGE_SIZE)) {
    notFound();
  }
  const cityName = CITIES[city as CityId]?.nameAr || "دمياط الجديدة";
  const path = `/${city}/`;

  let answersSlot: React.ReactNode = null;
  let pageGraph: object | null = null;
  if (page === 1) {
    const active = cityProperties.filter((p) => p.status !== "تم البيع");
    const dataModified = maxIso(active.map((p) => p.updatedAt || p.createdAt));
    const items = answersFor(path, {
      prices: computePriceStats(all.map(toPriceInput)),
      dataModified,
      ndDistrictCount: getCityDistrictSlugs("new-damietta").length,
    }, CITY_ANSWERS[city]);
    const faq = faqNode(path, faqFrom(items));
    answersSlot = (
      <>
        <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-500 mt-8" />
        <FaqList items={items} title={`أسئلة شائعة عن ${cityName}`} id="faq" />
        <TeaserLinks
          title="أسئلة تجيب عنها صفحات أخرى"
          items={CITY_TEASERS[city].map(([id, label]) => teaser(id, label))}
        />
      </>
    );
    pageGraph = graph(
      webPage({
        path,
        type: "CollectionPage",
        name: `عقارات ${cityName}`,
        about: ref(cityId(city)),
        mainEntity: active.length > 0 ? ref(`${pageUrl(path)}#itemlist`) : undefined,
        hasPart: faq ? [ref(`${pageUrl(path)}#faq`)] : undefined,
        mentions: city === "new-damietta" ? ND_PLACES : undefined,
        dateModified: dataModified ? cairoIso(dataModified) : undefined,
      }),
      active.length > 0
        ? itemListNode(path, active.slice(0, 20).map((p) => getPropertyUrl(p)), {
            name: `عقارات للبيع في ${cityName}`,
            total: active.length,
          })
        : null,
      faq,
      breadcrumbNode(path, [
        { name: "الرئيسية", path: "/" },
        { name: "العقارات", path: "/properties/" },
        { name: `عقارات ${cityName}`, path },
      ])
    );
  }

  return (
    <>
      {pageGraph && <JsonLd graph={pageGraph} />}
      <CityClient
        citySlug={city}
        initialProperties={serializeProperties(cityProperties)}
        page={page}
        answersSlot={answersSlot}
      />
    </>
  );
}
