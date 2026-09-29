import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema, PostDates } from "@/components/ArticleSchema";
import { FaqList } from "@/components/Answers";
import { answersFor, faqFrom } from "@/lib/answers";
import { faqNode } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة 2026",
  description:
    "مقارنة بين دمياط الجديدة والمنصورة الجديدة 2026: الخدمات، والتسليم، وحالة العمران، ولمن تناسب كل مدينة، مع رابط لأسعار العروض الحالية لكل حي.",
  keywords: [
    "الفرق بين دمياط الجديدة والمنصورة الجديدة",
    "دمياط الجديدة أم المنصورة الجديدة",
    "مقارنة دمياط الجديدة والمنصورة الجديدة",
    "أيهما أنسب للسكن",
    "أسعار دمياط الجديدة والمنصورة الجديدة 2026",
  ],
  openGraph: {
    url: "https://eltaiseer.com/blog/damietta-vs-mansoura/",
    title: "دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة 2026",
    description: "الخدمات والتسليم وحالة العمران في المدينتين — إجابة مباشرة حسب هدفك",
    type: "article",
    publishedTime: "2026-08-17",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "مقارنة دمياط الجديدة والمنصورة الجديدة" }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/damietta-vs-mansoura/",
  },
};

const PATH = "/blog/damietta-vs-mansoura/";

export default function DamiettaVsMansouraArticle() {
  // المقال يملك Q174 (faq-owners.json)؛ أسئلة الأسعار مالكها /prices/ فلا تُكرر هنا
  const faq = answersFor(PATH, {}, ["Q174"]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title="دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة 2026"
        description="مقارنة بين دمياط الجديدة والمنصورة الجديدة: الخدمات، والتسليم، وحالة العمران، ولمن تناسب كل مدينة."
        url="https://eltaiseer.com/blog/damietta-vs-mansoura/"
        image="https://eltaiseer.com/og-image.jpg"
        datePublished="2026-08-17"
        extra={[faqNode(PATH, faqFrom(faq))]}
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
                <PostDates path={PATH} className="" />
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                8 دقائق قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-relaxed mb-4">
              دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة 2026
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              أكثر سؤال يصلنا من عملائنا: «أشتري في دمياط الجديدة ولا المنصورة الجديدة؟».
              الإجابة القصيرة: <strong>للسكن الفوري دمياط الجديدة، ولمن يقبل استلامًا لاحقًا
              المنصورة الجديدة</strong> — وإليك التفاصيل لتقرر بنفسك.
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
                    <td className="p-4">مدينة قائمة أحياؤها الرئيسية مأهولة</td>
                    <td className="p-4">جيل رابع قيد التطوير</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-semibold">أسعار العروض الحالية</td>
                    <td className="p-4">
                      <Link href="/prices/#new-damietta" className="text-orange-600 hover:underline">وسيط سعر المتر لكل حي</Link>
                    </td>
                    <td className="p-4">
                      <Link href="/prices/#new-mansoura" className="text-emerald-600 hover:underline">وسيط سعر المتر لكل حي</Link>
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-semibold">الخدمات القائمة</td>
                    <td className="p-4">مدارس وجامعة ومستشفيات تعمل فعلياً</td>
                    <td className="p-4">قيد الاستكمال على مراحل</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">التسليم</td>
                    <td className="p-4">أغلب الوحدات جاهزة فوراً</td>
                    <td className="p-4">على مراحل حسب كل مشروع</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">الأنسب لـ</td>
                    <td className="p-4">السكن الفوري</td>
                    <td className="p-4">من يقبل استلامًا لاحقًا</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              متى تختار دمياط الجديدة؟
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <Link href="/new-damietta" className="text-orange-600 hover:underline font-semibold">دمياط الجديدة</Link>{" "}
              مدينة ساحلية أحياؤها الرئيسية الستة مأهولة، وفيها جامعة ومستشفيات وأسواق وشاطئ
              على المتوسط. اخترها إذا كنت:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "تريد السكن فوراً دون انتظار سنوات التسليم",
                "تبحث عن مدينة بحياة يومية قائمة بالفعل (مدارس ومواصلات وأسواق)",
                "تريد الاختيار بين وحدات جاهزة في أحياء مأهولة",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              أحياء للبدء بالمقارنة:{" "}
              <Link href="/new-damietta/first-district" className="text-orange-600 hover:underline">الحي الأول</Link> و
              <Link href="/new-damietta/second-district" className="text-orange-600 hover:underline"> الحي الثاني</Link>{" "}
              للخدمات المكتملة، و
              <Link href="/new-damietta/janna-project" className="text-orange-600 hover:underline">مشروع جنة</Link>{" "}
              للوحدات كاملة التشطيب.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              متى تختار المنصورة الجديدة؟
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <Link href="/new-mansoura" className="text-emerald-600 hover:underline font-semibold">المنصورة الجديدة</Link>{" "}
              مدينة من مدن الجيل الرابع على ساحل المتوسط، ما زالت أحياؤها تُستكمل. اخترها إذا كنت:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "تقبل استلامًا لاحقًا حسب مواعيد كل مشروع",
                "تبحث عن فيلات وتاون هاوس بتصميمات حديثة",
                "تريد وحدة في مشروع سكن لكل المصريين (الإسكان الاجتماعي)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              أحياء للبدء بالمقارنة:{" "}
              <Link href="/new-mansoura/r1" className="text-emerald-600 hover:underline">R1</Link> و
              <Link href="/new-mansoura/r3" className="text-emerald-600 hover:underline"> R3</Link>{" "}
              في النطاق السكني الأول،{" "}
              <Link href="/new-mansoura/villas-district" className="text-emerald-600 hover:underline">حي الفيلات</Link>{" "}
              للفيلات المستقلة، و
              <Link href="/new-mansoura/downtown" className="text-emerald-600 hover:underline">داون تاون</Link>{" "}
              للمحلات التجارية.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة العملية</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-10">
              <p className="text-gray-700 leading-relaxed">
                لا توجد إجابة واحدة صحيحة — يوجد هدف صحيح: <strong>حدد متى تحتاج السكن</strong>.
                للسكن خلال أشهر: دمياط الجديدة. ولمن يقبل استلامًا لاحقًا في مدينة ما زالت تُستكمل:
                المنصورة الجديدة. قارن أسعار العروض الحالية لكل حي في{" "}
                <Link href="/prices/" className="text-orange-600 hover:underline font-semibold">صفحة أسعار العقارات</Link>.
                المعلومات للاسترشاد وليست نصيحة مالية أو استثمارية.
              </p>
            </div>

            {/* السؤال الذي يملكه المقال (Q174) — نفس النص في FAQPage */}
            <FaqList items={faq} className="mt-10" />
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
