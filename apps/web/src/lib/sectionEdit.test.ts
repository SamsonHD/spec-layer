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

  it("normalizes CRLF input to LF so a CRLF body round-trips with no mixed endings", () => {
    const crlf = BODY.replace(/\n/g, "\r\n");
    const sections = splitSections(crlf);
    // No section content retains a carriage return.
    for (const s of sections) {
      expect(s.content).not.toContain("\r");
    }
    // The joined output is byte-for-byte the LF-normalized body.
    const out = joinSections(sections);
    expect(out).not.toContain("\r");
    expect(out).toBe(BODY);
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

  // Regression: the Guidelines tab shows only PROSE sections but reorder operates
  // on FULL-body indices. With hidden Specs sections interleaved between prose,
  // a UI "move down" must swap the two VISIBLE prose blocks while leaving the
  // hidden Specs section content fully intact. This mirrors how ComponentTabs
  // computes the neighbor's full-body index and EditableSection sends it as `to`.
  it("swaps adjacent visible prose blocks across interleaved hidden Specs sections", () => {
    // Full-body layout: prose(0), prose(1), Specs(2), Specs(3), Specs(4), prose(5).
    // The user sees prose blocks "Definition", "Code", "Accessibility" (indices 0,1,5).
    const interleaved = `## Definition

A button triggers an action.

## Code

\`\`\`tsx
<Button />
\`\`\`

## Anatomy

1. container
2. label

## Variants

| variant | use |
| --- | --- |
| primary | main action |

## States

Hover, focus, disabled.

## Accessibility

Use proper roles.`;

    const before = splitSections(interleaved);
    expect(before.map((s) => s.heading)).toEqual([
      "Definition", // prose 0
      "Code", // prose 1
      "Anatomy", // Specs 2
      "Variants", // Specs 3
      "States", // Specs 4
      "Accessibility", // prose 5
    ]);

    // User clicks "move down" on the FIRST prose block (Definition, full index 0).
    // Its next VISIBLE prose neighbor is Code at full index 1, so the client sends
    // { from: 0, to: 1 }. The two visible prose blocks must swap with each other.
    const out = reorderSection(interleaved, 0, 1);
    const after = splitSections(out);

    expect(after.map((s) => s.heading)).toEqual([
      "Code", // prose blocks swapped: Code now first
      "Definition",
      "Anatomy",
      "Variants",
      "States",
      "Accessibility",
    ]);

    // The hidden Specs section content survives byte-for-byte.
    const variants = after.find((s) => s.heading === "Variants");
    expect(variants?.content).toContain("| primary | main action |");
    const anatomy = after.find((s) => s.heading === "Anatomy");
    expect(anatomy?.content).toContain("1. container");
  });

  // The harder case: the last prose block is separated from the previous prose
  // block by hidden Specs sections. "Move up" on the last prose block must swap
  // it with the previous VISIBLE prose block, not leapfrog into the Specs region.
  it("move-up on the last prose block swaps it past hidden Specs with the prior prose block", () => {
    const interleaved = `## Definition

Def text.

## Anatomy

anat

## States

st

## Accessibility

a11y text.`;
    // Full indices: Definition(0), Anatomy(1,Specs), States(2,Specs), Accessibility(3,prose).
    // Visible prose order: Definition(0), Accessibility(3). User moves Accessibility UP:
    // its previous visible prose neighbor is Definition at full index 0 -> { from: 3, to: 0 }.
    const out = reorderSection(interleaved, 3, 0);
    const after = splitSections(out);

    // Accessibility now sits before Definition; the two visible prose blocks swapped.
    const a11yPos = after.findIndex((s) => s.heading === "Accessibility");
    const defPos = after.findIndex((s) => s.heading === "Definition");
    expect(a11yPos).toBeLessThan(defPos);

    // Specs content intact.
    expect(after.find((s) => s.heading === "Anatomy")?.content).toBe("anat");
    expect(after.find((s) => s.heading === "States")?.content).toBe("st");
  });
});
