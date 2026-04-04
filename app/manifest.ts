import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YourApp",
    short_name: "YourApp",
    description: "Your app description here",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0E768C",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
