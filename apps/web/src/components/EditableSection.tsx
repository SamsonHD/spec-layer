"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

export interface EditableSectionData {
  heading: string;
  level: number;
  content: string;
}

type Action = "replace" | "insert" | "delete" | "reorder";

interface SectionPayload {
  slug: string[];
  action: Action;
  index: number;
  content?: string;
  heading?: string;
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
function toRawMarkdown(section: EditableSectionData): string {
  if (!section.heading) return section.content;
  const hashes = "#".repeat(section.level || 2);
  return section.content
    ? `${hashes} ${section.heading}\n\n${section.content}`
    : `${hashes} ${section.heading}`;
}

export default function EditableSection({
  section,
  index,
  total,
  slug,
  startInEdit = false,
}: {
  section: EditableSectionData;
  /** Index into the FULL body's section list — matches what the API edits. */
  index: number;
  /** Total number of sections, for enabling/disabling reorder controls. */
  total: number;
  slug: string[];
  startInEdit?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(startInEdit);
  const [draft, setDraft] = useState(section.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = section.heading || "Introduction";

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
    const ok = await run({ slug, action: "replace", index, content: draft });
    if (ok) setEditing(false);
  }

  function onCancel() {
    setDraft(section.content);
    setError(null);
    setEditing(false);
  }

  async function onDelete() {
    if (!window.confirm(`Delete the "${label}" section?`)) return;
    await run({ slug, action: "delete", index });
  }

  async function onMove(direction: -1 | 1) {
    await run({ slug, action: "reorder", index, to: index + direction });
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
            <button
              type="button"
              className="btn-link section-btn"
              onClick={() => onMove(-1)}
              disabled={busy || index === 0}
              aria-label={`Move ${label} section up`}
            >
              ↑
            </button>
            <button
              type="button"
              className="btn-link section-btn"
              onClick={() => onMove(1)}
              disabled={busy || index === total - 1}
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
          <textarea
            id={`section-editor-${index}`}
            className="section-editor-textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.max(6, draft.split("\n").length + 1)}
            disabled={busy}
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
