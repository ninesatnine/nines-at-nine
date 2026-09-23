import type { Metadata, Viewport } from "next";
import { Josefin_Sans, Poiret_One } from "next/font/google";

import { Aurora } from "@/components/Aurora";
import { COMPANY } from "@/lib/company";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";
import { SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const poiret = Poiret_One({
  variable: "--font-poiret",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  display: "swap",
});

const origin = siteUrl();

export const metadata: Metadata = {
  // Left undefined until the production origin is configured, so relative
  // metadata URLs are never resolved against a guess. See src/lib/site.ts.
  metadataBase: origin ? new URL(origin) : undefined,
  // App-wide defaults. Every real route overrides both, and the homepage sets
  // them explicitly in src/app/page.tsx; these exist so a route added later
  // without metadata still gets brand copy rather than nothing.
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: "#290D10",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poiret.variable} ${josefin.variable}`}>
      <body>
        {/* Describes only what is verifiable from the site and company records:
            no ratings, awards, credentials or Event details we do not have. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              legalName: COMPANY.name,
              description:
                "An invitation-only curated speed-dating service. Nine dates, three minutes each, on one Friday.",
              email: COMPANY.email,
              // A different image from the favicon: this is the one a knowledge
              // panel may use. Absolute, as schema.org requires, so it is only
              // emitted once the origin is configured.
              ...(origin ? { logo: `${origin}/img/logo-square.png` } : {}),
              address: {
                "@type": "PostalAddress",
                streetAddress: COMPANY.address,
                addressCountry: "IN",
              },
              ...(origin ? { url: origin } : {}),
            }),
          }}
        />
        <Aurora />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
