# Chapter 4 Graphics Scene Plan

## Chapter

**Chapter 4 — When Queries Meet Keys**  
**Subtitle:** How dot products become scaled, masked attention weights

## Status

This document is the canonical production specification for all Chapter 4 graphics.

It expands the Chapter 4 entry in `docs/inference-loop-scene-master-plan.md` into a scene-by-scene design brief. It does not contain final artwork.

The final graphics should be stored under:

```text
assets/chapter-04/
```

The Chapter 1–3 illustrations are the visual reference standard. Chapter 4 must feel like the next room inside the same Attention Dating Service—not a new visual franchise.

---

# 1. Chapter visual objective

Chapter 4 begins with the Query and Key representations already created in Chapters 2 and 3. It must visually explain how those representations become attention weights through four ordered stages:

```text
Query–Key dot products
        ↓
scale by √d_k
        ↓
apply the causal mask
        ↓
apply softmax independently to each Query row
        ↓
attention-weight matrix A
```

The central visual lesson is:

> Queries and Keys produce compatibility weights. They do not themselves carry the information retrieved by attention.

By the end of the chapter, the reader should be able to look at the final attention matrix and understand:

- each row belongs to one Query;
- each column belongs to one candidate Key;
- each cell is one Query–Key relationship;
- future positions were removed before softmax;
- each row was normalised separately;
- every allowed row sums to one;
- the weights will be used in Chapter 5 to mix Value vectors.

---

# 2. Required production rhythm

Chapter 4 should follow the visual pattern that succeeded in Chapters 1–3.

1. **Chapter hero** — SAT reaches the Matching Desk.
2. **Story mechanism** — one Query is compared with one Key.
3. **Exact calculation** — coordinate-by-coordinate dot product.
4. **Shared-system view** — all Queries are compared with all Keys at once.
5. **Transformation stages** — scaling, masking, and row-wise softmax.
6. **Final report** — the attention-weight matrix is ready for Values.
7. **Misconception guardrail and handoff** — scores, probabilities, Values, and explanations are kept distinct.

Every major story scene must have a nearby “remove the costumes” mapping back to the mathematical operation.

---

# 3. Continuity locks from Chapters 1–3

## 3.1 Returning characters

Use the approved designs without changing their faces, body proportions, main colours, or token labels:

- **THE**
- **CAT**
- **SAT**
- **Question Coach** — cameo only
- **Profile Writer** — cameo only
- **Reader Guide**, where a guide character is already used

SAT remains the principal viewpoint character because Chapter 4 performs the most detailed score and softmax calculations for SAT.

THE and CAT must still look like token positions, not human meanings of the words. CAT should not become a literal cat, and SAT should not become a literal action scene.

## 3.2 Returning cards

- SAT’s Query card must visually match the Query card from Chapter 2.
- THE, CAT, and SAT Key cards must visually match the profile cards from Chapter 3.
- Query and Key cards must remain visually distinct from one another.
- The numerical values must be accurate wherever they are displayed.

SAT Query:

```text
q_sat = [-0.364, 0.060]
```

Available Keys:

```text
k_THE = [ 0.510, -0.152]
k_CAT = [-0.453,  0.112]
k_SAT = [ 0.371, -0.373]
```

## 3.3 Returning style

Use the established book language:

- warm cream-paper or off-white background;
- hand-drawn outlines and annotations;
- purple chapter label and major accents;
- friendly cartoon staging;
- compact technical panels beside or below story scenes;
- speech bubbles only for teaching intuition;
- explicit analogy warnings;
- clean chapter-to-chapter handoff.

Do not use:

- glossy 3D rendering;
- neon science-fiction interfaces;
- photorealistic office scenes;
- generic corporate infographic people;
- overly polished vector-stock characters;
- completely different costumes for returning characters;
- dark backgrounds that break the Chapter 1–3 visual continuity.

---

# 4. Chapter 4 visual grammar

| Concept | Visual treatment |
|---|---|
| Query | Purple `Q` preference card |
| Key | Distinct `K` searchable-profile card |
| Dot product | Two aligned coordinate tracks whose paired products flow into one addition tray |
| Raw score | Unbounded signed number on a score tile |
| Score matrix | Matching board with Query rows and Key columns |
| Scaling | A calibration station set to divide every score by the same `√d_k` value |
| Causal mask | Row-specific permission gate or curtain over future cells |
| Masked logit | Score tile either unchanged or replaced by a clearly forbidden `−∞` tile |
| Softmax | Independent probability-ticket tray for each Query row |
| Attention weight | Non-negative percentage or decimal ticket |
| Row sum | A visible `= 1` verification badge |
| Final attention matrix | Formal report labelled `A` |
| Handoff to Values | Report envelope or dispatch tube sent to the Information Courier |

