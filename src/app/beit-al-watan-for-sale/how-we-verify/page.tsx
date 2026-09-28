import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Disclaimer } from "@/components/bw/BwParts";
import { BW_BASE, NO_DEPOSIT_LINE, PLATFORM_URL } from "@/lib/bw/constants";

const TITLE = "كيف نوثّق إعلانات أراضي بيت الوطن";
const DESC =
  "خطوات التحقق قبل نشر أي إعلان لأرض بيت الوطن: الهوية، والتخصيص، والسداد، وحساب الهيئة، والمعاينة، وعقد الوساطة. ومتى تُستحق العمولة، وسياسة تعارض المصالح.";

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: `${BW_BASE}/how-we-verify/`, type: "article" });

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
  ["النشر وإعادة التوثيق", "يُنشر الإعلان بختم التوثيق وتاريخه، ويُعاد التوثيق كل 45 يومًا وإلا ينتهي الإعلان."],
];

export default function HowWeVerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` }, { label: "كيف نوثّق" }]} />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">كيف نوثّق إعلانات أراضي بيت الوطن</h1>
          <p className="text-gray-700 text-lg mt-3 leading-relaxed">
            لا يُنشر أي إعلان قبل اكتمال هذه الخطوات. أي خطوة ناقصة تعني رفض الإعلان.
          </p>
        </header>

        <ol className="space-y-4">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="flex gap-4 rounded-xl bg-white border border-gray-200 p-5">
              <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                {(i + 1).toLocaleString("ar-EG")}
              </span>
              <div>
                <h2 className="font-bold text-gray-900">{t}</h2>
                <p className="text-gray-700 mt-1 leading-relaxed">{d}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-gray-700">
          تفاصيل بيع وشراء قطع المرحلة 11 بعد التخصيص في <Link href={`${BW_BASE}/phase-11/`} className="text-orange-600 underline">صفحة المرحلة 11</Link>.
        </p>

        <section className="rounded-xl bg-white border border-gray-200 p-6 space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">الفلوس والعمولة</h2>
          <p className="text-gray-700 leading-relaxed">
            لا نستلم ولا نحتفظ ولا نحوّل أي مبالغ بين البائع والمشتري: لا عربون، ولا تأمين، ولا حساب ضمان. الأوفر يُدفع للبائع مباشرة عند
            التوقيع أمام جهاز المدينة بشيك بنكي أو تحويل.
          </p>
          <p className="text-gray-700 leading-relaxed">
            عمولة الوساطة تُكتب في عقد الوساطة قبل النشر، ولا تُستحق إلا بعد اعتماد الجهاز للتنازل، وتصدر بها فاتورة رسمية.
          </p>
          <p className="font-semibold text-gray-900">{NO_DEPOSIT_LINE}</p>
        </section>

        <section className="rounded-xl bg-white border border-gray-200 p-6 space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">ماذا يعني «موثّق»؟</h2>
          <p className="text-gray-700 leading-relaxed">
            يعني أننا راجعنا المستندات وعاينّا القطعة في التاريخ المكتوب على الإعلان. لا يُعد ضمانًا قانونيًا، ولا يغني عن تحققك من القطعة لدى
            جهاز المدينة قبل أي سداد. لذلك نكشف رقم القطعة للمشتري بعد التحقق من هويته.
          </p>
        </section>

        <section className="rounded-xl bg-white border border-gray-200 p-6 space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">تعارض المصالح</h2>
          <ul className="list-disc pr-5 space-y-2 text-gray-700">
            <li>
              أداة <a href={PLATFORM_URL} className="text-orange-600 underline">«التيسير — الحجز الذكي»</a> مجانية ومستقلة. لا تعرض الإعلانات ولا ترفعها،
              ولا يستخدم مكتب الوساطة ترتيبها الذكي أو بيانات الحاجزين.
            </li>
            <li>الأرقام الحية المعروضة مع الإعلانات عامة ومجمّعة: السعر الرسمي والمتاح في المدينة. ولا ننشر أي رقم محسوب من أقل من 3 إعلانات أو طلبات.</li>
            <li>لا نكتب «حُجزت عبر التيسير» على أي قطعة، ولا نستخدم شعار الهيئة، ولا نعد بعائد أو نمو سعري.</li>
          </ul>
        </section>

        <section className="rounded-xl bg-white border border-gray-200 p-6 space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">بلاغ أو نزاع</h2>
          <p className="text-gray-700 leading-relaxed">
            لو شككت في إعلان أو في شخص يدّعي أنه من التيسير، تواصل معنا فورًا من <Link href="/contact/" className="text-orange-600 underline">صفحة التواصل</Link>.
            نسحب أي إعلان عليه نزاع حتى يُحسم.
          </p>
        </section>

        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
