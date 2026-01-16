import Link from "next/link";
import { Home, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-500">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">الصفحة غير موجودة</h2>
          <p className="text-gray-600 mt-2">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              الرئيسية
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/properties" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              تصفح العقارات
            </Link>
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>روابط مفيدة:</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link href="/new-damietta" className="text-orange-600 hover:underline flex items-center gap-1">
              <ArrowRight className="h-4 w-4" />
              دمياط الجديدة
            </Link>
            <Link href="/new-mansoura" className="text-emerald-600 hover:underline flex items-center gap-1">
              <ArrowRight className="h-4 w-4" />
              المنصورة الجديدة
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
