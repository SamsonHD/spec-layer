---
spec_version: "0.1"
status: draft
component:
  name: Button
  figma_key: m3-button
  figma_file: FILE1
  figma_node: 1:100
content_hash: 08a6cc2c442f51b110b29e910b7078df2014498a66d8bad02b3a9b79f1e09ae6
extracted_at: 2026-06-10T00:00:00.000Z
---

## Definition

> ⚠️ Draft — AI-suggested, not yet approved.

_To be written._

## Anatomy

1. container
2. label
3. icon (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Show icon | boolean | true / false | false |
| Label | text | — | Button |

## Variants

- **Style**: Filled (default) · Outlined

## States

- Enabled
- Hovered
- Disabled

## Tokens used

### Color

#### container

| Property | Condition | Token |
|---|---|---|
| fill | Style=Filled, State=Enabled | `md.sys.color.primary` |
| fill | State=Hovered | `md.sys.color.primary-hover` |
| border | Style=Outlined | `md.sys.color.outline` |

#### label

| Property | Condition | Token |
|---|---|---|
| fill | Style=Filled | `md.sys.color.on-primary` |
| fill | Style=Outlined | `md.sys.color.primary` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| container | border-radius | — | `md.sys.shape.corner.full` |

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

- **container**: hardcoded itemSpacing (8px)
- **container**: hardcoded padding
- **label**: no text style or typography variable
- **debug-overlay**: hardcoded color (no variable or style)
