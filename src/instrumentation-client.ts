/* Starts PostHog in the browser, before the app becomes interactive.
 *
 * Next runs this file once on the client (see the instrumentation-client file
 * convention). The `2026-05-30` defaults turn on page views that follow App
 * Router navigation, page leaves, sessions and click autocapture.
 *
 * Privacy, on top of the rules in src/lib/analytics.ts:
 *   - Session replay is off. The confirmation view shows the visitor's name,
 *     gender and age on the card, and a recording would carry them.
 *   - The waitlist form and the confirmation view carry `ph-no-capture`, so
 *     autocapture never records their text (a chosen city, a gender chip).
 *   - No one is ever identified, so every visitor stays an anonymous id.
 *
 * Without a project token nothing is loaded and nothing is sent — local
 * development and tests stay silent.
 */

import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (token) {
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2026-05-30",
    disable_session_recording: true,
    // Honour a consent banner that has already said no.
    opt_out_capturing_by_default: (window as { __consent?: boolean }).__consent === false,
  });
} else if (process.env.NODE_ENV === "development") {
  console.info("[analytics] NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not set; PostHog is off.");
}
