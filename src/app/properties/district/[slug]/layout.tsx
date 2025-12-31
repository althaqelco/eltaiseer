import { Metadata } from "next";
import { getCategoryByDistrict } from "@/lib/damiettaPlaces";

// District slug to name mapping (English URLs)
const DISTRICT_SLUGS: Record<string, string> = {
  "first-district": "الحي الأول",
  "second-district": "الحي الثاني",
  "third-district": "الحي الثالث",
  "fourth-district": "الحي الرابع",
  "fifth-district": "الحي الخامس",
  "sixth-district": "الحي السادس (المتميز)",
  "janna-project": "مشروع جنة",
  "dar-misr": "دار مصر - موقع 1",
  "sakan-misr": "سكن مصر - جنوب الحي الأول",
  "beit-al-watan": "بيت الوطن - شرق",
  "central-area": "المنطقة المركزية (أ)",
  "chalets": "منطقة الشاليهات",
};

// Generate static params for all districts
export function generateStaticParams() {
  return Object.keys(DISTRICT_SLUGS).map((slug) => ({ slug }));
}

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const districtName = DISTRICT_SLUGS[params.slug] || params.slug.replace(/-/g, " ");
  const category = getCategoryByDistrict(districtName);
  
  const title = `عقارات ${districtName} | شقق وفيلات للبيع في دمياط الجديدة`;
  const description = `اكتشف أفضل العقارات للبيع في ${districtName} - دمياط الجديدة. شقق سكنية، فيلات، دوبلكس بأسعار تنافسية. تشطيبات متنوعة وخيارات تقسيط مريحة.`;

  return {
    title,
    description,
    keywords: [
      `عقارات ${districtName}`,
      `شقق للبيع ${districtName}`,
      `فيلات ${districtName}`,
      `${districtName} دمياط الجديدة`,
      `أسعار الشقق ${districtName}`,
      category?.nameAr || "عقارات دمياط الجديدة",
    ],
    openGraph: {
      title: `عقارات ${districtName} للبيع | التيسير للعقارات`,
      description,
      url: `https://eltaiseer.com/properties/district/${params.slug}`,
      type: "website",
      locale: "ar_EG",
    },
    twitter: {
      card: "summary_large_image",
      title: `عقارات ${districtName} للبيع`,
      description: `شقق وفيلات للبيع في ${districtName} - دمياط الجديدة`,
    },
    alternates: {
      canonical: `https://eltaiseer.com/properties/district/${params.slug}`,
    },
  };
}

export default function DistrictLayout({ children }: Props) {
  return <>{children}</>;
}
