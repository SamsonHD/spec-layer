# Spec Layer — Product & Technical Design

**Date:** 2026-06-10
**Status:** Approved by Alex (product outline v2)

> The approved contract between design and code: your design system as text — reviewed by humans, executed by AI, never out of sync.

## 1. Problem

AI agents now have *access* to design data — Figma's official MCP server feeds them raw node trees, variables, and live file context. But raw access is not a contract:

- **Unreviewed** — whatever is on canvas right now, work-in-progress included.
- **Design-shaped** — Figma prop and variant names, not the React component's actual API.
- **Judgment-free** — no usage rules, no do's/don'ts, no accessibility intent.

So agents still hallucinate: they build from a design description when the task is writing code against a component library with different props, constraints, and conventions. Meanwhile, hand-written design docs go stale the moment Figma or the code changes, so teams stop trusting and stop maintaining them.

**The gap: a reviewed, versioned, code-mapped spec that both humans and agents treat as the source of truth.**

## 2. Solution

A Figma plugin + open format + MCP server that turns design-system components into structured Markdown specs — human-approved, machine-parseable, version-controlled — each carrying a **code section** (import path, prop mapping, usage example) so the spec is executable, not just descriptive. Specs are kept honest by drift detection against Figma and served to AI tools via MCP.

**Positioning sentence (used everywhere):** raw feed (Figma MCP) vs. reviewed contract (Spec Layer).

## 3. Core Loop

| Step | What it does |
|---|---|
| **Extract** | Point at a Figma component/component set → structured MD spec (anatomy, props, variants, states, tokens, a11y, do's/don'ts, code mapping). Deterministic parse of the node tree; LLM drafts only the prose sections, clearly marked *draft* until approved. |
| **Approve** | Designer reviews in-plugin, edits judgment content (usage rules, code mapping), approves. Approval flips lifecycle status from `draft` to `approved` — the moment a spec becomes a contract, and the quality gate against generic AI prose. |
| **Store** | Day one: local export (single MD file or library zip), zero setup. Upgrade: GitHub sync from the plugin — diffable, reviewable, PR-able. |
| **Check** | Plugin-initiated drift check: re-extract → diff against stored spec → drift report. Framing is honest: "check before release," not "watches your file" (plugins cannot run in the background; the Figma Variables REST API is Enterprise-only, so server-side polling cannot see token bindings on most plans). |
| **Serve** | Open-source MCP server over any spec folder (`get_spec`, `search_components`, `list_tokens`) — free, drives format adoption. Hosted endpoint for teams: always-fresh, cross-repo, access-controlled. |

## 4. Spec Format v0.1

Markdown + YAML frontmatter. Open standard, published free, in a public repo with reference examples.

**Frontmatter (identity & lifecycle — what drift detection and caching key on):**

```yaml
---
spec_version: "0.1"
status: draft | approved | deprecated
component:
  name: Button
  figma_key: <stable component key>
  figma_file: <file key>
  figma_node: <node id>
content_hash: <hash of the deterministic extraction>
extracted_at: <ISO date>
approved_by: <name, once approved>
---
```

**Body sections (in order):**

1. **Definition** — one-paragraph purpose statement (LLM draft → human approved).
2. **Anatomy** — named parts from the layer structure (deterministic).
3. **Configuration / Props** — component properties: variants, booleans, instance swaps, text props (deterministic).
4. **Variants** — variant matrix (deterministic).
5. **States** — interactive states found as variants or referenced styles (deterministic).
6. **Tokens used** — variable/style bindings per part (deterministic).
7. **Code** — import path, Figma-prop → code-prop mapping, minimal usage example (hand-filled at first; repo-scan suggestions are a Team-tier feature later).
8. **Accessibility** — templated draft per component pattern (Figma carries no a11y semantics); rendered with a draft watermark until human-edited and approved.
9. **Do's & Don'ts** — institutional knowledge; LLM may suggest, human must approve.
10. **Related atoms** — links to specs of nested components (deterministic from instances in the tree).

**Honesty rule baked into the format:** prose sections that cannot be derived from the node tree (definition, a11y, do's/don'ts, code) render with a visible draft marker until approved. Generic AI prose never ships as official doc.

**Strategic note:** the format and the OSS MCP server are deliberately the "weekend clone" of ourselves, shipped first. The moat is the workflow — extraction quality, drift detection, the approve loop — not the format or the serving layer.

## 5. Architecture

**Principle: LLM calls only where judgment is needed; everything else is deterministic parsing.**

### Components

1. **Figma plugin (TypeScript)** — the product surface for Extract / Approve / Store / Check.
   - UI: component picker (or current selection), spec preview with section-by-section review, approve action, export/download, GitHub connect + sync, drift report view.
   - Extraction engine: pure functions over the plugin-API node tree → intermediate JSON (anatomy, props, variants, states, token bindings) → MD renderer. No network needed for extraction.
   - LLM prose pass: sends the *parsed summary* (never raw node JSON) to the Claude API (~3–8k tokens in, 1–2k out; fractions of a cent per component). Cached keyed on `content_hash` — unchanged components never re-bill.
   - Drift check: re-run extraction → structural diff against the stored spec's frontmatter hash + section content. Diff is normalized (ignores layer reorder noise, keys on component property names and token bindings) so renames/reshuffles don't spam false positives.
