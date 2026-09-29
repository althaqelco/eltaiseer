// كل JSON-LD في الموقع يمر من هنا: سكربت واحد لكل رسم، و«<» مهرَّبة (<).
import { jsonLdString } from "@/lib/seo/schema";

export function JsonLd({ graph }: { graph: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(graph) }} />;
}
