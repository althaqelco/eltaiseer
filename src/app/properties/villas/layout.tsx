import { Metadata } from "next";

export const metadata: Metadata = {
  title: "فيلات للبيع في دمياط الجديدة | فيلات مستقلة وتاون هاوس",
  description: "أفخم فيلات للبيع في دمياط الجديدة 2025. فيلات مستقلة بحدائق خاصة، تاون هاوس، توين هاوس. مساحات من 200 إلى 1000 متر. تشطيبات فاخرة وحمامات سباحة.",
  keywords: [
    "فيلات للبيع في دمياط الجديدة",
    "فيلا مستقلة دمياط",
    "تاون هاوس دمياط الجديدة",
    "توين هاوس للبيع",
    "فيلات فاخرة دمياط",
    "فيلا بحديقة دمياط الجديدة",
    "فيلا بمسبح خاص",
  ],
  openGraph: {
    title: "فيلات للبيع في دمياط الجديدة | التيسير للعقارات",
    description: "أفخم فيلات للبيع في دمياط الجديدة - فيلات مستقلة وتاون هاوس بتشطيبات فاخرة",
    url: "https://eltaiseer.com/properties/villas",
  },
  alternates: {
    canonical: "https://eltaiseer.com/properties/villas",
  },
};

export default function VillasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
