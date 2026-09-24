# Project progress — Nines at Nine

A running record of what has been built, what changed, and what is still open.
Add new entries to the top of the **Change log**.

**Current focus:** front end and design. The waitlist register API is connected (since 2026-09-22); there is no other backend.

---

## What exists today

**Stack:** Next.js 16.3.5 (App Router, Turbopack), React 19, TypeScript. Blog content is Markdown in `content/blog/`, rendered at build time.
**Run it:** `npm run dev -- -p 3107` → http://localhost:3107
**Deploy it (Netlify Drop):** `npm run build:zip`, then drag `nines-at-nine-site.zip` onto https://app.netlify.com/drop.
**Test it:** `npm test` (single run) or `npm run test:watch`. 45 tests. A JUnit XML report is written to `test-results/junit.xml`.

### Pages
| Route | What it is |
| --- | --- |
| `/` | Landing page, and the confirmation view it swaps to after joining |
| `/terms` | Terms of Use — 26 clauses |
| `/privacy` | Privacy Policy — 18 clauses, under the DPDP Act, 2023 |
| `/house-rules` | House Rules — four short rules, four stages, and the consequences |
| `/blog` | The journal index — six articles |
| `/blog/[slug]` | An article, from `content/blog/<slug>.md` |

All of them prerender as static HTML, along with `sitemap.xml` and `robots.txt`.

### Landing page (`src/app/page.tsx`)
1. **Hero:** "The Best-Looking Room in the City.", the logo mark, a join button, then the portrait reel
2. **Experience** (`#experience`): "Hot or Not? We'll Decide."
3. **How it works** (`#how-it-works`): "Not Everyone Gets In." — three numbered arch steps
4. **Questions** (`#questions`): 8-item FAQ accordion (`src/components/Faq.tsx`)
5. **Waitlist** (`#waitlist`): "Think You Belong in the Room?" and the form
6. **Footer:** wordmark, legal links, contact, company line

### Confirmation view (`src/components/ConfirmationView.tsx`)
Joining swaps the landing page for a waitlist card, covered by an opaque panel reading "Complete the rest of the details to reveal your card." The header nav is blanked here. Picking a gender chip and typing an age arms **Submit**, which registers the entry (`src/lib/register.ts`) and, on success, lifts the cover to show the ticket — name, city, gender, age and the place in line the API returned, stamped CARD COMPLETE. The button then becomes **Save your card**, which draws the ticket to a 1080×1440 canvas and downloads it as a PNG; a square download icon in the card's top-right corner does the same. A toast confirms the save, or carries the API's error if the submit was rejected.

### Design system (`src/app/globals.css`)
- Colours: oxblood `#290D10`, deep `#1D080B`, burgundy `#571B23`, glow `#74372F`, gold `#F4C469`, gold-soft, antique, ivory, muted, error.
- Fonts: Poiret One (display), Josefin Sans (body), loaded via `next/font`.
- **Aurora** background (`Aurora.tsx`): five blurred gradient blobs drifting on 22–40 second loops, still under "reduce motion".
- Shared `.btn`, `.field`, `.combo`, `.doc-*` and `.hr-*` styles.

### Components (`src/components/`)
| Component | Purpose |
| --- | --- |
| `Header.tsx` | Sticky header, mobile menu, `hideNav` for the confirmation view |
| `Footer.tsx` | Wordmark, legal links, contact, company line |
| `Aurora.tsx` | The drifting background |
| `Reel.tsx` | Edge-to-edge grayscale portrait reel, 150s loop, still under "reduce motion" |
| `Dock.tsx` | Phone-only join bar that slides up, then flies into the real form button and pulses it |
| `Faq.tsx` | The eight questions, as `<details>` |
| `WaitlistForm.tsx` | The form, its validation states and the honeypot |
| `CityCombobox.tsx` | City picker with alias matching and full keyboard support |
| `ConfirmationView.tsx` | The waitlist card and its PNG export |
| `Doc.tsx` | Shared legal-page pieces: head, contents, clause, callout, table, key-value list |
| `Ornaments.tsx` | The numbered arch, diamond rule and section divider |
| `Toast.tsx` | `useToast()` — a short self-dismissing status line |

