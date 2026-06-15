# Clear Inbox Items Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users permanently delete imported component specs from the web Inbox — one at a time (one click) or all at once (with a confirmation).

**Architecture:** A best-effort filesystem helper `clearInboxSpecs(items)` is added to the existing `inboxMove.ts`, reusing its private path guards. A single `POST /api/specs/clear` route serves both scopes (individual delete posts a one-item array; "Clear all" posts every item). Two thin client components (`InboxClearAll`, `InboxComponentList`) share one fetch helper and call `router.refresh()` after deletes.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Node `fs`, Vitest (node environment — component tests use `renderToStaticMarkup` and `fetch`/pure-function mocks, never DOM interaction, matching the existing `InboxSaveAll.test.tsx`).

**Spec:** `docs/superpowers/specs/2026-06-15-clear-inbox-items-design.md`

---

## Conventions

- **All test commands run from the repo root** (`/Users/sandrolek/Documents/Projects/Design System Docs`). Vitest config is at the repo root (`vitest.config.ts`); the `@` alias maps to `apps/web/src`.
- Run a single test file with: `npx vitest run <path-from-root>`.
- The Inbox content directory is `apps/web/content/`; `_inbox` holds pending specs as `<name>.md`, with optional sidecars at `content/.spec-data/_inbox/<name>.json`.
- Follow existing patterns exactly. The move/save-all code in `inboxMove.ts`, `api/specs/move-all/route.ts`, and `components/InboxSaveAll.tsx` are the templates being mirrored.

## File Structure

- **Modify** `apps/web/src/lib/inboxMove.ts` — add private `deleteInboxSpecAt(source)` and exported `clearInboxSpecs(items)`. Reuses existing private helpers `requireInboxSlug`, `getSidecarPath`, `assertNoSymbolicLinks`, and `InboxMoveError`.
- **Modify** `apps/web/src/lib/inboxMove.test.ts` — add a `describe("clearInboxSpecs", ...)` block.
- **Create** `apps/web/src/app/api/specs/clear/route.ts` — `POST` + `OPTIONS`, mirroring `move-all/route.ts`.
- **Create** `apps/web/src/app/api/specs/clear/route.test.ts` — mirroring `move-all/route.test.ts`.
- **Create** `apps/web/src/components/inboxClearRequest.ts` — shared client fetch helper `clearInboxItems(slugs)`.
- **Create** `apps/web/src/components/inboxClearRequest.test.ts` — fetch-mock test.
- **Create** `apps/web/src/components/InboxClearAll.tsx` — "Clear all" button with confirm.
- **Create** `apps/web/src/components/InboxClearAll.test.tsx` — static-markup test.
- **Create** `apps/web/src/components/InboxComponentList.tsx` — name list with per-item delete (replaces the server-rendered `<details>` list).
- **Create** `apps/web/src/components/InboxComponentList.test.tsx` — static-markup test.
- **Modify** `apps/web/src/app/inbox/page.tsx` — add `<InboxClearAll>` inside the existing `.inbox-summary-actions` wrapper (which already holds `InboxFillAll` + `InboxSaveAll`); replace the server `<details>` list with `<InboxComponentList>`.
- **Modify** `apps/web/src/app/globals.css` — style the per-item delete button (the `.inbox-summary-actions` wrapper already exists).

---

## Task 0: Create the feature branch

The repo is currently on the default branch `main`. Branch before doing any work.

- [ ] **Step 1: Create and switch to the branch**

Run: `git checkout -b feat/clear-inbox-items`
Expected: `Switched to a new branch 'feat/clear-inbox-items'`

---

## Task 1: `clearInboxSpecs` filesystem helper

**Files:**
- Modify: `apps/web/src/lib/inboxMove.ts`
- Test: `apps/web/src/lib/inboxMove.test.ts`

- [ ] **Step 1: Write the failing tests**

Append this block to the end of `apps/web/src/lib/inboxMove.test.ts`. Note `clearInboxSpecs` must be added to the existing import at the top of the file (the import currently pulls `InboxMoveError, moveInboxSpec, moveInboxSpecAs, normalizeInboxFolder, saveAllInboxSpecs`).