## Arrow rules

- Forward computation uses solid arrows from left to right.
- Within a matrix scene, row direction should remain left to right and column direction top to bottom.
- The chapter contains no backward-gradient arrows.
- The same colour must not be used for raw scores and probabilities without an explicit label change.

## Numerical colour rules

- Negative raw scores must not be shown in danger red merely because they are negative.
- Positive scores must not be shown in success green merely because they are positive.
- Masked positions may use neutral grey, a curtain, a barred gate, or a hatched overlay.
- Probability tickets may use the established purple family with different intensities, but every number must remain readable.

---

# 5. Reusable design elements and prop sheet

These elements should be designed once and reused across the Chapter 4 scenes.

## 5.1 The Matching Desk

### Represents

The place where Query–Key compatibility is calculated.

### Appearance

- A service counter or desk inside the Attention Dating Service.
- A sign reading **MATCHING DESK**.
- A Query slot on the left.
- Candidate Key slots across the desk or on a board behind it.
- A score-output tray.
- Small continuity signs pointing back to the Question Coach and Profile Writing Office.

### Must communicate

- The desk compares representations.
- It does not retrieve Value payloads.
- It produces one score for each Query–Key pair.

### Must not communicate

- A human matchmaker making a subjective decision.
- One permanent soulmate selected for a token.
- A final next-token prediction.

---

## 5.2 Query preference card

### Required design

- Clear `Q` badge.
- Purple family consistent with Chapter 2.
- Two numerical slots for the worked head.
- Token owner label, such as `SAT QUERY`.
- Optional small head badge: `HEAD 1`.

### Required SAT values

```text
[-0.364, 0.060]
```

---

## 5.3 Key profile card

### Required design

- Clear `K` badge.
- Visually distinct from Query cards.
- Two numerical slots.
- Token owner label.
- Same head badge as the Query being compared.

### Required values

```text
THE: [ 0.510, -0.152]
CAT: [-0.453,  0.112]
SAT: [ 0.371, -0.373]
```

---

## 5.4 Coordinate-alignment rail

### Represents

The coordinate-by-coordinate multiplication inside one dot product.

### Appearance

Two horizontal tracks:

```text
Query coordinate 1  ×  Key coordinate 1
Query coordinate 2  ×  Key coordinate 2
```

The two products move into one addition tray.

### Rule

Coordinates must pair by position. Do not draw every Query coordinate connecting to every Key coordinate; that would depict a different operation.

---

## 5.5 Raw score tile

### Represents

One scalar compatibility score `s_ij`.

### Appearance

- A small signed-number card.
- Labels for Query owner and Key owner.
- No percent sign.
- No probability icon.
- May contain a negative value.

Example:

```text
SAT Query × CAT Key
raw score = 0.171612
```

---

## 5.6 Score matrix board

### Represents

```text
S = QK^T
```

### Appearance

A 3 × 3 grid with:

- Query labels on rows;
- Key labels on columns;
- one raw score in each cell;
- a highlighted SAT row;
- shape badges for `Q: 3 × 2`, `K^T: 2 × 3`, and `S: 3 × 3`.

Required values:

```text
S =
[-0.078482,  0.070723, -0.045545]
[-0.088826,  0.064447, -0.229421]
[-0.194760,  0.171612, -0.157424]
```

---

## 5.7 Score calibrator

### Represents

Division by `√d_k` before masking and softmax.

### Appearance

- A mechanical calibration station, not a moral judgement device.
- Dial labelled `d_k = 2`.
- Divider setting labelled `√2 ≈ 1.414214`.
- All score tiles pass through the same setting.
- The order of the tiles remains unchanged.

### Technical message

> Stabilise score magnitude; do not punish or reward any semantic match.

---

## 5.8 Causal permission gate

### Represents

The row-specific causal mask.

### Appearance

Three lanes:

```text
THE Query: THE allowed | CAT blocked | SAT blocked
CAT Query: THE allowed | CAT allowed | SAT blocked
SAT Query: THE allowed | CAT allowed | SAT allowed
```

Use gates, curtains, or permission stamps to form a lower-triangular pattern.

### Critical rule

The same SAT Key must be:

