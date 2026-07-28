# Chapter 6 Graphics Scene Plan

## Chapter

**Chapter 6 — Many Specialists at Work**  
**Subtitle:** How multiple attention heads examine the same tokens in different learned spaces

## Status

This document is the canonical production specification for all Chapter 6 graphics.
It expands the relevant master-plan entry into a scene-by-scene brief. Final artwork belongs under `assets/chapter-06/`.

The Chapter 1–3 illustrations remain the visual reference standard.

---

# 1. Chapter visual objective

Show that every attention head receives the same token-state matrix but owns distinct Q, K, and V projections, produces its own attention map and retrieved report, and preserves its features until concatenation.

The chapter’s visual pipeline is:

```text
same token states X
    -> Head 1 complete attention system -> Z_1
    -> Head 2 complete attention system -> Z_2
corresponding token rows
    -> concatenate features
    -> H
```

The central visual lesson is:

> Multiple heads are parallel learned views of the same token positions, not a division of the tokens among workers.

---

# 2. Continuity and style locks

- Warm cream-paper or off-white background.
- Hand-drawn outlines, annotations, and purple chapter accents.
- Reuse approved recurring characters, rooms, and proportions from earlier chapters.
- Keep generated artwork separate from exact mathematical typography; add verified labels as editable overlays.
- Use speech bubbles only for teaching intuition, never as literal tensor contents.
- Provide a clean “remove the costumes” mapping from story object to mathematical operation.

- Reuse the Question Coach, Profile Writer, Information Courier, causal gate, and softmax counter inside each head-specific agency.
- Head identity must remain visible from projections through final report.
- The final bound report goes to the Team Lead in Chapter 7.

---

# 3. Reusable chapter design elements

## Head Specialist agencies

Two visually parallel departments with identical floor plans but different parameter badges and accent details.

## Head identity badge

A persistent badge such as `HEAD 1` or `HEAD 2` attached to Q, K, V, A, and Z objects.

## Feature binder

A binder that joins corresponding token reports side by side without mixing or averaging them.

## Packed implementation board

A technical panel showing how separate conceptual projection blocks may be stored in one large multiplication and reshaped.

---

# 4. Scene inventory

The planned Chapter 6 set contains **7 artwork files**.

---

## Scene 01 — Chapter hero: one sentence, two specialist agencies

### Asset

```text
assets/chapter-06/01_chapter_hero_two_attention_heads.png
```

### Intended placement

Chapter opening.

### Learning objective

Introduce two complete attention systems receiving the same THE/CAT/SAT matrix.

### Composition

- THE, CAT, and SAT stand at a fork that feeds both Head 1 and Head 2 agencies.
- Each agency contains Q, K, V, matching, masking, softmax, and Courier stations.
- Parameter badges differ by head.
- No human-written speciality labels such as grammar or meaning.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Same clients entering both agencies | same X for every head |
| Different staff boards | different learned W_r^Q, W_r^K, W_r^V |

### Do not show

- Do not send different tokens to different heads.
- Do not assign guaranteed linguistic jobs.

### Alt text draft

> The same THE, CAT, and SAT states enter two complete attention-head agencies that use different learned projection parameters.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 02 — One head is a complete attention system

### Asset

```text
assets/chapter-06/02_one_head_complete_pipeline.png
```

### Intended placement

Near “One head is one complete attention system.”

### Learning objective

Reassemble Chapters 2–5 into one compact per-head blueprint.

### Composition

- Show Q, K, V projections, score board, scale, causal mask, row softmax, and weighted Value retrieval.
- Keep every object labelled Head 1.
- Show input X and output Z_1 shapes.

### Required labels or numerical reference

