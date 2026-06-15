"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatComponentCount } from "@/lib/inboxSummary";

interface InboxItem {
  name: string;
  slug: string[];
}

interface EnrichedEntry {
  slug: string[];
  filled: string[];
  usedVisual: boolean;
}

interface EnrichFailure {
  source: string[];
  error: string;
}

interface EnrichAllResponse {
  ok?: boolean;
  enriched?: EnrichedEntry[];
  failures?: EnrichFailure[];
  error?: string;
}

/** Map server failures back to component display names for a readable summary. */
export function formatEnrichFailures(
  failures: EnrichFailure[],
  items: InboxItem[],
): string[] {
  const names = new Map(items.map((item) => [item.slug.join("/"), item.name]));
  return failures.map((failure) => {
    const fallback = failure.source.at(-1) ?? "Component";
    return `${names.get(failure.source.join("/")) ?? fallback}: ${failure.error}`;
  });
}

export default function InboxFillAll({ items }: { items: InboxItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [failureMessages, setFailureMessages] = useState<string[]>([]);

  async function onFillAll() {
    if (busy || items.length === 0) return;
    setBusy(true);
    setRequestError(null);
    setSummary(null);
    setFailureMessages([]);

    try {
      const response = await fetch("/api/specs/enrich-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((item) => item.slug) }),
      });
      const data = (await response.json()) as EnrichAllResponse;

      if (!response.ok || !data.ok) {
        setRequestError(data.error ?? "Could not fill Inbox components.");
        return;
      }

      const enriched = data.enriched ?? [];
      const touched = enriched.filter((entry) => entry.filled.length > 0).length;
      const withVisual = enriched.filter((entry) => entry.usedVisual).length;
      setSummary(
        `Filled ${formatComponentCount(touched)}` +
          (withVisual > 0 ? ` (${withVisual} with the Figma visual).` : "."),
      );
      setFailureMessages(formatEnrichFailures(data.failures ?? [], items));
      if (touched > 0) router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn-secondary"
        onClick={onFillAll}
        disabled={busy || items.length === 0}
      >
        {busy ? "Filling…" : "Fill Guidelines with AI"}
      </button>

      {summary ? <p className="inbox-fill-summary">{summary}</p> : null}

      {requestError || failureMessages.length > 0 ? (
        <div className="inbox-save-errors" role="alert">
          {requestError ? <p>{requestError}</p> : null}
          {failureMessages.length > 0 ? (
            <>
              <p>{formatComponentCount(failureMessages.length)} could not be filled:</p>
              <ul>
                {failureMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
