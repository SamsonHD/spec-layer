import { describe, expect, it } from "vitest";

import { navigateToInboxAfterImport } from "./ManualImport";
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

describe("navigateToInboxAfterImport", () => {
  it("navigates to inbox before refreshing the route data on the next tick", () => {
    const calls: string[] = [];
    const scheduled: Array<() => void> = [];
    const router = {
      push: (href: string) => calls.push(`push:${href}`),
      refresh: () => calls.push("refresh"),
    };

    navigateToInboxAfterImport(router, (callback) => {
      scheduled.push(callback);
    });

    expect(calls).toEqual(["push:/inbox"]);
    expect(scheduled).toHaveLength(1);

    scheduled[0]();

    expect(calls).toEqual(["push:/inbox", "refresh"]);
  });
});
