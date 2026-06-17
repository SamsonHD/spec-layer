import { describe, expect, it } from "vitest";
import { diffSpecBodies } from "./specDiff";

const oldBody = [
  "## Definition",
  "",
  "Human prose that should be ignored by the diff.",
  "",
  "## Anatomy",
  "",
  "1. Container",
  "2. Label",
  "",
  "## Variants",
  "",
  "- **Type**: Filled (default) · Outlined",
  "",
  "## States",
  "",
  "- Default",
].join("\n");

const newBody = [
  "## Definition",
  "",
  "Totally different prose — still ignored.",
  "",
  "## Anatomy",
  "",
  "1. Container",
  "2. Label",
  "3. Icon",
  "",
  "## Variants",
  "",
  "- **Type**: Filled (default) · Outlined · Tonal",
  "",
  "## Tokens used",
  "",
  "### Color",
].join("\n");

describe("diffSpecBodies", () => {
  it("ignores judgment sections (Definition) entirely", () => {
    const diff = diffSpecBodies(oldBody, newBody);
    expect(diff.sections.some((s) => s.heading === "Definition")).toBe(false);
  });

  it("reports changed, added, and removed deterministic sections", () => {
    const diff = diffSpecBodies(oldBody, newBody);
    const byHeading = Object.fromEntries(diff.sections.map((s) => [s.heading, s.change]));
    expect(byHeading["Anatomy"]).toBe("changed");
    expect(byHeading["Variants"]).toBe("changed");
    expect(byHeading["Tokens used"]).toBe("added");
    expect(byHeading["States"]).toBe("removed");
  });

  it("produces add/del lines for a changed section", () => {
    const diff = diffSpecBodies(oldBody, newBody);
    const anatomy = diff.sections.find((s) => s.heading === "Anatomy")!;
    expect(anatomy.lines.some((l) => l.type === "add" && l.text.includes("3. Icon"))).toBe(true);
    expect(anatomy.lines.some((l) => l.type === "context" && l.text.includes("1. Container"))).toBe(true);
  });

  it("is unchanged when only judgment prose differs", () => {
    const a = "## Definition\n\nA\n\n## Anatomy\n\n1. X";
    const b = "## Definition\n\nB (edited)\n\n## Anatomy\n\n1. X";
    const diff = diffSpecBodies(a, b);
    expect(diff.unchanged).toBe(true);
    expect(diff.sections).toEqual([]);
  });
});
