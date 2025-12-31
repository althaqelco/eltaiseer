import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شاليهات للبيع في دمياط الجديدة | شاليهات على البحر",
  description: "شاليهات فاخرة للبيع في دمياط الجديدة بإطلالات بحرية مباشرة. شاليهات بحمامات سباحة ومرافق متكاملة. أسعار تنافسية وتقسيط مريح.",
  keywords: [
    "شاليهات للبيع في دمياط الجديدة",
    "شاليه على البحر دمياط",
    "شاليهات دمياط الجديدة",
    "شاليه بحمام سباحة",
  ],
  openGraph: {
    title: "شاليهات للبيع في دمياط الجديدة",
    description: "شاليهات فاخرة بإطلالات بحرية مباشرة",
    url: "https://eltaiseer.com/properties/chalets",
  },
  alternates: { canonical: "https://eltaiseer.com/properties/chalets" },
};

export default function ChaletsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
