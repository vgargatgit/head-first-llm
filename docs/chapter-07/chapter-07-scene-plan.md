# Chapter 7 Graphics Scene Plan

## Chapter

**Chapter 7 — The Team Lead Combines the Reports**  
**Subtitle:** How output projection, residual connections, and LayerNorm complete the attention sublayer

## Status

This document is the canonical production specification for all Chapter 7 graphics.
It expands the relevant master-plan entry into a scene-by-scene brief. Final artwork belongs under `assets/chapter-07/`.

The Chapter 1–3 illustrations remain the visual reference standard.

---

# 1. Chapter visual objective

Show how the concatenated head reports are mixed by a learned output projection, added to the original residual stream, and normalised independently for each token.

The chapter’s visual pipeline is:

```text
concatenated head report H
    -> Team Lead output projection W^O
    -> attention update Y
original state X + update Y
    -> residual result R
    -> per-token normalisation
    -> N
```

The central visual lesson is:

> The output projection mixes head features; the residual path preserves the previous token state; normalisation controls each token row’s scale.

---

# 2. Continuity and style locks

- Warm cream-paper or off-white background.
- Hand-drawn outlines, annotations, and purple chapter accents.
- Reuse approved recurring characters, rooms, and proportions from earlier chapters.
- Keep generated artwork separate from exact mathematical typography; add verified labels as editable overlays.
- Use speech bubbles only for teaching intuition, never as literal tensor contents.
- Provide a clean “remove the costumes” mapping from story object to mathematical operation.

- The H binder arrives directly from Chapter 6.
- The residual highway should become a reusable visual object for Chapters 8, 10, and 14.
- The chapter handoff sends each normalised token into its own private MLP room.

---

# 3. Reusable chapter design elements

## The Team Lead

A recurring synthesiser who reads all head-specific feature pages for one token and applies the learned `W^O` board.

## Output-projection synthesis board

A matrix-shaped board that mixes features within each token row; it does not perform new cross-token matching.

## Residual highway

A direct route carrying the incoming token case file around a sublayer until the new update joins it.

## Normalisation booths

One booth per token row with its own mean/variance gauges and learned scale/shift controls.

---

# 4. Scene inventory

The planned Chapter 7 set contains **8 artwork files**.

---

## Scene 01 — Chapter hero: specialist reports reach the Team Lead

### Asset

```text
assets/chapter-07/01_chapter_hero_team_lead.png
```

### Intended placement

Chapter opening.

### Learning objective

Introduce the need to mix concatenated head features into one model-width update.

### Composition

- Head 1 and Head 2 deliver bound reports for THE, CAT, and SAT.
- The Team Lead stands at a `W^O` synthesis board.
- The original X case files remain visible on the residual highway.
- Three separate normalisation booths appear downstream.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Bound reports | H |
| Team Lead board | W^O |
| Combined recommendation | Y |

### Do not show

- Do not portray W^O as another attention match.
- Do not mix token rows.

### Alt text draft

> The Team Lead receives concatenated head reports, while the original token states travel along a residual highway toward separate normalisation booths.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 02 — Exact output projection for SAT

### Asset

```text
assets/chapter-07/02_output_projection_calculation.png
```

### Intended placement

Inside “Verify SAT’s output projection.”

### Learning objective

Show how one four-feature concatenated row becomes one four-feature attention update.

### Composition

- Workbook panel with SAT’s H row and the 4 x 4 W^O board.
- Verify the first coordinate term by term.
- Show the complete output update row.

### Required labels or numerical reference

