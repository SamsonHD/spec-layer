# Plugin UI Upgrade — High Impact (Phase 1.5)

> Spec for the first wave of plugin UI improvements. Scope: review UX, visual hierarchy, and Figma-native feel — without changing the extract → approve → export pipeline.

**Status:** Planned  
**Target:** `packages/plugin/src/ui/`  
**Depends on:** Existing phase machine (`state.ts`), `@spec-layer/format` parse/serialize, `@spec-layer/extractor` gap data

---

## Current State

The plugin UI (`ui.ts`) is a single-page vanilla HTML shell:

| Area | Today |
|---|---|
| Settings | API key field permanently visible at top |
| Workflow | Raw phase strings (`extracting…`, `drafting…`) next to Extract button |
| Review | One monolithic markdown `<textarea>` (280px) for the entire spec |
| Gaps | Buried in markdown under `## Extraction gaps` — not surfaced in UI |
| Approve | Global button strips all draft markers at once |

Panel size: 480 × 640 (`main.ts`).

---

## Goals

1. Match the UI to the **10-section spec format** instead of raw markdown editing.
2. Make the **Extract → Draft → Review → Approve → Export** flow obvious at a glance.
3. Surface **extraction gaps** as actionable Figma fixes before approval.
4. Reclaim vertical space by **collapsing settings** into a drawer.

Non-goals for this wave: GitHub sync, drift detection, per-section approve toggles, React/framework migration.

---

## 1. Section-Based Review UI

### Problem

The entire spec lands in one textarea. Reviewers must scroll through frontmatter, tables, and draft markers in monospace. Easy to break syntax; hard to scan.

### Solution

Parse rendered markdown into sections and render each according to its kind (per `spec/SPEC.md`).

| Section | Kind | UI treatment |
|---|---|---|
| Definition | Judgment | Editable textarea + draft badge |
| Anatomy | Deterministic | Read-only bullet list |
| Configuration | Deterministic | Read-only HTML table |
| Variants | Deterministic | Read-only bullet list |
| States | Deterministic | Read-only bullet list |
| Tokens used | Deterministic | Read-only HTML table (token names styled as code) |
| Code | Judgment | Editable textarea + draft badge |
| Accessibility | Judgment | Editable textarea + draft badge |
| Do's & Don'ts | Judgment | Editable textarea + draft badge |
| Related atoms | Deterministic | Read-only link list |
| Extraction gaps | Optional | Warning callout (see §3) |

**Power-user escape hatch:** Collapsed "View raw markdown" toggle at the bottom. When expanded, shows the current monolithic textarea (existing behavior).

### Implementation notes

- Add `packages/plugin/src/ui/sections.ts`:
  - `parseSpecSections(md: string): SpecSections` — split body on `## ` headings; preserve order.
  - `assembleSpec(frontmatter, sections): string` — rejoin for approve/download.
- Reuse `parseFrontmatter` / `serializeFrontmatter` from `@spec-layer/format` for YAML block.
- Judgment sections: detect draft marker line (`> ⚠️ Draft — AI-suggested, not yet approved.`) and show a yellow "AI draft" chip; strip marker from editable content, re-insert on assemble if still draft.
- Deterministic sections: render as HTML; no `contenteditable`. Add per-section "Copy" button.
- Keep `renderedMd` as source of truth OR derive from section model on every edit — pick one and document in code. Recommended: section model in memory, assemble to `renderedMd` on approve/download/input sync.

### DOM structure (sketch)

```html
<div id="review-area">
  <div class="section-card" data-section="definition">…</div>
  <div class="section-card" data-section="anatomy" readonly>…</div>
  <!-- … -->
  <details id="raw-markdown-toggle">
    <summary>View raw markdown</summary>
    <textarea id="spec-textarea">…</textarea>
  </details>
</div>
```

### Acceptance criteria

- [ ] After extract, judgment sections are individually editable; deterministic sections are read-only.
- [ ] Draft badge visible on any judgment section that still contains the draft marker.
- [ ] Approve + Download produce identical output to current `approveSpec()` + textarea flow.
- [ ] Raw markdown toggle shows assembled content and stays in sync when sections are edited.
- [ ] Existing integration tests pass; add unit tests for `parseSpecSections` / `assembleSpec`.

---

## 2. Workflow Stepper

### Problem

Phase is exposed as internal enum text (`extracting…`, `drafting…`) via `#phase-label`. Users don't see where they are in the flow.

### Solution

Replace `#phase-label` with a horizontal stepper:

```
Select → Extract → Draft → Review → Approve → Export
```

| Step | Active when | Label copy |
|---|---|---|
| Select | `idle`, component selected | "Select" |
| Extract | `extracting` | "Extracting…" |
| Draft | `drafting` | "Generating AI drafts…" |
| Review | `review` | "Review" |
| Approve | `approved` (pre-download) | "Approved" |
| Export | user clicks Download | "Exported" (transient, 2s) |

Visual states: `pending` (gray), `active` (blue + spinner if async), `done` (green check), `skipped` (Draft step when no API key — show "Skipped" sublabel).

### Implementation notes

- Add `#workflow-stepper` above Extract button; map `UiPhase` + context (has API key, download clicked) to step states in `renderPhase()`.
- Remove raw phase string from visible UI; keep `phase` enum unchanged in `state.ts`.
- During `drafting`, disable Extract and show spinner in the Draft step (not a bare text label).
- When no API key: after structural render, transition Draft → `skipped` → Review immediately with existing warn banner.

### DOM structure (sketch)

