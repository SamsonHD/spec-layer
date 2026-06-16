import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { SyncReport } from "@/lib/sync";
import SyncPage from "./page";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-sync-page-"));
  process.env.DS_CONTENT_DIR = contentDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function writeReport(report: SyncReport): void {
  fs.writeFileSync(path.join(contentDir, ".spec-sync.json"), JSON.stringify(report), "utf-8");
}

describe("SyncPage", () => {
  it("shows the empty state when no report exists", () => {
    const html = renderToStaticMarkup(<SyncPage />);
    expect(html).toContain("No sync checks yet");
    expect(html).toContain("Check library sync");
  });

  it("renders buckets, freshness, and undocumented from the report", () => {
    const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    writeReport({
      version: 1,
      files: {
        FILE1: {
          checkedAt: old,
          scannedCount: 3,
          newInFigma: [{ figmaKey: "kn", name: "Chip" }],
        },
      },
      specs: {
        "components/button": {
          status: "drifted",
          figmaKey: "k1",
          figmaFile: "FILE1",
          savedHash: "h1",
          currentHash: "h2",
          checkedAt: old,
        },
        "components/card": {
          status: "missing-in-figma",
          figmaKey: "k2",
          figmaFile: "FILE1",
          savedHash: "h3",
          checkedAt: old,
        },
        "components/input": {
          status: "in-sync",
          figmaKey: "k3",
          figmaFile: "FILE1",
          savedHash: "h4",
          currentHash: "h4",
          checkedAt: old,
        },
      },
    });

    const html = renderToStaticMarkup(<SyncPage />);
    expect(html).toContain("Out of date (1)");
    expect(html).toContain("Not found in Figma (1)");
    expect(html).toContain("Undocumented in Figma (1)");
    expect(html).toContain("In sync (1)");
    expect(html).toContain("Chip");
    expect(html).toContain("run a fresh check for current status");
    expect(html).toContain("/components/components/button");
  });
});
