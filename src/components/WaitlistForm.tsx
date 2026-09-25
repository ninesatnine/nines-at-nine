"use client";

import { useRef, useState } from "react";

import { CityCombobox } from "@/components/CityCombobox";
import { exactCity } from "@/lib/cities";
import {
  FIELD_ORDER,
  type FieldErrors,
  type WaitlistField,
  normalizeEmail,
  normalizeInput,
  titleCase,
  validate,
} from "@/lib/waitlist";
import { trackWaitlistStarted } from "@/lib/analytics";

/** What page one collects. The waitlist number is not known until the card is saved. */
export type Joined = { name: string; email: string; city: string };

const BLANK = { firstName: "", email: "", city: "", consent: false };

export function WaitlistForm({ onJoined }: { onJoined: (joined: Joined) => void }) {
  const [values, setValues] = useState(BLANK);
  const [errors, setErrors] = useState<FieldErrors>({});
  // Errors only appear once a field has been submitted or corrected, never mid-typing.
  const [touched, setTouched] = useState<Partial<Record<WaitlistField, boolean>>>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  function check(next: typeof values) {
    const found = validate(normalizeInput(next));
    setErrors(found);
    return found;
  }

  function set<K extends keyof typeof values>(field: K, value: (typeof values)[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field as WaitlistField]) check(next);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot.current?.value) return; // spam trap

    const found = check(values);
    setTouched({ firstName: true, email: true, city: true, consent: true });

    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) {
      const focusTarget = {
        firstName: firstNameRef,
        email: emailRef,
        city: cityRef,
        consent: consentRef,
      }[first];
      focusTarget.current?.focus();
      return;
    }

    const city = exactCity(values.city);
    setValues((v) => ({ ...v, city }));
    // Nothing is sent yet: the API needs gender and age too, which come next.
    onJoined({
      name: titleCase(values.firstName.replace(/\s+/g, " ").trim()),
      email: normalizeEmail(values.email),
      city,
    });
  }

  const bad = (field: WaitlistField) => Boolean(touched[field] && errors[field]);

  return (
    <form
      // ph-no-capture keeps autocapture from recording what is typed or picked here.
      className="form ph-no-capture"
      id="joinForm"
      noValidate
      onSubmit={onSubmit}
      onFocus={() => {
        // Focus bubbles in React, so the first field touched counts, once.
        if (started.current) return;
        started.current = true;
        trackWaitlistStarted();
      }}
    >
      <p className="req-note">All fields are required.</p>

      <div className={`field${bad("firstName") ? " invalid" : ""}`}>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          ref={firstNameRef}
          name="firstName"
          type="text"
          autoComplete="given-name"
          placeholder="e.g. Aanya"
          aria-describedby="firstNameErr"
          aria-invalid={bad("firstName") || undefined}
          value={values.firstName}
          onChange={(e) => set("firstName", e.target.value)}
        />
        <span className="err" id="firstNameErr" hidden={!bad("firstName")}>
          {errors.firstName}
        </span>
      </div>

      <div className={`field${bad("email") ? " invalid" : ""}`}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-describedby="emailHelp emailErr"
          aria-invalid={bad("email") || undefined}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <span className="help" id="emailHelp">
          This is where your invitation will arrive.
        </span>
        <span className="err" id="emailErr" hidden={!bad("email")}>
          {errors.email}
        </span>
      </div>

      <div className={`field${bad("city") ? " invalid" : ""}`}>
        <label htmlFor="city">City</label>
        <CityCombobox
          id="city"
          inputRef={cityRef}
          value={values.city}
          invalid={bad("city")}
          describedBy="cityHelp cityErr"
          onChange={(city) => set("city", city)}
          onPick={(city) => {
            const next = { ...values, city };
            setValues(next);
            if (touched.city) check(next);
          }}
        />
        <span className="help" id="cityHelp">
          {/* Rooms open city by city. This tells us where to start. */}
        </span>
        <span className="err" id="cityErr" hidden={!bad("city")}>
          {errors.city}
        </span>
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" ref={honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="check">
        <input
          id="consent"
          ref={consentRef}
          name="consent"
          type="checkbox"
          aria-describedby="consentErr"
          aria-invalid={bad("consent") || undefined}
          checked={values.consent}
          onChange={(e) => {
            const next = { ...values, consent: e.target.checked };
            setValues(next);
            if (touched.consent) check(next);
          }}
        />
        <label htmlFor="consent">I’m 18 or older and would like updates about Nines at Nine.</label>
      </div>
      <span className="check-err" id="consentErr" hidden={!bad("consent")}>
        {errors.consent}
      </span>

      <button className="btn block" id="formCta" type="submit">
        Join the waitlist
      </button>
      
    </form>
  );
}
