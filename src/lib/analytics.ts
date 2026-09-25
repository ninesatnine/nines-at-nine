/* Privacy-conscious event tracking, sent to PostHog.
 *
 * PostHog itself is started in src/instrumentation-client.ts. This module is
 * the only place the app names an event, so every call site goes through one
 * of the typed functions below rather than calling `posthog.capture` directly.
 *
 * Two rules it enforces, so they cannot be forgotten at the call site:
 *   1. No personal data. Never a name, an email, a gender, an age, a city or
 *      any other application answer. Each function accepts only the fields it
 *      sends, and those are all about the page, never the person.
 *   2. Consent. Nothing is sent while `window.__consent` is explicitly false,
 *      so wiring up a banner later does not require revisiting every event.
 *
 * With no project token configured, PostHog is never loaded and every function
 * here does nothing — so local builds and tests send nothing anywhere.
 */

import posthog from "posthog-js";

/** Where a "Join the waitlist" button sits. No footer CTA exists yet; the
 *  value is reserved so adding one does not mean touching this file. */
export type CtaLocation = "hero" | "navbar" | "dock" | "blog" | "footer";

type Consented = { __consent?: boolean };

function send(event: string, props: Record<string, string>): void {
  if (typeof window === "undefined") return;
  // Absent means "not asked yet"; only an explicit false blocks.
  if ((window as Consented).__consent === false) return;
  if (!posthog.__loaded) return;
  posthog.capture(event, props);
}

/** A "Join the waitlist" button was pressed. */
export function trackWaitlistClick(location: CtaLocation, articleSlug?: string): void {
  send("waitlist_button_clicked", {
    location,
    ...(articleSlug ? { article_slug: articleSlug } : {}),
  });
}

/** The visitor first focused a field of the waitlist form. Once per page load
 *  is the caller's job; the form guards it with a ref. */
export function trackWaitlistStarted(): void {
  send("waitlist_form_started", {});
}

/** The register API confirmed the entry and the card was revealed. Never
 *  called on the button press, which would count every rejected submit. */
export function trackWaitlistCompleted(): void {
  send("waitlist_completed", { source: "website" });
}

/** An article was opened. */
export function trackBlogOpened(articleSlug: string, topic: string): void {
  send("blog_opened", { article_slug: articleSlug, article_topic: topic });
}
