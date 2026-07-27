# Training Loop Scene Master Plan

## Purpose

This document is the canonical visual-planning source for the training section of **LLMs from the Inside Out**, covering Chapters 12 through 17.

The successful illustrated chapters—Chapters 1, 2, and 3—are the production reference. The training section must look and feel as though it belongs to the same book, the same cartoon world, and the same visual storytelling system.

This plan therefore defines:

- the visual style inherited from Chapters 1–3;
- the repeating scene pattern used by successful inference chapters;
- the recurring training personas, props, machines, and places;
- the visual grammar for forward computation, scoring, backpropagation, and parameter updates;
- a master training-loop storyboard;
- production-ready scene inventories for Chapters 12–17;
- technical guardrails for every illustration;
- a reusable scene specification template.

This document is a **character bible**, **visual metaphor system**, **storyboard map**, and **production brief**. It does not contain final artwork.

---

# 1. Reference standard: Chapters 1–3

The training graphics must inherit the visual language already established by the first three illustrated chapters.

## 1.1 Established visual style

Use:

- warm cream-paper or off-white backgrounds;
- hand-drawn outlines and annotations;
- purple chapter labels and major accents;
- friendly recurring characters with stable faces, clothing, silhouettes, and colours;
- clearly labelled token characters;
- numerical cards, forms, scoreboards, receipts, envelopes, and control panels;
- speech bubbles for intuition, never as literal text stored inside a tensor;
- compact technical calculation panels beside or below the story scene;
- explicit analogy warnings and misconception panels;
- visible chapter-to-chapter handoffs.

The training section must not become a generic corporate infographic, a neon science-fiction control room, or a separate visual franchise.

## 1.2 Returning visual world

The same Transformer organisation remains visible:

- THE, CAT, and SAT remain the token protagonists;
- the Question Coach still creates Queries;
- the Profile Writer still creates Keys;
- the Information Courier still supplies Values;
- attention specialists still compare and retrieve information;
- the Team Lead still combines head reports;
- the residual highway still carries the evolving token state;
- the MLP remains the private thinking room;
- the Transformer tower still contains stacked blocks;
- the Final Audition still produces vocabulary scores and probabilities.

Training revisits this familiar organisation from a new perspective:

> The model makes predictions, a score is calculated, correction reports travel backward through every contributing department, and an optimiser adjusts the persistent machinery before the next batch arrives.

---

# 2. Required production pattern

The visual rhythm proven by Chapters 1–3 should be repeated throughout Chapters 12–17.

A chapter does not need the same number of images as every other chapter, but its scene set should normally contain the following roles.

## 2.1 Chapter hero

A wide opening illustration introduces:

- the chapter’s main persona or department;
- the token protagonist or training example;
- the current input object;
- the expected output object;
- the chapter’s central question.

The hero should tell a small story before the reader studies the equation.

## 2.2 Story mechanism

A visual pipeline explains the operation inside the cartoon world.

Example:

```text
model prediction
    -> Scorekeeper
    -> loss receipt
    -> Gradient Courier
    -> correction reports
    -> Optimizer Engineer
    -> updated parameter machinery
```

## 2.3 Exact calculation panel

At least one important calculation should receive a clean technical panel containing:

- input values;
- tensor or matrix shapes;
- the operation;
- intermediate arithmetic where useful;
- the final numerical result;
- a small visual mapping back to the story objects.

The calculation panel should resemble an annotated workbook rather than a crowded cartoon.

## 2.4 Shared-system or repeated-use scene

Show that the same learned model and training rule are reused across:

- multiple token positions;
- multiple examples in a microbatch;
- multiple microbatches;
- multiple workers;
- multiple training steps.

This is the training equivalent of the shared Question Coach and shared Profile Writer scenes.

## 2.5 Contrast or variant scene

Clarify a distinction that readers commonly merge, such as:

- forward inference versus training scoring;
- correct target versus selected prediction;
- gradient calculation versus parameter update;
- microbatch versus optimiser step;
- training versus validation;
- data parallelism versus model sharding;
- full fine-tuning versus LoRA.

## 2.6 Misconception guardrail

Every chapter should include at least one visual correction panel where the metaphor could otherwise mislead.

Examples:

- teacher forcing does not leak future tokens into causal attention;
- the scalar loss does not physically travel backward;
- the Gradient Courier does not update weights;
- validation does not train the model;
- saving model weights alone is not a complete resumable checkpoint;
- LoRA does not remove all activation and backward-pass memory.

## 2.7 Handoff scene

The final scene should point to the next unresolved question and introduce the next character, machine, or department.

