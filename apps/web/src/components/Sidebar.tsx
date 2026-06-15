"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavNode } from "@/lib/content";
import type { CommandItem } from "@/lib/commandPalette";
import CommandPalette from "./CommandPalette";
import ThemeToggle from "./ThemeToggle";
import EditableNav from "./EditableNav";

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 9v11h14V9" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12h5l2 3h4l2-3h5" />
      <path d="M5 5h14l2 7v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function Sidebar({
  nav,
  inboxCount,
  searchItems,
}: {
  nav: NavNode[];
  inboxCount: number;
  searchItems: CommandItem[];
}) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <Link href="/" className="brand" style={{ color: "inherit" }}>
          Design System
        </Link>
        <ThemeToggle />
      </div>
      <div className="brand-sub">Design system documentation</div>

      <CommandPalette items={searchItems} />

      <nav className="snav" aria-label="Primary">
        <Link href="/" className={`snav-link ${pathname === "/" ? "active" : ""}`}>
          <HomeIcon />
          <span className="snav-label">Home</span>
        </Link>
        <Link href="/inbox" className={`snav-link ${pathname === "/inbox" ? "active" : ""}`}>
          <InboxIcon />
          <span className="snav-label">Inbox</span>
          {inboxCount > 0 && <span className="snav-count">{inboxCount}</span>}
        </Link>
        <Link
          href="/settings"
          className={`snav-link ${pathname === "/settings" ? "active" : ""}`}
        >
          <SettingsIcon />
          <span className="snav-label">Settings</span>
        </Link>
      </nav>

      <div className="nav-section-label">Library</div>
      <EditableNav nav={nav} />

      <div className="nav-spacer" />
    </aside>
  );
}
