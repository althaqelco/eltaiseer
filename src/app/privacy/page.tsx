import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية الخاصة بموقع التيسير للعقارات - كيف نجمع ونستخدم ونحمي بياناتك",
  alternates: {
    canonical: "https://eltaiseer.com/privacy",
  },
};

export default function PrivacyPage() {
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
            <span className="text-orange-600 font-medium">سياسة الخصوصية</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">سياسة الخصوصية</h1>
              <p className="text-gray-300 mt-2">خصوصيتك تهمنا</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. المعلومات التي نجمعها</h2>
              <p>نقوم بجمع المعلومات التالية عند استخدامك للموقع:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li><strong>معلومات الاتصال:</strong> الاسم، رقم الهاتف، البريد الإلكتروني</li>
                <li><strong>معلومات التصفح:</strong> الصفحات التي تزورها، وقت الزيارة</li>
                <li><strong>معلومات الجهاز:</strong> نوع المتصفح، نظام التشغيل</li>
                <li><strong>تفضيلات العقارات:</strong> العقارات المفضلة، عمليات البحث</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. كيف نستخدم معلوماتك</h2>
              <p>نستخدم المعلومات المجمعة للأغراض التالية:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>تقديم وتحسين خدماتنا</li>
                <li>التواصل معك بشأن العقارات التي تهمك</li>
                <li>إرسال تحديثات عن العقارات الجديدة (بموافقتك)</li>
                <li>تحليل استخدام الموقع لتحسين تجربة المستخدم</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. حماية البيانات</h2>
              <p>
                نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف. 
                تشمل هذه الإجراءات:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>تشفير البيانات أثناء النقل (HTTPS)</li>
                <li>تخزين آمن للبيانات</li>
                <li>وصول محدود للموظفين المصرح لهم</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. مشاركة المعلومات</h2>
              <p>
                لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>بموافقتك الصريحة</li>
                <li>للامتثال للمتطلبات القانونية</li>
                <li>مع مقدمي الخدمات الموثوقين الذين يساعدوننا في تشغيل الموقع</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. حقوقك</h2>
              <p>لديك الحق في:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>الوصول إلى بياناتك الشخصية</li>
                <li>تصحيح البيانات غير الدقيقة</li>
                <li>طلب حذف بياناتك</li>
                <li>الاعتراض على معالجة بياناتك</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. التواصل</h2>
              <p>
                لأي استفسارات حول سياسة الخصوصية، تواصل معنا على: info@eltaiseer.com
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