This creates the same chapter-to-chapter continuity used by the Question Coach and Profile Writer chapters.

---

# 3. Story principle and visual ontology

The central visual rule is:

> **Not every mathematical object becomes a character.**

Processes that repeatedly inspect, route, judge, or modify something may become personas. Tensors, masks, scores, parameters, and intermediate values should normally remain cards, forms, machines, gauges, receipts, control panels, or physical objects.

This avoids a crowded cast of one-use mascots such as Logit Man, Softmax Woman, or Logarithm Boy.

| Category | Meaning | Visual treatment |
|---|---|---|
| **Characters** | Recurring processes that inspect, route, judge, coordinate, or apply changes | Cartoon personas with stable clothing, tools, posture, and role |
| **Token protagonists** | Individual token positions and training examples | Existing labelled token characters carrying numerical cards or case files |
| **Props and machines** | Tensors, logits, probabilities, losses, gradients, masks, parameters, and state | Cards, envelopes, scoreboards, receipts, trays, knobs, gauges, shelves, and machines |
| **Places** | Stages of the training system | Library, alignment desk, familiar Transformer departments, scoring desk, dispatch corridor, control room, archive, inspection lane, and worker floor |

---

# 4. Core recurring training cast

These seven characters should be designed first and reused consistently.

## 4.1 The Data Librarian

### Represents

- the training corpus;
- source sampling;
- shuffling;
- data mixtures;
- batching and microbatch construction;
- document and sequence selection.

### Appearance

A librarian or warehouse manager surrounded by labelled shelves of token-card books. Possible shelves include web text, books, code, mathematics, scientific material, multilingual text, conversations, and curated data.

The Librarian carries a **mixture recipe card** specifying how frequently material should be drawn from each shelf.

### Recurring actions

- selects complete documents or examples;
- places token sequences onto batch carts;
- shuffles examples without scrambling words inside a sequence;
- preserves document boundaries where required;
- up-samples or down-samples shelves according to the recipe.

### Main teaching point

The model never sees the complete library at once. It receives one batch cart at a time.

---

## 4.2 The Answer-Key Clerk

### Represents

- shifted next-token targets;
- input-to-label alignment;
- teacher forcing;
- the correct target for every prediction row.

### Appearance

A clerk beside two parallel conveyor belts:

```text
INPUT BELT:   <BOS>  The  cat  sat  on
TARGET BELT:    The  cat  sat  on   the
```

The Clerk physically slides the target belt one position ahead and places green answer cards above prediction positions.

### Technical guardrail

The Clerk gives answers to the Scorekeeper after the model produces its distributions. The Clerk never whispers future tokens to SAT or inserts labels into the causal attention path.

---

## 4.3 The Scorekeeper

### Represents

- correct-target probability lookup;
- negative log-likelihood;
- cross-entropy;
- per-token loss;
- masked mean loss;
- perplexity reporting.

### Appearance

A strict but neutral examiner with:

- the correct-target card;
- the vocabulary probability scoreboard;
- a logarithmic penalty gauge;
- a loss-receipt printer.

### Recurring action

The Scorekeeper asks:

> How much probability did the model assign to the correct answer?

Example:

```text
Correct target: on
Probability assigned to on: 0.238931
Loss receipt: 1.431580
```

The Scorekeeper is factual rather than angry. It applies a rule; it does not morally blame the model.

---

## 4.4 The Gradient Courier

### Represents

- derivatives;
- backpropagation;
- correction signals;
- branch splitting;
- gradient addition at shared sources;
- reverse traversal of the computational graph.

### Appearance

A fast courier carrying correction envelopes. Each envelope contains:

- a gradient name such as `g_h`, `g_Q`, `g_K`, or `g_V`;
- its tensor shape;
- its destination department;
- a backward-direction mark.

### Recurring actions

- receives the batch-loss starting signal from the Scorekeeper;
- carries `p - y` into the vocabulary head;
- splits where the forward graph branched;
- combines reports where branches shared an input;
- leaves parameter-gradient forms at departments;
- continues carrying input gradients farther backward.

### Technical guardrail

The Courier does not modify parameters. It reports sensitivity. The Optimizer Engineer decides the actual update.

---

## 4.5 The Optimizer Engineer

### Represents

- SGD;
- AdamW;
- learning-rate scaling;
- optimiser moments;
- weight decay;
- parameter updates.

### Appearance

An engineer or mechanic at a large parameter control panel containing matrix-shaped banks of adjustable knobs.

Tools include:

- learning-rate dial;
- first-moment notebook;
- second-moment notebook;
- weight-decay wrench;
- old-value/new-value display;
- optimiser-step counter.

