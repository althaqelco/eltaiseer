import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, Mail, MessageCircle, Building2 } from "lucide-react";
import { COMPANY_TEL, COMPANY_WHATSAPP } from "@/lib/format";

export const metadata: Metadata = {
  title: "اتصل بنا | تواصل مع التيسير للعقارات",
  description:
    "تواصل مع التيسير للعقارات — واتساب واتصال مباشر 01500775974. مقرنا في دمياط الجديدة ونخدم دمياط الجديدة والمنصورة الجديدة، السبت إلى الخميس من 9 صباحاً حتى 9 مساءً.",
  alternates: {
    canonical: "https://eltaiseer.com/contact/",
  },
  openGraph: {
    title: "اتصل بنا | التيسير للعقارات",
    description: "واتساب واتصال مباشر 01500775974 — نخدم دمياط الجديدة والمنصورة الجديدة يومياً عدا الجمعة.",
    url: "https://eltaiseer.com/contact/",
    type: "website",
    locale: "ar_EG",
    siteName: "التيسير للعقارات",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "اتصل بنا - التيسير للعقارات",
  url: "https://eltaiseer.com/contact/",
  mainEntity: { "@id": "https://eltaiseer.com/#organization" },
};

const CONTACT_CHANNELS = [
  {
    icon: MessageCircle,
    title: "واتساب",
    value: "01500775974",
    hint: "أسرع وسيلة — رد خلال دقائق في مواعيد العمل",
    href: `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن عقار")}`,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    icon: Phone,
    title: "اتصال مباشر",
    value: "01500775974",
    hint: "السبت - الخميس، 9 صباحاً - 9 مساءً",
    href: `tel:${COMPANY_TEL}`,
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "info@eltaiseer.com",
    hint: "للمراسلات الرسمية وطلبات الشراكة",
    href: "mailto:info@eltaiseer.com",
    color: "bg-slate-700 hover:bg-slate-800",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Header />

      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "اتصل بنا" },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            تواصل مع التيسير للعقارات
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            سواء تبحث عن شقة أو فيلا أو أرض في دمياط الجديدة أو المنصورة الجديدة، أو
            تريد عرض عقارك للبيع — فريقنا جاهز لمساعدتك
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {CONTACT_CHANNELS.map((channel) => (
            <Card key={channel.title} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className={`w-14 h-14 ${channel.color.split(" ")[0]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <channel.icon className="h-7 w-7 text-white" />
                </div>
                <h2 className="font-bold text-lg text-gray-900 mb-1">{channel.title}</h2>
                <p className="text-gray-800 font-semibold mb-2" dir="ltr">{channel.value}</p>
                <p className="text-sm text-gray-500 mb-4">{channel.hint}</p>
                <Button asChild className={`w-full ${channel.color}`}>
                  <a href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    تواصل الآن
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">مقر الشركة</h3>
                  <p className="text-gray-600 leading-relaxed">
                    دمياط الجديدة، محافظة دمياط، مصر
                  </p>
                  <a
                    href="https://maps.google.com/?q=31.4175,31.8144"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline text-sm mt-2 inline-block"
                  >
                    عرض على خرائط جوجل ←
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">مواعيد العمل</h3>
                  <p className="text-gray-600">السبت - الخميس: 9 صباحاً - 9 مساءً</p>
                  <p className="text-gray-500 text-sm mt-1">الجمعة: إجازة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Areas */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">مناطق الخدمة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/new-damietta"
                className="block p-6 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-300 transition-colors"
              >
                <h3 className="font-bold text-orange-700 mb-2">دمياط الجديدة</h3>
                <p className="text-gray-600 text-sm">
                  كل الأحياء من الأول للسادس، مشاريع جنة ودار مصر وسكن مصر وبيت الوطن،
                  والمناطق المركزية والشاليهات
                </p>
              </Link>
              <Link
                href="/new-mansoura"
                className="block p-6 bg-emerald-50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors"
              >
                <h3 className="font-bold text-emerald-700 mb-2">المنصورة الجديدة</h3>
                <p className="text-gray-600 text-sm">
                  أحياء R1 حتى R7، حي الفيلات، داون تاون، سكن لكل المصريين، والواجهة
                  البحرية
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-3">عندك عقار وعايز تبيعه؟</h2>
          <p className="text-orange-100 mb-6 max-w-xl mx-auto">
            اعرض عقارك معنا مجاناً ووصّله لآلاف الباحثين عن عقارات في دمياط الجديدة
            والمنصورة الجديدة
          </p>
          <Button asChild size="lg" variant="secondary" className="font-bold">
            <Link href="/add-property">أضف عقارك مجاناً</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
