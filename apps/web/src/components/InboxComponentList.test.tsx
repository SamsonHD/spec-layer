import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import InboxComponentList from "./InboxComponentList";

const items = [
  {
    name: "Button",
    slug: ["_inbox", "button"],
    source: "figma" as const,
    issueCount: 0,
    missingRequiredCount: 0,
  },
  {
    name: "Input",
    slug: ["_inbox", "forms", "input"],
    source: "local" as const,
    issueCount: 1,
    missingRequiredCount: 2,
  },
];

function renderList(overrides: Partial<React.ComponentProps<typeof InboxComponentList>> = {}) {
  return renderToStaticMarkup(
    <InboxComponentList
      items={items}
      totalCount={items.length}
      selected={new Set(["_inbox/button"])}
      selectAllState="some"
      rowBusy={null}
      disabled={false}
      onToggleRow={vi.fn()}
      onToggleAll={vi.fn()}
      onRowSave={vi.fn()}
      onRowDelete={vi.fn()}
      {...overrides}
    />,
  );
}

describe("InboxComponentList", () => {
  it("renders a table with select checkboxes, source paths, statuses, and row actions", () => {
    const html = renderList();

    expect(html).toContain("<table");
    expect(html).toContain('aria-label="Select all components"');
    expect(html).toContain('aria-label="Select Button"');
    expect(html).toContain('aria-label="Select Input"');
    expect(html).toContain(">Source<");
    expect(html).toContain("Button");
    expect(html).toContain("Input");
    expect(html).toContain("inbox-source-figma");
    expect(html).toContain(">Figma<");
    expect(html).toContain("inbox-source-local");
    expect(html).toContain(">Local<");
    expect(html).toContain("Ready");
    expect(html).toContain("Needs attention");
    expect(html).toContain("1 issue · 2 missing sections");
    expect(html).toContain('href="/components/_inbox/button"');
    expect(html).toContain('href="/components/_inbox/forms/input"');
    expect(html.match(/>Open</g)?.length).toBe(2);
    expect(html.match(/>Save</g)?.length).toBe(2);
    expect(html.match(/inbox-danger/g)?.length).toBe(2);
    expect(html).toContain(">Delete<");
  });

  it("marks selected rows and renders a checked select-all box when all are selected", () => {
    const html = renderList({
      selected: new Set(["_inbox/button", "_inbox/forms/input"]),
      selectAllState: "all",
    });

    expect(html.match(/inbox-row-selected/g)?.length).toBe(2);
  });

  it("shows an empty state with a hint that depends on the total count", () => {
    expect(renderList({ items: [], totalCount: 0 })).toContain("Inbox is empty");
    expect(renderList({ items: [], totalCount: 5 })).toContain("No matching components");
  });
});
