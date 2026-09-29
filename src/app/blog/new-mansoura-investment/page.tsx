import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema, PostDates } from "@/components/ArticleSchema";

// نفس الرابط، ومحتوى جديد محايد (spec-final A0.1 / OWNER D12 default): المقال القديم وعد بعوائد ونمو سعري
// بلا مصدر. هنا دليل المشتري: الأحياء، والتسليم، وما يُسأل عنه. أسئلة الموقع والمحافظة والمسافة
// مالكها /new-mansoura/ (faq-owners.json)، فهنا جملة ورابط فقط.
const PATH = "/blog/new-mansoura-investment/";
const TITLE = "دليل المشتري في المنصورة الجديدة: الأحياء والتسليم وما تسأل عنه";
const DESCRIPTION = "دليل المنصورة الجديدة للمشتري: الأحياء، والتسليم، وما تسأل عنه قبل الشراء.";
const IMAGE = "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "شراء شقة المنصورة الجديدة",
    "أحياء المنصورة الجديدة",
    "تسليم شقق المنصورة الجديدة",
    "عقارات المنصورة الجديدة",
    "أسعار المنصورة الجديدة",
  ],
  openGraph: {
    url: "https://eltaiseer.com/blog/new-mansoura-investment/",
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    publishedTime: "2026-01-17",
    modifiedTime: "2026-09-29",
    images: [{ url: IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/new-mansoura-investment/",
  },
};

const AREAS: { label: string; links: [string, string][] }[] = [
  { label: "الأحياء السكنية المرقّمة", links: [["R1", "r1"], ["R2", "r2"], ["R3", "r3"], ["R4", "r4"], ["R5", "r5"]] },
  {
    label: "مشروعات الإسكان",
    links: [["سكن لكل المصريين", "sakan-kol-misryeen"], ["دار مصر", "dar-misr"], ["جنة", "janna"], ["الإسكان المتوسط", "medium-housing"]],
  },
  { label: "الفيلات", links: [["حي الفيلات", "villas-district"], ["فيلات الجولف", "golf-villas"], ["فيلات البحيرات", "lake-villas"]] },
  { label: "التجاري والأعمال", links: [["داون تاون", "downtown"], ["المحور التجاري", "commercial-axis"], ["منطقة الأعمال المركزية", "cbd"]] },
  { label: "على البحر", links: [["الواجهة البحرية", "waterfront"], ["الكورنيش", "corniche"], ["الشاطئ", "beach"]] },
];

const QUESTIONS = [
  "هل العقد باسم البائع، أم تنازل من مالك سابق؟ اطلب تسلسل العقود كاملًا.",
  "كم سدد البائع وكم المتبقي من الأقساط، ومن يتحمل المتبقي بعد البيع؟",
  "هل التنازل يحتاج موافقة جهة المشروع أو جهاز المدينة، وكم رسومه؟ اطلبها مكتوبة.",
  "ما موعد التسليم المكتوب في العقد، وما حالة المياه والكهرباء والطرق في الحي؟",
  "هل الوحدة مطابقة للمخطط وللمساحة في العقد، وما مستوى التشطيب عند الاستلام؟",
];

export default function NewMansouraInvestmentArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title={TITLE}
        description={DESCRIPTION}
        url={`https://eltaiseer.com${PATH}`}
        image={IMAGE}
        datePublished="2026-01-17"
        cities={["new-mansoura"]}
      />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/blog" className="hover:text-emerald-600">المدونة</Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-emerald-600 font-medium">دليل المشتري في المنصورة الجديدة</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">المنصورة الجديدة</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <PostDates path={PATH} className="" />
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                6 دقائق قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">{TITLE}</h1>
            <p className="answer-lede text-xl text-gray-600 leading-relaxed">
              المنصورة الجديدة مدينة من مدن الجيل الرابع على ساحل البحر المتوسط تتبع محافظة الدقهلية، وما زالت
              أحياؤها تُستكمل على مراحل. قبل الشراء فيها اعرف الحي ونوع المشروع، وموعد التسليم المكتوب، وحالة
              المرافق، وقارن سعر المتر بوسيط العروض الحالية. هذا الدليل يرتب هذه الأسئلة.
            </p>
          </header>

          <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden mb-10">
            <Image src={IMAGE} alt="دليل المشتري في المنصورة الجديدة" fill className="object-cover" priority />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              الموقع والمحافظة والمسافة من المنصورة بمصادرها في{" "}
              <Link href="/new-mansoura/" className="text-emerald-600 hover:underline font-semibold">صفحة عقارات المنصورة الجديدة</Link>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">أحياء المنصورة الجديدة</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              لكل منطقة صفحة بعروضها الحالية على التيسير. وللمقارنة بين طبيعة كل منطقة ولمن تناسب:{" "}
              <Link href="/blog/new-mansoura-districts/" className="text-emerald-600 hover:underline font-semibold">
                أفضل مناطق السكن في المنصورة الجديدة
              </Link>
              .
            </p>
            <ul className="space-y-3 text-gray-700 mb-6 list-none pr-0">
              {AREAS.map((a) => (
                <li key={a.label}>
                  <strong>{a.label}:</strong>{" "}
                  {a.links.map(([label, slug], i) => (
                    <span key={slug}>
                      {i > 0 && "، "}
                      <Link href={`/new-mansoura/${slug}/`} className="text-emerald-600 hover:underline">
                        {label}
                      </Link>
                    </span>
                  ))}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">التسليم</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              التسليم يتم على مراحل حسب كل مشروع، فراجع جهاز المدينة أو المطور لموعد وحدتك، واطلب الموعد مكتوبًا في
              العقد مع حالة المرافق في الحي وقت الاستلام.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">ما تسأل عنه قبل الشراء</h2>
            <ul className="space-y-2 text-gray-700 mb-6 list-none pr-0">
              {QUESTIONS.map((q) => (
                <li key={q} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-1 shrink-0" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              الأوراق والخطوات بالترتيب في{" "}
              <Link href="/blog/buying-steps-legal/" className="text-emerald-600 hover:underline font-semibold">
                خطوات شراء عقار: الأوراق والإجراءات
              </Link>
              .
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الأسعار</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              لا نذكر هنا أرقامًا ثابتة لأن الأسعار تتغير مع المعروض. وسيط سعر المتر لكل حي ونوع عقار، محسوبًا من
              العروض الحالية، في{" "}
              <Link href="/prices/#new-mansoura" className="text-emerald-600 hover:underline font-semibold">صفحة أسعار العقارات</Link>.
            </p>
            <p className="text-sm text-gray-500">المعلومات للاسترشاد وليست نصيحة مالية أو استثمارية.</p>
          </div>

          <div className="border-t border-b py-6 my-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">فريق التيسير التحريري</p>
              <p className="text-sm text-gray-500">التيسير للعقارات — دمياط الجديدة</p>
            </div>
          </div>

          <div className="bg-gradient-to-l from-emerald-600 to-emerald-700 rounded-2xl p-8 mt-10 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">العروض الحالية في المنصورة الجديدة</h2>
            <p className="text-emerald-100 mb-6">تصفح العقارات المعروضة الآن، أو اطلب تقييمًا مجانيًا لعقارك</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="secondary" size="lg">
                <Link href="/new-mansoura">تصفح العقارات</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/valuation">تقييم مجاني</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
