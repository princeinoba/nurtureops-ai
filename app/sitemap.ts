import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return ["/", "/about", "/privacy", "/terms"].map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: new Date("2026-08-15T00:00:00.000Z"),
  }));
}
