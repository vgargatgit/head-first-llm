# Training Loop Scene Master Plan

## Purpose

This document is the canonical visual-planning source for the training section of **LLMs from the Inside Out**.

The inference chapters introduced Transformer concepts through recurring cartoon characters, departments, props, and worked calculations. The training chapters should continue inside the same visual universe rather than introducing an unrelated visual language.

This plan defines:

- the recurring training personas;
- which concepts should remain props or machines rather than characters;
- the places in which scenes occur;
- the visual grammar for forward and backward computation;
- the master training-loop storyboard;
- chapter-specific scene candidates for Chapters 12–17;
- character-design priorities before illustration begins.

The document is a **character bible**, **visual metaphor system**, and **storyboard map**. It does not contain final artwork.

---

# 1. Story principle

The training story should reuse the world already established during inference.

Existing characters and departments return:

- THE, CAT, and SAT remain the token protagonists;
- the Question Coach still creates Queries;
- the Profile Writer still creates Keys;
- the Information Courier still supplies Values;
- attention specialists still compare and retrieve information;
- the MLP remains the private thinking room;
- the Final Audition still produces vocabulary scores.

During inference, the reader followed information moving forward through these departments.

During training, the reader revisits the same system from a new perspective:

> The model makes predictions, a score is calculated, correction reports travel backward through every contributing department, and an optimiser changes the machinery before the next batch arrives.

The central visual rule is:

> **Not every mathematical object becomes a character.**

Processes that repeatedly inspect, route, judge, or modify something may become recurring personas. Tensors, masks, scores, parameters, and intermediate values should normally appear as cards, forms, machines, gauges, receipts, control panels, or physical objects.

This avoids a crowded cast of one-use mascots such as Logit Man, Softmax Woman, or Logarithm Boy.

---

# 2. Visual ontology

All visual elements should belong to one of three categories.

| Category | Meaning | Visual treatment |
|---|---|---|
| **Characters** | Recurring processes that make decisions, inspect results, route information, or apply changes | Cartoon personas with consistent clothing, tools, posture, and role |
| **Props** | Tensors, scores, losses, gradients, masks, parameters, and state | Cards, envelopes, scoreboards, receipts, trays, knobs, gauges, and machines |
| **Places** | Stages of the training system | Library, classroom, factory floor, scoring desk, archive, inspection lane, and worker stations |

A reader should be able to infer the kind of concept from its visual treatment before reading the caption.

---

# 3. Core recurring training cast

These characters should be designed first because they recur across several chapters.

## 3.1 The Data Librarian

### Represents

- the training corpus;
- source sampling;
- shuffling;
- data mixtures;
- batching and microbatch construction;
- document and sequence selection.

### Appearance

A librarian or warehouse manager surrounded by labelled shelves of token-card books.

Possible shelves:

- general web text;
- books and articles;
- source code;
- mathematics;
- scientific material;
- multilingual text;
- conversations;
- curated high-quality data.

The Librarian carries a **mixture recipe card** that specifies how frequently material should be drawn from each shelf.

### Recurring actions

- selects complete documents or examples;
- places token sequences onto batch carts;
- shuffles examples without shuffling words inside a sequence;
- preserves document boundaries where required;
- up-samples or down-samples selected shelves according to the recipe.

### Main teaching point

The model never sees the complete library at once. It receives one batch cart at a time.

---

## 3.2 The Answer-Key Clerk

### Represents

- shifted next-token targets;
- input-to-label alignment;
- teacher forcing;
- the source of the correct target for each prediction row.

### Appearance

A clerk standing beside two parallel conveyor belts.

```text
INPUT BELT:   <BOS>  The  cat  sat  on
TARGET BELT:    The  cat  sat  on   the
```

The clerk physically slides the target belt one position ahead.

### Recurring action

The clerk places one green answer card above each prediction position.

```text
Input position:  sat
Correct target:  on
```

### Technical guardrail

The Clerk gives the answer to the Scorekeeper after the model has produced a distribution. The Clerk does not whisper future tokens to SAT or place answers inside the attention path.

