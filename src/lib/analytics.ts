/* Privacy-conscious event tracking.
 *
 * There is no analytics vendor in this project yet, so this is deliberately a
 * thin seam rather than an integration: it hands events to whatever the page
 * has already loaded (a `dataLayer`, or a `plausible`-style function) and does
 * nothing at all when neither is present.
 *
 * Two rules it enforces, so they cannot be forgotten at the call site:
 *   1. No personal data. Never a name, an email, or an application answer.
 *      Only a slug, a topic, and where the click came from.
 *   2. Consent. Nothing is sent while `window.__consent` is explicitly false,
 *      so wiring up a banner later does not require revisiting every event.
 */

export type EventName = "blog_view" | "blog_waitlist_click" | "waitlist_success";

/** Only these keys may travel. Anything else is dropped rather than trusted. */
export type EventProps = {
  slug?: string;
  topic?: string;
  /** Which part of the page the click came from, e.g. "article_footer". */
  placement?: string;
};

type Consented = { __consent?: boolean };
type DataLayer = { dataLayer?: unknown[] };

export function track(name: EventName, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  // Absent means "not asked yet"; only an explicit false blocks.
  if ((window as Consented).__consent === false) return;

  const payload = {
    event: name,
    ...(props.slug ? { slug: props.slug } : {}),
    ...(props.topic ? { topic: props.topic } : {}),
    ...(props.placement ? { placement: props.placement } : {}),
  };

  const layer = (window as DataLayer).dataLayer;
  if (Array.isArray(layer)) layer.push(payload);
}