Example:

```text
Old weight:  0.200000
Gradient:   -1.119482
Step size:   0.050000
New weight:  0.255974
```

### Technical guardrail

Backpropagation calculates gradients. The optimiser transforms gradients into parameter updates.

---

## 4.6 The Validation Inspector

### Represents

- held-out validation data;
- validation loss and perplexity;
- regression checks;
- overfitting signals;
- evaluation without updates.

### Appearance

An inspector on a separate blue lane marked:

```text
NO TRAINING UPDATES
```

The Inspector measures and reports but does not send ordinary correction reports to the Optimizer Engineer.

---

## 4.7 The Checkpoint Archivist

### Represents

- model parameters;
- optimiser state;
- scheduler state;
- random-number-generator state;
- gradient-scaler state;
- data-loader position;
- reproducible recovery.

### Appearance

An archivist or photographer with a large snapshot camera and labelled archive crates.

A complete checkpoint crate contains:

```text
Model weights
Optimizer moments and counters
Learning-rate scheduler
Gradient scaler
Random states
Data cursor
Tokenizer and configuration
Step and token counters
```

### Misconception scene

A worker tries to save only model weights. The Archivist explains:

> That may be enough for inference, but it is not enough to resume the same training run faithfully.

---

# 5. Supporting chapter-specific personas

## 5.1 The Worker Crew

Used for distributed training. Each worker is an identical factory operator with the same model replica but a different data cart. Local gradient reports meet at an **All-Reduce Roundtable**, which is a machine or place rather than another mascot.

## 5.2 The Fine-Tuning Coach

Used for supervised fine-tuning. The Coach presents curated conversation scripts and says:

> Respond in this manner.

The character must look clearly different from the existing Question Coach, whose job is Query projection.

## 5.3 The Chat Template Stage Manager

Places system, user, assistant, separator, and end markers around a conversation before it enters the model.

## 5.4 The Preference Judge

Compares a chosen and rejected response against a visible rubric containing criteria such as correctness, helpfulness, clarity, safety, instruction following, and calibrated uncertainty.

The Judge must not merely hold generic “good” and “bad” signs.

## 5.5 The Adapter Technician

Attaches small trainable low-rank plates to a large frozen base-weight machine:

```text
Frozen W0
   +
A -> low-rank corridor -> B
```

The base remains active but locked while the adapter plates are trained.

---

# 6. Props and machines

## 6.1 Logits

Reuse the Final Audition scoreboard. Logits remain unconstrained score placards and may be positive or negative.

## 6.2 Softmax

Reuse the probability-ticket machine from inference. It accepts logits and distributes a total probability mass of one among candidates.

## 6.3 The logarithm

Use a **penalty gauge** on the Scorekeeper’s desk:

```text
p = 1.00 -> loss 0.00
p = 0.50 -> loss 0.69
p = 0.10 -> loss 2.30
p = 0.01 -> loss 4.61
```

## 6.4 Loss

Loss is a printed orange score receipt. Several valid token receipts enter a masked mean-loss calculator to create one batch-loss receipt.

## 6.5 Gradients

The Gradient Courier is the character; gradients are envelopes. Each parameter-gradient envelope should match the shape of its parameter panel.

```text
Gradient envelope: 4 x 5
Weight panel:      4 x 5
```

## 6.6 Parameters

Parameters are persistent machinery: matrix control panels, banks of knobs, projection boards, and gears inside familiar departments.

Activations pass through the machinery. Optimiser updates alter it.

## 6.7 Masks

| Mask | Visual metaphor |
|---|---|
| Causal mask | Existing one-way curtain blocking future token positions |
| Padding mask | Empty seats covered with “unused” cloth |
| Loss mask | Grey tape covering score boxes that must not count |
| Document-boundary mask | Divider wall between packed documents |

## 6.8 Perplexity

Use an **effective branching gauge**, not a character. Captions must explain that perplexity is derived from average cross-entropy and is not literally the number of vocabulary choices.

## 6.9 Gradient accumulation

Use stacked microbatch trays. The Optimizer Engineer acts only when the required number of trays has arrived.

## 6.10 Gradient clipping

Use a gate that proportionally resizes an oversized complete gradient bundle. It should not look like arbitrary coordinate-by-coordinate chopping.

## 6.11 Learning-rate schedule

Use one consistent dial or track that visibly moves through warmup and decay.

---

# 7. Places in the training universe

