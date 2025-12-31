"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-20" variant="light" />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              منصتك الأولى للبحث عن العقارات في مدينة دمياط الجديدة. نقدم لك أفضل
              الشقق، الفيلات، المحلات التجارية، والأراضي في جميع أحياء المدينة
              مع التيسير للعقارات.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-orange-400">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors">
                  العقارات
                </Link>
              </li>
              <li>
                <Link href="/valuation" className="text-gray-400 hover:text-white transition-colors">
                  تقييم العقارات
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  المدونة
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  وظائف
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4 text-orange-400">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 text-orange-500" />
                <span dir="ltr">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>info@eltaiseer.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>دمياط الجديدة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="mb-6">
            <h4 className="font-bold mb-3 text-orange-400 text-sm">أقسام العقارات</h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <Link href="/properties/apartments" className="hover:text-orange-400 transition-colors">شقق للبيع في دمياط الجديدة</Link>
              <span>•</span>
              <Link href="/properties/villas" className="hover:text-orange-400 transition-colors">فيلات دمياط الجديدة</Link>
              <span>•</span>
              <Link href="/properties/lands" className="hover:text-orange-400 transition-colors">أراضي للبيع دمياط</Link>
              <span>•</span>
              <Link href="/properties/shops" className="hover:text-orange-400 transition-colors">محلات تجارية</Link>
              <span>•</span>
              <Link href="/properties/clinics" className="hover:text-orange-400 transition-colors">عيادات للبيع</Link>
              <span>•</span>
              <Link href="/properties/chalets" className="hover:text-orange-400 transition-colors">شاليهات دمياط الجديدة</Link>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="font-bold mb-3 text-orange-400 text-sm">أحياء دمياط الجديدة</h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <Link href="/properties/district/first-district" className="hover:text-orange-400 transition-colors">عقارات الحي الأول</Link>
              <span>•</span>
              <Link href="/properties/district/second-district" className="hover:text-orange-400 transition-colors">عقارات الحي الثاني</Link>
              <span>•</span>
              <Link href="/properties/district/third-district" className="hover:text-orange-400 transition-colors">عقارات الحي الثالث</Link>
              <span>•</span>
              <Link href="/properties/district/fourth-district" className="hover:text-orange-400 transition-colors">عقارات الحي الرابع</Link>
              <span>•</span>
              <Link href="/properties/district/fifth-district" className="hover:text-orange-400 transition-colors">عقارات الحي الخامس</Link>
              <span>•</span>
              <Link href="/properties/district/janna-project" className="hover:text-orange-400 transition-colors">مشروع جنة</Link>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 mt-4 pt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <Link href="/terms" className="hover:text-orange-400 transition-colors">الشروط والأحكام</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-orange-400 transition-colors">سياسة الخصوصية</Link>
          <span>•</span>
          <Link href="/cookies" className="hover:text-orange-400 transition-colors">سياسة ملفات تعريف الارتباط</Link>
          <span>•</span>
          <Link href="/sitemap-page" className="hover:text-orange-400 transition-colors">خريطة الموقع</Link>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 text-center text-gray-500">
          <p className="mb-2">
            © {new Date().getFullYear()} التيسير للعقارات. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-gray-600">
            التيسير للعقارات - شريكك الموثوق في عقارات دمياط الجديدة | شقق للبيع | فيلات | دوبلكس | أراضي | محلات تجارية
          </p>
        </div>
      </div>
    </footer>
  );
}
