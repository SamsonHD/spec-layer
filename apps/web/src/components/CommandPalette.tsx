"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { filterCommandItems, type CommandItem } from "@/lib/commandPalette";

type Target = { label: string; href: string; hint?: string };

const QUICK_LINKS: Target[] = [
  { label: "Home", href: "/" },
  { label: "Inbox", href: "/inbox" },
];

/**
 * ⌘K command palette. Renders the sidebar trigger button plus the overlay.
 * Filtering is client-side over the full component list (passed in from the
 * server layout) — instant, no network round-trip.
 */
export default function CommandPalette({ items }: { items: CommandItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Build the flat, ordered list of navigable targets for the current query.
  const targets = useMemo<Target[]>(() => {
    const matches = filterCommandItems(items, query).map<Target>((c) => ({
      label: c.name,
      href: "/components/" + c.slug.join("/"),
      hint: c.path,
    }));
    if (query.trim()) return matches;
    return [...QUICK_LINKS, ...matches];
  }, [items, query]);

  const activeIndex = Math.min(active, Math.max(0, targets.length - 1));

  // Global ⌘K / Ctrl-K to toggle, Escape to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Focus the input when opening; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function go(href: string) {
    close();
    router.push(href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(1, targets.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + targets.length) % Math.max(1, targets.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const t = targets[activeIndex];
      if (t) go(t.href);
    }
  }

  const showQuickHeading = !query.trim() && targets.length > 0;

  return (
    <>
      <button ref={triggerRef} className="cmdk-trigger" onClick={() => setOpen(true)} aria-label="Search components">
        <span>Search…</span>
        <kbd className="cmdk-kbd">⌘K</kbd>
      </button>

      {open && (
        <div
          className="cmdk-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          role="presentation"
        >
          <div
            className="cmdk-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                event.preventDefault();
                inputRef.current?.focus();
              }
            }}
          >
            <input
              ref={inputRef}
              className="cmdk-input"
              placeholder="Search components or jump to…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              spellCheck={false}
              role="combobox"
              aria-expanded="true"
              aria-controls="command-palette-results"
              aria-activedescendant={targets[activeIndex] ? `command-option-${activeIndex}` : undefined}
            />
            <ul id="command-palette-results" className="cmdk-list" role="listbox">
              {showQuickHeading && <li className="cmdk-section" role="presentation">Go to</li>}
              {targets.length === 0 ? (
                <li className="cmdk-empty">No matches.</li>
              ) : (
                targets.map((t, i) => {
                  const isQuick = !query.trim() && i < QUICK_LINKS.length;
                  const firstComponent = !query.trim() && i === QUICK_LINKS.length;
                  return (
                    <Fragment key={t.href}>
                      {firstComponent && <li className="cmdk-section" role="presentation">Components</li>}
                      <li
                        id={`command-option-${i}`}
                        role="option"
                        aria-selected={i === activeIndex}
                        className={`cmdk-item${i === activeIndex ? " active" : ""}`}
                        onMouseEnter={() => setActive(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          go(t.href);
                        }}
                      >
                        <span>{t.label}</span>
                        {!isQuick && t.hint && <span className="cmdk-path">{t.hint}</span>}
                      </li>
                    </Fragment>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
