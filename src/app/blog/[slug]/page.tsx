import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogAnalytics } from "@/components/BlogAnalytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionRule } from "@/components/Ornaments";
import { formatDate, getArticle, listArticles, relatedTo } from "@/lib/blog";
import { COMPANY } from "@/lib/company";
import { SHARE_IMAGE } from "@/lib/seo";
import { SITE_NAME, absolute } from "@/lib/site";

export function generateStaticParams() {
  // Drafts are built in development so they can be previewed, never in a build.
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const url = absolute(`/blog/${slug}`);
  const draft = article.status === "draft";

  return {
    title: `${article.title} | Nines at Nine`,
    description: article.description,
    alternates: url ? { canonical: url } : undefined,
    // A draft preview must never be indexed, whatever else is true.
    robots: draft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: url ?? undefined,
      publishedTime: article.published,
      modifiedTime: article.updated ?? article.published,
      authors: [article.author],
      images: [article.image ?? SHARE_IMAGE],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = relatedTo(article);
  const url = absolute(`/blog/${slug}`);
  const blogUrl = absolute("/blog");

  // Only describes what is actually on the page, and claims no ratings,
  // awards or credentials we do not have.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    dateModified: article.updated ?? article.published,
    // An organisational byline: the company takes editorial responsibility.
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: SITE_NAME, legalName: COMPANY.name },
    ...(url ? { mainEntityOfPage: { "@type": "WebPage", "@id": url }, url } : {}),
  };

  const breadcrumbLd =
    url && blogUrl
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Blog", item: blogUrl },
            { "@type": "ListItem", position: 2, name: article.title, item: url },
          ],
        }
      : null;

  return (
    <>
      <Header />
      <main id="main">
        <article className="wrap post">
          <nav className="post-crumbs" aria-label="Breadcrumb">
            <Link href="/blog">Blog</Link>
            <span aria-hidden="true"> / </span>
            <span>{article.topic}</span>
          </nav>

          <header className="post-head">
            {article.status === "draft" ? (
              <p className="post-draft-banner" role="status">
                Draft — not published, and excluded from search engines and the sitemap.
              </p>
            ) : null}
            <h1>{article.title}</h1>
            <p className="post-standfirst">{article.description}</p>
            <p className="post-meta">
              <span>{article.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.published}>{formatDate(article.published)}</time>
              {article.updated ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={article.updated}>{formatDate(article.updated)}</time>
                  </span>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{article.readingMinutes} min read</span>
            </p>
          </header>

          <div className="post-body" dangerouslySetInnerHTML={{ __html: article.html }} />

          {article.references.length > 0 ? (
            <section className="post-refs" aria-labelledby="refs">
              <h2 id="refs">References</h2>
              <ol>
                {article.references.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} rel="nofollow noopener" target="_blank">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <SectionRule />

          {related.length > 0 ? (
            <section className="post-related" aria-labelledby="related">
              <h2 id="related">Related reads</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`}>{r.title}</Link>
                    <p className="muted">{r.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="post-cta" aria-labelledby="postCta">
            <h2 id="postCta">Nine dates. One Friday.</h2>
            <p className="muted">
              Nines at Nine is a curated speed-dating evening. Dates and cities haven’t been
              announced yet — joining the waitlist is how you hear first.
            </p>
            <Link className="btn" href="/#waitlist">
              I Want In
            </Link>
          </section>
        </article>
      </main>
      <Footer />

      <BlogAnalytics slug={article.slug} topic={article.topic} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {breadcrumbLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      ) : null}
    </>
  );
}

export const dynamicParams = false;
