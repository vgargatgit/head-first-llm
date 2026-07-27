---
title: "Chapter 16 — The Model Outgrows One Machine"
subtitle: "How data parallelism, sharding, tensor parallelism, and pipelines train models across accelerators"
lang: en
---

# The question this chapter answers

Chapter 15 built a complete training run from token batches, schedules, validation, and checkpoints.

That loop still appeared to run on one machine.

Large models create two separate pressures:

1. one accelerator may not process enough tokens quickly enough;
2. one accelerator may not have enough memory to hold the model, optimiser state, gradients, and activations.

How can many accelerators cooperate without accidentally training different models?

<div class="big-idea">

**Distributed training divides either the data, the model state, or the model computation. Every strategy trades local memory and arithmetic for communication and coordination.**

</div>

# Cold open: four workers receive one lesson plan

Suppose four workers each process a different microbatch.

```text
worker 1 -> data shard A -> local gradients
worker 2 -> data shard B -> local gradients
worker 3 -> data shard C -> local gradients
worker 4 -> data shard D -> local gradients
```

If each worker updates independently, their model copies immediately diverge.

Instead, they must combine the gradient evidence and apply a consistent update.

That is the central idea of **data parallelism**.

# Data parallelism replicates the model

In ordinary synchronous data parallelism:

- every worker stores a complete model replica;
- every worker receives different training data;
- every worker computes local gradients;
- gradients are aggregated across workers;
- every worker applies the same optimiser step.

For worker \(r\), let the local gradient be:

$$
g^{(r)}
$$

With \(D\) workers, the averaged gradient is:

$$
\bar{g}
=
\frac{1}{D}
\sum_{r=1}^{D}g^{(r)}
$$

Every replica then updates with the same \(\bar{g}\).

# A small gradient-reduction example

Suppose four workers produce gradients for two parameters:

$$
g^{(1)}=
\begin{bmatrix}
0.2 & -0.1
\end{bmatrix}
$$

$$
g^{(2)}=
\begin{bmatrix}
0.4 & 0.3
\end{bmatrix}
$$

$$
g^{(3)}=
\begin{bmatrix}
-0.2 & 0.1
\end{bmatrix}
$$

$$
g^{(4)}=
\begin{bmatrix}
0.0 & -0.3
\end{bmatrix}
$$

Their sum is:

$$
\sum_{r=1}^{4}g^{(r)}
=
\begin{bmatrix}
0.4 & 0.0
\end{bmatrix}
$$

The average is:

$$
\bar{g}
=
\begin{bmatrix}
0.1 & 0.0
\end{bmatrix}
$$

All four replicas use that same result.

The second parameter receives no update from this step because positive and negative evidence cancelled in the global batch.

# Sum or average?

Distributed systems may reduce gradients by summing or averaging.

Both can be correct when loss scaling and learning-rate conventions agree.

If every worker computes a mean over the same number of valid tokens, averaging worker gradients gives the global mean.

When workers contain unequal valid-token counts, the mathematically correct global mean should weight their gradient sums by valid-token count rather than treating every worker mean equally.

# All-reduce keeps replicas aligned

A common collective communication operation is **all-reduce**.

Conceptually, all-reduce:

1. combines a tensor from every worker;
2. applies an operation such as sum;
3. returns the result to every worker.

For gradient synchronisation:

```text
local gradients on every worker
        -> all-reduce sum
        -> optional divide by global count
        -> identical gradient result everywhere
```

The operation is collective: all participants must enter it in a compatible order and with compatible tensor shapes.

# Data parallelism solves throughput, not model replication memory

Adding data-parallel workers increases the global batch and potential throughput.

But every worker still stores a full copy of:

- model parameters;
- gradients;
- optimiser state;
- often some master-precision weights.

If the model state itself does not fit on one worker, pure data parallelism is insufficient.

# Where training memory goes

Peak training memory includes several categories.

## Parameters

The learned weights used in the forward and backward passes.

## Gradients

One derivative value for each trainable parameter.

## Optimiser state

