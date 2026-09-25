import { act, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const PIXEL = "2548566402312132";

/** Every fbq call so far, whether queued (library not loaded) or passed through. */
let calls: unknown[][];

async function load() {
  // installPixel's once-per-document flag lives in the module, so each test
  // gets a fresh copy, as a fresh page load would.
  vi.resetModules();
  const { MetaPixel } = await import("@/components/MetaPixel");
  return MetaPixel;
}

/** Stand in for fbevents.js arriving: from now on calls pass straight through. */
function libraryLoaded() {
  const fbq = window.fbq!;
  calls.push(...fbq.queue);
  fbq.queue.length = 0;
  fbq.callMethod = (...args: unknown[]) => calls.push(args);
}

const pageViews = () => calls.filter((c) => c[0] === "track" && c[1] === "PageView");
const everything = () => [...calls, ...(window.fbq?.queue ?? [])];

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", PIXEL);
  vi.stubEnv("NEXT_PUBLIC_META_PIXEL_TEST_HOSTS", "localhost"); // jsdom's host
  window.history.replaceState(null, "", "/");
  calls = [];
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  delete window.fbq;
  delete window._fbq;
  delete window.__consent;
  // next/script appends to <head> and leaves it there, as a real page would.
  document.querySelectorAll("[data-nscript]").forEach((el) => el.remove());
});

describe("MetaPixel", () => {
  it("initialises once, with automatic tracking off, and sends one PageView under Strict Mode", async () => {
    const MetaPixel = await load();
    render(
      <StrictMode>
        <MetaPixel />
      </StrictMode>,
    );
    act(() => vi.runAllTimers());
    libraryLoaded();

    expect(window.fbq!.disablePushState).toBe(true);
    expect(window.fbq!.allowDuplicatePageViews).toBe(true);
    const init = calls.findIndex((c) => c[0] === "init");
    const autoConfig = calls.findIndex((c) => c[0] === "set" && c[1] === "autoConfig");
    expect(calls[autoConfig]).toEqual(["set", "autoConfig", false, PIXEL]);
    expect(autoConfig).toBeLessThan(init);
    expect(calls.filter((c) => c[0] === "init")).toEqual([["init", PIXEL]]);
    // No advanced matching, no user data: just the event name.
    expect(pageViews()).toEqual([["track", "PageView"]]);
  });

  it("does not send again on re-render", async () => {
    const MetaPixel = await load();
    const view = render(<MetaPixel />);
    act(() => vi.runAllTimers());
    view.rerender(<MetaPixel />);
    view.rerender(<MetaPixel />);
    act(() => vi.runAllTimers());
    libraryLoaded();
    expect(pageViews()).toHaveLength(1);
  });

  it("does not treat a hash change as a new visit", async () => {
    const MetaPixel = await load();
    render(<MetaPixel />);
    act(() => vi.runAllTimers());
    act(() => {
      window.location.hash = "#waitlist";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      vi.runAllTimers();
    });
    libraryLoaded();
    expect(pageViews()).toHaveLength(1);
  });

  it("sends one new PageView on returning to the homepage, and drops anything queued while away", async () => {
    const MetaPixel = await load();
    const first = render(<MetaPixel />);
    act(() => vi.runAllTimers());
    libraryLoaded();

    // Off to /blog: the homepage unmounts and the pixel is suspended.
    first.unmount();
    window.history.pushState(null, "", "/blog");
    expect(calls.at(-1)).toEqual(["consent", "revoke"]);
    // What Meta would queue while revoked, e.g. a back-forward-cache PageView.
    window.fbq!.queue.push(["trackCustom", "PageView"]);

    // Back to "/".
    window.history.pushState(null, "", "/");
    render(<MetaPixel />);
    act(() => vi.runAllTimers());

    expect(window.fbq!.queue).toEqual([]);
    expect(calls.filter((c) => c[0] === "init")).toHaveLength(1);
    expect(pageViews()).toHaveLength(2);
    expect(calls.slice(-2)).toEqual([
      ["consent", "grant"],
      ["track", "PageView"],
    ]);
  });

  it("sends nothing if the visitor has left the homepage before the event goes out", async () => {
    const MetaPixel = await load();
    render(<MetaPixel />);
    window.history.pushState(null, "", "/blog");
    act(() => vi.runAllTimers());
    expect(everything().filter((c) => c[1] === "PageView")).toEqual([]);
  });

  it("stays off when consent is refused, and revokes if it was withdrawn mid-visit", async () => {
    window.__consent = false;
    let MetaPixel = await load();
    render(<MetaPixel />);
    act(() => vi.runAllTimers());
    expect(window.fbq).toBeUndefined();
    expect(document.getElementById("meta-pixel-fbevents")).toBeNull();

    // Already loaded earlier in the document, then withdrawn.
    delete window.__consent;
    MetaPixel = await load();
    const view = render(<MetaPixel />);
    act(() => vi.runAllTimers());
    libraryLoaded();
    view.unmount();
    window.__consent = false;
    render(<MetaPixel />);
    act(() => vi.runAllTimers());
    expect(pageViews()).toHaveLength(1);
    expect(calls.at(-1)).toEqual(["consent", "revoke"]);
  });

  it("stays off on hosts that are not production or listed for testing", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_TEST_HOSTS", "");
    const MetaPixel = await load();
    render(<MetaPixel />);
    act(() => vi.runAllTimers());
    expect(window.fbq).toBeUndefined();
  });

  it("stays off without a pixel id", async () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    const MetaPixel = await load();
    render(<MetaPixel />);
    act(() => vi.runAllTimers());
    expect(window.fbq).toBeUndefined();
  });
});
