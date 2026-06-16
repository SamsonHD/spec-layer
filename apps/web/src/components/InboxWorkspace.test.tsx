import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxWorkspace from "./InboxWorkspace";

const items = [
  {
    name: "Button",
    slug: ["_inbox", "button"],
    issueCount: 0,
    missingRequiredCount: 0,
  },
];

describe("InboxWorkspace", () => {
  it("renders the top action row with search, destination, and selection-driven bulk actions", () => {
    const html = renderToStaticMarkup(
      <InboxWorkspace items={items} folderOptions={["Forms"]} />,
    );

    expect(html).toContain('type="search"');
    expect(html).toContain('aria-label="Destination folder"');
    expect(html).toContain('value="Components"');
    expect(html).toContain('value="Forms"');
    expect(html).toContain("Add guidelines");
    expect(html).toContain(">Save<");
    expect(html).toContain(">Delete<");
  });

  it("disables bulk actions and prompts to select when nothing is selected", () => {
    const html = renderToStaticMarkup(
      <InboxWorkspace items={items} folderOptions={[]} />,
    );

    expect(html).toContain("Select components to enable bulk actions.");
    // All three bulk buttons start disabled.
    expect(html.match(/disabled=""/g)?.length).toBeGreaterThanOrEqual(3);
  });
});
