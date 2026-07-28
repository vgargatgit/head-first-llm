---
title: "Chapter 14 — The Blame Travels Backward"
subtitle: "How gradients connect the loss to every learned parameter"
lang: en
---

# The question this chapter answers

Chapter 13 produced a loss for the prediction after:

> The cat sat

The correct next token was `on`.

At the vocabulary logits, the loss gradient was:

$$
\frac{\partial\mathcal{L}}{\partial z}
\approx
\begin{bmatrix}
-0.761069 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

That vector says which output scores need upward or downward pressure.

But logits were produced by learned parameters throughout the network.

How does the model discover which parameters contributed to the error?

<div class="big-idea">

**Backpropagation applies the chain rule from the loss toward the inputs. Every operation converts an incoming output gradient into gradients for its inputs and parameters.**

</div>

# Cold open: the correction request reaches the organisation

The Scorekeeper sends one message:

```text
The answer `on` was under-supported.
The period and `mat` were over-supported.
```

That correction first reaches the vocabulary projection and then travels through:

- the final hidden state;
- final normalisation;
- Transformer blocks in reverse order;
- MLPs and attention heads;
- token and position parameters.

Each component asks:

> How would a small change in my input or weight change the final loss?

The answers are gradients.

# A computational graph

The forward path is a graph of dependencies:

```text
parameters and token IDs
        -> embeddings
        -> Transformer blocks
        -> final hidden state h
        -> vocabulary logits z
        -> probabilities p
        -> loss L
```

The backward path visits those dependencies in reverse:

```text
loss gradient
        -> logits
        -> vocabulary weights and hidden state
        -> final normalisation
        -> Transformer blocks in reverse order
        -> embeddings and earlier parameters
```

Backpropagation does not run generated text backward. It traverses the mathematical computation graph backward.

# What a gradient means

For scalar loss \(\mathcal{L}\) and parameter \(w\):

$$
\frac{\partial\mathcal{L}}{\partial w}
$$

is the local rate at which loss changes as \(w\) changes.

- positive gradient: a small increase in \(w\) tends to raise loss;
- negative gradient: a small increase tends to lower loss;
- near-zero gradient: a small local change has little first-order effect.

A gradient is a local slope, not a guarantee about a large movement.

# Begin at softmax cross-entropy

For logits \(z\), probabilities \(p\), and one-hot target \(y\):

$$
\frac{\partial\mathcal{L}}{\partial z}=p-y
$$

Chapter 11 produced:

$$
p
\approx
\begin{bmatrix}
0.238931 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

The target `on` is the first vocabulary entry:

$$
y=
\begin{bmatrix}
1 & 0 & 0 & 0 & 0
\end{bmatrix}
$$

Therefore:

$$
g_z
=
\frac{\partial\mathcal{L}}{\partial z}
\approx
\begin{bmatrix}
-0.761069 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

# Back through the vocabulary projection

Chapter 11 calculated:

$$
z=hW_{\mathrm{vocab}}+b
$$

The shapes are:

$$
h\in\mathbb{R}^{1\mathbin{×}4}
$$

$$
W_{\mathrm{vocab}}\in\mathbb{R}^{4\mathbin{×}5}
$$

$$
b,z,g_z\in\mathbb{R}^{1\mathbin{×}5}
$$

For a linear operation:

$$
y=xW+b
$$

the backward rules are:

$$
g_W=x^Tg_y
$$

$$
g_x=g_yW^T
$$

$$
g_b=g_y
$$

# The vocabulary-weight gradient

The final hidden state was:

$$
h
\approx
\begin{bmatrix}
-0.008859 & -0.111600 & 1.470933 & -1.350474
\end{bmatrix}
$$

Therefore:

$$
\frac{\partial\mathcal{L}}{\partial W_{\mathrm{vocab}}}
=h^Tg_z
$$

The outer product gives:

$$
\boxed{
\frac{\partial\mathcal{L}}{\partial W_{\mathrm{vocab}}}
\approx
\begin{bmatrix}
0.006742 & -0.000464 & -0.003102 & -0.000470 & -0.002707\\
0.084935 & -0.005842 & -0.039073 & -0.005918 & -0.034102\\
-1.119482 & 0.077000 & 0.515000 & 0.078002 & 0.449480\\
1.027804 & -0.070695 & -0.472825 & -0.071614 & -0.412671
\end{bmatrix}
}
$$

