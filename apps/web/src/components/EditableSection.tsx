"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { Section } from "@/lib/sectionEdit";
import { isFillableGuideline, isEmptyGuideline } from "@/lib/guidelineFill";
import MarkdownEditor from "./MarkdownEditor";

type Action = "replace" | "insert" | "delete" | "reorder";

interface SectionPayload {
  slug: string[];
  action: Action;
  index: number;
  content?: string;
  heading?: string;
  /** Section heading the client believes lives at `index`, for the server's stale-index guard. */
  expectedHeading?: string;
  to?: number;
}

async function postSection(payload: SectionPayload): Promise<void> {
  const res = await fetch("/api/specs/section", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }
}

/** Reconstruct the raw markdown for a section (heading line + content). */
function toRawMarkdown(section: Section): string {
  if (!section.heading) return section.content;
  const hashes = "#".repeat(section.level || 2);
  return section.content
    ? `${hashes} ${section.heading}\n\n${section.content}`
    : `${hashes} ${section.heading}`;
}

export default function EditableSection({
  section,
  index,
  prevIndex,
  nextIndex,
  slug,
  pristine = false,
  startInEdit = false,
}: {
  section: Section;
  /** Index into the FULL body's section list — matches what the API edits. */
  index: number;
  /**
   * Full-body index of the PREVIOUS visible prose section, or `null` if this is
   * the first prose section. Reordering operates over the prose ordering the
   * user actually sees, so "move up" swaps with this neighbor (skipping any
   * hidden Specs sections that sit between them in the full body).
   */
  prevIndex: number | null;
  /** Full-body index of the NEXT visible prose section, or `null` if this is the last. */
  nextIndex: number | null;
  slug: string[];
  /** True when this guideline section still holds the pristine AI draft (hides "Regenerate"). */
  pristine?: boolean;
  startInEdit?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(startInEdit);
  const [draft, setDraft] = useState(section.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = section.heading || "Introduction";
  const canEnrich = isFillableGuideline(section.heading);
  const isEmpty = isEmptyGuideline(section.content);
  // Fill an empty section; offer Regenerate only once a human has edited the AI
  // draft. A pristine draft is hidden — regenerating it returns the same cached text.
  const showEnrich = canEnrich && (isEmpty || !pristine);

  /**
   * AI-fill this guideline section. An empty section is filled; a non-empty one
   * is regenerated (overwriting human prose), so confirm first to avoid surprise.
   */
  async function onEnrich() {
    if (!isEmpty && !window.confirm(`Replace the "${label}" section with a fresh AI draft?`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/specs/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, target: section.heading }),
      });
      if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // ignore non-JSON error bodies
        }
        throw new Error(message);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI fill failed");
    } finally {
      setBusy(false);
    }
  }

  async function run(payload: SectionPayload) {
    setBusy(true);
    setError(null);
    try {
      await postSection(payload);
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    // No-op save: nothing changed, so just close the editor without a round-trip.
    if (draft.trim() === section.content.trim()) {
      setError(null);
      setEditing(false);
      return;
    }
    const ok = await run({
      slug,
      action: "replace",
      index,
      content: draft,
      expectedHeading: section.heading,
    });
    if (ok) setEditing(false);
  }

  function onCancel() {
    setDraft(section.content);
    setError(null);
    setEditing(false);
  }

  async function onDelete() {
    if (!window.confirm(`Delete the "${label}" section?`)) return;
    await run({ slug, action: "delete", index, expectedHeading: section.heading });
  }

  /**
   * Swap this prose section with its adjacent VISIBLE prose neighbor. The target
   * is the neighbor's full-body index, so `reorderSection` swaps the two blocks
   * the user actually sees even when hidden Specs sections sit between them.
   */
  async function onMove(to: number) {
    await run({ slug, action: "reorder", index, to, expectedHeading: section.heading });
  }

  return (
    <section className="editable-section" aria-label={label}>
      <div className="editable-section-toolbar">
        {!editing && (
          <>
            <button
              type="button"
              className="btn-link section-btn"
              onClick={() => {
                setDraft(section.content);
                setEditing(true);
              }}
              aria-label={`Edit ${label} section`}
            >
              Edit
            </button>
            {showEnrich && (
              <button
                type="button"
                className="btn-link section-btn"
                onClick={onEnrich}
                disabled={busy}
                aria-label={`${isEmpty ? "Fill" : "Regenerate"} ${label} section with AI`}
              >
                {isEmpty ? "✨ Fill with AI" : "✨ Regenerate"}
              </button>
            )}
            <button
              type="button"
              className="btn-link section-btn"
              onClick={() => prevIndex !== null && onMove(prevIndex)}
              disabled={busy || prevIndex === null}
              aria-label={`Move ${label} section up`}
            >
              ↑
            </button>
            <button
              type="button"
              className="btn-link section-btn"
              onClick={() => nextIndex !== null && onMove(nextIndex)}
              disabled={busy || nextIndex === null}
              aria-label={`Move ${label} section down`}
            >
              ↓
            </button>
            <button
              type="button"
              className="btn-link section-btn section-btn-danger"
              onClick={onDelete}
              disabled={busy}
              aria-label={`Delete ${label} section`}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {editing ? (
        <div className="section-editor">
          <label className="section-editor-label" htmlFor={`section-editor-${index}`}>
            Markdown for “{label}”
          </label>
          <MarkdownEditor
            textareaId={`section-editor-${index}`}
            value={draft}
            onChange={setDraft}
            disabled={busy}
            ariaLabel={`Markdown editor for ${label} section`}
          />
          {error && <p className="section-editor-error" role="alert">{error}</p>}
          <div className="section-editor-actions">
            <button type="button" className="btn-link" onClick={onSave} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button type="button" className="btn-link" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <article className="md">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {toRawMarkdown(section)}
          </ReactMarkdown>
          {error && <p className="section-editor-error" role="alert">{error}</p>}
        </article>
      )}
    </section>
  );
}

/** Standalone "+ Add section" control that inserts a new section and refreshes. */
export function AddSectionButton({
  slug,
  index,
}: {
  slug: string[];
  /** Position to insert the new section at (typically the end of the list). */
  index: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAdd() {
    const heading = window.prompt("New section heading:", "New section");
    if (heading === null) return;
    const trimmed = heading.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    try {
      await postSection({
        slug,
        action: "insert",
        index,
        heading: trimmed,
        content: "_To be written._",
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add section");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="add-section-row">
      <button type="button" className="btn-link" onClick={onAdd} disabled={busy}>
        + Add section
      </button>
      {error && <p className="section-editor-error" role="alert">{error}</p>}
    </div>
  );
}
