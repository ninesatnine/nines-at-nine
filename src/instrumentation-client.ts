/* Starts PostHog in the browser, before the app becomes interactive.
 *
 * Next runs this file once on the client (see the instrumentation-client file
 * convention). The `2026-05-30` defaults turn on page views that follow App
 * Router navigation, page leaves, sessions and click autocapture. Session
 * replay and heatmaps are on as well.
 *
 * Privacy, on top of the rules in src/lib/analytics.ts:
 *   - The waitlist form and the confirmation view carry `ph-no-capture`. The
 *     recorder blocks those elements outright, so a replay shows an empty box
 *     where the form and the card (name, gender, age) would be. Autocapture
 *     never records their text either (a chosen city, a gender chip).
 *   - Every input is masked in replays as a second line of defence.
 *   - The saved card is drawn on a canvas that is never attached to the page,
 *     so canvas recording cannot see it.
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
    enable_heatmaps: true,
    session_recording: {
      maskAllInputs: true,
      blockClass: "ph-no-capture",
    },
    // Honour a consent banner that has already said no.
    opt_out_capturing_by_default: (window as { __consent?: boolean }).__consent === false,
  });
} else if (process.env.NODE_ENV === "development") {
  console.info("[analytics] NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not set; PostHog is off.");
}
