# Chapter 23 Graphics Scene Plan

## Chapter

**Chapter 23 — Smaller, Faster, Cheaper**  
**Subtitle:** Quantisation, distillation, sparsity, mixture-of-experts routing, batching, caching, and serving trade-offs

## Status

This document is the canonical production specification for all Chapter 23 graphics. Final artwork belongs under `assets/chapter-23/`.

---

# 1. Chapter visual objective

Connect each efficiency technique to the resource bottleneck it addresses and show why storage, arithmetic, bandwidth, latency, throughput, and quality are not interchangeable metrics.

```text
measure bottleneck
  -> choose compression, architecture, cache, scheduling, or parallelism
  -> verify hardware speed and memory
  -> evaluate quality and tail latency
```

Central lesson:

> Efficiency is workload- and hardware-dependent. Fewer bits or parameters help only when the serving path can exploit them without unacceptable quality or operational costs.

---

# 2. Style and continuity locks

- Use a Deployment Workshop with memory scales, compute meters, bandwidth pipes, and request queues.
- Always label bit width when comparing model memory.
- Separate prefill from decode and latency from throughput.
- Distinguish total from active MoE parameters.
- KV-cache drawings grow with sequence length and layer count.
- Compression scenes retain evaluation gauges; lower perplexity is not the only quality criterion.
- The final scene hands the deployed system to Chapter 24’s verification and risk review.

---

# 3. Reusable design elements

## Deployment Engineer

Measures the workload and selects an optimisation only after locating the bottleneck.

## Precision press

Maps weights or activations to lower-bit representations with visible scales and error.

## Request scheduler

Manages batches, continuous arrivals, padding, cache pages, and tail latency.

## Quality inspector

Checks capability, calibration, robustness, safety, subgroup effects, and task-specific regressions.

---

# 4. Scene inventory

The planned Chapter 23 set contains **11 artwork files**.

## Scene 01 — Chapter hero: the Deployment Workshop

**Asset:** `assets/chapter-23/01_chapter_hero_deployment_workshop.png`  
**Placement:** Chapter opening.  
**Learning objective:** Introduce the four resource pressures and measured optimisation.

**Composition:** The multimodal model from Chapter 22 strains weight-memory shelves, activation/KV storage, compute engines, and bandwidth pipes. Latency and throughput clocks show different readings.

**Alt text draft:** A Deployment Workshop measures weight memory, activation and cache memory, compute, bandwidth, latency, and throughput before choosing optimisations.

## Scene 02 — Exact weight-memory calculation

**Asset:** `assets/chapter-23/02_exact_weight_memory.png`  
**Placement:** Beside “Weight memory calculation.”  
**Learning objective:** Calculate storage from parameter count and precision.

**Required results:** `7B × 16 bits = 14 GB` raw decimal storage; `7B × 4 bits = 3.5 GB`, before metadata, scales, runtime buffers, and framework overhead.

**Composition:** Seven billion weight icons pass through 16-bit and 4-bit packing lanes onto labelled scales.

**Do not show:** raw weight size as total serving memory.  
**Alt text draft:** Seven billion weights require about 14 GB at 16 bits or 3.5 GB at 4 bits before quantisation metadata and runtime memory.

## Scene 03 — Quantisation mechanism and scale granularity

**Asset:** `assets/chapter-23/03_quantisation_scales_and_error.png`  
**Placement:** Across quantisation and scale sections.  
**Learning objective:** Show rounding, scale, clipping, and granularity tradeoffs.

**Composition:** A continuous number line maps through scale and zero-point controls to discrete bins, then dequantises with visible error. Insets compare per-tensor, per-channel, and grouped scales.

**Do not show:** lossless compression or one universal scale.  
**Alt text draft:** Quantisation maps continuous values into discrete low-bit bins using scale parameters, introducing approximation whose severity depends partly on scale granularity.

## Scene 04 — What is quantised, when, and whether hardware benefits

**Asset:** `assets/chapter-23/04_quantisation_variants_and_hardware.png`  
**Placement:** Across weight-only, activation, KV-cache, PTQ, and QAT sections.  
**Learning objective:** Distinguish quantisation targets and deployment support.

**Composition:** Separate lanes for weights, weights plus activations, and KV cache. PTQ calibrates a trained model; QAT simulates quantisation during training. A hardware gate checks kernel support, packing overhead, bandwidth, and conversion cost.

**Do not show:** 4-bit storage guaranteeing faster tokens.  
**Alt text draft:** Quantisation may target weights, activations, or cache and may be applied after training or simulated during training, but speed depends on supported hardware kernels and overhead.

## Scene 05 — Distillation teacher and student

**Asset:** `assets/chapter-23/05_distillation_teacher_student.png`  
**Placement:** Across distillation.  
**Learning objective:** Show soft-target and task-loss transfer.

**Composition:** A large frozen teacher produces a probability distribution or logits at each generation position; a smaller student balances distillation loss with ground-truth loss. Sequence-level examples are visibly optional variants.

