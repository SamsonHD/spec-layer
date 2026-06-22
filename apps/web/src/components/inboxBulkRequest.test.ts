import { describe, expect, it } from "vitest";
import { formatBulkFailures } from "./inboxBulkRequest";

const items = [{ name: "Button", slug: ["_inbox", "button"] }];

describe("formatBulkFailures", () => {
  it("maps failures to component names with a slug fallback", () => {
    expect(
      formatBulkFailures(
        [
          { source: ["_inbox", "button"], error: "Destination file already exists" },
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
