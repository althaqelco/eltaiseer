"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Phone, Menu, Home, Heart, MapPin, ChevronDown, Building2, Landmark, Waves, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const DISTRICT_MENU = [
  {
    title: "الأحياء السكنية",
    icon: Building2,
    color: "text-orange-500",
    items: [
      { name: "الحي الأول", slug: "first-district" },
      { name: "الحي الثاني", slug: "second-district" },
      { name: "الحي الثالث", slug: "third-district" },
      { name: "الحي الرابع", slug: "fourth-district" },
      { name: "الحي الخامس", slug: "fifth-district" },
      { name: "الحي المتميز", slug: "sixth-district" },
    ],
  },
  {
    title: "المشروعات القومية",
    icon: Landmark,
    color: "text-blue-500",
    items: [
      { name: "مشروع جنة", slug: "janna-project" },
      { name: "دار مصر", slug: "dar-misr" },
      { name: "سكن مصر", slug: "sakan-misr" },
      { name: "بيت الوطن", slug: "beit-al-watan" },
    ],
  },
  {
    title: "المناطق المركزية",
    icon: MapPin,
    color: "text-purple-500",
    items: [
      { name: "المنطقة المركزية", slug: "central-area" },
    ],
  },
  {
    title: "المناطق الساحلية",
    icon: Waves,
    color: "text-cyan-500",
    items: [
      { name: "الشاليهات", slug: "chalets" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [districtsOpen, setDistrictsOpen] = useState(false);
  const [mobileDistrictsOpen, setMobileDistrictsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDistrictsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="h-14 md:h-16" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            
            <Link
              href="/properties"
              className="text-gray-600 hover:text-orange-500 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              جميع العقارات
            </Link>

            {/* Districts Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDistrictsOpen(!districtsOpen)}
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                <MapPin className="h-4 w-4" />
                الأحياء
                <ChevronDown className={`h-4 w-4 transition-transform ${districtsOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {districtsOpen && (
                <div className="absolute top-full right-0 mt-2 w-[500px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 grid grid-cols-2 gap-4 z-50">
                  {DISTRICT_MENU.map((category) => (
                    <div key={category.title}>
                      <div className={`flex items-center gap-2 font-semibold mb-2 ${category.color}`}>
                        <category.icon className="h-4 w-4" />
                        {category.title}
                      </div>
                      <ul className="space-y-1">
                        {category.items.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/properties/district/${item.slug}`}
                              onClick={() => setDistrictsOpen(false)}
                              className="block px-3 py-1.5 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg text-sm transition-colors"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/favorites"
              className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              <Heart className="h-4 w-4" />
              المفضلة
            </Link>

            <Link
              href="/blog"
              className="text-gray-600 hover:text-orange-500 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              المدونة
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="tel:+201558245974">
              <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
                <Phone className="h-4 w-4" />
                تواصل معنا
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                <Home className="h-4 w-4" />
                الرئيسية
              </Link>
              
              <Link
                href="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-orange-500 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                جميع العقارات
              </Link>

              {/* Mobile Districts Accordion */}
              <div>
                <button
                  onClick={() => setMobileDistrictsOpen(!mobileDistrictsOpen)}
                  className="w-full text-gray-600 hover:text-orange-500 transition-colors flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-50"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    الأحياء
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileDistrictsOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileDistrictsOpen && (
                  <div className="mt-2 mr-4 space-y-3">
                    {DISTRICT_MENU.map((category) => (
                      <div key={category.title}>
                        <div className={`flex items-center gap-2 font-medium text-sm mb-1 ${category.color}`}>
                          <category.icon className="h-3 w-3" />
                          {category.title}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {category.items.map((item) => (
                            <Link
                              key={item.slug}
                              href={`/properties/district/${item.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-xs px-2 py-1 bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 rounded-full transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                <Heart className="h-4 w-4" />
                المفضلة
              </Link>

              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-orange-500 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                المدونة
              </Link>

              <Link href="tel:+201558245974" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-orange-500 hover:bg-orange-600 gap-2 w-full mt-2">
                  <Phone className="h-4 w-4" />
                  تواصل معنا
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
