# Chapter 16 Graphics Scene Plan

## Chapter

**Chapter 16 — The Model Outgrows One Machine**  
**Subtitle:** How data parallelism, sharding, tensor parallelism, and pipeline parallelism divide training work

## Status

This document is the canonical production specification for all Chapter 16 graphics. Final artwork belongs under `assets/chapter-16/`.

The chapter expands the Chapter 15 factory into several coordinated devices. It must make different parallelism strategies visually distinct rather than depicting all distributed training as identical cloned workers.

---

# 1. Chapter visual objective

Show why training is distributed for two different reasons—throughput and memory capacity—and how data parallelism, state sharding, tensor parallelism, pipeline parallelism, activation checkpointing, and communication solve different bottlenecks.

```text
same global training objective
    -> different data on replicated workers
    -> gradient synchronisation
or
large model state / operation / layer stack
    -> divide state or computation across devices
    -> communicate intermediate results
    -> preserve one coordinated model update
```

Central lesson:

> Distributed strategies divide different things: examples, persistent state, tensor operations, or layer stages. They are complementary tools, not interchangeable names for the same design.

---

# 2. Style and continuity locks

- Preserve the Chapter 15 factory style, Worker Crew identity, microbatch carts, gradient envelopes, and Optimizer Engineer controls.
- Identical worker characters indicate the same model design, not separate unrelated models.
- Use persistent visual codes:
  - different data carts = data parallelism;
  - puzzle-piece storage crates = state sharding;
  - sliced matrix/workbench = tensor parallelism;
  - vertically staged floors = pipeline parallelism.
- Communication uses cables, tubes, roundtables, or collective-operation rings.
- Waiting and communication overhead remain visible; distributed speedup is never portrayed as free.
- The final scene hands the trained base model to the Post-Training Studio in Chapter 17.

---

# 3. Reusable design elements

## Worker Crew

Identical operators running coordinated copies or shards of the same training system.

## All-Reduce Roundtable

A collective device that combines local gradient reports and returns the same result to every data-parallel worker.

## Sharded parameter warehouse

Persistent model weights, gradients, and optimiser states divided among workers as labelled puzzle-piece crates.

## Tensor-operation workbench

One matrix multiplication physically partitioned across several devices with partial outputs combined.

## Pipeline floors

Different groups of layers assigned to different stages, with microbatch activation crates moving between them.

## Communication topology map

Fast local links and slower cross-node links shown explicitly.

---

# 4. Scene inventory

The planned Chapter 16 set contains **11 artwork files**.

---

## Scene 01 — Chapter hero: the distributed worker floor

**Asset**

```text
assets/chapter-16/01_chapter_hero_distributed_workers.png
```

**Placement:** Chapter opening.

**Learning objective:** Introduce coordinated workers as one training system.

**Composition**

- Several identical Worker Crew stations receive different microbatch carts.
- Each station has the same model blueprint.
- Local gradient envelopes move toward an All-Reduce Roundtable.
- A giant model-state warehouse in the background does not fit at one station.

**Do not show:** workers training independent models or instantaneous communication.

**Alt text draft:** Several coordinated workers process different microbatches, then send their local gradients to a shared collective operation.

---

## Scene 02 — Synchronous data-parallel mechanism

**Asset**

```text
assets/chapter-16/02_data_parallel_all_reduce.png
```

**Placement:** Across the data-parallel section.

**Learning objective:** Show replicated computation, different data, and synchronised gradients.

**Composition**

1. Same initial parameter panel at every worker.
2. Different local examples.
3. Local forward/backward computation.
4. Local gradient envelopes.
5. All-reduce combination.
6. Every worker receives the same averaged gradient and performs the same update.

**Required formula**

```text
g_bar = (1/N) sum_r g_r
```

**Do not show:** parameter averaging after unrelated updates as the primary mechanism, or only one worker receiving the result.

**Alt text draft:** Data-parallel workers process different examples, average their local gradients, and apply the same synchronised update.

---

## Scene 03 — Exact four-worker gradient average

**Asset**

```text
assets/chapter-16/03_exact_gradient_average.png
```

**Placement:** Beside the chapter’s numerical all-reduce example.

**Learning objective:** Anchor the collective operation in exact vector arithmetic.

**Required result**

```text
combined average gradient = [0.1, 0]
```

**Composition**

- Four worker envelopes contain the chapter’s local two-coordinate gradients.
- The roundtable sums coordinate by coordinate.
- Division by four produces `[0.1, 0]`.
- Sum-versus-mean convention is explicitly labelled.

