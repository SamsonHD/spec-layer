---
spec_version: "0.1"
component:
  name: Hero Section
  figma_key: d31406d584fb3685b48d2e917fd2da0b87647ef4
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 12195:63408
content_hash: cc1c4a69693157c86d155b8284bf3f9b2e4c1b6371b1fd3f180705ae8f969092
extracted_at: 2026-06-14T10:07:47.229Z
---

## Definition

_To be written._

## Anatomy

1. Duis aute irure dolor in reprehenderit in voluptate
2. Imperdiet proin fermentum leo vel orci porta non. Nec feugiat in fermentum posuere. Morbi tristique senectus et netus et.
3. CTAs

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Description | boolean | true / false | true |
| Title | boolean | true / false | true |
| Show Secondary Button | boolean | true / false | true |
| Show Link Button | boolean | true / false | true |
| Show Slot | boolean | true / false | false |
| Instance | instanceSwap | — | 5507:362804 |
| Show Input Field | boolean | true / false | false |

## Variants

- **Device**: Desktop (default) · Tablet Landscape · Tablet Portrait · Mobile
- **Alignment**: Left (default) · Center
- **Modifiers**: Color Inverted

## States

- Default

## Tokens used

### Color

#### Duis aute irure dolor in reprehenderit in voluptate

| Property | Condition | Token |
|---|---|---|
| fill | Color Inverted=false | `Text Color/Body/Primary` |
| fill | Color Inverted=true | `Text Color/Body/Inverted → Primary` |

#### Imperdiet proin fermentum leo vel orci porta non. Nec feugiat in fermentum posuere. Morbi tristique senectus et netus et.

| Property | Condition | Token |
|---|---|---|
| fill | Device=Desktop · Tablet Landscape · Tablet Portrait, Color Inverted=false | `Text Color/Body/Secondary` |
| fill | Device=Desktop · Tablet Landscape · Tablet Portrait, Color Inverted=true | `Text Color/Body/Inverted → Primary` |

#### Secondary Button

| Property | Condition | Token |
|---|---|---|
| fill | Device=Desktop · Tablet Landscape · Tablet Portrait, Alignment=Left, Color Inverted=false | `Background/Action/Action Secondary` |
| border | Device=Desktop · Tablet Landscape · Tablet Portrait, Alignment=Left, Color Inverted=false | `Border Color/Action/Action` |

#### Label

| Property | Token |
|---|---|
| fill | `Text Color/Action/Default` |

**When Color Inverted = true**

| Property | Token |
|---|---|
| fill | `Text Color/Body/Inverted → Primary` |

#### Primary Button

| Property | Condition | Token |
|---|---|---|
| fill | Device=Desktop · Tablet Landscape · Tablet Portrait, Alignment=Left, Color Inverted=false | `Background/Action/Action` |

#### Imperdiet proin fermentum leo vel orci porta non. Nec feugiat in fermentum posuere. Morbi tristique senectus et.

| Property | Condition | Token |
|---|---|---|
| fill | Device=Mobile, Color Inverted=false | `Text Color/Body/Secondary` |
| fill | Device=Mobile, Color Inverted=true | `Text Color/Body/Inverted → Primary` |

#### Fixed

| Part | Property | Token |
|---|---|---|
| icon | fill | `Text Color/Action/Default` |
| icon | fill | `Text Color/Body/Primary` |
| icon | fill | `Text Color/Body/White` |
| Button (Link) | fill | `Background/Transparent` |
| Button | fill | `Background/Action/Action` |
| Button | fill | `Background/Action/Action Secondary` |
| Button | border | `Border Color/Action/Action` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Duis aute irure dolor in reprehenderit in voluptate | typography | Device=Desktop | `[ARCHIVE]/*Desktop/Heading1` |
| Duis aute irure dolor in reprehenderit in voluptate | typography | Device=Tablet Landscape | `[ARCHIVE]/*Tablet Landscape/Heading1` |
| Duis aute irure dolor in reprehenderit in voluptate | typography | Device=Tablet Portrait | `[ARCHIVE]/*Tablet Portrait/Heading1` |
| Duis aute irure dolor in reprehenderit in voluptate | typography | Device=Mobile | `[ARCHIVE]/*Mobile/Heading2` |
| Imperdiet proin fermentum leo vel orci porta non. Nec feugiat in fermentum posuere. Morbi tristique senectus et netus et. | typography | Device=Desktop · Tablet Landscape · Tablet Portrait | `[ARCHIVE]/*Tablet Portrait/Paragraph1/Long` |
| Label | typography | — | `Action/M` |
| Label | typography | Device=Desktop · Tablet Landscape · Tablet Portrait | `Action/L` |
| Imperdiet proin fermentum leo vel orci porta non. Nec feugiat in fermentum posuere. Morbi tristique senectus et. | typography | Device=Mobile | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Long` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Secondary Button | border-radius | Device=Desktop · Tablet Landscape · Tablet Portrait, Alignment=Left, Color Inverted=false | `rounded-8` |
| Primary Button | border-radius | Device=Desktop · Tablet Landscape · Tablet Portrait, Alignment=Left, Color Inverted=false | `rounded-8` |
| Button | border-radius | — | `rounded-8` |

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
- **Slot/Replace Me**: hardcoded color (no variable or style)
- **Slot/Replace Me**: hardcoded padding
- **Replace Me**: hardcoded color (no variable or style)
- **Input Field**: hardcoded itemSpacing (24px)
- **Input Field**: hardcoded color (no variable or style)
- **Label Wrapper**: hardcoded itemSpacing (4px)
- **Label Wrapper**: hardcoded padding
- **icon**: no text style or typography variable
- **icon-primary**: no text style or typography variable
- **icon-secondary**: no text style or typography variable
- **Input**: hardcoded itemSpacing (8px)
- **Input**: hardcoded cornerRadius (8px)
- **Input**: hardcoded padding
- **Hint Wrapper**: hardcoded itemSpacing (10px)
- **Hint Wrapper**: hardcoded padding
- **Button**: hardcoded itemSpacing (8px)
- **Button**: hardcoded padding
- **CTAs**: hardcoded itemSpacing (24px)
- **CTAs**: hardcoded padding
- **Secondary Button**: hardcoded itemSpacing (12px)
- **Secondary Button**: hardcoded padding
- **Primary Button**: hardcoded itemSpacing (12px)
- **Primary Button**: hardcoded padding
- **Button (Link)**: hardcoded itemSpacing (8px)
- **Button (Link)**: hardcoded cornerRadius (9999px)