| Place | Purpose |
|---|---|
| **Data Library** | Corpus sources, mixture sampling, shuffling, and batch selection |
| **Target Alignment Desk** | Shifted inputs and labels |
| **Familiar Transformer Departments** | Reused inference pipeline for the forward pass |
| **Final Audition Stage** | Vocabulary logits and softmax probabilities |
| **Scorekeeper’s Desk** | Correct-target lookup, logarithmic penalty, and loss receipts |
| **Gradient Dispatch Corridor** | Reverse movement of gradient envelopes |
| **Accumulation Dock** | Microbatch gradients wait before an optimiser step |
| **Optimizer Control Room** | Parameter updates, learning-rate dial, and AdamW state |
| **Validation Lane** | Held-out evaluation with no update path |
| **Checkpoint Archive** | Complete resumable snapshots |
| **Distributed Worker Floor** | Data-parallel workers, shards, and communication |
| **Post-Training Studio** | Demonstrations, preferences, templates, and adapters |

---

# 8. Visual grammar

The training illustrations must use the same paper, line work, annotation style, panel framing, token designs, and major purple accents as Chapters 1–3.

| Meaning | Visual treatment |
|---|---|
| Current token state | Existing numerical card or evolving case file |
| Forward activations | Solid purple arrows, normally left to right |
| Correct targets | Green answer cards |
| Loss values | Orange receipts |
| Gradients | Dashed red-orange arrows and labelled envelopes, normally right to left |
| Trainable parameters | Adjustable gold or purple controls |
| Frozen parameters | Icy blue machinery with locks |
| Masked positions | Greyed-out or taped-over boxes |
| Accumulated state | Stacked trays |
| Inter-device communication | Tubes, cables, or shared roundtables |
| Validation-only path | Blue lane with “no update” signage |
| Invalid numerical state | Red warning lamp, used sparingly |

Additional rules:

1. Forward movement is left to right; backpropagation is right to left.
2. Gradient arrows are never visually identical to activation arrows.
3. Tensor-shape labels appear near important cards, envelopes, and panels.
4. Returning characters and rooms reuse approved designs rather than being redrawn arbitrarily.
5. Frozen and trainable parameters remain distinguishable without relying only on captions.
6. Speech bubbles express teaching intuition, not literal vector contents.
7. Technical captions remain authoritative when the metaphor simplifies a process.
8. Each chapter should contain a “remove the costumes” mapping from story objects to mathematical operations.

---

# 9. Master training-loop storyboard

This sequence is the visual backbone of a training step.

## Scene 1 — The Librarian selects a batch

The Data Librarian chooses documents from labelled shelves and loads token sequences onto a microbatch cart. The larger library remains visible to show that the cart is only a sample.

## Scene 2 — The Answer-Key Clerk shifts the labels

```text
Input:   <BOS>  The  cat  sat
Target:    The  cat  sat  on
```

Green target cards are aligned one step ahead. The causal curtain remains closed.

## Scene 3 — The familiar forward departments work

THE, CAT, and SAT travel through the already established inference pipeline. Earlier artwork and room designs should be reused wherever possible.

## Scene 4 — The Final Audition produces logits and probabilities

Vocabulary candidates receive logits. The existing softmax machine creates a differentiable probability distribution for each scored token position.

## Scene 5 — The Scorekeeper checks the correct answer

The Answer-Key Clerk hands the correct-target card to the Scorekeeper, who selects its probability, uses the log-penalty gauge, and prints a per-token loss receipt.

## Scene 6 — Valid losses are combined

Ignored and padded receipt slots are covered. Valid receipts enter the masked mean-loss calculator and produce one batch-loss receipt.

## Scene 7 — The Gradient Courier starts the reverse journey

The Courier begins from the loss derivative and moves backward through the vocabulary head, carrying parameter-gradient and hidden-state-gradient envelopes.

## Scene 8 — Reports move backward through the Transformer

The Courier traverses blocks in reverse order, splits at residual branches, and leaves gradient forms at MLP, normalisation, output-projection, attention, Q/K/V, and embedding machinery.

## Scene 9 — The accumulation dock waits

Microbatch gradient reports are stacked. A microbatch does not necessarily trigger an immediate parameter update.

## Scene 10 — Numerical safety checks

Scaled gradients are unscaled, invalid values are checked, and oversized bundles pass through the clipping gate.

## Scene 11 — The Optimizer Engineer updates the machinery

The Engineer consults gradient reports, learning-rate settings, optimiser moments, weight-decay instructions, and the step counter, then adjusts persistent parameter controls.

## Scene 12 — The next step begins

A new batch cart arrives. The parameter machinery is now slightly different and the global step advances.