### Waitlist form
- **Every field is required:** first name, email, a city from the list, and the 18+/updates checkbox.
- Errors appear on submit, then live-correct as the field is fixed.
- Validation is shared with the parked API route (`src/lib/waitlist.ts`).
- A hidden honeypot (`#website`) silently drops bot submissions.
- **Page one sends nothing.** The register API needs gender and age too, so the three fields are held in the browser and handed to the card; the single POST happens when the card is saved.

### Legal content
Company identity and document version live in one place (`src/lib/company.ts`): TechVortex Ventures Private Limited, CIN U62013WB2024PTC269470, GSTIN 19AAKCT8808L1ZJ, Grievance Officer Nilabja Datta, admin@ninesatnine.com. The registered address is used by the legal pages only; the footer shows the copyright line alone. Documents are version 1.1, effective 21 September 2026.

### Assets
`public/img/logo.png` and `public/img/m01.jpg`–`m16.jpg` (the reel portraits).

---

## Change log

### 2026-09-25 (latest) — a social share image

The supplied `src/app/OG.png` (1200×628, the NINES AT NINE wordmark on
oxblood) is now the preview card shown when a link to the site is shared.

- **Renamed to `src/app/opengraph-image.png`,** with a copy as
  `twitter-image.png` and alt text in the matching `.alt.txt` files. This is
  Next's file convention: it emits `og:image` and `twitter:image` with type,
  width, height and alt on every route, as absolute `https://ninesatnine.com/…`
  URLs via `metadataBase`.
- **The blog pages had to name it explicitly.** A page that sets its own
  `openGraph` block replaces the inherited one, image included, so `/blog` and
  every article were shipping `twitter:image` but no `og:image` — which is the
  tag WhatsApp, Facebook and LinkedIn read. `SHARE_IMAGE` in `src/lib/seo.ts`
  fills that in; an article with its own `image` in frontmatter still uses its
  own.
- Verified in `out/`: all 13 HTML pages carry exactly one `og:image` and one
  `twitter:image`. Build, typecheck, lint clean; 63 tests passing.

**Platforms cache previews.** A link already shared before this deploy keeps
its old (imageless) card until re-scraped — use Facebook's Sharing Debugger or
LinkedIn's Post Inspector to force a refresh.

### 2026-09-23 (latest) — a real favicon

The icon Chrome showed in the tab, and that Google shows beside a search
result, was **still the Create Next App default** — the black circle with a
white triangle, untouched since 18 September.

- **`src/app/favicon.ico`** rebuilt from the supplied `logo.png`, at 16, 32,
  48, 128 and 256px. The arch mark is cropped out of its 1080×1080 canvas
  (where it occupied only 20% of the width) and set on solid oxblood `#290D10`,
  matching the existing `theme-color`.
- **The gold is extracted as alpha, not cropped.** A straight crop carried the
  source's gradient background with it and left a visible lighter rectangle
  behind the mark on the tile.
- **16px is a simplified two-arch drawing, not a downscale.** The real mark has
  three nested arches with hairline strokes; scaled to 16px they merge into a
  blob. 32 and 48px use the real mark with the strokes dilated so they survive
  the downsample; 128 and 256px are faithful.
- **`src/app/apple-icon.png`** (180×180) added — there was none.
- **`public/img/logo-square.png`** (512×512) added and referenced as `logo` in
  the Organization JSON-LD. That is a different image from the favicon: it is
  what a knowledge panel may use, and it is only emitted once
  `NEXT_PUBLIC_SITE_URL` is set.
- The old default is kept at `scratchpad/favicon-OLD-nextjs-default.ico` for
  this session only.

**Google re-crawls favicons on its own schedule,** so the search-result icon
will lag the deploy by days to weeks, like the description snippet.

### 2026-09-23 (latest) — legal pages reconciled with the source artifact

Asked to bring Terms and Privacy back in line with the prototype artifact.

