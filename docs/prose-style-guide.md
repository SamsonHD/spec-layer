# Prose style guide — judgment sections

> Companion to `spec/SPEC.md`. SPEC.md defines the *shape* of a spec; this defines
> the *voice* of its judgment sections — **Definition**, **Accessibility**, and
> **Do's & Don'ts**. It is the source of truth for both human authors and the
> AI prose pass (it is the basis of the generation system prompt).

The bar is best-in-class design-system documentation (Atlassian, Material, Polaris,
Carbon). The single thing that separates that writing from generic filler: **every
rule also gives the reason it matters.**

## The core rule: state the rule *and* the reason

A guideline that only says *what* reads like a lint message. A guideline that also
says *why* reads like expert guidance and survives edge cases the author didn't list.

- ❌ Flat: "Don't disable submit buttons."
- ✅ Reasoned: "Don't disable submit buttons. A disabled button gives no hint about
  what's missing, and it's skipped by the tab order — so people relying on a keyboard
  or screen reader can't reach it. Keep it pressable and use inline validation instead."

Never ship a Do/Don't that is only an assertion. If you can't name the consequence,
the rule probably isn't worth including.

## Voice

1. **Imperative and verb-first.** "Use…", "Keep…", "Avoid…", "Never…", "Consider…".
   Lead with the action, not the noun.
2. **Write for people, not "the user."** Prefer "people", "someone", or the concrete
   role ("merchants", "reviewers"). Avoid "the user shall" / passive spec-speak.
3. **Concrete over abstract.** Anchor rules in real situations — forms, modal dialogs,
   toolbars, onboarding, confirmation flows — not "in certain contexts".
4. **Plain language.** Short sentences. No jargon the reader has to decode. No hedging
   ("it is generally recommended that one might consider").
5. **Reference the component's actual parts.** Name its real variants, props, and
   states (from the structured spec) — never invent options it doesn't have.
6. **Pair opposing rules.** When a Don't has a right alternative, name it: "…use a
   Toggle instead", "…use radio buttons". A Don't without a way out just frustrates.

## Per-section guidance

### Definition
One paragraph. Open with what the component *is and does* in a sentence. Then cover
*when to use it* — and, when it has meaningful variants, *which variant for which job*
(mirroring the way Atlassian describes Primary vs. Subtle vs. Danger). Close with the
single most important constraint. Specific to this component; no boilerplate that
would apply to any component.

### Accessibility
Reasoned guidance, not a dry checklist. Name the correct ARIA roles, states, and
keyboard behaviour for the component's pattern (anchor to the W3C ARIA Authoring
Practices). For each point, say what to do *and* why it matters for someone using
assistive tech. **Explicitly flag what a design file cannot encode** — focus order,
live-region behaviour, whether a change is immediate vs. deferred — so the reader
knows it's an implementation decision, not an omission.

### Do's & Don'ts
A bulleted list, each item prefixed `✅` or `❌`. Every item carries a reason
(see the core rule). Verb-first. Pair a Don't with its alternative. Aim for 3–5 of
each; cut anything that's a restatement of another item or that lacks a real
consequence.

## Quick checklist before shipping prose

- [ ] Does every Do/Don't name a consequence, not just a rule?
- [ ] Imperative, verb-first phrasing throughout?
- [ ] "People"/concrete roles rather than "the user"?
- [ ] Real variants/props/states only — nothing invented?
- [ ] Each Don't offers the right alternative where one exists?
- [ ] Accessibility flags what the design file can't encode?