## Scene 13 — Periodic validation and checkpointing

At selected intervals, the Validation Inspector uses the no-update lane and the Checkpoint Archivist saves a complete resumable snapshot.

---

# 10. Chapter production briefs

The following scene sets deliberately follow the Chapter 1–3 production rhythm.

---

## 10.1 Chapter 12 — The Answer Key Moves One Step Ahead

### Core Scene 1 — Chapter hero: the training classroom

Proposed asset:

```text
assets/chapter-12/01_chapter_hero_answer_key_clerk.png
```

Composition:

- THE, CAT, and SAT arrive on the input conveyor;
- the Answer-Key Clerk stands between input and target rails;
- green target cards are visibly shifted one position;
- the causal curtain remains closed;
- the central question is how one sequence becomes many next-token training examples.

### Core Scene 2 — Shifted-label mechanism

```text
assets/chapter-12/02_shifted_inputs_and_targets.png
```

Show each input position aligned with the token that follows it. Keep rows and arrows clean enough to read without prose.

### Core Scene 3 — Exact alignment panel

```text
assets/chapter-12/03_exact_target_alignment.png
```

Include:

- token IDs for the chapter’s worked sequence;
- input IDs;
- target IDs;
- index-by-index correspondence;
- tensor shapes;
- the final valid target count.

### Core Scene 4 — One forward pass, many prediction rows

```text
assets/chapter-12/04_parallel_training_rows.png
```

The familiar Transformer produces one vocabulary-distribution row per sequence position. Show that training can score many positions in parallel while causal visibility remains row-specific.

### Core Scene 5 — Four different masks

```text
assets/chapter-12/05_mask_types_are_not_interchangeable.png
```

Display causal curtain, padding covers, loss-mask tape, and document-divider walls as four distinct objects.

### Supporting Scene 6 — Packed documents

```text
assets/chapter-12/06_packed_documents_with_boundaries.png
```

Short examples share one context container while divider walls prevent unintended cross-document attention or loss accounting according to the packing design.

### Misconception panel

```text
assets/chapter-12/07_teacher_forcing_does_not_leak_answers.png
```

Wrong: Clerk whispers future tokens into SAT’s attention path.

Right: Clerk sends target cards only to the scoring path after predictions exist.

### Handoff

The completed target cards and model probability boards arrive at the Scorekeeper’s desk.

---

## 10.2 Chapter 13 — Meet the Scorekeeper

### Core Scene 1 — Chapter hero: the Final Audition meets the answer key

```text
assets/chapter-13/01_chapter_hero_scorekeeper.png
```

Composition:

- reuse the Final Audition stage and candidate designs from Chapter 11;
- the Answer-Key Clerk hands `on` to the Scorekeeper;
- the Scorekeeper locates `on` on the probability board;
- the log gauge and receipt printer are visible.

### Core Scene 2 — Correct-target lookup

```text
assets/chapter-13/02_correct_target_probability.png
```

Show that the Scorekeeper ignores which candidate won and reads only the probability assigned to the actual target.

### Core Scene 3 — Exact negative-log calculation

```text
assets/chapter-13/03_exact_cross_entropy_calculation.png
```

Include:

- correct target `on`;
- probability `0.238931`;
- `-log(p)` operation;
- result `1.431580`;
- a small log-gauge visual beside the arithmetic.

### Core Scene 4 — Logarithmic penalty curve as a gauge

```text
assets/chapter-13/04_log_penalty_gauge.png
```

Compare high, medium, low, and near-zero correct-target probabilities. Avoid implying a finite maximum loss.

### Core Scene 5 — Masked mean loss

```text
assets/chapter-13/05_masked_mean_loss_receipts.png
```

Valid token receipts enter the calculator. Ignored or padded positions remain covered. The denominator is the number of valid targets, not the padded sequence width.

### Core Scene 6 — Perplexity branching gauge

```text
assets/chapter-13/06_perplexity_branching_gauge.png
```

Show perplexity derived from average loss while warning that it is not literally the vocabulary size or the exact number of choices at each token.

### Core Scene 7 — Softmax-cross-entropy gradient preview

```text
assets/chapter-13/07_probability_minus_target.png
```

Show the probability tickets compared with a one-hot target card, creating the `p - y` correction row handed to the Gradient Courier.

### Misconception panel

```text
assets/chapter-13/08_highest_probability_is_not_the_scoring_rule.png
```

Contrast “which token had the highest probability?” with “what probability was assigned to the actual target?”

### Handoff

The Scorekeeper prints the batch-loss receipt and calls the Gradient Courier.

---

