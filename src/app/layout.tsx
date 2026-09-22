import type { Metadata, Viewport } from "next";
import { Josefin_Sans, Poiret_One } from "next/font/google";

import { Aurora } from "@/components/Aurora";
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

export const metadata: Metadata = {
  title: "Nines at Nine — Join the waitlist",
  description:
    "Nine dates. One Friday. Three minutes each. Nines at Nine is an invitation-only speed dating service. Join the waitlist to hear when applications open.",
};

export const viewport: Viewport = {
  themeColor: "#290D10",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poiret.variable} ${josefin.variable}`}>
      <body>
        <Aurora />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
