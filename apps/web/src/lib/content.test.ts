import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getDoc } from "./content";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-content-"));
  process.env.DS_CONTENT_DIR = contentDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function write(slug: string[], raw: string): void {
  const file = path.join(contentDir, ...slug) + ".md";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, raw, "utf-8");
}

describe("frontmatter figmaKey", () => {
  it("reads component.figma_key from a Spec Layer doc", () => {
    write(
      ["components", "button"],
      [
        "---",
        'spec_version: "0.1"',
        "component:",
        "  name: Button",
        "  figma_key: abc123",
        "  figma_file: FILE123",
        "  figma_node: 1:2",
        "content_hash: deadbeef",
        'extracted_at: "2026-06-10T00:00:00Z"',
        "---",
        "",
        "## Definition",
        "",
        "Body.",
        "",
      ].join("\n"),
    );

    const doc = getDoc(["components", "button"]);
    expect(doc?.frontmatter.figmaKey).toBe("abc123");
    expect(doc?.frontmatter.figmaRef?.fileKey).toBe("FILE123");
  });

  it("reads component.figma_key from a legacy doc that fails strict parse", () => {
    // Has spec_version (so it takes the spec path) but an invalid status that
    // trips strict validation, exercising the legacy fallback parser.
    write(
      ["components", "legacy"],
      [
        "---",
        'spec_version: "0.1"',
        "status: not-a-real-status-value-that-breaks-schema",
        "component:",
        "  name: Legacy",
        "  figma_key: legacy-key",
        "  figma_file: FILE9",
        "  figma_node: 3:4",
        "content_hash: cafe",
        'extracted_at: "2026-06-10T00:00:00Z"',
        "---",
        "",
        "## Definition",
        "",
        "Body.",
      ].join("\n"),
    );

    expect(getDoc(["components", "legacy"])?.frontmatter.figmaKey).toBe("legacy-key");
  });
});
