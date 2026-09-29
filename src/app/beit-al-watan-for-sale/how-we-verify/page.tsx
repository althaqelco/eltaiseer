import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Disclaimer } from "@/components/bw/BwParts";
import { Freshness } from "@/components/Freshness";
import { JsonLd } from "@/components/JsonLd";
import { AnswerSection } from "@/components/Answers";
import { BW_BASE, NO_DEPOSIT_LINE } from "@/lib/bw/constants";
import { REVERIFY_DAYS } from "@/lib/bw/types";
import { BrandPlatformLink } from "@/lib/bw/platformLinks";
import { answersFor, faqFrom } from "@/lib/answers";
import { HV_LEDE } from "@/lib/answers/resale";
import { ID, ORG, breadcrumbNode, faqNode, graph, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { editorialIso } from "@/lib/seo/editorial";

const TITLE = "كيف نوثّق إعلانات أراضي بيت الوطن";
const DESC =
  "خطوات التحقق قبل نشر أي إعلان لأرض بيت الوطن: الهوية، والتخصيص، والسداد، وحساب الهيئة، والمعاينة، وعقد الوساطة. وكيف تتأكد بنفسك أن الإعلان ليس نصبًا، ومتى تُستحق العمولة، وسياسة تعارض المصالح.";

const PATH = `${BW_BASE}/how-we-verify/`;

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: PATH, type: "article" });

// خطوات التوثيق كما تنفذها لوحة الإدارة (CHECK_LABEL وREVERIFY_DAYS في lib/bw/types.ts)
const STEPS: [string, string][] = [
  ["هوية البائع", "نطابق البطاقة القومية مع الاسم في خطاب التخصيص أو العقد. الوكيل يقدم توكيلًا رسميًا ساريًا."],
  ["التخصيص والسداد", "خطاب التخصيص أو محضر الاستلام، وإيصالات السداد كلها."],
  ["حساب الهيئة", "يعرض البائع حسابه على بوابة الهيئة في مكالمة فيديو. لا نطلب كلمة السر ولا نحفظها."],
  ["إفادة الجهاز", "نطلب إفادة من جهاز المدينة بعدم وجود مخالفات أو مديونية متى أمكن الحصول عليها."],
  ["التوكيلات السابقة", "إفصاح عن أي توكيل سابق، وإقرار كتابي بعدم التصرف في القطعة لغير المشتري."],
  ["المعاينة", "فريقنا يزور القطعة ويصورها، ويطابق الناصية والحديقة مع المستندات."],
  ["مطابقة البيانات الحية", "للقطع من الطروحات التي ترصدها منصة التيسير، نطابق القطعة وحالتها مع سجل الرصد، ونعيد المطابقة في كل فحص للوحة الإدارة، ونوقف الإعلان تلقائيًا لو لم تعد محجوزة على موقع الهيئة."],
  ["المرحلة 11", "لا ننشر قطعة من المرحلة 11 قبل خطاب تخصيصها، وبعد مطابقة حديثة مع سجل الرصد تُثبت أنها محجوزة فعلًا، وتأكيد مكتوب من جهاز المدينة لشروط التنازل. كود الحجز نفسه لا يُباع."],
  ["عقد الوساطة", "عقد مكتوب مع البائع، حصري لمدة 60 يومًا، يحدد العمولة قبل النشر."],
  ["النشر وإعادة التوثيق", `يُنشر الإعلان بختم التوثيق وتاريخه، ويُعاد التوثيق كل ${REVERIFY_DAYS} يومًا وإلا ينتهي الإعلان.`],
];

// Q112 للمشتري: قائمة تحقق قبل أي دفع (spec-final A2.8)
const SCAM_CHECKS = [
  "اطلب خطاب التخصيص أو العقد وإيصالات السداد، وطابق الاسم مع بطاقة البائع.",
  "اطلب رؤية حساب البائع على بوابة الهيئة في مكالمة فيديو، ولا تطلب كلمة السر ولا تعطِ كلمتك لأحد.",
  "احصل من جهاز المدينة على إفادة بعدم وجود مخالفات أو مديونية على القطعة.",
  "تأكد كتابيًا من عدم وجود توكيل سابق لغيرك.",
  "لا تدفع أي عربون قبل التوقيع أمام جهاز المدينة.",
  "لا تشترِ «كود حجز»: الكراسة تمنع نقله لشخص آخر (ص3)، ولا يوجد فيها ما يجيز بيع «مسلسل» أو «ترتيب».",
];

const SECTION_IDS = ["Q112", "M-HV-01", "M-HV-02", "M-HV-03"];

