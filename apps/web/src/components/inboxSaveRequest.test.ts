import { afterEach, describe, expect, it, vi } from "vitest";
import { saveInboxItem } from "./inboxSaveRequest";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("saveInboxItem", () => {
  it("saves one item to the shared destination folder using its current slug name", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, slug: ["forms", "button"] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await saveInboxItem(
      { name: "Button", slug: ["_inbox", "button"] },
      "Forms",
    );

    expect(fetchMock).toHaveBeenCalledWith("/api/specs/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromSlug: ["_inbox", "button"],
        group: "Forms",
        name: "button",
      }),
    });
  });
});
