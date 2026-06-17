import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "./route";

let tmpDir: string;
let configPath: string;
let contentDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-settings-route-"));
  configPath = path.join(tmpDir, ".ds-config.json");
  contentDir = path.join(tmpDir, "content");
  process.env.DS_CONFIG_PATH = configPath;
  process.env.DS_CONTENT_DIR = contentDir;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.FIGMA_TOKEN;
});

afterEach(() => {
  delete process.env.DS_CONFIG_PATH;
  delete process.env.DS_CONTENT_DIR;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.FIGMA_TOKEN;
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function request(
  body: string,
  options: {
    contentType?: string;
    origin?: string | null;
    host?: string;
    contentLength?: string;
  } = {},
): NextRequest {
  const headers = new Headers({
    "content-type": options.contentType ?? "application/json",
    host: options.host ?? "localhost:3000",
  });
  if (options.origin !== null) {
    headers.set("origin", options.origin ?? "http://localhost:3000");
  }
  if (options.contentLength) headers.set("content-length", options.contentLength);
  return new NextRequest("http://localhost:3000/api/settings", {
    method: "POST",
    headers,
    body,
  });
}

function getRequest(): NextRequest {
  return new NextRequest("http://localhost:3000/api/settings", {
    method: "GET",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
    },
  });
}

function readConfig(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(configPath, "utf-8")) as Record<string, unknown>;
}

describe("GET /api/settings", () => {
  it("returns contentDir and key presence without raw key values", async () => {
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        contentDir,
        anthropicKey: "sk-ant-secret",
        figmaToken: "figd-secret",
      }),
      "utf-8",
    );

    const response = await GET(getRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      contentDir,
      keys: { anthropic: true, figma: true },
    });
    expect(JSON.stringify(body)).not.toContain("sk-ant-secret");
    expect(JSON.stringify(body)).not.toContain("figd-secret");
  });
});

describe("POST /api/settings", () => {
  it("saves provided keys and returns boolean key presence", async () => {
    const response = await POST(
      request(JSON.stringify({ anthropic: "sk-ant-test", figma: "figd-test" })),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      keys: { anthropic: true, figma: true },
    });
    expect(readConfig()).toMatchObject({
      anthropicKey: "sk-ant-test",
      figmaToken: "figd-test",
    });
  });

  it("rejects invalid key types without writing settings", async () => {
    const response = await POST(request(JSON.stringify({ anthropic: 42 })));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "'anthropic' must be a string",
    });
    expect(fs.existsSync(configPath)).toBe(false);
  });

  it("rejects a non-local Host without writing settings", async () => {
    const response = await POST(
      request(JSON.stringify({ figma: "figd-test" }), {
        origin: null,
        host: "attacker.example",
      }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request host is not allowed",
    });
    expect(fs.existsSync(configPath)).toBe(false);
  });

  it("rejects a non-JSON content type without writing settings", async () => {
    const response = await POST(
      request(JSON.stringify({ anthropic: "sk-ant-test" }), {
        contentType: "text/plain",
      }),
    );

    expect(response.status).toBe(415);
    expect(fs.existsSync(configPath)).toBe(false);
  });

  it("rejects an oversized declared body without writing settings", async () => {
    const response = await POST(
      request(JSON.stringify({ figma: "figd-test" }), {
        contentLength: String(17 * 1024),
      }),
    );

    expect(response.status).toBe(413);
    expect(fs.existsSync(configPath)).toBe(false);
  });
});
