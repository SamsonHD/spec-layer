# Figma Component Sync (Drift Detection) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detect and surface when saved library specs no longer match their Figma source, and give the designer an actionable workflow to resolve drift without losing human-authored prose. The plugin re-extracts every component in the open file, recomputes each `content_hash`, and reports to the docs app; the app compares against the saved library by `figma_key`, persists a drift report, and surfaces out-of-date / missing / new components on the component page, a new Sync page, the home stats, and a per-selection chip in the plugin. Resolving drift re-uses the inbox review gate via a section-preserving **Update** action.

**Architecture:** Plugin-driven, hash-parity drift detection (the plugin owns Figma access and runs the same extractor that produced the stored hash). The app owns the library and the persisted report. See the design doc for the full rationale, including why server-side REST extraction is not used (the Figma Variables REST API is Enterprise-only, so a server recompute cannot reproduce the hash on Professional).

**Milestones:**
- **Milestone 1 — Detect & surface (Tasks 1–8):** the plugin Check-library-sync + per-selection chip, the `/api/sync/*` endpoints, the persisted report, and all read-only surfacing (component banner, `/sync`, home, freshness).
- **Milestone 2 — Resolve (Tasks 9–10):** inbox **update** recognition + the section-preserving **Update** action, and the one-click **Update from Figma** CTA. Closes the loop without the inbox 409 dead-end and without discarding judgment sections.

This plan is implementable milestone-by-milestone; Milestone 1 ships independently.

---

## Execution Log

Living record of what shipped, for anyone picking this up. Newest first.

### Milestone 2 — Resolve (shipped)

Goal: close the drift loop. A re-extracted component sent to docs lands in the inbox; the inbox recognizes it as an **update** to an existing library spec (matched by `figma_key`) and offers a **section-preserving Update** that refreshes deterministic sections + frontmatter while keeping the human-authored judgment sections (Definition, Code, Accessibility, Do's & Don'ts). A drifted component page also offers a one-click **Update from Figma** when a matching inbox draft already exists. Aligned with `spec/SIDECAR.md` (the sidecar moves with the markdown).

Implemented as Tasks 9–10 below. Status checklist:

- [x] Task 9.1 — `lib/specUpdate.ts` `updateLibrarySpecFromInbox` (section-preserving merge, sidecar move, inbox cleanup, report flip) + tests
- [x] Task 9.2 — `summarizeInbox` update recognition (match inbox `figma_key` → library spec) + tests
- [x] Task 9.3 — `POST /api/specs/update` route + tests
- [x] Task 9.4 — inbox UI **Update → &lt;slug&gt;** affordance (`inboxUpdateRequest` + `InboxComponentList`)
- [x] Task 10 — one-click **Update from Figma** on the drifted component-page banner when a matching inbox draft exists (`SyncAlert` is now a client component); `/sync` rows link to the component page where the action lives
- [x] Docs — CHANGELOG, ARCHITECTURE, README, this plan checked off
- [x] Verification — typecheck + lint clean, 630 tests pass, web + plugin builds succeed (commands run from repo root)

**Shipped commits:** `feat(web): section-preserving spec update from inbox re-extraction` · `feat(web): inbox Update affordance for drafts that re-extract a saved spec` · `feat(web): one-click Update from Figma on the drift banner` · `docs: …`. New files: `lib/specUpdate.ts`, `app/api/specs/update/route.ts`, `components/inboxUpdateRequest.ts` (+ tests). Modified: `lib/inboxSummary.ts`, `components/InboxComponentList.tsx`, `components/SyncAlert.tsx`, `app/inbox/page.tsx`, `app/components/[...slug]/page.tsx`, `globals.css`.

**Still open (future, not in this milestone):** import the `new-in-figma` candidates straight into the inbox; Enterprise server-side checks via the Variables API; sidebar drift dots. A manual resolve-loop smoke test against a real Figma file still wants a human pass (the automated suite covers the merge/route/UI units).

