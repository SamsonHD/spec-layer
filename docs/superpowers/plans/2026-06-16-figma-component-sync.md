# Figma Component Sync (Drift Detection) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detect and surface when saved library specs no longer match their Figma source. The plugin re-extracts every component in the open file, recomputes each `content_hash`, and reports to the docs app; the app compares against the saved library by `figma_key`, persists a drift report, and surfaces out-of-date / missing / new components on the component page, a new Sync page, and the home stats.

**Architecture:** Plugin-driven, hash-parity drift detection (the plugin owns Figma access and runs the same extractor that produced the stored hash). The app owns the library and the persisted report. No automatic rewriting of specs — resolution is deferred. See the design doc for the full rationale, including why server-side REST extraction is not used (the Figma Variables REST API is Enterprise-only, so a server recompute cannot reproduce the hash on Professional).

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

- **Modify** `.gitignore` — ignore `**/.spec-sync.json`.
- **Create** `apps/web/src/lib/sync.ts` — report types + `readSyncReport`, `writeSyncReport`, `computeFileSync`, `getSpecSyncStatus`.
- **Create** `apps/web/src/lib/sync.test.ts`.
- **Create** `apps/web/src/app/api/sync/check/route.ts` — `POST` + `OPTIONS`.
- **Create** `apps/web/src/app/api/sync/check/route.test.ts`.
- **Create** `apps/web/src/components/SyncAlert.tsx` — out-of-date / missing banner.
- **Create** `apps/web/src/components/SyncAlert.test.tsx`.
- **Create** `apps/web/src/app/sync/page.tsx` — drift overview.
- **Create** `apps/web/src/app/sync/page.test.tsx` (static-markup render test).
- **Modify** `apps/web/src/app/components/[...slug]/page.tsx` — render `SyncAlert` from `getSpecSyncStatus(slug)`.
- **Modify** `apps/web/src/lib/homeStats.ts` (+ `homeStats.test.ts`) — add `outOfDate`.
- **Modify** `apps/web/src/app/page.tsx` — add the **Out of date** card + a `/sync` nav link.
- **Modify** `apps/web/src/app/globals.css` — banner + sync-page styles (reuse existing alert tokens where possible).
- **Modify** `packages/plugin/src/ui/actions.ts` (+ a focused test) — `bulkMode`, `syncItems`, `runCheckSync`, branch in `handleExportComponent` / `handleExportAllDone`; factor the fingerprint into a tested pure helper.
- **Modify** `packages/plugin/src/ui/dom.ts` — **Check library sync** button, status line, refs.
- **Modify** `packages/plugin/src/ui/ui.ts` — wire the button.
- **Modify** `ARCHITECTURE.md` (Storage) and `README.md` (Content Safety + Roadmap) — document `.spec-sync.json` and the new flow.

---

## Task 0: Branch

The working branch is `claude/md-component-figma-sync-xqyeca`. Confirm it is checked out before any work.

- [ ] `git rev-parse --abbrev-ref HEAD` → `claude/md-component-figma-sync-xqyeca` (create from `main` if missing).

---

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

## Task 2: `POST /api/sync/check`

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

## Task 3: Component-page banner

**Files:** create `components/SyncAlert.tsx`, `SyncAlert.test.tsx`; modify `app/components/[...slug]/page.tsx`; add CSS.

- [ ] **Step 1:** `SyncAlert.test.tsx` (static markup): renders an "Out of date" banner for `drifted` (with the checked date), a "Not found in Figma" banner for `missing-in-figma`, and nothing for `in-sync` or `null`.
- [ ] **Step 2:** Implement `SyncAlert({ status })` where `status: SyncSpecEntry | null`. Presentational only; reuse the alert visual treatment used by `GapsAlert`.
- [ ] **Step 3:** In the component page, after `getDoc`, compute `const sync = getSpecSyncStatus(slug);` and render `<SyncAlert status={sync} />` just above `<GapsAlert … />`. Inbox docs (`isInboxDoc`) skip the alert.
- [ ] **Step 4:** Typecheck. **Commit:** `feat(web): surface drift on the component page`.

---

## Task 4: `/sync` overview page + home stat

**Files:** create `app/sync/page.tsx`, `page.test.tsx`; modify `lib/homeStats.ts` (+ test), `app/page.tsx`, CSS.

