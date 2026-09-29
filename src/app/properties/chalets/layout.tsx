import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شاليهات للبيع في دمياط الجديدة والمنصورة الجديدة | شاليهات على البحر",
  description: "شاليهات للبيع على البحر في دمياط الجديدة والمنصورة الجديدة، بأسعارها الفعلية كما يعرضها البائعون.",
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