Scope decisions for this pass (documented so they're intentional, not accidental):
- The web app cannot re-extract from Figma (the whole premise is plugin-driven, hash-parity — see *Why plugin-driven*). So "Update from Figma" is genuinely one-click **only when a re-extracted inbox draft already exists**; otherwise the surfaces keep the guidance copy ("Re-extract in the Figma plugin and send to docs").
- The section-preserving merge preserves the four judgment sections plus the existing file's `status`, `approved_by`, and any top-level `name:` rename; everything else (deterministic sections, `content_hash`, `extracted_at`, `component.*`) comes from the re-extraction.
- `Save All` is unchanged; per-item **Update** replaces the per-item **Save** button for items recognized as updates (avoids the 409 the plain move would hit).

### Milestone 1 — Detect & surface (shipped)

Plugin **Check library sync** + selection doc-status chip; `/api/sync/check` + `/api/sync/lookup`; `.spec-sync.json` report; component-page banner, `/sync` overview, home **Out of date** card, freshness. Merged with `main`'s sidecar zip-export fix and the `codex/sidecar-import-export` sidecar import work — all coexisting, full suite green.

---

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Node `fs`, Vitest (node environment — component tests use `renderToStaticMarkup`, never DOM interaction). Plugin is vanilla TS + the pure `@spec-layer/extractor`.

**Spec:** `docs/superpowers/specs/2026-06-16-figma-component-sync-design.md`

---

## Conventions

- All test commands run from the repo root. Vitest config is at the repo root (`vitest.config.ts`); the `@` alias maps to `apps/web/src`.
- Run a single test file with: `npx vitest run <path-from-root>`.
- Content root resolves from `getContentDir()` (`DS_CONTENT_DIR`, else `apps/web/content/components`). The drift report lives at `<contentRoot>/.spec-sync.json`.
- Follow existing patterns exactly. Templates being mirrored: `api/specs/import/route.ts` and `api/specs/move-all/route.ts` (route security + shape), `lib/specWriter.ts` (content-root fs helpers, atomic write), `components/GapsAlert.tsx` (additive page banner), `lib/homeStats.ts` (derived metrics), and the Export-all flow in `packages/plugin/src/ui/{actions,dom,ui}.ts` (bulk scan reuse).
- Matching key is `component.figma_key`; the 64-zero `content_hash` means "hand-authored, not applicable."

## File Structure

**Milestone 1 — Detect & surface**

- **Modify** `.gitignore` — ignore `**/.spec-sync.json`.
- **Create** `apps/web/src/lib/sync.ts` — report types + `readSyncReport`, `writeSyncReport`, `computeFileSync`, `lookupSpecByFigmaKey`, `getSpecSyncStatus`.
- **Create** `apps/web/src/lib/sync.test.ts`.
- **Create** `apps/web/src/lib/relativeTime.ts` (+ `relativeTime.test.ts`) — `formatRelative`, `isStale` (7-day threshold).
- **Create** `apps/web/src/app/api/sync/check/route.ts` (+ `route.test.ts`) — `POST` + `OPTIONS`, whole-file report write.
- **Create** `apps/web/src/app/api/sync/lookup/route.ts` (+ `route.test.ts`) — `POST` + `OPTIONS`, read-only per-component status for the plugin chip.
- **Create** `apps/web/src/components/SyncAlert.tsx` (+ `SyncAlert.test.tsx`) — out-of-date / missing banner.
- **Create** `apps/web/src/app/sync/page.tsx` (+ `page.test.tsx`) — drift overview.
- **Modify** `apps/web/src/app/components/[...slug]/page.tsx` — render `SyncAlert` from `getSpecSyncStatus(slug)`; add the in-sync meta-row line.
- **Modify** `apps/web/src/lib/content.ts` (+ `content.test.ts`) — expose `figmaKey` on `ComponentFrontmatter`.
- **Modify** `apps/web/src/lib/homeStats.ts` (+ `homeStats.test.ts`) — add `outOfDate`.
- **Modify** `apps/web/src/app/page.tsx` — add the **Out of date** card + a `/sync` nav link.
- **Modify** `apps/web/src/app/globals.css` — banner, chip, sync-page styles (reuse existing alert tokens where possible).
- **Modify** `packages/plugin/src/ui/actions.ts` (+ a focused test) — `bulkMode`, `syncItems`, `runCheckSync`, `fingerprintNode`, `runSelectionStatus`; branch in `handleExportComponent` / `handleExportAllDone`.
- **Modify** `packages/plugin/src/ui/dom.ts` — **Check library sync** button + status line, the selection doc-status chip, refs.
- **Modify** `packages/plugin/src/ui/render.ts` — render the chip + sync summary states.
- **Modify** `packages/plugin/src/ui/ui.ts` — wire the button and trigger the lookup after extraction.
- **Modify** `ARCHITECTURE.md` (Storage) and `README.md` (Content Safety + Roadmap) — document `.spec-sync.json` and the new flow.

**Milestone 2 — Resolve**

- **Modify** `apps/web/src/lib/inboxList.ts` / `inboxSummary.ts` (+ tests) — flag inbox items whose `figma_key` matches an existing non-inbox library spec as an **update** with the target slug.
- **Create** `apps/web/src/lib/specUpdate.ts` (+ test) — `updateLibrarySpecFromInbox(source, targetSlug)`: section-preserving merge (deterministic + frontmatter from the new extraction, judgment sections kept from the existing file), then remove the inbox draft + sidecar; optionally flip the `.spec-sync.json` entry to in-sync.
- **Create** `apps/web/src/app/api/specs/update/route.ts` (+ `route.test.ts`) — `POST` + `OPTIONS`.
- **Create/Modify** inbox components — surface the **Update → &lt;slug&gt;** affordance and action (mirroring `InboxSaveAll` / `inboxSaveRequest`).
- **Modify** `components/SyncAlert.tsx` and the component page — turn the banner CTA into a one-click **Update from Figma** where an update path exists.

---

## UX Specification

This section is the single source of truth for copy and states; tasks reference it. All copy is placeholder-final — adjust wording in review, not structure.

### Plugin — selection doc-status chip (Selected component tab)

Placed beside `#component-name`. Resolved after **Extract spec** by POSTing the extracted spec's `{ figmaKey, contentHash }` to `/api/sync/lookup`. State → markup:

| State | Indicator | Text | Action |
|---|---|---|---|
| `in-sync` | success dot + ✓ | `In sync with docs` | none |
| `drifted` | warning dot | `Out of date in docs` | **Update docs** button |
| `absent` | neutral dot | `Not in docs yet` | existing **Send to docs** |
| unavailable | muted | `Doc status unavailable` (or hidden) | none |

- Conveys state with **icon + text**, not color alone; `aria-label` spells out the meaning (e.g. *"Out of date in docs — the saved spec differs from this Figma component"*).
- "Unavailable" covers: no docs endpoint reachable, no effective file key, non-200, or no `figmaKey` on the spec. Never shows an error banner — the chip just degrades.
- **Update docs** runs the existing send (Milestone 1) and deep-links to the inbox; once Milestone 2 lands, the inbox shows the item as an update.

### Plugin — Library sync (Export all tab)

A `Library sync` sub-section with hint *"Compare your saved docs against this Figma file."* and a **Check library sync** button. Status line (`#sync-status`) states, reusing the export scan:

- Scanning: `Scanning file for components…`
- Progress: `Comparing 24 of 60…`
- Posting: `Comparing against your library…`
- Result (mixed), each line icon+count, urgency order:
  - `⚠ 3 out of date`
  - `⊘ 1 not found in Figma`
  - `✓ 9 in sync`
  - `＋ 5 in Figma aren't documented`
  - `Checked against 12 saved specs.`
  - **Open sync report ↗** (opens `${docsEndpoint}/sync`)
- All in sync: `✓ All 12 specs are up to date.`
- No matches: `No saved specs match this Figma file yet. Export some components first.`
- Docs unreachable: existing send-failure copy (`Couldn't reach your docs app at <url>…`).
- No file key: existing inline file-key prompt (`canSendToDocs`).

### App — component page

Rendered above `GapsAlert`; **never** on inbox docs (`slug[0] === "_inbox"`).

- `drifted` banner (warning treatment, like `GapsAlert`), `role="status"`:
  - Title: **Out of date with Figma**
  - Body: *The Figma component changed since this spec was extracted on `<extracted_at date>`. Last checked `<relative>`.* + (Milestone 1) *Re-extract it in the Figma plugin and send to docs to update.* / (Milestone 2) a **Update from Figma** button.
  - Link: **View all changes →** to `/sync`.
  - If the check is stale (`isStale(checkedAt)`): append *— run a fresh check for current status.*
- `missing-in-figma` banner:
  - Title: **Not found in Figma**
  - Body: *This spec's component wasn't in the last scan of its Figma file (`<relative>`). It may have been removed or renamed in Figma.*
- `in-sync` / none: no banner. Add a muted meta-row item: *✓ In sync with Figma · checked `<relative>`.*

### App — `/sync` page

- Header: **Sync** + subtitle *How your saved specs compare to Figma. Refresh by running **Check library sync** in the Figma plugin.*
- Empty (no report): *No sync checks yet. Open the Spec Layer plugin in Figma and run **Check library sync** to see what's changed.*
- Summary chip strip: `Out of date N · Not in Figma N · In sync N · Undocumented N`.
- Grouped by Figma file (single group when one file). Per file: header `Last checked <relative> · N scanned`; if `isStale`, a freshness note *Run a fresh check for current status.* Sections in urgency order, each hidden when empty:
  - **Out of date (N)** — name (link), *extracted `<date>`*, *checked `<relative>`*, hint/CTA per milestone.
  - **Not found in Figma (N)** — name (link), *checked `<relative>`*, the removal/rename note.
  - **Undocumented in Figma (N)** — name (no link), *Exists in Figma, no spec yet.* (Milestone 2 future: **Add to inbox**.)
  - **In sync (N)** — collapsed `details/summary`; name (link), *checked `<relative>`*.

### App — home

- **Out of date** metric card = drifted + missing count, links to `/sync`. With a report and zero drift → `0`. With no report → `—` (not a misleading `0`); sublabel *run a sync check in the plugin*.
- Add a **Sync** link to navigation.

### `formatRelative` rules

`just now` (<60s), `N min ago` (<60m), `N hours ago` (<24h), `yesterday` (<48h), `N days ago` (<7d), else `on D Mon` (e.g. `on 12 Jun`). `isStale` is true at ≥ 7 days. Unit-test each boundary with an injected `now`.

---

## Task 0: Branch

The working branch is `claude/md-component-figma-sync-xqyeca`. Confirm it is checked out before any work.

- [ ] `git rev-parse --abbrev-ref HEAD` → `claude/md-component-figma-sync-xqyeca` (create from `main` if missing).

---

# Milestone 1 — Detect & surface

## Task 1: `lib/sync.ts` — report model + compute

**Files:** create `apps/web/src/lib/sync.ts`, `apps/web/src/lib/sync.test.ts`.

- [ ] **Step 1: Write failing tests** covering `computeFileSync` and the read/write round-trip.

Key cases for `computeFileSync(fileKey, components, docs)`:
- Eligible spec, key present, hashes equal → `in-sync`.
- Eligible spec, key present, hashes differ → `drifted` with `savedHash`/`currentHash`.
- Eligible spec, key absent from components → `missing-in-figma` (no `currentHash`).
- Spec with `figma_file !== fileKey` → not evaluated by this call.
- Spec with 64-zero hash → excluded (not applicable).
- Spec with empty `figma_key` → excluded.
- Component whose key matches no spec → listed in `files[fileKey].newInFigma`.
- Inbox docs (`slug[0] === "_inbox"`) → never evaluated.

For `readSyncReport`/`writeSyncReport`: round-trip a report; `readSyncReport` returns `null`/empty on a missing or corrupt file; `writeSyncReport` for file `F` replaces `files[F]` and all `specs` entries whose `figmaFile === F`, preserving entries for other files.

- [ ] **Step 2: Implement.** Sketch:

```ts
import fs from "node:fs";
import path from "node:path";
import type { ComponentDoc } from "./content";
import { getContentDir } from "./config";

export const SYNC_REPORT_VERSION = 1 as const;
const ZERO_HASH = "0".repeat(64);

export type SyncStatus = "in-sync" | "drifted" | "missing-in-figma";

export interface SyncComponentFingerprint {
  figmaKey: string;
  figmaNode: string;
  name: string;
  contentHash: string;
}

export interface SyncSpecEntry {
  status: SyncStatus;
  figmaKey: string;
  figmaFile: string;
  savedHash: string;
  currentHash?: string;
  checkedAt: string;
}

export interface SyncFileEntry {
  checkedAt: string;
  scannedCount: number;
  newInFigma: Array<{ figmaKey: string; name: string }>;
}

export interface SyncReport {
  version: typeof SYNC_REPORT_VERSION;
  files: Record<string, SyncFileEntry>;
  specs: Record<string, SyncSpecEntry>;
}

function reportPath(): string {
  return path.join(getContentDir(), ".spec-sync.json");
}

export function readSyncReport(): SyncReport | null {
  try {
    const raw = fs.readFileSync(reportPath(), "utf-8");
    const parsed = JSON.parse(raw) as SyncReport;
    if (!parsed || parsed.version !== SYNC_REPORT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSyncReport(report: SyncReport): void {
  const file = reportPath();
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(report, null, 2), "utf-8");
  fs.renameSync(tmp, file); // atomic replace, matching specWriter conventions
}

/** Per-file result merged into a (possibly empty) prior report. */
export function computeFileSync(
  fileKey: string,
  components: SyncComponentFingerprint[],
  docs: ComponentDoc[],
  prior: SyncReport | null = readSyncReport(),
  now: string = new Date().toISOString(),
): SyncReport {
  const byKey = new Map(components.filter((c) => c.figmaKey).map((c) => [c.figmaKey, c]));
  const matchedKeys = new Set<string>();

  // Start from prior, dropping this file's stale per-spec + per-file entries.
  const specs: Record<string, SyncSpecEntry> = {};
  for (const [slug, entry] of Object.entries(prior?.specs ?? {})) {
    if (entry.figmaFile !== fileKey) specs[slug] = entry;
  }

  const allKnownKeys = new Set<string>(); // keys claimed by ANY saved spec, for new-in-figma
  for (const doc of docs) {
    if (doc.slug[0] === "_inbox") continue;
    const fm = doc.frontmatter;
    const key = fm.figmaRef ? undefined : undefined; // figma_key lives on frontmatter; see note
    // NOTE: ComponentFrontmatter exposes figma via figmaRef (file+node). The
    // stable component key is component.figma_key — expose it through
    // ComponentFrontmatter (add `figmaKey?: string`, populated in lib/content.ts
    // from frontmatter.component.figma_key) as part of this task.
  }
  // ... classify eligible specs for this fileKey (see test cases), collect
  // matchedKeys, then newInFigma = components whose key is in no saved spec.

  const slug = (d: ComponentDoc) => d.slug.join("/");
  // (full classification body per the failing tests)

  const files = { ...(prior?.files ?? {}) };
  files[fileKey] = {
    checkedAt: now,
    scannedCount: components.length,
    newInFigma: components
      .filter((c) => c.figmaKey && !allKnownKeys.has(c.figmaKey))
      .map((c) => ({ figmaKey: c.figmaKey, name: c.name })),
  };

  return { version: SYNC_REPORT_VERSION, files, specs };
}

export function getSpecSyncStatus(slug: string[]): SyncSpecEntry | null {
  return readSyncReport()?.specs[slug.join("/")] ?? null;
}
```

> **Prerequisite within this task:** expose the stable component key on `ComponentFrontmatter`. In `apps/web/src/lib/content.ts`, add `figmaKey?: string` to `ComponentFrontmatter` and populate it in both `parse` (Spec Layer path: `frontmatter.component.figma_key`) and `parseLegacyDoc` (`asString(asRecord(fm.component).figma_key)`). Add a small test asserting `figmaKey` is read from `component.figma_key`. `computeFileSync` keys off this field plus `figmaRef.fileKey` (which equals `component.figma_file`).

- [ ] **Step 3:** Tests green. **Commit:** `feat(web): add sync report model and drift computation`.

---

## Task 2: `lib/relativeTime.ts`

**Files:** create `apps/web/src/lib/relativeTime.ts`, `relativeTime.test.ts`.

- [ ] **Step 1:** Failing tests over `formatRelative(iso, now)` and `isStale(iso, now)` for each boundary in the *`formatRelative` rules* table (UX Specification). Use an injected `now` so the tests are deterministic; `isStale` true at ≥ 7 days.
- [ ] **Step 2:** Implement both as pure functions (no `Date.now()` reads inside — `now` defaults to `new Date().toISOString()` at the boundary only).
- [ ] **Step 3:** Tests green. **Commit:** `feat(web): add relative-time + freshness helpers`.

---

## Task 3: `POST /api/sync/check`

**Files:** create `apps/web/src/app/api/sync/check/route.ts`, `route.test.ts`.

- [ ] **Step 1: Write failing tests**, mirroring `api/specs/import/route.test.ts`:
  - 413 when `Content-Length` exceeds the limit; CORS-readable 400 for invalid JSON; 400 for a non-object body, missing/invalid `fileKey`, non-array `components`, or `components.length` over the cap.
  - `OPTIONS` returns 204 with CORS headers; cross-origin POST is rejected; `Origin: null` (plugin) is accepted.
  - Happy path: writes `.spec-sync.json` with the expected `files`/`specs` and returns `{ ok: true, fileKey, summary: { inSync, drifted, missingInFigma, newInFigma } }`.

- [ ] **Step 2: Implement**, reusing `authorizeApiRequest`, `corsHeaders`, `assertContentLength`/`PayloadTooLargeError`, `force-dynamic`, and `getAllDocs()`:

```ts
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_COMPONENTS = 5000;

interface CheckBody { fileKey?: unknown; components?: unknown }
// validate fileKey (string matching /^[A-Za-z0-9]{10,}$/), validate each
// component is { figmaKey, figmaNode, name, contentHash } of strings,
// then: const report = computeFileSync(fileKey, components, getAllDocs());
// writeSyncReport(report); return summary derived from report.
```

- [ ] **Step 3:** Tests green. **Commit:** `feat(web): add sync check endpoint`.

---

## Task 4: `POST /api/sync/lookup` (per-selection chip backend)

**Files:** create `apps/web/src/app/api/sync/lookup/route.ts`, `route.test.ts`.

- [ ] **Step 1: Failing tests:** mirror the check route's security (`OPTIONS` 204, cross-origin rejected, `Origin: null` accepted, 400 on bad body). Behavior: given `{ figmaKey, contentHash }`, returns `{ status: "in-sync" | "drifted" | "absent", slug? }` — `absent` when no saved (non-inbox, eligible) spec has that `figma_key`; `in-sync`/`drifted` by hash equality; includes the matched `slug`.
- [ ] **Step 2: Implement** with `lookupSpecByFigmaKey(figmaKey, contentHash, getAllDocs())` from `lib/sync.ts` (add this read-only helper + its unit tests to Task 1). Small body limit; no report write.
- [ ] **Step 3:** Tests green. **Commit:** `feat(web): add sync lookup endpoint`.

---

## Task 5: Component-page banner + in-sync meta line

**Files:** create `components/SyncAlert.tsx`, `SyncAlert.test.tsx`; modify `app/components/[...slug]/page.tsx`; add CSS.

Implement to the *App — component page* copy/states in the UX Specification.

- [ ] **Step 1:** `SyncAlert.test.tsx` (static markup): `drifted` → **Out of date with Figma** with the extracted date and *checked `<relative>`*; a stale check appends the fresh-check note; `missing-in-figma` → **Not found in Figma**; `in-sync`/`null` → no banner. Assert icon+text present (state not by color alone).
- [ ] **Step 2:** Implement `SyncAlert({ status })` (`status: SyncSpecEntry | null`), reusing the `GapsAlert` warning treatment and `formatRelative`/`isStale`. Includes the **View all changes →** link to `/sync`.
- [ ] **Step 3:** In the component page: `const sync = getSpecSyncStatus(slug);` render `<SyncAlert status={sync} />` above `<GapsAlert …/>`; skip for `isInboxDoc`. When `in-sync`, add the muted meta-row line *✓ In sync with Figma · checked `<relative>`*.
- [ ] **Step 4:** Typecheck + tests. **Commit:** `feat(web): surface drift on the component page`.

---

## Task 6: `/sync` overview page + home stat

**Files:** create `app/sync/page.tsx`, `page.test.tsx`; modify `lib/homeStats.ts` (+ test), `app/page.tsx`, CSS. Implement to the *App — `/sync` page* and *App — home* sections of the UX Specification.

- [ ] **Step 1:** `homeStats.test.ts`: `outOfDate` counts specs whose report status is `drifted` or `missing-in-figma`, excludes inbox + not-applicable, and is `0` with a report present / `null` when no report exists (so the card can show `—`). Add `report?: SyncReport | null` to `getHomeStats(docs, report)`, keeping it pure; read the report at the call site.
- [ ] **Step 2:** `app/sync/page.tsx` (`force-dynamic`): read `readSyncReport()` + `getAllDocs()`; render the summary chip strip, per-file groups with last-checked + freshness note, and the urgency-ordered sections (**Out of date**, **Not found in Figma**, **Undocumented in Figma**, collapsed **In sync**). Empty state when no report. Drifted/missing rows link to component pages; undocumented rows are plain text.
- [ ] **Step 3:** `page.test.tsx`: static-markup with a stubbed report asserts each bucket, the freshness note when stale, and the empty state.
- [ ] **Step 4:** Home: **Out of date** card (drifted + missing; `—` when no report) linking to `/sync`; add a **Sync** nav link.
- [ ] **Step 5:** Typecheck + tests. **Commit:** `feat(web): add sync overview page and out-of-date stat`.

---

## Task 7: Plugin — Check library sync + selection chip

**Files:** modify `packages/plugin/src/ui/{actions,dom,render,ui}.ts`; add focused tests. Implement to the *Plugin* sections of the UX Specification.

- [ ] **Step 1:** Add the pure `fingerprintNode` helper + test in `ui/actions.ts`:

```ts
import { extract, contentHash } from "@spec-layer/extractor";

export function fingerprintNode(node: SerializedNode, fileKey: string):
  | { figmaKey: string; figmaNode: string; name: string; contentHash: string }
  | null {
  const spec = extract(node, { figmaFile: fileKey });
  if (!spec.figmaKey) return null; // unmatchable
  return { figmaKey: spec.figmaKey, figmaNode: spec.figmaNode, name: spec.name, contentHash: contentHash(spec) };
}
```

Test: a keyed fixture yields a hash equal to `contentHash(extract(node, { figmaFile }))`; a keyless node yields `null`.

- [ ] **Step 2 — bulk check:** Extend `UiState` with `bulkMode: 'export' | 'sync'` (default `'export'`) and `syncItems`. Add `runCheckSync(refs, state)`: reset accumulators, set `bulkMode='sync'`, render scanning, `send({ type: 'requestExportAll', includeAtoms: true })`. In `handleExportComponent`, branch on mode: `sync` → push `fingerprintNode(node, state.exportFileKey)` (skip `null`) and update the progress line; `export` → unchanged. In `handleExportAllDone`, branch: `export` → zip; `sync` → POST `{ fileKey, components: state.syncItems }` to `${base}/api/sync/check`, render the result summary (per UX: counts + **Open sync report ↗**), `send openBrowser` to `${base}/sync`; reset `bulkMode='export'` in `finally`. Handle the no-matches / unreachable / no-file-key end states.

- [ ] **Step 3 — selection chip:** Add `runSelectionStatus(refs, state)` that, after a successful extract with a non-empty `currentFileKey`, POSTs `{ figmaKey, contentHash }` (from `state.currentSpec`) to `${base}/api/sync/lookup` and renders the chip state. Any failure → muted "unavailable", never a banner. Call it at the end of `runExtract`. **Update docs** on the `drifted` chip calls the existing `runSendToDocs`.

- [ ] **Step 4 — markup:** `ui/dom.ts`: add the **Check library sync** button (`#check-sync-btn`) + `#sync-status` in the Export-all panel, and the `#doc-status-chip` beside `#component-name`; add refs. `ui/render.ts`: chip + summary render helpers. `ui/ui.ts`: wire `#check-sync-btn` → `runCheckSync`.

- [ ] **Step 5:** `npm run build:plugin` succeeds; helper test green. **Commit:** `feat(plugin): add library sync check and selection doc-status`.

---

## Task 8: Docs + ignore (Milestone 1)

- [ ] `.gitignore`: add `**/.spec-sync.json`.
- [ ] `ARCHITECTURE.md` Storage: add `.spec-sync.json` to the untracked-artifacts list with a one-line description.
- [ ] `README.md`: add `.spec-sync.json` to Content Safety; update Roadmap to note drift detection as landed (leave Git-backed sync as remaining).
- [ ] **Commit:** `docs: document the sync report and drift detection`.

---

## Milestone 1 verification

- [ ] `npm test`, `npm run lint && npm run typecheck`, `npm run build`, `npm run build:plugin` — all clean.
- [ ] **Manual smoke (app + plugin):** save a component; in the plugin, confirm its chip reads **In sync with docs**. Change it in Figma; the chip flips to **Out of date in docs**. Run **Check library sync**; the plugin shows the summary, the component page shows **Out of date**, `/sync` lists it under its file with a *checked &lt;relative&gt;* time, and the home **Out of date** count is ≥ 1. Delete `.spec-sync.json` and confirm the app renders normally (no drift info, home card shows `—`).
- [ ] superpowers:requesting-code-review against this plan + the design.

---

# Milestone 2 — Resolve (close the loop)

> **Why this milestone exists:** `lib/inboxMove.ts` copies with `COPYFILE_EXCL` and returns **409** when the destination already exists, so a re-extracted spec sent to docs lands as a fresh inbox draft that cannot be saved over the existing library file; the only crude workaround (delete + save) discards the judgment sections. Milestone 2 adds an explicit, prose-preserving **Update** path. The plain Save/move keeps its 409 safety for genuinely new components.

## Task 9: Inbox update recognition + section-preserving Update

**Files:** modify `lib/inboxList.ts` / `lib/inboxSummary.ts` (+ tests); create `lib/specUpdate.ts` (+ test) and `app/api/specs/update/route.ts` (+ `route.test.ts`); surface the affordance in the inbox components.

- [ ] **Step 1 — recognition (failing test first):** an inbox item whose spec/frontmatter `figma_key` matches an existing non-inbox library spec is annotated `{ update: { targetSlug } }`. Match by `figma_key`; ignore items with no key. Compute it where the inbox list is built (reads `getAllDocs()`), excluding `_inbox` from the candidate library set.
- [ ] **Step 2 — merge helper (failing test first):** `updateLibrarySpecFromInbox(source, targetSlug)` in `lib/specUpdate.ts`:
  - Read the existing library `.md` and the inbox `.md`. Using `lib/sections.ts` partitioning, build the merged body: **deterministic** sections (Anatomy, Configuration, Variants, States, Tokens used, Related atoms, Extraction gaps) and identity frontmatter (`content_hash`, `extracted_at`, and `component.*`) come from the inbox (new) spec; the four **judgment** sections (Definition, Code, Accessibility, Do's & Don'ts) are kept from the existing library file.
  - Write the merged file to the existing library path (overwrite intended), refresh the `.spec-data` sidecar, then delete the inbox `.md` + sidecar. Guard slugs/symlinks exactly like `inboxMove.ts`. As a nicety, flip that slug's `.spec-sync.json` entry to `in-sync` using the new hash.
  - Tests: judgment sections preserved verbatim; deterministic sections + frontmatter replaced; inbox draft removed; a missing judgment section in the old file falls back to the new content; unsafe slugs rejected.
- [ ] **Step 3 — route:** `POST /api/specs/update` `{ source: string[], targetSlug: string[] }`, guarded like `api/specs/move-all`; maps errors to status; returns the updated slug.
- [ ] **Step 4 — inbox UI:** items with an `update` annotation render an **Update → &lt;targetSlug&gt;** action (alongside Save), with confirm + busy + error states mirroring `InboxSaveAll`/`inboxSaveRequest`; on success refresh.
- [ ] **Step 5:** Tests green; typecheck. **Commit:** `feat(web): update existing specs from Figma re-extraction (prose-preserving)`.

## Task 10: One-click "Update from Figma" CTA

**Files:** modify `components/SyncAlert.tsx`, the component page, and the `/sync` out-of-date rows.

- [ ] When a drifted spec has a known Figma source, the banner/row CTA becomes **Update from Figma**: it routes the designer through the re-extract → inbox-update flow (Milestone 1's plugin **Update docs** + Task 9's inbox **Update**). Document the exact click path in the component-page help text so it is unambiguous which side (plugin) performs the re-extract.
- [ ] Update the *App — component page* and *`/sync`* copy from the Milestone-1 guidance wording to the one-click wording.
- [ ] **Commit:** `feat(web): one-click Update from Figma on drift surfaces`.

---

## Final verification (both milestones)

- [ ] `npm test`, `npm run lint && npm run typecheck`, `npm run build`, `npm run build:plugin` — all clean.
- [ ] **Manual resolve loop:** drift a documented component; from the plugin chip click **Update docs**; in the inbox confirm the item shows **Update → &lt;slug&gt;** and clicking it preserves the existing Definition/Code/Accessibility/Do's prose while refreshing the deterministic sections; re-run **Check library sync** and confirm the component is now **In sync** everywhere.
- [ ] superpowers:requesting-code-review against the full branch.

---

## Notes for the implementer

- **Hash parity is the contract.** The plugin computes the hash with the *same* `figmaFile` the saved spec used (a check evaluates only specs whose `figma_file` equals the scanned file key). The app never recomputes hashes — it only compares strings.
- **Additive and non-blocking.** Every drift surface (chip, banner, `/sync`, home card) degrades to "unavailable"/"no info" on missing report, unreachable docs, or missing file key — never an error that blocks the library or the plugin's core flows.
- **No silent overwrite.** Milestone 1 changes no `.md`. In Milestone 2, only the explicit inbox **Update** overwrites a library file, and it preserves judgment sections; plain Save keeps its 409 safety.
- **Reuse the scan.** The plugin bulk change is UI-only: no `main.ts`/`messages.ts` edits. Check-library-sync rides the existing Export-all enumeration and node stream, branching on `bulkMode`.
- **No DOM test env.** Web component/page tests render with `renderToStaticMarkup`; plugin click paths are covered by the manual smoke tests, matching the existing suites.
