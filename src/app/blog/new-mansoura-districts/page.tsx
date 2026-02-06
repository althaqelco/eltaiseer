import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calendar, Clock, User, Share2, MapPin, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/ArticleSchema";

export const metadata: Metadata = {
    title: "أفضل المناطق للسكن في المنصورة الجديدة 2026 | دليل شامل",
    description: "دليل تفصيلي لأفضل المناطق السكنية في المنصورة الجديدة. مقارنة شاملة بين أحياء R1 وR2 وR3 والفيلات وداون تاون من حيث الأسعار والخدمات والموقع.",
    keywords: [
        "أحياء المنصورة الجديدة",
        "أفضل مناطق المنصورة الجديدة",
        "R1 المنصورة الجديدة",
        "R2 المنصورة الجديدة",
        "سكن في المنصورة الجديدة",
        "مناطق سكنية المنصورة الجديدة",
        "شقق المنصورة الجديدة",
        "فيلات المنصورة الجديدة",
    ],
    openGraph: {
        title: "أفضل المناطق للسكن في المنصورة الجديدة 2026",
        description: "دليل شامل لأحياء ومناطق المنصورة الجديدة - اكتشف المنطقة المناسبة لك",
        type: "article",
        publishedTime: "2026-01-17",
        images: [
            {
                url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
                width: 1200,
                height: 630,
                alt: "المنصورة الجديدة - مدينة المستقبل",
            },
        ],
    },
    alternates: {
        canonical: "https://eltaiseer.com/blog/new-mansoura-districts",
    },
};

