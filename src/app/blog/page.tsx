import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ChevronLeft, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "المدونة | نصائح ومقالات عقارية",
  description: "مقالات ونصائح عقارية من خبراء التيسير للعقارات - كل ما تحتاج معرفته عن سوق العقارات في دمياط الجديدة والمنصورة الجديدة",
  alternates: {
    canonical: "https://eltaiseer.com/blog/",
  },
};

const blogPosts = [
  {
    id: -1,
    slug: "buying-steps-legal",
    title: "خطوات شراء عقار في دمياط الجديدة والمنصورة الجديدة: الأوراق والإجراءات",
    excerpt: "من فحص أوراق الملكية حتى التسجيل في الشهر العقاري — الخطوات السبع بالترتيب، والأخطاء الشائعة التي تكلف المشترين، ولماذا الشراء في المدن الجديدة أأمن.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    category: "إجراءات وقانون",
    categoryColor: "bg-blue-600",
    date: "17 أغسطس 2026",
    readTime: "10 دقائق",
  },
  {
    id: 0,
    slug: "damietta-vs-mansoura",
    title: "دمياط الجديدة أم المنصورة الجديدة؟ مقارنة شاملة بالأرقام 2026",
    excerpt: "أكثر سؤال يصلنا من عملائنا — مقارنة تفصيلية بالأرقام: الأسعار، الخدمات، التسليم، وفرص الاستثمار، مع إجابة عملية مباشرة حسب هدفك.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    category: "مقارنات",
    categoryColor: "bg-slate-700",
    date: "17 أغسطس 2026",
    readTime: "8 دقائق",
  },
  {
    id: 1,
    slug: "buying-apartment-guide",
    title: "دليلك الشامل لشراء شقة في دمياط الجديدة 2026",
    excerpt: "كل ما تحتاج معرفته قبل شراء شقتك في دمياط الجديدة، من اختيار المنطقة المناسبة إلى التفاوض على السعر والإجراءات القانونية.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    category: "نصائح الشراء",
    categoryColor: "bg-orange-500",
    date: "15 يناير 2026",
    readTime: "12 دقيقة",
  },
  {
    id: 2,
    slug: "new-mansoura-districts",
    title: "أفضل المناطق للسكن في المنصورة الجديدة 2026",
    excerpt: "دليل شامل لأحياء المنصورة الجديدة من R1 إلى R7، حي الفيلات، داون تاون، والواجهة البحرية. الأسعار والمميزات لكل منطقة.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    category: "المنصورة الجديدة",
    categoryColor: "bg-emerald-500",
    date: "17 يناير 2026",
    readTime: "18 دقيقة",
  },
  {
    id: 3,
    slug: "new-mansoura-investment",
    title: "الاستثمار العقاري في المنصورة الجديدة: دليل المستثمر الذكي",
    excerpt: "فرص الاستثمار الذهبية في المنصورة الجديدة. عوائد تصل إلى 40% خلال 3 سنوات، أفضل المناطق للشراء، ونصائح الخبراء.",
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800",
    category: "استثمار",
    categoryColor: "bg-emerald-600",
    date: "17 يناير 2026",
    readTime: "20 دقيقة",
  },
  {
    id: 4,
    slug: "best-districts",
    title: "أفضل الأحياء للسكن في دمياط الجديدة 2026",
    excerpt: "مقارنة شاملة بين أحياء دمياط الجديدة من حيث الخدمات والأسعار والموقع. دليلك لاختيار المنطقة المناسبة.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    category: "المناطق",
    categoryColor: "bg-orange-500",
    date: "10 يناير 2026",
    readTime: "15 دقيقة",
  },
  {
    id: 5,
    slug: "national-housing-projects",
    title: "مشاريع الإسكان القومية في دمياط الجديدة",
    excerpt: "دليل شامل لمشاريع جنة ودار مصر وسكن مصر وبيت الوطن. الأسعار والمميزات وطرق الحجز.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    category: "المشاريع",
    categoryColor: "bg-orange-500",
    date: "5 يناير 2026",
    readTime: "14 دقيقة",
  },
  {
    id: 6,
    slug: "investment-guide",
    title: "الاستثمار العقاري في دمياط الجديدة: دليل المستثمر",
    excerpt: "فرص الاستثمار العقاري والعائد المتوقع. كيف تحقق أرباحاً من العقارات في دمياط الجديدة.",
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800",
    category: "الاستثمار",
    categoryColor: "bg-orange-500",
    date: "1 يناير 2026",
    readTime: "15 دقيقة",
  },
  {
    id: 7,
    slug: "finishing-tips",
    title: "نصائح التشطيب الذكي بأقل تكلفة وأعلى جودة",
    excerpt: "دليل شامل لتشطيب الشقق. كيف تشطب شقتك بجودة عالية وتكلفة معقولة مع تجنب الأخطاء الشائعة.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    category: "التشطيب",
    categoryColor: "bg-orange-500",
    date: "28 يناير 2026",
    readTime: "18 دقيقة",
  },
];

const categories = ["الكل", "نصائح الشراء", "المناطق", "المنصورة الجديدة", "المشاريع", "التشطيب", "استثمار"];

export default function BlogPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "المدونة العقارية | التيسير للعقارات",
    description: "مقالات ونصائح عقارية من خبراء التيسير للعقارات عن سوق العقارات في دمياط الجديدة والمنصورة الجديدة",
    url: "https://eltaiseer.com/blog/",
    isPartOf: { "@type": "WebSite", "@id": "https://eltaiseer.com/#website" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: blogPosts.length,
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://eltaiseer.com/blog/${post.slug}/`,
        name: post.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-orange-600 font-medium">المدونة</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">المدونة العقارية</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            نصائح ومقالات من خبراء العقارات لمساعدتك في اتخاذ القرار الصحيح
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "الكل" ? "default" : "outline"}
              className={`cursor-pointer text-sm px-4 py-2 ${category === "الكل"
                ? "bg-orange-500 hover:bg-orange-600"
                : "hover:bg-gray-100 border-gray-300 text-gray-700"
                }`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all group h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className={`absolute top-4 right-4 ${post.categoryColor || "bg-orange-500"}`}>
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <span className="text-orange-600 hover:text-orange-700 flex items-center gap-2">
                    اقرأ المزيد
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="gap-2">
            عرض المزيد من المقالات
          </Button>
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-l from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">اشترك في نشرتنا البريدية</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            احصل على أحدث المقالات والنصائح العقارية مباشرة في بريدك الإلكتروني
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 outline-none"
              dir="ltr"
            />
            <Button variant="secondary" size="lg">
              اشترك الآن
            </Button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
