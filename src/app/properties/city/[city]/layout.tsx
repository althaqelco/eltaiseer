import { Metadata } from "next";

// مسار قديم مكرر — النسخة الأساسية هي /{city} والـ canonical يشير إليها
export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const isNM = params.city === "new-mansoura";
  const cityName = isNM ? "المنصورة الجديدة" : "دمياط الجديدة";
  const citySlug = isNM ? "new-mansoura" : "new-damietta";

  return {
    title: `عقارات ${cityName} | شقق وفيلات وأراضي للبيع`,
    description: `تصفح جميع العقارات المتاحة للبيع في ${cityName}. شقق، فيلات، دوبلكس، محلات تجارية، أراضي بأسعار تنافسية وخيارات تقسيط مريحة.`,
    alternates: {
      canonical: `https://eltaiseer.com/${citySlug}/`,
    },
  };
}

export default function CityPropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
