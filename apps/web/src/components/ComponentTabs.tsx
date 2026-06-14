"use client";

import { useState } from "react";
import type { IntermediateSpec } from "@spec-layer/extractor";
import { splitSections } from "@/lib/sectionEdit";
import { classifyHeading } from "@/lib/sections";
import SpecsTab from "./SpecsTab";
import EditableSection, { AddSectionButton } from "./EditableSection";

interface FigmaRefProp {
  fileKey: string;
  nodeId: string;
}

type TabId = "guidelines" | "specs";

export default function ComponentTabs({
  slug,
  fullBody,
  specsMarkdownFallback,
  spec,
  figmaRef,
}: {
  slug: string[];
  /**
   * The FULL markdown body (not a partitioned subset). The Guidelines tab edits
   * prose sections inline; section indices map 1:1 to `splitSections(fullBody)`,
   * which is exactly what the /api/specs/section route operates on — so client
   * and server agree on indices and edits never hit the wrong section.
   *
   * The structured Specs-tab tables (anatomy/properties/variants/etc., rendered
   * by <SpecsTab> from the spec JSON) are intentionally left read-only in v1 —
   * inline editing is scoped to prose body sections only.
   */
  fullBody: string;
  specsMarkdownFallback: string;
  spec: IntermediateSpec | null;
  figmaRef?: FigmaRefProp;
}) {
  const [active, setActive] = useState<TabId>("guidelines");

  // Split the full body once; keep each section's TRUE full-body index so edits
  // target the right section in the real file. Only prose sections (preamble,
  // Guidelines-classified, and unknown/"other") are editable here; Specs and
  // gaps sections are surfaced read-only by SpecsTab and are skipped.
  const allSections = splitSections(fullBody);
  const proseSections = allSections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => {
      if (section.heading === "") return true; // preamble
      const bucket = classifyHeading(section.heading);
      return bucket === "guidelines" || bucket === "other";
    });

  return (
    <div className="component-tabs">
      <div className="tabs-bar" role="tablist" aria-label="Component documentation">
        <button
          role="tab"
          aria-selected={active === "guidelines"}
          className={`tab-trigger${active === "guidelines" ? " active" : ""}`}
          onClick={() => setActive("guidelines")}
        >
          Guidelines
        </button>
        <button
          role="tab"
          aria-selected={active === "specs"}
          className={`tab-trigger${active === "specs" ? " active" : ""}`}
          onClick={() => setActive("specs")}
        >
          Specs
        </button>
      </div>

      <div role="tabpanel" hidden={active !== "guidelines"} className="tab-panel">
        {proseSections.length > 0 ? (
          <div className="editable-sections">
            {proseSections.map(({ section, index }, i) => (
              <EditableSection
                key={index}
                section={section}
                index={index}
                // Reorder swaps with the adjacent VISIBLE prose section, so pass
                // the neighbor's full-body index (or null at the ends of the
                // prose list). This skips hidden Specs sections that sit between
                // prose blocks in the full body.
                prevIndex={i > 0 ? proseSections[i - 1].index : null}
                nextIndex={i < proseSections.length - 1 ? proseSections[i + 1].index : null}
                slug={slug}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No written guidance yet. Add prose to the Definition, Code, Accessibility, or Do&apos;s &amp; Don&apos;ts sections.</p>
          </div>
        )}
        {/* Insert at the end of the full body so new sections append after all
            existing content (including the Specs sections that live in the same file). */}
        <AddSectionButton slug={slug} index={allSections.length} />
      </div>

      <div role="tabpanel" hidden={active !== "specs"} className="tab-panel">
        <SpecsTab
          slug={slug}
          spec={spec}
          fallbackMarkdown={specsMarkdownFallback}
          figmaRef={figmaRef}
        />
      </div>
    </div>
  );
}
