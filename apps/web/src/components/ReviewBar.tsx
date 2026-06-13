"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApiResponse {
  ok?: boolean;
  warning?: string;
  error?: string;
}

export default function ReviewBar({ slug }: { slug: string[] }) {
  const router = useRouter();
  const [approver, setApprover] = useState("Reviewer");
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"regenerate" | "approve" | null>(null);

  async function regenerateDraft() {
    if (busyAction) return;
    setBusyAction("regenerate");
    setWarning(null);
    setError(null);
    try {
      const res = await fetch("/api/specs/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json()) as ApiResponse;
      if (res.status === 409) {
        setError("No stored extraction found. Re-import this component from the plugin, then try again.");
        return;
      }
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not regenerate this draft.");
        return;
      }
      if (data.warning) setWarning(data.warning);
      router.refresh();
    } catch {
      setError("Could not regenerate this draft.");
    } finally {
      setBusyAction(null);
    }
  }

  async function approveDraft() {
    if (busyAction) return;
    setBusyAction("approve");
    setWarning(null);
    setError(null);
    try {
      const res = await fetch("/api/specs/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, approver }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not approve this draft.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not approve this draft.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="review-bar">
      <div className="review-actions">
        <button className="btn-link" onClick={regenerateDraft} disabled={busyAction !== null}>
          {busyAction === "regenerate" ? "Regenerating…" : "Regenerate AI draft"}
        </button>
        <label className="review-approver">
          Approver
          <input value={approver} onChange={(e) => setApprover(e.target.value)} disabled={busyAction !== null} />
        </label>
        <button className="btn-primary" onClick={approveDraft} disabled={busyAction !== null}>
          {busyAction === "approve" ? "Approving…" : "Approve"}
        </button>
      </div>
      {warning && <div className="review-warning">{warning}</div>}
      {error && <div className="review-error">{error}</div>}
    </div>
  );
}
