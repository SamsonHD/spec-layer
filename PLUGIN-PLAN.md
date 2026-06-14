# Plugin Improvement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (subagents available) to implement this plan. Steps use checkbox (`- [ ]`) syntax. Run each **Phase** as a dedicated subagent at the model tier in its header, with a two-stage review (spec compliance → code quality) after each. Phases are ordered to avoid `messages.ts`/UI conflicts — respect the order.

**Goal:** Make the Figma plugin a strong standalone tool — clean redesigned UI, single-component export, and one-click "export every component in the file" to a ZIP of markdown files — with the docs platform now optional rather than required.

**Architecture:** A Figma plugin with two halves: `src/main.ts` (Figma main thread — has Figma APIs, serializes nodes) and `src/ui/*` (sandboxed iframe — runs the pure `@spec-layer/extractor` to turn serialized nodes into markdown). They talk over `postMessage` (typed in `src/messages.ts`). Bulk export enumerates all components on the main thread, streams serialized nodes to the UI with progress, and the UI renders each to markdown and bundles them into a single downloadable ZIP (Figma iframes can't write to a disk folder directly). Build is plain esbuild → `dist/main.js` + `dist/ui.html`.

**Tech Stack:** TypeScript, esbuild, `@figma/plugin-typings`, `@spec-layer/extractor` + `@spec-layer/format` (existing), **fflate** (new — tiny zip lib), vitest for pure-logic tests. No UI framework (vanilla, by decision).

---

## Decisions locked (from product owner)

1. **Bulk delivery (#2/#4):** **ZIP download** via `fflate`. All `.md` files go into a single `.zip`, organized into a flat folder the user names; the browser save dialog lets them choose where the zip lands. Reliable in both Figma desktop and browser. (The File System Access directory picker was rejected — unavailable in the Figma desktop sandbox.)
2. **UI rebuild (#3/#5):** **Keep vanilla TS** (zero-dependency), but split the monolithic `ui.ts` into focused modules and do a full visual redesign with native Figma theming. No Preact.
3. **Export scope (#2):** **Whole file** — every `COMPONENT_SET` + standalone `COMPONENT` across all pages (variants grouped under their set), one `.md` each, **kebab-case** filename from the component name, flat inside the zip. Collisions get a numeric suffix.
4. **Standalone (#1):** The docs platform becomes **optional**. Single-download and bulk-export must work with no docs endpoint configured and no network. "Send to docs" is a clearly secondary/optional action.

---

## Current-state facts (verified — for the implementer)

- `src/main.ts`: `findComponent(selection)` walks up to the nearest COMPONENT/COMPONENT_SET; `postSelection()` serializes the *selected* component via `serializeNode` + a `NodeResolver` (Figma async APIs). `clientStorage` holds `docsEndpoint` + `fileKeyOverride`. `figma.showUI(__html__, { width: 480, height: 640 })` — note: **no `themeColors`**, **no `documentAccess`** in `manifest.json`.
- `src/ui/ui.ts`: ONE file — a big `document.body.innerHTML` template (inline `<style>`), element refs, `runExtract()` (calls `extract()` + `renderSpec()` from the extractor — these are pure and run in the iframe), `runSendToDocs()` (POST to `${docsEndpoint}/api/specs/import`, guarded by `canSendToDocs`), `runDownload()` (single-file Blob + `<a download>`), and a `window.onmessage` switch. Endpoint defaults to `http://localhost:3000`.
- `src/serialize.ts`: pure `serializeNode(RawNode, NodeResolver)` — already unit-tested, Figma-free.
- `src/messages.ts`: `MainToUi` / `UiToMain` discriminated unions (selection, docsEndpoint, fileKeyOverride, requestSelection, setDocsEndpoint, setFileKeyOverride, notify, openBrowser).
- Extractor API (runs in UI): `extract(node, { figmaFile }) → IntermediateSpec`; `renderSpec(spec, { prose, extractedAt }) → string`. `toKebab(name)` lives in `src/ui/state.ts`.
- Tests exist (vitest, run from repo root `npm test`): `serialize.test.ts`, `state.test.ts`, `fileKey.test.ts`, `sendGuard.test.ts`, `integration.test.ts`. See `packages/plugin/TESTING.md` for how the plugin is exercised.
- **The plugin cannot be run in a web preview** — it loads inside Figma. Executors verify via: vitest (pure logic), `node build.mjs` (clean build), `tsc --noEmit`, and careful reasoning. FINAL functional verification (loading the built plugin in Figma, selecting components, exporting) is a **manual step for the product owner** — call this out, don't claim it was done.

---

## File map

**Create**
- `packages/plugin/src/ui/dom.ts` — the HTML template + CSS (extracted from `ui.ts`), and element-ref accessors. One responsibility: the view's static structure + styles.
- `packages/plugin/src/ui/styles.ts` — (optional, if cleaner) the CSS string, using Figma theme variables. May live inside `dom.ts` instead.
- `packages/plugin/src/ui/actions.ts` — the action handlers: `runExtract`, `runDownload`, `runSendToDocs`, `runExportAll`. Imports pure helpers; owns no DOM template.
- `packages/plugin/src/ui/render.ts` — view-state → DOM updates (phase rendering, mode switching, progress, banners).
- `packages/plugin/src/exportFiles.ts` — **pure**: given `Array<{ name: string; markdown: string }>`, produce `Record<filename, content>` with kebab names + collision suffixes; and a `zipFiles(files): Uint8Array` wrapper around fflate.
- `packages/plugin/src/collectComponents.ts` — **pure**: given a flat list of candidate nodes (`{ id, type, parentType }`), return the deduped export set (all COMPONENT_SETs + COMPONENTs whose parent is not a COMPONENT_SET).
- `packages/plugin/test/exportFiles.test.ts` and `packages/plugin/test/collectComponents.test.ts` — the unit tests. **IMPORTANT:** the root `vitest.config.ts` test glob for packages is `packages/**/test/**/*.test.ts` — package tests MUST live in `packages/plugin/test/`, NOT co-located in `src/` (co-location only works for `apps/web`, which uses a different glob). Tests placed in `src/` will be silently skipped and the TDD "see it fail" step will be meaningless. Import the source under test via a relative path (e.g. `../src/exportFiles`).

**Modify**
- `packages/plugin/src/ui/ui.ts` — slims to a thin entry point: build DOM (from `dom.ts`), wire events to `actions.ts`, run the `window.onmessage` loop, manage view mode. Most logic moves out.
- `packages/plugin/src/main.ts` — add bulk enumeration + streaming (new message handlers); make endpoint usage non-blocking.
- `packages/plugin/src/messages.ts` — add bulk-export message variants (request, per-component stream, progress, done, error).
- `packages/plugin/src/ui/state.ts` — extend `UiPhase`/view-mode state for the "export all" flow if needed (keep `toKebab`).
- `packages/plugin/manifest.json` — add `"documentAccess": "dynamic-page"` (needed for `loadAllPagesAsync`); consider `themeColors` via `showUI` options (in `main.ts`, not manifest).
- `packages/plugin/package.json` — add `fflate` dependency.
- `packages/plugin/build.mjs` — no change expected (esbuild bundles fflate automatically); verify it still emits both artifacts.
- `packages/plugin/TESTING.md` — document the new "Export all" manual test steps.

**No deletions.**

---

## Agent & model assignment

| Phase | Scope (items) | Agent | Model | Why |
|------|----------------|-------|-------|-----|
| **0** | Build + test baseline | (driver) | — | Setup |
| **1 — UI restructure + redesign + standalone-first** | #1, #3, #5 | `general-purpose` | **Opus 4.8** | Sets the new UI architecture (module split) AND needs design taste; foundation the bulk UI builds on |
| **2 — Bulk enumeration (main thread)** | #2 (data) | `general-purpose` | **Sonnet** | Figma-API integration + a small pure dedupe function; well-scoped |
| **3 — ZIP export pipeline + "Export all" UI** | #2, #4 | `general-purpose` | **Sonnet** | Pure zip/filename logic + wiring into the Phase-1 UI; clear spec |
| Review after each phase | — | `superpowers:code-reviewer` | **Opus 4.8** | Independent spec + quality gates |

**Sequencing:** strictly **1 → 2 → 3**. Phase 1 restructures `ui.ts` and the message-handling that Phase 3 extends; Phase 2 adds the `messages.ts` variants and main-thread data that Phase 3 consumes. Running them in order avoids conflicts in `ui.ts` / `messages.ts`.

```
Phase 0 → Phase 1 (UI shell, standalone) → Phase 2 (main-thread bulk data) → Phase 3 (UI zip export)
```

---

## Phase 0 — Setup

- [ ] Baseline tests green: `npm test` (repo root). Record the count (was 210 after the prior platform work).
- [ ] Build works: `cd packages/plugin && node build.mjs` → emits `dist/main.js` + `dist/ui.html` with no errors.
- [ ] Confirm on a feature branch (not `main`). Suggested: `git checkout -b revamp/plugin-pass` (or continue on the current revamp branch if that's where work lives — check `git branch --show-current` and ask if unsure).

---

## Phase 1 — UI restructure + redesign + standalone-first (Opus) — #1, #3, #5

**Goal:** Same behavior as today (single extract / download / send), but the UI is split into modules, visually redesigned with native Figma theming, and the docs platform is clearly optional. NO bulk export yet (Phase 3) — but leave clean seams for it (e.g. a mode/tab structure that a second "Export all" view can slot into).

**Files:** create `ui/dom.ts`, `ui/actions.ts`, `ui/render.ts`; slim `ui/ui.ts`; touch `ui/state.ts`, `main.ts` (showUI themeColors), `manifest.json` only if needed here (leave `documentAccess` to Phase 2 unless trivial).

### Task 1.1 — Extract DOM/template + CSS into `ui/dom.ts`
- [ ] Move the `innerHTML` template + `<style>` out of `ui.ts` into `ui/dom.ts`. Export a `mount(): Refs` (or `buildDom()`) that injects the markup and returns a typed object of element references (replacing the scattered `getElementById` casts).
- [ ] Redesign the markup/structure for a **tabbed/sectioned layout**: a primary view for the **Selected component** (name, Extract, preview textarea, Download .md, and a secondary "Send to docs") and a placeholder/secondary entry for **Export all** (wired in Phase 3). Use semantic structure + labels.
- [ ] Restyle: modern Figma-plugin aesthetic. Use Figma theme variables (`--figma-color-bg`, `--figma-color-text`, `--figma-color-bg-brand`, `--figma-color-border`, etc.) so it adapts to light/dark. Tighten spacing, typography, button hierarchy. The window is 480×640.
- [ ] In `main.ts`, change `figma.showUI(__html__, { width: 480, height: 640 })` to also pass `themeColors: true` so the theme variables are injected.
- [ ] Verify: `node build.mjs` builds; `tsc --noEmit` clean.

### Task 1.2 — Move action handlers into `ui/actions.ts` + view updates into `ui/render.ts`
- [ ] Move `runExtract`, `runDownload`, `runSendToDocs` into `ui/actions.ts` (pure-ish; take refs/state as args or via a small module-level state object — keep it cohesive, not global sprawl). Move `renderPhase`/banner/mode rendering into `ui/render.ts`.
- [ ] `ui.ts` becomes the thin entry point: `mount()`, wire events, run `window.onmessage`, boot (`requestSelection`).
- [ ] Behavior must be byte-for-byte equivalent for the existing single-component flow (extract → preview → download/send). The `canSendToDocs` guard and `fileKeyOverride`/endpoint messaging stay intact.
- [ ] Verify build + typecheck.

### Task 1.3 — Make the platform optional (standalone-first) (#1)
- [ ] Ensure **Download .md works with no docs endpoint and no network** — it already uses a local Blob; just make sure nothing in the redesigned flow requires the endpoint to be set before extracting/downloading.
- [ ] Reframe "Send to docs" as a clearly secondary/optional action (visually de-emphasized; e.g. under an "Optional: send to docs platform" affordance). The Docs URL input should not feel mandatory — only relevant if the user opts into sending.
- [ ] Copy pass: make it obvious the plugin is useful on its own (extract → download / export all). Don't imply the platform is required.
- [ ] Verify build + typecheck.

### Phase 1 commit & review
- [ ] `npm test` green (existing tests must still pass — `state.ts`/`sendGuard.ts` exports unchanged or updated tests adjusted deliberately). `node build.mjs` clean. `tsc --noEmit` clean.
- [ ] Commit: `refactor(plugin): modular UI, redesign, platform-optional standalone flow`.
- [ ] Dispatch `superpowers:code-reviewer` (Opus): focus on module boundaries, no behavior regression in the single-component flow, theme-variable usage, and that the platform is genuinely optional. Note for reviewer: the plugin can't be browser-previewed; judge by code + build.

---

## Phase 2 — Bulk enumeration on the main thread (Sonnet) — #2 (data side)

**Goal:** On request, the main thread finds every component in the file, serializes each, and streams them to the UI with progress. No UI/zip yet (Phase 3) — but the message contract is defined here.

**Files:** `src/collectComponents.ts` (+test), `src/messages.ts`, `src/main.ts`, `manifest.json`.

### Task 2.1 — Pure dedupe helper `collectComponents.ts` (TDD)
- [ ] **Write failing test** `packages/plugin/test/collectComponents.test.ts` (NOT in `src/` — see File map note): `collectExportTargets(nodes)` where `nodes: Array<{ id: string; name: string; type: string; parentType: string | null }>` returns the export set = all `COMPONENT_SET` nodes + every `COMPONENT` whose `parentType !== 'COMPONENT_SET'` (standalone components), excluding variant COMPONENTs that live inside a set. Cover: a set with variant children (only the set returned), a standalone component (returned), a component nested in a frame (returned), mixed input, empty input. (The one-level `parentType` check is correct: variants are always direct children of their COMPONENT_SET.)
- [ ] Run → fails. Implement the pure function. Run → passes.

### Task 2.2 — Manifest + enumeration in `main.ts`
- [ ] Add `"documentAccess": "dynamic-page"` to `manifest.json` (required for `figma.loadAllPagesAsync()`; under this mode `findAllWithCriteria` throws unless pages are loaded first, hence the `loadAllPagesAsync` call). **Safety audit (state it was done):** `dynamic-page` makes some synchronous page access throw, but the only page access in the plugin is `figma.currentPage.selection` + `figma.on('selectionchange')` — both always safe (current page is always loaded). There is no `figma.root.children` traversal or other page access to break. Do NOT introduce any synchronous cross-page access later.
- [ ] While in `manifest.json`, update the `networkAccess.reasoning` to reflect that network is used ONLY for the now-optional "Send to docs" (the plugin's core extract/download/export-all paths use local Blob URLs and need no network). Keep `allowedDomains` as-is (`http://localhost:3000`); this is just an honesty fix for the standalone (#1) framing.
- [ ] In `main.ts`, add a `collectAllComponents()` that: `await figma.loadAllPagesAsync()`, then `figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })`, maps each to `{ id, name, type, parentType: node.parent?.type ?? null }`, and passes through `collectExportTargets` to get the deduped node id set. (Resolve the actual nodes by id for serialization.)
- [ ] Verify build + typecheck. (Functional check happens in Figma — note it.)

### Task 2.3 — Streaming messages (`messages.ts` + `main.ts`)
- [ ] Add to `messages.ts`:
  - `UiToMain`: `{ type: 'requestExportAll' }`.
  - `MainToUi`: `{ type: 'exportAllStart'; total: number; fileKey: string }`, `{ type: 'exportComponent'; index: number; total: number; node: SerializedNode }`, `{ type: 'exportAllDone' }`, `{ type: 'exportAllError'; message: string }`.
  - **`exportAllStart` MUST carry `fileKey`** (the `effectiveFileKey(...)` computed by main). Reason: bulk export must work with NO selection, but the UI's `currentFileKey` is only populated by `selection`/`fileKeyOverride` messages and may be `''` or stale at click time. Main is the single source of truth for the file key (`fileKey.ts`), so it sends the key with the export stream; the UI uses THAT value for `extract(node, { figmaFile })`, not its own `currentFileKey`. This preserves the "main owns the file key" invariant.
- [ ] In `main.ts`, handle `requestExportAll`: enumerate (Task 2.2), post `exportAllStart` with the count, then serialize each target node (`serializeNode` + the existing `resolver`) and post an `exportComponent` per node with running `index`/`total`; finally `exportAllDone`. Wrap in try/catch → `exportAllError`. Use the effective file key for `extract` metadata (the UI does the extract; just ensure the UI has the file key — it already tracks `currentFileKey`).
  - **Streaming rationale (document in a comment):** serializing the whole file into one giant `postMessage` can be large/slow; per-component messages give live progress and bounded payloads. Serialize sequentially (await each) to keep the main thread responsive and ordering deterministic.
- [ ] Verify build + typecheck. `npm test` green (new pure test included).

### Phase 2 commit & review
- [ ] Commit: `feat(plugin): enumerate & stream all file components for bulk export`.
- [ ] Dispatch code-reviewer (Opus): dedupe correctness (variants not double-counted; nested components included), `loadAllPagesAsync`/`documentAccess` correctness, streaming contract soundness, error handling. Reviewer can't run Figma — judge by code + the pure test.

---

## Phase 3 — ZIP export pipeline + "Export all" UI (Sonnet) — #2, #4

**Goal:** The UI's "Export all" action triggers enumeration, shows progress, renders each streamed component to markdown, bundles them into a named folder inside a ZIP, and downloads it — no per-file preview. Works with no platform/network.

**Files:** `src/exportFiles.ts` (+test), `package.json` (fflate), `ui/actions.ts`, `ui/render.ts`, `ui/dom.ts`, `ui.ts`, `TESTING.md`.

### Task 3.1 — Add fflate + pure `exportFiles.ts` (TDD)
- [ ] Add `fflate` to `packages/plugin/package.json` dependencies. `npm install` (or workspace install) so it resolves.
- [ ] **Write failing test** `packages/plugin/test/exportFiles.test.ts` (NOT in `src/` — see File map note):
  - `buildExportFiles(items, folder)` where `items: Array<{ name: string; markdown: string }>` returns `Record<string, string>` keyed by `"<folder>/<kebab-name>.md"`. Cover: kebab-casing, **collision handling** (two items kebab to the same name → second becomes `name-2.md`, third `name-3.md`), empty markdown still written, folder prefix applied, empty `folder` → no prefix.
  - Reuse the existing `toKebab` from `ui/state.ts` (import it) rather than reimplementing.
- [ ] Run → fails. Implement `buildExportFiles`. Run → passes.
- [ ] Add `zipFiles(files: Record<string,string>): Uint8Array` using fflate's `zipSync` (encode strings to `Uint8Array` via `strToU8`). This thin wrapper may be left untested (it's a fflate passthrough) or covered by a round-trip test with `unzipSync` if quick.

### Task 3.2 — "Export all" action in `ui/actions.ts`
- [ ] Add `runExportAll()`: send `{ type: 'requestExportAll' }`; capture `fileKey` from the `exportAllStart` message and use it for all bulk extracts (NOT `currentFileKey` — see Task 2.3); collect incoming `exportComponent` messages into an array of `{ name, markdown }` by running `extract(node, { figmaFile })` + `renderSpec(spec, { prose: null, extractedAt })` for each (reuse the single-flow logic — factor a shared `renderOne(node, fileKey)` helper so single + bulk share rendering). On `exportAllDone`: `buildExportFiles(items, folderName)` → `zipFiles(...)` → Blob (`application/zip`) → `<a download>` named `<folderName>.zip`. On `exportAllError`: show the error banner.
- [ ] The export folder name: a small text input (default e.g. `design-system` or the Figma file name if available) — this is the "specify folder" (#4); it becomes the top-level folder inside the zip and the zip's filename. No per-component preview is shown during bulk export.
- [ ] Guard against double-runs (disable the button while in progress).

### Task 3.3 — "Export all" UI + progress (`dom.ts`, `render.ts`, `ui.ts`)
- [ ] Add the "Export all" view/section (the seam left in Phase 1): a folder-name input, an "Export all components" button, and a progress indicator (`Rendering 12 / 48…`) driven by `exportComponent` index/total. Show a final success state (`Exported 48 components → design-system.zip`).
- [ ] Make it work **without a selection** — bulk export operates on the whole file, independent of the current selection (it should be reachable even when nothing is selected). Reconcile with the current `no-selection` gating from Phase 1.
- [ ] Wire the button + input events in `ui.ts`; handle the new `MainToUi` messages in the `window.onmessage` switch (delegating to `render.ts`/`actions.ts`).
- [ ] Update `TESTING.md` with manual steps: open plugin → Export all → name folder → confirm a `.zip` downloads containing one `.md` per component.

### Phase 3 commit & review
- [ ] `npm test` green (new `exportFiles` tests + all prior). `node build.mjs` clean (fflate bundles into `dist/ui.html`). `tsc --noEmit` clean.
- [ ] Commit: `feat(plugin): export all components to a ZIP of markdown files`.
- [ ] Dispatch code-reviewer (Opus): filename/collision correctness, zip integrity (round-trip if feasible), progress/edge cases (0 components, 1 component, huge counts), no-platform/no-network path, bundle size impact of fflate.

---

## Cross-cutting acceptance checklist (after all phases)

- [ ] #1 Plugin works fully standalone: extract + download a single `.md`, and export-all to zip, with NO docs endpoint set and NO network. "Send to docs" is clearly optional.
- [ ] #2 "Export all" produces one `.md` per COMPONENT_SET + standalone COMPONENT across the whole file (variants grouped, not duplicated).
- [ ] #3 / #5 UI is restructured into modules and visually redesigned with native Figma theming (light/dark).
- [ ] #4 The user names an export folder; all `.md` land in that folder inside a single downloaded `.zip`; no per-file preview during bulk export.
- [ ] `npm test` green; `node build.mjs` emits valid `dist/main.js` + `dist/ui.html`; `tsc --noEmit` clean.
- [ ] Manual-in-Figma verification performed by the product owner (load `dist`, test single + bulk export). Executors must NOT claim this was done.

---

## Notes for executors

- **You cannot run the plugin in a web preview.** Verify via vitest, `node build.mjs`, and `tsc --noEmit`. Keep Figma-dependent code thin and push logic into pure, tested helpers (`collectComponents.ts`, `exportFiles.ts`).
- **Don't regress the single-component flow** or the `canSendToDocs`/file-key/endpoint plumbing during the UI refactor.
- **Bundle size:** fflate is tiny (~10KB) and tree-shakeable; import only `zipSync`/`strToU8`. Confirm `dist/ui.html` still builds and isn't bloated.
- **`loadAllPagesAsync` requires `"documentAccess": "dynamic-page"`** in the manifest — without it the call throws. Add it in Phase 2.
- Keep commits per phase so review stays tractable; this plan is built to run across sessions.
