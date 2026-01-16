import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "دليلك الشامل لشراء شقة في دمياط الجديدة 2025 | نصائح الخبراء",
  description: "دليل شامل ومفصل لشراء شقة في دمياط الجديدة. تعرف على أفضل المناطق، الأسعار، نصائح التفاوض، والإجراءات القانونية. كل ما تحتاج معرفته قبل شراء شقتك.",
  keywords: [
    "شراء شقة دمياط الجديدة",
    "شقق للبيع دمياط الجديدة",
    "نصائح شراء شقة",
    "أسعار الشقق دمياط الجديدة",
    "دليل شراء العقارات",
    "شقق تمليك دمياط",
  ],
  openGraph: {
    title: "دليلك الشامل لشراء شقة في دمياط الجديدة 2025",
    description: "كل ما تحتاج معرفته قبل شراء شقتك في دمياط الجديدة - نصائح الخبراء",
    type: "article",
    publishedTime: "2025-01-15",
    authors: ["التيسير للعقارات"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
        width: 1200,
        height: 630,
        alt: "شقق للبيع في دمياط الجديدة - دليل الشراء الشامل",
      },
    ],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/buying-apartment-guide",
  },
};

export default function BuyingGuideArticle() {
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
            <span className="text-orange-600 font-medium">دليل شراء شقة</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">نصائح الشراء</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                15 يناير 2025
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                12 دقيقة قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              دليلك الشامل لشراء شقة في دمياط الجديدة 2025
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              هل تفكر في شراء شقة في دمياط الجديدة؟ في هذا الدليل الشامل، نقدم لك كل ما تحتاج معرفته 
              من اختيار المنطقة المناسبة إلى إتمام عملية الشراء بنجاح.
            </p>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"
              alt="شقق للبيع في دمياط الجديدة - دليل شامل لشراء الشقق"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مقدمة: لماذا دمياط الجديدة؟</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              تعتبر مدينة دمياط الجديدة واحدة من أكثر المدن الجديدة جاذبية للاستثمار العقاري في مصر. 
              تتميز المدينة بموقعها الاستراتيجي على ساحل البحر المتوسط، وتخطيطها العمراني الحديث، 
              وأسعارها التنافسية مقارنة بالمدن الجديدة الأخرى. سواء كنت تبحث عن سكن دائم أو استثمار عقاري، 
              فإن دمياط الجديدة توفر لك فرصاً متنوعة تناسب جميع الاحتياجات والميزانيات.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              في <Link href="/" className="text-orange-600 hover:underline font-semibold">التيسير للعقارات</Link>، 
              نقدم لك هذا الدليل الشامل الذي يغطي جميع جوانب شراء شقة في دمياط الجديدة، 
              من اختيار الحي المناسب إلى إتمام الإجراءات القانونية.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الأولى: تحديد الميزانية</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              قبل البدء في البحث عن شقة، من الضروري تحديد ميزانيتك بدقة. تتراوح أسعار الشقق في دمياط الجديدة 
              بشكل كبير حسب المنطقة والمساحة ومستوى التشطيب. إليك نظرة عامة على الأسعار:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>الأحياء السكنية (الأول إلى الخامس):</strong> تتراوح الأسعار من 800,000 إلى 2,500,000 جنيه</li>
              <li><strong>مشاريع الإسكان القومي:</strong> تبدأ من 500,000 جنيه للوحدات الصغيرة</li>
              <li><strong>المناطق المتميزة:</strong> قد تصل إلى 4,000,000 جنيه للوحدات الفاخرة</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              يمكنك استعراض <Link href="/new-damietta" className="text-orange-600 hover:underline font-semibold">شقق للبيع في دمياط الجديدة</Link> 
              على موقعنا للاطلاع على الأسعار الحالية في السوق.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الثانية: اختيار المنطقة المناسبة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              يعد اختيار المنطقة من أهم القرارات التي ستتخذها. كل حي في دمياط الجديدة له مميزاته الخاصة:
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">الأحياء السكنية التقليدية</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              تضم دمياط الجديدة ستة أحياء سكنية رئيسية، لكل منها طابعه الخاص:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li>
                <Link href="/new-damietta/first-district" className="text-orange-600 hover:underline font-semibold">الحي الأول</Link>: 
                من أقدم وأرقى الأحياء، يتميز بالخدمات المكتملة والموقع المركزي
              </li>
              <li>
                <Link href="/new-damietta/second-district" className="text-orange-600 hover:underline font-semibold">الحي الثاني</Link>: 
                يوفر توازناً جيداً بين السعر والموقع، مثالي للعائلات
              </li>
              <li>
                <Link href="/new-damietta/third-district" className="text-orange-600 hover:underline font-semibold">الحي الثالث</Link>: 
                أسعار معقولة مع توفر الخدمات الأساسية
              </li>
              <li>
                <Link href="/new-damietta/fourth-district" className="text-orange-600 hover:underline font-semibold">الحي الرابع</Link>: 
                منطقة هادئة مناسبة للباحثين عن الخصوصية
              </li>
              <li>
                <Link href="/new-damietta/fifth-district" className="text-orange-600 hover:underline font-semibold">الحي الخامس</Link>: 
                يشهد تطوراً سريعاً مع فرص استثمارية جيدة
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مشاريع الإسكان القومي</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              توفر المشاريع القومية خيارات ممتازة للباحثين عن أسعار معقولة مع جودة بناء عالية:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li>
                <Link href="/new-damietta/janna-project" className="text-orange-600 hover:underline font-semibold">مشروع جنة</Link>: 
                وحدات فاخرة بتشطيبات عالية الجودة
              </li>
              <li>
                <Link href="/new-damietta/dar-misr" className="text-orange-600 hover:underline font-semibold">دار مصر</Link>: 
                تشطيب سوبر لوكس بأسعار تنافسية
              </li>
              <li>
                <Link href="/new-damietta/sakan-misr" className="text-orange-600 hover:underline font-semibold">سكن مصر</Link>: 
                خيار اقتصادي مع مستوى تشطيب جيد
              </li>
            </ul>

            {/* Image Break */}
            <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"
                alt="أحياء دمياط الجديدة - مناطق سكنية متميزة"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">أحياء دمياط الجديدة تتميز بالتخطيط العمراني الحديث</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الثالثة: معاينة الشقة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              المعاينة الشخصية للشقة خطوة لا يمكن تجاوزها. إليك قائمة بأهم النقاط التي يجب التحقق منها:
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">الفحص الإنشائي</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>التأكد من عدم وجود شروخ في الحوائط أو الأسقف</li>
              <li>فحص حالة الأرضيات والنوافذ</li>
              <li>التحقق من سلامة التمديدات الكهربائية والصحية</li>
              <li>معاينة السلالم والمصعد (إن وجد)</li>
              <li>التأكد من جودة العزل المائي والحراري</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">الموقع والخدمات</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>قرب الشقة من المدارس والجامعات</li>
              <li>توفر المواصلات العامة</li>
              <li>وجود المحلات التجارية والخدمات الأساسية</li>
              <li>مستوى الأمان في المنطقة</li>
              <li>جودة الشوارع والبنية التحتية</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الرابعة: التفاوض على السعر</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              التفاوض مهارة أساسية في سوق العقارات. إليك بعض النصائح للحصول على أفضل سعر:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>اعرف السوق:</strong> ابحث عن أسعار الشقق المماثلة في نفس المنطقة</li>
              <li><strong>لا تظهر الحماس:</strong> حافظ على هدوئك ولا تُظهر رغبتك الشديدة في الشراء</li>
              <li><strong>اذكر العيوب:</strong> استخدم أي عيوب في الشقة كورقة تفاوض</li>
              <li><strong>كن مستعداً للانسحاب:</strong> أحياناً التهديد بالانسحاب يجلب عروضاً أفضل</li>
              <li><strong>تفاوض على الإضافات:</strong> إذا لم ينخفض السعر، تفاوض على تحسينات أو أثاث</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الخامسة: الإجراءات القانونية</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              بعد الاتفاق على السعر، تأتي مرحلة الإجراءات القانونية التي يجب التعامل معها بحذر:
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">المستندات المطلوبة</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>صورة بطاقة الرقم القومي للبائع والمشتري</li>
              <li>سند ملكية العقار الأصلي</li>
              <li>شهادة من الحي تفيد بعدم وجود مخالفات</li>
              <li>إيصالات المرافق (كهرباء، مياه، غاز)</li>
              <li>رخصة البناء إن وجدت</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">خطوات التسجيل</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
              <li>كتابة عقد ابتدائي وتسجيله في الشهر العقاري</li>
              <li>دفع رسوم التسجيل (حوالي 2-3% من قيمة العقار)</li>
              <li>الحصول على العقد المسجل النهائي</li>
              <li>نقل ملكية المرافق باسم المالك الجديد</li>
            </ol>

            {/* Image Break */}
            <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
              <Image
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200"
                alt="إجراءات شراء شقة - الأوراق والمستندات المطلوبة"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">تأكد من استكمال جميع الأوراق القانونية قبل إتمام الشراء</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">نصائح إضافية للمشترين</h2>
            
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">التمويل العقاري</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              إذا كنت تحتاج لتمويل عقاري، فإن العديد من البنوك المصرية توفر برامج تمويل بشروط ميسرة:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>مقدم يبدأ من 15-20% من قيمة الوحدة</li>
              <li>فترات سداد تصل إلى 20 عاماً</li>
              <li>معدلات فائدة تنافسية (متناقصة أو ثابتة)</li>
              <li>إمكانية السداد المبكر بدون غرامات في بعض البرامج</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">أخطاء يجب تجنبها</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>عدم التسرع في اتخاذ القرار تحت ضغط البائع</li>
              <li>إهمال فحص المستندات القانونية</li>
              <li>عدم زيارة الشقة في أوقات مختلفة من اليوم</li>
              <li>تجاهل حالة المبنى والمناطق المشتركة</li>
              <li>عدم الاستعانة بمحامٍ متخصص في العقارات</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">لماذا تختار التيسير للعقارات؟</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              في <Link href="/" className="text-orange-600 hover:underline font-semibold">التيسير للعقارات</Link>، 
              نقدم لك تجربة شراء سلسة وآمنة. نحن نوفر:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>مجموعة واسعة من <Link href="/properties" className="text-orange-600 hover:underline">العقارات المتاحة</Link> بأسعار مختلفة</li>
              <li>معلومات دقيقة وشفافة عن كل عقار</li>
              <li>خدمة <Link href="/valuation" className="text-orange-600 hover:underline">تقييم العقارات</Link> المجانية</li>
              <li>فريق من الخبراء لمساعدتك في كل خطوة</li>
              <li>متابعة ما بعد البيع لضمان رضاك التام</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              شراء شقة في دمياط الجديدة قرار استثماري ممتاز إذا تم بالشكل الصحيح. باتباع الخطوات 
              المذكورة في هذا الدليل والاستعانة بالخبراء المتخصصين، يمكنك الحصول على شقة أحلامك 
              بأفضل سعر وبدون مشاكل قانونية.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              لا تتردد في <Link href="/properties" className="text-orange-600 hover:underline font-semibold">تصفح شققنا المتاحة</Link> أو 
              التواصل معنا للحصول على استشارة مجانية. نحن هنا لمساعدتك في العثور على منزل أحلامك.
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

          {/* Related Articles */}
          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">مقالات ذات صلة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/blog/best-districts" className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow flex items-center gap-4">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200" alt="أفضل الأحياء" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-2">أفضل الأحياء للسكن في دمياط الجديدة</h4>
                  <span className="text-sm text-orange-600 flex items-center gap-1 mt-2">
                    اقرأ المزيد <ArrowLeft className="h-3 w-3" />
                  </span>
                </div>
              </Link>
              <Link href="/blog/investment-guide" className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow flex items-center gap-4">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image src="https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=200" alt="الاستثمار العقاري" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-2">دليل الاستثمار العقاري في دمياط الجديدة</h4>
                  <span className="text-sm text-orange-600 flex items-center gap-1 mt-2">
                    اقرأ المزيد <ArrowLeft className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-8 mt-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد لشراء شقتك؟</h3>
            <p className="text-orange-100 mb-6">تصفح مئات الشقق المتاحة في دمياط الجديدة الآن</p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/properties">تصفح الشقق المتاحة</Link>
            </Button>
          </div>

        </div>
      </article>

      <Footer />
    </div>
  );
}
