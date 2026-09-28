import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لموقع التيسير للعقارات: كيف نجمع بياناتك ونستخدمها ونحميها، ومنها بيانات إعلانات بيع وشراء أراضي بيت الوطن ومستندات التحقق.",
  alternates: {
    canonical: "https://eltaiseer.com/privacy/",
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

            <section className="mb-8" id="beit-al-watan-resale">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. بيانات إعلانات بيع وشراء أراضي «بيت الوطن»</h2>
              <p>عند طلب بيع قطعة «بيت الوطن» أو تسجيل طلب شراء أو الاستفسار عن إعلان، نتعامل مع بياناتك كالتالي:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>
                  <strong>ما نجمعه من البائع:</strong> الاسم ورقم الهاتف، وبيانات القطعة (المدينة والمنطقة ورقم القطعة والمساحة)، والسعر المطلوب،
                  والمستندات التي نطلبها للتحقق من التخصيص أو التعاقد والهوية أو التوكيل.
                </li>
                <li>
                  <strong>لماذا:</strong> لمراجعة الإعلان والتحقق منه ضد النصب (ومنه مطابقة القطعة مع سجل الرصد في منصة «التيسير — الحجز
                  الذكي» إن كانت من طرح نرصده)، ولعرض ما يتوفر من بيانات حية عامة مع الإعلان (السعر الرسمي والمتاح في مدينتها وطلب منطقتها)،
                  وللتواصل معك بشأن الإعلان وطلبات المشترين.
                </li>
                <li>
                  <strong>ما يُنشر للعامة:</strong> المدينة والمنطقة والمساحة والميزات والمرحلة ووضع القطعة، وصور المعاينة، ونبذة عنها، والسعر
                  المطلوب، وكارت التكلفة (السعر الرسمي والمسدد والأقساط المتبقية، مقرّبة للقطع المطابَقة مع الرصد)، وتاريخ التوثيق وبنوده،
                  والبيانات الحية العامة. لا ننشر رقم القطعة
                  ولا اسمك ولا رقم هاتفك؛ وتصلك طلبات المشترين عن طريقنا. ويُكشف رقم القطعة للمشتري الجاد بعد التحقق من هويته فقط.
                </li>
                <li>
                  <strong>مستندات التحقق لا تُنشر أبدًا:</strong> تُحفظ بوصول محدود للمراجعين المصرح لهم، وتُستخدم للتحقق فقط، وتُحذف خلال 90 يومًا
                  من انتهاء الإعلان أو سحبه، ما لم يُلزمنا القانون بغير ذلك.
                </li>
                <li>
                  <strong>بيانات المشتري:</strong> اسمك ورقمك والمدينة والميزانية في طلب الشراء أو الاستفسار نستخدمها للتواصل معك بشأن الإعلانات الموثّقة
                  المطابقة لطلبك فقط، ولا نشاركها مع البائع إلا بموافقتك عند ترتيب المعاينة أو التوقيع. ويبقى طلبك قائمًا حتى تسحبه أو لمدة 12 شهرًا بحد أقصى.
                </li>
                <li>
                  <strong>لا بيع ولا مشاركة:</strong> لا نبيع هذه البيانات لأي طرف، ولا نشاركها إلا بموافقتك أو لامتثال قانوني. ولا نستلم أي مبالغ
                  بين البائع والمشتري، فلا نطلب ولا نحفظ بيانات بطاقات أو حسابات بنكية لإتمام البيع.
                </li>
                <li>
                  <strong>التحكم:</strong> يمكنك تعديل إعلانك أو طلبك أو سحبه وطلب حذف بياناته في أي وقت عبر التواصل معنا.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. حقوقك</h2>
              <p>لديك الحق في:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>الوصول إلى بياناتك الشخصية</li>
                <li>تصحيح البيانات غير الدقيقة</li>
                <li>طلب حذف بياناتك</li>
                <li>الاعتراض على معالجة بياناتك</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. التواصل</h2>
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
