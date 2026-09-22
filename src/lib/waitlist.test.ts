import { describe, expect, it } from "vitest";
import { normalizeInput, titleCase, validate, validateField } from "./waitlist";

const base = { firstName: "Ada", email: "ada@example.com", city: "Jaipur", consent: true };

describe("normalizeInput", () => {
  it("trims and lowercases the email and collapses whitespace", () => {
    const input = normalizeInput({
      firstName: "  Ada   Lovelace ",
      email: " Ada@Example.COM ",
      city: " New   Delhi ",
      consent: true,
    });
    expect(input).toEqual({
      firstName: "Ada Lovelace",
      email: "ada@example.com",
      city: "New Delhi",
      consent: true,
    });
  });

  it("treats non-string values as empty and accepts checkbox-style consent", () => {
    expect(normalizeInput({ firstName: 42, email: null, city: undefined, consent: "on" })).toEqual({
      firstName: "",
      email: "",
      city: "",
      consent: true,
    });
  });
});

describe("validate", () => {
  it("accepts a complete submission", () => {
    expect(validate(base)).toEqual({});
  });

  it("requires every field", () => {
    const errors = validate({ firstName: "", email: "", city: "", consent: false });
    expect(errors.firstName).toBe("Enter your first name.");
    expect(errors.email).toMatch(/name@example\.com/);
    expect(errors.city).toBe("Enter the city you live in.");
    expect(errors.consent).toMatch(/18 or older/);
  });

  it("rejects a malformed email", () => {
    expect(validateField("email", { ...base, email: "not-an-email" })).toMatch(/name@example\.com/);
    expect(validateField("email", { ...base, email: "ada@example.com" })).toBeUndefined();
  });

  it("only accepts a city we recognise", () => {
    expect(validateField("city", { ...base, city: "Some Small Town" })).toBe(
      "Choose your city from the list.",
    );
    expect(validateField("city", { ...base, city: "Bangalore" })).toBeUndefined();
  });

  it("enforces the first name length limit", () => {
    expect(validateField("firstName", { ...base, firstName: "a".repeat(61) })).toBe(
      "First name is too long.",
    );
  });
});

describe("titleCase", () => {
  it("capitalises each word without touching the rest", () => {
    expect(titleCase("aanya")).toBe("Aanya");
    expect(titleCase("ada lovelace")).toBe("Ada Lovelace");
  });
});
