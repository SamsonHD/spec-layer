# Figma Connection UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Figma preview linking automatic and understandable across the plugin-to-docs import flow.

**Architecture:** Keep file-key authority in the plugin main thread, expose its source to the UI, and regenerate stale extracted output whenever that authority changes. Keep docs recovery owned by the top-level preview section so nested tabs never duplicate connection controls.

**Tech Stack:** TypeScript, Figma Plugin API, React, Next.js, Vitest.

---

### Task 1: Protect plugin metadata freshness

**Files:**
- Modify: `packages/plugin/src/fileKey.ts`
- Modify: `packages/plugin/src/messages.ts`
- Modify: `packages/plugin/src/main.ts`
- Modify: `packages/plugin/src/ui/actions.ts`
- Modify: `packages/plugin/src/ui/ui.ts`
- Test: `packages/plugin/test/fileKey.test.ts`
- Test: `packages/plugin/test/actions.test.ts`

- [x] Add failing tests for connection-source resolution and regenerating a rendered spec after a file-key change.
- [x] Run the focused tests and confirm they fail because the behavior is missing.
- [x] Add source-aware key resolution and refresh the current rendered spec when the effective key changes.
- [x] Run the focused tests and confirm they pass.

### Task 2: Clarify plugin connection status

**Files:**
- Modify: `packages/plugin/src/ui/dom.ts`
- Modify: `packages/plugin/src/ui/ui.ts`

- [x] Replace the always-present file-key field with a connection status plus a recovery field shown only when needed or manually configured.
- [x] Verify plugin typechecking and build output.

### Task 3: Remove duplicate docs recovery

**Files:**
- Modify: `apps/web/src/components/SpecsTab.tsx`
- Modify: `apps/web/src/components/ComponentTabs.tsx`
- Modify: `apps/web/src/components/FigmaFileEmptyState.tsx`
- Modify: `apps/web/src/app/globals.css`

- [x] Remove recovery ownership from `SpecsTab` and its now-unused `slug` prop.
- [x] Rewrite the remaining notice as a compact exceptional state with clearer copy.
- [x] Run typechecking and the full test suite.
