import Link from "next/link";
import type { SyncSpecEntry } from "@/lib/sync";
import { formatRelative, isStale } from "@/lib/relativeTime";

interface SyncAlertProps {
  status: SyncSpecEntry | null;
  /** `extracted_at` from the spec frontmatter, for the drifted message. */
  extractedAt?: string;
}

function shortDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Out-of-date / not-found banner driven by the persisted sync report. Renders
 * nothing for in-sync specs or when there is no sync info (additive surface).
 */
export default function SyncAlert({ status, extractedAt }: SyncAlertProps) {
  if (!status || status.status === "in-sync") return null;

  const checked = formatRelative(status.checkedAt);
  const stale = isStale(status.checkedAt);
  const extracted = shortDate(extractedAt);

  if (status.status === "drifted") {
    return (
      <div className="sync-alert" role="status">
        <span className="sync-alert-icon" aria-hidden="true">⚠</span>
        <span className="sync-alert-text">
          <strong>Out of date with Figma.</strong>{" "}
          The Figma component changed since this spec was extracted
          {extracted ? ` on ${extracted}` : ""}. Last checked {checked}
          {stale ? " — run a fresh check for current status" : ""}. Re-extract it in
          the Figma plugin and send to docs to update.
        </span>
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