```text
Q_r=XW_r^Q; K_r=XW_r^K; V_r=XW_r^V; A_r=softmax(Q_rK_r^T/sqrt(d_k)+M); Z_r=A_rV_r
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| One agency | one attention head |
| Complete internal workflow | full scaled dot-product attention |

### Do not show

- Do not present a head as one matrix row or one scalar.
- Do not omit Values.

### Alt text draft

> A compact blueprint shows that one attention head includes its own Q, K, V projections, matching, masking, softmax, and Value retrieval.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 03 — Head 2 exact projections and score row

### Asset

```text
assets/chapter-06/03_head2_exact_calculation.png
```

### Intended placement

Across the Head 2 calculation sections.

### Learning objective

Anchor the second-head story in the chapter’s numerical example.

### Composition

- Workbook panel for Q_2, K_2, and V_2.
- Highlight SAT’s Head 2 Query and its dot product with THE’s Head 2 Key.
- Show the resulting SAT score entry `0.092696`.

### Required labels or numerical reference

```text
q_sat^(2) = [-0.348, 0.386]
k_THE^(2) = [-0.029, 0.214]
dot = 0.092696

V_2 =
[ 0.490, -0.236]
[-0.357,  0.364]
[ 0.465, -0.369]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Head 2 cards | rows of Q_2, K_2, V_2 |
| Score tile | entry of Q_2K_2^T |

### Do not show

- Do not reuse Head 1 numbers.
- Do not imply that Head 2 receives different X.

### Alt text draft

> The second attention head projects the same token states into different Query, Key, and Value vectors and computes SAT’s raw score against THE as 0.092696.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 04 — Two heads produce different attention maps

### Asset

```text
assets/chapter-06/04_two_attention_maps.png
```

### Intended placement

Near the Head 2 attention-weight comparison.

### Learning objective

Show that independently learned heads distribute attention differently while obeying the same causal mask.

### Composition

- Two side-by-side 3 x 3 attention boards.
- Use identical row/column token labels and identical masked triangle.
- Highlight SAT’s rows for comparison.
- Keep colours neutral rather than naming one map better.

### Required labels or numerical reference

```text
SAT Head 1 = [0.300981, 0.389986, 0.309033]
SAT Head 2 = [0.367883, 0.299425, 0.332692]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Two maps | A_1 and A_2 |
| Same forbidden cells | same causal rule |
| Different allowed weights | different learned projections |

### Do not show

- Do not use one softmax across both heads.
- Do not claim interpretability from visual difference alone.

### Alt text draft

> Head 1 and Head 2 use the same causal visibility but assign different attention weights to THE, CAT, and SAT.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 05 — Different Values create different retrieved reports

### Asset

```text
assets/chapter-06/05_two_head_outputs.png
```

### Intended placement

After Head 2 Value retrieval.

### Learning objective

Show that heads can differ in both matching and payload space.

### Composition

- Head 1 Courier delivers SAT report `[-0.145069, 0.163369]`.
- Head 2 Courier delivers `[0.228069, -0.100593]`.
- Both reports remain attached to SAT and retain their head badges.

### Required labels or numerical reference

```text
z_sat^(1) = [-0.145069, 0.163369]
z_sat^(2) = [ 0.228069,-0.100593]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Two delivered reports | head-specific z_sat^(r) |

### Do not show

- Do not average the reports.
- Do not detach either report from SAT’s token row.

### Alt text draft

> Two attention heads deliver different two-coordinate reports for SAT because they use different learned attention and Value spaces.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 06 — Concatenate corresponding token features

### Asset

```text
assets/chapter-06/06_concatenate_head_reports.png
```

### Intended placement

Near “Put the two head outputs side by side.”

### Learning objective

Show concatenation along features while preserving token rows.

### Composition

- Bind SAT’s two Head 1 pages beside its two Head 2 pages.
- Repeat in smaller rows for THE and CAT.
- Show `3 x 2` plus `3 x 2` becoming `3 x 4`.
- Use page binding, not arithmetic addition.

### Required labels or numerical reference

