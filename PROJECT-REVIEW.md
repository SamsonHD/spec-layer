# Project Review — 2026-06-13

Full-project audit by 4 parallel review agents (extractor diff, plugin/format diff, apps/web, docs & hygiene).
Baseline: **118/118 tests pass, typecheck clean (packages + apps/web), no TODO/FIXME/debug markers.**

Verdict: code quality is good, but the working tree is **not safe to commit as-is** — one security-relevant manifest change, 4 real bugs, a path-traversal gap, and a batch of leftovers/stale docs from the plugin→web-app re-architecture.

---

## 1. Critical

| # | Location | Issue |
|---|---|---|
| C1 | `packages/plugin/manifest.json:9` | `networkAccess.allowedDomains` widened from `["https://api.anthropic.com"]` to `["*"]`. The plugin no longer calls Anthropic at all (prose moved server-side), so the right fix is a *narrow* list of docs hosts + keep `devAllowedDomains: ["http://localhost:3000"]`. Wildcard = exfiltration channel via the free-text Docs URL field, and guaranteed friction in Figma plugin review. |

## 2. Major — bugs in uncommitted code

| # | Location | Issue |
|---|---|---|
| B1 | `packages/extractor/src/extract.ts:35-49` vs `tokens.ts:166-186` | Axis-model mismatch: `extractTokens` falls back to the `Variant` pseudo-axis for **all** variants if any name is unparseable; `extractVariantInstances` decides per child. Result (reproduced): `resolveTokensForVariant` returns `[]` for parseable-named variants — the web app's per-variant token panel (`SpecsTab.tsx:358`) silently shows nothing. Fix: compute the axis model once in a shared helper, feed both. |
| B2 | `packages/extractor/src/pivot.ts:138-158` | `pivotColorPart` silently drops rules conditioned on two non-default modifier values (e.g. `Selected=true ∧ Disabled=true`) — reproduced; breaks the documented "lossless" guarantee. Fix: route rules matching no sub-table into `exceptionRules`. |
| B3 | `packages/extractor/src/tokens.ts:19-22, 233-244` | Token walk visits `visible: false` subtrees, so presence-driven conditioning (the headline feature) fails for the common Figma pattern of hidden-but-present layers — rule comes out unconditioned. Fix: skip invisible subtrees in `extractTokens` (keep them in `extractGaps`, which is deliberate). |
| B4 | `packages/format/src/approve.ts:29-33` | Regression from the move out of `plugin/ui/state.ts`: the `\n{3,} → \n\n` collapse and its test were dropped. Approving now leaves `\n\n\n` in exported `.md` (reproduced). Fix: re-add collapse + assertion. |
| B5 | `packages/plugin/src/ui/ui.ts:196-235` | "Send to docs" posts `currentSpec` (extract-time JSON) while the hint invites editing the textarea — user edits are silently discarded (only Download uses `specTextarea.value`). Fix: send edited markdown, make textarea read-only for the send path, or fix the hint. |
| B6 | `packages/plugin/src/main.ts:79-84` vs `ui/ui.ts:263-306` | `fileKeyOverride` precedence is order-dependent: UI applies it unconditionally, the next `selection` message reverts it. Pick one rule, apply it in main.ts only. |

## 3. Major — security (apps/web)

| # | Location | Issue |
|---|---|---|
| S1 | `apps/web/src/app/api/component/figma/route.ts:15-18` | Path traversal: only route writing files that skips `isSafeSlug`; `["..",".."]` slugs reach `setFigmaLink` → arbitrary `.md` frontmatter write outside the content dir. Fix: add `isSafeSlug(body.slug)` like sibling `/api/specs/*` routes. |
| S2 | `apps/web/src/app/api/fs/list/route.ts:36`, `api/config` | Arbitrary directory enumeration / arbitrary content root — intentional for a localhost tool, but undocumented. Add a README security note; consider gating behind `NODE_ENV !== "production"`. |
| S3 | `apps/web/next.config.mjs:9` | `images.remotePatterns: [{ hostname: "**" }]` — unused (preview uses plain `<img>`) and overly broad. Tighten to Figma image hosts or remove. |
| ✓ | `apps/web/src/lib/figma.ts` | FIGMA_TOKEN handling is **clean**: server-side only, header-only, no client leak path. `.env.local` properly ignored. |

## 4. Major — git readiness / leftovers

