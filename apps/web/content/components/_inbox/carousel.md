---
spec_version: "0.1"
component:
  name: Carousel
  figma_key: 4032e1bd66c273497326b69eed08c42539868fad
  figma_file: 65fY7adbGscN71qHdfCCgT
  figma_node: 2168:163340
content_hash: ca749fc30b6d2c4435320c7d1866000271bb8f33cca20459d0c4bd7f93487d2a
extracted_at: 2026-06-14T10:07:43.791Z
---

## Definition

_To be written._

## Anatomy

1. .carouselStack Wrapper (component)

## Configuration

_None._

## Variants

- **Column number**: 1 (default) · 2 · 3 · 4
- **Modifiers**: Page button

## States

- Default

## Tokens used

### Color

#### .Carousel-Page-Button

| Property | Condition | Token |
|---|---|---|
| fill | Page button=true | `Background/Action/Action` |
| border | Page button=true | `Border Color/Action/Action` |

## Code

_Import path, prop mapping, and usage example to be filled in._

## Accessibility

_To be written._

## Do's & Don'ts

_To be written._

## Related atoms

- [.carouselStack Wrapper](./carouselstack-wrapper.md)

## Extraction gaps

- **.carouselStack Wrapper**: hardcoded itemSpacing (24px)
- **Carousel stack**: hardcoded itemSpacing (16px)
- **.demo/Carousel Card Content**: hardcoded itemSpacing (24px)
- **.demo/Carousel Card Content**: hardcoded cornerRadius (16px)
- **content placeholder**: hardcoded color (no variable or style)
- **Rectangle 3287**: hardcoded color (no variable or style)
- **Rectangle 3287**: hardcoded cornerRadius (16px)
- **Rectangle 3288**: hardcoded cornerRadius (16px)
- **.Carousel Page Button Group**: hardcoded itemSpacing (24px)
- **.Carousel Page Button**: hardcoded color (no variable or style)
