import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema, PostDates } from "@/components/ArticleSchema";

export const metadata: Metadata = {
  title: "دليلك الشامل لشراء شقة في دمياط الجديدة 2026 | نصائح الخبراء",
  description: "خطوات شراء شقة في دمياط الجديدة: تحديد الميزانية من وسيط سعر المتر في كل حي، ومعاينة الشقة، والتحقق من الأوراق مع محامٍ، والتفاوض على سعر الطلب.",
  keywords: [
    "شراء شقة دمياط الجديدة",
    "شقق للبيع دمياط الجديدة",
    "نصائح شراء شقة",
    "أسعار الشقق دمياط الجديدة",
    "دليل شراء العقارات",
    "شقق تمليك دمياط",
  ],
  openGraph: {
    url: "https://eltaiseer.com/blog/buying-apartment-guide/",
    title: "دليلك الشامل لشراء شقة في دمياط الجديدة 2026",
    description: "خطوات شراء شقة في دمياط الجديدة: الميزانية والمعاينة والأوراق والتفاوض",
    type: "article",
    publishedTime: "2026-01-15",
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
    canonical: "https://eltaiseer.com/blog/buying-apartment-guide/",
  },
};

export default function BuyingGuideArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleSchema
        title="دليلك الشامل لشراء شقة في دمياط الجديدة 2026 | نصائح الخبراء"
        description="خطوات شراء شقة في دمياط الجديدة: تحديد الميزانية من وسيط سعر المتر في كل حي، ومعاينة الشقة، والتحقق من الأوراق مع محامٍ، والتفاوض على سعر الطلب."
        url="https://eltaiseer.com/blog/buying-apartment-guide"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"
        datePublished="2026-01-15"
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
                <PostDates path="/blog/buying-apartment-guide/" className="" />
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                6 دقائق قراءة
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              دليلك الشامل لشراء شقة في دمياط الجديدة 2026
            </h1>
            <p className="answer-lede text-xl text-gray-600 leading-relaxed">
              لشراء شقة في دمياط الجديدة: حدّد ميزانيتك بمقارنة وسيط سعر المتر في الحي الذي تريده، ثم عاين الشقة
              والمبنى في أوقات مختلفة، وتحقق من أوراق الملكية وموقف الأقساط والمرافق مع محامٍ قبل دفع أي مبلغ، ثم
              فاوض على سعر الطلب ووقّع العقد. يشرح هذا الدليل كل خطوة باختصار ويحيلك إلى الأرقام المحسوبة من العروض الحالية.
            </p>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"
              alt="صورة توضيحية لمبنى سكني"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الأولى: تحديد الميزانية</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              تختلف أسعار الشقق في دمياط الجديدة حسب الحي والمساحة والدور ومستوى التشطيب. بدل الاعتماد على أرقام عامة،
              قارن وسيط سعر المتر في الحي الذي تريده، وهو محسوب من العروض الحالية ويتحدث تلقائيًا، في 
              <Link href="/prices/#new-damietta" className="text-orange-600 hover:underline font-semibold">صفحة أسعار العقارات</Link>. الأسعار هناك أسعار طلب من البائعين
              وليست أسعار بيع منفذة.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              وإن كنت تفكر في التقسيط، فشروطه يحددها كل بائع وتظهر في صفحة العقار؛ والشقق التي تقبل التقسيط الآن في 
              <Link href="/properties/installments/#new-damietta" className="text-orange-600 hover:underline font-semibold">عقارات بالتقسيط في دمياط الجديدة</Link>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الثانية: اختيار المنطقة المناسبة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              لا يوجد حي واحد يناسب الجميع؛ الاختيار يعتمد على موعد السكن الذي تحتاجه، وقربك من العمل والمدارس، وميزانيتك.
              لكل حي صفحة بعروضه الحالية ووسيط سعر المتر فيه:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li>
                الأحياء الرئيسية: 
                <Link href="/new-damietta/first-district/" className="text-orange-600 hover:underline">الحي الأول</Link>، 
                <Link href="/new-damietta/second-district/" className="text-orange-600 hover:underline">الثاني</Link>، 
                <Link href="/new-damietta/third-district/" className="text-orange-600 hover:underline">الثالث</Link>، 
                <Link href="/new-damietta/fourth-district/" className="text-orange-600 hover:underline">الرابع</Link>، 
                <Link href="/new-damietta/fifth-district/" className="text-orange-600 hover:underline">الخامس</Link>.
              </li>
              <li>
                مشروعات الإسكان القومي: 
                <Link href="/new-damietta/janna-project/" className="text-orange-600 hover:underline">مشروع جنة</Link>، 
                <Link href="/new-damietta/dar-misr-1/" className="text-orange-600 hover:underline">دار مصر</Link>، 
                <Link href="/new-damietta/sakan-misr-south/" className="text-orange-600 hover:underline">سكن مصر</Link>. مواصفات التشطيب ونظام السداد
                الأصلي تحددهما كراسة طرح كل مشروع، وتفاصيلها في 
                <Link href="/blog/national-housing-projects/" className="text-orange-600 hover:underline">مشاريع الإسكان القومية في دمياط الجديدة</Link>.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              وللمقارنة بين الأحياء حسب الغرض: 
              <Link href="/blog/best-districts/" className="text-orange-600 hover:underline font-semibold">أفضل الأحياء للسكن في دمياط الجديدة</Link>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الثالثة: معاينة الشقة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              المعاينة الشخصية خطوة لا يمكن تجاوزها، ويفضل أن تكون في أوقات مختلفة من اليوم. تحقق من:
            </p>
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">حالة الشقة والمبنى</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>عدم وجود شروخ في الحوائط أو الأسقف</li>
              <li>حالة الأرضيات والنوافذ</li>
              <li>سلامة التمديدات الكهربائية والصحية</li>
              <li>حالة السلالم والمصعد (إن وجد) والأجزاء المشتركة</li>
              <li>العزل المائي، خاصة في الدور الأخير</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">الموقع والخدمات</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>المسافة إلى المدارس والجامعة والعمل</li>
              <li>المواصلات العامة</li>
              <li>المحلات والخدمات الأساسية في الحي</li>
              <li>حالة الشوارع والإنارة</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الرابعة: التحقق من الأوراق</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              الأوراق المطلوبة ورسوم التسجيل تختلف حسب حالة الشقة: عقد مسجل، أو عقود ابتدائية متسلسلة، أو تخصيص من جهاز
              المدينة لم يُستكمل سداده. لذلك لا ننشر هنا نسبًا أو رسومًا ثابتة؛ راجع الحالة الفعلية مع محامٍ ومع الشهر العقاري
              أو جهاز المدينة قبل التوقيع. قبل دفع أي مبلغ:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>اطلب ما يثبت ملكية البائع، وتأكد أن اسمه يطابق بطاقته</li>
              <li>اسأل عن أي أقساط متبقية للجهاز أو للمطور، وعن إيصالات المرافق</li>
              <li>راجع مسودة العقد مع محامٍ متخصص في العقارات</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              تفاصيل الإجراءات في 
              <Link href="/blog/buying-steps-legal/" className="text-orange-600 hover:underline font-semibold">خطوات شراء عقار: الأوراق والإجراءات</Link>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخطوة الخامسة: التفاوض على السعر</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              السعر المعروض سعر طلب يحدده البائع، والتفاوض يتم بين الطرفين. قبل التفاوض:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              <li><strong>اعرف السوق:</strong> قارن سعر المتر في الشقة بوسيط الحي في صفحة الأسعار</li>
              <li><strong>اذكر ما وجدته في المعاينة:</strong> العيوب وتكلفة إصلاحها جزء من التفاوض</li>
              <li><strong>لا تتعجل:</strong> لا تتخذ القرار تحت ضغط البائع أو الوسيط</li>
              <li><strong>اتفق على التفاصيل كتابة:</strong> ما يشمله السعر، وموعد التسليم، وطريقة الدفع</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">التمويل العقاري</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              إن كنت تحتاج تمويلًا عقاريًا، فالمقدم ومدة السداد والفائدة يحددها كل بنك أو جهة تمويل وتتغير من برنامج لآخر؛
              اطلب الشروط مكتوبة ومحدثة من البنك قبل الالتزام مع البائع.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">كيف يساعدك التيسير للعقارات؟</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><Link href="/properties/" className="text-orange-600 hover:underline">العقارات المعروضة للبيع</Link>، ولكل عقار صفحة بمساحته وسعره وطريقة الدفع</li>
              <li><Link href="/prices/" className="text-orange-600 hover:underline">وسيط سعر المتر لكل حي</Link> من العروض الحالية</li>
              <li><Link href="/valuation/" className="text-orange-600 hover:underline">تقييم عقاري مجاني</Link> إن كنت تريد مقارنة سعر شقة بعينها</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              حدّد ميزانيتك من الأسعار الفعلية في الحي، وعاين الشقة جيدًا، وتحقق من الأوراق مع محامٍ قبل دفع أي مبلغ،
              ثم فاوض على سعر الطلب. المعلومات هنا للاسترشاد وليست نصيحة مالية أو استثمارية أو قانونية.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <Link href="/new-damietta/" className="text-orange-600 hover:underline font-semibold">تصفح عقارات دمياط الجديدة</Link> أو تواصل معنا لأي سؤال.
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
                  <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200" alt="" fill className="object-cover" />
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
                  <Image src="https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=200" alt="" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-2">كيف تقيّم عقارًا قبل الشراء في دمياط الجديدة</h4>
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
            <p className="text-orange-100 mb-6">تصفح الشقق المعروضة للبيع الآن في دمياط الجديدة والمنصورة الجديدة</p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/properties/apartments/">تصفح الشقق المتاحة</Link>
            </Button>
          </div>

        </div>
      </article>

      <Footer />
    </div>
  );
}
