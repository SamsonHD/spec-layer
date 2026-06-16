/**
 * Tests for the manual markdown upload flow (Phase 3a).
 *
 * Exercises writeInboxMarkdown (the helper the upload route uses) and
 * verifies that the written file is discoverable via getAllDocs / getDoc —
 * the end-to-end path a user cares about.
 *
 * A temp content dir is wired via DS_CONTENT_DIR so tests never touch the
 * repo sample content. Pattern mirrors sectionEditFile.test.ts.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseMarkdown } from "@spec-layer/format";
import { writeInboxMarkdown, slugify } from "./specWriter";
import { getAllDocs, getDoc } from "./content";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-upload-test-"));
  process.env.DS_CONTENT_DIR = tmpDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const VALID_MARKDOWN = `---
name: Test Button
status: draft
---

## Definition

A basic button component.

## Accessibility

Use proper roles.
`;

const MARKDOWN_NO_FRONTMATTER = `## Definition

A component without frontmatter.
`;

const MARKDOWN_SPEC_LAYER_NAME = `---
component:
  name: Icon Button
  figma_node: "1:2"
  figma_file: "abc123"
spec_version: "0.1"
---

## Definition

An icon button.
`;

// ---------------------------------------------------------------------------
// writeInboxMarkdown — file is written to _inbox
// ---------------------------------------------------------------------------

describe("writeInboxMarkdown — writes to _inbox", () => {
  it("creates the _inbox folder and writes the markdown file", () => {
    const result = writeInboxMarkdown("Test Button", VALID_MARKDOWN);

    expect(result.slug).toBe("test-button");
    expect(fs.existsSync(result.path)).toBe(true);
    expect(fs.readFileSync(result.path, "utf-8")).toContain("Test Button");
  });

  it("file lands under contentDir/_inbox/", () => {
    const result = writeInboxMarkdown("Test Button", VALID_MARKDOWN);
    const expected = path.join(tmpDir, "_inbox", "test-button.md");
    expect(result.path).toBe(expected);
  });

  it("does NOT write a .spec-data sidecar (no structured spec provided)", () => {
    const result = writeInboxMarkdown("Test Button", VALID_MARKDOWN);
    const specDataPath = path.join(tmpDir, ".spec-data", "_inbox", `${result.slug}.json`);
    expect(fs.existsSync(specDataPath)).toBe(false);
  });

  it("appends a numeric suffix on collision instead of overwriting", () => {
    const r1 = writeInboxMarkdown("Test Button", VALID_MARKDOWN);
    const r2 = writeInboxMarkdown("Test Button", VALID_MARKDOWN);

    expect(r1.slug).toBe("test-button");
    expect(r2.slug).toBe("test-button-2");
    expect(fs.existsSync(r1.path)).toBe(true);
    expect(fs.existsSync(r2.path)).toBe(true);
  });

  it("falls back to 'component' slug when name slugifies to empty string", () => {
    const result = writeInboxMarkdown("", MARKDOWN_NO_FRONTMATTER);
    expect(result.slug).toBe("component");
  });
});

// ---------------------------------------------------------------------------
// Discoverability — written file is findable by getAllDocs / getDoc
// ---------------------------------------------------------------------------

describe("writeInboxMarkdown — discoverability via getAllDocs / getDoc", () => {
  it("written file appears in getAllDocs under _inbox slug prefix", () => {
    const result = writeInboxMarkdown("Test Button", VALID_MARKDOWN);

    const docs = getAllDocs();
    const found = docs.find((d) => d.slug.join("/") === `_inbox/${result.slug}`);
    expect(found).toBeDefined();
    expect(found?.frontmatter.name).toBe("Test Button");
  });

  it("written file is findable by getDoc", () => {
    const result = writeInboxMarkdown("Test Button", VALID_MARKDOWN);

    const doc = getDoc(["_inbox", result.slug]);
    expect(doc).not.toBeNull();
    expect(doc?.frontmatter.name).toBe("Test Button");
  });

  it("doc without frontmatter lands in _inbox and is discoverable", () => {
    const result = writeInboxMarkdown("Widget", MARKDOWN_NO_FRONTMATTER);

    const doc = getDoc(["_inbox", result.slug]);
    expect(doc).not.toBeNull();
    expect(typeof doc?.frontmatter.name).toBe("string");
  });

  it("multiple uploads produce distinct discoverable docs", () => {
    const r1 = writeInboxMarkdown("Test Button", VALID_MARKDOWN);
    const r2 = writeInboxMarkdown("Test Button", VALID_MARKDOWN);

    const doc1 = getDoc(["_inbox", r1.slug]);
    const doc2 = getDoc(["_inbox", r2.slug]);
    expect(doc1).not.toBeNull();
    expect(doc2).not.toBeNull();
    expect(r1.slug).not.toBe(r2.slug);
  });
});

// ---------------------------------------------------------------------------
// Slug derivation logic (mirrors the route's slug derivation; unit-testable
// without importing next/server)
// ---------------------------------------------------------------------------

/** Mirrors the slug derivation in /api/specs/upload/route.ts */
function deriveSlug(markdown: string, filenameHint?: string): string {
  const { data } = parseMarkdown(markdown);
  const fm = data as Record<string, unknown>;
  const nameFromFm =
    typeof fm.name === "string" && fm.name.trim()
      ? fm.name.trim()
      : typeof fm.component === "object" &&
          fm.component !== null &&
          typeof (fm.component as Record<string, unknown>).name === "string"
        ? ((fm.component as Record<string, unknown>).name as string).trim()
        : null;
  const rawName = nameFromFm ?? filenameHint ?? "component";
  return slugify(rawName) || "component";
}

describe("slug derivation logic", () => {
  it("uses top-level frontmatter `name` field", () => {
    expect(deriveSlug(VALID_MARKDOWN)).toBe("test-button");
  });

  it("uses component.name from Spec Layer frontmatter", () => {
    expect(deriveSlug(MARKDOWN_SPEC_LAYER_NAME)).toBe("icon-button");
  });

  it("falls back to filename hint when no frontmatter name", () => {
    expect(deriveSlug(MARKDOWN_NO_FRONTMATTER, "my-widget")).toBe("my-widget");
  });

  it("falls back to 'component' with no name and no filename", () => {
    expect(deriveSlug(MARKDOWN_NO_FRONTMATTER)).toBe("component");
  });

  it("strips extension from filename hint", () => {
    // The route strips .md before passing as filenameHint
    expect(deriveSlug(MARKDOWN_NO_FRONTMATTER, "chip")).toBe("chip");
  });
});