The causal curtain remains closed during the forward pass.

---

## 3.3 The Scorekeeper

### Represents

- selecting the correct-target probability;
- negative log-likelihood;
- cross-entropy;
- per-token loss;
- masked mean loss;
- perplexity reporting.

### Appearance

A strict but neutral examiner with:

- the correct-target card;
- a vocabulary probability scoreboard;
- a logarithmic penalty gauge;
- a loss-receipt printer.

### Recurring action

The Scorekeeper does not ask which token won the audition.

The Scorekeeper asks:

> How much probability did the model assign to the correct answer?

Example panel:

```text
Correct target: on
Probability assigned to on: 0.238931
Loss receipt: 1.431580
```

### Personality

The Scorekeeper is factual rather than angry. It applies a mathematical rule and prints the result. It does not morally blame the model.

---

## 3.4 The Gradient Courier

### Represents

- derivatives;
- backpropagation;
- correction signals;
- branch splitting;
- gradient accumulation at shared sources;
- the reverse traversal of the computational graph.

### Appearance

A fast courier carrying correction envelopes. Every envelope includes:

- the gradient name, such as `g_z`, `g_h`, `g_Q`, `g_K`, or `g_V`;
- the tensor shape;
- the destination department;
- a backward-direction arrow.

### Visual direction

```text
Forward computation:  left -> right
Backward gradients:   right -> left
```

Forward arrows should be solid. Gradient arrows should be dashed and use a dedicated correction colour.

### Recurring actions

- receives the batch-loss receipt from the Scorekeeper;
- carries `p - y` to the vocabulary head;
- splits into several couriers where the forward graph branched;
- combines reports where several branches shared one input;
- delivers parameter-gradient forms to model departments;
- places accumulated reports in the gradient tray.

### Technical guardrail

The Gradient Courier does **not** modify parameters.

The courier reports local sensitivity:

> A small change in this quantity would change the loss by this amount.

The Optimizer Engineer decides the actual update.

---

## 3.5 The Optimizer Engineer

### Represents

- SGD;
- AdamW;
- learning-rate scaling;
- optimiser moments;
- weight decay;
- parameter updates.

### Appearance

An engineer or mechanic standing at a large parameter control panel. The panel contains matrix-shaped banks of adjustable knobs.

The Engineer receives gradient reports from the Gradient Courier.

### Tools

- learning-rate dial;
- first-moment notebook;
- second-moment notebook;
- weight-decay wrench;
- old-value/new-value display;
- optimiser-step counter.

### Example panel

```text
Old weight:  0.200000
Gradient:   -1.119482
Step size:   0.050000
New weight:  0.255974
```

### Technical guardrail

Backpropagation calculates gradients. The optimiser transforms those gradients into parameter updates.

---

## 3.6 The Validation Inspector

### Represents

- held-out validation data;
- validation loss and perplexity;
- regression checks;
- overfitting signals;
- evaluation without parameter updates.

### Appearance

An inspector working on a separate blue inspection lane marked:

```text
NO TRAINING UPDATES
```

### Recurring actions

- sends validation examples through the model;
- measures loss and task metrics;
- compares training and validation trends;
- reports regressions;
- never sends correction reports to the Optimizer Engineer during ordinary evaluation.

### Main teaching point

Validation observes the model. It does not train the model.

---

## 3.7 The Checkpoint Archivist

### Represents

- training checkpoints;
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

A worker tries to save only the model weights.

The Archivist replies:

> That may be enough for inference, but it is not enough to resume the same training run faithfully.

---

# 4. Supporting chapter-specific personas

These characters are useful, but they should be designed after the seven core personas.

## 4.1 The Worker Crew

Used for distributed training.

Each worker is an identical factory operator with the same model replica but a different data cart.

They produce local gradient reports that meet at an **All-Reduce Roundtable**.

The roundtable is a place or machine, not another mascot.

---

## 4.2 The Fine-Tuning Coach

Used for supervised fine-tuning.

The Coach presents curated example conversations and says:

> Respond in this manner.

The Coach carries scripts containing:

- system instructions;
- user messages;
- assistant demonstrations;
- response-only target masks.

This persona must look distinct from the existing Question Coach, whose role is to create Query vectors.

---

## 4.3 The Preference Judge

Used for preference optimisation.

The Judge receives:

- one prompt;
- a chosen response;
- a rejected response;
- a visible rubric.

Possible rubric cards:

```text
Correctness
Helpfulness
Clarity
Safety
Instruction following
Calibrated uncertainty
```

The Judge should not simply hold “good” and “bad” signs. The rubric must remain visible because preference labels depend on criteria.

---

## 4.4 The Adapter Technician

Used for LoRA and parameter-efficient fine-tuning.

The base weight matrix is a large frozen machine labelled:

```text
W0 — DO NOT MODIFY
```

The Technician attaches two small trainable plates:

```text
A -> low-rank corridor -> B
```

The plates create a scaled low-rank update:

```text
Delta W = alpha * r^-1 * A * B
```

The base remains locked while the adapter plates are trained.

---

# 5. Concepts that remain props or machines

## 5.1 Logits

Reuse the Final Audition scoreboard.

Each vocabulary candidate receives an unconstrained score placard.

```text
on        0.756945
quietly  -0.761311
.         1.139041
the      -0.748398
mat       1.002967
```

“Logit” does not need a separate mascot.

---

## 5.2 Softmax

Represent softmax as a **probability ticket machine**.

The machine accepts arbitrary score placards and distributes exactly 100 percentage tickets among all candidates.

This conveys that:

- probabilities are connected through a shared denominator;
- increasing one candidate’s share changes the remaining shares;
- all output shares sum to one.

---

## 5.3 The logarithm

Represent the logarithm as a **penalty gauge** on the Scorekeeper’s desk.

```text
p = 1.00 -> loss 0.00
p = 0.50 -> loss 0.69
p = 0.10 -> loss 2.30
p = 0.01 -> loss 4.61
```

The gauge is gentle for high correct-target probability and increasingly severe as the probability approaches zero.

---

## 5.4 Loss

Loss is a printed **score receipt**.

One valid target position creates one receipt. Several receipts enter a masked mean-loss calculator to create one batch-loss receipt.

---

## 5.5 Gradients

The Gradient Courier is the character. Individual gradients are the courier’s envelopes.

The envelope shape must match its destination:

```text
Gradient envelope: 4 x 5
Weight panel:      4 x 5
```

This reinforces that a parameter gradient has the same shape as its parameter.

---

## 5.6 Parameters

Parameters are persistent adjustable machinery:

- matrix-shaped control panels;
- banks of knobs;
- gears inside departments;
- labelled projection boards.

Activations pass through the machinery. Optimiser updates alter the machinery.

---

## 5.7 Masks

Each mask type needs a different physical metaphor.

| Mask | Visual metaphor |
|---|---|
| Causal mask | One-way curtain blocking future token positions |
| Padding mask | Empty seats covered with “unused” cloth |
| Loss mask | Grey tape covering score boxes that must not count |
| Document-boundary mask | Divider wall between packed documents |

The four masks should not be represented by one generic black rectangle.

---

## 5.8 Perplexity

Perplexity should be an **effective branching gauge**, not a character.

It may show how many similarly plausible branches the model appears to face on average. Captions must make clear that perplexity is derived from average cross-entropy and is not literally the number of available vocabulary tokens.

---

# 6. Places in the training universe

| Place | Purpose |
|---|---|
| **Data Library** | Corpus sources, mixture sampling, shuffling, and batch selection |
| **Target Alignment Desk** | Shifted inputs and labels |
| **Familiar Transformer Departments** | Reused inference pipeline for the forward pass |
| **Final Audition Stage** | Vocabulary logits and softmax probabilities |
| **Scorekeeper’s Desk** | Target lookup, log penalty, and loss receipts |
| **Gradient Dispatch Corridor** | Reverse movement of correction envelopes |
| **Accumulation Dock** | Microbatch gradient reports wait before an optimiser step |
| **Optimizer Control Room** | Parameter updates, learning-rate dial, and AdamW state |
| **Validation Lane** | Held-out evaluation with no update path |
| **Checkpoint Archive** | Complete resumable snapshots |
| **Distributed Worker Floor** | Data-parallel workers, shards, and communication |
| **Post-Training Studio** | Demonstrations, preference comparisons, and adapters |

