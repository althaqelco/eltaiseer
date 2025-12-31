import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "التيسير للعقارات - عقارات دمياط الجديدة",
    short_name: "التيسير للعقارات",
    description: "أفضل عقارات دمياط الجديدة للبيع - شقق، فيلات، دوبلكس، محلات تجارية، أراضي بأسعار تنافسية",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    orientation: "portrait",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["business", "lifestyle", "shopping"],
    lang: "ar",
    dir: "rtl",
  };
}
