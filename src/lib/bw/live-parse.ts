// lib/bw/live-parse.ts
// تجميع بيانات منصة «التيسير — الحجز الذكي» العامة (/baitelwatan/api/plots) على مستوى المدينة.
// نقي بلا شبكة: يستخدمه الخادم (لقطة كل 6 ساعات) ولوحة التحكم (مطابقة قطعة بعينها).
// لا يُقرأ هنا ولا يُعرض أي شيء من الترتيب الذكي أو الأمنيات أو القنّاص — فقط الأسعار الرسمية والإتاحة.

import { cityByArabic } from "./cities";

export interface BwLiveCity {
  slug: string;
  nameAr: string;
  total: number;
  available: number;
  ppmMin: number; // سعر المتر الأساسي بالدولار كما في الكراسة
  ppmMedian: number;
  ppmMax: number;
  // سعر المتر الأساسي للقطع المتاحة الآن فقط — المقارنة «المتاح بلا أوفر» تستخدمه لا نطاق الطرح كله
  availPpmMin: number | null;
  availPpmMax: number | null;
  areaMin: number;
  areaMax: number;
}

export interface BwLive {
  generatedAt: string; // وقت اللقطة كما تعلنه المنصة (بتوقيت القاهرة)
  fetchedAt: string; // ISO
  cities: Record<string, BwLiveCity>;
  total: number;
  available: number;
}

interface ZoneMeta {
  zone_id: number;
  name: string;
  city: string;
}

