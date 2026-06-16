import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxComponentList from "./InboxComponentList";

const items = [
  {
    name: "Button",
    slug: ["_inbox", "button"],
    issueCount: 0,
    missingRequiredCount: 0,
  },
  {
    name: "Input",
    slug: ["_inbox", "input"],
    issueCount: 1,
    missingRequiredCount: 2,
  },
];

describe("InboxComponentList", () => {
  it("renders all rows with search, open, save, status, and delete controls", () => {
    const html = renderToStaticMarkup(
      <InboxComponentList items={items} folder="Components" />,
    );

    expect(html).toContain("Imported components");
    expect(html).toContain('type="search"');
    expect(html).not.toContain("Filter imported components");
    expect(html).not.toContain("All 2");
    expect(html).toContain("Button");
    expect(html).toContain("Input");
    expect(html).toContain("Ready");
    expect(html).toContain("1 issue · 2 missing sections");
    expect(html).toContain('href="/components/_inbox/button"');
    expect(html).toContain('href="/components/_inbox/input"');
    expect(html.match(/>Open</g)?.length).toBe(2);
    expect(html.match(/>Save</g)?.length).toBe(2);
    expect(html.match(/inbox-delete-item/g)?.length).toBe(2);
    expect(html).toContain(">Delete<");
  });

  it("shows Update (not Save) for a draft that matches a library spec", () => {
    const html = renderToStaticMarkup(
      <InboxComponentList
        items={[
          {
            name: "Button",
            slug: ["_inbox", "button"],
            issueCount: 0,
            missingRequiredCount: 0,
            update: { targetSlug: ["components", "button"], targetName: "Button" },
          },
        ]}
        folder="Components"
      />,
    );

    expect(html).toContain(">Update<");
    expect(html).not.toContain(">Save<");
    expect(html).toContain("Updates components / button");
  });
});
