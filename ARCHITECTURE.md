# Architecture

Spec Layer is an npm-workspaces monorepo with four runtime areas: the Markdown format, the pure extractor, the Figma plugin, and the local docs app.

## Data Flow

```text
Figma node
  → plugin serializer
  → IntermediateSpec
  → deterministic Markdown renderer
  → download, ZIP export, or local docs API
  → Markdown content directory
  → Next.js renderer and editor
```

The Figma plugin owns Figma API access. `@spec-layer/extractor` receives plain JSON and has no dependency on the Figma runtime, which keeps extraction testable with fixtures. `@spec-layer/format` owns frontmatter validation and serialization. The web app owns local persistence, inbox review, navigation, editing, optional guideline generation, and previews.

## Workspaces

### `@spec-layer/format`

Defines `SpecFrontmatter`, validates format version and optional lifecycle status, and parses or serializes YAML frontmatter. It does not interpret the Markdown body.

### `@spec-layer/extractor`

Transforms serialized Figma trees into `IntermediateSpec` data and Markdown. Deterministic modules derive anatomy, properties, variants, states, token rules, gaps, and content hashes. The prose module is optional and receives only derived fields.

### `@spec-layer/plugin`

Runs inside Figma as a small main-thread serializer plus a vanilla-DOM UI. It supports selected-component extraction, Markdown download, token-authenticated delivery to the docs app, and bulk ZIP export. The docs endpoint and token are stored in Figma `clientStorage`.

### `md-ds`

The Next.js App Router app renders a filesystem content tree and exposes local APIs for import, inbox actions, AI guideline filling, editing, navigation, settings, search, and Figma previews. Files remain the source of truth; refreshes read current content rather than requiring a publishing step.

## Storage

The content root resolves from `DS_CONTENT_DIR`, then falls back to `apps/web/content/components`. Each page is a Markdown file and folders form navigation groups.

Runtime artifacts are intentionally untracked:

- `_inbox/` contains imported files waiting to be organized.
- `.spec-data/` stores source extractions used for regeneration.
- `.spec-cache/` stores generated prose cache entries.
- `.ds-config.json` stores optional local settings and credentials.

Settings writes use a temporary file, atomic rename, and mode `0600` where supported.

## Local API Boundary

The app is designed to bind to loopback. API requests are checked in this order:

1. The request `Host` must be loopback or listed in `SPEC_LAYER_ALLOWED_HOSTS`.
2. Requests without an `Origin`, and same-origin requests, are accepted on an allowed host.
3. Cross-origin requests are accepted only from `Origin: null` (the Figma plugin) or an origin listed in `SPEC_LAYER_ALLOWED_ORIGINS`; all other origins are rejected.

This policy covers read and write APIs that expose local content or credentials. CORS headers are emitted only for allowed origins. Figma URLs are accepted only over HTTPS on `figma.com` or `www.figma.com`.

Browser mutations use JSON-only request guards with explicit body limits. CORS preflight requests return without performing authorization; disallowed origins receive no `Access-Control-Allow-Origin`, while the corresponding request is still rejected by the host/origin/token policy.

The boundary reduces exposure during local development. A public deployment would still require user authentication, per-project authorization, tenant isolation, CSRF analysis, durable secret management, rate limiting, and deployment-specific network controls.

## Imports

Import endpoints validate paths and constrain input size. Markdown uploads are limited to 2 MiB. JSON imports are limited to 5 MiB. ZIP uploads are limited to 10 MiB compressed, 1,000 entries, 2 MiB expanded per file, and 50 MiB expanded in total. ZIP limits are enforced while entries stream, before unrestricted expansion can occur.

## Rendering And Editing

The app parses frontmatter with `gray-matter`, identifies sections by Markdown headings, and renders bodies with `react-markdown`, GFM, and slugged headings. Section edits update only the selected section. Navigation operations validate every slug segment before joining filesystem paths.

Interactive tabs, dialogs, command search, and plugin tabs implement keyboard navigation and visible focus. Reduced-motion preferences disable nonessential transitions and animations.

## Optional Integrations

- Figma preview APIs use `FIGMA_TOKEN` or the token stored in Settings.
- Prose generation uses `ANTHROPIC_API_KEY` or the key stored in Settings.

Neither integration is required for structural extraction, Markdown import, editing, or rendering.

AI guideline filling writes only Definition, Accessibility, and Do's & Don'ts. Bulk fill replaces placeholder sections only. A reviewer can explicitly regenerate one supported section, and the app rejects the write if the source spec changes while generation is running.

## Verification

The root `npm run check` command runs lint, TypeScript checks, unit tests, the production web build, and the plugin build. GitHub Actions runs the same stages plus `npm audit --omit=dev` on pushes to `main` and pull requests.
