import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/* Everything public is crawlable. No search crawler is blocked here, and no
 * "AI markup" or bot-only instruction is added — there is nothing on this site
 * that should be shown to a crawler and hidden from a reader.
 *
 * Note that OpenAI runs separate crawlers: OAI-SearchBot (search results) is
 * distinct from GPTBot (model training). Neither is blocked below. If the owner
 * later wants to opt out of training while staying in AI search results, the
 * rule to add is GPTBot — not OAI-SearchBot. See docs/SEO.md. */
export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    ...(origin ? { sitemap: `${origin}/sitemap.xml`, host: origin } : {}),
  };
}

// Static export: this route is generated at build time, not on request.
export const dynamic = "force-static";
