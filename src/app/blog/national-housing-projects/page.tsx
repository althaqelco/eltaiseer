import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema, PostDates } from "@/components/ArticleSchema";
import { BrandPlatformLink } from "@/lib/bw/platformLinks";

export const metadata: Metadata = {
  title: "مشاريع الإسكان القومية في دمياط الجديدة 2026 | جنة - دار مصر - سكن مصر",
  description: "مشروعات الإسكان القومي في دمياط الجديدة: جنة ودار مصر وسكن مصر. أين تجد العروض الحالية وسعر المتر، ومن أين تأتي الأسعار والشروط الرسمية ومواعيد الطرح.",
  keywords: [
    "مشروع جنة دمياط الجديدة",
    "دار مصر دمياط الجديدة",
    "سكن مصر دمياط الجديدة",
    "الإسكان القومي دمياط",
    "شقق حكومية دمياط الجديدة",
    "بيت الوطن دمياط",
  ],
  openGraph: {
    url: "https://eltaiseer.com/blog/national-housing-projects/",
    title: "مشاريع الإسكان القومية في دمياط الجديدة 2026",
    description: "مشروعات جنة ودار مصر وسكن مصر في دمياط الجديدة: العروض الحالية والمصادر الرسمية",
    type: "article",
    publishedTime: "2026-01-05",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
        width: 1200,
        height: 630,
        alt: "مشاريع الإسكان القومية في دمياط الجديدة",
      },
    ],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/national-housing-projects/",
  },
};

