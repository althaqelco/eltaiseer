import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/ArticleSchema";
import { buildFaqSchema } from "@/lib/homeFaq";

export const metadata: Metadata = {
  title: "دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة 2026",
  description:
    "مقارنة تفصيلية بين دمياط الجديدة والمنصورة الجديدة 2026: الأسعار، الأحياء، الخدمات، فرص الاستثمار، والتسليم. أيهما أفضل للسكن وأيهما أفضل للاستثمار؟ إجابة مباشرة بالأرقام.",
  keywords: [
    "الفرق بين دمياط الجديدة والمنصورة الجديدة",
    "دمياط الجديدة أم المنصورة الجديدة",
    "مقارنة دمياط الجديدة والمنصورة الجديدة",
    "أيهما أفضل للاستثمار",
    "أسعار دمياط الجديدة والمنصورة الجديدة 2026",
    "الاستثمار العقاري في المدن الجديدة",
  ],
  openGraph: {
    title: "دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة 2026",
    description: "الأسعار والخدمات وفرص الاستثمار في المدينتين — إجابة مباشرة بالأرقام",
    type: "article",
    publishedTime: "2026-08-17",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "مقارنة دمياط الجديدة والمنصورة الجديدة" }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/damietta-vs-mansoura/",
  },
};

// الأسئلة تُعرض مرئياً بالأسفل ويولَّد منها الـ schema — مصدر واحد فلا تعارض
const COMPARISON_FAQ = [
  {
    question: "أيهما أفضل للسكن الفوري: دمياط الجديدة أم المنصورة الجديدة؟",
    answer:
      "للسكن الفوري دمياط الجديدة أفضل حالياً: مدينة مكتملة البنية التحتية بمدارس وجامعات ومستشفيات ومواصلات تعمل منذ سنوات، ومعظم وحداتها جاهزة للتسليم. المنصورة الجديدة ما زالت قيد التطوير وأغلب مناطقها تُسلّم على مراحل.",
  },
  {
    question: "أيهما أفضل للاستثمار العقاري في 2026؟",
    answer:
      "المنصورة الجديدة تتقدم للاستثمار طويل المدى: مدينة جيل رابع في بداية منحنى النمو، والأسعار ترتفع مع اكتمال كل مرحلة بنية تحتية، بعوائد متوقعة 30-40% خلال 3-5 سنوات. دمياط الجديدة أنسب للاستثمار الإيجاري الفوري لوجود طلب سكني حقيقي قائم بالفعل.",
  },
  {
    question: "ما الفرق في الأسعار بين المدينتين؟",
    answer:
      "متوسط سعر متر الشقق في دمياط الجديدة بين 5,000 و20,000 جنيه، وفي المنصورة الجديدة بين 6,000 و25,000 جنيه. الشقق تبدأ من 500,000 جنيه في دمياط الجديدة ومن 600,000 جنيه في المنصورة الجديدة (سكن لكل المصريين).",
  },
];

