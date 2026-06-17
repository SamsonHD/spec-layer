import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { SpecDiff } from "@/lib/specDiff";
import SpecChanges from "./SpecChanges";

describe("SpecChanges", () => {
  it("renders nothing when unchanged", () => {
    const diff: SpecDiff = { sections: [], unchanged: true };
    expect(renderToStaticMarkup(<SpecChanges diff={diff} />)).toBe("");
  });

  it("renders a summary, the preserve note, and add/del lines", () => {
    const diff: SpecDiff = {
      unchanged: false,
      sections: [
        {
          heading: "Anatomy",
          change: "changed",
          lines: [
            { type: "context", text: "1. Container" },
            { type: "add", text: "3. Icon" },
            { type: "del", text: "2. OldLabel" },
          ],
        },
      ],
    };
    const html = renderToStaticMarkup(<SpecChanges diff={diff} />);
    expect(html).toContain("What changed in Figma");
    expect(html).toContain("Anatomy changed");
    expect(html).toContain("are kept"); // judgment-preserved note
    expect(html).toContain("diff-add");
    expect(html).toContain("diff-del");
    expect(html).toContain("3. Icon");
  });
});
