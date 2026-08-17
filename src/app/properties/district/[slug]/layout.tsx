import { Metadata } from "next";
import { getCategoryByDistrict, getCityByDistrict } from "@/lib/egyptPlaces";
import { SLUG_TO_DISTRICT } from "@/lib/districtSlugs";

// مسار قديم — النسخة الأساسية هي /{city}/{district} والـ canonical يشير إليها دائماً
export function generateStaticParams() {
  return Object.keys(SLUG_TO_DISTRICT).map((slug) => ({ slug }));
}

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const districtName = SLUG_TO_DISTRICT[params.slug];

  if (!districtName) {
    return {
      title: "المنطقة غير موجودة",
      robots: { index: false, follow: false },
    };
  }

  // تحديد المدينة الصحيحة من اسم الحي — أحياء المنصورة كانت توجه خطأً لدمياط
  const city = getCityByDistrict(districtName);
  const citySlug = city?.id || "new-damietta";
  const cityName = city?.nameAr || "دمياط الجديدة";
  const category = getCategoryByDistrict(districtName);

  const title = `عقارات ${districtName} | شقق وفيلات للبيع في ${cityName}`;
  const description = `اكتشف أفضل العقارات للبيع في ${districtName} - ${cityName}. شقق سكنية، فيلات، دوبلكس بأسعار تنافسية. تشطيبات متنوعة وخيارات تقسيط مريحة.`;

  return {
    title,
    description,
    keywords: [
      `عقارات ${districtName}`,
      `شقق للبيع ${districtName}`,
      `فيلات ${districtName}`,
      `${districtName} ${cityName}`,
      `أسعار الشقق ${districtName}`,
      category?.nameAr || `عقارات ${cityName}`,
    ],
    openGraph: {
      title: `عقارات ${districtName} للبيع | التيسير للعقارات`,
      description,
      url: `https://eltaiseer.com/${citySlug}/${params.slug}/`,
      type: "website",
      locale: "ar_EG",
    },
    twitter: {
      card: "summary_large_image",
      title: `عقارات ${districtName} للبيع`,
      description: `شقق وفيلات للبيع في ${districtName} - ${cityName}`,
    },
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}/${params.slug}/`,
    },
  };
}

export default function DistrictLayout({ children }: Props) {
  return <>{children}</>;
}
