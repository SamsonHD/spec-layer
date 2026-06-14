# Inbox Summary and Save All Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the web Inbox review queue with a compact import summary and a `Save all` action that files pending specs into a chosen folder, defaulting to `Components`.

**Architecture:** Move filesystem behavior into a reusable Inbox move helper that validates source slugs, normalizes destinations, preserves sidecars, rejects collisions, and supports best-effort batches. Keep the API route thin, derive summary data with a pure helper, and let a focused client component own the folder field and request state.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Node `fs`/`path`, Vitest, existing CSS variables and component classes.

---

## File Structure

- Create `apps/web/src/lib/inboxMove.ts`: destination normalization, one-item move, rollback, and best-effort batch orchestration.
- Create `apps/web/src/lib/inboxMove.test.ts`: filesystem, collision, sidecar, validation, defaulting, and mixed-result tests.
- Create `apps/web/src/app/api/specs/move-all/route.ts`: validates the HTTP body and delegates to `saveAllInboxSpecs`.
- Modify `vitest.config.ts`: resolve the web app's `@` alias when route modules are imported in tests.
- Modify `apps/web/src/app/api/specs/move/route.ts`: reuse the shared move helper for the existing single-item endpoint.
- Create `apps/web/src/lib/inboxSummary.ts`: pure aggregate and compact-list view-model helper.
- Create `apps/web/src/lib/inboxSummary.test.ts`: aggregate count and item-label tests.
- Create `apps/web/src/components/InboxSaveAll.tsx`: folder selector, `Save all` request, busy state, and partial failure display.
- Create `apps/web/src/components/InboxSaveAll.test.tsx`: server-rendered markup/default checks and pure failure-format checks.
- Modify `apps/web/src/app/inbox/page.tsx`: render summary metrics, compact names, and the bulk-save form.
- Delete `apps/web/src/components/InboxFileForm.tsx`: remove the obsolete per-item filing UI.
- Modify `apps/web/src/app/globals.css`: replace review-card styles with summary, compact list, bulk form, and failure styles.

### Task 1: Shared Inbox Move Behavior

**Files:**
- Create: `apps/web/src/lib/inboxMove.ts`
- Create: `apps/web/src/lib/inboxMove.test.ts`

- [ ] **Step 1: Write failing filesystem and batch tests**

Create `apps/web/src/lib/inboxMove.test.ts` with temp-directory coverage for the complete contract:

```ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  InboxMoveError,
  moveInboxSpec,
  normalizeInboxFolder,
  saveAllInboxSpecs,
} from "./inboxMove";

let dir: string;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "inbox-move-"));
  process.env.DS_CONTENT_DIR = dir;
  fs.mkdirSync(path.join(dir, "_inbox"), { recursive: true });
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

function writeInbox(slug: string, sidecar = false): void {
  fs.writeFileSync(path.join(dir, "_inbox", `${slug}.md`), `---\nname: ${slug}\n---\n`, "utf-8");
  if (sidecar) {
    const sidecarPath = path.join(dir, ".spec-data", "_inbox", `${slug}.json`);
    fs.mkdirSync(path.dirname(sidecarPath), { recursive: true });
    fs.writeFileSync(sidecarPath, JSON.stringify({ name: slug }), "utf-8");
  }
}

describe("normalizeInboxFolder", () => {
  it("defaults blank or missing values to components", () => {
    expect(normalizeInboxFolder(undefined)).toBe("components");
    expect(normalizeInboxFolder("   ")).toBe("components");
  });

  it("normalizes a user-visible folder name", () => {
    expect(normalizeInboxFolder("Form Controls")).toBe("form-controls");
  });

  it("rejects traversal and non-string values", () => {
    expect(() => normalizeInboxFolder("../outside")).toThrow(InboxMoveError);
    expect(() => normalizeInboxFolder(42)).toThrow(InboxMoveError);
  });
});

describe("moveInboxSpec", () => {
  it("moves markdown and its sidecar while preserving the filename slug", () => {
    writeInbox("button", true);
    expect(moveInboxSpec(["_inbox", "button"], "Components")).toEqual(["components", "button"]);
    expect(fs.existsSync(path.join(dir, "components", "button.md"))).toBe(true);
    expect(fs.existsSync(path.join(dir, ".spec-data", "components", "button.json"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "_inbox", "button.md"))).toBe(false);
  });

  it("rejects sources outside _inbox", () => {
    expect(() => moveInboxSpec(["components", "button"], "Components")).toThrow(/_inbox/);
  });

  it("does not overwrite an existing destination", () => {
    writeInbox("button");
    fs.mkdirSync(path.join(dir, "components"), { recursive: true });
    fs.writeFileSync(path.join(dir, "components", "button.md"), "existing", "utf-8");
    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrow(/already exists/);
    expect(fs.existsSync(path.join(dir, "_inbox", "button.md"))).toBe(true);
  });
});

describe("saveAllInboxSpecs", () => {
  it("moves independent items and reports conflicts without aborting", () => {
    writeInbox("button");
    writeInbox("input");
    fs.mkdirSync(path.join(dir, "components"), { recursive: true });
    fs.writeFileSync(path.join(dir, "components", "input.md"), "existing", "utf-8");

    const result = saveAllInboxSpecs(
      [["_inbox", "button"], ["_inbox", "input"]],
      "Components",
    );

    expect(result.saved).toEqual([["components", "button"]]);
    expect(result.failures).toEqual([
      { source: ["_inbox", "input"], error: "Destination file already exists" },
    ]);
    expect(fs.existsSync(path.join(dir, "_inbox", "input.md"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npx vitest run apps/web/src/lib/inboxMove.test.ts`

Expected: FAIL because `./inboxMove` does not exist.

- [ ] **Step 3: Implement normalization, safe movement, and batch orchestration**

