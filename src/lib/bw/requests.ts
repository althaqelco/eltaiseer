// lib/bw/requests.ts
// طلبات البيع والشراء من الزوار: إنشاء فقط. القواعد تفرض الحقول وأطوالها، ولا يقرأ الطلبات إلا المسؤول.

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { BwRequestKind, BwRequestPhase } from "./types";
import { toAsciiDigits } from "./cities";

export interface NewRequest {
  kind: BwRequestKind;
  name: string;
  phone: string;
  citySlug: string;
  district: string;
  phase: BwRequestPhase;
  area: number | null;
  budgetEgp: number | null;
  notes: string;
}

export function cleanPhone(p: string): string {
  return toAsciiDigits(p || "").replace(/[^\d+]/g, "");
}

export function validateRequest(r: NewRequest): string | null {
  if (r.name.trim().length < 2) return "اكتب اسمك.";
  if (!/^\+?\d{8,19}$/.test(cleanPhone(r.phone))) return "اكتب رقم هاتف صحيحًا، ويُفضل رقم واتساب مع كود الدولة.";
  if (!r.citySlug) return "اختر المدينة.";
  if (r.area !== null && !(r.area > 0)) return "المساحة لازم تكون رقمًا (مثال: 450).";
  if (r.budgetEgp !== null && !(r.budgetEgp > 0)) return "الميزانية لازم تكون رقمًا (مثال: 3000000 أو 3 مليون).";
  return null;
}

export async function submitRequest(r: NewRequest): Promise<void> {
  await addDoc(collection(db, "bw_requests"), {
    kind: r.kind,
    name: r.name.trim().slice(0, 80),
    phone: cleanPhone(r.phone).slice(0, 20),
    citySlug: r.citySlug.slice(0, 40),
    district: r.district.trim().slice(0, 80),
    phase: r.phase,
    // القواعد تقبل أعدادًا صحيحة ≥ 1 فقط؛ ما يُقرَّب إلى صفر يُرسل null بدل أن يُرفض الطلب كله
    area: r.area !== null && isFinite(r.area) && Math.round(r.area) >= 1 ? Math.min(Math.round(r.area), 100000) : null,
    budgetEgp: r.budgetEgp !== null && isFinite(r.budgetEgp) && Math.round(r.budgetEgp) >= 1 ? Math.min(Math.round(r.budgetEgp), 10_000_000_000) : null,
    notes: r.notes.trim().slice(0, 500),
    consent: true,
    status: "new",
    createdAt: serverTimestamp(),
  });
}
