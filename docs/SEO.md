# SEO, AEO and the blog — audit, decisions and handoff

Written 23 September 2026, against the repository at that date.

**A note on what this document does not promise.** No arrangement of metadata,
schema, article count or internal linking can guarantee a ranking position, and
there is no universal "top five" — results vary by country, language, device,
intent, competitor and time. AI answer engines have no fixed ranking either.
Everything below is work that makes good ranking *possible* and measurable.
Treat the owner's top-five ambition for "dating" and "relationship" as a
direction to measure against, not a deliverable anyone can commit to.

---

## 1. Baseline audit

What existed before this work, with file evidence.

| Area | Before | Evidence | Now |
| --- | --- | --- | --- |
| Indexable content | 4 pages, all static | `src/app/{page,terms,privacy,house-rules}` | 11 routes incl. 6 articles |
| `robots.txt` | **absent** | no `robots.ts`; not in `out/` | `src/app/robots.ts` |
| `sitemap.xml` | **absent** | no `sitemap.ts` | `src/app/sitemap.ts` |
| Canonical URLs | **absent** | no `alternates` in `layout.tsx` | set when origin is configured |
| `metadataBase` | **absent** | `layout.tsx` metadata block | set when origin is configured |
| Structured data | **none** | no `ld+json` anywhere | Organization, BlogPosting, BreadcrumbList |
| Per-page metadata | title/description on each page | route files | unchanged; blog routes added |
| Analytics | **none** | no vendor script, no events | PostHog, via `src/lib/analytics.ts` (see `POSTHOG_SETUP.md`) |
| Editorial content | none | — | 6 articles, ~7,600 words |

**Not run, and not claimable:** Lighthouse scores, Search Console data, live
index status, real SERP positions, crawler-access checks against a deployed
origin. None of these can be produced from a local repository. See §7.

### Search-intent inspection

Browsing was available and used to verify the statistics in §5. It was **not**
used to produce keyword volumes, difficulty scores or ranking estimates, and
none appear in this document — no keyword tool or Search Console export was
available, so any such number would have been invented.

What can be said without data, from the shape of the terms themselves:

- **"dating"** is dominated by app brands and app-download intent. A waitlist
  page for an unlaunched in-person service is not a credible competitor for it,
  and should not be optimised toward it.
- **"relationship"** is ambiguous — it returns dictionary, psychology, family
  and database-schema results depending on context. Targeting it directly is a
  poor use of a page.
- The realistic openings are the **specific, lower-competition questions** the
  six articles address, where a careful answer can outrank a thin one.

These are hypotheses to test against real Search Console queries after launch
(§6), not findings.

---

## 2. Query → page map

One intent per page. Nothing competes with itself.

| Reader's question | Page | Why this page |
| --- | --- | --- |
| What is dating like now / what changed | `/blog/modern-dating-culture` | The broad dating-culture guide; the hub other articles link back to |
| What does a healthy / grown-up relationship look like | `/blog/emotionally-mature-relationships` | The relationship guide; behaviour, not status |
| How did dating used to work / generational differences | `/blog/dating-then-and-now` | Comparison intent, with India-specific evidence |
| I'm exhausted by dating apps | `/blog/dating-app-fatigue` | Problem-solving intent, highest commercial adjacency |
| Is this attraction or are we actually suited | `/blog/chemistry-vs-compatibility` | A specific decision the reader is trying to make |
| What happens at a speed dating event | `/blog/how-speed-dating-works` | Category education → the product's own format |
| Who is Nines at Nine / how do I join | `/` | Brand and conversion. Not a place to answer relationship questions |
| Can I trust them with my data | `/privacy`, `/terms`, `/house-rules` | Already existed |

