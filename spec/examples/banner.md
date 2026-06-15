---
spec_version: "0.1"
status: approved
component:
  name: Banner
  figma_key: polaris-banner
  figma_file: POLARIS
  figma_node: 4:100
content_hash: "0000000000000000000000000000000000000000000000000000000000000000"
extracted_at: "2026-06-10T00:00:00.000Z"
approved_by: "Spec Layer reference"
---

## Definition

A Banner informs merchants about a change in status, an important piece of information, or a condition that affects the whole page or a section of it. Use the Info tone for neutral context, Success to confirm a completed action, Warning for situations that need attention but are not blocking, and Critical for errors or problems that prevent the merchant from continuing. A banner sits inline at the top of the page or section it relates to — it is not a transient toast and not a modal; it stays until the situation is resolved or the merchant dismisses it.

## Anatomy

1. Container
2. Icon
3. Title
4. Body content
5. Action buttons (component — Button)
6. Dismiss button (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Title | text | — | — |
| Dismissible | boolean | true / false | false |

## Variants

- **Tone**: Info (default) · Success · Warning · Critical

## States

- Default

## Tokens used

### Color

#### Container

| Property | Info | Success | Warning | Critical |
|---|---|---|---|---|
| background | `--p-color-bg-surface-info` | `--p-color-bg-surface-success` | `--p-color-bg-surface-warning` | `--p-color-bg-surface-critical` |

#### Icon

| Property | Info | Success | Warning | Critical |
|---|---|---|---|---|
| color | `--p-color-icon-info` | `--p-color-icon-success` | `--p-color-icon-warning` | `--p-color-icon-critical` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | color | `--p-color-text` |
| Body content | color | `--p-color-text-secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `--p-font-size-350` |
| Body content | typography | — | `--p-font-size-325` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `--p-border-radius-300` |
| Container | padding | — | `--p-space-400` |
| Container | gap | — | `--p-space-200` |

## Code

```tsx
import { Banner } from '@shopify/polaris';
```

| Figma prop | Code prop |
|---|---|
| Tone | `tone` |
| Title | `title` |
| Dismissible | `onDismiss` (provide a handler to enable) |
| Action buttons | `action` / `secondaryAction` |

```tsx
// Illustrative reference API
<Banner
  title="Your shipping label is ready"
  tone="success"
  action={{ content: 'Print label', url: '/labels/123' }}
  onDismiss={() => setVisible(false)}
>
  <p>You can print it now or find it later in your orders.</p>
</Banner>
```

## Accessibility

- The banner's live-region semantics depend on how it appears, which the design file cannot encode. A banner shown in response to a user action should use `role="status"` (polite) for Info/Success and `role="alert"` (assertive) for Warning/Critical; a banner present on initial page load is not a live region.
- When a banner appears as the result of an action, move keyboard focus to it so the merchant lands on the new information; return focus sensibly when it is dismissed.
- The tone is reinforced by the icon and title text, never colour alone, so the meaning survives for colour-blind and screen-reader users.
- The Dismiss button is icon-only and must carry an `aria-label` such as "Dismiss".
- Action buttons inside the banner follow normal button semantics and must be reachable and operable by keyboard.

## Do's & Don'ts

- ✅ Use a banner for information that affects the whole page or section and should persist until resolved.
- ✅ Match the tone to the message: Critical for blocking errors, Warning for attention, Success for confirmation, Info for neutral context.
- ✅ Write a specific, scannable title and keep the body to the essential detail and next step.
- ✅ Provide an action button when there is a clear thing the merchant can do about the message.
- ❌ Don't stack multiple banners; consolidate or prioritise the single most important message.
- ❌ Don't use a banner for transient confirmations that don't need to persist — use a Toast instead.
- ❌ Don't use the Critical tone for non-blocking issues; overusing it erodes its urgency.
- ❌ Don't use a banner for marketing or promotional content.

## Related atoms

- [Button](./button.md)
- [Icon](../Icon.md)
