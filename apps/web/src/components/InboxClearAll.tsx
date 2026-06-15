"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatComponentCount } from "@/lib/inboxSummary";
import { formatInboxFailures } from "./InboxSaveAll";
import { clearInboxItems } from "./inboxClearRequest";

interface InboxItem {
  name: string;
  slug: string[];
}

interface InboxClearAllProps {
  items: InboxItem[];
}

export default function InboxClearAll({ items }: InboxClearAllProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [failureMessages, setFailureMessages] = useState<string[]>([]);

  async function onClear() {
    if (busy || items.length === 0) return;
    const confirmed = window.confirm(
      `Permanently delete all ${formatComponentCount(items.length)}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setRequestError(null);
    setFailureMessages([]);

    try {
      const { httpOk, data } = await clearInboxItems(items.map((item) => item.slug));

      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? "Could not clear Inbox components.");
        return;
      }

      setFailureMessages(formatInboxFailures(data.failures ?? [], items));
      if ((data.deleted?.length ?? 0) > 0) router.refresh();
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
        className="btn-secondary inbox-clear-all"
        onClick={onClear}
        disabled={busy || items.length === 0}
      >
        {busy ? "Clearing..." : "Clear all"}
      </button>

      {requestError || failureMessages.length > 0 ? (
        <div className="inbox-save-errors" role="alert">
          {requestError ? <p>{requestError}</p> : null}
          {failureMessages.length > 0 ? (
            <>
              <p>{formatComponentCount(failureMessages.length)} could not be deleted:</p>
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
