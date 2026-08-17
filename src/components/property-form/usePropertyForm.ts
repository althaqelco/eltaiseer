"use client";

// الحالة والمعالجات المشتركة بين صفحتي إضافة وتعديل العقار
// (كانت مكررة بالكامل في الصفحتين — أي تعديل على سلوك النموذج يتم هنا فقط)

import { useState, useRef, useEffect } from "react";
import { CityId } from "@/lib/egyptPlaces";
import { Property } from "@/lib/mockData";
import { uploadImage, validateImageFile, compressImage } from "@/lib/imageUpload";

export type PropertyFormStatus = "جاهز" | "تحت الإنشاء" | "تم البيع";
export type PropertyPaymentType = "كاش" | "تقسيط" | "كاش أو تقسيط";

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  type: string;
  city: CityId;
  district: string;
  address: string;
  area_sqm: string;
  bedrooms: string;
  bathrooms: string;
  level: string;
  finishing: string;
  contact_whatsapp: string;
  isVerified: boolean;
  paymentType: PropertyPaymentType;
  downPayment: string;
  monthlyInstallment: string;
  installmentYears: string;
  status: PropertyFormStatus;
}

const EMPTY_FORM: PropertyFormData = {
  title: "",
  description: "",
  price: "",
  type: "",
  city: "new-damietta",
  district: "",
  address: "",
  area_sqm: "",
  bedrooms: "0",
  bathrooms: "0",
  level: "",
  finishing: "",
  contact_whatsapp: "",
  isVerified: false,
  paymentType: "كاش",
  downPayment: "",
  monthlyInstallment: "",
  installmentYears: "",
  status: "جاهز",
};

export function usePropertyForm(initialImages: string[] = []) {
  const [formData, setFormData] = useState<PropertyFormData>(EMPTY_FORM);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // تعبئة النموذج من عقار موجود (صفحة التعديل)
  const loadFromProperty = (property: Property) => {
    setFormData({
      title: property.title,
      description: property.description || "",
      price: String(property.price),
      type: property.type,
      city: (property.location.cityId as CityId) || "new-damietta",
      district: property.location.district,
      address: property.location.address,
      area_sqm: String(property.details.area_sqm),
      bedrooms: String(property.details.bedrooms),
      bathrooms: String(property.details.bathrooms),
      level: property.details.level,
      finishing: property.details.finishing,
      status: property.status || "جاهز",
      contact_whatsapp: property.contact_whatsapp,
      isVerified: property.isVerified,
      paymentType: property.payment?.type || "كاش",
      downPayment: property.payment?.downPayment ? String(property.payment.downPayment) : "",
      monthlyInstallment: property.payment?.monthlyInstallment
        ? String(property.payment.monthlyInstallment)
        : "",
      installmentYears: property.payment?.installmentYears
        ? String(property.payment.installmentYears)
        : "",
    });
    setSelectedAmenities(property.amenities);
    setImageUrls(property.images);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl)) {
      setImageUrls((prev) => [...prev, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress("جاري رفع الصور...");

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`جاري رفع الصورة ${i + 1} من ${files.length}...`);

        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(validation.error);
          continue;
        }

        const compressedFile = await compressImage(file);
        const url = await uploadImage(compressedFile);
        uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setImageUrls((prev) => [...prev, ...uploadedUrls]);
        setUploadProgress(`تم رفع ${uploadedUrls.length} صورة بنجاح!`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress("فشل في رفع الصور. حاول مرة أخرى.");
    } finally {
      setIsUploading(false);
      progressTimerRef.current = setTimeout(() => setUploadProgress(""), 3000);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // مدخلات تحسين السيو للعنوان والوصف (تُمرر لـ enhanceTitle/enhanceDescription)
  const buildSeoInput = () => ({
    type: formData.type,
    district: formData.district,
    area_sqm: Number(formData.area_sqm),
    price: Number(formData.price),
    bedrooms: Number(formData.bedrooms),
    bathrooms: Number(formData.bathrooms),
    level: formData.level,
    finishing: formData.finishing,
    amenities: selectedAmenities,
    status: formData.status,
    paymentType: formData.paymentType,
    cityId: formData.city,
  });

  return {
    formData,
    selectedAmenities,
    imageUrls,
    newImageUrl,
    setNewImageUrl,
    isUploading,
    uploadProgress,
    fileInputRef,
    handleChange,
    loadFromProperty,
    toggleAmenity,
    addImageUrl,
    removeImageUrl,
    handleFileUpload,
    buildSeoInput,
  };
}

export type PropertyFormApi = ReturnType<typeof usePropertyForm>;
