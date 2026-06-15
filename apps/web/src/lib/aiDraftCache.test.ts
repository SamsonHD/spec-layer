import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { contentHash, type IntermediateSpec, type ProseDrafts } from "@spec-layer/extractor";
import { createSpecCache } from "./specCache";
import { readCachedDrafts } from "./aiDraftCache";

const SPEC = {
  name: "Badge",
  figmaKey: "KEY1",
  figmaFile: "FILE1",
  figmaNode: "1:2",
  anatomy: [],
  props: [],
  variants: [],
  states: [],
  tokens: [],
  layout: [],
  related: [],
  gaps: [],
} as unknown as IntermediateSpec;

const DRAFT: ProseDrafts = {
  definition: "A badge.",
  accessibility: "A11y.",
  dos: ["Do"],
  donts: ["Don't"],
};

let dir: string;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-draft-"));
  // Nest content under the temp dir so the sibling .spec-cache lands inside it.
  process.env.DS_CONTENT_DIR = path.join(dir, "content");
  fs.mkdirSync(process.env.DS_CONTENT_DIR, { recursive: true });
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("readCachedDrafts", () => {
  it("returns nothing when the cache is empty", async () => {
    expect(await readCachedDrafts(SPEC)).toEqual([]);
  });

  it("reads a text-only cached draft", async () => {
    const cache = createSpecCache();
    await cache.set(`prose:${contentHash(SPEC)}`, JSON.stringify(DRAFT));
    const drafts = await readCachedDrafts(SPEC);
    expect(drafts).toHaveLength(1);
    expect(drafts[0].definition).toBe("A badge.");
  });

  it("reads both the text-only and vision variants when present", async () => {
    const cache = createSpecCache();
    await cache.set(`prose:${contentHash(SPEC)}`, JSON.stringify(DRAFT));
    await cache.set(`prose:${contentHash(SPEC)}:img`, JSON.stringify({ ...DRAFT, definition: "Vision badge." }));
    const drafts = await readCachedDrafts(SPEC);
    expect(drafts.map((d) => d.definition).sort()).toEqual(["A badge.", "Vision badge."]);
  });

  it("ignores a malformed cache entry", async () => {
    const cache = createSpecCache();
    await cache.set(`prose:${contentHash(SPEC)}`, "not json");
    expect(await readCachedDrafts(SPEC)).toEqual([]);
  });
});