- blocked for THE’s Query;
- blocked for CAT’s Query;
- available for SAT’s Query.

This shows that masking changes the permission relationship, not the Key card itself.

---

## 5.9 Softmax ticket counter

### Represents

Independent row-wise softmax.

### Appearance

- One tray per Query row.
- Each tray accepts only that row’s allowed masked logits.
- Exponential tokens may appear as an intermediate visual.
- A shared denominator bowl exists inside each row tray.
- The output is a set of non-negative tickets summing to one.

### Critical rule

Do not use one giant tray for all nine matrix cells.

---

## 5.10 Attention-weight report

### Represents

The completed matrix `A`.

Required values:

```text
A ≈
[1.000000, 0,        0       ]
[0.472931, 0.527069, 0       ]
[0.300981, 0.389986, 0.309033]
```

### Appearance

- Formal report or board labelled `ATTENTION WEIGHTS — HEAD 1`.
- Query rows and Key columns remain visible.
- Every row has a verification seal showing `sum = 1`.
- Masked cells contain exact zero tickets.
- SAT’s CAT cell is highlighted as the largest SAT weight without implying exclusive selection.

---

## 5.11 Courier handoff envelope

### Represents

The completed weight report being passed to Chapter 5.

### Appearance

- Envelope or dispatch tube labelled `TO: INFORMATION COURIER`.
- Contains the attention matrix, not Value vectors.
- A small empty parcel silhouette can preview that Value packages are still missing.

---

# 6. Artwork production strategy

## 6.1 Separate illustration from exact typography

Image-generation systems frequently distort mathematical text. For Chapter 4:

1. Generate or draw the character and environment base.
2. Reserve clean spaces for cards, matrices, labels, and captions.
3. Add exact mathematical text as a verified vector or layout overlay.
4. Export the final composite only after numerical review.

Critical values must never exist only as unverified generated text.

## 6.2 Output package

For each scene, retain:

- an editable source where practical;
- a high-resolution final PNG used by the chapter;
- readable alt text;
- the approved scene brief;
- any overlay text as editable text rather than flattened generated lettering where possible.

## 6.3 Recommended canvas roles

| Scene type | Recommended ratio | Use |
|---|---:|---|
| Chapter hero | 16:9 | Wide opening illustration |
| Story mechanism | 3:2 or 16:9 | Inline narrative panel |
| Exact calculation | 4:3 or 3:2 | Workbook-style technical panel |
| Matrix or mask board | 4:3 | Grid readability |
| Misconception panel | 3:2 | Side-by-side wrong/right comparison |

All scenes must remain legible at the website’s mobile reading width.

---

# 7. Scene inventory and detailed specifications

The planned Chapter 4 set contains **eight artwork files**.

---

## Scene 01 — Chapter hero: SAT reaches the Matching Desk

### Asset

```text
assets/chapter-04/01_chapter_hero_matching_desk.png
```

### Intended placement

Immediately after the Chapter 4 front matter and before “The question this chapter answers.”

### Learning objective

Introduce the chapter’s new problem: SAT has a Query and the visible tokens have Keys, but compatibility has not yet been calculated.

### Main composition

- Wide view of the **Matching Desk** inside the familiar Attention Dating Service.
- SAT approaches from the left holding the approved Query card.
- THE, CAT, and SAT Key/profile cards appear in three candidate slots behind the desk.
- A blank raw-score tray sits below each candidate slot.
- The Question Coach appears in a small background doorway marked `Q COMPLETE`.
- The Profile Writer appears near another doorway marked `K PROFILES READY`.
- The Reader Guide may point to the three score trays.
- A distant sign or dispatch tube marked `VALUES — NEXT DEPARTMENT` previews that payload retrieval has not started.

### Suggested story text

SAT:

> “I know what I am looking for. How well does my Query match each profile?”

Desk sign:

> “One raw score per Query–Key pair.”

### Required visible labels

```text
SAT Query: [-0.364, 0.060]
THE Key
CAT Key
SAT Key
MATCHING DESK
```

The exact Key numbers may appear on the cards when legible; otherwise they are introduced in Scene 02 and Scene 03.

### Remove the costumes

| Story element | Transformer concept |
|---|---|
| SAT’s preference card | Query vector `q_sat` |
| Candidate profile cards | Key vectors `k_j` |
| Matching Desk | Dot-product calculation |
| Blank score tray | Raw compatibility score `s_sat,j` |

### Do not show