**Do not show:** weights copied directly or student guaranteed to match every capability.  
**Alt text draft:** A smaller student learns from a larger teacher’s output distribution, often alongside ground-truth training, and must be evaluated for capability loss.

## Scene 06 — Pruning, structured sparsity, and MoE

**Asset:** `assets/chapter-23/06_sparsity_and_moe.png`  
**Placement:** Across pruning and mixture of experts.  
**Learning objective:** Separate removing weights from conditional activation.

**Composition:** Unstructured sparsity removes scattered connections; structured sparsity removes whole blocks or channels; an MoE router sends each token to a small subset of experts. Counters show total versus active parameters and communication/load-balancing costs.

**Do not show:** all MoE experts active for every token or sparse weights automatically fast.  
**Alt text draft:** Pruning creates unstructured or hardware-friendly structured sparsity, while a mixture-of-experts router activates only selected experts from a larger total parameter pool.

## Scene 07 — Prefill, decode, and KV-cache growth

**Asset:** `assets/chapter-23/07_prefill_decode_kv_cache.png`  
**Placement:** Across prompt processing and cache sections.  
**Learning objective:** Distinguish two inference phases and growing memory.

**Composition:** Prefill processes many prompt tokens in parallel and fills per-layer K/V shelves. Decode processes one new position per sequence step, reads the shelves, and adds one entry. A memory ruler grows with layers, sequence length, batch, and KV-head count.

**Do not show:** recomputing all prior K/V each step.  
**Alt text draft:** Prefill processes the prompt and fills the KV cache, while decoding repeatedly reads that cache and appends one new position per generated token.

## Scene 08 — Cache and attention-footprint optimisations

**Asset:** `assets/chapter-23/08_kv_cache_and_prefix_optimisations.png`  
**Placement:** Across MQA, GQA, prefix caching, and paged cache.  
**Learning objective:** Show distinct ways to reduce or reuse cache memory.

**Composition:** Multi-head attention has separate K/V shelves per head; grouped-query attention shares within groups; multi-query shares one K/V set. Identical prompt prefixes reuse a sealed cache block, while virtual pages prevent large contiguous reservations.

**Do not show:** prefix reuse across different model versions or incompatible settings.  
**Alt text draft:** Grouped and multi-query attention reduce KV-head storage, prefix caching reuses compatible prompt work, and paged management allocates cache in flexible blocks.

## Scene 09 — Batching, padding, and continuous scheduling

**Asset:** `assets/chapter-23/09_continuous_batching_and_padding.png`  
**Placement:** Across batching sections.  
**Learning objective:** Explain throughput gains and latency tradeoffs.

**Composition:** A static batch waits for the longest sequence and wastes padded slots; a continuous scheduler removes completed requests and admits new ones. Show request latency, tokens per second, and tail latency as separate gauges.

**Do not show:** batching always reducing single-request latency.  
**Alt text draft:** Static batching wastes work on padding and waits for long sequences, while continuous batching replaces finished requests to improve utilisation and throughput.

## Scene 10 — Speculative decoding and inference parallelism

**Asset:** `assets/chapter-23/10_speculative_decoding_and_parallelism.png`  
**Placement:** Across speculative decoding and parallelism.  
**Learning objective:** Show verification and four division strategies.

**Composition:** A small draft model proposes several tokens; the target model verifies them in a batch and accepts a prefix before correcting the rest. A side map distinguishes tensor, pipeline, expert, and replica parallelism with communication links.

**Do not show:** draft tokens accepted without target-model verification or distributed speedup as free.  
**Alt text draft:** Speculative decoding uses a fast draft model to propose tokens that the target model verifies, while inference parallelism divides tensors, stages, experts, or independent requests.

## Scene 11 — Bottleneck-first dashboard and verification handoff

**Asset:** `assets/chapter-23/11_efficiency_dashboard_and_handoff.png`  
**Placement:** Across throughput, quality, mistakes, and “Coming next.”  
**Learning objective:** Require end-to-end measurement before deployment.

**Required result:** `1,200 output tokens/s ÷ 24 active sequences = 50 tokens/s per active sequence`.

**Composition:** Include the exact throughput calculation beside gauges for time to first token, inter-token latency, requests and tokens per second, p50/p95/p99 latency, memory, power, and cost. The Quality Inspector tests perplexity, task performance, calibration, robustness, safety, and subgroups. A verification auditor receives the optimised system.

**Do not show:** one benchmark or average latency as sufficient.  
**Alt text draft:** A bottleneck-first dashboard measures speed, memory, cost, tail latency, and several quality dimensions before the optimised system enters final verification.

---

# 5. Production checklist

- [ ] Memory comparisons always include precision and identify raw versus runtime memory.
- [ ] Quantisation error, scale metadata, and hardware support remain visible.
- [ ] Total and active MoE parameters are separate.
- [ ] Prefill and decode are visually and computationally distinct.
- [ ] Speculative tokens require target-model verification.
- [ ] Efficiency claims include hardware, workload, quality, and tail-latency measurements.
