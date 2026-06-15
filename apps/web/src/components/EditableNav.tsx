"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { NavNode } from "@/lib/content";

type DropPos = "before" | "after" | "into";
type AddType = "folder" | "doc";

function keyOf(slug: string[]): string {
  return slug.join("/");
}
function docHref(slug: string[]): string {
  return "/components/" + slug.join("/");
}
function findFolder(nodes: NavNode[], k: string): NavNode | null {
  for (const n of nodes) {
    if (n.type !== "folder") continue;
    if (keyOf(n.slug) === k) return n;
    const f = findFolder(n.children ?? [], k);
    if (f) return f;
  }
  return null;
}

export default function EditableNav({ nav }: { nav: NavNode[] }) {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ key: string; value: string } | null>(null);
  const [adding, setAdding] = useState<{ parentKey: string; type: AddType; value: string } | null>(null);
  const [drag, setDrag] = useState<{ slug: string[]; type: "folder" | "doc" } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ key: string; pos: DropPos } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Restore collapsed folders from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nav-collapsed");
      if (raw) setCollapsed(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);
  const persistCollapsed = (next: Set<string>) => {
    try {
      localStorage.setItem("nav-collapsed", JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  };

  // Close the ⋯ menu on any outside click.
  useEffect(() => {
    if (!menuFor) return;
    const onClick = () => setMenuFor(null);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [menuFor]);

  const childrenOf = useCallback(
    (parentKey: string): NavNode[] => (parentKey === "" ? nav : findFolder(nav, parentKey)?.children ?? []),
    [nav],
  );

  const toggle = (k: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      persistCollapsed(next);
      return next;
    });

  async function call(url: string, body: unknown): Promise<{ ok: boolean; slug?: string[]; error?: string }> {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; slug?: string[]; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong.");
        return { ok: false };
      }
      return { ok: true, slug: data.slug };
    } catch {
      setError("Could not reach the server.");
      return { ok: false };
    } finally {
      setBusy(false);
    }
  }

  // ---- Mutations ----
  async function commitRename(node: NavNode, value: string) {
    const name = value.trim();
    setRenaming(null);
    if (!name) return;
    const wasActive = node.type === "doc" && pathname === docHref(node.slug);
    const r = await call("/api/nav/rename", { slug: node.slug, type: node.type, name });
    if (r.ok && r.slug) {
      if (wasActive) router.push(docHref(r.slug));
      router.refresh();
    }
  }

  async function remove(node: NavNode) {
    const label = node.type === "folder" ? "folder and everything in it" : "page";
    if (!confirm(`Delete this ${label}? This cannot be undone.`)) return;
    const affectsActive = pathname.startsWith(docHref(node.slug));
    const r = await call("/api/nav/delete", { slug: node.slug, type: node.type });
    if (r.ok) {
      if (affectsActive) router.push("/");
      router.refresh();
    }
    setMenuFor(null);
  }

  async function commitAdd(parentKey: string, type: AddType, value: string) {
    const name = value.trim();
    setAdding(null);
    if (!name) return;
    const parentSlug = parentKey === "" ? [] : parentKey.split("/");
    const r = await call("/api/nav/create", { parentSlug, type, name });
    if (r.ok) {
      if (parentKey) {
        const next = new Set(collapsed);
        next.delete(parentKey);
        setCollapsed(next);
      }
      if (type === "doc" && r.slug) router.push(docHref(r.slug));
      router.refresh();
    }
  }

  async function reorderWithin(parentSlug: string[], draggedSeg: string, targetSeg: string, pos: DropPos) {
    const segs = childrenOf(keyOf(parentSlug)).map((n) => n.slug[n.slug.length - 1]);
    const without = segs.filter((s) => s !== draggedSeg);
    let i = without.indexOf(targetSeg);
    if (i === -1) i = without.length;
    else if (pos === "after") i += 1;
    without.splice(i, 0, draggedSeg);
    const r = await call("/api/nav/reorder", { parentSlug, order: without });
    if (r.ok) router.refresh();
  }

  async function moveTo(node: { slug: string[]; type: "folder" | "doc" }, toParent: string[]) {
    const wasActive = node.type === "doc" && pathname === docHref(node.slug);
    const r = await call("/api/nav/move", { slug: node.slug, type: node.type, toParent });
    if (r.ok && r.slug) {
      if (wasActive) router.push(docHref(r.slug));
      router.refresh();
    }
  }

  // ---- Drag & drop ----
  function onDrop(target: NavNode) {
    const d = drag;
    const dt = dropTarget;
    setDrag(null);
    setDropTarget(null);
    if (!d || !dt) return;
    if (keyOf(d.slug) === keyOf(target.slug)) return;
    // Never drop a folder into itself or a descendant.
    if (d.type === "folder" && keyOf(target.slug).startsWith(keyOf(d.slug) + "/")) return;

    if (dt.pos === "into" && target.type === "folder") {
      if (keyOf(d.slug.slice(0, -1)) === keyOf(target.slug)) return; // already inside
      moveTo(d, target.slug);
      return;
    }
    const targetParent = target.slug.slice(0, -1);
    const draggedSeg = d.slug[d.slug.length - 1];
    const targetSeg = target.slug[target.slug.length - 1];
    if (keyOf(d.slug.slice(0, -1)) === keyOf(targetParent)) {
      reorderWithin(targetParent, draggedSeg, targetSeg, dt.pos);
    } else {
      moveTo(d, targetParent);
    }
  }

  function onDragOver(e: React.DragEvent, target: NavNode) {
    if (!drag || keyOf(drag.slug) === keyOf(target.slug)) return;
    if (drag.type === "folder" && keyOf(target.slug).startsWith(keyOf(drag.slug) + "/")) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    let pos: DropPos;
    if (target.type === "folder" && y > rect.height * 0.3 && y < rect.height * 0.7) pos = "into";
    else pos = y < rect.height / 2 ? "before" : "after";
    setDropTarget({ key: keyOf(target.slug), pos });
  }

  function renderNode(node: NavNode, depth: number) {
    const k = keyOf(node.slug);
    const isFolder = node.type === "folder";
    const isCollapsed = collapsed.has(k);
    const active = node.type === "doc" && pathname === docHref(node.slug);
    const parentSlug = node.slug.slice(0, -1);
    const siblings = childrenOf(keyOf(parentSlug));
    const siblingIndex = siblings.findIndex((item) => keyOf(item.slug) === k);
    const dropCls =
      dropTarget?.key === k ? ` drop-${dropTarget.pos}` : "";

    return (
      <li key={(isFolder ? "f:" : "d:") + k}>
        <div
          className={`enav-row${active ? " active" : ""}${dropCls}`}
          style={{ paddingLeft: 8 + depth * 14 }}
          draggable={renaming?.key !== k}
          onDragStart={() => setDrag({ slug: node.slug, type: node.type })}
          onDragEnd={() => {
            setDrag(null);
            setDropTarget(null);
          }}
          onDragOver={(e) => onDragOver(e, node)}
          onDragLeave={() => setDropTarget((p) => (p?.key === k ? null : p))}
          onDrop={() => onDrop(node)}
        >
          <span className="enav-grip" aria-hidden>⠿</span>

          {isFolder ? (
            <button className="enav-chevron" onClick={() => toggle(k)} aria-label={isCollapsed ? "Expand" : "Collapse"}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform .12s" }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ) : (
            <span className="enav-chevron-spacer" />
          )}

          {renaming?.key === k ? (
            <input
              className="enav-rename"
              autoFocus
              value={renaming.value}
              onChange={(e) => setRenaming({ key: k, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename(node, renaming.value);
                else if (e.key === "Escape") setRenaming(null);
              }}
              onBlur={() => commitRename(node, renaming.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : isFolder ? (
            <button className="enav-label enav-folder-label" onClick={() => toggle(k)}>
              {node.name}
            </button>
          ) : (
            <Link href={docHref(node.slug)} className="enav-label">
              <span className="enav-label-text">{node.name}</span>
              {node.status && <span className={`badge ${node.status}`}>{node.status}</span>}
            </Link>
          )}

          <button
            className="enav-more"
            aria-label="More actions"
            onClick={(e) => {
              e.stopPropagation();
              setMenuFor(menuFor === k ? null : k);
            }}
          >
            ⋯
          </button>

          {menuFor === k && (
            <div className="enav-menu" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setMenuFor(null);
                  setRenaming({ key: k, value: node.name });
                }}
              >
                Rename
              </button>
              <button
                disabled={siblingIndex <= 0}
                onClick={() => {
                  const previous = siblings[siblingIndex - 1];
                  if (previous) void reorderWithin(parentSlug, node.slug.at(-1)!, previous.slug.at(-1)!, "before");
                  setMenuFor(null);
                }}
              >
                Move up
              </button>
              <button
                disabled={siblingIndex < 0 || siblingIndex >= siblings.length - 1}
                onClick={() => {
                  const next = siblings[siblingIndex + 1];
                  if (next) void reorderWithin(parentSlug, node.slug.at(-1)!, next.slug.at(-1)!, "after");
                  setMenuFor(null);
                }}
              >
                Move down
              </button>
              <button className="enav-menu-danger" onClick={() => remove(node)}>
                Delete
              </button>
            </div>
          )}
        </div>

        {isFolder && !isCollapsed && (
          <ul className="enav-list">
            {(node.children ?? []).map((c) => renderNode(c, depth + 1))}
            {renderAddRows(k, depth + 1)}
          </ul>
        )}
      </li>
    );
  }

  function renderAddRows(parentKey: string, depth: number) {
    const isAdding = adding?.parentKey === parentKey;
    if (isAdding) {
      return (
        <li key={`add-edit:${parentKey}`}>
          <div className="enav-row enav-add-editing" style={{ paddingLeft: 8 + depth * 14 }}>
            <span className="enav-chevron-spacer" />
            <input
              className="enav-rename"
              autoFocus
              placeholder={adding!.type === "folder" ? "Subcategory name" : "Page name"}
              value={adding!.value}
              onChange={(e) => setAdding({ ...adding!, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitAdd(parentKey, adding!.type, adding!.value);
                else if (e.key === "Escape") setAdding(null);
              }}
              onBlur={() => commitAdd(parentKey, adding!.type, adding!.value)}
            />
          </div>
        </li>
      );
    }
    return (
      <>
        <li key={`add-sub:${parentKey}`}>
          <button
            className="enav-add"
            style={{ paddingLeft: 8 + depth * 14 }}
            onClick={() => setAdding({ parentKey, type: "folder", value: "" })}
          >
            <span className="enav-add-plus">+</span> Add subcategory
          </button>
        </li>
        <li key={`add-page:${parentKey}`}>
          <button
            className="enav-add"
            style={{ paddingLeft: 8 + depth * 14 }}
            onClick={() => setAdding({ parentKey, type: "doc", value: "" })}
          >
            <span className="enav-add-plus">+</span> Add page
          </button>
        </li>
      </>
    );
  }

  return (
    <div className={`enav${busy ? " busy" : ""}`}>
      {nav.length === 0 ? (
        <div className="nav-empty">No components in this folder yet.</div>
      ) : (
        <ul className="enav-list enav-root">{nav.map((n) => renderNode(n, 0))}</ul>
      )}

      <ul className="enav-list enav-root">{renderAddRows("", 0)}</ul>

      {error && <div className="enav-error">{error}</div>}
    </div>
  );
}