**One real divergence found and removed.** Clause 11 of the Terms carried a
sentence that is **not** in the artifact:

> "The short version is on the [House Rules] page."

It was added during the September rebuild, when House Rules became a real route
rather than a `#hash` view in a single file. Helpful, but not the source text,
so it is gone. `src/app/terms/page.tsx` is the only file changed.

A first pass over these documents reported "no change needed". That was wrong:
the sentence-level diff had been read only as far as its first screen, and the
insertion sat further down. The word-level diff below is what found it.

**Everything else was checked and matches.** Terms now shows **zero** genuine
content differences against the artifact under a word-level diff. Privacy shows
none either — its apparent differences are all matched insert/delete pairs of
the same words, which is the table reconstruction putting collapsed cells back
into the right columns.

**Two presentational reconstructions are kept deliberately,** both fixing the
same defect in the artifact's markup rather than changing its content:

1. **The seven tables.** The artifact's own tables are collapsed — three columns
   crammed into one cell, headers out of step with bodies. An order-insensitive
   word-count over all seven confirms nothing was lost and nothing invented.
2. **Clause 26, Contact.** The artifact renders it as a single run-on paragraph
   with the Company and Address labels lost. The page restores them as a
   labelled list. Only the two label words are not in the source; every other
   word matches.

**Confirmed identical:** 26 Terms clauses and 7 subheadings; 18 Privacy clauses
and 10 subheadings; 77 and 57 list items; the dateline (Effective 21 September
2026, Version 1.1, Last updated 20 September 2026); and the deployed pages,
which match local except for the new footer Blog link.

**The artifact settles how an Event happens:** "a scheduled online speed dating
evening, comprising a series of short one-to-one video rounds", cameras on. So
Terms and Privacy are right and **the homepage is the surface that is out of
step** with its "Room in the City" and city-by-city framing. Marketing, not
legal — left alone, and listed as an open item.

The artifact uses `admin@ninesatnine.com` for every contact and its own footer
carries `ninesatninehelp@gmail.com`. The site's `hello@ninesatnine.com` and the
removed footer address are later changes the owner asked for, not drift.

### 2026-09-23 (latest) — homepage search metadata

- **The homepage owns its metadata now.** `src/app/page.tsx` was a client
  component, which cannot export `metadata`, so the homepage was silently
  inheriting the root layout's. The landing page moved to
  `src/components/Landing.tsx` and `src/app/page.tsx` is now a thin server
  wrapper exporting title, description, Open Graph and Twitter tags. The copy
  lives once in `src/lib/seo.ts`.
- **Title** `Nines at Nine | Curated Speed Dating`. **Description:** "Nine
  curated speed dates. Selected singles. Verified profiles. Nines at Nine
  brings attraction first dating to a more exclusive format." — reused for
  `og:description` and `twitter:description`. Verified in `out/index.html`:
  exactly one `<title>`, exactly one `<meta name="description">`, and every
  other route keeps its own.
- **`NEXT_PUBLIC_SITE_URL=https://ninesatnine.com`**, so canonical tags and the
  sitemap's 11 URLs are emitted.
- A first draft of this metadata said *video* dating; the owner corrected it to
  speed dating. No product copy, FAQ or article ever carried the video framing,
  so nothing had to be undone there.

**Open item — the site contradicts itself about how an Event happens.** This
predates all of the above:

- **Terms** define an Event as "a scheduled **online** speed dating evening,
  comprising a series of short one-to-one **video** rounds", and warn about
  your camera, microphone and connection.
- **Privacy** lists a video infrastructure provider, live video in transit, and
  a liveness capture used for verification.
- **The homepage and FAQ** describe "The Best-Looking **Room** in the City",
  "a room of people chosen to meet each other", and cities that have not been
  announced.

Both cannot be true. The new metadata is deliberately neutral on medium, and
the speed-dating article's product sidebar no longer says "in person" — it
states only what both sets of documents agree on. **Decide which is right and
make one of the two consistent.**

