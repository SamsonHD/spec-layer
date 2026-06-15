# Contributing

Thanks for improving Spec Layer. Keep changes focused, testable, and safe for a public repository.

## Setup

Requirements: Node.js 20.9 or newer, npm, and Figma Desktop for plugin testing.

```bash
npm ci
npm run check
```

Run the web app with `npm run dev -w md-ds`. Build the Figma plugin with `npm run build:plugin`, then import `packages/plugin/manifest.json` as a development plugin.

## Development rules

- Add or update automated tests for behavior changes. Bug fixes should include a regression test.
- Run the complete quality gate before opening a pull request: `npm run check`.
- Keep package boundaries intact: `format` owns the Markdown envelope, `extractor` owns pure transformation, `plugin` owns Figma I/O, and `apps/web` owns local storage and authoring.
- Do not commit files produced in `apps/web/content/components/_inbox/`, `.spec-data`, `.spec-cache`, `.ds-config.json`, or environment files.
- Use synthetic fixtures. Never submit API keys, private Figma file keys, customer names, proprietary tokens, or internal component data.
- Avoid unrelated formatting or refactoring in the same pull request.

## Pull requests

Explain the user-visible behavior, architectural tradeoffs, and verification performed. UI changes should include screenshots using synthetic content. Changes to the open format must update `spec/SPEC.md`, examples, parser tests, renderer tests, and compatibility notes together.

## Reporting security issues

Do not open public issues for vulnerabilities or leaked credentials. Follow [SECURITY.md](SECURITY.md).