Create `apps/web/src/lib/inboxMove.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import { getContentDir } from "./config";
import { hasTraversal, isSafeSlug } from "./specApi";
import { slugify } from "./specWriter";

export class InboxMoveError extends Error {
  constructor(message: string, readonly status: 400 | 404 | 409 | 500) {
    super(message);
    this.name = "InboxMoveError";
  }
}

export interface InboxMoveFailure {
  source: string[];
  error: string;
}

export interface InboxMoveBatchResult {
  saved: string[][];
  failures: InboxMoveFailure[];
}

export function normalizeInboxFolder(raw: unknown): string {
  if (raw === undefined || (typeof raw === "string" && !raw.trim())) return "components";
  if (typeof raw !== "string") throw new InboxMoveError("Folder must be a string", 400);
  if (hasTraversal(raw)) throw new InboxMoveError("Folder must not contain '/', '\\', or '..'", 400);
  const folder = slugify(raw);
  if (!folder) throw new InboxMoveError("Folder must contain an alphanumeric character", 400);
  return folder;
}

function normalizeInboxName(raw: unknown): string {
  if (typeof raw !== "string") throw new InboxMoveError("Name must be a string", 400);
  if (hasTraversal(raw)) throw new InboxMoveError("Name must not contain '/', '\\', or '..'", 400);
  const name = slugify(raw);
  if (!name) throw new InboxMoveError("Name must contain an alphanumeric character", 400);
  return name;
}

function requireInboxSlug(value: unknown): string[] {
  if (!isSafeSlug(value) || value.length !== 2 || value[0] !== "_inbox") {
    throw new InboxMoveError("Source must be a component directly inside _inbox", 400);
  }
  return value;
}

function sidecarPath(contentDir: string, slug: string[]): string {
  return path.join(contentDir, ".spec-data", ...slug) + ".json";
}

function moveInboxSpecTo(fromSlug: string[], folder: string, name: string): string[] {
  const destination = [folder, name];
  const contentDir = getContentDir();
  const fromPath = path.join(contentDir, ...fromSlug) + ".md";
  const toPath = path.join(contentDir, ...destination) + ".md";
  const fromSidecar = sidecarPath(contentDir, fromSlug);
  const toSidecar = sidecarPath(contentDir, destination);

  if (!fs.existsSync(fromPath)) throw new InboxMoveError("Source file not found", 404);
  if (fs.existsSync(toPath)) throw new InboxMoveError("Destination file already exists", 409);
  if (fs.existsSync(toSidecar)) throw new InboxMoveError("Destination sidecar already exists", 409);

  try {
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.renameSync(fromPath, toPath);
    if (fs.existsSync(fromSidecar)) {
      try {
        fs.mkdirSync(path.dirname(toSidecar), { recursive: true });
        fs.renameSync(fromSidecar, toSidecar);
      } catch (error) {
        fs.renameSync(toPath, fromPath);
        throw error;
      }
    }
  } catch (error) {
    if (error instanceof InboxMoveError) throw error;
    throw new InboxMoveError(error instanceof Error ? error.message : "Failed to move spec", 500);
  }

  return destination;
}

export function moveInboxSpec(fromSlug: unknown, rawFolder: unknown): string[] {
  const source = requireInboxSlug(fromSlug);
  return moveInboxSpecTo(source, normalizeInboxFolder(rawFolder), source[1]);
}

export function moveInboxSpecAs(
  fromSlug: unknown,
  rawFolder: unknown,
  rawName: unknown,
): string[] {
  return moveInboxSpecTo(
    requireInboxSlug(fromSlug),
    normalizeInboxFolder(rawFolder),
    normalizeInboxName(rawName),
  );
}

export function saveAllInboxSpecs(items: unknown, rawFolder: unknown): InboxMoveBatchResult {
  if (!Array.isArray(items) || items.length === 0) {
    throw new InboxMoveError("Items must be a non-empty array", 400);
  }
  const folder = normalizeInboxFolder(rawFolder);
  const saved: string[][] = [];
  const failures: InboxMoveFailure[] = [];

  for (const source of items) {
    const sourceForResponse = Array.isArray(source)
      ? source.filter((part): part is string => typeof part === "string")
      : [];
    try {
      saved.push(moveInboxSpec(source, folder));
    } catch (error) {
      failures.push({
        source: sourceForResponse,
        error: error instanceof Error ? error.message : "Failed to move spec",
      });
    }
  }

  return { saved, failures };
}
```

- [ ] **Step 4: Run the helper tests and verify they pass**

Run: `npx vitest run apps/web/src/lib/inboxMove.test.ts`

Expected: PASS for folder defaulting, movement, source validation, collision safety, sidecars, and mixed batches.

- [ ] **Step 5: Commit the shared behavior**

```bash
git add apps/web/src/lib/inboxMove.ts apps/web/src/lib/inboxMove.test.ts
git commit -m "feat(web): add bulk inbox move helper"
```

### Task 2: Bulk Move API and Single-Move Reuse

**Files:**
- Create: `apps/web/src/app/api/specs/move-all/route.ts`
- Create: `apps/web/src/app/api/specs/move-all/route.test.ts`
- Modify: `vitest.config.ts`
- Modify: `apps/web/src/app/api/specs/move/route.ts`

- [ ] **Step 1: Write failing route tests**

Create `apps/web/src/app/api/specs/move-all/route.test.ts` using `NextRequest` and a temp content directory. Cover malformed JSON, blank-folder fallback, item-level validation, and malformed top-level input:

```ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { POST } from "./route";

let dir: string;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "move-all-route-"));
  process.env.DS_CONTENT_DIR = dir;
  fs.mkdirSync(path.join(dir, "_inbox"), { recursive: true });
  fs.writeFileSync(path.join(dir, "_inbox", "button.md"), "---\nname: Button\n---\n", "utf-8");
});

afterEach(() => {
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

function request(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/specs/move-all", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/specs/move-all", () => {
  it("rejects invalid JSON", async () => {
    const invalidRequest = new NextRequest("http://localhost:3000/api/specs/move-all", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    const response = await POST(invalidRequest);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON body" });
  });

  it("uses components when folder is blank", async () => {
    const response = await POST(request({ folder: "", items: [["_inbox", "button"]] }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      saved: [["components", "button"]],
      failures: [],
    });
  });

  it("returns item-level validation failures without failing the request", async () => {
    const response = await POST(request({
      folder: "Components",
      items: [["components", "button"], ["_inbox", "button"]],
    }));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.saved).toEqual([["components", "button"]]);
    expect(data.failures[0].error).toMatch(/_inbox/);
  });

  it("rejects a malformed top-level body", async () => {
    const response = await POST(request({ folder: "Components", items: [] }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Items must be a non-empty array" });
  });
});
```

- [ ] **Step 2: Run the route test and verify it fails**

Run: `npx vitest run apps/web/src/app/api/specs/move-all/route.test.ts`

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Configure the web source alias for Vitest**

