---
spec_version: "0.1"
component:
  name: Calendar Event Item Examples for Preview
  figma_key: 664f6ff7233146bee4d462b86709bcf96723b8bb
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 14762:16702
content_hash: 0dad89621e366930899032da6c91e672b997a3a6bc1cee7e873009fd0673ea99
extracted_at: 2026-06-14T10:05:04.424Z
---

## Definition

_To be written._

## Anatomy

1. Divider (component)

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Location | text | — | Magna aliqua office |
| Show lcon | boolean | true / false | true |
| Notes | text | — | Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  |
| Instance | instanceSwap | — | 5507:362804 |
| Show Tertiary Btn | boolean | true / false | true |
| Show Secondary Btn | boolean | true / false | true |

## Variants

- **Example**: Divider (default) · Location · Invitees · Notes · Actions · Slot
- **Modifiers**: Mobile

## States

- Default

## Tokens used

### Color

#### Rectangle 7235

| Property | Condition | Token |
|---|---|---|
| fill | Example=Divider | `Background/Divider/Divider` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Example=Location · Invitees · Notes | `Text Color/Body/Secondary` |

#### Magna aliqua office

| Property | Condition | Token |
|---|---|---|
| fill | Example=Location | `Text Color/Body/Primary` |

#### Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

| Property | Condition | Token |
|---|---|---|
| fill | Example=Notes | `Text Color/Body/Primary` |

#### Button (Link)

| Property | Condition | Token |
|---|---|---|
| fill | Example=Actions | `Background/Transparent` |

#### Label

| Property | Condition | Token |
|---|---|---|
| fill | Example=Actions | `Text Color/Action/Default` |
| fill | Example=Actions | `Text Color/Action/On Action` |
| fill | Example=Actions | `Text Color/Action/On Secondary` |

#### Button

| Property | Condition | Token |
|---|---|---|
| fill | Example=Actions | `Background/Action/Action` |
| fill | Example=Actions | `Background/Action/Action Secondary` |
| border | Example=Actions | `Border Color/Action/Secondary Button (Default)` |

#### icon

| Property | Condition | Token |
|---|---|---|
| fill | Example=Actions | `Text Color/Body/Primary` |
| fill | Example=Actions | `Text Color/Body/White` |

#### Ellipse 1

| Property | Condition | Token |
|---|---|---|
| border | Example=Slot | `Text Color/Body/Secondary` |

#### Ellipse 2

| Property | Condition | Token |
|---|---|---|
| fill | Example=Slot | `Text Color/Body/Secondary` |

#### More invitees

| Property | Condition | Token |
|---|---|---|
| fill | Example=Invitees | `Background/Action/Action Quaternary` |

#### 8+

| Property | Condition | Token |
|---|---|---|
| fill | Example=Invitees | `Text Color/Body/Primary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| Magna aliqua office | typography | Example=Location, Mobile=False | `[ARCHIVE]/Footnote1/Long` |
| Magna aliqua office | typography | Example=Location, Mobile=True | `[ARCHIVE]/*Mobile/Input Field Value` |
| Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. | typography | Example=Notes, Mobile=False | `[ARCHIVE]/Footnote1/Long` |
| Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. | typography | Example=Notes, Mobile=True | `[ARCHIVE]/*Mobile/Input Field Value` |
| Label | typography | Example=Actions | `Action/M` |
| Replace Me | typography | Example=Slot | `[ARCHIVE]/*Mobile/Field Label` |
| 8+ | typography | Example=Invitees | `[ARCHIVE]/*Tablet Portrait/Paragraph2/Short` |

### Measurements

| Part | Property | Condition | Token |
|---|---|---|---|
| Button | border-radius | Example=Actions | `rounded-8` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [Divider](./divider.md)

## Extraction gaps

- **Container**: hardcoded itemSpacing (10px)
- **Divider**: hardcoded itemSpacing (10px)
