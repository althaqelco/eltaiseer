import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة ملفات تعريف الارتباط",
  description: "سياسة ملفات تعريف الارتباط (الكوكيز) الخاصة بموقع التيسير للعقارات",
  alternates: {
    canonical: "https://eltaiseer.com/cookies/",
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-orange-600 font-medium">سياسة ملفات تعريف الارتباط</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Cookie className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">سياسة ملفات تعريف الارتباط</h1>
              <p className="text-gray-300 mt-2">كيف نستخدم الكوكيز</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">ما هي ملفات تعريف الارتباط؟</h2>
              <p>
                ملفات تعريف الارتباط (الكوكيز) هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. 
                تساعدنا هذه الملفات في تحسين تجربتك وتقديم خدمة أفضل.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">أنواع الكوكيز التي نستخدمها</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🔹 كوكيز ضرورية</h3>
                <p className="text-gray-600">
                  ضرورية لعمل الموقع بشكل صحيح. تمكنك من التنقل واستخدام الميزات الأساسية.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🔹 كوكيز الأداء</h3>
                <p className="text-gray-600">
                  تجمع معلومات حول كيفية استخدام الزوار للموقع لتحسين الأداء.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🔹 كوكيز الوظائف</h3>
                <p className="text-gray-600">
                  تتذكر تفضيلاتك مثل العقارات المفضلة وإعدادات البحث.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🔹 كوكيز التحليلات</h3>
                <p className="text-gray-600">
                  تساعدنا في فهم كيفية تفاعل الزوار مع الموقع لتحسين المحتوى.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">التحكم في الكوكيز</h2>
              <p>
                يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك. 
                يمكنك اختيار حظر أو حذف الكوكيز، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li><strong>Chrome:</strong> الإعدادات &gt; الخصوصية والأمان &gt; ملفات تعريف الارتباط</li>
                <li><strong>Firefox:</strong> الخيارات &gt; الخصوصية والأمان</li>
                <li><strong>Safari:</strong> التفضيلات &gt; الخصوصية</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">التحديثات</h2>
              <p>
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
