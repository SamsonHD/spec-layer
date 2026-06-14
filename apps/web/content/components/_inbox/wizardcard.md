---
spec_version: "0.1"
component:
  name: WizardCard
  figma_key: 329d948eb5400bf29750efeaba2c5dedf6a071a6
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 25363:80439
content_hash: 3869a4850cdbccd76d8b2c9ced47c6d662edc2d23c2727e8cfd479ebf286d537
extracted_at: 2026-06-14T10:04:36.081Z
---

## Definition

_To be written._

## Anatomy

1. WizardCardHeader (component)
2. Intro
3. WidgetBody

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| WidgetBody | undefined | — | — |

## Variants

- **Modifiers**: Collapse

## States

- Default

## Tokens used

### Color

#### copy

| Property | Condition | Token |
|---|---|---|
| fill | Collapse=False | `Text Color/Body/Secondary` |

#### WidgetBody

| Property | Condition | Token |
|---|---|---|
| fill | Collapse=False | `Background/Surface/Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Container | fill | `Background/Surface/Primary` |
| WizardCardHeader | fill | `Background/Surface/Primary` |
| Wizard/SectionIcon | fill | `Background/Surface/Secondary` |
| Wizard/SectionIcon | border | `Border Color/Divider/Divider Secondary` |
| icon | fill | `Text Color/Body/Primary` |
| title | fill | `Text Color/Body/Primary` |
| Button Icon | fill | `Background/Action/Action Tertiary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| title | typography | — | `Subtitle/L - Strong` |
| copy | typography | Collapse=False | `Body/L` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Container | border-radius | — | `rounded-8` |
| Container | effects | — | `light/Shadow/Card` |
| Wizard/SectionIcon | border-radius | — | `rounded-8` |
| Button Icon | border-radius | — | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [WizardCardHeader](./wizardcardheader.md)

## Extraction gaps

- **WizardCardHeader**: hardcoded itemSpacing (24px)
- **WizardCardHeader**: hardcoded padding
- **icon+title**: hardcoded itemSpacing (16px)
- **Wizard/SectionIcon**: hardcoded itemSpacing (10px)
- **Wizard/SectionIcon**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Add affordances**: hardcoded itemSpacing (12px)
- **Button Icon**: hardcoded itemSpacing (10px)
- **Button Icon**: hardcoded padding
- **Intro**: hardcoded itemSpacing (10px)
- **Intro**: hardcoded padding
- **WidgetBody**: hardcoded itemSpacing (32px)
- **WidgetBody**: hardcoded padding
- **[ADD CONTENT HERE]**: hardcoded color (no variable or style)
