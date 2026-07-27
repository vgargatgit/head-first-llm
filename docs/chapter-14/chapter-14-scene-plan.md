# Chapter 14 Graphics Scene Plan

## Chapter

**Chapter 14 — The Blame Travels Backward**  
**Subtitle:** How gradients connect the loss to every learned parameter

## Status

This document is the canonical production specification for all Chapter 14 graphics. Final artwork belongs under `assets/chapter-14/`.

The chapter introduces the Gradient Courier and Optimizer Engineer while reusing every forward department already established in Chapters 2–11.

---

# 1. Chapter visual objective

Show how derivatives travel backward through the vocabulary head, residual paths, MLP, attention, embeddings, and shared parameters; then distinguish gradient calculation from the optimiser’s parameter update.

```text
forward computation -> scalar loss
loss derivative
    -> vocabulary-head gradients
    -> hidden-state gradient
    -> reverse Transformer traversal
    -> parameter-gradient reports
    -> accumulation / unscaling / clipping
    -> optimiser update
```

Central lesson:

> Backpropagation calculates how the loss depends on each quantity. The optimiser uses those gradients to change persistent parameters.

---

# 2. Style and continuity locks

- Reuse the warm paper, hand-drawn linework, purple forward arrows, token characters, Final Audition, Transformer tower, residual highway, private MLP rooms, and Q/K/V departments.
- Forward computation remains solid purple and normally left to right.
- Backward gradients use dashed red-orange arrows and move right to left or downward through the reversed tower.
- The Gradient Courier carries labelled envelopes with tensor names and shapes.
- The Courier never touches parameter knobs.
- The Optimizer Engineer remains visually separate until gradients are complete.
- The scalar loss receipt stays at the Scorekeeper’s desk; derivative envelopes travel backward.
- The chapter ending opens into the larger training factory of Chapter 15.

---

# 3. Reusable design elements

## Gradient Courier

A fast recurring messenger carrying derivative envelopes labelled `g_z`, `g_h`, `g_Q`, `g_K`, `g_V`, or `dW`.

## Computational graph map

A diagram showing saved forward values and reverse derivative routes.

## Gradient form

A report whose shape matches its parameter or activation destination.

## Residual fork junction

A branch where one incoming gradient is copied to both parents of a forward addition, then accumulated at shared sources.

## Accumulation dock and clipping gate

Microbatch gradient reports stack until an optimiser step; a global-norm gate proportionally rescales an oversized bundle.

## Optimizer Engineer

A mechanic with learning-rate dial, moment notebooks, weight-decay tool, and old/new parameter display.

---

# 4. Scene inventory

The planned Chapter 14 set contains **9 artwork files**.

---

## Scene 01 — Chapter hero: the Courier runs against the arrows

**Asset**

```text
assets/chapter-14/01_chapter_hero_gradient_courier.png
```

**Placement:** Chapter opening.

**Learning objective:** Introduce reverse-mode differentiation across the familiar forward system.

**Composition**

- Pale purple forward route runs from embeddings to loss.
- The Gradient Courier begins near the Scorekeeper and runs backward with a `p-y` envelope.
- Familiar departments appear in reverse order.
- The Optimizer Engineer waits beside locked parameter controls.

**Do not show:** the scalar loss physically poured backward or parameter changes occurring before gradients arrive.

**Alt text draft:** A Gradient Courier travels backward through the familiar Transformer departments carrying derivative reports while the Optimizer Engineer waits to apply updates.

---

## Scene 02 — Forward graph and backward reports

**Asset**

```text
assets/chapter-14/02_forward_graph_backward_reports.png
```

**Placement:** Near the computational-graph and chain-rule introduction.

**Learning objective:** Show reverse-mode differentiation as local derivative messages over a saved forward graph.

**Composition**

- Forward values appear above nodes: hidden state, weights, logits, probabilities, loss.
- Reverse arrows carry gradients from child to parent.
- Multiplication, addition, activation, and softmax nodes display compact local backward rules.
- Shared-parent gradients visibly add.

**Remove the costumes**

| Visual | Mathematical meaning |
|---|---|
| Saved card | forward activation needed for backward |
| Backward envelope | derivative of loss with respect to that object |
| Joined envelopes | gradient accumulation |

**Alt text draft:** A computational graph stores forward values and sends local derivative messages backward from the loss to every contributing input.

