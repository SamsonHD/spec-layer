import { afterEach, describe, expect, it, vi } from "vitest";
import { clearInboxItems } from "./inboxClearRequest";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("clearInboxItems", () => {
  it("POSTs the slugs as items and returns the parsed body with httpOk", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, deleted: [["_inbox", "button"]], failures: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await clearInboxItems([["_inbox", "button"]]);

    expect(fetchMock).toHaveBeenCalledWith("/api/specs/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [["_inbox", "button"]] }),
    });
    expect(result).toEqual({
      httpOk: true,
      data: { ok: true, deleted: [["_inbox", "button"]], failures: [] },
    });
  });

  it("surfaces a non-ok HTTP response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Items must be a non-empty array" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await clearInboxItems([]);

    expect(result.httpOk).toBe(false);
    expect(result.data).toEqual({ error: "Items must be a non-empty array" });
  });
});
