import { describe, expect, it } from "vitest";

import { getNextImportMode } from "./manualImportTabs";

describe("getNextImportMode", () => {
  it("moves between importer tabs with horizontal arrow keys", () => {
    expect(getNextImportMode("file", "ArrowRight")).toBe("paste");
    expect(getNextImportMode("paste", "ArrowLeft")).toBe("file");
  });

  it("supports Home and End without changing mode for unrelated keys", () => {
    expect(getNextImportMode("paste", "Home")).toBe("file");
    expect(getNextImportMode("file", "End")).toBe("paste");
    expect(getNextImportMode("file", "Enter")).toBe("file");
  });
});
