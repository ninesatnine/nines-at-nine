# Meta Pixel — setup

The Meta Pixel (`2548566402312132`) records a **PageView** when someone visits
the **homepage**. It sends nothing else, and nothing on any other route.
PostHog is unaffected; it still owns the waitlist funnel and all other
analytics (see `POSTHOG_SETUP.md`).

> **Before switching it on in production — read the Privacy Policy.**
> Clause 14 says *"We do not use advertising or cross-site tracking cookies"*,
> and clause 7 says data is not shared *"for anyone else's advertising."* The
> pixel sets Meta's `_fbp` cookie, and Meta sets its own cookies on
> facebook.com, so a live pixel contradicts the published policy. There is
> also no consent banner yet (see §5). Update the policy, and decide on consent
> with legal advice, before adding the variable on Vercel. Until the variable
> is set, the pixel is off.

---

## 1. Configuration

| Variable | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | `2548566402312132` | Public, not a secret. Empty or missing = no pixel, and the site works normally |
| `NEXT_PUBLIC_META_PIXEL_TEST_HOSTS` | *(empty)* | Extra hostnames to allow, comma-separated. For testing only |

**Hosts.** The pixel runs only on `ninesatnine.com` and `www.ninesatnine.com`,
checked in the browser at runtime. Localhost, Vercel preview URLs
(`*.vercel.app`) and any other host are excluded, even when the id is set.

**To test locally,** set `NEXT_PUBLIC_META_PIXEL_TEST_HOSTS=localhost` in
`.env.local` and restart `npm run dev`. Events sent this way reach the real
pixel, so use Test Events (§6) and remove the value afterwards. To test a
preview deploy, add its exact hostname to that variable in Vercel's
**Preview** environment only.

`NEXT_PUBLIC_*` values are baked in **at build time**. Changing either one
needs a fresh build and deploy.

`.env.local` holds the id and is gitignored. `.env.example` has the keys with
empty values.

---

## 2. Tracking scope

| Situation | PageView? |
| --- | --- |
| First load of `/` | One |
| Client-side navigation to `/` (link, Back, Forward) | One per arrival |
| Re-renders, scrolling, the menu, typing in the form | None |
| Hash jumps on the homepage (`#waitlist`, `#questions`, …) | None |
| Switching to the confirmation view after joining (same route) | None |
| `/blog`, articles, `/terms`, `/privacy`, `/house-rules`, loaded directly | None: Meta's script is never loaded |
| Any of those, reached client-side after visiting `/` | None, although the script stays loaded (see below) |

**How the scope is held:**

- **Only the homepage mounts it.** `<MetaPixel />` is rendered by
  `src/app/page.tsx` alone. The build confirms the pixel code is referenced by
  `out/index.html` and no other page.
- **Meta's automatic SPA tracking is off.** fbevents.js normally fires its own
  PageView on every `pushState`, `replaceState` and `popstate`, which would
  track every route after the first homepage visit. `fbq.disablePushState =
  true` turns that off. This was verified by reading the live fbevents.js.
- **Automatic events are off.** `fbq('set', 'autoConfig', false, id)` runs
  before `init`, so there are no automatic button-click or page-metadata
  events.
- **Leaving the homepage revokes consent.** fbevents.js also fires a PageView
  when a page is restored from the back-forward cache, and it has **no** switch
  to turn that off. The pixel is revoked whenever the homepage unmounts, which
  holds such an event back on `/blog`. Meta queues anything it tries to send
  while revoked, to replay on grant, so that queue is emptied before the next
  homepage PageView grants again.
- **Returning is not suppressed.** Meta normally sends only one PageView per
  pixel per page load. `fbq.allowDuplicatePageViews = true` lets a genuine
  client-side return count. Duplicates are prevented on our side instead.
- **No duplicates.** The PageView is sent one tick after mount and cancelled if
  the component unmounts first, so React Strict Mode's mount → unmount → mount
  sends one, not two. The route is checked again at send time. `init` runs
  once per page load.

**Known edge:** a back-forward-cache restore **of the homepage itself** fires
Meta's own PageView, because the component was never unmounted. That is still
one PageView for one homepage visit.

---

## 3. Implementation

| File | What it does |
| --- | --- |
| `src/lib/meta-pixel.ts` | Meta's base code as TypeScript (the `fbq` queue stub), host and consent checks, `init`, the PageView, and the `Window.fbq` types |
| `src/components/MetaPixel.tsx` | Client component: decides after hydration, loads fbevents.js with `next/script` (`strategy="afterInteractive"`, `id="meta-pixel-fbevents"`) and dispatches the PageView |
| `src/app/page.tsx` | Renders `<MetaPixel />` next to `<Landing />`. Still a Server Component |
| `src/components/MetaPixel.test.tsx` | Strict Mode, re-render, hash change, return visit, stale queue, route check, consent, host and missing-id cases |

**How the supplied snippet maps onto this code:**

- **The loader function** became `installPixel()`. It creates the same `fbq`
  queue stub with the same fields and the same "already defined" guard.
