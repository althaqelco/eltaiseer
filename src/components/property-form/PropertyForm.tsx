"use client";

// نموذج العقار المشترك بين صفحتي الإضافة والتعديل
// الاختلافات بين الوضعين محكومة بخاصية mode للحفاظ على نفس السلوك السابق تماماً

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  MapPin,
  Home,
  DollarSign,
  Image as ImageIcon,
  Phone,
  CheckCircle2,
  Plus,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { CITIES, CITY_DATA, FINISHING_TYPES, FLOOR_LEVELS, AMENITIES } from "@/lib/egyptPlaces";
import { PROPERTY_TYPES, INSTALLMENT_YEARS_OPTIONS } from "@/lib/propertyConstants";
import type { PropertyFormApi } from "./usePropertyForm";

interface PropertyFormProps {
  mode: "add" | "edit";
  form: PropertyFormApi;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  /* بطاقات إضافية أسفل الشريط الجانبي (مثل بطاقة معلومات العقار في صفحة التعديل) */
  extraSidebar?: React.ReactNode;
}

export function PropertyForm({ mode, form, isSubmitting, onSubmit, extraSidebar }: PropertyFormProps) {
  const {
    formData,
    selectedAmenities,
    imageUrls,
    newImageUrl,
    setNewImageUrl,
    isUploading,
    uploadProgress,
    fileInputRef,
    handleChange,
    toggleAmenity,
    addImageUrl,
    removeImageUrl,
    handleFileUpload,
  } = form;

  const isEdit = mode === "edit";
  const uploadInputId = isEdit ? "image-upload-edit" : "image-upload";

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-orange-500" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان العقار *
                </label>
                <Input
                  required
                  placeholder="مثال: شقة 120 متر بالحي الأول"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف العقار
                </label>
                <textarea
                  placeholder="أدخل وصف تفصيلي للعقار..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع العقار *
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر (جنيه) *
                  </label>
                  <Input
                    required
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* City Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة *
                </label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => {
                    handleChange("city", value);
                    handleChange("district", ""); // Reset district when city changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CITIES).map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة *
                </label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleChange("district", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {CITY_DATA[formData.city].categories.map((category) => (
                      <SelectGroup key={category.id}>
                        <SelectLabel
                          className={`font-bold ${
                            formData.city === "new-damietta" ? "text-orange-600" : "text-emerald-600"
                          }`}
                        >
                          {category.nameAr}
                        </SelectLabel>
                        {category.districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان التفصيلي
                </label>
                <Input
                  placeholder="مثال: 15 شارع الجمهورية"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-500" />
                التفاصيل والمواصفات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المساحة (م²) *
                  </label>
                  <Input
                    required
                    type="number"
                    placeholder="0"
                    value={formData.area_sqm}
                    onChange={(e) => handleChange("area_sqm", e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    غرف النوم
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleChange("bedrooms", e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحمامات
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.bathrooms}
                    onChange={(e) => handleChange("bathrooms", e.target.value)}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الدور
                  </label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleChange("level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {FLOOR_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التشطيب
                </label>
                <Select
                  value={formData.finishing}
                  onValueChange={(value) => handleChange("finishing", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التشطيب" />
                  </SelectTrigger>
                  <SelectContent>
                    {FINISHING_TYPES.map((finish) => (
                      <SelectItem key={finish} value={finish}>
                        {finish}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* حالة العقار في وضع التعديل تشمل خيار "تم البيع" */}
              {isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حالة العقار
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جاهز">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          جاهز للسكن
                        </span>
                      </SelectItem>
                      <SelectItem value="تحت الإنشاء">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          تحت الإنشاء
                        </span>
                      </SelectItem>
                      <SelectItem value="تم البيع">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          تم البيع
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  المميزات والخدمات
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {selectedAmenities.includes(amenity) && (
                        <CheckCircle2 className="h-3 w-3 me-1" />
                      )}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                خيارات الدفع والتقسيط
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEdit ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    طريقة الدفع
                  </label>
                  <Select
                    value={formData.paymentType}
                    onValueChange={(value) => handleChange("paymentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="كاش">كاش (نقدي)</SelectItem>
                      <SelectItem value="تقسيط">تقسيط فقط</SelectItem>
                      <SelectItem value="كاش أو تقسيط">كاش أو تقسيط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حالة العقار *
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة العقار" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="جاهز">جاهز للتسليم</SelectItem>
                        <SelectItem value="تحت الإنشاء">تحت الإنشاء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      طريقة الدفع *
                    </label>
                    <Select
                      value={formData.paymentType}
                      onValueChange={(value) => handleChange("paymentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="كاش">كاش (نقدي)</SelectItem>
                        <SelectItem value="تقسيط">تقسيط فقط</SelectItem>
                        <SelectItem value="كاش أو تقسيط">كاش أو تقسيط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.paymentType !== "كاش" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المقدم (جنيه)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.downPayment}
                      onChange={(e) => handleChange("downPayment", e.target.value)}
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القسط الشهري (جنيه)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.monthlyInstallment}
                      onChange={(e) => handleChange("monthlyInstallment", e.target.value)}
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة التقسيط (سنوات)
                    </label>
                    <Select
                      value={formData.installmentYears}
                      onValueChange={(value) => handleChange("installmentYears", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTALLMENT_YEARS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-orange-500" />
                الصور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id={uploadInputId}
                  disabled={isUploading}
                />
                <label
                  htmlFor={uploadInputId}
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
                      <span className="text-orange-600 font-medium">{uploadProgress}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400" />
                      <span className="text-gray-600 font-medium">اضغط لرفع الصور</span>
                      <span className="text-sm text-gray-400">JPG, PNG, WebP - حد أقصى 5MB للصورة</span>
                    </>
                  )}
                </label>
              </div>

              {uploadProgress && !isUploading && (
                <p className="text-sm text-green-600 text-center">{uploadProgress}</p>
              )}

              <Separator />

              {/* URL Input (Alternative) */}
              <div>
                <p className="text-sm text-gray-500 mb-2">أو أضف رابط صورة:</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل رابط الصورة (URL)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    dir="ltr"
                  />
                  <Button type="button" onClick={addImageUrl} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Image Preview Grid */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image
                          src={url}
                          alt={`صورة ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(url)}
                        className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          رئيسية
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isEdit && (
                <p className="text-sm text-gray-500">
                  الصورة الأولى ستكون الصورة الرئيسية للعقار
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-500" />
                معلومات التواصل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الواتساب *
                </label>
                <Input
                  required
                  placeholder="01500775974"
                  value={formData.contact_whatsapp}
                  onChange={(e) => handleChange("contact_whatsapp", e.target.value)}
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={(e) => handleChange("isVerified", e.target.checked)}
                  className="w-5 h-5 text-orange-500 rounded"
                />
                <label htmlFor="isVerified" className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span>عقار موثق</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card>
            <CardContent className="p-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg gap-2"
              >
                {isSubmitting ? (
                  isEdit ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  )
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {isEdit ? "حفظ التعديلات" : "حفظ العقار"}
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                {isEdit ? "سيتم تحديث العقار مباشرة بعد الحفظ" : "سيتم نشر العقار مباشرة بعد الحفظ"}
              </p>
            </CardContent>
          </Card>

          {extraSidebar}
        </div>
      </div>
    </form>
  );
}
