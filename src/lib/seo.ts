/* Homepage search copy, defined once.
 *
 * The homepage is a client component (it holds the joined/confirmation state),
 * and a client component cannot export `metadata`. So the page is wrapped by a
 * server component that exports these, and the same strings are the app-wide
 * defaults in the root layout — one definition, no chance of the two drifting.
 */

export const HOME_TITLE = "Nines at Nine | Curated Speed Dating";

export const HOME_DESCRIPTION =
  "Nine curated speed dates. Selected singles. Verified profiles. Nines at Nine brings attraction first dating to a more exclusive format.";

/* The site-wide share image is src/app/opengraph-image.png, which Next attaches
 * to every route automatically. But a page that sets its own `openGraph` block
 * replaces the inherited one wholesale, image included — so those pages name it
 * explicitly with this. */
export const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 628,
  alt: "Nines at Nine — curated speed dating",
};
