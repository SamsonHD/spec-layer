---
spec_version: "0.1"
component:
  name: Action Bar
  figma_key: 8e9ba2c9ecffb96cf5843f90c3e01661a7d06f1f
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 11374:347267
content_hash: 5080de1c9cdb6980d9efa1ee1d77a0ff9d8eb3a8d8c3150af62383c485aaadae
extracted_at: 2026-06-14T10:07:47.215Z
---

## Definition

_To be written._

## Anatomy

1. Button Icon (component)
2. Content Wrapper

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Close Btn | boolean | true / false | true |
| Slot | boolean | true / false | true |
| Slot Content | instanceSwap | — | 5507:362804 |
| Tertiary Btn | boolean | true / false | true |
| Secondary Btn | boolean | true / false | true |
| Primary Btn | boolean | true / false | true |
| Show Note | boolean | true / false | false |

## Variants

- **Size**: Default (default) · Mobile
- **Content**: Default (default) · Slot

## States

- Default

## Tokens used

### Color

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | — | `Text Color/Body/Primary` |
| fill | Content=Default | `Text Color/Body/White` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Content=Default | `Background/Action/Action` |
| fill | Content=Default | `Background/Action/Action Secondary` |
| border | Content=Default | `Border Color/Action/Secondary Button (Default)` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Content=Default | `Text Color/Action/Default` |
| fill | Content=Default | `Text Color/Action/On Action` |
| fill | Content=Default | `Text Color/Action/On Secondary` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Content=Default | `Background/Transparent` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| Button Icon | fill | `Background/Action/Action Tertiary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Replace Me | typography | — | `[ARCHIVE]/*Mobile/Field Label` |
| Label | typography | Content=Default | `Action/M` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | effects | — | `light/Shadow/Modal Footer` |
| Button Icon | border-radius | — | `rounded-8` |
| Button | border-radius | Content=Default | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Button Icon](./button-icon.md)

## Extraction gaps

- **Footer Wrapper**: hardcoded itemSpacing (16px)
- **Footer Wrapper**: hardcoded padding
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Content Wrapper**: hardcoded itemSpacing (24px)
- **Actions**: hardcoded itemSpacing (24px)
- **Slot/Replace Me**: hardcoded color (no variable or style)
- **Slot/Replace Me**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **Buttons**: hardcoded itemSpacing (16px)
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **Button (Link)**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
