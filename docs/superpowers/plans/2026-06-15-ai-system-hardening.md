# AI System Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the reviewed AI enrichment regressions so regeneration is fresh, mutations are protected, model output cannot restructure documents, concurrent edits are preserved, bulk work is bounded, and generated cache files stay out of git.

**Architecture:** Keep `draftProse` responsible for provider calls and cache policy, keep `guidelineFillFile` responsible for file-level optimistic concurrency, and keep routes thin. Bulk enrichment will use a small concurrency-limited worker pool while preserving per-item failures. Existing dependency injection remains the test boundary.

**Tech Stack:** TypeScript, Next.js App Router, React, Vitest, filesystem-backed markdown content.

---

### Task 1: Fresh Regeneration And Safe Model Output

**Files:**
- Modify: `packages/extractor/src/prose/client.ts`
- Modify: `packages/extractor/src/prose/prompt.ts`
- Test: `packages/extractor/test/prose.test.ts`
- Modify: `apps/web/src/lib/guidelineFillFile.ts`

- [x] Add a failing test proving `draftProse(..., { bypassCache: true })` skips `cacheStore.get`, calls the API, and updates the cache.
- [x] Add failing parser tests for level-two headings in definition, accessibility, dos, and donts.
- [x] Add `bypassCache?: boolean` to `DraftOptions` and bypass only the read side of the cache.
- [x] Reject generated strings containing markdown level-two headings before they reach section replacement.
- [x] Pass cache bypass only for targeted regeneration, retaining cache reuse for fill-empty operations.
- [x] Run `npx vitest run packages/extractor/test/prose.test.ts apps/web/src/lib/guidelineFillFile.test.ts`.

### Task 2: Secure The Single-Item Mutation Route

**Files:**
- Modify: `apps/web/src/app/api/specs/enrich/route.ts`
- Create: `apps/web/src/app/api/specs/enrich/route.test.ts`

- [x] Add failing route tests for cross-origin requests and non-JSON content types.
- [x] Call `validateSameOriginRequest` for preflight and `validateJsonMutationRequest` before parsing POST bodies.
- [x] Confirm valid same-origin JSON requests still reach `enrichSpecFile`.
- [x] Run `npx vitest run apps/web/src/app/api/specs/enrich/route.test.ts`.

### Task 3: Prevent Stale AI Writes

**Files:**
- Modify: `apps/web/src/lib/guidelineFillFile.ts`
- Test: `apps/web/src/lib/guidelineFillFile.test.ts`
- Modify: `apps/web/src/app/api/specs/enrich/route.ts`
- Test: `apps/web/src/app/api/specs/enrich/route.test.ts`

- [x] Add a failing file test that changes the markdown while the provider request is pending and expects the human edit to survive.
- [x] Snapshot the raw markdown before network work and compare it immediately before writing.
- [x] Throw a dedicated `StaleSpecError` when the file changed.
- [x] Map `StaleSpecError` to HTTP 409 in the single-item route.
- [x] Run the file and route tests.

### Task 4: Bound And Batch Bulk Enrichment Work

**Files:**
- Modify: `apps/web/src/lib/inboxEnrich.ts`
- Test: `apps/web/src/lib/inboxEnrich.test.ts`
- Modify: `apps/web/src/lib/enrichDeps.ts`
- Test: `apps/web/src/lib/enrichDeps.test.ts`

- [x] Add a failing test that records active enrichments and proves the maximum never exceeds four while more than one item can run concurrently.
- [x] Replace the sequential loop with a fixed-size worker pool and preserve result/failure ordering by input index.
- [x] Keep invalid slugs as per-item failures without consuming provider work.
- [x] Add a shared batch image resolver that groups and deduplicates Figma nodes by file.
- [x] Run `npx vitest run apps/web/src/lib/inboxEnrich.test.ts apps/web/src/lib/enrichDeps.test.ts`.

### Task 5: Clean Generated Artifacts And Restore Typecheck

**Files:**
- Modify: `.gitignore`
- Create: `apps/web/src/components/SectionSkeleton.tsx`
- Test: `apps/web/src/components/SectionSkeleton.test.tsx`

- [x] Add `**/.spec-cache/` to `.gitignore` so provider response caches never appear as repository changes.
- [x] Run the existing skeleton test to confirm the missing component failure.
- [x] Implement the minimal accessible `SectionSkeleton` API required by the test.
- [x] Run `npx vitest run apps/web/src/components/SectionSkeleton.test.tsx` and `npm run typecheck`.

### Task 6: Full Verification

**Files:**
- Review all files above.

- [x] Run all focused AI and route tests.
- [x] Run `npm test`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run lint` and `npm run build` if the existing workspace state permits them.
- [x] Inspect `git diff --check` and the scoped final diff for accidental unrelated edits.
