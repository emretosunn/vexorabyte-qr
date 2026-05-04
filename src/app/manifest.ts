import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${SITE_NAME} Dijital Menü`,
        short_name: SITE_NAME,
        description: "Restoranlar ve cafeler için QR dijital menü deneyimi.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#fff7ed",
        theme_color: "#f97316",
        icons: [
            {
                src: "/icons/pwa-icon.svg",
                sizes: "512x512",
                type: "image/svg+xml",
                purpose: "any",
            },
            {
                src: "/icons/pwa-icon.svg",
                sizes: "512x512",
                type: "image/svg+xml",
                purpose: "maskable",
            },
        ],
    };
}
