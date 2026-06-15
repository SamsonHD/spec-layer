"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { clearInboxItems } from "./inboxClearRequest";

interface InboxItem {
  name: string;
  slug: string[];
}

interface InboxComponentListProps {
  items: InboxItem[];
}

export default function InboxComponentList({ items }: InboxComponentListProps) {
  const router = useRouter();
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  async function onDelete(item: InboxItem) {
    if (busySlug) return;
    const key = item.slug.join("/");
    setBusySlug(key);
    setRequestError(null);

    try {
      const { httpOk, data } = await clearInboxItems([item.slug]);

      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? `Could not delete ${item.name}.`);
        return;
      }

      const failure = data.failures?.[0];
      if (failure) {
        setRequestError(`${item.name}: ${failure.error}`);
        return;
      }

      router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <details className="inbox-component-list">
      <summary>View component names</summary>
      <ul>
        {items.map((item) => {
          const key = item.slug.join("/");
          return (
            <li key={key}>
              <span>{item.name}</span>
              <button
                type="button"
                className="inbox-delete-item"
                onClick={() => onDelete(item)}
                disabled={busySlug !== null}
              >
                {busySlug === key ? "Deleting..." : "Delete"}
              </button>
            </li>
          );
        })}
      </ul>

      {requestError ? (
        <div className="inbox-save-errors" role="alert">
          <p>{requestError}</p>
        </div>
      ) : null}
    </details>
  );
}
