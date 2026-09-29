import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema, PostDates } from "@/components/ArticleSchema";

// نفس الرابط، ومحتوى جديد محايد (spec-final A0.1 / OWNER D12 default): المقال القديم بُني على نسب عائد
// ونمو سعري بلا مصدر. هنا طريقة تقييم العقار فقط، وسعر المتر يُقارن بوسيط الحي المحسوب في /prices/.
const PATH = "/blog/investment-guide/";
const TITLE = "كيف تقيّم عقارًا قبل الشراء في دمياط الجديدة";
const DESCRIPTION =
  "طريقة عملية لتقييم عقار في دمياط الجديدة قبل الشراء: الموقع داخل الحي، والمبنى والتشطيب، وسعر المتر مقارنة بوسيط الحي في العروض الحالية، وسلامة الأوراق.";
const IMAGE = "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "تقييم عقار دمياط الجديدة",
    "سعر المتر دمياط الجديدة",
    "شراء شقة دمياط الجديدة",
    "فحص أوراق العقار",
    "معاينة شقة قبل الشراء",
  ],
  openGraph: {
    url: "https://eltaiseer.com/blog/investment-guide/",
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    publishedTime: "2026-01-01",
    modifiedTime: "2026-09-29",
    images: [{ url: IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/investment-guide/",
  },
};

const STEPS = [
  {
    title: "1. الموقع داخل الحي",
    items: [
      "القرب من المدارس والمستشفيات والمواصلات التي تحتاجها يوميًا.",
      "الشارع: رئيسي أم جانبي، ومستوى الضوضاء والحركة.",
      "الاتجاه والإطلالة ودخول الشمس والتهوية.",
      "اكتمال الخدمات في الحي: الأحياء الأحدث خدماتها أقل اكتمالًا من الأحياء الأولى.",
    ],
  },
  {
    title: "2. المبنى والتشطيب والدور",
    items: [
      "عمر المبنى وحالة الواجهة والسلم والمصعد والعزل.",
      "مستوى التشطيب الفعلي مقارنة بالمكتوب في الإعلان.",
      "الدور ووجود مصعد يعمل، وهل الوحدة على الشارع أم في الخلف.",
      "المساحة الفعلية مقارنة بالمساحة المكتوبة في العقد.",
    ],
  },
];

export default function InvestmentGuideArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title={TITLE}
        description={DESCRIPTION}
        url={`https://eltaiseer.com${PATH}`}
        image={IMAGE}
        datePublished="2026-01-01"
        cities={["new-damietta"]}
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
            <span className="text-orange-600 font-medium">تقييم العقار قبل الشراء</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">نصائح الشراء</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <PostDates path={PATH} className="" />
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                7 دقائق قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              كيف تقيّم عقارًا قبل الشراء في دمياط الجديدة؟
            </h1>
            <p className="answer-lede text-xl text-gray-600 leading-relaxed">
              قيّم أي عقار في دمياط الجديدة قبل الشراء بأربع خطوات: الموقع داخل الحي وخدماته، وحالة المبنى
              والتشطيب والدور، وسعر المتر مقارنة بوسيط الحي في العروض الحالية، ثم سلامة الأوراق. هذا الدليل
              يشرح كل خطوة، ولا يغني عن معاينة العقار ومراجعة محامٍ قبل التوقيع.
            </p>
          </header>

          <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden mb-10">
            <Image src={IMAGE} alt="تقييم عقار قبل الشراء في دمياط الجديدة" fill className="object-cover" priority />
          </div>

          <div className="prose prose-lg max-w-none">
            {STEPS.map((step) => (
              <section key={step.title}>
                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{step.title}</h2>
                <ul className="space-y-2 text-gray-700 mb-6 list-none pr-0">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-gray-700 leading-relaxed mb-6">
              صفحات الأحياء تعرض العروض الحالية في كل حي، مثل{" "}
              <Link href="/new-damietta/first-district/" className="text-orange-600 hover:underline">الحي الأول</Link> و
              <Link href="/new-damietta/fifth-district/" className="text-orange-600 hover:underline"> الحي الخامس</Link>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. سعر المتر مقارنة بوسيط الحي</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              احسب سعر المتر = السعر ÷ المساحة، ثم قارنه بوسيط سعر المتر لنفس نوع العقار في نفس الحي في{" "}
              <Link href="/prices/" className="text-orange-600 hover:underline font-semibold">صفحة أسعار العقارات</Link>،
              وهو وسيط محسوب من العروض الحالية على الموقع. واسأل البائع عن سبب أي فرق كبير: الدور، أو التشطيب، أو
              الإطلالة، أو المساحة.
            </p>
            <div className="bg-gray-100 rounded-xl p-6 mb-6 text-sm">
              <p className="font-semibold mb-2">مثال حسابي افتراضي:</p>
              <p>شقة 120 م² معروضة بسعر 1,800,000 جنيه.</p>
              <p>سعر المتر = 1,800,000 ÷ 120 = 15,000 جنيه.</p>
              <p>قارنه بوسيط سعر متر الشقق في نفس الحي قبل التفاوض.</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              الأسعار المعروضة على المواقع أسعار طلب يحددها البائعون، وليست أسعار بيع منفذة.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. الأوراق قبل أي دفع</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              تحقق من تسلسل الملكية، وخلو العقار من المخالفات والمديونيات، وعدم وجود توكيل سابق لغيرك، ولا تدفع
              عربونًا قبل مراجعة الأوراق. الخطوات بالترتيب في{" "}
              <Link href="/blog/buying-steps-legal/" className="text-orange-600 hover:underline font-semibold">
                خطوات شراء عقار: الأوراق والإجراءات
              </Link>
              .
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">أخطاء شائعة</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>الشراء قبل المقارنة:</strong> قارن السعر بوسيط الحي وعاين أكثر من عقار.</li>
              <li><strong>تجاهل التكاليف الإضافية:</strong> التشطيب، ورسوم التسجيل، والصيانة.</li>
              <li><strong>الاستدانة المفرطة:</strong> لا تلتزم بأقساط أكبر من قدرتك على السداد.</li>
              <li><strong>التسرع:</strong> خذ وقتك في المعاينة ومراجعة الأوراق.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">تقييم مجاني لعقارك</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              إن كنت تملك عقارًا وتريد معرفة سعره المناسب،{" "}
              <Link href="/valuation/" className="text-orange-600 hover:underline font-semibold">اطلب تقييمًا مجانيًا</Link>:
              نقارنه بوسيط سعر المتر لنفس النوع في نفس الحي من العروض الحالية، ثم نعدّل حسب الدور والتشطيب والإطلالة.
            </p>
            <p className="text-sm text-gray-500">المعلومات للاسترشاد وليست نصيحة مالية أو استثمارية.</p>
          </div>

          <div className="border-t border-b py-6 my-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">فريق التيسير التحريري</p>
              <p className="text-sm text-gray-500">التيسير للعقارات — دمياط الجديدة</p>
            </div>
          </div>

          <div className="bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-8 mt-10 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">قارن قبل أن تقرر</h2>
            <p className="text-orange-100 mb-6">تصفح العروض الحالية وأسعار كل حي</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="secondary" size="lg">
                <Link href="/properties">تصفح العقارات</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/prices/">أسعار العقارات</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
