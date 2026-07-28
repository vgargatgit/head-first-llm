# Chapter 5 Graphics Scene Plan

## Chapter

**Chapter 5 — Meet the Information Courier**  
**Subtitle:** How Values and attention weights create the output of one head

## Status

This document is the canonical production specification for all Chapter 5 graphics.
It expands the relevant master-plan entry into a scene-by-scene brief. Final artwork belongs under `assets/chapter-05/`.

The Chapter 1–3 illustrations remain the visual reference standard.

---

# 1. Chapter visual objective

Show how the attention-weight report from Chapter 4 combines with Value vectors to produce one retrieved output row per Query. The chapter must make matching and payload visibly different.

The chapter’s visual pipeline is:

```text
current hidden states X
    -> Value projection W^V
    -> Value packages V
attention weights A + Value packages V
    -> weighted combination
    -> one-head output Z
```

The central visual lesson is:

> Queries and Keys decide where to look. Values carry the information that comes back.

---

# 2. Continuity and style locks

- Warm cream-paper or off-white background.
- Hand-drawn outlines, annotations, and purple chapter accents.
- Reuse approved recurring characters, rooms, and proportions from earlier chapters.
- Keep generated artwork separate from exact mathematical typography; add verified labels as editable overlays.
- Use speech bubbles only for teaching intuition, never as literal tensor contents.
- Provide a clean “remove the costumes” mapping from story object to mathematical operation.

- Reuse the Chapter 4 attention report as the Courier’s incoming instruction sheet.
- SAT remains the viewpoint token for the detailed weighted sum.
- The final report must visibly point toward the multi-head specialist wing in Chapter 6.

---

# 3. Reusable chapter design elements

## The Information Courier

A recurring delivery professional who collects Value packages according to an attention-weight report. The Courier does not calculate Query–Key scores.

- Carries the Chapter 4 matrix `A` as instructions.
- Collects one `V` package from every allowed position.
- Returns one weighted blended package per Query row.

## Value packages

Two-slot parcels labelled `V`, visually distinct from Query preference cards and Key profiles.

- Package contents are vectors, not importance scores.
- The attention weight appears as an external weight tag attached to the package.

## Weighted mixing table

A table where scalar weight tags scale package contents before the resulting vectors are added.

## Head-output report

A two-coordinate report labelled `z_i` for one token or `Z` for all tokens.

---

# 4. Scene inventory

The planned Chapter 5 set contains **7 artwork files**.

---

## Scene 01 — Chapter hero: the match report reaches Courier Dispatch

### Asset

```text
assets/chapter-05/01_chapter_hero_information_courier.webp
```

### Intended placement

Chapter opening, immediately after the front matter.

### Learning objective

Introduce the missing payload problem after Chapter 4 produced weights.

### Composition

- SAT arrives with the Chapter 4 attention report.
- THE, CAT, and SAT stand beside unopened Value packages.
- The Courier explains that the report says how much to collect, not what each package contains.
- A distant specialist-wing sign previews Chapter 6.

### Required labels or numerical reference

```text
SAT attention row = [0.300981, 0.389986, 0.309033]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Attention report | row of A |
| Package | Value vector v_j |
| Courier delivery | head output z_i |

### Do not show

- Do not portray the largest weight as a single winner.
- Do not place Key values inside the Value packages.

### Alt text draft

> The Information Courier receives SAT’s attention weights and prepares to collect separate Value packages from THE, CAT, and SAT.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 02 — Value projection packing rule

### Asset

```text
assets/chapter-05/02_value_projection_pipeline.webp
```

### Intended placement

Near “What a Value is” and the `V = XW^V` explanation.

### Learning objective

Show how each current hidden state becomes a Value vector before retrieval.

### Composition

- One hidden-state card enters the Courier’s packing station.
- The shared `W^V` board transforms four coordinates into a two-slot Value parcel.
- A side strip contrasts Q, K, and V as three different projections of the same state.

### Required labels or numerical reference

```text
x_t (1 x 4) · W^V (4 x 2) -> v_t (1 x 2)
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Packing rule | W^V |
| Information parcel | v_t |
| Same input visiting three workers | q_t, k_t, v_t from x_t |

### Do not show

- Do not suggest that Value means token importance.
- Do not mix token positions during the projection.

### Alt text draft

> A token hidden-state card passes through the shared Value projection and becomes a two-coordinate Value package.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 03 — Exact SAT Value calculation

### Asset

```text
assets/chapter-05/03_exact_value_calculation.webp
```

### Intended placement

Inside “Exact Value calculation for SAT.”

### Learning objective

Anchor the Value metaphor in one complete matrix multiplication.

### Composition

- Workbook-style panel with SAT’s four-coordinate state.
- The 4 x 2 Value matrix is shown clearly.
- Each output coordinate is calculated in a separate column.
- The finished parcel contains `[-0.423, 0.001]`.

### Required labels or numerical reference

```text
x_sat = [0.14, -0.22, 0.67, -0.31]
W^V =
[ 0.6, -0.2]
[ 0.1,  0.5]
[-0.4,  0.3]
[ 0.7,  0.2]

v_sat = [-0.423, 0.001]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Four input slots | x_sat |
| Packing board columns | columns of W^V |
| Two parcel slots | v_sat |

### Do not show

- Do not round the second coordinate to zero.
- Do not use generated lettering for the matrix.

### Alt text draft

> SAT’s four hidden coordinates are multiplied by the Value projection to produce the Value vector negative 0.423 and 0.001.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 04 — One shared packing rule, many Value packages

### Asset

```text
assets/chapter-05/04_shared_value_projection.webp
```

### Intended placement

Near “One Value projection, many tokens.”

### Learning objective

Show parameter sharing across positions without implying identical outputs.

### Composition

- THE, CAT, and SAT queue at the same Courier packing station.
- Each leaves with a different two-slot package.
- The three packages stack into the Value matrix.

### Required labels or numerical reference

```text
V =
[-0.220, -0.075]
[ 0.133,  0.476]
[-0.423,  0.001]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| One packing station | shared W^V within the head |
| Three packages | rows of V |

