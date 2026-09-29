import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Building2, Users, Shield, Award, MapPin, Phone, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { BrandPlatformLink } from "@/lib/bw/platformLinks";
import { ORG, breadcrumbNode, graph, webPage } from "@/lib/seo/schema";
import { editorialIso } from "@/lib/seo/editorial";
import { SITE_NAME } from "@/lib/seo/owner-flags";

export const metadata: Metadata = {
  title: "عن التيسير للعقارات | شريكك الموثوق في عقارات دمياط الجديدة والمنصورة الجديدة",
  description: "التيسير للعقارات وسيط عقاري في دمياط الجديدة: عقارات للبيع في دمياط الجديدة والمنصورة الجديدة، ووساطة موثّقة لإعادة بيع أراضي بيت الوطن، وأداة «التيسير — الحجز الذكي» المجانية للحاجزين. منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية.",
  keywords: [
    "التيسير للعقارات",
    "شركة عقارات دمياط الجديدة",
    "وكيل عقاري دمياط",
    "شركة عقارات المنصورة الجديدة",
    "وسيط عقاري دمياط الجديدة",
    "مكتب عقارات دمياط",
    "El Taiseer Real Estate",
    "real estate agent damietta",
  ],
  openGraph: {
    title: "عن التيسير للعقارات | شريكك الموثوق",
    description: "وسيط عقاري في دمياط الجديدة والمنصورة الجديدة، مستقل وغير تابع لهيئة المجتمعات العمرانية",
    url: "https://eltaiseer.com/about/",
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "عن التيسير للعقارات" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "عن التيسير للعقارات",
    description: "وسيط عقاري في دمياط الجديدة والمنصورة الجديدة",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://eltaiseer.com/about/",
  },
};

// [OWNER D14] لا «تقسيط حتى 10 سنوات / مقدم 10%»، ولا عدد عقارات أو مناطق ثابت: الأرقام الحية في صفحاتها
// (سيُعاد بناء الصفحة بأرقام محسوبة في حزمة المحتوى التالية — spec-final A2.7)
const features = [
  {
    icon: Building2,
    title: "عقارات للبيع في المدينتين",
    description: "شقق وفيلات وأراضٍ ومحلات تجارية معروضة للبيع في دمياط الجديدة والمنصورة الجديدة، ولكل عقار صفحة بسعره ومساحته.",
  },
  {
    icon: MapPin,
    title: "صفحة لكل حي",
    description: "أحياء دمياط الجديدة ومشروعات الإسكان فيها، وأحياء المنصورة الجديدة، ولكل منها صفحة بعروضها الحالية.",
  },
  {
    icon: Shield,
    title: "أرقام من مصدرها",
    description: "سعر المتر في صفحة الأسعار وسيط محسوب من العروض الحالية، ولا نعرض خانة من أقل من 3 عقارات.",
  },
  {
    icon: Users,
    title: "فريق في دمياط الجديدة",
    description: "فريق التيسير للعقارات يتابع العروض في المدينتين ويرد على الاستفسارات.",
  },
  {
    icon: Award,
    title: "تقييم عقاري مجاني",
    description: "نقارن عقارك بوسيط سعر المتر لنفس النوع في نفس الحي من العروض الحالية.",
  },
  {
    icon: Clock,
    title: "مواعيد العمل",
    description: "تواصل عبر الواتساب أو الهاتف، من السبت إلى الخميس، 9 صباحًا - 9 مساءً.",
  },
];