export interface PlotsPayload {
  generated_at?: string;
  columns?: string[];
  rows?: unknown[][];
  zones?: Record<string, ZoneMeta> | ZoneMeta[];
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function zoneMap(z: PlotsPayload["zones"]): Map<number, ZoneMeta> {
  const out = new Map<number, ZoneMeta>();
  const list = Array.isArray(z) ? z : Object.values(z || {});
  for (const m of list) if (m && typeof m.zone_id === "number") out.set(m.zone_id, m);
  return out;
}

export function columnIndex(cols: string[] | undefined, name: string): number {
  return (cols || []).indexOf(name);
}

export function aggregatePlots(payload: PlotsPayload, fetchedAt = new Date().toISOString()): BwLive | null {
  const cols = payload.columns;
  const rows = payload.rows;
  if (!Array.isArray(cols) || !Array.isArray(rows) || rows.length === 0) return null;
  const iz = columnIndex(cols, "zone_id");
  const ist = columnIndex(cols, "status");
  const ip = columnIndex(cols, "base_ppm");
  const ia = columnIndex(cols, "area");
  if (iz < 0 || ist < 0 || ip < 0 || ia < 0) return null;
  const zones = zoneMap(payload.zones);

  const acc = new Map<string, { nameAr: string; total: number; available: number; ppm: number[]; availPpm: number[]; area: number[] }>();
  let total = 0;
  let available = 0;
  for (const r of rows) {
    const z = zones.get(Number(r[iz]));
    const c = z ? cityByArabic(z.city) : undefined;
    if (!c) continue;
    let a = acc.get(c.slug);
    if (!a) acc.set(c.slug, (a = { nameAr: c.nameAr, total: 0, available: 0, ppm: [], availPpm: [], area: [] }));
    a.total++;
    total++;
    const p = Number(r[ip]);
    if (r[ist] === "available") {
      a.available++;
      available++;
      if (p > 0) a.availPpm.push(p);
    }
    if (p > 0) a.ppm.push(p);
    const ar = Number(r[ia]);
    if (ar > 0) a.area.push(ar);
  }

  const cities: Record<string, BwLiveCity> = {};
  acc.forEach((a, slug) => {
    if (a.ppm.length === 0) return;
    cities[slug] = {
      slug,
      nameAr: a.nameAr,
      total: a.total,
      available: a.available,
      ppmMin: Math.min(...a.ppm),
      ppmMedian: median(a.ppm),
      ppmMax: Math.max(...a.ppm),
      availPpmMin: a.availPpm.length ? Math.min(...a.availPpm) : null,
      availPpmMax: a.availPpm.length ? Math.max(...a.availPpm) : null,
      areaMin: a.area.length ? Math.min(...a.area) : 0,
      areaMax: a.area.length ? Math.max(...a.area) : 0,
    };
  });
  if (Object.keys(cities).length === 0) return null;
  return { generatedAt: payload.generated_at || "", fetchedAt, cities, total, available };
}

// ─── للوحة التحكم: مطابقة قطعة بعينها (المرحلة 11 بعد التخصيص) ───
export interface PlotHit {
  zoneId: number;
  zoneName: string;
  cityAr: string;
  plotNumber: string;
  area: number | null;
  basePpm: number | null;
  total: number | null;
  down: number | null; // مقدم الحجز 25% كما في سجل الرصد
  corner: boolean;
  garden: boolean;
  sea: boolean;
  status: string;
  statusSince: string | null;
  lastSeen: string | null; // آخر رصد لهذه القطعة نفسها (بتوقيت القاهرة)
  snapshotAt: string | null; // وقت لقطة المنصة التي جاءت منها المطابقة — تُحفظ مع الـ hit فلا تُخلط لقطتان
}

export function listZones(payload: PlotsPayload, citySlug: string): { zoneId: number; name: string }[] {
  const out: { zoneId: number; name: string }[] = [];
  zoneMap(payload.zones).forEach((z) => {
    if (cityByArabic(z.city)?.slug === citySlug) out.push({ zoneId: z.zone_id, name: z.name });
  });
  return out.sort((a, b) => a.name.localeCompare(b.name, "ar"));
}

export function findPlot(payload: PlotsPayload, zoneId: number, plotNumber: string): PlotHit | null {
  const cols = payload.columns || [];
  const ix = (n: string) => columnIndex(cols, n);
  const iz = ix("zone_id");
  const ipn = ix("plot_number");
  if (iz < 0 || ipn < 0) return null;
  const want = String(plotNumber).trim();
  const row = (payload.rows || []).find((r) => Number(r[iz]) === zoneId && String(r[ipn]).trim() === want);
  if (!row) return null;
  const z = zoneMap(payload.zones).get(zoneId);
  const n = (name: string): number | null => {
    const i = ix(name);
    const v = i >= 0 ? Number(row[i]) : NaN;
    return isFinite(v) ? v : null;
  };
  const s = (name: string): string | null => {
    const i = ix(name);
    return i >= 0 && row[i] !== null && row[i] !== undefined ? String(row[i]) : null;
  };
  return {
    zoneId,
    zoneName: z?.name || "",
    cityAr: z?.city || "",
    plotNumber: want,
    area: n("area"),
    basePpm: n("base_ppm"),
    total: n("total"),
    down: n("down"),
    corner: (n("corner") || 0) > 0,
    garden: (n("garden") || 0) > 0,
    sea: (n("sea") || 0) > 0,
    status: s("status") || "",
    statusSince: s("status_since"),
    lastSeen: s("last_seen"),
    snapshotAt: payload.generated_at || null,
  };
}

// كم قطعة مأخوذة (غير متاحة) في نفس المنطقة لها نفس الأرقام العامة بعد التقريب: مساحة لأقرب 10 م²، إجمالي ومقدم لأقرب
// 5 آلاف دولار، نفس الميزات؟ من يقارن الإعلان ببيانات /api/plots يستبعد المتاح (الإعلان لا يكون إلا لقطعة محجوزة)،
// والمسدد المنشور يساوي المقدم غالبًا. k = 1 يعني أن الإعلان يكشف رقم القطعة.
export function anonymityK(payload: PlotsPayload, hit: PlotHit): number {
  const cols = payload.columns || [];
  const ix = (n: string) => columnIndex(cols, n);
  const [iz, ia, it, id, ist, ic, ig, isea] = ["zone_id", "area", "total", "down", "status", "corner", "garden", "sea"].map(ix);
  if (iz < 0 || ia < 0 || it < 0 || hit.area === null || hit.total === null) return 0;
  const band = (a: number) => Math.round(a / 10);
  const money = (t: number) => Math.round(t / 5000);
  const flag = (r: unknown[], i: number) => i >= 0 && Number(r[i]) > 0;
  let k = 0;
  for (const r of payload.rows || []) {
    if (Number(r[iz]) !== hit.zoneId) continue;
    if (ist >= 0 && r[ist] === "available") continue;
    if (band(Number(r[ia])) !== band(hit.area) || money(Number(r[it])) !== money(hit.total)) continue;
    if (id >= 0 && hit.down !== null && money(Number(r[id])) !== money(hit.down)) continue;
    if (flag(r, ic) !== hit.corner || flag(r, ig) !== hit.garden || flag(r, isea) !== hit.sea) continue;
    k++;
  }
  return k;
}

// هل شكل البيانات كما نتوقعه؟ تغيير اسم عمود أو ترقيم المناطق كان سيجعل كل القطع «مفقودة» فتُوقف الإعلانات خطأً
export function payloadLooksHealthy(payload: PlotsPayload, zoneIds: number[]): boolean {
  const cols = payload.columns || [];
  if (!["zone_id", "plot_number", "status"].every((c) => cols.includes(c))) return false;
  if ((payload.rows?.length || 0) < 1000) return false;
  const zones = zoneMap(payload.zones);
  return zoneIds.every((z) => zones.has(z));
}
