import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const execFileSync = vi.hoisted(() =>
  vi.fn(() => Buffer.from("2026-06-14T09:00:00.000Z\n")),
);

vi.mock("node:child_process", () => ({ execFileSync }));

import { getAllDocs, getDoc, getNavTree } from "./content";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-content-performance-"));
  process.env.DS_CONTENT_DIR = tmpDir;
  execFileSync.mockClear();

  fs.writeFileSync(
    path.join(tmpDir, "button.md"),
    `---
name: Button
---

## Definition

A button.
`,
  );
  fs.writeFileSync(
    path.join(tmpDir, "input.md"),
    `---
name: Input
---

## Definition

An input.
`,
  );
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("content timestamps", () => {
  it("does not run git history lookups while listing all docs", () => {
    const docs = getAllDocs();

    expect(docs).toHaveLength(2);
    expect(docs.every((doc) => doc.updated === null)).toBe(true);
    expect(execFileSync).not.toHaveBeenCalled();
  });

  it("loads git history for the single doc detail that displays updated", () => {
    const doc = getDoc(["button"]);

    expect(doc?.updated).toBe("2026-06-14T09:00:00.000Z");
    expect(execFileSync).toHaveBeenCalledTimes(1);
  });
});

describe("navigation snapshots", () => {
  it("builds navigation from a supplied bulk-read snapshot", () => {
    const docs = getAllDocs();
    fs.writeFileSync(
      path.join(tmpDir, "button.md"),
      `---
name: Renamed After Read
---

## Definition

A button.
`,
    );

    const nav = getNavTree(docs);
    const button = nav.find((node) => node.slug.join("/") === "button");

    expect(button?.name).toBe("Button");
  });
});