2. **Spec library (GitHub as the database)** — a repo of `.md` specs. Plugin commits via the GitHub REST API with a user-supplied fine-grained PAT in v1 (a GitHub App OAuth flow needs a backend; deferred until revenue justifies it). Local export is the zero-setup path and ships first.
3. **OSS MCP server (npm package, runs locally)** — points at any folder of Spec Layer MD files. Tools: `get_spec(name)`, `search_components(query)`, `list_tokens()`. Parses frontmatter + sections; no LLM, no network. Free forever; it is the adoption engine.
4. **Hosted MCP endpoint (Vercel)** — Team tier. Same tool surface, backed by the team's synced GitHub spec repo, always fresh, access-controlled. Smallest technical piece; built last.

### Data flow

```
Figma node tree ──(deterministic parse)──> intermediate JSON
intermediate JSON ──(renderer)──> MD sections (structural)
intermediate JSON summary ──(Claude API, cached by content_hash)──> prose drafts
designer review/edit/approve ──> status: approved
spec.md ──(local download | GitHub commit)──> spec library
spec library ──(OSS MCP local / hosted MCP)──> AI tools
re-extract ──(diff vs stored spec)──> drift report
```

### Error handling

- **Unparseable/odd components** (no variants, detached styles, raw hex values): extractor never fails hard — it emits the spec with a "gaps" callout listing what it couldn't resolve (e.g., unbound colors). Gaps are a feature: they surface design-system hygiene issues.
- **LLM unavailable/over budget:** structural sections still generate; prose sections render as empty templates for hand-filling. Extraction never depends on the API being up.
- **GitHub sync failures** (auth, conflicts): plugin falls back to local download and shows the error; sync is retryable. Conflicts resolved by always writing a new branch + PR rather than pushing to main.
- **Drift false positives:** diff operates on normalized intermediate JSON, not raw MD text; layer renames that don't change props/tokens/anatomy names are reported as "cosmetic" severity, separable from breaking drift.

### Cost discipline

Stack: Figma plugin (TypeScript) · GitHub API from the plugin (no backend) · OSS MCP (npm) · hosted MCP on Vercel · Claude API for prose only. Launch cost: time + ~€100–300/month (API + hosting). Plugin publishing is free. No auth system or heavy infra until revenue justifies it.

## 6. Packaging

| Tier | Price | Includes |
|---|---|---|
| **Free / Open** | €0 | Spec format + single-component extraction + local export + OSS MCP server. The adoption engine. |
| **Pro** | ~€25–30/mo **per editor** | Full-library extraction, GitHub sync, drift checks, approve workflow. Sold to the design-systems owner (1–3 seats), not per-designer. |
| **Team** | ~€100+/mo | Hosted MCP endpoint (always-fresh, cross-repo, access control), integrations (Storybook, repo scanning to auto-suggest code mappings), SSO. Pitch: "every AI tool in your org builds on-system." |

The paid line is the *workflow* (sync, drift, approval), not access to your own files.

## 7. Roadmap

- **Phase 0 — Format (Wk 1–2):** spec format v0.1 incl. code section + identity frontmatter; three reference specs (Button, Input, Modal) written against a real public design system; public repo. Zero code.
- **Phase 1 — Extractor (Wk 3–6):** plugin: node-tree walk → spec MD; LLM prose drafts with hash-keyed caching; in-plugin review/approve; local export. Demo-able with zero account setup.
- **Phase 2 — Library + Drift (Wk 7–10):** GitHub sync from the plugin; re-extract → diff → drift report; code-mapping fields editable in the approve step.
- **Phase 3 — AI Layer (Wk 11–14):** OSS MCP server (npm) over a spec folder; hosted endpoint as the Team-tier anchor.
- **Parallel from Wk 3:** build in public, one post per milestone.
- **Decision point (Wk 6):** real pull (DMs, pilot requests) → continue; silence → the open format still feeds consulting positioning. Nothing wasted.

## 8. The Wedge

Extraction + drift, single-player, zero setup: a designer installs the plugin, points it at a component, gets a reviewable spec, and downloads it — no GitHub, no team adoption, no behavior change beyond "approve what the tool drafted." GitHub and MCP are upgrades that arrive after the habit exists. Designers never write MD, only approve it.

## 9. Testing strategy

- **Extraction engine:** unit tests over fixture node trees (serialized JSON of real components — simple button, multi-variant set, deeply nested molecule, pathological unbound-styles case). Pure functions make this cheap. Golden-file tests: fixture in → expected MD out.
- **Drift diff:** fixture pairs (before/after trees) asserting severity classification — breaking (prop removed, token changed) vs. cosmetic (layer rename).
- **MCP server:** integration tests against the reference spec repo — `get_spec` round-trips frontmatter + sections; `search_components` finds by name/synonym; malformed spec files degrade gracefully.
- **LLM prose:** snapshot review, not assertion tests; prompt changes verified manually against the three reference components. Cache behavior unit-tested (same hash → no API call).
- **Plugin UI:** manual test script per release (Figma plugin e2e tooling is poor); extraction logic stays out of the UI layer so the UI surface stays thin.
