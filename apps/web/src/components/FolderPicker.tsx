"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FolderEntry {
  name: string;
  path: string;
  mdCount: number;
}
interface ListResponse {
  path: string;
  parent: string | null;
  home: string;
  mdCountHere: number;
  folders: FolderEntry[];
  error?: string;
}

export default function FolderPicker({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [manual, setManual] = useState("");

  const browse = useCallback(async (p?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/fs/list${p ? `?path=${encodeURIComponent(p)}` : ""}`);
      const json = (await res.json()) as ListResponse;
      if (!res.ok) {
        setError(json.error || "Could not read folder.");
      } else {
        setData(json);
        setManual(json.path);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    browse();
  }, [browse]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function use(dir: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: dir }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not set folder.");
        setSaving(false);
        return;
      }
      onClose();
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not save the folder.");
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>Select your design system folder</h3>
          <button className="modal-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="modal-sub">
          Pick the folder that contains your component <code>.md</code> specs. Its subfolders become
          the navigation.
        </p>

        <div className="picker-path">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") browse(manual);
            }}
            spellCheck={false}
            aria-label="Folder path"
          />
          <button className="btn-link" onClick={() => browse(manual)}>
            Go
          </button>
        </div>

        <div className="picker-toolbar">
          <button
            className="picker-up"
            disabled={!data?.parent || loading}
            onClick={() => data?.parent && browse(data.parent)}
          >
            ↑ Up
          </button>
          {data && (
            <button className="picker-home" onClick={() => browse(data.home)} disabled={loading}>
              ⌂ Home
            </button>
          )}
          {data && data.mdCountHere > 0 && (
            <span className="picker-here-count">{data.mdCountHere} .md here</span>
          )}
        </div>

        <div className="picker-list">
          {loading && <div className="picker-empty">Loading…</div>}
          {!loading && error && <div className="picker-error">{error}</div>}
          {!loading && !error && data && data.folders.length === 0 && (
            <div className="picker-empty">No subfolders.</div>
          )}
          {!loading &&
            !error &&
            data?.folders.map((f) => (
              <button key={f.path} className="picker-row" onClick={() => browse(f.path)}>
                <span className="picker-folder-name">📁 {f.name}</span>
                {f.mdCount > 0 && <span className="picker-md-badge">{f.mdCount} .md</span>}
              </button>
            ))}
        </div>

        <div className="modal-foot">
          <div className="picker-selected" title={data?.path}>
            {data ? data.path : ""}
          </div>
          <button
            className="btn-primary"
            disabled={!data || saving || loading}
            onClick={() => data && use(data.path)}
          >
            {saving ? "Saving…" : "Use this folder"}
          </button>
        </div>
      </div>
    </div>
  );
}
