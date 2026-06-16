import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { OPTIONS, POST } from "./route";

const FILE = "FILE1234567";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-sync-lookup-"));
  process.env.DS_CONTENT_DIR = contentDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function writeDoc(slug: string[], figmaKey: string, hash: string): void {
  const file = path.join(contentDir, ...slug) + ".md";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    [
      "---",
      'spec_version: "0.1"',
      "component:",
      `  name: ${slug[slug.length - 1]}`,
      `  figma_key: ${figmaKey}`,
      `  figma_file: ${FILE}`,
      "  figma_node: 1:2",
      `  content_hash: ${hash}`,
      `content_hash: ${hash}`,
      'extracted_at: "2026-06-10T00:00:00Z"',
      "---",
      "",
      "## Definition",
      "",
      "Body.",
    ].join("\n"),
    "utf-8",
  );
}

function request(
  body: string,
  options: { contentType?: string; origin?: string | null } = {},
): NextRequest {
  const headers = new Headers({ "content-type": options.contentType ?? "application/json" });
  if (options.origin !== null) headers.set("origin", options.origin ?? "http://localhost:3000");
  return new NextRequest("http://localhost:3000/api/sync/lookup", { method: "POST", headers, body });
}

function optionsRequest(origin: string | null = "http://localhost:3000"): NextRequest {
  const headers = new Headers();
  if (origin !== null) headers.set("origin", origin);
  return new NextRequest("http://localhost:3000/api/sync/lookup", { method: "OPTIONS", headers });
}

describe("POST /api/sync/lookup", () => {
  it("rejects invalid JSON and missing fields", async () => {
    expect((await POST(request("{"))).status).toBe(400);
    expect((await POST(request(JSON.stringify({ contentHash: "h" })))).status).toBe(400);
    expect((await POST(request(JSON.stringify({ figmaKey: "k" })))).status).toBe(400);
  });

  it("rejects cross-origin", async () => {
    const res = await POST(
      request(JSON.stringify({ figmaKey: "k1", contentHash: "h1" }), { origin: "https://evil.com" }),
    );
    expect(res.status).toBe(403);
  });

  it("returns in-sync / drifted / absent", async () => {
    writeDoc(["components", "button"], "k1", "h1");

    await expect(
      (await POST(request(JSON.stringify({ figmaKey: "k1", contentHash: "h1" }), { origin: "null" }))).json(),
    ).resolves.toEqual({ status: "in-sync", slug: ["components", "button"] });

    await expect(
      (await POST(request(JSON.stringify({ figmaKey: "k1", contentHash: "h2" }), { origin: "null" }))).json(),
    ).resolves.toEqual({ status: "drifted", slug: ["components", "button"] });

    await expect(
      (await POST(request(JSON.stringify({ figmaKey: "nope", contentHash: "h1" }), { origin: "null" }))).json(),
    ).resolves.toEqual({ status: "absent" });
  });

  it("allows same-origin and no-origin CORS preflight", () => {
    expect(OPTIONS(optionsRequest()).status).toBe(204);
    expect(OPTIONS(optionsRequest(null)).status).toBe(204);
  });
});