```text
h_sat = [-0.145069, 0.163369, 0.228069, -0.100593]
y_sat ≈ [-0.102905, 0.152723, 0.053205, -0.123094]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Four report pages | h_sat features |
| Synthesis columns | W^O columns |
| Four recommendations | y_sat |

### Do not show

- Do not use head attention weights here.
- Do not change sequence length.

### Alt text draft

> SAT’s four concatenated head features pass through the output projection to produce the four-coordinate attention update.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 03 — W^O mixes features, not tokens

### Asset

```text
assets/chapter-07/03_output_projection_feature_mixing.png
```

### Intended placement

Near “What W^O actually mixes.”

### Learning objective

Distinguish feature mixing within rows from cross-token attention.

### Composition

- For each token row, coloured feature lines from both heads feed each output coordinate.
- THE, CAT, and SAT remain on separate horizontal lanes.
- A crossed-out panel rejects new Query–Key comparisons.

### Required labels or numerical reference

```text
Y = HW^O; (3 x 4)(4 x 4) = 3 x 4
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Lines within one lane | feature mixing |
| Separate token lanes | position independence of W^O |

### Do not show

- Do not connect THE’s H row into CAT’s output row.
- Do not draw another score matrix.

### Alt text draft

> The output projection combines feature coordinates from both heads inside each token row without creating new cross-token attention.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 04 — Residual highway adds the old case file

### Asset

```text
assets/chapter-07/04_residual_highway.png
```

### Intended placement

Inside “The residual highway.”

### Learning objective

Show that attention contributes an update rather than replacing the entire state.

### Composition

- The original X case file travels on a continuous bypass route.
- The Y amendment joins at an addition junction.
- SAT’s old and new vectors are shown beside the junction.
- All shapes remain 3 x 4.

### Required labels or numerical reference

```text
x_sat = [0.14,-0.22,0.67,-0.31]
y_sat ≈ [-0.102905,0.152723,0.053205,-0.123094]
r_sat ≈ [0.037095,-0.067277,0.723205,-0.433094]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Highway file | x_sat |
| Amendment sheet | y_sat |
| Merged case file | r_sat = x_sat + y_sat |

### Do not show

- Do not concatenate X and Y.
- Do not erase the old file before addition.

### Alt text draft

> SAT’s original state travels along a residual highway and receives the attention update through element-wise addition.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 05 — Residual shape compatibility

### Asset

```text
assets/chapter-07/05_residual_shape_match.png
```

### Intended placement

Near “Residual addition requires matching shapes.”

### Learning objective

Make the shape constraint visually obvious.

### Composition

- Place X and Y as equally sized 3 x 4 grids.
- Align corresponding cells into the R grid.
- Show an incompatible-width example crossed out.

### Required labels or numerical reference

```text
(3 x 4) + (3 x 4) = (3 x 4)
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Aligned cells | element-wise addition |
| Same frame size | matching tensor shapes |

### Do not show

- Do not imply broadcasting across token rows.
- Do not use matrix multiplication symbols.

### Alt text draft

> Two matching three-by-four grids are added cell by cell to preserve the residual-stream shape.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 06 — One normalisation booth per token

### Asset

```text
assets/chapter-07/06_per_token_layernorm.png
```

### Intended placement

Across the LayerNorm explanation.

### Learning objective

Show that LayerNorm computes statistics within each token row, not across tokens.

### Composition

- THE, CAT, and SAT enter separate booths.
- Each booth has its own mean and variance gauges.
- Gamma and beta controls appear after standardisation.
- A crossed-out shared tank rejects batch-wide statistics.

### Required labels or numerical reference

```text
LayerNorm(r) = gamma ⊙ (r-mu)/sqrt(var+epsilon) + beta
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Individual booth | row-wise normalisation |
| Mean/variance gauges | statistics across feature coordinates |
| Scale/shift controls | gamma and beta |

### Do not show

- Do not combine THE, CAT, and SAT to calculate one mean.
- Do not depict normalisation as merely clipping.

### Alt text draft

> THE, CAT, and SAT use separate LayerNorm booths, each calculating statistics across its own feature coordinates.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 07 — Exact SAT LayerNorm panel

### Asset

```text
assets/chapter-07/07_exact_sat_layernorm.png
```

### Intended placement

Inside the exact LayerNorm calculation.

### Learning objective

Anchor the booth metaphor in the chapter’s SAT numbers.

### Composition

- Show SAT’s residual row entering a clean workbook panel.
- Display its mean and the normalised output.
- Keep arithmetic separate from the character illustration.

### Required labels or numerical reference

```text
r_sat ≈ [0.037095,-0.067277,0.723205,-0.433094]
mu_sat ≈ 0.064982
N_sat ≈ [-0.066680,-0.316240,1.573850,-1.190930]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Booth input | r_sat |
| Balanced output card | normalised SAT row |

