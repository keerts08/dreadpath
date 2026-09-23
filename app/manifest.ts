import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
      name: "Dreadpath",
      short_name: "Dreadpath",
      description:
        "You woke up somewhere you shouldn't be. Something else lives here.",
      start_url: "/",
      display: "standalone",
      orientation: "any",
      background_color: "#07080a",
      theme_color: "#07080a",
      icons: [{ src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" }]
    };
}