- [ ] **Step 1:** `homeStats.test.ts`: `outOfDate` counts live specs whose report status is `drifted` or `missing-in-figma`, excludes inbox and not-applicable specs, and is `0` when no report exists. Implement by reading `readSyncReport()` inside `getHomeStats` (or pass the report in to keep it pure — prefer passing it in and reading at the call site, matching the existing `getHomeStats(docs)` signature: add a second optional arg `report?: SyncReport | null`).
- [ ] **Step 2:** `app/sync/page.tsx`: `force-dynamic`; read `readSyncReport()` + `getAllDocs()`; group by file key; sections for **Out of date**, **Not found in Figma**, **In sync**, **New in Figma**, each with last-checked time; link drifted/missing entries to their component pages. Empty state when no report: explain running **Check library sync** in the plugin.
- [ ] **Step 3:** `page.test.tsx`: static-markup render with a stubbed report shows the right buckets and the empty state.
- [ ] **Step 4:** Home page: add the **Out of date** metric card and a link to `/sync`.
- [ ] **Step 5:** Typecheck + tests. **Commit:** `feat(web): add sync overview page and out-of-date stat`.

---

## Task 5: Plugin — Check library sync

**Files:** modify `packages/plugin/src/ui/{actions,dom,ui}.ts`; add a focused test for the fingerprint helper.

- [ ] **Step 1:** Add a pure helper + test in `ui/actions.ts`:

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

Test it against an existing serialized fixture: a node with a key yields a stable hash equal to `contentHash(extract(node, { figmaFile }))`; a node with no key yields `null`.

- [ ] **Step 2:** Extend `UiState` with `bulkMode: 'export' | 'sync'` (default `'export'`) and `syncItems: Array<…fingerprint…>`. Add `runCheckSync(refs, state)`: reset accumulators, set `bulkMode='sync'`, render a scanning state, and `send({ type: 'requestExportAll', includeAtoms: true })` (reuse the existing scan; atoms can be saved specs). In `handleExportAllStart`, store `exportFileKey` as today. In `handleExportComponent`, branch: `sync` → `const fp = fingerprintNode(node, state.exportFileKey); if (fp) state.syncItems.push(fp);` and update a sync progress line; `export` → unchanged. In `handleExportAllDone`, branch: `export` → existing zip; `sync` → POST `{ fileKey: state.exportFileKey, components: state.syncItems }` to `${state.docsEndpoint.replace(/\/+$/, '')}/api/sync/check`, render `"N of M library specs are out of date"` from the summary, `send({ type: 'notify', … })`, and `send({ type: 'openBrowser', url: \`${base}/sync\` })`. Reset `bulkMode='export'` in a `finally`.

- [ ] **Step 3:** `ui/dom.ts`: in the Export-all panel add a **Check library sync** button (`#check-sync-btn`) and a `#sync-status` line; add both to `Refs` and `mount()`.
- [ ] **Step 4:** `ui/ui.ts`: `refs.checkSyncBtn.addEventListener('click', () => runCheckSync(refs, state))`.
- [ ] **Step 5:** `npm run build:plugin` succeeds; helper test green. **Commit:** `feat(plugin): add Check library sync`.

---

## Task 6: Docs + ignore

- [ ] `.gitignore`: add `**/.spec-sync.json`.
- [ ] `ARCHITECTURE.md` Storage: add `.spec-sync.json` to the untracked-artifacts list with a one-line description.
- [ ] `README.md`: add `.spec-sync.json` to Content Safety; update Roadmap to mark drift detection as landed (leave Git-backed sync as remaining).
- [ ] **Commit:** `docs: document the sync report and drift detection`.

---

## Task 7: Full verification

- [ ] `npm test` — all green.
- [ ] `npm run lint && npm run typecheck` — clean.
- [ ] `npm run build` and `npm run build:plugin` — succeed.
- [ ] **Manual smoke (verify in the app + plugin):** save a component; change it in Figma (re-bind a token or add a variant); run **Check library sync**; confirm the component page shows **Out of date**, `/sync` lists it under its file, and the home **Out of date** count is ≥ 1. Re-extract + re-save, run the check again, and confirm the drift clears. Delete `.spec-sync.json` and confirm the app renders normally with no drift info.
- [ ] superpowers:requesting-code-review against this plan and the design before integrating.

---

## Notes for the implementer

- **Hash parity is the contract.** The plugin must compute the hash with the *same* `figmaFile` that the saved spec used (it does, because a check evaluates only specs whose `figma_file` equals the scanned file key). Do not introduce a separate hashing path in the app — the app never recomputes hashes, it only compares strings.
- **Additive only.** Drift surfacing must never block rendering. A missing/corrupt `.spec-sync.json` is "no info yet," not an error.
- **No auto-rewrite.** This plan detects and surfaces; it does not change any `.md`. Resolution (update-from-Figma, preserving judgment sections) is a separate, deferred plan.
- **Reuse the scan.** The plugin change is UI-only: no `main.ts` or `messages.ts` edits. The Check-library-sync path rides on the existing Export-all enumeration and node stream, branching on `bulkMode`.
- **No DOM test env.** Web component/page tests render with `renderToStaticMarkup` and assert on the HTML string, matching the existing suite; the button/click paths are covered by the manual smoke test.
