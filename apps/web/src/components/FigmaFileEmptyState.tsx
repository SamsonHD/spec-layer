"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Shown in the Specs tab when the spec sidecar has no usable Figma file key
 * (the plugin couldn't read figma.fileKey when this spec was extracted).
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
        <strong>Connect this component to Figma</strong>
        <p>
          The plugin didn&apos;t capture a Figma file key. Paste the Figma file
          URL (or key) to fetch variant previews directly from Figma.
        </p>
      </div>
      <div className="figma-file-empty-row">
        <input
          type="text"
          placeholder="https://www.figma.com/design/…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={saving}
        />
        <button
          className="btn-primary"
          onClick={save}
          disabled={saving || !value.trim()}
        >
          {saving ? "Saving…" : "Connect"}
        </button>
      </div>
      {error && <div className="figma-file-empty-error">{error}</div>}
    </div>
  );
}
