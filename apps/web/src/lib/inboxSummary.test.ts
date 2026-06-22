import { describe, expect, it } from "vitest";
import type { ComponentDoc } from "./content";
import { formatComponentCount, summarizeInbox } from "./inboxSummary";

function doc(
  name: string,
  missingRequired: string[] = [],
  issues: string[] = [],
  figma = true,
): ComponentDoc {
  return {
    slug: ["_inbox", name.toLowerCase()],
    filePath: "",
    frontmatter: figma
      ? { name, figmaRef: { fileKey: "FILE", nodeId: "1:2" } }
      : { name },
    body: "",
    updated: null,
    sections: [],
    missingRequired,
    isSpecLayer: false,
    issues,
  };
}

describe("summarizeInbox", () => {
  it("counts affected components, marks the source, and sorts the item list", () => {
    expect(
      summarizeInbox([
        doc("Button", ["Accessibility"], ["Invalid token"]),
        doc("Input", ["Definition", "Usage"]),
        doc("Badge", [], [], false),
      ]),
    ).toEqual({
      total: 3,
      withIssues: 1,
      missingRequired: 2,
      items: [
        {
          name: "Badge",
          slug: ["_inbox", "badge"],
          source: "local",
          issueCount: 0,
          missingRequiredCount: 0,
        },
        {
          name: "Button",
          slug: ["_inbox", "button"],
          source: "figma",
          issueCount: 1,
          missingRequiredCount: 1,
        },
        {
          name: "Input",
          slug: ["_inbox", "input"],
          source: "figma",
          issueCount: 0,
          missingRequiredCount: 2,
        },
      ],
    });
  });
});

describe("formatComponentCount", () => {
  it("uses singular and plural component labels", () => {
    expect(formatComponentCount(1)).toBe("1 component");
    expect(formatComponentCount(2)).toBe("2 components");
  });
});
