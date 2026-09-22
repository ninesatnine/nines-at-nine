import { describe, expect, it } from "vitest";
import { CITIES, exactCity, matchCities } from "./cities";

describe("CITIES", () => {
  it("is sorted and free of duplicates", () => {
    const names = CITIES.map((c) => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(new Set(names).size).toBe(names.length);
  });

  it("includes the metros", () => {
    const names = CITIES.map((c) => c.name);
    for (const metro of ["Mumbai", "Delhi", "Bengaluru", "Kolkata", "Chennai", "Hyderabad"]) {
      expect(names).toContain(metro);
    }
  });
});

describe("matchCities", () => {
  it("lists every city when the query is empty", () => {
    expect(matchCities("")).toHaveLength(CITIES.length);
  });

  it("puts prefix matches ahead of mid-word ones", () => {
    const names = matchCities("pun").map((m) => m.name);
    expect(names[0]).toBe("Pune");
  });

  it("narrows as more letters arrive", () => {
    expect(matchCities("kolk").map((m) => m.name)).toEqual(["Kolkata"]);
  });

  it("finds a city by its older name and says which name matched", () => {
    expect(matchCities("bangal")[0]).toEqual({ name: "Bengaluru", alias: "Bangalore" });
    expect(matchCities("bombay")[0]).toEqual({ name: "Mumbai", alias: "Bombay" });
  });

  it("returns nothing for a city we do not cover", () => {
    expect(matchCities("Xyzzy")).toEqual([]);
  });
});

describe("exactCity", () => {
  it("resolves aliases and punctuation to the canonical name", () => {
    expect(exactCity("gurgaon")).toBe("Gurugram");
    expect(exactCity("  KOLKATA ")).toBe("Kolkata");
    expect(exactCity("Panjim")).toBe("Goa (Panaji)");
  });

  it("is empty for anything we do not recognise", () => {
    expect(exactCity("Some Small Town")).toBe("");
    expect(exactCity("")).toBe("");
  });
});