```html
<nav id="workflow-stepper" aria-label="Spec workflow">
  <ol class="stepper">
    <li class="step done">Select</li>
    <li class="step active">Extract<span class="spinner"></span></li>
    <li class="step pending">Draft</li>
    <li class="step pending">Review</li>
    <li class="step pending">Approve</li>
    <li class="step pending">Export</li>
  </ol>
</nav>
```

### Acceptance criteria

- [ ] Stepper reflects current phase without showing internal enum names.
- [ ] Draft step shows spinner during LLM call; shows "Skipped" when no API key.
- [ ] Approved state highlights Approve step as done; Export step activates on Download click.
- [ ] Stepper fits 480px width without horizontal scroll (abbreviate labels or use icons on narrow panels).

---

## 3. Extraction Gaps Summary Panel

### Problem

`extractGaps()` already flags hardcoded colors, missing typography, unbound layout values — but results only appear deep in markdown. Reviewers miss them.

### Solution

After extract (when `IntermediateSpec.gaps` is available), show a **Gaps summary panel** above the section cards.

**When gaps.length === 0:** Hidden or show green "No extraction gaps" one-liner.

**When gaps.length > 0:**

```
⚠ 3 extraction gaps — fix in Figma or accept before approving

  label      no text style or typography variable
  container  hardcoded padding
  debug-overlay  hardcoded color (no variable or style)
```

Each row: part name (monospace) + issue text. Optional: scroll-into-view link to Extraction gaps section card if present in markdown.

### Implementation notes

- `runExtract()` already calls `extract()` — keep the `IntermediateSpec` in UI state (`currentSpec`) alongside `renderedMd`.
- Render gaps from `currentSpec.gaps` directly; don't re-parse from markdown.
- Panel uses `.banner.warn` styling or a dedicated `.gaps-panel` for stronger visual weight.
- Do not block Approve on gaps (informational only in this wave). Copy: "These are warnings, not blockers."

### Acceptance criteria

- [ ] Gaps panel appears immediately after structural extract (before LLM finishes).
- [ ] Gap count and rows match `extractGaps()` output for Button fixture.
- [ ] Panel hidden when `gaps.length === 0`.
- [ ] Re-extract updates panel; selection change clears it.

---

## 4. Settings Drawer

### Problem

API key field permanently occupies ~60px at the top of a 640px panel. Most sessions don't need it visible.

### Solution

- **Header bar:** Component name (when selected) + status badge + ⚙️ settings button.
- **Settings drawer:** Slides down or overlays when ⚙️ clicked. Contains:
  - API key input (password)
  - Hint: "No key → structural spec only, no AI drafts."
  - Save on blur/change (existing `setApiKey` message).
- **Status chip** in header (always visible):
  - `AI: connected` (green) when key is set
  - `AI: off` (gray) when no key

Remove permanent `#settings` block and `<hr />` from main layout.

### Implementation notes

- Persist key via existing `figma.clientStorage` flow — no backend changes.
- Drawer closed by default; state in `settingsOpen: boolean`.
- Click outside or ⚙️ again to close.
- On boot, set status chip from `apiKey` message (existing `case 'apiKey'`).

### DOM structure (sketch)

```html
<header class="plugin-header">
  <h1 class="plugin-title">Spec Layer</h1>
  <span id="ai-status-chip">AI: off</span>
  <button id="settings-btn" aria-label="Settings">⚙</button>
</header>
<div id="settings-drawer" hidden>
  <!-- api key input + hint -->
</div>
```

### Acceptance criteria

- [ ] API key not visible on default plugin open.
- [ ] Settings drawer opens/closes via ⚙️; key save behavior unchanged.
- [ ] Status chip updates when key is set or cleared.
- [ ] Main review area gains ~60px vertical space vs current layout.

---

## Suggested File Layout

```
packages/plugin/src/ui/
  ui.ts           # boot, message handling, orchestration
  state.ts        # phase machine, approveSpec (unchanged)
  render.ts       # renderPhase, stepper, banners, gaps panel
  sections.ts     # parseSpecSections, assembleSpec
  styles.css      # Figma-native tokens (optional split from inline <style>)
```

Keep inline styles acceptable for first PR; extract to `styles.css` when stepper + section cards land.

---

## Implementation Order

| Order | Item | Effort | Risk |
|---|---|---|---|
| 1 | Settings drawer + status chip | ~0.5 day | Low |
| 2 | Workflow stepper | ~0.5 day | Low |
| 3 | Gaps summary panel | ~0.5 day | Low |
| 4 | Section-based review UI | ~2–3 days | Medium |

Ship 1–3 as a first PR for visible polish without touching approve logic. Ship 4 as a second PR with new tests.

---

## Panel Size

After section cards ship, increase default panel:

```ts
// main.ts
figma.showUI(__html__, { width: 560, height: 720 });
```

Optional: `figma.ui.resize(560, 720)` after first extract enters review.

---

## Testing

Extend manual checklist in `TESTING.md`:

- [ ] Stepper advances through Extract → Draft → Review on Button extract.
- [ ] Gaps panel shows expected rows for Button (label typography, container padding).
- [ ] Settings drawer: key persists across plugin close/reopen.
- [ ] Section edit → Approve → Download round-trip matches current golden output.
- [ ] Raw markdown toggle stays in sync with section edits.

Add unit tests:

- `sections.test.ts` — parse/assemble round-trip on `button.golden.md`
- `render.test.ts` — stepper state mapping from `UiPhase`

---

## References

- Current UI: `packages/plugin/src/ui/ui.ts`
- Phase machine: `packages/plugin/src/ui/state.ts`
- Spec format (section kinds): `spec/SPEC.md` §4
- Gap extraction: `packages/extractor/src/tokens.ts` → `extractGaps()`
- Manual QA: `packages/plugin/TESTING.md`
