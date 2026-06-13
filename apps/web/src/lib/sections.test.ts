import { describe, expect, it } from "vitest";
import { partitionBody } from "./sections";

describe("partitionBody", () => {
  it("routes Spec Layer sections into Guidelines and Specs buckets", () => {
    const body = `## Definition

A button triggers an action.

## Anatomy

1. container
2. label

## Configuration

| Name | Kind |
|---|---|
| label | text |

## States

- Default
- Hover

## Tokens used

### Color

| Property | Token |
|---|---|
| fill | color.primary |

## Code

Coming soon.

## Accessibility

Use proper roles.

## Do's & Don'ts

- ✅ Do this
- ❌ Don't do that

## Related atoms

- [Icon](./icon.md)

## Extraction gaps

- container: hardcoded color`;

    const out = partitionBody(body);
    expect(out.guidelinesMarkdown).toContain("## Definition");
    expect(out.guidelinesMarkdown).toContain("## Code");
    expect(out.guidelinesMarkdown).toContain("## Accessibility");
    expect(out.guidelinesMarkdown).toContain("## Do's & Don'ts");
    expect(out.guidelinesMarkdown).toContain("## Related atoms");
    expect(out.guidelinesMarkdown).not.toContain("## Anatomy");

    expect(out.specsMarkdown).toContain("## Anatomy");
    expect(out.specsMarkdown).toContain("## Configuration");
    expect(out.specsMarkdown).toContain("## States");
    expect(out.specsMarkdown).toContain("## Tokens used");
    expect(out.specsMarkdown).not.toContain("## Definition");

    expect(out.gapsMarkdown).toContain("## Extraction gaps");
    expect(out.otherMarkdown).toBe("");
  });

  it("tolerates curly apostrophes in Do's & Don'ts", () => {
    const body = `## Do\u2019s & Don\u2019ts\n\n- ✅ Test`;
    const out = partitionBody(body);
    expect(out.guidelinesMarkdown).toContain("Do\u2019s & Don\u2019ts");
  });

  it("collects unknown sections into otherMarkdown", () => {
    const body = `## Custom Section\n\nSomething.`;
    const out = partitionBody(body);
    expect(out.otherMarkdown).toContain("## Custom Section");
    expect(out.guidelinesMarkdown).toBe("");
    expect(out.specsMarkdown).toBe("");
  });
});
