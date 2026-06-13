# Spec Layer

> **The approved contract between design and code: your design system as text — reviewed by humans, executed by AI, never out of sync.**

A Figma plugin extracts components into structured intermediate specs, a local docs web app renders and stores them as Markdown, a human reviews and approves each one there, and the result is version-controlled text that AI tools can trust without guesswork.

| | What you get |
|---|---|
| **Raw feed** (Figma's MCP / REST API) | Unreviewed JSON: node trees, raw fills, layout data — no approval, no lifecycle, no code mapping |
| **Reviewed contract** (Spec Layer) | Human-approved Markdown spec: anatomy, props, tokens, code mapping, usage rules, status |

---

## How to use

**Prerequisites:** Node 20+ and the Figma desktop app.

```bash
# 1. Install dependencies
npm install

# 2. Build the plugin
node packages/plugin/build.mjs
```

Then load it into Figma:

1. **Plugins → Development → Import plugin from manifest**
2. Select `packages/plugin/manifest.json`
3. Select any component on the canvas and open the plugin

Run through the flow:

```
Extract → review the structural draft → Send to docs (or Download .md)
```

The plugin walks your selected component, extracts a structural draft spec, and lets you review it. **Send to docs** POSTs the extraction to the docs web app (`/api/specs/import`), where AI prose is drafted server-side and the spec lands in the inbox for filing and approval. **Download .md** saves the structural draft directly instead.

**AI prose drafts** happen in the docs app, not the plugin: set the `ANTHROPIC_API_KEY` env var for `apps/web` (e.g. in `apps/web/.env.local`). Without a key, imports still produce a complete structural spec; the written sections (Definition, Code, Accessibility, Do's & Don'ts) come as stubs for the reviewer to fill in. The plugin's Settings panel holds only the docs endpoint URL (default `http://localhost:3000`) and an optional Figma file-key override (paste a Figma file URL or key — useful for dev plugins where `figma.fileKey` is unavailable).

For the full manual walkthrough, see [`packages/plugin/TESTING.md`](packages/plugin/TESTING.md).

### Run the docs app

```bash
cd apps/web && npm run dev     # or: npm run dev -w md-ds
```

The docs site serves at http://localhost:3000 — imported specs appear under **Inbox**, where you file, regenerate, and approve them. Point it at your own content folder with the in-app folder picker or `DS_CONTENT_DIR`.

### Develop

```bash
npm test          # run all tests (Vitest)
npm run typecheck # type-check every package + apps/web
```

---

## Project architecture

Spec Layer is an npm-workspaces monorepo: three packages forming a clean dependency chain, plus the docs web app that consumes them.

```
@spec-layer/format          YAML frontmatter: parse / serialize / validate + approveSpec
       ▲
@spec-layer/extractor       Pure pipeline: serialized node → IntermediateSpec → Markdown
       ▲                    (+ Anthropic prose layer, invoked server-side by apps/web)
@spec-layer/plugin          Figma plugin: serialize, extract, send to docs / download

apps/web (md-ds)            Next.js docs app: import API, AI prose, inbox, approve, serve
```

```
spec/
  SPEC.md          Open format definition (v0.1, MIT)
  examples/        Reference specs: button, text-field, dialog

packages/
  format/          Parse, serialize, validate the frontmatter; approveSpec
  extractor/       serialized Figma node tree → IntermediateSpec → spec Markdown
  plugin/          Figma plugin — manifest, main thread, serializer, review UI

apps/
  web/             Next.js 14 docs app — content store, /api/specs/*, review UI
```

The pipeline in one line: **Extract → Approve → Store → Serve**. The plugin handles all Figma I/O, the extractor is pure (testable from JSON fixtures), format owns the Markdown envelope and approval, and the web app stores, enriches, and serves the specs.

For the full breakdown — data flow, message protocol, design decisions, and diagrams — see [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## The format

Each component is one `.md` file: a YAML frontmatter block (identity, status, code mapping) plus ten canonical sections (Definition, Anatomy, Configuration, Variants, States, Tokens used, Code, Accessibility, Do's & Don'ts, Related atoms).

- Full definition: [`spec/SPEC.md`](spec/SPEC.md)
- Examples: [`spec/examples/button.md`](spec/examples/button.md), [`spec/examples/text-field.md`](spec/examples/text-field.md), [`spec/examples/dialog.md`](spec/examples/dialog.md)

---

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| **0 — Format** | Open spec definition, YAML frontmatter, 10-section body | Done |
| **1 — Extractor + Plugin** | Node-tree pipeline, conditional token rules, thin Figma plugin | Done |
| **1.5 — Docs app (Store/Serve, local)** | Next.js docs site, import/inbox flow, server-side AI prose, approve/regenerate API | Done |
| **2 — Sync + Drift** | GitHub sync of the content folder, drift detection via `content_hash` | Roadmap |
| **3 — MCP Server** | `get_spec` / `search_components` / `list_tokens` | Roadmap |

---

## License

MIT — see [LICENSE](LICENSE). The format definition, reference examples, and all packages are free to use, fork, and implement.
