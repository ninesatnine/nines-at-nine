# Nines at Nine — Waitlist site

A mobile-first waitlist site with three legal pages. Built with Next.js 16 (App Router) and TypeScript.

## Run locally

```bash
npm install
npm run dev -- -p 3107   # http://localhost:3107
npm run build            # static export to out/
npm run lint
npm test
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page — hero, portrait reel, the experience, how it works, questions, waitlist form. On a successful sign-up the same route swaps to the confirmation view with the waitlist card. |
| `/terms` | Terms of Use, 26 clauses, with a contents list. |
| `/privacy` | Privacy Policy, 18 clauses, under India's DPDP Act, 2023. |
| `/house-rules` | House Rules — the four short rules, four stages of the evening, and what happens when a rule is broken. |

All four are prerendered as static HTML.

## The waitlist form

Every field is required: first name, email, a city from the list, and the 18+/updates checkbox.

- Validation lives in `src/lib/waitlist.ts`, shared with the parked server route.
- City is a combobox over `src/lib/cities.ts`. It matches older names too — typing "Bangalore" finds Bengaluru, "Bombay" finds Mumbai — and free text that is not a city on the list is rejected.
- A hidden honeypot field (`#website`) silently drops bot submissions.

**Page one sends nothing.** The register API needs gender and age too, so the three fields are held in the browser and handed to the card. Submitting only validates and moves on.

## The confirmation card, and the register API

After joining, the card sits behind an opaque cover reading *"Complete the rest of the details to reveal your card."* It takes two presses of one button to get past it:

| Press | Button reads | What happens |
| --- | --- | --- |
| 1 | **Submit** | `POST`s the whole entry to the register API (`src/lib/register.ts`). On success, `count` from the response becomes the place in line, the cover lifts, and the button becomes the save. |
| 2 | **Save your card** | Draws the revealed ticket to a canvas at 1080×1440 and downloads it as a PNG named after the number. |

Submit is inert until gender and age are filled in; pressing it early nudges the empty fields instead. If the API rejects the entry, its message is shown in a toast, the card stays covered, and nothing is downloaded.

```http
POST $NEXT_PUBLIC_REGISTER_URL
Content-Type: application/json

{ "name": "Aanya", "email": "aanya@example.com", "gender": "female", "age": "27", "city": "Bengaluru" }
```

| Case | Response |
| --- | --- |
| New email | `201 {"status":"created","count":255,"createdAt":"..."}` |
| Same email again | `200 {"status":"updated","count":255,...}` — same count, so repeat saves are safe |
| Any field missing | `400 {"error":"name, email, gender, age and city are required"}` |
| Gender outside the enum | `400 {"error":"gender must be one of: male, female, other"}` |

Both 201 and 200 count as success. `gender` must be `male`, `female` or `other`, so the four chips map onto three values — **"Non-binary" and "Prefer not to say" both send `other`**.

**The endpoint lives in the environment, not in the source.** Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_REGISTER_URL`; for a deploy, set it in the host's build settings. Without it the build fails, rather than shipping a site whose form silently does nothing.

`NEXT_PUBLIC_*` is read at build time and inlined into the client bundle, so the URL ships to the browser in plain sight. That is fine for a location — it is a public endpoint the page has to call — but it means **no key or token may ever go in a `NEXT_PUBLIC_*` variable**. The site is a static export, so there is no server to keep one on.

### Why the request says `Content-Type: text/plain`

The body is JSON, but the header is not, on purpose. The API answers the POST with `access-control-allow-origin: *`, but it has **no OPTIONS route** — a preflight returns 404. `application/json` is not a CORS-safelisted content type, so it forces a preflight, which fails, and the browser blocks the POST before it is ever sent. (curl never sees this, because curl does not enforce CORS.) `text/plain` is safelisted, so the request goes straight through, and the API parses the body regardless of the header.

**Fix it properly by adding an OPTIONS handler to the API**, returning `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods: POST` and `Access-Control-Allow-Headers: content-type`. Then change the header back to `application/json` in `src/lib/register.ts`.

## Deploying to Netlify (static, drag-and-drop)

The site is a static export (`output: "export"` in `next.config.ts`), with no Node server.

```bash
npm run build:zip    # builds to out/ and zips it to nines-at-nine-site.zip
```

Go to https://app.netlify.com/drop and drag in `nines-at-nine-site.zip` (or the `out/` folder).

## The parked webhook route (superseded)

Sign-ups now go straight to the register API above, so nothing here is wired up. This section describes the older server-side route, kept in case you want a proxy in front of the API rather than calling it from the browser.

The route is parked at `backend-later/waitlist-route.ts` and its storage adapter at `src/lib/waitlist-store.ts`. It validates on the server with the same rules as the form, normalizes the email, checks the honeypot, applies a per-IP rate limit, then hands the entry to the adapter — a webhook to a URL you control. Restoring it needs a Netlify Function or a Node host; a static export cannot serve it.

| Variable | Required | Purpose |
| --- | --- | --- |
| `WAITLIST_WEBHOOK_URL` | yes | Endpoint that stores the entry. |
| `WAITLIST_WEBHOOK_SECRET` | no | Sent as `Authorization: Bearer <secret>`. |

Copy `.env.example` to `.env.local` and fill it in. Both are read on the server only.

### Webhook contract

```http
POST $WAITLIST_WEBHOOK_URL
Content-Type: application/json
Authorization: Bearer $WAITLIST_WEBHOOK_SECRET

