import { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/authContext";

// لوحة التحكم صفحات خاصة — لا تُفهرس
export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AuthProvider>
  );
}