---

# 7. Visual grammar

These conventions should remain stable throughout the training chapters.

| Meaning | Visual treatment |
|---|---|
| Forward activations | Solid purple arrows |
| Correct targets and answer cards | Green cards |
| Loss values | Orange receipts |
| Gradients | Dashed red-orange arrows and envelopes |
| Trainable parameters | Adjustable gold or purple controls |
| Frozen parameters | Icy blue machinery with locks |
| Masked positions | Greyed-out or taped-over boxes |
| Accumulated state | Stacked trays |
| Inter-device communication | Tubes, network cables, or shared roundtables |
| Validation-only path | Blue inspection lane with “no update” signage |
| Errors or invalid numerical state | Red warning lamp, used sparingly |

Additional rules:

1. Forward movement is consistently left to right.
2. Backpropagation is consistently right to left.
3. Gradient arrows are never visually identical to activation arrows.
4. Tensor-shape labels appear near important cards and envelopes.
5. Frozen and trainable parameters must be visually distinguishable without relying only on captions.
6. Technical captions remain authoritative when a metaphor simplifies a process.

---

# 8. Master training-loop storyboard

This sequence is the visual backbone for the training section.

## Scene 1 — The Librarian selects a batch

The Data Librarian chooses several documents from different shelves and loads token sequences onto a batch cart.

```text
Library shelves
      -> selected documents
      -> token sequences
      -> microbatch cart
```

The complete library remains visible in the background to show that one cart is only a sample.

---

## Scene 2 — The Answer-Key Clerk shifts the labels

The Clerk aligns two conveyor belts.

```text
Input:   <BOS>  The  cat  sat
Target:    The  cat  sat  on
```

Green target cards are placed above prediction positions.

The causal curtain remains closed between each position and its future tokens.

---

## Scene 3 — The familiar forward departments work

The token protagonists travel through the established inference pipeline:

```text
Token embeddings
-> position information
-> attention departments
-> MLP room
-> Transformer stack
-> Final Audition
```

Whenever possible, reuse previous artwork, room layouts, and character designs.

---

## Scene 4 — The Final Audition produces logits

Vocabulary candidates receive score placards.

The Softmax probability machine converts scores into probability tickets.

The model has now made a differentiable prediction for every valid sequence position.

---

## Scene 5 — The Scorekeeper checks the answer

The Answer-Key Clerk hands the correct-target card to the Scorekeeper.

The Scorekeeper:

1. locates that candidate on the probability board;
2. reads its probability;
3. sends it through the logarithmic penalty gauge;
4. prints one loss receipt.

---

## Scene 6 — Valid losses are combined

Every valid target position produces one receipt.

Masked and padding positions have covered receipt slots.

Valid receipts enter the masked mean-loss calculator and produce one batch-loss receipt.

---

## Scene 7 — The Gradient Courier travels backward

The Courier collects the batch-loss receipt and moves backward through the model.

At the vocabulary head, the courier produces:

- a gradient report for vocabulary weights;
- a gradient report for vocabulary bias;
- a gradient report continuing into the final hidden state.

At a residual connection, the courier splits. At a shared source, gradient reports add together.

---

## Scene 8 — Reports reach attention and MLP departments

The Courier travels through the Transformer blocks in reverse order.

Inside attention, reports separate toward:

- the Value route;
- the attention-weight route;
- the Query and Key score route;
- the Q, K, and V projection panels.

Each department retains a parameter-gradient form and sends an input-gradient envelope farther backward.

---

## Scene 9 — The accumulation dock waits

When gradient accumulation is enabled, each microbatch places reports into an accumulation tray.