**Open item — the preferred URL and the host disagree.** The apex
`https://ninesatnine.com/` is preferred and is what the canonical tag now says,
but Vercel 308s the apex to `www`. Fix in Vercel's domain settings; static
export means `next.config.ts` redirects do not apply.

Google's "creative web development solutions" snippet is **stale** — no such
copy exists in the repository or the live HTML.

### 2026-09-23 (latest) — a blog, and the SEO groundwork under it

Full notes in `docs/SEO.md`: audit, query-to-page map, claim/source log,
measurement spec, 30/60/90 plan and the blockers needing owner access.

- **`/blog` and `/blog/[slug]`,** from Markdown in `content/blog/`. Six
  complete articles, ~7,600 words, fully server-rendered — no CMS, no database,
  no service. Frontmatter carries title, description, excerpt, topic, author,
  dates, status, references, related slugs and an optional image; reading time
  is computed from the real text.
- **Draft support.** `status: "draft"` shows in `npm run dev` with a banner and
  is kept out of the production index, the sitemap and static generation, with
  `noindex` on the route as a second line of defence.
- **`sitemap.xml`, `robots.txt`, canonical URLs and JSON-LD** (Organization,
  BlogPosting, BreadcrumbList) — none of which existed before.
- **The production origin is configuration, and missing by default.**
  `NEXT_PUBLIC_SITE_URL` drives every absolute URL; unset, `siteUrl()` returns
  null and callers omit the tag rather than shipping `localhost` or an invented
  domain, which would actively mislead crawlers. **So until it is set the
  sitemap is empty and no canonicals are emitted** — verified both ways.
- **Footer now has READ → Blog,** a real link.
- **Three statistics, three sources, all opened and read** — two Pew surveys
  with the population, sample size and fieldwork dates preserved in the prose.
  Everything else is editorial reasoning or a labelled hypothetical. No
  interviews, experts or endorsements are claimed, because there were none.
  The byline is organisational.
- **Analytics is a seam, not a vendor:** `blog_view`, `blog_waitlist_click` and
  `waitlist_success` (fired only after the API confirms). No personal data can
  travel; `window.__consent === false` blocks everything.
- 63 tests passing, up from 48. Build clean; output inspected, not assumed.

### 2026-09-23 (latest) — the endpoint moves into the environment

- **`NEXT_PUBLIC_REGISTER_URL` is now the only source of the endpoint.** The
  hardcoded AWS URL is gone from `src/lib/register.ts`; the value lives in
  `.env.local` (gitignored) and, for a deploy, in the host's build settings.
  `.env.example` documents it.
- **An unset variable fails the build, not the visitor.** Next evaluates the
  module while prerendering, so a missing endpoint stops the build with a
  named error rather than shipping a site whose form quietly posts nowhere.
  Verified both ways: a normal build succeeds and inlines the URL; moving
  `.env.local` aside fails with "NEXT_PUBLIC_REGISTER_URL is not set".
- **It is still public.** `NEXT_PUBLIC_*` is inlined into the client bundle —
  I confirmed the URL appears in `out/_next/static/chunks/`. This hides nothing
  from anyone; it is a location, not a secret. **No key or token may ever go in
  a `NEXT_PUBLIC_*` variable,** and being a static export there is no server to
  keep one on.
- Tests supply their own endpoint through `vitest.config.mts` rather than
  reading `.env.local` or touching the real API. 48 passing, up from 47.

### 2026-09-23 (latest) — the address is off the footer

- **The footer no longer carries the street address.** It shows the copyright
  line alone. The now-unused `addressShort` field is gone from `company.ts` too,
  rather than left lying around.
- **The full address stays on the legal pages,** deliberately: `COMPANY.address`
  appears five times across `/terms` and `/privacy` as the registered office in
  the entity clause and in the contact tables. Removing it there is a
  substantive legal change — an Indian company's registered office is expected
  in terms and in a DPDP privacy policy, and the Grievance Officer's contact
  block is a statutory requirement. Decide that one deliberately.

### 2026-09-23 (later still) — the reveal scrolls into view on narrow screens

