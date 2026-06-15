import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SectionSkeleton from "./SectionSkeleton";

const countLines = (html: string) => (html.match(/skeleton-line/g) ?? []).length;

describe("SectionSkeleton", () => {
  it("renders an accessible busy status", () => {
    const html = renderToStaticMarkup(<SectionSkeleton />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
  });

  it("defaults to three shimmer lines", () => {
    expect(countLines(renderToStaticMarkup(<SectionSkeleton />))).toBe(3);
  });

  it("renders the requested number of lines", () => {
    expect(countLines(renderToStaticMarkup(<SectionSkeleton lines={5} />))).toBe(5);
  });

  it("includes the busy label text for screen readers", () => {
    const html = renderToStaticMarkup(<SectionSkeleton label="Generating Definition…" />);
    expect(html).toContain("Generating Definition…");
  });
});
