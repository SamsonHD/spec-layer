import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { OPTIONS, POST } from "./route";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-update-route-"));
  process.env.DS_CONTENT_DIR = contentDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function specMd(hash: string, definition: string, anatomy: string): string {
  return [
    "---",
    'spec_version: "0.1"',
    "component:",
    "  name: Button",
    "  figma_key: k1",
    "  figma_file: FILE1234567",
    "  figma_node: 1:2",
    `content_hash: ${hash}`,
    'extracted_at: "2026-06-16T00:00:00Z"',
    "---",
    "",
    "## Definition",
    "",
    definition,
    "",
    "## Anatomy",
    "",
    anatomy,
    "",
  ].join("\n");
}

function write(slug: string[], raw: string): void {
  const file = path.join(contentDir, ...slug) + ".md";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, raw, "utf-8");
}

function request(
  body: string,
  options: { contentType?: string; origin?: string | null } = {},
): NextRequest {
  const headers = new Headers({ "content-type": options.contentType ?? "application/json" });
  if (options.origin !== null) headers.set("origin", options.origin ?? "http://localhost:3000");
  return new NextRequest("http://localhost:3000/api/specs/update", { method: "POST", headers, body });
}

describe("POST /api/specs/update", () => {
  it("merges an inbox draft into the library target", async () => {
    write(["components", "button"], specMd("OLD", "Human def.", "1. OldPart"));
    write(["_inbox", "button"], specMd("NEW", "Placeholder.", "1. NewPart"));

    const res = await POST(
      request(JSON.stringify({ source: ["_inbox", "button"], targetSlug: ["components", "button"] })),
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, slug: ["components", "button"] });

    const merged = fs.readFileSync(path.join(contentDir, "components", "button.md"), "utf-8");
    expect(merged).toContain("Human def.");
    expect(merged).toContain("1. NewPart");
    expect(fs.existsSync(path.join(contentDir, "_inbox", "button.md"))).toBe(false);
  });

  it("returns a CORS-readable 400 for invalid JSON", async () => {
    const res = await POST(request("{"));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
  });

  it("maps SpecUpdateError status (bad source) to 400", async () => {
    const res = await POST(
      request(JSON.stringify({ source: ["components", "x"], targetSlug: ["components", "y"] })),
    );
    expect(res.status).toBe(400);
  });

  it("returns 404 when the inbox draft is missing", async () => {
    write(["components", "button"], specMd("OLD", "Def.", "1. Old"));
    const res = await POST(
      request(JSON.stringify({ source: ["_inbox", "missing"], targetSlug: ["components", "button"] })),
    );
    expect(res.status).toBe(404);
  });

  it("rejects cross-origin without writing", async () => {
    write(["components", "button"], specMd("OLD", "Def.", "1. Old"));
    write(["_inbox", "button"], specMd("NEW", "P.", "1. New"));
    const res = await POST(
      request(JSON.stringify({ source: ["_inbox", "button"], targetSlug: ["components", "button"] }), {
        origin: "https://evil.com",
      }),
    );
    expect(res.status).toBe(403);
    expect(fs.existsSync(path.join(contentDir, "_inbox", "button.md"))).toBe(true);
  });

  it("allows same-origin and no-origin CORS preflight", () => {
    const headers = new Headers({ origin: "http://localhost:3000" });
    const req = new NextRequest("http://localhost:3000/api/specs/update", { method: "OPTIONS", headers });
    expect(OPTIONS(req).status).toBe(204);
  });
});
