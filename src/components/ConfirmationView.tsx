"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/Toast";
import type { Joined } from "@/components/WaitlistForm";
import { RegisterError, register } from "@/lib/register";

const GENDERS = ["Man", "Woman", "Non-binary", "Prefer not to say"];

function formatToken(n: number | null) {
  return n === null ? "Nº \u2014\u2014" : `Nº ${n.toLocaleString("en-IN")}`;
}

export function ConfirmationView({ joined, onBack }: { joined: Joined; onBack: () => void }) {
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [ageText, setAgeText] = useState("");
  const [ageError, setAgeError] = useState("");
  const [nudge, setNudge] = useState({ gender: false, age: false });
  const [busy, setBusy] = useState(false);
  // The place in line comes back from the API when the entry is registered.
  const [count, setCount] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstChip = useRef<HTMLButtonElement>(null);
  const ageInput = useRef<HTMLInputElement>(null);
  const ticket = useRef<HTMLDivElement>(null);
  const broughtIntoView = useRef(false);
  const { toast, node: toastNode } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, []);

  // On the stacked layout the card sits below the details, so the reveal would
  // otherwise happen off screen. Bring it into view once, on the first submit —
  // not again when the card is saved.
  useEffect(() => {
    if (count === null || broughtIntoView.current) return;
    broughtIntoView.current = true;
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ticket.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
  }, [count]);

  const missing = (gender ? 0 : 1) + (age ? 0 : 1);
  const complete = missing === 0;
  const missingLabel =
    !gender && !age ? "your gender and age" : !gender ? "your gender" : "your age";

  function onAgeChange(raw: string, final: boolean) {
    const digits = raw.replace(/\D/g, "");
    setAgeText(digits);
    const n = parseInt(digits, 10);
    if (digits && n >= 18 && n <= 99) {
      setAge(String(n));
      setAgeError("");
      setNudge((v) => ({ ...v, age: false }));
      return;
    }
    setAge(null);
    // Stay quiet until they have finished typing, or typed two digits.
    if (digits && (final || digits.length === 2)) {
      setAgeError(n < 18 ? "You need to be 18 or older to join." : "Enter your age in years.");
    } else {
      setAgeError("");
    }
  }

  /** The card stays covered until the entry is registered. */
  const revealed = count !== null;

  /** Nudge the empty fields and say what is missing. */
  function askForTheRest() {
    setNudge({ gender: false, age: false });
    requestAnimationFrame(() => setNudge({ gender: !gender, age: !age }));
    if (!gender) firstChip.current?.focus();
    else ageInput.current?.focus();
    toast("Add your gender and age first");
  }

  /** First press: register the entry, and uncover the card with the number it returns. */
  async function submitDetails() {
    if (!complete) return askForTheRest();
    if (busy) return;
    setBusy(true);
    try {
      // Repeat submissions are safe — the API is idempotent on email and
      // returns the same count.
      const { count: place } = await register({
        name: joined.name,
        email: joined.email,
        city: joined.city,
        gender: gender!,
        age: age!,
      });
      setCount(place);
    } catch (err) {
      toast(err instanceof RegisterError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /** Second press: draw the revealed card and hand it over as a PNG. */
  async function saveCard() {
    if (count === null || busy) return;
    setBusy(true);
    try {
      const blob = await drawCard({ ...joined, gender, age, count });
      if (!blob) throw new Error("no blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nines-at-nine-card-${count}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast("Card saved");
    } catch {
      toast("Saving isn’t available here");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap confirm">
      <div className="confirm-top">
        <h1 ref={heading} tabIndex={-1}>
          You’re in, {joined.name}.
        </h1>
        <p className="muted">Your place is held. We’ll email you when applications open.</p>
      </div>

      <div className="confirm-grid">
        <div
          ref={ticket}
          className={`ticket${revealed ? " revealed" : ""}`}
          aria-label="Your waitlist card"
        >
          {revealed ? (
            <button
              type="button"
              className="ticket-save"
              onClick={saveCard}
              disabled={busy}
              aria-label={busy ? "Saving your card" : "Save your card as an image"}
              title={busy ? "Saving\u2026" : "Save your card"}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
              </svg>
            </button>
          ) : (
            <div className="ticket-veil">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <p>Complete the rest of the details to reveal your card.</p>
            </div>
          )}
          {/* Hidden from screen readers while covered, so the veil's message stands alone. */}
          <div className="ticket-in" aria-hidden={!revealed || undefined}>
            <span className="t-brand">NINES AT NINE · WAITLIST</span>
            <Image className="mark" src="/img/logo.png" alt="" width={186} height={240} />
            <span className="t-label">YOUR PLACE IN LINE</span>
            <span className={count === null ? "token pending" : "token"}>{formatToken(count)}</span>
            <dl className="t-rows">
              <div className="t-row">
                <dt>NAME</dt>
                <dd className="filled">{joined.name}</dd>
              </div>
              <div className="t-row">
                <dt>CITY</dt>
                <dd className="filled">{joined.city}</dd>
              </div>
              <div className="t-row">
                <dt>GENDER</dt>
                <dd className={gender ? "filled" : "empty"}>{gender ?? "add below"}</dd>
              </div>
              <div className="t-row">
                <dt>AGE</dt>
                <dd className={age ? "filled" : "empty"}>{age ?? "add below"}</dd>
              </div>
            </dl>
            <div className="t-status" aria-live="polite">
              {count !== null ? (
                <span className="seal">
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M2.5 7.5L5.5 10.5L11.5 3.5" />
                  </svg>
                  CARD COMPLETE
                </span>
              ) : complete ? (
                "Submit to reveal your card"
              ) : (
                `Add ${missingLabel} to complete your card`
              )}
            </div>
          </div>
        </div>

        <div className="finish">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2>
              {revealed
                ? "You’re number " + count!.toLocaleString("en-IN") + "."
                : complete
                  ? "Ready when you are."
                  : missing === 2
                    ? "Two details to unlock your card."
                    : "One more detail."}
            </h2>
            <p className="muted">
              Every room is balanced, with equal numbers of men and women of similar ages. Add yours
              to complete your card and save it.
            </p>
          </div>

          <fieldset className={`chip-group${nudge.gender ? " nudge" : ""}`}>
            <legend>I AM A</legend>
            <div className="chips">
              {GENDERS.map((option, i) => (
                <button
                  key={option}
                  ref={i === 0 ? firstChip : undefined}
                  type="button"
                  className="chip"
                  aria-pressed={gender === option}
                  onClick={() => {
                    setGender((g) => (g === option ? null : option));
                    setNudge((v) => ({ ...v, gender: false }));
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className={`chip-group age-group${nudge.age ? " nudge" : ""}`}>
            <label htmlFor="age" className="age-label">
              MY AGE
            </label>
            <input
              id="age"
              ref={ageInput}
              name="age"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={2}
              placeholder="e.g. 27"
              aria-describedby="ageErr"
              aria-invalid={Boolean(ageError) || undefined}
              value={ageText}
              onChange={(e) => onAgeChange(e.target.value, false)}
              onBlur={(e) => onAgeChange(e.target.value, true)}
            />
            <span className="age-err" id="ageErr" hidden={!ageError}>
              {ageError}
            </span>
          </div>

          <p className="saved">
            Your place on the waitlist is held either way. These details are only used to build
            rooms, never shown to other members.
          </p>

          <div className="share">
            <button
              type="button"
              className="btn block"
              aria-disabled={!complete}
              aria-describedby="saveHint"
              onClick={revealed ? saveCard : submitDetails}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                {revealed ? (
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                ) : (
                  <>
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </>
                )}
              </svg>
              <span>
                {busy
                  ? revealed
                    ? "Saving…"
                    : "Submitting…"
                  : revealed
                    ? "Save your card"
                    : "Submit"}
              </span>
            </button>
            <p className="save-hint" id="saveHint">
              {!complete
                ? `Add ${missingLabel} to unlock your card.`
                : busy && !revealed
                  ? "Sending your details…"
                  : revealed
                    ? ""
                    : "Submit to reveal your card."}
            </p>
            <button type="button" className="back" onClick={onBack}>
              Back to home
            </button>
          </div>
        </div>
      </div>
      {toastNode}
    </div>
  );
}

/* ---- the card, drawn to a canvas so it can be saved as a picture ---- */

type Card = { name: string; city: string; count: number; gender: string | null; age: string | null };

function loadLogo(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    // If the logo never loads the card is drawn without it, rather than the
    // save hanging on an image event that may never fire.
    const timer = setTimeout(() => resolve(null), 5000);
    const settle = (value: HTMLImageElement | null) => {
      clearTimeout(timer);
      resolve(value);
    };
    img.onload = () => settle(img);
    img.onerror = () => settle(null);
    img.src = "/img/logo.png";
  });
}

async function drawCard(card: Card): Promise<Blob | null> {
  if (document.fonts) {
    await Promise.all([
      document.fonts.load('190px "Poiret One"'),
      document.fonts.load('40px "Josefin Sans"'),
    ]).catch(() => undefined);
  }
  const logo = await loadLogo();

  const W = 1080;
  const H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const x = canvas.getContext("2d");
  if (!x) return null;

  const OX = "#290D10";
  const DEEP = "#1D080B";
  const GOLD = "#F4C469";
  const SOFT = "#F7D38E";
  const ANT = "#B98A45";
  const IV = "#F6EBDC";
  const MU = "#D5C1B6";
  const BUR = "#571B23";

  const glow = x.createRadialGradient(W / 2, -100, 50, W / 2, -100, 1100);
  glow.addColorStop(0, "#74372F");
  glow.addColorStop(1, OX);
  x.fillStyle = glow;
  x.fillRect(0, 0, W, H);

  // frames
  x.strokeStyle = ANT;
  x.lineWidth = 3;
  x.strokeRect(70, 70, W - 140, H - 140);
  x.fillStyle = DEEP;
  x.fillRect(96, 96, W - 192, H - 192);
  x.strokeStyle = GOLD;
  x.lineWidth = 3;
  x.strokeRect(96, 96, W - 192, H - 192);

  // the two punched notches
  for (const cx of [96, W - 96]) {
    x.beginPath();
    x.arc(cx, 470, 30, 0, Math.PI * 2);
    x.fillStyle = OX;
    x.fill();
    x.strokeStyle = ANT;
    x.lineWidth = 3;
    x.stroke();
  }

  x.textAlign = "center";
  x.textBaseline = "alphabetic";

  // Canvas letter-spacing is recent; older engines get spaced-out characters instead.
  const hasTracking: boolean = "letterSpacing" in x;

  const spaced = (text: string, y: number, size: number, color: string, tracking: number) => {
    x.font = `400 ${size}px "Josefin Sans", sans-serif`;
    x.fillStyle = color;
    if (hasTracking) {
      x.letterSpacing = `${tracking}px`;
      x.fillText(text, W / 2 + tracking / 2, y);
      x.letterSpacing = "0px";
    } else {
      x.fillText(text.split("").join(" "), W / 2, y);
    }
  };

  spaced("NINES AT NINE · WAITLIST", 200, 30, GOLD, 10);
  if (logo?.naturalWidth) {
    const h = 110;
    const w = (h * logo.naturalWidth) / logo.naturalHeight;
    x.drawImage(logo, W / 2 - w / 2, 222, w, h);
  }
  spaced("YOUR PLACE IN LINE", 390, 28, MU, 7);

  x.font = '400 190px "Poiret One", sans-serif';
  x.fillStyle = SOFT;
  x.fillText(formatToken(card.count), W / 2, 590);

  const rows: [string, string][] = [
    ["NAME", card.name],
    ["CITY", card.city],
    ["GENDER", card.gender ?? ""],
    ["AGE", card.age ?? ""],
  ];
  const L = 190;
  const R = W - 190;
  rows.forEach(([label, value], i) => {
    const y = 720 + i * 110;
    x.textAlign = "left";
    x.font = '400 26px "Josefin Sans", sans-serif';
    x.fillStyle = MU;
    if (hasTracking) x.letterSpacing = "6px";
    x.fillText(label, L, y);
    if (hasTracking) x.letterSpacing = "0px";

    x.textAlign = "right";
    x.font = '400 40px "Josefin Sans", sans-serif';
    x.fillStyle = i > 1 ? SOFT : IV;
    x.fillText(value, R, y + 4);

    if (i < rows.length - 1) {
      x.setLineDash([8, 8]);
      x.strokeStyle = BUR;
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(L, y + 44);
      x.lineTo(R, y + 44);
      x.stroke();
      x.setLineDash([]);
    }
  });

  // closing ornament
  x.textAlign = "center";
  x.strokeStyle = ANT;
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(W / 2 - 150, 1190);
  x.lineTo(W / 2 - 22, 1190);
  x.moveTo(W / 2 + 22, 1190);
  x.lineTo(W / 2 + 150, 1190);
  x.stroke();
  x.save();
  x.translate(W / 2, 1190);
  x.rotate(Math.PI / 4);
  x.fillStyle = GOLD;
  x.fillRect(-7, -7, 14, 14);
  x.restore();
  spaced("NINESATNINE.COM", 1280, 22, ANT, 6);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
