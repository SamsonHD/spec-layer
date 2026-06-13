"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { IntermediateSpec } from "@spec-layer/extractor";
import SpecsTab from "./SpecsTab";

interface FigmaRefProp {
  fileKey: string;
  nodeId: string;
}

type TabId = "guidelines" | "specs";

export default function ComponentTabs({
  slug,
  guidelinesMarkdown,
  specsMarkdownFallback,
  spec,
  figmaRef,
}: {
  slug: string[];
  guidelinesMarkdown: string;
  specsMarkdownFallback: string;
  spec: IntermediateSpec | null;
  figmaRef?: FigmaRefProp;
}) {
  const [active, setActive] = useState<TabId>("guidelines");

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
        {guidelinesMarkdown.trim() ? (
          <article className="md">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
            >
              {guidelinesMarkdown}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="empty-state">
            <p>No written guidance yet. Add prose to the Definition, Code, Accessibility, or Do&apos;s &amp; Don&apos;ts sections.</p>
          </div>
        )}
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
