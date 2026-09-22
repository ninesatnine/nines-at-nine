"use client";

import { useEffect, useRef, useState } from "react";

type DockState = "hidden" | "show" | "merged";

/**
 * The join bar phones get once the hero button has scrolled away. When the real
 * form button comes into view the bar slides up into it and hands over, so there
 * are never two join buttons on screen at once.
 */
export function Dock({ active }: { active: boolean }) {
  const [state, setState] = useState<DockState>("hidden");
  const previous = useRef<DockState>("hidden");

  useEffect(() => {
    let queued = false;

    const check = () => {
      queued = false;
      if (!active) return setState("hidden");
      const hero = document.getElementById("heroCta")?.getBoundingClientRect();
      const form = document.getElementById("formCta")?.getBoundingClientRect();
      if (!hero || !form) return setState("hidden");
      if (hero.bottom > 0) setState("hidden");
      else if (form.top < window.innerHeight - 20) setState("merged");
      else setState("show");
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", check);
    };
  }, [active]);

  useEffect(() => {
    const was = previous.current;
    previous.current = state;
    // Only pulse the form button when the bar actually flew into it.
    if (state !== "merged" || was !== "show") return;
    const cta = document.getElementById("formCta");
    if (!cta) return;
    cta.classList.remove("arrive");
    void cta.offsetWidth; // restart the animation
    cta.classList.add("arrive");
  }, [state]);

  const className =
    state === "show" ? "dock show" : state === "merged" ? "dock merging" : "dock";

  return (
    <div className={className} aria-hidden="true">
      <span className="dock-line">Nine dates. One Friday.</span>
      <a className="btn dock-btn" href="#waitlist" tabIndex={-1}>
        Join the waitlist
      </a>
    </div>
  );
}
