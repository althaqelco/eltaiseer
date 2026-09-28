// lib/bw/admin.ts
// عمليات لوحة التحكم (من المتصفح بحساب المسؤول). القواعد ترفض أي كتابة من غيره.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  updateDoc,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { auth, ADMIN_UID, db } from "../firebase";
import { BW_CITIES, suggestDistrictSlug } from "./cities";
import { MIN_POINTS } from "./types";
import { plotKey, publicView } from "./publish";
import { DEMAND, LISTINGS, PLOT_INDEX, PRIVATE, REQUESTS, toListing } from "./listings";
import type { PlotsPayload } from "./live-parse";
import {
  type BwPlatformMatch,
  type BwListing,
  type BwPrivate,
  type BwRequest,
  type BwRequestStatus,
} from "./types";

function requireAdmin() {
  if (auth.currentUser?.uid !== ADMIN_UID) throw new Error("سجّل الدخول كمسؤول أولًا.");
}

export function newListingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = Date.now().toString(36).slice(-2).toUpperCase();
  for (let i = 0; i < 6; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

export function emptyListing(id: string): BwListing {
  const now = new Date().toISOString();
  return {
    id,
    status: "draft",
    citySlug: "",
    district: "",
    districtSlug: "",
    phase: null,
    stage: "paid",
    area: 0,
    corner: false,
    garden: false,
    sea: false,
    officialTotalUsd: null,
    paidUsd: null,
    remainingUsd: null,
    premiumEgp: 0,
    usdEgp: 0,
    usdEgpDate: now.slice(0, 10),
    feesPct: 1.5,
    summary: "",
    photos: [],
    checks: [],
    verifiedAt: "",
    platformMatched: false,
    approx: false,
    createdAt: now,
    updatedAt: now,
    soldAt: null,
  };
}

export function emptyPrivate(listingId: string): BwPrivate {
  return {
    listingId,
    sellerName: "",
    sellerPhone: "",
    plotNumber: "",
    zone: "",
    plotHash: "",
    commissionPct: null,
    contractSignedAt: "",
    exclusiveUntil: "",
    notes: "",
    authorityTransferConfirmed: false,
    identifiableConsent: false,
    platform: null,
    exact: null,
  };
}

function toPrivate(id: string, d: Record<string, unknown> | undefined): BwPrivate {
  const e = emptyPrivate(id);
  if (!d) return e;
  return { ...e, ...(d as Partial<BwPrivate>), listingId: id };
}

export async function listListingsAdmin(): Promise<BwListing[]> {
  requireAdmin();
  const snap = await getDocs(collection(db, LISTINGS));
  return snap.docs.map((x) => toListing(x.id, x.data())).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listPrivatesAdmin(): Promise<Record<string, BwPrivate>> {
  requireAdmin();
  const snap = await getDocs(collection(db, PRIVATE));
  const out: Record<string, BwPrivate> = {};
  snap.docs.forEach((x) => (out[x.id] = toPrivate(x.id, x.data())));
  return out;
}

export async function loadListingAdmin(id: string): Promise<{ listing: BwListing | null; priv: BwPrivate }> {
  requireAdmin();
  const [l, p] = await Promise.all([getDoc(doc(db, LISTINGS, id)), getDoc(doc(db, PRIVATE, id))]);
  const priv = toPrivate(id, p.exists() ? p.data() : undefined);
  const listing = l.exists() ? toListing(l.id, l.data()) : null;
  // الإعلان العام قد يحمل أرقامًا مقرّبة؛ المحرر يعمل دائمًا على الدقيقة المحفوظة في الملف الخاص
  return { listing: listing && priv.exact ? { ...listing, ...priv.exact } : listing, priv };
}

// بصمة القطعة: لا تُخزَّن في الإعلان العام (أرقام القطع قليلة فيمكن تخمين البصمة وكشف الرقم)
export async function plotHash(key: string): Promise<string> {
  if (!key) return "";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export { publishProblems } from "./publish";

function publicDoc(l: BwListing): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, ...rest } = l;
  return rest;
}

// يعيد الملف الخاص كما حُفظ (بالبصمة الجديدة) ليحدّث المحرر حالته
// loadedUpdatedAt: قيمة updatedAt التي فتح بها المحرر الإعلان (null لإعلان جديد). لو تغيّر الإعلان أو مطابقته بعد ذلك
// (مثلًا أوقفه الفحص الحي في تبويب آخر) يُرفض الحفظ، حتى لا يعيد تبويب قديم نشر إعلان موقوف ويمسح دليل الإيقاف.
export async function saveListingAdmin(
  l: BwListing,
  p: BwPrivate,
  loadedUpdatedAt: string | null
): Promise<{ priv: BwPrivate; updatedAt: string }> {
  requireAdmin();
  const hash = await plotHash(plotKey(l.citySlug, p.zone, p.plotNumber, p.platform?.zoneId));
  const exact = p.platform ? { area: l.area, officialTotalUsd: l.officialTotalUsd, paidUsd: l.paidUsd, remainingUsd: l.remainingUsd } : null;
  const priv: BwPrivate = { ...p, listingId: l.id, plotHash: hash, exact };
  const now = new Date().toISOString();
  const pub: BwListing = { ...publicView(l, p), updatedAt: now };
  await runTransaction(db, async (tx) => {
    const privRef = doc(db, PRIVATE, l.id);
    const cur = await tx.get(doc(db, LISTINGS, l.id));
    const oldPriv = await tx.get(privRef);
    const stale = "تغيّر الإعلان بعد فتح المحرر (ربما أوقفه الفحص الحي). أعد تحميل الصفحة ثم عدّل.";
    if (loadedUpdatedAt === null ? cur.exists() : !cur.exists() || cur.data().updatedAt !== loadedUpdatedAt) throw new Error(stale);
    const oldCheck = oldPriv.exists() ? ((oldPriv.data().platform as BwPlatformMatch | null)?.checkedAt || "") : "";
    if (oldCheck && oldCheck > (p.platform?.checkedAt || "")) throw new Error(stale);
    const newIdx = hash ? await tx.get(doc(db, PLOT_INDEX, hash)) : null;
    if (newIdx?.exists() && newIdx.data().listingId !== l.id) {
      throw new Error(`هذه القطعة لها إعلان آخر (كود ${newIdx.data().listingId}). قطعة واحدة = إعلان واحد.`);
    }
    const oldHash = oldPriv.exists() ? (oldPriv.data().plotHash as string) : "";
    if (oldHash && oldHash !== hash) tx.delete(doc(db, PLOT_INDEX, oldHash));
    if (hash) tx.set(doc(db, PLOT_INDEX, hash), { listingId: l.id, at: now });
    tx.set(doc(db, LISTINGS, l.id), publicDoc(pub));
    tx.set(privRef, priv);
  });
  return { priv, updatedAt: now };
}

// نتيجة الفحص الحي لقطعة مطابَقة: تُحدَّث المطابقة في الملف الخاص، ويُوقف الإعلان (منتهي، يعود بإعادة المطابقة والتوثيق)
// إذا لم تعد القطعة محجوزة على موقع الهيئة
export async function recordLiveCheck(id: string, platform: BwPlatformMatch, pause: boolean): Promise<void> {
  requireAdmin();
  const batch = writeBatch(db);
  batch.update(doc(db, PRIVATE, id), { platform });
  if (pause) batch.update(doc(db, LISTINGS, id), { status: "expired", updatedAt: new Date().toISOString() });
  await batch.commit();
}

// ─── الطلبات ───
export async function listRequestsAdmin(): Promise<BwRequest[]> {
  requireAdmin();
  const snap = await getDocs(collection(db, REQUESTS));
  return snap.docs
    .map((x) => {
      const d = x.data();
      const ts = d.createdAt as Timestamp | undefined;
      return {
        id: x.id,
        kind: d.kind,
        name: d.name || "",
        phone: d.phone || "",
        citySlug: d.citySlug || "",
        district: d.district || "",
        phase: d.phase || "any",
        area: typeof d.area === "number" ? d.area : null,
        budgetEgp: typeof d.budgetEgp === "number" ? d.budgetEgp : null,
        notes: d.notes || "",
        status: d.status || "new",
        createdAt: ts?.toDate ? ts.toDate().toISOString() : "",
      } as BwRequest;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setRequestStatus(id: string, status: BwRequestStatus): Promise<void> {
  requireAdmin();
  await updateDoc(doc(db, REQUESTS, id), { status });
}

// عدادات الطلب العامة من طلبات الشراء الصالحة. الحي يُحسب فقط لو أمكن تحويل اسمه لنفس رابط أحياء الإعلانات.
export async function recomputeDemand(requests: BwRequest[]): Promise<number> {
  requireAdmin();
  // الطلب يبقى قائمًا 12 شهرًا بحد أقصى (كما في الخصوصية وصفحة طلب الشراء)
  const cutoff = Date.now() - 365 * 86400000;
  const valid = requests.filter(
    (r) => r.kind === "buy" && r.status !== "spam" && r.status !== "closed" && !(Date.parse(r.createdAt) < cutoff)
  );
  const now = new Date().toISOString();
  const batch = writeBatch(db);
  for (const c of BW_CITIES) {
    const mine = valid.filter((r) => r.citySlug === c.slug);
    const byDistrict: Record<string, number> = {};
    for (const r of mine) {
      const s = suggestDistrictSlug(r.district);
      if (s) byDistrict[s] = (byDistrict[s] || 0) + 1;
    }
    // المستند قراءته عامة: لا يُكتب فيه أي عدد أقل من 3 (نفس قاعدة العرض)
    const pub = (n: number) => (n >= MIN_POINTS ? n : 0);
    const districts = Object.fromEntries(Object.entries(byDistrict).filter(([, n]) => n >= MIN_POINTS));
    const phase11 = mine.filter((r) => r.phase === "11" || r.phase === "any").length;
    batch.set(doc(db, DEMAND, c.slug), { citySlug: c.slug, total: pub(mine.length), phase11: pub(phase11), districts, updatedAt: now });
  }
  await batch.commit();
  return valid.length;
}

// ─── البيانات الحية للمطابقة (من المتصفح، مرة عند الطلب) ───
export async function fetchPlatformPlots(): Promise<PlotsPayload> {
  const sameOrigin = typeof window !== "undefined" && window.location.hostname.endsWith("eltaiseer.com");
  const url = sameOrigin ? "/baitelwatan/api/plots" : "https://eltaiseer.com/baitelwatan/api/plots";
  const res = await fetch(url, { credentials: "omit", cache: "no-store" });
  if (!res.ok) throw new Error(`تعذّر جلب بيانات المنصة (${res.status}).`);
  return (await res.json()) as PlotsPayload;
}
