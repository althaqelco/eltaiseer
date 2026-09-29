import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة",
  description:
    "شقق وفيلات ومحلات بالتقسيط في دمياط الجديدة والمنصورة الجديدة، ولكل عقار مقدمه وقسطه ومدته كما حددها البائع.",
  keywords: [
    "شقق بالتقسيط دمياط الجديدة",
    "شقق بالتقسيط المنصورة الجديدة",
    "عقارات بالتقسيط",
    "شقق بمقدم بسيط",
    "تقسيط بدون بنك",
    "شقق تقسيط",
  ],
  openGraph: {
    title: "عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة",
    description: "كل العقارات المتاحة بالتقسيط بمقدمها وقسطها ومدتها كما حددها البائع",
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
