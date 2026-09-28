import { Metadata } from "next";
import { bwMeta } from "@/lib/bw/meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Disclaimer } from "@/components/bw/BwParts";
import { RequestForm } from "@/components/bw/RequestForm";
import { cityBySlug } from "@/lib/bw/cities";
import { BW_BASE, NO_DEPOSIT_LINE } from "@/lib/bw/constants";

const TITLE = "طلب شراء أرض بيت الوطن (بالتنازل الرسمي)";
const DESC =
  "فاتتك قطعة في جلسة الحجز أو تبحث عن أرض بيت الوطن مستلمة؟ سجّل طلب الشراء بالمدينة والميزانية، ونتواصل معك عند توثيق قطعة مطابقة. كود الحجز لا يُباع.";

export const metadata: Metadata = bwMeta({ title: TITLE, description: DESC, path: `${BW_BASE}/buy-request/` });

export default function BuyRequestPage({ searchParams }: { searchParams: { city?: string; phase?: string } }) {
  const city = cityBySlug(searchParams.city || "")?.slug || "";
  const phase = searchParams.phase === "11" ? "11" : undefined;
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "أراضي بيت الوطن للبيع", href: `${BW_BASE}/` }, { label: "طلب شراء" }]} />
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">سجّل طلب شراء أرض بيت الوطن</h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              اكتب المدينة والميزانية، ونتواصل معك أول ما تتوثّق قطعة مطابقة. لا نرسل لك إلا إعلانات راجعنا مستنداتها وعاينّاها.
            </p>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
              <h2 className="font-bold text-gray-900 mb-2">عن المرحلة 11</h2>
              <p className="text-gray-800 leading-relaxed">
                قطع المرحلة 11 تُعرض للبيع بعد صدور خطاب تخصيص كل قطعة والتحقق منه، والشراء بالتنازل الرسمي بموافقة جهاز المدينة.
                كود الحجز نفسه لا يُباع ولا يُنقل، والمبالغ لا تُحوَّل بين الحاجزين. لو فاتتك منطقة في الجلسة، سجّل طلبك الآن ونبلغك أول
                ما تُنشر قطعة مطابقة.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-2">عند وجود قطعة مطابقة</h2>
              <ol className="list-decimal pr-5 space-y-1 text-gray-700">
                <li>نرسل لك الإعلان بكارت التكلفة والمقارنة بالسعر الرسمي.</li>
                <li>نتحقق من هويتك ثم نكشف رقم القطعة لتتحقق منها في الجهاز.</li>
                <li>التوقيع أمام الجهاز، والدفع للبائع مباشرة.</li>
              </ol>
              <p className="text-sm text-gray-600 mt-3">{NO_DEPOSIT_LINE}</p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-1">طلب شراء</h2>
              <p className="text-sm text-gray-600 mb-5">يبقى طلبك قائمًا حتى تسحبه، أو 12 شهرًا بحد أقصى.</p>
              <RequestForm kind="buy" defaultCity={city} defaultPhase={phase} />
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