```ts
describe("clearInboxSpecs", () => {
  it.each([
    { items: undefined },
    { items: null },
    { items: {} },
    { items: "button" },
    { items: [] },
  ])("rejects a non-array or empty request %#", ({ items }) => {
    expectStatus(() => clearInboxSpecs(items), 400);
  });

  it("deletes markdown without a sidecar", () => {
    writeInbox("button");

    expect(clearInboxSpecs([["_inbox", "button"]])).toEqual({
      deleted: [["_inbox", "button"]],
      failures: [],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
  });

  it("deletes markdown together with its sidecar", () => {
    writeInbox("button", true);

    expect(clearInboxSpecs([["_inbox", "button"]])).toEqual({
      deleted: [["_inbox", "button"]],
      failures: [],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
    expect(fs.existsSync(sidecarPath(["_inbox", "button"]))).toBe(false);
  });

  it("reports a missing markdown file as a failure", () => {
    expect(clearInboxSpecs([["_inbox", "missing"]])).toEqual({
      deleted: [],
      failures: [{ source: ["_inbox", "missing"], error: "Source file not found" }],
    });
  });

  it("deletes valid entries and reports failures independently", () => {
    writeInbox("button");
    writeInbox("input", true);

    const result = clearInboxSpecs([
      ["_inbox", "button"],
      ["components", "outside"],
      ["_inbox", "input"],
    ]);

    expect(result).toEqual({
      deleted: [
        ["_inbox", "button"],
        ["_inbox", "input"],
      ],
      failures: [
        {
          source: ["components", "outside"],
          error: "Source must be a component directly inside _inbox",
        },
      ],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
    expect(fs.existsSync(markdownPath(["_inbox", "input"]))).toBe(false);
    expect(fs.existsSync(sidecarPath(["_inbox", "input"]))).toBe(false);
  });

  it("rejects a symlinked inbox as a failure without deleting the external source", () => {
    const externalDir = makeExternalDir();
    const externalSource = path.join(externalDir, "button.md");
    fs.writeFileSync(externalSource, "external source\n", "utf-8");
    fs.rmSync(path.join(dir, "_inbox"), { recursive: true });
    fs.symlinkSync(externalDir, path.join(dir, "_inbox"), "dir");

    expect(clearInboxSpecs([["_inbox", "button"]])).toEqual({
      deleted: [],
      failures: [
        {
          source: ["_inbox", "button"],
          error: "Source path must not contain symbolic links",
        },
      ],
    });
    expect(fs.readFileSync(externalSource, "utf-8")).toBe("external source\n");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run apps/web/src/lib/inboxMove.test.ts`
Expected: FAIL — `clearInboxSpecs is not exported` / `is not a function`.

- [ ] **Step 3: Implement `clearInboxSpecs`**

Append to `apps/web/src/lib/inboxMove.ts` (after `saveAllInboxSpecs`). It reuses the file's existing private `getSidecarPath`, `assertNoSymbolicLinks`, and `requireInboxSlug`.

```ts
function deleteInboxSpecAt(source: string[]): string[] {
  const contentDir = getContentDir();
  const sourceMarkdown = path.join(contentDir, ...source) + ".md";
  const sourceSidecar = getSidecarPath(contentDir, source);

  assertNoSymbolicLinks(
    contentDir,
    sourceMarkdown,
    400,
    "Source path must not contain symbolic links",
  );
  assertNoSymbolicLinks(
    contentDir,
    sourceSidecar,
    400,
    "Source path must not contain symbolic links",
  );

  if (!fs.existsSync(sourceMarkdown)) {
    throw new InboxMoveError("Source file not found", 404);
  }

  try {
    fs.unlinkSync(sourceMarkdown);
  } catch {
    throw new InboxMoveError("Failed to delete spec", 500);
  }

  if (fs.existsSync(sourceSidecar)) {
    try {
      fs.unlinkSync(sourceSidecar);
    } catch {
      // Best-effort: a leftover sidecar is harmless and recoverable via git.
    }
  }

  return source;
}

export function clearInboxSpecs(items: unknown): {
  deleted: string[][];
  failures: Array<{ source: string[]; error: string }>;
} {
  if (!Array.isArray(items) || items.length === 0) {
    throw new InboxMoveError("Items must be a non-empty array", 400);
  }

  const deleted: string[][] = [];
  const failures: Array<{ source: string[]; error: string }> = [];

  for (const item of items) {
    const source = Array.isArray(item)
      ? item.filter((part): part is string => typeof part === "string")
      : [];
    try {
      const validatedSource = requireInboxSlug(item);
      deleted.push(deleteInboxSpecAt(validatedSource));
    } catch (error) {
      failures.push({
        source,
        error: error instanceof Error ? error.message : "Failed to delete spec",
      });
    }
  }

  return { deleted, failures };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run apps/web/src/lib/inboxMove.test.ts`