export default function NewMansouraDistrictsArticle() {
    return (
        <div className="min-h-screen bg-gray-50">
            <ArticleSchema
                title="أفضل المناطق للسكن في المنصورة الجديدة 2026 | دليل شامل"
                description="دليل تفصيلي لأفضل المناطق السكنية في المنصورة الجديدة. مقارنة بين أحياء R1 وR2 وR3 والفيلات وداون تاون."
                url="https://eltaiseer.com/blog/new-mansoura-districts"
                image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
                datePublished="2026-01-17"
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
                        <span className="text-emerald-600 font-medium">أفضل مناطق المنصورة الجديدة</span>
                    </nav>
                </div>
            </div>

            <article className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    {/* Article Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">المنصورة الجديدة</span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                17 يناير 2025
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                18 دقيقة قراءة
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            أفضل المناطق للسكن في المنصورة الجديدة 2025: دليلك الشامل
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            المنصورة الجديدة هي مدينة المستقبل في الدلتا. في هذا الدليل المفصل، نستعرض جميع المناطق والأحياء
                            لمساعدتك في اختيار الموقع المثالي لمنزلك أو استثمارك.
                        </p>
                    </header>

                    {/* Featured Image */}
                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
                        <Image
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
                            alt="المنصورة الجديدة - أفضل المناطق السكنية"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">نظرة عامة على المنصورة الجديدة</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            تُعد المنصورة الجديدة واحدة من أهم مدن الجيل الرابع في مصر، وتقع على ساحل البحر المتوسط
                            بمحافظة الدقهلية. تمتد المدينة على مساحة 5,913 فدان، وتستهدف استيعاب أكثر من 700,000 نسمة
                            عند اكتمالها.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            في <Link href="/" className="text-emerald-600 hover:underline font-semibold">التيسير للعقارات</Link>،
                            نقدم لك هذا الدليل الشامل بناءً على دراسة معمقة للسوق العقاري في المنصورة الجديدة،
                            لنساعدك في اتخاذ القرار الأفضل.
                        </p>

                        {/* Key Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                            <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-600">5,913</p>
                                <p className="text-sm text-gray-600">فدان مساحة</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-600">700K+</p>
                                <p className="text-sm text-gray-600">نسمة مستهدفة</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-600">7</p>
                                <p className="text-sm text-gray-600">أحياء سكنية</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-600">4 كم</p>
                                <p className="text-sm text-gray-600">شاطئ بحري</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الأحياء السكنية (R1 - R7)</h2>

                        <div className="bg-emerald-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-lg font-bold text-gray-900">حي R1 - القلب النابض</h3>
                            </div>
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> موقع مركزي متميز</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> قرب من داون تاون</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> خدمات متكاملة</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> تصميمات عصرية</li>
                            </ul>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-6">
                            يعتبر <Link href="/new-mansoura/r1" className="text-emerald-600 hover:underline font-semibold">حي R1</Link>
                            من أكثر الأحياء طلباً في المنصورة الجديدة نظراً لموقعه المتميز في قلب المدينة وقربه من
                            منطقة داون تاون والخدمات الرئيسية. يتميز الحي بتخطيط عمراني حديث وشوارع واسعة ومساحات خضراء.
                        </p>

                        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">مميزات حي R1</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                            <li><strong>الموقع:</strong> في منتصف المدينة مع سهولة الوصول لجميع المناطق</li>
                            <li><strong>الخدمات:</strong> مولات تجارية، مدارس دولية، مستشفيات</li>
                            <li><strong>البنية التحتية:</strong> شبكة طرق حديثة، مرافق ذكية</li>
                            <li><strong>الإطلالة:</strong> بعض الوحدات تطل على الحدائق والبحيرات</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">حي R2 و R3 - التوازن المثالي</h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            يمثل <Link href="/new-mansoura/r2" className="text-emerald-600 hover:underline font-semibold">حي R2</Link> و
                            <Link href="/new-mansoura/r3" className="text-emerald-600 hover:underline font-semibold"> R3</Link>
                            الخيار الأمثل للباحثين عن التوازن بين الموقع الجيد والسعر المعقول. هذه الأحياء تتميز
                            بأسعار أقل من R1 مع الحفاظ على جودة البنية التحتية والتصميم.
                        </p>

                        {/* Image Break */}
                        <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
                            <Image
                                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200"
                                alt="الأحياء السكنية في المنصورة الجديدة"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <p className="text-white text-sm">تصميمات عصرية في الأحياء السكنية</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">حي الفيلات: الفخامة والرقي</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            إذا كنت تبحث عن الفخامة والخصوصية، فإن
                            <Link href="/new-mansoura/villas-district" className="text-emerald-600 hover:underline font-semibold"> حي الفيلات</Link>
                            هو وجهتك المثالية. يضم الحي فيلات مستقلة وتوين هاوس بتصميمات معمارية فريدة ومساحات واسعة.
                        </p>

                        <div className="bg-gradient-to-l from-emerald-600 to-emerald-700 rounded-xl p-6 mb-6 text-white">
                            <h4 className="font-bold text-lg mb-3">💎 مميزات حي الفيلات</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-emerald-50">
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> خصوصية تامة وأمان 24/7</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> حدائق خاصة ومسابح</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> مساحات من 300 إلى 600 م²</li>
                                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> إطلالات على البحر والبحيرات</li>
                            </ul>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">داون تاون: قلب المدينة التجاري</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            تمثل منطقة <Link href="/new-mansoura/downtown" className="text-emerald-600 hover:underline font-semibold">داون تاون</Link>
                            المركز التجاري والإداري للمنصورة الجديدة. تضم مكاتب إدارية، محلات تجارية، مطاعم، وفنادق،
                            مما يجعلها مثالية للاستثمار التجاري.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الواجهة البحرية: سحر البحر المتوسط</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            تتميز <Link href="/new-mansoura/waterfront" className="text-emerald-600 hover:underline font-semibold">الواجهة البحرية</Link>
                            بإطلالتها المباشرة على البحر المتوسط. تضم شاليهات ووحدات سكنية فاخرة، بالإضافة إلى
                            ممشى سياحي وشاطئ عام. المنطقة مثالية للباحثين عن أسلوب حياة ساحلي راقٍ.
                        </p>

                        <div className="bg-blue-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                <h4 className="font-bold text-blue-800">💡 نصيحة استثمارية</h4>
                            </div>
                            <p className="text-blue-700">
                                الوحدات في الواجهة البحرية تحقق أعلى عوائد إيجارية في المدينة، خاصة في موسم الصيف.
                                الشراء الآن بأسعار ما قبل الاكتمال يضمن لك أرباحاً مضاعفة خلال 3-5 سنوات.
                            </p>
                        </div>

                        {/* Image Break */}
                        <div className="relative h-[300px] rounded-xl overflow-hidden my-10">
                            <Image
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"
                                alt="الواجهة البحرية في المنصورة الجديدة"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <p className="text-white text-sm">الواجهة البحرية - إطلالة على البحر المتوسط</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">مقارنة شاملة بين المناطق</h2>

                        <div className="overflow-x-auto mb-8">
                            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow">
                                <thead className="bg-emerald-600 text-white">
                                    <tr>
                                        <th className="p-4 text-right">المنطقة</th>
                                        <th className="p-4 text-right">متوسط السعر/م²</th>
                                        <th className="p-4 text-right">نوع العقارات</th>
                                        <th className="p-4 text-right">مناسب لـ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-4 font-semibold">R1</td>
                                        <td className="p-4">18,000 - 25,000 ج</td>
                                        <td className="p-4">شقق فاخرة</td>
                                        <td className="p-4">العائلات الراقية</td>
                                    </tr>
                                    <tr className="border-b bg-gray-50">
                                        <td className="p-4 font-semibold">R2 - R3</td>
                                        <td className="p-4">14,000 - 20,000 ج</td>
                                        <td className="p-4">شقق متنوعة</td>
                                        <td className="p-4">العائلات الشابة</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-4 font-semibold">حي الفيلات</td>
                                        <td className="p-4">20,000 - 35,000 ج</td>
                                        <td className="p-4">فيلات وتوين هاوس</td>
                                        <td className="p-4">الباحثين عن الفخامة</td>
                                    </tr>
                                    <tr className="border-b bg-gray-50">
                                        <td className="p-4 font-semibold">داون تاون</td>
                                        <td className="p-4">25,000 - 40,000 ج</td>
                                        <td className="p-4">تجاري وإداري</td>
                                        <td className="p-4">المستثمرين</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-4 font-semibold">الواجهة البحرية</td>
                                        <td className="p-4">22,000 - 45,000 ج</td>
                                        <td className="p-4">شاليهات ووحدات فندقية</td>
                                        <td className="p-4">محبي البحر والاستثمار</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">لماذا تختار المنصورة الجديدة؟</h2>
                        <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
                            <li><strong>موقع استراتيجي:</strong> على ساحل البحر المتوسط وقريبة من المنصورة القديمة</li>
                            <li><strong>بنية تحتية ذكية:</strong> شبكة طرق حديثة ومرافق متطورة</li>
                            <li><strong>بيئة صحية:</strong> 40% من المساحة مخصصة للمساحات الخضراء</li>
                            <li><strong>فرص عمل:</strong> منطقة صناعية ومنطقة أعمال مركزية</li>
                            <li><strong>جامعة المنصورة الجديدة:</strong> أكبر جامعة تكنولوجية في الدلتا</li>
                            <li><strong>مستثبل واعد:</strong> استثمارات حكومية ضخمة في التطوير</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">الخلاصة</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            المنصورة الجديدة توفر خيارات متنوعة تناسب جميع الاحتياجات والميزانيات. من الأحياء السكنية
                            المتكاملة إلى الفيلات الفاخرة والوحدات الشاطئية، ستجد ما يناسبك. المدينة في مرحلة نمو سريع،
                            مما يجعل الشراء الآن فرصة استثمارية ذهبية.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            ننصحك بزيارة المدينة شخصياً للتعرف على المناطق المختلفة. يمكنك
                            <Link href="/new-mansoura" className="text-emerald-600 hover:underline font-semibold"> تصفح عقارات المنصورة الجديدة</Link> على موقعنا
                            أو التواصل مع فريق <Link href="/" className="text-emerald-600 hover:underline font-semibold">التيسير للعقارات</Link> للحصول على استشارة مجانية.
                        </p>

                    </div>

                    {/* Author & Share */}
                    <div className="border-t border-b py-6 my-10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">فريق التيسير للعقارات</p>
                                <p className="text-sm text-gray-500">خبراء العقارات في المنصورة الجديدة</p>
                            </div>
                        </div>
                        <Button variant="outline" className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                            <Share2 className="h-4 w-4" />
                            مشاركة المقال
                        </Button>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-to-l from-emerald-600 to-emerald-700 rounded-2xl p-8 mt-10 text-center text-white">
                        <h3 className="text-2xl font-bold mb-4">اكتشف عقارات المنصورة الجديدة</h3>
                        <p className="text-emerald-100 mb-6">تصفح أفضل العروض والوحدات المتاحة الآن</p>
                        <Button asChild variant="secondary" size="lg">
                            <Link href="/new-mansoura">تصفح عقارات المنصورة الجديدة</Link>
                        </Button>
                    </div>

                </div>
            </article>

            <Footer />
        </div>
    );
}
