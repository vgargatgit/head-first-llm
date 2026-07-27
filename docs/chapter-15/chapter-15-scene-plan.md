# Chapter 15 Graphics Scene Plan

## Chapter

**Chapter 15 — The Training Factory Never Sees the Whole Library**  
**Subtitle:** How batches, schedules, validation, and checkpoints turn one update into a training run

## Status

This document is the canonical production specification for all Chapter 15 graphics. Final artwork belongs under `assets/chapter-15/`.

The chapter expands the single update from Chapter 14 into a long-running data and optimisation system. It introduces the Data Librarian, Validation Inspector, and Checkpoint Archivist while reusing the Scorekeeper, Gradient Courier, and Optimizer Engineer.

---

# 1. Chapter visual objective

Show how examples become microbatches, microbatches accumulate into an optimiser step, token counts define the effective workload, learning-rate schedules evolve, validation remains separate, and complete checkpoints preserve the run.

```text
data library -> sampled examples -> microbatch
    -> forward / loss / backward
    -> gradient accumulation across microsteps and devices
    -> optimiser step
    -> repeat with schedule
periodically:
    -> validation
    -> checkpoint
```

Central lesson:

> The model sees small sampled token batches, not the entire corpus, and a reliable training run coordinates data, valid-token accounting, optimiser state, schedules, evaluation, and recovery.

---

# 2. Style and continuity locks

- Preserve the established warm paper, hand-drawn characters, purple forward paths, orange loss receipts, red-orange gradient envelopes, and gold parameter controls.
- The Data Librarian manages source shelves and carts; the character does not alter text inside selected documents.
- Reuse the Accumulation Dock and Optimizer Engineer from Chapter 14.
- Validation uses a separate blue lane with no gradient connection to the Engineer.
- The Checkpoint Archivist saves a complete state snapshot, not merely model weights.
- The chapter’s final wall opens onto the distributed worker floor of Chapter 16.

---

# 3. Reusable design elements

## Data Librarian

A warehouse librarian selecting documents from labelled source shelves according to a visible mixture recipe.

## Microbatch cart

A cart containing several sequences, valid-token counts, and padding/packing information.

## Batch hierarchy board

A nesting diagram for examples, microbatch per device, gradient-accumulation steps, device count, global sequence batch, and global token batch.

## Learning-rate dial and schedule track

A dial moving through warmup, peak, and decay as the global optimiser step increases.

## Validation lane

A parallel blue track that runs inference and scoring but never returns gradient envelopes to the optimiser.

## Checkpoint camera and archive crate

A snapshot system storing model, optimiser, scheduler, scaler, RNG, data position, configuration, and counters.

---

# 4. Scene inventory

The planned Chapter 15 set contains **9 artwork files**.

---

## Scene 01 — Chapter hero: the library feeds the training factory

**Asset**

```text
assets/chapter-15/01_chapter_hero_training_factory.png
```

**Placement:** Chapter opening.

**Learning objective:** Show that each training step sees a sample from a much larger corpus.

**Composition**

- Large Data Library with shelves for web text, books, code, mathematics, science, multilingual data, and curated conversations.
- A visible mixture recipe controls how often the Librarian draws from each shelf.
- One microbatch cart enters the familiar forward/backward factory.
- The full library remains outside the model.

**Do not show:** the entire corpus loaded into model memory or source mixture proportions as quality guarantees.

**Alt text draft:** A Data Librarian selects documents from several corpus shelves according to a mixture recipe and sends one microbatch cart into the training factory.

---

## Scene 02 — Batch hierarchy and accumulation mechanism

**Asset**

```text
assets/chapter-15/02_microbatch_accumulation_global_batch.png
```

**Placement:** Across microbatch, accumulation, and device-count definitions.

**Learning objective:** Show the nested meanings of local microbatch, accumulation step, and global batch.

**Composition**

- Sequences sit inside a per-device microbatch cart.
- Four device lanes each process carts.
- Eight microstep trays stack before one optimiser step.
- The batch hierarchy board names sequence batch and token batch separately.

