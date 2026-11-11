// نوع السؤال الشائع ومولّد schema الـ FAQPage. نفس القائمة تُعرض مرئية وتدخل الـ schema
// (شرط المحتوى المرئي). أسئلة الرئيسية والمدن تُبنى من المعروض الحي في lib/liveFacts.ts

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
