/* Meta Pixel, homepage only. See META_PIXEL_SETUP.md.
 *
 * This is Meta's standard base code, split in two. The `fbq` queue stub is set
 * up here, in TypeScript. Meta's library, fbevents.js, is loaded by next/script
 * in src/components/MetaPixel.tsx. Calls made before the library arrives wait
 * in the stub's queue, exactly as they do with the pasted snippet.
 *
 * The one event is PageView. The rules below keep it that way:
 *   - `disablePushState`: Meta fires a PageView of its own on every
 *     pushState/replaceState/popstate, which in an App Router site would
 *     track every route the visitor goes on to. Off.
 *   - `autoConfig` off: no automatic button-click or page-metadata events.
 *   - `allowDuplicatePageViews`: Meta otherwise sends one PageView per pixel per
 *     document, which would drop a genuine client-side return to the homepage.
 *     Duplicates are prevented in MetaPixel.tsx instead.
 *   - Consent is revoked whenever the homepage unmounts. Meta also fires a
 *     PageView on back-forward-cache restores, with no switch to turn it off,
 *     and revoking keeps that from reaching /blog or a legal page.
 *
 * Nothing about the visitor is passed: no advanced matching and no user data,
 * only the pixel id and the event name.
 */

const FBEVENTS_URL = "https://connect.facebook.net/en_US/fbevents.js";

/** Tracking runs only on these hosts, so localhost and preview deploys stay out. */
const PRODUCTION_HOSTS = ["ninesatnine.com", "www.ninesatnine.com"];

type FbqArgs = unknown[];

export type Fbq = ((...args: FbqArgs) => void) & {
  callMethod?: (...args: FbqArgs) => void;
  queue: FbqArgs[];
  push: Fbq;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
  allowDuplicatePageViews?: boolean;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    /** The site's consent flag. Only an explicit `false` means refused. */
    __consent?: boolean;
  }
}

export { FBEVENTS_URL };

/** The configured pixel id, or null when it is missing or not a pixel id. */
export function pixelId(): string | null {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id && /^\d+$/.test(id) ? id : null;
}

/** Production hosts, plus any listed in NEXT_PUBLIC_META_PIXEL_TEST_HOSTS. */
function allowedHosts(): string[] {
  const extra = (process.env.NEXT_PUBLIC_META_PIXEL_TEST_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return [...PRODUCTION_HOSTS, ...extra];
}

/** A pixel id is set and this is a host the pixel may run on. */
export function pixelConfiguredHere(): boolean {
  if (typeof window === "undefined" || !pixelId()) return false;
  return allowedHosts().includes(window.location.hostname.toLowerCase());
}

export function consentRefused(): boolean {
  return typeof window !== "undefined" && window.__consent === false;
}

/** "/" as served by Vercel, or "/index.html" from a plain static host. */
export function isHomePath(pathname: string): boolean {
  return pathname === "/" || pathname === "/index.html";
}

let initialised = false;

/** Set up the queue stub and initialise the pixel, once per browser document. */
export function installPixel(): void {
  const id = pixelId();
  if (initialised || !id) return;
  initialised = true;

  // Meta's base code, minus the script tag, which next/script loads.
  if (!window.fbq) {
    const n = function (...args: FbqArgs) {
      if (n.callMethod) n.callMethod(...args);
      else n.queue.push(args);
    } as Fbq;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    window.fbq = n;
    if (!window._fbq) window._fbq = n;
  }

  const fbq = window.fbq;
  // Both flags are read by fbevents.js when it loads and on every PageView,
  // so they must be set on the stub before the library arrives.
  fbq.disablePushState = true;
  fbq.allowDuplicatePageViews = true;
  fbq("set", "autoConfig", false, id);
  fbq("init", id);
}

/** Send one PageView for this homepage visit. */
export function trackHomePageView(): void {
  const fbq = window.fbq;
  if (!fbq) return;
  if (consentRefused()) {
    fbq("consent", "revoke");
    return;
  }
  // While consent was revoked (the visitor was off the homepage), Meta queued
  // anything it tried to send, such as a back-forward-cache PageView on
  // /blog, to replay on grant. Drop that before granting. Only once the
  // library is running: before then the queue holds the init calls above.
  if (fbq.callMethod) fbq.queue.length = 0;
  fbq("consent", "grant");
  fbq("track", "PageView");
}

/** Stop the pixel sending anything while the visitor is off the homepage. */
export function suspendPixel(): void {
  window.fbq?.("consent", "revoke");
}
