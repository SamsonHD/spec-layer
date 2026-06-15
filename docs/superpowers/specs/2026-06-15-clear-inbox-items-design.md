# Clear Inbox Items Design

## Problem

The web Inbox lets users save imported components into a docs folder, individually or all at once, but offers no way to discard imports they do not want to keep. Stray, duplicate, or junk exports therefore accumulate in `_inbox` with no in-product way to remove them.

## User Experience

- Provide a `Clear all` action in the import-summary header, beside `Save all`, that permanently deletes every pending Inbox component.
- `Clear all` asks for confirmation first (`Permanently delete all N components?`). Cancelling makes no request and changes nothing.
- Provide a per-item `Delete` control in the `View component names` list. Individual deletes are one-click with no confirmation; they are recoverable via git.
- Style clearing actions as destructive/secondary, not as the primary action.
- After any successful deletion, refresh the Inbox so the summary reflects only the remaining entries; an empty Inbox shows the existing empty state.
- After a partial failure, surface a concise list of the components that could not be deleted, matching how `Save all` reports failures.

Deletion is permanent: it removes files from disk. There is no archive or undo within the app.

## Clear Behavior

Add a bulk delete that accepts the pending Inbox entries (an array of source slugs). The server revalidates each slug, confirms it belongs directly to `_inbox`, and deletes its Markdown file together with its optional `.spec-data` sidecar.

The operation is best-effort rather than transactional, mirroring `Save all`. A failure for one component must not prevent unrelated components from being deleted. The response reports successfully deleted source slugs and failures with their source slug and reason.

Both scopes use this one endpoint: individual delete sends a one-item array; `Clear all` sends every item. Unlike saving — which needs a per-item target folder and rename, and therefore has separate single (`move`) and bulk (`move-all`) routes — deleting takes no parameters beyond the slug, so a separate single-item route would be pure duplication.

## Components and Boundaries

- A filesystem helper `clearInboxSpecs(items)` lives alongside the existing move helpers in `inboxMove.ts`, reusing its private guards (`requireInboxSlug`, `getSidecarPath`, `assertNoSymbolicLinks`). It returns `{ deleted: string[][], failures: Array<{ source: string[]; error: string }> }`, matching the shape of `saveAllInboxSpecs`.
- A `POST /api/specs/clear` route mirrors `move-all/route.ts`: same-origin and JSON-mutation validation, `corsHeaders`, and `InboxMoveError` status mapping. It accepts `{ items: string[][] }`.
- A client `InboxClearAll` button owns the confirm gate, loading state, request, and error summary; it renders in the summary header next to `InboxSaveAll`.
- A client `InboxComponentList` replaces the server-rendered name list, rendering each component name with a one-click `Delete` button, loading state, and error summary.
- A shared client helper `clearInboxItems(slugs)` owns the fetch and response parsing so `InboxClearAll` and `InboxComponentList` do not duplicate request logic.

The endpoint receives explicit source slugs from the rendered Inbox and revalidates each before deleting.

## Error Handling

- Reuse the move path's guards: source slugs outside `_inbox`, path-traversal characters, and symlinked paths are rejected.
- A missing Markdown file becomes a per-item failure; the bulk operation continues with the remaining entries.
- Sidecar deletion is best-effort after the Markdown is removed; a leftover sidecar is harmless and recoverable via git.
- Return a request-level error for malformed JSON or a non-array `items` body.
- Disable clearing controls while a request is running to prevent duplicate submissions.
- Refresh the page after any successful deletion so the summary reflects only remaining entries.
- Display failed component names when some entries could not be deleted.

## Testing

- Unit-test `clearInboxSpecs`: deletes Markdown with and without a sidecar, records a missing Markdown file as a failure, rejects source slugs outside `_inbox`, rejects symlinked paths, and aggregates mixed (partial) results.
- Route test mirroring `move-all/route.test.ts`: malformed body, same-origin rejection, full success, and partial failure.
- Component tests mirroring `InboxSaveAll.test.tsx`: the `Clear all` confirm gate (both confirmed and cancelled paths), per-item delete, busy state, and partial-failure message rendering.

## Success Criteria

- Users can permanently delete a single pending component in one click.
- Users can permanently delete all pending components after one confirmation.
- Deleting removes the component's Markdown file and its `.spec-data` sidecar.
- A failure for one component leaves unrelated components deletable and reports the reason.
- After deletion the Inbox summary reflects only the remaining entries, and an emptied Inbox shows its empty state.
- Source slugs outside `_inbox` and unsafe paths are rejected.
