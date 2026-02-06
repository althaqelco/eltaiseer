import { Metadata } from "next";
import PropertyDetailClient from "./PropertyDetailClient";
import { getPropertyFromFirestore } from "@/lib/firestoreProperties";

// صفحات العقارات ديناميكية بالكامل - يتم جلبها من Firebase
export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = {
  params: Promise<{ id: string }>;
};

function formatPrice(price: number): string {
  if (price >= 1000000) {
    const m = price / 1000000;
    return m === Math.floor(m) ? `${m} مليون جنيه` : `${m.toFixed(1)} مليون جنيه`;
  }
  return `${price.toLocaleString("ar-EG")} جنيه`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getPropertyFromFirestore(id);

    if (property) {
      const cityName = property.location.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
      const district = property.location.district || "";
      const priceText = formatPrice(property.price);
      const bedroomsText = property.details.bedrooms > 0 ? `${property.details.bedrooms} غرف نوم` : "";
      const areaText = `${property.details.area_sqm} متر`;

      const title = `${property.type} ${areaText} ${bedroomsText} ${district} - ${priceText} | ${cityName}`;
      const description = `${property.type} للبيع في ${district} ب${cityName}. المساحة: ${areaText}. ${bedroomsText ? bedroomsText + ". " : ""}التشطيب: ${property.details.finishing || "غير محدد"}. السعر: ${priceText}. ${property.payment.type === "تقسيط" || property.payment.type === "كاش أو تقسيط" ? "متاح التقسيط. " : ""}التيسير للعقارات - شريكك الموثوق.`;

      const images = property.images && property.images.length > 0
        ? property.images.map(img => ({
            url: img,
            width: 1200,
            height: 630,
            alt: `${property.type} للبيع في ${district} ${cityName}`,
          }))
        : [{ url: "/og-image.jpg", width: 1200, height: 630, alt: title }];

      return {
        title,
        description,
        keywords: [
          `${property.type} للبيع`,
          `${property.type} ${district}`,
          `${property.type} ${cityName}`,
          `عقارات ${district}`,
          `عقارات ${cityName}`,
          `شقق بالتقسيط ${cityName}`,
          `أسعار ${property.type} ${cityName} 2026`,
        ],
        openGraph: {
          title,
          description,
          url: `https://eltaiseer.com/property/${id}`,
          type: "website",
          locale: "ar_EG",
          siteName: "التيسير للعقارات",
          images,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: property.images && property.images.length > 0 ? [property.images[0]] : ["/og-image.jpg"],
        },
        alternates: {
          canonical: `https://eltaiseer.com/property/${id}`,
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for property:", error);
  }

  // Fallback metadata
  return {
    title: "عقار للبيع في دمياط الجديدة والمنصورة الجديدة | التيسير للعقارات",
    description: "عقار للبيع في دمياط الجديدة والمنصورة الجديدة. شقق، فيلات، دوبلكس، أراضي، محلات تجارية بأسعار تنافسية. التيسير للعقارات - شريكك الموثوق.",
    keywords: ["عقارات دمياط الجديدة", "عقارات المنصورة الجديدة", "شقق للبيع", "فيلات للبيع", "أراضي للبيع"],
    alternates: {
      canonical: `https://eltaiseer.com/property/${id}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  let productSchema = null;

  try {
    const property = await getPropertyFromFirestore(id);
    if (property) {
      const cityName = property.location.cityId === "new-mansoura" ? "المنصورة الجديدة" : "دمياط الجديدة";
      const district = property.location.district || "";
      const priceText = formatPrice(property.price);

      productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${property.type} ${property.details.area_sqm} متر ${district} - ${cityName}`,
        description: `${property.type} للبيع في ${district} ب${cityName}. المساحة: ${property.details.area_sqm} متر. السعر: ${priceText}.`,
        category: `Real Estate > ${property.type}`,
        image: property.images && property.images.length > 0 ? property.images[0] : undefined,
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "EGP",
          availability: property.status === "تم البيع" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          validFrom: "2026-01-01",
          seller: {
            "@type": "RealEstateAgent",
            "@id": "https://eltaiseer.com/#organization",
            name: "التيسير للعقارات",
          },
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "المساحة", value: `${property.details.area_sqm} متر مربع` },
          ...(property.details.bedrooms > 0 ? [{ "@type": "PropertyValue", name: "غرف النوم", value: String(property.details.bedrooms) }] : []),
          ...(property.details.bathrooms > 0 ? [{ "@type": "PropertyValue", name: "الحمامات", value: String(property.details.bathrooms) }] : []),
          ...(property.details.finishing ? [{ "@type": "PropertyValue", name: "التشطيب", value: property.details.finishing }] : []),
        ],
      };
    }
  } catch (error) {
    console.error("Error generating product schema:", error);
  }

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <PropertyDetailClient />
    </>
  );
}
