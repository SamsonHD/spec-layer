# AI Guideline Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the quality of AI-filled guideline prose (Definition, Accessibility, Do's & Don'ts) from "somewhat good" to best-in-class, and make that quality *measurable* and *trustworthy* — without depending on a user base we do not yet have. We become our own data source: a hand-curated golden corpus anchors the model, an eval harness scores every change against it, and a verification pass guarantees no claim is shipped that the design file does not support.

**Why this order:** We have no users, so the data flywheel (capturing human edits to drafts) has no fuel yet. Therefore the near-term wins are the ones that need nobody but us: a richer golden corpus, an eval harness, a real system prompt, and claim verification. The flywheel is designed-for now (cheap, reuses existing hooks) and harvested once users arrive.

**Architecture:** Keep the existing prose pipeline boundaries. `buildProsePrompt` / `parseProseResponse` (`packages/extractor/src/prose/prompt.ts`) stay the prompt-shaping + parsing layer; `draftProse` (`packages/extractor/src/prose/client.ts`) stays the provider-call + cache layer; `guidelineFill*` stays the merge layer. New work slots in as: (a) golden fixtures under `spec/examples/`, (b) a verification function alongside the parser, (c) an eval harness as a standalone, dependency-injected runner. Existing dependency injection (`fetcher`, `cacheStore`) remains the test boundary.

**Tech Stack:** TypeScript, Next.js App Router, React, Vitest, filesystem-backed markdown. Anthropic Messages API (`claude-haiku-4-5` today; a `claude-sonnet-4-6` quality tier is evaluated in Task 4).

---

### Task 1: Expand And Validate The Golden Corpus

A golden example is a hand-authored, human-approved spec that defines what "best quality" looks like. It is both a few-shot exemplar (Task 3) and an eval yardstick (Task 2). We grew the corpus from 3 Material specs to 9 across distinct design systems and ARIA patterns so the model learns voice and structure that generalise.

**Files:**
- Create: `spec/examples/checkbox.md` (Carbon / IBM — native checkbox, indeterminate)
- Create: `spec/examples/switch.md` (Fluent 2 / Microsoft — `role="switch"`)
- Create: `spec/examples/banner.md` (Polaris / Shopify — status vs. alert live region)
- Create: `spec/examples/tabs.md` (Spectrum / Adobe — tablist, roving tabindex)
- Create: `spec/examples/tooltip.md` (Atlassian — `role="tooltip"`, focus + hover)
- Create: `spec/examples/select.md` (Ant Design — ARIA combobox)
- Modify: `packages/format/test/frontmatter.test.ts` (validate every new example parses)

- [x] Author the six new golden specs, each conforming to `spec/SPEC.md` v0.1 (10 canonical sections, exact headings, correct token sub-section shapes) and using the *real* token-naming convention and editorial voice of its source design system.
- [x] Each spec's Accessibility section is anchored to the component's W3C ARIA Authoring Practices pattern and explicitly flags what cannot be known from a design file.
- [x] Add the six files to the "parses every reference example" test.
- [ ] Run `npx vitest run packages/format/test/frontmatter.test.ts`.
- [ ] (Stretch) Add a structural conformance test asserting each example body contains exactly the 10 canonical headings in order.

### Task 2: Eval Harness And Rubric

Replaces the missing user signal. Without it, "cleaner output" is a vibe. The harness runs a spec's structured extraction back through `draftProse` and scores the result against the golden version on a fixed rubric, so every prompt/model change is comparable.

**Files:**
- Create: `packages/extractor/src/prose/eval.ts` (rubric scorer + runner, pure + DI fetcher)
- Create: `packages/extractor/test/eval.test.ts`
- Create: `spec/examples/<name>.spec-data.json` sidecars OR a fixture loader deriving `IntermediateSpec` for each golden example

- [ ] Define a rubric as scoreable checks: (1) references the component's *actual* variants/props by name; (2) no generic filler; (3) Do's/Don'ts are verb-first and paired; (4) Accessibility names the correct ARIA roles/keys for the pattern; (5) no claim contradicts the extraction.
- [ ] Implement deterministic checks where possible (variant-name presence, filler-phrase blocklist, ✅/❌ shape) and an optional LLM-judge check for voice/specificity, behind the DI fetcher.
- [ ] Implement a runner that, for each golden example, drafts prose from its extraction and emits a per-spec and aggregate score.
- [ ] Add a baseline snapshot of current scores so future tasks show measurable deltas.
- [ ] Run `npx vitest run packages/extractor/test/eval.test.ts`.

### Task 3: System Prompt And Few-Shot From The Golden Corpus

The current request sends everything as one user message with a one-sentence instruction and no system prompt. Move house rules into a real `system` field and anchor output with 1–2 golden exemplars.

