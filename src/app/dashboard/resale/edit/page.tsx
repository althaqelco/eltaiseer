"use client";

// محرر إعلان «بيت الوطن»: الإعلان العام + ملف البائع الخاص + مطابقة القطعة مع البيانات الحية + التوثيق والنشر.

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  emptyListing,
  emptyPrivate,
  fetchPlatformPlots,
  loadListingAdmin,
  newListingId,
  publishProblems,
  saveListingAdmin,
} from "@/lib/bw/admin";
import { BW_CITIES, cityByArabic, cityName, isValidSlug, suggestDistrictSlug } from "@/lib/bw/cities";
import { costCard, fmtEgp, fmtUsd, listingPath } from "@/lib/bw/calc";
import { publicView } from "@/lib/bw/publish";
import { anonymityK, findPlot, listZones, type PlotHit, type PlotsPayload } from "@/lib/bw/live-parse";
import { CHECK_LABEL, CHECK_ORDER, MIN_POINTS, STAGE_LABEL, type BwListing, type BwPrivate, type BwStage } from "@/lib/bw/types";
import { compressImage, uploadImage, validateImageFile } from "@/lib/imageUpload";

const box = "rounded-xl border border-gray-200 bg-white p-5 space-y-4";
const inp = "w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400";
const lab = "block text-sm font-medium text-gray-700 mb-1";

function numOrNull(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
}