**Do not show:** both summing and averaging without accounting for the learning-rate/reduction convention.

**Alt text draft:** Four local two-coordinate gradients are combined and divided by four to produce the average gradient 0.1 and 0.

---

## Scene 04 — Training-memory inventory

**Asset**

```text
assets/chapter-16/04_training_memory_components.png
```

**Placement:** Near the memory-breakdown section.

**Learning objective:** Show why parameter count alone understates training memory.

**Composition**

Separate labelled storage areas for:

- model parameters;
- gradients;
- master or working parameter copies where applicable;
- first optimiser moment;
- second optimiser moment;
- activations;
- temporary kernels/buffers;
- communication workspace.

A caution marks architecture, precision, optimiser, and framework dependence.

**Do not show:** the illustrative byte estimate as universal or activations as fixed per parameter.

**Alt text draft:** Training memory is divided among parameters, gradients, optimiser states, activations, temporary buffers, and communication workspace.

---

## Scene 05 — Exact illustrative bytes-per-parameter estimate

**Asset**

```text
assets/chapter-16/05_exact_bytes_per_parameter.png
```

**Placement:** Beside the chapter’s memory estimate.

**Learning objective:** Calculate one clearly labelled mixed-precision Adam-style example.

**Required values**

```text
illustrative persistent state = 16 bytes/parameter
1 billion parameters ≈ 16 GB
ideal 8-way full sharding ≈ 2 GB/worker
before activations, buffers, fragmentation, and communication overhead
```

**Composition**

- One parameter icon expands into its persistent-state byte components.
- One billion icons become a 16 GB warehouse.
- Eight workers receive equal idealised shards.
- A large `ILLUSTRATIVE, NOT UNIVERSAL` banner remains visible.

**Alt text draft:** An illustrative Adam-style memory model uses 16 bytes per parameter, so one billion parameters need about 16 GB of persistent state before other memory costs.

---

## Scene 06 — Fully sharded parameter warehouse

**Asset**

```text
assets/chapter-16/06_sharded_parameter_warehouse.png
```

**Placement:** Across the fully sharded training section.

**Learning objective:** Show persistent state ownership, all-gather for computation, and reduce-scatter after backward.

**Composition**

- Each worker permanently stores a different shard of parameters, gradients, and optimiser state.
- Before one layer computation, needed parameter pieces are temporarily all-gathered.
- After gradients are produced, reduce-scatter returns only the owned shard.
- Temporary gathered pieces are released.

**Do not show:** every worker persistently storing the full model or sharding eliminating all temporary memory.

**Alt text draft:** Workers permanently own different model-state shards, temporarily gather a layer for computation, and reduce-scatter gradients back to their owners.

---

## Scene 07 — Tensor-parallel matrix split

**Asset**

```text
assets/chapter-16/07_tensor_parallel_matrix_split.png
```

**Placement:** Near tensor parallelism.

**Learning objective:** Show one operation divided across devices rather than different examples sent to replicas.

**Composition**

- One large matrix board is sliced by columns or rows across devices.
- Every device works on the same token batch.
- Partial outputs are concatenated or reduced according to the chosen split.
- A side-by-side contrast with data parallelism highlights `same data, divided operation`.

**Do not show:** each device running the whole operation on different data, or partial results combined without the required collective.

**Alt text draft:** Tensor-parallel workers split one large matrix operation across devices and communicate to assemble the full result.

---

## Scene 08 — Pipeline stages and bubbles

**Asset**

```text
assets/chapter-16/08_pipeline_parallel_bubble.png
```

**Placement:** Across pipeline-parallelism discussion.

**Learning objective:** Show layer-stage partitioning, microbatch scheduling, and idle bubbles.

**Composition**

- Transformer floors are divided among Stage 1, Stage 2, and Stage 3 devices.
- Activation crates travel forward; gradient crates return backward.
- Several microbatches overlap in a schedule grid.
- Empty time cells form a clearly labelled pipeline bubble.

**Do not show:** zero waiting, one microbatch fully utilising all stages, or parameters automatically shared across stages.

**Alt text draft:** Pipeline stages own different layer groups while microbatch activation and gradient crates move through a schedule containing visible idle bubbles.

---

## Scene 09 — Activation checkpointing

**Asset**

```text
assets/chapter-16/09_activation_checkpointing.png
```

**Placement:** Near activation checkpointing.

**Learning objective:** Show the memory-compute trade-off.

**Composition**

