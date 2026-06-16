# Changelog

All notable changes to Spec Layer are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Figma drift detection. A **Check library sync** action in the plugin re-extracts every component in the open file and reports current content hashes; the app compares them against saved specs by `figma_key` and persists a `.spec-sync.json` report. Drift is surfaced as an **Out of date** / **Not found in Figma** banner on the component page, a **Sync** overview grouped by Figma file, an **Out of date** home stat, and a per-selection doc-status chip in the plugin. Comparisons run plugin-side for hash parity (no false positives); the report is additive and the app renders normally when it is absent.

## [1.0.0] - 2026-06-15

### Changed

- Simplified the Figma plugin's **Send to docs** flow: the primary action is now a **Send to docs** button beside **Download .md**, and the docs URL plus Figma file source moved to a dedicated **Settings** tab. The common case (saved file, default URL) needs no configuration; missing Figma keys are prompted inline at send time.

### Removed

- Removed the `SPEC_LAYER_TOKEN` access token and its plugin field. For a localhost-only tool the token was setup friction; the plugin's opaque origin is now permitted automatically. Same-origin enforcement and the loopback host allowlist remain the protection for the local API, and unlisted cross-origins are still rejected.

## [0.1.0] - 2026-06-15

### Added

- Open Markdown design-system specification with reference component examples.
- Deterministic Figma component extraction, selected-component review, Markdown download, local delivery, and bulk ZIP export.
- Local Next.js documentation app with filesystem navigation, search, inline section editing, Figma previews, and configurable content roots.
- Inbox workflow with import summaries, individual and bulk save, per-item delete, clear-all, and destination-folder selection.
- Optional Anthropic guideline filling for Definition, Accessibility, and Do's & Don'ts, including bulk placeholder fill, section regeneration, visual context when available, caching, and stale-write protection.
- MIT license, contribution guide, security policy, code of conduct, issue forms, pull request template, CODEOWNERS, Dependabot, and CI.

### Security

- Loopback-by-default server binding and explicit host/origin validation for local APIs.
- Bearer-token authentication for allowed cross-origin clients such as the Figma plugin.
- Request-size and bounded ZIP expansion limits.
- Atomic owner-readable settings writes and strict HTTPS Figma URL validation.
- Generated inbox content, local credentials, caches, sidecars, and editor state excluded from version control.

### Changed

- Upgraded the web app to Next.js 16, React 19, ESLint 9, and Vitest 4.
- Improved keyboard support, focus handling, dialog semantics, visible focus styles, and reduced-motion behavior.
- Clarified that `status` is optional metadata and that Spec Layer does not enforce an approval workflow.

### Known Limitations

- The web app is a trusted localhost tool, not a hosted or multi-user service.
- Workspace packages are private implementation modules and are not published to npm.
- GitHub synchronization, drift detection, and an MCP server remain roadmap items.

[1.0.0]: https://github.com/SamsonHD/spec-layer/releases/tag/v1.0.0
[0.1.0]: https://github.com/SamsonHD/spec-layer/releases/tag/v0.1.0
