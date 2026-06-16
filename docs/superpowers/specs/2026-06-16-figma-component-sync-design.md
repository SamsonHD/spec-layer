# Figma Component Sync (Drift Detection) Design

## Problem

Once a component spec is saved to the library, nothing tells a reviewer that the Figma component changed afterward. The library silently drifts from the design source: a token gets re-bound, a variant is added, a layer is renamed in Figma, and the saved `.md` keeps describing the old shape with no signal that it is stale.

The format already anticipates this. `spec/SPEC.md` §2 designates `content_hash` as "the drift-detection … key" and `component.figma_key` as the "stable Figma component key (survives renames and file moves)." Both fields are written on every extracted spec and read into `ComponentFrontmatter`, but nothing in the product consumes them to detect drift. This is the "drift detection" half of the README roadmap item *"Git-backed content synchronization and drift detection."*

This design covers **detecting and surfacing drift** (Milestone 1) and **resolving it** through a prose-preserving update flow that reuses the inbox review gate (Milestone 2). It never rewrites a spec without the designer's explicit action (see *Milestones* and *Designer Workflow & UX → Journey 3*).

## Why plugin-driven, not server-side REST extraction

Drift detection needs the *current* Figma state to recompute a `content_hash` and compare it with the stored one. There are two ways to obtain it.

- **Plugin-driven re-extraction (chosen).** The Figma plugin already serializes every component in a file (the Export-all path) and already runs the extractor in its iframe (`extract` + `renderSpec` in `packages/plugin/src/ui/actions.ts`). Recomputing `contentHash(extract(node, { figmaFile }))` in the plugin uses the *exact* code that produced the stored hash, so an unchanged component hashes identically — no false positives. It requires the plugin to be open on the file, which is already the workflow for getting specs into the library in the first place.

- **Server-side REST re-extraction (rejected for now).** The web app could fetch node trees with `FIGMA_TOKEN` (it already calls `api.figma.com` for preview images) and re-run the extractor. The blocker is variable resolution: `content_hash` covers token rules whose values are *variable and style names*, which the plugin resolves via `figma.variables.getVariableByIdAsync`. The **Figma Variables REST API (`GET /v1/files/:key/variables/local`) is restricted to Full members of an Enterprise org** — it is unavailable on Professional. The core Files/Nodes/Images REST endpoints *are* available on Professional with a personal-access token, so a REST node fetch would return `boundVariables` ids but could not resolve them to the same names the plugin uses. The recomputed hash would not match, producing false drift on exactly the plans most likely to use this tool. A server-side path is therefore viable only on Enterprise and is left as a future enhancement (see *Deferred*).

Hash parity is the whole game for drift detection, and only the plugin path guarantees it across plans. The plugin owns Figma access in this architecture (`ARCHITECTURE.md`); keeping re-extraction there preserves that boundary.

## Designer Workflow & UX

The designer lives in Figma and edits components; the docs app is where those components are documented. The feature has to answer one question at two altitudes — *"is my documentation up to date with my Figma?"* — for a single component I'm editing right now, and for the whole library before a release. It also has to make the answer *actionable*: detecting drift a designer cannot resolve is worse than not detecting it.

### Journey 1 — In the moment (single component)

The everyday touchpoint. A designer edits **Button**, opens the plugin, and selects it.

- The **Selected component** tab gains a **doc-status chip** beside the component name, resolved after the spec is extracted (the plugin needs the current hash) by a lightweight call to the docs app:
  - `● In sync with docs` (success color) — the saved spec matches the current component.
  - `● Out of date in docs` (warning color) — a saved spec exists but differs. The chip exposes an **Update docs** action.
  - `○ Not in docs yet` (neutral) — no saved spec for this component; the existing **Send to docs** is the call to action.
  - `— Doc status unavailable` (muted, no nagging) — the docs app is unreachable, no file key is set, or the lookup failed. The rest of the tab works unchanged.
- The chip is color **plus icon plus text** (never color alone) and carries an accessible label spelling out the meaning.
- **Update docs** re-extracts and sends the spec as an *update* to the existing component (Journey 3), rather than creating an unrelated new draft.