- a winning candidate already selected;
- probabilities or percentages;
- Value packages being combined;
- future masking as the main topic yet;
- romantic or literal dating imagery that overwhelms the technical story.

### Alt text draft

> SAT arrives at the Attention Dating Service Matching Desk with a Query card while THE, CAT, and SAT Key profile cards wait to be compared, producing one raw score per candidate.

### Acceptance checks

- Character continuity matches Chapters 1–3.
- Query and Key cards are unmistakably different.
- No score is presented as a probability.
- The scene clearly poses the chapter question.

---

## Scene 02 — One Query–Key dot product, coordinate by coordinate

### Asset

```text
assets/chapter-04/02_query_key_dot_product.png
```

### Intended placement

After the first exact SAT Query–Key calculations in “Stage 1: Query–Key dot products.”

### Learning objective

Show precisely how a two-coordinate Query and a two-coordinate Key produce one scalar score.

### Primary worked pair

Use SAT’s Query and CAT’s Key because this produces the largest raw score in SAT’s row.

```text
q_sat = [-0.364, 0.060]
k_CAT = [-0.453, 0.112]
```

### Exact calculation

```text
(-0.364)(-0.453) + (0.060)(0.112)
= 0.164892 + 0.006720
= 0.171612
```

### Main composition

- Workbook-style panel with a small story strip at the top.
- SAT places the two-coordinate Query card on the upper alignment rail.
- CAT’s Key card sits on the lower rail.
- Coordinate 1 pairs only with coordinate 1.
- Coordinate 2 pairs only with coordinate 2.
- Product tags flow into one addition tray.
- One raw-score tile exits: `0.171612`.
- A compact side callout shows SAT’s other raw scores:

```text
SAT × THE = -0.194760
SAT × CAT =  0.171612
SAT × SAT = -0.157424
```

### Visual hierarchy

1. aligned coordinate pairs;
2. two products;
3. sum;
4. one scalar result.

### Required shape cue

```text
(1 × 2) dot (1 × 2) → scalar
```

Do not present the Key as a column matrix unless the transpose is explicitly shown in the technical panel.

### Remove the costumes

| Visual action | Mathematical operation |
|---|---|
| Pair matching coordinates | Element-wise multiplication within the dot product |
| Products entering the tray | Sum over Query/Key width |
| One outgoing tile | Scalar raw score `s_ij` |

### Misconception guardrail embedded in scene

A small neutral note:

> “Negative scores are allowed. Raw scores are not probabilities.”

### Do not show

- every coordinate connecting to every other coordinate;
- a percent sign on `0.171612`;
- a happy face for a positive score or sad face for a negative score;
- scaling, masking, or softmax mixed into this calculation.

### Alt text draft

> SAT’s two Query coordinates are multiplied with CAT’s corresponding two Key coordinates and added to produce the raw compatibility score 0.171612.

### Acceptance checks

- Arithmetic is exact.
- Coordinate pairings are correct.
- Result is labelled raw score, not probability.
- Panel remains readable on mobile.

---

## Scene 03 — Every Query meets every Key

### Asset

```text
assets/chapter-04/03_full_score_matrix.png
```

### Intended placement

After “All comparisons in one matrix multiplication” and before or beside “Follow the shapes.”

### Learning objective

Move from one dot product to the complete `QK^T` score matrix.

### Main composition

Use a three-zone technical illustration.

#### Zone A — Query rows

```text
Q =
[-0.167, -0.044]
[ 0.013,  0.628]
[-0.364,  0.060]
```

Rows labelled THE, CAT, SAT.

#### Zone B — Transposed Key columns

```text
K^T =
[ 0.510, -0.453,  0.371]
[-0.152,  0.112, -0.373]
```

Columns labelled THE, CAT, SAT.

#### Zone C — Score grid

```text
S =
[-0.078482,  0.070723, -0.045545]
[-0.088826,  0.064447, -0.229421]
[-0.194760,  0.171612, -0.157424]
```

### Story layer

- THE, CAT, and SAT each submit a Query card on the left side.
- The same three candidate Key cards appear across the top.
- Every row–column intersection produces one score tile.
- SAT’s row is outlined or highlighted because it continues the running example.

### Shape strip

```text
Q:   3 × 2
K^T: 2 × 3
S:   3 × 3

(3 × 2)(2 × 3) = 3 × 3
```

The shared inner dimension `2` should be visually paired and then disappear from the result shape.

### Reading legend

```text
row i    = Query made by position i
column j = Key belonging to position j
cell i,j = raw compatibility score
```

