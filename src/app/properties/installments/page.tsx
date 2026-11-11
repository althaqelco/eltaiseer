import InstallmentsClient from "./InstallmentsClient";
import {
  getPropertiesServer,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { buildFaqSchema, type FaqItem } from "@/lib/homeFaq";
import { formatNumber } from "@/lib/propertySummary";
import { formatArabicDate } from "@/lib/blogPosts";
import type { Property } from "@/lib/types";

// ISR كل 5 دقائق — عقارات التقسيط تظهر في HTML الخادم
export const revalidate = 300;

// الأسئلة تُعرض مرئياً في الصفحة ويولَّد منها الـ schema من نفس المصدر.
// أرقام المقدم والمدة تُحسب من الوحدات المعروضة فعلاً (كانت "من 10%" و"حتى 10 سنوات" ثابتة)
function buildInstallmentFaq(list: Property[]): FaqItem[] {
  const date = formatArabicDate(new Date().toISOString());
  const withDown = list.filter((p) => (p.payment?.downPayment || 0) > 0 && p.price > 0);
  const years = list.map((p) => p.payment?.installmentYears || 0).filter((n) => n > 0);

  let downAnswer =
    "المقدم يحدده مالك كل وحدة ويختلف حسب السعر ومدة السداد. كل عقار في هذه الصفحة يعرض مقدمه وقسطه الشهري الفعلي.";
  if (withDown.length > 0) {
    const lowest = withDown.reduce((a, b) => (a.payment.downPayment! <= b.payment.downPayment! ? a : b));
    const pcts = withDown.map((p) => Math.round((p.payment.downPayment! / p.price) * 100));
    downAnswer = `بحسب الوحدات المعروضة الآن بالتقسيط (العدد: ${list.length})، أقل مقدم مطلوب ${formatNumber(
      lowest.payment.downPayment!
    )} جنيه، ونسبة المقدم من سعر الوحدة تتراوح بين ${Math.min(...pcts)}% و${Math.max(...pcts)}%. المقدم يحدده مالك كل وحدة، وكل عقار في هذه الصفحة يعرض مقدمه وقسطه الشهري الفعلي. (تحديث ${date})`;
  }

  let yearsAnswer =
    "مدة السداد يحددها مالك كل وحدة ومكتوبة في صفحة العقار. كلما قصرت المدة انخفض إجمالي المبلغ المدفوع غالباً.";
  if (years.length > 0) {
    const max = Math.max(...years);
    const min = Math.min(...years);
    yearsAnswer = `بحسب الوحدات المعروضة الآن، أطول مدة سداد (بالسنوات): ${max}${
      min !== max ? `، وأقصرها: ${min}` : ""
    }. المدة يحددها مالك كل وحدة ومكتوبة في صفحة العقار، وكلما قصرت انخفض إجمالي المبلغ المدفوع غالباً. (تحديث ${date})`;
  }

  return [
    { question: "ما هو أقل مقدم للشراء بالتقسيط؟", answer: downAnswer },
    { question: "ما أطول مدة تقسيط متاحة؟", answer: yearsAnswer },
    {
      question: "هل التقسيط مباشر أم عن طريق بنك؟",
      answer:
        "عقارات هذه الصفحة تقسيطها مباشر مع المالك أو المطور باتفاق وعقد دون إجراءات بنكية. التمويل العقاري البنكي خيار آخر لمن يفضله، وشروطه يحددها البنك.",
    },
  ];
}

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
  const faq = buildInstallmentFaq(installmentProperties);
  const faqSchema = buildFaqSchema(faq);

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
        faq={faq}
      />
    </>
  );
}