export default function AboutPage() {
  // الكيان نفسه معرّف في رسم الموقع (app/layout.tsx)؛ هنا صفحة «عن» تشير إليه فقط (لا تعريف ثانٍ متعارض)
  const modified = editorialIso("/about/", "modified");
  const pageGraph = graph(
    webPage({
      path: "/about/",
      type: "AboutPage",
      name: "عن التيسير للعقارات",
      about: ORG,
      mainEntity: ORG,
      dateModified: modified,
      lastReviewed: editorialIso("/about/", "reviewed"),
      reviewedBy: ORG,
    }),
    breadcrumbNode("/about/", [
      { name: "الرئيسية", path: "/" },
      { name: "عن الشركة", path: "/about/" },
    ])
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd graph={pageGraph} />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-orange-600 font-medium">عن الشركة</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            التيسير للعقارات
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            وسيط عقاري مقره دمياط الجديدة: عقارات للبيع في دمياط الجديدة والمنصورة الجديدة، ووساطة موثّقة لإعادة
            بيع أراضي بيت الوطن. التيسير منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">من نحن</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>التيسير للعقارات</strong> (eltaiseer.com) وسيط عقاري مقره دمياط الجديدة، يعمل في مدينتي <strong>دمياط الجديدة</strong> و<strong>المنصورة الجديدة</strong>.
                نعرض كل عقار بسعره المطلوب ومساحته وحيه، وننشر وسيط سعر المتر لكل حي محسوبًا من العروض الحالية.
              </p>
              <p>
                العروض تشمل الشقق السكنية، والفيلات المستقلة، والدوبلكس، والبنتهاوس، والأراضي السكنية والتجارية، والمحلات
                التجارية، والعيادات، والشاليهات، وعددها الحالي في <Link href="/properties" className="text-orange-600 hover:underline">صفحة العقارات</Link>.
              </p>
              <p>
                في <strong>دمياط الجديدة</strong>، نغطي جميع الأحياء من الحي الأول إلى السادس، إضافة إلى مشاريع الإسكان القومي مثل مشروع جنة ودار مصر وسكن مصر، ومناطق بيت الوطن السكنية. 
                وفي <strong>المنصورة الجديدة</strong>، نوفر عقارات في مناطق R1 إلى R7، حي الفيلات، داون تاون، سكن لكل المصريين، والعديد من المناطق الأخرى.
              </p>
              <p>
                طريقة الدفع يحددها كل بائع وتظهر في صفحة العقار، والعقارات التي تقبل التقسيط في{" "}
                <Link href="/properties/installments" className="text-orange-600 hover:underline">صفحة عقارات بالتقسيط</Link>.
                ونقدم خدمة <strong>التقييم العقاري المجاني</strong> لمعرفة السعر المناسب لعقارك.
              </p>
              <p>
                وندير <Link href="/beit-al-watan-for-sale/" className="text-orange-600 hover:underline">وساطة موثّقة لإعادة بيع أراضي بيت الوطن</Link>{" "}
                بالتنازل الرسمي، وأداة <BrandPlatformLink className="text-orange-600 hover:underline" /> المجانية للحاجزين.
                التيسير منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية ولا تمثلها، وحجز أراضي الهيئة يتم على موقعها فقط.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl -mt-6 mb-6">
        <Freshness reviewed={modified} />
      </div>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">لماذا التيسير للعقارات؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">مناطق خدمتنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-orange-600 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  دمياط الجديدة
                </h3>
                <p className="text-gray-600 mb-4 text-sm">مدينة على ساحل البحر المتوسط تتبع محافظة دمياط، وأحياؤها الرئيسية مأهولة.</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> الأحياء: الأول، الثاني، الثالث، الرابع، الخامس، المتميز</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> مشاريع: جنة، دار مصر، سكن مصر؛ ومناطق بيت الوطن السكنية</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> المنطقة المركزية ومنطقة الشاليهات</li>
                </ul>
                <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600 w-full">
                  <Link href="/new-damietta">استكشف عقارات دمياط الجديدة</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-emerald-600 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  المنصورة الجديدة
                </h3>
                <p className="text-gray-600 mb-4 text-sm">مدينة من مدن الجيل الرابع على ساحل البحر المتوسط تتبع محافظة الدقهلية.</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> أحياء سكنية: R1-R7 والأحياء السكنية</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> مشاريع: سكن لكل المصريين، دار مصر، جنة</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> فيلات، داون تاون، الواجهة البحرية</li>
                </ul>
                <Button asChild className="mt-4 bg-emerald-500 hover:bg-emerald-600 w-full">
                  <Link href="/new-mansoura">استكشف عقارات المنصورة الجديدة</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">هل تبحث عن عقار؟</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            تواصل معنا عبر الواتساب ونرسل لك العروض المناسبة لميزانيتك والحي الذي تريده.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/properties">تصفح العقارات</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-orange-600">
              <a href="https://wa.me/201500775974" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                تواصل عبر الواتساب
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