### Remove the costumes

| Board element | Tensor meaning |
|---|---|
| Query lane | One row of `Q` |
| Candidate profile column | One column of `K^T` |
| Intersection score | One entry of `S = QK^T` |

### Do not show

- a single global Query;
- one score per token rather than one score per pair;
- the matrix as symmetric—`Q` and `K` use different projections, so symmetry is not guaranteed;
- any masking or probability normalisation yet.

### Alt text draft

> A three-by-three board compares Query rows for THE, CAT, and SAT with Key columns for THE, CAT, and SAT, producing the raw score matrix Q times K-transpose.

### Acceptance checks

- Row and column labels are unambiguous.
- All nine values match the chapter.
- SAT’s row is correctly associated with SAT’s Query.
- Shape calculation is correct.

---

## Scene 04 — Score calibration by √d_k

### Asset

```text
assets/chapter-04/04_scale_by_sqrt_dk.png
```

### Intended placement

Inside “Stage 2: why divide by √d_k?” after the reason for scaling and near the scaled matrix.

### Learning objective

Explain that scaling stabilises the magnitude of logits entering softmax without changing their order.

### Main composition

- Raw score board enters the **Calibration Station**.
- Dial reads:

```text
d_k = 2
√d_k = √2 ≈ 1.414214
```

- Every cell passes through the same divisor.
- Scaled score board exits.
- A small ranking strip compares SAT’s row before and after:

```text
Before: CAT > SAT > THE
After:  CAT > SAT > THE
```

### Required scaled matrix

```text
S_scaled ≈
[-0.055495,  0.050009, -0.032205]
[-0.062809,  0.045571, -0.162225]
[-0.137716,  0.121348, -0.111316]
```

### Supporting intuition panel

Show two softmax input gauges:

- very large-magnitude logits pushing toward an overly sharp distribution;
- calibrated logits remaining in a more numerically useful range.

Keep this generic. Do not claim that scaling always makes attention broad or that sharp attention is always bad.

### Required caption

> “Numerical stabiliser, not semantic penalty.”

### Remove the costumes

| Calibration story | Mathematical operation |
|---|---|
| Dial set by head width | Compute `√d_k` |
| Every tile passes through same station | Divide every score by the same positive value |
| Ranking preserved | Positive uniform scaling preserves order |

### Do not show

- clipping or truncating selected scores;
- different divisors for different candidates;
- scaling after softmax;
- the calibrator deciding which token is important;
- `√d_model` instead of `√d_k`.

### Alt text draft

> The complete raw score matrix passes through a calibrator that divides every score by square root of the Query–Key width, preserving score order while reducing magnitude.

### Acceptance checks

- Dial uses `d_k = 2`, not model width 4.
- All output values match the chapter.
- Relative ranking is visibly preserved.
- Scene does not imply semantic punishment.

---

## Scene 05 — The causal permission gate

### Asset

```text
assets/chapter-04/05_causal_mask_by_row.png
```

### Intended placement

Inside “Stage 3: causal masking,” before or next to the masked-logit matrix.

### Learning objective

Show that causal visibility is row-specific and is enforced before softmax.

### Main composition

Use three horizontal Query lanes with the same three Key booths.

#### THE Query lane

```text
THE Key: allowed
CAT Key: blocked
SAT Key: blocked
```

#### CAT Query lane

```text
THE Key: allowed
CAT Key: allowed
SAT Key: blocked
```

#### SAT Query lane

```text
THE Key: allowed
CAT Key: allowed
SAT Key: allowed
```

A triangular permission board should appear alongside the lanes:

```text
M =
[0, −∞, −∞]
[0,  0, −∞]
[0,  0,  0]
```

### Required masked-logit matrix

```text
L ≈
[-0.055495,       −∞,       −∞]
[-0.062809,  0.045571,       −∞]
[-0.137716,  0.121348, -0.111316]
```

### Key visual idea

SAT’s Key card itself must remain identical in all three lanes. Only the gate state changes.

### Embedded before/after warning

Small comparison:

```text
Correct: mask logits → softmax
Wrong:   softmax → erase probabilities
```

The wrong side should visibly show a broken row total after erasing one already-normalised probability.

### Remove the costumes

| Gate story | Mathematical operation |
|---|---|
| Open gate | Add 0 to an allowed logit |
| Closed future gate | Add −∞ to a forbidden logit |
| Same Key, different row permission | Causal masking depends on positions i and j |

### Do not show

