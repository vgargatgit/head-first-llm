# Chapter 13 Graphics Scene Plan

## Chapter

**Chapter 13 — Meet the Scorekeeper**  
**Subtitle:** How cross-entropy turns next-token predictions into a training loss

## Status

This document is the canonical production specification for all Chapter 13 graphics. Final artwork belongs under `assets/chapter-13/`.

The chapter reuses the Final Audition stage from Chapter 11 and the green target cards from Chapter 12. It introduces the Scorekeeper, logarithmic penalty gauge, loss receipts, and the first correction row passed to backpropagation.

---

# 1. Chapter visual objective

Show that cross-entropy reads the probability assigned to the actual target—not merely the winning candidate—and converts that probability into a per-token negative-log loss. Valid token losses are then averaged, and softmax plus cross-entropy produces the correction row `p - y`.

```text
model probability distribution + correct target
    -> target-probability lookup
    -> negative logarithm
    -> per-token loss receipt
    -> valid-token mean
    -> batch loss
    -> p - y correction row
```

Central lesson:

> The Scorekeeper asks how much probability the model assigned to the correct target, not whether that target had the highest score.

---

# 2. Style and continuity locks

- Preserve the warm paper, hand-drawn outlines, purple accents, stable token characters, and technical workbook panels.
- Reuse the exact Chapter 11 candidate designs and probability board.
- Reuse the Chapter 12 `on` target card for the prefix `The cat sat`.
- The Scorekeeper is neutral and factual, never angry or punitive.
- Loss values are orange receipts; target cards remain green.
- The logarithm is a gauge/tool, not a separate mascot.
- The final `p - y` row is placed in a gradient envelope for the Chapter 14 Courier.

---

# 3. Reusable design elements

## Scorekeeper

A recurring examiner with a target-card holder, probability lookup pointer, log-penalty gauge, and receipt printer.

## Correct-target locator

A pointer that selects exactly one candidate’s probability from the distribution.

## Logarithmic penalty gauge

A curve or dial mapping high correct-target probability to low loss and near-zero probability to large loss.

## Loss receipt

An orange scalar receipt labelled with token position, target, probability, and `-log(p_target)`.

## Masked mean-loss calculator

A calculator accepting valid receipts while taped-over or padded positions do not enter its denominator.

## Perplexity branching gauge

A secondary gauge derived from mean loss; captions must state it is not literally vocabulary size or an exact count of choices.

---

# 4. Scene inventory

The planned Chapter 13 set contains **8 artwork files**.

---

## Scene 01 — Chapter hero: the Final Audition meets the answer key

**Asset**

```text
assets/chapter-13/01_chapter_hero_scorekeeper.png
```

**Placement:** Chapter opening.

**Learning objective:** Introduce scoring as a comparison between one model distribution and one known target.

**Composition**

- Reuse the Final Audition candidates and Chapter 11 probability tickets.
- The Answer-Key Clerk hands the green `on` card to the Scorekeeper.
- The Scorekeeper points to `on: 0.238931` even though period has the largest ticket.
- The log gauge and receipt printer are visible.

**Do not show:** the Scorekeeper selecting the largest probability or treating a wrong top prediction as a binary zero/one failure.

**Alt text draft:** The Scorekeeper receives the correct target ON and locates its 0.238931 probability on the Chapter 11 distribution.

---

## Scene 02 — Correct-target probability lookup

**Asset**

```text
assets/chapter-13/02_correct_target_probability.png
```

**Placement:** Near the negative-log-likelihood definition.

**Learning objective:** Make target lookup visually distinct from decoding.

**Composition**

- Two side-by-side lanes use the same probability board.
- Decoding lane asks `Which candidate is selected?`.
- Training lane asks `What probability belongs to the target ON?`.
- Target index `0` and one-hot conceptual card `[1,0,0,0,0]` may appear in a small technical inset.

**Remove the costumes**

| Story object | Mathematical meaning |
|---|---|
| Green target card | label `y` |
| Located ticket | `p_y` |
| Training lookup | gather correct-class probability |

**Alt text draft:** The same model distribution supports decoding and training, but training looks up the probability assigned to the known target ON.

---

## Scene 03 — Exact cross-entropy calculation

**Asset**

```text
assets/chapter-13/03_exact_cross_entropy_calculation.png
```

**Placement:** Beside the chapter’s focused Chapter 11 example.

**Learning objective:** Anchor negative log-likelihood in exact arithmetic.

**Required values**

```text
target = on
p_target = 0.238931
loss = -log(0.238931) ≈ 1.431580
```

**Composition**

- Clean workbook panel.
- The correct probability enters the logarithmic gauge.
- The orange receipt exits with `1.431580`.
- A one-hot expansion shows why only the correct-target term remains:

```text
L = -sum_j y_j log p_j = -log p_target
```

**Do not show:** log applied independently and then summed without the target selector, or logarithm base 10.

**Alt text draft:** The correct-target probability 0.238931 enters the negative natural logarithm and produces loss 1.431580.

---

## Scene 04 — Logarithmic penalty gauge

**Asset**

```text
assets/chapter-13/04_log_penalty_gauge.png
```

**Placement:** Near the intuition for negative log-likelihood.

**Learning objective:** Show the shape and asymmetry of `-log(p)`.

**Required reference points**

```text
p=1.00 -> loss=0.00
p=0.50 -> loss≈0.69
p=0.10 -> loss≈2.30
p=0.01 -> loss≈4.61
```

**Composition**

- Probability dial runs from near zero to one.
- The loss needle rises sharply as probability approaches zero.
- No finite maximum loss is drawn.
- Scorekeeper remains neutral.

**Do not show:** a linear penalty scale or negative loss values.

**Alt text draft:** A negative-log gauge shows zero loss at probability one and increasingly large loss as correct-target probability approaches zero.

