import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  enrichSpecFile: vi.fn(),
  createEnrichDeps: vi.fn(() => ({ marker: "deps" })),
}));

vi.mock("@/lib/guidelineFillFile", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/guidelineFillFile")>();
  return { ...original, enrichSpecFile: mocks.enrichSpecFile };
});

vi.mock("@/lib/enrichDeps", () => ({
  createEnrichDeps: mocks.createEnrichDeps,
}));

import { OPTIONS, POST } from "./route";
import { StaleSpecError } from "@/lib/guidelineFillFile";

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
  return new NextRequest("http://localhost:3000/api/specs/enrich", {
    method: "POST",
    headers,
    body,
  });
}

function optionsRequest(origin: string | null): NextRequest {
  const headers = new Headers();
  if (origin !== null) headers.set("origin", origin);
  return new NextRequest("http://localhost:3000/api/specs/enrich", {
    method: "OPTIONS",
    headers,
  });
}

beforeEach(() => {
  mocks.enrichSpecFile.mockReset();
  mocks.createEnrichDeps.mockClear();
  mocks.enrichSpecFile.mockResolvedValue({ filled: ["Definition"], usedVisual: false });
});

describe("POST /api/specs/enrich", () => {
  it("rejects a non-local Host before invoking enrichment", async () => {
    const response = await POST(request(
      JSON.stringify({ slug: ["_inbox", "badge"], target: "Definition" }),
      { origin: null, host: "attacker.example" },
    ));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request host is not allowed",
    });
    expect(mocks.enrichSpecFile).not.toHaveBeenCalled();
  });

  it("rejects cross-origin JSON before invoking enrichment", async () => {
    const response = await POST(request(
      JSON.stringify({ slug: ["_inbox", "badge"], target: "Definition" }),
      { origin: "https://example.com" },
    ));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Origin not allowed" });
    expect(mocks.enrichSpecFile).not.toHaveBeenCalled();
  });

  it("rejects non-JSON content before invoking enrichment", async () => {
    const response = await POST(request(
      JSON.stringify({ slug: ["_inbox", "badge"], target: "Definition" }),
      { contentType: "text/plain" },
    ));

    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({
      error: "Content-Type must be application/json",
    });
    expect(mocks.enrichSpecFile).not.toHaveBeenCalled();
  });

  it("rejects an oversized declared body before invoking enrichment", async () => {
    const response = await POST(request(
      JSON.stringify({ slug: ["_inbox", "badge"], target: "Definition" }),
      { contentLength: String(65 * 1024) },
    ));

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      error: "Request body exceeds 65536 bytes",
    });
    expect(mocks.enrichSpecFile).not.toHaveBeenCalled();
  });

  it("allows valid same-origin JSON enrichment", async () => {
    const response = await POST(request(
      JSON.stringify({ slug: ["_inbox", "badge"], target: "Definition" }),
    ));

    expect(response.status).toBe(200);
    expect(mocks.enrichSpecFile).toHaveBeenCalledWith(
      ["_inbox", "badge"],
      { target: "Definition" },
      { marker: "deps" },
    );
  });

  it("returns 409 when the spec changes during generation", async () => {
    mocks.enrichSpecFile.mockRejectedValueOnce(new StaleSpecError());

    const response = await POST(request(
      JSON.stringify({ slug: ["_inbox", "badge"], target: "Definition" }),
    ));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Spec changed since AI generation started; refresh and try again.",
    });
  });
});

describe("OPTIONS /api/specs/enrich", () => {
  it("does not allow a cross-origin preflight", () => {
    const response = OPTIONS(optionsRequest("https://example.com"));

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("allows same-origin and no-origin preflight", () => {
    expect(OPTIONS(optionsRequest("http://localhost:3000")).status).toBe(204);
    expect(OPTIONS(optionsRequest(null)).status).toBe(204);
  });
});