AdamW commonly keeps first- and second-moment estimates. Some mixed-precision recipes also retain higher-precision master weights.

## Activations

Intermediate values needed by backward propagation.

## Temporary buffers

Communication workspaces, attention intermediates, allocator fragmentation, and framework-specific state.

<div class="warning">

## Parameter count is not memory usage

A one-billion-parameter model does not consume only one billion bytes. The bytes per parameter depend on precision, gradients, optimiser state, sharding, and implementation.

</div>

# An illustrative bytes-per-parameter estimate

Consider one mixed-precision Adam-style training arrangement with approximately:

| State | Illustrative bytes per parameter |
|---|---:|
| Reduced-precision parameter | 2 |
| Gradient | 2 |
| Higher-precision master parameter | 4 |
| First moment | 4 |
| Second moment | 4 |
| **Total before activations** | **16** |

For:

$$
P=10^9
$$

parameters, this illustrative model-state requirement is:

$$
16P
=
16\cdot10^9
$$

bytes, or roughly 16 GB in decimal units, before activations and temporary buffers.

Actual systems can use different precisions and state layouts, so this is a planning model rather than a universal constant.

# Sharded data parallelism divides model state

A sharded data-parallel strategy keeps data-parallel semantics while distributing selected state across workers.

Depending on the sharding stage, workers can partition:

- optimiser state;
- gradients;
- parameters.

With full sharding across \(D\) workers, the idealised persistent share of a state tensor is approximately:

$$
\frac{1}{D}
$$

of its unsharded size per worker.

For the illustrative 16 GB state across eight workers:

$$
\frac{16\ \mathrm{GB}}{8}
=
2\ \mathrm{GB}
$$

per worker before replicated pieces, activations, buffers, and communication overhead.

# Sharding creates communication

A worker cannot compute with a parameter shard it does not currently possess.

Fully sharded execution therefore performs operations such as:

- gather parameter pieces before a layer computes;
- discard or reshard parameters after use;
- reduce-scatter gradients so each worker retains its shard;
- update local optimiser-state shards.

The memory saving comes from not keeping every full tensor resident everywhere. The cost is additional communication and orchestration.

# Gather and reduce-scatter

Two useful collective patterns are:

## All-gather

Each worker contributes one shard and receives the full assembled tensor.

```text
worker shards -> all-gather -> full tensor on each participant
```

## Reduce-scatter

Workers first reduce corresponding tensor contributions, then each worker receives only one shard of the result.

```text
full gradient contributions
        -> reduce and partition
        -> one reduced shard per worker
```

Sharded training uses these primitives to make full layers temporarily available while keeping persistent state partitioned.

# Tensor parallelism splits a layer's arithmetic

Sharding model state still allows one worker to execute a layer after gathering its parameters.

For even larger layers, **tensor parallelism** divides one matrix operation across workers.

Suppose:

$$
Y=XW
$$

and the output dimension of \(W\) is divided into two column blocks:

$$
W=
\begin{bmatrix}
W_1 & W_2
\end{bmatrix}
$$

Then:

$$
Y
=
\begin{bmatrix}
XW_1 & XW_2
\end{bmatrix}
$$

Worker 1 can compute \(XW_1\), worker 2 can compute \(XW_2\), and the partial output features can be concatenated.

Other matrix splits require sums or reductions rather than concatenation.

# Tensor-parallel communication depends on the split

A column-parallel projection may create separate output-feature shards.

A row-parallel projection may produce partial sums that must be reduced:

$$
Y
=
X_1W_1+X_2W_2
$$

The layout must match neighbouring operations so that communication is not introduced unnecessarily after every small step.

Transformer implementations often choose compatible splits for Query, Key, Value, output, and MLP projections.

# Attention heads are natural—but not free—split candidates

Multiple attention heads provide a convenient conceptual partition.

Different workers can own subsets of heads, compute their local head outputs, and cooperate around the output projection.

However:

- some tensors still need to be shared or reduced;
- grouped-query attention can make head counts asymmetric;
- sequence and batch dimensions affect communication volume;
- output mixing reconnects head features.

