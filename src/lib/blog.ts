/* The blog's content system: Markdown files in content/blog, read at build time.
 *
 * Deliberately plain. Six articles do not justify a CMS, a database or another
 * service; they justify files in the repository that anyone can edit in a text
 * editor and review in a pull request. This module runs only on the server —
 * during `next build`, since the site is a static export — so `fs` is fine.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const DIR = join(process.cwd(), "content", "blog");

export type Reference = { label: string; url: string };

export type ArticleMeta = {
  slug: string;
  title: string;
  /** Used for <meta name="description"> and the card. */
  description: string;
  /** A longer sell for the index card, where the description is too terse. */
  excerpt: string;
  topic: string;
  /** An organisational byline unless a named author is supplied. */
  author: string;
  published: string;
  /** Only set when the body has changed substantively. */
  updated?: string;
  status: "draft" | "published";
  references: Reference[];
  related: string[];
  image?: string;
  readingMinutes: number;
};

export type Article = ArticleMeta & { html: string };

/** Drafts are visible in development so they can be reviewed, and never in a build. */
export function includeDrafts(): boolean {
  return process.env.NODE_ENV === "development";
}

function required(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`content/blog/${slug}.md: "${field}" is missing from the frontmatter.`);
  }
  return value.trim();
}

/** ~220 words a minute, from the real body text rather than a guess. */
function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_>|\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function parse(slug: string): { meta: ArticleMeta; body: string } {
  const raw = readFileSync(join(DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  const status = data.status === "draft" ? "draft" : "published";
  const references: Reference[] = Array.isArray(data.references)
    ? data.references
        .filter((r: unknown): r is Reference => {
          const ref = r as Reference;
          return Boolean(ref && typeof ref.label === "string" && typeof ref.url === "string");
        })
        .map((r) => ({ label: r.label, url: r.url }))
    : [];

  return {
    body: content,
    meta: {
      slug,
      title: required(data.title, "title", slug),
      description: required(data.description, "description", slug),
      excerpt: required(data.excerpt, "excerpt", slug),
      topic: required(data.topic, "topic", slug),
      author: required(data.author, "author", slug),
      published: required(data.published, "published", slug),
      updated: typeof data.updated === "string" ? data.updated : undefined,
      status,
      references,
      related: Array.isArray(data.related) ? data.related.filter((s) => typeof s === "string") : [],
      image: typeof data.image === "string" ? data.image : undefined,
      readingMinutes: readingMinutes(content),
    },
  };
}

function slugs(): string[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Every article that should be listed, newest first. */
export function listArticles(): ArticleMeta[] {
  return slugs()
    .map((slug) => parse(slug).meta)
    .filter((a) => a.status === "published" || includeDrafts())
    .sort((a, b) => b.published.localeCompare(a.published));
}

/** Only what belongs in the sitemap: published, canonical, real. */
export function publishedArticles(): ArticleMeta[] {
  return slugs()
    .map((slug) => parse(slug).meta)
    .filter((a) => a.status === "published")
    .sort((a, b) => b.published.localeCompare(a.published));
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!slugs().includes(slug)) return null;
  const { meta, body } = parse(slug);
  if (meta.status === "draft" && !includeDrafts()) return null;

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // Ids on headings, so a table of contents and shared links can point at them.
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(body);

  return { ...meta, html: String(file) };
}

/** The related reads an article names, in its own order, skipping any that are unpublished. */
export function relatedTo(article: ArticleMeta): ArticleMeta[] {
  const available = new Map(listArticles().map((a) => [a.slug, a]));
  return article.related
    .map((slug) => available.get(slug))
    .filter((a): a is ArticleMeta => Boolean(a) && a!.slug !== article.slug);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