**Deliberately not built:** city landing pages (no city is announced — see §7),
category archives (six articles do not need them; thin archives targeting broad
words are exactly what Google's spam policies describe), and an FAQ-schema
block (no longer generally eligible for rich results, and adding it here would
be cargo cult).

---

## 3. What was built

- `content/blog/*.md` — six articles. Frontmatter, GFM, plain Markdown.
- `src/lib/blog.ts` — reads the files at build time, renders Markdown, computes
  reading time from real text, resolves related reads.
- `src/lib/site.ts` — the production origin, as configuration.
- `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` — index and article.
- `src/app/sitemap.ts`, `src/app/robots.ts`.
- `src/lib/analytics.ts`, `src/components/BlogAnalytics.tsx` — the event seam, now sending to PostHog.
- Footer "READ → Blog" link, a real `<a>` via `next/link`.

**Content is fully server-rendered.** Verified in `out/`: an article's prose,
headings, heading ids and tables are all present in the static HTML with no
JavaScript required.

---

## 4. The origin is configuration, on purpose

Canonical tags, Open Graph URLs and the sitemap all need an absolute origin,
and the production domain is not yet known.

Rather than ship `localhost` or an invented domain — both actively mislead
crawlers — `siteUrl()` returns `null` when `NEXT_PUBLIC_SITE_URL` is unset, and
every caller omits the tag instead of guessing. `localhost` is rejected even if
someone sets it explicitly.

**Consequence: until `NEXT_PUBLIC_SITE_URL` is set, `sitemap.xml` is empty and
no canonical tags are emitted.** The build warns. Verified both ways.

Set it in the host's build settings alongside `NEXT_PUBLIC_REGISTER_URL`.

---

## 5. Claim and source log

Every empirical claim in the six articles, its source, and its scope. Sources
were opened and read, not recalled.

| Claim | Where used | Source | Scope and limits |
| --- | --- | --- | --- |
| 30% of U.S. adults have ever used a dating site or app; 9% in the past year; 53% of under-30s vs 13% of 65+ | modern-dating-culture | [Pew, Feb 2023](https://www.pewresearch.org/short-reads/2023/02/02/key-findings-about-online-dating-in-the-u-s/) | **6,034 U.S. adults, 5–17 July 2022.** US only. "Ever used" includes one-time users. Labelled as US in the article. |
| 54% of women felt overwhelmed by message volume; 64% of men felt insecure about the lack | modern-dating-culture, dating-app-fatigue | same | Same survey. Describes **platform users**, self-reported. Not evidence about everyone who dates. |
| 53% positive vs 46% negative personal experiences | modern-dating-culture | same | Same survey. Used to refute "dating is objectively worse", not to claim it is good. |
| 64% say it is very important to stop women marrying into other castes; 62% for men; 67% of Hindus on interreligious marriage | dating-then-and-now | [Pew, June 2021](https://www.pewresearch.org/religion/2021/06/29/religion-in-india-tolerance-and-segregation/) | **29,999 Indian adults, 17 Nov 2019 – 23 Mar 2020**, 17 languages. Attitudes at that date; not a prediction of any family's behaviour. |
| 40% of Indians prefer husband-provides/wife-homemaker vs 23% global median; college-educated less conservative | dating-then-and-now | [Pew, March 2022](https://www.pewresearch.org/religion/2022/03/02/how-indians-view-gender-roles-in-families-and-society/) | Same fieldwork. Attitudes, not behaviour. |

**Everything else in the articles is editorial reasoning or explicitly labelled
hypothetical example.** In particular:

- The expectation/misunderstanding table (modern-dating-culture) is labelled
  *editorial guidance, not a validated psychological framework*.
- The seven-day exercise (dating-app-fatigue) is labelled *an editorial
  exercise* — not therapy, not clinically validated.
- Both couples in emotionally-mature-relationships and the family conversation
  in dating-then-and-now are labelled hypothetical.
- The preparation checklist (how-speed-dating-works) is labelled editorial.

**No interviews, surveys, experiments or participant experiences are claimed,
because none were conducted.** No expert, reviewer, degree or endorsement is
named. The byline is organisational — *Nines at Nine* — because the company
takes editorial responsibility; no individual author was supplied.

### Research gaps worth filling
- No India-specific data on dating-app usage, app fatigue or speed dating was
  located from a source meeting the standard above. The articles therefore make
  no Indian quantitative claims.
- The Pew India fieldwork is from 2019–20 and is now several years old.
- Speed-dating format norms in §"The basic format" are described as varying by
  organiser precisely because no authoritative source standardises them.

---

## 6. Measurement

Events, defined in `src/lib/analytics.ts`:

| Event | Fires when | Properties |
| --- | --- | --- |
| `blog_opened` | An article renders, once per article | `article_slug`, `article_topic` |
| `waitlist_button_clicked` | A "Join the waitlist" button or link is pressed | `location` (`hero`, `navbar`, `dock`, `blog`); `article_slug` for `blog` |
| `waitlist_form_started` | First focus on the waitlist form | none |
| `waitlist_completed` | **After the API confirms** the entry | `source: "website"` |

Rules the code enforces: **no personal data ever** — no name, email or
application answer, only page-level fields; nothing is sent while
`window.__consent === false`; `blog_opened` is ref-guarded so React's development
double-invoke cannot double-count; `waitlist_completed` fires after the API
responds, never on the button press.

The vendor is **PostHog** (since 25 September 2026), which also records page
views, sessions and clicks on its own. Setup, privacy measures and how to
verify are in `POSTHOG_SETUP.md`. It stays off until
`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is set.

### What to report, kept separate

Conflating these produces meaningless averages:

1. **Branded** ("nines at nine") vs **non-branded** queries — branded traffic
   measures awareness, not SEO.
2. **Broad** ("dating", "relationship") vs **specific article** queries.
3. **Country and device**, separately. An India average and a global average
   are different numbers.
4. **Page level**, not site level.
5. Impressions, clicks, CTR, average position — noting that Search Console's
   average position is an **aggregate across queries and locations, not a rank**.
6. AI citations and referrals, logged as **reproducible query samples with the
   date and the engine**. These vary by session and cannot be claimed to
   represent all users of that engine.

A top-five observation in any tracker is a scoped measurement of one query in
one location on one day. Record it as that.

---

## 7. Blockers needing owner access

1. **Production domain.** Until `NEXT_PUBLIC_SITE_URL` is set there is no
   sitemap and no canonical tags. Highest priority.
2. **Search Console and Bing Webmaster Tools** — verify the domain, submit the
   sitemap. Cannot be done from the repository.
3. **Analytics token** — PostHog is integrated; set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` on the host (`POSTHOG_SETUP.md` §6).
4. **Cities and dates.** Still unannounced, so every article is
   geography-neutral and no city pages exist. This is also an open item in
   `PROGRESS.md` regarding the Privacy Policy's cookie banner.
5. **A named author**, if the organisational byline is not wanted.
6. **Crawler access on the deployed origin** — a CDN or WAF can block
   legitimate crawlers, and that can only be checked live. Note that
   OpenAI's `OAI-SearchBot` (search) is separate from `GPTBot` (training):
   blocking training does **not** require blocking search. Neither is blocked
   in `robots.ts` today.
7. **Consent banner**, if analytics require one under DPDP. PostHog sets a
   first-party cookie; the helpers and `posthog.init` already respect
   `window.__consent`.

---

## 8. Editing, drafting and publishing

**To edit an article:** open `content/blog/<slug>.md`. Markdown body, YAML
frontmatter at the top. Nothing else to touch.

**To add one:** create `content/blog/<new-slug>.md` with the same frontmatter
fields. The index, sitemap and static params pick it up automatically. Add it
to two or three other articles' `related` lists, and give it its own.

**To draft:** set `status: "draft"`. Drafts appear in `npm run dev` with a
banner, and are excluded from the production index, the sitemap and static
generation; the article route also sets `noindex` on them.

**To publish:** set `status: "published"` and check `published` is the real
date.

**Dates, honestly:** `published` is the first publication date — do not change
it. Set `updated` only when the body changes **substantively**; a typo fix is
not a modification date. Nothing updates these automatically, which is
deliberate: a build must not tell crawlers every article changed today.

`npm test` checks that every article parses, that `related` points only at
articles that exist, that references are https, and that dates are ISO.

---

## 9. 30 / 60 / 90 days

Actions and review checkpoints. No ranking targets, because no one can commit
to those.

**Days 1–30 — ship and establish a baseline**
- Set `NEXT_PUBLIC_SITE_URL`; confirm sitemap and canonicals in production.
- Verify in Search Console and Bing Webmaster Tools; submit the sitemap.
- Set the PostHog token; confirm all four custom events arrive.
- Check live crawler access (no CDN/WAF block); check the deployed pages return
  200 and are indexable.
- Read all six articles end to end against §5 before launch.
- **Checkpoint at day 30:** record which pages are indexed. Expect little
  traffic; a new site on new URLs takes longer than this.

**Days 31–60 — refine using real queries**
- Read actual Search Console queries. Replace §1's hypotheses with data.
- Where a page ranks for a query it answers badly, improve that page rather
  than adding another one.
- Where two pages compete for one query, merge or re-point them.
- Log AI-answer samples: fixed query list, monthly, with date and engine.
- **Checkpoint at day 60:** branded vs non-branded split; which articles earn
  impressions; where `blog_waitlist_click` actually comes from.

**Days 61–90 — extend coverage and genuine distribution**
- Add articles only where a real query shows an unanswered question.
- Publish city content **only once cities are announced**.
- Distribution: genuine collaborations, founder commentary, relevant
  communities and publications. Nothing here can be executed from the
  repository and nothing should be sent without the owner's authorisation.
- **Checkpoint at day 90:** compare to the day-30 baseline on impressions,
  non-branded clicks and waitlist conversions — per page, per country.

### Discovery, honestly
External recognition cannot be manufactured by editing this repository. What is
legitimate: offering a genuinely useful article to a publication whose audience
it serves; founder commentary on dating culture where the founder has something
to say; collaborations with venues, community organisers or newsletters once
events are real. What is not: bought links, invented personas, fake reviews,
mass city pages, or "best of" claims with no independent evidence. No outreach
has been sent and none should be without authorisation.
