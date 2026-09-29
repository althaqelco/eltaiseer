import { Metadata } from "next";
import Link from "next/link";
import HomeClient from "./HomeClient";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { filterByCity, getPropertiesForIsr, serializeProperties } from "@/lib/serverProperties";
import { getPropertyUrl } from "@/lib/districtSlugs";
import { ORG, graph, itemListNode, pageUrl, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";
import { SITE_NAME } from "@/lib/seo/owner-flags";
import { computePriceStats, fmtN, toPriceInput, type PriceStats } from "@/lib/seo/prices";
import { homeLede, homePricesSentence } from "@/lib/answers/local";
import { apartments as aptCount } from "@/lib/answers/format";
import { getActiveListings } from "@/lib/bw/listings";
import { isLive } from "@/lib/bw/calc";
import { platformLive } from "@/lib/bw/platformLinks";

// ISR كل 5 دقائق — عقارات الرئيسية تظهر في HTML الخادم
export const revalidate = 300;

const TITLE = "التيسير للعقارات | عقارات للبيع في دمياط الجديدة والمنصورة الجديدة";
const HOME_DESCRIPTION =
  "عقارات للبيع في دمياط الجديدة والمنصورة الجديدة بأسعارها الفعلية: شقق وفيلات وأراضٍ ومحلات، وجدول سعر المتر لكل حي محسوب من المعروض، وإعلانات موثّقة لإعادة بيع أراضي بيت الوطن.";

export const metadata: Metadata = {
  title: {
    absolute: TITLE,
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "عقارات دمياط الجديدة",
    "شقق للبيع في دمياط الجديدة",
    "فيلات دمياط الجديدة",
    "أراضي للبيع دمياط الجديدة",
    "شقق تمليك دمياط الجديدة",
    "دوبلكس دمياط الجديدة",
    "محلات تجارية دمياط الجديدة",
    "أسعار الشقق في دمياط الجديدة 2026",
    "شقق بالتقسيط دمياط الجديدة",
    "عقارات المنصورة الجديدة",
    "شقق للبيع في المنصورة الجديدة",
    "فيلات المنصورة الجديدة",
    "أسعار الشقق في المنصورة الجديدة 2026",
    "التيسير للعقارات",
    "عقارات مصر",
    "real estate new damietta",
    "apartments for sale new damietta",
    "real estate new mansoura",
    "apartments for sale new mansoura",
  ],
  alternates: {
    canonical: "https://eltaiseer.com/",
  },
  openGraph: {
    title: TITLE,
    description: HOME_DESCRIPTION,
    url: "https://eltaiseer.com/",
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const CITY_ROWS = [
  { slug: "new-damietta", name: "دمياط الجديدة" },
  { slug: "new-mansoura", name: "المنصورة الجديدة" },
];

/** «أسعار العروض الحالية باختصار» — جملة خبرية وجدول سريع يحيلان إلى /prices/ (مالك أسئلة الأسعار)، بلا FAQPage */
function PricesNow({ stats, counts }: { stats: PriceStats; counts: Record<string, number> }) {
  const guide = platformLive("/baitelwatan/guide/");
  return (
    <section className="py-10 bg-white border-b" aria-labelledby="prices-now">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="prices-now" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 scroll-mt-24">
          أسعار العروض الحالية باختصار
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">{homePricesSentence(stats)}</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full border-collapse text-sm md:text-base">
            <caption className="text-right text-sm text-gray-600 p-3">أسعار سريعة من العروض الحالية</caption>
            <thead className="bg-slate-800 text-white">
              <tr>
                <th scope="col" className="p-3 text-right">المدينة</th>
                <th scope="col" className="p-3 text-right">العقارات المعروضة</th>
                <th scope="col" className="p-3 text-right">وسيط سعر متر الشقق (عدد الشقق)</th>
                <th scope="col" className="p-3 text-right">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {CITY_ROWS.map((c) => {
                const g = stats.cityGroup[c.slug]?.apartment;
                return (
                  <tr key={c.slug} className="border-b">
                    <th scope="row" className="p-3 text-right font-semibold">{c.name}</th>
                    <td className="p-3">{fmtN(counts[c.slug] || 0)}</td>
                    <td className="p-3">
                      {g && g.medianPpm !== null
                        ? `${fmtN(g.medianPpm)} جنيه/م² (${fmtN(g.n)})`
                        : `أقل من 3 شقق معروضة${g ? ` (${aptCount(g.n)})` : ""}`}
                    </td>
                    <td className="p-3">
                      <Link href={`/prices/#${c.slug}`} prefetch={false} className="text-orange-700 underline">
                        وسيط كل حي في {c.name}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-gray-700 mt-4">
          جدول سعر المتر لكل حي ونوع عقار:{" "}
          <Link href="/prices/" prefetch={false} className="text-orange-700 underline">
            أسعار العقارات
          </Link>
        </p>
        <p className="text-gray-700 mt-2">
          ولإعلانات إعادة بيع أراضي بيت الوطن الموثّقة بالتنازل الرسمي:{" "}
          <Link href="/beit-al-watan-for-sale/" prefetch={false} className="text-orange-700 underline">
            أراضي بيت الوطن للبيع
          </Link>
          .
        </p>
        {guide && (
          <p className="text-gray-700 mt-2">
            شروط البرنامج ومراحله للمصريين بالخارج في دليل{" "}
            <a href="/baitelwatan/guide/" className="text-orange-700 underline">
              مشروع بيت الوطن
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}

export default async function Home() {
  const [allProperties, bwActive] = await Promise.all([getPropertiesForIsr(), getActiveListings()]);
  const active = allProperties.filter((p) => p.status !== "تم البيع");
  const dataModified = maxIso(active.map((p) => p.updatedAt || p.createdAt));
  const stats = computePriceStats(allProperties.map(toPriceInput));
  const counts = {
    "new-damietta": filterByCity(active, "new-damietta").length,
    "new-mansoura": filterByCity(active, "new-mansoura").length,
  };
  // إعلانات بيت الوطن الموثّقة الحية (نفس شرط العرض في قسم إعادة البيع)؛ Date.now() هنا للمقارنة لا تاريخ محتوى
  const now = Date.now();
  const bwListings = bwActive.filter((l) => isLive(l, now)).length;
  const lede = homeLede({ n: active.length, nD: counts["new-damietta"], nM: counts["new-mansoura"], dataModified });

  // رسم الصفحة (spec-final A1.3): بلا FAQPage ولا speakable — أسئلة الرئيسية روابط لصفحاتها المالكة
  const listingsId = `${pageUrl("/")}#listings`;
  const pageGraph = graph(
    webPage({
      path: "/",
      name: TITLE,
      breadcrumb: false,
      about: ORG,
      mainEntity: active.length > 0 ? { "@id": listingsId } : undefined,
      dateModified: dataModified ? cairoIso(dataModified) : undefined,
      significantLink: [pageUrl("/prices/"), pageUrl("/beit-al-watan-for-sale/")],
    }),
    active.length > 0
      ? {
          ...itemListNode("/", active.slice(0, 20).map((p) => getPropertyUrl(p)), {
            name: "أحدث العقارات المعروضة للبيع",
            total: active.length,
          }),
          "@id": listingsId,
        }
      : null
  );

  return (
    <>
      <JsonLd graph={pageGraph} />
      <HomeClient
        initialProperties={serializeProperties(allProperties)}
        lede={lede}
        bwListings={bwListings}
        freshnessSlot={
          <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-300 mt-3" />
        }
        introSlot={<PricesNow stats={stats} counts={counts} />}
        faqSlot={<HomeFaqSection />}
      />
    </>
  );
}