export default function NationalHousingArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title="مشاريع الإسكان القومية في دمياط الجديدة 2026 | جنة - دار مصر - سكن مصر"
        description="مشروعات الإسكان القومي في دمياط الجديدة: جنة ودار مصر وسكن مصر. أين تجد العروض الحالية وسعر المتر، ومن أين تأتي الأسعار والشروط الرسمية ومواعيد الطرح."
        url="https://eltaiseer.com/blog/national-housing-projects"
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
        datePublished="2026-01-05"
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
            <span className="text-orange-600 font-medium">مشاريع الإسكان القومية</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">المشاريع</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <PostDates path="/blog/national-housing-projects/" className="" />
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                5 دقائق قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              مشاريع الإسكان القومية في دمياط الجديدة: دليلك الشامل 2026
            </h1>
            <p className="answer-lede text-xl text-gray-600 leading-relaxed">
              في دمياط الجديدة ثلاثة مشروعات إسكان قومي لها صفحات عروض على التيسير: مشروع جنة، ودار مصر (موقعان)، وسكن مصر
              (جنوب الحي الأول وغرب الجامعات). الأسعار الرسمية والشروط ومواعيد الطرح تعلنها الجهة المالكة لكل مشروع في كراسة
              طرحه، أما الوحدات المعروضة على التيسير فإعادة بيع من ملاكها بسعر طلب يحدده البائع.
            </p>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
              alt="صورة توضيحية لمبانٍ سكنية"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">المشروعات الثلاثة ومناطقها</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              تظهر هذه المشروعات على التيسير كمناطق مستقلة في دمياط الجديدة، ولكل منطقة صفحة بعروضها الحالية ووسيط سعر
              المتر فيها عند وجود 3 عروض على الأقل من نفس النوع:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li><Link href="/new-damietta/janna-project/" className="text-orange-600 hover:underline font-semibold">مشروع جنة</Link></li>
              <li>
                <Link href="/new-damietta/dar-misr-1/" className="text-orange-600 hover:underline font-semibold">دار مصر - موقع 1</Link> و
                <Link href="/new-damietta/dar-misr-2/" className="text-orange-600 hover:underline font-semibold">دار مصر - موقع 2</Link>
              </li>
              <li>
                <Link href="/new-damietta/sakan-misr-south/" className="text-orange-600 hover:underline font-semibold">سكن مصر - جنوب الحي الأول</Link> و
                <Link href="/new-damietta/sakan-misr-west/" className="text-orange-600 hover:underline font-semibold">سكن مصر - غرب الجامعات</Link>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              تختلف المشروعات في مساحات الوحدات ومواصفات التشطيب ونظام السداد، وكلها تحددها كراسة طرح كل مشروع. وفي إعادة
              البيع تظهر مساحة كل وحدة وتشطيبها وطريقة الدفع التي يقبلها البائع في صفحتها.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الأسعار: الرسمية وأسعار إعادة البيع</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              لا ننشر في هذا المقال جداول أسعار ثابتة: أسعار الطرح الرسمية تتغير من طرح لآخر وتعلنها الجهة المالكة في كراسة
              الشروط، وأسعار إعادة البيع تتغير مع العروض. أسعار الوحدات المعروضة الآن محسوبة من العروض الفعلية في:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>
                <Link href="/new-damietta/dar-misr-1/" className="text-orange-600 hover:underline">كم سعر شقق دار مصر وجنة وسكن مصر في دمياط الجديدة؟</Link>
              </li>
              <li>
                <Link href="/prices/#new-damietta" className="text-orange-600 hover:underline">جدول سعر المتر لكل حي ونوع عقار في دمياط الجديدة</Link>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              هذه أسعار طلب من البائعين وليست أسعار بيع منفذة.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مواعيد الطرح وشروط الحجز</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              مواعيد طرح وحدات الإسكان القومي وأراضي هيئة المجتمعات العمرانية الجديدة، وشروط التقدم ومستنداته، تعلنها وزارة
              الإسكان وهيئة المجتمعات العمرانية الجديدة في إعلان كل طرح وكراسة شروطه. لا ننشر موعدًا لطرح قادم دون إعلان
              رسمي مؤرخ. قبل التقدم لأي طرح أو الشراء من مالك:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>اقرأ كراسة شروط الطرح كاملة، وخاصة شروط الأحقية ونظام السداد وموعد التسليم</li>
              <li>في الشراء من مالك، تحقق من موقف سداد الوحدة ومن أوراقها لدى الجهة المالكة للمشروع قبل دفع أي مبلغ</li>
              <li>راجع العقد مع محامٍ متخصص في العقارات</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">بيت الوطن: للمصريين بالخارج</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              بيت الوطن برنامج تطرحه هيئة المجتمعات العمرانية الجديدة لبيع أراضٍ سكنية للمصريين بالخارج بالسداد
              بالدولار، والحجز فيه يتم فقط على{" "}
              <a href="https://lands.nuca.gov.eg/" rel="noopener" className="text-orange-600 hover:underline">الموقع الرسمي للحجز (هيئة المجتمعات العمرانية)</a>.
              وفي دمياط الجديدة يحمل الاسم أيضًا مناطق سكنية قائمة (بيت الوطن شرق وغرب وامتداد الشاطئ)، والعقارات
              المعروضة فيها على التيسير بيع بين أفراد. التيسير منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>
                <Link href="/new-damietta/beit-al-watan-east/" className="text-orange-600 hover:underline">عقارات بيت الوطن شرق</Link>
                {" "}و<Link href="/new-damietta/beit-al-watan-west/" className="text-orange-600 hover:underline">غرب</Link>
                {" "}و<Link href="/new-damietta/beit-al-watan-beach/" className="text-orange-600 hover:underline">امتداد الشاطئ</Link>
              </li>
              <li>
                <Link href="/beit-al-watan-for-sale/" className="text-orange-600 hover:underline">أراضي بيت الوطن للبيع (موثّقة)</Link>
              </li>
              <li>
                أداة متابعة الطرح المجانية للحاجزين: <BrandPlatformLink className="text-orange-600 hover:underline" />
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              مشروعات جنة ودار مصر وسكن مصر في دمياط الجديدة تختلف في المساحات والتشطيب ونظام السداد حسب كراسة كل طرح.
              للأسعار الحالية قارن العروض الفعلية وسعر المتر في صفحة الأسعار، وللشروط الرسمية ومواعيد الطرح ارجع إلى الجهة
              المالكة للمشروع. المعلومات هنا للاسترشاد وليست نصيحة مالية أو استثمارية.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              يمكنك تصفح <Link href="/new-damietta/" className="text-orange-600 hover:underline font-semibold">عقارات دمياط الجديدة</Link> المعروضة للبيع من ملاكها،
              أو التواصل معنا لأي سؤال.
            </p>

          </div>

          {/* Author & Share */}
          <div className="border-t border-b py-6 my-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">فريق التيسير للعقارات</p>
                <p className="text-sm text-gray-500">خبراء العقارات في دمياط الجديدة</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              مشاركة المقال
            </Button>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-8 mt-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">ابحث عن وحدتك في مشاريع الإسكان القومي</h3>
            <p className="text-orange-100 mb-6">تصفح الوحدات المتاحة للبيع من المالكين</p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/new-damietta/">تصفح العقارات</Link>
            </Button>
          </div>

        </div>
      </article>

      <Footer />
    </div>
  );
}
