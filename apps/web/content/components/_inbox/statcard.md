---
spec_version: "0.1"
component:
  name: StatCard
  figma_key: ce9918ac27349d28c5b641083fecf7cc026cf4c0
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25148:6999
content_hash: e64edf6d3785db3c401611fd48afbbb2f16ac58721559853be953c84573e00dc
extracted_at: 2026-06-14T10:04:19.083Z
---

## Definition

_To be written._

## Anatomy

1. label + icon
2. Frame 2

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Info Icon | boolean | true / false | false |
| Show Subline | boolean | true / false | false |
| Legend | boolean | true / false | false |
| Value Info Icon | boolean | true / false | false |

## Variants

- **Subline**: Default (default)
- **Modifiers**: Warning · Error

## States

- Default

## Tokens used

### Color

#### Container

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` |

**When Warning = true**

| Property | Token |
|---|---|
| fill | `Background/Surface/Primary` · `Background/Semantic/Status → Warning` |

**When Error = true**

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Error` · `Background/Surface/Primary` |

#### warning-line

| Property | Condition | Token |
|---|---|---|
| border | Warning=false | `Border Color/Semantic/Danger` |
| border | Warning=true | `Text Color/Semantic/Warning` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | fill | `Text Color/Body/Secondary` |
| Body | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | — | `Subtitle/S` |
| Body | typography | — | `Heading/S` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | effects | — | `light/Shadow/Card` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Container**: hardcoded padding
- **label + icon**: hardcoded itemSpacing (4px)
- **Frame 1**: hardcoded itemSpacing (8px)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Frame 2**: hardcoded itemSpacing (8px)
