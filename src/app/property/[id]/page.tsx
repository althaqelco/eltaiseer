import { Metadata } from "next";
import PropertyDetailClient from "./PropertyDetailClient";
import { MOCK_PROPERTIES } from "@/lib/mockData";

// Allow dynamic params for Firestore-generated IDs
export const dynamicParams = true;

export function generateStaticParams() {
  // Generate static params for mock properties
  // Dynamic Firestore properties will be handled client-side
  return MOCK_PROPERTIES.map((property) => ({
    id: property.id,
  }));
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = MOCK_PROPERTIES.find((p) => p.id === params.id);

  if (!property) {
    // Fallback for dynamically added properties - client will update this
    return {
      title: `عقار للبيع في دمياط الجديدة | التيسير للعقارات`,
      description: "عقار للبيع في دمياط الجديدة. تصفح أفضل العقارات من شقق وفيلات وأراضي ومحلات تجارية. التيسير للعقارات - شريكك الموثوق في دمياط الجديدة.",
      keywords: ["عقارات دمياط الجديدة", "شقق للبيع", "فيلات للبيع", "أراضي للبيع"],
    };
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} مليون جنيه`;
    }
    return `${price.toLocaleString("ar-EG")} جنيه`;
  };

  const title = `${property.title} | ${property.type} للبيع في ${property.location.district}`;
  const description = `${property.type} للبيع في ${property.location.district} - دمياط الجديدة. المساحة: ${property.details.area_sqm} م². السعر: ${formatPrice(property.price)}. ${property.details.bedrooms} غرف، ${property.details.bathrooms} حمام. تشطيب ${property.details.finishing}. التيسير للعقارات.`;

  return {
    title,
    description,
    keywords: [
      `${property.type} للبيع في ${property.location.district}`,
      `${property.type} دمياط الجديدة`,
      `عقارات ${property.location.district}`,
      `شقق للبيع ${property.location.district}`,
      `أسعار ${property.type} دمياط الجديدة`,
      property.title,
    ],
    openGraph: {
      title: `${property.title} - ${formatPrice(property.price)}`,
      description,
      url: `https://eltaiseer.com/property/${property.id}`,
      type: "website",
      images: property.images[0] ? [{ url: property.images[0], width: 800, height: 600, alt: property.title }] : [],
      locale: "ar_EG",
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.title} - ${formatPrice(property.price)}`,
      description: `${property.type} للبيع في ${property.location.district}. ${property.details.area_sqm} م²`,
      images: property.images[0] ? [property.images[0]] : [],
    },
    alternates: {
      canonical: `https://eltaiseer.com/property/${property.id}`,
    },
  };
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
