import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أراضي للبيع في دمياط الجديدة والمنصورة الجديدة | أراضي سكنية وتجارية",
  description: "أفضل الأراضي للبيع في دمياط الجديدة والمنصورة الجديدة 2026. أراضي سكنية وتجارية بمواقع مميزة. مساحات من 150 إلى 5000 متر. أسعار تنافسية وتقسيط مريح.",
  keywords: [
    "أراضي للبيع في دمياط الجديدة والمنصورة الجديدة",
    "أرض سكنية دمياط",
    "أرض تجارية دمياط الجديدة",
    "قطعة أرض للبيع دمياط",
    "أسعار الأراضي في دمياط الجديدة والمنصورة الجديدة",
    "أراضي للبيع المنصورة الجديدة",
    "أرض سكنية المنصورة الجديدة",
    "أسعار الأراضي المنصورة الجديدة 2026",
  ],
  openGraph: {
    title: "أراضي للبيع في دمياط الجديدة والمنصورة الجديدة | التيسير للعقارات",
    description: "أفضل الأراضي للبيع - أراضي سكنية وتجارية بمواقع مميزة",
    url: "https://eltaiseer.com/properties/lands/",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة" }],
  },
  alternates: { canonical: "https://eltaiseer.com/properties/lands/" },
};

export default function LandsLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      {children}
    </>
  );
}
