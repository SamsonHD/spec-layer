---
spec_version: "0.1"
component:
  name: Avatar
  figma_key: b36f11cf3d4384c332dff0610bc1c42d938d1592
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 9604:367287
content_hash: df94d202ae3de2657a56dde5e6583e27cf02106b321e46d449fc2ba17aeb2108
extracted_at: 2026-06-14T10:03:14.955Z
---

## Definition

_To be written._

## Anatomy

1. AA

## Configuration

| Name | Kind | Options | Default |
|---|---|---|---|
| Initials | text | — | AA |
| Show Status | boolean | true / false | false |

## Variants

- **Style**: Letter (default) · Photo · Placeholder
- **Size**: Xtra Small · Small · Medium · Large · XLarge · XXS (default)

## States

- Default

## Tokens used

### Color

#### Initials

| Property | Condition | Token |
|---|---|---|
| fill | Style=Letter | `Background/Surface/Tertiary` |

#### AA

| Property | Condition | Token |
|---|---|---|
| fill | Style=Letter | `Text Color/Body/Secondary` |

#### BG Color

| Property | Condition | Token |
|---|---|---|
| fill | Style=Placeholder | `Background/Surface/Inverted → Quaternary` |

#### Vector

| Property | Condition | Token |
|---|---|---|
| fill | Style=Placeholder | `Text Color/Body/Inverted → Primary` |
| fill | Style=Placeholder | `Text Color/Body/Secondary` |

### Typography

| Part | Property | Condition | Token |
|---|---|---|---|
| AA | typography | Style=Letter, Size=Xtra Small | `Caption/XS - Strong` |
| AA | typography | Style=Letter, Size=Small · Medium | `Subtitle/S` |
| AA | typography | Style=Letter, Size=Large | `Subtitle/M` |
| AA | typography | Style=Letter, Size=XLarge | `Heading/M` |
| AA | font-family | Style=Letter, Size=XXS | `typography/font-family/primary` |
| AA | font-weight | Style=Letter, Size=XXS | `font-weight/fw-600` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

None.

## Extraction gaps

- **Container**: hardcoded itemSpacing (4px)
- **Container**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded cornerRadius (9999px)
- **Initials**: hardcoded padding
- **Status Badge**: hardcoded cornerRadius (100px)