---

## Scene 05 — Valid loss receipts and masked mean

**Asset**

```text
assets/chapter-13/05_masked_mean_loss_receipts.png
```

**Placement:** Across the eight-position loss example and masking discussion.

**Learning objective:** Show how per-token losses become one mean over valid targets.

**Required receipts**

```text
[0.693147,1.386294,2.302585,0.916291,
 1.609438,0.510826,0.223144,0.693147]
sum = 8.334872
valid count = 8
mean = 1.041859
```

**Composition**

- Eight valid receipts enter the calculator.
- Optional padding or ignored boxes are taped over and bypass the numerator and denominator.
- A wrong panel averages microbatches or padded widths without valid-token weighting and is crossed out.

**Do not show:** sum reduction labelled mean or ignored positions included in the denominator.

**Alt text draft:** Eight valid token-loss receipts sum to 8.334872 and divide by eight to produce mean loss 1.041859.

---

## Scene 06 — Perplexity and bits-per-token gauges

**Asset**

```text
assets/chapter-13/06_perplexity_and_bits.png
```

**Placement:** Near perplexity and bits-per-token sections.

**Learning objective:** Show derived reporting metrics and their limits.

**Required values**

```text
mean loss = 1.041859
perplexity = exp(1.041859) ≈ 2.834481
bits/token = 1.041859 / ln(2) ≈ 1.503085
```

**Composition**

- Mean-loss receipt feeds two secondary gauges.
- Perplexity appears as an effective branching metaphor with a caution label.
- Bits/token appears as an information-meter conversion.
- A comparability warning mentions tokenizer and dataset dependence.

**Do not show:** perplexity as exactly 2.834 available tokens at every step or cross-tokenizer comparisons without caution.

**Alt text draft:** Mean cross-entropy is converted into perplexity 2.834481 and 1.503085 bits per token, with comparability warnings.

---

## Scene 07 — Softmax cross-entropy creates `p - y`

**Asset**

```text
assets/chapter-13/07_probability_minus_target.png
```

**Placement:** Near the gradient derivation.

**Learning objective:** Preview how the scalar loss creates one correction signal per logit.

**Required values**

```text
p = [0.238931,0.052348,0.350118,0.053029,0.305575]
y = [1,0,0,0,0]
p-y = [-0.761069,0.052348,0.350118,0.053029,0.305575]
```

**Composition**

- Probability tickets align with a one-hot target row.
- Subtraction produces five correction slips.
- The target coordinate is negative; non-target coordinates are positive.
- The row is sealed in an envelope for the Gradient Courier.

**Do not show:** the correction row as an optimiser update or probabilities becoming negative.

**Alt text draft:** Subtracting the one-hot target from the probability row produces the five-coordinate logit gradient used by backpropagation.

---

## Scene 08 — Loss is not accuracy; handoff to the Gradient Courier

**Asset**

```text
assets/chapter-13/08_loss_accuracy_and_handoff.png
```

**Placement:** Chapter ending.

**Learning objective:** Correct metric misconceptions and begin the backward story.

**Composition**

- Two predictions can have the same top-1 correctness but different confidence and loss.
- Another pair can have different accuracy but similar loss behaviour.
- A label-smoothing inset replaces the hard one-hot target with a slightly distributed target without changing the overall scoring framework.
- The Scorekeeper hands the `p-y` envelope and batch-loss receipt to the Gradient Courier.

**Do not show:** loss as identical to accuracy, perplexity as accuracy, or the Courier updating model knobs.

**Alt text draft:** A comparison distinguishes loss from top-token accuracy before the Scorekeeper gives the correction envelope to the Gradient Courier.

---

# 5. Placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_scorekeeper.png` | Hero |
| 2 | `02_correct_target_probability.png` | Scoring mechanism |
| 3 | `03_exact_cross_entropy_calculation.png` | Exact calculation |
| 4 | `04_log_penalty_gauge.png` | Function intuition |
| 5 | `05_masked_mean_loss_receipts.png` | Batch reduction |
| 6 | `06_perplexity_and_bits.png` | Derived metrics |
| 7 | `07_probability_minus_target.png` | Gradient preview |
| 8 | `08_loss_accuracy_and_handoff.png` | Misconception and handoff |

---

# 6. Numerical source of truth

```text
p = [0.238931,0.052348,0.350118,0.053029,0.305575]
target = on, index 0
focused loss ≈ 1.431580

illustrative sequence mean loss = 1.041859
perplexity ≈ 2.834481
bits/token ≈ 1.503085

g_z = p-y = [-0.761069,0.052348,0.350118,0.053029,0.305575]
```

The focused `on` example and the separate eight-position illustration must be labelled as different forward-pass examples.

---

# 7. Production checklist

- [x] Final Audition continuity matches Chapter 11.
- [x] The Scorekeeper uses the actual target probability, not the winning candidate.
- [x] Natural logarithm and exact values are correct.
- [x] Ignored positions are excluded from both numerator and denominator.
- [x] Perplexity is presented as derived from mean cross-entropy.
- [x] `p-y` is labelled a logit gradient, not a parameter update.
- [x] Loss and accuracy remain distinct.
- [x] Mathematical typography is independently verified.
- [x] Every scene has useful technical alt text.

---

# 8. Chapter 13 definition of done

Chapter 13 graphics are complete only when all eight assets are approved, integrated under `assets/chapter-13/`, referenced by `src/chapter-13.md`, checked against the exact numerical examples, and reviewed on desktop and mobile.

---

# 9. Current status

- Detailed scene planning: complete.
- Reusable Scorekeeper and scoring-prop specifications: complete.
- Final artwork generation: complete.
- Integration: complete.
- Website review: pending final desktop and mobile render checks.
