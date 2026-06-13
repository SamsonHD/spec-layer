import { describe, it, expect } from "vitest";
import {
  applyOrder,
  addChild,
  removeChild,
  renameChild,
  reorderParent,
  rekeyPrefix,
  deletePrefix,
  type NavOrder,
} from "./navOrder";

describe("applyOrder", () => {
  it("returns the fallback order when the parent is unpinned", () => {
    const order: NavOrder = {};
    expect(applyOrder(order, ["foundations"], ["b", "a"], ["a", "b"])).toEqual(["a", "b"]);
  });

  it("orders listed segments by the manifest, appending unlisted via fallback", () => {
    const order: NavOrder = { foundations: ["typography", "color"] };
    const segs = ["color", "spacing", "typography"];
    const fallback = ["color", "spacing", "typography"]; // default alpha
    expect(applyOrder(order, ["foundations"], segs, fallback)).toEqual([
      "typography",
      "color",
      "spacing",
    ]);
  });
});

describe("manifest mutations", () => {
  it("reorderParent sets a parent's full list", () => {
    const o = reorderParent({}, ["foundations"], ["a", "b"]);
    expect(o.foundations).toEqual(["a", "b"]);
  });

  it("removeChild drops a segment", () => {
    const o: NavOrder = { foundations: ["a", "b", "c"] };
    removeChild(o, ["foundations"], "b");
    expect(o.foundations).toEqual(["a", "c"]);
  });

  it("addChild inserts at an index for a pinned parent, no-ops otherwise", () => {
    const pinned: NavOrder = { foundations: ["a", "c"] };
    addChild(pinned, ["foundations"], "b", 1);
    expect(pinned.foundations).toEqual(["a", "b", "c"]);

    const unpinned: NavOrder = {};
    addChild(unpinned, ["foundations"], "b");
    expect(unpinned.foundations).toBeUndefined();
  });

  it("renameChild swaps a segment in place", () => {
    const o: NavOrder = { "": ["foundations", "components"] };
    renameChild(o, [], "foundations", "basics");
    expect(o[""]).toEqual(["basics", "components"]);
  });

  it("rekeyPrefix moves a folder's own and descendant entries", () => {
    const o: NavOrder = {
      foundations: ["color"],
      "foundations/color": ["light", "dark"],
      components: ["button"],
    };
    rekeyPrefix(o, ["foundations"], ["basics"]);
    expect(o.basics).toEqual(["color"]);
    expect(o["basics/color"]).toEqual(["light", "dark"]);
    expect(o.foundations).toBeUndefined();
    expect(o["foundations/color"]).toBeUndefined();
    expect(o.components).toEqual(["button"]); // untouched
  });

  it("deletePrefix removes a node and all descendants", () => {
    const o: NavOrder = {
      foundations: ["color"],
      "foundations/color": ["light"],
      components: ["button"],
    };
    deletePrefix(o, ["foundations"]);
    expect(o.foundations).toBeUndefined();
    expect(o["foundations/color"]).toBeUndefined();
    expect(o.components).toEqual(["button"]);
  });
});
