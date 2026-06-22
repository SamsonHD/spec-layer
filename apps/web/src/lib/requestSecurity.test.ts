import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  validateBrowserJsonMutationRequest,
  validateJsonMutationRequest,
  validateSameOriginRequest,
} from "./requestSecurity";

function request(
  options: {
    contentType?: string | null;
    origin?: string | null;
    host?: string;
    contentLength?: string;
  } = {},
): NextRequest {
  const headers = new Headers({ host: options.host ?? "localhost:3000" });
  if (options.contentType !== null) {
    headers.set("content-type", options.contentType ?? "application/json");
  }
  if (options.origin !== null) {
    headers.set("origin", options.origin ?? "http://localhost:3000");
  }
  if (options.contentLength) headers.set("content-length", options.contentLength);
  return new NextRequest("http://localhost:3000/api/specs/clear", {
    method: "POST",
    headers,
  });
}

afterEach(() => {
  delete process.env.SPEC_LAYER_ALLOWED_HOSTS;
  delete process.env.SPEC_LAYER_ALLOWED_ORIGINS;
});

describe("validateSameOriginRequest", () => {
  it("allows a same-origin localhost request", () => {
    expect(validateSameOriginRequest(request())).toBeNull();
  });

  it("allows the Figma plugin's opaque 'null' origin", () => {
    expect(validateSameOriginRequest(request({ origin: "null" }))).toBeNull();
  });

  it("rejects a non-local host with 403", () => {
    expect(
      validateSameOriginRequest(request({ host: "attacker.example", origin: null })),
    ).toEqual({ error: "Request host is not allowed", status: 403 });
  });

  it("maps a cross-origin rejection to the public 'Origin not allowed' message", () => {
    expect(
      validateSameOriginRequest(request({ origin: "https://evil.example" })),
    ).toEqual({ error: "Origin not allowed", status: 403 });
  });
});

describe("validateJsonMutationRequest", () => {
  it("passes a well-formed same-origin JSON request", () => {
    expect(validateJsonMutationRequest(request())).toBeNull();
  });

  it("rejects a missing or non-JSON content type with 415 before any other check", () => {
    // Wrong content type AND a disallowed origin: 415 must win because it is
    // checked first.
    expect(
      validateJsonMutationRequest(
        request({ contentType: "text/plain", origin: "https://evil.example" }),
      ),
    ).toEqual({ error: "Content-Type must be application/json", status: 415 });

    expect(validateJsonMutationRequest(request({ contentType: null }))).toEqual({
      error: "Content-Type must be application/json",
      status: 415,
    });
  });

  it("accepts a content type with parameters (charset)", () => {
    expect(
      validateJsonMutationRequest(request({ contentType: "application/json; charset=utf-8" })),
    ).toBeNull();
  });

  it("is case-insensitive about the media type", () => {
    expect(
      validateJsonMutationRequest(request({ contentType: "APPLICATION/JSON" })),
    ).toBeNull();
  });

  it("enforces the origin check after the content-type check passes", () => {
    expect(
      validateJsonMutationRequest(request({ origin: "https://evil.example" })),
    ).toEqual({ error: "Origin not allowed", status: 403 });
  });

  it("does not enforce a size limit when maxBytes is omitted", () => {
    expect(
      validateJsonMutationRequest(request({ contentLength: String(10_000_000) })),
    ).toBeNull();
  });

  it("rejects an oversized declared body with 413 when maxBytes is set", () => {
    expect(
      validateJsonMutationRequest(request({ contentLength: String(2048) }), 1024),
    ).toEqual({ error: "Request body exceeds 1024 bytes", status: 413 });
  });

  it("allows a body within the declared limit", () => {
    expect(
      validateJsonMutationRequest(request({ contentLength: String(512) }), 1024),
    ).toBeNull();
  });

  it("checks origin before payload size (403 beats 413)", () => {
    expect(
      validateJsonMutationRequest(
        request({ origin: "https://evil.example", contentLength: String(99_999) }),
        1024,
      ),
    ).toEqual({ error: "Origin not allowed", status: 403 });
  });
});

describe("validateBrowserJsonMutationRequest", () => {
  it("passes a same-origin JSON request", () => {
    expect(validateBrowserJsonMutationRequest(request())).toBeNull();
  });

  it("passes when no Origin header is present", () => {
    expect(
      validateBrowserJsonMutationRequest(request({ origin: null })),
    ).toBeNull();
  });

  it("rejects the Figma plugin's opaque null origin", () => {
    expect(
      validateBrowserJsonMutationRequest(request({ origin: "null" })),
    ).toEqual({ error: "Origin not allowed", status: 403 });
  });

  it("rejects a configured cross-origin client", () => {
    process.env.SPEC_LAYER_ALLOWED_ORIGINS = "https://plugin.example";

    expect(
      validateBrowserJsonMutationRequest(request({ origin: "https://plugin.example" })),
    ).toEqual({ error: "Origin not allowed", status: 403 });
  });
});