{ "firstName": "Aanya", "email": "aanya@example.com", "city": "Bengaluru", "consent": true, "submittedAt": "2026-09-22T10:00:00.000Z" }
```

| Your response | Meaning |
| --- | --- |
| `200` / `201` | Stored. |
| `409` | That email is already on the list. |
| Anything else, or no reply within 8 seconds | Error; the user's details stay in the form so they can retry. |

Every field is non-empty by the time it reaches you. The app does not send a confirmation email; send it from your webhook if you want one.

To use a database directly instead, implement the `WaitlistStore` interface and return it from `getWaitlistStore()`.

## Project map

| Path | What it holds |
| --- | --- |
| `src/app/page.tsx` | The landing page, and the swap to the confirmation view |
| `src/app/terms`, `src/app/privacy`, `src/app/house-rules` | The three legal pages |
| `src/app/globals.css` | The whole design system: colours, type, aurora background, and every component's styles |
| `src/components/Doc.tsx` | Shared legal-page pieces: head, contents, clause, callout, table |
| `src/components/ConfirmationView.tsx` | The waitlist card and its PNG export |
| `src/components/WaitlistForm.tsx`, `CityCombobox.tsx` | The form and the city picker |
| `src/components/Header.tsx`, `Footer.tsx`, `Dock.tsx`, `Aurora.tsx`, `Reel.tsx`, `Faq.tsx`, `Ornaments.tsx`, `Toast.tsx` | Site chrome and page furniture |
| `src/lib/register.ts` | The register API client, and the gender mapping |
| `src/lib/cities.ts` | The 135 cities a room can open in, with their older names |
| `src/lib/company.ts` | Company identity and document version, used by the footer and every legal page |
| `public/img/` | The logo and the sixteen reel portraits |

## Design tokens

Colours: oxblood `#290D10`, deep `#1D080B`, burgundy `#571B23`, gold `#F4C469`, antique `#B98A45`, ivory `#F6EBDC`. Fonts: Poiret One (display) and Josefin Sans (body), loaded through `next/font`.

## Portraits

The reel uses `public/img/m01.jpg`–`m16.jpg`, listed in `PHOTOS` in `src/components/Reel.tsx`. They are shown in grayscale and drift right to left on a 150-second loop; the loop pauses for visitors with "reduce motion" turned on.

**Before launch:** confirm you hold a licence for each photograph.

## Tests

`npm test` runs Vitest + React Testing Library (45 tests) and writes a JUnit report to `test-results/junit.xml`. Coverage: validation rules, the city list and its alias matching, the combobox's keyboard and mouse behaviour, the form's required-field and honeypot handling, the register client (payload mapping, 201/200, error passthrough, network failure), and the reveal flow end to end (card covered at first, nothing sent on page one, Submit posts once, number taken from the response, cover lifts and the button turns into the save, second press downloads a file named after the number, and a rejected submit leaves the card covered with nothing downloaded).
