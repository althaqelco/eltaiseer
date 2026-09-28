"use client";

// لوحة «بيت الوطن: البيع والشراء» — الإعلانات وحالتها، وطلبات البيع والشراء، وفحص القطع مع البيانات الحية.

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  fetchPlatformPlots,
  listListingsAdmin,
  listPrivatesAdmin,
  listRequestsAdmin,
  recomputeDemand,
  recordLiveCheck,
  setRequestStatus,
} from "@/lib/bw/admin";
import { anonymityK, findPlot, payloadLooksHealthy } from "@/lib/bw/live-parse";
import { isTaken } from "@/lib/bw/publish";
import { cityName } from "@/lib/bw/cities";
import { fmtDate, fmtEgp, isStale, listingPath, plotsCount } from "@/lib/bw/calc";
import {
  REQUEST_STATUS_LABEL,
  type BwListing,
  type BwPrivate,
  type BwRequest,
  type BwRequestStatus,
} from "@/lib/bw/types";
import { COMPANY_WHATSAPP } from "@/lib/format";

const STATUS_LABEL: Record<BwListing["status"], string> = {
  draft: "مسودة",
  active: "منشور",
  sold: "بيعت",
  expired: "منتهي",
  withdrawn: "مسحوب",
};

const STATUS_CLS: Record<BwListing["status"], string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-emerald-100 text-emerald-800",
  sold: "bg-slate-800 text-white",
  expired: "bg-amber-100 text-amber-800",
  withdrawn: "bg-red-100 text-red-800",
};

