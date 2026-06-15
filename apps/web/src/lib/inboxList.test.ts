import { describe, expect, it } from "vitest";
import { filterInboxItems, getInboxItemState } from "./inboxList";

const items = [
  {
    name: "Action Bar",
    slug: ["_inbox", "action-bar"],
    issueCount: 0,
    missingRequiredCount: 0,
  },
  {
    name: "Button",
    slug: ["_inbox", "button-primary"],
    issueCount: 1,
    missingRequiredCount: 0,
  },
  {
    name: "Text Field",
    slug: ["_inbox", "form", "text-field"],
    issueCount: 0,
    missingRequiredCount: 2,
  },
];

describe("getInboxItemState", () => {
  it("marks only issue-free complete items as ready", () => {
    expect(getInboxItemState(items[0])).toBe("ready");
    expect(getInboxItemState(items[1])).toBe("attention");
    expect(getInboxItemState(items[2])).toBe("attention");
  });
});

describe("filterInboxItems", () => {
  it("shows every item when search is empty", () => {
    expect(filterInboxItems(items, "").map((item) => item.name)).toEqual([
      "Action Bar",
      "Button",
      "Text Field",
    ]);
  });

  it("searches names and nested slugs case-insensitively", () => {
    expect(filterInboxItems(items, "ACTION").map((item) => item.name)).toEqual([
      "Action Bar",
    ]);
    expect(filterInboxItems(items, "form/text").map((item) => item.name)).toEqual([
      "Text Field",
    ]);
  });
});