Every column belongs to one vocabulary candidate. Every row belongs to one hidden coordinate.

The gradient has the same shape as the weight matrix it updates.

# Read one vocabulary-weight gradient

Consider the weight connecting hidden coordinate 3 to the `on` logit.

Its current value is:

$$
w=0.2
$$

Its gradient is:

$$
g_w\approx-1.119482
$$

The value is negative because hidden coordinate 3 is positive and the `on` logit needs to rise. Increasing this weight would locally increase that logit for this example.

This does not mean hidden coordinate 3 literally represents `on`. It is one local dependency in one context.

# The bias gradient

Because vocabulary bias is added directly:

$$
\boxed{
g_b=g_z
}
$$

Thus:

$$
g_b
\approx
\begin{bmatrix}
-0.761069 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

# The hidden-state gradient

The output head must also report how loss depends on its input:

$$
g_h
=
g_zW_{\mathrm{vocab}}^T
$$

Using Chapter 11's matrix:

$$
\boxed{
g_h
\approx
\begin{bmatrix}
-0.294534 & 0.134536 & 0.184198 & 0.158436
\end{bmatrix}
}
$$

This becomes the incoming correction signal for final normalisation and the final Transformer block.

<div class="translation">

## The output head sends two reports

1. A parameter report for \(W_{\mathrm{vocab}}\) and \(b\).
2. An upstream report for the final hidden state \(h\).

The first is stored for the optimiser. The second continues backward.

</div>

# The chain rule connects operations

Suppose:

$$
a=f(x)
$$

and:

$$
\mathcal{L}=g(a)
$$

Then:

$$
\frac{\partial\mathcal{L}}{\partial x}
=
\frac{\partial\mathcal{L}}{\partial a}
\frac{\partial a}{\partial x}
$$

A deep network applies this principle repeatedly.

Automatic differentiation records the forward graph and runs each local backward rule in reverse dependency order.

# Back through a residual connection

A residual sublayer has the form:

$$
y=x+f(x)
$$

Incoming gradient \(g_y\) follows two paths.

The direct path contributes:

$$
g_x^{\mathrm{direct}}=g_y
$$

The sublayer path contributes:

$$
g_x^{\mathrm{sublayer}}
=
g_y\frac{\partial f}{\partial x}
$$

The shared input receives their sum:

$$
g_x
=
g_x^{\mathrm{direct}}+g_x^{\mathrm{sublayer}}
$$

Residual connections therefore provide a direct gradient route around each sublayer.

<!-- design-pattern-01:chapter-14:start -->
<div class="translation">

## Design Pattern Revisited — The Direct Route Also Exists Backward

Chapter 7 introduced the residual connection as:

$$
y=x+F(x)
$$

The forward value follows both the identity path and the learned branch. During backpropagation, the shared input likewise receives two contributions:

$$
\frac{\partial\mathcal L}{\partial x}
=
\frac{\partial\mathcal L}{\partial y}
+
\frac{\partial\mathcal L}{\partial y}
\frac{\partial F}{\partial x}
$$

The first term is the direct identity-path contribution. The second term travels through the learned branch.

This direct term is one reason residual architectures are easier to optimise at depth. It is not a guarantee that the total gradient will have a particular magnitude: the branch contribution may reinforce or oppose the direct contribution.

</div>
<!-- design-pattern-01:chapter-14:end -->

<div class="warning">

## Forward branches copy values; backward branches add gradients

When one activation feeds several operations, every branch can send a gradient contribution back. Contributions are summed at the shared source.

</div>

# Back through the MLP

A simple MLP computes:

$$
p=xW_1+b_1
$$

$$
u=\phi(p)
$$

$$
f=uW_2+b_2
$$

Backward propagation proceeds in reverse.

For the second linear layer:

$$
g_{W_2}=u^Tg_f
$$

$$
g_u=g_fW_2^T
$$

