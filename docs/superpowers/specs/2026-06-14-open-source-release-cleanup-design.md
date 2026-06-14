# Open Source Release Cleanup Design

## Goal

Prepare Spec Layer for a credible open-source release by removing private/generated project data, hardening the localhost web application's trust boundary, modernizing its supported toolchain, making automated quality gates reproducible, and rewriting public documentation to describe the software that actually exists.

## Release Boundary

Spec Layer remains a local-first tool. The Next.js app reads and writes a user-selected content directory and may store local API credentials, so it is not a public multi-user service. The release documentation must state this directly.

The application will bind to loopback by default and reject requests whose `Host` header is not loopback or explicitly configured. Same-origin browser requests from the docs UI are trusted. Cross-origin clients, including the Figma plugin's opaque `Origin: null`, must present a local bearer token. The token may be configured explicitly or generated and stored locally. CORS headers are not treated as authorization.

Read-only routes that expose local content or use private Figma credentials will use the same local authorization policy where browser access is involved. This prevents a hostile page from using a reachable development server as a filesystem or credential-backed proxy.

## Security Changes

Create a focused local-access module that owns:

- exact host and origin validation for `localhost`, `127.0.0.1`, and explicitly configured hosts/origins;
- acceptance of same-origin docs UI requests without exposing the local secret to browser JavaScript;
- rejection of cross-origin requests, including generic `Origin: null`, unless they present the local bearer token;
- bearer-token validation using constant-time comparison;
- consistent CORS and JSON error responses;
- documented plugin configuration for sending the token with imports.

All file-writing, settings, navigation, import, regeneration, and Figma-link mutation routes will use this policy. Request bodies will have explicit byte limits. ZIP processing will reject oversized compressed bodies before decompression and use bounded asynchronous extraction so expanded data is limited during processing, not afterward.

API credentials stored in `.ds-config.json` will be written atomically with owner-only permissions where the platform supports them. Figma URLs will require HTTPS and an exact `figma.com` or `www.figma.com` hostname.

## Dependency And Tooling Changes

Upgrade the web app to the current stable Next.js 16 and React 19 release line supported by the installed Node requirement. Apply required App Router and configuration migrations. Replace the obsolete interactive `next lint` command with a checked-in ESLint configuration and non-interactive scripts.

The root workspace will expose reproducible `build`, `lint`, `test`, `typecheck`, and aggregate `check` commands. GitHub Actions will run clean installation, linting, type checking, tests, application build, plugin build, and production dependency audit.

Workspace packages are implementation modules, not published npm products in this release. Mark them private and document that decision. A later release may add compiled package outputs, export maps, provenance, and independent publishing.

## Repository Data Cleanup

Delete all generated files under `apps/web/content/components/_inbox/` and any generated sidecars. Keep only `.gitkeep` plus a small set of clearly synthetic example documentation outside the inbox. No history rewrite is included; prior commits remain unchanged.

Ignore local caches, generated sidecars, inbox contents, build output, editor files, local settings, and environment files. Remove tracked editor-specific local configuration that is not useful to contributors.

## Product Behavior And Documentation

The canonical workflow is:

1. Extract a selected component or export all components from the Figma plugin.
2. Download Markdown/ZIP locally, or send one extraction to the authenticated localhost docs app.
3. Review and edit the imported draft in the inbox.
4. File it into the documentation navigation.
5. Version the resulting Markdown in the user's own repository.

There is no implemented approval endpoint or enforced approval state transition. Documentation and the format specification will remove claims that such a workflow exists. `status` remains optional metadata. AI prose enrichment remains opt-in and runs only when requested with an Anthropic key configured.

Rewrite the root README as the contributor and user entry point. It will include current capabilities, security model, prerequisites, installation, plugin setup, web-app setup, local authentication, environment variables, common commands, repository structure, testing, limitations, roadmap, and links to governance documents.

Rewrite `ARCHITECTURE.md`, reconcile contradictions in `spec/SPEC.md`, refresh `apps/web/README.md`, `.env.example`, and plugin manual testing instructions.

## Open Source Governance

Add:

- `CONTRIBUTING.md` with setup, quality gates, pull-request expectations, and generated-data rules;
- `SECURITY.md` with supported versions, private reporting guidance, and the localhost-only threat model;
- `CODE_OF_CONDUCT.md` using Contributor Covenant language;
- GitHub issue templates and a pull-request template;
- Dependabot configuration for npm and GitHub Actions.

The existing MIT license remains unchanged.

## Accessibility Changes

Address the most material keyboard and dialog issues in the current UI:

- tabs receive stable IDs, `aria-controls`, `aria-labelledby`, roving focus, and arrow-key navigation;
- modal dialogs trap focus, restore focus to their trigger, and expose labelled headings;
- command-palette results use proper listbox/option semantics and keyboard activation;
- drag-only navigation retains its pointer workflow but gains explicit move controls or an equivalent keyboard-accessible operation;
- removed focus outlines are replaced with visible `:focus-visible` styles;
- reduced-motion preferences disable nonessential transitions.

These changes preserve the current visual design rather than introducing a redesign.

## Testing Strategy

Behavior changes follow test-first development. Add focused unit tests for origin and token authorization, request-size accounting, bounded ZIP extraction, secure settings writes, strict Figma URL parsing, and any extracted accessibility helpers.

Add route-level tests for representative protected read and write endpoints. Existing extraction, rendering, plugin, navigation, upload, and editing tests remain regression coverage.

The release gate is:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run build:plugin
npm audit --omit=dev
```

Manual verification covers Figma plugin import/export and keyboard use of tabs, dialogs, command palette, and navigation controls.

## Non-Goals

- Rewriting Git history.
- Deploying a hosted multi-user service.
- Publishing workspace packages to npm.
- Adding accounts, databases, billing, or cloud synchronization.
- Redesigning the product UI.
- Implementing a formal approval workflow in this cleanup.