This turns sync into a passive signal the designer sees while doing normal work, not a separate chore.

### Journey 2 — The audit (whole library, release readiness)

- In the plugin's **Export all** tab, a distinct **Library sync** section holds a **Check library sync** button with a one-line explainer (*"Compare your saved docs against this Figma file."*). It reuses the whole-file scan, so it needs no selection and shows the same scanning/progress feedback as Export all:
  - *Scanning file for components…* → *Comparing 24 of 60…* → *Comparing against your library…*
- The result renders as a compact summary, each line an icon+count, ordered by urgency:
  - `⚠ 3 out of date` · `⊘ 1 not found in Figma` · `✓ 9 in sync` · `＋ 5 in Figma aren't documented` · *"Checked against 12 saved specs."*
  - A primary **Open sync report ↗** opens the docs `/sync` page.
- Distinct end states, never a blank panel:
  - All match → *"✓ All 12 specs are up to date."*
  - No saved specs for this file → *"No saved specs match this Figma file yet. Export some components first."*
  - Docs unreachable → the existing send-failure copy (*"Couldn't reach your docs app at &lt;url&gt;. Start it, then check the URL in Settings."*).
  - No file key → the existing inline file-key prompt (the `canSendToDocs` path), so the designer fixes it without leaving the panel.

### What the designer sees in the docs app

- **Component page** (above `GapsAlert`, never on inbox drafts):
  - *Out of date with Figma* — *"The Figma component changed since this spec was extracted on &lt;date&gt;. Last checked &lt;relative&gt;. Re-extract it in the Figma plugin and send to docs to update."* with a *View all changes →* link to `/sync`. (After Journey 3 ships, this becomes a one-click **Update from Figma**.)
  - *Not found in Figma* — *"This spec's component wasn't in the last scan of its Figma file (&lt;relative&gt;). It may have been removed or renamed in Figma."*
  - In sync → no banner; a low-key positive line in the meta-row: *"✓ In sync with Figma · checked &lt;relative&gt;."*
- **`/sync` overview page** — the dashboard, grouped by Figma file when more than one file is involved. Per file: a header with the file key and *"Last checked &lt;relative&gt; · N scanned"*, then sections ordered by urgency — **Out of date**, **Not found in Figma**, **Undocumented in Figma** (Figma components with no spec), and a collapsed **In sync**. Drifted/missing rows link to their component pages and show last-extracted and last-checked times; undocumented rows are informational (Journey-3 future: *Add to inbox*). A summary chip strip sits at the top: *Out of date N · Not in Figma N · In sync N · Undocumented N*.
- **Home page** — an **Out of date** metric card (drifted + missing) linking to `/sync`, and a **Sync** entry in navigation.

### Freshness — drift info has its own staleness

Drift status is only as current as the last check, and the web app cannot trigger a plugin scan. So:

- Every surface shows *checked &lt;relative&gt;* (e.g. *"2 hours ago"*, *"yesterday"*, *"on 12 Jun"*).
- When the last check for a file is older than a threshold (7 days), the `/sync` file header and the component banner add *"— run a fresh check for current status."*
- `/sync` states plainly that it refreshes by running **Check library sync** in the plugin; it never shows a fake web "refresh" that wouldn't reach Figma.
- Before any check exists, `/sync` shows an empty state explaining how to run the first check, and the home card shows *"—"* rather than a misleading `0`.

### Journey 3 — Resolving drift (closing the loop)

Detecting drift is only useful if the designer can fix it. The resolve path must reuse the existing inbox **review gate** and must **not** destroy human-authored prose.

A constraint shapes this: the inbox→library save (`lib/inboxMove.ts`) copies with `COPYFILE_EXCL` and rejects an existing destination with a 409. So re-extracting a documented component and using **Send to docs** today produces a fresh inbox draft that *cannot* be saved over the existing file, and the only crude workaround (delete then save) discards the spec's judgment sections. The resolve loop therefore needs an explicit **update** path:

