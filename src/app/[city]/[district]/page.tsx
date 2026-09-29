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
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { AnswerSection, RichText, TeaserLinks } from "@/components/Answers";
import { computePriceStats, districtPricesHref, toPriceInput, TYPE_GROUP } from "@/lib/seo/prices";
import { breadcrumbNode, districtPlaceId, faqNode, graphWith, itemListNode, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";
import { getDistrictEditorial } from "@/lib/districtContent";
import { isAvailable } from "@/lib/listingCategories";
import { isDistrictIndexable, NOINDEX_FOLLOW } from "@/lib/indexRules";
import { answersFor, faqFrom, teaser } from "@/lib/answers";
import {
  ND_PROJECTS,
  districtFitQuestion,
  districtGroups,
  districtLede,
  districtPriceAnswer,
  districtPriceQuestion,
} from "@/lib/answers/local";
import { BeitAlWatanBox, resaleCityHref } from "../CitySections";

// ISR كل 5 دقائق — العقارات تظهر في HTML الخادم مع بقاء البيانات حديثة
export const revalidate = 300;
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"] as const;

// أسئلة يملكها حي بعينه (faq-owners.json): Q164 (بيت الوطن - غرب) معلّق [VERIFY] فلا يظهر.
// المعرّف الثابت للقسم حين لا يعطيه questions.json جزء رابط.
const DISTRICT_ANSWERS: Record<string, { id: string; anchor: string }[]> = {
  "beit-al-watan-west": [{ id: "Q164", anchor: "map" }],
};
// أسئلة كانت على صفحات أحياء noindex (بلا عروض): مالكها الآن صفحة قابلة للفهرسة، وهنا رابط إليها فقط.
// Q163 → /new-damietta/#beit-al-watan (أحياء بيت الوطن الثلاثة)، Q171 → /prices/#national-housing (مشروعات الإسكان القومي)
function districtTeasers(city: string, district: string, districtName: string): string[] {
  if (city !== "new-damietta") return [];
  if (district.startsWith("beit-al-watan-")) return ["Q163"];
  if (ND_PROJECTS.includes(districtName)) return ["Q171"];
  return [];
}
// «بيت الوطن» في دمياط الجديدة اسم مناطق سكنية قائمة (spec-final §0.3): صندوق المدينة على صفحاتها الثلاث
const BW_DISTRICTS = ["beit-al-watan-east", "beit-al-watan-west", "beit-al-watan-beach"];
const LINK = "text-orange-700 underline";

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

  // المعروض الآن ونطاق سعره، ووسيط سعر المتر لكل نوع من 3 عروض فأكثر (نفس حساب /prices/): لا تقديرات مكتوبة يدويًا
  const prices = available.map((p) => p.price).filter((n) => n > 0);
  const stats = computePriceStats(all.map(toPriceInput));
  const rows = stats.rows.filter((r) => r.cityId === city && r.district === districtName.trim());
  const groups = districtGroups(available, rows, TYPE_GROUP);
  const editorial = getDistrictEditorial(district);
  const path = `/${city}/${district}/`;
  const dataModified = maxIso(available.map((p) => p.updatedAt || p.createdAt));
  const placeId = districtPlaceId(city, district);

  const lede = districtLede({
    intro: editorial?.intro,
    districtName,
    cityId: city,
    n: available.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    dataModified,
  });
  // أسئلة الحي المملوكة وحدها تدخل FAQPage؛ سؤالا السعر و«لمن يناسب» محسوبان لكل حي بلا Question
  const own = DISTRICT_ANSWERS[district] || [];
  const owned = answersFor(path, { prices: stats, dataModified: stats.dataModified }, own.map((o) => o.id));
  const faq = faqNode(path, faqFrom(owned));
  const isBw = city === "new-damietta" && BW_DISTRICTS.includes(district);
  const resaleHref = isBw ? await resaleCityHref(city) : null;
  const priceAnswer = districtPriceAnswer({
    districtName,
    cityId: city,
    groups,
    dataModified,
    // صف الحي في جدول /prices/ (معرّفه slug الحي) إن كان له وسيط، وإلا قسم المدينة
    pricesHref: districtPricesHref(stats, city, districtName, district),
  });

  const answersSlot = (
    <div className="mt-12 bg-white rounded-xl p-6 shadow-sm space-y-10">
      {owned.map((item) => (
        <AnswerSection key={item.id} item={item} id={own.find((o) => o.id === item.id)?.anchor} />
      ))}
      <section id="price" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{districtPriceQuestion(districtName, city)}</h2>
        {priceAnswer.split(/\n\n+/).map((para, i) => (
          <p key={i} className="text-gray-700 leading-relaxed mb-2">
            <RichText text={para} />
          </p>
        ))}
        <p className="sources text-xs text-gray-500 mt-2">
          المصدر: إعلانات البيع النشطة على eltaiseer.com (وسيط لكل نوع عقار من 3 عروض على الأقل).
        </p>
      </section>
      {editorial && editorial.bestFor.length > 0 && (
        <section id="fit" className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{districtFitQuestion(districtName)}</h2>
          <ul className="list-disc pr-5 space-y-1 text-gray-700">
            {editorial.bestFor.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </section>
      )}
      {available.length === 0 && (
        <p className="text-gray-700">
          تصفح{" "}
          <Link href={`/${city}/`} prefetch={false} className={LINK}>
            عقارات {cityName}
          </Link>
          ، أو{" "}
          <Link href="/contact/" prefetch={false} className={LINK}>
            أرسل لنا طلب شراء في {districtName}
          </Link>
          .
        </p>
      )}
      {isBw && resaleHref && <BeitAlWatanBox citySlug={city} resaleHref={resaleHref} skipDistrict={district} />}
      <TeaserLinks title="أسئلة تجيب عنها صفحات أخرى" items={districtTeasers(city, district, districtName).map((id) => teaser(id))} />
    </div>
  );
  const pageGraph = graphWith(
    [placeId], // معرّف في layout الحي
    webPage({
      path,
      type: "CollectionPage",
      name: `عقارات ${districtName} - ${cityName}`,
      about: ref(placeId),
      mainEntity: available.length > 0 ? ref(`${pageUrl(path)}#itemlist`) : undefined,
      hasPart: faq ? [ref(`${pageUrl(path)}#faq`)] : undefined,
      dateModified: dataModified ? cairoIso(dataModified) : undefined,
    }),
    available.length > 0
      ? itemListNode(path, available.slice(0, 30).map((p) => getPropertyUrl(p)), {
          name: `عقارات للبيع في ${districtName}`,
          total: available.length,
        })
      : null,
    faq,
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
        lede={lede}
        answersSlot={answersSlot}
        freshnessSlot={
          <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-500 mt-4" />
        }
      />
    </>
  );
}