export default function ResaleDashboard() {
  const [tab, setTab] = useState<"listings" | "requests">("listings");
  const [listings, setListings] = useState<BwListing[]>([]);
  const [privs, setPrivs] = useState<Record<string, BwPrivate>>({});
  const [requests, setRequests] = useState<BwRequest[]>([]);
  const [flags, setFlags] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  // فحص ضد النصب مع كل فتح للوحة: كل قطعة مطابَقة مع المنصة يُعاد فحصها. القطعة التي صارت «متاحة» على موقع الهيئة
  // يُوقف إعلانها النشط تلقائيًا؛ «مفقودة» أو أي حالة غير معروفة تنبيه فقط. وقبل أي كتابة: شكل البيانات سليم، ولا نسبة
  // غير معتادة (عطل في المنصة) — وإلا لا يُكتب ولا يُوقف شيء.
  const liveCheck = useCallback(async (ls: BwListing[], ps: Record<string, BwPrivate>) => {
    const targets = ls.filter((l) => ps[l.id]?.platform && (l.status === "active" || l.status === "draft"));
    if (!targets.length) return;
    setBusy(true);
    try {
      const payload = await fetchPlatformPlots();
      if (!payloadLooksHealthy(payload, targets.map((l) => ps[l.id].platform!.zoneId)))
        throw new Error("بيانات المنصة ناقصة أو تغيّر شكلها الآن؛ لم يُسجَّل ولم يُوقف أي إعلان.");
      const now = new Date().toISOString();
      const results = targets.map((l) => {
        const pm = ps[l.id].platform!;
        const hit = findPlot(payload, pm.zoneId, pm.plotNumber);
        const status = hit ? hit.status : "missing";
        return {
          l,
          available: status === "available",
          bad: !isTaken(status),
          platform: {
            ...pm,
            status,
            statusSince: hit?.statusSince ?? pm.statusSince,
            checkedAt: now,
            dataAt: hit?.lastSeen || payload.generated_at || null,
            k: hit ? anonymityK(payload, hit) : pm.k,
          },
        };
      });
      const bad = results.filter((r) => r.bad);
      if (results.length >= 5 && bad.length / results.length > 0.3) {
        setMsg(`نتيجة غير معتادة: ${plotsCount(bad.length)} من ${results.length} غير محجوزة. لم يُسجَّل ولم يُوقف شيء؛ راجع يدويًا.`);
        setBusy(false);
        return;
      }
      const out: Record<string, string> = {};
      let paused = 0;
      for (const r of results) {
        const pause = r.available && r.l.status === "active";
        await recordLiveCheck(r.l.id, r.platform, pause);
        if (pause) paused++;
        if (r.bad) out[r.l.id] = `القطعة «${r.platform.status}» على موقع الهيئة${pause ? "، وأُوقف الإعلان تلقائيًا" : ""}. راجع البائع.`;
      }
      setFlags(out);
      setMsg(
        bad.length
          ? `الفحص الحي: ${bad.length.toLocaleString("ar-EG")} تنبيه، والإعلانات الموقوفة تلقائيًا: ${paused.toLocaleString("ar-EG")}.`
          : `الفحص الحي: كل القطع المطابَقة (${results.length.toLocaleString("ar-EG")}) ما زالت محجوزة.`
      );
      const [l2, p2] = await Promise.all([listListingsAdmin(), listPrivatesAdmin()]);
      setListings(l2);
      setPrivs(p2);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "تعذّر الفحص الحي.");
    }
    setBusy(false);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [l, p, r] = await Promise.all([listListingsAdmin(), listPrivatesAdmin(), listRequestsAdmin()]);
      setListings(l);
      setPrivs(p);
      setRequests(r);
      setLoading(false);
      await liveCheck(l, p);
      return;
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "تعذّر التحميل.");
    }
    setLoading(false);
  }, [liveCheck]);

  useEffect(() => {
    load();
  }, [load]);

  const now = Date.now();
  const counts = useMemo(() => {
    const c = { active: 0, stale: 0, draft: 0, newReq: 0 };
    for (const l of listings) {
      if (l.status === "active") c.active++;
      if (l.status === "active" && isStale(l, now)) c.stale++;
      if (l.status === "draft") c.draft++;
    }
    c.newReq = requests.filter((r) => r.status === "new").length;
    return c;
  }, [listings, requests, now]);


  const onDemand = async () => {
    setBusy(true);
    try {
      const n = await recomputeDemand(requests);
      setMsg(`حُدِّثت عدادات الطلب. طلبات الشراء الصالحة في آخر 12 شهرًا: ${n.toLocaleString("ar-EG")}.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "تعذّر التحديث.");
    }
    setBusy(false);
  };

  const onReqStatus = async (id: string, s: BwRequestStatus) => {
    await setRequestStatus(id, s);
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status: s } : r)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-orange-600">لوحة التحكم</Link>
            <h1 className="text-3xl font-bold text-gray-800">بيت الوطن: البيع والشراء</h1>
            <p className="text-gray-600 mt-1">
              {counts.active} منشور · {counts.draft} مسودة · {counts.newReq} طلب جديد
              {counts.stale > 0 && <span className="text-amber-700"> · {counts.stale} يحتاج إعادة توثيق</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => liveCheck(listings, privs)} disabled={busy || loading}>فحص القطع مع البيانات الحية</Button>
            <Button variant="outline" onClick={onDemand} disabled={busy || loading}>تحديث عدادات الطلب</Button>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/dashboard/resale/edit">إعلان جديد</Link>
            </Button>
          </div>
        </div>

        {msg && <p className="rounded-lg bg-white border border-gray-200 p-3 text-sm" role="status">{msg}</p>}

        <div className="flex gap-2 border-b border-gray-200">
          {(["listings", "requests"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 -mb-px border-b-2 font-medium ${tab === t ? "border-orange-500 text-orange-600" : "border-transparent text-gray-600"}`}
            >
              {t === "listings" ? `الإعلانات (${listings.length})` : `الطلبات (${requests.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-600">جارٍ التحميل…</p>
        ) : tab === "listings" ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-right">الكود</th>
                  <th className="p-3 text-right">القطعة</th>
                  <th className="p-3 text-right">الأوفر</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-right">التوثيق</th>
                  <th className="p-3 text-right">البائع</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-gray-500">لا توجد إعلانات بعد.</td></tr>
                )}
                {listings.map((l) => {
                  const p = privs[l.id];
                  const stale = l.status === "active" && isStale(l, now);
                  return (
                    <tr key={l.id} className="border-t border-gray-100 align-top">
                      <td className="p-3 font-mono">{l.id}</td>
                      <td className="p-3">
                        {l.area} م² · {l.district || "—"} · {cityName(l.citySlug)}
                        {flags[l.id] && <p className="text-red-700 font-semibold mt-1">⚠ {flags[l.id]}</p>}
                      </td>
                      <td className="p-3 whitespace-nowrap">{fmtEgp(l.premiumEgp)}</td>
                      <td className="p-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_CLS[l.status]}`}>{STATUS_LABEL[l.status]}</span></td>
                      <td className={`p-3 whitespace-nowrap ${stale ? "text-amber-700 font-semibold" : ""}`}>
                        {fmtDate(l.verifiedAt)}{stale && " (انتهى)"}
                      </td>
                      <td className="p-3">{p?.sellerName || "—"}</td>
                      <td className="p-3 whitespace-nowrap space-x-2 space-x-reverse">
                        <Link href={`/dashboard/resale/edit?id=${l.id}`} className="text-orange-600 hover:underline">تعديل</Link>
                        {(l.status === "active" || l.status === "sold") && (
                          <a href={listingPath(l)} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">عرض</a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-right">النوع</th>
                  <th className="p-3 text-right">الاسم والهاتف</th>
                  <th className="p-3 text-right">المدينة والحي</th>
                  <th className="p-3 text-right">التفاصيل</th>
                  <th className="p-3 text-right">التاريخ</th>
                  <th className="p-3 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-500">لا توجد طلبات بعد.</td></tr>
                )}
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100 align-top">
                    <td className="p-3 font-semibold">{r.kind === "buy" ? "شراء" : "بيع"}</td>
                    <td className="p-3">
                      {r.name}
                      <a
                        href={`https://wa.me/${r.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-emerald-700 hover:underline"
                        dir="ltr"
                        style={{ textAlign: "right" }}
                      >
                        {r.phone}
                      </a>
                    </td>
                    <td className="p-3">{cityName(r.citySlug)}{r.district && ` · ${r.district}`}</td>
                    <td className="p-3 text-gray-700">
                      {r.phase === "11" ? "المرحلة 11" : r.phase === "old" ? "حتى العاشرة" : "أي مرحلة"}
                      {r.area ? ` · ${r.area} م²` : ""}
                      {r.budgetEgp ? ` · حتى ${fmtEgp(r.budgetEgp)}` : ""}
                      {r.notes && <p className="text-gray-500 mt-1">{r.notes}</p>}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {fmtDate(r.createdAt)}
                      {Date.parse(r.createdAt) < now - 365 * 86400000 && <span className="block text-amber-700 text-xs">انتهت مدته (12 شهرًا)</span>}
                    </td>
                    <td className="p-3">
                      <select
                        aria-label="حالة الطلب"
                        value={r.status}
                        onChange={(e) => onReqStatus(r.id, e.target.value as BwRequestStatus)}
                        className="rounded border border-gray-300 bg-white px-2 py-1"
                      >
                        {(Object.keys(REQUEST_STATUS_LABEL) as BwRequestStatus[]).map((s) => (
                          <option key={s} value={s}>{REQUEST_STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-gray-500">
          رقم الشركة على واتساب: {COMPANY_WHATSAPP}. بيانات البائعين والمشترين لا تُستخدم إلا للطلب نفسه، ولا تُشارك مع الطرف الآخر إلا بموافقته.
        </p>
      </main>
      <Footer />
    </div>
  );
}
