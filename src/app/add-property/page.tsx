"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  ChevronLeft, 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  Ruler,
  BedDouble,
  Bath
} from "lucide-react";

const PROPERTY_TYPES = [
  "شقة",
  "شقة فاخرة", 
  "فيلا منفصلة",
  "تاون هاوس",
  "دوبلكس",
  "بنتهاوس",
  "أرض سكنية",
  "أرض تجارية",
  "محل تجاري",
  "مكتب إداري",
  "عيادة",
  "شاليه",
];

const CITIES = [
  { id: "new-damietta", name: "دمياط الجديدة" },
  { id: "new-mansoura", name: "المنصورة الجديدة" },
];

export default function AddPropertyPage() {
  const [formData, setFormData] = useState({
    propertyType: "",
    city: "",
    district: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    phone: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppMessage = () => {
    const message = `
🏠 *طلب إضافة عقار جديد*

📋 *تفاصيل العقار:*
• النوع: ${formData.propertyType || "غير محدد"}
• المدينة: ${formData.city || "غير محدد"}
• المنطقة/الحي: ${formData.district || "غير محدد"}
• المساحة: ${formData.area ? formData.area + " متر" : "غير محدد"}
• غرف النوم: ${formData.bedrooms || "غير محدد"}
• الحمامات: ${formData.bathrooms || "غير محدد"}
• السعر: ${formData.price ? formData.price + " جنيه" : "غير محدد"}

📞 *رقم التواصل:* ${formData.phone || "غير محدد"}

📝 *ملاحظات:*
${formData.notes || "لا يوجد"}

---
تم الإرسال من موقع التيسير للعقارات
    `.trim();

    return encodeURIComponent(message);
  };

  const handleWhatsAppSubmit = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/201500775974?text=${message}`, "_blank");
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
            <span className="text-orange-600 font-medium">إضافة عقار</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-10 w-10 text-orange-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">أضف عقارك مجاناً</h1>
              <p className="text-orange-200 mt-1">اعرض عقارك أمام آلاف الباحثين عن العقارات</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-500" />
                  بيانات العقار
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع العقار *
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">اختر نوع العقار</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline ml-1" />
                      المدينة *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">اختر المدينة</option>
                      {CITIES.map((city) => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحي / المنطقة *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="مثال: الحي الأول، R1، مشروع جنة"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Ruler className="h-4 w-4 inline ml-1" />
                      المساحة (متر مربع)
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="مثال: 120"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BedDouble className="h-4 w-4 inline ml-1" />
                      عدد غرف النوم
                    </label>
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">اختر</option>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>{num} غرف</option>
                      ))}
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Bath className="h-4 w-4 inline ml-1" />
                      عدد الحمامات
                    </label>
                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">اختر</option>
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>{num} حمام</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر المطلوب (جنيه)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="مثال: 1500000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline ml-1" />
                      رقم الهاتف للتواصل *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="مثال: 01500775974"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="أضف أي تفاصيل إضافية عن العقار مثل: نوع التشطيب، الدور، المميزات..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <Button
                    onClick={handleWhatsAppSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    إرسال عبر واتساب
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    سيتم فتح محادثة واتساب لإرسال بيانات عقارك
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">لماذا تضيف عقارك معنا؟</h3>
                <ul className="space-y-3">
                  {[
                    "إضافة مجانية 100%",
                    "وصول لآلاف الباحثين عن العقارات",
                    "عرض احترافي لعقارك",
                    "دعم فني متواصل",
                    "تسويق عبر منصات التواصل",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">تحتاج مساعدة؟</h3>
                <p className="text-gray-600 mb-4">
                  فريقنا جاهز لمساعدتك في إضافة عقارك والإجابة على استفساراتك
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-100"
                >
                  <a href="https://wa.me/201500775974" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    تواصل معنا
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Back to Properties */}
            <Button asChild variant="ghost" className="w-full">
              <Link href="/properties" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                تصفح العقارات المتاحة
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
