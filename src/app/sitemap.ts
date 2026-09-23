import type { MetadataRoute } from "next";

import { publishedArticles } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

/* Only canonical, indexable, published URLs.
 *
 * Absolute URLs are required, and there is no honest absolute URL until the
 * production origin is configured — so without it the sitemap is empty rather
 * than full of guesses. The build says so out loud. */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  if (!origin) {
    console.warn(
      "[sitemap] NEXT_PUBLIC_SITE_URL is not set, so sitemap.xml is empty. " +
        "Set it to the production origin and rebuild.",
    );
    return [];
  }

  const pages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${origin}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${origin}/house-rules`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // lastModified comes from the article's own dates — never "now", which would
  // tell crawlers every page changed on every build.
  const posts: MetadataRoute.Sitemap = publishedArticles().map((a) => ({
    url: `${origin}/blog/${a.slug}`,
    lastModified: a.updated ?? a.published,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...posts];
}

// Static export: this route is generated at build time, not on request.
export const dynamic = "force-static";