**Required formula**

```text
B_global_sequences = B_micro × devices × accumulation_steps
```

**Do not show:** eight optimiser updates for eight accumulation microsteps or device count omitted from the global batch.

**Alt text draft:** Sequences form per-device microbatches, and gradients from several devices and accumulation steps combine before one optimiser update.

---

## Scene 03 — Exact effective-token calculation

**Asset**

```text
assets/chapter-15/03_exact_effective_batch_calculation.png
```

**Placement:** Beside the chapter’s worked global-batch example.

**Learning objective:** Calculate nominal sequence and token batch sizes.

**Required values**

```text
2 sequences/device
× 4 devices
× 8 accumulation steps
= 64 sequences per optimiser step

64 × 512 tokens = 32,768 nominal tokens
```

**Composition**

- Clean workbook panel.
- Two sequences are visibly duplicated across four device icons and eight accumulation trays.
- A warning distinguishes nominal tokens from valid non-padding tokens.

**Alt text draft:** Two sequences per device across four devices and eight accumulation steps produce 64 sequences and 32,768 nominal tokens per optimiser step.

---

## Scene 04 — Valid-token weighted mean

**Asset**

```text
assets/chapter-15/04_valid_token_weighted_mean.png
```

**Placement:** Near the unequal-microbatch loss example.

**Learning objective:** Show why averaging microbatch means without valid-token weights is wrong.

**Composition**

- Two microbatches contain different counts of valid loss receipts.
- Correct lane adds all valid losses and divides by all valid targets.
- Wrong lane averages two microbatch means equally and is crossed out.
- Padding receipts remain covered.

**Required principle**

```text
correct mean = total valid loss sum / total valid-token count
```

**Do not show:** every microbatch receiving equal statistical weight when valid-token counts differ.

**Alt text draft:** Microbatch losses are weighted by their valid-token counts so every scored token contributes equally to the final mean.

---

## Scene 05 — Shuffling, sequence packing, and document boundaries

**Asset**

```text
assets/chapter-15/05_sequence_packing_and_shuffling.png
```

**Placement:** Across shuffling, packing, and document-boundary sections.

**Learning objective:** Show efficient layout without destroying sequence order or boundaries.

**Composition**

- The Librarian shuffles complete examples, not words within each example.
- Short sequences are packed into context containers.
- EOS/BOS markers and divider walls remain visible.
- Unused padding space is compared with packed utilisation.

**Do not show:** words randomly shuffled within documents or packed examples treated automatically as one continuous document.

**Alt text draft:** Complete examples are shuffled, while short sequences are packed into context windows with explicit document boundaries.

---

## Scene 06 — Learning-rate warmup and decay

**Asset**

```text
assets/chapter-15/06_warmup_and_decay.png
```

**Placement:** Near learning-rate schedules.

**Learning objective:** Show that update size changes according to the global optimiser step.

**Composition**

- The Optimizer Engineer’s dial follows a track: warmup, peak, decay.
- Microsteps do not move the global schedule counter unless an optimiser step occurs.
- Exact warmup example is shown in a technical inset.

**Required value**

```text
at warmup step 250, learning rate = 7.5 × 10^-5
```

**Do not show:** warmup as increasing model weights directly or schedule advancing once per token rather than according to its defined step unit.

**Alt text draft:** The learning-rate dial rises through warmup and later decays as optimiser steps advance.

---

## Scene 07 — Training lane versus validation lane

**Asset**

```text
assets/chapter-15/07_training_vs_validation.png
```

**Placement:** Across validation and overfitting sections.

**Learning objective:** Separate held-out measurement from model updating.

**Composition**

- Training lane: data cart, forward pass, loss, Gradient Courier, Optimizer Engineer.
- Validation lane: held-out cart, forward pass, metrics dashboard, `NO UPDATE` barrier.
- Curves show training and validation loss trends; divergence can suggest overfitting.
- A contamination warning prevents training examples from entering the held-out archive.

