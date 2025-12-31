import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Briefcase, Users, TrendingUp, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "وظائف | انضم لفريق التيسير للعقارات",
  description: "انضم لفريق التيسير للعقارات - فرص عمل متميزة في مجال العقارات بدمياط الجديدة",
  alternates: {
    canonical: "https://eltaiseer.com/careers",
  },
};

const benefits = [
  { icon: TrendingUp, title: "فرص نمو", description: "بيئة عمل تدعم التطور المهني والترقي" },
  { icon: Users, title: "فريق متميز", description: "العمل مع فريق محترف وودود" },
  { icon: Heart, title: "بيئة إيجابية", description: "بيئة عمل محفزة ومريحة" },
];

const openPositions = [
  {
    title: "مستشار عقاري",
    type: "دوام كامل",
    location: "دمياط الجديدة",
    description: "نبحث عن مستشار عقاري ذو خبرة للانضمام لفريقنا ومساعدة العملاء في إيجاد العقار المناسب.",
  },
  {
    title: "مسوق رقمي",
    type: "دوام كامل",
    location: "دمياط الجديدة / عن بعد",
    description: "نبحث عن مسوق رقمي متخصص في السوشيال ميديا وتحسين محركات البحث.",
  },
  {
    title: "مصور عقارات",
    type: "دوام جزئي",
    location: "دمياط الجديدة",
    description: "نبحث عن مصور محترف لتصوير العقارات وإنتاج محتوى مرئي عالي الجودة.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
            <span className="text-orange-600 font-medium">وظائف</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <Briefcase className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">انضم لفريقنا</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            نبحث دائماً عن المواهب المتميزة للانضمام لفريق التيسير للعقارات. 
            اكتشف الفرص المتاحة وابدأ مسيرتك المهنية معنا.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        
        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">لماذا التيسير للعقارات؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">الوظائف المتاحة</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                          {position.type}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {position.location}
                        </span>
                      </div>
                      <p className="text-gray-600">{position.description}</p>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap gap-2">
                      <Send className="h-4 w-4" />
                      تقدم الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">لم تجد الوظيفة المناسبة؟</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            أرسل سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة
          </p>
          <Button variant="secondary" size="lg" className="gap-2">
            <Send className="h-5 w-5" />
            أرسل سيرتك الذاتية
          </Button>
        </section>

      </main>

      <Footer />
    </div>
  );
}
