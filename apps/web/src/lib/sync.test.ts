import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ComponentDoc } from "./content";
import {
  SYNC_REPORT_VERSION,
  type SyncComponentFingerprint,
  type SyncReport,
  computeFileSync,
  getSpecSyncStatus,
  lookupSpecByFigmaKey,
  readSyncReport,
  writeSyncReport,
} from "./sync";

const ZERO_HASH = "0".repeat(64);

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-sync-"));
  process.env.DS_CONTENT_DIR = contentDir;
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function doc(
  slug: string[],
  opts: { figmaKey?: string; fileKey?: string; hash?: string } = {},
): ComponentDoc {
  const { figmaKey = "key", fileKey = "FILE", hash = "h1" } = opts;
  return {
    slug,
    filePath: slug.join("/") + ".md",
    frontmatter: {
      name: slug[slug.length - 1],
      contentHash: hash,
      figmaKey,
      figmaRef: fileKey ? { fileKey, nodeId: "1:2" } : undefined,
    },
    body: "",
    updated: null,
    sections: [],
    missingRequired: [],
    isSpecLayer: true,
    issues: [],
  };
}

function fp(
  figmaKey: string,
  contentHash: string,
  name = figmaKey,
): SyncComponentFingerprint {
  return { figmaKey, figmaNode: "1:2", name, contentHash };
}

describe("computeFileSync", () => {
  const NOW = "2026-06-16T18:00:00.000Z";

  it("marks a matching, equal-hash spec in-sync", () => {
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h1")],
      [doc(["components", "button"], { figmaKey: "k1", hash: "h1" })],
      null,
      NOW,
    );
    expect(report.specs["components/button"]).toEqual({
      status: "in-sync",
      figmaKey: "k1",
      figmaFile: "FILE",
      savedHash: "h1",
      currentHash: "h1",
      checkedAt: NOW,
    });
  });

  it("marks a matching, differing-hash spec drifted", () => {
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h2")],
      [doc(["components", "button"], { figmaKey: "k1", hash: "h1" })],
      null,
      NOW,
    );
    expect(report.specs["components/button"]).toMatchObject({
      status: "drifted",
      savedHash: "h1",
      currentHash: "h2",
    });
  });

  it("marks an eligible spec missing-in-figma when its key is absent", () => {
    const report = computeFileSync(
      "FILE",
      [fp("other", "h9")],
      [doc(["components", "button"], { figmaKey: "k1", hash: "h1" })],
      null,
      NOW,
    );
    expect(report.specs["components/button"]).toEqual({
      status: "missing-in-figma",
      figmaKey: "k1",
      figmaFile: "FILE",
      savedHash: "h1",
      checkedAt: NOW,
    });
  });

  it("does not evaluate specs from a different figma_file", () => {
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h1")],
      [doc(["components", "other"], { figmaKey: "k1", fileKey: "OTHER", hash: "h1" })],
      null,
      NOW,
    );
    expect(report.specs["components/other"]).toBeUndefined();
  });

  it("excludes zero-hash and keyless specs", () => {
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h1")],
      [
        doc(["components", "hand"], { figmaKey: "k1", hash: ZERO_HASH }),
        doc(["components", "nokey"], { figmaKey: "", hash: "h1" }),
      ],
      null,
      NOW,
    );
    expect(report.specs["components/hand"]).toBeUndefined();
    expect(report.specs["components/nokey"]).toBeUndefined();
  });

  it("never evaluates inbox docs", () => {
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h1")],
      [doc(["_inbox", "button"], { figmaKey: "k1", hash: "h1" })],
      null,
      NOW,
    );
    expect(report.specs["_inbox/button"]).toBeUndefined();
  });

  it("lists components with no matching spec as newInFigma", () => {
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h1", "Button"), fp("knew", "hx", "Chip")],
      [doc(["components", "button"], { figmaKey: "k1", hash: "h1" })],
      null,
      NOW,
    );
    expect(report.files.FILE.newInFigma).toEqual([{ figmaKey: "knew", name: "Chip" }]);
    expect(report.files.FILE.scannedCount).toBe(2);
  });

  it("does not list a component as new when another file's spec claims its key", () => {
    const report = computeFileSync(
      "FILE",
      [fp("kshared", "h1", "Shared")],
      [doc(["components", "shared"], { figmaKey: "kshared", fileKey: "OTHER", hash: "h1" })],
      null,
      NOW,
    );
    expect(report.files.FILE.newInFigma).toEqual([]);
  });

  it("merges without clobbering entries for other files", () => {
    const prior: SyncReport = {
      version: SYNC_REPORT_VERSION,
      files: { OTHER: { checkedAt: "old", scannedCount: 1, newInFigma: [] } },
      specs: {
        "components/other": {
          status: "drifted",
          figmaKey: "ko",
          figmaFile: "OTHER",
          savedHash: "a",
          currentHash: "b",
          checkedAt: "old",
        },
      },
    };
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h1")],
      [doc(["components", "button"], { figmaKey: "k1", hash: "h1" })],
      prior,
      NOW,
    );
    expect(report.specs["components/other"]).toBe(prior.specs["components/other"]);
    expect(report.files.OTHER).toBe(prior.files.OTHER);
    expect(report.specs["components/button"].status).toBe("in-sync");
  });

  it("drops stale entries for the rechecked file", () => {
    const prior: SyncReport = {
      version: SYNC_REPORT_VERSION,
      files: { FILE: { checkedAt: "old", scannedCount: 2, newInFigma: [] } },
      specs: {
        "components/gone": {
          status: "drifted",
          figmaKey: "kg",
          figmaFile: "FILE",
          savedHash: "a",
          currentHash: "b",
          checkedAt: "old",
        },
      },
    };
    const report = computeFileSync("FILE", [], [], prior, NOW);
    expect(report.specs["components/gone"]).toBeUndefined();
  });
});