- future Keys deleted globally;
- masked Key profiles becoming inherently bad;
- one mask shared visually as the same open/closed state for every Query row;
- mask applied after probabilities are already finalised;
- SAT blocked from itself.

### Alt text draft

> Three Query lanes form a lower-triangular causal permission pattern: THE may use only THE, CAT may use THE and CAT, and SAT may use all three Keys.

### Acceptance checks

- Lower-triangular visibility is correct.
- Mask is applied before softmax.
- The same Key may be blocked in one row and allowed in another.
- `−∞` is visually distinguishable from an ordinary negative score.

---

## Scene 06 — Row-wise softmax ticket counter

### Asset

```text
assets/chapter-04/06_rowwise_softmax.png
```

### Intended placement

Inside “Stage 4: softmax turns logits into weights,” after the exact CAT and SAT calculations.

### Learning objective

Show that softmax is applied independently to each Query row and converts allowed logits into non-negative weights summing to one.

### Main composition

Use three separate trays, one per Query row.

#### THE tray

Input:

```text
[-0.055495, −∞, −∞]
```

Output:

```text
[1.000000, 0, 0]
```

#### CAT tray — exact worked calculation

Input logits:

```text
[-0.062809, 0.045571]
```

Exponentials:

```text
[0.939122, 1.046625]
```

Denominator:

```text
1.985747
```

Output tickets:

```text
[0.472931, 0.527069, 0]
```

#### SAT tray — exact worked calculation

Input logits:

```text
[-0.137716, 0.121348, -0.111316]
```

Exponentials:

```text
[0.871346, 1.129018, 0.894656]
```

Denominator:

```text
2.895020
```

Output tickets:

```text
[0.300981, 0.389986, 0.309033]
```

### Visual metaphor

- Allowed logits become weighted tickets.
- The row’s denominator bowl collects only that row’s exponentials.
- Each row exits with a `SUM = 1` seal.
- Masked positions receive exactly zero tickets.

### Stable-softmax supporting note

A small technical callout may show:

```text
subtract row maximum before exponentiating
```

Caption:

> “Same probabilities, safer arithmetic.”

This callout must remain secondary to the main row-wise lesson.

### Remove the costumes

| Ticket counter | Mathematical operation |
|---|---|
| One tray per Query | Softmax independently by row |
| Exponential tokens | `exp(logit)` |
| Row denominator bowl | Sum of exponentials for that row |
| Ticket share | Attention weight `a_ij` |

### Do not show

- one denominator shared across all rows;
- probabilities before causal masking;
- negative probability tickets;
- tickets that do not sum to one;
- a winner-take-all selection step.

### Alt text draft

> Three independent softmax trays convert each Query row’s allowed logits into attention weights that sum to one, with masked positions receiving zero.

### Acceptance checks

- CAT and SAT arithmetic is accurate.
- Row independence is visually unmistakable.
- All output weights are non-negative.
- Zero-weight masked positions remain in the correct columns.

---

## Scene 07 — Complete attention-weight report and handoff

### Asset

```text
assets/chapter-04/07_attention_weight_matrix.png
```

### Intended placement

After “The complete attention-weight matrix” and before the chapter’s final conceptual cautions or Chapter 5 transition.

### Learning objective

Consolidate the complete matrix `A` and show exactly what it controls next.

### Main composition

- Formal report board labelled:

```text
ATTENTION WEIGHTS — HEAD 1
A = softmax(QK^T / √d_k + M)
```

- THE, CAT, and SAT Query characters stand beside their report rows.
- Candidate Key labels remain above the columns.
- Each cell displays its final weight.
- Row-sum seals appear at the right.

Required board:

```text
             Key THE   Key CAT   Key SAT   Row sum
Query THE    1.000000  0         0         1
Query CAT    0.472931  0.527069  0         1
Query SAT    0.300981  0.389986  0.309033  1
```

### SAT story emphasis

- CAT has SAT’s largest weight: `0.389986`.
- THE and SAT still receive substantial allowed weight.
- Do not portray CAT as the one chosen match.
- A caption states:

> “SAT receives a distribution, not one winner.”

### Handoff composition

The report enters an envelope or dispatch tube addressed to the Information Courier.

A sign reads:

> “Use these weights to scale and combine Value packages.”

Value packages should appear only as silhouettes or unopened parcels. Chapter 5 will define them.

### Remove the costumes

| Final report element | Transformer meaning |
|---|---|
| One report row | One Query’s distribution over allowed Key positions |
| One report cell | Scalar attention weight `a_ij` |
| Dispatch to Courier | Matrix `A` will multiply Value matrix `V` |

