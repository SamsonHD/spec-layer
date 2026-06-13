# Platform Revamp Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (subagents available) to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking. Run each **Phase** as one or more dedicated subagents at the model tier noted in its header. Phases have an explicit dependency order — respect it to avoid file conflicts.

**Goal:** Reshape the docs platform from an AI-draft/approval pipeline into a manual-first authoring tool — direct on-canvas editing, optional AI, optional statuses, manual markdown import, in-app API keys, and a cleaner shell — while fixing the plugin's misleading "Figma 404" path.

**Architecture:** Next.js 14 App Router app (`apps/web`), markdown files on disk are the source of truth (read live via `force-dynamic`). The Figma plugin (`packages/plugin`) POSTs extracted specs to `/api/specs/import`. Shared rendering/format logic lives in `packages/extractor` and `packages/format`. We keep the file-backed model; we add write paths (inline section save, manual upload, settings) and remove the draft→approve workflow.

**Tech Stack:** Next.js 14.2 (App Router), React 18, plain CSS + CSS variables (`globals.css`), `react-markdown` + `remark-gfm`, `gray-matter`, vitest. Plugin: Figma Plugin API + plain TS UI.

---

## Decisions locked (from product owner)

1. **#6 editing** → **Inline section editing**: each block becomes click-to-edit (markdown textarea in place), save back to the `.md` file; support add / delete / reorder sections. Markdown stays the source of truth.
2. **#5 keys** → **Local config file** (`.ds-config.json`, same place as content dir). Read server-side only; never returned to the browser in full after save.
3. **#11 Figma link** → **Auto-detect + clear empty state**: use `figma.fileKey` automatically; when no link exists, render a "No Figma source linked" empty state, never a 404.
4. **#3 / #4 status** → **Remove review workflow, keep optional status**: delete approver, AI-draft markers, ReviewBar/ReviewPanel approve flow. Status becomes an optional free label. AI authoring becomes opt-in, not default. Extraction gaps surface in an alert modal framed as "design-system inconsistencies to fix."

---

## File map (what gets created / modified / deleted)

**Create**
- `apps/web/src/app/settings/page.tsx` — Settings UI (API keys, content dir info)
- `apps/web/src/app/api/settings/route.ts` — GET status / POST keys
- `apps/web/src/app/api/specs/upload/route.ts` — manual `.md` upload
- `apps/web/src/app/api/specs/section/route.ts` — save edited section back to file
- `apps/web/src/components/ManualImport.tsx` — upload/paste markdown UI
- `apps/web/src/components/EditableSection.tsx` — click-to-edit block wrapper
- `apps/web/src/components/GapsAlert.tsx` — extraction-gaps alert modal
- `apps/web/src/lib/sectionEdit.ts` (+ `.test.ts`) — split/replace/reorder body sections
- `apps/web/src/lib/settings.ts` (+ `.test.ts`) — read/write keys in config