“Put one head on each device” is an intuition, not a complete implementation plan.

# Pipeline parallelism splits layers by depth

Instead of splitting each matrix, **pipeline parallelism** assigns different layer ranges to different stages.

For a twelve-layer model:

```text
stage 1: layers 1-3
stage 2: layers 4-6
stage 3: layers 7-9
stage 4: layers 10-12
```

Activations move forward from stage to stage. During backpropagation, activation gradients move backward.

# Why use microbatches in a pipeline?

If the pipeline processes one full batch at a time, later stages wait while stage 1 starts, and early stages wait while the final stage finishes.

Splitting the batch into microbatches allows stages to overlap:

```text
time ->

stage 1: M1  M2  M3  M4
stage 2:     M1  M2  M3  M4
stage 3:         M1  M2  M3  M4
stage 4:             M1  M2  M3  M4
```

The empty slots at the beginning and end are called the **pipeline bubble**.

More microbatches can improve utilisation, though scheduling, memory, and communication become more complex.

# Pipeline balance matters

If stage 2 takes twice as long as every other stage, the whole pipeline waits for stage 2.

Good partitioning tries to balance:

- parameter memory;
- forward compute;
- backward compute;
- activation sizes;
- communication links.

Equal layer counts do not guarantee equal stage times.

# Sequence or context parallelism

Long sequences create large activation and attention workloads.

Some systems partition work along the sequence dimension so different workers own different token ranges or activation slices.

This can reduce per-worker activation memory, but attention creates dependencies between token positions. The implementation must communicate the information needed for Queries to interact with Keys and Values across partitions.

The exact algorithm depends on the attention method and hardware topology.

# Activation checkpointing trades compute for memory

Backward propagation normally needs intermediate activations from the forward pass.

Activation checkpointing stores only selected boundaries and recomputes missing intermediates during backward.

```text
ordinary training:
    store many activations -> less recomputation, more memory

activation checkpointing:
    store selected checkpoints -> recompute sections, less memory
```

This is also called rematerialisation.

It reduces activation memory but increases arithmetic and can lengthen each step.

# Parallel strategies can be combined

A large run can use several dimensions of parallelism simultaneously.

For example:

- data parallel groups process different examples;
- tensor-parallel workers split each large layer;
- pipeline stages split layer depth;
- sharding partitions optimiser state inside data-parallel groups;
- sequence parallelism partitions selected activations.

The total worker count may be expressed conceptually as:

$$
D_{\mathrm{total}}
=
D_{\mathrm{data}}
D_{\mathrm{tensor}}
D_{\mathrm{pipeline}}
$$

with additional groupings depending on the implementation.

# Communication can dominate

Adding workers does not guarantee proportional speedup.

One useful efficiency measure is:

$$
E_N
=
\frac{T_1}{NT_N}
$$

where:

- \(T_1\) is the time on one worker;
- \(T_N\) is the time on \(N\) workers.

If eight workers finish only four times faster, efficiency is:

$$
E_8
=
\frac{4}{8}
=0.5
$$

or 50% relative scaling efficiency.

Causes of lost efficiency include:

- communication latency;
- limited network bandwidth;
- pipeline bubbles;
- workload imbalance;
- small matrix operations;
- input stalls;
- synchronisation barriers.

# Overlap communication with computation

Distributed systems try to hide communication behind useful work.

Examples include:

- reducing one gradient bucket while backward computes earlier layers;
- gathering the next layer's parameters while the current layer computes;
- prefetching future data batches;
- sending pipeline activations asynchronously.

Overlap does not remove communication volume. It reduces how much of that communication appears on the critical path.

# Hardware topology matters

Communication between accelerators in one server can be much faster than communication across servers.

A topology-aware layout may keep high-frequency tensor-parallel collectives within fast local links while using data parallelism across slower network boundaries.

The same mathematical parallel plan can perform very differently on a different interconnect.

# Synchronous workers move at the speed of the slowest

In synchronous training, all workers must contribute before a collective step completes.

A slow worker—sometimes called a straggler—can delay everyone.

