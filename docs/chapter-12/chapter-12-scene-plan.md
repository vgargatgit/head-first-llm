# Chapter 12 Graphics Scene Plan

## Chapter

**Chapter 12 — The Answer Key Moves One Step Ahead**  
**Subtitle:** How token sequences become next-token training examples

## Status

This document is the canonical production specification for all Chapter 12 graphics. Final artwork belongs under `assets/chapter-12/`.

Chapter 12 is the visual bridge from inference into training. It must reuse the Final Audition, token characters, causal gate, and probability boards already established in Chapters 1–11.

---

# 1. Chapter visual objective

Show how one token sequence supplies both model inputs and next-token labels, how all prediction positions can be evaluated in one causal forward pass, and why teacher forcing does not reveal future tokens to attention.

```text
complete token sequence
    -> input row without final token
    -> target row shifted one step ahead
    -> causal forward pass
    -> one prediction distribution per input position
    -> targets delivered only to scoring path
```

Central lesson:

> The label at each position is the token that follows it; the model still predicts causally without seeing future positions.

---

# 2. Style and continuity locks

- Use the warm paper, hand-drawn outlines, purple accents, stable token characters, and compact calculation panels established in Chapters 1–3.
- Reuse the Final Audition probability boards from Chapter 11.
- Reuse the causal permission curtain from Chapter 4.
- Introduce the Answer-Key Clerk as a recurring training character with stable clothing, silhouette, and green target cards.
- Targets use green; ordinary forward computation remains purple.
- The Clerk delivers answers to the scoring lane after predictions exist, never to token attention.
- Distinguish causal, padding, loss, and document-boundary masks with different physical props.
- The final handoff goes to the Scorekeeper in Chapter 13.

---

# 3. Reusable design elements

## Answer-Key Clerk

A neutral records clerk standing beside parallel input and target conveyor belts.

## Shifted target rail

A second token rail moved exactly one position ahead of the input rail.

## Green target cards

One correct-answer card for each scored prediction row.

## Mask prop family

- causal mask: one-way future curtain;
- padding mask: unused-seat covers;
- loss mask: grey tape over score boxes;
- document boundary: divider wall between packed sequences.

## Parallel prediction gallery

A row of Final Audition probability boards, one for each input position.

---

# 4. Scene inventory

The planned Chapter 12 set contains **7 artwork files**.

---

## Scene 01 — Chapter hero: the training classroom

**Asset**

```text
assets/chapter-12/01_chapter_hero_answer_key_clerk.png
```

**Placement:** Chapter opening.

**Learning objective:** Introduce the same sequence as both input material and source of next-token labels.

**Composition**

- The token sequence enters on a long rail:

```text
<BOS> | The | cat | sat | on | the | mat | . | <EOS>
```

- The Answer-Key Clerk stands between input and target rails.
- The target rail is visibly shifted one position ahead.
- SAT and other token characters remain behind the causal curtain from their future tokens.
- A Scorekeeper desk appears in the distance.

**Do not show:** the Clerk whispering future tokens into the model or one isolated training example per separate model run.

**Alt text draft:** The Answer-Key Clerk aligns a token sequence into an input rail and a target rail shifted one position ahead while the causal curtain remains closed.

---

## Scene 02 — Shifted inputs and targets

**Asset**

```text
assets/chapter-12/02_shifted_inputs_and_targets.png
```

**Placement:** Near the first input/target alignment explanation.

**Learning objective:** Make every input-to-next-token pairing readable without prose.

**Required alignment**

```text
INPUT:  <BOS> | The | cat | sat | on | the | mat | .
TARGET: The   | cat | sat | on  | the| mat | .   | <EOS>
```

**Composition**

- Vertical alignment arrows connect each input position to the token directly below it in the target row.
- Position labels run from 0 through 7.
- The target card is visually separate from the input token’s current state.

**Remove the costumes**

| Story object | Mathematical meaning |
|---|---|
| Upper rail | input IDs `X` |
| Shifted lower rail | labels `Y` |
| Vertical pairing | next-token target for that position |

**Alt text draft:** Eight input tokens are aligned with the eight tokens that follow them, forming next-token labels shifted one position ahead.

---

## Scene 03 — Exact token-ID alignment

**Asset**

```text
assets/chapter-12/03_exact_target_alignment.png
```

**Placement:** Beside the chapter’s token-ID example.

**Learning objective:** Anchor the rail metaphor in the exact integer tensors.

**Required values**

```text
X_ids = [0,1,2,3,4,5,6,7]
Y_ids = [1,2,3,4,5,6,7,8]
shape: B × T after batching
```

**Composition**

- Workbook panel with tokens, IDs, inputs, and labels.
- Highlight the `sat -> on` row.
- Include a valid-target counter of eight positions.

**Do not show:** one-hot vectors as the stored labels unless explicitly introduced as a conceptual representation.

**Alt text draft:** The input ID sequence zero through seven aligns with target IDs one through eight, including SAT’s target ON.

---

## Scene 04 — One forward pass, many prediction rows

**Asset**

```text
assets/chapter-12/04_parallel_training_rows.png
```

**Placement:** Near the explanation that all rows are computed together.

**Learning objective:** Show parallel training computation without suggesting future-token leakage.

