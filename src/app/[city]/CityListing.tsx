import { notFound } from "next/navigation";
import CityClient from "./CityClient";
import { getPropertiesForIsr, serializeProperties, filterByCity } from "@/lib/serverProperties";
import { CITIES, CityId } from "@/lib/egyptPlaces";
import { CITY_PAGE_SIZE, totalPages } from "@/lib/pagination";
import { getCityDistrictSlugs, getPropertyUrl } from "@/lib/districtSlugs";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AnswerSection, FaqList, TeaserLinks } from "@/components/Answers";
import { Freshness } from "@/components/Freshness";
import { answersFor, faqFrom, teaser, type RenderedAnswer } from "@/lib/answers";
import { CITY_LEDE_SOURCES, cityLede } from "@/lib/answers/local";
import { computePriceStats, toPriceInput } from "@/lib/seo/prices";
import { breadcrumbNode, cityId, faqNode, graph, itemListNode, pageUrl, ref, SITE, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";
import { BeitAlWatanBox, DistrictLinks, RelatedPosts, resaleCityHref } from "./CitySections";

const VALID_CITIES = ["new-damietta", "new-mansoura"];

// أسئلة كل مدينة على صفحتها المالكة (faq-owners.json): H2 للأسئلة المرئية كأقسام، والباقي في «أسئلة شائعة»
const CITY_SECTIONS: Record<string, string[]> = {
  "new-damietta": ["Q169", "Q170", "Q183"],
  "new-mansoura": ["Q178", "Q179", "M-NM-01"],
};
const CITY_FAQ_ITEMS: Record<string, string[]> = {
  "new-damietta": ["M-ND-01"],
  "new-mansoura": ["M-NM-02", "M-NM-03"],
};
// أسئلة تملكها صفحات أخرى: روابط فقط (مقالات المدينة والتقسيط لها سطور خاصة فلا تتكرر هنا)
const CITY_TEASERS: Record<string, [string, string][]> = {
  "new-damietta": [
    ["Q166", "كم أسعار الشقق في دمياط الجديدة؟"],
    ["Q165", "كم سعر متر الأرض في دمياط الجديدة؟"],
  ],
  "new-mansoura": [
    ["Q176", "كم أسعار الشقق في المنصورة الجديدة؟"],
    ["Q175", "كم سعر متر الأرض في المنصورة الجديدة؟"],
  ],
};
/**
 * خريطة الأحياء الثابتة (من رسمنا من بيانات OpenStreetMap بترخيصها «© OpenStreetMap contributors»، بلا ربط مباشر
 * لصور خارجية). null حتى تُرسم الصورة وتُضاف إلى public/ — عندها تظهر مع قائمة الأحياء نصًا تحتها (spec-final A2.3).
 */
const CITY_MAP_IMAGE: Record<string, { src: string; alt: string; width: number; height: number } | null> = {
  "new-damietta": null,
  "new-mansoura": null,
};
// إحداثيات Wikidata P625 (جُلبت 29/9/2026) — نفس إحداثيات عقدة المدينة في رسم الموقع
const OSM_LINK: Record<string, string> = {
  "new-damietta": "https://www.openstreetmap.org/?mlat=31.4368&mlon=31.667#map=13/31.4368/31.667",
  "new-mansoura": "https://www.openstreetmap.org/?mlat=31.47969&mlon=31.43267#map=13/31.47969/31.43267",
};
const LINK = "text-orange-700 hover:underline";

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

  let answersSlot: React.ReactNode = undefined;
  let heroSlot: React.ReactNode = null;
  let lede: string | undefined;
  let pageGraph: object | null = null;
  if (page === 1) {
    const active = cityProperties.filter((p) => p.status !== "تم البيع");
    const dataModified = maxIso(active.map((p) => p.updatedAt || p.createdAt));
    const prices = computePriceStats(all.map(toPriceInput));
    const data = { prices, dataModified, ndDistrictCount: getCityDistrictSlugs("new-damietta").length };
    const sections = answersFor(path, data, CITY_SECTIONS[city]);
    const faqItems = answersFor(path, data, CITY_FAQ_ITEMS[city]);
    const faq = faqNode(path, faqFrom([...sections, ...faqItems]));
    const byId = new Map<string, RenderedAnswer>(sections.map((a) => [a.id, a]));
    const resaleHref = await resaleCityHref(city);
    const map = CITY_MAP_IMAGE[city];

    lede = cityLede(city, {
      n: active.length,
      k: new Set(active.map((p) => (p.location.district || "").trim()).filter(Boolean)).size,
      prices,
      dataModified,
    });
    heroSlot = (
      <>
        <p className="sources text-xs text-gray-400 mt-2">{CITY_LEDE_SOURCES[city]}</p>
        <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-300 mt-1" />
        <p className="text-sm text-gray-200 mt-2">
          جدول سعر المتر لكل حي ونوع عقار في {cityName}:{" "}
          <Link href={`/prices/#${city}`} prefetch={false} className="text-orange-300 underline">
            أسعار العقارات
          </Link>
        </p>
      </>
    );

    const installmentsLine = (
      <p className="text-gray-700">
        <Link href={`/properties/installments/#${city}`} prefetch={false} className={LINK}>
          عقارات بالتقسيط في {cityName}
        </Link>
      </p>
    );

    answersSlot = (
      <div className="mt-12 space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-10">
          {city === "new-damietta" ? (
            <>
              {byId.get("Q169") && (
                <AnswerSection item={byId.get("Q169")!}>
                  <DistrictLinks citySlug={city} />
                </AnswerSection>
              )}
              {byId.get("Q170") && (
                <AnswerSection item={byId.get("Q170")!}>
                  {map ? (
                    <figure className="mt-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={map.src} alt={map.alt} width={map.width} height={map.height} loading="lazy" className="rounded-lg border" />
                      <figcaption className="text-xs text-gray-500 mt-1">© OpenStreetMap contributors</figcaption>
                    </figure>
                  ) : null}
                  <p className="text-sm text-gray-700 mt-2">
                    <a href={OSM_LINK[city]} rel="noopener" className={LINK}>
                      موقع دمياط الجديدة على خريطة OpenStreetMap
                    </a>
                  </p>
                </AnswerSection>
              )}
              {byId.get("Q183") && <AnswerSection item={byId.get("Q183")!} />}
              {installmentsLine}
              <BeitAlWatanBox citySlug={city} resaleHref={resaleHref} />
            </>
          ) : (
            <>
              {["Q178", "Q179", "M-NM-01"].map((id) => {
                const item = byId.get(id);
                return item ? <AnswerSection key={id} item={item} /> : null;
              })}
              {installmentsLine}
              <BeitAlWatanBox citySlug={city} resaleHref={resaleHref} />
              <section aria-labelledby="nm-districts">
                <h2 id="nm-districts" className="text-2xl font-bold text-gray-900 mb-1">
                  أحياء ومناطق المنصورة الجديدة على التيسير
                </h2>
                <DistrictLinks citySlug={city} />
              </section>
            </>
          )}
        </div>
        <FaqList items={faqItems} title={`أسئلة شائعة عن ${cityName}`} id="faq" className="bg-white rounded-xl p-6 shadow-sm" />
        <RelatedPosts citySlug={city} />
        <TeaserLinks title="أسئلة تجيب عنها صفحات أخرى" items={CITY_TEASERS[city].map(([id, label]) => teaser(id, label))} />
      </div>
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
        lede={lede}
        heroSlot={heroSlot}
      />
    </>
  );
}