export default function DamiettaVsMansouraArticle() {
  const faqSchema = buildFaqSchema(COMPARISON_FAQ);

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title="دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة 2026"
        description="مقارنة تفصيلية بين دمياط الجديدة والمنصورة الجديدة: الأسعار، الأحياء، الخدمات، فرص الاستثمار، والتسليم."
        url="https://eltaiseer.com/blog/damietta-vs-mansoura"
        image="https://eltaiseer.com/og-image.jpg"
        datePublished="2026-08-17"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <span className="text-orange-600 font-medium">دمياط الجديدة أم المنصورة الجديدة</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">مقارنات</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                17 أغسطس 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                8 دقائق قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-relaxed mb-4">
              دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة بالأرقام 2026
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              أكثر سؤال يصلنا من عملائنا: «أشتري في دمياط الجديدة ولا المنصورة الجديدة؟».
              الإجابة القصيرة: <strong>للسكن الفوري دمياط الجديدة، وللاستثمار طويل المدى
              المنصورة الجديدة</strong> — وإليك التفاصيل الكاملة بالأرقام لتقرر بنفسك.
            </p>
          </header>

          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm">
            {/* جدول المقارنة السريع */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المقارنة السريعة</h2>
            <div className="overflow-x-auto mb-10">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow text-sm md:text-base">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4 text-right">وجه المقارنة</th>
                    <th className="p-4 text-right text-orange-300">دمياط الجديدة</th>
                    <th className="p-4 text-right text-emerald-300">المنصورة الجديدة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">نوع المدينة</td>
                    <td className="p-4">مدينة قائمة مكتملة (منذ الثمانينات)</td>
                    <td className="p-4">جيل رابع قيد التطوير</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-semibold">سعر متر الشقق</td>
                    <td className="p-4">5,000 - 20,000 جنيه</td>
                    <td className="p-4">6,000 - 25,000 جنيه</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">أقل سعر شقة</td>
                    <td className="p-4">من 500,000 جنيه</td>
                    <td className="p-4">من 600,000 جنيه</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-semibold">الخدمات القائمة</td>
                    <td className="p-4">مدارس وجامعة ومستشفيات تعمل فعلياً</td>
                    <td className="p-4">قيد الاستكمال على مراحل</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">التسليم</td>
                    <td className="p-4">أغلب الوحدات جاهزة فوراً</td>
                    <td className="p-4">مراحل — أجزاء من R1-R3 سُلّمت</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-semibold">أفق النمو السعري</td>
                    <td className="p-4">نمو مستقر</td>
                    <td className="p-4">نمو متسارع (30-40% متوقعة في 3-5 سنوات)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">الأنسب لـ</td>
                    <td className="p-4">السكن الفوري والإيجار</td>
                    <td className="p-4">الاستثمار طويل المدى</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              متى تختار دمياط الجديدة؟
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <Link href="/new-damietta" className="text-orange-600 hover:underline font-semibold">دمياط الجديدة</Link>{" "}
              مدينة ساحلية مكتملة الأركان: 6 أحياء رئيسية بخدمات تعمل منذ سنوات، جامعة،
              مستشفيات، أسواق، وشاطئ على المتوسط. اخترها إذا كنت:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "تريد السكن فوراً دون انتظار سنوات التسليم",
                "تبحث عن مدينة بحياة يومية قائمة بالفعل (مدارس ومواصلات وأسواق)",
                "ميزانيتك تبدأ من 500,000 جنيه وتريد أوسع اختيارات جاهزة",
                "تخطط لشراء وحدة وتأجيرها فوراً — الطلب الإيجاري حقيقي وقائم",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              أفضل نقاط الدخول:{" "}
              <Link href="/new-damietta/first-district" className="text-orange-600 hover:underline">الحي الأول</Link> و
              <Link href="/new-damietta/second-district" className="text-orange-600 hover:underline"> الحي الثاني</Link>{" "}
              للخدمات المكتملة، و
              <Link href="/new-damietta/janna-project" className="text-orange-600 hover:underline">مشروع جنة</Link>{" "}
              للتشطيب الفاخر بسعر مدعوم.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              متى تختار المنصورة الجديدة؟
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <Link href="/new-mansoura" className="text-emerald-600 hover:underline font-semibold">المنصورة الجديدة</Link>{" "}
              مدينة جيل رابع على ساحل المتوسط بتخطيط عالمي وبنية ذكية. اخترها إذا كنت:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "مستثمراً يشتري في بداية منحنى النمو — الأسعار ترتفع مع اكتمال كل مرحلة",
                "تقبل الانتظار 2-4 سنوات مقابل قيمة شرائية أعلى مستقبلاً",
                "تبحث عن فيلات وتاون هاوس بتصميمات عالمية حديثة",
                "تريد وحدة مدعومة في سكن لكل المصريين من 600,000 جنيه",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              أفضل نقاط الدخول:{" "}
              <Link href="/new-mansoura/r1" className="text-emerald-600 hover:underline">R1</Link> و
              <Link href="/new-mansoura/r3" className="text-emerald-600 hover:underline"> R3</Link>{" "}
              (الأكثر تسليماً وطلباً)،{" "}
              <Link href="/new-mansoura/villas-district" className="text-emerald-600 hover:underline">حي الفيلات</Link>{" "}
              للفخامة، و
              <Link href="/new-mansoura/downtown" className="text-emerald-600 hover:underline">داون تاون</Link>{" "}
              للمحلات التجارية.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة العملية</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-10">
              <p className="text-gray-700 leading-relaxed">
                لا توجد إجابة واحدة صحيحة — يوجد هدف صحيح: <strong>حدد هل أولويتك السكن
                أم العائد</strong>. للسكن خلال أشهر: دمياط الجديدة بلا تردد. لمضاعفة رأس
                المال خلال سنوات: المنصورة الجديدة في مناطقها الأولى بالتسليم. وكثير من
                عملائنا يفعلون الاثنين: وحدة سكن جاهزة في دمياط الجديدة، ووحدة استثمار
                تحت الإنشاء في المنصورة الجديدة.
              </p>
            </div>

            {/* الأسئلة الشائعة — محتوى مرئي مطابق للـ schema */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">أسئلة شائعة</h2>
            <div className="space-y-3 mb-6">
              {COMPARISON_FAQ.map((item) => (
                <details key={item.question} className="group bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <summary className="cursor-pointer list-none font-semibold text-gray-800 flex items-center justify-between">
                    <h3 className="text-base font-semibold">{item.question}</h3>
                    <span className="text-orange-500 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center bg-gradient-to-l from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-3">جاهز تشوف المعروض فعلياً؟</h2>
            <p className="text-gray-300 mb-6">تصفح عقارات المدينتين بالأسعار الحية، أو كلمنا واتساب وسنرشح لك حسب ميزانيتك</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/new-damietta">عقارات دمياط الجديدة</Link>
              </Button>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                <Link href="/new-mansoura">عقارات المنصورة الجديدة</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900">
                <Link href="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
