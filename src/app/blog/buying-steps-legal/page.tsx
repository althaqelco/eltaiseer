import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, FileCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/ArticleSchema";

export const metadata: Metadata = {
  title: "خطوات شراء عقار في دمياط الجديدة والمنصورة الجديدة: الأوراق والإجراءات",
  description:
    "دليل عملي خطوة بخطوة لشراء عقار في دمياط الجديدة والمنصورة الجديدة: فحص الأوراق، العقد الابتدائي، صحة التوقيع، التسجيل في الشهر العقاري، والأخطاء الشائعة التي تكلف المشترين.",
  keywords: [
    "خطوات شراء عقار",
    "إجراءات شراء شقة",
    "أوراق شراء عقار في مصر",
    "تسجيل عقار الشهر العقاري",
    "صحة توقيع عقار",
    "العقد الابتدائي",
    "شراء شقة في دمياط الجديدة",
  ],
  openGraph: {
    title: "خطوات شراء عقار: الأوراق والإجراءات خطوة بخطوة",
    description: "من فحص الأوراق حتى التسجيل — الدليل العملي الكامل والأخطاء الشائعة",
    type: "article",
    publishedTime: "2026-08-17",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/buying-steps-legal/",
  },
};

const STEPS = [
  {
    name: "افحص أوراق الملكية قبل أي كلام في السعر",
    text: "اطلب من البائع مستند ملكيته: عقد مسجل، أو عقد ابتدائي بسلسلة ملكية واضحة، أو مستندات التخصيص إن كانت الوحدة من مشروع حكومي (جنة، دار مصر، سكن مصر). تأكد أن اسم البائع في الأوراق هو من تتعامل معه فعلاً بمطابقة بطاقة الرقم القومي.",
  },
  {
    name: "تحقق من موقف الوحدة لدى الجهة المالكة للمدينة",
    text: "في المدن الجديدة، جهاز تنمية المدينة هو المرجع: تأكد من عدم وجود مخالفات بناء أو مستحقات أقساط أرض غير مسددة على الوحدة، وأن التصرف فيها مسموح (بعض وحدات الإسكان الحكومي لها فترات حظر بيع).",
  },
  {
    name: "اتفق على السعر وطريقة الدفع كتابةً",
    text: "حدد في الاتفاق: السعر الإجمالي، المقدم، جدول الأقساط إن وجد، وموعد التسليم وحالة الوحدة عنده. لا تعتمد على أي وعد شفهي — كل ما يهمك يُكتب.",
  },
  {
    name: "وقّع عقداً ابتدائياً محكم الصياغة",
    text: "العقد الابتدائي هو أساس حقوقك: بيانات الطرفين كاملة، وصف دقيق للوحدة (الرقم، الدور، المساحة، الحدود)، الثمن وطريقة سداده، شرط جزائي واضح على الإخلال، وتوقيع البائع على كل صفحة. راجعه مع محامٍ متخصص قبل التوقيع — تكلفة المراجعة لا تُقارن بتكلفة الخطأ.",
  },
  {
    name: "ارفع دعوى صحة توقيع (الحد الأدنى من الحماية)",
    text: "صحة التوقيع تثبت أن توقيع البائع على العقد صحيح — إجراء سريع وغير مكلف يحميك من إنكار التوقيع لاحقاً. لكنه لا يثبت الملكية ذاتها، لذلك يبقى خطوة وسيطة لا نهائية.",
  },
  {
    name: "سجّل العقد في الشهر العقاري (الحماية الكاملة)",
    text: "التسجيل هو ما ينقل الملكية رسمياً باسمك ويحميك حماية كاملة في مواجهة الجميع. جهز: العقد الابتدائي وسلسلة الملكية، كشف رسمي بحدود العقار، والبطاقات. المدن الجديدة أسهل في التسجيل من المناطق القديمة لأن الأصل فيها مسجل باسم الجهاز.",
  },
  {
    name: "استلم الوحدة بمحضر مكتوب",
    text: "عند الاستلام، عاين الوحدة بنداً بنداً على حالة التشطيب المتفق عليها، ووثّق أي ملاحظات في محضر استلام موقّع من الطرفين، واستلم عدادات المرافق أو اطلب نقلها باسمك.",
  },
];

