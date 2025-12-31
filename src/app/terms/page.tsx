import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "الشروط والأحكام الخاصة باستخدام موقع التيسير للعقارات - دمياط الجديدة",
  alternates: {
    canonical: "https://eltaiseer.com/terms",
  },
};

export default function TermsPage() {
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
            <span className="text-orange-600 font-medium">الشروط والأحكام</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">الشروط والأحكام</h1>
              <p className="text-gray-300 mt-2">آخر تحديث: يناير 2025</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. مقدمة</h2>
              <p>
                مرحباً بكم في موقع التيسير للعقارات. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
                إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. الخدمات المقدمة</h2>
              <p>يقدم موقع التيسير للعقارات الخدمات التالية:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>عرض العقارات المتاحة للبيع في دمياط الجديدة</li>
                <li>تسهيل التواصل بين البائعين والمشترين</li>
                <li>توفير معلومات عن أسعار العقارات والمناطق</li>
                <li>خدمة تقييم العقارات</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. استخدام الموقع</h2>
              <p>عند استخدام الموقع، يجب عليك:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>تقديم معلومات صحيحة ودقيقة</li>
                <li>عدم استخدام الموقع لأغراض غير قانونية</li>
                <li>احترام حقوق الملكية الفكرية</li>
                <li>عدم محاولة اختراق أو إتلاف الموقع</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. المحتوى والملكية الفكرية</h2>
              <p>
                جميع المحتويات المعروضة على الموقع، بما في ذلك النصوص والصور والشعارات والتصميمات، 
                هي ملك لشركة التيسير للعقارات ومحمية بموجب قوانين حقوق الملكية الفكرية.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. إخلاء المسؤولية</h2>
              <p>
                المعلومات المقدمة على الموقع هي لأغراض إعلامية فقط. نحن نبذل قصارى جهدنا لضمان دقة المعلومات، 
                ولكننا لا نضمن اكتمالها أو دقتها بشكل كامل. يجب التحقق من جميع المعلومات قبل اتخاذ أي قرار شراء.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. تعديل الشروط</h2>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة، 
                ويعتبر استمرارك في استخدام الموقع بعد نشر التعديلات قبولاً منك لهذه التغييرات.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. التواصل</h2>
              <p>
                إذا كان لديك أي استفسارات حول هذه الشروط والأحكام، يمكنك التواصل معنا عبر:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>البريد الإلكتروني: info@eltaiseer.com</li>
                <li>الهاتف: 01000000000</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