**Modify**
- `apps/web/src/app/page.tsx` — remove sample-content banner (#1)
- `apps/web/src/components/Sidebar.tsx` — remove source-folder footer (#8), rebrand title (#9), keep Inbox link
- `apps/web/src/app/layout.tsx` — drop `SourceInfo` plumbing (#8), add Settings link
- `apps/web/src/app/globals.css` — header full-width (#10), remove banner/source-footer styles, editor/modal styles
- `apps/web/src/app/inbox/page.tsx` — UX + copy rewrite (#7)
- `apps/web/src/components/InboxFileForm.tsx` — clearer "process this import" framing (#7)
- `apps/web/src/app/components/[...slug]/page.tsx` — optional status, remove ReviewPanel/draft logic, wire editing + gaps modal
- `apps/web/src/components/ComponentTabs.tsx` — remove draft-note blockquote handler, host editable sections
- `apps/web/src/lib/content.ts` — make status optional (no "unknown" default badge), keep parsing
- `apps/web/src/lib/config.ts` — keep `getContentDir` (env/default only), drop UI folder-picker writes (#8); add key storage hooks
- `apps/web/src/app/api/specs/import/route.ts` — make AI opt-in, drop forced draft markers
- `packages/format/src/approve.ts` — retire `DRAFT_MARKER` / approver concept (or neutralize)
- `packages/extractor/src/render.ts` — stop emitting `status: draft` + draft markers by default
- `packages/plugin/src/ui/ui.ts` — block/clarify send when no file key resolvable; auto-detect messaging (#11)
- `apps/web/src/lib/figma.ts` — the actual `` `Figma API ${res.status}` `` 404 message source (lines ~57 and ~107) (#11)
- `apps/web/src/app/api/figma-preview/route.ts` — API that calls `lib/figma.ts` (#11)
- `apps/web/src/components/FigmaPreview.tsx` / `FigmaSection.tsx` — guard render on `fileKey !== "unknown"`; clear empty state instead of 404 (#11)
- `apps/web/src/components/SpecsTab.tsx` / `FigmaFileEmptyState.tsx` — the real "missing Figma link" surface for spec-backed docs (SpecsTab already defines `UNKNOWN_FILE_KEY="unknown"` and renders `FigmaFileEmptyState`); reuse, don't reinvent (#11)
- `apps/web/src/components/EditableNav.tsx` — status badge render site (line ~256), already truthiness-guarded; verify no stray default (#3)
- `apps/web/src/lib/content.ts` — **note:** `normalizeStatus` already returns `undefined` for absent status; parsing is already correct — do NOT "fix" it, only touch render sites (#3)
- `packages/format/src/index.ts` — if `SpecFrontmatter.status` is non-optional, make it optional here (#4)
- `spec/SPEC.md` — update to reflect optional status + no mandatory draft markers

**Delete**
- `apps/web/src/components/ReviewBar.tsx`, `apps/web/src/components/ReviewPanel.tsx` (#4)
- `apps/web/src/components/FolderPicker.tsx`, `apps/web/src/components/ChooseFolderButton.tsx` (#8)
- `apps/web/src/app/api/config/route.ts`, `apps/web/src/app/api/fs/list/route.ts` (#8)
- `apps/web/src/app/api/specs/approve/route.ts` (#4)

---

## Agent & model assignment

| Phase | Scope (items) | Agent type | Model | Why this tier |
|------|----------------|-----------|-------|----------------|
| **0** | Worktree + baseline test run | (driver, inline) | — | Setup |
| **1 — Shell cleanup** | #1, #7, #8, #9, #10 | `general-purpose` | **Sonnet** | Broad but well-scoped mechanical edits; one agent owns `Sidebar`/`layout`/`globals.css` to avoid conflicts |
| **2 — Component page rework** | #3, #4, #6, gaps modal | `general-purpose` | **Opus 4.8** | Cross-cutting: removes a workflow across web+format+extractor+spec AND adds the inline-editing feature. Highest reasoning + most conflict-prone files |
| **3a — Manual import** | #2 | `general-purpose` | **Sonnet** | Self-contained new endpoint + UI |
| **3b — Settings & keys** | #5 | `general-purpose` | **Sonnet** | Self-contained new page/endpoint; wires existing key readers |
| **4 — Plugin link fix** | #11 | `general-purpose` | **Sonnet** | Localized plugin + preview changes |
| **Review (each phase)** | — | `superpowers:code-reviewer` | **Opus 4.8** | Independent verification against this plan |

**Dependency / sequencing graph**

```
Phase 0 (setup)
   │
   ▼
Phase 1 (shell)  ──────────────┐
   │ touches config.ts/Sidebar │
   ▼                           │
Phase 2 (component page) ◀──────┘   (Phase 2 reworks page.tsx/ComponentTabs/FigmaSection that Phase 1 leaves alone)
   │
   ├──► Phase 3a (manual import)   ┐ parallel (distinct files)
   ├──► Phase 3b (settings/keys)   ┘
   │
   ▼
Phase 4 (plugin) ── depends on Phase 2 (FigmaSection/FigmaPreview empty state)
```

Run Phase 1 → Phase 2 sequentially (both touch `config.ts` and the component shell). After Phase 2, Phases 3a/3b run in parallel; Phase 4 runs after Phase 2. Dispatch parallel agents per superpowers:dispatching-parallel-agents, and isolate each phase in its own commit. If running phases concurrently in worktrees, use superpowers:using-git-worktrees.

---

## Phase 0 — Setup

- [ ] **Step 1:** Confirm baseline green. Run: `npm test` (root vitest). Expected: existing suites pass.
- [ ] **Step 2:** Start the web app once to capture a "before" baseline (preview tools), note current homepage/inbox/component pages.
- [ ] **Step 3:** Create a feature branch (not `main`): `git checkout -b revamp/platform-pass`.

---

## Phase 1 — Shell cleanup (Sonnet) — items #1, #7, #8, #9, #10

**Files:** `page.tsx`, `Sidebar.tsx`, `layout.tsx`, `globals.css`, `inbox/page.tsx`, `InboxFileForm.tsx`; delete `FolderPicker.tsx`, `ChooseFolderButton.tsx`, `api/config/route.ts`, `api/fs/list/route.ts`; edit `lib/config.ts`.

### Task 1.1 — Remove homepage sample-content banner (#1)
> **Ordering:** this task must remove the `isDefaultDir` usage in `page.tsx:11` **before** Task 1.2 deletes `isDefaultDir` from `config.ts`, or the build breaks.
- [ ] Delete the banner block at `apps/web/src/app/page.tsx:21-29` (the `{onSample && docs.length > 0 && (...)}` block).
- [ ] Remove now-unused `onSample`/`isDefaultDir` import (`page.tsx:3,11`) + `ChooseFolderButton` import in `page.tsx`. Keep the empty-state at lines 31-44 but replace `ChooseFolderButton` usage there with copy pointing to the content folder / manual import (Phase 3a adds the real entry point; for now link to `/settings`).
- [ ] Verify homepage no longer renders the notice (preview: load `/`, snapshot).

### Task 1.2 — Remove source-folder selection entirely (#8)
- [ ] Delete `apps/web/src/components/FolderPicker.tsx` and `apps/web/src/components/ChooseFolderButton.tsx`.
- [ ] Delete `apps/web/src/app/api/config/route.ts` and `apps/web/src/app/api/fs/list/route.ts`.
- [ ] In `Sidebar.tsx`: remove the entire `source-footer` block (lines 58-70), the `FolderPicker` import + `pickerOpen` state (lines 11, 36, 72), the `source`/`SourceInfo` prop, AND the exported `SourceInfo` interface (lines 13-17). Keep `nav-spacer`.
- [ ] In `layout.tsx`: remove the `SourceInfo` import (line 6), `SourceInfo` construction (lines 24-28), `getContentDirSource` import (line 5), and the `source` prop passed to `Sidebar` (line 43). Keep `getContentDir()` only where still needed.
- [ ] In `lib/config.ts`: keep `getContentDir()` resolving **env var → default** only. Remove/retire `setContentDir`, `clearContentDir`, `getContentDirSource`, `isDefaultDir` (the folder-picker writes). **Do NOT remove the `.ds-config.json` read path** — Phase 3b extends the same file for API keys via `lib/settings.ts`. Leave the JSON read/parse helper intact (it currently reads `{ contentDir }` at config.ts:26); `getContentDir` may still honor a `contentDir` value already present in the file, but there is no longer any UI to write it. Grep for all references and clean them: `grep -rn "setContentDir\|clearContentDir\|getContentDirSource\|isDefaultDir\|FolderPicker\|ChooseFolderButton" apps/web/src`. (Only consumer of `setContentDir`/`clearContentDir` is the deleted `api/config/route.ts`; `getContentDirSource` only `layout.tsx`+that route; `isDefaultDir` only `page.tsx` — all handled here/Task 1.1.)
- [ ] Remove `.banner`, `.source-footer`, `.source-label`, `.source-path`, `.source-meta`, `.source-change`, `.source-tag` rules from `globals.css`.
- [ ] Verify: app builds, sidebar shows no source footer, `/api/config` gone. Run `npm run build` in `apps/web` or typecheck.

### Task 1.3 — Rebrand left nav title (#9)
- [ ] In `Sidebar.tsx:42` replace `◆ Design System` brand and `Component documentation` sub (line 46) with a cleaner identity. Recommended: keep it a single confident product name (e.g. drop the diamond glyph for a cleaner mark, tighten the sub to something like "Design system documentation" or remove the sub entirely). Match `globals.css` `.brand`/`.brand-sub` styling; adjust CSS if the glyph is removed.
- [ ] Verify visually (preview snapshot + screenshot).

### Task 1.4 — Header full width (#10)
- [ ] Root cause: `.content { max-width: var(--content-max); }` (`globals.css:251`) caps the whole column — including the sticky `.doc-header` — at 880px, so the header doesn't span the viewport.
- [ ] Fix: let `.content` fill its grid column (`max-width: none`), make `.doc-header` span full width, and constrain only the readable body. Concretely: remove `max-width` from `.content`; keep `.doc-header` padding; wrap/limit `.content-inner` (and the component page's inner wrapper) to `var(--content-max)` centered (`margin-inline: auto`) so prose stays readable while header + background go edge-to-edge. Verify the `[...slug]/page.tsx` header still aligns with body padding.
- [ ] Verify at wide viewport (preview_resize to ~1440px): header background spans full width; body text stays readable width.

### Task 1.5 — Inbox clarity + copy (#7)
- [ ] Rewrite `inbox/page.tsx` framing so it's obvious the user must **process** plugin imports. Replace the header copy (lines 22-25) and the empty-state copy (lines 31-33 "New imports land under `_inbox` until they are filed.").
  - Header (has items): make it action-oriented, e.g. "Imports from the Figma plugin land here. Review each one and file it into your component groups — or delete it."
  - Empty state: e.g. "Nothing to process. When you send a component from the Figma plugin, it shows up here for review."
- [ ] In `InboxFileForm.tsx`, relabel the primary action from "File it" to clearer intent ("Save to group" / "File into…") and add a one-line helper. Keep group + name inputs.
- [ ] Consider a subtle "needs processing" affordance on the sidebar Inbox link count (already present) — leave logic, ensure copy/aria is clear.
- [ ] Verify both states via preview (with and without an inbox file).

### Phase 1 commit & review
- [ ] Run `npm test` and `apps/web` typecheck/build. Expected: green.
- [ ] Commit: `feat(web): clean up shell — remove sample banner, source-folder picker; rebrand nav; full-width header; clearer inbox`.
- [ ] Dispatch `superpowers:code-reviewer` (Opus) against this plan section.

---

## Phase 2 — Component page rework (Opus 4.8) — items #3, #4, #6, gaps modal

> This phase reworks the same files repeatedly; run it as **one Opus agent executing sub-tasks sequentially** (or strictly serialized subagents). Do NOT parallelize sub-tasks here.

**Files:** `[...slug]/page.tsx`, `ComponentTabs.tsx`, `content.ts`, `api/specs/import/route.ts`; new `EditableSection.tsx`, `GapsAlert.tsx`, `lib/sectionEdit.ts` (+test), `api/specs/section/route.ts`; `packages/format/src/approve.ts`, `packages/extractor/src/render.ts`, `spec/SPEC.md`; delete `ReviewBar.tsx`, `ReviewPanel.tsx`, `api/specs/approve/route.ts`.

### Task 2.1 — Make status optional, strip "unknown" defaults (#3)
> **Stale-premise correction:** `content.ts` `normalizeStatus` (line 163) **already returns `undefined`** for absent/invalid status, and `NavNode.status` is already optional. Do NOT change parsing — the fix is purely at the render sites that coerce to `"unknown"`.
- [ ] `page.tsx:24` (`const status = fm.status ?? "unknown"`) → render badge only when `fm.status` is set (`{fm.status && <span className={...}>{fm.status}</span>}`); drop the `?? "unknown"` coercion.
- [ ] Same for `app/page.tsx:48,57` (overview cards) and `inbox/page.tsx:41,49` (both coerce to `"unknown"`).
- [ ] `EditableNav.tsx:256` already guards on `node.status` truthiness — just verify it renders no stray default badge after the above.
- [ ] Verify a doc with no `status` frontmatter shows a clean header (no badge) on home, component page, inbox, and nav; one with `status: stable` still shows it.

### Task 2.2 — Remove approver + draft-marker review workflow (#4)
- [ ] Delete `ReviewBar.tsx`, `ReviewPanel.tsx`, `api/specs/approve/route.ts`.
- [ ] In `page.tsx`: remove `ReviewPanel` import + render (lines 6, 86-94), `hasDraftMarker`/`isDraft`/`needsReview` logic (lines 25, 45-47). `FigmaSection` `editable` should no longer key off `isDraft` (Phase 2.4 sets edit affordance for everyone).
- [ ] In `ComponentTabs.tsx`: remove the draft-note blockquote handler (lines 30-38) and its `extractChildrenText` helper if unused elsewhere.
- [ ] In `packages/extractor/src/render.ts`: stop emitting `status: draft` (hardcoded ~line 132) and stop injecting the `DRAFT` marker into the Definition section (~line 140). Status frontmatter should be **omitted** unless the caller supplies one. **If `SpecFrontmatter.status` is typed as required in `packages/format/src/index.ts`, make it optional there first** (otherwise the type won't allow omission).
- [ ] In `packages/format/src/approve.ts`: retire `DRAFT_MARKER`/approver logic. Update or delete `approve.test.ts` accordingly. (Check the untracked `packages/format/src/approve.ts` + test that exist in the working tree.)
- [ ] In `api/specs/import/route.ts`: remove the forced-draft path; do not write draft markers.
- [ ] Update golden fixtures that encode draft markers: `packages/extractor/test/fixtures/button.golden.md` and any render/extract tests. Run `npm test` and update expected output to the new (markerless, optional-status) form.
- [ ] Update `spec/SPEC.md` (lines ~69-85) to state status is optional and draft markers are removed.

### Task 2.3 — AI authoring becomes opt-in (#4)
- [ ] In `api/specs/import/route.ts`: today it auto-calls `draftProse()` when `ANTHROPIC_API_KEY` is set. Change so AI enrichment is **opt-in** — driven by an explicit flag in the import payload / a setting (default off). When off, write the structural spec only (no AI prose, no warning framed as an error).
- [ ] Provide a per-component "Draft with AI" action on the component page (button) that calls `api/specs/regenerate` on demand. Keep `regenerate` route but reword UI so AI is clearly optional, not the baseline.
- [ ] Verify: importing without the flag writes a clean structural doc; the AI action still works when a key is present (Phase 3b supplies the key path).

### Task 2.4 — Inline section editing on canvas (#6)
**New lib first (TDD):**
- [ ] **Write failing test** `apps/web/src/lib/sectionEdit.test.ts`: given a markdown body, `splitSections(body)` returns ordered blocks `{ heading, level, content }`; `replaceSection(body, index, newContent)` returns body with that section's content swapped; `reorderSections(body, from, to)` moves a block; `deleteSection`, `insertSection` behave. Reuse/extend `lib/sections.ts` partitioning rather than duplicating.
- [ ] Run test → fails.
- [ ] Implement `apps/web/src/lib/sectionEdit.ts` (build on `partitionBody`/`sections.ts` heading detection). Run → passes.

**Save endpoint (TDD-ish, then wire):**
- [ ] Create `apps/web/src/app/api/specs/section/route.ts`: `POST { slug, action: "replace"|"insert"|"delete"|"reorder", index, content?, to? }`. Reads the doc file via the existing content-dir resolution, applies the `sectionEdit` op, writes back with `gray-matter` frontmatter preserved. Reuse `specWriter`/content path helpers; guard with the same origin protection as `specApi.ts`.
- [ ] Add a small route test or an integration check that a replace round-trips and frontmatter is untouched.

**UI:**
- [ ] Create `EditableSection.tsx` (client): renders a section read-only via `ReactMarkdown`; on click/Edit shows a `<textarea>` with the section's raw markdown + Save/Cancel; Save POSTs to `/api/specs/section`, then `router.refresh()`. Include add-section ("+") and delete/reorder controls (drag or up/down buttons — buttons are fine for v1).
- [ ] In `ComponentTabs.tsx`: render Guidelines (and the prose part of Specs) as a list of `EditableSection`s instead of one read-only `ReactMarkdown`. The Specs *structured* tables (anatomy, variants, properties from `SpecsTab`) stay rendered from the spec JSON — editing there is out of scope for v1; only the prose/markdown blocks are inline-editable. Note this boundary in a code comment.
- [ ] Editing applies to **imported document text** too (any `.md`, including manually uploaded ones), since it's all body markdown.
- [ ] Add editor/affordance styles to `globals.css`.
- [ ] Verify via preview: open a component, edit the Definition block, save, confirm the `.md` file on disk changed and the page reflects it; add a new section; reorder; delete.

### Task 2.5 — Extraction gaps → alert modal (#4)
- [ ] Create `GapsAlert.tsx`: a dismissible alert/modal that lists extraction gaps + issues, framed clearly as **"Inconsistencies found in your design system — these need fixing in Figma"** (not as a docs todo). Include the gap details (was `gapsMarkdown` + `issues` + `missingRequired`).
- [ ] In `page.tsx`: replace the removed `ReviewPanel` with a non-blocking alert affordance (e.g. a banner/button "N inconsistencies detected" that opens `GapsAlert`). Source data from `missingRequired`, `issues`, `gapsMarkdown` already computed in `getDoc`.
- [ ] Style as an alert (warning surface), modal on open. Reuse existing modal CSS patterns (see `.modal`-style rules around `globals.css:449-555`).
- [ ] Verify with a doc that has gaps (e.g. the `_inbox` sample) — alert shows, opens, lists items, is clearly about DS inconsistencies.

### Phase 2 commit & review
- [ ] Run full `npm test` (root) — update any remaining golden/fixtures. Expected green.
- [ ] Typecheck/build `apps/web`.
- [ ] Commit in logical chunks: (a) optional status + remove review workflow + spec/fixtures; (b) inline editing + section API; (c) gaps alert.
- [ ] Dispatch `superpowers:code-reviewer` (Opus).

---

## Phase 3a — Manual markdown import (Sonnet) — item #2

**Files:** new `api/specs/upload/route.ts`, `components/ManualImport.tsx`; wire an entry point on homepage/inbox.

### Task 3a.1 — Upload endpoint
- [ ] Create `apps/web/src/app/api/specs/upload/route.ts`: `POST` accepts either a file (multipart) or `{ filename, markdown }` JSON. Validates it parses with `gray-matter`, derives a slug, writes into `_inbox`. Same origin guard as other spec routes.
- [ ] **`writeInboxSpec` takes `(name, markdown, { spec })`** (`specWriter.ts:60`) — a manually-uploaded `.md` has **no structured `spec`**. Either (a) add a spec-optional path to `writeInboxSpec` that writes the markdown verbatim and skips the `.spec-data` JSON sidecar, or (b) add a sibling `writeInboxMarkdown(name, markdown)` helper. Pick one and note it; do not pass a fake spec.
- [ ] Add a test asserting a posted markdown string lands as a file under `_inbox` and is listed by `getAllDocs`.

### Task 3a.2 — Import UI
- [ ] Create `ManualImport.tsx`: a button/drop-zone + "paste markdown" textarea; on submit calls `/api/specs/upload`, then routes to `/inbox`.
- [ ] Surface it where users look for it: homepage empty-state (replacing the old folder CTA from Phase 1.1) and a button on the Inbox page header. Copy ties to the product idea: "Export an `.md` from the plugin, or add one here."
- [ ] Verify: drag/paste a markdown file → it appears in Inbox → can be filed (existing flow) and edited (Phase 2.4).

### Phase 3a commit & review
- [ ] `npm test` + typecheck. Commit: `feat(web): manual markdown import`. Dispatch code-reviewer (Opus).

---

## Phase 3b — Settings page + API keys (Sonnet) — item #5

**Files:** new `app/settings/page.tsx`, `api/settings/route.ts`, `lib/settings.ts` (+test); modify `lib/config.ts`, `api/specs/import/route.ts`, `lib/figma.ts`, `layout.tsx` (nav link).

### Task 3b.1 — Key storage lib (TDD)
- [ ] **Write failing test** `lib/settings.test.ts`: `setKeys({ anthropic, figma })` persists to `.ds-config.json`; `getAnthropicKey()` / `getFigmaToken()` return config value, falling back to `process.env.ANTHROPIC_API_KEY` / `process.env.FIGMA_TOKEN`; `getKeyStatus()` returns `{ anthropic: boolean, figma: boolean }` (presence only, never the raw value).
- [ ] Run → fails. Implement `lib/settings.ts` writing to the same `.ds-config.json` used for content dir (extend the JSON, don't clobber). Run → passes.

### Task 3b.2 — Settings API + page
- [ ] Create `api/settings/route.ts`: `GET` → `{ contentDir, keys: getKeyStatus() }` (booleans only). `POST { anthropic?, figma? }` → `setKeys`, returns updated status. Origin guard.
- [ ] Create `app/settings/page.tsx`: shows current content dir (read-only, since folder picker is gone), two masked key inputs (show "configured ✓" when set, allow replace/clear), Save. Never echoes stored keys back.
- [ ] Add a "Settings" link in `Sidebar.tsx`/`layout.tsx` (near Inbox).

### Task 3b.3 — Wire readers to config
- [ ] Update `api/specs/import/route.ts` and `api/specs/regenerate/route.ts` to read the Anthropic key via `getAnthropicKey()` (config-or-env) instead of raw `process.env`.
- [ ] Update `lib/figma.ts:44` to read the Figma token via `getFigmaToken()`.
- [ ] Verify: with no env vars, setting keys in `/settings` enables AI draft + Figma previews; clearing them disables. Confirm keys never appear in any GET response (network panel check).

### Phase 3b commit & review
- [ ] `npm test` + typecheck. Commit: `feat(web): settings page with in-app Anthropic + Figma keys`. Dispatch code-reviewer (Opus).

---

## Phase 4 — Plugin Figma link fix (Sonnet) — item #11

**Files:** `packages/plugin/src/ui/ui.ts`; `apps/web/src/lib/figma.ts`; `apps/web/src/app/api/figma-preview/route.ts`; `apps/web/src/components/FigmaSection.tsx`, `FigmaPreview.tsx`, `SpecsTab.tsx`, `FigmaFileEmptyState.tsx`.

> **Root cause (corrected):** the `` `Figma API ${res.status}` `` string is built in `lib/figma.ts` (~lines 57 and 107), surfaced via `FigmaPreview.tsx:113-118`. The preview is called from `api/figma-preview/route.ts`. There are **two** missing-link surfaces: `FigmaSection.tsx` (frontmatter `figma`/`figmaRef` docs) and `SpecsTab.tsx` (spec-backed docs, which already defines `UNKNOWN_FILE_KEY="unknown"` and renders the existing `FigmaFileEmptyState` component). Reuse `FigmaFileEmptyState`; don't invent a parallel empty state.

### Task 4.1 — Plugin: detect & require a resolvable file key before send
- [ ] In `packages/plugin/src/ui/ui.ts`: the file key resolution lives in the `change`/`fileKeyOverride` handlers (~lines 250-323) and `main.ts`; the resolved value to inspect inside `runSendToDocs` (~181-222) is `currentFileKey` (~ui.ts:288) / `currentSpec.figmaFile`. Before POSTing, if that value is `'unknown'`, **do not send** — show an inline message ("No Figma file detected — paste the file URL above so the preview can load") and focus `#filekey-input`. (Auto-detection via `figma.fileKey` already works for saved/published files; this only catches the unsaved/dev case.)
- [ ] Keep "Download .md" working regardless (it doesn't need a key).
- [ ] Confirm `figma.fileKey` is the only automatic source — there is no API to fabricate a share link without it, so paste is the fallback. Document this in a code comment.

### Task 4.2 — Web: clean empty state instead of 404
- [ ] In `FigmaSection.tsx`: the `figmaRef` branch (~lines 124-126) renders `FigmaPreview` **unconditionally**, even when `figmaRef.fileKey === "unknown"`. Guard this branch on `fileKey !== "unknown"`; otherwise render the `FigmaFileEmptyState` ("No Figma source linked — add one") with an action to add the link.
- [ ] In `SpecsTab.tsx`: confirm the existing `UNKNOWN_FILE_KEY` path already routes to `FigmaFileEmptyState` for spec-backed docs; align its copy/action with the new wording.
- [ ] In `lib/figma.ts` / `FigmaPreview.tsx`: never call the images API when `fileKey === "unknown"`. Keep the real `` `Figma API ${res.status}` `` message **only** for failures when a key was actually provided (distinguish "no link" from "link failed").
- [ ] Verify: a doc imported without a link shows `FigmaFileEmptyState` (no network call, no 404); a doc with a valid link previews; a doc with a bad-but-present key shows the real error.

### Phase 4 commit & review
- [ ] `npm test` + plugin build (`packages/plugin`) + `apps/web` typecheck. Commit: `fix(plugin/web): auto-detect Figma key, replace false 404 with clear empty state`. Dispatch code-reviewer (Opus).

---

## Cross-cutting acceptance checklist (run after all phases)

- [ ] #1 Homepage has no "sample content" banner.
- [ ] #2 A user can add a markdown file manually (upload/paste) and it appears in Inbox.
- [ ] #3 A component with no `status` renders no badge; status is freely settable.
- [ ] #4 No approver field, no "Draft — AI-suggested" markers anywhere; AI authoring is opt-in; extraction gaps appear in an alert modal framed as DS inconsistencies.
- [ ] #5 Anthropic + Figma keys can be set in `/settings` and drive AI + previews; keys never returned to the browser.
- [ ] #6 Component blocks are editable inline (edit/add/delete/reorder), saved to the `.md` file; imported document text is editable.
- [ ] #7 Inbox copy makes processing obvious; no "New imports land under `_inbox`…" string remains.
- [ ] #8 No source-folder UI, components, or API routes remain (`grep` clean).
- [ ] #9 Left nav title/branding refreshed.
- [ ] #10 Header spans full width at wide viewports; body stays readable.
- [ ] #11 Missing Figma link → clear empty state / plugin prompt, never a false 404.
- [ ] `npm test` green; `apps/web` builds; plugin builds.

---

## Notes for executors

- **Markdown is the source of truth.** Every write path (section edit, upload, import) must round-trip through `gray-matter` and preserve frontmatter.
- **Don't regress origin protection** (`lib/specApi.ts`) on any new POST route.
- **Golden fixtures**: removing draft markers will break `packages/extractor` goldens — update them deliberately, don't `--update` blindly; eyeball the diff.
- **Keep PRs/commits per phase** so review is tractable; this plan is explicitly built to run across multiple sessions.
