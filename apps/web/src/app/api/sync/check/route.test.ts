import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { OPTIONS, POST } from "./route";

const FILE = "FILE1234567";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-sync-check-"));
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
  return new NextRequest("http://localhost:3000/api/sync/check", {
    method: "POST",
    headers,
    body,
  });
}

function optionsRequest(origin: string | null = "http://localhost:3000"): NextRequest {
  const headers = new Headers();
  if (origin !== null) headers.set("origin", origin);
  return new NextRequest("http://localhost:3000/api/sync/check", { method: "OPTIONS", headers });
}

const reportPath = () => path.join(contentDir, ".spec-sync.json");

describe("POST /api/sync/check", () => {
  it("returns a CORS-readable 400 for invalid JSON", async () => {
    const res = await POST(request("{"));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
  });

  it.each(["null", "42", "[]"])("rejects a non-object body: %s", async (body) => {
    const res = await POST(request(body));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid request body" });
  });

  it.each([JSON.stringify({ components: [] }), JSON.stringify({ fileKey: "short", components: [] })])(
    "rejects a missing/invalid fileKey: %s",
    async (body) => {
      const res = await POST(request(body));
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ error: "Missing or invalid 'fileKey'" });
    },
  );

  it("rejects a non-array components", async () => {
    const res = await POST(request(JSON.stringify({ fileKey: FILE, components: {} })));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Missing or invalid 'components'" });
  });

  it("rejects a malformed component entry", async () => {
    const res = await POST(
      request(JSON.stringify({ fileKey: FILE, components: [{ figmaKey: "k1" }] })),
    );
    expect(res.status).toBe(400);
  });

  it("rejects too many components", async () => {
    const components = Array.from({ length: 5001 }, (_, i) => ({
      figmaKey: `k${i}`,
      figmaNode: "1:2",
      name: "n",
      contentHash: "h",
    }));
    const res = await POST(request(JSON.stringify({ fileKey: FILE, components })));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Too many components (max 5000)" });
  });

  it("rejects a 415 non-JSON content type", async () => {
    const res = await POST(
      request(JSON.stringify({ fileKey: FILE, components: [] }), { contentType: "text/plain" }),
    );
    expect(res.status).toBe(415);
    expect(fs.existsSync(reportPath())).toBe(false);
  });

  it("rejects cross-origin without writing a report", async () => {
    const res = await POST(
      request(JSON.stringify({ fileKey: FILE, components: [] }), { origin: "https://evil.com" }),
    );
    expect(res.status).toBe(403);
    expect(fs.existsSync(reportPath())).toBe(false);
  });

  it("accepts the plugin's null origin and writes the report", async () => {
    writeDoc(["components", "button"], "k1", "h1");
    const res = await POST(
      request(
        JSON.stringify({
          fileKey: FILE,
          components: [
            { figmaKey: "k1", figmaNode: "1:2", name: "Button", contentHash: "h2" },
            { figmaKey: "knew", figmaNode: "3:4", name: "Chip", contentHash: "hx" },
          ],
        }),
        { origin: "null" },
      ),
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      ok: true,
      fileKey: FILE,
      summary: { inSync: 0, drifted: 1, missingInFigma: 0, newInFigma: 1 },
    });
    const report = JSON.parse(fs.readFileSync(reportPath(), "utf-8"));
    expect(report.specs["components/button"].status).toBe("drifted");
    expect(report.files[FILE].newInFigma).toEqual([{ figmaKey: "knew", name: "Chip" }]);
  });

  it("allows same-origin and no-origin CORS preflight", () => {
    expect(OPTIONS(optionsRequest()).status).toBe(204);
    expect(OPTIONS(optionsRequest()).headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
    expect(OPTIONS(optionsRequest(null)).status).toBe(204);
  });
});
