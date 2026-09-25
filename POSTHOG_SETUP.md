# PostHog analytics — setup

PostHog measures how visitors move through the site: page views, sessions,
clicks, the waitlist funnel, which "Join the waitlist" buttons work, and which
articles get read. It is wired up by hand using the Next.js App Router method.
The PostHog wizard was not used.

**Without a project token, PostHog is off.** Nothing is loaded and nothing is
sent. That is the state the repository ships in.

---

## 1. Installation

Already done. The project uses npm (`package-lock.json`):

```bash
npm install posthog-js
```

PostHog starts in **`src/instrumentation-client.ts`**. Next.js 15.3+ runs that
file once in the browser before the app becomes interactive, so there is no
provider component or `useEffect` to set up.

---

## 2. Environment variables

| Variable | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | `phc_…` from PostHog → Project settings → Project token | Empty = PostHog is off |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` | Use `https://eu.i.posthog.com` for an EU project |

**Local:** paste the token into `.env.local`. The keys are already there, empty.
Restart `npm run dev` afterwards.

**The token is not a secret,** but keep it out of git anyway. It is a
write-only key that has to ship to the browser: `NEXT_PUBLIC_*` values are
inlined into the client bundle at build time. `.env.local` is gitignored, and
`.env.example` holds only placeholders.

Because the value is inlined **at build time,** changing it means rebuilding
and redeploying. Changing it on the host alone does nothing.

---

## 3. What is captured automatically

`defaults: "2026-05-30"` in `posthog.init` turns these on with no extra code:

- **Page views,** including App Router navigations that don't reload the page
- **Page leaves,** and time on page
- **Sessions**
- **Clicks** (autocapture) and dead clicks
- **Heatmaps** (`enable_heatmaps: true`): clicks, rage clicks, mouse movement
  and scroll depth. View them in PostHog → Heatmaps, or with the toolbar on
  ninesatnine.com (already an authorized URL)
- **Session replay,** with the form and the card blocked (see §5)

---

## 4. Custom events

They are all defined in `src/lib/analytics.ts`, the only file that calls
`posthog.capture`. Components call the typed functions instead.

| Event | Function | Properties | Where it fires |
| --- | --- | --- | --- |
| `waitlist_button_clicked` | `trackWaitlistClick(location, slug?)` | `location`: `hero`, `navbar`, `dock` or `blog`; `article_slug` for `blog` | Hero button (`Landing.tsx`), header button and mobile-menu link (`Header.tsx`), phone join bar (`Dock.tsx`), waitlist links inside an article (`BlogAnalytics.tsx`) |
| `waitlist_form_started` | `trackWaitlistStarted()` | none | The first time any field of the waitlist form gets focus, once per page load (`WaitlistForm.tsx`) |
| `waitlist_completed` | `trackWaitlistCompleted()` | `source: "website"` | Only after the register API returns success and the card is revealed (`ConfirmationView.tsx`). Never on the button press |
| `blog_opened` | `trackBlogOpened(slug, topic)` | `article_slug`, `article_topic` | Once per article view (`BlogAnalytics.tsx`) |

**Notes:**

- **`footer`:** the footer has no "Join the waitlist" button. The value is
  reserved in the type, so adding one later is a one-line change.
- **`dock`:** this is the phone-only join bar that slides up once the hero
  button scrolls away. It is a real CTA, so it gets its own value rather than
  being counted as the hero.
- **The funnel steps are `waitlist_button_clicked` → `waitlist_form_started` →
  `waitlist_completed`.** Between the last two, the visitor submits page one
  (name, email, city), then adds gender and age on the card and presses
  Submit. No event marks the page-one submit, so a drop-off between
  "started" and "completed" covers both steps.

---

## 5. Privacy

**What is sent:** anonymous behavioural events only. No name, email, phone,
date of birth, gender, age, city, or any other application answer ever reaches
PostHog. Here is how that is enforced:

1. **Every custom event takes only fixed, page-level fields.** There is no
   free-form "properties" parameter a call site could put personal data into.
   `src/lib/analytics.test.ts` pins down exactly what each event sends.
2. **Session replay blocks the form and the card.** The recorder treats
   `ph-no-capture` as its block class, so a replay shows an empty box where
   the waitlist form and the confirmation view (name, gender, age, toasts)
   would be. Every input is masked too (`maskAllInputs`, in code and in the
   project settings). The saved card is drawn on a canvas that is never put
   on the page, so canvas recording cannot see it. **Any new element that
   shows personal data must sit inside a `ph-no-capture` wrapper** and must
   not be rendered through a portal outside it.
3. **`ph-no-capture`** is on the waitlist form and on the confirmation view.
   Autocapture records nothing inside either, so neither a picked city nor a
   gender chip's label travels with a click.
4. **No one is identified.** `posthog.identify` is never called, so every
   visitor is an anonymous id and no person profiles are created.
5. **Consent.** If `window.__consent === false`, PostHog starts opted out and
   the helpers send nothing. A future consent banner only has to set that
   flag, or call `posthog.opt_in_capturing()` / `opt_out_capturing()`.

**PostHog sets a first-party cookie** (`ph_<token>_posthog`) and a matching
localStorage entry to hold the anonymous id. Until now the site set no cookies
at all. The Privacy Policy already describes refusable analytics cookies and a
consent banner that does not exist yet. With analytics live, that banner is no
longer hypothetical. **Decide with legal advice whether it is needed under the
DPDP Act before switching the token on in production.** If you want PostHog
to use no cookies, add `persistence: "memory"` to `posthog.init`. The cost is
that each page load counts as a new visitor.

---

## 6. Production deployment (Vercel)

1. Vercel → the project → **Settings → Environment Variables.**
2. Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` with your `phc_…` token, for the
   **Production** environment. Add it to Preview too if preview deploys
   should report, ideally to a separate PostHog project so test traffic stays
   out of the real numbers.
3. Add `NEXT_PUBLIC_POSTHOG_HOST` = `https://us.i.posthog.com`.
4. **Redeploy.** Existing deployments keep the value they were built with.
5. For a Netlify Drop build instead: set the token in `.env.local` before
   `npm run build:zip`. It is baked into the zip.

---

## 7. Verifying events

1. Put the token in `.env.local` and restart `npm run dev -- -p 3107`.
2. Open http://localhost:3107/?__posthog_debug=true. PostHog logs every event
   it sends to the browser console as `[PostHog.js] send "<event>"`.
3. In PostHog, open **Activity** (the live events view) and watch for:
   - `$pageview` on load
   - `waitlist_button_clicked` with `location: hero` when you press the hero button
   - `waitlist_form_started` when you click into First name
   - `blog_opened` on any `/blog/<slug>` page
4. `waitlist_completed` needs a real successful registration, which **creates
   an entry in the register database**. Use an obviously fake address and
   delete the entry afterwards, or check this event on production traffic.
5. Recommended in PostHog: a **Funnel** insight over
   `waitlist_button_clicked` → `waitlist_form_started` → `waitlist_completed`,
   and a **Trends** insight on `waitlist_button_clicked` broken down by
   `location`.

Ad blockers often block `*.posthog.com`. If nothing arrives, try a private
window with extensions disabled. A reverse proxy can be added later if lost
events matter.
