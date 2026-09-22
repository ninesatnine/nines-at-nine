# Project progress — Nines at Nine

A running record of what has been built, what changed, and what is still open.
Add new entries to the top of the **Change log**.

**Current focus:** design and front end only. No real backend or API is connected yet.

---

## What exists today

**Stack:** Next.js 16.3.5 (App Router, Turbopack), React 19, TypeScript.
**Run it:** `npm run dev -- -p 3107` → http://localhost:3107
**Deploy it (Netlify Drop):** `npm run build:zip`, then drag `nines-at-nine-site.zip` onto https://app.netlify.com/drop.
**Test it:** `npm test` (single run) or `npm run test:watch`. 44 tests. A JUnit XML report is written to `test-results/junit.xml`.

### Pages
| Route | What it is |
| --- | --- |
| `/` | Landing page, and the confirmation view it swaps to after joining |
| `/terms` | Terms of Use — 26 clauses |
| `/privacy` | Privacy Policy — 18 clauses, under the DPDP Act, 2023 |
| `/house-rules` | House Rules — four short rules, four stages, and the consequences |

All four prerender as static HTML.

### Landing page (`src/app/page.tsx`)
1. **Hero:** "The Best-Looking Room in the City.", the logo mark, a join button, then the portrait reel
2. **Experience** (`#experience`): "Hot or Not? We'll Decide."
3. **How it works** (`#how-it-works`): "Not Everyone Gets In." — three numbered arch steps
4. **Questions** (`#questions`): 8-item FAQ accordion (`src/components/Faq.tsx`)
5. **Waitlist** (`#waitlist`): "Think You Belong in the Room?" and the form
6. **Footer:** wordmark, legal links, contact, company line

### Confirmation view (`src/components/ConfirmationView.tsx`)
Joining swaps the landing page for a waitlist card: name, city and a place in line on a ticket with punched notches. The number is blank until the entry is registered. The header nav is blanked here. Picking a gender chip and typing an age fills the two blank rows, and unlocks **Save your card** — which registers the entry (`src/lib/register.ts`), stamps CARD COMPLETE with the number the API returns, draws the ticket to a 1080×1440 canvas and downloads it as a PNG. A toast confirms the save, or carries the API's error if it was rejected.

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
Company identity and document version live in one place (`src/lib/company.ts`): TechVortex Ventures Private Limited, CIN U62013WB2024PTC269470, GSTIN 19AAKCT8808L1ZJ, Grievance Officer Nilabja Datta, admin@ninesatnine.com. Documents are version 1.1, effective 21 September 2026.

### Assets
`public/img/logo.png` and `public/img/m01.jpg`–`m16.jpg` (the reel portraits).

---

## Change log

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
- [ ] **Read the legal pages end to end.** The prototype's broken tables were reconstructed by inference; confirm every row says what it should. Have a lawyer check the whole of both documents before launch.
- [ ] **Two contact addresses are in use.** The footer shows `ninesatninehelp@gmail.com`; every legal page says `admin@ninesatnine.com`. Both come from the prototype. Decide which is right.
- [ ] **Two chips collapse to one value.** The API's gender enum is `male`/`female`/`other`, so "Non-binary" and "Prefer not to say" are indistinguishable once stored. Widen the enum if that difference matters.
- [ ] **Add an OPTIONS route to the register API.** Without it the client must send `Content-Type: text/plain` to dodge the CORS preflight. Works, but it is a workaround.
- [ ] **The endpoint is called from the browser,** so it is public and unauthenticated. Consider rate limiting or a token before launch.
- [ ] **Test entries are in the register database** from wiring this up: `claude-integration-test-0001@example.com`, `claude-integration-test-0002@example.com` (rejected, 400), `cors-probe-0001@example.com`, `aanya.mactest@example.com`. Delete them before launch.
- [ ] **`backend-later/waitlist-route.ts` is now redundant** — the register API replaces it. Delete it, or keep it if you still want a server-side proxy.
- [ ] **Cookies.** The Privacy Policy describes a cookie banner and refusable analytics and preference cookies. The site sets no cookies and has no banner. Build the banner, or narrow that clause.
- [ ] **Photos.** Confirm a licence for each of the sixteen portraits.
- [ ] **City list.** 135 cities, down from 470 names. Since city is now required and must match the list, add any city you expect applicants from.
- [ ] **Version control.** All work since the initial Create Next App commit is uncommitted.
