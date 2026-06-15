import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxComponentList from "./InboxComponentList";

const items = [
  { name: "Button", slug: ["_inbox", "button"] },
  { name: "Input", slug: ["_inbox", "input"] },
];

describe("InboxComponentList", () => {
  it("renders each component name with a Delete control", () => {
    const html = renderToStaticMarkup(<InboxComponentList items={items} />);

    expect(html).toContain("View component names");
    expect(html).toContain("Button");
    expect(html).toContain("Input");
    expect(html.match(/inbox-delete-item/g)?.length).toBe(2);
    expect(html).toContain(">Delete<");
  });
});