### Do not show

- Value vectors already inside the report;
- `A` as the final contextual output;
- rows or columns swapped;
- attention weights as causal proof or complete interpretability;
- an average across Query rows.

### Alt text draft

> The final three-by-three attention matrix gives one row-wise distribution for each Query, and the report is sent to the Information Courier to weight Value packages in the next chapter.

### Acceptance checks

- All nine entries are correct.
- Rows and columns are labelled correctly.
- Each row visibly sums to one.
- Handoff clearly points to Values without prematurely explaining them.

---

## Scene 08 — Misconception guardrails: what the score report is not

### Asset

```text
assets/chapter-04/08_scores_are_not_payloads_or_explanations.png
```

### Intended placement

Near “Scores are not explanations” or as the final recap panel before the Chapter 5 handoff.

### Learning objective

Prevent four common mental-model errors before Values are introduced.

### Composition

A four-panel “Wrong / Correct” board.

#### Panel A — Raw score versus probability

Wrong:

```text
raw score 0.171612 = 17.1612%
```

Correct:

```text
raw score → scale → mask → row-wise softmax → probability weight
```

#### Panel B — Negative score versus rejection

Wrong:

> “Negative means forbidden or useless.”

Correct:

> “A negative allowed logit can receive non-zero weight depending on the other logits in its row.”

#### Panel C — Key versus Value

Wrong:

> “The Key card is the information copied into SAT.”

Correct:

> “The Key participates in matching. A separate Value package carries the payload.”

#### Panel D — Attention weight versus full explanation

Wrong:

> “The largest weight completely explains the model’s final prediction.”

Correct:

> “The weight describes one head, one layer, one Query row, and the contribution of Value vectors to that head’s output.”

### Handoff strip

At the bottom:

```text
Attention report A
        ↓
Information Courier collects V packages
        ↓
Z = AV
```

Do not calculate `Z` here; only preview the next operation.

### Style

- Same warm-paper misconception panels used elsewhere in the book.
- Wrong examples use a restrained cross-out, not aggressive alarm graphics.
- Correct examples use the standard purple technical accent.

### Alt text draft

> Four correction panels distinguish raw scores from probabilities, negative scores from masking, Keys from Value payloads, and attention weights from complete model explanations.

### Acceptance checks

- Every correction is technically accurate.
- The panel does not introduce Chapter 5 calculations prematurely.
- The final arrow leads naturally to the Information Courier.

---

# 8. Chapter placement map

| Order | Asset | Chapter section | Role |
|---:|---|---|---|
| 1 | `01_chapter_hero_matching_desk.png` | Chapter opening | Hero and central question |
| 2 | `02_query_key_dot_product.png` | Stage 1 | Exact one-pair calculation |
| 3 | `03_full_score_matrix.png` | All comparisons / shapes | Shared-system matrix view |
| 4 | `04_scale_by_sqrt_dk.png` | Stage 2 | Numerical calibration |
| 5 | `05_causal_mask_by_row.png` | Stage 3 | Row-specific visibility |
| 6 | `06_rowwise_softmax.png` | Stage 4 | Exact probability normalisation |
| 7 | `07_attention_weight_matrix.png` | Complete matrix | Final report and Chapter 5 handoff |
| 8 | `08_scores_are_not_payloads_or_explanations.png` | Conceptual cautions / ending | Misconception guardrail |

Scene 07 and Scene 08 may be reversed in the final chapter layout if the prose places “scores are not explanations” before the final handoff. The narrative requirement is that the last visible direction points toward the Information Courier and Values.

---

# 9. Story-to-math mapping

| Story object | Mathematical object |
|---|---|
| SAT’s preference card | `q_sat` |
| Token profile card | `k_j` |
| Matching Desk | Dot product `q_i · k_j` |
| Raw score tile | `s_ij` |
| Complete matching board | `S = QK^T` |
| Calibration Station | Divide by `√d_k` |
| Permission gate | Add causal mask `M` |
| Masked score board | `L = QK^T / √d_k + M` |
| Ticket counter | Row-wise softmax |
| Ticket share | `a_ij` |
| Final report | Attention matrix `A` |
| Courier dispatch envelope | Handoff from `A` to Value mixing `AV` |

---

# 10. Numerical reference sheet

This section is the source of truth for labels added to the Chapter 4 graphics.

## Query matrix