---

## Scene 03 — Exact vocabulary-head gradients

**Asset**

```text
assets/chapter-14/03_exact_vocabulary_gradients.png
```

**Placement:** Across the output-head gradient calculation.

**Learning objective:** Calculate gradients for vocabulary weights, bias, and final hidden state from the exact Chapter 13 correction row.

**Required values**

```text
h = [-0.008859,-0.111600,1.470933,-1.350474]
g_z = [-0.761069,0.052348,0.350118,0.053029,0.305575]

dW_vocab = h^T g_z, shape 4 × 5
db = g_z
g_h = g_z W_vocab^T
    ≈ [-0.294534,0.134536,0.184198,0.158436]
```

- Show at least one checked weight-gradient entry:

```text
1.470933 × (-0.761069) ≈ -1.119482
```

**Composition**

- Outer-product board creates a 4 × 5 report.
- A separate envelope continues backward with `g_h`.
- Bias desk receives `g_z` directly.

**Do not show:** `dW` as matrix multiplication in the wrong orientation or `g_h` as the updated hidden state.

**Alt text draft:** The Chapter 13 logit gradient combines with SAT’s hidden state and vocabulary matrix to create weight, bias, and hidden-state gradients.

---

## Scene 04 — Residual gradient fork and recombination

**Asset**

```text
assets/chapter-14/04_residual_gradient_fork.png
```

**Placement:** Near the residual-backward explanation.

**Learning objective:** Show why addition sends the incoming gradient to both branches.

**Composition**

- Forward panel: `R = X + Y` at a residual junction.
- Backward panel: incoming `g_R` is copied onto the direct highway and the sublayer route.
- Later, reports reaching a shared input are added.
- Use matching envelope shapes.

**Required rule**

```text
dL/dX += g_R
dL/dY += g_R
```

**Do not show:** splitting gradient magnitude in half merely because there are two branches.

**Alt text draft:** At a residual addition, the incoming gradient is sent unchanged to both the direct path and the sublayer path, then accumulated where routes share an input.

---

## Scene 05 — Backward through the MLP

**Asset**

```text
assets/chapter-14/05_mlp_backward_path.png
```

**Placement:** Near MLP and activation backward rules.

**Learning objective:** Trace gradients through contraction, activation, and expansion in reverse order.

**Composition**

- Reuse the Chapter 8 private room.
- Courier enters through the output side.
- Leaves a `dW_2` and `db_2` form at the contraction wall.
- Passes through the activation gate using the saved pre-activation state.
- Leaves `dW_1` and `db_1`, then sends an input-gradient envelope backward.

**Do not show:** negative ReLU inputs transmitting ordinary non-zero gradient in the toy ReLU example or parameter updates inside the room.

**Alt text draft:** The Gradient Courier moves backward through the MLP’s contraction, activation, and expansion stages, leaving parameter-gradient reports at each learned layer.

---

## Scene 06 — Backward through attention

**Asset**

```text
assets/chapter-14/06_attention_backward_routes.png
```

**Placement:** Across the attention-backward discussion.

**Learning objective:** Show the major derivative branches without pretending attention has one simple reverse arrow.

**Composition**

- Start at `Z = AV`.
- One route creates gradients for Values; another creates gradients for attention weights.
- Row-softmax backward leads to masked scores.
- Score gradients split toward Q and K through `QK^T / sqrt(d_k)`.
- Q/K/V projection boards receive parameter forms and send input gradients into the residual stream.
- Each attention head retains its identity until gradients aggregate.

**Do not show:** gradients through causally masked future connections, one softmax across heads, or Q/K/V gradients all being identical.

**Alt text draft:** Attention gradients branch through Value mixing, softmax, Query–Key scores, and the separate Q, K, and V projection parameters.

---

## Scene 07 — Embedding rows and tied-parameter accumulation

**Asset**

```text
assets/chapter-14/07_embedding_and_tied_gradients.png
```

**Placement:** Near embedding gradients and weight tying.

**Learning objective:** Show sparse row updates and multiple computational uses contributing to one shared parameter gradient.

**Composition**

- Token IDs point to selected embedding-table rows.
- Repeated token IDs send multiple envelopes to the same row and those envelopes add.
- If output and input weights are tied, gradients arrive from both the entry lookup and Final Audition and accumulate in one ledger.

