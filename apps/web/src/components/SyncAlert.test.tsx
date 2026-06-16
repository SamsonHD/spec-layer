import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { SyncSpecEntry } from "@/lib/sync";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import SyncAlert from "./SyncAlert";

const recent = new Date().toISOString();
const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

function entry(over: Partial<SyncSpecEntry> = {}): SyncSpecEntry {
  return {
    status: "drifted",
    figmaKey: "k1",
    figmaFile: "FILE",
    savedHash: "h1",
    currentHash: "h2",
    checkedAt: recent,
    ...over,
  };
}

describe("SyncAlert", () => {
  it("renders nothing for null or in-sync", () => {
    expect(renderToStaticMarkup(<SyncAlert status={null} />)).toBe("");
    expect(renderToStaticMarkup(<SyncAlert status={entry({ status: "in-sync" })} />)).toBe("");
  });

  it("renders an out-of-date banner for drifted, with the extracted date", () => {
    const html = renderToStaticMarkup(
      <SyncAlert status={entry()} extractedAt="2026-06-10T00:00:00Z" />,
    );
    expect(html).toContain("Out of date with Figma");
    expect(html).toContain("Jun 10, 2026");
    expect(html).toContain("View all changes");
    expect(html).toContain("⚠");
    expect(html).not.toContain("run a fresh check");
  });

  it("adds the fresh-check note when the check is stale", () => {
    const html = renderToStaticMarkup(
      <SyncAlert status={entry({ checkedAt: old })} extractedAt="2026-06-10T00:00:00Z" />,
    );
    expect(html).toContain("run a fresh check for current status");
  });

  it("offers a one-click Update when a matching inbox draft is waiting", () => {
    const html = renderToStaticMarkup(
      <SyncAlert
        status={entry()}
        slug={["components", "button"]}
        updateSource={["_inbox", "button"]}
      />,
    );
    expect(html).toContain("Update from Figma");
    expect(html).toContain("A re-extracted draft is waiting in the inbox");
    expect(html).not.toContain("Re-extract it in the Figma plugin");
  });

  it("falls back to plugin guidance when no draft is waiting", () => {
    const html = renderToStaticMarkup(<SyncAlert status={entry()} />);
    expect(html).toContain("Re-extract it in the Figma plugin");
    expect(html).not.toContain("Update from Figma");
  });

  it("renders a not-found banner for missing-in-figma", () => {
    const html = renderToStaticMarkup(
      <SyncAlert status={entry({ status: "missing-in-figma", currentHash: undefined })} />,
    );
    expect(html).toContain("Not found in Figma");
    expect(html).toContain("⊘");
  });
});
