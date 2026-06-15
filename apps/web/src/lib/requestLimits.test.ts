import { describe, expect, it } from "vitest";
import { assertContentLength, PayloadTooLargeError } from "./requestLimits";

describe("assertContentLength", () => {
  it("rejects a declared body larger than the route limit", () => {
    expect(() => assertContentLength(new Headers({ "content-length": "101" }), 100)).toThrow(
      PayloadTooLargeError,
    );
  });

  it("accepts absent, invalid, and in-range content lengths", () => {
    expect(() => assertContentLength(new Headers(), 100)).not.toThrow();
    expect(() => assertContentLength(new Headers({ "content-length": "invalid" }), 100)).not.toThrow();
    expect(() => assertContentLength(new Headers({ "content-length": "100" }), 100)).not.toThrow();
  });
});
