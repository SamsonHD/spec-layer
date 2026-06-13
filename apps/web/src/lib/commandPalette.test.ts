import { describe, it, expect } from "vitest";
import { filterCommandItems, type CommandItem } from "./commandPalette";

const items: CommandItem[] = [
  { slug: ["forms", "button"], name: "Button", path: "forms / button" },
  { slug: ["forms", "button-group"], name: "Button Group", path: "forms / button-group" },
  { slug: ["overlays", "menu"], name: "Menu", path: "overlays / menu" },
  { slug: ["forms", "text-field"], name: "Text Field", path: "forms / text-field" },
];

describe("filterCommandItems", () => {
  it("returns all items (copy) for an empty query", () => {
    const out = filterCommandItems(items, "   ");
    expect(out).toHaveLength(4);
    expect(out).not.toBe(items);
  });

  it("matches case-insensitively on name", () => {
    const out = filterCommandItems(items, "menu");
    expect(out.map((i) => i.name)).toEqual(["Menu"]);
  });

  it("ranks name starts-with above name contains", () => {
    const out = filterCommandItems(items, "button");
    // "Button" and "Button Group" both start with it; both before any contains-only.
    expect(out.map((i) => i.name)).toEqual(["Button", "Button Group"]);
  });

  it("falls back to path matches when name does not match", () => {
    const out = filterCommandItems(items, "overlays");
    expect(out.map((i) => i.name)).toEqual(["Menu"]);
  });

  it("ranks name matches above path-only matches", () => {
    // "field" only appears in Text Field's name; "forms" only in paths.
    const byName = filterCommandItems(items, "field");
    expect(byName.map((i) => i.name)).toEqual(["Text Field"]);

    const byPath = filterCommandItems(items, "forms");
    expect(byPath.map((i) => i.name)).toEqual([
      "Button",
      "Button Group",
      "Text Field",
    ]);
  });

  it("returns nothing when there is no match", () => {
    expect(filterCommandItems(items, "zzz")).toEqual([]);
  });
});
