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
