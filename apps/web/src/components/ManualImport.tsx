"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getNextImportMode, type ImportMode } from "./manualImportTabs";

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

interface ImportRouter {
  push(href: string): void;
  refresh(): void;
}

export function navigateToInboxAfterImport(
  router: ImportRouter,
  schedule: (callback: () => void) => void = (callback) => {
    window.setTimeout(callback, 0);
  },
) {
  router.push("/inbox");
  schedule(() => router.refresh());
}

export default function ManualImport() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const fileTabRef = useRef<HTMLButtonElement>(null);
  const pasteTabRef = useRef<HTMLButtonElement>(null);

  const [mode, setMode] = useState<ImportMode>("file");
  const [pasteValue, setPasteValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipSummary, setZipSummary] = useState<ZipUploadResponse | null>(null);

  function selectMode(nextMode: ImportMode) {
    setMode(nextMode);
    setError(null);
    setZipSummary(null);
  }

  function handleTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const nextMode = getNextImportMode(mode, e.key);
    if (nextMode === mode) return;

    e.preventDefault();
    selectMode(nextMode);
    (nextMode === "file" ? fileTabRef : pasteTabRef).current?.focus();
  }

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
          navigateToInboxAfterImport(router);
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

        navigateToInboxAfterImport(router);
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

        navigateToInboxAfterImport(router);
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
          id="mi-file-tab"
          ref={fileTabRef}
          type="button"
          role="tab"
          aria-selected={mode === "file"}
          aria-controls="mi-file-panel"
          tabIndex={mode === "file" ? 0 : -1}
          className={`manual-import-tab${mode === "file" ? " active" : ""}`}
          onClick={() => selectMode("file")}
          onKeyDown={handleTabKeyDown}
        >
          Upload file
        </button>
        <button
          id="mi-paste-tab"
          ref={pasteTabRef}
          type="button"
          role="tab"
          aria-selected={mode === "paste"}
          aria-controls="mi-paste-panel"
          tabIndex={mode === "paste" ? 0 : -1}
          className={`manual-import-tab${mode === "paste" ? " active" : ""}`}
          onClick={() => selectMode("paste")}
          onKeyDown={handleTabKeyDown}
        >
          Paste markdown
        </button>
      </div>

      {mode === "file" ? (
        <div
          id="mi-file-panel"
          className="manual-import-body"
          role="tabpanel"
          aria-labelledby="mi-file-tab"
        >
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
        <div
          id="mi-paste-panel"
          className="manual-import-body"
          role="tabpanel"
          aria-labelledby="mi-paste-tab"
        >
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
