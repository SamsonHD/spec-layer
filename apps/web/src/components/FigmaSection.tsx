"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FigmaPreview from "./FigmaPreview";
import FigmaFileEmptyState from "./FigmaFileEmptyState";

/** Sentinel produced by the plugin when figma.fileKey is unavailable. */
const UNKNOWN_FILE_KEY = "unknown";

interface FigmaRefProp {
  fileKey: string;
  nodeId: string;
}

function looksLikeFigmaNode(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.includes("figma.com") && !!u.searchParams.get("node-id");
  } catch {
    return false;
  }
}

export default function FigmaSection({
  slug,
  figma,
  figmaRef,
  editable = true,
}: {
  slug: string[];
  figma?: string;
  /** Structured ref from spec-layer frontmatter; preferred over figma URL. */
  figmaRef?: FigmaRefProp;
  /** When false (approved specs), show a clean read-only preview with no
   *  edit/remove/add affordances — and nothing at all if there's no link. */
  editable?: boolean;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<string | undefined>(figma);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(figma ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = value.trim() === "" || looksLikeFigmaNode(value.trim());

  function openEditor() {
    setValue(current ?? "");
    setError(null);
    setEditing(true);
  }

  async function save(next: string | null) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/component/figma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, figma: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save.");
        setSaving(false);
        return;
      }
      setCurrent(next ?? undefined);
      setEditing(false);
      setSaving(false);
      router.refresh(); // re-render header Figma button + preview from updated frontmatter
    } catch {
      setError("Could not reach the server.");
      setSaving(false);
    }
  }

  // ---- Editor form (add or edit the manual figma URL) ----
  if (editing) {
    return (
      <div className="figma-editor">
        <div className="figma-editor-head">
          <span className="label">{current ? "Edit Figma link" : "Add Figma preview link"}</span>
        </div>
        <p className="figma-editor-sub">
          Paste a Figma component URL (must include a <code>node-id</code>). It&apos;s saved to this
          component&apos;s <code>.md</code> frontmatter.
        </p>
        <div className="figma-editor-row">
          <input
            type="url"
            placeholder="Paste a Figma component URL…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck={false}
            aria-label="Figma URL"
            autoFocus
          />
          <button
            className="btn-primary"
            disabled={saving || !value.trim() || !valid}
            onClick={() => save(value.trim())}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            className="btn-link"
            disabled={saving}
            onClick={() => {
              setValue(current ?? "");
              setEditing(false);
              setError(null);
            }}
          >
            Cancel
          </button>
        </div>
        {!valid && value.trim() !== "" && (
          <div className="figma-editor-warn">Needs to be a figma.com URL with a node-id.</div>
        )}
        {error && <div className="figma-editor-warn">{error}</div>}
      </div>
    );
  }

  // ---- Spec-layer figmaRef — only render a live preview when the key is real ----
  // When the plugin couldn't resolve figma.fileKey (unsaved/dev file), the key
  // is the sentinel "unknown". Passing that to FigmaPreview triggers a real API
  // call that returns a 404, producing a misleading "Figma API 404" error.
  // Instead we show the same FigmaFileEmptyState used by SpecsTab so the user
  // sees a clear "no source linked" prompt rather than a false failure.
  if (figmaRef) {
    const keyIsReal = figmaRef.fileKey && figmaRef.fileKey !== UNKNOWN_FILE_KEY;
    if (!keyIsReal) {
      return <FigmaFileEmptyState slug={slug} />;
    }
    return <FigmaPreview figmaRef={figmaRef} figmaUrl={current} />;
  }

  // ---- Empty state (no figmaRef, no manual link) ----
  if (!current) {
    // Readers of an approved spec don't need a prompt to add a link.
    if (!editable) return null;
    return (
      <div className="figma-empty">
        <div className="figma-empty-text">No Figma preview linked</div>
        <button className="btn-primary" onClick={openEditor}>
          + Add Figma preview link
        </button>
      </div>
    );
  }

  // ---- Preview (legacy figma URL, no spec-layer ref) ----
  // Edit/remove only in author mode; readers get a clean preview.
  return (
    <FigmaPreview
      figmaUrl={current}
      onEdit={editable ? openEditor : undefined}
      onRemove={editable ? () => save(null) : undefined}
    />
  );
}
