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
  it("renders one destination field and the reorganized bulk actions without metrics", () => {
    const html = renderToStaticMarkup(
      <InboxWorkspace items={items} folderOptions={["Forms"]} />,
    );

    expect(html).toContain("Destination folder");
    expect(html).toContain('value="Components"');
    expect(html).toContain('value="Forms"');
    expect(html).toContain("Fill Guidelines with AI");
    expect(html).toContain("Save All");
    expect(html).toContain("Clear All");
    expect(html).not.toContain("Imported</dt>");
    expect(html).not.toContain("With issues");
    expect(html).not.toContain("Missing required");
  });
});
