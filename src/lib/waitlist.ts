/* Shared waitlist contract and validation, used by both the client form and the API route. */

import { exactCity } from "./cities";

export type WaitlistInput = {
  firstName: string;
  email: string;
  city: string;
  consent: boolean;
};

export type WaitlistField = keyof WaitlistInput;
export type FieldErrors = Partial<Record<WaitlistField, string>>;

/** Response body of POST /api/waitlist. */
export type WaitlistResponse =
  | { status: "created" }
  | { status: "duplicate" }
  | { status: "demo" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "rate_limited" }
  | { status: "error" };

export const LIMITS = { firstName: 60, email: 254, city: 80 } as const;

// Deliberately permissive: one @, a dot in the domain, no whitespace.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function normalizeInput(raw: Record<string, unknown>): WaitlistInput {
  return {
    firstName: clean(raw.firstName),
    email: normalizeEmail(typeof raw.email === "string" ? raw.email : ""),
    city: clean(raw.city),
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
  };
}

export function validateField(field: WaitlistField, input: WaitlistInput): string | undefined {
  switch (field) {
    case "firstName":
      if (!input.firstName) return "Enter your first name.";
      if (input.firstName.length > LIMITS.firstName) return "First name is too long.";
      return;
    case "email":
      if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email))
        return "Enter an email address like name@example.com.";
      return;
    case "city":
      // The room opens city by city, so we need one we recognise, not free text.
      if (!input.city) return "Enter the city you live in.";
      if (!exactCity(input.city)) return "Choose your city from the list.";
      return;
    case "consent":
      if (!input.consent) return "Please confirm you’re 18 or older.";
      return;
  }
}

export const FIELD_ORDER: WaitlistField[] = ["firstName", "email", "city", "consent"];

export function validate(input: WaitlistInput): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, input);
    if (message) errors[field] = message;
  }
  return errors;
}

/** "aanya  ROY" → "Aanya ROY" — enough to greet someone by name. */
export function titleCase(name: string): string {
  return name.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}
