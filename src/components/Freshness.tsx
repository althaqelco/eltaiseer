// «آخر تحديث» الظاهر: تاريخ حقيقي من البيانات أو من سجل التحرير، داخل <time datetime> بإزاحة القاهرة.
// مكوّن خادم؛ لا يُستورد من مكوّن "use client".
import { cairoDate, cairoIso } from "@/lib/seo/time";

export function Freshness({
  data,
  reviewed,
  published,
  dataLabel = "آخر تحديث للبيانات",
  className = "freshness text-sm text-gray-500",
}: {
  data?: string | null;
  reviewed?: string | null;
  published?: string | null;
  dataLabel?: string;
  className?: string;
}) {
  if (!data && !reviewed && !published) return null;
  const parts: React.ReactNode[] = [];
  if (data) parts.push(<span key="d">{dataLabel}: <time dateTime={cairoIso(data)}>{cairoDate(data)}</time></span>);
  if (reviewed) parts.push(<span key="r">آخر مراجعة للمحتوى: <time dateTime={cairoIso(reviewed)}>{cairoDate(reviewed)}</time></span>);
  if (published) parts.push(<span key="p">نُشر: <time dateTime={cairoIso(published)}>{cairoDate(published)}</time></span>);
  return (
    <p className={className}>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && " · "}
          {p}
        </span>
      ))}
    </p>
  );
}
