---
spec_version: "0.1"
component:
  name: Grid Cell / Medium
  figma_key: eb1c883f418d297bd1481c7363d7e318c1c60fe6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 24728:4008
content_hash: bed5187b34f1358dafc2a34e1686b1fe428e77798fa151485a3b29ef3fe1ee03
extracted_at: 2026-06-14T10:03:12.495Z
---

## Definition

_To be written._

## Anatomy

1. Data

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Custom Left | boolean | true / false | false |
| Tier-2-Indent | boolean | true / false | false |
| Tier-3-Indent | boolean | true / false | false |
| Icon 02 | boolean | true / false | false |
| Icon 01 | boolean | true / false | false |
| -- Data | text | — | Data |
| Gripper | boolean | true / false | false |
| Checkbox | boolean | true / false | false |
| Cell Data | boolean | true / false | true |
| Custom Right | boolean | true / false | false |
| -- Swap 02 | instanceSwap | — | 24728:4494 |
| Tier-1-Indent | boolean | true / false | false |
| -- Swap 01 | instanceSwap | — | 24728:4494 |
| Tier-4-Indent | boolean | true / false | false |
| Show warning stroke | boolean | true / false | false |

## Variants

- **Right Align**: On · Off (default)
- **Active**: On · Off (default)
- **Modifiers**: DIsabled

## States

- Default
- Row-hover
- Row-select
- Row-issue
- Row-overriden
- total
- Row-error

## Tokens used

### Color

#### Container

| Property | State | On | Off |
|---|---|---|---|
| fill | Default | `Background/Surface/Tertiary` | `Background/Surface/Tertiary` |
| fill | Row-hover | `Background/Table/Table Row (Hover)` | `Background/Table/Table Row (Hover)` |
| fill | Row-select | `Background/Table/Table Row Selected Expanded` | `Background/Table/Table Row Selected Expanded` |
| fill | Row-issue | `Background/Semantic/Status → Warning` | `Background/Semantic/Status → Warning` |
| fill | Row-overriden | `Background/Table/Table Row Selected Expanded` | `Background/Table/Table Row Selected Expanded` |
| fill | total | `Background/Semantic/Status → Success` | `Background/Semantic/Status → Success` |
| fill | Row-error | `Background/Semantic/Status → Error` | `Background/Semantic/Status → Error` |
| border | Default | `Border Color/Action/Action` | `Border Color/Divider/Table Divider` |
| border | Row-hover | — | `Border Color/Divider/Table Divider` |
| border | Row-select | `Border Color/Action/Action` | `Border Color/Divider/Table Divider` |
| border | Row-issue | `Text Color/Semantic/Warning` | `Border Color/Divider/Table Divider` |
| border | Row-overriden | `Accent/accent-3` | — |
| border | total | — | `Border Color/Divider/Table Divider` |
| border | Row-error | `Border Color/Semantic/Danger` | `Border Color/Divider/Table Divider` |

#### Data

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Body/Primary` |
| fill | Row-hover | `Text Color/Body/Primary` |
| fill | Row-select | `Text Color/Body/Primary` |
| fill | Row-issue | `Text Color/Semantic/Warning` |
| fill | Row-overriden | `Text Color/Action/Link Secondary` |
| fill | total | `Text Color/Body/Primary` |
| fill | Row-error | `Text Color/Semantic/Error` |

**When DIsabled = True**

| Property | State | Token |
|---|---|---|
| fill | Default | `Text Color/Body/Secondary` |
| fill | Row-hover | `Text Color/Body/Secondary` |
| fill | Row-select | `Text Color/Body/Secondary` |
| fill | Row-issue | `Text Color/Semantic/Warning` · `Text Color/Body/Secondary` |
| fill | Row-overriden | `Text Color/Action/Link Secondary` · `Text Color/Body/Secondary` |
| fill | total | `Text Color/Body/Secondary` |
| fill | Row-error | `Text Color/Semantic/Error` · `Text Color/Body/Secondary` |

#### Cursor

| Property | Condition | Token |
|---|---|---|
| fill | Active=On | `color/icon/neutral/default` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Data | typography | — | `Table/Cell Value` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | height | State=Default, Active=Off | `size/ag-row-height` |
| Container | padding-x | State=total | `size/ag-icon-size` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (10px)
- **Container**: hardcoded padding
- **Tier-1-Indent**: hardcoded color (no variable or style)
- **Tier-2-indent**: hardcoded color (no variable or style)
- **Tier-3-indent**: hardcoded color (no variable or style)
- **Tier-4-indent**: hardcoded color (no variable or style)
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Checkbox**: hardcoded color (no variable or style)
- **Checkbox**: hardcoded itemSpacing (8px)
- **Check Wrapper**: hardcoded cornerRadius (2px)
- **Check**: hardcoded color (no variable or style)
- **fa-glyph-wrapper**: hardcoded color (no variable or style)
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Fill**: hardcoded color (no variable or style)
- **custom content**: hardcoded color (no variable or style)
