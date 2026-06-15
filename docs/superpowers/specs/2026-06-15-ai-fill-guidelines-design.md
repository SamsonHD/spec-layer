# AI-fill guideline sections — design

Date: 2026-06-15

## Problem

Imported component specs land with guideline sections left as `_To be written._`
(Definition, Accessibility, Do's & Don'ts). We have Anthropic keys configured on
the docs platform. We want to let users fill those empty prose blocks with Haiku,
giving the model both the structured spec **and the component's Figma visual** as
context.

## Decisions (from brainstorming)

- **Fill scope:** Fill empty blocks by default; expose an explicit per-block
  "regenerate" for an intentional fresh pass. Never silently clobber human edits.
- **Inbox entry point:** one "Fill all with AI" button over the import summary.
- **Detail-page entry point:** per-block button on each guideline section.
- **Review model:** write directly into the `.md`; git/undo is the safety net.
- **Visual:** always attach the Figma PNG when resolvable; **text-only fallback**
  when no visual is available (manual spec, `unknown` file key, token/API failure).
- **Out of scope:** the `Code` section — import paths / prop mappings would be
  hallucinated; that belongs to Code Connect / humans. AI fill targets
  **Definition, Accessibility, Do's & Don'ts** only.

## Architecture

Reuse the existing, tested prose pipeline; add a vision option and a
section-merge layer that `/regenerate` lacks (it re-renders the whole file).

### 1. Vision-capable `draftProse` (`packages/extractor/src/prose/client.ts`)

Add optional `imageUrl` to `DraftOptions`. When present, the user message is a
multimodal content array `[{type:"image", source:{type:"url", url}}, {type:"text", text}]`;
otherwise the existing plain-string message is sent unchanged. Cache key gets an
`:img` suffix when an image is included, so a text-only result is never served
for a vision request (and vice versa). Keying stays on `contentHash(spec)` — not
the (hourly-rotating) signed image URL — because the rendered component is stable
per content hash. Model stays `claude-haiku-4-5` (multimodal).

### 2. Guideline merge (`apps/web/src/lib/guidelineFill.ts`, pure)

- `FILLABLE_GUIDELINES`: the three headings, each mapped to how its content is
  produced from `ProseDrafts` (definition → paragraph, accessibility → paragraph,
  Do's & Don'ts → `- ✅ …` / `- ❌ …` lines).
- `isEmptyGuideline(content)`: trimmed content is a `_…_` placeholder.
- `fillGuidelines(body, prose, { target })`:
  - `target: "empty"` → fill only placeholder guideline sections.
  - `target: "<heading>"` → replace exactly that guideline section (regen).
  - Returns `{ body, filled: string[] }`. Uses `splitSections`/`replaceSection`.

### 3. File wrapper (`apps/web/src/lib/guidelineFillFile.ts`)

`enrichSpecFile(slug, { target })`:
1. Resolve path; read file; split frontmatter/body (frontmatter kept verbatim).
2. `readStoredSpec(slug)` → if absent, throw (needs structured extraction; manual
   uploads without a `.spec-data` sidecar can't be enriched — surfaced as a clear
   per-item error).
3. Resolve image: `previewFromRef({ fileKey: spec.figmaFile, nodeId: spec.figmaNode })`;
   use `imageUrl` only when `status === "ok"`, else text-only.
4. `draftProse(spec, { apiKey, fetcher, cacheStore, imageUrl })`.
5. `fillGuidelines(body, prose, { target })`; write back if anything filled.
6. Return `{ filled, usedVisual }`.

### 4. Endpoints

- `POST /api/specs/enrich` — `{ slug, target? }` (target defaults to `"empty"`).
  Returns `{ ok, filled, usedVisual, warning? }`. 409 when no key / no stored spec.
- `POST /api/specs/enrich-all` — `{ items: string[][] }`. Loops inbox slugs,
  mirrors `/move-all`'s `{ ok, enriched, failures }` bulk shape so partial
  failures (e.g. manual specs) don't abort the batch.

### 5. UI

- `EditableSection`: for the three guideline headings only, add a toolbar button —
  "Fill with AI" when the section is empty, "Regenerate with AI" otherwise —
  calling `/api/specs/enrich` with `target: section.heading`, then `router.refresh()`.
- Inbox: "Fill all with AI" button beside "Save all", calling `/api/specs/enrich-all`
  over the summary items; shows per-component failures like the save flow.

## Testing

TDD on the pure/IO units:
- `guidelineFill.test.ts`: empty detection, fill-empty preserves edited sections,
  targeted regen replaces one section, dos/donts rendering, non-guideline headings
  untouched.
- `client` vision: fake fetcher asserts multimodal body when `imageUrl` present,
  plain string when absent, and the `:img` cache-key split.
- `guidelineFillFile.test.ts`: missing stored spec throws; text-only fallback when
  image unresolved; frontmatter preserved byte-for-byte.

Routes/React wired following existing thin-route + component patterns.
