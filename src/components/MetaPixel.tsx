"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

import {
  FBEVENTS_URL,
  consentRefused,
  installPixel,
  isHomePath,
  pixelConfiguredHere,
  suspendPixel,
  trackHomePageView,
} from "@/lib/meta-pixel";

const noSubscribe = () => () => {};
const enabledOnClient = () => pixelConfiguredHere() && !consentRefused();
// The server cannot see the host or the consent flag, so it renders nothing and
// the client decides after hydration, with no mismatch.
const disabledOnServer = () => false;

/**
 * Meta Pixel for the homepage. Mounted only by src/app/page.tsx, so no other
 * route ever renders it.
 *
 * One PageView per homepage visit: the first load, and each client-side
 * navigation back to "/", which mounts this component again. Re-renders, hash
 * changes and the switch to the confirmation view do not remount it, so they
 * send nothing.
 */
export function MetaPixel() {
  const enabled = useSyncExternalStore(noSubscribe, enabledOnClient, disabledOnServer);

  useEffect(() => {
    if (!pixelConfiguredHere()) return;
    if (consentRefused()) {
      // Withdrawn after the pixel had already loaded in this document.
      window.fbq?.("consent", "revoke");
      return;
    }

    installPixel();

    // Deferred a tick and cancelled by the cleanup, so Strict Mode's
    // mount → unmount → mount leaves exactly one PageView, not two. The route is
    // checked again at send time in case the visitor has already moved on.
    const timer = window.setTimeout(() => {
      if (isHomePath(window.location.pathname)) trackHomePageView();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      suspendPixel();
    };
  }, []);

  // A stable id: next/script loads it once per document, however many times
  // the visitor returns to the homepage. A blocked or failed load leaves the
  // calls waiting in the stub's queue and the page untouched.
  return enabled ? <Script id="meta-pixel-fbevents" src={FBEVENTS_URL} strategy="afterInteractive" /> : null;
}
