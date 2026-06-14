"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Shown once in the component preview area when an imported spec has no usable
 * Figma file key.
 *
 * Lets the user paste the Figma file URL; persists it to both the markdown
 * frontmatter and the .spec-data JSON sidecar so variant images can be fetched.
 */
export default function FigmaFileEmptyState({ slug }: { slug: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/specs/figma-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, fileKeyOrUrl: trimmed }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save.");
        setSaving(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setSaving(false);
    }
  }

  return (
    <div className="figma-file-empty">
      <div className="figma-file-empty-text">
        <strong>Figma previews aren&apos;t connected</strong>
        <p>
          This spec arrived without its Figma file reference. Paste the file URL
          once to restore the component and variant previews.
        </p>
      </div>
      <div className="figma-file-empty-row">
        <input
          type="text"
          placeholder="Paste the Figma file URL"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={saving}
        />
        <button
          className="btn-primary"
          onClick={save}
          disabled={saving || !value.trim()}
        >
          {saving ? "Connecting…" : "Add source"}
        </button>
      </div>
      {error && <div className="figma-file-empty-error">{error}</div>}
    </div>
  );
}