Stragglers may result from:

- hardware variation;
- network congestion;
- data-loading imbalance;
- thermal throttling;
- retries or transient errors.

Monitoring per-worker step time is therefore essential.

# Faults and resumable distributed state

A failure can interrupt hundreds or thousands of workers.

Distributed checkpoints must produce a consistent model state even when tensors are sharded.

A restart may need to restore:

- each parameter shard;
- each optimiser shard;
- scheduler and scaler state;
- random states;
- data progress;
- the mapping from shards to the new worker topology.

Some systems can reshard a checkpoint when the resumed worker count changes; others require an identical layout.

# Training parallelism is not the KV cache

The KV cache stores past attention Keys and Values during autoregressive inference.

Distributed training state contains parameters, gradients, optimiser values, and activations.

These solve different problems.

During ordinary full-sequence teacher-forced training, a generation-style KV cache is generally not the mechanism used to avoid recomputing the sequence.

# Common distributed-training mistakes

## Mistake 1: assuming data parallelism reduces model memory

An unsharded data-parallel worker stores a complete model replica.

## Mistake 2: averaging unequal worker means equally

Weight reductions by valid-token counts when local workloads differ.

## Mistake 3: treating sharding as free memory

Parameter gathers and gradient reductions create communication.

## Mistake 4: confusing tensor parallelism with pipeline parallelism

Tensor parallelism splits operations inside layers. Pipeline parallelism splits layers by depth.

## Mistake 5: ignoring the pipeline bubble

Stages are not fully occupied during pipeline fill and drain.

## Mistake 6: assuming equal layers mean balanced pipeline stages

Layer compute and activation sizes can differ.

## Mistake 7: forgetting activations

Even fully sharded model state can leave activation memory as the limiting factor.

## Mistake 8: expecting linear speedup

Communication, synchronisation, and imbalance reduce scaling efficiency.

## Mistake 9: placing communication-heavy groups across slow links

Parallel topology should reflect hardware topology.

## Mistake 10: calling every distributed tensor a model shard

Data, parameters, gradients, optimiser state, activations, and sequence positions can be partitioned independently.

# Checkpoint

<div class="exercise">

## 1. What does ordinary data parallelism replicate?

The full model and usually its unsharded training state on every worker.

## 2. What operation keeps data-parallel gradients consistent?

A collective reduction such as all-reduce.

## 3. What is the average of the four example gradients?

$$
\begin{bmatrix}
0.1 & 0.0
\end{bmatrix}
$$

## 4. What does fully sharded training try to partition?

Parameters, gradients, and optimiser state, depending on the strategy.

## 5. What does tensor parallelism split?

The arithmetic and tensors within a layer or matrix operation.

## 6. What does pipeline parallelism split?

The model's layer depth into sequential stages.

## 7. Why use pipeline microbatches?

To overlap different stages and reduce idle time.

## 8. What does activation checkpointing trade?

Additional recomputation for lower activation memory.

## 9. Why can eight workers achieve less than eightfold speedup?

Communication, imbalance, bubbles, and synchronisation add overhead.

## 10. Is distributed training state the same as an inference KV cache?

No. They serve different phases and contain different tensors.

</div>

# Chapter takeaway

Data parallelism combines gradient evidence from different examples:

$$
\bar{g}
=
\frac{1}{D}\sum_{r=1}^{D}g^{(r)}
$$

Sharding reduces persistent model-state memory. Tensor parallelism divides layer arithmetic. Pipeline parallelism divides depth. Activation checkpointing reduces stored intermediates.

Every saving introduces a cost in communication, recomputation, scheduling, or complexity.

In our story:

> **When the model outgrows one desk, the training organisation does not merely hire more employees. It decides who holds which pages, who performs which calculation, when reports must be exchanged, and how everyone signs the same final update.**

# Coming next: pretraining is not yet assistant behaviour

A pretrained model becomes good at continuing token patterns.

Chapter 17 explains how supervised demonstrations, preference data, and parameter-efficient adaptation shape that completion model into a more useful assistant.