"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface MoveResponse {
  ok?: boolean;
  slug?: string[];
  error?: string;
}

export default function InboxFileForm({
  fromSlug,
  initialName,
  groupOptions,
}: {
  fromSlug: string[];
  initialName: string;
  groupOptions: string[];
}) {
  const router = useRouter();
  const [group, setGroup] = useState(groupOptions[0] ?? "");
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const datalistId = useMemo(() => `group-options-${fromSlug.join("-")}`, [fromSlug]);

  async function onFileIt() {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/specs/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromSlug, group, name }),
      });
      const data = (await res.json()) as MoveResponse;
      if (!res.ok || !data.ok || !Array.isArray(data.slug) || data.slug.length === 0) {
        setError(data.error ?? "Could not file this draft.");
        return;
      }
      router.push(`/components/${data.slug.join("/")}`);
      router.refresh();
    } catch {
      setError("Could not file this draft.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inbox-file-form">
      <label>
        Group
        <input
          value={group}
          list={datalistId}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="forms"
          disabled={busy}
        />
      </label>
      <datalist id={datalistId}>
        {groupOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Button"
          disabled={busy}
        />
      </label>
      <button className="btn-primary" onClick={onFileIt} disabled={busy}>
        {busy ? "Filing..." : "File it"}
      </button>
      {error && <div className="inbox-item-error">{error}</div>}
    </div>
  );
}
