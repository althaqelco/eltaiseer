import { notFound } from "next/navigation";
import InstallmentsClient from "./InstallmentsClient";
import { getPropertiesForIsr, serializeProperties } from "@/lib/serverProperties";
import { categoryProperties } from "@/lib/listingCategories";
import { CATEGORY_PAGE_SIZE, totalPages } from "@/lib/pagination";
import { getPropertyUrl } from "@/lib/districtSlugs";
import type { Property } from "@/lib/types";
import { JsonLd } from "@/components/JsonLd";
import { AnswerSection, FaqList } from "@/components/Answers";
import { Freshness } from "@/components/Freshness";
import { answersFor, faqFrom } from "@/lib/answers";
import type { InstallmentFacts } from "@/lib/answers/types";
import { TYPE_GROUP } from "@/lib/seo/prices";
import { faqNode, graph, itemListNode, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { cairoIso, maxIso } from "@/lib/seo/time";

const PATH = "/properties/installments/";
// Q168 وQ180 يملكهما هذا المسار (faq-owners.json) كقسمين بعنوان السؤال (H2)؛ M-IN-01 مرئي بلا Question
const SECTIONS = ["Q168", "Q180"];
const ANSWERS = [...SECTIONS, "M-IN-01"];

// حقائق التقسيط لكل مدينة من شقق العروض النشطة نفسها: العدد، وأطول مدة، وأقل مقدم معلن
function installmentFacts(list: Property[], cityId: string): InstallmentFacts {
  const apts = list.filter(
    (p) => (p.location.cityId || "new-damietta") === cityId && TYPE_GROUP[p.type] === "apartment"
  );
  const years = apts.map((p) => Number(p.payment?.installmentYears) || 0).filter((n) => n > 0);
  const downs = apts.map((p) => Number(p.payment?.downPayment) || 0).filter((n) => n > 0);
  return {
    k: apts.length,
    maxYears: years.length ? Math.max(...years) : null,
    minDown: downs.length ? Math.min(...downs) : null,
  };
}

// صفحة التقسيط (الأساسية أو ?page=N) — شريحة الصفحة وروابط الترقيم في HTML الخادم.
// الأسئلة وJSON-LD على الصفحة الأولى فقط (رابطها هو المالك).
export default async function InstallmentsListing({ page }: { page: number }) {
  const all = await getPropertiesForIsr();
  // كل عقار يقبل التقسيط (تقسيط فقط أو كاش/تقسيط) وغير مباع
  const installmentProperties = categoryProperties(all, "installments");
  if (page > totalPages(installmentProperties.length, CATEGORY_PAGE_SIZE)) {
    notFound();
  }

  let faqSlot: React.ReactNode = null;
  let pageGraph: object | null = null;
  if (page === 1) {
    const dataModified = maxIso(installmentProperties.map((p) => p.updatedAt || p.createdAt));
    const items = answersFor(
      PATH,
      {
        dataModified,
        installments: {
          "new-damietta": installmentFacts(installmentProperties, "new-damietta"),
          "new-mansoura": installmentFacts(installmentProperties, "new-mansoura"),
        },
      },
      ANSWERS
    );
    const faq = faqNode(PATH, faqFrom(items));
    faqSlot = (
      <>
        <div className="space-y-8 mb-8">
          {items
            .filter((i) => SECTIONS.includes(i.id))
            .map((i) => (
              <AnswerSection key={i.id} item={i} />
            ))}
        </div>
        <FaqList items={items.filter((i) => !SECTIONS.includes(i.id))} title="أسئلة شائعة عن التقسيط" id="faq" className="" />
        <Freshness data={dataModified} dataLabel="آخر تحديث للعروض" className="freshness text-sm text-gray-500 mt-4" />
      </>
    );
    pageGraph = graph(
      webPage({
        path: PATH,
        type: "CollectionPage",
        name: "عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة",
        breadcrumb: false, // BreadcrumbList يطبعه مكوّن المسار في الصفحة
        mainEntity: installmentProperties.length ? ref(`${pageUrl(PATH)}#itemlist`) : undefined,
        hasPart: faq ? [ref(`${pageUrl(PATH)}#faq`)] : undefined,
        dateModified: dataModified ? cairoIso(dataModified) : undefined,
      }),
      installmentProperties.length
        ? itemListNode(PATH, installmentProperties.slice(0, 20).map((p) => getPropertyUrl(p)), {
            name: "عقارات بالتقسيط في دمياط الجديدة والمنصورة الجديدة",
            total: installmentProperties.length,
          })
        : null,
      faq
    );
  }

  return (
    <>
      {pageGraph && <JsonLd graph={pageGraph} />}
      <InstallmentsClient
        initialProperties={serializeProperties(installmentProperties)}
        faqSlot={faqSlot}
        page={page}
      />
    </>
  );
}
