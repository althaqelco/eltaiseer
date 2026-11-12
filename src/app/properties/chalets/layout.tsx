import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شاليهات للبيع في دمياط الجديدة والمنصورة الجديدة | شاليهات على البحر",
  description: "شاليهات فاخرة للبيع في دمياط الجديدة والمنصورة الجديدة بإطلالات بحرية مباشرة. شاليهات بحمامات سباحة ومرافق متكاملة. أسعار تنافسية وتقسيط مريح.",
  keywords: [
    "شاليهات للبيع في دمياط الجديدة والمنصورة الجديدة",
    "شاليه على البحر دمياط",
    "شاليهات دمياط الجديدة",
    "شاليه بحمام سباحة",
    "شاليهات المنصورة الجديدة",
    "شاليه الواجهة البحرية المنصورة الجديدة",
  ],
  openGraph: {
    title: "شاليهات للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "شاليهات فاخرة بإطلالات بحرية مباشرة",
    url: "https://eltaiseer.com/properties/chalets/",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "التيسير للعقارات - عقارات دمياط الجديدة والمنصورة الجديدة" }],
  },
  alternates: { canonical: "https://eltaiseer.com/properties/chalets/" },
};

export default function ChaletsLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      {children}
    </>
  );
}
