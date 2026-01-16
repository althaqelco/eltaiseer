import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Map, MapPin, FileText, Users } from "lucide-react";

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
    { name: "لوحة التحكم", href: "/dashboard" },
  ],
  ndDistricts: [
    { name: "جميع عقارات دمياط الجديدة", href: "/new-damietta" },
    { name: "الحي الأول", href: "/new-damietta/first-district" },
    { name: "الحي الثاني", href: "/new-damietta/second-district" },
    { name: "الحي الثالث", href: "/new-damietta/third-district" },
    { name: "الحي الرابع", href: "/new-damietta/fourth-district" },
    { name: "الحي الخامس", href: "/new-damietta/fifth-district" },
    { name: "الحي السادس (المتميز)", href: "/new-damietta/sixth-district" },
    { name: "مشروع جنة", href: "/new-damietta/janna-project" },
    { name: "دار مصر - موقع 1", href: "/new-damietta/dar-misr-1" },
    { name: "دار مصر - موقع 2", href: "/new-damietta/dar-misr-2" },
    { name: "سكن مصر - جنوب الحي الأول", href: "/new-damietta/sakan-misr-south" },
    { name: "سكن مصر - غرب الجامعات", href: "/new-damietta/sakan-misr-west" },
    { name: "بيت الوطن - شرق", href: "/new-damietta/beit-al-watan-east" },
    { name: "بيت الوطن - غرب", href: "/new-damietta/beit-al-watan-west" },
    { name: "بيت الوطن - امتداد الشاطئ", href: "/new-damietta/beit-al-watan-beach" },
    { name: "المنطقة المركزية (أ)", href: "/new-damietta/central-area-a" },
    { name: "المنطقة المركزية (ب)", href: "/new-damietta/central-area-b" },
    { name: "المنطقة المركزية (ج)", href: "/new-damietta/central-area-c" },
    { name: "منطقة الشاليهات", href: "/new-damietta/chalets" },
  ],
  nmDistricts: [
    { name: "جميع عقارات المنصورة الجديدة", href: "/new-mansoura" },
    { name: "R1", href: "/new-mansoura/r1" },
    { name: "R2", href: "/new-mansoura/r2" },
    { name: "R3", href: "/new-mansoura/r3" },
    { name: "R4", href: "/new-mansoura/r4" },
    { name: "R5", href: "/new-mansoura/r5" },
    { name: "R6", href: "/new-mansoura/r6" },
    { name: "R7", href: "/new-mansoura/r7" },
    { name: "الحي السكني الأول", href: "/new-mansoura/residential-1" },
    { name: "الحي السكني الثاني", href: "/new-mansoura/residential-2" },
    { name: "الحي السكني الثالث", href: "/new-mansoura/residential-3" },
    { name: "سكن لكل المصريين", href: "/new-mansoura/sakan-kol-misryeen" },
    { name: "سكن لكل المصريين 2", href: "/new-mansoura/sakan-kol-misryeen-2" },
    { name: "سكن لكل المصريين 3", href: "/new-mansoura/sakan-kol-misryeen-3" },
    { name: "دار مصر", href: "/new-mansoura/dar-misr" },
    { name: "جنة", href: "/new-mansoura/janna" },
    { name: "الإسكان المتوسط", href: "/new-mansoura/medium-housing" },
    { name: "الإسكان الاجتماعي", href: "/new-mansoura/social-housing" },
    { name: "حي الفيلات", href: "/new-mansoura/villas-district" },
    { name: "منطقة الفيلات D", href: "/new-mansoura/villas-d" },
    { name: "فيلات الجولف", href: "/new-mansoura/golf-villas" },
    { name: "فيلات البحيرات", href: "/new-mansoura/lake-villas" },
    { name: "داون تاون", href: "/new-mansoura/downtown" },
    { name: "المول التجاري المركزي", href: "/new-mansoura/central-mall" },
    { name: "منطقة الأعمال المركزية CBD", href: "/new-mansoura/cbd" },
    { name: "المحور التجاري", href: "/new-mansoura/commercial-axis" },
    { name: "منطقة الخدمات", href: "/new-mansoura/services-zone" },
    { name: "الحديقة المركزية", href: "/new-mansoura/central-park" },
    { name: "منطقة الكورنيش", href: "/new-mansoura/corniche" },
    { name: "النادي الاجتماعي", href: "/new-mansoura/social-club" },
    { name: "المنطقة السياحية", href: "/new-mansoura/touristic-zone" },
    { name: "الواجهة البحرية", href: "/new-mansoura/waterfront" },
    { name: "شاطئ المنصورة الجديدة", href: "/new-mansoura/beach" },
    { name: "منتجعات الساحل", href: "/new-mansoura/coastal-resorts" },
  ],
  blog: [
    { name: "المدونة", href: "/blog" },
    { name: "دليل شراء الشقق", href: "/blog/buying-apartment-guide" },
    { name: "أفضل الأحياء", href: "/blog/best-districts" },
    { name: "نصائح التشطيب", href: "/blog/finishing-tips" },
    { name: "دليل الاستثمار العقاري", href: "/blog/investment-guide" },
    { name: "مشروعات الإسكان القومية", href: "/blog/national-housing-projects" },
  ],
  services: [
    { name: "تقييم العقارات", href: "/valuation" },
    { name: "إضافة عقار", href: "/add-property" },
  ],
  legal: [
    { name: "الشروط والأحكام", href: "/terms" },
    { name: "سياسة الخصوصية", href: "/privacy" },
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

          {/* New Damietta Districts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">أحياء دمياط الجديدة</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.ndDistricts.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* New Mansoura Districts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">أحياء المنصورة الجديدة</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.nmDistricts.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">المدونة</h2>
            </div>
            <ul className="space-y-3">
              {siteLinks.blog.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
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
                  <Link href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2">
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