## 10.3 Chapter 14 — The Blame Travels Backward

### Core Scene 1 — Chapter hero: the Courier runs against the arrows

```text
assets/chapter-14/01_chapter_hero_gradient_courier.png
```

Composition:

- the forward path remains visible in pale purple;
- the Gradient Courier begins at the loss desk;
- dashed correction arrows run right to left;
- the Optimizer Engineer waits at the far end without touching anything yet.

### Core Scene 2 — Computational-graph mechanism

```text
assets/chapter-14/02_forward_graph_backward_reports.png
```

Use a compact story diagram showing forward values, one scalar loss, and reverse derivative envelopes.

### Core Scene 3 — Exact vocabulary-head gradients

```text
assets/chapter-14/03_exact_vocabulary_gradients.png
```

Include:

- `p - y`;
- the final hidden state;
- vocabulary-weight gradient shape;
- bias gradient;
- hidden-state gradient;
- at least one verified numerical coordinate.

### Core Scene 4 — Residual fork and recombination

```text
assets/chapter-14/04_residual_gradient_fork.png
```

The Courier splits at the residual addition. One route follows the direct highway; another enters the sublayer. Reports add when they return to the shared input.

### Core Scene 5 — Backward through the MLP

```text
assets/chapter-14/05_mlp_backward_path.png
```

Show contraction weights, activation gate, expansion weights, parameter-gradient forms, and the input-gradient envelope continuing backward.

### Core Scene 6 — Backward through attention

```text
assets/chapter-14/06_attention_backward_routes.png
```

Separate routes toward Values, attention weights, score matrix, Queries, Keys, and Q/K/V projection panels. Keep head identity visible.

### Core Scene 7 — Gradient accumulation and clipping

```text
assets/chapter-14/07_accumulation_and_clipping.png
```

Several microbatch trays accumulate before one clipping gate and optimiser step.

### Core Scene 8 — Exact parameter update

```text
assets/chapter-14/08_exact_weight_update.png
```

Show the Engineer receiving one gradient report and changing a visible weight from `0.200000` to `0.255974` using the chapter’s worked step.

### Misconception panel

```text
assets/chapter-14/09_gradient_is_not_the_update.png
```

The Courier reaches for a parameter knob; the Engineer stops them. Caption: backpropagation reports gradients, the optimiser applies updates.

### Handoff

The updated parameter machinery joins the wider training factory, where batches, schedules, validation, and checkpoints must be coordinated.

---

## 10.4 Chapter 15 — The Training Factory Never Sees the Whole Library

### Core Scene 1 — Chapter hero: the library feeds the factory

```text
assets/chapter-15/01_chapter_hero_training_factory.png
```

Composition:

- the Data Librarian selects from multiple labelled shelves;
- a mixture recipe is visible;
- one microbatch cart enters the factory;
- the full library remains outside the model.

### Core Scene 2 — Batch hierarchy

```text
assets/chapter-15/02_microbatch_accumulation_global_batch.png
```

Show examples inside microbatches, microbatches stacked across accumulation steps, and devices contributing to the effective global batch.

### Core Scene 3 — Exact effective-token calculation

```text
assets/chapter-15/03_exact_effective_batch_calculation.png
```

Include the chapter’s worked values:

```text
2 sequences/device
x 4 devices
x 8 accumulation steps
= 64 sequences

64 x 512 tokens = 32,768 tokens
```

### Core Scene 4 — Valid-token weighted mean

```text
assets/chapter-15/04_valid_token_weighted_mean.png
```

Two microbatches with different valid-token counts feed one correctly weighted mean. Contrast with the wrong unweighted average of microbatch means.

### Core Scene 5 — Packing and document boundaries

```text
assets/chapter-15/05_sequence_packing.png
```

Short examples are packed into a context container with visible dividers and masks.

### Core Scene 6 — Learning-rate journey

```text
assets/chapter-15/06_warmup_and_decay.png
```

The same learning-rate dial moves through warmup, peak, and decay while the global step advances.

### Core Scene 7 — Training and validation lanes

```text
assets/chapter-15/07_training_vs_validation.png
```

The training lane returns gradients to the Engineer. The validation lane reports metrics but has no update connection.

### Core Scene 8 — Complete checkpoint snapshot

```text
assets/chapter-15/08_complete_checkpoint.png
```

The Archivist captures weights, optimiser moments, scheduler, scaler, random states, data cursor, configuration, and counters together.

### Misconception panel

```text
assets/chapter-15/09_weights_only_is_not_resume.png
```

Contrast an inference-only weight box with a complete resumable training crate.