**Composition**

- The full input matrix passes through one Transformer stack.
- Eight Final Audition boards emerge simultaneously, one per input position.
- Each row has a different visible causal prefix.
- Green target cards wait outside the forward path and reach only the later scoring lane.

**Required shape strip**

```text
input IDs: B × T
hidden states: B × T × d_model
logits: B × T × |V|
labels: B × T
```

**Do not show:** eight separate model replicas or targets entering the attention stack.

**Alt text draft:** One causal Transformer forward pass produces a vocabulary-distribution row for every input position while future tokens remain masked.

---

## Scene 05 — Four masks are not interchangeable

**Asset**

```text
assets/chapter-12/05_mask_types_are_not_interchangeable.png
```

**Placement:** Across the masking sections.

**Learning objective:** Separate four different masking purposes.

**Composition**

| Mask | Prop | Purpose |
|---|---|---|
| Causal | future curtain | block attention to later positions |
| Padding | unused-seat cover | exclude padded token positions |
| Loss | grey score-box tape | omit labels from loss |
| Document boundary | divider wall | prevent unintended packed-document interaction |

- Use a four-panel comparison with consistent token lanes.
- Each panel includes a short “acts on” label: attention logits, token positions, loss terms, or packed boundaries.

**Do not show:** one universal mask object or loss masking as deletion of prompt context.

**Alt text draft:** Four panels distinguish causal, padding, loss, and document-boundary masks by their different locations and purposes.

---

## Scene 06 — Packed documents with boundaries

**Asset**

```text
assets/chapter-12/06_packed_documents_with_boundaries.png
```

**Placement:** Near document chunking and packing.

**Learning objective:** Show efficient packing without accidentally teaching cross-document continuity.

**Composition**

- Several short sequences share one context container.
- EOS/BOS markers and divider walls remain visible.
- Padding is reduced.
- One variant permits ordinary packed continuation; another explicitly masks cross-document attention according to the chosen training design.
- Labels never cross a boundary unless the dataset construction intentionally permits it.

**Do not show:** documents merged as one semantic narrative or labels jumping from the end of one document to the beginning of another without a boundary token/design decision.

**Alt text draft:** Short documents share one context window while explicit boundary markers and masks control whether attention or labels may cross between them.

---

## Scene 07 — Teacher forcing does not leak answers; handoff to the Scorekeeper

**Asset**

```text
assets/chapter-12/07_teacher_forcing_does_not_leak_answers.png
```

**Placement:** Chapter ending.

**Learning objective:** Correct the chapter’s most dangerous misconception and move into loss calculation.

**Composition**

- Wrong panel: the Clerk whispers `on` to SAT before the Final Audition; crossed out.
- Correct panel: SAT produces a probability distribution using only its causal prefix, then the green `on` card is delivered to the Scorekeeper.
- A small contrast shows training uses known prefixes while generation appends its own selected outputs step by step.

**Remove the costumes**

| Story object | Mathematical meaning |
|---|---|
| Known input prefix | teacher-forced training input |
| Green answer card | shifted label |
| Scorekeeper handoff | target used by cross-entropy |

**Alt text draft:** Teacher forcing supplies known prefix tokens as inputs and sends the future target only to the loss calculation after the model predicts.

---

# 5. Placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_answer_key_clerk.png` | Hero |
| 2 | `02_shifted_inputs_and_targets.png` | Story mechanism |
| 3 | `03_exact_target_alignment.png` | Exact calculation |
| 4 | `04_parallel_training_rows.png` | Shared-system view |
| 5 | `05_mask_types_are_not_interchangeable.png` | Core contrast |
| 6 | `06_packed_documents_with_boundaries.png` | Data-layout variant |
| 7 | `07_teacher_forcing_does_not_leak_answers.png` | Misconception and handoff |

---

# 6. Numerical and conceptual source of truth

```text
Sequence:
<BOS>, The, cat, sat, on, the, mat, ., <EOS>

X_ids=[0,1,2,3,4,5,6,7]
Y_ids=[1,2,3,4,5,6,7,8]
```

Training computes all causal prediction rows in parallel. Teacher forcing provides ground-truth prefix tokens as model inputs, but each position remains unable to attend to later positions.

---

# 7. Production checklist

- [ ] Chapter 1–3 visual style and token continuity are preserved.
- [ ] Green target cards never enter the forward attention path.
- [ ] Input and target rails are shifted by exactly one position.
- [ ] Tensor shapes and token IDs are correct.
- [ ] The four masks use distinct props and labels.
- [ ] Packed-document boundaries are explicit.
- [ ] Exact typography is overlaid and independently checked.
- [ ] Every scene has useful technical alt text.
- [ ] The last scene visibly hands predictions and targets to the Scorekeeper.

---

# 8. Chapter 12 definition of done

Chapter 12 graphics are complete only when all seven assets are approved, committed under `assets/chapter-12/`, integrated into `src/chapter-12.md`, reviewed on desktop and mobile, and verified not to imply future-token leakage.

---

# 9. Current status

- Detailed scene planning: complete.
- Reusable props and character specifications: complete.
- Final artwork generation: not started.
- Chapter integration and website review: pending final artwork.
