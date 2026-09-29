import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { getPropertiesForIsr, serializeProperties } from "@/lib/serverProperties";
import { getPropertyUrl } from "@/lib/districtSlugs";
import { ORG, graph, itemListNode, pageUrl, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";
import { SITE_NAME } from "@/lib/seo/owner-flags";

// ISR كل 5 دقائق — عقارات الرئيسية تظهر في HTML الخادم
export const revalidate = 300;

const TITLE = "التيسير للعقارات | شقق وفيلات وأراضي للبيع في دمياط الجديدة والمنصورة الجديدة 2026";
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
    title: "التيسير للعقارات | عقارات دمياط الجديدة والمنصورة الجديدة 2026",
    description: HOME_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default async function Home() {
  const allProperties = await getPropertiesForIsr();
  const active = allProperties.filter((p) => p.status !== "تم البيع");
  const dataModified = maxIso(active.map((p) => p.updatedAt || p.createdAt));

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
        faqSlot={
          <>
            <div className="container mx-auto px-4">
              <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-500 py-3 text-center" />
            </div>
            <HomeFaqSection />
          </>
        }
      />
    </>
  );
}
