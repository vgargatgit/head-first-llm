# Chapter 9 Graphics Scene Plan

## Chapter

**Chapter 9 — Every Token Needs an Address**  
**Subtitle:** How Transformers represent order with positional embeddings and rotary position encodings

## Status

This document is the canonical production specification for all Chapter 9 graphics.
It expands the relevant master-plan entry into a scene-by-scene brief. Final artwork belongs under `assets/chapter-09/`.

The Chapter 1–3 illustrations remain the visual reference standard.

---

# 1. Chapter visual objective

Make token identity, causal visibility, absolute position, and relative position visibly separate. The chapter deliberately rewinds to the model entrance and shows how position becomes available before the first Transformer block.

The chapter’s visual pipeline is:

```text
token identity representation
    + position information
    -> initial token state
or
Query/Key coordinate pairs
    -> position-dependent rotation
    -> position-aware compatibility
```

The central visual lesson is:

> Attention can compare token states, but the model also needs a representation of where tokens occur and how far apart they are.

---

# 2. Continuity and style locks

- Warm cream-paper or off-white background.
- Hand-drawn outlines, annotations, and purple chapter accents.
- Reuse approved recurring characters, rooms, and proportions from earlier chapters.
- Keep generated artwork separate from exact mathematical typography; add verified labels as editable overlays.
- Use speech bubbles only for teaching intuition, never as literal tensor contents.
- Provide a clean “remove the costumes” mapping from story object to mathematical operation.
- Open with an explicit rewind from Chapter 8 to the model entrance.
- Reuse THE, CAT, and SAT token characters before they enter the first Transformer floor.
- The completed address-aware token states hand off to the Transformer tower in Chapter 10.

---

# 3. Reusable chapter design elements

## Position Registrar

A new recurring official who assigns address cards or directs Query and Key coordinate pairs to rotary turntables.

## Identity card and position card

Two different cards that may be added to produce an initial hidden-state card in absolute-position systems.

## Sinusoidal clock wall

Several clock hands with different rotation speeds, representing position-dependent sine and cosine coordinates.

## RoPE turntables

Separate Query and Key turntables that rotate coordinate pairs according to position. Values remain off the standard RoPE turntables.

## Relative-distance ruler

A ruler showing that shifting Query and Key together preserves their separation while changing absolute positions.

---

# 4. Scene inventory

The planned Chapter 9 set contains **8 artwork files**.

---

## Scene 01 — Chapter hero: deliberate rewind to the Position Registry

### Asset

```text
assets/chapter-09/01_chapter_hero_position_registry.png
```

### Intended placement

Chapter opening.

### Learning objective

Make clear that Chapter 9 explains a stage that computationally occurs before Chapter 2.

### Composition

- The completed Chapter 8 block appears in the distance.
- The Reader Guide rewinds the story to the model entrance.
- THE, CAT, and SAT queue at the Position Registry.
- A sign reads `BEFORE THE FIRST TRANSFORMER BLOCK`.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Rewind | pedagogical order differs from execution order |
| Position Registry | architecture-specific positional mechanism |

### Do not show

- Do not place position information after the MLP.
- Do not suggest causal masking alone provides rich position information.

### Alt text draft

> The story rewinds from a completed Transformer block to the model entrance, where token positions receive address information before attention begins.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 02 — Same token, different address

### Asset

```text
assets/chapter-09/02_same_token_different_position.png
```

### Intended placement

Near “The same token at a different position.”

### Learning objective

Show that token identity can stay fixed while the initial representation changes with position.

### Composition

- Two CAT characters have the same identity card.
- One stands at position 2 and one at position 5.
- Different position cards combine with the same token embedding.
- The resulting initial-state cards are visibly different.

### Required labels or numerical reference

```text
e_CAT = [-0.35,0.60,-0.10,0.28]
p_2 = [-0.07,0.13,-0.05,0.08]
x_CAT@2 = [-0.42,0.73,-0.15,0.36]

p_5 = [0.09,0.02,-0.11,0.06]
x_CAT@5 = [-0.26,0.62,-0.21,0.34]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Identity card | token embedding e_CAT |
| Address card | position embedding p_t |
| Combined card | x_t^(0) |

### Do not show

- Do not change CAT’s token identity.
- Do not suggest position is a human-readable coordinate inside one feature.

### Alt text draft

> The same CAT token receives different position cards at positions two and five, producing different initial hidden states.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 03 — Exact additive position calculation

### Asset

```text
assets/chapter-09/03_additive_position_embeddings.png
```

### Intended placement

Inside “Recovering our running input matrix.”

### Learning objective

Anchor learned absolute position embeddings in the running Chapter 1–8 matrix.

### Composition

- Workbook panel with E and P rows aligned.
- Verify CAT’s position-2 addition coordinate by coordinate.
- Stack all rows into X^(0).
- Show shape preservation.

### Required labels or numerical reference

```text
X^(0) = E + P
E, P, X^(0): 3 x 4