### Handoff

The factory becomes too large for one machine, and identical worker stations appear beyond the current room.

---

## 10.5 Chapter 16 — The Model Outgrows One Machine

### Core Scene 1 — Chapter hero: the distributed worker floor

```text
assets/chapter-16/01_chapter_hero_distributed_workers.png
```

Composition:

- several identical Worker Crew members;
- the same model design at every station;
- different data carts;
- local gradient reports moving toward a shared roundtable.

### Core Scene 2 — Data-parallel mechanism

```text
assets/chapter-16/02_data_parallel_all_reduce.png
```

Show local forward/backward passes, local gradients, all-reduce combination, and every worker leaving with the same combined report.

### Core Scene 3 — Exact gradient average

```text
assets/chapter-16/03_exact_gradient_average.png
```

Include the four local gradients from the chapter and the final average `[0.1, 0]`.

### Core Scene 4 — Training-memory inventory

```text
assets/chapter-16/04_training_memory_components.png
```

Separate parameter weights, gradients, optimiser moments, activations, temporary buffers, and communication workspace.

### Core Scene 5 — Exact parameter-state estimate

```text
assets/chapter-16/05_exact_bytes_per_parameter.png
```

Show the illustrative 16-bytes-per-parameter model and the one-billion-parameter estimate, clearly labelled as an example rather than a universal constant.

### Core Scene 6 — Fully sharded warehouse

```text
assets/chapter-16/06_sharded_parameter_warehouse.png
```

Persistent model states are divided among workers. Pieces are temporarily gathered for computation and redistributed afterward.

### Core Scene 7 — Tensor parallel specialists

```text
assets/chapter-16/07_tensor_parallel_matrix_split.png
```

One large matrix operation is divided across devices. This must look different from data parallelism, where workers receive different examples.

### Core Scene 8 — Pipeline floors and bubbles

```text
assets/chapter-16/08_pipeline_parallel_bubble.png
```

Activation crates move across stage floors. Empty stage time forms a visible pipeline bubble.

### Core Scene 9 — Activation checkpointing

```text
assets/chapter-16/09_activation_checkpointing.png
```

Selected intermediate crates are saved; others are discarded and recomputed during backward traversal.

### Core Scene 10 — Stragglers and topology

```text
assets/chapter-16/10_communication_and_stragglers.png
```

Fast workers wait at synchronisation because one worker or slow link delays the group.

### Misconception panel

```text
assets/chapter-16/11_parallelism_types_are_not_interchangeable.png
```

Contrast:

- data parallelism: different data, replicated computation;
- sharding: model state divided;
- tensor parallelism: one operation divided;
- pipeline parallelism: layer stages divided.

### Handoff

The trained base model leaves the pretraining factory and enters the Post-Training Studio.

---

## 10.6 Chapter 17 — From Completion Machine to Helpful Assistant

### Core Scene 1 — Chapter hero: the Post-Training Studio

```text
assets/chapter-17/01_chapter_hero_post_training_studio.png
```

Composition:

- the pretrained model arrives as a capable completion machine;
- the Fine-Tuning Coach holds curated conversation scripts;
- the Preference Judge and Adapter Technician appear as later stations;
- the chapter question is how behaviour is shaped after pretraining.

### Core Scene 2 — Chat template stage

```text
assets/chapter-17/02_chat_template_roles.png
```

The Stage Manager places system, user, assistant, separator, and end markers around a conversation before tokenisation and training.

### Core Scene 3 — Response-only SFT loss

```text
assets/chapter-17/03_response_only_loss_mask.png
```

Prompt tokens remain visible as context while their target-loss boxes are covered. Assistant response targets remain scoreable.

### Core Scene 4 — Exact SFT mask calculation

```text
assets/chapter-17/04_exact_sft_loss.png
```

Use the chapter’s explicit token-by-token mask alignment and calculate the response-only mean loss of `0.20`.

### Core Scene 5 — Preference comparison

```text
assets/chapter-17/05_preference_judge.png
```

One prompt produces chosen and rejected responses. The Judge uses a visible rubric rather than an unexplained thumbs-up.

### Core Scene 6 — Reference policy and DPO margin

```text
assets/chapter-17/06_dpo_relative_margin.png
```

Show current policy and frozen reference policy scoring both responses. A margin board displays relative preference rather than absolute truth.

### Core Scene 7 — Exact DPO calculation

```text
assets/chapter-17/07_exact_dpo_calculation.png
```

Present the chapter’s numerical margin and resulting DPO loss in a clean workbook panel.

### Core Scene 8 — LoRA adapter mechanism

