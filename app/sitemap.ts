import type { MetadataRoute } from "next";
import { tracks } from "@/lib/curriculum";

const siteUrl = "https://stack-nova-abnjawher25-8299.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/learn`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/learn/html`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/learn/css`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/learn/javascript`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/practice`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects/portfolio`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/reference`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const lessonRoutes: MetadataRoute.Sitemap = Object.values(tracks).flatMap((track) =>
    track.lessons.map((lesson) => ({
      url: `${siteUrl}/learn/${track.key}/${lesson.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...lessonRoutes];
}
