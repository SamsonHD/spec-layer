# Inbox Summary and Save All Design

## Problem

The web Inbox renders every imported component as a full review card with issue details and per-item filing controls. Large Figma exports therefore turn the Inbox into a long review queue, even when the intended workflow is to accept the imported specs together.

## User Experience

- Present Inbox as a compact import summary rather than a full review queue.
- Show the total number of pending components, the number with issues, and the number missing required content.
- Show pending component names in a compact list so users can verify what was imported without reviewing every spec in detail.
- Keep the manual Markdown and ZIP import control collapsed.
- Provide one folder-name field with existing top-level folders as suggestions.
- Initialize the folder field to `Components`. If the submitted value is blank, the server also falls back to `Components`.
- Label the primary bulk action `Save all`.
- After a fully successful save, refresh the Inbox and show its empty state.
- After a partial save, leave failed components in Inbox and show a concise summary of the failures.

Individual group and name controls are removed from Inbox. A saved component can still be reviewed and edited from its component page.

## Bulk Save Behavior

Add a bulk move API that accepts the destination folder and the pending Inbox entries. The server normalizes the folder using the existing slug rules and moves each Markdown file, together with its optional `.spec-data` sidecar, into that folder. Each component keeps its current frontmatter name and filename slug.

The operation is best-effort rather than transactional. A failure for one component must not prevent unrelated components from being saved. The response reports successful destination slugs and failures with their source slug and reason.

Existing destination files or sidecars are not overwritten. Those entries remain in Inbox and are reported as conflicts. Invalid source slugs, unsafe folder names, missing source files, and filesystem errors are also returned as failures.

The server owns the default-folder fallback so direct API callers and the web UI behave consistently.

## Components and Boundaries

- The Inbox server page loads pending docs and derives aggregate counts and the compact name list.
- A client-side bulk-save form owns the folder input, loading state, request, and error summary.
- A shared filesystem helper owns validation and movement of one Inbox spec so single-item and bulk routes use the same collision and sidecar behavior.
- The bulk API orchestrates the helper across all requested entries and returns per-item results.

The bulk endpoint receives explicit source slugs from the rendered Inbox. It revalidates each slug and confirms that it belongs to `_inbox` before moving it.

## Error Handling

- Disable `Save all` while a request is running to prevent duplicate submissions.
- Return a request-level error for malformed JSON or an unsafe destination folder.
- Return item-level errors for conflicts and filesystem failures.
- Refresh the page after any successful moves so the summary reflects only remaining Inbox entries.
- Keep the folder value and display failed component names when some entries could not be saved.

## Testing

- Unit-test folder defaulting and normalization.
- Unit-test moving Markdown with and without a sidecar.
- Unit-test destination conflicts without overwriting existing files.
- Test mixed bulk results where successful entries move and failed entries remain in Inbox.
- Test that source slugs outside `_inbox` are rejected.
- Test Inbox aggregate counts and the empty state.
- Test the client form label, default `Components` value, blank-value fallback, busy state, and partial-failure message.

## Success Criteria

- Inbox no longer renders a full review card and filing form for every pending component.
- Users can see the scope and health of an import at a glance.
- Clicking `Save all` files every non-conflicting pending component into the chosen folder.
- Leaving the folder blank files components into `Components`.
- Existing files are never silently overwritten.
- Failed components remain available in Inbox with understandable reasons.
