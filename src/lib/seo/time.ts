// src/lib/seo/time.ts
// تواريخ القاهرة: المرئية بأرقام لاتينية («28 سبتمبر 2026»)، والآلية (dateModified وlastmod و<time datetime>)
// بصيغة ISO 8601 بإزاحة القاهرة السارية في تلك اللحظة — لا +02:00 ولا +03:00 ثابتة (التوقيت الصيفي ينتهي 29/10).
// نقي بلا Next ولا Firebase. (spec-final A3.1)

const TZ = "Africa/Cairo";
const DATE = new Intl.DateTimeFormat("ar-EG-u-nu-latn", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
const DT = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
  timeZone: TZ,
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZoneName: "longOffset",
});

function toDate(d: string | Date): Date {
  const t = d instanceof Date ? d : new Date(d);
  if (isNaN(t.getTime())) throw new Error(`invalid date: ${String(d)}`);
  return t;
}

function parts(d: Date): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of PARTS.formatToParts(d)) out[p.type] = p.value;
  return out;
}

/** «+03:00» — إزاحة القاهرة في هذه اللحظة */
function offsetOf(d: Date): string {
  const name = parts(d).timeZoneName || "GMT";
  const off = name.replace("GMT", "");
  return off === "" ? "+00:00" : off;
}

function offsetMinutes(off: string): number {
  const m = off.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

/** «28 سبتمبر 2026» */
export const cairoDate = (d: string | Date): string => DATE.format(toDate(d));

/** «28 سبتمبر 2026 في 17:40 بتوقيت القاهرة» */
export const cairoDateTime = (d: string | Date): string => `${DT.format(toDate(d))} بتوقيت القاهرة`;

/** ISO 8601 بإزاحة القاهرة السارية، مثل "2026-09-28T17:40:43+03:00" */
export function cairoIso(d: string | Date): string {
  const t = toDate(d);
  const p = parts(t);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${offsetOf(t)}`;
}

/**
 * نص محلي بتوقيت القاهرة («2026-09-28 17:40:43» أو «2026-09-28») → ISO بالإزاحة السارية وقتها.
 * المنصة تعلن أوقاتها بهذه الصيغة المحلية.
 */
export function cairoLocalToIso(s: string): string {
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) throw new Error(`invalid Cairo local time: ${s}`);
  const [, y, mo, d, h = "00", mi = "00", se = "00"] = m;
  const asUtc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(se));
  // نقطتان: الإزاحة عند التخمين ثم عند الناتج (تحسم ساعة تغيير التوقيت)
  let utc = asUtc - offsetMinutes(offsetOf(new Date(asUtc - 2 * 3600e3))) * 60e3;
  const second = asUtc - offsetMinutes(offsetOf(new Date(utc))) * 60e3;
  if (second !== utc) utc = second;
  return cairoIso(new Date(utc));
}

/** تاريخ اليوم (أو لحظة معينة) بتوقيت القاهرة «YYYY-MM-DD» */
export function cairoDay(d: string | Date): string {
  return cairoIso(d).slice(0, 10);
}

/** أحدث تاريخ بين قائمة (ISO أو Date)؛ null إن لم يوجد تاريخ صالح */
export function maxIso(values: (string | Date | null | undefined)[]): string | null {
  let best: number | null = null;
  for (const v of values) {
    if (!v) continue;
    const t = new Date(v).getTime();
    if (!isNaN(t) && (best === null || t > best)) best = t;
  }
  return best === null ? null : new Date(best).toISOString();
}