Update `vitest.config.ts`:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": path.join(rootDir, "apps/web/src") },
  },
  test: {
    include: [
      "packages/**/test/**/*.test.ts",
      "apps/**/src/**/*.test.ts",
    ],
    passWithNoTests: true,
  },
});
```

- [ ] **Step 4: Add the thin bulk route**

Create `apps/web/src/app/api/specs/move-all/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { InboxMoveError, saveAllInboxSpecs } from "@/lib/inboxMove";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  let body: { folder?: unknown; items?: unknown };
  try {
    body = (await req.json()) as { folder?: unknown; items?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  try {
    const result = saveAllInboxSpecs(body.items, body.folder);
    return NextResponse.json({ ok: true, ...result }, { headers });
  } catch (error) {
    const status = error instanceof InboxMoveError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Failed to save Inbox items";
    return NextResponse.json({ error: message }, { status, headers });
  }
}
```

- [ ] **Step 5: Refactor the existing single-item route to share filesystem behavior**

Replace `apps/web/src/app/api/specs/move/route.ts` with:

```ts
import { NextRequest, NextResponse } from "next/server";
import { InboxMoveError, moveInboxSpecAs } from "@/lib/inboxMove";
import { corsHeaders } from "@/lib/specApi";

export const dynamic = "force-dynamic";

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

interface MoveBody {
  fromSlug?: unknown;
  group?: unknown;
  name?: unknown;
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req);
  let body: MoveBody;
  try {
    body = (await req.json()) as MoveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  try {
    const slug = moveInboxSpecAs(body.fromSlug, body.group, body.name);
    return NextResponse.json({ ok: true, slug }, { headers });
  } catch (error) {
    const status = error instanceof InboxMoveError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Failed to move spec";
    return NextResponse.json({ error: message }, { status, headers });
  }
}
```

- [ ] **Step 6: Run focused tests and typecheck**

Run: `npx vitest run apps/web/src/lib/inboxMove.test.ts apps/web/src/app/api/specs/move-all/route.test.ts`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS with no TypeScript errors.

- [ ] **Step 7: Commit the API work**

```bash
git add apps/web/src/lib/inboxMove.ts apps/web/src/lib/inboxMove.test.ts apps/web/src/app/api/specs/move-all/route.ts apps/web/src/app/api/specs/move-all/route.test.ts apps/web/src/app/api/specs/move/route.ts vitest.config.ts
git commit -m "feat(web): add save all inbox endpoint"
```

### Task 3: Summary View Model and Save-All Component

**Files:**
- Create: `apps/web/src/lib/inboxSummary.ts`
- Create: `apps/web/src/lib/inboxSummary.test.ts`
- Create: `apps/web/src/components/InboxSaveAll.tsx`
- Create: `apps/web/src/components/InboxSaveAll.test.tsx`

- [ ] **Step 1: Write failing summary tests**

Create `apps/web/src/lib/inboxSummary.test.ts` with minimal `ComponentDoc` fixtures and these assertions:

```ts
import { describe, expect, it } from "vitest";
import { summarizeInbox } from "./inboxSummary";
import type { ComponentDoc } from "./content";

function doc(name: string, missingRequired: string[] = [], issues: string[] = []): ComponentDoc {
  return {
    slug: ["_inbox", name.toLowerCase()],
    filePath: "",
    frontmatter: { name },
    body: "",
    updated: null,
    sections: [],
    missingRequired,
    isSpecLayer: false,
    issues,
  };
}

describe("summarizeInbox", () => {
  it("counts components with issues and missing required content once each", () => {
    expect(summarizeInbox([
      doc("Button", ["Accessibility"], ["Invalid token"]),
      doc("Input", ["Definition", "Usage"]),
      doc("Badge"),
    ])).toEqual({
      total: 3,
      withIssues: 1,
      missingRequired: 2,
      items: [
        { name: "Badge", slug: ["_inbox", "badge"] },
        { name: "Button", slug: ["_inbox", "button"] },
        { name: "Input", slug: ["_inbox", "input"] },
      ],
    });
  });
});
```

- [ ] **Step 2: Run the summary test and verify it fails**

Run: `npx vitest run apps/web/src/lib/inboxSummary.test.ts`

Expected: FAIL because `summarizeInbox` does not exist.

- [ ] **Step 3: Implement the pure summary helper**

Create `apps/web/src/lib/inboxSummary.ts`:

```ts
import type { ComponentDoc } from "./content";

export interface InboxSummaryItem {
  name: string;
  slug: string[];
}

export interface InboxSummary {
  total: number;
  withIssues: number;
  missingRequired: number;
  items: InboxSummaryItem[];
}

export function summarizeInbox(docs: ComponentDoc[]): InboxSummary {
  return {
    total: docs.length,
    withIssues: docs.filter((doc) => doc.issues.length > 0).length,
    missingRequired: docs.filter((doc) => doc.missingRequired.length > 0).length,
    items: docs
      .map((doc) => ({ name: doc.frontmatter.name, slug: doc.slug }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}
```

- [ ] **Step 4: Write the save-all component and presentational tests**

Create `apps/web/src/components/InboxSaveAll.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface InboxItem {
  name: string;
  slug: string[];
}

interface InboxFailure {
  source: string[];
  error: string;
}

interface BulkResponse {
  ok?: boolean;
  saved?: string[][];
  failures?: InboxFailure[];
  error?: string;
}

interface InboxSaveAllProps {
  items: InboxItem[];
  folderOptions: string[];
}

export function formatInboxFailures(
  failures: InboxFailure[],
  items: InboxItem[],
): string[] {
  const names = new Map(items.map((item) => [item.slug.join("/"), item.name]));
  return failures.map((failure) =>
    `${names.get(failure.source.join("/")) ?? failure.source.at(-1) ?? "Component"}: ${failure.error}`,
  );
}

export default function InboxSaveAll({ items, folderOptions }: InboxSaveAllProps) {
  const router = useRouter();
  const [folder, setFolder] = useState("Components");
  const [busy, setBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [failureMessages, setFailureMessages] = useState<string[]>([]);
  const options = useMemo(
    () => Array.from(new Set(["Components", ...folderOptions])),
    [folderOptions],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setRequestError(null);
    setFailureMessages([]);

    try {
      const response = await fetch("/api/specs/move-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder, items: items.map((item) => item.slug) }),
      });
      const data = (await response.json()) as BulkResponse;
      if (!response.ok || !data.ok) {
        setRequestError(data.error ?? "Could not save Inbox components.");
        return;
      }

      const failures = data.failures ?? [];
      setFailureMessages(formatInboxFailures(failures, items));
      if ((data.saved?.length ?? 0) > 0) router.refresh();
    } catch {
      setRequestError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form className="inbox-save-all" onSubmit={onSubmit}>
        <label>
          Folder
          <input
            value={folder}
            list="inbox-folder-options"
            onChange={(event) => setFolder(event.target.value)}
            disabled={busy}
          />
        </label>
        <datalist id="inbox-folder-options">
          {options.map((option) => <option key={option} value={option} />)}
        </datalist>
        <button className="btn-primary" type="submit" disabled={busy || items.length === 0}>
          {busy ? "Saving..." : "Save all"}
        </button>
      </form>

      {(requestError || failureMessages.length > 0) && (
        <div className="inbox-save-errors" role="alert">
          {requestError && <p>{requestError}</p>}
          {failureMessages.length > 0 && (
            <>
              <p>{failureMessages.length} components could not be saved:</p>
              <ul>{failureMessages.map((message) => <li key={message}>{message}</li>)}</ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

Create `apps/web/src/components/InboxSaveAll.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import InboxSaveAll, { formatInboxFailures } from "./InboxSaveAll";

const items = [{ name: "Button", slug: ["_inbox", "button"] }];

describe("InboxSaveAll", () => {
  it("renders the Components default and Save all action", () => {
    const html = renderToStaticMarkup(
      <InboxSaveAll items={items} folderOptions={["forms"]} />,
    );
    expect(html).toContain('value="Components"');
    expect(html).toContain("Save all");
    expect(html).toContain('id="inbox-folder-options"');
    expect(html).toContain('value="forms"');
    expect(html).not.toContain("inbox-save-errors");
  });

  it("formats failures with component names and a slug fallback", () => {
    expect(formatInboxFailures([
      { source: ["_inbox", "button"], error: "Destination file already exists" },
      { source: ["_inbox", "unknown"], error: "Source file not found" },
    ], items)).toEqual([
      "Button: Destination file already exists",
      "unknown: Source file not found",
    ]);
  });
});
```

- [ ] **Step 5: Run summary and component tests**

Run: `npx vitest run apps/web/src/lib/inboxSummary.test.ts apps/web/src/components/InboxSaveAll.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit the view-model and client component**

```bash
git add apps/web/src/lib/inboxSummary.ts apps/web/src/lib/inboxSummary.test.ts apps/web/src/components/InboxSaveAll.tsx apps/web/src/components/InboxSaveAll.test.tsx
git commit -m "feat(web): add inbox summary and save all form"
```

### Task 4: Replace the Inbox Review Queue

**Files:**
- Modify: `apps/web/src/app/inbox/page.tsx`
- Modify: `apps/web/src/app/globals.css`
- Delete: `apps/web/src/components/InboxFileForm.tsx`

- [ ] **Step 1: Update the Inbox page composition**

In `apps/web/src/app/inbox/page.tsx`:

1. Remove the `InboxFileForm` import and all per-document card rendering.
2. Import `InboxSaveAll` and `summarizeInbox`.
3. Keep `collectTopLevelGroups()` and the collapsed manual import panel.
4. For non-empty Inbox data, render:

```tsx
const summary = summarizeInbox(docs);

<section className="inbox-summary" aria-labelledby="inbox-summary-title">
  <div className="inbox-summary-head">
    <div>
      <h2 id="inbox-summary-title">Import summary</h2>
      <p>{summary.total} components ready to save.</p>
    </div>
    <InboxSaveAll items={summary.items} folderOptions={groups} />
  </div>

  <dl className="inbox-summary-stats">
    <div><dt>Imported</dt><dd>{summary.total}</dd></div>
    <div><dt>With issues</dt><dd>{summary.withIssues}</dd></div>
    <div><dt>Missing required</dt><dd>{summary.missingRequired}</dd></div>
  </dl>

  <details className="inbox-component-list">
    <summary>View component names</summary>
    <ul>
      {summary.items.map((item) => <li key={item.slug.join("/")}>{item.name}</li>)}
    </ul>
  </details>
</section>
```

Change the header copy to describe Inbox as a landing place for imported components, not a review queue.

- [ ] **Step 2: Replace obsolete Inbox CSS**

In `apps/web/src/app/globals.css`, remove `.inbox-list`, `.inbox-item*`, `.inbox-file-form*`, and `.inbox-item-error`. Add styles for:

```css
.inbox-summary { border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg); padding: 20px; }
.inbox-summary-head { display: flex; align-items: end; justify-content: space-between; gap: 24px; }
.inbox-summary-head h2 { margin: 0; font-size: 18px; }
.inbox-summary-head p { margin: 4px 0 0; color: var(--text-muted); font-size: 13px; }
.inbox-summary-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 20px 0; }
.inbox-summary-stats div { border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg-subtle); padding: 12px; }
.inbox-summary-stats dt { color: var(--text-muted); font-size: 12px; }
.inbox-summary-stats dd { margin: 4px 0 0; font-size: 20px; font-weight: 650; }
.inbox-save-all { display: flex; align-items: end; gap: 8px; }
.inbox-save-all label { display: flex; flex-direction: column; gap: 4px; color: var(--text-muted); font-size: 12px; }
.inbox-save-all input { min-width: 220px; border: 1px solid var(--border-strong); border-radius: var(--radius-sm); padding: 7px 10px; color: var(--text); background: var(--bg); font: inherit; }
.inbox-save-errors { margin: 12px 0 0; color: var(--danger-text); font-size: 12px; }
.inbox-component-list { border-top: 1px solid var(--border); padding-top: 14px; }
.inbox-component-list summary { cursor: pointer; color: var(--text-muted); font-size: 13px; font-weight: 600; }
.inbox-component-list ul { columns: 3; gap: 24px; margin: 12px 0 0; padding-left: 20px; }
.inbox-component-list li { break-inside: avoid; margin-bottom: 4px; font-size: 13px; }
@media (max-width: 760px) {
  .inbox-summary-head, .inbox-save-all { align-items: stretch; flex-direction: column; }
  .inbox-save-all input { min-width: 0; width: 100%; }
  .inbox-summary-stats { grid-template-columns: 1fr; }
  .inbox-component-list ul { columns: 1; }
}
```

- [ ] **Step 3: Remove the obsolete per-item component**

Delete `apps/web/src/components/InboxFileForm.tsx`, then verify no references remain:

Run: `rg -n "InboxFileForm|inbox-file-form|inbox-item" apps/web/src`

Expected: no matches.

- [ ] **Step 4: Run the full automated verification**

Run: `npm test`

Expected: all Vitest tests pass.

Run: `npm run typecheck`

Expected: all workspace TypeScript projects pass.

Run: `npm --workspace apps/web run build`

Expected: Next.js production build succeeds.

- [ ] **Step 5: Verify the workflow in the browser**

Run: `npm --workspace apps/web run dev`

Open `http://localhost:3000/inbox` with the in-app Browser and verify:

1. The page shows aggregate counts and a collapsed component-name list, not full review cards.
2. The folder field starts with `Components` and suggests existing folders.
3. `Save all` changes to `Saving...` and disables duplicate submission.
4. Saving with a custom folder moves pending Markdown and sidecars into that folder.
5. Leaving the field blank saves into `components`.
6. A destination conflict remains in Inbox and displays its component name and reason.
7. The empty state appears after all pending items are saved.

- [ ] **Step 6: Commit the Inbox redesign**

```bash
git add apps/web/src/app/inbox/page.tsx apps/web/src/app/globals.css apps/web/src/components/InboxSaveAll.tsx apps/web/src/components/InboxFileForm.tsx
git commit -m "feat(web): turn inbox into import summary"
```

### Task 5: Final Regression Check

**Files:**
- Verify only; no planned source changes.

- [ ] **Step 1: Run all checks from a clean process**

Run: `npm test && npm run typecheck && npm --workspace apps/web run build`

Expected: all commands exit with status 0.

- [ ] **Step 2: Inspect the final diff for scope and generated content**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; only planned source/test files plus pre-existing user changes are present. Do not stage or modify the generated files under `apps/web/content/components/_inbox`.

- [ ] **Step 3: Record the implementation state**

Run: `git log --oneline -5`

Expected: the helper, API, component, and Inbox redesign commits are present, with no unrelated files included in those commits.
