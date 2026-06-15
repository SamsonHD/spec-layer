import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxSaveAll, { formatInboxFailures } from "./InboxSaveAll";

const items = [{ name: "Button", slug: ["_inbox", "button"] }];

describe("InboxSaveAll", () => {
  it("renders the default folder, existing suggestions, and Save all action", () => {
    const html = renderToStaticMarkup(
      <InboxSaveAll items={items} folderOptions={["forms"]} />,
    );

    expect(html).toContain('value="Components"');
    expect(html).toContain("Save all");
    expect(html).toContain('id="inbox-folder-options"');
    expect(html).toContain('value="forms"');
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
