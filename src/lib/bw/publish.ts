// lib/bw/publish.ts
// شروط نشر الإعلان — نقية بلا Firestore حتى تُختبر مباشرة. فارغة = مسموح بالنشر.
//
// المرحلة 11 مفتوحة بقرار المالك (28/9/2026) بنفس شرط باقي المراحل: القطعة المخصصة أو المتعاقد عليها فقط.
// كود الحجز والمسلسل والرصيد لا تُباع أبدًا؛ فقطعة المرحلة 11 لا تُنشر إلا بعد:
//   1) خطاب تخصيص أو عقد راجعناه (بند allocation)،
//   2) مطابقة حديثة مع سجل رصد المنصة تُثبت أن القطعة مأخوذة فعلًا (محجوزة أو مباعة، لا متاحة ولا مختلقة)،
//   3) تأكيد مكتوب من جهاز المدينة لشروط التنازل (القطع عليها أقساط دائمًا في هذه المرحلة).

import { cityBySlug, isValidSlug, normalizeAr, toAsciiDigits } from "./cities";
import { isStale } from "./calc";
import { PHASE11_MATCH_MAX_DAYS, PHASE11_RESALE_OPEN } from "./constants";
import { MIN_POINTS, REQUIRED_CHECKS, type BwListing, type BwPrivate } from "./types";

const DAY = 86400000;

export function isPhase11(l: Pick<BwListing, "phase">): boolean {
  return l.phase !== null && l.phase >= 11;
}

// المنصة تعامل «مباعة» مثل «محجوزة» (قطعة مأخوذة)؛ الهيئة قد تغيّر التسمية بعد التخصيص
export function isTaken(status: string | null | undefined): boolean {
  return status === "reserved" || status === "sold";
}

// «١٢/٣» = «12 / 3» لكن ≠ «123» و≠ «1/23»: الفواصل تُوحَّد ولا تُحذف
export function normPlotNo(s: string): string {
  return toAsciiDigits(String(s || ""))
    .replace(/\s+/g, "")
    .replace(/[/\\\-–]+/g, "/")
    .replace(/[^0-9a-zA-Z\u0621-\u064A/]+/g, "")
    .toLowerCase();
}

// أوقات المنصة مكتوبة بتوقيت القاهرة بلا منطقة زمنية. +03:00 (الصيفي) هو أبكر تفسير ممكن: دقيق صيفًا، وأقدم بساعة شتاءً — أي أحوط
export function cairoTime(s: string | null | undefined): number {
  if (!s) return NaN;
  return Date.parse(/[T]|[+-]\d\d:\d\d$|Z$/.test(s) ? s : `${s.replace(" ", "T")}+03:00`);
}

// مفتاح القطعة لمنع تكرارها: «١١٢» = «112»، و«منطقة (Q)» = «المنطقة Q»، والقطع المطابَقة مع الرصد تُعرَّف برقم منطقتها في المنصة
export function plotKey(citySlug: string, zone: string, plotNumber: string, zoneId?: number | null): string {
  const z = zoneId
    ? `zone:${zoneId}`
    : normalizeAr(toAsciiDigits(zone))
        .replace(/[^0-9a-zA-Z\u0621-\u064A]+/g, " ") // الترقيم مسافة أولًا، حتى تُحذف «منطقة» الملاصقة لقوس أو شرطة
        .replace(/(^|\s)(ال)?منطقه(?=\s|$)/g, " ")
        .replace(/\s+/g, "")
        .toLowerCase();
  const n = normPlotNo(plotNumber);
  return citySlug && z && n ? [citySlug, z, n].join("|") : "";
}

const round = (x: number | null, step: number) => (x === null ? null : Math.round(x / step) * step);

// المتبقي الفعلي: لا نثق بحقل «الأقساط المتبقية» وحده (قد يُترك فارغًا أو صفرًا)؛ الرسمي − المسدد حد أدنى
export function effectiveRemaining(l: Pick<BwListing, "officialTotalUsd" | "paidUsd" | "remainingUsd">): number {
  const diff = l.officialTotalUsd !== null && l.paidUsd !== null ? l.officialTotalUsd - l.paidUsd : 0;
  return Math.max(l.remainingUsd ?? 0, diff, 0);
}