**Do not show:** gradients for every unused embedding row in the sparse lookup illustration or two independent updates to a tied parameter.

**Alt text draft:** Token occurrences send gradients to their embedding rows, and tied input-output weights accumulate contributions from both computational uses.

---

## Scene 08 — Accumulation, unscaling, invalid checks, and clipping

**Asset**

```text
assets/chapter-14/08_accumulation_unscaling_and_clipping.png
```

**Placement:** Across practical training-step safeguards.

**Learning objective:** Separate microbatch accumulation and numerical safeguards from backpropagation itself.

**Composition**

- Several microbatch gradient trays stack at the Accumulation Dock.
- A loss-scaling label is removed before clipping.
- An invalid-value lamp checks NaN/Inf.
- The clipping gate proportionally shrinks the full gradient bundle according to global norm.
- A `zero gradients after step` cleaning station appears downstream.

**Do not show:** clipping each coordinate independently, updating after every accumulated microbatch unless that is the configured step, or clearing gradients before the optimiser reads them.

**Alt text draft:** Microbatch gradients accumulate, are unscaled and checked, and may be proportionally clipped before one optimiser step.

---

## Scene 09 — Exact weight update and handoff to the training factory

**Asset**

```text
assets/chapter-14/09_exact_weight_update_and_handoff.png
```

**Placement:** Chapter ending.

**Learning objective:** Distinguish gradient reports from the actual parameter update and lead into the full training loop.

**Required calculation**

```text
old weight = 0.200000
gradient = -1.119482
learning rate = 0.05
new weight = 0.2 - 0.05(-1.119482)
           ≈ 0.255974
```

**Composition**

- The Courier hands the gradient form to the Optimizer Engineer.
- A misconception inset shows the Courier reaching for the knob and being stopped.
- The Engineer applies the SGD example using the learning-rate dial.
- AdamW notebooks appear as a later practical variant, clearly separate from the simple worked update.
- Updated machinery opens onto the larger training factory of Chapter 15.

**Alt text draft:** The Gradient Courier delivers a report, and the Optimizer Engineer uses it with the learning rate to change one weight from 0.2 to approximately 0.255974.

---

# 5. Placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_gradient_courier.png` | Hero |
| 2 | `02_forward_graph_backward_reports.png` | Backpropagation mechanism |
| 3 | `03_exact_vocabulary_gradients.png` | Exact calculation |
| 4 | `04_residual_gradient_fork.png` | Branch rule |
| 5 | `05_mlp_backward_path.png` | MLP reverse path |
| 6 | `06_attention_backward_routes.png` | Attention reverse path |
| 7 | `07_embedding_and_tied_gradients.png` | Shared-parameter accumulation |
| 8 | `08_accumulation_unscaling_and_clipping.png` | Practical safeguards |
| 9 | `09_exact_weight_update_and_handoff.png` | Update distinction and handoff |

---

# 6. Numerical source of truth

```text
h=[-0.008859,-0.111600,1.470933,-1.350474]
g_z=[-0.761069,0.052348,0.350118,0.053029,0.305575]
g_h≈[-0.294534,0.134536,0.184198,0.158436]
selected dW entry≈-1.119482
new weight≈0.255974
```

The full 4 × 5 vocabulary-weight gradient matrix must match `src/chapter-14.md` wherever displayed.

---

# 7. Production checklist

- [ ] Forward and backward arrows are visually distinct.
- [ ] The loss scalar is not depicted as a substance flowing backward.
- [ ] Every gradient envelope names its derivative target and shape.
- [ ] Residual gradients copy to both branches rather than divide by two.
- [ ] Causal masks block backward paths through forbidden future links.
- [ ] The Courier never updates parameters.
- [ ] The Optimizer Engineer acts only after accumulation and safeguards.
- [ ] Exact numerical panels match the chapter source.
- [ ] Every scene has useful technical alt text.

---

# 8. Chapter 14 definition of done

Chapter 14 graphics are complete only when all nine assets are approved, committed under `assets/chapter-14/`, integrated into the chapter, numerically checked, and reviewed to ensure the distinction among loss, gradient, and update remains unmistakable.

---

# 9. Current status

- Detailed scene planning: complete.
- Gradient Courier, Engineer, envelopes, docks, and gates specified.
- Final artwork generation: not started.
- Integration and website review: pending final artwork.