Expected: PASS (all existing `inboxMove` tests plus the new `clearInboxSpecs` block).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/inboxMove.ts apps/web/src/lib/inboxMove.test.ts
git commit -m "feat(web): add clearInboxSpecs filesystem helper"
```

---

## Task 2: `POST /api/specs/clear` route

**Files:**
- Create: `apps/web/src/app/api/specs/clear/route.ts`
- Test: `apps/web/src/app/api/specs/clear/route.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `apps/web/src/app/api/specs/clear/route.test.ts`:

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as inboxMove from "@/lib/inboxMove";
import { OPTIONS, POST } from "./route";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-clear-route-"));
  process.env.DS_CONTENT_DIR = contentDir;
  fs.mkdirSync(path.join(contentDir, "_inbox"), { recursive: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function request(
  body: string,
  options: { contentType?: string; origin?: string | null } = {},
): NextRequest {
  const headers = new Headers({
    "content-type": options.contentType ?? "application/json",
  });
  if (options.origin !== null) {
    headers.set("origin", options.origin ?? "http://localhost:3000");
  }
  return new NextRequest("http://localhost:3000/api/specs/clear", {
    method: "POST",
    headers,
    body,
  });
}

function optionsRequest(origin: string | null = "http://localhost:3000"): NextRequest {
  const headers = new Headers();
  if (origin !== null) headers.set("origin", origin);
  return new NextRequest("http://localhost:3000/api/specs/clear", {
    method: "OPTIONS",
    headers,
  });
}

function markdownPath(slug: string[]): string {
  return path.join(contentDir, ...slug) + ".md";
}

function writeInbox(name: string): void {
  fs.writeFileSync(markdownPath(["_inbox", name]), `# ${name}\n`, "utf-8");
}

describe("POST /api/specs/clear", () => {
  it("returns a CORS-readable 400 for invalid JSON", async () => {
    const response = await POST(request("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
  });

  it.each(["null", "42", "[]"])("rejects a non-object JSON body: %s", async (body) => {
    const response = await POST(request(body));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid request body" });
  });

  it("maps empty items to the top-level InboxMoveError status", async () => {
    const response = await POST(request(JSON.stringify({ items: [] })));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Items must be a non-empty array",
    });
  });

  it("deletes the requested items", async () => {
    writeInbox("button");

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] })),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      deleted: [["_inbox", "button"]],
      failures: [],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
  });

  it("returns item failures while deleting valid items", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        JSON.stringify({ items: [["_inbox", "button"], ["components", "outside"]] }),
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      deleted: [["_inbox", "button"]],
      failures: [
        {
          source: ["components", "outside"],
          error: "Source must be a component directly inside _inbox",
        },
      ],
    });
  });

  it("rejects cross-origin JSON without deleting files", async () => {
    writeInbox("button");

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] }), {
        origin: "https://example.com",
      }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Origin not allowed" });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("rejects a non-JSON content type without deleting files", async () => {
    writeInbox("button");

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] }), {
        contentType: "text/plain",
      }),
    );

    expect(response.status).toBe(415);
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("returns a stable 500 for an unknown top-level error", async () => {
    vi.spyOn(inboxMove, "clearInboxSpecs").mockImplementationOnce(() => {
      throw new Error("internal path details");
    });

    const response = await POST(
      request(JSON.stringify({ items: [["_inbox", "button"]] })),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to clear Inbox items",
    });
  });

  it("allows same-origin and no-origin CORS preflight", () => {
    const response = OPTIONS(optionsRequest());
    const noOriginResponse = OPTIONS(optionsRequest(null));

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
    expect(response.headers.get("access-control-allow-methods")).toBe("POST, OPTIONS");
    expect(noOriginResponse.status).toBe(204);
  });

  it.each(["https://example.com", "null"])(
    "rejects disallowed CORS preflight origin %s",
    async (origin) => {
      const response = OPTIONS(optionsRequest(origin));

      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toEqual({ error: "Origin not allowed" });
    },
  );
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run apps/web/src/app/api/specs/clear/route.test.ts`
Expected: FAIL — cannot resolve `./route` (file does not exist yet).

- [ ] **Step 3: Implement the route**

Create `apps/web/src/app/api/specs/clear/route.ts` (mirrors `move-all/route.ts`, dropping `folder`):

```ts
import { NextRequest, NextResponse } from "next/server";
import { InboxMoveError, clearInboxSpecs } from "@/lib/inboxMove";
import {
  validateJsonMutationRequest,
  validateSameOriginRequest,
} from "@/lib/requestSecurity";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateSameOriginRequest(req);
  if (requestError) {
    return NextResponse.json(
      { error: requestError.error },
      { status: requestError.status, headers },
    );
  }
  return new NextResponse(null, { status: 204, headers });
}

