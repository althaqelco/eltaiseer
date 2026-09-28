// lib/bw/listings.ts
// قراءة الإعلانات من جهة الخادم (بلا تسجيل دخول). قواعد Firestore تسمح بقراءة النشط والمباع والمنتهي فقط؛
// المسودة والمسحوب لا يُقرآن أصلًا إلا للمسؤول، فيظهران هنا كأنهما غير موجودين.

import { cache } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { BwDemand, BwListing } from "./types";
import { DEMO_LISTINGS, demoEnabled } from "./demo";

export const LISTINGS = "bw_listings";
export const PRIVATE = "bw_private";
export const REQUESTS = "bw_requests";
export const DEMAND = "bw_demand";
export const PLOT_INDEX = "bw_plot_index";

function toListing(id: string, d: Record<string, unknown>): BwListing {
  const s = (k: string, def = "") => (typeof d[k] === "string" ? (d[k] as string) : def);
  const n = (k: string): number | null => (typeof d[k] === "number" && isFinite(d[k] as number) ? (d[k] as number) : null);
  const b = (k: string) => d[k] === true;
  return {
    id,
    status: (s("status", "draft") as BwListing["status"]),
    citySlug: s("citySlug"),
    district: s("district"),
    districtSlug: s("districtSlug"),
    phase: n("phase"),
    stage: (s("stage", "paid") as BwListing["stage"]),
    area: n("area") || 0,
    corner: b("corner"),
    garden: b("garden"),
    sea: b("sea"),
    officialTotalUsd: n("officialTotalUsd"),
    paidUsd: n("paidUsd"),
    remainingUsd: n("remainingUsd"),
    premiumEgp: n("premiumEgp") || 0,
    usdEgp: n("usdEgp") || 0,
    usdEgpDate: s("usdEgpDate"),
    feesPct: n("feesPct") || 0,
    summary: s("summary"),
    photos: Array.isArray(d.photos) ? (d.photos as unknown[]).filter((x): x is string => typeof x === "string") : [],
    checks: Array.isArray(d.checks) ? (d.checks as BwListing["checks"]) : [],
    verifiedAt: s("verifiedAt"),
    platformMatched: b("platformMatched"),
    approx: b("approx"),
    createdAt: s("createdAt"),
    updatedAt: s("updatedAt"),
    soldAt: typeof d.soldAt === "string" ? (d.soldAt as string) : null,
  };
}

export { toListing };

async function byStatus(status: "active" | "sold"): Promise<BwListing[]> {
  if (demoEnabled()) return DEMO_LISTINGS.filter((l) => l.status === status);
  try {
    const snap = await getDocs(query(collection(db, LISTINGS), where("status", "==", status)));
    return snap.docs.map((x) => toListing(x.id, x.data()));
  } catch {
    return [];
  }
}

// cache() يوحّد الجلب بين generateMetadata والصفحة داخل الطلب الواحد
export const getActiveListings = cache(() => byStatus("active"));
export const getSoldListings = cache(() => byStatus("sold"));

export const getListing = cache(async (id: string): Promise<BwListing | null> => {
  if (!/^[A-Z0-9]{4,20}$/.test(id)) return null;
  if (demoEnabled()) return DEMO_LISTINGS.find((l) => l.id === id) || null;
  try {
    const snap = await getDoc(doc(db, LISTINGS, id));
    return snap.exists() ? toListing(snap.id, snap.data()) : null;
  } catch {
    return null; // مسودة أو مسحوب: القواعد ترفض القراءة
  }
});

export const getDemand = cache(async (citySlug: string): Promise<BwDemand | null> => {
  if (demoEnabled()) return { citySlug, total: 7, phase11: 5, districts: { "district-4": 4 }, updatedAt: new Date().toISOString() };
  try {
    const snap = await getDoc(doc(db, DEMAND, citySlug));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      citySlug,
      total: typeof d.total === "number" ? d.total : 0,
      phase11: typeof d.phase11 === "number" ? d.phase11 : 0,
      districts: (d.districts as Record<string, number>) || {},
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : "",
    };
  } catch {
    return null;
  }
});

export const getAllDemand = cache(async (): Promise<Record<string, BwDemand>> => {
  if (demoEnabled()) {
    const at = new Date().toISOString();
    return {
      "new-cairo": { citySlug: "new-cairo", total: 7, phase11: 5, districts: { "district-4": 4 }, updatedAt: at },
      "new-october": { citySlug: "new-october", total: 3, phase11: 3, districts: {}, updatedAt: at },
    };
  }
  try {
    const snap = await getDocs(collection(db, DEMAND));
    const out: Record<string, BwDemand> = {};
    snap.docs.forEach((x) => {
      const d = x.data();
      out[x.id] = {
        citySlug: x.id,
        total: typeof d.total === "number" ? d.total : 0,
        phase11: typeof d.phase11 === "number" ? d.phase11 : 0,
        districts: (d.districts as Record<string, number>) || {},
        updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : "",
      };
    });
    return out;
  } catch {
    return {};
  }
});
