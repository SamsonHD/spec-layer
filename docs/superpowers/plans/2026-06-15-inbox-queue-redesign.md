# Inbox Queue Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Inbox name dump with a searchable review queue whose files can be opened or saved individually.

**Architecture:** The server page continues to load and summarize Inbox docs. A client workspace owns the shared destination folder and passes it to bulk Save All and per-row Save actions. The list owns search and per-item operations; opening a file remains a normal Next.js link to the existing component route.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Vitest, existing CSS tokens.

---

### Task 1: Enrich the Inbox list model

**Files:**
- Modify: `apps/web/src/lib/inboxSummary.ts`
- Test: `apps/web/src/lib/inboxSummary.test.ts`

- [ ] Add failing expectations that each summary item contains `issueCount` and `missingRequiredCount`.
- [ ] Run `npm test -- apps/web/src/lib/inboxSummary.test.ts` and confirm the new expectations fail.
- [ ] Map the two counts from each `ComponentDoc` while preserving alphabetical sorting.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Define and test list filtering

**Files:**
- Create: `apps/web/src/lib/inboxList.ts`
- Create: `apps/web/src/lib/inboxList.test.ts`

- [ ] Add tests for `all`, `ready`, and `attention` filters and case-insensitive name/slug search.
- [ ] Run `npm test -- apps/web/src/lib/inboxList.test.ts` and confirm the module or exports are missing.
- [ ] Implement `getInboxItemState` and `filterInboxItems` as pure functions.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Build the queue list

**Files:**
- Modify: `apps/web/src/components/InboxComponentList.tsx`
- Modify: `apps/web/src/components/InboxComponentList.test.tsx`

- [ ] Add render expectations for search, status filters, status labels, `/components/_inbox/...` links, and delete controls.
- [ ] Run the component test and confirm the old collapsible list fails the expectations.
- [ ] Replace the `<details>` list with a client queue containing a header, search field, filter buttons, rows, result count, and empty result state.
- [ ] Keep the existing per-item delete request and loading/error behavior.
- [ ] Re-run the component and helper tests.

### Task 4: Reorganize the page and Inbox navigation

**Files:**
- Modify: `apps/web/src/app/inbox/page.tsx`
- Modify: `apps/web/src/app/components/[...slug]/page.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] Separate the bulk action panel from the component list panel and add a wide Inbox page class.
- [ ] Convert the `_inbox` component breadcrumb into a link back to `/inbox`; preserve normal breadcrumbs for saved docs.
- [ ] Replace the old multi-column list CSS with responsive toolbar, filter, row, status, and action styles using existing tokens.
- [ ] Run `npm run typecheck` and fix any type errors.

### Task 5: Verify the complete flow

**Files:**
- Create: `design-qa.md`

- [ ] Run `npm test -- apps/web/src/lib/inboxSummary.test.ts apps/web/src/lib/inboxList.test.ts apps/web/src/components/InboxComponentList.test.tsx`.
- [ ] Run `npm run lint`, `npm run typecheck`, and `npm run build`.
- [ ] Start the local app, inspect `/inbox`, test search/filter controls, and open an Inbox row.
- [ ] Compare the result with the supplied screenshot, record the redesign QA result in `design-qa.md`, and fix blocking visual or interaction issues.
