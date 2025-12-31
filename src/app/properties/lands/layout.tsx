import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أراضي للبيع في دمياط الجديدة | أراضي سكنية وتجارية",
  description: "أفضل الأراضي للبيع في دمياط الجديدة 2025. أراضي سكنية وتجارية بمواقع مميزة. مساحات من 150 إلى 5000 متر. أسعار تنافسية وتقسيط مريح.",
  keywords: [
    "أراضي للبيع في دمياط الجديدة",
    "أرض سكنية دمياط",
    "أرض تجارية دمياط الجديدة",
    "قطعة أرض للبيع دمياط",
    "أسعار الأراضي في دمياط الجديدة",
  ],
  openGraph: {
    title: "أراضي للبيع في دمياط الجديدة | التيسير للعقارات",
    description: "أفضل الأراضي للبيع - أراضي سكنية وتجارية بمواقع مميزة",
    url: "https://eltaiseer.com/properties/lands",
  },
  alternates: { canonical: "https://eltaiseer.com/properties/lands" },
};

export default function LandsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
