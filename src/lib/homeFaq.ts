// أسئلة الصفحة الرئيسية: قائمة روابط إلى الصفحة المالكة لكل سؤال — بلا إجابات ولا FAQPage (spec-final A0.11).
// كل سؤال له صفحة واحدة تجيب عنه (faq-owners.json)، والرئيسية تدل عليها فقط.

export const HOME_FAQ_LINKS: { q: string; href: string }[] = [
  { q: "كم أسعار الشقق في دمياط الجديدة؟", href: "/prices/#new-damietta-apartments" },
  { q: "كم سعر متر الأرض في دمياط الجديدة؟", href: "/prices/#new-damietta-land" },
  { q: "كم أسعار الشقق في المنصورة الجديدة؟", href: "/prices/#new-mansoura-apartments" },
  { q: "هل توجد شقق بالتقسيط في دمياط الجديدة؟", href: "/properties/installments/#new-damietta" },
  { q: "ما أفضل حي للسكن في دمياط الجديدة؟", href: "/blog/best-districts/" },
  { q: "دمياط الجديدة أم المنصورة الجديدة؟", href: "/blog/damietta-vs-mansoura/" },
  { q: "أين أجد أراضي بيت الوطن للبيع موثّقة؟", href: "/beit-al-watan-for-sale/" },
  { q: "كم يساوي عقاري؟", href: "/valuation/" },
];
