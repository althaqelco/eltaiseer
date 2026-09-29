// src/lib/answers/format.ts — صياغة الأرقام والتواريخ داخل الإجابات (أرقام لاتينية بفواصل الآلاف)
import { cairoDate } from "../seo/time";

export const fmtN = (n: number): string => Math.round(n).toLocaleString("en-US");

/** «حتى 29 سبتمبر 2026» أو "" إن لم يوجد تاريخ */
export const asOf = (iso?: string | null): string => (iso ? `حتى ${cairoDate(iso)}` : "");

/** عدد + معدود بالعربية: 1 واحد، 2 مثنى، 3–10 جمع، 11+ مفرد منصوب */
export function count(n: number, f: { one: string; two: string; few: string; many: string }): string {
  if (n === 1) return f.one;
  if (n === 2) return f.two;
  const r = n % 100;
  return r >= 3 && r <= 10 ? `${fmtN(n)} ${f.few}` : `${fmtN(n)} ${f.many}`;
}

export const apartments = (n: number) => count(n, { one: "شقة واحدة", two: "شقتين", few: "شقق", many: "شقة" });
export const plots = (n: number) => count(n, { one: "قطعة واحدة", two: "قطعتين", few: "قطع", many: "قطعة" });
export const districtsIn = (n: number) => count(n, { one: "حي واحد", two: "حيين", few: "أحياء", many: "حيًا" });
export const years = (n: number) => count(n, { one: "سنة واحدة", two: "سنتين", few: "سنوات", many: "سنة" });
