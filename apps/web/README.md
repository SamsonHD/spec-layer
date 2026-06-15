# Spec Layer Web App

This workspace contains the local Markdown documentation app. It renders a content folder, accepts imports from the Figma plugin or local files, and provides inbox review, AI guideline filling, editing, navigation, search, settings, and Figma previews.

Run commands from the repository root:

```bash
npm ci
cp apps/web/.env.example apps/web/.env.local
npm run dev -w md-ds
```

Open `http://localhost:3000`. The server binds to `127.0.0.1` by default.

## Content

Set `DS_CONTENT_DIR` to the directory containing Markdown pages. If unset, the app uses `apps/web/content/components`.

Each file needs a `name` in YAML frontmatter. Other fields, including `status`, `figma`, `storybook`, and `tags`, are optional for hand-authored pages. Extracted Spec Layer files use the fuller schema in `../../spec/SPEC.md`.

Folder structure becomes sidebar navigation. The app reads files directly and writes edits back to the same directory.

Imported components land in `_inbox/`. From the inbox, reviewers can fill empty Definition, Accessibility, and Do's & Don'ts sections with AI, save one or all components to a destination folder, delete individual drafts, or clear the inbox. AI fill requires an Anthropic key and leaves non-placeholder human content unchanged unless a reviewer explicitly regenerates one section.

## Security Model

This is a trusted local tool, not a public service. File and settings APIs accept same-origin requests on allowed local hosts. Cross-origin clients must be explicitly allowed and send `Authorization: Bearer <SPEC_LAYER_TOKEN>`. Mutating JSON routes validate content type and declared body size before processing.

The Figma plugin uses an opaque origin, so set `SPEC_LAYER_TOKEN` here and enter the same token in the plugin UI. See the root README for all variables and deployment limitations.

## Optional Services

`FIGMA_TOKEN` enables preview images. `ANTHROPIC_API_KEY` enables optional prose generation. Both can also be configured in Settings and are persisted to the ignored `.ds-config.json` file.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
