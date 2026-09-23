"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics";

/** One `blog_view` per article, and a click event for the waitlist links on it. */
export function BlogAnalytics({ slug, topic }: { slug: string; topic: string }) {
  const counted = useRef(false);

  useEffect(() => {
    // A ref guard rather than an empty dependency list, so React's development
    // double-invoke does not report two views for one read.
    if (counted.current) return;
    counted.current = true;
    track("blog_view", { slug, topic });
  }, [slug, topic]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.("a[href*='#waitlist']");
      if (!link) return;
      track("blog_waitlist_click", {
        slug,
        topic,
        placement: link.getAttribute("data-analytics") ? "article_footer" : "article_body",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [slug, topic]);

  return null;
}
