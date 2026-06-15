import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxClearAll from "./InboxClearAll";

describe("InboxClearAll", () => {
  it("renders an enabled Clear all action when items exist", () => {
    const html = renderToStaticMarkup(
      <InboxClearAll items={[{ name: "Button", slug: ["_inbox", "button"] }]} />,
    );

    expect(html).toContain("Clear All");
    expect(html).toContain('class="btn-secondary inbox-clear-all"');
    expect(html).not.toContain("disabled");
    expect(html).not.toContain("inbox-save-errors");
  });

  it("disables the action when there are no items", () => {
    const html = renderToStaticMarkup(<InboxClearAll items={[]} />);

    expect(html).toContain("Clear All");
    expect(html).toContain("disabled");
  });
});
