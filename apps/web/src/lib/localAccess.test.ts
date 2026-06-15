import { afterEach, describe, expect, it } from "vitest";
import { authorizeLocalRequest } from "./localAccess";

function request(headers: Record<string, string> = {}, url = "http://localhost:3000/api/settings") {
  return { headers: new Headers(headers), url };
}

afterEach(() => {
  delete process.env.SPEC_LAYER_TOKEN;
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

  it("requires a bearer token for opaque plugin origins", () => {
    process.env.SPEC_LAYER_TOKEN = "local-secret";

    expect(
      authorizeLocalRequest(request({ host: "localhost:3000", origin: "null" })),
    ).toMatchObject({ ok: false, status: 401 });
    expect(
      authorizeLocalRequest(
        request({
          host: "localhost:3000",
          origin: "null",
          authorization: "Bearer local-secret",
        }),
      ),
    ).toEqual({ ok: true, origin: "null" });
  });

  it("requires a bearer token for configured cross-origin clients", () => {
    process.env.SPEC_LAYER_TOKEN = "local-secret";
    process.env.SPEC_LAYER_ALLOWED_ORIGINS = "https://plugin.example";

    expect(
      authorizeLocalRequest(
        request({ host: "localhost:3000", origin: "https://plugin.example" }),
      ),
    ).toMatchObject({ ok: false, status: 401 });
    expect(
      authorizeLocalRequest(
        request({
          host: "localhost:3000",
          origin: "https://plugin.example",
          authorization: "Bearer local-secret",
        }),
      ),
    ).toEqual({ ok: true, origin: "https://plugin.example" });
  });

  it("does not accept malformed or prefix-matching bearer values", () => {
    process.env.SPEC_LAYER_TOKEN = "local-secret";

    for (const authorization of [
      "local-secret",
      "Bearer local",
      "Bearer local-secret-extra",
      "Basic local-secret",
    ]) {
      expect(
        authorizeLocalRequest(
          request({ host: "localhost:3000", origin: "null", authorization }),
        ),
      ).toMatchObject({ ok: false, status: 401 });
    }
  });
});