- Normal lane stores every intermediate activation crate.
- Checkpointed lane stores selected boundary crates and discards interior crates.
- During backward, discarded values are recomputed from the nearest saved boundary.
- Memory shelves shrink while a recomputation meter rises.

**Do not show:** model-state sharding or saving training checkpoints; activation checkpointing is a different meaning of checkpoint.

**Alt text draft:** Activation checkpointing saves selected intermediate states and recomputes discarded activations during backward to trade compute for memory.

---

## Scene 10 — Topology, communication overlap, and stragglers

**Asset**

```text
assets/chapter-16/10_communication_and_stragglers.png
```

**Placement:** Across topology and scaling-efficiency sections.

**Learning objective:** Show why physical links and the slowest worker affect scaling.

**Composition**

- Workers within one node have fast links; cross-node links are slower.
- Compute and communication timelines overlap where possible.
- One slow worker or congested link delays a synchronisation barrier.
- Scaling-efficiency gauge compares ideal and measured speedup.

**Do not show:** linear speedup guaranteed by adding devices or average worker speed determining a synchronous step.

**Alt text draft:** Fast and slow interconnects, communication overlap, and one straggling worker determine the efficiency of synchronous distributed training.

---

## Scene 11 — Parallelism taxonomy, distributed checkpoint, and handoff

**Asset**

```text
assets/chapter-16/11_parallelism_taxonomy_and_handoff.png
```

**Placement:** Chapter ending.

**Learning objective:** Consolidate the strategies, show recoverable distributed state, and move the base model into post-training.

**Composition**

Four clear panels:

```text
Data parallelism: different data, replicated computation
State sharding: persistent model state divided
Tensor parallelism: one tensor operation divided
Pipeline parallelism: layer stages divided
```

- A distributed checkpoint archive collects all worker-owned shards plus metadata needed to reconstruct placement.
- The completed base model exits toward the Post-Training Studio.

**Do not show:** any strategy as universally superior or distributed checkpoint shards usable without coordination metadata.

**Alt text draft:** Four panels distinguish data, sharded-state, tensor, and pipeline parallelism before a distributed checkpoint reconstructs the trained base model for post-training.

---

# 5. Placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_distributed_workers.png` | Hero |
| 2 | `02_data_parallel_all_reduce.png` | Data-parallel mechanism |
| 3 | `03_exact_gradient_average.png` | Exact calculation |
| 4 | `04_training_memory_components.png` | Memory inventory |
| 5 | `05_exact_bytes_per_parameter.png` | Exact estimate |
| 6 | `06_sharded_parameter_warehouse.png` | State sharding |
| 7 | `07_tensor_parallel_matrix_split.png` | Tensor parallelism |
| 8 | `08_pipeline_parallel_bubble.png` | Pipeline parallelism |
| 9 | `09_activation_checkpointing.png` | Memory-compute trade-off |
| 10 | `10_communication_and_stragglers.png` | Scaling limitations |
| 11 | `11_parallelism_taxonomy_and_handoff.png` | Recap, recovery, and handoff |

---

# 6. Numerical and conceptual source of truth

```text
four-worker average gradient = [0.1, 0]
illustrative persistent state = 16 bytes/parameter
1B parameters ≈ 16 GB
ideal 8-way shard ≈ 2 GB/worker before overheads
```

These are teaching estimates, not universal memory contracts. Every final visual must keep persistent state, activations, temporary allocations, and communication costs conceptually separate.

---

# 7. Production checklist

- [ ] Different parallelism strategies have distinct visual metaphors.
- [ ] Data-parallel workers process different examples but preserve one model update.
- [ ] All-reduce sum/mean convention is labelled.
- [ ] Sharding includes temporary all-gather and reduce-scatter.
- [ ] Tensor parallelism divides one operation.
- [ ] Pipeline scheduling includes bubbles.
- [ ] Activation checkpointing is not confused with model checkpoint files.
- [ ] Topology and stragglers remain visible.
- [ ] Memory estimates are labelled illustrative.
- [ ] Every scene has verified typography and alt text.

---

# 8. Chapter 16 definition of done

Chapter 16 graphics are complete only when all eleven assets are approved, committed under `assets/chapter-16/`, integrated into the chapter, and technically reviewed to ensure every distributed strategy divides the correct object and communicates at the correct point.

---

# 9. Current status

- Detailed scene planning: complete.
- Worker, collective, sharding, tensor, pipeline, and topology props specified.
- Final artwork generation: not started.
- Integration and website review: pending final artwork.
