---
spec_version: "0.1"
component:
  name: Slider
  figma_key: 51fef8b90546f1db4753f0aa591181957a0f289c
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 10566:341656
content_hash: 8d554ff7e0769211bbc9912e2b537045e1e5fe1c326771e5ddda75dc6209d648
extracted_at: 2026-06-14T10:04:11.598Z
---

## Definition

_To be written._

## Anatomy

1. Background
2. Track

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Numbers | boolean | true / false | false |
| Ticks | boolean | true / false | false |

## Variants

- **Value**: 0 (default) · 0.25 · 0.5 · 0.75 · 1 · Range

## States

- Default

## Tokens used

### Color

#### 25

| Property | Condition | Token |
|---|---|---|
| fill | Value=0 · Range | `Background/Transparent` |
| fill | Value=0.25 · 0.5 · 0.75 · 1 | `Background/Action/Action` |

#### 50

| Property | Condition | Token |
|---|---|---|
| fill | Value=0 · 0.25 | `Background/Transparent` |
| fill | Value=0.5 · 0.75 · 1 · Range | `Background/Action/Action` |

#### 75

| Property | Condition | Token |
|---|---|---|
| fill | Value=0 · 0.25 · 0.5 | `Background/Transparent` |
| fill | Value=0.75 · 1 · Range | `Background/Action/Action` |

#### 100

| Property | Condition | Token |
|---|---|---|
| fill | Value=0 · 0.25 · 0.5 · 0.75 · Range | `Background/Transparent` |
| fill | Value=1 | `Background/Action/Action` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| Background | fill | `Background/Action/Action Quaternary` |
| Handle | fill | `Background/Slider/Slider Handle` |
| Handle | border | `Border Color/Slider/Slider Handle` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Handle | effects | — | `light/Shadow/Dropdown Menu` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Slider Control**: hardcoded padding
- **Background**: hardcoded cornerRadius (9999px)
- **Sliding Handle**: hardcoded color (no variable or style)
- **Sliding Handle**: hardcoded itemSpacing (10px)
- **25**: hardcoded cornerRadius (9999px)
- **50**: hardcoded cornerRadius (9999px)
- **75**: hardcoded cornerRadius (9999px)
- **100**: hardcoded cornerRadius (9999px)
- **Ticks**: hardcoded padding
- **Tick**: hardcoded cornerRadius (2px)
- **Numbers**: hardcoded padding
