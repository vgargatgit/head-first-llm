# Chapter 16 artwork

These eleven production assets implement the canonical scene inventory in
`docs/chapter-16/chapter-16-scene-plan.md`. All images use the book's standard
1448 × 1086 landscape canvas.

| Asset | Placement | Alt text |
|---|---|---|
| `01_chapter_hero_distributed_workers.png` | Chapter opening | Several coordinated workers process different microbatches, then send their local gradients to a shared collective operation. |
| `02_data_parallel_all_reduce.png` | Data parallelism and all-reduce | Data-parallel workers process different examples, average their local gradients, and apply the same synchronised update. |
| `03_exact_gradient_average.png` | Four-worker calculation | Four local two-coordinate gradients are combined and divided by four to produce the average gradient 0.1 and 0. |
| `04_training_memory_components.png` | Training-memory inventory | Training memory is divided among parameters, gradients, optimiser states, activations, temporary buffers, and communication workspace. |
| `05_exact_bytes_per_parameter.png` | Illustrative memory estimate | An illustrative Adam-style memory model uses 16 bytes per parameter, so one billion parameters need about 16 GB of persistent state before other memory costs. |
| `06_sharded_parameter_warehouse.png` | Fully sharded training | Workers permanently own different model-state shards, temporarily gather a layer for computation, and reduce-scatter gradients back to their owners. |
| `07_tensor_parallel_matrix_split.png` | Tensor parallelism | Tensor-parallel workers split one large matrix operation across devices and communicate to assemble the full result. |
| `08_pipeline_parallel_bubble.png` | Pipeline parallelism | Pipeline stages own different layer groups while microbatch activation and gradient crates move through a schedule containing visible idle bubbles. |
| `09_activation_checkpointing.png` | Activation checkpointing | Activation checkpointing saves selected intermediate states and recomputes discarded activations during backward to trade compute for memory. |
| `10_communication_and_stragglers.png` | Topology and scaling | Fast and slow interconnects, communication overlap, and one straggling worker determine the efficiency of synchronous distributed training. |
| `11_parallelism_taxonomy_and_handoff.png` | Chapter ending | Four panels distinguish data, sharded-state, tensor, and pipeline parallelism before a distributed checkpoint reconstructs the trained base model for post-training. |

## Production notes

- Generated with the built-in image generation workflow.
- Style references: Chapters 12–15, especially the Chapter 15 training-factory
  hero and exact-calculation panels.
- Purple marks model computation and system structure; red-orange dashed paths
  mark gradients; gold marks parameters and final results; blue marks
  communication.
- Every parallelism strategy has a separate physical metaphor: different data
  carts, puzzle-piece state shards, a sliced matrix workbench, or layer-stage
  floors.
- Exact calculations and technical guardrails follow the Chapter 16 source and
  scene plan.
