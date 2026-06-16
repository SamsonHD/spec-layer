# Figma Component Sync (Drift Detection) Design

## Problem

Once a component spec is saved to the library, nothing tells a reviewer that the Figma component changed afterward. The library silently drifts from the design source: a token gets re-bound, a variant is added, a layer is renamed in Figma, and the saved `.md` keeps describing the old shape with no signal that it is stale.

The format already anticipates this. `spec/SPEC.md` §2 designates `content_hash` as "the drift-detection … key" and `component.figma_key` as the "stable Figma component key (survives renames and file moves)." Both fields are written on every extracted spec and read into `ComponentFrontmatter`, but nothing in the product consumes them to detect drift. This is the "drift detection" half of the README roadmap item *"Git-backed content synchronization and drift detection."*

This design covers **detecting and surfacing drift** — telling reviewers which saved specs no longer match Figma. It deliberately does **not** cover automatically rewriting specs from Figma; that resolution step is deferred (see *Deferred*).

## Why plugin-driven, not server-side REST extraction

Drift detection needs the *current* Figma state to recompute a `content_hash` and compare it with the stored one. There are two ways to obtain it.

- **Plugin-driven re-extraction (chosen).** The Figma plugin already serializes every component in a file (the Export-all path) and already runs the extractor in its iframe (`extract` + `renderSpec` in `packages/plugin/src/ui/actions.ts`). Recomputing `contentHash(extract(node, { figmaFile }))` in the plugin uses the *exact* code that produced the stored hash, so an unchanged component hashes identically — no false positives. It requires the plugin to be open on the file, which is already the workflow for getting specs into the library in the first place.

- **Server-side REST re-extraction (rejected for now).** The web app could fetch node trees with `FIGMA_TOKEN` (it already calls `api.figma.com` for preview images) and re-run the extractor. The blocker is variable resolution: `content_hash` covers token rules whose values are *variable and style names*, which the plugin resolves via `figma.variables.getVariableByIdAsync`. The **Figma Variables REST API (`GET /v1/files/:key/variables/local`) is restricted to Full members of an Enterprise org** — it is unavailable on Professional. The core Files/Nodes/Images REST endpoints *are* available on Professional with a personal-access token, so a REST node fetch would return `boundVariables` ids but could not resolve them to the same names the plugin uses. The recomputed hash would not match, producing false drift on exactly the plans most likely to use this tool. A server-side path is therefore viable only on Enterprise and is left as a future enhancement (see *Deferred*).

Hash parity is the whole game for drift detection, and only the plugin path guarantees it across plans. The plugin owns Figma access in this architecture (`ARCHITECTURE.md`); keeping re-extraction there preserves that boundary.

## User Experience

- In the Figma plugin, a **Check library sync** action scans every component in the current file, computes each one's current `content_hash`, and reports the result to the docs app. It reuses the existing whole-file scan, so it works without a selection and shows the same scanning/progress feedback as Export all.
- After a check, the plugin shows a one-line summary (e.g. *"3 of 12 library specs are out of date"*) and offers to open the docs **Sync** page.
- In the docs app:
  - A saved component whose Figma source changed since extraction shows an **Out of date** banner at the top of its page, with the date it was last checked and a short instruction to re-extract from the plugin.
  - A saved component whose `figma_key` was not found in the last scan of its file shows a **Not found in Figma** banner.
  - A new **Sync** overview page lists, grouped by Figma file: out-of-date specs, specs not found in Figma, in-sync specs, and components present in Figma that have no saved spec yet (import candidates). Each entry shows when it was last checked and links to the component where applicable.
  - The home page gains an **Out of date** metric card alongside the existing counts.
- Drift state is informational. Nothing is rewritten automatically; the reviewer decides whether to re-extract and re-save.

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

- `lib/sync.ts` (new): the report types plus `readSyncReport()`, `writeSyncReport(report)`, `computeFileSync(fileKey, components, docs)`, and `getSpecSyncStatus(slug)`. The content root, like elsewhere, comes from `getContentDir()`.
- `app/api/sync/check/route.ts` (new): `POST` + `OPTIONS`, guarded exactly like the other plugin-facing write routes (`authorizeApiRequest`, `corsHeaders`, `force-dynamic`, a bounded JSON body). Validates `fileKey` and a bounded `components` array, computes the per-file result over `getAllDocs()`, merges and writes the report, and returns the per-file summary.
- `app/components/[...slug]/page.tsx`: read `getSpecSyncStatus(slug)` and render a new `SyncAlert` for `drifted` / `missing-in-figma`, near `GapsAlert`.
- `components/SyncAlert.tsx` (new): presentational banner.
- `app/sync/page.tsx` (new): the overview, reading the report and `getAllDocs()`.
- `lib/homeStats.ts`: add an `outOfDate` count (specs whose report status is `drifted` or `missing-in-figma`); surface it as a card on the home page and add a nav link to `/sync`.

### Trust boundary

`/api/sync/check` is a local, plugin-facing write that touches only `.spec-sync.json`. It reuses the established host/origin policy (`ARCHITECTURE.md`, Local API Boundary) and adds the same defense-in-depth as existing import routes; it does not read or write component Markdown, credentials, or anything outside the content root.

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

## Deferred

These are intentionally out of scope here and would build on this report:

- **Resolve from Figma.** A one-click "update this spec from Figma" that re-renders deterministic sections while preserving the four judgment sections (Definition, Code, Accessibility, Do's & Don'ts), reusing the prose-preserving merge that AI bulk-fill and `regenerate` already implement. This requires the plugin to send full `IntermediateSpec`s for drifted components rather than fingerprints, and careful section-merge semantics.
- **Import new-in-figma.** Turning import candidates into a one-click add to the inbox.
- **Enterprise server-side checks.** A `FIGMA_TOKEN` + Variables-API path so drift can be checked without opening the plugin, available where the Variables REST API is (Enterprise).
- **Sidebar drift dots.** Per-item drift indicators in the navigation tree.
