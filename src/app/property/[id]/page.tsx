import { Metadata } from "next";
import PropertyDetailClient from "./PropertyDetailClient";

// صفحات العقارات ديناميكية بالكامل - يتم جلبها من Firebase
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata(): Promise<Metadata> {
  // Metadata ديناميكية - يتم تحديثها من client side
  return {
    title: `عقار للبيع | التيسير للعقارات`,
    description: "عقار للبيع في دمياط الجديدة والمنصورة الجديدة. تصفح أفضل العقارات من شقق وفيلات وأراضي ومحلات تجارية. التيسير للعقارات.",
    keywords: ["عقارات دمياط الجديدة", "عقارات المنصورة الجديدة", "شقق للبيع", "فيلات للبيع"],
  };
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