export default function BuyingStepsLegalArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title="خطوات شراء عقار في دمياط الجديدة والمنصورة الجديدة: الأوراق والإجراءات"
        description="دليل عملي خطوة بخطوة: فحص الأوراق، العقد الابتدائي، صحة التوقيع، التسجيل في الشهر العقاري، والأخطاء الشائعة."
        url="https://eltaiseer.com/blog/buying-steps-legal"
        image="https://eltaiseer.com/og-image.jpg"
        datePublished="2026-08-17"
        isHowTo
        howToSteps={STEPS.map((s) => ({ name: s.name, text: s.text }))}
      />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/blog" className="hover:text-orange-600">المدونة</Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-orange-600 font-medium">خطوات شراء عقار</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">إجراءات وقانون</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                17 أغسطس 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                10 دقائق قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-relaxed mb-4">
              خطوات شراء عقار في دمياط الجديدة والمنصورة الجديدة: الأوراق والإجراءات خطوة بخطوة
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              السعر المناسب نصف الصفقة فقط — النصف الآخر أوراق سليمة وإجراءات صحيحة.
              هذا الدليل يمشي معك من أول فحص الملكية حتى استلام الوحدة بمحضر، مع الأخطاء
              التي رأيناها تتكرر وتكلّف المشترين.
            </p>
          </header>

          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm">
            {/* Steps */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الخطوات السبع بالترتيب</h2>
            <ol className="space-y-6 mb-10">
              {STEPS.map((step, i) => (
                <li key={step.name} className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{step.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* الأخطاء الشائعة */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              أخطاء شائعة تجنبها
            </h2>
            <ul className="space-y-3 mb-10">
              {[
                "دفع مقدم قبل رؤية أوراق الملكية «لحجز السعر» — لا مقدم قبل الأوراق مهما كان الإغراء.",
                "الاكتفاء بصحة التوقيع والاطمئنان الكامل لها — هي خطوة وسيطة، والتسجيل هو الحماية الحقيقية.",
                "تجاهل مستحقات الجهاز على الوحدة — قد تكتشف أقساط أرض متأخرة تصبح عبئاً عليك.",
                "استلام وحدة دون محضر مكتوب — أي خلاف لاحق على حالة التشطيب يصبح كلاماً ضد كلام.",
                "التوقيع على عقد صيغ لصالح الطرف الآخر دون مراجعة محامٍ متخصص.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">✗</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* ميزة المدن الجديدة */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h2 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                لماذا الشراء في المدن الجديدة أأمن؟
              </h2>
              <p className="text-gray-700 leading-relaxed">
                في{" "}
                <Link href="/new-damietta" className="text-orange-600 hover:underline font-semibold">دمياط الجديدة</Link>{" "}
                و<Link href="/new-mansoura" className="text-emerald-600 hover:underline font-semibold">المنصورة الجديدة</Link>{" "}
                الأصل العقاري مسجل باسم جهاز المدينة، وسلسلة الملكية قصيرة وواضحة — عكس
                المناطق القديمة متشابكة الورثة والعقود العرفية. لذلك التسجيل أسهل والنزاعات
                أندر، خاصة في وحدات المشاريع الحكومية مثل{" "}
                <Link href="/new-damietta/janna-project" className="text-orange-600 hover:underline">جنة</Link> و
                <Link href="/new-mansoura/sakan-kol-misryeen" className="text-emerald-600 hover:underline">سكن لكل المصريين</Link>.
              </p>
            </div>

            <p className="text-sm text-gray-500 border-t pt-4">
              هذا الدليل إرشادي عام ولا يغني عن استشارة محامٍ متخصص في عقارات لمراجعة
              حالتك تحديداً — ويسعدنا ترشيح الإجراء المناسب لأي وحدة تشتريها من خلالنا.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center bg-gradient-to-l from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-3">اشترِ بأوراق مطمئنة من البداية</h2>
            <p className="text-gray-300 mb-6">
              كل عقار نعرضه نراجع موقفه وأوراقه أولاً — تصفح المعروض أو اسأل عن أي وحدة
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/properties">تصفح العقارات</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900">
                <Link href="/contact">اسأل خبيرنا</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
