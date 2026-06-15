import { afterEach, describe, expect, it } from "vitest";
import { authorizeLocalRequest } from "./localAccess";

function request(headers: Record<string, string> = {}, url = "http://localhost:3000/api/settings") {
  return { headers: new Headers(headers), url };
}

afterEach(() => {
  delete process.env.SPEC_LAYER_ALLOWED_HOSTS;
  delete process.env.SPEC_LAYER_ALLOWED_ORIGINS;
});

describe("authorizeLocalRequest", () => {
  it("allows same-origin loopback requests without exposing a token to browser code", () => {
    const result = authorizeLocalRequest(
      request({ host: "localhost:3000", origin: "http://localhost:3000" }),
    );

    expect(result).toEqual({ ok: true, origin: "http://localhost:3000" });
  });

  it("allows loopback requests without an Origin header", () => {
    expect(authorizeLocalRequest(request({ host: "127.0.0.1:3000" }))).toEqual({
      ok: true,
      origin: null,
    });
  });

  it("rejects a non-loopback Host header", () => {
    expect(authorizeLocalRequest(request({ host: "attacker.example" }))).toEqual({
      ok: false,
      status: 403,
      error: "Request host is not allowed",
    });
  });

  it("allows the Figma plugin's opaque \"null\" origin without a token", () => {
    expect(
      authorizeLocalRequest(request({ host: "localhost:3000", origin: "null" })),
    ).toEqual({ ok: true, origin: "null" });
  });

  it("allows configured cross-origin clients without a token", () => {
    process.env.SPEC_LAYER_ALLOWED_ORIGINS = "https://plugin.example";

    expect(
      authorizeLocalRequest(
        request({ host: "localhost:3000", origin: "https://plugin.example" }),
      ),
    ).toEqual({ ok: true, origin: "https://plugin.example" });
  });

  it("rejects an unlisted cross-origin client", () => {
    expect(
      authorizeLocalRequest(
        request({ host: "localhost:3000", origin: "https://evil.example" }),
      ),
    ).toEqual({
      ok: false,
      status: 403,
      error: "Request origin is not allowed",
    });
  });
});
