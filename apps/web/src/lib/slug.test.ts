import { describe, expect, it } from "vitest";
import { toKebab } from "./slug";

describe("toKebab", () => {
  it("lowercases and hyphenates whitespace", () => {
    expect(toKebab("Primary Button")).toBe("primary-button");
    expect(toKebab("  Spaced   Out  ")).toBe("spaced-out");
  });

  it("collapses separators (slash, backslash, comma, equals) into single hyphens", () => {
    expect(toKebab("a/b\\c,d=e")).toBe("a-b-c-d-e");
    expect(toKebab("a///b")).toBe("a-b");
  });

  it("strips characters that are not a-z, 0-9, or hyphen", () => {
    expect(toKebab("Button!@#$%^&*()")).toBe("button");
    expect(toKebab("emoji-😀-name")).toBe("emoji-name");
  });

  it("trims leading and trailing hyphens", () => {
    expect(toKebab("--leading")).toBe("leading");
    expect(toKebab("trailing--")).toBe("trailing");
    expect(toKebab("__weird__")).toBe("weird");
  });

  // Security: the nav routes feed user-supplied labels straight to the
  // filesystem via this function. A path-traversal sequence must never
  // survive as a usable path segment.
  it("neutralizes path-traversal sequences", () => {
    expect(toKebab("../../etc/passwd")).toBe("etc-passwd");
    expect(toKebab("..")).toBe("");
    expect(toKebab("../")).toBe("");
    expect(toKebab("..\\..\\windows")).toBe("windows");
  });

  it("never yields a segment containing a path separator", () => {
    for (const input of ["a/b", "a\\b", "../x", "..\\x", "/etc/passwd", "C:\\Users"]) {
      const out = toKebab(input);
      expect(out).not.toContain("/");
      expect(out).not.toContain("\\");
    }
  });

  it("never yields a literal dot segment", () => {
    expect(toKebab(".")).toBe("");
    expect(toKebab("...")).toBe("");
    expect(toKebab("a.b.c")).toBe("abc");
  });

  it("returns an empty string for input with no usable characters", () => {
    expect(toKebab("")).toBe("");
    expect(toKebab("   ")).toBe("");
    expect(toKebab("!!!")).toBe("");
  });
});
