---
title: "Chapter 23 — Smaller, Faster, Cheaper"
subtitle: "Quantisation, distillation, sparsity, mixture-of-experts routing, batching, caching, and serving trade-offs"
lang: en
---

# The question this chapter answers

A model may be accurate enough in a notebook and still be impractical in production.

Its weights may not fit in memory. Its first token may arrive too slowly. Generation may stall when many users arrive. Long conversations may consume more memory than the parameters themselves. A smaller model may be fast but lose important capability.

How do engineers reduce memory and computation without pretending every optimisation is free?

<div class="big-idea">

**Efficiency is a budget-allocation problem across memory, compute, bandwidth, latency, throughput, and quality. Every optimisation moves pressure somewhere else. The right design starts by identifying the real bottleneck.**

</div>

# Meet the Deployment Workshop

The trained model arrives as a huge machine.

The Deployment Workshop has several specialists:

```text
Quantiser       -> stores numbers with fewer bits
Distiller       -> trains a smaller student
Cache Manager   -> reuses earlier computation
Batch Dispatcher-> serves several requests together
Router          -> activates selected experts
Scheduler       -> balances latency and throughput
```

No specialist can improve every metric simultaneously.

# The four main resource pressures

## Weight memory

How much memory is required to store model parameters?

## Activation and cache memory

How much temporary state is required for the current batch and context?

## Compute

How many arithmetic operations are needed?

## Memory bandwidth and communication

How quickly can weights, activations, and distributed tensors move to the processors that need them?

A model can be compute-bound in one regime and bandwidth-bound in another.

# Latency and throughput are different

**Latency** measures how long one request waits.

**Throughput** measures how much total work the system completes per unit time.

For autoregressive generation, two latency measures are especially useful:

- **time to first token:** prompt processing plus scheduling delay;
- **time per output token:** speed of the repeated decoding loop.

A system can improve throughput with larger batches while making an individual request wait longer.

# Weight memory calculation

Suppose a model has 7 billion parameters.

At 16 bits, each parameter uses 2 bytes.

Ignoring metadata and runtime overhead:

$$
7\times10^9\cdot2
=14\times10^9\ \text{bytes}
$$

That is approximately 14 GB in decimal units.

At 8 bits:

$$
7\times10^9\cdot1
=7\ \text{GB}
$$

At 4 bits:

$$
7\times10^9\cdot0.5
=3.5\ \text{GB}
$$

These are raw weight estimates.

Actual memory also includes scales, zero points, embeddings, temporary buffers, framework overhead, and possibly higher-precision copies of selected tensors.

# Quantisation

Quantisation represents values with fewer bits.

A simple affine quantiser maps a real value $x$ to an integer $q$:

$$
q
=
\operatorname{round}
\left(
\frac{x}{s}
\right)+z
$$

where:

- $s$ is a scale;
- $z$ is a zero point.

Approximate dequantisation is:

$$
\hat{x}
=s(q-z)
$$

Quantisation introduces error:

$$
\epsilon=x-\hat{x}
$$

The goal is to reduce storage and bandwidth while keeping the resulting model useful.

# Weight-only versus activation quantisation

## Weight-only quantisation

Weights are stored at low precision, while activations may remain at higher precision.

This reduces weight memory and bandwidth and is common for autoregressive inference.

## Weight-and-activation quantisation

Both weights and activations use reduced precision.

This can unlock faster hardware kernels but may require more calibration or quantisation-aware training.

## KV-cache quantisation

The Keys and Values stored for previous tokens are quantised.

This targets memory that grows with context length and batch size.

Each choice has different numerical and kernel constraints.

# Per-tensor, per-channel, and grouped scales

One scale for an entire matrix is cheap but may represent outliers poorly.

Finer scaling can improve accuracy:

- per tensor;
- per output channel;
- per input channel;
- per group of weights;
- per token or per activation block.

Finer scales add metadata and implementation complexity.

# Post-training quantisation

Post-training quantisation starts from an existing trained checkpoint.

A calibration set may be used to estimate ranges, outliers, or reconstruction error.

Methods such as GPTQ quantise weights while attempting to minimise the effect of quantisation error on model outputs.

Benefits:

- no full retraining run;
- smaller checkpoints;
- easier experimentation.

Risks:

- quality loss on sensitive tasks;
- unsupported kernels;
- slower dequantisation paths;
- calibration mismatch;
- larger errors in small or unusual layers.

# Quantisation-aware training

Quantisation-aware training simulates reduced-precision effects during training or fine-tuning.

The model learns parameters that are more robust to the intended representation.

This can improve quality but requires a training pipeline and careful numerical handling.

# Fewer bits do not guarantee faster generation

A 4-bit checkpoint can be smaller without being faster.

Speed depends on:

- hardware support;
- kernel implementation;
- dequantisation overhead;
- batch size;
- memory bandwidth;
- matrix shape;
- whether the bottleneck was weight loading;
- whether other components remain high precision.

