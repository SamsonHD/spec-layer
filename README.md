# Spec Layer

Spec Layer is a local-first toolkit for turning Figma components into structured Markdown design-system documentation. It combines a Figma plugin, a deterministic extractor, an open Markdown format, and a Next.js authoring app.

The project is currently intended for trusted local development. The web app reads and writes files on the host machine and is not hardened as a public multi-user service.

## What Works

- Extract a selected Figma component or component set into a structured spec.
- Export one component as Markdown or all components as a ZIP archive.
- Send an extraction from the Figma plugin to the local docs app.
- Import Markdown or ZIP files manually.
- Browse, search, reorganize, and edit Markdown sections in the docs app.
- Render Figma previews when a personal access token is configured.
- Optionally generate prose with Anthropic during import or regeneration.
- Store specs in any local folder through `DS_CONTENT_DIR`.

There is no enforced approval workflow. The optional `status` frontmatter field is a label only.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- Figma desktop for local plugin development

## Quick Start

```bash
npm ci
cp apps/web/.env.example apps/web/.env.local
npm run dev -w md-ds
```

Open [http://localhost:3000](http://localhost:3000). The development server binds to `127.0.0.1` by default.

The bundled example content works without credentials. To use your own Markdown folder, set `DS_CONTENT_DIR` in `apps/web/.env.local` and restart the server.

## Figma Plugin

Build the plugin:

```bash
npm run build:plugin
```

In Figma desktop, choose **Plugins → Development → Import plugin from manifest**, then select `packages/plugin/manifest.json`.

To use **Send to docs**:

1. Generate a token, for example with `openssl rand -hex 32`.
2. Set the value as `SPEC_LAYER_TOKEN` in `apps/web/.env.local`.
3. Enter the same value in the plugin's **Local API token** field.
4. Keep the endpoint at `http://localhost:3000` unless you also update the plugin manifest and server allowlists.

The token protects cross-origin clients such as the Figma plugin. Same-origin browser requests on an allowed local host do not require it.

## Configuration

| Variable | Purpose |
|---|---|
| `DS_CONTENT_DIR` | Folder containing component Markdown files. Defaults to `apps/web/content/components`. |
| `SPEC_LAYER_TOKEN` | Bearer token required for allowed cross-origin API requests. |
| `SPEC_LAYER_ALLOWED_HOSTS` | Additional comma-separated `Host` values, including ports when present. |
| `SPEC_LAYER_ALLOWED_ORIGINS` | Additional comma-separated cross-origin origins. `Origin: null` is reserved for token-authenticated local clients such as Figma. |
| `FIGMA_TOKEN` | Optional Figma personal access token for preview images. |
| `ANTHROPIC_API_KEY` | Optional Anthropic key for prose generation. |

Figma and Anthropic credentials can also be stored through the app's Settings page. They are written to `.ds-config.json` with owner-only permissions where the platform supports them. Environment variables are preferable for shared or automated environments.

## Commands

```bash
npm run dev -w md-ds  # local docs app
npm run lint           # ESLint
npm run typecheck      # all TypeScript workspaces
npm test               # Vitest suite
npm run build          # production web build
npm run build:plugin   # Figma plugin bundle
npm run check          # complete local verification
```

## Repository Layout

```text
apps/web/              Next.js authoring and documentation app
packages/format/       frontmatter schema and Markdown serialization
packages/extractor/    pure Figma-tree extraction and rendering
packages/plugin/       Figma plugin and bulk export UI
spec/                  format definition and reference examples
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for data flow and trust boundaries, and [spec/SPEC.md](spec/SPEC.md) for the Markdown contract.

## Content Safety

Generated imports are runtime data and are ignored under `apps/web/content/components/_inbox/`. Do not commit API keys, private Figma URLs, customer data, proprietary component exports, `.ds-config.json`, `.spec-cache`, or `.spec-data` sidecars.

ZIP and upload endpoints enforce compressed, expanded, per-file, and entry-count limits. API host and origin checks are defense-in-depth for local use, not a substitute for authentication, authorization, and isolation in a public deployment.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before opening a change. Bug reports and fixtures must use synthetic or explicitly publishable data.

## License

MIT. See [LICENSE](LICENSE).
