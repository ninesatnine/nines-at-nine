import { normalizeInput, validate, type WaitlistResponse } from "@/lib/waitlist";
import { getWaitlistStore } from "@/lib/waitlist-store";

// Best-effort, per-instance rate limit. Put a platform rate limit (e.g. a
// firewall rule) in front of this route for real protection.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function reply(body: WaitlistResponse, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) return reply({ status: "rate_limited" }, 429);

  let raw: Record<string, unknown>;
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") throw new Error("bad body");
    raw = body as Record<string, unknown>;
  } catch {
    return reply({ status: "invalid", errors: {} }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Respond as if
  // accepted so bots get no signal, but store nothing.
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return reply({ status: "created" }, 201);
  }

  const input = normalizeInput(raw);
  const errors = validate(input);
  if (Object.keys(errors).length > 0) return reply({ status: "invalid", errors }, 422);

  const store = getWaitlistStore();
  if (!store) {
    // Demo mode: nothing is stored or sent. The local part suffixes below let
    // you preview the other UI states; they have no effect once a store is set.
    const local = input.email.split("@")[0];
    if (local.endsWith("+duplicate")) return reply({ status: "duplicate" }, 409);
    if (local.endsWith("+error")) return reply({ status: "error" }, 502);
    return reply({ status: "demo" }, 200);
  }

  try {
    const result = await store.add({ ...input, submittedAt: new Date().toISOString() });
    return result === "duplicate"
      ? reply({ status: "duplicate" }, 409)
      : reply({ status: "created" }, 201);
  } catch (err) {
    // Log the failure without personal data.
    console.error("[waitlist] store failed:", err instanceof Error ? err.message : "unknown");
    return reply({ status: "error" }, 502);
  }
}
