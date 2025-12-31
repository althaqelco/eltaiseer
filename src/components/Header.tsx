"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Phone, Menu, Home, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="h-14 md:h-16" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <Link
              href="/properties"
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              جميع العقارات
            </Link>
            <Link
              href="/favorites"
              className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1"
            >
              <Heart className="h-4 w-4" />
              المفضلة
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
              <Phone className="h-4 w-4" />
              تواصل معنا
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                الرئيسية
              </Link>
              <Link
                href="/properties"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                جميع العقارات
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                المفضلة
              </Link>
              <Button className="bg-orange-500 hover:bg-orange-600 gap-2 w-full">
                <Phone className="h-4 w-4" />
                تواصل معنا
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
