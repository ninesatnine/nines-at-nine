import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const posthog = vi.hoisted(() => ({ __loaded: true, capture: vi.fn() }));
vi.mock("posthog-js", () => ({ default: posthog }));

import {
  trackBlogOpened,
  trackWaitlistClick,
  trackWaitlistCompleted,
  trackWaitlistStarted,
} from "@/lib/analytics";

type Consented = { __consent?: boolean };

beforeEach(() => {
  posthog.__loaded = true;
  posthog.capture.mockClear();
});

afterEach(() => {
  delete (window as Consented).__consent;
});

describe("analytics", () => {
  it("sends each event with only its own properties", () => {
    trackWaitlistClick("hero");
    trackWaitlistClick("blog", "dating-app-fatigue");
    trackWaitlistStarted();
    trackWaitlistCompleted();
    trackBlogOpened("chemistry-vs-compatibility", "Relationships");

    expect(posthog.capture.mock.calls).toEqual([
      ["waitlist_button_clicked", { location: "hero" }],
      ["waitlist_button_clicked", { location: "blog", article_slug: "dating-app-fatigue" }],
      ["waitlist_form_started", {}],
      ["waitlist_completed", { source: "website" }],
      ["blog_opened", { article_slug: "chemistry-vs-compatibility", article_topic: "Relationships" }],
    ]);
  });

  it("does nothing when PostHog was never loaded (no token)", () => {
    posthog.__loaded = false;
    trackWaitlistCompleted();
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("does nothing once consent is refused", () => {
    (window as Consented).__consent = false;
    trackWaitlistClick("navbar");
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