| # | Location | Issue |
|---|---|---|
| G1 | `apps/web/package-lock.json` | Nested lockfile inside an npm workspace — root lockfile already contains `md-ds`. **Delete.** |
| G2 | `apps/web/.gitignore` | Does not ignore `.claude/` or `.spec-data/`. `git add apps/` would stage `.claude/launch.json`, `.claude/skills/figma-to-ds-doc/**`, and 11 generated `.spec-data/**/*.json` scratch sidecars. (`settings.local.json` is saved only by this machine's *global* git ignore — other contributors aren't protected.) |
| G3 | `apps/web/content/components/` | Test scaffolding: empty `btn/` and `button/` dirs (only `.DS_Store`), scratch sidecars (`button45.json`, `chipaction1.json`…), `_inbox/button.md` and `cc/checkbox.md` (contain real Figma keys) — decide: seed content or clean before commit. |
| G4 | root `.gitignore` | Stale `MD DS/` entry (folder gone — moved to `apps/web`). Missing: `**/.claude/settings.local.json`, `.next/`, `*.tsbuildinfo` (defense-in-depth). |
| G5 | `packages/plugin/UI-UPGRADE.md` | **Obsoleted, not just stale**: spec for a UI built on the API-key field, `drafting` phase, and Approve button — all *deleted* by the current diff. Same class of artifact removed in commit a2f15b5. Delete or rewrite against the send-to-docs flow. |
| G6 | `packages/plugin/TESTING.md` | ~Half tests removed features (API-key mode, prose cache, in-plugin Approve). Steps 1–4, 8–10 still valid. No coverage of the new flow (Docs URL, file-key override, Send to docs). Rewrite. |
| G7 | repo-wide | `.DS_Store` litter (11 files, all ignored). `find . -name .DS_Store -not -path '*/node_modules/*' -delete`. |

## 5. Major — stale docs

| # | Location | Issue |
|---|---|---|
| D1 | `ARCHITECTURE.md` | Describes the pre-re-architecture world throughout: workspaces (`["packages/*"]`), repo tree (no `apps/`), prose/approve in the plugin, clientStorage prose cache, 7-message protocol (3 rows gone, 2 new), 5-phase machine (now `idle|extracting|sent`), manifest "restricted to api.anthropic.com", module tables missing `pivot.ts`/`resolve.ts`/`approve.ts` and listing deleted `variantDelta`/`TokenBinding`, roadmap unaware of the web app. Full line-by-line correction list in the audit agent's report. |
| D2 | `README.md` | Stale flow (Extract→Review→Approve→Export), stale AI-prose instructions (plugin API key → now `ANTHROPIC_API_KEY` env in apps/web), trees omit `apps/web`, no instructions to run the docs app (required for the primary flow). |
| D3 | `spec/examples/*.md` (button, text-field, dialog) | All three violate the updated SPEC.md: bulleted (not numbered) Anatomy, variant-kind rows in Configuration, no `(default)` markers / State-axis exclusion / Modifiers bullet in Variants, flat token tables instead of Color/Typography/Measurements structure. `button.golden.md` conforms; mirror it. |
| D4 | root `package.json` | `typecheck` skips `apps/web` (it passes — wire it in). No workspace `build`/`lint` scripts. |

## 6. Minor / nits

- `extract.ts:39` — dead `c.type === 'COMPONENT_SET'` in children filter.
- `tokens.ts:248-343` — minimizer can over-claim when a binding is absent only in a multi-axis corner of a full grid (reproduced); add a final validation pass.
- `tokens.ts:60-76` + `pivot.ts:9-12` — `fontStyle` falls through every mapping; renders camelCase under Measurements.
- `tokens.ts:346` vs `render.ts:26-29` — two competing notions of "default variant" (first child vs `defaultValue`).
- `tokens.ts:380` — sort comparator never returns 0.
- `render.ts:146-147` — empty `spec.tokens` renders a bare `## Tokens used` heading (Configuration/Variants get `_None._`).
- `render.ts:18` vs `format/src/approve.ts:3` — draft-marker literal duplicated across packages; import `DRAFT_MARKER` from format.
- SPEC.md says Color sub-tables come "in anatomy order" — render uses first-seen order and includes non-anatomy parts; reword or sort.
- `plugin/src/ui/state.ts:13-15` — phase machine degenerate: `any → sent`, no exit from `sent`; UI bypasses it. Model properly or reduce to a boolean.
- `ui.ts:221-232` — 2xx-with-non-JSON body reported as "Send failed"; `data.ok` never checked.
- `ui.ts:105,133-149` — dead `warn` banner plumbing.
- `state.test.ts:37-40` — `_typeCheck` hack; remove the unused `UiPhase` import instead.
- `anatomy.ts:44-51` — name-dedup keeps first occurrence's `nested` flag.

## 7. Test coverage gaps

- No test mixes parseable/unparseable variant names through `extract()` + `resolve` (would catch B1).
- No pivot test with two simultaneous modifier conditions (would catch B2); no visibility-toggle fixture (would catch B3).
- Pivot rendering never exercised end-to-end — add a second golden fixture with a pivoting component.
- `parseFigmaFileKey` (pure, in `ui.ts:31-38`) untested; ui.ts has no test harness.
- Send-to-docs payload contract (`{ spec, extractedAt }` ↔ apps/web `ImportBody`) enforced nowhere.
- `approve.test.ts`: missing blank-line-collapse and non-judgment-section-preservation assertions.
- `normalizeBindings`: asymmetric padding, partial corner radii, double-binding paths untested.

## 8. Suggested fix order

1. **Before any commit:** C1 (manifest), G1 (nested lockfile), G2/G4 (gitignores), G3 (content scratch), S1 (path traversal).
2. **Bugs:** B1–B6 with regression tests (each is independently fixable).
3. **Docs:** D1–D3, G5/G6 rewrite-or-delete, D4 scripts.
4. **Minors + coverage gaps** as a cleanup pass.