### Do not show

- Do not reuse CAT or THE statistics.
- Do not omit epsilon in the conceptual formula.

### Alt text draft

> SAT’s four residual coordinates are normalised using statistics from that row to produce the attention-sublayer output.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 08 — Post-norm, pre-norm, and handoff to the private room

### Asset

```text
assets/chapter-07/08_norm_variants_and_handoff.png
```

### Intended placement

Chapter ending.

### Learning objective

Clarify architectural variants without changing the running calculation, then lead to the MLP.

### Composition

- Two small block diagrams compare post-norm and pre-norm ordering.
- LayerNorm and RMSNorm controls are visually distinguished.
- The chapter’s selected path is highlighted.
- THE, CAT, and SAT leave toward separate Private Thinking Rooms.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Different room orderings | pre-norm versus post-norm |
| Different gauges | LayerNorm versus RMSNorm |
| Private rooms | position-wise MLP |

### Do not show

- Do not claim all LLMs use the chapter’s exact arrangement.
- Do not imply RMSNorm subtracts a mean.

### Alt text draft

> Small diagrams compare normalisation placements and methods before the three token rows enter separate private MLP rooms.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

# 5. Chapter placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_team_lead.png` | Hero |
| 2 | `02_output_projection_calculation.png` | Exact calculation |
| 3 | `03_output_projection_feature_mixing.png` | Mechanism and misconception |
| 4 | `04_residual_highway.png` | Residual mechanism |
| 5 | `05_residual_shape_match.png` | Shape clarification |
| 6 | `06_per_token_layernorm.png` | Shared-system and contrast |
| 7 | `07_exact_sat_layernorm.png` | Exact normalisation |
| 8 | `08_norm_variants_and_handoff.png` | Variant, misconception, and handoff |

---

# 6. Numerical and conceptual source of truth

The output-projection matrices and residual values must match `src/chapter-07.md`.

Key matrices:

```text
Y ≈
[-0.268400, 0.137400, 0.247300,-0.289500]
[ 0.047496, 0.117849,-0.018231, 0.033579]
[-0.102905, 0.152723, 0.053205,-0.123094]

R ≈
[-0.058400,-0.232600,0.827300,-0.399500]
[-0.372504, 0.847849,-0.168231,0.393579]
[ 0.037095,-0.067277,0.723205,-0.433094]
```

Use the complete LayerNorm arithmetic from the chapter for any dense overlay. Normalisation is per token row.

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

# Chapter 7 definition of done

Chapter 7 graphics are complete only when:

1. all 8 planned assets have approved final compositions;
2. every scene follows the approved book-wide style and character continuity;
3. all numerical overlays are checked against the chapter source;
4. images are committed under `assets/chapter-07/`;
5. `src/chapter-07.md` references the approved assets in the planned locations;
6. every image has useful alt text;
7. desktop and mobile previews show no clipping or unreadable labels;
8. the hero, mechanism, exact calculation, misconception guardrail, and chapter handoff are all represented;
9. a final technical review confirms that the metaphors preserve the chapter’s computation;
10. the changelog records the Chapter 7 graphics release.

---

# Current status

- Detailed scene planning: complete.
- Reusable prop specification: complete.
- Final artwork generation: not started.
- Asset integration into the chapter: not started.
- Website and mobile review: pending final artwork.
