import { Metadata } from "next";

// صفحة /properties هي أكثر صفحة مرتبطة داخلياً — هذا الـ layout يمنحها metadata خاصة بها
// (كانت metadata.ts ملفاً ميتاً لا يقرؤه Next.js لأن page.tsx مكوّن عميل)
export const metadata: Metadata = {
  title: "جميع العقارات للبيع في دمياط الجديدة والمنصورة الجديدة | شقق وفيلات وأراضي",
  description:
    "تصفح أكثر من 100 عقار للبيع في دمياط الجديدة والمنصورة الجديدة. شقق تمليك، فيلات مستقلة، دوبلكس، بنتهاوس، محلات تجارية، أراضي. أسعار تبدأ من 500,000 جنيه. تقسيط حتى 10 سنوات.",
  keywords: [
    "عقارات دمياط الجديدة للبيع",
    "شقق للبيع دمياط الجديدة",
    "فيلات دمياط الجديدة",
    "أراضي للبيع دمياط",
    "شقق تمليك دمياط الجديدة",
    "عقارات بالتقسيط دمياط",
    "أسعار الشقق دمياط الجديدة",
    "عقارات المنصورة الجديدة للبيع",
  ],
  openGraph: {
    title: "جميع العقارات للبيع في دمياط الجديدة والمنصورة الجديدة",
    description: "تصفح أكثر من 100 عقار للبيع - شقق، فيلات، دوبلكس، أراضي بأسعار تنافسية",
    url: "https://eltaiseer.com/properties/",
    type: "website",
  },
  alternates: {
    canonical: "https://eltaiseer.com/properties/",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
