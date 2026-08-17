import { Metadata } from "next";

// صفحة شخصية تعتمد على localStorage — لا قيمة لفهرستها
export const metadata: Metadata = {
  title: "المفضلة",
  description: "قائمة العقارات المفضلة لديك في التيسير للعقارات.",
  robots: { index: false, follow: true },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
