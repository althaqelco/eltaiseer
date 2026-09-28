import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Disclaimer } from "@/components/bw/BwParts";
import { RequestForm } from "@/components/bw/RequestForm";
import { cityBySlug } from "@/lib/bw/cities";
import { BW_BASE } from "@/lib/bw/constants";

const TITLE = "بيع أرض بيت الوطن بالتنازل: وساطة موثّقة";
const DESC =
  "عندك أرض بيت الوطن مخصصة أو مستلمة وعايز تبيعها؟ نوثّق المستندات ونعاين القطعة وننشر إعلانًا بكارت تكلفة كامل. العمولة بعد اعتماد التنازل فقط، ولا نستلم أي مبالغ بين البائع والمشتري.";

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: `${BW_BASE}/sell/` });

export default function SellPage({ searchParams }: { searchParams: { city?: string; phase?: string } }) {
  const city = cityBySlug(searchParams.city || "")?.slug || "";
  const phase = searchParams.phase === "11" ? "11" : undefined;
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` }, { label: "بيع أرضك" }]} />
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">عايز تبيع أرض بيت الوطن؟</h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              نعرض قطعتك على مشترين جادين من مصر والخارج، بعد توثيقها، ومع حساب واضح للتكلفة والأوفر ومقارنة بسعر الهيئة الرسمي.
            </p>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-2">نقبل للنشر</h2>
              <ul className="list-disc pr-5 space-y-1 text-gray-700">
                <li>القطع المخصصة المسددة بالكامل، والمستلمة، والمبنية.</li>
                <li>القطع التي عليها أقساط بعد تأكيد جهاز المدينة لشروط التنازل.</li>
                <li>قطع المرحلة 11 بعد صدور خطاب التخصيص أو التعاقد.</li>
                <li>أن تكون صاحب التخصيص، أو وكيلًا عنه بتوكيل رسمي.</li>
              </ul>
              <h2 className="font-bold text-gray-900 mt-4 mb-2">لا نقبل</h2>
              <ul className="list-disc pr-5 space-y-1 text-gray-700">
                <li>بيع كود الحجز أو المسلسل أو الرصيد، أو أي قطعة من المرحلة 11 قبل صدور خطاب تخصيصها.</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-2">بعد ما ترسل الطلب</h2>
              <ol className="list-decimal pr-5 space-y-1 text-gray-700">
                <li>نتصل بك ونطلب البطاقة وخطاب التخصيص أو العقد وإيصالات السداد.</li>
                <li>تعرض حسابك على بوابة الهيئة في مكالمة فيديو. لا نطلب كلمة السر أبدًا.</li>
                <li>نعاين القطعة ونصورها، ونوقع عقد وساطة مكتوبًا.</li>
                <li>ننشر الإعلان بختم التوثيق. العمولة لا تُستحق إلا بعد اعتماد التنازل من الجهاز.</li>
              </ol>
              <Link href={`${BW_BASE}/how-we-verify/`} className="inline-block mt-3 text-orange-600 font-semibold hover:underline">
                تفاصيل التوثيق والعمولة
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-1">طلب بيع</h2>
              <p className="text-sm text-gray-600 mb-5">بيانات التواصل فقط الآن. المستندات نطلبها في المكالمة.</p>
              <RequestForm kind="sell" defaultCity={city} defaultPhase={phase} />
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10">
          <Disclaimer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
