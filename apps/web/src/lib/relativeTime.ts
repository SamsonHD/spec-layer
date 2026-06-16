/**
 * Human-friendly relative time and a freshness threshold, shared by every
 * drift surface. Pure: callers pass `now` in tests for determinism.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Drift info older than this is considered stale (its own freshness check). */
export const STALE_AFTER_MS = 7 * DAY;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatRelative(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const ms = then.getTime();
  if (Number.isNaN(ms)) return "unknown";

  const diff = now.getTime() - ms;
  if (diff < 0) return "just now"; // clock skew — don't show negative times
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return `${m} min ago`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  if (diff < 2 * DAY) return "yesterday";
  if (diff < STALE_AFTER_MS) {
    const d = Math.floor(diff / DAY);
    return `${d} days ago`;
  }
  return `on ${then.getDate()} ${MONTHS[then.getMonth()]}`;
}

export function isStale(iso: string, now: Date = new Date()): boolean {
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return false;
  return now.getTime() - ms >= STALE_AFTER_MS;
}
