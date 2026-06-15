import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as inboxMove from "@/lib/inboxMove";
import { OPTIONS, POST } from "./route";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-clear-route-"));
  process.env.DS_CONTENT_DIR = contentDir;
  fs.mkdirSync(path.join(contentDir, "_inbox"), { recursive: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.DS_CONTENT_DIR;
  delete process.env.SPEC_LAYER_TOKEN;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function request(
  body: string,
  options: {
    contentType?: string;
    origin?: string | null;
    host?: string;
    authorization?: string;
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
  if (options.authorization) headers.set("authorization", options.authorization);
  if (options.contentLength) headers.set("content-length", options.contentLength);
  return new NextRequest("http://localhost:3000/api/specs/clear", {
    method: "POST",
    headers,
    body,
  });
}

function optionsRequest(origin: string | null = "http://localhost:3000"): NextRequest {
  const headers = new Headers();
  if (origin !== null) headers.set("origin", origin);
  return new NextRequest("http://localhost:3000/api/specs/clear", {
    method: "OPTIONS",
    headers,
  });
}

function markdownPath(slug: string[]): string {
  return path.join(contentDir, ...slug) + ".md";
}

function writeInbox(name: string): void {
  fs.writeFileSync(markdownPath(["_inbox", name]), `# ${name}\n`, "utf-8");
}

describe("POST /api/specs/clear", () => {
  it("rejects a non-local Host without deleting files", async () => {
    writeInbox("button");

    const response = await POST(request(
      JSON.stringify({ items: [["_inbox", "button"]] }),
      { origin: null, host: "attacker.example" },
    ));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request host is not allowed",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("allows an opaque local client with the configured bearer token", async () => {
    process.env.SPEC_LAYER_TOKEN = "local-secret";
    writeInbox("button");

    const response = await POST(request(
      JSON.stringify({ items: [["_inbox", "button"]] }),
      { origin: "null", authorization: "Bearer local-secret" },
    ));

    expect(response.status).toBe(200);
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
  });

  it("rejects an oversized declared body without deleting files", async () => {
    writeInbox("button");

    const response = await POST(request(
      JSON.stringify({ items: [["_inbox", "button"]] }),
      { contentLength: String(65 * 1024) },
    ));

    expect(response.status).toBe(413);
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("returns a CORS-readable 400 for invalid JSON", async () => {
    const response = await POST(request("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
  });

  it.each(["null", "42", "[]"])("rejects a non-object JSON body: %s", async (body) => {
    const response = await POST(request(body));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid request body" });
  });

  it("maps empty items to the top-level InboxMoveError status", async () => {
    const response = await POST(request(JSON.stringify({ items: [] })));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Items must be a non-empty array",
    });
  });

  it("deletes the requested items", async () => {
    writeInbox("button");

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] })),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      deleted: [["_inbox", "button"]],
      failures: [],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
  });

  it("returns item failures while deleting valid items", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        JSON.stringify({ items: [["_inbox", "button"], ["components", "outside"]] }),
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      deleted: [["_inbox", "button"]],
      failures: [
        {
          source: ["components", "outside"],
          error: "Source must be a component directly inside _inbox",
        },
      ],
    });
  });

  it("rejects cross-origin JSON without deleting files", async () => {
    writeInbox("button");

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] }), {
        origin: "https://example.com",
      }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Origin not allowed" });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("rejects a non-JSON content type without deleting files", async () => {
    writeInbox("button");

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] }), {
        contentType: "text/plain",
      }),
    );

    expect(response.status).toBe(415);
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("returns a stable 500 for an unknown top-level error", async () => {
    vi.spyOn(inboxMove, "clearInboxSpecs").mockImplementationOnce(() => {
      throw new Error("internal path details");
    });

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] })),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to clear Inbox items",
    });
  });

  it("allows same-origin and no-origin CORS preflight", () => {
    const response = OPTIONS(optionsRequest());
    const noOriginResponse = OPTIONS(optionsRequest(null));

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
    expect(response.headers.get("access-control-allow-methods")).toBe("GET, POST, OPTIONS");
    expect(noOriginResponse.status).toBe(204);
  });

  it.each(["https://example.com", "null"])(
    "does not allow disallowed CORS preflight origin %s",
    (origin) => {
      const response = OPTIONS(optionsRequest(origin));

      expect(response.status).toBe(204);
      expect(response.headers.get("access-control-allow-origin")).toBe(
        origin === "null" ? "null" : null,
      );
    },
  );
});
