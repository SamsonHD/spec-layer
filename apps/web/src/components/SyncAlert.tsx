"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SyncSpecEntry } from "@/lib/sync";
import { formatRelative, isStale } from "@/lib/relativeTime";
import { updateInboxItem } from "./inboxUpdateRequest";

interface SyncAlertProps {
  status: SyncSpecEntry | null;
  /** `extracted_at` from the spec frontmatter, for the drifted message. */
  extractedAt?: string;
  /** This component's slug — the update target. */
  slug?: string[];
  /**
   * Inbox draft (slug) that re-extracts this component, when one is waiting.
   * Present → the banner offers a one-click section-preserving Update.
   */
  updateSource?: string[];
}

function shortDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Out-of-date / not-found banner driven by the persisted sync report. Renders
 * nothing for in-sync specs or when there is no sync info (additive surface).
 * When a re-extracted inbox draft is waiting, offers a one-click Update;
 * otherwise it points at the plugin re-extract flow.
 */
export default function SyncAlert({ status, extractedAt, slug, updateSource }: SyncAlertProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!status || status.status === "in-sync") return null;

  const checked = formatRelative(status.checkedAt);
  const stale = isStale(status.checkedAt);

  async function onUpdate() {
    if (busy || !updateSource || !slug) return;
    setBusy(true);
    setError(null);
    try {
      const { httpOk, data } = await updateInboxItem(updateSource, slug);
      if (!httpOk || !data.ok) {
        setError(data.error ?? "Could not update from the inbox draft.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (status.status === "drifted") {
    const canUpdate = Boolean(updateSource && slug);
    const extracted = shortDate(extractedAt);
    return (
      <div className="sync-alert" role="status">
        <span className="sync-alert-icon" aria-hidden="true">⚠</span>
        <span className="sync-alert-text">
          <strong>Out of date with Figma.</strong>{" "}
          The Figma component changed since this spec was extracted
          {extracted ? ` on ${extracted}` : ""}. Last checked {checked}
          {stale ? " — run a fresh check for current status" : ""}.{" "}
          {canUpdate
            ? "A re-extracted draft is waiting in the inbox."
            : "Re-extract it in the Figma plugin and send to docs to update."}
          {error ? <> {error}</> : null}
        </span>
        {canUpdate ? (
          <button
            type="button"
            className="sync-alert-btn"
            onClick={onUpdate}
            disabled={busy}
          >
            {busy ? "Updating…" : "Update from Figma"}
          </button>
        ) : null}
        <Link className="sync-alert-link" href="/sync">
          View all changes →
        </Link>
      </div>
    );
  }

  // missing-in-figma
  return (
    <div className="sync-alert missing" role="status">
      <span className="sync-alert-icon" aria-hidden="true">⊘</span>
      <span className="sync-alert-text">
        <strong>Not found in Figma.</strong>{" "}
        This spec&apos;s component wasn&apos;t in the last scan of its Figma file
        ({checked}). It may have been removed or renamed in Figma.
      </span>
      <Link className="sync-alert-link" href="/sync">
        View all changes →
      </Link>
    </div>
  );
}
