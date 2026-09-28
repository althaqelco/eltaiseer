// lib/bw/demo.ts
// إعلانات أمثلة لمعاينة التصميم محليًا فقط (BW_DEMO=1 مع next dev). لا تعمل أبدًا في بناء الإنتاج.

import type { BwListing } from "./types";

export function demoEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.BW_DEMO === "1";
}

const today = new Date();
const daysAgo = (d: number) => new Date(today.getTime() - d * 86400000).toISOString();
const dayAgo = (d: number) => daysAgo(d).slice(0, 10);

const base = {
  sea: false,
  usdEgp: 48.5,
  usdEgpDate: dayAgo(1),
  feesPct: 1.5,
  photos: [] as string[],
  checks: ["identity", "allocation", "receipts", "portal", "poa", "site", "contract"] as BwListing["checks"],
  platformMatched: false,
  approx: false,
  soldAt: null,
};

export const DEMO_LISTINGS: BwListing[] = [
  {
    ...base, id: "DEMO0001", status: "active", citySlug: "new-cairo", district: "الحي الخامس", districtSlug: "district-5",
    phase: 3, stage: "received", area: 504, corner: true, garden: false,
    officialTotalUsd: 75600, paidUsd: 75600, remainingUsd: 0, premiumEgp: 6000000,
    summary: "مثال للمعاينة: قطعة ناصية مستلمة في الحي الخامس، على شارع 20 متر، والخدمات مكتملة حولها.",
    verifiedAt: dayAgo(4), createdAt: daysAgo(6), updatedAt: daysAgo(4),
  },
  {
    ...base, id: "DEMO0002", status: "active", citySlug: "new-cairo", district: "الحي السابع", districtSlug: "district-7",
    phase: 6, stage: "paid", area: 460, corner: false, garden: true,
    officialTotalUsd: 92000, paidUsd: 92000, remainingUsd: 0, premiumEgp: 7500000,
    summary: "مثال للمعاينة: قطعة مسددة بالكامل تطل على حديقة، ولم تُستلم بعد.",
    verifiedAt: dayAgo(10), createdAt: daysAgo(12), updatedAt: daysAgo(10),
  },
  {
    ...base, id: "DEMO0003", status: "active", citySlug: "new-cairo", district: "الحي الثاني", districtSlug: "district-2",
    phase: 2, stage: "built", area: 520, corner: false, garden: false,
    officialTotalUsd: 62400, paidUsd: 62400, remainingUsd: 0, premiumEgp: 8200000,
    summary: "مثال للمعاينة: قطعة مبنية دور أرضي، ومهلة البناء مستوفاة.",
    verifiedAt: dayAgo(20), createdAt: daysAgo(25), updatedAt: daysAgo(20),
  },
  {
    ...base, id: "DEMO0004", status: "active", citySlug: "sheikh-zayed", district: "منطقة A", districtSlug: "zone-a",
    phase: 9, stage: "paid", area: 450, corner: false, garden: false,
    officialTotalUsd: 171000, paidUsd: 171000, remainingUsd: 0, premiumEgp: 3000000,
    summary: "مثال للمعاينة: قطعة مسددة في منطقة A بالشيخ زايد.",
    verifiedAt: dayAgo(3), createdAt: daysAgo(5), updatedAt: daysAgo(3),
  },
  {
    ...base, id: "DEMO0005", status: "active", citySlug: "new-damietta", district: "بيت الوطن بالساحل", districtSlug: "coast",
    phase: 7, stage: "received", area: 400, corner: false, garden: false,
    officialTotalUsd: 88000, paidUsd: 88000, remainingUsd: 0, premiumEgp: 1800000,
    summary: "مثال للمعاينة: قطعة مستلمة قريبة من الكورنيش.",
    verifiedAt: dayAgo(8), createdAt: daysAgo(9), updatedAt: daysAgo(8),
  },
  {
    ...base, id: "DEMO0007", status: "active", citySlug: "new-cairo", district: "الحي الرابع", districtSlug: "district-4",
    phase: 11, stage: "installments", area: 450, corner: false, garden: false, platformMatched: true, approx: true,
    officialTotalUsd: 220000, paidUsd: 55000, remainingUsd: 165000, premiumEgp: 2500000,
    checks: [...base.checks, "authority"],
    summary: "مثال للمعاينة: قطعة من المرحلة 11 صدر خطاب تخصيصها، ومطابقة لسجل الرصد كمحجوزة.",
    verifiedAt: dayAgo(1), createdAt: daysAgo(2), updatedAt: daysAgo(1),
  },
  {
    ...base, id: "DEMO0006", status: "sold", citySlug: "new-cairo", district: "الحي الخامس", districtSlug: "district-5",
    phase: 3, stage: "received", area: 480, corner: false, garden: false,
    officialTotalUsd: 72000, paidUsd: 72000, remainingUsd: 0, premiumEgp: 5600000,
    summary: "مثال للمعاينة: إعلان بيعت قطعته.",
    verifiedAt: dayAgo(30), createdAt: daysAgo(35), updatedAt: daysAgo(12), soldAt: daysAgo(12),
  },
];
