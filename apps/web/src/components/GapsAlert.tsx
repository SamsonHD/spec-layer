"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GapsAlertProps {
  missingRequired: string[];
  issues: string[];
  gapsMarkdown: string | null;
}

export default function GapsAlert({ missingRequired, issues, gapsMarkdown }: GapsAlertProps) {
  const hasGapsMarkdown = (gapsMarkdown ?? "").trim().length > 0;
  const count =
    missingRequired.length +
    issues.length +
    (hasGapsMarkdown ? 1 : 0);

  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Close on Esc
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modalOpen, closeModal]);

  if (count === 0 || dismissed) return null;

  return (
    <>
      <div className="gaps-alert" role="alert">
        <span className="gaps-alert-icon" aria-hidden="true">⚠</span>
        <span className="gaps-alert-text">
          <strong>{count} inconsistenc{count === 1 ? "y" : "ies"}</strong> detected in this component&apos;s design system data.
        </span>
        <button className="gaps-alert-btn" onClick={openModal}>
          View details
        </button>
        <button
          className="gaps-alert-dismiss"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>

      {modalOpen && (
        <div
          className="gaps-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          role="presentation"
        >
          <div
            className="gaps-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Design system inconsistencies"
          >
            <div className="gaps-modal-head">
              <div>
                <div className="gaps-modal-eyebrow">Design system data</div>
                <h3>
                  {count} inconsistenc{count === 1 ? "y" : "ies"} found
                </h3>
              </div>
              <button
                className="gaps-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="gaps-modal-body">
              <p className="gaps-modal-lead">
                These inconsistencies come from your design system. Fix them at the source (e.g. in Figma) so the spec can be completed.
              </p>

              {missingRequired.length > 0 && (
                <section className="gaps-modal-section">
                  <h4>Missing required information</h4>
                  <ul className="gaps-list">
                    {missingRequired.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {issues.length > 0 && (
                <section className="gaps-modal-section">
                  <h4>Validation issues</h4>
                  <ul className="gaps-list">
                    {issues.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {hasGapsMarkdown && (
                <section className="gaps-modal-section">
                  <h4>Extraction gaps</h4>
                  <div className="md gaps-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {gapsMarkdown ?? ""}
                    </ReactMarkdown>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
