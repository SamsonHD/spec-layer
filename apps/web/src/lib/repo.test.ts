import { describe, expect, it } from "vitest";
import { normalizeRemote } from "./repo";

describe("normalizeRemote", () => {
  it("normalizes scp-style git remotes", () => {
    expect(normalizeRemote("git@github.com:SamsonHD/spec-layer.git")).toBe(
      "https://github.com/SamsonHD/spec-layer",
    );
  });

  it("strips the trailing .git from https remotes", () => {
    expect(normalizeRemote("https://github.com/SamsonHD/spec-layer.git")).toBe(
      "https://github.com/SamsonHD/spec-layer",
    );
  });

  it("converts ssh:// remotes to https", () => {
    expect(normalizeRemote("ssh://git@github.com/owner/repo.git")).toBe(
      "https://github.com/owner/repo",
    );
  });

  it("removes embedded credentials from https remotes", () => {
    expect(normalizeRemote("https://token@github.com/owner/repo.git")).toBe(
      "https://github.com/owner/repo",
    );
  });

  it("leaves a clean https url untouched", () => {
    expect(normalizeRemote("https://gitlab.com/team/project")).toBe(
      "https://gitlab.com/team/project",
    );
  });
});
