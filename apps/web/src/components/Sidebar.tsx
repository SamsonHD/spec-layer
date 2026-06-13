"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavNode } from "@/lib/content";
import type { CommandItem } from "@/lib/commandPalette";
import CommandPalette from "./CommandPalette";
import ThemeToggle from "./ThemeToggle";
import EditableNav from "./EditableNav";
import FolderPicker from "./FolderPicker";

export interface SourceInfo {
  contentDir: string;
  source: "ui" | "env" | "default";
  mdCount: number;
}

function basename(p: string): string {
  const parts = p.replace(/\/+$/, "").split("/");
  return parts[parts.length - 1] || p;
}

export default function Sidebar({
  nav,
  source,
  inboxCount,
  searchItems,
}: {
  nav: NavNode[];
  source: SourceInfo;
  inboxCount: number;
  searchItems: CommandItem[];
}) {
  const pathname = usePathname();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <Link href="/" className="brand" style={{ color: "inherit" }}>
          <span className="mark">◆</span> Design System
        </Link>
        <ThemeToggle />
      </div>
      <div className="brand-sub">Component documentation</div>

      <CommandPalette items={searchItems} />
      <Link href="/inbox" className={`sidebar-inbox-link ${pathname === "/inbox" ? "active" : ""}`}>
        <span>Inbox</span>
        <span className="sidebar-inbox-count">{inboxCount}</span>
      </Link>

      <EditableNav nav={nav} />

      <div className="nav-spacer" />

      <div className="source-footer">
        <div className="source-label">
          Source folder
          {source.source === "default" && <span className="source-tag">sample</span>}
        </div>
        <div className="source-path" title={source.contentDir}>
          {basename(source.contentDir)}
        </div>
        <div className="source-meta">{source.mdCount} component spec{source.mdCount === 1 ? "" : "s"}</div>
        <button className="btn-link source-change" onClick={() => setPickerOpen(true)}>
          Change folder…
        </button>
      </div>

      {pickerOpen && <FolderPicker onClose={() => setPickerOpen(false)} />}
    </aside>
  );
}