```text
Q =
[-0.167, -0.044]
[ 0.013,  0.628]
[-0.364,  0.060]
```

## Key matrix

```text
K =
[ 0.510, -0.152]
[-0.453,  0.112]
[ 0.371, -0.373]
```

## Raw score matrix

```text
S = QK^T =
[-0.078482,  0.070723, -0.045545]
[-0.088826,  0.064447, -0.229421]
[-0.194760,  0.171612, -0.157424]
```

## Scaling factor

```text
d_k = 2
√d_k = √2 ≈ 1.414214
```

## Scaled scores

```text
S_scaled ≈
[-0.055495,  0.050009, -0.032205]
[-0.062809,  0.045571, -0.162225]
[-0.137716,  0.121348, -0.111316]
```

## Causal mask

```text
M =
[0, −∞, −∞]
[0,  0, −∞]
[0,  0,  0]
```

## Masked logits

```text
L ≈
[-0.055495,       −∞,       −∞]
[-0.062809,  0.045571,       −∞]
[-0.137716,  0.121348, -0.111316]
```

## CAT softmax

```text
allowed logits = [-0.062809, 0.045571]
exponentials   = [ 0.939122, 1.046625]
sum            = 1.985747
weights        = [ 0.472931, 0.527069, 0]
```

## SAT softmax

```text
allowed logits = [-0.137716, 0.121348, -0.111316]
exponentials   = [ 0.871346, 1.129018,  0.894656]
sum            = 2.895020
weights        = [ 0.300981, 0.389986,  0.309033]
```

## Final attention matrix

```text
A ≈
[1.000000, 0,        0       ]
[0.472931, 0.527069, 0       ]
[0.300981, 0.389986, 0.309033]
```

All graphics must use these rounded values consistently. Do not mix values calculated from a higher-precision hidden source with the chapter’s displayed rounded matrices unless the chapter text is intentionally revised at the same time.

---

# 11. Generation and review checklist for each scene

Before approving a scene, verify:

## Visual continuity

- [ ] Warm cream-paper background matches Chapters 1–3.
- [ ] Returning characters retain approved designs.
- [ ] Query and Key cards match their earlier chapters.
- [ ] Purple accents and hand-drawn linework remain consistent.
- [ ] Scene feels like another department inside the same Attention Dating Service.

## Technical accuracy

- [ ] Query rows and Key columns are not reversed.
- [ ] All displayed values match the numerical reference sheet.
- [ ] Raw scores have no percent signs.
- [ ] Scaling uses `√d_k`, with `d_k = 2`.
- [ ] Masking happens before softmax.
- [ ] Causal visibility is lower triangular.
- [ ] Softmax is row-wise.
- [ ] Every final row sums to one.
- [ ] Masked entries receive zero probability.
- [ ] Keys are not presented as Value payloads.
- [ ] Attention weights are not presented as complete explanations.

## Readability

- [ ] Critical text is added as verified typography, not trusted generated lettering.
- [ ] Labels remain readable at mobile width.
- [ ] The main idea is visible before the reader studies small arithmetic.
- [ ] Dense equations are placed in clean workbook panels, not busy character scenes.
- [ ] Alt text describes the technical action rather than only the decorative setting.

## Narrative flow

- [ ] Scene has one primary learning objective.
- [ ] Input and output objects are visually distinct.
- [ ] The next scene follows naturally from the current output.
- [ ] Final Chapter 4 imagery points to the Information Courier and Values.

---

# 12. Chapter 4 definition of done

Chapter 4 graphics are complete only when:

1. all eight planned assets have approved final compositions;
2. every asset follows the Chapter 1–3 style and character continuity;
3. all numerical overlays have been independently checked against this document and `src/chapter-04.md`;
4. the images are committed under `assets/chapter-04/`;
5. `src/chapter-04.md` references the approved assets in the planned locations;
6. every image has useful alt text;
7. desktop and mobile previews show no overlap, clipping, or unreadable text;
8. the hero, story mechanism, exact calculations, shared-system view, misconception guardrail, and Chapter 5 handoff are all represented;
9. a final review confirms that no image implies that Queries or Keys themselves carry the retrieved information;
10. the changelog records the Chapter 4 graphics release.

---

# 13. Current status

- Detailed scene planning: complete.
- Reusable Chapter 4 prop specification: complete.
- Final artwork generation: complete for the full infographic and eight standalone scenes.
- Asset integration into `src/chapter-04.md`: complete.
- Mobile and website review: pending deployed preview review.
