import { describe, expect, it } from "vitest";
import {
  splitSections,
  joinSections,
  replaceSection,
  insertSection,
  deleteSection,
  reorderSection,
  type Section,
} from "./sectionEdit";

const BODY = `Intro preamble line.

## Definition

A button triggers an action.

## Anatomy

1. container
2. label

## Accessibility

Use proper roles.`;

describe("splitSections", () => {
  it("splits a multi-section body into ordered blocks", () => {
    const sections = splitSections(BODY);
    // preamble + 3 headings
    expect(sections).toHaveLength(4);
    expect(sections[0].heading).toBe("");
    expect(sections[0].level).toBe(0);
    expect(sections[0].content).toContain("Intro preamble line.");
    expect(sections[1].heading).toBe("Definition");
    expect(sections[1].level).toBe(2);
    expect(sections[1].content).toContain("A button triggers an action.");
    expect(sections[2].heading).toBe("Anatomy");
    expect(sections[3].heading).toBe("Accessibility");
  });

  it("represents a body with no preamble without an empty leading section", () => {
    const body = `## Only\n\nContent.`;
    const sections = splitSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].heading).toBe("Only");
  });

  it("represents preamble-only body as a single empty-heading section", () => {
    const body = `Just prose, no headings.`;
    const sections = splitSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].heading).toBe("");
    expect(sections[0].content).toContain("Just prose");
  });

  it("keeps deeper ###/#### subheadings inside their parent ## section", () => {
    const body = `## Tokens used\n\n### Color\n\n#### Container\n\nfoo\n\n## Code\n\nbar`;
    const sections = splitSections(body);
    expect(sections).toHaveLength(2);
    expect(sections[0].heading).toBe("Tokens used");
    expect(sections[0].content).toContain("### Color");
    expect(sections[0].content).toContain("#### Container");
    expect(sections[1].heading).toBe("Code");
  });

  it("does not treat ## inside fenced code as a heading", () => {
    const body = `## Real\n\n\`\`\`\n## not a heading\n\`\`\``;
    const sections = splitSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].heading).toBe("Real");
    expect(sections[0].content).toContain("## not a heading");
  });
});

describe("round-trip stability", () => {
  it("splitSections then joinSections returns the original body (normalized)", () => {
    const sections = splitSections(BODY);
    expect(joinSections(sections)).toBe(BODY);
  });

  it("is idempotent under re-normalization", () => {
    const once = joinSections(splitSections(BODY));
    const twice = joinSections(splitSections(once));
    expect(twice).toBe(once);
  });
});

describe("replaceSection", () => {
  it("swaps one section's content and leaves siblings byte-for-byte", () => {
    const sections = splitSections(BODY);
    const defIdx = sections.findIndex((s) => s.heading === "Definition");
    const out = replaceSection(BODY, defIdx, "A brand new definition.");
    const after = splitSections(out);
    expect(after[defIdx].content).toBe("A brand new definition.");
    // heading preserved
    expect(after[defIdx].heading).toBe("Definition");
    // siblings untouched
    expect(after[defIdx - 1].content).toBe(sections[defIdx - 1].content);
    expect(after[defIdx + 1].content).toBe(sections[defIdx + 1].content);
  });

  it("throws on out-of-range index", () => {
    expect(() => replaceSection(BODY, 99, "x")).toThrow();
    expect(() => replaceSection(BODY, -1, "x")).toThrow();
  });
});

describe("insertSection", () => {
  it("inserts a new heading + content at position", () => {
    const section: Section = { heading: "New", level: 2, content: "Fresh." };
    const out = insertSection(BODY, 2, section);
    const after = splitSections(out);
    expect(after).toHaveLength(5);
    expect(after[2].heading).toBe("New");
    expect(after[2].content).toBe("Fresh.");
    // the section previously at index 2 moves to 3
    expect(after[3].heading).toBe("Anatomy");
  });

  it("appends when index === length", () => {
    const section: Section = { heading: "Last", level: 2, content: "End." };
    const out = insertSection(BODY, 4, section);
    const after = splitSections(out);
    expect(after[after.length - 1].heading).toBe("Last");
  });
});

describe("deleteSection", () => {
  it("removes the section at index", () => {
    const sections = splitSections(BODY);
    const anatomyIdx = sections.findIndex((s) => s.heading === "Anatomy");
    const out = deleteSection(BODY, anatomyIdx);
    const after = splitSections(out);
    expect(after.find((s) => s.heading === "Anatomy")).toBeUndefined();
    expect(after).toHaveLength(3);
  });
});

describe("reorderSection", () => {
  it("moves a section from one index to another", () => {
    const sections = splitSections(BODY);
    const from = sections.findIndex((s) => s.heading === "Accessibility");
    const to = sections.findIndex((s) => s.heading === "Definition");
    const out = reorderSection(BODY, from, to);
    const after = splitSections(out);
    expect(after[to].heading).toBe("Accessibility");
  });

  it("is a no-op when from === to", () => {
    const out = reorderSection(BODY, 1, 1);
    expect(out).toBe(joinSections(splitSections(BODY)));
  });
});
