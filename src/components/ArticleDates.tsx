import { getBlogPost, formatArabicDate } from "@/lib/blogPosts";

// تاريخ النشر وآخر تحديث بوسم <time> مقروء آلياً — نفس القيم التي تخرج في schema المقال
// (تاريخ ظاهر يطابق الـ schema شرط أساسي لثقة محركات البحث والإجابة في حداثة المحتوى)
export function ArticleDates({ slug }: { slug: string }) {
  const post = getBlogPost(slug);
  if (!post) return null;
  return (
    <>
      <time dateTime={post.published}>{formatArabicDate(post.published)}</time>
      {post.updated !== post.published && (
        <>
          {" "}
          · آخر تحديث <time dateTime={post.updated}>{formatArabicDate(post.updated)}</time>
        </>
      )}
    </>
  );
}
