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
  options: { contentType?: string; origin?: string | null } = {},
): NextRequest {
  const headers = new Headers({
    "content-type": options.contentType ?? "application/json",
  });
  if (options.origin !== null) {
    headers.set("origin", options.origin ?? "http://localhost:3000");
  }
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
  it("rejects a cross-origin preflight", async () => {
    const response = OPTIONS(optionsRequest("https://example.com"));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Origin not allowed" });
  });

  it("allows same-origin and no-origin preflight", () => {
    expect(OPTIONS(optionsRequest("http://localhost:3000")).status).toBe(204);
    expect(OPTIONS(optionsRequest(null)).status).toBe(204);
  });
});
