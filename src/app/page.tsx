import type { Metadata } from "next";

import { Landing } from "@/components/Landing";
import { MetaPixel } from "@/components/MetaPixel";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";
import { absolute } from "@/lib/site";

/* The landing page itself is a client component — it swaps to the confirmation
 * view once someone joins — and a client component cannot export metadata.
 * This server wrapper carries it, so the homepage owns its own title and
 * description rather than inheriting the layout's defaults. */

const canonical = absolute("/");

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: canonical ? { canonical } : undefined,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
    siteName: "Nines at Nine",
    url: canonical ?? undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Page() {
  return (
    <>
      <Landing />
      {/* Homepage only, by design — see META_PIXEL_SETUP.md. */}
      <MetaPixel />
    </>
  );
}