Measure end-to-end performance on the deployment hardware.

# Distillation

Knowledge distillation trains a smaller **student** model to imitate a larger **teacher**.

For classification logits, a temperature-softened teacher distribution is:

$$
p_i^{(T)}
=
\frac{\exp(z_i/T)}
{\sum_j\exp(z_j/T)}
$$

The student can minimise a combination of ordinary target loss and teacher-matching loss:

$$
\mathcal{L}
=
\lambda\mathcal{L}_{\mathrm{hard}}
+(1-\lambda)T^2
D_{\mathrm{KL}}
\left(
 p_{\mathrm{teacher}}^{(T)}
 \,\|\,
 p_{\mathrm{student}}^{(T)}
\right)
$$

The teacher’s full probability distribution can reveal similarities between alternatives that a one-hot label does not show.

# Distillation for language generation

A language-model student may imitate:

- token distributions;
- generated sequences;
- intermediate hidden states;
- attention patterns;
- reasoning traces when appropriate and permitted;
- preference rankings;
- task-specific outputs.

The student can become much cheaper, but it has less capacity. It may lose rare knowledge, long-tail robustness, multilingual breadth, or complex reasoning.

# Pruning and sparsity

Pruning removes or disables parameters, channels, heads, blocks, or activations judged less important.

## Unstructured sparsity

Individual weights are zeroed.

This can create high sparsity but may not run faster without specialised sparse kernels.

## Structured sparsity

Whole groups such as channels, blocks, or heads are removed.

This aligns better with ordinary dense hardware but may cause larger quality loss per removed parameter.

A sparse file is not automatically a fast model.

# Mixture of experts

A mixture-of-experts, or MoE, layer contains several expert networks and a router.

For token representation $x$, the router produces scores:

$$
r(x)
=
\operatorname{softmax}(W_rx)
$$

Only the top $k$ experts may be activated:

$$
y
=
\sum_{e\in\operatorname{TopK}(r(x))}
\alpha_eE_e(x)
$$

This allows total parameter count to grow while keeping active computation per token smaller than using every expert.

# MoE is not free capacity

MoE introduces:

- routing overhead;
- expert load imbalance;
- all-to-all communication;
- unused capacity when tokens concentrate on a few experts;
- more complicated batching;
- expert placement constraints;
- training-stability challenges.

A trillion total parameters do not imply that every token uses a trillion parameters.

Report both total and active parameters.

# Prompt processing and token decoding

Autoregressive inference has two phases.

## Prefill

The model processes the full prompt.

Many prompt tokens can be processed in parallel inside each layer.

Prefill is often compute-intensive.

## Decode

The model generates one new token per sequence at a time.

Previous Keys and Values are reused from cache.

Decode often becomes sensitive to memory bandwidth and batching efficiency because each step performs relatively small matrix operations repeatedly.

# The KV cache

For each decoder layer, earlier tokens contribute Keys and Values that future tokens need.

Without caching, the model would recompute those projections for the whole prefix at every step.

A simplified cache-memory estimate is:

$$
\text{bytes}
=
B\cdot L\cdot T\cdot 2\cdot H_{kv}\cdot d_h\cdot b
$$

where:

- $B$ is batch size;
- $L$ is number of layers;
- $T$ is cached sequence length;
- the factor 2 represents Keys and Values;
- $H_{kv}$ is number of KV heads;
- $d_h$ is head dimension;
- $b$ is bytes per cache element.

Cache memory grows linearly with batch size and sequence length.

# Multi-query and grouped-query attention

Standard multi-head attention can use separate Keys and Values for every Query head.

Multi-query attention shares one set of KV heads across many Query heads.

Grouped-query attention uses fewer KV heads than Query heads but more than one.

This reduces KV-cache memory and bandwidth while preserving multiple Query heads.

The trade-off is reduced KV diversity.

# Prefix caching

Many requests may share the same prefix:

- a long system prompt;
- a common document template;
- a fixed tool schema;
- shared retrieved context.

Prefix caching stores intermediate state for the shared prefix so later requests can reuse it.

The cache key must include every input that affects computation: model version, adapters, tokenisation, position handling, and relevant settings.

# Batching

Batching combines requests so hardware performs larger, more efficient matrix operations.

Static batching waits for a fixed group and often wastes capacity when sequences finish at different times.

Continuous batching inserts new requests as others complete.

This improves utilisation but requires careful scheduling and cache management.

# Padding waste

If one request has 2,000 prompt tokens and another has 100, padding both to 2,000 can waste work.

Useful strategies include:

- length-aware batching;
- packed prefill;
- variable-length attention kernels;
- separate queues for prompt and decode phases;
- chunked prefill.

# Paged cache management

KV caches have variable lifetimes and sizes.

Allocating one large contiguous block per request can fragment memory.

