import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "KantongIn",
    description: siteConfig.description,
    lang: "id",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#020617",
    theme_color: "#22C55E",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/manifest-icon?size=192", sizes: "192x192", type: "image/png" },
      {
        src: "/manifest-icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/manifest-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}