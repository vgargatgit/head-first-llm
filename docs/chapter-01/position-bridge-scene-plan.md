# Chapter 1 Position Bridge Scene Plan

**Story:** COH-2.4  
**Status:** Approved for production  
**Planned asset:** `assets/chapter-01/05_position_bridge.svg`

## Purpose

Give readers one memorable visual anchor for the minimum positional scaffold introduced in Chapter 1 without pre-teaching the detailed mechanisms covered in Chapter 9.

The scene must communicate:

```text
token embedding E
        +
architecture-supplied positional contribution P
        =
initial hidden state X⁽⁰⁾
```

This equation is presented as one common additive teaching model, not as a universal Transformer pipeline.

## Placement

Insert the illustration in `src/chapter-01.md` inside **“Where does the initial hidden state come from?”**, after the explanation that the supplied matrix `X` is already prepared for the attention block and before the paragraph explaining that positional information can become mixed into later hidden states.

## Composition

A single wide, mobile-readable cartoon scene with three large stages:

1. **Token identity**
   - SAT remains the yellow SAT token character established in Chapter 1.
   - SAT carries a cream token-embedding card labelled `E`.
   - The character is the token occurrence; the card is the numerical representation.

2. **Position Registrar**
   - A friendly purple-accented address clerk supplies a separate address card labelled `P₃`.
   - The card represents an architecture-supplied positional contribution, not a row number that the projection matrices automatically read.
   - The registrar is a teaching metaphor for additive position mechanisms only.

3. **Ready for attention**
   - The two contributions appear together in a larger passport labelled `INITIAL STATE X⁽⁰⁾`.
   - The prepared passport points into the first attention block.

A bottom banner carries the authoritative technical caption:

> One common additive teaching model: `X⁽⁰⁾ = E + P`. Some architectures inject position differently. Chapter 9 compares the main approaches.

## Technical guardrails

- Do not depict row order as a rich learned positional feature.
- Do not show the causal mask as supplying positional representation.
- Do not imply that every architecture adds `P` to `E`.
- Do not depict RoPE as an additive card; Chapter 9 explains that RoPE normally rotates Query and Key coordinate pairs.
- Do not imply that position remains a separately identifiable subvector after several layers.
- Keep `E`, `P`, and `X⁽⁰⁾` large and legible; avoid tiny matrices or dense prose.
- SAT must retain the established face, yellow body, black label, gloves and shoes.

## Visual treatment

- Warm cream-paper background.
- Hand-drawn black outlines.
- Purple chapter labels and arrows.
- Soft lavender, green and coral stage panels.
- Large cards and minimal text so the scene remains readable on a narrow screen.
- Same visual grammar as `assets/chapter-01/03_evolving_hidden_state_passport.png`.

## Approved alt text

> SAT carries a token-embedding card labelled E. A Position Registrar supplies an address card labelled P. The two contributions form an initial hidden-state passport labelled X zero, which enters the first attention block. A note says that this additive view is one teaching model and that other architectures inject position differently.

## Verification checklist

- [x] The token character remains the token occurrence.
- [x] The cards represent numerical contributions and states.
- [x] The additive equation is explicitly non-universal.
- [x] Chapter 9 is named as the detailed follow-up.
- [x] The layout avoids tiny matrix text.
- [x] The planned alt text does not rely on colour.
