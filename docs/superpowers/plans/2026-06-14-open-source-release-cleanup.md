# Open Source Release Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden Spec Layer's local application, remove private generated data, modernize quality tooling, and publish documentation that accurately describes the current open-source project.

**Architecture:** Keep the existing local-first monorepo and introduce small security helpers at the HTTP and filesystem boundaries. Protect same-origin localhost usage without exposing secrets to the browser, authenticate opaque/cross-origin plugin imports with a local bearer token, and keep extraction packages private implementation modules.

**Tech Stack:** npm workspaces, TypeScript, Next.js App Router, React, Vitest, ESLint, Figma Plugin API, GitHub Actions.

---

### Task 1: Local Request Authorization

**Files:**
- Create: `apps/web/src/lib/localAccess.ts`
- Create: `apps/web/src/lib/localAccess.test.ts`
- Modify: `apps/web/src/lib/specApi.ts`
- Modify: `apps/web/src/app/api/settings/route.ts`
- Modify: `apps/web/src/app/api/nav/*/route.ts`
- Modify: `apps/web/src/app/api/specs/*/route.ts`
- Modify: `apps/web/src/app/api/component/figma/route.ts`
- Modify: `apps/web/src/app/api/figma-preview/route.ts`
- Modify: `apps/web/src/app/api/figma-variants/route.ts`

- [ ] Write tests proving loopback same-origin requests pass, invalid hosts fail, `Origin: null` requires a bearer token, configured origins require the token, and token comparison rejects malformed values.
- [ ] Run `npm test -- apps/web/src/lib/localAccess.test.ts` and confirm the module-not-found failure.
- [ ] Implement `authorizeLocalRequest`, `localCorsHeaders`, and `localAccessError` with exact host/origin parsing and timing-safe token comparison.
- [ ] Run the focused test and confirm it passes.
- [ ] Apply authorization consistently to representative read and all mutation routes, then run the full web tests.

### Task 2: Plugin Authentication

**Files:**
- Modify: `packages/plugin/src/messages.ts`
- Modify: `packages/plugin/src/main.ts`
- Modify: `packages/plugin/src/ui/actions.ts`
- Modify: `packages/plugin/src/ui/dom.ts`
- Modify: `packages/plugin/src/ui/ui.ts`
- Modify: `packages/plugin/test/actions.test.ts`
- Modify: `packages/plugin/TESTING.md`

- [ ] Add a failing action test proving the configured local token is sent as `Authorization: Bearer ...` and omitted when empty.
- [ ] Run the focused test and confirm it fails on the missing header behavior.
- [ ] Persist a docs token beside the endpoint in Figma client storage and add a password field to plugin settings.
- [ ] Add the bearer header to imports and rerun plugin tests.

### Task 3: Request And ZIP Limits

**Files:**
- Create: `apps/web/src/lib/requestLimits.ts`
- Create: `apps/web/src/lib/requestLimits.test.ts`
- Modify: `apps/web/src/lib/zipImport.ts`
- Modify: `apps/web/src/lib/zipImport.test.ts`
- Modify: `apps/web/src/app/api/specs/upload/route.ts`
- Modify: `apps/web/src/app/api/specs/upload-zip/route.ts`
- Modify: `apps/web/src/app/api/specs/import/route.ts`

- [ ] Add failing tests for content-length rejection and bounded ZIP expansion, including an archive whose output exceeds the total limit.
- [ ] Run focused tests and confirm expected failures.
- [ ] Implement pre-read body-size checks and asynchronous bounded unzip handling that aborts while entries are expanded.
- [ ] Apply limits to JSON, Markdown, multipart, and ZIP import routes.
- [ ] Rerun focused and full tests.

### Task 4: Secure Settings And Figma URLs

**Files:**
- Modify: `apps/web/src/lib/settings.ts`
- Modify: `apps/web/src/lib/settings.test.ts`
- Modify: `apps/web/src/lib/figma.ts`
- Create: `apps/web/src/lib/figma.test.ts`
- Modify: `apps/web/src/app/api/specs/figma-file/route.ts`

