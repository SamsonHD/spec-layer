---
spec_version: "0.1"
component:
  name: Accordion
  figma_key: fa831da51fd29cc842ff91e17d70aa6ba7cade33
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7666:306754
content_hash: 3eaa9bea1c0f2ac1e7242197e4e0af47ca9ec46f286e8a68095fd4b0d4761bea
extracted_at: 2026-06-14T10:05:04.235Z
---

## Definition

_To be written._

## Anatomy

1. Left Chevron
2. Title Wrapper
3. Right Chevron

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Content Slot | instanceSwap | — | 5507:362804 |
| Left Chevron | boolean | true / false | true |
| Right Chevron | boolean | true / false | true |
| Title | text | — | Title |
| Show Icon | boolean | true / false | true |
| Show Title | boolean | true / false | true |
| Title Slot | instanceSwap | — | 5507:362804 |
| Show Badge | boolean | true / false | false |
| New Items | boolean | true / false | false |
| Accordion Items | undefined | — | — |

## Variants

- **Size**: Large (default) · Medium · Small
- **Modifiers**: Expanded · Background · Mobile · Custom Title

## States

- Default

## Tokens used

### Color

#### Container

| Property | Condition | Token |
|---|---|---|
| fill | Background=true | `Background/Surface/Primary` |

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| border | Custom Title=false | `Text Color/Body/Primary` |

#### Ellipse 2

| Property | Condition | Token |
|---|---|---|
| fill | Custom Title=false | `Text Color/Body/Primary` |

#### Title

| Property | Condition | Token |
|---|---|---|
| fill | Custom Title=false | `Text Color/Body/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Button Icon | fill | `Background/Action/Action Tertiary` |
| icon | fill | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Title | typography | Size=Large, Custom Title=false | `[ARCHIVE]/*Mobile/Heading5` |
| Title | typography | Size=Medium, Custom Title=false | `[ARCHIVE]/*Mobile/Heading6` |
| Title | typography | Background=true, Size=Small, Custom Title=false | `[ARCHIVE]/*Mobile/Field Label (Emphasized)` |
| Title | typography | Background=false, Size=Small, Custom Title=false | `Subtitle/S` |
| Replace Me | typography | — | `[ARCHIVE]/*Mobile/Field Label` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (24px)
- **Container**: hardcoded cornerRadius (16px)
- **Container**: hardcoded padding
- **Header**: hardcoded itemSpacing (8px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Title Wrapper**: hardcoded itemSpacing (12px)
- **Title Wrapper**: hardcoded padding
- **Icon Wrapper**: hardcoded padding
- **Counter Badge**: hardcoded cornerRadius (9999px)
- **Counter Badge**: hardcoded padding
- **<spacer> w-size-40**: hardcoded color (no variable or style)
- **Content Slot**: hardcoded color (no variable or style)
- **Content Slot**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