The Optimizer Engineer waits until the required number of microsteps is complete.

This scene must make clear that processing a microbatch does not necessarily update the model immediately.

---

## Scene 10 — Numerical safety checks

Before the update:

- scaled gradients are unscaled;
- invalid values are checked;
- an oversized gradient bundle passes through the clipping gate.

The clipping gate proportionally resizes the complete bundle rather than independently chopping arbitrary coordinates.

---

## Scene 11 — The Optimizer Engineer updates the machinery

The Engineer consults:

- accumulated gradient reports;
- the learning-rate dial;
- AdamW moment notebooks;
- weight-decay instructions;
- the global step counter.

The Engineer adjusts parameter controls throughout the model.

---

## Scene 12 — The next training step begins

The parameter machinery is now slightly different.

A new batch cart arrives.

```text
Step 10,247 -> Step 10,248
```

The learning-rate dial may also move according to its schedule.

---

## Scene 13 — Periodic validation and checkpointing

At selected intervals:

- the Validation Inspector tests the model on the separate inspection lane;
- the Checkpoint Archivist saves a complete snapshot;
- dashboards report loss, throughput, memory use, and stability signals.

The main training loop then continues.

---

# 9. Chapter-specific storyboard inventory

## Chapter 12 — The Answer Key Moves One Step Ahead

High-value scenes:

1. A sentence entering the training classroom.
2. The Answer-Key Clerk sliding the target rail one position.
3. Several prediction rows being prepared in parallel.
4. The causal curtain preventing answer leakage.
5. Causal, padding, loss, and document-boundary masks shown as different objects.
6. Packed documents separated by divider walls.
7. A misconception panel showing that teacher forcing supplies labels to the loss, not future tokens to attention.

---

## Chapter 13 — Meet the Scorekeeper

High-value scenes:

1. The Final Audition returning from Chapter 11.
2. The Softmax machine distributing probability tickets.
3. The Scorekeeper inspecting only the correct target’s probability.
4. The logarithmic penalty gauge at several probability levels.
5. Several valid receipts entering the masked mean-loss calculator.
6. Padding or ignored positions with covered receipt slots.
7. Perplexity shown on the effective branching gauge.
8. A misconception panel contrasting “highest-probability token” with “probability assigned to the actual target.”

---

## Chapter 14 — The Blame Travels Backward

High-value scenes:

1. The Gradient Courier receiving the batch-loss receipt.
2. The output head issuing weight, bias, and hidden-state gradient reports.
3. A residual fork where one courier becomes two and reports later recombine.
4. Gradient envelopes moving backward through the MLP.
5. Gradient reports reaching Q, K, and V departments.
6. Several head-specific couriers returning to one shared residual stream.
7. The Optimizer Engineer updating one visible weight.
8. A misconception panel in which the Gradient Courier reaches for a parameter knob and the Engineer stops them.
9. Gradient clipping represented as proportional resizing of the complete report bundle.
10. Gradient accumulation represented by stacked microbatch trays.

---

## Chapter 15 — The Training Factory Never Sees the Whole Library

High-value scenes:

1. The Data Librarian and labelled source shelves.
2. A visible mixture recipe controlling shelf selection.
3. Microbatch carts arriving at the accumulation dock.
4. A valid-token counter showing why unequal microbatch means need weighting.
5. Short examples packed into a context container with divider walls.
6. The learning-rate dial moving through warmup and decay.
7. The Validation Inspector on the separate no-update lane.
8. The Checkpoint Archivist photographing model, optimiser, scheduler, RNG, and data cursor together.
9. A misconception panel showing that saving only weights is not a faithful training resume.

---

## Chapter 16 — The Model Outgrows One Machine

High-value scenes:

1. Identical Worker Crew members receiving different batch carts.
2. Local gradient reports meeting at the All-Reduce Roundtable.
3. Every worker leaving with the same combined report.
4. A giant parameter warehouse divided into persistent shards.
5. Workers temporarily gathering the pieces required for one layer.
6. One large matrix operation split among tensor-parallel specialists.
7. Pipeline stages passing activation crates between floors.
8. Empty pipeline stages illustrating a bubble.
9. Activation checkpointing represented by discarding intermediate crates and later rebuilding them.
10. Communication traffic causing fast workers to wait for a straggler.
11. A distributed checkpoint assembled from many worker-owned shards.

---

## Chapter 17 — From Completion Machine to Helpful Assistant

High-value scenes:

1. The Fine-Tuning Coach presenting a curated conversation script.
2. A Chat Template Stage Manager placing system, user, assistant, and end markers.
3. Response-only target masks covering prompt labels while leaving prompt context visible.
4. The Preference Judge comparing chosen and rejected responses against a rubric.
5. A frozen Reference Model watching from behind glass during preference optimisation.
6. A reward gauge or DPO margin board showing relative preference rather than absolute truth.
7. The Adapter Technician attaching low-rank A and B plates to a frozen base matrix.
8. A parameter-count comparison between the giant base panel and small adapter plates.
9. Separate adapters stored like interchangeable cartridges for one shared base model.
10. A regression-testing scene showing that improved target behaviour can coexist with new weaknesses.

---

# 10. Initial design-production order

Before full storyboarding, design these seven recurring characters:

1. Data Librarian
2. Answer-Key Clerk
3. Scorekeeper
4. Gradient Courier
5. Optimizer Engineer
6. Validation Inspector
7. Checkpoint Archivist

Then design these shared props and machines:

- Softmax probability machine;
- logarithmic penalty gauge;
- loss-receipt printer;
- masked mean-loss calculator;
- gradient envelopes and shape labels;
- accumulation tray;
- learning-rate dial;
- gradient clipping gate;
- parameter control panels;
- causal curtain;
- padding covers;
- loss-mask tape;
- document-divider walls.

After that, design the chapter-specific cast:

- Worker Crew;
- Fine-Tuning Coach;
- Preference Judge;
- Adapter Technician.

---

# 11. The central training trio

The most important recurring relationship is:

```text
Scorekeeper
    prints the loss
        |
        v
Gradient Courier
    calculates and delivers correction reports
        |
        v
Optimizer Engineer
    applies actual parameter updates
```

This trio should carry the central narrative of Chapters 13–15.

It provides a memorable distinction among:

- evaluating the model’s prediction;
- differentiating the loss;
- changing persistent parameters.

---

# 12. Illustration guardrails

1. **Metaphor must not override computation.** Captions and equations remain authoritative.
2. **Teacher forcing must not look like future-token leakage.** Targets reach the loss path, not the causal attention path.
3. **The scalar loss does not physically flow backward.** The backward path carries derivatives of loss.
4. **The Gradient Courier never updates parameters.** The Optimizer Engineer performs updates.
5. **Validation never feeds ordinary optimiser updates.** Its lane has no backward connection to the Engineer.
6. **Frozen parameters still participate in computation.** Their machinery remains active but locked.
7. **LoRA reduces trainable parameter state, not all memory and computation.** Activations and backward signals remain visible.
8. **Distributed workers do not train independent models.** Synchronisation must visibly restore one shared update.
9. **All masks are not interchangeable.** Use distinct props and labels.
10. **Avoid character overload.** Prefer one recurring persona plus several clear props over many one-use mascots.

---

# 13. Scene specification template

Each final scene request should be documented using this structure:

```text
Scene ID:
Chapter and section:
Learning objective:
Characters:
Props:
Location:
Foreground action:
Background context:
Forward arrows:
Backward arrows:
Labels and equations:
Misconception to avoid:
Continuity references to earlier artwork:
Aspect ratio and intended placement:
```

This template should be completed before generating each illustration. It will make visual review easier and reduce inconsistent character or object design.

---

# 14. Current status

- The visual system and recurring training cast are planned.
- No final training-loop graphics have been generated from this document yet.
- The next production step is to create character sheets for the seven core personas and a reusable prop sheet.
- Full chapter storyboards should then be written scene by scene using the specification template above.
