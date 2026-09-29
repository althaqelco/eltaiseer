import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { AnswerSection } from "@/components/Answers";
import { BrandPlatformLink, PlatformLink } from "@/lib/bw/platformLinks";
import { getActiveListings } from "@/lib/bw/listings";
import { isLive } from "@/lib/bw/calc";
import { getPropertiesForIsr } from "@/lib/serverProperties";
import { answersFor, faqFrom } from "@/lib/answers";
import { ABOUT_LEDE } from "@/lib/answers/resale";
import { fmtN } from "@/lib/answers/format";
import { CORRECTIONS } from "@/content/corrections";
import { ID, ORG, REG, breadcrumbNode, faqNode, graph, pageUrl, ref, webPage } from "@/lib/seo/schema";
import { editorialIso } from "@/lib/seo/editorial";
import { cairoDate, cairoIso, cairoLocalToIso, maxIso } from "@/lib/seo/time";
import { ROBOTS_INDEX } from "@/lib/seo/robots";
import { D11_OFFICE, SITE_NAME } from "@/lib/seo/owner-flags";

// عدد العروض وتاريخ آخر تحديث محسوبان من Firestore؛ نص الصفحة من سجل التحرير
export const revalidate = 300;

const PATH = "/about/";
const TITLE = "عن التيسير للعقارات: من نحن ومن أين تأتي أرقامنا";
const DESCRIPTION =
  "التيسير للعقارات وسيط عقاري في دمياط الجديدة: عقارات للبيع في دمياط الجديدة والمنصورة الجديدة، ووساطة موثّقة لإعادة بيع أراضي بيت الوطن، وأداة «التيسير — الحجز الذكي» المجانية للحاجزين. منصة مستقلة غير تابعة لهيئة المجتمعات العمرانية.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: ROBOTS_INDEX,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://eltaiseer.com/about/",
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "عن التيسير للعقارات" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://eltaiseer.com/about/",
  },
};

// أسئلة الصفحة بترتيبها (spec-final A2.7). M-AB-01 معلّق حتى قراري المالك D3 وD13 فلا يُعرض ولا يدخل JSON-LD.
const ORDER = ["M-AB-01", "M-AB-02", "M-AB-03", "M-AB-04", "M-AB-05"];
const FAQ_SCHEMA = ["M-AB-02", "M-AB-04", "M-AB-03", "M-AB-05", "M-AB-01"];

const PROFILE_LABEL: Record<string, string> = {
  "instagram.com": "إنستجرام",
  "tiktok.com": "تيك توك",
  "facebook.com": "فيسبوك",
  "youtube.com": "يوتيوب",
  "linkedin.com": "لينكدإن",
  "x.com": "إكس",
};
const profileLabel = (u: string) => {
  const host = new URL(u).hostname.replace(/^www\./, "");
  return PROFILE_LABEL[host] || host;
};

