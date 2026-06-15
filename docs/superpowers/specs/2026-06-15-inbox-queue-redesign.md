# Inbox Queue Redesign

## Goal

Turn the Inbox from a dense import summary into a practical review queue. Users must be able to scan, search, filter, open, save, enrich, and delete imported component specs before filing them into the documentation library.

## Layout

- Keep the page title and short explanation at the top, but allow the Inbox content to use a wider reading area than documentation prose.
- Place bulk workflow controls in a compact action panel: one shared destination folder, AI guideline fill, Save All, and Clear All.
- Do not render metric cards for imported, issue, or missing-section counts.
- Place imported files in a separate list panel beneath the bulk workflow controls.
- Keep manual import collapsed beneath the queue.

## Component List

- Render one full-width row per imported component rather than a multi-column text dump.
- Each row shows the component name, source path, and a health status.
- `Ready` means the file has no parser issues and no missing required sections.
- `Needs attention` means the file has parser issues or missing required sections; the row states the relevant counts.
- Provide text search across component names and slugs.
- Always show the complete queue by default; do not provide status filter tabs.
- Show an empty result state when filters match no files.
- Provide `Open`, `Save`, and `Delete` controls on every row.

## Opening Inbox Files

- `Open` navigates to the existing component page at `/components/_inbox/<file-slug>`.
- The existing component renderer remains the single implementation for previews, guidelines, specs, metadata, and editing.
- Inbox component pages show an `Inbox` breadcrumb that links back to `/inbox`.

## Saving Inbox Files

- The destination folder is selected once in the bulk action panel and shared by Save All and every row-level Save action.
- Row-level Save uses the existing single-item move endpoint and preserves the imported filename slug.
- Save All continues to use the existing best-effort bulk move endpoint.

## Data Boundaries

- Extend `InboxSummaryItem` with issue and missing-section counts. Keep bulk action consumers compatible with the richer item shape.
- Keep filtering as a pure helper so status and search behavior are directly unit tested.
- Keep deletion in the existing clear endpoint and client request helper.

## Responsive Behavior

- On narrow screens, bulk controls stack vertically.
- List rows collapse from metadata/actions columns into a vertical card-like row while preserving open and delete actions.
- Search and filters wrap without horizontal overflow.

## Verification

- Unit-test summary metadata and sorting.
- Unit-test search and status filtering.
- Render-test open links, statuses, controls, and empty results.
- Run the web typecheck, focused tests, lint, and production build.
- Inspect the Inbox and an opened Inbox file in the local browser.
