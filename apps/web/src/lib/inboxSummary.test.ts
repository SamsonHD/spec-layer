import { describe, expect, it } from "vitest";
import type { ComponentDoc } from "./content";
import { formatComponentCount, summarizeInbox } from "./inboxSummary";

function doc(
  name: string,
  missingRequired: string[] = [],
  issues: string[] = [],
): ComponentDoc {
  return {
    slug: ["_inbox", name.toLowerCase()],
    filePath: "",
    frontmatter: { name },
    body: "",
    updated: null,
    sections: [],
    missingRequired,
    isSpecLayer: false,
    issues,
  };
}

describe("summarizeInbox", () => {
  it("counts affected components and sorts the compact item list", () => {
    expect(
      summarizeInbox([
        doc("Button", ["Accessibility"], ["Invalid token"]),
        doc("Input", ["Definition", "Usage"]),
        doc("Badge"),
      ]),
    ).toEqual({
      total: 3,
      withIssues: 1,
      missingRequired: 2,
      items: [
        {
          name: "Badge",
          slug: ["_inbox", "badge"],
          issueCount: 0,
          missingRequiredCount: 0,
        },
        {
          name: "Button",
          slug: ["_inbox", "button"],
          issueCount: 1,
          missingRequiredCount: 1,
        },
        {
          name: "Input",
          slug: ["_inbox", "input"],
          issueCount: 0,
          missingRequiredCount: 2,
        },
      ],
    });
  });
});

describe("summarizeInbox update recognition", () => {
  function keyedInbox(name: string, figmaKey: string): ComponentDoc {
    return { ...doc(name), frontmatter: { name, figmaKey } };
  }
  function libDoc(slug: string[], name: string, figmaKey?: string): ComponentDoc {
    return { ...doc(name), slug, frontmatter: { name, figmaKey } };
  }

  it("annotates an inbox draft that matches a library spec by figma_key", () => {
    const summary = summarizeInbox(
      [keyedInbox("Button", "k1")],
      [libDoc(["components", "button"], "Button", "k1")],
    );
    expect(summary.items[0].update).toEqual({
      targetSlug: ["components", "button"],
      targetName: "Button",
    });
  });

  it("leaves drafts without a matching key unannotated", () => {
    const summary = summarizeInbox(
      [keyedInbox("Chip", "knew")],
      [libDoc(["components", "button"], "Button", "k1")],
    );
    expect(summary.items[0].update).toBeUndefined();
  });

  it("ignores library inbox docs and keyless library docs as targets", () => {
    const summary = summarizeInbox(
      [keyedInbox("Button", "k1")],
      [
        libDoc(["_inbox", "button"], "Button", "k1"), // inbox — not a target
        libDoc(["components", "nokey"], "NoKey"), // no key
      ],
    );
    expect(summary.items[0].update).toBeUndefined();
  });
});

describe("formatComponentCount", () => {
  it("uses singular and plural component labels", () => {
    expect(formatComponentCount(1)).toBe("1 component");
    expect(formatComponentCount(2)).toBe("2 components");
  });
});
