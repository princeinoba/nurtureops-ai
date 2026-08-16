import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NurtureOps AI Synthetic Demo",
    short_name: "NurtureOps",
    description: "Synthetic childcare operations portfolio demonstration.",
    start_url: "/today",
    display: "standalone",
    background_color: "#f5f7f2",
    theme_color: "#185b46",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/nurtureops.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
