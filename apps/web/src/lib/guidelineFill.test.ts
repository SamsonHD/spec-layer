import { describe, expect, it } from "vitest";
import type { ProseDrafts } from "@spec-layer/extractor";
import {
  isEmptyGuideline,
  isFillableGuideline,
  renderDosDonts,
  fillGuidelines,
  guidelineContent,
  findPristineGuidelines,
} from "./guidelineFill";

const PROSE: ProseDrafts = {
  definition: "A badge shows a small count.",
  accessibility: "Expose the count to assistive tech.",
  dos: ["Use for counts", "Keep it short"],
  donts: ["Don't use for long text", "Don't hide it"],
};

const BODY = `## Definition

_To be written._

## Anatomy

1. container

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.`;

describe("isEmptyGuideline", () => {
  it("treats the placeholder as empty", () => {
    expect(isEmptyGuideline("_To be written._")).toBe(true);
    expect(isEmptyGuideline("  _To be written._  ")).toBe(true);
  });

  it("treats any italic placeholder as empty", () => {
    expect(isEmptyGuideline("_None._")).toBe(true);
  });

  it("treats real prose as non-empty", () => {
    expect(isEmptyGuideline("A badge shows a count.")).toBe(false);
  });
});

describe("isFillableGuideline", () => {
  it("recognizes the three guideline headings", () => {
    expect(isFillableGuideline("Definition")).toBe(true);
    expect(isFillableGuideline("Accessibility")).toBe(true);
    expect(isFillableGuideline("Do's & Don'ts")).toBe(true);
  });

  it("rejects non-guideline headings", () => {
    expect(isFillableGuideline("Anatomy")).toBe(false);
    expect(isFillableGuideline("Code")).toBe(false);
    expect(isFillableGuideline("Tokens used")).toBe(false);
  });
});

describe("renderDosDonts", () => {
  it("renders dos then donts with check/cross bullets", () => {
    expect(renderDosDonts(PROSE)).toBe(
      "- ✅ Use for counts\n- ✅ Keep it short\n- ❌ Don't use for long text\n- ❌ Don't hide it",
    );
  });
});

describe("fillGuidelines target=empty", () => {
  it("fills only empty guideline sections and reports them", () => {
    const { body, filled } = fillGuidelines(BODY, PROSE, { target: "empty" });
    expect(filled.sort()).toEqual(["Accessibility", "Definition", "Do's & Don'ts"]);
    expect(body).toContain("## Definition\n\nA badge shows a small count.");
    expect(body).toContain("## Accessibility\n\nExpose the count to assistive tech.");
    expect(body).toContain("- ✅ Use for counts");
    expect(body).toContain("- ❌ Don't hide it");
  });

  it("never touches non-guideline sections", () => {
    const { body } = fillGuidelines(BODY, PROSE, { target: "empty" });
    expect(body).toContain("## Anatomy\n\n1. container");
    expect(body).toContain("## Related atoms\n\nNone.");
  });

  it("preserves a guideline section that already has human prose", () => {
    const edited = BODY.replace(
      "## Definition\n\n_To be written._",
      "## Definition\n\nHuman-written definition.",
    );
    const { body, filled } = fillGuidelines(edited, PROSE, { target: "empty" });
    expect(filled).not.toContain("Definition");
    expect(body).toContain("## Definition\n\nHuman-written definition.");
  });
});

describe("fillGuidelines target=heading", () => {
  it("replaces a specific guideline section even when it is non-empty (regen)", () => {
    const edited = BODY.replace(
      "## Definition\n\n_To be written._",
      "## Definition\n\nOld text.",
    );
    const { body, filled } = fillGuidelines(edited, PROSE, { target: "Definition" });
    expect(filled).toEqual(["Definition"]);
    expect(body).toContain("## Definition\n\nA badge shows a small count.");
    expect(body).not.toContain("Old text.");
    // other empty guideline sections are left alone on a targeted regen
    expect(body).toContain("## Accessibility\n\n_To be written._");
  });

  it("ignores a target that is not a fillable guideline", () => {
    const { body, filled } = fillGuidelines(BODY, PROSE, { target: "Anatomy" });
    expect(filled).toEqual([]);
    expect(body).toContain("## Anatomy\n\n1. container");
  });
});

describe("guidelineContent", () => {
  it("returns the paragraph for Definition/Accessibility", () => {
    expect(guidelineContent("Definition", PROSE)).toBe("A badge shows a small count.");
    expect(guidelineContent("Accessibility", PROSE)).toBe("Expose the count to assistive tech.");
  });

  it("returns the rendered list for Do's & Don'ts", () => {
    expect(guidelineContent("Do's & Don'ts", PROSE)).toBe(renderDosDonts(PROSE));
  });
});

describe("findPristineGuidelines", () => {
  it("returns guideline sections whose content still equals the AI draft", () => {
    const { body } = fillGuidelines(BODY, PROSE, { target: "empty" });
    const pristine = findPristineGuidelines(body, [PROSE]);
    expect(pristine.sort()).toEqual(["Accessibility", "Definition", "Do's & Don'ts"]);
  });

  it("omits a section that was hand-edited away from the draft", () => {
    const { body } = fillGuidelines(BODY, PROSE, { target: "empty" });
    const edited = body.replace(
      "A badge shows a small count.",
      "A badge shows a small count. (edited by a human)",
    );
    const pristine = findPristineGuidelines(edited, [PROSE]);
    expect(pristine).not.toContain("Definition");
    expect(pristine).toContain("Accessibility");
  });

  it("treats an empty placeholder section as not pristine", () => {
    const pristine = findPristineGuidelines(BODY, [PROSE]);
    expect(pristine).toEqual([]);
  });

  it("matches against any of several candidate drafts (text-only or vision)", () => {
    const { body } = fillGuidelines(BODY, PROSE, { target: "Definition" });
    const otherDraft: ProseDrafts = { ...PROSE, definition: "totally different" };
    const pristine = findPristineGuidelines(body, [otherDraft, PROSE]);
    expect(pristine).toContain("Definition");
  });

  it("returns nothing when there are no candidate drafts", () => {
    const { body } = fillGuidelines(BODY, PROSE, { target: "empty" });
    expect(findPristineGuidelines(body, [])).toEqual([]);
  });
});
