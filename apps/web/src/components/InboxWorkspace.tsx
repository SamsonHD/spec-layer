"use client";

import React, { useState } from "react";
import type { InboxSummaryItem } from "@/lib/inboxSummary";
import InboxClearAll from "./InboxClearAll";
import InboxComponentList from "./InboxComponentList";
import InboxFillAll from "./InboxFillAll";
import InboxSaveAll from "./InboxSaveAll";

export default function InboxWorkspace({
  items,
  folderOptions,
}: {
  items: InboxSummaryItem[];
  folderOptions: string[];
}) {
  const [folder, setFolder] = useState("Components");
  const options = Array.from(new Set(["Components", ...folderOptions]));

  return (
    <>
      <section className="inbox-summary" aria-labelledby="inbox-summary-title">
        <div className="inbox-summary-head">
          <div>
            <h2 id="inbox-summary-title">Inbox actions</h2>
            <p>Complete imported guidelines or save components to your library.</p>
          </div>
        </div>

        <div className="inbox-action-panel">
          <label className="inbox-destination">
            <span>Destination folder</span>
            <input
              value={folder}
              list="inbox-folder-options"
              onChange={(event) => setFolder(event.target.value)}
            />
            <small>Used by Save and Save All.</small>
          </label>
          <datalist id="inbox-folder-options">
            {options.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

          <div className="inbox-bulk-actions">
            <InboxFillAll items={items} />
            <InboxSaveAll items={items} folder={folder} />
            <InboxClearAll items={items} />
          </div>
        </div>
      </section>

      <InboxComponentList items={items} folder={folder} />
    </>
  );
}
