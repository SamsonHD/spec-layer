# Design System Docs

A lightweight, markdown-driven design system documentation app. Point it at a
folder of component specs and it renders a structured, navigable docs site —
linking out to Figma and Storybook, and pulling live Figma preview images.

> Stage 1 of a longer roadmap (see _Roadmap_ below). Built to stay local and
> lightweight today, without blocking multi-design-system, sharing, or
> multi-tenant stages later.

## How it works

- **Content lives in `content/components/`** as `.md` files. The **folder
  structure becomes the navigation** — `content/components/forms/button.md`
  shows up under a "Forms" group as "Button".
- Each file has **frontmatter** + a body of **canonical sections**.
- The app reads the repo **live on each request**, so editing or adding a file
  shows up on refresh — no rebuild.

### Frontmatter

```yaml
---
name: Button # required
status: stable # draft | beta | stable | deprecated
version: 2.1.0 # optional
figma: https://www.figma.com/design/<key>/...?node-id=120-45 # optional
storybook: https://storybook.example.com/?path=/docs/... # optional
tags: [action, form] # optional — used by search
---
```

### Sections (template with variability)

Authored as `## Headings`. **Required** sections (a warning shows if missing):

- **Definition** (or Overview / Description)
- **Properties** (or Configuration / Props / API)
- **Accessibility** (or A11y)

**Optional**: Anatomy, Variants, States, Do's & Don'ts, Related components — plus
any custom section you add (rendered as-is).

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

### Pointing it at your own docs folder

By default the app reads the bundled `content/components/`. To use your real
design system specs, set `DS_CONTENT_DIR` (in `.env.local` or your shell) to the
folder that holds the `.md` files:

```bash
# .env.local
DS_CONTENT_DIR=~/work/my-design-system/components
```

Absolute, `~`-prefixed, or relative-to-project paths all work. The folder
structure inside it becomes the navigation. Restart `npm run dev` after changing
it. (A web app can't pop a native "choose folder" dialog for a server reading
the disk — config is the right mechanism here.)

Optional — live Figma previews:

```bash
cp .env.example .env.local
# add your FIGMA_TOKEN
```

Without a token the app works fully; the preview hero just shows a hint.

## Architecture

- **Next.js (App Router, TypeScript)** — one process for the UI and the API.
- `src/lib/content.ts` — reads/parses the repo, builds the nav tree, detects
  sections, computes "last updated" from git (falls back to file mtime).
- `src/lib/figma.ts` — resolves a Figma URL to a preview image via the Figma API.
- `src/app/api/figma-preview` — token-protected, cached image proxy.
- `src/app/api/search` — searches names, tags, paths, and body.

## Security note

This app is a **localhost development tool**, not a deployable service. In
particular, `/api/fs/list` and `/api/config` intentionally allow browsing the
local filesystem and setting arbitrary local paths — that's what powers the
content-folder picker. Do not deploy this app publicly as-is; those endpoints
(and the file-writing spec APIs) would expose the host machine.

## Roadmap

1. **Core renderer** (this) — local, single design system.
2. **Multi design system** — one instance hosts several isolated systems.
3. **Sharing** — deploy as a read-only site for clients/stakeholders.
4. **Multi-tenant product** — accounts, isolation, billing.
