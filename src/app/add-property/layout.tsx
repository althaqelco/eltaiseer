import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إضافة عقار",
  robots: { index: false, follow: false },
};

export default function AddPropertyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
