import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Building2, Users, Shield, Award, MapPin, Phone, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "عن التيسير للعقارات | شريكك الموثوق في عقارات دمياط الجديدة والمنصورة الجديدة",
  description: "التيسير للعقارات - شركة عقارية متخصصة في بيع الشقق والفيلات والأراضي في دمياط الجديدة والمنصورة الجديدة. خبرة واسعة في سوق العقارات المصرية وفريق محترف يساعدك في إيجاد العقار المناسب.",
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
    description: "شركة عقارية متخصصة في دمياط الجديدة والمنصورة الجديدة - خبرة وثقة واحترافية",
    url: "https://eltaiseer.com/about/",
    type: "website",
    locale: "ar_EG",
    siteName: "التيسير للعقارات",
  },
  twitter: {
    card: "summary_large_image",
    title: "عن التيسير للعقارات",
    description: "شركة عقارية متخصصة في دمياط الجديدة والمنصورة الجديدة",
  },
  alternates: {
    canonical: "https://eltaiseer.com/about/",
  },
};

const features = [
  {
    icon: Building2,
    title: "أكثر من 100 عقار",
    description: "تشكيلة واسعة من الشقق والفيلات والأراضي والمحلات التجارية في دمياط الجديدة والمنصورة الجديدة.",
  },
  {
    icon: MapPin,
    title: "تغطية 48+ منطقة",
    description: "نغطي جميع أحياء دمياط الجديدة (18 حي) والمنصورة الجديدة (30+ منطقة) بما يشمل مشاريع الإسكان القومي.",
  },
  {
    icon: Shield,
    title: "موثوقية وشفافية",
    description: "نقدم معلومات دقيقة وشفافة عن كل عقار. أسعار حقيقية وصور فعلية وبيانات موثقة.",
  },
  {
    icon: Users,
    title: "فريق محترف",
    description: "فريق من المستشارين العقاريين ذوي الخبرة في سوق العقارات بالمدن الجديدة، جاهزون لمساعدتك.",
  },
  {
    icon: Award,
    title: "خيارات دفع مرنة",
    description: "نوفر خيارات دفع تناسب الجميع: كاش بخصم خاص أو تقسيط حتى 10 سنوات بمقدم يبدأ من 10%.",
  },
  {
    icon: Clock,
    title: "خدمة سريعة",
    description: "تواصل فوري عبر الواتساب، ورد سريع على جميع الاستفسارات. متاحون من السبت للخميس، 9 صباحاً - 9 مساءً.",
  },
];

const stats = [
  { number: "100+", label: "عقار متاح" },
  { number: "48+", label: "منطقة وحي" },
  { number: "2", label: "مدن جديدة" },
  { number: "10", label: "سنوات تقسيط" },
];

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "عن التيسير للعقارات",
    description: "التيسير للعقارات - شركة عقارية متخصصة في بيع العقارات في دمياط الجديدة والمنصورة الجديدة",
    url: "https://eltaiseer.com/about/",
    mainEntity: {
      "@type": "RealEstateAgent",
      "@id": "https://eltaiseer.com/#organization",
      name: "التيسير للعقارات",
      alternateName: "El Taiseer Real Estate",
      description: "شركة التيسير للعقارات متخصصة في بيع الشقق والفيلات والأراضي والمحلات التجارية في دمياط الجديدة والمنصورة الجديدة. نقدم أكثر من 100 عقار في 48+ منطقة مع خيارات دفع مرنة تشمل الكاش والتقسيط حتى 10 سنوات.",
      url: "https://eltaiseer.com",
      telephone: "+201558245974",
      areaServed: [
        { "@type": "City", name: "دمياط الجديدة", containedInPlace: { "@type": "State", name: "دمياط" } },
        { "@type": "City", name: "المنصورة الجديدة", containedInPlace: { "@type": "State", name: "الدقهلية" } },
      ],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "بيع شقق سكنية" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "بيع فيلات" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "بيع أراضي" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "بيع محلات تجارية" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "تقييم عقاري مجاني" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "استشارات عقارية" } },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
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
            شريكك الموثوق في عالم العقارات. نساعدك في إيجاد العقار المثالي في دمياط الجديدة والمنصورة الجديدة 
            بأسعار تنافسية وخيارات دفع مرنة.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">من نحن</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>التيسير للعقارات</strong> هي شركة عقارية متخصصة تعمل في مدينتي <strong>دمياط الجديدة</strong> و<strong>المنصورة الجديدة</strong>. 
                نؤمن بأن إيجاد العقار المناسب يجب أن يكون تجربة سهلة وموثوقة، ولذلك نعمل بجد لتقديم أفضل الخيارات العقارية مع الشفافية الكاملة في الأسعار والمعلومات.
              </p>
              <p>
                نقدم تشكيلة واسعة تضم أكثر من <strong>100 عقار</strong> متنوع يشمل الشقق السكنية، الفيلات المستقلة، الدوبلكس، البنتهاوس، 
                الأراضي السكنية والتجارية، المحلات التجارية، العيادات الطبية، والشاليهات. تغطي عقاراتنا <strong>48+ منطقة وحي</strong> في المدينتين.
              </p>
              <p>
                في <strong>دمياط الجديدة</strong>، نغطي جميع الأحياء من الحي الأول إلى السادس، إضافة إلى مشاريع الإسكان القومي مثل مشروع جنة ودار مصر وسكن مصر وبيت الوطن. 
                وفي <strong>المنصورة الجديدة</strong>، نوفر عقارات في مناطق R1 إلى R7، حي الفيلات، داون تاون، سكن لكل المصريين، والعديد من المناطق الأخرى.
              </p>
              <p>
                نوفر <strong>خيارات دفع مرنة</strong> تناسب جميع الميزانيات، من الدفع الكاش بخصم خاص إلى التقسيط حتى 10 سنوات بمقدم يبدأ من 10%. 
                كما نقدم خدمة <strong>التقييم العقاري المجاني</strong> لمساعدتك في معرفة القيمة الحقيقية لعقارك.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                <p className="text-gray-600 mb-4 text-sm">مدينة مكتملة البنية التحتية على ساحل البحر المتوسط. تضم 18 منطقة سكنية متنوعة.</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> الأحياء: الأول، الثاني، الثالث، الرابع، الخامس، المتميز</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> مشاريع: جنة، دار مصر، سكن مصر، بيت الوطن</li>
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
                <p className="text-gray-600 mb-4 text-sm">مدينة الجيل الرابع بتخطيط عالمي وبنية تحتية ذكية. تضم 30+ منطقة متنوعة.</p>
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
            تواصل معنا الآن عبر الواتساب وسنساعدك في إيجاد العقار المناسب لك بأفضل سعر وأفضل موقع.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/properties">تصفح العقارات</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-orange-600">
              <a href="https://wa.me/201558245974" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