CAT:
[-0.35,0.60,-0.10,0.28]
+[-0.07,0.13,-0.05,0.08]
=[-0.42,0.73,-0.15,0.36]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Two aligned cards | element-wise vector addition |
| Result stack | initial token-state matrix |

### Do not show

- Do not concatenate token and position vectors in this architecture example.
- Do not change model width.

### Alt text draft

> CAT’s token embedding and position-two embedding are added coordinate by coordinate to recover the initial hidden-state row used earlier in the book.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 04 — Causal visibility is not positional representation

### Asset

```text
assets/chapter-09/04_visibility_vs_address.png
```

### Intended placement

Near the warning comparing causal order and positional information.

### Learning objective

Separate three ideas readers often merge.

### Composition

- Causal gate answers `Who may I see?`.
- Address badge answers `Where am I?`.
- Distance ruler answers `How far apart are we?`.
- Use one token pair to demonstrate all three without combining the props.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Gate | causal permission |
| Badge | absolute position |
| Ruler | relative position |

### Do not show

- Do not present the causal triangle as a complete position encoding.
- Do not imply all architectures expose absolute position explicitly.

### Alt text draft

> A causal gate, position badge, and relative-distance ruler answer different questions about visibility, location, and separation.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 05 — Sinusoidal clocks

### Asset

```text
assets/chapter-09/05_sinusoidal_position_clocks.png
```

### Intended placement

Near the sinusoidal encoding section.

### Learning objective

Give an intuition for multiple sine and cosine frequencies without implying literal clock features.

### Composition

- Several paired clock hands rotate at different speeds.
- Fast clocks change quickly across nearby positions.
- Slow clocks retain longer-range variation.
- Their readings form one distributed position card added to the token embedding.

### Required labels or numerical reference

```text
PE(p,2i)=sin(p/10000^(2i/d_model)); PE(p,2i+1)=cos(p/10000^(2i/d_model))
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Clock pair | one sine/cosine coordinate pair |
| Different speeds | different frequencies |
| Combined readings | distributed position encoding |

### Do not show

- Do not claim one clock equals one human concept.
- Do not portray learned parameters in a fixed sinusoidal system.

### Alt text draft

> Clock hands turning at different speeds create a distributed sinusoidal signature for each token position.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 06 — RoPE Query and Key turntables

### Asset

```text
assets/chapter-09/06_rope_query_key_rotation.png
```

### Intended placement

Inside the RoPE introduction and exact example.

### Learning objective

Show that RoPE rotates Query and Key coordinate pairs rather than adding a position vector to the hidden state.

### Composition

- A Query pair enters a purple turntable labelled position 1.
- A Key pair enters a distinct turntable labelled position 3.
- The angle is position multiplied by frequency.
- An unopened Value package bypasses the turntables.
- The rotated vectors meet at the matching desk.

### Required labels or numerical reference

```text
q=[0.8,0.6], k=[0.5,-0.4], theta=30 degrees
q_tilde@1 ≈ [0.392820,0.919615]
k_tilde@3 = [0.4,0.5]
dot ≈ 0.616936
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Turntable | 2D rotation matrix R_t |
| Rotated cards | q_tilde_t and k_tilde_t |
| Post-rotation match | q_tilde_i dot k_tilde_j |

### Do not show

- Do not rotate Values in the standard RoPE scene.
- Do not show vector length changing under rotation.

### Alt text draft

> RoPE rotates a Query pair by its position angle and a Key pair by its own position angle before their compatibility is calculated.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 07 — Relative distance survives a shared shift

### Asset

```text
assets/chapter-09/07_rope_relative_distance.png
```

### Intended placement

Near the relative-position derivation.

### Learning objective

Show why the rotated Query–Key interaction depends on position difference.

### Composition

- First pair appears at positions i and j.
- A second copy is shifted by the same offset to i+c and j+c.
- Relative-distance rulers match.
- A third pair changes only one position and shows a different relative angle.

### Required labels or numerical reference

