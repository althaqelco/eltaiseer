import { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo/owner-flags";

const DESCRIPTION =
  "العقارات المعروضة للبيع في دمياط الجديدة والمنصورة الجديدة: شقق تمليك وفيلات ودوبلكس وبنتهاوس ومحلات تجارية وأراضٍ، بأسعارها الفعلية كما يعرضها البائعون، مع رابط لصفحة كل عقار.";

// صفحة /properties هي أكثر صفحة مرتبطة داخلياً — هذا الـ layout يمنحها metadata خاصة بها
// (كانت metadata.ts ملفاً ميتاً لا يقرؤه Next.js لأن page.tsx مكوّن عميل)
export const metadata: Metadata = {
  title: "جميع العقارات للبيع في دمياط الجديدة والمنصورة الجديدة | شقق وفيلات وأراضي",
  // وصف وقائعي بلا أرقام ثابتة: لا حد أدنى للسعر غير محسوب، ولا مدة تقسيط ([OWNER D14])
  description: DESCRIPTION,
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
    description: "العقارات المعروضة للبيع في دمياط الجديدة والمنصورة الجديدة: شقق، فيلات، دوبلكس، أراضٍ بأسعارها الفعلية",
    url: "https://eltaiseer.com/properties/",
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    // openGraph هنا يحل محل كائن الجذر كاملًا، فبدون صورة صريحة لا يخرج og:image
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "جميع العقارات للبيع في دمياط الجديدة والمنصورة الجديدة" }],
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
