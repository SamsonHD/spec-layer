import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  enrichSpecFile,
  NoStoredSpecError,
  NoApiKeyError,
  type EnrichDeps,
} from "./guidelineFillFile";

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

## Anatomy

1. container

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._`;

const STORED_SPEC = {
  name: "Badge",
  figmaKey: "KEY1",
  figmaFile: "FILE1",
  figmaNode: "1:2",
  anatomy: [{ name: "container", nested: false }],
  props: [],
  variants: [],
  states: [],
  tokens: [],
  layout: [],
  related: [],
  gaps: [],
};

const API_RESPONSE = JSON.stringify({
  definition: "A badge shows a count.",
  accessibility: "Expose the count.",
  dos: ["Keep it short"],
  donts: ["Don't overuse"],
});

let dir: string;
const slug = ["_inbox", "badge"];

function makeDeps(over: Partial<EnrichDeps> = {}): EnrichDeps {
  return {
    apiKey: "sk-test",
    fetcher: vi.fn(async () => ({
      ok: true,
      json: async () => ({ content: [{ text: API_RESPONSE }] }),
    })) as unknown as typeof fetch,
    cacheStore: { get: vi.fn(async () => null), set: vi.fn(async () => {}) },
    resolveImageUrl: vi.fn(async () => "https://figma/img.png"),
    ...over,
  };
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "enrich-"));
  process.env.DS_CONTENT_DIR = dir;
  const filePath = path.join(dir, "_inbox", "badge.md");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${FRONTMATTER}\n\n${BODY}\n`, "utf-8");
  const sidecar = path.join(dir, ".spec-data", "_inbox", "badge.json");
  fs.mkdirSync(path.dirname(sidecar), { recursive: true });
  fs.writeFileSync(sidecar, JSON.stringify(STORED_SPEC), "utf-8");
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

function read(): string {
  return fs.readFileSync(path.join(dir, "_inbox", "badge.md"), "utf-8");
}

describe("enrichSpecFile", () => {
  it("fills empty guideline sections and preserves frontmatter byte-for-byte", async () => {
    const result = await enrichSpecFile(slug, { target: "empty" }, makeDeps());
    expect(result.filled.sort()).toEqual(["Accessibility", "Definition", "Do's & Don'ts"]);
    expect(result.usedVisual).toBe(true);
    const raw = read();
    expect(raw.startsWith(FRONTMATTER)).toBe(true);
    expect(raw).toContain("A badge shows a count.");
    expect(raw).toContain("- ✅ Keep it short");
    // non-guideline section untouched
    expect(raw).toContain("## Anatomy\n\n1. container");
  });

  it("passes the resolved image to the model and reports usedVisual", async () => {
    const fetcher = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const sent = JSON.parse(String(init?.body)) as {
        messages: Array<{ content: unknown }>;
      };
      // The real (image) turn is last; few-shot exemplar turns precede it.
      expect(Array.isArray(sent.messages[sent.messages.length - 1].content)).toBe(true);
      return { ok: true, json: async () => ({ content: [{ text: API_RESPONSE }] }) };
    }) as unknown as typeof fetch;
    const result = await enrichSpecFile(slug, { target: "empty" }, makeDeps({ fetcher }));
    expect(result.usedVisual).toBe(true);
  });

  it("falls back to text-only when no image resolves", async () => {
    const result = await enrichSpecFile(
      slug,
      { target: "empty" },
      makeDeps({ resolveImageUrl: vi.fn(async () => null) }),
    );
    expect(result.usedVisual).toBe(false);
    expect(read()).toContain("A badge shows a count.");
  });

  it("falls back to text-only when image resolution throws", async () => {
    const result = await enrichSpecFile(
      slug,
      { target: "empty" },
      makeDeps({ resolveImageUrl: vi.fn(async () => { throw new Error("figma down"); }) }),
    );
    expect(result.usedVisual).toBe(false);
  });

  it("throws NoStoredSpecError when no extraction sidecar exists", async () => {
    fs.rmSync(path.join(dir, ".spec-data"), { recursive: true, force: true });
    await expect(
      enrichSpecFile(slug, { target: "empty" }, makeDeps()),
    ).rejects.toBeInstanceOf(NoStoredSpecError);
  });

  it("throws NoApiKeyError when no API key is configured", async () => {
    await expect(
      enrichSpecFile(slug, { target: "empty" }, makeDeps({ apiKey: null })),
    ).rejects.toBeInstanceOf(NoApiKeyError);
  });

  it("regenerates only the targeted section", async () => {
    const result = await enrichSpecFile(slug, { target: "Definition" }, makeDeps());
    expect(result.filled).toEqual(["Definition"]);
    const raw = read();
    expect(raw).toContain("A badge shows a count.");
    // other guideline sections left as placeholders on a targeted regen
    expect(raw).toContain("## Accessibility\n\n_To be written._");
  });

  it("bypasses cached prose for a targeted regeneration", async () => {
    const cacheStore = {
      get: vi.fn(async () => JSON.stringify({
        definition: "Cached definition.",
        accessibility: "Cached accessibility.",
        dos: [],
        donts: [],
      })),
      set: vi.fn(async () => {}),
    };

    await enrichSpecFile(slug, { target: "Definition" }, makeDeps({ cacheStore }));

    expect(cacheStore.get).not.toHaveBeenCalled();
    expect(read()).toContain("A badge shows a count.");
    expect(read()).not.toContain("Cached definition.");
  });

  it("rejects a stale write when the markdown changes during generation", async () => {
    const humanBody = BODY.replace("_To be written._", "Human edit made while AI was running.");
    const fetcher = vi.fn(async () => {
      fs.writeFileSync(
        path.join(dir, "_inbox", "badge.md"),
        `${FRONTMATTER}\n\n${humanBody}\n`,
        "utf-8",
      );
      return { ok: true, json: async () => ({ content: [{ text: API_RESPONSE }] }) };
    }) as unknown as typeof fetch;

    await expect(
      enrichSpecFile(slug, { target: "Definition" }, makeDeps({ fetcher })),
    ).rejects.toThrow(/changed since AI generation started/i);

    expect(read()).toContain("Human edit made while AI was running.");
    expect(read()).not.toContain("A badge shows a count.");
  });
});