### Do not show

- Do not draw three independently learned W^V workers in one head.
- Do not merge the token rows.

### Alt text draft

> THE, CAT, and SAT use the same Value projection but leave with different Value packages that form the matrix V.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 05 — Weighted delivery for SAT

### Asset

```text
assets/chapter-05/05_weighted_value_retrieval.webp
```

### Intended placement

Inside “Exact attention output for SAT.”

### Learning objective

Show how one attention row scales and adds Value vectors.

### Composition

- Attach SAT’s three scalar weights to the three packages.
- Show each package becoming a weighted contribution.
- Add the three contribution vectors on the mixing table.
- Deliver one two-coordinate report to SAT.

### Required labels or numerical reference

```text
0.300981[-0.220, -0.075]
+ 0.389986[0.133, 0.476]
+ 0.309033[-0.423, 0.001]
= [-0.145069, 0.163369]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Weight tag | a_sat,j |
| Scaled package | a_sat,j v_j |
| Combined delivery | z_sat |

### Do not show

- Do not concatenate the three Value vectors.
- Do not compare the Query directly with the Value packages.

### Alt text draft

> SAT’s three attention weights scale the Value packages from THE, CAT, and SAT, which are added into the head output negative 0.145069 and 0.163369.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 06 — All rows at once: A times V

### Asset

```text
assets/chapter-05/06_attention_output_matrix.webp
```

### Intended placement

Near “All weighted sums in one matrix multiplication.”

### Learning objective

Connect the individual Courier story to the full matrix operation.

### Composition

- Place the 3 x 3 attention report beside the 3 x 2 Value-package matrix.
- Use row alignment to show that each row of A produces one row of Z.
- Highlight the SAT row as a continuation of Scene 05.
- Show the shape strip prominently.

### Required labels or numerical reference

```text
A (3 x 3) · V (3 x 2) = Z (3 x 2)

Z ≈
[-0.220000, -0.075000]
[-0.033945,  0.215415]
[-0.145069,  0.163369]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| One instruction row | one Query’s weights |
| Value warehouse | V |
| One outgoing report row | z_i |

### Do not show

- Do not swap A and V.
- Do not produce one sentence-level output instead of one row per Query.

### Alt text draft

> The attention matrix multiplies the Value matrix to produce one two-coordinate head-output row for each token position.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 07 — Keys are not Values; handoff to multiple heads

### Asset

```text
assets/chapter-05/07_key_vs_value_and_handoff.webp
```

### Intended placement

Chapter recap and transition to Chapter 6.

### Learning objective

Correct the main misconception and show that one completed head is only one specialist.

### Composition

- Wrong/right comparison: Key profile versus Value parcel.
- A complete one-head blueprint is shown: Q/K scoring, weights, V retrieval, Z output.
- The finished report enters a corridor with a second specialist head visible.

### Required labels or numerical reference

```text
Attention(Q,K,V) = softmax(QK^T / sqrt(d_k) + M)V
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Profile card | Key used for matching |
| Parcel | Value used for payload |
| Completed specialist report | one head output Z |

### Do not show

- Do not say Values determine attention weights.
- Do not imply one head completes the whole Transformer block.

### Alt text draft

> A correction panel distinguishes Key profiles from Value payloads and sends the completed one-head report toward a wing of multiple attention specialists.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

# 5. Chapter placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_information_courier.png` | Hero and central question |
| 2 | `02_value_projection_pipeline.png` | Story mechanism |
| 3 | `03_exact_value_calculation.png` | Exact calculation |
| 4 | `04_shared_value_projection.png` | Shared-system view |
| 5 | `05_weighted_value_retrieval.png` | Exact retrieval |
| 6 | `06_attention_output_matrix.png` | Full matrix calculation |
| 7 | `07_key_vs_value_and_handoff.png` | Misconception guardrail and handoff |

---

# 6. Numerical and conceptual source of truth

Use the Chapter 4 attention matrix unchanged. The Value projection and Value matrix are:

```text
W^V =
[ 0.6, -0.2]
[ 0.1,  0.5]
[-0.4,  0.3]
[ 0.7,  0.2]

V =
[-0.220, -0.075]
[ 0.133,  0.476]
[-0.423,  0.001]
```

The final one-head output is:

```text
Z ≈
[-0.220000, -0.075000]
[-0.033945,  0.215415]
[-0.145069,  0.163369]
```

Values are payload vectors. Attention weights are scalar mixing coefficients.

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

# Chapter 5 definition of done

Chapter 5 graphics are complete only when:

1. all 7 planned assets have approved final compositions;
2. every scene follows the approved book-wide style and character continuity;
3. all numerical overlays are checked against the chapter source;
4. images are committed under `assets/chapter-05/`;
5. `src/chapter-05.md` references the approved assets in the planned locations;
6. every image has useful alt text;
7. desktop and mobile previews show no clipping or unreadable labels;
8. the hero, mechanism, exact calculation, misconception guardrail, and chapter handoff are all represented;
9. a final technical review confirms that the metaphors preserve the chapter’s computation;
10. the changelog records the Chapter 5 graphics release.

---

# Current status

- Detailed scene planning: complete.
- Reusable prop specification: complete.
- Final artwork generation: complete for all seven approved WebP scenes.
- Asset integration into the chapter: complete.
- Website and mobile review: pending deployed preview review.
