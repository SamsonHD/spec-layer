import { describe, expect, it } from "vitest";
import { parseFigmaUrl } from "./figma";

describe("parseFigmaUrl", () => {
  it("accepts HTTPS links on exact Figma hosts", () => {
    expect(
      parseFigmaUrl("https://www.figma.com/design/ABCDEFGHIJ/Test?node-id=1-23"),
    ).toEqual({ fileKey: "ABCDEFGHIJ", nodeId: "1:23" });
    expect(
      parseFigmaUrl("https://figma.com/file/ABCDEFGHIJ/Test?node-id=2-34"),
    ).toEqual({ fileKey: "ABCDEFGHIJ", nodeId: "2:34" });
  });

  it("rejects deceptive hosts and non-HTTPS schemes", () => {
    for (const value of [
      "https://figma.com.evil.example/file/ABCDEFGHIJ/Test?node-id=1-23",
      "https://notfigma.com/file/ABCDEFGHIJ/Test?node-id=1-23",
      "http://www.figma.com/file/ABCDEFGHIJ/Test?node-id=1-23",
      "javascript://figma.com/file/ABCDEFGHIJ/Test?node-id=1-23",
    ]) {
      expect(parseFigmaUrl(value)).toBeNull();
    }
  });
});