describe("lookupSpecByFigmaKey", () => {
  const docs = [doc(["components", "button"], { figmaKey: "k1", hash: "h1" })];

  it("returns in-sync on a hash match", () => {
    expect(lookupSpecByFigmaKey("k1", "h1", docs)).toEqual({
      status: "in-sync",
      slug: ["components", "button"],
    });
  });

  it("returns drifted on a hash mismatch", () => {
    expect(lookupSpecByFigmaKey("k1", "h2", docs)).toEqual({
      status: "drifted",
      slug: ["components", "button"],
    });
  });

  it("returns absent when no eligible spec has the key", () => {
    expect(lookupSpecByFigmaKey("nope", "h1", docs)).toEqual({ status: "absent" });
    expect(
      lookupSpecByFigmaKey("k1", "h1", [
        doc(["components", "button"], { figmaKey: "k1", hash: ZERO_HASH }),
      ]),
    ).toEqual({ status: "absent" });
  });
});

describe("readSyncReport / writeSyncReport", () => {
  it("returns null when no report exists", () => {
    expect(readSyncReport()).toBeNull();
  });

  it("round-trips a written report", () => {
    const report = computeFileSync(
      "FILE",
      [fp("k1", "h2")],
      [doc(["components", "button"], { figmaKey: "k1", hash: "h1" })],
      null,
      "2026-06-16T18:00:00.000Z",
    );
    writeSyncReport(report);
    expect(readSyncReport()).toEqual(report);
    expect(getSpecSyncStatus(["components", "button"])?.status).toBe("drifted");
    expect(getSpecSyncStatus(["components", "missing"])).toBeNull();
  });

  it("returns null for a corrupt or version-mismatched report", () => {
    fs.writeFileSync(path.join(contentDir, ".spec-sync.json"), "{ not json", "utf-8");
    expect(readSyncReport()).toBeNull();
    fs.writeFileSync(
      path.join(contentDir, ".spec-sync.json"),
      JSON.stringify({ version: 999, files: {}, specs: {} }),
      "utf-8",
    );
    expect(readSyncReport()).toBeNull();
  });
});
