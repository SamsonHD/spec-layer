---
spec_version: "0.1"
status: draft
component:
  name: Button
  figma_key: m3-button
  figma_file: FILE1
  figma_node: 1:100
content_hash: 57739d869dbfcbc0dad6d17ead5da6117c7b2c6666eabc711dc5c6b881a9c644
extracted_at: 2026-06-10T00:00:00.000Z
---

## Definition

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Anatomy

- container
- label
- icon (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Style | variant | Filled · Outlined | Filled |
| State | variant | Enabled · Hovered · Disabled | Enabled |
| Show icon | boolean | true / false | false |
| Label | text | — | Button |

## Variants

- **Style**: Filled · Outlined
- **State**: Enabled · Hovered · Disabled

## States

- Enabled
- Hovered
- Disabled

## Tokens used

| Part | Property | Token |
|---|---|---|
| container | fills | `md.sys.color.primary` |
| container | cornerRadius | `md.sys.shape.corner.full` |
| label | fills | `md.sys.color.on-primary` |
| container | strokes (Style=Outlined) | `md.sys.color.outline` |
| label | fills (Style=Outlined) | `md.sys.color.primary` |
| container | fills (State=Hovered) | `md.sys.color.primary-hover` |

## Code

> ⚠️ Draft — AI-suggested, not yet approved.

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Do's & Don'ts

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Related atoms

- [Icon](./icon.md)

## Extraction gaps

- **debug-overlay**: hardcoded paint (no variable or style)
