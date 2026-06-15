# Spec Layer v0.1.0

## Highlights

- Turn Figma components into structured, version-controlled Markdown specs.
- Review imports in a local inbox, fill supported guideline sections with AI, and save components individually or in bulk.
- Export one component as Markdown or all components as a ZIP from the Figma plugin.
- Run the complete workflow locally with explicit host, origin, token, upload, and ZIP safeguards.

## Getting Started

Requires Node.js 20.9 or newer and npm 10 or newer.

```bash
npm ci
cp apps/web/.env.example apps/web/.env.local
npm run dev -w md-ds
```

Open `http://localhost:3000`. Build the Figma plugin with `npm run build:plugin`, then import `packages/plugin/manifest.json` in Figma Desktop.

## Security Model

Spec Layer is a trusted localhost tool. Do not expose the web app as a public or multi-user service. The plugin's **Send to docs** posts from an opaque origin and needs no token; keep credentials and private design-system data out of Git.

## Verification

The release candidate must pass:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run build:plugin
npm audit --omit=dev
git diff --check
```

## Known Limitations

- Workspace packages are not published to npm.
- The application has no accounts, tenant isolation, or public-hosting security model.
- GitHub synchronization, drift detection, and the MCP server are roadmap work.

## Full Changelog

See [CHANGELOG.md](https://github.com/SamsonHD/spec-layer/blob/main/CHANGELOG.md).
