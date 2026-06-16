import { afterEach, describe, expect, it, vi } from "vitest";
import { updateInboxItem } from "./inboxUpdateRequest";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("updateInboxItem", () => {
  it("POSTs the source draft and library target to /api/specs/update", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, slug: ["components", "button"] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { httpOk, data } = await updateInboxItem(["_inbox", "button"], ["components", "button"]);

    expect(fetchMock).toHaveBeenCalledWith("/api/specs/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: ["_inbox", "button"], targetSlug: ["components", "button"] }),
    });
    expect(httpOk).toBe(true);
    expect(data).toEqual({ ok: true, slug: ["components", "button"] });
  });
});
