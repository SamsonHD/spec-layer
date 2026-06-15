import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";
import { OPTIONS, POST } from "./route";

function request(options: {
  host?: string;
  origin?: string;
  contentLength?: string;
} = {}): NextRequest {
  const headers = new Headers({
    host: options.host ?? "localhost:3000",
    origin: options.origin ?? "http://localhost:3000",
    "content-type": "application/json",
  });
  if (options.contentLength) headers.set("content-length", options.contentLength);
  return new NextRequest("http://localhost:3000/api/specs/enrich-all", {
    method: "POST",
    headers,
    body: JSON.stringify({ items: [["_inbox", "button"]] }),
  });
}

afterEach(() => {
  delete process.env.ANTHROPIC_API_KEY;
});

describe("POST /api/specs/enrich-all", () => {
  it("rejects a non-local Host before creating enrichment dependencies", async () => {
    const response = await POST(request({ host: "attacker.example" }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request host is not allowed",
    });
  });

  it("rejects an oversized declared body", async () => {
    const response = await POST(request({ contentLength: String(65 * 1024) }));

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      error: "Request body exceeds 65536 bytes",
    });
  });

  it("returns a single configuration error when no Anthropic key exists", async () => {
    const response = await POST(request());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "No Anthropic API key configured; add one in Settings to use AI fill.",
    });
  });
});

describe("OPTIONS /api/specs/enrich-all", () => {
  it("returns a preflight response without allowing an unlisted origin", () => {
    const response = OPTIONS(new NextRequest(
      "http://localhost:3000/api/specs/enrich-all",
      { method: "OPTIONS", headers: { origin: "https://example.com" } },
    ));

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });
});