1. Designer triggers a re-extract — via **Update docs** on the selected component (Journey 1) or by following the component-page / `/sync` guidance.
2. **Send to docs** delivers the new spec. The inbox recognizes it as an **update**: an incoming spec whose `figma_key` matches an existing non-inbox library spec is flagged in the inbox as *Update → components/Button* rather than treated as a brand-new component.
3. The designer reviews and clicks **Update**, which performs a **section-preserving merge** into the existing library file: the deterministic sections (Anatomy, Configuration, Variants, States, Tokens used, Related atoms, and any Extraction gaps) and the identity frontmatter (`content_hash`, `extracted_at`) are replaced from the new extraction, while the four judgment sections (Definition, Code, Accessibility, Do's & Don'ts) are kept from the existing file. This reuses the same prose-preserving discipline as AI bulk-fill and `regenerate`. The inbox draft and its sidecar are then removed.
4. On the next check the component reports **in sync**. (As a nicety, the update can proactively flip that spec's `.spec-sync.json` entry to in-sync, since both hashes are known at update time.)

The plain **Save** / move path keeps its 409 safety for genuinely new components; **Update** is a separate, intentional overwrite-with-merge. Nothing is ever overwritten without the designer's explicit action in the inbox.

### Cross-cutting UX

- **Additive and non-blocking:** every drift surface is additive. A missing or unreadable `.spec-sync.json`, an unreachable docs app, or a missing file key degrades to "no info / unavailable" — never an error that blocks the library or the plugin's core flows.
- **Accessibility:** banners and chips convey state with icon + text, not color alone; banners use an appropriate live-region role; the `/sync` page and inbox controls follow the existing keyboard-nav and visible-focus patterns; collapsed sections use native `details/summary` like the inbox list.
- **Theming:** the plugin chip/section use Figma theme variables (light/dark) as the rest of the plugin does; app surfaces honor the existing theme toggle and reduced-motion preferences.

## Drift Semantics

Matching is by `component.figma_key`, scoped to `component.figma_file`. A single sync check covers exactly one Figma file (the one open in the plugin). Because `figmaFile` participates in the `IntermediateSpec` and therefore in `content_hash`, the recomputed hash is only comparable to specs whose `figma_file` equals the scanned file key — which is precisely the set the check evaluates.

For one scanned file key `F` carrying components `C` (each `{ figmaKey, figmaNode, name, contentHash }`), against the saved library docs (excluding `_inbox`):

- A saved spec is **eligible** when `figma_file === F`, it has a non-empty `figma_key`, and its `content_hash` is not the 64-zero hand-authored placeholder (`spec/SPEC.md` §2). Specs failing these are **not applicable** and are excluded from drift counts.
- For each eligible spec:
  - `figma_key` present in `C` and hashes equal → **in-sync**.
  - `figma_key` present in `C` and hashes differ → **drifted**.
  - `figma_key` absent from `C` → **missing-in-figma** (deleted, unpublished, or its key changed).
- Each component in `C` whose `figma_key` matches no saved spec in any file → **new-in-figma** (reported per file as an import candidate; not persisted per-spec).

A check for file `F` replaces all persisted per-spec entries for `F` and the per-file record for `F`, and leaves entries for other files untouched. A library spanning multiple Figma files is kept current by running the check once per file.

## Persistence

The drift report is a runtime artifact, not source. It is stored as `.spec-sync.json` at the content root, alongside the existing untracked `.spec-data/` and `.spec-cache/`, and is added to `.gitignore`, `ARCHITECTURE.md` (Storage), and the README Content Safety list. It is rebuilt by checks and safe to delete.

Shape (version-tagged so the reader can ignore unknown future versions):

```jsonc
{
  "version": 1,
  "files": {
    "<fileKey>": {
      "checkedAt": "2026-06-16T18:00:00.000Z",
      "scannedCount": 12,
      "newInFigma": [{ "figmaKey": "…", "name": "Chip" }]
    }
  },
  "specs": {
    "components/button": {
      "status": "drifted",
      "figmaKey": "…",
      "figmaFile": "…",
      "savedHash": "…",
      "currentHash": "…",
      "checkedAt": "2026-06-16T18:00:00.000Z"
    }
  }
}
```

`currentHash` is omitted for `missing-in-figma`. Spec keys are the doc slug joined with `/`. The report is the single source of drift truth the app reads on render; it is never required for the library to function, and a missing or unreadable report degrades to "no drift information yet."

## Components and Boundaries

### Extractor (`@spec-layer/extractor`) — no change

`contentHash` is already exported from the package index. The plugin computes `contentHash(extract(node, { figmaFile }))`, identical to how `renderSpec` derives the stored hash.

### Plugin (`@spec-layer/plugin`) — UI only

No changes to `main.ts` or `messages.ts`. The check reuses the existing Export-all enumeration and node stream verbatim; only the iframe's accumulation and completion behavior branch on a new mode.

- `ui/actions.ts`: add `bulkMode: 'export' | 'sync'` to `UiState`; add a `syncItems` fingerprint accumulator. `runCheckSync` resets accumulators, sets `bulkMode = 'sync'`, and triggers the same whole-file scan as Export all with atoms included (a saved spec may be an atom). `handleExportComponent` branches on mode: in `sync` mode it computes `extract` + `contentHash` and pushes `{ figmaKey, figmaNode, name, contentHash }`, skipping components with an empty `figmaKey`. `handleExportAllDone` branches: `export` zips as today; `sync` POSTs the fingerprints to `${docsEndpoint}/api/sync/check`, renders the summary, and asks the main thread to open the Sync page.
- `ui/dom.ts`: add a **Check library sync** button and a status line in the Export-all panel, plus their `Refs`.
- `ui/ui.ts`: wire the button to `runCheckSync`.

The send reuses the existing docs-endpoint plumbing and the opaque-origin posture that `/api/specs/import` already relies on.

### Web app (`md-ds`)

- `lib/sync.ts` (new): the report types plus `readSyncReport()`, `writeSyncReport(report)`, `computeFileSync(fileKey, components, docs)`, `lookupSpecByFigmaKey(figmaKey, currentHash, docs)` (for the per-selection chip), and `getSpecSyncStatus(slug)`. The content root, like elsewhere, comes from `getContentDir()`.
- `lib/relativeTime.ts` (new): `formatRelative(iso, now?)` and an `isStale(iso, now?)` helper (the 7-day freshness threshold), shared by every drift surface.
- `app/api/sync/check/route.ts` (new): `POST` + `OPTIONS`, guarded exactly like the other plugin-facing write routes (`authorizeApiRequest`, `corsHeaders`, `force-dynamic`, a bounded JSON body). Validates `fileKey` and a bounded `components` array, computes the per-file result over `getAllDocs()`, merges and writes the report, and returns the per-file summary.
- `app/api/sync/lookup/route.ts` (new): `POST` + `OPTIONS`, same guards. Accepts `{ figmaKey, contentHash }`, returns `{ status: "in-sync" | "drifted" | "absent", slug? }` for the plugin's per-selection chip. Read-only — it does not write the report.
- `app/components/[...slug]/page.tsx`: read `getSpecSyncStatus(slug)` and render a new `SyncAlert` for `drifted` / `missing-in-figma`, near `GapsAlert`; add the in-sync meta-row line.
- `components/SyncAlert.tsx` (new): presentational banner (icon + text + freshness).
- `app/sync/page.tsx` (new): the overview, reading the report and `getAllDocs()`.
- `lib/homeStats.ts`: add an `outOfDate` count (specs whose report status is `drifted` or `missing-in-figma`); surface it as a card on the home page and add a nav link to `/sync`.

### Plugin per-selection chip

The Selected-component tab calls `/api/sync/lookup` with the freshly extracted spec's `figmaKey` and `contentHash` and renders the resulting chip. It is best-effort: any failure (unreachable docs, no file key, non-200) renders the muted "unavailable" state and never blocks extract/download/send.

### Trust boundary

The new routes are local, plugin-facing, and reuse the established host/origin policy (`ARCHITECTURE.md`, Local API Boundary) with the same defense-in-depth as existing import routes. `/api/sync/check` writes only `.spec-sync.json`; `/api/sync/lookup` is read-only; `/api/specs/update` (Milestone 2) overwrites exactly one library `.md` (and its sidecar) that the designer explicitly chose in the inbox, with the same slug/symlink guards as `inboxMove.ts`. None read or write credentials or anything outside the content root.

## Error Handling

- The plugin isolates per-component failures during the scan exactly as Export all does today: one component that fails to serialize or extract is skipped and counted, never aborting the run.
- A component with an empty `figma_key` is skipped from the payload (it cannot be matched).
- `/api/sync/check` returns a CORS-readable 400 for malformed JSON, a non-object body, a missing/invalid `fileKey`, or a `components` value that is not an array or exceeds the entry cap; it returns 413 when the body exceeds the size limit, mirroring `/api/specs/import`.
- Writing `.spec-sync.json` uses the same temp-file + atomic-rename pattern as other content-root writes; a write failure returns 500 without partially corrupting the report.
- The app treats a missing or unparseable report as "no drift information yet" and renders the library normally — drift surfacing is strictly additive.
- A spec with the 64-zero placeholder hash or no `figma_key` is reported as not-applicable, never as drifted.

## Testing

- `lib/sync.test.ts`: `computeFileSync` classifies in-sync, drifted, missing-in-figma, new-in-figma; excludes zero-hash and keyless specs; scopes strictly by `figma_file`; and merges per-file without clobbering other files. `readSyncReport`/`writeSyncReport` round-trip and tolerate a missing/corrupt file. `getSpecSyncStatus` returns the right entry or none.
- `api/sync/check/route.test.ts`: malformed JSON, non-object body, missing/invalid `fileKey`, oversize/too-many components, same-origin and `Origin: null` acceptance, cross-origin rejection, and a happy path that writes the expected report and returns the summary — mirroring `api/specs/import` and `api/specs/move-all` route tests.
- `SyncAlert.test.tsx` and `app/sync` rendering tests using `renderToStaticMarkup`, matching the node-environment, no-DOM test style already used for components.
- Plugin: a unit test over the sync accumulation/fingerprint helper (pure extract + hash + skip-empty-key logic), matching how `renderOne` is exercised. The button wiring is covered by the manual smoke test, consistent with the existing plugin UI tests.
- Manual smoke test: extract and save a component; change it in Figma; run **Check library sync**; confirm the component page shows **Out of date**, the Sync page lists it under the right file, and re-extracting + re-saving clears the drift on the next check.

## Success Criteria

- Running **Check library sync** in the plugin records, for the scanned file, which saved specs are in-sync, drifted, or missing in Figma, and which Figma components have no saved spec.
- An unchanged component never reports drift (hash parity via the shared extractor).
- A saved component whose Figma source changed shows an **Out of date** banner on its page and appears on the Sync page; re-extracting and re-saving clears it on the next check.
- Specs with the hand-authored zero hash or no `figma_key` are never flagged as drifted.
- A check for one file leaves drift state for other files intact.
- The drift report lives only in `.spec-sync.json`, is untracked, and the library renders normally when it is absent.
- The host/origin policy and body limits on `/api/sync/check` match the other plugin-facing write routes.

## Milestones

The work splits into two shippable milestones; the designer workflow above spans both.

- **Milestone 1 — Detect & surface (this plan's core).** The plugin **Check library sync** + the per-selection chip + `/api/sync/check` and `/api/sync/lookup` + the persisted report + the component-page banner, `/sync` overview, home card, and freshness. The library can be audited and every out-of-date/missing/new component is visible. Resolution is by guidance (re-extract in the plugin and send to docs).
- **Milestone 2 — Resolve (Journey 3).** The inbox **update** recognition (incoming `figma_key` matches an existing library spec) and the section-preserving **Update** action that merges a re-extraction into the existing file, plus turning the component-page banner CTA into a one-click **Update from Figma**. This closes the loop without the 409 dead-end and without losing judgment prose.

## Deferred (beyond Milestone 2)

- **Import new-in-figma.** Turning `/sync` import candidates into a one-click add to the inbox.
- **Enterprise server-side checks.** A `FIGMA_TOKEN` + Variables-API path so drift can be checked without opening the plugin, available where the Variables REST API is (Enterprise).
- **Sidebar drift dots.** Per-item drift indicators in the navigation tree.
