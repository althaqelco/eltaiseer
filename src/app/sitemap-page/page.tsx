import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Map, Building2, MapPin, FileText, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "خريطة الموقع",
  description: "خريطة موقع التيسير للعقارات - جميع صفحات الموقع والأقسام والعقارات",
  alternates: {
    canonical: "https://eltaiseer.com/sitemap-page",
  },
};

const siteLinks = {
  main: [
    { name: "الرئيسية", href: "/" },
    { name: "جميع العقارات", href: "/properties" },
    { name: "المفضلة", href: "/favorites" },
  ],
  categories: [
    { name: "شقق للبيع", href: "/properties/apartments" },
    { name: "فيلات للبيع", href: "/properties/villas" },
    { name: "أراضي للبيع", href: "/properties/lands" },
    { name: "محلات تجارية", href: "/properties/shops" },
    { name: "عيادات للبيع", href: "/properties/clinics" },
    { name: "شاليهات", href: "/properties/chalets" },
  ],
  districts: [
    { name: "الحي الأول", href: "/properties/district/first-district" },
    { name: "الحي الثاني", href: "/properties/district/second-district" },
    { name: "الحي الثالث", href: "/properties/district/third-district" },
    { name: "الحي الرابع", href: "/properties/district/fourth-district" },
    { name: "الحي الخامس", href: "/properties/district/fifth-district" },
    { name: "الحي السادس", href: "/properties/district/sixth-district" },
    { name: "مشروع جنة", href: "/properties/district/janna-project" },
    { name: "دار مصر", href: "/properties/district/dar-misr" },
    { name: "سكن مصر", href: "/properties/district/sakan-misr" },
    { name: "بيت الوطن", href: "/properties/district/beit-al-watan" },
    { name: "المنطقة المركزية", href: "/properties/district/central-area" },
    { name: "الشاليهات", href: "/properties/district/chalets" },
  ],
  services: [
    { name: "تقييم العقارات", href: "/valuation" },
    { name: "المدونة", href: "/blog" },
    { name: "وظائف", href: "/careers" },
  ],
  legal: [
    { name: "الشروط والأحكام", href: "/terms" },
    { name: "سياسة الخصوصية", href: "/privacy" },
    { name: "سياسة ملفات تعريف الارتباط", href: "/cookies" },
  ],
};

export default function SitemapPage() {
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
            <span className="text-orange-600 font-medium">خريطة الموقع</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Map className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">خريطة الموقع</h1>
              <p className="text-gray-300 mt-2">جميع صفحات الموقع في مكان واحد</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Main Pages */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Home className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">الصفحات الرئيسية</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.main.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">أقسام العقارات</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Districts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">الأحياء والمناطق</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.districts.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">خدماتنا</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">معلومات قانونية</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
