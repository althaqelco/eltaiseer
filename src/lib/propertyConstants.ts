// lib/propertyConstants.ts
// ثوابت العقارات المشتركة بين صفحات الإضافة والتعديل والعرض

export const PROPERTY_TYPES = [
  "شقة",
  "شقة فاخرة",
  "فيلا منفصلة",
  "دوبلكس",
  "بنتهاوس",
  "تاون هاوس",
  "محل تجاري",
  "مقر إداري",
  "عيادة",
  "أرض",
  "مبنى تحت الإنشاء",
  "شاليه",
  "روف",
] as const;

export const INSTALLMENT_YEARS_OPTIONS = [
  { value: "1", label: "سنة واحدة" },
  { value: "2", label: "سنتان" },
  { value: "3", label: "3 سنوات" },
  { value: "5", label: "5 سنوات" },
  { value: "7", label: "7 سنوات" },
  { value: "10", label: "10 سنوات" },
] as const;
