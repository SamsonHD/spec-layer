import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  SpecUpdateError,
  mergePreservingJudgment,
  updateLibrarySpecFromInbox,
} from "./specUpdate";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-update-"));
  process.env.DS_CONTENT_DIR = contentDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function specMd(opts: {
  name?: string;
  figmaKey?: string;
  hash: string;
  definition: string;
  anatomy: string;
  extra?: string;
}): string {
  const { name = "Button", figmaKey = "k1", hash, definition, anatomy, extra = "" } = opts;
  return [
    "---",
    'spec_version: "0.1"',
    "component:",
    `  name: ${name}`,
    `  figma_key: ${figmaKey}`,
    "  figma_file: FILE1234567",
    "  figma_node: 1:2",
    `content_hash: ${hash}`,
    'extracted_at: "2026-06-16T00:00:00Z"',
    `${extra}---`,
    "",
    "## Definition",
    "",
    definition,
    "",
    "## Anatomy",
    "",
    anatomy,
    "",
    "## Accessibility",
    "",
    "- **Keyboard:** old a11y note.",
    "",
  ].join("\n");
}

function write(slug: string[], raw: string): void {
  const file = path.join(contentDir, ...slug) + ".md";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, raw, "utf-8");
}

function writeSidecar(slug: string[], data: unknown): void {
  const file = path.join(contentDir, ".spec-data", ...slug) + ".json";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data), "utf-8");
}

describe("mergePreservingJudgment", () => {
  it("keeps judgment sections from old, deterministic from new", () => {
    const newBody = "## Definition\n\nNEW def\n\n## Anatomy\n\n1. NewPart";
    const oldBody = "## Definition\n\nOLD human def\n\n## Anatomy\n\n1. OldPart";
    const merged = mergePreservingJudgment(newBody, oldBody);
    expect(merged).toContain("OLD human def");
    expect(merged).not.toContain("NEW def");
    expect(merged).toContain("1. NewPart");
    expect(merged).not.toContain("OldPart");
  });

  it("falls back to the new section when old lacks that judgment section", () => {
    const merged = mergePreservingJudgment(
      "## Definition\n\nNEW def",
      "## Anatomy\n\n1. OldPart",
    );
    expect(merged).toContain("NEW def");
  });

  it("matches Do's & Don'ts across curly/straight quotes", () => {
    const merged = mergePreservingJudgment(
      "## Do’s & Don’ts\n\n- ✅ new rule",
      "## Do's & Don'ts\n\n- ✅ OLD rule",
    );
    expect(merged).toContain("OLD rule");
    expect(merged).not.toContain("new rule");
  });
});

describe("updateLibrarySpecFromInbox", () => {
  it("merges, moves the sidecar, and removes the inbox draft", () => {
    write(
      ["components", "button"],
      specMd({ hash: "OLD", definition: "Human-written definition.", anatomy: "1. OldPart" }),
    );
    write(
      ["_inbox", "button"],
      specMd({ hash: "NEW", definition: "Auto placeholder.", anatomy: "1. NewPart" }),
    );
    writeSidecar(["_inbox", "button"], { name: "Button", figmaKey: "k1" });

    const result = updateLibrarySpecFromInbox(["_inbox", "button"], ["components", "button"]);
    expect(result).toEqual({ slug: ["components", "button"] });

    const merged = fs.readFileSync(path.join(contentDir, "components", "button.md"), "utf-8");
    expect(merged).toContain("Human-written definition."); // judgment kept
    expect(merged).toContain("1. NewPart"); // deterministic refreshed
    expect(merged).toContain("content_hash: NEW"); // identity refreshed

    // Inbox draft + its sidecar gone; target sidecar present.
    expect(fs.existsSync(path.join(contentDir, "_inbox", "button.md"))).toBe(false);
    expect(fs.existsSync(path.join(contentDir, ".spec-data", "_inbox", "button.json"))).toBe(false);
    expect(fs.existsSync(path.join(contentDir, ".spec-data", "components", "button.json"))).toBe(true);
  });

  it("preserves the existing file's status, approved_by, and name override", () => {
    write(
      ["components", "button"],
      specMd({
        hash: "OLD",
        definition: "Human def.",
        anatomy: "1. OldPart",
        extra: "status: approved\napproved_by: Alex\nname: Custom Button\n",
      }),
    );
    write(
      ["_inbox", "button"],
      specMd({ hash: "NEW", definition: "Placeholder.", anatomy: "1. NewPart" }),
    );

    updateLibrarySpecFromInbox(["_inbox", "button"], ["components", "button"]);
    const merged = fs.readFileSync(path.join(contentDir, "components", "button.md"), "utf-8");
    expect(merged).toContain("status: approved");
    expect(merged).toContain("approved_by: Alex");
    expect(merged).toContain("name: Custom Button");
  });

  it("flips an existing sync-report entry to in-sync", () => {
    write(["components", "button"], specMd({ hash: "OLD", definition: "Def.", anatomy: "1. Old" }));
    write(["_inbox", "button"], specMd({ hash: "NEW", definition: "P.", anatomy: "1. New" }));
    fs.writeFileSync(
      path.join(contentDir, ".spec-sync.json"),
      JSON.stringify({
        version: 1,
        files: {},
        specs: {
          "components/button": {
            status: "drifted",
            figmaKey: "k1",
            figmaFile: "FILE1234567",
            savedHash: "OLD",
            currentHash: "NEW",
            checkedAt: "t",
          },
        },
      }),
      "utf-8",
    );

    updateLibrarySpecFromInbox(["_inbox", "button"], ["components", "button"]);
    const report = JSON.parse(fs.readFileSync(path.join(contentDir, ".spec-sync.json"), "utf-8"));
    expect(report.specs["components/button"].status).toBe("in-sync");
    expect(report.specs["components/button"].savedHash).toBe("NEW");
  });

  it("rejects bad source/target and missing files", () => {
    expect(() => updateLibrarySpecFromInbox(["components", "x"], ["components", "y"]))
      .toThrowError(SpecUpdateError);
    expect(() => updateLibrarySpecFromInbox(["_inbox", "x"], ["_inbox", "y"]))
      .toThrowError(SpecUpdateError);
    expect(() => updateLibrarySpecFromInbox(["_inbox", ".."], ["components", "y"]))
      .toThrowError(SpecUpdateError);

    // Valid slugs but files absent → 404.
    try {
      updateLibrarySpecFromInbox(["_inbox", "missing"], ["components", "missing"]);
      expect.unreachable();
    } catch (e) {
      expect((e as SpecUpdateError).status).toBe(404);
    }
  });
});
