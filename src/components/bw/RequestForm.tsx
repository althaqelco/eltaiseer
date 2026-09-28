"use client";

// نموذج «عايز أبيع أرضي» و«طلب شراء»: يُحفظ الطلب لدينا ثم يُعرض زر متابعة على واتساب.
// إن تعذّر الحفظ (شبكة أو قواعد) يبقى واتساب طريقًا بديلًا حتى لا يضيع العميل.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BW_CITIES, cityName, parseNumber } from "@/lib/bw/cities";
import { submitRequest, validateRequest, type NewRequest } from "@/lib/bw/requests";
import type { BwRequestKind, BwRequestPhase } from "@/lib/bw/types";
import { COMPANY_WHATSAPP } from "@/lib/format";

const selectCls =
  "flex h-10 w-full rounded-md border border-input bg-white px-3 text-base md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function RequestForm({
  kind,
  defaultCity = "",
  defaultPhase,
}: {
  kind: BwRequestKind;
  defaultCity?: string;
  defaultPhase?: BwRequestPhase;
}) {
  const sell = kind === "sell";
  const [f, setF] = useState({
    name: "",
    phone: "",
    citySlug: defaultCity,
    district: "",
    phase: (defaultPhase && (defaultPhase !== "any" || !sell) ? defaultPhase : sell ? "old" : "any") as BwRequestPhase,
    area: "",
    budget: "",
    notes: "",
    consent: false,
    website: "", // حقل مخفي: البوتات تملؤه
  });
  const [state, setState] = useState<"idle" | "sending" | "saved" | "failed">("idle");
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // النموذج يختفي بعد الإرسال فتقفز الصفحة؛ نعيد النتيجة لمجال الرؤية
  useEffect(() => {
    if (state === "saved" || state === "failed") resultRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const req: NewRequest = {
    kind,
    name: f.name,
    phone: f.phone,
    citySlug: f.citySlug,
    district: f.district,
    phase: f.phase,
    // نص غير مفهوم ≠ فارغ: NaN يجعل التحقق يطلب رقمًا بدل أن يُحذف ما كتبه الزائر بصمت
    area: f.area.trim() ? parseNumber(f.area) ?? NaN : null,
    budgetEgp: f.budget.trim() ? parseNumber(f.budget) ?? NaN : null,
    notes: f.notes,
  };

  const waText = [
    sell ? "طلب بيع أرض بيت الوطن من موقع التيسير" : "طلب شراء أرض بيت الوطن من موقع التيسير",
    `الاسم: ${f.name}`,
    `الهاتف: ${f.phone}`,
    f.citySlug && `المدينة: ${cityName(f.citySlug)}`,
    f.district && `الحي/المنطقة: ${f.district}`,
    `المرحلة: ${f.phase === "11" ? "المرحلة 11" : f.phase === "old" ? "المراحل حتى العاشرة" : "أي مرحلة"}`,
    f.area && `المساحة: ${f.area} م²`,
    f.budget && `الميزانية: ${f.budget} جنيه`,
    f.notes && `ملاحظات: ${f.notes}`,
  ]
    .filter(Boolean)
    .join("\n");
  const waUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(waText)}`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.website) return;
    const err = validateRequest(req);
    if (err) return setError(err);
    if (!f.consent) return setError("وافق على التواصل والشروط لإرسال الطلب.");
    setError("");
    setState("sending");
    try {
      await submitRequest(req);
      setState("saved");
    } catch {
      setState("failed");
    }
  };

  if (state === "saved" || state === "failed") {
    const ok = state === "saved";
    return (
      <div ref={resultRef} className={`rounded-xl border p-6 ${ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`} role="status">
        <div className="flex items-start gap-3">
          {ok ? <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" aria-hidden /> : <AlertTriangle className="h-7 w-7 text-amber-600 shrink-0" aria-hidden />}
          <div>
            <p className="font-bold text-gray-900 text-lg">{ok ? "وصلنا طلبك" : "لم يُحفظ الطلب"}</p>
            <p className="text-gray-700 mt-1">
              {ok
                ? sell
                  ? "هنتواصل معاك خلال يوم عمل لطلب المستندات وتحديد موعد المعاينة. لو حابب تسرّع، ابعت لنا على واتساب."
                  : "هنتواصل معاك أول ما تتوثّق قطعة مطابقة لطلبك. لو حابب تسرّع، ابعت لنا على واتساب."
                : "حصلت مشكلة في الحفظ. ابعت نفس البيانات على واتساب وهنتابع معاك من هناك."}
            </p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3">
              <Button className="bg-emerald-600 hover:bg-emerald-700">متابعة على واتساب</Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bw-name">الاسم</Label>
          <Input id="bw-name" value={f.name} onChange={set("name")} autoComplete="name" required className="bg-white h-10" />
        </div>
        <div>
          <Label htmlFor="bw-phone">رقم واتساب</Label>
          <Input id="bw-phone" value={f.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+966 5x xxx xxxx" required className="bg-white h-10 text-left" />
        </div>
        <div>
          <Label htmlFor="bw-city">المدينة</Label>
          <select id="bw-city" value={f.citySlug} onChange={set("citySlug")} required className={selectCls}>
            <option value="">اختر المدينة</option>
            {BW_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.nameAr}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="bw-district">الحي أو المنطقة {sell ? "" : "(اختياري)"}</Label>
          <Input id="bw-district" value={f.district} onChange={set("district")} placeholder="مثال: الحي الخامس" className="bg-white h-10" />
        </div>
        <div>
          <Label htmlFor="bw-phase">المرحلة</Label>
          <select id="bw-phase" value={f.phase} onChange={set("phase")} className={selectCls}>
            <option value="old">المراحل حتى العاشرة</option>
            <option value="11">المرحلة 11</option>
            {!sell && <option value="any">أي مرحلة</option>}
          </select>
        </div>
        <div>
          <Label htmlFor="bw-area">المساحة التقريبية (م²، اختياري)</Label>
          <Input id="bw-area" value={f.area} onChange={set("area")} inputMode="numeric" dir="ltr" className="bg-white h-10 text-left" />
        </div>
        {!sell && (
          <div className="sm:col-span-2">
            <Label htmlFor="bw-budget">أقصى أوفر تقبله بالجنيه (اختياري)</Label>
            <Input id="bw-budget" value={f.budget} onChange={set("budget")} inputMode="numeric" dir="ltr" className="bg-white h-10 text-left" />
          </div>
        )}
      </div>

      {f.phase === "11" && (
        <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          <Link href="/beit-al-watan-for-sale/phase-11/" className="font-semibold underline">شروط بيع المرحلة 11</Link>:{" "}
          {sell
            ? "نقبل قطع المرحلة 11 بعد صدور خطاب التخصيص أو التعاقد، والبيع بالتنازل الرسمي بموافقة جهاز المدينة. لو الخطاب لسه موصلكش، سجّل دلوقتي ونجهّز ملفك وننشر الإعلان بعد وصوله. كود الحجز أو المسلسل نفسه لا يُباع."
            : "نبلغك بقطع المرحلة 11 المخصصة والموثّقة أول ما تُنشر. كود الحجز لا يُباع ولا يُنقل، والشراء يتم بالتنازل الرسمي بموافقة جهاز المدينة."}
        </p>
      )}

      <div>
        <Label htmlFor="bw-notes">ملاحظات (اختياري)</Label>
        <textarea id="bw-notes" value={f.notes} onChange={set("notes")} rows={3} maxLength={500} className="w-full rounded-md border border-input bg-white px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor="bw-website">الموقع</label>
        <input id="bw-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
      </div>

      <label htmlFor="bw-consent" className="flex items-start gap-2 text-sm text-gray-700">
        <input id="bw-consent" type="checkbox" checked={f.consent} onChange={set("consent")} className="mt-1 h-4 w-4 accent-orange-600" />
        <span>
          أوافق على أن تتواصل معي التيسير بخصوص هذا الطلب، وعلى{" "}
          <Link href="/terms/#beit-al-watan-resale" className="text-orange-600 underline">شروط بيع وشراء أراضي بيت الوطن</Link> و
          <Link href="/privacy/" className="text-orange-600 underline">سياسة الخصوصية</Link>.
        </span>
      </label>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <Button type="submit" disabled={state === "sending"} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 h-11 px-8 text-base">
        {state === "sending" ? "جارٍ الإرسال…" : sell ? "أرسل طلب البيع" : "سجّل طلب الشراء"}
      </Button>
    </form>
  );
}
