import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عيادات للبيع في دمياط الجديدة | عيادات طبية جاهزة",
  description: "عيادات طبية للبيع في دمياط الجديدة. عيادات جاهزة بتراخيص في مجمعات طبية. مساحات مناسبة لجميع التخصصات الطبية.",
  keywords: [
    "عيادات للبيع في دمياط الجديدة",
    "عيادة طبية دمياط",
    "مجمع طبي دمياط الجديدة",
    "عيادة أسنان للبيع",
    "عقارات طبية دمياط",
  ],
  openGraph: {
    title: "عيادات للبيع في دمياط الجديدة",
    description: "عيادات طبية جاهزة بتراخيص ومواقع مميزة",
    url: "https://eltaiseer.com/properties/clinics",
  },
  alternates: { canonical: "https://eltaiseer.com/properties/clinics" },
};

export default function ClinicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
