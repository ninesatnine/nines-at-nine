import { afterEach, describe, expect, it } from "vitest";

import { formatDate, getArticle, listArticles, publishedArticles, relatedTo } from "./blog";
import { absolute, siteUrl } from "./site";

const EXPECTED = [
  "chemistry-vs-compatibility",
  "dating-app-fatigue",
  "dating-then-and-now",
  "emotionally-mature-relationships",
  "how-speed-dating-works",
  "modern-dating-culture",
];

describe("the article files", () => {
  const articles = listArticles();

  it("finds all six, and every one parses", () => {
    expect(articles.map((a) => a.slug).sort()).toEqual(EXPECTED);
  });

  it("gives every article the frontmatter the template needs", () => {
    for (const a of articles) {
      expect(a.title, a.slug).toBeTruthy();
      expect(a.description.length, a.slug).toBeGreaterThan(40);
      expect(a.excerpt.length, a.slug).toBeGreaterThan(60);
      expect(a.topic, a.slug).toBeTruthy();
      expect(a.author, a.slug).toBeTruthy();
      // An ISO date, so sitemap lastmod and <time> are both valid.
      expect(a.published, a.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.readingMinutes, a.slug).toBeGreaterThan(0);
    }
  });

  it("only points 'related' at articles that exist", () => {
    const slugs = new Set(articles.map((a) => a.slug));
    for (const a of articles) {
      for (const slug of a.related) expect(slugs.has(slug), `${a.slug} → ${slug}`).toBe(true);
      // And never at itself.
      expect(a.related).not.toContain(a.slug);
    }
  });

  it("gives every article two or three related reads", () => {
    for (const a of articles) {
      const n = relatedTo(a).length;
      expect(n, a.slug).toBeGreaterThanOrEqual(2);
      expect(n, a.slug).toBeLessThanOrEqual(3);
    }
  });

  it("uses only https for references", () => {
    for (const a of articles) {
      for (const r of a.references) {
        expect(r.url, `${a.slug}: ${r.label}`).toMatch(/^https:\/\//);
        expect(r.label.length).toBeGreaterThan(10);
      }
    }
  });

  it("sorts newest first", () => {
    const dates = articles.map((a) => a.published);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
});

describe("rendering", () => {
  it("turns markdown into HTML with ids on the headings", async () => {
    const article = await getArticle("how-speed-dating-works");
    expect(article).not.toBeNull();
    expect(article!.html).toContain("<h2 id=");
    expect(article!.html).toContain("<p>");
  });

  it("renders GFM tables, which two articles rely on", async () => {
    const article = await getArticle("dating-then-and-now");
    expect(article!.html).toContain("<table>");
    expect(article!.html).toContain("<th>");
  });

  it("returns null for a slug that does not exist", async () => {
    expect(await getArticle("no-such-article")).toBeNull();
  });

  it("formats a date for readers, from the ISO value", () => {
    expect(formatDate("2026-09-23")).toBe("23 September 2026");
  });
});

describe("what may be published", () => {
  it("puts only published articles in the sitemap set", () => {
    for (const a of publishedArticles()) expect(a.status).toBe("published");
  });
});

describe("the site origin", () => {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = env;
  });

  it("is null when unset, so nothing invents a canonical URL", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(siteUrl()).toBeNull();
    expect(absolute("/blog")).toBeNull();
  });

  it("refuses localhost, which must never reach a production canonical tag", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3107";
    expect(siteUrl()).toBeNull();
  });

  it("normalises a configured origin and builds absolute URLs", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test/ignored/path";
    expect(siteUrl()).toBe("https://example.test");
    expect(absolute("/blog/x")).toBe("https://example.test/blog/x");
  });

  it("ignores a value that is not a URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "ninesatnine.com";
    expect(siteUrl()).toBeNull();
  });
});
