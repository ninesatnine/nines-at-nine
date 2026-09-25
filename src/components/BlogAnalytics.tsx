"use client";

import { useEffect, useRef } from "react";

import { trackBlogOpened, trackWaitlistClick } from "@/lib/analytics";

/** One `blog_opened` per article, and a click event for the waitlist links on it. */
export function BlogAnalytics({ slug, topic }: { slug: string; topic: string }) {
  const counted = useRef(false);

  useEffect(() => {
    // A ref guard rather than an empty dependency list, so React's development
    // double-invoke does not report two views for one read.
    if (counted.current) return;
    counted.current = true;
    trackBlogOpened(slug, topic);
  }, [slug, topic]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Only links in the article itself: the header's button reports as "navbar".
      const link = (e.target as HTMLElement | null)?.closest?.("main a[href*='#waitlist']");
      if (!link) return;
      trackWaitlistClick("blog", slug);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [slug, topic]);

  return null;
}