- **The first submit brings the card into view, once.** On the stacked layout
  the card sits above the details, so by the time **Submit** is pressed the
  reveal happens off screen, further up. A ref-guarded effect on `count` scrolls
  to it, so pressing **Save your card** afterwards does not scroll again. It
  honours "reduce motion" by jumping rather than gliding, and only runs on the
  stacked layout — on the wide layout the card is already beside the form.
- The card was briefly reordered below the details on narrow screens, then put
  back where it was. Only the scroll remains.
- **`vitest.setup.ts` needed a `matchMedia` stub.** jsdom does not implement it,
  so four tests crashed outright. Stubbed beside the `scrollIntoView` stub
  already there, defaulting to "nothing matches" — a wide window. 47 tests
  passing, up from 46.

### 2026-09-23 (later) — a download icon on the card itself

- **A square download button sits in the card's top-right corner,** appearing
  with the reveal. It is the veil's mirror image: covered shows the lock panel,
  revealed shows the icon. Same `saveCard()` the main button calls, disabled
  while busy so a double-tap cannot start two saves, and it shares the `uncover`
  animation (and its reduced-motion opt-out) so it fades in with the card.
- The main **Save your card** button stays; the icon is a second way to save,
  not a replacement.
- **Three tests broke and were fixed, not worked around.** The new button's
  accessible name legitimately matched the existing `/Save your card/` regex, so
  the two now have distinct exact names — "Save your card" and "Save your card
  as an image" — and the selectors are exact rather than loosened. A new test
  covers downloading from the corner icon. 46 passing, up from 45.

### 2026-09-23 — header wordmark only, and a mobile line break

- **The logo is gone from the header,** at every width; it is now the wordmark
  NINES AT NINE alone. `next/image` and the `with-mark` class went with it.
  The hero's large logo mark and the footer's are untouched — note the footer
  still uses `.head-mark` and `.wordmark.with-mark`, so those rules stay in
  `globals.css` despite no longer styling anything in the header.
- **"No Swiping Required." drops to its own line below 760px.** The tail of the
  experience tagline is wrapped in `.wrap-mobile`, which goes `display:block`
  at that width. A span rather than a `<br>`, so the break is purely visual and
  the sentence stays continuous for screen readers and text selection. Above
  760px it reads as one line exactly as before.
- 45 tests passing; typecheck and lint clean.

### 2026-09-22
- **Rebuilt the site to match the new design, and added the three legal pages.** Source: the shared artifact at https://claude.ai/artifact/1CJ2BJpNunMVZL7ZKf9hEC (a single-file HTML prototype). Its logo and sixteen portraits were pulled into `public/img/`.
  - **New routes** `/terms`, `/privacy` and `/house-rules`, all statically prerendered. The prototype held these behind `#hash` views in one file; in Next they became real routes, so each has its own URL, title and description, and the footer and cross-references link between them.
  - **Legal tables repaired.** Six tables in the prototype had collapsed — three columns of content crammed into two cells, headers and bodies out of step (retention periods, processing grounds, recipients, cookies, the waitlist data table). Each was reconstructed from the run-together text into a correct table. Worth a read-through before launch to confirm the reconstruction matches intent.
  - **New hero and section copy** throughout, plus "Eighteen People. All Verified. No Swiping Required."
  - **Confirmation view and waitlist card** (new — see above), replacing the old inline success message. This settles the open item about success wording: the message no longer mentions email being optional, because email is now required.
  - **Email and city are required again,** and city must be one we recognise — the room opens city by city, so free text is rejected with "Choose your city from the list."
  - **City list rewritten** as `src/lib/cities.ts`: 135 cities, each with the other names people type for it (Bangalore → Bengaluru, Bombay → Mumbai, Vizag → Visakhapatnam). The combobox shows the matched older name beside the current one. Replaces the 470-name `indian-cities.ts`, which listed alternate names as separate entries.
  - **Aurora background** replaces `Ambient.tsx`; the **reel** replaces `PortraitStrip.tsx` (no pause button now — the reel is `aria-hidden` and stops under "reduce motion"); the **dock** replaces `StickyCta.tsx`. `JoinButton.tsx`, `Reveal.tsx` and `scroll.ts` were removed as unused.
  - `globals.css` rewritten as plain CSS. The Tailwind import is gone — nothing used its utilities.
  - **Aurora fix.** The aurora CSS was a byte-for-byte copy of the artifact's, but rendered almost flat: a leftover `background` on `html` from the old stylesheet stopped `body`'s background propagating to the canvas, so `body` painted an opaque box over the `z-index:-1` aurora layer. `body` is transparent again, with `html` keeping the solid oxblood fallback.
  - Tests rewritten for the new rules: 31 passing, covering validation, the city list and alias matching, the combobox, and the form. Lint, typecheck and the static build are all clean.

