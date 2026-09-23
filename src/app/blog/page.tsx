import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionRule } from "@/components/Ornaments";
import { formatDate, listArticles } from "@/lib/blog";
import { absolute } from "@/lib/site";

const TITLE = "Dating, With a Little More Thought.";
const INTRO =
  "Perspectives on modern dating, meaningful relationships, and the way we choose each other.";

export const metadata: Metadata = {
  title: `Blog — ${TITLE} | Nines at Nine`,
  description: INTRO,
  // Omitted entirely until the production origin is configured, rather than
  // pointing a canonical tag at a guess. See src/lib/site.ts.
  alternates: absolute("/blog") ? { canonical: absolute("/blog")! } : undefined,
  openGraph: {
    title: TITLE,
    description: INTRO,
    type: "website",
    url: absolute("/blog") ?? undefined,
  },
};

export default function BlogIndex() {
  const articles = listArticles();

  return (
    <>
      <Header />
      <main id="main">
        <div className="wrap blog-top">
          <span className="eyebrow">The journal</span>
          <h1>{TITLE}</h1>
          <p className="lede">{INTRO}</p>
        </div>

        <div className="wrap">
          <SectionRule marginTop={8} />

          <ul className="post-list">
            {articles.map((a) => (
              <li key={a.slug}>
                <article className="post-card">
                  <p className="post-meta">
                    <span className="post-topic">{a.topic}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={a.published}>{formatDate(a.published)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{a.readingMinutes} min read</span>
                    {a.status === "draft" ? <span className="post-draft">Draft</span> : null}
                  </p>
                  <h2>
                    <Link href={`/blog/${a.slug}`}>{a.title}</Link>
                  </h2>
                  <p className="post-excerpt">{a.excerpt}</p>
                  <Link className="post-more" href={`/blog/${a.slug}`}>
                    Read the article
                    <span aria-hidden="true"> →</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          <SectionRule />

          <section className="blog-cta" aria-labelledby="blogCta">
            <h2 id="blogCta">Nine dates. One Friday. Three minutes each.</h2>
            <p className="muted">
              Nines at Nine is a curated speed-dating evening. Dates and cities haven’t been
              announced — the waitlist is how you hear first.
            </p>
            <Link className="btn" href="/#waitlist">
              Join the waitlist
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