$$
g_{b_2}=g_f
$$

For the activation:

$$
g_p=g_u\odot\phi'(p)
$$

For the first linear layer:

$$
g_{W_1}=x^Tg_p
$$

$$
g_x=g_pW_1^T
$$

$$
g_{b_1}=g_p
$$

The symbol \(\odot\) denotes element-wise multiplication.

# Activation derivatives gate gradients

For ReLU:

$$
\operatorname{ReLU}(p)=\max(0,p)
$$

A common derivative convention is:

$$
\operatorname{ReLU}'(p)=
\begin{cases}
1, & p>0\\
0, & p<0
\end{cases}
$$

A coordinate that was negative in the forward pass sends zero gradient through that ReLU on that example.

GELU, SiLU, and gated MLPs use different derivatives, but the chain-rule structure is unchanged.

# Back through normalisation

LayerNorm and RMSNorm depend on statistics from the current token row.

Their backward rules:

- distribute gradient across the row's feature coordinates;
- produce gradients for learned scale parameters;
- produce shift gradients when a shift parameter exists.

Changing one coordinate can affect the normalisation applied to the others, so the derivative contains coupled terms. Automatic differentiation handles the exact formula.

Normalisation gradients remain within each token row, while shared normalisation parameters accumulate contributions across positions.

# Back through attention retrieval

For one head:

$$
Z=AV
$$

Given incoming gradient \(g_Z\):

$$
g_A=g_ZV^T
$$

$$
g_V=A^Tg_Z
$$

The backward pass therefore asks both:

- how should retrieval weights have changed?
- how should Value payloads have changed?

# Back through attention softmax

Attention weights are:

$$
A=\operatorname{softmax}(S)
$$

For one row, a compact derivative is:

$$
g_S
=
A\odot
\left[
 g_A-
 \left(\sum_jg_{A,j}A_j\right)\mathbf{1}
\right]
$$

Softmax entries are coupled through the shared denominator. Masked future entries remain excluded from ordinary attention probability and gradient flow.

# Back through Query–Key scores

Before softmax:

$$
S=\frac{QK^T}{\sqrt{d_k}}
$$

Given \(g_S\):

$$
g_Q=\frac{g_SK}{\sqrt{d_k}}
$$

$$
g_K=\frac{g_S^TQ}{\sqrt{d_k}}
$$

The score gradient affects both sides of every allowed Query–Key comparison.

# Back through Q, K, and V projections

For one head:

$$
Q=XW^Q,
\qquad
K=XW^K,
\qquad
V=XW^V
$$

The parameter gradients are:

$$
g_{W^Q}=X^Tg_Q
$$

$$
g_{W^K}=X^Tg_K
$$

$$
g_{W^V}=X^Tg_V
$$

The input contributions are:

$$
g_X^{(Q)}=g_Q(W^Q)^T
$$

$$
g_X^{(K)}=g_K(W^K)^T
$$

$$
g_X^{(V)}=g_V(W^V)^T
$$

Because the same \(X\) fed all three projections:

$$
g_X
=
g_X^{(Q)}+g_X^{(K)}+g_X^{(V)}
$$

Residual branches and other heads can add further contributions.

# Multiple heads return to one residual stream

Concatenation splits the incoming feature gradient back into one slice per head.

Each head calculates gradients for its own:

$$
W_r^Q,
\quad
W_r^K,
\quad
W_r^V
$$

All heads began from the same layer input, so their input-gradient contributions are added there.

The output projection \(W^O\) receives its own gradient from the concatenated result.

# Back through the block stack

The forward pass used:

$$
X^{(0)}
\rightarrow
X^{(1)}
\rightarrow
\cdots
\rightarrow
X^{(L)}
$$

The backward pass visits layers in reverse:

$$
g_{X^{(L)}}
\rightarrow
g_{X^{(L-1)}}
\rightarrow
\cdots
\rightarrow
g_{X^{(0)}}
$$

Each block calculates gradients for its own parameters. Ordinary Transformer blocks do not share their attention and MLP matrices across depth.

# Embedding gradients accumulate by token ID

An embedding lookup selects rows from an embedding table.

