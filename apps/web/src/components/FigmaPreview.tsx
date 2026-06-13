"use client";

import { useEffect, useState } from "react";

interface FigmaRefProp {
  fileKey: string;
  nodeId: string;
}

interface State {
  status: "loading" | "ok" | "no-token" | "bad-url" | "error";
  imageUrl?: string;
  message?: string;
}

/** Build a figma.com deep-link from a structured ref (used when only figmaRef is known). */
function figmaHref(figmaUrl?: string, figmaRef?: FigmaRefProp): string {
  if (figmaUrl) return figmaUrl;
  if (figmaRef) {
    const nodeParam = figmaRef.nodeId.replace(/:/g, "-");
    return `https://www.figma.com/file/${figmaRef.fileKey}?node-id=${nodeParam}`;
  }
  return "#";
}

export default function FigmaPreview({
  figmaUrl,
  figmaRef,
  onEdit,
  onRemove,
}: {
  /** Legacy figma.com URL (also used as the "Open in Figma" href when present). */
  figmaUrl?: string;
  /** Structured ref from spec-layer frontmatter; preferred over parsing figmaUrl. */
  figmaRef?: FigmaRefProp;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  const [state, setState] = useState<State>({ status: "loading" });

  // Prefer figmaRef for the API call; fall back to figmaUrl.
  const apiUrl = figmaRef
    ? `/api/figma-preview?fileKey=${encodeURIComponent(figmaRef.fileKey)}&nodeId=${encodeURIComponent(figmaRef.nodeId)}`
    : figmaUrl
      ? `/api/figma-preview?url=${encodeURIComponent(figmaUrl)}`
      : null;

  useEffect(() => {
    if (!apiUrl) {
      setState({ status: "bad-url", message: "No Figma reference provided." });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    fetch(apiUrl)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setState(d as State);
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", message: "request failed" });
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const openHref = figmaHref(figmaUrl, figmaRef);
  const failed = state.status === "error" || state.status === "bad-url";
  const hasActions = !!(onEdit || onRemove);

  return (
    <div className="figma-hero">
      <div className="hero-bar">
        <span>Figma preview</span>
        {/* In the failed state, actions live in the body (with context), so the
            hero bar stays empty — avoids two competing sets of buttons. */}
        {!failed && (
          <span className="hero-actions">
            {onEdit && (
              <button className="hero-action-btn" onClick={onEdit}>
                Edit
              </button>
            )}
            {onRemove && (
              <button className="hero-action-btn" onClick={onRemove}>
                Remove
              </button>
            )}
            <a href={openHref} target="_blank" rel="noreferrer">
              Open in Figma ↗
            </a>
          </span>
        )}
      </div>

      <div className="hero-body">
        {state.status === "loading" && <div className="figma-fallback">Loading preview…</div>}

        {state.status === "ok" && state.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={state.imageUrl} alt="Figma component preview" />
        )}

        {state.status === "no-token" && (
          <div className="figma-fallback">
            Live preview disabled.
            <br />
            Set <code>FIGMA_TOKEN</code> to render the component from Figma.
          </div>
        )}

        {failed && (
          <div className="figma-error">
            <div className="figma-error-title">
              {state.status === "bad-url"
                ? "This isn't a valid Figma link"
                : `Couldn't load this Figma preview${state.message ? ` (${state.message})` : ""}`}
            </div>
            <div className="figma-error-hint">
              {state.status === "bad-url"
                ? "The link needs to be a figma.com URL that includes a node-id."
                : "The node may have been deleted or moved, or the token may not have access to this file."}
            </div>
            {hasActions && (
              <div className="figma-error-actions">
                {onEdit && (
                  <button className="btn-primary" onClick={onEdit}>
                    Edit link
                  </button>
                )}
                {onRemove && (
                  <button className="btn-link" onClick={onRemove}>
                    Remove
                  </button>
                )}
                <a href={openHref} target="_blank" rel="noreferrer">
                  Open in Figma ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
