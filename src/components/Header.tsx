"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trackWaitlistClick } from "@/lib/analytics";

const LINKS = [
  { href: "/#experience", label: "The experience" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#questions", label: "Questions" },
];

const BARS = "M4 8h16M4 12h16M8 16h12";
const CROSS = "M6 6l12 12M18 6L6 18";

/** Sticky header. `hideNav` blanks the nav on the confirmation view, where
 *  there is nothing left to navigate to. */
export function Header({ hideNav = false }: { hideNav?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  // The confirmation view has nowhere to navigate to, so the menu cannot be open there.
  const open = menuOpen && !hideNav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuBtn.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const hidden = hideNav ? ({ visibility: "hidden" } as const) : undefined;

  return (
    <header className={`site-head${scrolled ? " scrolled" : ""}`}>
      <div className="wrap head-row">
        <Link className="wordmark" href="/" aria-label="Nines at Nine, home">
          <span>NINES AT NINE</span>
        </Link>
        <nav className="nav" aria-label="Main" style={hidden}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link className="btn" href="/#waitlist" onClick={() => trackWaitlistClick("navbar")}>
            Join the waitlist
          </Link>
        </nav>
        <button
          ref={menuBtn}
          className="menu-btn"
          style={hidden}
          aria-expanded={open}
          aria-controls="mobileNav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={open ? CROSS : BARS} />
          </svg>
        </button>
      </div>
      <nav
        className="mobile-nav"
        id="mobileNav"
        aria-label="Mobile"
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "A") setOpen(false);
        }}
      >
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
        <Link href="/#waitlist" onClick={() => trackWaitlistClick("navbar")}>
          Join the waitlist
        </Link>
      </nav>
    </header>
  );
}
