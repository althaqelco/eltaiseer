// قسم الأسئلة الشائعة المرئي — يستخدم <details> بدون JavaScript
// فيظهر نصه كاملاً في HTML المُرسل لمحركات البحث ووكلاء الذكاء الاصطناعي

import { HOME_FAQ } from "@/lib/homeFaq";

export function HomeFaqSection() {
  return (
    <section id="faq" className="py-12 bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 text-center mb-3">
          الأسئلة الشائعة عن عقارات دمياط الجديدة والمنصورة الجديدة
        </h2>
        <p className="text-gray-500 text-center mb-8">
          إجابات مباشرة عن أكثر ما يسأل عنه عملاؤنا قبل الشراء
        </p>
        <div className="space-y-3">
          {HOME_FAQ.map((item) => (
            <details
              key={item.question}
              className="group bg-gray-50 rounded-xl border border-gray-200 open:bg-orange-50/50 open:border-orange-200 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none p-5 font-semibold text-gray-800">
                <h3 className="text-base md:text-lg font-semibold">{item.question}</h3>
                <span className="text-orange-500 transition-transform group-open:rotate-180" aria-hidden>
                  ▼
                </span>
              </summary>
              <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
