import { Metadata } from "next";
import { pageOpenGraph } from "@/lib/seo/og";

// صفحة شخصية تعتمد على localStorage — لا قيمة لفهرستها
const TITLE = "المفضلة";
const DESCRIPTION = "قائمة العقارات المفضلة لديك في التيسير للعقارات.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: pageOpenGraph({ path: "/favorites/", title: TITLE, description: DESCRIPTION }),
  robots: { index: false, follow: true },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
