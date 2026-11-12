import { Metadata } from "next";

export const metadata: Metadata = {
  title: "محلات تجارية للبيع في دمياط الجديدة والمنصورة الجديدة | مقرات إدارية ومكاتب",
  description: "أفضل المحلات التجارية والمقرات الإدارية للبيع في دمياط الجديدة والمنصورة الجديدة. مواقع استراتيجية على الشوارع الرئيسية. مساحات متنوعة تناسب جميع الأنشطة.",
  keywords: [
    "محلات للبيع في دمياط الجديدة والمنصورة الجديدة",
    "محل تجاري دمياط",
    "مقر إداري دمياط الجديدة",
    "مكتب للبيع دمياط",
    "عقارات تجارية دمياط الجديدة",
    "محلات للبيع المنصورة الجديدة",
    "داون تاون المنصورة الجديدة",
    "CBD المنصورة الجديدة",
    "محلات تجارية المنصورة الجديدة",
  ],
  openGraph: {
    title: "محلات تجارية للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "محلات ومقرات إدارية بمواقع استراتيجية",
    url: "https://eltaiseer.com/properties/shops/",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة" }],
  },
  alternates: { canonical: "https://eltaiseer.com/properties/shops/" },
};

export default function ShopsLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      {children}
    </>
  );
}
