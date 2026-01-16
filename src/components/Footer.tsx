"use client";

import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
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
              منصتك الأولى للبحث عن العقارات في دمياط الجديدة والمنصورة الجديدة. نقدم لك أفضل
              الشقق، الفيلات، المحلات التجارية، والأراضي في جميع أحياء المدن الجديدة
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
                <a href="tel:+201558245974" dir="ltr" className="hover:text-white transition-colors">+20 155 824 5974</a>
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
            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a 
                href="https://www.instagram.com/eltaiseercom" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@eltaiseer.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61586663700452" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Cities Districts Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          {/* دمياط الجديدة */}
          <div className="mb-6">
            <h4 className="font-bold mb-3 text-orange-400 text-sm">أحياء دمياط الجديدة</h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <Link href="/new-damietta" className="hover:text-orange-400 transition-colors">جميع عقارات دمياط الجديدة</Link>
              <span>•</span>
              <Link href="/new-damietta/first-district" className="hover:text-orange-400 transition-colors">الحي الأول</Link>
              <span>•</span>
              <Link href="/new-damietta/second-district" className="hover:text-orange-400 transition-colors">الحي الثاني</Link>
              <span>•</span>
              <Link href="/new-damietta/janna-project" className="hover:text-orange-400 transition-colors">مشروع جنة</Link>
              <span>•</span>
              <Link href="/new-damietta/chalets" className="hover:text-orange-400 transition-colors">الشاليهات</Link>
            </div>
          </div>
          {/* المنصورة الجديدة */}
          <div className="mb-6">
            <h4 className="font-bold mb-3 text-emerald-400 text-sm">أحياء المنصورة الجديدة</h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <Link href="/new-mansoura" className="hover:text-emerald-400 transition-colors">جميع عقارات المنصورة الجديدة</Link>
              <span>•</span>
              <Link href="/new-mansoura/r1" className="hover:text-emerald-400 transition-colors">R1</Link>
              <span>•</span>
              <Link href="/new-mansoura/r2" className="hover:text-emerald-400 transition-colors">R2</Link>
              <span>•</span>
              <Link href="/new-mansoura/villas-district" className="hover:text-emerald-400 transition-colors">حي الفيلات</Link>
              <span>•</span>
              <Link href="/new-mansoura/downtown" className="hover:text-emerald-400 transition-colors">داون تاون</Link>
              <span>•</span>
              <Link href="/new-mansoura/waterfront" className="hover:text-emerald-400 transition-colors">الواجهة البحرية</Link>
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
            التيسير للعقارات - شريكك الموثوق في عقارات دمياط الجديدة والمنصورة الجديدة | شقق للبيع | فيلات | دوبلكس | أراضي | محلات تجارية
          </p>
        </div>
      </div>
    </footer>
  );
}
