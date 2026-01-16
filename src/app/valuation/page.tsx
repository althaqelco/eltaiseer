"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, Calculator, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PLACE_CATEGORIES } from "@/lib/egyptPlaces";

const propertyTypes = ["شقة", "فيلا", "دوبلكس", "أرض", "محل تجاري", "عيادة", "شاليه"];
const finishingTypes = ["بدون تشطيب", "نصف تشطيب", "تشطيب كامل", "سوبر لوكس"];

export default function ValuationPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    propertyType: "",
    district: "",
    area: "",
    finishing: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <span className="text-orange-600 font-medium">تقييم العقارات</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">تقييم العقارات</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            احصل على تقييم مجاني ودقيق لعقارك من خبراء التيسير للعقارات
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">لماذا تقييم عقارك معنا؟</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">تقييم مجاني</h3>
                  <p className="text-gray-600">خدمة التقييم مجانية تماماً بدون أي رسوم</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">خبرة واسعة</h3>
                  <p className="text-gray-600">فريق من الخبراء بخبرة +10 سنوات في سوق دمياط الجديدة</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">تقييم دقيق</h3>
                  <p className="text-gray-600">تقييم مبني على بيانات السوق الفعلية والأسعار الحالية</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">رد سريع</h3>
                  <p className="text-gray-600">نتواصل معك خلال 24 ساعة من إرسال الطلب</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-orange-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">تواصل مباشرة</h3>
              <p className="text-gray-600 mb-4">للاستفسارات السريعة، تواصل معنا مباشرة</p>
              <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
                <Phone className="h-4 w-4" />
                01000000000
              </Button>
            </div>
          </div>

          {/* Form */}
          <div>
            <Card className="shadow-xl">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">تم إرسال طلبك بنجاح!</h3>
                    <p className="text-gray-600 mb-6">سنتواصل معك خلال 24 ساعة</p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      إرسال طلب آخر
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">طلب تقييم عقار</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">الاسم</Label>
                          <Input
                            id="name"
                            placeholder="اسمك الكريم"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            placeholder="01xxxxxxxxx"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>نوع العقار</Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, propertyType: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع العقار" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>المنطقة</Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, district: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المنطقة" />
                          </SelectTrigger>
                          <SelectContent>
                            {PLACE_CATEGORIES.map((cat) => (
                              cat.districts.map((district) => (
                                <SelectItem key={district} value={district}>{district}</SelectItem>
                              ))
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="area">المساحة (م²)</Label>
                          <Input
                            id="area"
                            type="number"
                            placeholder="مثال: 120"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <Label>التشطيب</Label>
                          <Select onValueChange={(v) => setFormData({ ...formData, finishing: v })}>
                            <SelectTrigger>
                              <SelectValue placeholder="نوع التشطيب" />
                            </SelectTrigger>
                            <SelectContent>
                              {finishingTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg">
                        طلب التقييم المجاني
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