- **The script tag it inserts** is now a `next/script` pointing at the same
  fbevents.js. `next/script` loads it once per page load, however many times
  the homepage is visited.
- **`fbq('init', …)` and `fbq('track', 'PageView')`** are separated.
  `init` runs once per page load, and PageView runs once per homepage visit.
- **The `<noscript>` image is omitted on purpose.** See §5.

**If the script fails to load** (ad blocker, network), the calls wait in the
stub's queue and nothing else happens. The page, the form and PostHog are
unaffected. This was verified with a deliberately broken script URL.

---

## 4. Data sent to Meta

Only the pixel id, the event name `PageView`, and what fbevents.js always
sends with it: the page URL, the referrer, a timestamp, and screen and browser
details.

- **No advanced matching.** `init` is called with no user data.
- **No automatic form or button tracking,** since `autoConfig` is off.
- **No custom events or parameters.** Waitlist conversions stay in PostHog
  only.
- **Page URLs are safe to send.** The homepage URL never contains personal
  data: the form does not submit to a URL, and the confirmation view keeps the
  same path.

**Check these in Events Manager** (Data sources → the pixel → Settings). They
live on Meta's side, and code cannot fully control them:

1. **Automatic advanced matching: Off.** When on, Meta's script can read
   email, phone and name fields from forms on the page, and the waitlist form
   collects a name and an email.
2. **Automatic event setup / "Track events automatically without code": Off.**
   Code already opts out via `autoConfig`; turn it off in Events Manager too.
3. **Event setup tool:** make sure no events were defined there (for example
   button-click events configured through the point-and-click tool).
4. **Traffic permissions:** consider an allow-list with `ninesatnine.com` and
   `www.ninesatnine.com`, so events from other domains are rejected.

---

## 5. Consent

The site's only consent mechanism today is the `window.__consent` flag, which
PostHog also honours. There is no banner yet.

- **`window.__consent === false`:** the pixel is never loaded. If it had
  already loaded earlier in the same page load, the next homepage visit calls
  `fbq('consent', 'revoke')` and sends nothing.
- **Unset (the current default, since no banner exists):** the pixel runs.
  Whether that is acceptable for an advertising pixel under the DPDP Act is a
  legal question. See the warning at the top.
- **When a banner is built,** it should set `window.__consent` before the page
  hydrates. For withdrawal mid-visit, it should also call
  `window.fbq?.('consent', 'revoke')` directly, so the change applies
  immediately instead of at the next homepage visit.

**Why there is no `<noscript>` fallback.** The fallback is a plain `<img>`
that loads `facebook.com/tr?...&ev=PageView` in any browser without
JavaScript. The site is a static export with no server, so that HTML is fixed
at build time and cannot check the visitor's consent. It would also fire on
every host that serves the build, including previews and localhost. It would
bypass both the consent flag and the host rule, so it is omitted. The cost is
that visitors with JavaScript disabled are not counted, which is a tiny share.

---

## 6. Testing and verification

**Automated:** `npm test` includes `MetaPixel.test.tsx`.

**In a browser (local build):**

1. Set `NEXT_PUBLIC_META_PIXEL_TEST_HOSTS=localhost` in `.env.local`.
   Restart the dev server, or build and serve `out/`.
2. Open DevTools → Network, filter `facebook`, and load `/`. You should see
   `fbevents.js` and a request to `facebook.com/tr` with `id=2548566402312132`
   and `ev=PageView`.
3. Scroll, open the menu, and click "Join the waitlist" (the `#waitlist`
   jump). No new `tr` request should appear.
4. Click the footer's **Blog** link. No request should appear. Then click the
   wordmark to return to `/`: exactly one new PageView.
5. Load `/blog` directly in a fresh tab. `fbevents.js` should not load at all.
6. Remove the test host afterwards.

The **Meta Pixel Helper** Chrome extension shows the same events.

**In Meta Events Manager (after deploying):**

1. Events Manager → **Data sources** → pixel **2548566402312132** →
   **Test events**.
2. Enter `https://ninesatnine.com` and open the site from there. That tags
   your browser's events as test traffic.
3. A **PageView** should appear within a few seconds. Navigate to `/blog`
   (nothing new should arrive), then back to `/` (one more).
4. The **Overview** tab shows production PageViews, usually within about 20
   minutes.

---

## 7. Deployment (Vercel)

1. **Update the Privacy Policy first,** and settle consent (see the top of this
   file).
2. Vercel → the project → **Settings → Environment Variables** → add
   `NEXT_PUBLIC_META_PIXEL_ID` = `2548566402312132`, **Production** only.
   Leave it out of Preview; the host check excludes previews anyway.
3. **Redeploy with a fresh build:** Deployments → the latest production deploy
   → ⋯ → **Redeploy**, with "Use existing build cache" **unchecked**. A
   push to `main` works too. The value is inlined at build time, so existing
   deployments never pick it up.
4. Verify with Test Events (§6).

**To turn it off:** delete the variable and redeploy.
