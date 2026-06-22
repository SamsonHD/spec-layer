"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ManualImport from "./ManualImport";

/**
 * Top-level "Import component" CTA. Opens a modal hosting the manual importer
 * (drag-and-drop file drop area or pasted markdown). Closes on Escape, on an
 * overlay click, and after a successful single-file or pasted import.
 */
export default function ImportComponent() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Lock body scroll and wire Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="btn-primary inbox-import-cta"
        onClick={() => setOpen(true)}
      >
        Import component
      </button>

      {open && (
        <div
          className="import-modal-overlay"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className="import-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-modal-title"
            ref={dialogRef}
            tabIndex={-1}
          >
            <div className="import-modal-head">
              <div>
                <div className="import-modal-eyebrow">Inbox</div>
                <h3 id="import-modal-title">Import component</h3>
              </div>
              <button
                type="button"
                className="import-modal-close"
                onClick={close}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="import-modal-body">
              <p className="import-modal-lead">
                Export an <code>.md</code> from the Figma plugin, or upload / paste one here.
              </p>
              <ManualImport onImported={close} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