function Editor() {
  const router = useRouter();
  const params = useSearchParams();
  const idParam = params.get("id");
  const [l, setL] = useState<BwListing | null>(null);
  const [p, setP] = useState<BwPrivate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [plots, setPlots] = useState<PlotsPayload | null>(null);
  const [zoneId, setZoneId] = useState<number>(0);
  const [plotNo, setPlotNo] = useState("");
  const [hit, setHit] = useState<PlotHit | null | "none">(null);
  // نسخة الإعلان التي فُتح بها المحرر (null لإعلان جديد): الحفظ يُرفض لو تغيّر الإعلان بعدها
  const [loadedAt, setLoadedAt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (idParam) {
        try {
          const r = await loadListingAdmin(idParam);
          setL(r.listing || emptyListing(idParam));
          setP(r.priv);
          setIsNew(!r.listing);
          setLoadedAt(r.listing ? r.listing.updatedAt : null);
        } catch (e) {
          setMsg({ ok: false, text: e instanceof Error ? e.message : "تعذّر التحميل." });
        }
      } else {
        const id = newListingId();
        setL(emptyListing(id));
        setP(emptyPrivate(id));
        setIsNew(true);
      }
    })();
  }, [idParam]);

  const problems = useMemo(() => (l && p ? publishProblems(l, p) : []), [l, p]);
  const cost = useMemo(() => (l ? costCard(l) : null), [l]);
  const zones = useMemo(() => (plots && l?.citySlug ? listZones(plots, l.citySlug) : []), [plots, l?.citySlug]);

  if (!l || !p) {
    return <p className="p-8 text-gray-600">{msg?.text || "جارٍ التحميل…"}</p>;
  }

  const setPub = <K extends keyof BwListing>(k: K, v: BwListing[K]) => setL((s) => (s ? { ...s, [k]: v } : s));
  const setPriv = <K extends keyof BwPrivate>(k: K, v: BwPrivate[K]) => setP((s) => (s ? { ...s, [k]: v } : s));

  const save = async (next?: Partial<BwListing>) => {
    const candidate: BwListing = { ...l, ...next };
    if (candidate.status === "active") {
      const probs = publishProblems(candidate, p);
      if (probs.length) {
        setMsg({ ok: false, text: `لا يمكن النشر: ${probs.join(" ")}` });
        return;
      }
    }
    setBusy(true);
    setMsg(null);
    try {
      const saved = await saveListingAdmin(candidate, p, loadedAt);
      setL({ ...candidate, updatedAt: saved.updatedAt });
      setP(saved.priv);
      setLoadedAt(saved.updatedAt);
      setMsg({ ok: true, text: "حُفظ." });
      if (isNew) {
        setIsNew(false);
        router.replace(`/dashboard/resale/edit?id=${candidate.id}`);
      }
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "تعذّر الحفظ." });
    }
    setBusy(false);
  };

  const onPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const v = validateImageFile(f);
        if (!v.valid) throw new Error(v.error || "صورة غير صالحة.");
        urls.push(await uploadImage(await compressImage(f)));
      }
      setPub("photos", [...l.photos, ...urls]);
      setMsg({ ok: true, text: `رُفعت ${urls.length} صورة. احفظ الإعلان.` });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "تعذّر رفع الصور." });
    }
    setBusy(false);
  };

  const loadPlots = async () => {
    setBusy(true);
    try {
      setPlots(await fetchPlatformPlots());
      setHit(null); // نتيجة مطابقة من لقطة أقدم لا تُستخدم مع لقطة جديدة
      setMsg({ ok: true, text: "تم جلب بيانات المنصة. اختر المنطقة واكتب رقم القطعة." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "تعذّر جلب بيانات المنصة." });
    }
    setBusy(false);
  };

  const match = () => {
    if (!plots || !zoneId || !plotNo.trim()) return;
    setHit(findPlot(plots, zoneId, plotNo) || "none");
  };

  const applyHit = (h: PlotHit) => {
    const k = plots ? anonymityK(plots, h) : 0;
    // مطابقة قطعة غير التي طوبقت قبلًا: القيم المشتقة من المطابقة السابقة (المسدد والمتبقي) تُعاد من البداية
    const other = !!p.platform && (p.platform.zoneId !== h.zoneId || p.platform.plotNumber !== h.plotNumber);
    setL((s) => {
      if (!s) return s;
      const paid = other ? h.down : s.paidUsd ?? h.down;
      const remaining = other || s.remainingUsd === null ? (h.total !== null && paid !== null ? Math.max(0, h.total - paid) : null) : s.remainingUsd;
      return {
        ...s,
        area: h.area || s.area,
        corner: h.corner,
        garden: h.garden,
        sea: h.sea,
        // المنصة ترصد الطرح الحالي فقط، فأي قطعة مطابَقة من المرحلة 11
        phase: 11,
        officialTotalUsd: h.total || s.officialTotalUsd,
        // اقتراح أولي من سجل الرصد (المقدم 25%)؛ يُصحَّح من إيصالات السداد الفعلية
        paidUsd: paid,
        remainingUsd: remaining,
        // قطعة عليها أقساط حتى تُسدَّد كاملة؛ «مسددة بالكامل» كانت تبقى افتراضيًا
        stage: (remaining ?? 0) > 0 || (h.total !== null && paid !== null && h.total - paid > 1) ? "installments" : s.stage,
        platformMatched: h.status === "reserved" || h.status === "sold",
      };
    });
    setP((s) =>
      s
        ? {
            ...s,
            zone: other ? h.zoneName : s.zone || h.zoneName,
            plotNumber: h.plotNumber,
            platform: {
              zoneId: h.zoneId,
              zoneName: h.zoneName,
              citySlug: cityByArabic(h.cityAr)?.slug || "",
              plotNumber: h.plotNumber,
              status: h.status,
              statusSince: h.statusSince,
              basePpm: h.basePpm,
              total: h.total,
              checkedAt: new Date().toISOString(),
              // وقت رصد القطعة نفسها من اللقطة التي جاء منها الـ hit (لا لقطة لاحقة)
              dataAt: h.lastSeen || h.snapshotAt,
              k,
            },
          }
        : s
    );
    setHit(null);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/resale" className="text-sm text-gray-500 hover:text-orange-600">البيع والشراء</Link>
          <h1 className="text-2xl font-bold text-gray-800">{isNew ? "إعلان جديد" : `إعلان ${l.id}`}</h1>
          <p className="text-sm text-gray-600">الحالة: {({ draft: "مسودة", active: "منشور", sold: "بيعت", expired: "منتهي", withdrawn: "مسحوب" } as const)[l.status]}</p>
        </div>
        {(l.status === "active" || l.status === "sold") && (
          <a href={listingPath(publicView(l, p))} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline text-sm">عرض الصفحة العامة</a>
        )}
      </div>

      {msg && (
        <p className={`rounded-lg p-3 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`} role="status">{msg.text}</p>
      )}

      <section className={box}>
        <h2 className="font-bold text-lg">القطعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lab} htmlFor="e-city">المدينة</label>
            <select id="e-city" className={inp} value={l.citySlug} onChange={(e) => setPub("citySlug", e.target.value)}>
              <option value="">اختر</option>
              {BW_CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.nameAr}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} htmlFor="e-district">الحي أو المنطقة (كما يعرفها الناس)</label>
            <input
              id="e-district"
              className={inp}
              value={l.district}
              onChange={(e) => {
                const v = e.target.value;
                setL((s) => (s ? { ...s, district: v, districtSlug: s.districtSlug || suggestDistrictSlug(v) } : s));
              }}
            />
          </div>
          <div>
            <label className={lab} htmlFor="e-dslug">رابط الحي (لاتيني)</label>
            <input id="e-dslug" dir="ltr" className={`${inp} ${l.districtSlug && !isValidSlug(l.districtSlug) ? "border-red-400" : ""}`} value={l.districtSlug} onChange={(e) => setPub("districtSlug", e.target.value.toLowerCase())} placeholder="district-5" />
          </div>
          <div>
            <label className={lab} htmlFor="e-phase">المرحلة</label>
            <input id="e-phase" type="number" step="any" min={0} className={inp} value={l.phase ?? ""} onChange={(e) => setPub("phase", numOrNull(e.target.value))} />
          </div>
          <div>
            <label className={lab} htmlFor="e-stage">وضع القطعة</label>
            <select id="e-stage" className={inp} value={l.stage} onChange={(e) => setPub("stage", e.target.value as BwStage)}>
              {(Object.keys(STAGE_LABEL) as BwStage[]).map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} htmlFor="e-area">المساحة (م²)</label>
            <input id="e-area" type="number" step="any" min={0} className={inp} value={l.area || ""} onChange={(e) => setPub("area", Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          {(["corner", "garden", "sea"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={l[k]} onChange={(e) => setPub(k, e.target.checked)} className="h-4 w-4 accent-orange-600" />
              {k === "corner" ? "ناصية" : k === "garden" ? "على حديقة" : "على البحر"}
            </label>
          ))}
        </div>
      </section>

      <section className={box}>
        <h2 className="font-bold text-lg">مطابقة مع البيانات الحية (للطروحات التي ترصدها المنصة)</h2>
        <p className="text-sm text-gray-600">
          تجلب بيانات منصة الحجز العامة مرة واحدة، وتملأ المساحة والسعر الرسمي والمقدم والميزات من سجل الرصد. القطعة التي تظهر «متاحة» على موقع الهيئة لا تُنشر.
          وإعلان المرحلة 11 لا يُنشر بدون مطابقة حديثة (آخر 7 أيام) تُثبت أنها محجوزة، وبعد خطاب التخصيص فقط.
          وبعد المطابقة تُنشر المساحة لأقرب 10 م² والأسعار لأقرب 5 آلاف دولار حتى لا يُستنتج رقم القطعة من البيانات العامة؛ الأرقام الدقيقة تبقى هنا.
        </p>
        <Button variant="outline" onClick={loadPlots} disabled={busy}>
          {plots ? `تحديث بيانات المنصة (لقطة ${plots.generated_at || "—"})` : "جلب بيانات المنصة"}
        </Button>
        {plots && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className={lab} htmlFor="e-zone">المنطقة في {l.citySlug ? cityName(l.citySlug) : "المدينة المختارة"}</label>
              <select id="e-zone" className={inp} value={zoneId} onChange={(e) => setZoneId(Number(e.target.value))}>
                <option value={0}>{zones.length ? "اختر المنطقة" : "لا مناطق مرصودة لهذه المدينة"}</option>
                {zones.map((z) => <option key={z.zoneId} value={z.zoneId}>{z.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lab} htmlFor="e-plotno">رقم القطعة</label>
              <input id="e-plotno" dir="ltr" className={inp} value={plotNo} onChange={(e) => setPlotNo(e.target.value)} />
            </div>
            <Button variant="outline" onClick={match} disabled={!zoneId || !plotNo.trim()}>طابق</Button>
          </div>
        )}
        {hit === "none" && <p className="text-sm text-red-700">لا توجد قطعة بهذا الرقم في هذه المنطقة في بيانات المنصة.</p>}
        {hit && hit !== "none" && (
          <div className={`rounded-lg p-3 text-sm ${hit.status === "available" ? "bg-red-50 text-red-900" : "bg-emerald-50 text-emerald-900"}`}>
            <p>
              {hit.zoneName} · قطعة {hit.plotNumber} · {hit.area} م² · سعر المتر الأساسي {fmtUsd(hit.basePpm)} · الإجمالي {fmtUsd(hit.total)}
            </p>
            <p className="font-semibold mt-1">
              الحالة على موقع الهيئة: {hit.status === "reserved" ? "محجوزة" : hit.status === "available" ? "متاحة، لا تُنشر" : hit.status}
              {hit.statusSince && ` منذ ${hit.statusSince}`}
            </p>
            <Button size="sm" className="mt-2" onClick={() => applyHit(hit)}>استخدم هذه البيانات</Button>
          </div>
        )}
        {p.platform && (
          <p className="text-xs text-gray-600">
            آخر مطابقة محفوظة: {p.platform.zoneName} · قطعة {p.platform.plotNumber} · {p.platform.status} · {p.platform.checkedAt.slice(0, 16).replace("T", " ")}
            {p.platform.dataAt && ` · لقطة المنصة ${p.platform.dataAt}`} · قطع مشابهة بعد التقريب في المنطقة: {p.platform.k}
            {!(p.platform.k >= MIN_POINTS) && <span className="text-red-700 font-semibold"> (يمكن معرفة رقمها من الإعلان: يلزم موافقة البائع)</span>}
          </p>
        )}
      </section>

      <section className={box}>
        <h2 className="font-bold text-lg">التكلفة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["officialTotalUsd", "السعر الرسمي الإجمالي ($)"],
              ["paidUsd", "المسدد حتى تاريخه ($)"],
              ["remainingUsd", "الأقساط المتبقية ($)"],
            ] as const
          ).map(([k, t]) => (
            <div key={k}>
              <label className={lab} htmlFor={`e-${k}`}>{t}</label>
              <input id={`e-${k}`} type="number" step="any" min={0} dir="ltr" className={inp} value={l[k] ?? ""} onChange={(e) => setPub(k, numOrNull(e.target.value))} />
            </div>
          ))}
          <div>
            <label className={lab} htmlFor="e-premium">الأوفر المطلوب (جنيه)</label>
            <input id="e-premium" type="number" step="any" min={0} dir="ltr" className={inp} value={l.premiumEgp || ""} onChange={(e) => setPub("premiumEgp", Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={lab} htmlFor="e-rate">سعر التحويل (جنيه للدولار)</label>
            <input id="e-rate" type="number" step="any" min={0} dir="ltr" className={inp} value={l.usdEgp || ""} onChange={(e) => setPub("usdEgp", Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className={lab} htmlFor="e-rate-date">تاريخ سعر التحويل</label>
            <input id="e-rate-date" type="date" className={inp} value={l.usdEgpDate} onChange={(e) => setPub("usdEgpDate", e.target.value)} />
          </div>
          <div>
            <label className={lab} htmlFor="e-fees">مصروفات إدارية تقديرية (%)</label>
            <input id="e-fees" type="number" step="any" min={0} dir="ltr" className={inp} value={l.feesPct} onChange={(e) => setPub("feesPct", Number(e.target.value) || 0)} />
          </div>
        </div>
        {cost && (
          <p className="text-sm text-gray-700 rounded-lg bg-gray-50 p-3">
            المدفوع للبائع: {fmtUsd(cost.paidUsd)} + {fmtEgp(cost.premiumEgp)} · التكلفة الكلية {fmtUsd(cost.totalUsdEquiv)} · للمتر {fmtUsd(cost.perM2Usd)} ({fmtEgp(cost.perM2Egp)})
          </p>
        )}
      </section>

      <section className={box}>
        <h2 className="font-bold text-lg">الوصف والصور</h2>
        <div>
          <label className={lab} htmlFor="e-summary">وصف قصير (الموقع والشارع والخدمات، بلا رقم القطعة)</label>
          <textarea id="e-summary" rows={4} maxLength={1200} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm" value={l.summary} onChange={(e) => setPub("summary", e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-3">
          {l.photos.map((u) => (
            <div key={u} className="relative h-24 w-32 rounded-lg overflow-hidden bg-gray-100">
              <Image src={u} alt="" fill className="object-cover" sizes="128px" />
              <button type="button" onClick={() => setPub("photos", l.photos.filter((x) => x !== u))} className="absolute top-1 left-1 rounded bg-black/70 text-white text-xs px-1.5">حذف</button>
            </div>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="rounded-md border border-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-50">رفع صور المعاينة</span>
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onPhotos(e.target.files)} />
        </label>
      </section>

      <section className={box}>
        <h2 className="font-bold text-lg">التوثيق</h2>
        <div className="space-y-2">
          {CHECK_ORDER.map((c) => (
            <label key={c} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-emerald-600"
                checked={l.checks.includes(c)}
                onChange={(e) => setPub("checks", e.target.checked ? [...l.checks, c] : l.checks.filter((x) => x !== c))}
              />
              {CHECK_LABEL[c]}{c === "authority" && <span className="text-gray-500"> (إن أمكن)</span>}
            </label>
          ))}
        </div>
        <div className="max-w-xs">
          <label className={lab} htmlFor="e-verified">تاريخ التوثيق</label>
          <input id="e-verified" type="date" className={inp} value={l.verifiedAt} onChange={(e) => setPub("verifiedAt", e.target.value)} />
        </div>
      </section>

      <section className={`${box} border-amber-300`}>
        <h2 className="font-bold text-lg">ملف البائع (خاص، لا يُنشر)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["sellerName", "اسم البائع"],
              ["sellerPhone", "هاتف البائع"],
              ["zone", "المنطقة أو القطاع كما في خطاب التخصيص"],
              ["plotNumber", "رقم القطعة"],
              ["contractSignedAt", "تاريخ عقد الوساطة"],
              ["exclusiveUntil", "الحصرية حتى"],
            ] as const
          ).map(([k, t]) => (
            <div key={k}>
              <label className={lab} htmlFor={`p-${k}`}>{t}</label>
              <input
                id={`p-${k}`}
                type={k === "contractSignedAt" || k === "exclusiveUntil" ? "date" : "text"}
                className={inp}
                value={p[k]}
                onChange={(e) => setPriv(k, e.target.value)}
              />
            </div>
          ))}
          <div>
            <label className={lab} htmlFor="p-commission">نسبة العمولة (%)</label>
            <input id="p-commission" type="number" step="any" min={0} dir="ltr" className={inp} value={p.commissionPct ?? ""} onChange={(e) => setPriv("commissionPct", numOrNull(e.target.value))} />
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-orange-600" checked={p.authorityTransferConfirmed} onChange={(e) => setPriv("authorityTransferConfirmed", e.target.checked)} />
          جهاز المدينة أكد كتابيًا شروط التنازل لقطعة عليها أقساط (مطلوب فقط لهذا النوع)
        </label>
        {p.platform && !(p.platform.k >= MIN_POINTS) && (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-orange-600" checked={p.identifiableConsent} onChange={(e) => setPriv("identifiableConsent", e.target.checked)} />
            البائع وافق كتابيًا على نشر الإعلان رغم أن أرقام قطعته العامة مميزة ويمكن معرفة رقمها بمقارنتها بالبيانات العامة
          </label>
        )}
        <div>
          <label className={lab} htmlFor="p-notes">ملاحظات داخلية</label>
          <textarea id="p-notes" rows={3} className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm" value={p.notes} onChange={(e) => setPriv("notes", e.target.value)} />
        </div>
      </section>

      {problems.length > 0 && l.status !== "active" && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          <p className="font-bold mb-1">قبل النشر:</p>
          <ul className="list-disc pr-5 space-y-0.5">{problems.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2 sticky bottom-0 bg-gray-50/95 py-3">
        <Button onClick={() => save()} disabled={busy} variant="outline">حفظ</Button>
        {l.status !== "active" && (
          <Button onClick={() => save({ status: "active", soldAt: null })} disabled={busy || problems.length > 0} className="bg-emerald-600 hover:bg-emerald-700">نشر</Button>
        )}
        {l.status === "active" && (
          <Button onClick={() => save({ status: "sold", soldAt: new Date().toISOString() })} disabled={busy} className="bg-slate-800 hover:bg-slate-900">تعليم كمباعة</Button>
        )}
        {l.status === "active" && (
          <Button onClick={() => save({ status: "expired" })} disabled={busy} variant="outline">إنهاء</Button>
        )}
        {l.status !== "withdrawn" && !isNew && (
          <Button onClick={() => save({ status: "withdrawn" })} disabled={busy} variant="outline" className="text-red-700 border-red-300">سحب (نصب أو نزاع)</Button>
        )}
      </div>
    </main>
  );
}

export default function ResaleEditPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<p className="p-8 text-gray-600">جارٍ التحميل…</p>}>
        <Editor />
      </Suspense>
      <Footer />
    </div>
  );
}
