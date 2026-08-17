import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة | مقدم من 10%",
  description:
    "شقق وفيلات ومحلات بالتقسيط في دمياط الجديدة والمنصورة الجديدة — مقدم يبدأ من 10% وأقساط حتى 10 سنوات. تصفح كل العقارات المتاحة بالتقسيط بأسعارها ومقدماتها الفعلية.",
  keywords: [
    "شقق بالتقسيط دمياط الجديدة",
    "شقق بالتقسيط المنصورة الجديدة",
    "عقارات بالتقسيط",
    "شقق بمقدم بسيط",
    "تقسيط بدون بنك",
    "شقق تقسيط 10 سنوات",
  ],
  openGraph: {
    title: "عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة",
    description: "مقدم من 10% وأقساط حتى 10 سنوات — كل العقارات المتاحة بالتقسيط بأرقامها الفعلية",
    url: "https://eltaiseer.com/properties/installments/",
    type: "website",
    locale: "ar_EG",
    siteName: "التيسير للعقارات",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/properties/installments/",
  },
};

export default function InstallmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