**Do not show:** validation gradients updating parameters or validation loss guaranteed to decrease whenever training loss decreases.

**Alt text draft:** Training data produces gradients and parameter updates, while held-out validation data follows a separate no-update lane that reports metrics.

---

## Scene 08 — Complete resumable checkpoint

**Asset**

```text
assets/chapter-15/08_complete_checkpoint.png
```

**Placement:** Near the checkpointing and recovery section.

**Learning objective:** Show all state required to faithfully resume a training run.

**Composition**

The Checkpoint Archivist photographs and crates:

```text
model weights
optimizer moments and counters
learning-rate scheduler
gradient scaler
random-number-generator states
data-loader cursor
tokenizer and model configuration
global step and processed-token counters
```

- Wrong panel saves only weights and is labelled `sufficient for inference, incomplete for exact resume`.
- Recovery scene restores every crate to the correct station.

**Alt text draft:** A Checkpoint Archivist saves model, optimiser, scheduler, scaler, random states, data cursor, configuration, and counters in one resumable snapshot.

---

## Scene 09 — Training dashboard and handoff to distributed workers

**Asset**

```text
assets/chapter-15/09_dashboard_and_distributed_handoff.png
```

**Placement:** Chapter ending.

**Learning objective:** Summarise operational metrics and reveal the limits of one machine.

**Composition**

- Dashboard tracks loss, validation loss, tokens per second, model FLOP utilisation or hardware utilisation, memory, gradient norm, learning rate, and checkpoint health.
- A warning distinguishes throughput from model quality.
- The current factory becomes crowded; identical worker stations appear beyond a wall marked Chapter 16.

**Do not show:** one dashboard metric as a complete measure of training success or wall-clock speed without hardware/context.

**Alt text draft:** A training dashboard monitors optimisation and system health before the factory expands into several distributed worker stations.

---

# 5. Placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_training_factory.png` | Hero |
| 2 | `02_microbatch_accumulation_global_batch.png` | Batch mechanism |
| 3 | `03_exact_effective_batch_calculation.png` | Exact calculation |
| 4 | `04_valid_token_weighted_mean.png` | Reduction guardrail |
| 5 | `05_sequence_packing_and_shuffling.png` | Data layout |
| 6 | `06_warmup_and_decay.png` | Schedule |
| 7 | `07_training_vs_validation.png` | Core contrast |
| 8 | `08_complete_checkpoint.png` | Recovery system |
| 9 | `09_dashboard_and_distributed_handoff.png` | Operations and handoff |

---

# 6. Numerical and conceptual source of truth

```text
2 sequences/device × 4 devices × 8 accumulation steps = 64 sequences
64 × 512 = 32,768 nominal tokens
warmup learning rate at step 250 = 7.5 × 10^-5
```

Valid-token means must weight each scored token equally. Checkpoint completeness and exact-resume guarantees depend on the framework and data pipeline, but the listed state is the required visual baseline.

---

# 7. Production checklist

- [ ] The model never appears to consume the whole library at once.
- [ ] Batch, microbatch, accumulation, and optimiser step are visibly distinct.
- [ ] Valid-token counts control mean-loss weighting.
- [ ] Schedule movement is tied to the correct step counter.
- [ ] Validation has no ordinary update connection.
- [ ] Checkpoint imagery includes optimiser, schedule, RNG, and data position.
- [ ] Throughput and quality metrics are not conflated.
- [ ] Exact typography and alt text are reviewed.

---

# 8. Chapter 15 definition of done

Chapter 15 graphics are complete only when all nine assets are approved, committed under `assets/chapter-15/`, integrated into the chapter, numerically verified, and reviewed for clear distinction among microbatch processing, optimiser steps, validation, and recovery.

---

# 9. Current status

- Detailed scene planning: complete.
- Data, scheduling, validation, and checkpoint props specified.
- Final artwork generation: not started.
- Integration and website review: pending final artwork.
