// lib/propertySummary.ts
// "الإجابة المباشرة" عن كل عقار: جملة حقائق واحدة مكتملة (النوع، المكان، المساحة، السعر، سعر المتر، الحالة، الدفع).
// تُعرض مرئية تحت عنوان العقار وتدخل في الـ schema ووصف الصفحة بنفس النص —
// محركات الإجابة (ChatGPT / Perplexity / AI Overviews) تقتبس الجمل المكتملة لا المربعات المتناثرة.

import type { Property } from "./types";
import { cityNameOf } from "./site";

const RESIDENTIAL_WITH_ROOMS = ["شقة", "شقة فاخرة", "دوبلكس", "بنتهاوس", "روف", "فيلا منفصلة", "تاون هاوس", "شاليه"];

// أرقام لاتينية ثابتة (6,815,000) — نفس صيغة بقية محتوى الموقع، ومتطابقة بين الخادم والمتصفح
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

// حدود معقولة لسعر المتر (جنيه/م²). خارجها خطأ إدخال في المساحة أو السعر
// (مثال فعلي: إعلان بمساحة 0.35 م² يعطي 22 مليون جنيه للمتر، وآخر بمساحة 95,000 م² يعطي 31 جنيهاً) —
// قيمة واحدة كهذه كانت ترفع "متوسط سعر المتر" المنشور للحي كله إلى رقم مستحيل.
const SQM_MIN = 1000;
const SQM_MAX = 500000;

// سعر المتر للعقار، أو null إن كانت البيانات ناقصة أو خارج الحدود المعقولة
export function pricePerSqm(p: Pick<Property, "price" | "details">): number | null {
  const area = p.details?.area_sqm;
  if (!p.price || !area || area <= 0) return null;
  const v = Math.round(p.price / area);
  return v >= SQM_MIN && v <= SQM_MAX ? v : null;
}

// مساحة العقار إن كانت معقولة، وإلا null. إعلان بسعر ومساحة يعطيان سعر متر مستحيلاً
// (0.35 م² أو 95,000 م² لمحل) فيه خطأ إدخال في المساحة — لا ننشر رقماً نعرف أنه خطأ
// في الجملة التعريفية ولا الـ schema ولا بطاقة المواصفات حتى يصححه المعلن من لوحة التحكم.
export function plausibleArea(p: Pick<Property, "price" | "details">): number | null {
  const area = p.details?.area_sqm;
  if (!area || area < 1) return null;
  if (p.price > 0 && pricePerSqm(p) === null) return null;
  return area;
}

// متوسط سعر المتر لمجموعة عقارات — يتجاهل الإعلانات ذات البيانات غير المعقولة
export function averagePerSqm(list: Array<Pick<Property, "price" | "details">>): { avg: number; count: number } | null {
  const v = list.map(pricePerSqm).filter((n): n is number => n !== null);
  return v.length ? { avg: Math.round(v.reduce((a, b) => a + b, 0) / v.length), count: v.length } : null;
}

export function hasInstallment(p: Pick<Property, "payment">): boolean {
  return p.payment?.type === "تقسيط" || p.payment?.type === "كاش أو تقسيط";
}

export function paymentSentence(p: Pick<Property, "payment">): string {
  const pay = p.payment;
  if (!pay?.type) return "";
  if (!hasInstallment(p)) return "الدفع كاش.";
  const parts: string[] = [];
  if (pay.downPayment && pay.downPayment > 0) parts.push(`مقدم ${formatNumber(pay.downPayment)} جنيه`);
  if (pay.monthlyInstallment && pay.monthlyInstallment > 0)
    parts.push(`قسط شهري ${formatNumber(pay.monthlyInstallment)} جنيه`);
  if (pay.installmentYears && pay.installmentYears > 0)
    parts.push(`على ${pay.installmentYears} ${pay.installmentYears >= 3 && pay.installmentYears <= 10 ? "سنوات" : "سنة"}`);
  const lead = pay.type === "كاش أو تقسيط" ? "الدفع كاش أو بالتقسيط" : "الدفع بالتقسيط";
  return parts.length ? `${lead}: ${parts.join("، ")}.` : `${lead}.`;
}

export function buildPropertySummary(p: Property): string {
  const city = cityNameOf(p.location?.cityId);
  const district = p.location?.district?.trim();
  const d = p.details || ({} as Property["details"]);

  const where = district ? `في ${district} ب${city}` : `في ${city}`;
  const facts: string[] = [];
  const area = plausibleArea(p);
  if (area) facts.push(`مساحة ${formatNumber(area)} م²`);
  if (RESIDENTIAL_WITH_ROOMS.includes(p.type) && d.bedrooms > 0) {
    facts.push(d.bathrooms > 0 ? `${d.bedrooms} غرف نوم و${d.bathrooms} حمام` : `${d.bedrooms} غرف نوم`);
  }
  if (d.level && !["أرض", "فيلا منفصلة"].includes(p.type)) {
    facts.push(d.level.includes("الدور") ? d.level : `الدور: ${d.level}`);
  }
  if (d.finishing) facts.push(`تشطيب: ${d.finishing}`);

  let s = `${p.type} للبيع ${where}`;
  if (facts.length) s += `، ${facts.join("، ")}`;
  s += ".";

  if (p.price > 0) {
    const sqm = pricePerSqm(p);
    s += ` السعر ${formatNumber(p.price)} جنيه مصري`;
    if (sqm) s += ` (${formatNumber(sqm)} جنيه للمتر)`;
    s += ".";
  }

  if (p.status === "جاهز") s += " جاهز للاستلام.";
  else if (p.status === "تحت الإنشاء") s += " تحت الإنشاء.";
  else if (p.status === "تم البيع") s += " تم بيع هذا العقار.";

  const pay = paymentSentence(p);
  if (pay && p.status !== "تم البيع") s += ` ${pay}`;

  return s;
}
