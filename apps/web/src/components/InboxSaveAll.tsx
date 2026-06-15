"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatComponentCount } from "@/lib/inboxSummary";

interface InboxItem {
  name: string;
  slug: string[];
}

interface InboxFailure {
  source: string[];
  error: string;
}

interface BulkResponse {
  ok?: boolean;
  saved?: string[][];
  failures?: InboxFailure[];
  error?: string;
}

interface InboxSaveAllProps {
  items: InboxItem[];
  folderOptions: string[];
}

export function formatInboxFailures(
  failures: InboxFailure[],
  items: InboxItem[],
): string[] {
  const names = new Map(items.map((item) => [item.slug.join("/"), item.name]));
  return failures.map((failure) => {
    const fallback = failure.source.at(-1) ?? "Component";
    return `${names.get(failure.source.join("/")) ?? fallback}: ${failure.error}`;
  });
}

export default function InboxSaveAll({ items, folderOptions }: InboxSaveAllProps) {
  const router = useRouter();
  const [folder, setFolder] = useState("Components");
  const [busy, setBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [failureMessages, setFailureMessages] = useState<string[]>([]);
  const options = Array.from(new Set(["Components", ...folderOptions]));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setRequestError(null);
    setFailureMessages([]);

    try {
      const response = await fetch("/api/specs/move-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder,
          items: items.map((item) => item.slug),
        }),
      });
      const data = (await response.json()) as BulkResponse;

      if (!response.ok || !data.ok) {
        setRequestError(data.error ?? "Could not save Inbox components.");
        return;
      }

      setFailureMessages(formatInboxFailures(data.failures ?? [], items));
      if ((data.saved?.length ?? 0) > 0) router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form className="inbox-save-all" onSubmit={onSubmit}>
        <label>
          Folder
          <input
            value={folder}
            list="inbox-folder-options"
            onChange={(event) => setFolder(event.target.value)}
            disabled={busy}
          />
        </label>
        <datalist id="inbox-folder-options">
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
        <button className="btn-primary" type="submit" disabled={busy || items.length === 0}>
          {busy ? "Saving..." : "Save all"}
        </button>
      </form>

      {requestError || failureMessages.length > 0 ? (
        <div className="inbox-save-errors" role="alert">
          {requestError ? <p>{requestError}</p> : null}
          {failureMessages.length > 0 ? (
            <>
              <p>{formatComponentCount(failureMessages.length)} could not be saved:</p>
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
