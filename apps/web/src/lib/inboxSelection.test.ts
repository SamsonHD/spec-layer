import { describe, expect, it } from "vitest";
import type { InboxSummaryItem } from "./inboxSummary";
import {
  getSelectAllState,
  itemKey,
  selectedSlugs,
  setAll,
  toggleKey,
} from "./inboxSelection";

const item = (slug: string[]): InboxSummaryItem => ({
  name: slug.at(-1) ?? "",
  slug,
  source: "figma",
  issueCount: 0,
  missingRequiredCount: 0,
});

const items = [item(["_inbox", "button"]), item(["_inbox", "forms", "input"])];

describe("inboxSelection", () => {
  it("derives a stable key from the slug", () => {
    expect(itemKey(items[1])).toBe("_inbox/forms/input");
  });

  it("reports the select-all state for the visible rows", () => {
    expect(getSelectAllState(items, new Set())).toBe("none");
    expect(getSelectAllState(items, new Set(["_inbox/button"]))).toBe("some");
    expect(
      getSelectAllState(items, new Set(["_inbox/button", "_inbox/forms/input"])),
    ).toBe("all");
    expect(getSelectAllState([], new Set(["_inbox/button"]))).toBe("none");
  });

  it("toggles a single key without mutating the input set", () => {
    const start = new Set(["_inbox/button"]);
    const added = toggleKey(start, "_inbox/forms/input");
    expect(added.has("_inbox/forms/input")).toBe(true);
    expect(start.has("_inbox/forms/input")).toBe(false);
    expect(toggleKey(added, "_inbox/button").has("_inbox/button")).toBe(false);
  });

  it("selects or clears every visible row", () => {
    const all = setAll(new Set(), items, true);
    expect(all.size).toBe(2);
    expect(setAll(all, items, false).size).toBe(0);
  });

  it("returns slugs for selected rows in list order", () => {
    expect(selectedSlugs(items, new Set(["_inbox/forms/input"]))).toEqual([
      ["_inbox", "forms", "input"],
    ]);
  });
});
