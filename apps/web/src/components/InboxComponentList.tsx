"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  filterInboxItems,
  getInboxItemState,
} from "@/lib/inboxList";
import type { InboxSummaryItem } from "@/lib/inboxSummary";
import { clearInboxItems } from "./inboxClearRequest";
import { saveInboxItem } from "./inboxSaveRequest";
import { updateInboxItem } from "./inboxUpdateRequest";

interface InboxComponentListProps {
  items: InboxSummaryItem[];
  folder: string;
}

type BusyAction = { key: string; action: "save" | "delete" | "update" };

export default function InboxComponentList({ items, folder }: InboxComponentListProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busyAction, setBusyAction] = useState<BusyAction | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const filteredItems = useMemo(
    () => filterInboxItems(items, query),
    [items, query],
  );

  async function onDelete(item: InboxSummaryItem) {
    if (busyAction) return;
    const key = item.slug.join("/");
    setBusyAction({ key, action: "delete" });
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
      setBusyAction(null);
    }
  }

  async function onUpdate(item: InboxSummaryItem) {
    if (busyAction || !item.update) return;
    const key = item.slug.join("/");
    setBusyAction({ key, action: "update" });
    setRequestError(null);

    try {
      const { httpOk, data } = await updateInboxItem(item.slug, item.update.targetSlug);
      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? `Could not update ${item.name}.`);
        return;
      }
      router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBusyAction(null);
    }
  }

  async function onSave(item: InboxSummaryItem) {
    if (busyAction) return;
    const key = item.slug.join("/");
    setBusyAction({ key, action: "save" });
    setRequestError(null);

    try {
      const { httpOk, data } = await saveInboxItem(item, folder);
      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? `Could not save ${item.name}.`);
        return;
      }
      router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="inbox-component-list" aria-labelledby="inbox-list-title">
      <div className="inbox-list-head">
        <div>
          <h2 id="inbox-list-title">Imported components</h2>
          <p>Review, save, or remove imported files before adding them to your library.</p>
        </div>
        <span className="inbox-result-count">
          {filteredItems.length} of {items.length}
        </span>
      </div>

      <div className="inbox-list-toolbar">
        <label className="inbox-search">
          <span className="sr-only">Search imported components</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search imported components..."
          />
        </label>
      </div>

      <div className="inbox-list-columns" aria-hidden="true">
        <span>Component</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {filteredItems.length > 0 ? (
        <ul className="inbox-items">
          {filteredItems.map((item) => {
            const key = item.slug.join("/");
            const state = getInboxItemState(item);
            const href = `/components/${item.slug.map(encodeURIComponent).join("/")}`;
            const issueLabel = `${item.issueCount} ${item.issueCount === 1 ? "issue" : "issues"}`;
            const missingLabel = `${item.missingRequiredCount} missing ${
              item.missingRequiredCount === 1 ? "section" : "sections"
            }`;

            return (
              <li key={key}>
                <div className="inbox-item-identity">
                  <Link href={href}>{item.name}</Link>
                  {item.update ? (
                    <span className="inbox-update-target">
                      Updates {item.update.targetSlug.join(" / ")}
                    </span>
                  ) : (
                    <span>{item.slug.slice(1).join(" / ")}</span>
                  )}
                </div>
                <div className="inbox-item-health">
                  <span className={`inbox-status inbox-status-${state}`}>
                    {state === "ready" ? "Ready" : "Needs attention"}
                  </span>
                  {state === "attention" ? (
                    <span className="inbox-health-detail">
                      {item.issueCount > 0 && item.missingRequiredCount > 0
                        ? `${issueLabel} · ${missingLabel}`
                        : item.issueCount > 0
                          ? issueLabel
                          : missingLabel}
                    </span>
                  ) : (
                    <span className="inbox-health-detail">Ready to save</span>
                  )}
                </div>
                <div className="inbox-item-actions">
                  <Link className="btn-link inbox-open-item" href={href}>
                    Open
                  </Link>
                  {item.update ? (
                    <button
                      type="button"
                      className="btn-primary inbox-save-item"
                      onClick={() => onUpdate(item)}
                      disabled={busyAction !== null}
                      title={`Update ${item.update.targetSlug.join("/")} from Figma, keeping written guidelines`}
                    >
                      {busyAction?.key === key && busyAction.action === "update"
                        ? "Updating..."
                        : "Update"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary inbox-save-item"
                      onClick={() => onSave(item)}
                      disabled={busyAction !== null}
                    >
                      {busyAction?.key === key && busyAction.action === "save"
                        ? "Saving..."
                        : "Save"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="inbox-delete-item"
                    onClick={() => onDelete(item)}
                    disabled={busyAction !== null}
                  >
                    {busyAction?.key === key && busyAction.action === "delete"
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="inbox-list-empty">
          <strong>No matching components</strong>
          <span>Try another search.</span>
        </div>
      )}

      {requestError ? (
        <div className="inbox-save-errors" role="alert">
          <p>{requestError}</p>
        </div>
      ) : null}
    </section>
  );
}