interface ClearBody {
  items?: unknown;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  const requestError = validateJsonMutationRequest(req);
  if (requestError) {
    return NextResponse.json(
      { error: requestError.error },
      { status: requestError.status, headers },
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (
    parsedBody === null ||
    typeof parsedBody !== "object" ||
    Array.isArray(parsedBody)
  ) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers });
  }
  const body = parsedBody as ClearBody;

  try {
    const result = clearInboxSpecs(body.items);
    return NextResponse.json({ ok: true, ...result }, { headers });
  } catch (error) {
    if (error instanceof InboxMoveError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers },
      );
    }
    return NextResponse.json(
      { error: "Failed to clear Inbox items" },
      { status: 500, headers },
    );
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run apps/web/src/app/api/specs/clear/route.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/api/specs/clear/route.ts apps/web/src/app/api/specs/clear/route.test.ts
git commit -m "feat(web): add clear inbox endpoint"
```

---

## Task 3: Shared client fetch helper

**Files:**
- Create: `apps/web/src/components/inboxClearRequest.ts`
- Test: `apps/web/src/components/inboxClearRequest.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/components/inboxClearRequest.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { clearInboxItems } from "./inboxClearRequest";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("clearInboxItems", () => {
  it("POSTs the slugs as items and returns the parsed body with httpOk", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, deleted: [["_inbox", "button"]], failures: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await clearInboxItems([["_inbox", "button"]]);

    expect(fetchMock).toHaveBeenCalledWith("/api/specs/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [["_inbox", "button"]] }),
    });
    expect(result).toEqual({
      httpOk: true,
      data: { ok: true, deleted: [["_inbox", "button"]], failures: [] },
    });
  });

  it("surfaces a non-ok HTTP response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Items must be a non-empty array" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await clearInboxItems([]);

    expect(result.httpOk).toBe(false);
    expect(result.data).toEqual({ error: "Items must be a non-empty array" });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run apps/web/src/components/inboxClearRequest.test.ts`
Expected: FAIL — module `./inboxClearRequest` not found.

- [ ] **Step 3: Implement the helper**

Create `apps/web/src/components/inboxClearRequest.ts`:

```ts
export interface InboxClearFailure {
  source: string[];
  error: string;
}

export interface InboxClearResponse {
  ok?: boolean;
  deleted?: string[][];
  failures?: InboxClearFailure[];
  error?: string;
}

export async function clearInboxItems(
  slugs: string[][],
): Promise<{ httpOk: boolean; data: InboxClearResponse }> {
  const response = await fetch("/api/specs/clear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: slugs }),
  });
  const data = (await response.json()) as InboxClearResponse;
  return { httpOk: response.ok, data };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run apps/web/src/components/inboxClearRequest.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/inboxClearRequest.ts apps/web/src/components/inboxClearRequest.test.ts
git commit -m "feat(web): add shared clear inbox fetch helper"
```

---

## Task 4: `InboxClearAll` button + page wiring

**Files:**
- Create: `apps/web/src/components/InboxClearAll.tsx`
- Test: `apps/web/src/components/InboxClearAll.test.tsx`
- Modify: `apps/web/src/app/inbox/page.tsx`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/components/InboxClearAll.test.tsx` (static-markup only, matching `InboxSaveAll.test.tsx`):

```tsx
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxClearAll from "./InboxClearAll";

describe("InboxClearAll", () => {
  it("renders an enabled Clear all action when items exist", () => {
    const html = renderToStaticMarkup(
      <InboxClearAll items={[{ name: "Button", slug: ["_inbox", "button"] }]} />,
    );

    expect(html).toContain("Clear all");
    expect(html).toContain('class="btn-secondary inbox-clear-all"');
    expect(html).not.toContain("disabled");
    expect(html).not.toContain("inbox-save-errors");
  });

  it("disables the action when there are no items", () => {
    const html = renderToStaticMarkup(<InboxClearAll items={[]} />);

    expect(html).toContain("Clear all");
    expect(html).toContain("disabled");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run apps/web/src/components/InboxClearAll.test.tsx`
Expected: FAIL — module `./InboxClearAll` not found.

- [ ] **Step 3: Implement the component**

Create `apps/web/src/components/InboxClearAll.tsx`. It reuses `formatInboxFailures` (exported from `InboxSaveAll`) and `formatComponentCount`, and shares the fetch helper.

```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatComponentCount } from "@/lib/inboxSummary";
import { formatInboxFailures } from "./InboxSaveAll";
import { clearInboxItems } from "./inboxClearRequest";

interface InboxItem {
  name: string;
  slug: string[];
}

interface InboxClearAllProps {
  items: InboxItem[];
}

export default function InboxClearAll({ items }: InboxClearAllProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [failureMessages, setFailureMessages] = useState<string[]>([]);

  async function onClear() {
    if (busy || items.length === 0) return;
    const confirmed = window.confirm(
      `Permanently delete all ${formatComponentCount(items.length)}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setRequestError(null);
    setFailureMessages([]);

    try {
      const { httpOk, data } = await clearInboxItems(items.map((item) => item.slug));

      if (!httpOk || !data.ok) {
        setRequestError(data.error ?? "Could not clear Inbox components.");
        return;
      }

      setFailureMessages(formatInboxFailures(data.failures ?? [], items));
      if ((data.deleted?.length ?? 0) > 0) router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn-secondary inbox-clear-all"
        onClick={onClear}
        disabled={busy || items.length === 0}
      >
        {busy ? "Clearing..." : "Clear all"}
      </button>

      {requestError || failureMessages.length > 0 ? (
        <div className="inbox-save-errors" role="alert">
          {requestError ? <p>{requestError}</p> : null}
          {failureMessages.length > 0 ? (
            <>
              <p>{formatComponentCount(failureMessages.length)} could not be deleted:</p>
              <ul>
                {failureMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run apps/web/src/components/InboxClearAll.test.tsx`
Expected: PASS.

- [ ] **Step 5: Wire the button into the Inbox page**

In `apps/web/src/app/inbox/page.tsx`:

Add the import alongside the other component imports (after the `InboxFillAll` import):

```tsx
import InboxClearAll from "@/components/InboxClearAll";
```

The page **already has** an `.inbox-summary-actions` wrapper containing `<InboxFillAll>` and `<InboxSaveAll>`. Do **not** add another wrapper and do **not** remove `InboxFillAll`. Make a purely additive edit: insert `<InboxClearAll>` immediately after the `<InboxSaveAll>` line inside that existing wrapper. The block should end up as:

```tsx
            <div className="inbox-summary-actions">
              <InboxFillAll items={summary.items} />
              <InboxSaveAll items={summary.items} folderOptions={groups} />
              <InboxClearAll items={summary.items} />
            </div>
```

- [ ] **Step 6: Typecheck to confirm the wiring**

Run: `npm run typecheck --workspace apps/web` (or from `apps/web`: `npm run typecheck`)
Expected: no type errors.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/InboxClearAll.tsx apps/web/src/components/InboxClearAll.test.tsx apps/web/src/app/inbox/page.tsx
git commit -m "feat(web): add Clear all action to inbox"
```

---

## Task 5: `InboxComponentList` with per-item delete + page wiring + CSS

**Files:**
- Create: `apps/web/src/components/InboxComponentList.tsx`
- Test: `apps/web/src/components/InboxComponentList.test.tsx`
- Modify: `apps/web/src/app/inbox/page.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/components/InboxComponentList.test.tsx`:

```tsx
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxComponentList from "./InboxComponentList";

const items = [
  { name: "Button", slug: ["_inbox", "button"] },
  { name: "Input", slug: ["_inbox", "input"] },
];

describe("InboxComponentList", () => {
  it("renders each component name with a Delete control", () => {
    const html = renderToStaticMarkup(<InboxComponentList items={items} />);

    expect(html).toContain("View component names");
    expect(html).toContain("Button");
    expect(html).toContain("Input");
    expect(html.match(/inbox-delete-item/g)?.length).toBe(2);
    expect(html).toContain(">Delete<");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run apps/web/src/components/InboxComponentList.test.tsx`
Expected: FAIL — module `./InboxComponentList` not found.

- [ ] **Step 3: Implement the component**

Create `apps/web/src/components/InboxComponentList.tsx`:

```tsx
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run apps/web/src/components/InboxComponentList.test.tsx`
Expected: PASS.

- [ ] **Step 5: Replace the server-rendered list in the Inbox page**

In `apps/web/src/app/inbox/page.tsx`:

Add the import after the `InboxClearAll` import:

```tsx
import InboxComponentList from "@/components/InboxComponentList";
```

Replace the server `<details className="inbox-component-list"> … </details>` block (the "View component names" list) with:

```tsx
          <InboxComponentList items={summary.items} />
```

- [ ] **Step 6: Add the delete-button styles**

In `apps/web/src/app/globals.css`, replace the existing `.inbox-component-list li` rule (currently `break-inside: avoid; margin-bottom: 4px; font-size: 13px;`) with a flex row, and add the button styles after it:

```css
.inbox-component-list li {
  break-inside: avoid;
  margin-bottom: 4px;
  font-size: 13px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.inbox-delete-item {
  border: none;
  background: none;
  padding: 0;
  color: var(--danger-text);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.inbox-delete-item:hover { text-decoration: underline; }
.inbox-delete-item:disabled { opacity: 0.5; cursor: default; }
```

- [ ] **Step 7: Typecheck**

Run: `npm run typecheck --workspace apps/web` (or from `apps/web`: `npm run typecheck`)
Expected: no type errors.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/components/InboxComponentList.tsx apps/web/src/components/InboxComponentList.test.tsx apps/web/src/app/inbox/page.tsx apps/web/src/app/globals.css
git commit -m "feat(web): add per-item delete to inbox list"
```

---

## Task 6: Full verification

- [ ] **Step 1: Run the full test suite**

Run (from repo root): `npm test`
Expected: PASS, no failures.

- [ ] **Step 2: Lint and typecheck**

Run (from repo root): `npm run lint && npm run typecheck`
Expected: clean.

- [ ] **Step 3: Manual smoke test (verify in the browser)**

Use the preview workflow (`preview_start`, then drive the page) to confirm against a content dir that has `_inbox` entries:
- The Inbox import summary shows a "Clear all" button beside "Save all".
- Clicking a per-item "Delete" removes that component and the summary count drops by one.
- "Clear all" prompts for confirmation; cancelling leaves everything; confirming empties the Inbox and shows the empty state.
- Deleting a component also removes its `content/.spec-data/_inbox/<name>.json` sidecar when present.

Note: in a fresh checkout `_inbox` may be empty. If so, export a component from the Figma plugin (or copy a sample `.md` into `apps/web/content/_inbox/`) first so there is something to clear.

- [ ] **Step 4: Final review**

Use superpowers:requesting-code-review to review the completed branch against this plan and the spec before integrating.

---

## Notes for the implementer

- **No DOM test environment.** Vitest runs in the node environment (no `vitest.config` `test.environment` override, no jsdom). That is why component tests render with `renderToStaticMarkup` and assert on the HTML string, and why click/`window.confirm`/`router.refresh` behavior is not unit-tested — identical to the existing `InboxSaveAll.test.tsx`. Do not add jsdom/testing-library for this feature; the interaction logic is intentionally thin and is exercised in the manual smoke test (Task 6, Step 3).
- **Reuse, don't duplicate.** `formatInboxFailures` is imported from `InboxSaveAll`; the fetch call lives only in `inboxClearRequest.ts`. Do not re-implement either.
- **Single endpoint by design.** Individual delete posts a one-item `items` array to `/api/specs/clear`; there is deliberately no separate single-delete route (see spec rationale).
