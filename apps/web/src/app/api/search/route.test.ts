import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("search API authorization", () => {
  it("rejects requests with a non-local Host header", async () => {
    const request = new NextRequest("http://localhost:3000/api/search?q=button", {
      headers: { host: "example.com" },
    });

    const response = GET(request);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request host is not allowed",
    });
  });

  it("requires the local token for opaque cross-origin clients", () => {
    vi.stubEnv("SPEC_LAYER_TOKEN", "expected-token");
    const request = new NextRequest("http://localhost:3000/api/search?q=button", {
      headers: { host: "localhost:3000", origin: "null" },
    });

    expect(GET(request).status).toBe(401);
  });

  it("allows same-origin browser requests without a bearer token", () => {
    const request = new NextRequest("http://localhost:3000/api/search?q=x", {
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000",
      },
    });

    expect(GET(request).status).toBe(200);
  });
});