Paged approaches divide cache memory into blocks and map logical token positions to physical pages.

This allows flexible growth, sharing, and reclamation, at the cost of bookkeeping and specialised kernels.

# Speculative decoding

Speculative decoding uses a smaller draft model to propose several tokens.

A larger target model verifies the proposals in fewer expensive passes.

```text
draft model proposes: A B C D
large model verifies probabilities
accept matching prefix
resample at first rejection
```

When the draft model’s proposals agree often enough, generation can accelerate without changing the target distribution under the exact algorithm.

Performance depends on:

- draft-model speed;
- acceptance rate;
- verification cost;
- batch size;
- hardware;
- sequence characteristics.

# Parallelism at inference

Large models may require several devices.

## Tensor parallelism

Splits large matrix operations across devices.

## Pipeline parallelism

Places different layers on different devices.

## Expert parallelism

Distributes MoE experts across devices.

## Data or replica parallelism

Runs independent model copies for different requests.

More devices can provide capacity while adding communication and scheduling overhead.

# Throughput calculation

Suppose a server produces 1,200 output tokens per second across a batch of 24 active sequences.

Average throughput per active sequence is:

$$
1200/24
=50\ \text{tokens per second}
$$

This average does not reveal tail latency.

Some requests may be faster, while others wait in the queue or compete for long prompts.

Report distributions such as median, 95th percentile, and 99th percentile latency.

# Quality has several dimensions

Compression may affect:

- average benchmark accuracy;
- rare facts;
- multilingual performance;
- code correctness;
- long-context stability;
- calibration;
- safety behaviour;
- formatting;
- tool-call syntax;
- robustness to adversarial input.

A one-number quality report can hide important regressions.

# Choose the bottleneck first

| Bottleneck | Candidate techniques |
|---|---|
| Weights do not fit | Quantisation, sharding, smaller model, distillation |
| KV cache is too large | GQA or MQA, cache quantisation, shorter context, paging |
| First token is slow | Faster prefill kernels, prefix cache, shorter prompt, prompt compression |
| Decode is slow | Better batching, quantisation, speculative decoding, faster kernels |
| Too many concurrent users | Continuous batching, replicas, admission control, smaller models |
| Network is limiting | Better device placement, lower-communication parallelism |
| Quality loss is unacceptable | Higher precision, selective quantisation, retraining, larger student |

# Common efficiency mistakes

## Mistake 1: comparing model sizes without precision

Seven billion 16-bit weights and seven billion 4-bit weights require very different storage.

## Mistake 2: reporting total MoE parameters as active compute

Only routed experts are active for a token.

## Mistake 3: ignoring the KV cache

At long context and high concurrency, cache memory can dominate serving capacity.

## Mistake 4: assuming batching always lowers latency

Batching can increase waiting time.

## Mistake 5: assuming lower precision always runs faster

Unsupported kernels can make a smaller model slower.

## Mistake 6: evaluating compression only on perplexity

Task behaviour, safety, formatting, and long-context performance may regress differently.

## Mistake 7: optimising average latency only

Users experience tail latency and queueing.

## Mistake 8: calling sparsity efficient without hardware measurements

Zeros save compute only when the software and hardware exploit them.

# Checkpoint

<div class="exercise">

## 1. How much raw memory do 7 billion 16-bit weights require?

Approximately 14 GB in decimal units.

## 2. How much raw memory do the same weights require at 4 bits?

Approximately 3.5 GB.

## 3. Does 4-bit storage guarantee faster inference?

No.

## 4. What is distillation?

Training a smaller student to imitate a larger teacher or its outputs.

## 5. What is the difference between total and active MoE parameters?

Total parameters include all experts; active parameters include only those routed for a token.

## 6. Which inference phase processes the prompt?

Prefill.

## 7. Which memory grows with sequence length during decoding?

The KV cache.

## 8. What does continuous batching do?

Adds new requests as other sequences finish instead of waiting for a fixed batch to complete.

## 9. What does speculative decoding use?

A fast draft model that proposes tokens and a target model that verifies them.

## 10. Why measure tail latency?

Average latency can hide long waits experienced by a subset of requests.

</div>

# Chapter takeaway

Quantisation reduces numerical precision. Distillation transfers behaviour to a smaller student. Sparsity and MoE reduce which parameters are active. Caches reuse earlier computation. Batching and scheduling improve hardware utilisation.

None is a free lunch.

In our story:

> **The Deployment Workshop can shrink the machine, train an apprentice, reuse old notes, group customers, or send each token to a specialist. Every trick saves one resource by spending another, so the workshop measures before it celebrates.**

# Coming next: trust, but verify

The final chapter builds an evaluation and monitoring system for capability, groundedness, calibration, bias, privacy, safety, contamination, latency, regressions, and production drift.

# Further reading

- [GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers](https://arxiv.org/abs/2210.17323)
- [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961)
