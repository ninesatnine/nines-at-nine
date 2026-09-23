/* Where this site lives in production.
 *
 * Canonical URLs, Open Graph tags and the sitemap all need an absolute origin,
 * and there is no safe way to guess one: shipping `localhost` or an invented
 * domain is worse than shipping none, because both actively mislead crawlers.
 *
 * So the origin is configuration. Set NEXT_PUBLIC_SITE_URL at build time once
 * the production domain is known. Until then `siteUrl()` returns null and the
 * callers leave canonical tags and sitemap entries out rather than inventing
 * them. The site still builds and still works.
 */

function normalise(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    // A localhost origin in a production canonical tag is a real SEO fault, so
    // it is treated as "not configured" rather than quietly honoured.
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function siteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return raw ? normalise(raw) : null;
}

/** An absolute URL for `path`, or null while the origin is unknown. */
export function absolute(path: string): string | null {
  const origin = siteUrl();
  return origin ? new URL(path, origin).toString() : null;
}

export const SITE_NAME = "Nines at Nine";
