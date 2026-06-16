"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { getInboxItemState } from "@/lib/inboxList";
import { itemKey, type SelectAllState } from "@/lib/inboxSelection";
import type { InboxSummaryItem } from "@/lib/inboxSummary";

type RowAction = { key: string; action: "save" | "delete" };

interface InboxComponentListProps {
  items: InboxSummaryItem[];
  totalCount: number;
  selected: ReadonlySet<string>;
  selectAllState: SelectAllState;
  rowBusy: RowAction | null;
  disabled: boolean;
  onToggleRow: (item: InboxSummaryItem) => void;
  onToggleAll: () => void;
  onRowSave: (item: InboxSummaryItem) => void;
  onRowDelete: (item: InboxSummaryItem) => void;
}

function healthLabel(item: InboxSummaryItem): string {
  const issueLabel = `${item.issueCount} ${item.issueCount === 1 ? "issue" : "issues"}`;
  const missingLabel = `${item.missingRequiredCount} missing ${
    item.missingRequiredCount === 1 ? "section" : "sections"
  }`;
  if (item.issueCount > 0 && item.missingRequiredCount > 0) {
    return `${issueLabel} · ${missingLabel}`;
  }
  if (item.issueCount > 0) return issueLabel;
  if (item.missingRequiredCount > 0) return missingLabel;
  return "Ready to save";
}

export default function InboxComponentList({
  items,
  totalCount,
  selected,
  selectAllState,
  rowBusy,
  disabled,
  onToggleRow,
  onToggleAll,
  onRowSave,
  onRowDelete,
}: InboxComponentListProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectAllState === "some";
    }
  }, [selectAllState, items.length]);

  if (items.length === 0) {
    return (
      <div className="inbox-list-empty">
        <strong>{totalCount === 0 ? "Inbox is empty" : "No matching components"}</strong>
        <span>{totalCount === 0 ? "Imported components appear here." : "Try another search."}</span>
      </div>
    );
  }

  return (
    <div className="inbox-table-wrap">
      <table className="inbox-table">
        <thead>
          <tr>
            <th scope="col" className="inbox-col-select">
              <input
                ref={selectAllRef}
                type="checkbox"
                aria-label="Select all components"
                checked={selectAllState === "all"}
                onChange={onToggleAll}
              />
            </th>
            <th scope="col">Component</th>
            <th scope="col" className="inbox-col-source">Source</th>
            <th scope="col">Status</th>
            <th scope="col" className="inbox-col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const key = itemKey(item);
            const state = getInboxItemState(item);
            const href = `/components/${item.slug.map(encodeURIComponent).join("/")}`;
            const isSelected = selected.has(key);
            const savingRow = rowBusy?.key === key && rowBusy.action === "save";
            const deletingRow = rowBusy?.key === key && rowBusy.action === "delete";

            return (
              <tr key={key} className={isSelected ? "inbox-row-selected" : undefined}>
                <td className="inbox-col-select" data-label="Select">
                  <input
                    type="checkbox"
                    aria-label={`Select ${item.name}`}
                    checked={isSelected}
                    onChange={() => onToggleRow(item)}
                  />
                </td>
                <td data-label="Component" className="inbox-cell-name">
                  <Link href={href}>{item.name}</Link>
                </td>
                <td data-label="Source" className="inbox-cell-source">
                  <span className={`inbox-source inbox-source-${item.source}`}>
                    {item.source === "figma" ? "Figma" : "Local"}
                  </span>
                </td>
                <td data-label="Status">
                  <span className={`inbox-status inbox-status-${state}`}>
                    {state === "ready" ? "Ready" : "Needs attention"}
                  </span>
                  <span className="inbox-health-detail">{healthLabel(item)}</span>
                </td>
                <td data-label="Actions" className="inbox-col-actions">
                  <div className="inbox-item-actions">
                    <Link className="btn-link inbox-open-item" href={href}>
                      Open
                    </Link>
                    <button
                      type="button"
                      className="btn-primary inbox-save-item"
                      onClick={() => onRowSave(item)}
                      disabled={disabled}
                    >
                      {savingRow ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="inbox-delete-item"
                      onClick={() => onRowDelete(item)}
                      disabled={disabled}
                    >
                      {deletingRow ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
