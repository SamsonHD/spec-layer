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

  it("allows the Figma plugin's opaque cross-origin client without a token", () => {
    const request = new NextRequest("http://localhost:3000/api/search?q=button", {
      headers: { host: "localhost:3000", origin: "null" },
    });

    expect(GET(request).status).toBe(200);
  });

  it("rejects an unlisted cross-origin client", () => {
    const request = new NextRequest("http://localhost:3000/api/search?q=button", {
      headers: { host: "localhost:3000", origin: "https://evil.example" },
    });

    expect(GET(request).status).toBe(403);
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
