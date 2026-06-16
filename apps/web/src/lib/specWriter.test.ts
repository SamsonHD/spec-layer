import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IntermediateSpec } from "@spec-layer/extractor";
import {
  getInboxDir,
  readStoredSpec,
  slugify,
  writeInboxMarkdown,
  writeInboxSpec,
} from "./specWriter";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-writer-"));
  process.env.DS_CONTENT_DIR = contentDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function inboxFile(slug: string): string {
  return path.join(contentDir, "_inbox", `${slug}.md`);
}

// A minimal stand-in; readStoredSpec only round-trips JSON, so the exact
// shape is irrelevant beyond being serializable.
const fakeSpec = { component: { name: "Button" } } as unknown as IntermediateSpec;

describe("slugify", () => {
  it("kebab-cases a component name", () => {
    expect(slugify("Primary Button")).toBe("primary-button");
  });

  it("neutralizes path-traversal sequences", () => {
    expect(slugify("../../etc/passwd")).toBe("etc-passwd");
    expect(slugify("..")).toBe("");
  });
});

describe("getInboxDir", () => {
  it("creates the _inbox directory under the content dir", () => {
    const dir = getInboxDir();
    expect(dir).toBe(path.join(contentDir, "_inbox"));
    expect(fs.existsSync(dir)).toBe(true);
    expect(fs.statSync(dir).isDirectory()).toBe(true);
  });
});

describe("writeInboxSpec", () => {
  it("writes markdown under a slugified filename and returns its path/slug", () => {
    const result = writeInboxSpec("Primary Button", "# Button\n");
    expect(result.slug).toBe("primary-button");
    expect(result.path).toBe(inboxFile("primary-button"));
    expect(fs.readFileSync(result.path, "utf-8")).toBe("# Button\n");
  });

  it("falls back to 'component' when the name slugifies to nothing", () => {
    const result = writeInboxSpec("...", "# x\n");
    expect(result.slug).toBe("component");
    expect(fs.existsSync(inboxFile("component"))).toBe(true);
  });

  it("suffixes the slug to avoid clobbering an existing file", () => {
    const first = writeInboxSpec("Button", "# first\n");
    const second = writeInboxSpec("Button", "# second\n");
    const third = writeInboxSpec("Button", "# third\n");

    expect(first.slug).toBe("button");
    expect(second.slug).toBe("button-2");
    expect(third.slug).toBe("button-3");
    // The original file is never overwritten by the collision path.
    expect(fs.readFileSync(inboxFile("button"), "utf-8")).toBe("# first\n");
  });

  it("overwrites in place when overwrite: true", () => {
    writeInboxSpec("Button", "# original\n");
    const result = writeInboxSpec("Button", "# replaced\n", { overwrite: true });

    expect(result.slug).toBe("button");
    expect(fs.readFileSync(inboxFile("button"), "utf-8")).toBe("# replaced\n");
    expect(fs.existsSync(inboxFile("button-2"))).toBe(false);
  });

  it("persists a .spec-data sidecar when a spec is provided", () => {
    const result = writeInboxSpec("Button", "# Button\n", { spec: fakeSpec });
    const sidecar = path.join(contentDir, ".spec-data", "_inbox", `${result.slug}.json`);
    expect(fs.existsSync(sidecar)).toBe(true);
    expect(JSON.parse(fs.readFileSync(sidecar, "utf-8"))).toEqual(fakeSpec);
  });

  it("writes no sidecar when no spec is provided", () => {
    const result = writeInboxSpec("Button", "# Button\n");
    const sidecar = path.join(contentDir, ".spec-data", "_inbox", `${result.slug}.json`);
    expect(fs.existsSync(sidecar)).toBe(false);
  });
});

describe("writeInboxMarkdown", () => {
  it("writes markdown without a sidecar even when collisions occur", () => {
    const first = writeInboxMarkdown("Button", "# a\n");
    const second = writeInboxMarkdown("Button", "# b\n");

    expect(first.slug).toBe("button");
    expect(second.slug).toBe("button-2");
    expect(
      fs.existsSync(path.join(contentDir, ".spec-data", "_inbox", "button.json")),
    ).toBe(false);
  });
});

describe("readStoredSpec", () => {
  it("round-trips a persisted spec", () => {
    const { slug } = writeInboxSpec("Button", "# Button\n", { spec: fakeSpec });
    expect(readStoredSpec(["_inbox", slug])).toEqual(fakeSpec);
  });

  it("returns null when no sidecar exists", () => {
    expect(readStoredSpec(["_inbox", "missing"])).toBeNull();
  });

  it("returns null for an unreadable/corrupt sidecar instead of throwing", () => {
    const dir = path.join(contentDir, ".spec-data", "_inbox");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "broken.json"), "{ not json", "utf-8");
    expect(readStoredSpec(["_inbox", "broken"])).toBeNull();
  });
});
