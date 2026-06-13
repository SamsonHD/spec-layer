"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavNode } from "@/lib/content";
import type { CommandItem } from "@/lib/commandPalette";
import CommandPalette from "./CommandPalette";
import ThemeToggle from "./ThemeToggle";
import EditableNav from "./EditableNav";

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
      <Link href="/inbox" className={`sidebar-inbox-link ${pathname === "/inbox" ? "active" : ""}`}>
        <span>Inbox</span>
        <span className="sidebar-inbox-count">{inboxCount}</span>
      </Link>

      <EditableNav nav={nav} />

      <div className="nav-spacer" />
    </aside>
  );
}
