import type { MetadataRoute } from "next";

const siteUrl = "https://kbrandmusisc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/legal/business",
    "/legal/cookies",
    "/legal/privacy",
    "/legal/returns",
    "/legal/shipping",
    "/legal/terms",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.5,
  }));
}
