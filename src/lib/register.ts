/* The waitlist register API.
 *
 * One endpoint, one call. It requires all five fields together, so nothing is
 * sent when the form is submitted — the first three are held in the browser
 * until gender and age are added on the card, and the whole entry goes at once.
 *
 * It is idempotent on email: the first call for an address creates the entry
 * (201) and later calls update it (200), both returning the same `count`, which
 * is the place in line we print on the card.
 */

/* The endpoint lives in the environment, not here. NEXT_PUBLIC_* is read at
 * build time and inlined into the client bundle, so it ships to the browser in
 * plain sight — a location, not a secret. Set it in .env.local for development
 * and in the host's build settings for a deploy; see .env.example. */
export const REGISTER_URL = process.env.NEXT_PUBLIC_REGISTER_URL ?? "";

// Fail the build, not the visitor. Next evaluates this module while
// prerendering, so an unset variable stops the build here rather than shipping
// a site whose form quietly posts nowhere.
if (!REGISTER_URL) {
  throw new Error(
    "NEXT_PUBLIC_REGISTER_URL is not set. Copy .env.example to .env.local and fill it in, " +
      "or set it in the host's build settings.",
  );
}

/** The only values the API accepts. */
export type ApiGender = "male" | "female" | "other";

/** Our chips are more specific than the API's three values, so two collapse to "other". */
export const GENDER_TO_API: Record<string, ApiGender> = {
  Man: "male",
  Woman: "female",
  "Non-binary": "other",
  "Prefer not to say": "other",
};

export type RegisterInput = {
  name: string;
  email: string;
  city: string;
  gender: string;
  age: string;
};

export type RegisterResult = {
  /** Place in line, printed on the card. */
  count: number;
  status: string;
};

export class RegisterError extends Error {}

export function toPayload(input: RegisterInput) {
  const gender = GENDER_TO_API[input.gender];
  if (!gender) throw new RegisterError("Pick how you'd like to be listed.");
  return {
    name: input.name,
    email: input.email,
    gender,
    age: input.age,
    city: input.city,
  };
}

export async function register(
  input: RegisterInput,
  signal?: AbortSignal,
): Promise<RegisterResult> {
  let response: Response;
  try {
    response = await fetch(REGISTER_URL, {
      method: "POST",
      // The body is JSON, but the header says text/plain on purpose.
      //
      // The API answers the POST with `access-control-allow-origin: *`, but it
      // has no OPTIONS route — a preflight returns 404. "application/json" is
      // not a CORS-safelisted content type, so it forces a preflight, which
      // fails and the browser blocks the request before it is ever sent.
      // "text/plain" is safelisted, so the request goes straight through, and
      // the API parses the body regardless of the header.
      //
      // Remove this once an OPTIONS handler is added to the API (see README).
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(toPayload(input)),
      signal,
    });
  } catch {
    throw new RegisterError("Couldn’t reach us. Check your connection and try again.");
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // The API explains itself; pass its message through rather than inventing one.
    const message =
      body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string"
        ? (body as { error: string }).error
        : "Something went wrong. Please try again.";
    throw new RegisterError(message);
  }

  const count = body && typeof body === "object" ? (body as { count?: unknown }).count : undefined;
  if (typeof count !== "number") {
    throw new RegisterError("We saved your details, but couldn’t read your number.");
  }

  const status =
    body && typeof (body as { status?: unknown }).status === "string"
      ? (body as { status: string }).status
      : "created";

  return { count, status };
}
