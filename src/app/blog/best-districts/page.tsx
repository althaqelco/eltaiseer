import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, Share2, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "أفضل الأحياء للسكن في دمياط الجديدة 2025 | مقارنة شاملة",
  description: "دليل شامل لأفضل الأحياء السكنية في دمياط الجديدة. مقارنة تفصيلية بين الحي الأول والثاني والثالث ومشاريع الإسكان القومي من حيث الأسعار والخدمات والموقع.",
  keywords: [
    "أحياء دمياط الجديدة",
    "أفضل مناطق دمياط الجديدة",
    "الحي الأول دمياط الجديدة",
    "الحي الثاني دمياط الجديدة",
    "سكن في دمياط الجديدة",
    "مناطق سكنية دمياط",
  ],
  openGraph: {
    title: "أفضل الأحياء للسكن في دمياط الجديدة 2025",
    description: "مقارنة شاملة بين أحياء دمياط الجديدة - اكتشف المنطقة المناسبة لك",
    type: "article",
    publishedTime: "2025-01-10",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
        width: 1200,
        height: 630,
        alt: "أحياء دمياط الجديدة - أفضل المناطق السكنية",
      },
    ],
  },
  alternates: {
    canonical: "https://eltaiseer.com/blog/best-districts",
  },
};

export default function BestDistrictsArticle() {
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
            <span className="text-orange-600 font-medium">أفضل الأحياء للسكن</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">المناطق</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                10 يناير 2025
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                15 دقيقة قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              أفضل الأحياء للسكن في دمياط الجديدة 2025: دليلك الشامل
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              اختيار الحي المناسب هو أهم قرار عند شراء عقار. في هذا الدليل المفصل، نقارن بين جميع أحياء دمياط الجديدة 
              لمساعدتك في اتخاذ القرار الصحيح.
            </p>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"
              alt="أحياء دمياط الجديدة - أفضل المناطق السكنية للعائلات"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">نظرة عامة على أحياء دمياط الجديدة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              تنقسم مدينة دمياط الجديدة إلى عدة مناطق سكنية متنوعة، كل منها يتميز بخصائص فريدة تناسب احتياجات مختلفة. 
              سواء كنت تبحث عن منطقة راقية بخدمات متكاملة، أو حي اقتصادي بأسعار معقولة، ستجد في دمياط الجديدة ما يناسبك.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              في <Link href="/" className="text-orange-600 hover:underline font-semibold">التيسير للعقارات</Link>، 
              قمنا بإعداد هذا الدليل الشامل بناءً على خبرتنا الطويلة في سوق العقارات المحلي، 
              لنقدم لك صورة واضحة عن كل حي ومميزاته.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الحي الأول: قلب المدينة النابض</h2>
            
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">معلومات سريعة عن الحي الأول</h3>
              </div>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> موقع مركزي متميز</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> خدمات متكاملة</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> مدارس وجامعات قريبة</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> أسعار متوسطة إلى مرتفعة</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              يعتبر <Link href="/new-damietta/first-district" className="text-orange-600 hover:underline font-semibold">الحي الأول</Link> 
              من أقدم وأعرق أحياء دمياط الجديدة. يتميز بموقعه المركزي الذي يجعله قريباً من معظم الخدمات والمرافق الحيوية. 
              الحي مكتمل الخدمات بنسبة كبيرة، مما يجعله خياراً مثالياً للعائلات التي تبحث عن الاستقرار الفوري.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مميزات الحي الأول</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>الموقع:</strong> يقع في قلب المدينة مما يسهل الوصول لأي منطقة أخرى</li>
              <li><strong>الخدمات:</strong> توفر المدارس، المستشفيات، المولات التجارية، والبنوك</li>
              <li><strong>البنية التحتية:</strong> شوارع واسعة ومرصوفة، إضاءة جيدة، صرف صحي متكامل</li>
              <li><strong>الأمان:</strong> مستوى أمان عالٍ مع تواجد نقاط شرطة قريبة</li>
              <li><strong>المواصلات:</strong> سهولة الوصول للمواصلات العامة والطرق الرئيسية</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">أسعار العقارات في الحي الأول</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              تتراوح أسعار الشقق في الحي الأول بين 1,200,000 و 3,000,000 جنيه حسب المساحة ومستوى التشطيب. 
              الشقق بمساحة 120 متر مربع تبدأ من حوالي 1,500,000 جنيه للتشطيب الكامل.
              يمكنك الاطلاع على <Link href="/new-damietta/first-district" className="text-orange-600 hover:underline">عقارات الحي الأول</Link> المتاحة حالياً.
            </p>

            {/* Image Break */}
            <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
                alt="الحي الأول دمياط الجديدة - عمارات سكنية راقية"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">الحي الأول يتميز بالعمارات ذات التصميم العصري</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الحي الثاني: التوازن المثالي</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              يمثل <Link href="/new-damietta/second-district" className="text-orange-600 hover:underline font-semibold">الحي الثاني</Link> 
              الخيار الأمثل لمن يبحث عن توازن بين الموقع الجيد والسعر المعقول. يتميز بقربه من الحي الأول 
              مع أسعار أقل نسبياً، مما يجعله وجهة مفضلة للعائلات الشابة والمستثمرين.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">لماذا تختار الحي الثاني؟</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>أسعار أقل بنسبة 15-20% مقارنة بالحي الأول</li>
              <li>قرب من الخدمات الرئيسية في الحي الأول</li>
              <li>مناطق خضراء وحدائق عامة</li>
              <li>مستوى تشطيب جيد في معظم العمارات</li>
              <li>فرص استثمارية واعدة مع تطور المنطقة</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الحي الثالث والرابع: الهدوء والخصوصية</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              إذا كنت تبحث عن الهدوء والخصوصية بعيداً عن صخب المناطق المركزية، 
              فإن <Link href="/new-damietta/third-district" className="text-orange-600 hover:underline font-semibold">الحي الثالث</Link> و
              <Link href="/new-damietta/fourth-district" className="text-orange-600 hover:underline font-semibold">الحي الرابع</Link> 
              يوفران بيئة سكنية هادئة مع أسعار تنافسية للغاية.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مميزات الحي الثالث والرابع</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>الأسعار:</strong> من أقل الأسعار في دمياط الجديدة</li>
              <li><strong>المساحات:</strong> شقق بمساحات أكبر بنفس السعر</li>
              <li><strong>الهدوء:</strong> كثافة سكانية أقل ومستوى ضوضاء منخفض</li>
              <li><strong>التطور:</strong> مشاريع تطوير مستمرة ترفع من قيمة العقارات</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الحي الخامس والسادس: مستقبل المدينة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              يشهد <Link href="/new-damietta/fifth-district" className="text-orange-600 hover:underline font-semibold">الحي الخامس</Link> 
              والحي السادس (المتميز) تطوراً سريعاً مع مشاريع بنية تحتية ضخمة. 
              هذه المناطق تمثل فرصة استثمارية ممتازة لمن يستطيع الانتظار لاكتمال الخدمات.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-blue-800 mb-3">💡 نصيحة استثمارية</h4>
              <p className="text-blue-700">
                الشراء في الحي الخامس والسادس الآن بأسعار منخفضة يمكن أن يحقق عوائد ممتازة 
                خلال 3-5 سنوات مع اكتمال مشاريع التطوير.
              </p>
            </div>

            {/* Image Break */}
            <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200"
                alt="مشاريع التطوير في أحياء دمياط الجديدة"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">مشاريع تطوير مستمرة في الأحياء الجديدة</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مشاريع الإسكان القومي: جودة بأسعار معقولة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              تقدم مشاريع الإسكان القومي في دمياط الجديدة خياراً ممتازاً لمن يبحث عن 
              وحدات بتشطيبات عالية الجودة وأسعار مدعومة من الدولة.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مشروع جنة</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              يعتبر <Link href="/new-damietta/janna-project" className="text-orange-600 hover:underline font-semibold">مشروع جنة</Link> 
              من أرقى مشاريع الإسكان القومي. يتميز بتشطيبات فاخرة ومساحات خضراء واسعة وخدمات متكاملة. 
              الوحدات تأتي بتشطيب سوبر لوكس كامل، مما يوفر على المشتري تكاليف التشطيب.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>مساحات تبدأ من 100 متر مربع</li>
              <li>تشطيب سوبر لوكس متكامل</li>
              <li>حدائق ومساحات خضراء</li>
              <li>جراجات ومواقف سيارات</li>
              <li>أمن وحراسة على مدار الساعة</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">دار مصر وسكن مصر</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              يوفر <Link href="/new-damietta/dar-misr" className="text-orange-600 hover:underline font-semibold">مشروع دار مصر</Link> و
              <Link href="/new-damietta/sakan-misr" className="text-orange-600 hover:underline font-semibold">سكن مصر</Link> 
              خيارات سكنية متنوعة بأسعار تناسب الطبقة المتوسطة. المشاريع تتميز بالتصميم العصري والتخطيط الجيد.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مقارنة شاملة بين الأحياء</h2>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="p-4 text-right">الحي</th>
                    <th className="p-4 text-right">متوسط السعر/م²</th>
                    <th className="p-4 text-right">الخدمات</th>
                    <th className="p-4 text-right">مناسب لـ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">الحي الأول</td>
                    <td className="p-4">12,000 - 18,000 ج</td>
                    <td className="p-4">متكاملة</td>
                    <td className="p-4">العائلات، كبار السن</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-semibold">الحي الثاني</td>
                    <td className="p-4">10,000 - 15,000 ج</td>
                    <td className="p-4">جيدة</td>
                    <td className="p-4">العائلات الشابة</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">الحي الثالث</td>
                    <td className="p-4">8,000 - 12,000 ج</td>
                    <td className="p-4">متوسطة</td>
                    <td className="p-4">الباحثين عن الهدوء</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-semibold">الحي الرابع</td>
                    <td className="p-4">7,000 - 11,000 ج</td>
                    <td className="p-4">متوسطة</td>
                    <td className="p-4">المستثمرين</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">مشروع جنة</td>
                    <td className="p-4">15,000 - 20,000 ج</td>
                    <td className="p-4">فاخرة</td>
                    <td className="p-4">الباحثين عن الفخامة</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">كيف تختار الحي المناسب لك؟</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              اختيار الحي يعتمد على عدة عوامل شخصية:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>الميزانية:</strong> حدد ميزانيتك أولاً واختر الأحياء التي تناسبها</li>
              <li><strong>نمط الحياة:</strong> هل تفضل الحياة الصاخبة أم الهدوء؟</li>
              <li><strong>الاحتياجات:</strong> قرب المدارس، العمل، المستشفيات</li>
              <li><strong>المستقبل:</strong> هل تخطط للسكن طويل المدى أم الاستثمار؟</li>
              <li><strong>وسائل النقل:</strong> هل تملك سيارة أم تعتمد على المواصلات العامة؟</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              كل حي في دمياط الجديدة له مميزاته الخاصة. الحي الأول مثالي للباحثين عن الخدمات المتكاملة، 
              بينما الأحياء الأحدث توفر فرصاً استثمارية واعدة. مشاريع الإسكان القومي تقدم 
              جودة عالية بأسعار مدعومة.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              ننصحك بزيارة المناطق المختلفة شخصياً قبل اتخاذ قرارك. يمكنك أيضاً 
              <Link href="/properties" className="text-orange-600 hover:underline font-semibold"> تصفح العقارات المتاحة</Link> على موقعنا 
              أو التواصل مع فريق <Link href="/" className="text-orange-600 hover:underline font-semibold">التيسير للعقارات</Link> للحصول على استشارة مجانية.
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
            <h3 className="text-2xl font-bold mb-4">اكتشف العقارات المتاحة في جميع الأحياء</h3>
            <p className="text-orange-100 mb-6">تصفح مئات العقارات في دمياط الجديدة الآن</p>
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
