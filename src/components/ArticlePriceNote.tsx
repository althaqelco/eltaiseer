import Link from "next/link";

// تنويه ثابت أعلى المقالات التي تذكر أسعاراً: أرقام المقال تقديرية بتاريخ كتابته،
// والمرجع الحالي هو صفحة الأسعار المحسوبة من المعروض الفعلي — فلا يتعارض مقال قديم مع بيانات اليوم
export function ArticlePriceNote() {
  return (
    <aside
      role="note"
      className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"
    >
      الأسعار والعوائد المذكورة في هذا المقال تقديرية بتاريخ كتابته، وليست عرضاً ملزماً ولا وعداً بعائد.
      الأرقام الحالية المحسوبة من العقارات المعروضة فعلاً تجدها في صفحة{" "}
      <Link href="/prices" className="font-semibold underline">
        أسعار العقارات اليوم
      </Link>
      .
    </aside>
  );
}