If token ID 3 appears in a batch, its selected embedding gradient is added to row 3 of the table's gradient buffer.

If the same token occurs several times, all contributions add.

Rows for absent token IDs receive no direct lookup gradient from that batch.

Learned absolute position tables behave similarly for position IDs.

# Weight tying combines gradient sources

When:

$$
W_{\mathrm{vocab}}=E_{\mathrm{token}}^T
$$

the input embedding table and output head share parameters.

The shared object receives gradients from:

1. embedding lookup use;
2. vocabulary projection use.

Those contributions add before the optimiser step.

# Many token losses contribute to one matrix

For mean loss over \(N\) valid targets:

$$
\mathcal{L}
=
\frac{1}{N}\sum_{i=1}^{N}\mathcal{L}_i
$$

parameter gradient is:

$$
\frac{\partial\mathcal{L}}{\partial w}
=
\frac{1}{N}
\sum_{i=1}^{N}
\frac{\partial\mathcal{L}_i}{\partial w}
$$

Every valid token target can contribute to the same shared matrices. Over training, updates aggregate evidence from enormous numbers of contexts.

# A simple gradient-descent update

Basic stochastic gradient descent uses:

$$
w_{\mathrm{new}}
=
w_{\mathrm{old}}-\eta g_w
$$

Return to the vocabulary weight:

$$
w_{\mathrm{old}}=0.2
$$

with:

$$
g_w=-1.119482
$$

and learning rate:

$$
\eta=0.05
$$

Then:

$$
\begin{aligned}
w_{\mathrm{new}}
&=0.2-0.05(-1.119482)\\
&=0.2+0.055974\\
&\approx0.255974
\end{aligned}
$$

The weight increased because increasing it locally helps raise the under-supported `on` logit for this hidden state.

<div class="warning">

## One worked update is not a complete training recipe

Real training uses batches, adaptive optimisers, schedules, regularisation, clipping, reduced precision, and many repeated steps. This calculation isolates one parameter so the sign remains visible.

</div>

# Why the learning rate matters

The gradient supplies a local direction and magnitude. The learning rate controls step size.

- too small: learning can be slow;
- too large: updates can overshoot or destabilise training;
- scheduled appropriately: larger early updates can transition to smaller refinements.

The useful learning rate depends on optimiser, model size, batch size, precision, and parameterisation.

# Beyond SGD: AdamW

Large language models commonly use adaptive optimisers such as AdamW.

AdamW maintains moving estimates related to:

- the running gradient mean;
- the running squared-gradient magnitude.

Those estimates scale updates coordinate by coordinate. AdamW also applies decoupled weight decay to selected parameter groups.

The optimiser changes how gradients become updates. It does not change backpropagation's derivatives.

# Weight decay is not applied blindly

Training recipes often exclude selected parameters from weight decay, such as:

- biases;
- normalisation scales;
- architecture-specific embeddings or parameter groups.

The exact grouping is part of the training recipe.

# Gradient clipping

A global norm can be written:

$$
\lVert g\rVert_2
$$

With clipping threshold \(c\):

$$
g_{\mathrm{clipped}}
=
g\cdot
\min\left(1,\frac{c}{\lVert g\rVert_2}\right)
$$

If the norm is already below \(c\), nothing changes. Otherwise, one shared scale limits the update magnitude while preserving direction.

# Gradient accumulation

When a full batch does not fit in memory:

```text
clear gradients
forward microbatch 1 -> backward -> accumulate
forward microbatch 2 -> backward -> accumulate
forward microbatch 3 -> backward -> accumulate
optimizer step
clear gradients
```

Loss or gradient scaling must match the intended effective-batch mean or sum.

# Mixed precision and loss scaling

Reduced-precision training improves speed and memory use, but very small gradients can underflow.

Loss scaling uses:

$$
\mathcal{L}_{\mathrm{scaled}}=s\mathcal{L}
$$

This scales gradients by \(s\). Before updating parameters, gradients are unscaled and checked for invalid values.

The technique changes numerical representation, not the mathematical objective.

# Gradients must be cleared deliberately

Most automatic-differentiation frameworks accumulate into gradient buffers.

