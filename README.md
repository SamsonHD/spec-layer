# Spec Layer

> **The approved contract between design and code: your design system as text — reviewed by humans, executed by AI, never out of sync.**

AI agents that consume raw, unreviewed design data hallucinate API shapes, invent prop names, and drift from what was actually shipped. Hand-written component docs age the moment a designer changes a variant. Spec Layer solves both problems: a Figma plugin extracts components into structured Markdown specs, a human reviews and approves each one, and the result is version-controlled text that AI tools can trust without guesswork.

> _Demo GIF coming soon._

---

## The positioning

| | What you get |
|---|---|
| **Raw feed** (Figma's MCP / REST API) | Unreviewed JSON: node trees, raw fills, layout data — no approval, no lifecycle, no code mapping |
| **Reviewed contract** (Spec Layer) | Human-approved Markdown spec: anatomy, props, tokens, code mapping, usage rules, status |

---

## How it works

```
Extract → Approve → Store → Serve
```

1. **Extract** — the Figma plugin walks the selected component, serializes it into an `IntermediateSpec`, and optionally calls an LLM to draft prose sections (usage guidance, accessibility notes).
2. **Approve** — a designer or design-systems engineer reviews the extracted spec in the plugin UI, edits any section, then clicks Approve. Status advances to `approved`.
3. **Store** — the plugin exports the spec as a `.md` file conforming to the open Spec Layer format. You commit it to your repo.
4. **Serve** — AI tools, IDEs, and documentation pipelines read the versioned, approved spec from source control.

**What's built now (Phase 0 + Phase 1):** Extract, Approve, and local export via the plugin.

**Roadmap:**
- Phase 2 — GitHub sync and drift detection (push specs directly from the plugin; flag components that changed since last approval).
- Phase 3 — MCP server (`get_spec`, `search_components`, `list_tokens`), open-source release and hosted endpoint.

---

## The format

The spec format is an open standard — MIT licensed. Each component gets one `.md` file with a YAML frontmatter block (identity, status, code mapping) and ten canonical Markdown sections (Definition, Anatomy, Configuration, Variants, States, Tokens used, Code, Accessibility, Do's & Don'ts, Related atoms).

- Full definition: [`spec/SPEC.md`](spec/SPEC.md)
- Reference examples: [`spec/examples/button.md`](spec/examples/button.md), [`spec/examples/text-field.md`](spec/examples/text-field.md), [`spec/examples/dialog.md`](spec/examples/dialog.md)

---

## Repo layout

```
spec/
  SPEC.md                  Open format definition v0.1
  examples/                Three reference specs (Button, TextField, Dialog)

packages/
  format/                  Parse, serialize, and validate Spec Layer Markdown
  extractor/               Pure pipeline: serialized Figma node tree → IntermediateSpec → spec Markdown
                           Includes the cached LLM prose layer (Anthropic API, optional)
  plugin/                  Figma plugin — manifest, main thread, serializer, review/approve/export UI
```

---

## Try it

**Prerequisites:** Node 20+, a Figma desktop app (for plugin development mode).

```bash
# Install all workspace dependencies
npm install

# Build the plugin bundle
node packages/plugin/build.mjs
```

Then in Figma: **Plugins → Development → Import plugin from manifest** and select `packages/plugin/manifest.json`.

Select any component on the canvas, open the plugin, and run through the Extract → Review → Approve → Export flow.

**Optional — AI prose drafts:** open the plugin's Settings panel and enter your Anthropic API key in the API key field. The key is saved in Figma's local client storage (`figma.clientStorage`) — no environment variable or build step required. Without a key the plugin still produces a complete structural spec; the LLM-drafted judgment sections (Definition, Code, Accessibility, Do's & Don'ts) will contain stub placeholder text for you to fill in.

For the full manual verification walkthrough, see [`packages/plugin/TESTING.md`](packages/plugin/TESTING.md).

---

## Develop

```bash
# Run all tests (45 tests across format, extractor, plugin)
npm test
```

Tests live in `packages/*/test/` and run under Vitest.

---

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| **0 — Format** | Open spec definition, YAML frontmatter, 10-section body, parse/serialize/validate | ✅ Done |
| **1 — Extractor + Plugin** | Node-tree pipeline, LLM prose layer, Figma plugin (extract/review/approve/export) | ✅ Done |
| **2 — Sync + Drift** | GitHub push from plugin, drift detection when component changes post-approval | Roadmap |
| **3 — MCP Server** | `get_spec` / `search_components` / `list_tokens` tools, open-source + hosted endpoint | Roadmap |

---

## License

MIT — see [LICENSE](LICENSE) for details. The format definition, reference examples, and all packages in this repository are free to use, fork, and implement.
