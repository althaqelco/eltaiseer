import InstallmentsClient from "./InstallmentsClient";
import {
  getPropertiesServer,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { buildFaqSchema } from "@/lib/homeFaq";

// ISR كل 5 دقائق — عقارات التقسيط تظهر في HTML الخادم
export const revalidate = 300;

// الأسئلة تُعرض مرئياً في الصفحة ويولَّد منها الـ schema من نفس المصدر
const INSTALLMENT_FAQ = [
  {
    question: "ما هو أقل مقدم للشراء بالتقسيط؟",
    answer:
      "المقدمات تبدأ من 10% من قيمة الوحدة في أغلب العقارات المتاحة بالتقسيط، وتختلف حسب البائع ومدة التقسيط. كل عقار في هذه الصفحة يعرض مقدمه وقسطه الشهري الفعلي.",
  },
  {
    question: "ما أطول مدة تقسيط متاحة؟",
    answer:
      "تصل مدد التقسيط حتى 10 سنوات في بعض الوحدات، والشائع بين 3 و7 سنوات. كلما قصرت المدة انخفض إجمالي المبلغ المدفوع غالباً.",
  },
  {
    question: "هل التقسيط مباشر أم عن طريق بنك؟",
    answer:
      "أغلب عقارات هذه الصفحة تقسيطها مباشر مع المالك أو المطور دون إجراءات بنكية — وهو أسرع وأبسط. التمويل العقاري البنكي متاح أيضاً كخيار بديل لمن يفضله، وفريقنا يرشدك للأنسب لحالتك.",
  },
];

export default async function InstallmentsPage() {
  const all = await getPropertiesServer();
  // كل عقار يقبل التقسيط (تقسيط فقط أو كاش/تقسيط) وغير مباع
  const installmentProperties = all.filter(
    (p) => p.payment?.type !== "كاش" && p.status !== "تم البيع"
  );

  const itemListSchema = buildItemListSchema(
    installmentProperties,
    "عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة"
  );
  const faqSchema = buildFaqSchema(INSTALLMENT_FAQ);

  return (
    <>
      {installmentProperties.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <InstallmentsClient
        initialProperties={serializeProperties(installmentProperties)}
        faq={INSTALLMENT_FAQ}
      />
    </>
  );
}
