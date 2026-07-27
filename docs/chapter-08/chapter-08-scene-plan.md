# Chapter 8 Graphics Scene Plan

## Chapter

**Chapter 8 — The Private Thinking Room**  
**Subtitle:** How the position-wise MLP transforms each token and completes one Transformer block

## Status

This document is the canonical production specification for all Chapter 8 graphics.
It expands the relevant master-plan entry into a scene-by-scene brief. Final artwork belongs under `assets/chapter-08/`.

The Chapter 1–3 illustrations remain the visual reference standard.

---

# 1. Chapter visual objective

Show that attention communicates across token positions, while the MLP independently transforms the feature representation at each position using shared weights and non-linear gating.

The chapter’s visual pipeline is:

```text
normalised token row N
    -> expand with W_1
    -> non-linear activation or gate
    -> contract with W_2
    -> MLP update F
residual addition + normalisation
    -> completed block output X^(1)
```

The central visual lesson is:

> Attention moves information between positions; the MLP performs private non-linear feature processing inside each position.

---

# 2. Continuity and style locks

- Warm cream-paper or off-white background.
- Hand-drawn outlines, annotations, and purple chapter accents.
- Reuse approved recurring characters, rooms, and proportions from earlier chapters.
- Keep generated artwork separate from exact mathematical typography; add verified labels as editable overlays.
- Use speech bubbles only for teaching intuition, never as literal tensor contents.
- Provide a clean “remove the costumes” mapping from story object to mathematical operation.

- Reuse the separate token lanes and residual highway from Chapter 7.
- The same private-room machinery must serve THE, CAT, and SAT independently.
- The final complete-block blueprint becomes the reusable floor template for Chapter 10.

---

# 3. Reusable chapter design elements

## Private Thinking Room

A booth that admits one token row at a time and contains expand, activation, and contract stages.

## Expansion wall

A learned W_1 panel that changes the feature width from 4 to 6 in the teaching example.

## Activation gate

A coordinate-wise gate; the worked example uses ReLU while a variant panel introduces modern activations.

## Contraction wall

A learned W_2 panel that returns six activated features to model width four.

---

# 4. Scene inventory

The planned Chapter 8 set contains **8 artwork files**.

---

## Scene 01 — Chapter hero: the meeting ends and private work begins

### Asset

```text
assets/chapter-08/01_chapter_hero_private_thinking_room.png
```

### Intended placement

Chapter opening.

### Learning objective

Contrast the shared attention meeting with independent per-token MLP work.

### Composition

- THE, CAT, and SAT leave a shared attention meeting.
- Each enters an identical private booth.
- The booths have no doors connecting token lanes.
- An expand-gate-contract diagram is visible inside each booth.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Shared meeting | attention |
| Separate booth | position-wise MLP |
| Identical booth machinery | shared MLP parameters across positions |

### Do not show

- Do not portray the MLP as another cross-token conversation.
- Do not give each token different W_1/W_2 parameters.

### Alt text draft

> After attention, THE, CAT, and SAT enter separate but identical private MLP rooms that transform each row independently.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 02 — Expand, activate, contract mechanism

### Asset

```text
assets/chapter-08/02_expand_activate_contract.png
```

### Intended placement

Near the position-wise MLP equations.

### Learning objective

Establish the three-stage non-linear transformation.

### Composition

- Four input slots enter W_1 and expand into six workspace slots.
- An activation gate processes each slot independently.
- W_2 contracts six slots back to four.
- Bias cards are added at the correct linear stages.

### Required labels or numerical reference

```text
4 -> 6 -> activation -> 4
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Expansion wall | n_tW_1+b_1 |
| Gate | phi(p_t) |
| Contraction wall | u_tW_2+b_2 |

### Do not show

- Do not omit the activation and show two linear layers as inherently non-linear.
- Do not mix token rows.

### Alt text draft

> A four-feature token row expands to six features, passes through a coordinate-wise activation, and contracts back to four features.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 03 — Exact SAT expansion

### Asset

```text
assets/chapter-08/03_exact_sat_expansion.png
```

### Intended placement

Inside “Calculate SAT’s expanded representation.”

### Learning objective

Show one complete output coordinate and the full expanded vector.

### Composition

- Workbook panel with SAT’s Chapter 7 row.
- Display the 4 x 6 W_1 board and b_1.
- Verify the first expanded coordinate.
- Show all six pre-activation slots.

### Required labels or numerical reference

```text
n_sat ≈ [-0.066680,-0.316240,1.573850,-1.190930]
p_sat ≈ [0.288921,0.476442,0.748567,-1.045115,0.325747,0.282173]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Six workspace notes | p_sat coordinates |

### Do not show

- Do not call p_sat the final MLP output.
- Do not drop the bias.

### Alt text draft

> SAT’s four features are projected into six pre-activation features using the first MLP layer.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 04 — Activation gate for SAT and other tokens

### Asset

```text
assets/chapter-08/04_activation_gate.png
```

### Intended placement

Near “Apply the activation.”

### Learning objective

Show coordinate-wise non-linearity and different activation patterns for different token rows.

### Composition

- SAT’s six values approach six small ReLU gates.
- The negative fourth coordinate is closed and becomes zero.
- Smaller THE and CAT strips show different gate patterns under the same rule.
- A side note states that ReLU is chosen for hand calculation.

### Required labels or numerical reference

