import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxSaveAll, { formatInboxFailures } from "./InboxSaveAll";

const items = [{ name: "Button", slug: ["_inbox", "button"] }];

describe("InboxSaveAll", () => {
  it("renders the Save All action for the selected folder", () => {
    const html = renderToStaticMarkup(<InboxSaveAll items={items} folder="Forms" />);

    expect(html).toContain("Save All");
    expect(html).not.toContain("Folder");
    expect(html).not.toContain("inbox-save-errors");
  });

  it("formats failures with component names and a slug fallback", () => {
    expect(
      formatInboxFailures(
        [
          {
            source: ["_inbox", "button"],
            error: "Destination file already exists",
          },
          { source: ["_inbox", "unknown"], error: "Source file not found" },
        ],
        items,
      ),
    ).toEqual([
      "Button: Destination file already exists",
      "unknown: Source file not found",
    ]);
  });
});
