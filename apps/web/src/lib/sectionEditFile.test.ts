import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { applySectionEdit } from "./sectionEditFile";

const FRONTMATTER = `---
spec_version: "0.1"
status: draft
component:
  name: Button
  figma_node: 7909:319930
name: "Button"
---`;

const BODY = `## Definition

Original definition.

## Accessibility

Use proper roles.`;

let dir: string;
let slug: string[];

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "sec-edit-"));
  process.env.DS_CONTENT_DIR = dir;
  slug = ["f", "button"];
  const filePath = path.join(dir, "f", "button.md");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${FRONTMATTER}\n\n${BODY}\n`, "utf-8");
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

function read(): string {
  return fs.readFileSync(path.join(dir, "f", "button.md"), "utf-8");
}

describe("applySectionEdit", () => {
  it("replaces a section body and leaves frontmatter byte-for-byte intact", () => {
    applySectionEdit(slug, { action: "replace", index: 0, content: "Brand new definition." });
    const raw = read();
    expect(raw.startsWith(FRONTMATTER)).toBe(true);
    expect(raw).toContain("Brand new definition.");
    expect(raw).not.toContain("Original definition.");
    // sibling preserved
    expect(raw).toContain("Use proper roles.");
  });

  it("inserts a new section", () => {
    applySectionEdit(slug, {
      action: "insert",
      index: 1,
      heading: "Code",
      content: "Usage here.",
    });
    const raw = read();
    expect(raw).toContain("## Code");
    expect(raw).toContain("Usage here.");
    expect(raw.startsWith(FRONTMATTER)).toBe(true);
  });

  it("deletes a section", () => {
    applySectionEdit(slug, { action: "delete", index: 1 });
    const raw = read();
    expect(raw).not.toContain("## Accessibility");
    expect(raw).toContain("## Definition");
  });

  it("reorders sections", () => {
    applySectionEdit(slug, { action: "reorder", index: 1, to: 0 });
    const raw = read();
    const defPos = raw.indexOf("## Definition");
    const a11yPos = raw.indexOf("## Accessibility");
    expect(a11yPos).toBeLessThan(defPos);
  });

  it("throws for a missing file", () => {
    expect(() =>
      applySectionEdit(["does", "not", "exist"], { action: "replace", index: 0, content: "x" }),
    ).toThrow(/not found/i);
  });

  it("throws for an out-of-range index", () => {
    expect(() =>
      applySectionEdit(slug, { action: "replace", index: 99, content: "x" }),
    ).toThrow();
  });
});
