import { notFound } from "next/navigation";
import InstallmentsClient from "./InstallmentsClient";
import {
  getPropertiesForIsr,
  serializeProperties,
  buildItemListSchema,
} from "@/lib/serverProperties";
import { buildFaqSchema } from "@/lib/homeFaq";
import { categoryProperties } from "@/lib/listingCategories";
import { CATEGORY_PAGE_SIZE, totalPages } from "@/lib/pagination";

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

// صفحة التقسيط (الأساسية أو ?page=N) — شريحة الصفحة وروابط الترقيم في HTML الخادم
export default async function InstallmentsListing({ page }: { page: number }) {
  const all = await getPropertiesForIsr();
  // كل عقار يقبل التقسيط (تقسيط فقط أو كاش/تقسيط) وغير مباع
  const installmentProperties = categoryProperties(all, "installments");
  if (page > totalPages(installmentProperties.length, CATEGORY_PAGE_SIZE)) {
    notFound();
  }

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
        page={page}
      />
    </>
  );
}