The house voice is already defined in `docs/prose-style-guide.md` (distilled from
best-in-class docs — Atlassian, Material, Polaris, Carbon) and the golden corpus has
been rewritten to it (every Do/Don't carries its reason, imperative and person-centered,
Don'ts name their alternative). This task wires that voice into the request.

**Files:**
- Modify: `packages/extractor/src/prose/prompt.ts` (export a system prompt; add few-shot selection)
- Modify: `packages/extractor/src/prose/client.ts` (send `system` + exemplar messages)
- Modify: `packages/extractor/test/prose.test.ts`

- [ ] Add a failing test asserting the request body includes a `system` string with the house-style rules.
- [ ] Author the system prompt from `docs/prose-style-guide.md`: core rule (state the rule *and* the reason), imperative + person-centered voice, no filler, Do's/Don'ts reference real variant names / are paired with alternatives, Accessibility flags what the design file cannot encode.
- [ ] Add few-shot: select the closest golden example(s) and include them as prior turns so the model sees target length/specificity/voice before generating.
- [ ] Re-run the eval harness (Task 2) and record the score delta vs. baseline.
- [ ] Run `npx vitest run packages/extractor/test/prose.test.ts`.

### Task 4: Claim Verification (Grounding) Pass

Trust is the product wedge: every shipped statement must trace to the structured extraction. Add a verification pass that checks generated claims against `IntermediateSpec` and strips or flags unsupported ones before merge.

**Files:**
- Modify: `packages/extractor/src/prose/prompt.ts` (or a new `verify.ts`) — `verifyProse(prose, spec)`
- Modify: `packages/extractor/src/prose/client.ts` (run verification after parse)
- Modify: `packages/extractor/test/prose.test.ts`

- [ ] Add failing tests: a draft mentioning a non-existent variant/prop is rejected or flagged; a draft referencing only real ones passes unchanged.
- [ ] Implement detection of variant/prop/state mentions and cross-check against the spec; surface unsupported claims (strip, or annotate an `## Extraction gaps`-style warning — decide via the test).
- [ ] Evaluate a `claude-sonnet-4-6` quality tier behind a config flag and compare its verified-pass rate and eval score to Haiku; keep Haiku as the bulk default.
- [ ] Run `npx vitest run packages/extractor/test/prose.test.ts` and re-run the eval harness.

### Task 5: Accessibility Retrieval-Grounding (APG Pattern Map)

Accessibility is the most templatable, highest-accuracy section. Map component patterns to their W3C ARIA Authoring Practices checklist and inject the matching one into the prompt instead of relying on model recall.

**Files:**
- Create: `packages/extractor/src/prose/a11yPatterns.ts` (pattern → role/keyboard/focus checklist)
- Modify: `packages/extractor/src/prose/prompt.ts` (inject matched pattern)
- Create: `packages/extractor/test/a11yPatterns.test.ts`

- [ ] Distil APG checklists for the patterns the golden corpus covers (button, dialog, checkbox, switch, alert/status, tabs, tooltip, combobox).
- [ ] Match a spec to a pattern (by name/anatomy heuristics) and inject the checklist; fall back cleanly when no pattern matches.
- [ ] Verify via the eval rubric's accessibility check that matched specs score higher.
- [ ] Run `npx vitest run packages/extractor/test/a11yPatterns.test.ts`.

### Task 6: Flywheel Capture Hooks (Design Now, Harvest Later)

Nearly free given existing hooks. We capture `(spec, ai_draft, human_final)` triples from user #1 so the proprietary data advantage starts compounding the day we have users — without blocking on them now.

**Files:**
- Reuse: `apps/web/src/lib/guidelineFill.ts` (`findPristineGuidelines` already detects edited-away drafts)
- Reuse: `apps/web/src/lib/aiDraftCache.ts` (`readCachedDrafts` holds the original draft)
- Create: `apps/web/src/lib/draftFeedback.ts` (record draft→final diffs to a local sidecar/log)
- Create: `apps/web/src/lib/draftFeedback.test.ts`

- [ ] Add a failing test: when a section's content differs from its pristine cached draft, a feedback record `(heading, draft, final, contentHash)` is produced.
- [ ] Persist records to a gitignored local sidecar (no PII, no network) — best-effort, never load-bearing.
- [ ] Document the harvest path: accepted finals feed the Task 1 corpus and Task 3 few-shot pool; diffs become future preference data.
- [ ] Run `npx vitest run apps/web/src/lib/draftFeedback.test.ts`.

### Task 7: Full Verification

**Files:**
- Review all files above.

- [ ] Run all focused prose, eval, and format tests.
- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint` and `npm run build` if the workspace state permits.
- [ ] Inspect `git diff --check` and the scoped final diff for accidental unrelated edits.
- [ ] Record the final eval score vs. the Task 2 baseline in this plan.
