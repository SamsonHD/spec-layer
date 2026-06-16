"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { filterInboxItems } from "@/lib/inboxList";
import {
  getSelectAllState,
  itemKey,
  selectedSlugs,
  setAll,
  toggleKey,
} from "@/lib/inboxSelection";
import { formatComponentCount, type InboxSummaryItem } from "@/lib/inboxSummary";
import InboxComponentList from "./InboxComponentList";
import { clearInboxItems } from "./inboxClearRequest";
import {
  enrichInboxItems,
  formatBulkFailures,
  moveInboxItems,
} from "./inboxBulkRequest";
import { saveInboxItem } from "./inboxSaveRequest";

type BulkAction = "save" | "enrich" | "delete";
type RowAction = { key: string; action: "save" | "delete" };

export default function InboxWorkspace({
  items,
  folderOptions,
}: {
  items: InboxSummaryItem[];
  folderOptions: string[];
}) {
  const router = useRouter();
  const options = useMemo(
    () => Array.from(new Set(["Components", ...folderOptions])),
    [folderOptions],
  );

  const [folder, setFolder] = useState("Components");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const [bulkBusy, setBulkBusy] = useState<BulkAction | null>(null);
  const [rowBusy, setRowBusy] = useState<RowAction | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [failureMessages, setFailureMessages] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredItems = useMemo(
    () => filterInboxItems(items, query),
    [items, query],
  );
  const selectAllState = getSelectAllState(filteredItems, selected);
  const selectedItems = items.filter((item) => selected.has(itemKey(item)));
  const selectedCount = selectedItems.length;
  const busy = bulkBusy !== null || rowBusy !== null;

  function resetMessages() {
    setRequestError(null);
    setFailureMessages([]);
    setNotice(null);
  }

  function toggleRow(item: InboxSummaryItem) {
    setSelected((current) => toggleKey(current, itemKey(item)));
  }

  function toggleAll() {
    setSelected((current) => setAll(current, filteredItems, selectAllState !== "all"));
  }

  async function onBulkSave() {
    if (busy || selectedCount === 0) return;
    setBulkBusy("save");
    resetMessages();
    try {
      const { httpOk, data } = await moveInboxItems(
        selectedSlugs(items, selected),
        folder.trim() || "Components",
      );
      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? "Could not save the selected components.");
        return;
      }
      setFailureMessages(formatBulkFailures(data.failures ?? [], selectedItems));
      const savedCount = data.saved?.length ?? 0;
      if (savedCount > 0) {
        setNotice(`Saved ${formatComponentCount(savedCount)} to ${folder.trim() || "Components"}.`);
        setSelected(new Set());
        router.refresh();
      }
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBulkBusy(null);
    }
  }

  async function onBulkEnrich() {
    if (busy || selectedCount === 0) return;
    setBulkBusy("enrich");
    resetMessages();
    try {
      const { httpOk, data } = await enrichInboxItems(selectedSlugs(items, selected));
      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? "Could not add guidelines to the selected components.");
        return;
      }
      const enriched = data.enriched ?? [];
      const touched = enriched.filter((entry) => entry.filled.length > 0).length;
      const withVisual = enriched.filter((entry) => entry.usedVisual).length;
      setNotice(
        `Added guidelines to ${formatComponentCount(touched)}` +
          (withVisual > 0 ? ` (${withVisual} with the Figma visual).` : "."),
      );
      setFailureMessages(formatBulkFailures(data.failures ?? [], selectedItems));
      if (touched > 0) router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBulkBusy(null);
    }
  }

  async function onBulkDelete() {
    if (busy || selectedCount === 0) return;
    const confirmed = window.confirm(
      `Permanently delete ${formatComponentCount(selectedCount)}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBulkBusy("delete");
    resetMessages();
    try {
      const { httpOk, data } = await clearInboxItems(selectedSlugs(items, selected));
      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? "Could not delete the selected components.");
        return;
      }
      setFailureMessages(formatBulkFailures(data.failures ?? [], selectedItems));
      const deletedCount = data.deleted?.length ?? 0;
      if (deletedCount > 0) {
        setNotice(`Deleted ${formatComponentCount(deletedCount)}.`);
        setSelected(new Set());
        router.refresh();
      }
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBulkBusy(null);
    }
  }

  async function onRowSave(item: InboxSummaryItem) {
    if (busy) return;
    setRowBusy({ key: itemKey(item), action: "save" });
    resetMessages();
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
      setRowBusy(null);
    }
  }

  async function onRowDelete(item: InboxSummaryItem) {
    if (busy) return;
    setRowBusy({ key: itemKey(item), action: "delete" });
    resetMessages();
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
      setRowBusy(null);
    }
  }

  return (
    <section className="inbox-table-panel" aria-labelledby="inbox-list-title">
      <div className="inbox-table-head">
        <div>
          <h2 id="inbox-list-title">Imported components</h2>
          <p>Select components to add guidelines, save to your library, or delete.</p>
        </div>
        <span className="inbox-result-count">
          {filteredItems.length} of {items.length}
        </span>
      </div>

      <div className="inbox-toolbar">
        <label className="inbox-search">
          <span className="sr-only">Search imported components</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search imported components..."
          />
        </label>

        <div className="inbox-toolbar-actions">
          <label className="inbox-destination">
            <span className="sr-only">Destination folder</span>
            <input
              aria-label="Destination folder"
              value={folder}
              list="inbox-folder-options"
              placeholder="Destination folder"
              onChange={(event) => setFolder(event.target.value)}
            />
          </label>
          <datalist id="inbox-folder-options">
            {options.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

          <button
            type="button"
            className="btn-secondary"
            onClick={onBulkEnrich}
            disabled={busy || selectedCount === 0}
          >
            {bulkBusy === "enrich" ? "Adding…" : "Add guidelines"}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onBulkSave}
            disabled={busy || selectedCount === 0}
          >
            {bulkBusy === "save"
              ? "Saving…"
              : selectedCount > 0
                ? `Save ${selectedCount}`
                : "Save"}
          </button>
          <button
            type="button"
            className="btn-secondary inbox-bulk-delete"
            onClick={onBulkDelete}
            disabled={busy || selectedCount === 0}
          >
            {bulkBusy === "delete" ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <p className="inbox-selection-status" role="status">
        {selectedCount > 0
          ? `${formatComponentCount(selectedCount)} selected`
          : "Select components to enable bulk actions."}
      </p>

      <InboxComponentList
        items={filteredItems}
        totalCount={items.length}
        selected={selected}
        selectAllState={selectAllState}
        rowBusy={rowBusy}
        disabled={busy}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onRowSave={onRowSave}
        onRowDelete={onRowDelete}
      />

      {notice ? <p className="inbox-fill-summary">{notice}</p> : null}

      {requestError || failureMessages.length > 0 ? (
        <div className="inbox-save-errors" role="alert">
          {requestError ? <p>{requestError}</p> : null}
          {failureMessages.length > 0 ? (
            <>
              <p>{formatComponentCount(failureMessages.length)} could not be processed:</p>
              <ul>
                {failureMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