### 2026-09-22 (later still) — the card is covered until you submit

The card now has to be earned. Two presses of one button instead of one.

- **The card starts covered.** An opaque panel over the ticket reads "Complete the rest of the details to reveal your card.", with a lock. The ticket underneath is `aria-hidden` while covered, so screen readers get the cover's message and not a half-filled card.
- **Press one, "Submit",** registers the entry. On success the cover lifts (a short fade-and-scale, skipped under "reduce motion"), the real number lands on the ticket, and the CARD COMPLETE seal appears.
- **Press two, now "Save your card",** draws and downloads the PNG. Registration and download are no longer the same click.
- A rejected submit keeps the card covered and downloads nothing; the API's message goes to the toast.
- Copy follows the state: the heading runs "Two details to unlock your card." → "One more detail." → "Ready when you are." → "You're number N."; the hint runs "Add … to unlock your card." → "Submit to reveal your card." → "Saves as an image to your device."
- Verified in Chrome on the Mac: covered → Submit → `201` → revealed at `Nº 258` → Save → `nines-at-nine-card-258.png` (1080×1440). 45 tests passing.

### 2026-09-22 (later) — waitlist register API connected

The card's number is now real: it comes from `POST /register`.

- **One call, on Save your card.** The API requires `name`, `email`, `gender`, `age` and `city` together (a partial post returns 400), so page one sends nothing — it holds first name, email and city in the browser and hands them to the card. When gender and age are added and **Save your card** is pressed, the whole entry goes at once; on success the `count` in the response becomes the place in line, the card is drawn with it, and only then does the PNG download.
- **Endpoint** `https://qab324zxc9.execute-api.ap-south-1.amazonaws.com/register`, in `src/lib/register.ts`. Override with `NEXT_PUBLIC_REGISTER_URL`.
- **It answers 201, not 200.** A new email returns `201 {"status":"created","count":N}`; posting the same email again returns `200 {"status":"updated","count":N}` with the *same* count. Both are treated as success, so a repeat save is safe.
- **Gender is an enum:** `male`, `female`, `other`. Our four chips map onto it, so "Non-binary" and "Prefer not to say" both send `other`.
- **The number is no longer invented.** It used to be a random 1180–1239 shown immediately. Until the entry is registered the ticket shows a muted `Nº ——` and the status line reads "Save your card to claim your place in line"; the CARD COMPLETE seal now means registered, not just filled in.
- **Failures don't download.** The API's own message is shown in the toast (e.g. the gender enum error), the card is not saved, and the number stays blank.
- **Logo load guarded.** `loadLogo()` had no timeout, so an image event that never fired would have left the save stuck on "Saving…" forever. It now gives up after 5s and draws the card without the logo.
- **CORS: the endpoint has no OPTIONS route.** The POST replies with `access-control-allow-origin: *`, but a preflight returns 404 — and `Content-Type: application/json` forces a preflight, so the browser blocked the request before sending it (curl never sees this). The client now sends `Content-Type: text/plain;charset=UTF-8`, which is CORS-safelisted and skips the preflight; the API parses the JSON body regardless. **Ask the backend to add an OPTIONS handler**, then this header can go back to `application/json` (`src/lib/register.ts` says so in a comment).
- Verified end to end in Chrome on the Mac: join → card → Save → `201` → `Nº 257` on screen and in the downloaded `nines-at-nine-card-257.png` (1080×1440).
- Tests: 44 passing, up from 31. New `register.test.ts` (payload mapping, 201/200, error passthrough, network failure) and `ConfirmationView.test.tsx` (nothing sent on page one, posts on save, number from the response, download named after it, no download on rejection).

