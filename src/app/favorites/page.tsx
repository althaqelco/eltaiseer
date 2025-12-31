"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ArrowRight, ChevronLeft, Home } from "lucide-react";
import { getFavorites, clearFavorites } from "@/lib/favoritesStore";
import { getPropertyById } from "@/lib/propertyStore";
import { Property } from "@/lib/mockData";

export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favoriteIds = getFavorites();
    const properties: Property[] = [];
    
    favoriteIds.forEach((id) => {
      const property = getPropertyById(id);
      if (property) {
        properties.push(property);
      }
    });
    
    setFavoriteProperties(properties);
    setIsLoading(false);
  };

  const handleClearAll = () => {
    if (confirm("هل أنت متأكد من حذف جميع المفضلة؟")) {
      clearFavorites();
      setFavoriteProperties([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
            <span className="text-orange-600 font-medium">المفضلة</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-l from-gray-900 via-gray-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-orange-400 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              المفضلة
            </h1>
          </div>
          <p className="text-gray-300">
            {favoriteProperties.length} عقار محفوظ في المفضلة
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {favoriteProperties.length === 0 ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                لا توجد عقارات في المفضلة
              </h2>
              <p className="text-gray-500 mb-6">
                قم بإضافة العقارات للمفضلة لمراجعتها لاحقاً
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/properties">
                  <ArrowRight className="h-4 w-4 ms-2" />
                  تصفح العقارات
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                عرض {favoriteProperties.length} عقار
              </p>
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                حذف الكل
              </Button>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  onFavoriteChange={loadFavorites}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
