---
spec_version: "0.1"
status: approved
component:
  name: Dialog
  figma_key: m3-dialog
  figma_file: M3KIT
  figma_node: 1:300
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Dialog interrupts someone's workflow to convey critical information or require a decision before they can continue. Use a Basic dialog for confirmations, alerts, and short choices that can be resolved with one or two action buttons. Use a Full-screen dialog for complex tasks (e.g. multi-field forms, pickers) that need the full viewport to complete. Dialogs must always be triggered by a user action or a critical system event; never open a dialog without user intent except for session-expiry or destructive-action confirmation.

## Anatomy

1. Scrim
2. Container
3. Icon (component)
4. Headline text
5. Body text
6. Divider (Full-screen only)
7. Actions (component — Button)
8. State layer

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show icon | boolean | true / false | false |
| Show headline | boolean | true / false | true |
| Headline | text | — | Dialog headline |
| Body | text | — | A dialog is a type of modal window that appears in front of app content to provide critical information, or prompt for a decision to be made. |

## Variants

- **Type**: Basic (default) · Full-screen

## States

- Default

## Tokens used

### Color

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | background | `md.sys.color.surface-container-high` |
| Scrim | color | `md.sys.color.scrim` |
| Icon | color | `md.sys.color.secondary` |
| Headline text | color | `md.sys.color.on-surface` |
| Body text | color | `md.sys.color.on-surface-variant` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Headline text | typography | — | `md.sys.typescale.headline-small` |
| Body text | typography | — | `md.sys.typescale.body-medium` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `md.sys.shape.corner.extra-large` |
| Container | elevation | — | `md.sys.elevation.level3` |
| Scrim | opacity | — | `0.32` |

## Code

```tsx
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material/react-dialog';
```

| Figma prop | Code prop |
|---|---|
| Type | `fullScreen` (boolean; `false` = Basic) |
| Show icon | `icon` (pass icon element to enable) |
| Show headline | `title` (omit prop to hide headline) |
| Headline | `title` |
| Body | children of `<DialogContent>` |

```tsx
// Illustrative reference API
<Dialog open={open} onClose={handleClose}>
  <DialogTitle icon={<WarningIcon />}>Discard draft?</DialogTitle>
  <DialogContent>
    Your unsaved changes will be lost. This action cannot be undone.
  </DialogContent>
  <DialogActions>
    <Button variant="text" onClick={handleClose}>Cancel</Button>
    <Button variant="text" onClick={handleDiscard}>Discard</Button>
  </DialogActions>
</Dialog>
```

## Accessibility

- The dialog container must have `role="dialog"` and `aria-modal="true"` to communicate to assistive technologies that content behind the scrim is inert.
- `aria-labelledby` must reference the headline element's id. If `Show headline` is false and no visible heading exists, supply `aria-label` directly on the dialog container.
- `aria-describedby` should reference the body text element so screen readers announce the dialog's content when it opens.
- Focus must be moved into the dialog when it opens (to the first focusable element or the dialog container itself) and returned to the triggering element when it closes. The design file does not encode focus management; this must be implemented in code.
- Tab focus must be trapped within the dialog while it is open. Pressing Escape must close the dialog unless the action is destructive, in which case a confirmation step is required.
- The scrim must make background content inert (`aria-hidden="true"` or `inert` attribute on the page root) so screen readers cannot reach content behind the dialog.
- In the Full-screen variant, a close or back affordance must be present and reachable by keyboard.

## Do's & Don'ts

- ✅ Use dialogs sparingly — only for decisions or information that can't wait or be handled inline. Every dialog interrupts what someone was doing, so each one should earn the interruption.
- ✅ Write the headline as a short, specific question or statement ("Discard changes?", not "Warning") so people grasp the decision before reading the body.
- ✅ Limit a Basic dialog to two actions and label them with the outcome ("Delete", "Cancel") rather than "OK"/"No" — a specific verb lets people act without re-reading the message.
- ✅ Use the Full-screen type when a task needs a form or picker that won't fit comfortably in a fixed-width container, so people aren't working inside a cramped scroll area.
- ❌ Don't stack dialogs. A dialog on top of a dialog buries the first decision and traps focus confusingly — resolve the current one before opening another.
- ❌ Don't use a dialog for non-critical notifications. Blocking the whole screen for low-stakes information is disproportionate — use a Snackbar or Banner instead.
- ❌ Don't pack more than a short paragraph into a Basic dialog; long content is hard to read in a modal — move it to a Full-screen dialog or a dedicated page.
- ❌ Don't auto-open a dialog on page load except for session-expiry or mandatory consent — an unprompted interruption derails whatever someone came to do.

## Related atoms

- [Button](./button.md)
- [Icon](../Icon.md)
- [StateLayer](../StateLayer.md)