```text
assets/chapter-17/08_lora_adapter_technician.png
```

The frozen base-weight machine remains active. The Technician attaches small trainable A and B plates that create an additional low-rank update path.

### Core Scene 9 — Exact LoRA parameter count

```text
assets/chapter-17/09_exact_lora_parameter_count.png
```

Compare the `4096 x 4096` base matrix with rank-16 adapters and show the chapter’s `0.78125%` trainable-parameter result.

### Core Scene 10 — Interchangeable adapters and regressions

```text
assets/chapter-17/10_adapters_and_regression_testing.png
```

Show multiple adapter cartridges for one shared base and a separate evaluation board checking both desired improvements and regressions.

### Misconception panel

```text
assets/chapter-17/11_post_training_does_not_insert_rules_directly.png
```

The Coach does not write English rules into individual weights. Demonstrations and preferences create losses; optimisation changes distributed parameters.

### Handoff

The inference and training stories are now connected: the model can make a prediction, receive a score, update its machinery, and later use the learned machinery during generation.

---

# 11. Initial design-production order

Reuse all approved Chapter 1–3 character and room designs directly.

Before full training-chapter illustration, approve these reusable elements:

1. Answer-Key Clerk and alignment desk.
2. Scorekeeper, log gauge, and receipt printer.
3. Gradient Courier and gradient-envelope system.
4. Optimizer Engineer and parameter control panel.
5. Data Librarian and source shelves.
6. Validation Inspector and no-update lane.
7. Checkpoint Archivist and complete snapshot crate.
8. Masked mean-loss calculator.
9. Accumulation trays and clipping gate.
10. Learning-rate dial.
11. Worker Crew and All-Reduce Roundtable.
12. Fine-Tuning Coach and Chat Template Stage Manager.
13. Preference Judge and rubric board.
14. Adapter Technician and frozen-weight machinery.

Reusable elements should be approved before chapter-wide generation so the same object does not change appearance or meaning between scenes.

---

# 12. The central training trio

The most important recurring relationship is:

```text
Scorekeeper
    computes the loss
        |
        v
Gradient Courier
    calculates and delivers derivative reports
        |
        v
Optimizer Engineer
    applies parameter updates
```

This trio preserves the distinction among:

- evaluating the prediction;
- differentiating the loss;
- changing persistent parameters.

---

# 13. Illustration guardrails

1. **Match the approved Chapter 1–3 style.** Use the same warm paper, line work, accents, panel framing, token designs, and cartoon proportions.
2. **Use the same production rhythm.** Hero, story mechanism, calculation, shared-system or contrast, misconception guardrail, and handoff should be identifiable in every chapter set.
3. **Metaphor must not override computation.** Captions and equations remain authoritative.
4. **Teacher forcing must not look like future-token leakage.** Targets reach the loss path, not causal attention.
5. **The scalar loss does not physically flow backward.** The backward path carries derivatives of loss.
6. **The Gradient Courier never updates parameters.** The Optimizer Engineer performs updates.
7. **Validation never feeds ordinary optimiser updates.** Its lane has no backward connection to the Engineer.
8. **Frozen parameters still participate in computation.** Their machinery remains active but locked.
9. **LoRA reduces trainable parameter state, not all memory and computation.** Activations and backward signals remain visible.
10. **Distributed workers do not train unrelated independent models.** Synchronisation visibly restores a shared update.
11. **All masks are not interchangeable.** Use distinct props and labels.
12. **Avoid character overload.** Prefer one recurring persona plus several clear props over many one-use mascots.
13. **Keep exact calculations readable.** Do not place dense arithmetic inside a busy hero illustration.
14. **Preserve continuity.** Returning characters, rooms, and machines should cite earlier approved artwork in every generation brief.

---

# 14. Scene specification template

Complete this before generating each illustration:

```text
Scene ID:
Chapter and section:
Scene role: hero / mechanism / calculation / shared-system / contrast / misconception / handoff
Learning objective:
Characters:
Props:
Location:
Foreground action:
Background context:
Forward arrows:
Backward arrows:
Labels and equations:
Remove-the-costumes mapping:
Misconception to avoid:
Continuity references to earlier artwork:
Aspect ratio and intended placement:
```

---

# 15. Current status

- The training visual system now explicitly inherits the Chapter 1–3 style and production pattern.
- Chapters 12–17 have production-ready hero, mechanism, calculation, contrast, misconception, and handoff briefs.
- No final training-loop graphics have been generated from this document yet.
- The next production step is to create character sheets and reusable prop sheets, then generate one chapter at a time using the scene specification template.
