"use client";

import { useState } from "react";
import { PLACE_CATEGORIES } from "@/lib/damiettaPlaces";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Filter, X, MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface FilterSidebarProps {
  selectedDistricts: string[];
  selectedTypes: string[];
  selectedStatus: string;
  selectedPaymentMethod: string;
  priceRange: { min: number; max: number };
  onDistrictChange: (districts: string[]) => void;
  onTypeChange: (types: string[]) => void;
  onStatusChange: (status: string) => void;
  onPaymentMethodChange: (paymentMethod: string) => void;
  onPriceChange: (range: { min: number; max: number }) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const PROPERTY_TYPES = [
  "شقة",
  "شقة فاخرة",
  "فيلا منفصلة",
  "دوبلكس",
  "بنتهاوس",
  "محل تجاري",
  "مقر إداري",
  "عيادة",
  "أرض",
  "مبنى تحت الإنشاء",
  "شاليه",
  "روف",
  "تاون هاوس",
];

const PROPERTY_STATUS = ["الكل", "جاهز", "تحت الإنشاء"];

const PAYMENT_METHODS = ["الكل", "كاش", "تقسيط", "كاش أو تقسيط"];

export function FilterSidebar({
  selectedDistricts,
  selectedTypes,
  selectedStatus,
  selectedPaymentMethod,
  priceRange,
  onDistrictChange,
  onTypeChange,
  onStatusChange,
  onPaymentMethodChange,
  onPriceChange,
  onClearFilters,
  totalResults,
}: FilterSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    PLACE_CATEGORIES.map((c) => c.id)
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleDistrict = (district: string) => {
    onDistrictChange(
      selectedDistricts.includes(district)
        ? selectedDistricts.filter((d) => d !== district)
        : [...selectedDistricts, district]
    );
  };

  const togglePropertyType = (type: string) => {
    onTypeChange(
      selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type]
    );
  };

  const hasActiveFilters =
    selectedDistricts.length > 0 ||
    selectedTypes.length > 0 ||
    selectedStatus !== "الكل" ||
    selectedPaymentMethod !== "الكل" ||
    priceRange.min > 0 ||
    priceRange.max < 50000000;

  return (
    <div className="bg-white rounded-xl shadow-lg border p-4 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-orange-500" />
          <h3 className="font-bold text-lg">الفلاتر</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 me-1" />
            مسح الكل
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="bg-orange-50 rounded-lg p-3 mb-4 text-center">
        <p className="text-orange-700 font-semibold">
          {totalResults} نتيجة
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">نطاق السعر (جنيه)</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">من</label>
              <Input
                type="number"
                placeholder="0"
                value={priceRange.min || ""}
                onChange={(e) =>
                  onPriceChange({
                    ...priceRange,
                    min: Number(e.target.value) || 0,
                  })
                }
                className="text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">إلى</label>
              <Input
                type="number"
                placeholder="50,000,000"
                value={priceRange.max < 50000000 ? priceRange.max : ""}
                onChange={(e) =>
                  onPriceChange({
                    ...priceRange,
                    max: Number(e.target.value) || 50000000,
                  })
                }
                className="text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Property Status */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">حالة العقار</h4>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_STATUS.map((status) => (
              <Badge
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedStatus === status
                    ? status === "جاهز" 
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : status === "تحت الإنشاء"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                    : "hover:bg-gray-100 border-gray-300 text-gray-700"
                }`}
                onClick={() => onStatusChange(status)}
              >
                {status === "الكل" ? "كل الخيارات" : status}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Payment Method */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">طريقة الدفع</h4>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <Badge
                key={method}
                variant={selectedPaymentMethod === method ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedPaymentMethod === method
                    ? method === "كاش" 
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : method === "تقسيط"
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : method === "كاش أو تقسيط"
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                    : "hover:bg-gray-100 border-gray-300 text-gray-700"
                }`}
                onClick={() => onPaymentMethodChange(method)}
              >
                {method === "الكل" ? "كل الخيارات" : method}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Property Types */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-700">نوع العقار</h4>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((type) => (
              <Badge
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedTypes.includes(type)
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "hover:bg-gray-100 border-gray-300 text-gray-700"
                }`}
                onClick={() => togglePropertyType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Districts by Category */}
        <div className="mb-4">
          <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            المناطق
          </h4>

          {PLACE_CATEGORIES.map((category) => (
            <div key={category.id} className="mb-3">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="font-medium text-sm">{category.nameAr}</span>
                </div>
                {expandedCategories.includes(category.id) ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {expandedCategories.includes(category.id) && (
                <div className="pr-4 mt-1 space-y-1">
                  {category.districts.map((district) => (
                    <button
                      key={district}
                      onClick={() => toggleDistrict(district)}
                      className={`w-full text-right text-sm p-2 rounded-lg transition-colors ${
                        selectedDistricts.includes(district)
                          ? `${category.color} text-white`
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
