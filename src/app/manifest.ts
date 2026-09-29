import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "التيسير للعقارات - عقارات دمياط الجديدة",
    short_name: "التيسير للعقارات",
    description: "عقارات للبيع في دمياط الجديدة والمنصورة الجديدة: شقق وفيلات وأراضٍ ومحلات بأسعارها الفعلية",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png?v=20260924",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png?v=20260924",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["business", "lifestyle", "shopping"],
    lang: "ar",
    dir: "rtl",
  };
}
