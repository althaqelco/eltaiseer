import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROBOTS_INDEX } from "@/lib/seo/robots";
import { SITE_NAME } from "@/lib/seo/owner-flags";

type Props = {
  params: Promise<{ city: string }>;
  children: React.ReactNode;
};

const cityMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  "new-damietta": {
    title: "عقارات دمياط الجديدة للبيع | شقق وفيلات وأراضي 2026",
    description: "شقق وفيلات وأراضٍ للبيع في أحياء دمياط الجديدة: الحي الأول إلى السادس، وجنة ودار مصر وسكن مصر وبيت الوطن، بأسعارها الفعلية وروابط لوسيط سعر المتر لكل حي.",
    keywords: [
      "عقارات دمياط الجديدة",
      "شقق للبيع في دمياط الجديدة",
      "فيلات دمياط الجديدة",
      "أراضي للبيع دمياط الجديدة",
      "شقق الحي الأول دمياط الجديدة",
      "شقق الحي الثاني دمياط الجديدة",
      "شقق الحي الثالث دمياط الجديدة",
      "مشروع جنة دمياط الجديدة",
      "دار مصر دمياط الجديدة",
      "سكن مصر دمياط الجديدة",
      "بيت الوطن دمياط الجديدة",
      "أسعار الشقق دمياط الجديدة 2026",
      "شقق بالتقسيط دمياط الجديدة",
      "عقارات للبيع دمياط",
      "apartments for sale new damietta",
      "real estate new damietta egypt",
    ],
  },
  "new-mansoura": {
    title: "عقارات المنصورة الجديدة للبيع | شقق وفيلات 2026",
    description: "شقق وفيلات للبيع في المنصورة الجديدة: R1 حتى R7 وحي الفيلات وداون تاون وسكن لكل المصريين، بأسعارها الفعلية في مدينة الجيل الرابع على البحر المتوسط.",
    keywords: [
      "عقارات المنصورة الجديدة",
      "شقق للبيع في المنصورة الجديدة",
      "فيلات المنصورة الجديدة",
      "أراضي للبيع المنصورة الجديدة",
      "شقق R1 المنصورة الجديدة",
      "شقق R2 المنصورة الجديدة",
      "شقق R3 المنصورة الجديدة",
      "حي الفيلات المنصورة الجديدة",
      "داون تاون المنصورة الجديدة",
      "سكن لكل المصريين المنصورة الجديدة",
      "دار مصر المنصورة الجديدة",
      "جنة المنصورة الجديدة",
      "أسعار الشقق المنصورة الجديدة 2026",
      "apartments for sale new mansoura",
      "real estate new mansoura egypt",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;

  // مدينة غير معروفة = 404 — لا نمنحها metadata قابلة للفهرسة
  if (!cityMetadata[city]) {
    return { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };
  }

  const meta = cityMetadata[city];
  const citySlug = city === "new-mansoura" ? "new-mansoura" : "new-damietta";
  const ogImage = `/og-${citySlug}.jpg`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://eltaiseer.com/${citySlug}/`,
      type: "website",
      locale: "ar_EG",
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}/`,
    },
    robots: ROBOTS_INDEX,
  };
}

export default async function CityLayout({ children, params }: { children: React.ReactNode; params: Promise<{ city: string }> }) {
  const { city } = await params;

  // [city] يلتقط أي مسار من مقطع واحد (/does-not-exist/) — الرفض هنا فوق loading.tsx صفحة العقار
  // فيخرج 404 حقيقي لكل ما تحت مدينة غير معروفة، بما فيه /x/y/id
  if (!cityMetadata[city]) notFound();

  // كيان المدينة معرّف مرة واحدة في رسم الموقع (app/layout.tsx، #city-{slug})، وصفحة المدينة تشير إليه
  return (
    <>{children}</>
  );
}
