import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PropertyPageClient from "./PropertyPageClient";
import { getPropertyFromFirestore } from "@/lib/firestoreProperties";
import { generatePropertySchema } from "@/lib/seoOptimizer";
import { SLUG_TO_DISTRICT, getDistrictSlug } from "@/lib/districtSlugs";
import { Property } from "@/lib/mockData";

// صفحات العقارات ديناميكية - تُجلب من Firestore عند كل طلب لضمان حداثة البيانات
export const dynamic = "force-dynamic";
export const dynamicParams = true;

const VALID_CITIES = ["new-damietta", "new-mansoura"];
const BASE_URL = "https://eltaiseer.com";

type Props = {
  params: { city: string; district: string; propertyId: string };
};

// cache() يمنع جلب العقار مرتين (مرة للـ metadata ومرة للصفحة) في نفس الطلب
const getProperty = cache(async (id: string): Promise<Property | null> => {
  try {
    return await getPropertyFromFirestore(id);
  } catch {
    return null;
  }
});

function formatPrice(price: number): string {
  if (price >= 1000000) {
    const m = price / 1000000;
    return m === Math.floor(m) ? `${m} مليون جنيه` : `${m.toFixed(1)} مليون جنيه`;
  }
  return `${price.toLocaleString("ar-EG")} جنيه`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district, propertyId } = params;

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
  const districtName = property.location.district || SLUG_TO_DISTRICT[district] || "";
  const priceText = formatPrice(property.price);
  const bedroomsText = property.details.bedrooms > 0 ? `${property.details.bedrooms} غرف نوم` : "";
  const areaText = `${property.details.area_sqm} متر`;

  const title = `${property.type} ${areaText} ${bedroomsText ? bedroomsText + " " : ""}${districtName} - ${priceText}`;
  const description = `${property.type} للبيع في ${districtName} ب${cityName}. المساحة: ${areaText}. ${bedroomsText ? bedroomsText + ". " : ""}التشطيب: ${property.details.finishing || "غير محدد"}. السعر: ${priceText}. ${property.payment?.type === "تقسيط" || property.payment?.type === "كاش أو تقسيط" ? "متاح التقسيط. " : ""}التيسير للعقارات - شريكك الموثوق.`;

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
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      locale: "ar_EG",
      siteName: "التيسير للعقارات",
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

  const schemas: object[] = [];
  if (property) {
    schemas.push(
      generatePropertySchema({
        id: property.id,
        title: property.title,
        images: property.images || [],
        contact_whatsapp: property.contact_whatsapp,
        type: property.type,
        district: property.location.district,
        area_sqm: property.details.area_sqm,
        price: property.price,
        bedrooms: property.details.bedrooms,
        bathrooms: property.details.bathrooms,
        level: property.details.level,
        finishing: property.details.finishing,
        amenities: property.amenities || [],
        status: property.status,
        paymentType: property.payment?.type,
        description: property.description,
        cityId: property.location.cityId,
        datePosted: property.createdAt ? new Date(property.createdAt).toISOString() : undefined,
      })
    );
  }

  // تحويل createdAt إلى نص لأن Server Components لا تمرر كائنات Date للعميل
  const serializedProperty = property
    ? ({ ...(JSON.parse(JSON.stringify(property)) as Property), contact_whatsapp: "" })
    : null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PropertyPageClient
        initialProperty={serializedProperty}
        citySlug={city}
        districtSlug={district}
        propertyId={propertyId}
      />
    </>
  );
}
