import { describe, expect, it } from "vitest";
import type { ComponentDoc, Status } from "./content";
import { getHomeStats } from "./homeStats";

function doc(
  slug: string[],
  status?: Status,
  missingRequired: string[] = [],
): ComponentDoc {
  return {
    slug,
    filePath: "",
    frontmatter: { name: slug[slug.length - 1], status },
    body: "",
    updated: null,
    sections: [],
    missingRequired,
    isSpecLayer: false,
    issues: [],
  };
}

describe("getHomeStats", () => {
  it("counts live components and excludes the inbox from every metric except inbox", () => {
    const stats = getHomeStats([
      doc(["button"], "approved"),
      doc(["input"], "draft"),
      doc(["_inbox", "badge"], "draft"),
      doc(["_inbox", "card"]),
    ]);

    expect(stats.total).toBe(2);
    expect(stats.inbox).toBe(2);
  });

  it("groups statuses in display order and drops absent statuses", () => {
    const stats = getHomeStats([
      doc(["a"], "draft"),
      doc(["b"], "approved"),
      doc(["c"], "approved"),
      doc(["d"], "deprecated"),
    ]);

    expect(stats.byStatus).toEqual([
      { status: "approved", count: 2 },
      { status: "draft", count: 1 },
      { status: "deprecated", count: 1 },
    ]);
  });

  it("counts components with missing required sections as needing attention", () => {
    const stats = getHomeStats([
      doc(["a"], "approved", ["Accessibility"]),
      doc(["b"], "approved", ["Definition", "Usage"]),
      doc(["c"], "approved"),
    ]);

    expect(stats.needsAttention).toBe(2);
  });

  it("returns empty status list when no components have a status", () => {
    const stats = getHomeStats([doc(["a"]), doc(["b"])]);
    expect(stats.total).toBe(2);
    expect(stats.byStatus).toEqual([]);
    expect(stats.needsAttention).toBe(0);
  });
});