### 2026-09-18
- **Static export for Netlify drag-and-drop hosting.**
  - `next.config.ts`: `output: "export"` and `images: { unoptimized: true }`. The default image optimiser needs a server.
  - `src/app/api/waitlist/route.ts` moved to `backend-later/waitlist-route.ts`, because static exports can't serve API routes.
  - New script `npm run build:zip` builds to `out/` and creates `nines-at-nine-site.zip` for Netlify Drop.
- **Unit tests added (Vitest + React Testing Library), with a JUnit XML report.**
- **Email and City made optional**, with an Indian-cities autocomplete dropdown (both since superseded).
- Initial build of the landing page, design system, components and waitlist form.

---

## Open items / to do
- [x] **The reconstructed tables are faithful.** Verified 23 September 2026
  against the source artifact: all seven tables hold every word, nothing lost,
  nothing invented. See the change log entry for that date.
- [ ] **Have a lawyer check both documents before launch.** Fidelity to the
  artifact is now established; whether the artifact itself says the right thing
  is a separate question.
- [ ] **The homepage contradicts the legal pages about how an Event happens.**
  Terms and Privacy describe an online evening of one-to-one video rounds;
  the homepage describes a room in a city. Decide which is right and make the
  other match.
- [ ] **Two contact addresses are in use.** The footer shows `hello@ninesatnine.com`; every legal page says `admin@ninesatnine.com`. Both come from the prototype. Decide which is right.
- [ ] **Two chips collapse to one value.** The API's gender enum is `male`/`female`/`other`, so "Non-binary" and "Prefer not to say" are indistinguishable once stored. Widen the enum if that difference matters.
- [ ] **Add an OPTIONS route to the register API.** Without it the client must send `Content-Type: text/plain` to dodge the CORS preflight. Works, but it is a workaround.
- [ ] **The endpoint is called from the browser,** so it is public and unauthenticated. Consider rate limiting or a token before launch.
- [ ] **Test entries are in the register database** from wiring this up: `claude-integration-test-0001@example.com`, `claude-integration-test-0002@example.com` (rejected, 400), `cors-probe-0001@example.com`, `aanya.mactest@example.com`, `aanya.reveal@example.com` (counts 255–258). Delete them before launch.
- [ ] **`backend-later/waitlist-route.ts` is now redundant** — the register API replaces it. Delete it, or keep it if you still want a server-side proxy.
- [ ] **Cookies.** The Privacy Policy describes a cookie banner and refusable analytics and preference cookies. The site sets no cookies and has no banner. Build the banner, or narrow that clause.
- [ ] **Photos.** Confirm a licence for each of the sixteen portraits.
- [ ] **City list.** 135 cities, down from 470 names. Since city is now required and must match the list, add any city you expect applicants from.
- [ ] **A flaky test.** `WaitlistForm > hands over the name, email and city` fails
  roughly one run in six, on committed code as well as new work — a timing flake
  in the test, not the form. Fix it before it erodes trust in the suite.
- [ ] **Set `NEXT_PUBLIC_SITE_URL` in the deploy host.** Until it is set there
  is no sitemap and no canonical tags — see `docs/SEO.md` §4 and §7.
- [ ] **Verify the domain in Search Console and Bing Webmaster Tools,** and
  submit the sitemap. Cannot be done from the repository.
- [ ] **Choose an analytics vendor.** The events exist and fire; nothing
  receives them yet.
- [ ] **Read the six articles before launch** against the claim log in
  `docs/SEO.md` §5.
- [ ] **Version control.** All work since the initial Create Next App commit is uncommitted.
