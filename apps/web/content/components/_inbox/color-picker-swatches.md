---
spec_version: "0.1"
component:
  name: Color Picker Swatches
  figma_key: 0fd8362d10e7352ec3e49a629507eacc63885453
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 7553:304728
content_hash: bb7d6790e78a36cc8a664c76be7e66bd482bc9e54cd82e6030857c4d42784f53
extracted_at: 2026-06-14T10:03:26.197Z
---

## Definition

_To be written._

## Anatomy

1. Color Swatch (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Primary | boolean | true / false | true |
| Secondary | boolean | true / false | false |
| Tertiary | boolean | true / false | false |

## Variants

- **Density**: Default (default) · Compact
- **Palette**: Accents (default) · Spectrum · Custom
- **Modifiers**: Mobile

## States

- Default

## Tokens used

### Color

#### Color Swatch

| Property | Accents | Spectrum | Custom |
|---|---|---|---|
| fill | `Accent/accent-1` · `Accent/accent-15` · `Accent/accent-16` · `Accent/accent-17` · `Accent/accent-4` · `Accent/accent-5` · `Accent/accent-7` · `Accent/accent-9` | — | `Background/Surface/Primary` |
| border | `Border Color/Chip/Disabled` | `Border Color/Chip/Disabled` | — |

**Exceptions**

| Property | Condition | Token |
|---|---|---|
| border | Density=Default | `Border Color/Action/Secondary Button (Disabled)` |
| border | Density=Compact | `Background/Transparent` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Color Swatch | border-radius | Density=Default | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Color Swatch](./color-swatch.md)
- [Color Swatch/Dark/false/false/Default](./color-swatch-dark-false-false-default.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (8px)
- **Primary**: hardcoded itemSpacing (8px)
- **Secondary**: hardcoded itemSpacing (8px)
- **Tertiary**: hardcoded itemSpacing (8px)