// ما يُكتب في الإعلان العام. القطعة المطابَقة مع الرصد الحي تُقرَّب مساحتها وأسعارها: بالأرقام الدقيقة كان قرابة نصف القطع
// المحجوزة (قياس 28/9 على 1,018 قطعة) يُعرف رقمها بمقارنة الإعلان ببيانات /api/plots العامة؛ بالتقريب ≈ 18%، والباقي يحتاج موافقة البائع.
export function publicView(l: BwListing, p: BwPrivate): BwListing {
  const clean = (s: string) => s.replace(/[<>]/g, "");
  const base = { ...l, district: clean(l.district), summary: clean(l.summary) };
  if (!p.platform) return { ...base, approx: false };
  const official = round(l.officialTotalUsd, 5000);
  const paid = round(l.paidUsd, 5000);
  return {
    ...base,
    approx: true,
    area: Math.max(10, Math.round(l.area / 10) * 10),
    officialTotalUsd: official,
    paidUsd: paid,
    remainingUsd: l.remainingUsd === null ? null : official !== null && paid !== null ? Math.max(0, official - paid) : round(l.remainingUsd, 5000),
  };
}

export function publishProblems(l: BwListing, p: BwPrivate, now = Date.now()): string[] {
  const out: string[] = [];
  if (l.phase === null || !Number.isInteger(l.phase) || l.phase < 1 || l.phase > 11) out.push("اكتب رقم المرحلة (من 1 إلى 11).");
  if (p.platform && l.phase !== 11) out.push("القطعة مطابَقة مع الطرح الحالي، فالمرحلة لازم تكون 11.");
  if (!cityBySlug(l.citySlug)) out.push("اختر المدينة.");
  if (!l.district.trim()) out.push("اكتب اسم الحي أو المنطقة.");
  if (!isValidSlug(l.districtSlug)) out.push("رابط الحي لازم يكون حروفًا لاتينية صغيرة وأرقامًا وشرطات.");
  if (!(l.area > 0)) out.push("المساحة مطلوبة.");
  if (!(l.officialTotalUsd && l.officialTotalUsd > 0)) out.push("السعر الرسمي الإجمالي بالدولار مطلوب.");
  if (l.paidUsd === null) out.push("المسدد حتى تاريخه مطلوب (اكتب 0 لو لا يوجد).");
  if (l.remainingUsd === null) out.push("الأقساط المتبقية مطلوبة (اكتب 0 لو مسددة بالكامل).");
  if (l.officialTotalUsd !== null && l.paidUsd !== null && l.paidUsd > l.officialTotalUsd * 1.01)
    out.push("المسدد أكبر من السعر الرسمي: راجع الأرقام.");
  if (!(l.premiumEgp > 0)) out.push("الأوفر المطلوب بالجنيه مطلوب.");
  if (!(l.usdEgp >= 10 && l.usdEgp <= 500) || !l.usdEgpDate) out.push("سعر التحويل (بين 10 و500 جنيه للدولار) وتاريخه مطلوبان.");
  if (!(l.feesPct >= 0 && l.feesPct <= 10)) out.push("نسبة المصروفات الإدارية بين 0 و10%.");
  if (l.photos.length === 0) out.push("صورة معاينة واحدة على الأقل من فريقنا.");
  const missing = REQUIRED_CHECKS.filter((c) => !l.checks.includes(c));
  if (missing.length) out.push(`بنود توثيق ناقصة: ${missing.length}.`);
  if (!l.verifiedAt) out.push("تاريخ التوثيق مطلوب.");
  else if (Date.parse(l.verifiedAt) > now + DAY) out.push("تاريخ التوثيق في المستقبل: صحّحه.");
  else if (isStale(l, now)) out.push("تاريخ التوثيق أقدم من 45 يومًا: أعد التوثيق.");
  // من الحقول نفسها لا من البصمة المحفوظة: البصمة تُحسب عند الحفظ، ومسح رقم القطعة كان يمر بالبصمة القديمة
  if (!plotKey(l.citySlug, p.zone, p.plotNumber, p.platform?.zoneId))
    out.push("المنطقة ورقم القطعة في ملف البائع مطلوبان (لمنع تكرار القطعة).");
  if (!p.sellerName.trim() || !p.sellerPhone.trim()) out.push("اسم البائع وهاتفه في الملف الخاص مطلوبان.");
  // «مسددة بالكامل» على قطعة عليها أقساط وضع كاذب أمام المشتري
  if (l.stage !== "installments" && effectiveRemaining(l) > 1)
    out.push("عليها أقساط متبقية: اختر «مخصصة وعليها أقساط» حتى لا يُعرض وضع غير صحيح.");
  if (l.stage === "installments" && !p.authorityTransferConfirmed)
    out.push("قطعة عليها أقساط: لازم تأكيد مكتوب من جهاز المدينة لشروط التنازل قبل النشر.");
  if (p.platform && p.platform.status === "available")
    out.push("القطعة ظاهرة «متاحة» على موقع الهيئة في آخر مطابقة: لا تُنشر وتُراجع فورًا.");

  if (isPhase11(l) || p.platform) {
    if (!PHASE11_RESALE_OPEN) out.push("إعلانات المرحلة 11 موقوفة مؤقتًا من الإعدادات.");
    if (!l.checks.includes("allocation"))
      out.push("المرحلة 11: لا نشر قبل خطاب التخصيص أو العقد. كود الحجز نفسه لا يُباع.");
    if (l.stage === "received" || l.stage === "built") out.push("المرحلة 11: لم تُسلَّم قطعها بعد؛ اختر «مخصصة وعليها أقساط» أو «مسددة».");
    if (!p.platform) out.push("المرحلة 11: طابق القطعة مع بيانات المنصة الحية أولًا.");
    else {
      if (!isTaken(p.platform.status)) out.push("المرحلة 11: القطعة ليست «محجوزة» في سجل الرصد، فلا تُنشر.");
      // المطابقة لازم تخص القطعة المعروضة نفسها، لا قطعة طوبقت ثم تغيّر رقمها أو مدينتها في الملف
      if (normPlotNo(p.platform.plotNumber) !== normPlotNo(p.plotNumber))
        out.push("المرحلة 11: رقم القطعة في الملف لا يطابق القطعة التي طوبقت مع البيانات الحية؛ أعد المطابقة.");
      if (p.platform.citySlug !== l.citySlug) out.push("المرحلة 11: مدينة القطعة المطابَقة غير مدينة الإعلان؛ أعد المطابقة.");
      // الحداثة بالأقدم بين وقت المطابقة ووقت رصد القطعة نفسها؛ وقت رصد مفقود أو غير مقروء = غير حديث (نفشل مغلقين)
      const at = Math.min(Date.parse(p.platform.checkedAt), cairoTime(p.platform.dataAt));
      if (!isFinite(at) || now - at > PHASE11_MATCH_MAX_DAYS * DAY)
        out.push(`المرحلة 11: أعد مطابقة القطعة مع البيانات الحية (آخر رصد أقدم من ${PHASE11_MATCH_MAX_DAYS} أيام أو غير معروف).`);
      if (!(p.platform.k >= MIN_POINTS) && !p.identifiableConsent)
        out.push("أرقام القطعة العامة مميزة (أقل من 3 قطع مشابهة في منطقتها) فيمكن معرفة رقمها من الإعلان: لا تُنشر إلا بموافقة البائع المكتوبة.");
    }
    if (!p.authorityTransferConfirmed)
      out.push("المرحلة 11: لازم تأكيد مكتوب من جهاز المدينة لشروط التنازل قبل النشر.");
  }
  return out;
}
