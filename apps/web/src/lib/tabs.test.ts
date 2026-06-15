import { describe, expect, it } from "vitest";
import { nextTabIndex } from "./tabs";

describe("nextTabIndex", () => {
  it("moves and wraps with horizontal arrow keys", () => {
    expect(nextTabIndex(0, 2, "ArrowRight")).toBe(1);
    expect(nextTabIndex(1, 2, "ArrowRight")).toBe(0);
    expect(nextTabIndex(0, 2, "ArrowLeft")).toBe(1);
  });

  it("supports Home and End and ignores unrelated keys", () => {
    expect(nextTabIndex(1, 3, "Home")).toBe(0);
    expect(nextTabIndex(0, 3, "End")).toBe(2);
    expect(nextTabIndex(1, 3, "Enter")).toBeNull();
  });
});
