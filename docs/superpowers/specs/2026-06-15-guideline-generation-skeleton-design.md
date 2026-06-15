# Guideline Generation Skeleton Design

## Goal

Show clear, section-local progress while AI prose is being generated for a
component guideline. The loading state must preserve enough context for users
to understand which section is changing and must not cause unrelated guideline
content to move or disappear.

## Scope

This change applies to the per-section **Fill with AI** and **Regenerate**
actions in `EditableSection`. Bulk inbox enrichment is outside this change
because it does not render the component guideline prose inline.

## Interaction Design

When a user starts AI generation for a guideline section:

1. Keep the section container and heading visible.
2. Replace only the rendered prose body with `SectionSkeleton`.
3. Label the skeleton `Generating <section name> with AI…` so assistive
   technology announces the pending operation.
4. Disable all controls for that section until the request settles.
5. Keep other guideline sections unchanged and interactive.

The skeleton must use the existing three-line default. Its visual treatment
must fit the current prose area without introducing a separate card or changing
the section's surrounding layout.

## State Flow

`EditableSection` continues to own the request state through its existing
`busy` and `error` values.

- **Idle:** Render the current Markdown prose and enabled section controls.
- **Pending AI generation:** Render the heading plus `SectionSkeleton` instead
  of the prose. Disable edit, AI, reorder, and delete controls.
- **Success:** Refresh the route so the generated Markdown replaces the
  skeleton. The pending state remains visible until the refreshed server
  content arrives.
- **Failure:** Remove the skeleton, restore the unchanged original prose, and
  render the existing inline error message.

Other section operations may continue using their current busy presentation;
the skeleton is specific to AI generation so saving, deleting, and reordering
are not misrepresented as prose generation.

## Component Changes

### `EditableSection`

Track whether the active busy operation is AI generation rather than using the
generic `busy` flag alone. During that operation, render `SectionSkeleton` in
the non-editing prose area and pass the section-specific accessible label.

All toolbar controls must use the shared busy state for disabling. This closes
the current gap where the Edit control remains active during requests.

### `SectionSkeleton`

Reuse the existing component and its accessible `role="status"` and
`aria-busy="true"` semantics. No new skeleton variant is required.

### Styles

Add the missing skeleton styles to `globals.css`: a vertically spaced prose
placeholder and a subtle animated gradient for each line. Respect
`prefers-reduced-motion` by disabling the animation while retaining the static
placeholder.

## Error Handling

The request continues to use the existing API error parsing. A failed request
must never clear or alter the section's current prose. The error remains an
inline `role="alert"` after the original Markdown content.

## Testing

Add focused `EditableSection` tests that verify:

- starting **Fill with AI** replaces the prose body with the section-labeled
  skeleton;
- all section controls are disabled while generation is pending;
- a successful response calls `router.refresh()` and keeps the skeleton visible
  while that refresh is pending;
- a failed response restores the original prose and shows the API error;
- non-AI operations do not display the generation skeleton.

Keep the existing `SectionSkeleton` tests for its line count and accessibility
contract. Run the focused component tests, then the web test suite and lint or
type-check command provided by the repository.
