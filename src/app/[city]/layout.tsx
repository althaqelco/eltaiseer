import { Metadata } from "next";

type Props = {
  params: Promise<{ city: string }>;
  children: React.ReactNode;
};

const cityMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  "new-damietta": {
    title: "عقارات دمياط الجديدة للبيع | شقق وفيلات وأراضي 2026",
    description: "أفضل عقارات دمياط الجديدة للبيع 2026. شقق تمليك، فيلات، دوبلكس، أراضي، محلات تجارية في جميع الأحياء. الحي الأول، الثاني، الثالث، مشروع جنة، دار مصر، سكن مصر. أسعار تبدأ من 500,000 جنيه. التيسير للعقارات.",
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
    description: "أفضل عقارات المنصورة الجديدة للبيع 2026. شقق في R1-R7، فيلات، داون تاون، سكن لكل المصريين، دار مصر، جنة. مدينة الجيل الرابع بتخطيط عالمي. أسعار استثمارية مميزة. التيسير للعقارات.",
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
      "الاستثمار في المنصورة الجديدة",
      "apartments for sale new mansoura",
      "real estate new mansoura egypt",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const meta = cityMetadata[city] || cityMetadata["new-damietta"];
  const citySlug = city === "new-mansoura" ? "new-mansoura" : "new-damietta";
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://eltaiseer.com/${citySlug}`,
      type: "website",
      locale: "ar_EG",
      siteName: "التيسير للعقارات",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
