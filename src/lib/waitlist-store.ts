import "server-only";
import type { WaitlistInput } from "./waitlist";

/* Storage adapter. Swap in a database-backed implementation by returning it
   from getWaitlistStore(); the API route only depends on this interface. */

export type StoreResult = "created" | "duplicate";

export interface WaitlistStore {
  add(entry: WaitlistInput & { submittedAt: string }): Promise<StoreResult>;
}

/**
 * Forwards entries to a server-side webhook you control (e.g. your own API,
 * an automation tool, or a serverless function in front of your database).
 * Contract: 200/201 = stored, 409 = email already present, anything else = failure.
 */
class WebhookStore implements WaitlistStore {
  constructor(
    private url: string,
    private secret?: string,
  ) {}

  async add(entry: WaitlistInput & { submittedAt: string }): Promise<StoreResult> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.secret ? { authorization: `Bearer ${this.secret}` } : {}),
      },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.status === 409) return "duplicate";
    if (res.ok) return "created";
    throw new Error(`Waitlist webhook responded ${res.status}`);
  }
}

/** Returns the configured store, or null when running in demo mode. */
export function getWaitlistStore(): WaitlistStore | null {
  const url = process.env.WAITLIST_WEBHOOK_URL;
  if (!url) return null;
  return new WebhookStore(url, process.env.WAITLIST_WEBHOOK_SECRET);
}

export function isDemoMode(): boolean {
  return !process.env.WAITLIST_WEBHOOK_URL;
}