export default async function AboutPage() {
  const now = Date.now();
  const [properties, bw] = await Promise.all([getPropertiesForIsr(), getActiveListings()]);
  const active = properties.filter((p) => p.status !== "تم البيع");
  const listingsModified = maxIso(active.map((p) => p.updatedAt || p.createdAt));
  const bwVerified = bw.filter((l) => isLive(l, now)).length;

  const modified = editorialIso(PATH, "modified");
  const reviewed = editorialIso(PATH, "reviewed");
  const byId = new Map(answersFor(PATH, {}, ORDER).map((a) => [a.id, a]));
  const faq = faqNode(
    PATH,
    faqFrom(FAQ_SCHEMA.map((id) => byId.get(id)).filter((a): a is NonNullable<typeof a> => !!a))
  );

  // الكيان نفسه معرّف في رسم الموقع (app/layout.tsx)؛ هنا صفحة «عن» تشير إليه فقط (لا تعريف ثانٍ متعارض)
  const pageGraph = graph(
    webPage({
      path: PATH,
      type: "AboutPage",
      name: TITLE,
      description: DESCRIPTION,
      about: ORG,
      mainEntity: ORG,
      hasPart: faq ? [ref(`${pageUrl(PATH)}#faq`)] : undefined,
      dateModified: modified,
      lastReviewed: reviewed,
      // [OWNER D1] المحرر المسمّى (#editor) بعد الموافقة فقط
      reviewedBy: ORG,
    }),
    faq,
    breadcrumbNode(PATH, [
      { name: "الرئيسية", path: "/" },
      { name: "عن التيسير للعقارات", path: PATH },
    ])
  );

  const sameAs = [
    ...((REG.stubs[ID.organization]?.sameAs as string[] | undefined) || []),
    ...(D11_OFFICE?.extraSameAs || []),
  ];
  const businessModel = byId.get("M-AB-01");
  const independence = byId.get("M-AB-02");
  const sources = byId.get("M-AB-03");
  const otherTaiseer = byId.get("M-AB-04");
  const corrections = byId.get("M-AB-05");
  const log = [...CORRECTIONS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd graph={pageGraph} />
      <Header />
      <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "عن التيسير للعقارات" }]} path={PATH} schema={false} />

      <section className="bg-gradient-to-b from-orange-50 to-white py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">عن التيسير للعقارات</h1>
          <p className="answer-lede text-lg md:text-xl text-gray-700 leading-relaxed">{ABOUT_LEDE}</p>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {active.length > 0 && (
              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <dt className="text-sm text-gray-600">عقار معروض الآن</dt>
                <dd className="text-2xl font-bold text-gray-900">
                  <Link href="/properties/" className="hover:text-orange-600">{fmtN(active.length)}</Link>
                </dd>
              </div>
            )}
            <div className="rounded-xl bg-white border border-gray-200 p-4">
              <dt className="text-sm text-gray-600">مدينتان</dt>
              <dd className="text-base font-bold text-gray-900">دمياط الجديدة والمنصورة الجديدة</dd>
            </div>
            {bwVerified > 0 && (
              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <dt className="text-sm text-gray-600">إعلان بيت الوطن موثّق</dt>
                <dd className="text-2xl font-bold text-gray-900">
                  <Link href="/beit-al-watan-for-sale/" className="hover:text-orange-600">{fmtN(bwVerified)}</Link>
                </dd>
              </div>
            )}
            {listingsModified && (
              <div className="rounded-xl bg-white border border-gray-200 p-4">
                <dt className="text-sm text-gray-600">آخر تحديث للعروض</dt>
                <dd className="text-base font-bold text-gray-900">
                  <time dateTime={cairoIso(listingsModified)}>{cairoDate(listingsModified)}</time>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-4xl py-10 space-y-8">
        <section id="editor" aria-labelledby="editor-h" className="scroll-mt-24 rounded-xl bg-white border border-gray-200 p-6">
          <h2 id="editor-h" className="text-2xl font-bold text-gray-900 mb-3">من يدير التيسير؟</h2>
          {/* [OWNER D1] الصيغة (ب) الافتراضية: المؤسسة، حتى يوافق المالك على محرر مسمّى بصورة وسيرة حقيقية */}
          <p className="text-gray-700 leading-relaxed">
            يدير الموقع فريق التيسير للعقارات في دمياط الجديدة. كل صفحة عليها تاريخ آخر مراجعة، والتصحيحات مسجلة أدناه.
          </p>
        </section>

        <section id="services" aria-labelledby="services-h" className="scroll-mt-24 rounded-xl bg-white border border-gray-200 p-6">
          <h2 id="services-h" className="text-2xl font-bold text-gray-900 mb-3">ماذا نقدم؟</h2>
          <ul className="list-disc pr-5 space-y-2 text-gray-700">
            <li>
              <Link href="/properties/" className="text-orange-700 underline">وساطة بيع العقارات في دمياط الجديدة والمنصورة الجديدة</Link>
            </li>
            <li>
              <Link href="/beit-al-watan-for-sale/" className="text-orange-700 underline">وساطة موثّقة لإعادة بيع أراضي بيت الوطن</Link>
            </li>
            <li>
              أداة <BrandPlatformLink className="text-orange-700 underline" /> المجانية للحاجزين
              <PlatformLink path="/baitelwatan/about/" className="text-orange-700 underline">
                {" "}(عن منصة التيسير — الحجز الذكي)
              </PlatformLink>
            </li>
            <li>
              <Link href="/valuation/" className="text-orange-700 underline">تقييم عقاري مجاني</Link>
            </li>
          </ul>
        </section>

        {businessModel && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={businessModel} />
          </div>
        )}

        {independence && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={independence} />
          </div>
        )}

        {sources && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={sources}>
              <ul className="list-disc pr-5 space-y-2 text-gray-700 mt-3">
                <li>
                  أسعار العقارات في المدينتين: وسيط محسوب من الإعلانات النشطة على الموقع، ولا نعرض خانة من أقل من 3 عقارات (
                  <Link href="/prices/" className="text-orange-700 underline">صفحة أسعار العقارات</Link>).
                </li>
                <li>
                  أرقام بيت الوطن: كراسة الشروط المنشورة على موقع هيئة المجتمعات العمرانية برقم الصفحة (النسخة المطابقة في 23/9/2026)، وأخبار
                  الهيئة برقمها، وبيان وزارة الإسكان بتاريخه، ورصد منصة «التيسير — الحجز الذكي» لموقع الهيئة بتاريخ كل لقطة.
                </li>
                <li>
                  الإعلانات الموثّقة: مستندات البائع ومعاينتنا (
                  <Link href="/beit-al-watan-for-sale/how-we-verify/" className="text-orange-700 underline">كيف نوثّق الإعلانات</Link>).
                </li>
                <li>
                  ملف <a href="/llms.txt" className="text-orange-700 underline">llms.txt</a>: ملخص مؤرخ لهذه الأرقام لأدوات الذكاء الاصطناعي.
                </li>
              </ul>
            </AnswerSection>
          </div>
        )}

        {otherTaiseer && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={otherTaiseer}>
              <ul className="flex flex-wrap gap-3 mt-2 text-sm">
                {sameAs.map((u) => (
                  <li key={u}>
                    <a href={u} rel="noopener noreferrer" target="_blank" className="text-orange-700 underline">
                      {profileLabel(u)}
                    </a>
                  </li>
                ))}
              </ul>
            </AnswerSection>
          </div>
        )}

        {corrections && (
          <div className="rounded-xl bg-white border border-gray-200 p-6">
            <AnswerSection item={corrections}>
              <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2">سجل التصحيحات</h3>
              <ol id="corrections-log" className="list-decimal pr-5 space-y-2 text-gray-700 text-sm">
                {log.map((c) => (
                  <li key={`${c.date}-${c.page}`}>
                    <time dateTime={cairoLocalToIso(c.date)}>{cairoDate(cairoLocalToIso(c.date))}</time> ({c.page}): {c.what}{" "}
                    <span className="text-gray-500">السبب: {c.why}</span>
                  </li>
                ))}
              </ol>
            </AnswerSection>
          </div>
        )}

        <section id="contact" aria-labelledby="contact-h" className="scroll-mt-24 rounded-xl bg-white border border-gray-200 p-6">
          <h2 id="contact-h" className="text-2xl font-bold text-gray-900 mb-3">بيانات التواصل</h2>
          {/* يطابق عقدة #organization في app/layout.tsx؛ عنوان الشارع [OWNER D11] */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            <div>
              <dt className="text-sm text-gray-500">الاسم</dt>
              <dd className="font-semibold">التيسير للعقارات</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">العنوان</dt>
              <dd className="font-semibold">
                {D11_OFFICE?.streetAddress ? `${D11_OFFICE.streetAddress}، ` : ""}دمياط الجديدة، محافظة دمياط، مصر
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">الهاتف وواتساب</dt>
              <dd className="font-semibold">
                <a href="tel:+201500775974" dir="ltr" className="hover:text-orange-600">+20 150 077 5974</a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">البريد</dt>
              <dd className="font-semibold">
                <a href="mailto:info@eltaiseer.com" className="hover:text-orange-600">info@eltaiseer.com</a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">مواعيد العمل</dt>
              <dd className="font-semibold">السبت إلى الخميس، 9:00–21:00</dd>
            </div>
          </dl>
        </section>

        <Freshness data={modified} dataLabel="آخر مراجعة لهذه الصفحة" />
      </main>

      <section className="py-14 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">هل تبحث عن عقار؟</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            تواصل معنا عبر الواتساب ونرسل لك العروض المناسبة لميزانيتك والحي الذي تريده.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              <Link href="/properties/">تصفح العقارات</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-orange-600">
              <a href="https://wa.me/201500775974" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                تواصل عبر الواتساب
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
