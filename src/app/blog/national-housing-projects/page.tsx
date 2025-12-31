import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, Share2, Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "مشاريع الإسكان القومية في دمياط الجديدة 2025 | جنة - دار مصر - سكن مصر",
  description: "دليل شامل لمشاريع الإسكان القومية في دمياط الجديدة: مشروع جنة، دار مصر، سكن مصر. تعرف على الأسعار، المساحات، طرق الحجز، والمميزات.",
  keywords: [
    "مشروع جنة دمياط الجديدة",
    "دار مصر دمياط الجديدة",
    "سكن مصر دمياط الجديدة",
    "الإسكان القومي دمياط",
    "شقق حكومية دمياط الجديدة",
    "بيت الوطن دمياط",
  ],
  openGraph: {
    title: "مشاريع الإسكان القومية في دمياط الجديدة 2025",
    description: "كل ما تحتاج معرفته عن مشاريع جنة ودار مصر وسكن مصر",
    type: "article",
    publishedTime: "2025-01-05",
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
    canonical: "https://eltaiseer.com/blog/national-housing-projects",
  },
};

export default function NationalHousingArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
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
                5 يناير 2025
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                14 دقيقة قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              مشاريع الإسكان القومية في دمياط الجديدة: دليلك الشامل 2025
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              تعرف على جميع مشاريع الإسكان القومية في دمياط الجديدة، من مشروع جنة الفاخر إلى سكن مصر الاقتصادي. 
              مقارنة شاملة للأسعار والمميزات وطرق الحجز.
            </p>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
              alt="مشاريع الإسكان القومية في دمياط الجديدة - جنة ودار مصر وسكن مصر"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مقدمة عن مشاريع الإسكان القومية</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              تمثل مشاريع الإسكان القومية في دمياط الجديدة فرصة ذهبية للمواطنين للحصول على وحدات سكنية 
              عالية الجودة بأسعار مدعومة من الدولة. تتنوع هذه المشاريع لتناسب مختلف الشرائح الاجتماعية، 
              من الإسكان الاقتصادي إلى الإسكان الفاخر.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              في <Link href="/" className="text-orange-600 hover:underline font-semibold">التيسير للعقارات</Link>، 
              نقدم لك هذا الدليل الشامل الذي يغطي جميع مشاريع الإسكان القومية المتاحة في دمياط الجديدة، 
              مع تفاصيل دقيقة عن كل مشروع ومميزاته.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مشروع جنة: الفخامة بمعايير عالمية</h2>
            
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">نبذة سريعة عن مشروع جنة</h3>
              </div>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> تشطيب سوبر لوكس</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> مساحات من 100 إلى 180 م²</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> حدائق ومساحات خضراء</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> أمن وحراسة 24 ساعة</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              يعتبر <Link href="/properties/district/janna-project" className="text-orange-600 hover:underline font-semibold">مشروع جنة</Link> 
              من أرقى مشاريع الإسكان القومية في مصر. يتميز بتصميمه المعماري الفريد والتشطيبات الفاخرة 
              التي تنافس أفضل المشاريع الخاصة. المشروع موجه للطبقة فوق المتوسطة ويقدم مستوى معيشة راقي.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مميزات مشروع جنة</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>التصميم المعماري:</strong> تصميمات عصرية بواجهات أنيقة ومداخل فندقية</li>
              <li><strong>التشطيبات:</strong> سوبر لوكس كامل يشمل الأرضيات والحوائط والأسقف</li>
              <li><strong>المرافق:</strong> مصاعد حديثة، جراجات، مناطق تجارية، حدائق</li>
              <li><strong>الخدمات:</strong> أمن وحراسة، صيانة دورية، إدارة للمجتمع السكني</li>
              <li><strong>الموقع:</strong> مواقع متميزة بالقرب من الخدمات الرئيسية</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">أسعار مشروع جنة 2025</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              تتراوح أسعار الوحدات في مشروع جنة حسب المساحة والموقع:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>وحدات 100 متر: من 1,800,000 إلى 2,200,000 جنيه</li>
              <li>وحدات 120 متر: من 2,200,000 إلى 2,800,000 جنيه</li>
              <li>وحدات 150 متر: من 2,800,000 إلى 3,500,000 جنيه</li>
              <li>الدوبلكس والبنتهاوس: من 3,500,000 إلى 5,000,000 جنيه</li>
            </ul>

            {/* Image Break */}
            <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200"
                alt="مشروع جنة دمياط الجديدة - وحدات فاخرة"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">مشروع جنة يقدم مستوى معيشة فاخر بمعايير عالمية</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مشروع دار مصر: التوازن بين الجودة والسعر</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              يمثل <Link href="/properties/district/dar-misr" className="text-orange-600 hover:underline font-semibold">مشروع دار مصر</Link> 
              الخيار الأمثل للباحثين عن شقق بتشطيبات جيدة وأسعار معقولة. المشروع موجه للطبقة المتوسطة 
              ويقدم وحدات بمواصفات ممتازة تناسب العائلات.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مميزات مشروع دار مصر</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>التشطيب:</strong> لوكس كامل مع إمكانية الترقية لسوبر لوكس</li>
              <li><strong>المساحات:</strong> تتراوح من 100 إلى 150 متر مربع</li>
              <li><strong>التقسيم:</strong> 3 غرف نوم + 2 حمام + مطبخ + ريسبشن</li>
              <li><strong>المرافق:</strong> مصاعد، جراجات، مناطق خدمات</li>
              <li><strong>أنظمة السداد:</strong> تقسيط على 5-7 سنوات</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">أسعار دار مصر 2025</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-4 text-right">المساحة</th>
                    <th className="p-4 text-right">السعر التقريبي</th>
                    <th className="p-4 text-right">المقدم</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">100 م²</td>
                    <td className="p-4">1,200,000 - 1,500,000 ج</td>
                    <td className="p-4">15%</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4">120 م²</td>
                    <td className="p-4">1,500,000 - 1,800,000 ج</td>
                    <td className="p-4">15%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">150 م²</td>
                    <td className="p-4">1,800,000 - 2,200,000 ج</td>
                    <td className="p-4">15%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مشروع سكن مصر: الحل الاقتصادي</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              يقدم <Link href="/properties/district/sakan-misr" className="text-orange-600 hover:underline font-semibold">مشروع سكن مصر</Link> 
              وحدات سكنية بأسعار اقتصادية مناسبة للشباب والأسر محدودة الدخل. رغم الأسعار المنخفضة، 
              يحافظ المشروع على مستوى جودة مقبول في البناء والتشطيب.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مميزات سكن مصر</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>الأسعار:</strong> أقل أسعار في مشاريع الإسكان القومي</li>
              <li><strong>التقسيط:</strong> فترات سداد طويلة تصل إلى 10 سنوات</li>
              <li><strong>الدعم:</strong> مدعوم من الدولة للفئات المستحقة</li>
              <li><strong>التشطيب:</strong> نصف تشطيب مع إمكانية الإكمال حسب الميزانية</li>
              <li><strong>المساحات:</strong> تبدأ من 75 متر مربع</li>
            </ul>

            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-green-800 mb-3">💡 شروط الحصول على وحدة سكن مصر</h4>
              <ul className="list-disc list-inside space-y-2 text-green-700">
                <li>أن يكون المتقدم مصري الجنسية</li>
                <li>ألا يقل العمر عن 21 عاماً</li>
                <li>ألا يكون قد سبق تخصيص وحدة سكنية له</li>
                <li>ألا يتجاوز الدخل الشهري الحد المقرر</li>
              </ul>
            </div>

            {/* Image Break */}
            <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"
                alt="مشاريع الإسكان القومي - وحدات سكنية متنوعة"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">مشاريع الإسكان القومي توفر خيارات متنوعة لجميع الفئات</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">بيت الوطن: للمصريين بالخارج</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              يستهدف مشروع <Link href="/properties/district/beit-al-watan" className="text-orange-600 hover:underline font-semibold">بيت الوطن</Link> 
              المصريين المقيمين بالخارج، حيث يتم السداد بالدولار الأمريكي. يوفر المشروع قطع أراضي 
              ووحدات سكنية بمواقع متميزة في دمياط الجديدة.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مميزات بيت الوطن</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>السداد بالدولار يحمي من تقلبات سعر الصرف</li>
              <li>مواقع متميزة بالقرب من الشاطئ</li>
              <li>إمكانية البناء حسب التصميم المفضل</li>
              <li>فرصة استثمارية ممتازة للمغتربين</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مقارنة شاملة بين المشاريع</h2>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow text-sm">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="p-3 text-right">المشروع</th>
                    <th className="p-3 text-right">الفئة المستهدفة</th>
                    <th className="p-3 text-right">متوسط السعر</th>
                    <th className="p-3 text-right">التشطيب</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">جنة</td>
                    <td className="p-3">فوق المتوسطة</td>
                    <td className="p-3">2-4 مليون</td>
                    <td className="p-3">سوبر لوكس</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-semibold">دار مصر</td>
                    <td className="p-3">المتوسطة</td>
                    <td className="p-3">1.2-2 مليون</td>
                    <td className="p-3">لوكس</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">سكن مصر</td>
                    <td className="p-3">محدودي الدخل</td>
                    <td className="p-3">500 ألف-1 مليون</td>
                    <td className="p-3">نصف تشطيب</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-semibold">بيت الوطن</td>
                    <td className="p-3">المغتربين</td>
                    <td className="p-3">بالدولار</td>
                    <td className="p-3">حسب الاختيار</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">كيفية الحجز والتقديم</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              يمكن التقديم على مشاريع الإسكان القومية من خلال عدة طرق:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>موقع الإسكان الاجتماعي:</strong> التقديم الإلكتروني عند فتح باب الحجز</li>
              <li><strong>البنوك المعتمدة:</strong> سداد مقدم الحجز وتقديم المستندات</li>
              <li><strong>هيئة المجتمعات العمرانية:</strong> للاستفسارات والمتابعة</li>
              <li><strong>وسطاء معتمدون:</strong> للوحدات المعاد بيعها من المالكين</li>
            </ol>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">المستندات المطلوبة</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>صورة بطاقة الرقم القومي</li>
              <li>شهادة الدخل من جهة العمل</li>
              <li>إيصال مرافق حديث</li>
              <li>صور شخصية</li>
              <li>إقرار بعدم امتلاك وحدة سكنية</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">نصائح هامة قبل الحجز</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>زيارة الموقع:</strong> تأكد من معاينة المنطقة والوحدة قبل الحجز</li>
              <li><strong>دراسة الميزانية:</strong> تأكد من قدرتك على سداد الأقساط</li>
              <li><strong>مراجعة العقد:</strong> اقرأ جميع الشروط والأحكام بعناية</li>
              <li><strong>الاستعلام:</strong> تحقق من موعد التسليم والتشطيبات المشمولة</li>
              <li><strong>استشارة الخبراء:</strong> تواصل مع متخصصين مثل <Link href="/" className="text-orange-600 hover:underline">التيسير للعقارات</Link></li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              توفر مشاريع الإسكان القومية في دمياط الجديدة فرصاً متنوعة تناسب جميع الفئات والميزانيات. 
              سواء كنت تبحث عن الفخامة في مشروع جنة، أو التوازن في دار مصر، أو الاقتصاد في سكن مصر، 
              ستجد ما يناسب احتياجاتك.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              يمكنك تصفح <Link href="/properties" className="text-orange-600 hover:underline font-semibold">العقارات المتاحة</Link> على موقعنا 
              للاطلاع على الوحدات المعروضة للبيع من المالكين، أو التواصل معنا للحصول على استشارة مجانية.
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
              <Link href="/properties">تصفح العقارات</Link>
            </Button>
          </div>

        </div>
      </article>

      <Footer />
    </div>
  );
}
