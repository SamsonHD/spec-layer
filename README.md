# Spec Layer

> **The approved contract between design and code: your design system as text — reviewed by humans, executed by AI, never out of sync.**

A Figma plugin extracts components into structured Markdown specs, a human reviews and approves each one, and the result is version-controlled text that AI tools can trust without guesswork.

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
Extract → Review → Approve → Export
```

The plugin walks your selected component, extracts a draft spec, lets you edit it, and exports an approved `.md` file to commit to your repo.

**Optional — AI prose drafts:** open the plugin's Settings panel and paste an Anthropic API key. It's saved in Figma's local storage (`figma.clientStorage`) — no env var or rebuild needed. Without a key you still get a complete structural spec; the written sections (Definition, Code, Accessibility, Do's & Don'ts) come as stubs for you to fill in.

For the full manual walkthrough, see [`packages/plugin/TESTING.md`](packages/plugin/TESTING.md).

### Develop

```bash
npm test          # run all tests (Vitest)
npm run typecheck # type-check every package
```

---

## Project architecture

Spec Layer is an npm-workspaces monorepo with three packages that form a clean dependency chain:

```
@spec-layer/format          YAML frontmatter: parse / serialize / validate
       ▲
@spec-layer/extractor       Pure pipeline: serialized node → IntermediateSpec → Markdown
       ▲                    (+ optional Anthropic prose layer)
@spec-layer/plugin          Figma plugin: serialize, review, approve, export
```

```
spec/
  SPEC.md          Open format definition (v0.1, MIT)
  examples/        Reference specs: button, text-field, dialog

packages/
  format/          Parse, serialize, and validate the Markdown frontmatter
  extractor/       serialized Figma node tree → IntermediateSpec → spec Markdown
  plugin/          Figma plugin — manifest, main thread, serializer, review UI
```

The pipeline in one line: **Extract → Approve → Store → Serve**. The plugin handles all Figma I/O, the extractor is pure (testable from JSON fixtures), and format owns the Markdown envelope.

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
| **1 — Extractor + Plugin** | Node-tree pipeline, LLM prose layer, Figma plugin | Done |
| **2 — Sync + Drift** | GitHub push from plugin, drift detection | Roadmap |
| **3 — MCP Server** | `get_spec` / `search_components` / `list_tokens` | Roadmap |

---

## License

MIT — see [LICENSE](LICENSE). The format definition, reference examples, and all packages are free to use, fork, and implement.