If old gradients are not cleared at the intended boundary, a new batch can be added to stale values accidentally.

Clearing is skipped only when intentional gradient accumulation is in progress.

# One complete training step

A simplified step is:

```text
1. Load token sequences.
2. Create shifted inputs and targets.
3. Build attention and loss masks.
4. Run the forward pass.
5. Calculate masked cross-entropy.
6. Backpropagate gradients.
7. Optionally unscale and clip.
8. Apply the optimiser update.
9. Clear gradients.
```

Repeated steps shape:

- token embeddings;
- trainable positional parameters;
- Query, Key, Value, and output projections;
- MLP weights;
- normalisation parameters;
- vocabulary-head parameters.

# Backpropagation does not assign human concepts

A gradient does not say:

> This neuron should learn grammar.

It says:

> A small change in this quantity would change the current loss by this local amount.

Capabilities emerge from distributed updates across many parameters and examples.

# Common backpropagation mistakes

## Mistake 1: saying the scalar loss itself flows backward

What flows backward are derivatives of loss with respect to intermediate quantities.

## Mistake 2: updating activations instead of parameters

Activations are recomputed. The optimiser persistently changes learned parameters.

## Mistake 3: forgetting branch contributions

All gradient paths into a shared source must be added.

## Mistake 4: reversing matrix multiplication without transposes

For \(y=xW\), use \(g_W=x^Tg_y\) and \(g_x=g_yW^T\).

## Mistake 5: assuming one target updates only one layer

One token loss can produce gradients through the complete stack.

## Mistake 6: treating gradient as the final update

The optimiser transforms gradients using learning rates, moments, decay, clipping, and schedules.

## Mistake 7: forgetting shared-parameter accumulation

Repeated tokens, tied weights, positions, and batch items can all contribute to one parameter.

## Mistake 8: stepping before accumulation is complete

That changes effective-batch behaviour.

## Mistake 9: forgetting to clear gradients

Unintended accumulation mixes separate training steps.

## Mistake 10: assuming a negative gradient makes a parameter negative

Gradient sign describes local slope. The new value also depends on the old value and optimiser step.

# Checkpoint

<div class="exercise">

## 1. What starts backpropagation for softmax cross-entropy?

$$
p-y
$$

## 2. What is the vocabulary-weight gradient for \(z=hW+b\)?

$$
h^Tg_z
$$

## 3. What continues into the hidden state?

$$
g_h=g_zW^T
$$

## 4. What happens at a residual addition?

The incoming gradient follows both branches, and contributions add at the shared input.

## 5. Why are MLP gradients computed in reverse operation order?

The chain rule needs the later operation's gradient before earlier inputs can be differentiated.

## 6. Which quantities receive gradients from \(Z=AV\)?

Both \(A\) and \(V\).

## 7. Why can one embedding row receive several contributions?

The token can occur several times, and tied output weights can add another source.

## 8. What does learning rate control?

The scale of the optimiser update.

## 9. Why use gradient accumulation?

To obtain a larger effective batch than memory can hold in one microbatch.

## 10. Does backpropagation update parameters?

No. It calculates gradients. The optimiser updates parameters.

</div>

# Chapter takeaway

The loss first differentiates with respect to logits:

$$
g_z=p-y
$$

For the vocabulary projection:

$$
g_W=h^Tg_z
$$

$$
g_h=g_zW^T
$$

The hidden-state gradient then moves through every dependent operation using the chain rule.

An optimiser converts accumulated gradients into updates such as:

$$
w_{\mathrm{new}}=w_{\mathrm{old}}-\eta g_w
$$

In our story:

> **The Scorekeeper does not know which employee made the mistake. Backpropagation follows every dependency, measures each local contribution, and delivers a correction request to every parameter involved.**

# Coming next: training at scale and changing behaviour

We have followed one model from token input through inference, loss, and one parameter update.

The next part of the book can explore:

- minibatches, epochs, data mixtures, and learning-rate schedules;
- validation and checkpoints;
- distributed training and memory costs;
- supervised fine-tuning;
- preference optimisation;
- parameter-efficient adaptation such as LoRA.