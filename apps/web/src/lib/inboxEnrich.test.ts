import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { enrichInboxSpecs } from "./inboxEnrich";
import type { EnrichDeps } from "./guidelineFillFile";

const FRONTMATTER = `---
spec_version: "0.1"
component:
  name: Badge
  figma_key: KEY1
  figma_file: FILE1
  figma_node: 1:2
content_hash: abc
extracted_at: 2026-06-15T00:00:00.000Z
---`;

const BODY = `## Definition

_To be written._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._`;

const STORED_SPEC = {
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
};

const API_RESPONSE = JSON.stringify({
  definition: "A badge.",
  accessibility: "A11y.",
  dos: ["Do"],
  donts: ["Don't"],
});

let dir: string;

function deps(): EnrichDeps {
  return {
    apiKey: "sk-test",
    fetcher: vi.fn(async () => ({
      ok: true,
      json: async () => ({ content: [{ text: API_RESPONSE }] }),
    })) as unknown as typeof fetch,
    cacheStore: { get: vi.fn(async () => null), set: vi.fn(async () => {}) },
    resolveImageUrl: vi.fn(async () => null),
  };
}

function writeInboxSpec(name: string, withSidecar: boolean): void {
  const md = path.join(dir, "_inbox", `${name}.md`);
  fs.mkdirSync(path.dirname(md), { recursive: true });
  fs.writeFileSync(md, `${FRONTMATTER}\n\n${BODY}\n`, "utf-8");
  if (withSidecar) {
    const sidecar = path.join(dir, ".spec-data", "_inbox", `${name}.json`);
    fs.mkdirSync(path.dirname(sidecar), { recursive: true });
    fs.writeFileSync(sidecar, JSON.stringify(STORED_SPEC), "utf-8");
  }
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "inbox-enrich-"));
  process.env.DS_CONTENT_DIR = dir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("enrichInboxSpecs", () => {
  it("rejects a non-array or empty items list", async () => {
    await expect(enrichInboxSpecs([], deps())).rejects.toThrow();
    await expect(enrichInboxSpecs("nope", deps())).rejects.toThrow();
  });

  it("rejects items that are not directly inside _inbox", async () => {
    writeInboxSpec("badge", true);
    const result = await enrichInboxSpecs([["components", "badge"]], deps());
    expect(result.enriched).toEqual([]);
    expect(result.failures).toHaveLength(1);
  });

  it("isolates failures so one bad item does not abort the batch", async () => {
    writeInboxSpec("ok", true);
    writeInboxSpec("nospec", false); // no sidecar → fails
    const result = await enrichInboxSpecs(
      [["_inbox", "ok"], ["_inbox", "nospec"]],
      deps(),
    );
    expect(result.enriched).toHaveLength(1);
    expect(result.enriched[0].slug).toEqual(["_inbox", "ok"]);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].source).toEqual(["_inbox", "nospec"]);
  });

  it("runs provider work concurrently with a maximum of four active items", async () => {
    const items = Array.from({ length: 7 }, (_, index) => ["_inbox", `item-${index}`]);
    for (const [, name] of items) writeInboxSpec(name, true);

    let active = 0;
    let maxActive = 0;
    const dependencies = deps();
    dependencies.fetcher = vi.fn(async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active -= 1;
      return {
        ok: true,
        json: async () => ({ content: [{ text: API_RESPONSE }] }),
      };
    }) as unknown as typeof fetch;

    const result = await enrichInboxSpecs(items, dependencies);

    expect(result.enriched).toHaveLength(7);
    expect(maxActive).toBeGreaterThan(1);
    expect(maxActive).toBeLessThanOrEqual(4);
  });

  it("prefetches one shared image resolver for the batch", async () => {
    writeInboxSpec("one", true);
    writeInboxSpec("two", true);
    const dependencies = deps();
    const fallbackResolver = vi.fn(async () => null);
    const batchResolver = vi.fn(async (_specs: unknown[]) => vi.fn(async () => null));
    dependencies.resolveImageUrl = fallbackResolver;
    dependencies.resolveImageUrls = batchResolver;

    await enrichInboxSpecs(
      [["_inbox", "one"], ["_inbox", "two"]],
      dependencies,
    );

    expect(batchResolver).toHaveBeenCalledOnce();
    expect(batchResolver.mock.calls[0][0]).toHaveLength(2);
    expect(fallbackResolver).not.toHaveBeenCalled();
  });
});
