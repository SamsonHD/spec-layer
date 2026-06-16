import { describe, expect, it } from "vitest";
import { formatRelative, isStale } from "./relativeTime";

const NOW = new Date("2026-06-16T18:00:00.000Z");
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("formatRelative", () => {
  it.each([
    [ago(10 * SEC), "just now"],
    [ago(59 * SEC), "just now"],
    [ago(MIN), "1 min ago"],
    [ago(59 * MIN), "59 min ago"],
    [ago(HOUR), "1 hour ago"],
    [ago(2 * HOUR), "2 hours ago"],
    [ago(23 * HOUR), "23 hours ago"],
    [ago(DAY), "yesterday"],
    [ago(2 * DAY - 1), "yesterday"],
    [ago(2 * DAY), "2 days ago"],
    [ago(6 * DAY), "6 days ago"],
    [ago(7 * DAY), "on 9 Jun"],
    [ago(30 * DAY), "on 17 May"],
  ])("formats %s as %s", (iso, expected) => {
    expect(formatRelative(iso, NOW)).toBe(expected);
  });

  it("guards against clock skew (future dates)", () => {
    expect(formatRelative(new Date(NOW.getTime() + HOUR).toISOString(), NOW)).toBe(
      "just now",
    );
  });

  it("returns 'unknown' for an unparseable date", () => {
    expect(formatRelative("not-a-date", NOW)).toBe("unknown");
  });
});

describe("isStale", () => {
  it("is false before 7 days and true at/after", () => {
    expect(isStale(ago(6 * DAY), NOW)).toBe(false);
    expect(isStale(ago(7 * DAY), NOW)).toBe(true);
    expect(isStale(ago(8 * DAY), NOW)).toBe(true);
  });

  it("is false for an unparseable date", () => {
    expect(isStale("nope", NOW)).toBe(false);
  });
});