```text
R_i^T R_j depends on j-i; shifting both positions by c preserves j-i
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Shared movement | add same c to both positions |
| Unchanged ruler | same relative separation |
| Relative turn | rotation difference entering dot product |

### Do not show

- Do not claim absolute position becomes irrelevant to every model operation.
- Do not imply unlimited context generalisation is guaranteed.

### Alt text draft

> Two Query–Key pairs shifted together retain the same relative separation and relative rotary angle, while changing the separation changes their comparison.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 08 — Position mechanism variants and handoff to the tower

### Asset

```text
assets/chapter-09/08_position_variants_and_handoff.png
```

### Intended placement

Chapter ending.

### Learning objective

Summarise architecture choices and send address-aware states into the Transformer stack.

### Composition

- A comparison board lists learned absolute embeddings, fixed sinusoidal encodings, relative biases, and RoPE.
- Each receives a simple visual icon without claiming interchangeability.
- A caution strip states that longer formulas do not automatically guarantee useful long-context behaviour.
- THE, CAT, and SAT enter the Transformer tower with address-aware states.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Variant board | architecture-specific positional methods |
| Tower entrance | position-aware representations enter Block 1 |

### Do not show

- Do not claim all models combine every method.
- Do not imply RoPE alone guarantees arbitrary context extension.

### Alt text draft

> Several positional mechanisms are compared before the address-aware token states enter the first floor of the Transformer tower.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

# 5. Chapter placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_position_registry.png` | Hero and timeline correction |
| 2 | `02_same_token_different_position.png` | Core contrast |
| 3 | `03_additive_position_embeddings.png` | Exact calculation |
| 4 | `04_visibility_vs_address.png` | Misconception guardrail |
| 5 | `05_sinusoidal_position_clocks.png` | Supporting mechanism |
| 6 | `06_rope_query_key_rotation.png` | Core RoPE mechanism and exact calculation |
| 7 | `07_rope_relative_distance.png` | Relative-position explanation |
| 8 | `08_position_variants_and_handoff.png` | Variant, caution, and handoff |

---

# 6. Numerical and conceptual source of truth

The additive-position example reconstructs the same `X^(0)` used in Chapters 1–8. The two-dimensional RoPE teaching example uses:

```text
q=[0.8,0.6]
k=[0.5,-0.4]
theta=30 degrees
Query position m=1
Key position n=3
q_tilde≈[0.392820,0.919615]
k_tilde=[0.4,0.5]
```

RoPE normally rotates Query and Key pairs. It does not normally add a position vector to the hidden state, and standard scenes should not rotate Values.

---

## Production and review checklist

### Visual continuity
- [ ] Warm paper, hand-drawn linework, purple accents, and panel framing match Chapters 1–3.
- [ ] Returning characters, token colours, rooms, and props match approved earlier artwork.
- [ ] New characters have a stable design that can be reused in later scenes.
- [ ] The scene feels like another part of the same book, not a separate infographic series.

### Technical accuracy
- [ ] Every displayed number and tensor shape matches the chapter source.
- [ ] Inputs, intermediate objects, and outputs are visually distinct.
- [ ] The visual metaphor does not imply an operation that the model does not perform.
- [ ] The “remove the costumes” mapping is included for every major scene.
- [ ] Misconception panels correct the intended error without introducing a new one.

### Readability and accessibility
- [ ] Exact text is verified typography rather than unreviewed generated lettering.
- [ ] Labels and equations remain readable at mobile width.
- [ ] Dense arithmetic is isolated in workbook-style panels.
- [ ] Each image has useful technical alt text.
- [ ] One primary learning objective is visually dominant.

### Narrative flow
- [ ] The chapter begins with a clear hero scene.
- [ ] Mechanism scenes follow the chapter’s computational order.
- [ ] At least one exact numerical panel anchors the metaphor.
- [ ] The final scene hands the reader to the next chapter.

---

# Chapter 9 definition of done

Chapter 9 graphics are complete only when:

1. all 8 planned assets have approved final compositions;
2. every scene follows the approved book-wide style and character continuity;
3. all numerical overlays are checked against the chapter source;
4. images are committed under `assets/chapter-09/`;
5. `src/chapter-09.md` references the approved assets in the planned locations;
6. every image has useful alt text;
7. desktop and mobile previews show no clipping or unreadable labels;
8. the hero, mechanism, exact calculation, misconception guardrail, and chapter handoff are all represented;
9. a final technical review confirms that the metaphors preserve the chapter’s computation;
10. the changelog records the Chapter 9 graphics release.

---

# Current status

- Detailed scene planning: complete.
- Reusable prop specification: complete.
- Final artwork generation: not started.
- Asset integration into the chapter: not started.
- Website and mobile review: pending final artwork.
