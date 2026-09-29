// src/content/changelog.ts
// سجل تعديلات المحتوى (بتوقيت القاهرة). كل تعديل في نص صفحة يرفع modified في src/lib/seo/editorial.ts
// ويضيف سطرًا هنا. مكوّنات الخادم فقط.

export type ChangeEntry = { date: string; paths: string[]; what: string; why: string };

export const CHANGELOG: ChangeEntry[] = [
  {
    date: "2026-09-29",
    paths: ["/", "/new-damietta/", "/new-mansoura/", "/about/", "/blog/", "/llms.txt", "/llms-full.txt"],
    what: "حذف عبارات العوائد ونمو الأسعار المتوقع، وأرقام ثابتة غير محدثة عن عدد العقارات والمناطق ومدة التقسيط.",
    why: "ليست حقائق موثقة بمصدر وتاريخ.",
  },
  {
    date: "2026-09-29",
    paths: ["/prices/"],
    what: "إعادة حساب جدول الأسعار بالوسيط لكل حي ونوع عقار، بحد أدنى 3 عقارات واستبعاد القيم غير المنطقية.",
    why: "المتوسط البسيط القديم خلط الأنواع وأظهر قيمًا شاذة.",
  },
  {
    date: "2026-09-29",
    paths: ["/blog/investment-guide/", "/blog/new-mansoura-investment/"],
    what: "إعادة كتابة المقالين كدليلين محايدين للمشتري بلا وعود بعائد.",
    why: "المحتوى السابق قدّم نسب عائد ونمو بلا مصدر.",
  },
  {
    date: "2026-09-29",
    paths: ["/beit-al-watan-for-sale/", "/beit-al-watan-for-sale/phase-11/"],
    what: "ترتيب جدول المدن بالاسم، وحذف عمود «محجوز»، وإضافة شرط الأهلية بجوار المتاح من الهيئة.",
    why: "ترتيب محايد، وتوضيح أن الحجز لمن سجّل حوالته التنشيطية في موعدها.",
  },
];
