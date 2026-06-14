"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "file" | "paste";

interface UploadResponse {
  ok?: boolean;
  slug?: string;
  error?: string;
}

interface ZipUploadResponse {
  ok?: boolean;
  imported?: number;
  skipped?: Array<{ name: string; reason: string }>;
  slugs?: string[];
  error?: string;
}

export default function ManualImport() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>("file");
  const [pasteValue, setPasteValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipSummary, setZipSummary] = useState<ZipUploadResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setZipSummary(null);
    setBusy(true);

    try {
      if (mode === "file") {
        const file = fileRef.current?.files?.[0];
        if (!file) {
          setError("Please choose a .md or .zip file to upload.");
          return;
        }

        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        const isZip = ext === "zip" || file.type === "application/zip" || file.type === "application/x-zip-compressed";

        if (isZip) {
          // ZIP batch import.
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/specs/upload-zip", { method: "POST", body: form });
          const data = (await res.json()) as ZipUploadResponse;

          if (!res.ok || !data.ok) {
            setError(data.error ?? "ZIP import failed. Please try again.");
            return;
          }

          setZipSummary(data);
          router.refresh();
          router.push("/inbox");
          return;
        }

        // Single .md upload (existing behaviour).
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/specs/upload", { method: "POST", body: form });
        const data = (await res.json()) as UploadResponse;

        if (!res.ok || !data.ok) {
          setError(data.error ?? "Import failed. Please try again.");
          return;
        }

        router.push("/inbox");
        router.refresh();
      } else {
        const markdown = pasteValue.trim();
        if (!markdown) {
          setError("Please paste some markdown before importing.");
          return;
        }
        const res = await fetch("/api/specs/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown }),
        });

        const data = (await res.json()) as UploadResponse;

        if (!res.ok || !data.ok) {
          setError(data.error ?? "Import failed. Please try again.");
          return;
        }

        router.push("/inbox");
        router.refresh();
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="manual-import" onSubmit={handleSubmit} noValidate>
      <div className="manual-import-tabs" role="tablist" aria-label="Import method">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "file"}
          className={`manual-import-tab${mode === "file" ? " active" : ""}`}
          onClick={() => { setMode("file"); setError(null); setZipSummary(null); }}
        >
          Upload file
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "paste"}
          className={`manual-import-tab${mode === "paste" ? " active" : ""}`}
          onClick={() => { setMode("paste"); setError(null); setZipSummary(null); }}
        >
          Paste markdown
        </button>
      </div>

      {mode === "file" ? (
        <div className="manual-import-body">
          <label htmlFor="mi-file-input" className="manual-import-label">
            Component spec file
          </label>
          <div className="manual-import-dropzone">
            <input
              id="mi-file-input"
              ref={fileRef}
              type="file"
              accept=".md,.markdown,.zip,text/markdown,application/zip"
              className="manual-import-file-input"
              disabled={busy}
              aria-describedby={error ? "mi-error" : undefined}
            />
            <span className="manual-import-dropzone-hint">
              .md, .markdown, or .zip files
            </span>
          </div>
        </div>
      ) : (
        <div className="manual-import-body">
          <label htmlFor="mi-paste-input" className="manual-import-label">
            Paste markdown
          </label>
          <textarea
            id="mi-paste-input"
            className="section-editor-textarea manual-import-textarea"
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            placeholder={"---\nname: My Component\n---\n\n## Definition\n\n..."}
            rows={10}
            disabled={busy}
            aria-describedby={error ? "mi-error" : undefined}
          />
        </div>
      )}

      {error && (
        <div id="mi-error" className="manual-import-error" role="alert">
          {error}
        </div>
      )}

      {zipSummary && (
        <div className="manual-import-zip-summary" role="status" aria-live="polite">
          <strong>
            Imported {zipSummary.imported} spec{zipSummary.imported !== 1 ? "s" : ""}
            {zipSummary.skipped && zipSummary.skipped.length > 0
              ? ` (${zipSummary.skipped.length} skipped)`
              : ""}
          </strong>
          {zipSummary.skipped && zipSummary.skipped.length > 0 && (
            <ul className="manual-import-skipped-list" aria-label="Skipped files">
              {zipSummary.skipped.map((s) => (
                <li key={s.name}>
                  <span className="manual-import-skipped-name">{s.name}</span>
                  {" — "}
                  <span className="manual-import-skipped-reason">{s.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button type="submit" className="btn-primary manual-import-submit" disabled={busy}>
        {busy ? "Importing…" : "Import"}
      </button>
    </form>
  );
}