```text
h_sat =
[-0.145069, 0.163369 | 0.228069, -0.100593]

H ≈
[-0.220000,-0.075000, 0.490000,-0.236000]
[-0.033945, 0.215415, 0.060146, 0.068501]
[-0.145069, 0.163369, 0.228069,-0.100593]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Feature binder | Concat along feature dimension |
| Three preserved folders | three token rows |

### Do not show

- Do not concatenate along the token dimension.
- Do not average corresponding coordinates.

### Alt text draft

> Each token’s Head 1 and Head 2 reports are bound side by side, producing a four-feature row while preserving THE, CAT, and SAT positions.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 07 — Conceptual heads versus packed implementation

### Asset

```text
assets/chapter-06/07_packed_multihead_projection_and_handoff.png
```

### Intended placement

Near the packed-implementation section and chapter transition.

### Learning objective

Explain efficient packed matrices without erasing conceptual head independence, then hand the concatenated report to Chapter 7.

### Composition

- Left: separate W_1 and W_2 projection blocks.
- Right: one large packed matrix and reshape into head slices.
- A misconception strip rejects splitting tokens among heads and applying one softmax across heads.
- The complete H binder reaches the Team Lead’s desk.

### Required labels or numerical reference

```text
Q_big = X[W_1^Q | W_2^Q | ...]; reshape -> (batch, heads, tokens, head width)
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Packed board | implementation storage and multiplication |
| Separate labelled slices | head-specific parameters |
| Binder delivered to Team Lead | H sent to W^O |

### Do not show

- Do not imply parameter sharing merely because matrices are packed.
- Do not stop the story at concatenation.

### Alt text draft

> Separate head projections are shown beside a packed implementation, and the concatenated report is delivered to the Team Lead for output projection.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

# 5. Chapter placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_two_attention_heads.png` | Hero |
| 2 | `02_one_head_complete_pipeline.png` | Mechanism |
| 3 | `03_head2_exact_calculation.png` | Exact calculation |
| 4 | `04_two_attention_maps.png` | Contrast |
| 5 | `05_two_head_outputs.png` | Retrieved outputs |
| 6 | `06_concatenate_head_reports.png` | Exact concatenation |
| 7 | `07_packed_multihead_projection_and_handoff.png` | Implementation clarification, misconception, and handoff |

---

# 6. Numerical and conceptual source of truth

Head 1 values come from Chapters 4–5. Head 2 uses separate learned matrices. The authoritative Head 2 matrices are in `src/chapter-06.md`.

Key final references:

```text
A_2 ≈
[1.000000, 0,        0       ]
[0.492498, 0.507502, 0       ]
[0.367883, 0.299425, 0.332692]

Z_2 ≈
[0.490000, 0.060146, 0.228069]   first coordinate by THE/CAT/SAT rows
[-0.236000,0.068501,-0.100593]   second coordinate by THE/CAT/SAT rows
```

The concatenated matrix is:

```text
H ≈
[-0.220000,-0.075000, 0.490000,-0.236000]
[-0.033945, 0.215415, 0.060146, 0.068501]
[-0.145069, 0.163369, 0.228069,-0.100593]
```

Concatenation preserves positions and joins feature coordinates.

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

# Chapter 6 definition of done

Chapter 6 graphics are complete only when:

1. all 7 planned assets have approved final compositions;
2. every scene follows the approved book-wide style and character continuity;
3. all numerical overlays are checked against the chapter source;
4. images are committed under `assets/chapter-06/`;
5. `src/chapter-06.md` references the approved assets in the planned locations;
6. every image has useful alt text;
7. desktop and mobile previews show no clipping or unreadable labels;
8. the hero, mechanism, exact calculation, misconception guardrail, and chapter handoff are all represented;
9. a final technical review confirms that the metaphors preserve the chapter’s computation;
10. the changelog records the Chapter 6 graphics release.

---

# Current status

- Detailed scene planning: complete.
- Reusable prop specification: complete.
- Final artwork generation: complete for all seven approved WebP scenes.
- Asset integration into the chapter: complete.
- Website and mobile review: pending deployed preview review.