- [ ] Add failing tests proving config files use owner-only permissions, writes preserve valid JSON atomically, and deceptive/non-HTTPS Figma URLs are rejected.
- [ ] Run focused tests and confirm failures.
- [ ] Implement atomic temporary-file replacement with mode `0600` and strict URL parsing using exact allowed hostnames.
- [ ] Rerun focused and full tests.

### Task 5: Framework And Quality Tooling

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `apps/web/package.json`
- Modify: `apps/web/next.config.mjs`
- Modify: `apps/web/src/app/components/[...slug]/page.tsx`
- Create: `eslint.config.mjs`
- Modify: `packages/format/package.json`
- Modify: `packages/extractor/package.json`
- Modify: `packages/plugin/package.json`

- [ ] Upgrade Next.js, React, React DOM, corresponding types, ESLint, and Next ESLint configuration using npm.
- [ ] Migrate async App Router parameters and current Next.js configuration names.
- [ ] Mark workspace packages private and add root `lint`, `build`, `build:plugin`, and `check` scripts.
- [ ] Run lint, type checking, tests, web build, and plugin build; resolve migration failures without unrelated refactors.

### Task 6: Accessibility Corrections

**Files:**
- Create: `apps/web/src/lib/tabs.ts`
- Create: `apps/web/src/lib/tabs.test.ts`
- Modify: `apps/web/src/components/ComponentTabs.tsx`
- Modify: `apps/web/src/components/CommandPalette.tsx`
- Modify: `apps/web/src/components/GapsAlert.tsx`
- Modify: `apps/web/src/components/SpecsTab.tsx`
- Modify: `apps/web/src/components/EditableNav.tsx`
- Modify: `apps/web/src/app/globals.css`
- Modify: `packages/plugin/src/ui/dom.ts`

- [ ] Add failing pure tests for tab arrow-key movement and wrapping.
- [ ] Implement complete tab IDs, controls, roving focus, and keyboard navigation.
- [ ] Correct command-palette list semantics and add modal focus trap/restore behavior using a shared small helper where appropriate.
- [ ] Add keyboard-accessible navigation move controls, visible `:focus-visible` styles, and reduced-motion CSS.
- [ ] Run lint, focused tests, and type checking.

### Task 7: Repository And Governance Cleanup

**Files:**
- Delete: `apps/web/content/components/_inbox/*.md`
- Delete: `.claude/launch.json`
- Modify: `.gitignore`
- Modify: `apps/web/.gitignore`
- Create: `.github/workflows/ci.yml`
- Create: `.github/dependabot.yml`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/pull_request_template.md`
- Create: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Create: `CODE_OF_CONDUCT.md`

- [ ] Remove tracked generated inbox content while preserving `.gitkeep` and unrelated user work.
- [ ] Expand ignore rules for inbox output, sidecars, caches, local settings, and editor metadata.
- [ ] Add CI, dependency update automation, contribution guidance, security policy, conduct policy, and issue/PR templates.
- [ ] Confirm `git status` contains no generated inbox data and `git check-ignore` covers representative generated files.

### Task 8: Public Documentation Rewrite

**Files:**
- Rewrite: `README.md`
- Rewrite: `ARCHITECTURE.md`
- Rewrite: `apps/web/README.md`
- Modify: `apps/web/.env.example`
- Modify: `spec/SPEC.md`
- Modify: `packages/plugin/TESTING.md`
- Remove or label obsolete planning/audit documents where they would mislead contributors.

- [ ] Rewrite README around the implemented extract, import, edit, file, and export workflow, including local auth and security limitations.
- [ ] Rewrite architecture around current modules, data flow, storage artifacts, and trust boundaries.
- [ ] Remove all claims of an implemented approval endpoint or mandatory draft-marker workflow from the specification and examples.
- [ ] Document every current environment variable and contributor command.
- [ ] Search for stale approval, old API-key, and auto-enrichment claims and reconcile all remaining occurrences.

### Task 9: Release Verification

**Files:**
- Modify only files required to fix failures discovered by verification.

- [ ] Run `npm ci` with a temporary writable npm cache.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test` and record the passing test count.
- [ ] Run `npm run build` and `npm run build:plugin`.
- [ ] Run `npm audit --omit=dev` and require zero unresolved production advisories.
- [ ] Run `git diff --check`, inspect the final diff, and confirm the two pre-existing untracked inbox-move files remain intact.