```text
u_sat ≈ [0.288921,0.476442,0.748567,0,0.325747,0.282173]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Open gate | positive coordinate retained |
| Closed gate | negative coordinate maps to zero |
| Same gate bank | shared activation function |

### Do not show

- Do not imply the activation gate is a learned parameter in ordinary ReLU.
- Do not claim all modern LLMs use ReLU.

### Alt text draft

> Six ReLU gates keep SAT’s positive intermediate features and set the negative fourth feature to zero.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 05 — Exact contraction back to model width

### Asset

```text
assets/chapter-08/05_exact_sat_contraction.png
```

### Intended placement

Inside “Contract SAT back to the model width.”

### Learning objective

Show the second learned projection and the resulting four-coordinate MLP update.

### Composition

- Six activated SAT coordinates enter W_2.
- Verify the first contracted coordinate.
- The four-slot output report is labelled MLP update, not final block state.

### Required labels or numerical reference

```text
f_sat ≈ [0.288952,0.395095,0.054471,0.126209]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Contraction wall | W_2 |
| Four-slot update | f_sat |

### Do not show

- Do not add the residual inside the matrix-multiplication panel.
- Do not present f_sat as a probability.

### Alt text draft

> SAT’s six activated MLP features are projected back into a four-coordinate update.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 06 — One MLP, three independent rows

### Asset

```text
assets/chapter-08/06_positionwise_shared_mlp.png
```

### Intended placement

Near the full-sequence MLP calculation.

### Learning objective

Show row independence and shared parameters across positions.

### Composition

- THE, CAT, and SAT pass through three copies of the same booth layout.
- A single parameter ledger links all booths.
- The full P, U, and F matrices appear as stacked row reports.

### Required labels or numerical reference

```text
P=NW_1+b_1; U=phi(P); F=UW_2+b_2
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Same blueprint | shared W_1,b_1,W_2,b_2 |
| Separate lanes | no token mixing in MLP |

### Do not show

- Do not draw cross-lane arrows.
- Do not imply identical outputs.

### Alt text draft

> The same position-wise MLP transforms THE, CAT, and SAT independently, producing one output row per position.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 07 — Second residual path completes the block

### Asset

```text
assets/chapter-08/07_mlp_residual_and_norm.png
```

### Intended placement

Near the second residual and normalisation section.

### Learning objective

Show the MLP update joining the attention-sublayer state and producing the completed block output.

### Composition

- The Chapter 7 state travels on the residual highway.
- The MLP update joins at a second addition junction.
- A second normalisation booth produces X^(1).
- Display the final three token rows.

### Required labels or numerical reference

```text
X^(1) ≈
[ 0.029725,-0.600171, 1.603583,-1.033137]
[-1.331984, 1.481456,-0.174505, 0.025033]
[ 0.006373,-0.143686, 1.477529,-1.340215]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Second amendment | F |
| Second residual junction | N + F |
| Completed floor output | X^(1) |

### Do not show

- Do not replace the residual stream with F.
- Do not change the outer 3 x 4 shape.

### Alt text draft

> The MLP update joins each token’s residual stream and passes through normalisation to complete one Transformer block.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 08 — Complete Transformer block and deliberate rewind

### Asset

```text
assets/chapter-08/08_complete_transformer_block_and_rewind.png
```

### Intended placement

Chapter ending.

### Learning objective

Provide a reusable block blueprint and prepare Chapter 9’s positional rewind.

### Composition

- End-to-end diagram: attention, first residual/norm, MLP, second residual/norm.
- Show model-width input and output.
- A sign marked `REWIND TO MODEL ENTRANCE` asks how token order entered before the first block.
- Position badges are silhouetted but not yet explained.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Complete floor plan | one Transformer block |
| Rewind sign | Chapter 9 explains an earlier computational stage |

### Do not show

- Do not place positional information after the completed block.
- Do not imply one block is the whole LLM.

### Alt text draft

> A complete Transformer block blueprint ends with a rewind sign pointing back to the model entrance to explain positional information.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

# 5. Chapter placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_private_thinking_room.png` | Hero |
| 2 | `02_expand_activate_contract.png` | Mechanism |
| 3 | `03_exact_sat_expansion.png` | Exact expansion |
| 4 | `04_activation_gate.png` | Non-linearity and shared-system view |
| 5 | `05_exact_sat_contraction.png` | Exact contraction |
| 6 | `06_positionwise_shared_mlp.png` | Shared-system view |
| 7 | `07_mlp_residual_and_norm.png` | Block completion |
| 8 | `08_complete_transformer_block_and_rewind.png` | Recap, misconception, and handoff |

---

# 6. Numerical and conceptual source of truth

The teaching MLP uses model width 4 and hidden width 6. ReLU is used only to keep arithmetic inspectable.

Key SAT values:

```text
p_sat ≈ [0.288921,0.476442,0.748567,-1.045115,0.325747,0.282173]
u_sat ≈ [0.288921,0.476442,0.748567,0,0.325747,0.282173]
f_sat ≈ [0.288952,0.395095,0.054471,0.126209]
```

Use the complete matrices from `src/chapter-08.md` for full-sequence overlays. The completed block output is the `X^(1)` matrix shown above.

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

# Chapter 8 definition of done

Chapter 8 graphics are complete only when:

1. all 8 planned assets have approved final compositions;
2. every scene follows the approved book-wide style and character continuity;
3. all numerical overlays are checked against the chapter source;
4. images are committed under `assets/chapter-08/`;
5. `src/chapter-08.md` references the approved assets in the planned locations;
6. every image has useful alt text;
7. desktop and mobile previews show no clipping or unreadable labels;
8. the hero, mechanism, exact calculation, misconception guardrail, and chapter handoff are all represented;
9. a final technical review confirms that the metaphors preserve the chapter’s computation;
10. the changelog records the Chapter 8 graphics release.

---

# Current status

- Detailed scene planning: complete.
- Reusable prop specification: complete.
- Final artwork generation: not started.
- Asset integration into the chapter: not started.
- Website and mobile review: pending final artwork.
