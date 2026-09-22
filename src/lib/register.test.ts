import { afterEach, describe, expect, it, vi } from "vitest";
import { REGISTER_URL, RegisterError, register, toPayload } from "./register";

const entry = {
  name: "Ada",
  email: "ada@example.com",
  city: "Pune",
  gender: "Woman",
  age: "30",
};

function mockFetch(body: unknown, status = 201) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("toPayload", () => {
  it("maps our chips onto the three values the API accepts", () => {
    expect(toPayload({ ...entry, gender: "Man" }).gender).toBe("male");
    expect(toPayload({ ...entry, gender: "Woman" }).gender).toBe("female");
    expect(toPayload({ ...entry, gender: "Non-binary" }).gender).toBe("other");
    expect(toPayload({ ...entry, gender: "Prefer not to say" }).gender).toBe("other");
  });

  it("sends exactly the five fields the API requires", () => {
    expect(Object.keys(toPayload(entry)).sort()).toEqual([
      "age",
      "city",
      "email",
      "gender",
      "name",
    ]);
  });

  it("refuses a gender it cannot map", () => {
    expect(() => toPayload({ ...entry, gender: "Something else" })).toThrow(RegisterError);
  });
});

describe("register", () => {
  it("posts the entry and returns the place in line", async () => {
    const fetchMock = mockFetch({ status: "created", count: 255 }, 201);
    const result = await register(entry);

    expect(result).toEqual({ count: 255, status: "created" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(REGISTER_URL);
    expect(init.method).toBe("POST");
    // text/plain is CORS-safelisted, so the request skips the preflight the
    // API has no route for. The body is still JSON.
    expect(init.headers["Content-Type"]).toBe("text/plain;charset=UTF-8");
    expect(JSON.parse(init.body)).toEqual({
      name: "Ada",
      email: "ada@example.com",
      gender: "female",
      age: "30",
      city: "Pune",
    });
  });

  it("accepts 200 for an entry that already existed", async () => {
    mockFetch({ status: "updated", count: 255 }, 200);
    await expect(register(entry)).resolves.toEqual({ count: 255, status: "updated" });
  });

  it("passes the API's own message through on a rejection", async () => {
    mockFetch({ error: "gender must be one of: male, female, other" }, 400);
    await expect(register(entry)).rejects.toThrow("gender must be one of: male, female, other");
  });

  it("explains a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(register(entry)).rejects.toThrow(/Check your connection/);
  });

  it("complains if the response carries no number", async () => {
    mockFetch({ status: "created" }, 201);
    await expect(register(entry)).rejects.toThrow(/couldn’t read your number/);
  });
});
