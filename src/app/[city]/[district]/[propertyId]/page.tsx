import { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyPageClient from "./PropertyPageClient";
import { getPropertiesServer, getPropertyServer, serializeProperties } from "@/lib/serverProperties";
import { calculateSimilarity } from "@/lib/propertyStore";
import { getDistrictSlug, isPropertyDistrictKnown } from "@/lib/districtSlugs";
import { JsonLd } from "@/components/JsonLd";
import { propertyGraph } from "@/lib/seo/property";
import { ROBOTS_INDEX, ROBOTS_NOINDEX } from "@/lib/seo/robots";
import { SITE_NAME } from "@/lib/seo/owner-flags";
import { displayTitle } from "@/lib/format";
import { Property } from "@/lib/mockData";

// صفحات العقارات ديناميكية - تُجلب من Firestore عند كل طلب لضمان حداثة البيانات
export const dynamic = "force-dynamic";
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"];
const BASE_URL = "https://eltaiseer.com";

type Props = {
  params: { city: string; district: string; propertyId: string };
};

// getPropertyServer مُخزّن بـ cache() فيُجلب العقار مرة واحدة للطلب (layout + metadata + الصفحة).
// العقار المفقود (404) والرابط غير الأساسي (308) يعالجهما layout.tsx فوق حد loading.tsx
const getProperty = async (id: string): Promise<Property | null> => {
  try {
    return await getPropertyServer(id);
  } catch {
    return null;
  }
};

function formatPrice(price: number): string {
  if (price >= 1000000) {
    const m = price / 1000000;
    return m === Math.floor(m) ? `${m} مليون جنيه` : `${m.toFixed(1)} مليون جنيه`;
  }
  return `${price.toLocaleString("ar-EG")} جنيه`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, propertyId } = params;

  if (!VALID_CITIES.includes(city)) {
    return { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };
  }

  const property = await getProperty(propertyId);

  if (!property) {
    return {
      title: "العقار غير موجود",
      robots: { index: false, follow: true },
    };
  }

  const cityName = property.location.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
  // حي فارغ: لا جملة حي في العنوان والوصف (كانت «… 3 غرف نوم  - …» و«للبيع في  بدمياط الجديدة»)
  const districtName = (property.location.district || "").trim();
  const districtKnown = isPropertyDistrictKnown(property);
  const priceText = formatPrice(property.price);
  const bedroomsText = property.details.bedrooms > 0 ? `${property.details.bedrooms} غرف نوم` : "";
  const areaText = `${property.details.area_sqm} متر`;

  const title = [property.type, areaText, bedroomsText, districtName].filter(Boolean).join(" ") + ` - ${priceText}`;
  const where = districtName ? `في ${districtName} ب${cityName}` : `في ${cityName}`;
  const description = `${property.type} للبيع ${where}. المساحة: ${areaText}. ${bedroomsText ? bedroomsText + ". " : ""}التشطيب: ${property.details.finishing || "غير محدد"}. السعر: ${priceText}. ${property.payment?.type === "تقسيط" || property.payment?.type === "كاش أو تقسيط" ? "متاح التقسيط. " : ""}التيسير للعقارات.`;

  // الرابط الأساسي يُبنى من بيانات العقار نفسه لضمان canonical واحد صحيح دائماً
  const canonicalSlug = getDistrictSlug(property.location.district);
  const canonicalCity = property.location.cityId || "new-damietta";
  const canonicalUrl = `${BASE_URL}/${canonicalCity}/${canonicalSlug}/${property.id}/`;

  const images =
    property.images && property.images.length > 0
      ? property.images.slice(0, 4).map((img) => ({
          url: img,
          width: 1200,
          height: 630,
          alt: property.title,
        }))
      : [{ url: "/og-image.jpg", width: 1200, height: 630, alt: property.title }];

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    // صريح هنا لأن robots يُورث من layout الحي (noindex,nofollow لحي غير مُعرّف).
    // عقار بحي غير مُعرّف (unknown-district): noindex,follow وخارج sitemap.xml حتى يُصحَّح حيه
    robots: districtKnown ? ROBOTS_INDEX : ROBOTS_NOINDEX,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      locale: "ar_EG",
      siteName: SITE_NAME,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { city, district, propertyId } = params;

  if (!VALID_CITIES.includes(city)) {
    notFound();
  }

  const property = await getProperty(propertyId);

  // رسم العقار (#webpage + #property + #offer) داخل كيان الحي المعرّف في layout الحي
  let pageGraph: object | null = null;
  if (property) {
    const cityId = property.location.cityId || "new-damietta";
    const districtSlug = getDistrictSlug(property.location.district);
    const districtName = (property.location.district || "").trim();
    const cityName = cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
    const title = displayTitle(property.title);
    pageGraph = propertyGraph({
      id: property.id,
      title,
      // وصف وقائعي مولَّد (لا نص البائع الحر في JSON-LD): النوع والحي والمساحة والسعر؛ بلا جملة حي إن كان فارغًا
      description: `${property.type} للبيع في ${districtName ? `${districtName}، ` : ""}${cityName}: ${property.details.area_sqm.toLocaleString(
        "en-US"
      )} م²، السعر ${property.price.toLocaleString("en-US")} جنيه.`,
      type: property.type,
      cityId,
      cityName,
      district: districtName,
      districtSlug,
      districtKnown: isPropertyDistrictKnown(property),
      area: property.details.area_sqm,
      bedrooms: property.details.bedrooms,
      bathrooms: property.details.bathrooms,
      price: property.price,
      sold: property.status === "تم البيع",
      images: (property.images || []).filter((u) => /^https?:\/\//.test(u)),
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    });
  }

  // العقارات المشابهة تُحسب وتُعرض من الخادم — روابط داخلية بين صفحات العقارات يراها الزاحف
  let relatedProperties: Property[] = [];
  if (property) {
    try {
      const all = await getPropertiesServer();
      relatedProperties = all
        .filter((p) => p.id !== property.id && p.status !== "تم البيع")
        .map((p) => ({ p, score: calculateSimilarity(property, p) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((x) => x.p);
    } catch {
      // فشل جلب المشابهة لا يمنع عرض العقار — العميل سيحاول مجدداً
    }
  }

  // تحويل createdAt إلى نص لأن Server Components لا تمرر كائنات Date للعميل
  const serializedProperty = property
    ? ({ ...(JSON.parse(JSON.stringify(property)) as Property), contact_whatsapp: "" })
    : null;

  return (
    <>
      {pageGraph && <JsonLd graph={pageGraph} />}
      <PropertyPageClient
        initialProperty={serializedProperty}
        initialRelated={serializeProperties(relatedProperties)}
        citySlug={city}
        districtSlug={district}
        districtKnown={property ? isPropertyDistrictKnown(property) : true}
        propertyId={propertyId}
      />
    </>
  );
}