export default function HowWeVerifyPage() {
  const modified = editorialIso(PATH, "modified");
  const byId = new Map(answersFor(PATH, {}, SECTION_IDS).map((a) => [a.id, a]));
  const items = SECTION_IDS.map((id) => byId.get(id)).filter((a): a is NonNullable<typeof a> => !!a);
  const faq = faqNode(PATH, faqFrom(items));
  const pageGraph = graph(
    webPage({
      path: PATH,
      type: "WebPage",
      name: TITLE,
      description: DESC,
      about: ref(ID.serviceResale),
      hasPart: faq ? [ref(`${pageUrl(PATH)}#faq`)] : undefined,
      datePublished: editorialIso(PATH, "published"),
      dateModified: modified,
      lastReviewed: editorialIso(PATH, "reviewed"),
      // [OWNER D1] المحرر المسمّى بعد الموافقة؛ حتى ذلك الحين المراجع هو المؤسسة
      reviewedBy: ORG,
    }),
    faq,
    breadcrumbNode(PATH, [
      { name: "الرئيسية", path: "/" },
      { name: "أراضي بيت الوطن للبيع", path: `${BW_BASE}/` },
      { name: "كيف نوثّق", path: PATH },
    ])
  );

  const q112 = byId.get("Q112");
  const commission = byId.get("M-HV-01");
  const meaning = byId.get("M-HV-02");
  const report = byId.get("M-HV-03");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb
        items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` }, { label: "كيف نوثّق" }]}
        path={PATH}
        schema={false}
      />
      <JsonLd graph={pageGraph} />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">كيف نوثّق إعلانات أراضي بيت الوطن</h1>
          <p className="answer-lede text-gray-700 text-lg mt-3 leading-relaxed">{HV_LEDE}</p>
          <Freshness data={modified} dataLabel="آخر مراجعة لهذا المنهج" className="freshness text-sm text-gray-500 mt-2" />
        </header>

        <section aria-labelledby="steps-h">
          <h2 id="steps-h" className="text-2xl font-bold text-gray-900 mb-2">خطوات التوثيق قبل نشر أي إعلان</h2>
          <p className="text-gray-700 mb-4">لا يُنشر أي إعلان قبل اكتمال هذه الخطوات. أي خطوة ناقصة تعني رفض الإعلان.</p>
          <ol className="space-y-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4 rounded-xl bg-white border border-gray-200 p-5">
                <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{t}</h3>
                  <p className="text-gray-700 mt-1 leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <p className="text-gray-700">
          تفاصيل بيع وشراء قطع المرحلة 11 بعد التخصيص في{" "}
          <Link href={`${BW_BASE}/phase-11/`} className="text-orange-600 underline">
            صفحة المرحلة 11
          </Link>
          ، ومصادر أرقام الموقع في{" "}
          <Link href="/about/#sources" className="text-orange-600 underline">
            من أين تأتي الأرقام
          </Link>
          .
        </p>

        {q112 && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={q112}>
              <ol className="list-decimal pr-5 space-y-2 text-gray-700 mt-3">
                {SCAM_CHECKS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ol>
            </AnswerSection>
          </div>
        )}

        {commission && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={commission}>
              <p className="font-semibold text-gray-900">{NO_DEPOSIT_LINE}</p>
            </AnswerSection>
          </div>
        )}

        {meaning && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={meaning} />
          </div>
        )}

        <section aria-labelledby="coi-h" className="rounded-xl bg-white border border-gray-200 p-6 space-y-3">
          <h2 id="coi-h" className="text-2xl font-bold text-gray-900">تعارض المصالح</h2>
          <ul className="list-disc pr-5 space-y-2 text-gray-700">
            <li>
              أداة <BrandPlatformLink className="text-orange-600 underline" /> مجانية للحاجزين ومستقلة. لا تعرض الإعلانات ولا ترفعها،
              ولا يستخدم مكتب الوساطة ترتيبها الذكي أو بيانات الحاجزين.
            </li>
            <li>الأرقام الحية المعروضة مع الإعلانات عامة ومجمّعة: السعر الرسمي والمتاح في المدينة. ولا ننشر أي رقم محسوب من أقل من 3 إعلانات أو طلبات.</li>
            <li>لا نكتب «حُجزت عبر التيسير» على أي قطعة، ولا نستخدم شعار الهيئة، ولا نقدم وعودًا عن أسعار المستقبل.</li>
          </ul>
        </section>

        {report && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={report} />
          </div>
        )}

        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
