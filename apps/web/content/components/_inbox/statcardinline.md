---
spec_version: "0.1"
component:
  name: StatCardInline
  figma_key: 4e499c79eb3a2f0ed872f65cefe7b4b3e6cab071
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25163:62
content_hash: 1a3fe40b2fd07d5f2f0bb7943602fefe30bcc04badca58b42a7a231b1ae18dd7
extracted_at: 2026-06-14T10:04:19.085Z
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
- **Informational**: False (default)
- **Size**: Default (default) · Small · XSmall
- **Modifiers**: Warning · Error

## States

- Default

## Tokens used

### Color

#### Container

| Property | Token |
|---|---|
| fill | `Background/Surface/Secondary` |

**When Warning = True**

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Warning` · `Background/Surface/Primary` |

**When Error = True**

| Property | Token |
|---|---|
| fill | `Background/Semantic/Status → Error` · `Background/Surface/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Title | fill | `Text Color/Body/Secondary` |
| Body | fill | `Text Color/Action/On Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | Size=Default | `Subtitle/S` |
| Title | typography | Size=Small · XSmall | `Caption/S` |
| Body | typography | Size=Default | `Heading/S` |
| Body | typography | Size=Small | `Heading/XS` |
| Body | typography | Size=XSmall | `Subtitle/M - Strong` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |

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
