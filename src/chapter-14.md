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

But the logits are not stored knowledge by themselves. They were produced by millions or billions of learned parameters.

How does the model discover which parameters contributed to the error?

<div class="big-idea">

**Backpropagation applies the chain rule from the loss toward the inputs. At every operation, it converts an incoming gradient into gradients for that operation's inputs and parameters.**

</div>

# Cold open: the correction request reaches the organisation

The Scorekeeper sends one message:

```text
The answer `on` was under-supported.
The period and `mat` were over-supported.
```

That message first reaches the vocabulary projection.

Then it travels through:

- the final hidden state;
- the final normalisation;
- every Transformer block;
- MLPs and attention heads;
- token and position parameters.

Each component asks:

> How much did my output affect the final loss, and how would a small change in my inputs or weights change that loss?

The answers are gradients.

# A computational graph

The forward path can be viewed as a graph of operations:

```text
parameters and token IDs
        -> embeddings
        -> Transformer blocks
        -> final hidden state h
        -> vocabulary logits z
        -> softmax probabilities p
        -> cross-entropy loss L
```

The backward path follows the graph in reverse:

```text
loss gradient
        -> logits
        -> vocabulary weights and hidden state
        -> final normalisation
        -> Transformer blocks in reverse order
        -> embeddings and all earlier parameters
```

Backpropagation does not run the language model backward in time as text.

It traverses mathematical dependencies backward through the computation graph.

# What a gradient means

For scalar loss \(\mathcal{L}\) and parameter \(w\):

$$
\frac{\partial\mathcal{L}}{\partial w}
$$

measures the local rate at which the loss changes as \(w\) changes.

- positive gradient: a small increase in \(w\) tends to increase the loss;
- negative gradient: a small increase in \(w\) tends to decrease the loss;
- near-zero gradient: a small local change in \(w\) has little first-order effect on this loss.

A gradient is a local slope, not a guarantee about a large parameter movement.

# Begin at softmax cross-entropy

For logits \(z\), softmax probabilities \(p\), and one-hot target \(y\):

$$
\frac{\partial\mathcal{L}}{\partial z}
=p-y
$$

Chapter 11's probability vector was:

$$
p
\approx
\begin{bmatrix}
0.238931 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

The target vector for `on` was:

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

We will call this incoming logit gradient \(g_z\).

# Back through the vocabulary projection

Chapter 11 calculated logits using:

$$
z=hW_{	ext{vocab}}+b
$$

The shapes are:

$$
h\in\mathbb{R}^{1\times4}
$$

$$
W_{	ext{vocab}}\in\mathbb{R}^{4\times5}
$$

$$
b,z,g_z\in\mathbb{R}^{1\times5}
$$

For a linear transformation:

$$
y=xW+b
$$

the backward rules are:

$$
\frac{\partial\mathcal{L}}{\partial W}
=x^T
\frac{\partial\mathcal{L}}{\partial y}
$$

$$
\frac{\partial\mathcal{L}}{\partial x}
=
\frac{\partial\mathcal{L}}{\partial y}W^T
$$

$$
\frac{\partial\mathcal{L}}{\partial b}
=
\frac{\partial\mathcal{L}}{\partial y}
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
\frac{\partial\mathcal{L}}{\partial W_{	ext{vocab}}}
=h^Tg_z
$$

The outer product gives:

$$
\boxed{
\frac{\partial\mathcal{L}}{\partial W_{	ext{vocab}}}
\approx
\begin{bmatrix}
0.006742 & -0.000464 & -0.003102 & -0.000470 & -0.002707\\
0.084935 & -0.005842 & -0.039073 & -0.005918 & -0.034102\\
-1.119482 & 0.077000 & 0.515000 & 0.078002 & 0.449480\\
1.027804 & -0.070695 & -0.472825 & -0.071614 & -0.412671
\end{bmatrix}
}
$$

Every column belongs to one vocabulary candidate.

Every row belongs to one hidden-state coordinate.

The gradient has the same shape as the weight matrix it will update.

# Read one vocabulary-weight gradient

Consider the weight connecting hidden coordinate 3 to the `on` logit.

Its current value is:

$$
w=0.2
$$

Its gradient is:

$$
\frac{\partial\mathcal{L}}{\partial w}
\approx-1.119482
$$

The gradient is negative because:

- hidden coordinate 3 is positive;
- the `on` logit needs to increase;
- increasing this weight would increase the `on` logit for this hidden state.

The gradient does not mean that coordinate 3 literally represents the word `on`.

It describes one local dependency for this example and current parameter state.

# The bias gradient

Because each vocabulary bias is added directly to its logit:

$$
\boxed{
\frac{\partial\mathcal{L}}{\partial b}
=g_z
}
$$

So:

$$
\frac{\partial\mathcal{L}}{\partial b}
\approx
\begin{bmatrix}
-0.761069 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

The `on` bias receives upward pressure under gradient descent, while incorrectly supported candidates receive downward pressure.

# The hidden-state gradient

The output head must also report how the loss depends on its input hidden state:

$$
g_h
=
\frac{\partial\mathcal{L}}{\partial h}
=
g_zW_{	ext{vocab}}^T
$$

Using Chapter 11's vocabulary matrix:

$$
\boxed{
g_h
\approx
\begin{bmatrix}
-0.294534 & 0.134536 & 0.184198 & 0.158436
\end{bmatrix}
}
$$

This four-coordinate gradient becomes the incoming correction signal for the final normalisation and the final Transformer block.

<div class="translation">

## The output head sends two reports

1. **Parameter report:** how \(W_{	ext{vocab}}\) and \(b\) affected the loss.
2. **Upstream report:** how the final hidden state \(h\) affected the loss.

The first report is saved for the optimiser. The second continues backward through the model.

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

Deep networks apply this principle repeatedly.

An operation receives a gradient with respect to its output and uses local derivatives to produce gradients with respect to its inputs and parameters.

Automatic differentiation systems record enough of the forward computation to perform these local backward operations in reverse order.

# Back through a residual connection

A residual sublayer has the form:

$$
y=x+f(x)
$$

An incoming gradient \(g_y\) follows two paths.

The direct path contributes:

$$
g_x^{\text{direct}}=g_y
$$

The sublayer path contributes:

$$
g_x^{\text{sublayer}}
=
g_y
\frac{\partial f}{\partial x}
$$

The total is the sum:

$$
g_x
=
g_x^{\text{direct}}
+
g_x^{\text{sublayer}}
$$

This is an important reason residual connections help optimisation: part of the gradient has a direct route around the sublayer.

<div class="warning">

## A branch copies activations but adds gradients

In the forward pass, one value can feed multiple branches.

In the backward pass, gradient contributions from all branches are added at the shared source.

They are not averaged automatically unless the objective or implementation explicitly does so.

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

The symbol \(\odot\) means element-wise multiplication.

# Activation derivatives gate the backward signal

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

At an intermediate coordinate that was negative during the forward pass, the local ReLU gradient is zero.

That coordinate sends no gradient through that activation on that example.

GELU, SiLU, and gated MLPs use different derivatives, but the chain-rule structure remains the same.

# Back through normalisation

LayerNorm and RMSNorm depend on statistics calculated from the current token row.

Their backward rules distribute gradient across the normalised feature coordinates and produce gradients for learned scale parameters such as \(\gamma\), plus shift parameters such as \(eta\) when present.

The exact derivative contains several coupled terms because changing one input coordinate can change the row mean or scale used by all coordinates.

Automatic differentiation handles these terms, but two conceptual facts matter:

- normalisation gradients stay within the token row being normalised;
- learned normalisation parameters accumulate gradients across all positions that use them.

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

So the backward pass asks both:

- how should the attention weights have changed?
- how should the Value payloads have changed?

# Back through attention softmax

Attention weights are:

$$
A=\operatorname{softmax}(S)
$$

where softmax is applied row by row.

For one row, the derivative couples all allowed entries because changing one logit changes the shared denominator.

A compact vector form is:

$$
g_S
=
A\odot
\left(
 g_A-
 \left(\sum_j g_{A,j}A_j\right)\mathbf{1}
\right)
$$

Masked future entries have zero attention probability and do not receive ordinary probability mass through the masked softmax.

Implementations represent masking carefully so forbidden positions remain excluded in both the forward and backward computations.

# Back through Query–Key scores

Before softmax:

$$
S=
\frac{QK^T}{\sqrt{d_k}}
$$

Given \(g_S\):

$$
g_Q
=
\frac{g_SK}{\sqrt{d_k}}
$$

$$
g_K
=
\frac{g_S^TQ}{\sqrt{d_k}}
$$

The score gradient therefore affects both sides of every allowed Query–Key comparison.

# Back through Q, K, and V projections

For one head:

$$
Q=XW^Q
$$

$$
K=XW^K
$$

$$
V=XW^V
$$

Their parameter gradients are:

$$
g_{W^Q}=X^Tg_Q
$$

$$
g_{W^K}=X^Tg_K
$$

$$
g_{W^V}=X^Tg_V
$$

Their input-gradient contributions are:

$$
g_X^{(Q)}=g_Q(W^Q)^T
$$

$$
g_X^{(K)}=g_K(W^K)^T
$$

$$
g_X^{(V)}=g_V(W^V)^T
$$

Because the same \(X\) fed all three projections, the contributions add:

$$
g_X
=
g_X^{(Q)}+g_X^{(K)}+g_X^{(V)}
$$

Additional contributions can arrive through residual branches and other heads.

# Multiple heads send gradients to the same residual stream

Each attention head has its own projection parameters.

The concatenation backward pass separates the incoming feature gradient into the slices belonging to each head.

Every head computes gradients for its own:

$$
W_r^Q,\quad W_r^K,\quad W_r^V
$$

But all heads began from the same layer input.

Their input-gradient contributions are added at that shared input.

The output projection \(W^O\) also receives its own gradient from the concatenated head result.

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

The backward pass visits blocks in reverse:

$$
g_{X^{(L)}}
\rightarrow
g_{X^{(L-1)}}
\rightarrow
\cdots
\rightarrow
g_{X^{(0)}}
$$

Each block computes gradients for its own parameters.

Blocks do not normally share \(W^Q\), \(W^K\), \(W^V\), \(W^O\), or MLP matrices, so each layer stores a separate parameter-gradient set.

# Embedding gradients are sparse by token ID

An embedding lookup selects rows from an embedding table.

If token ID 3 occurs in the batch, gradient for its selected embedding vector is added to row 3 of the embedding-gradient table.

Rows belonging to token IDs absent from the batch receive no direct lookup gradient from that batch.

If the same token occurs multiple times, its row receives the sum of contributions from all occurrences.

Position-embedding tables behave similarly when absolute learned positions are used.

RoPE frequencies may be fixed or parameterised depending on the architecture; the exact trainable set is model-specific.

# Weight tying combines two gradient sources

When:

$$
W_{	ext{vocab}}=E_{	ext{token}}^T
$$

the input embedding table and output vocabulary projection share one parameter object.

That shared parameter can receive gradients from:

1. its use as an input embedding lookup;
2. its use in the output vocabulary projection.

The contributions add before the optimiser update.

Weight tying does not mean the two operations have identical forward shapes. One uses rows for lookup; the other uses the transposed geometry for output scoring.

# Many token losses contribute to one parameter

Chapter 12 created multiple prediction positions per sequence.

Suppose total loss is the mean:

$$
\mathcal{L}
=
\frac{1}{N}
\sum_{i=1}^{N}\mathcal{L}_i
$$

Then for parameter \(w\):

$$
\frac{\partial\mathcal{L}}{\partial w}
=
\frac{1}{N}
\sum_{i=1}^{N}
\frac{\partial\mathcal{L}_i}{\partial w}
$$

Every valid token target can contribute to the same shared matrices.

The resulting update is not based only on one sentence or one token. Across training, gradients aggregate evidence from enormous numbers of contexts.

# A simple gradient-descent update

The most basic update rule is stochastic gradient descent:

$$
w_{\text{new}}
=
w_{\text{old}}
-\eta
\frac{\partial\mathcal{L}}{\partial w}
$$

where \(\eta\) is the learning rate.

Return to the vocabulary weight:

$$
w_{\text{old}}=0.2
$$

with gradient:

$$
g_w=-1.119482
$$

Using:

$$
\eta=0.05
$$

we get:

$$
\begin{aligned}
w_{\text{new}}
&=0.2-0.05(-1.119482)\\
&=0.2+0.055974\\
&\approx0.255974
\end{aligned}
$$

The weight increased because increasing it locally helps raise the under-supported `on` logit for this example.

<div class="warning">

## One illustrative update is not a real training recipe

Real training uses batches, adaptive optimisers, schedules, regularisation, clipping, mixed precision, and many repeated steps.

The example isolates one parameter so the sign and arithmetic remain visible.

</div>

# Why the learning rate matters

The gradient gives a direction and local scale.

The learning rate controls the step size.

- too small: learning can be unnecessarily slow;
- too large: the update can overshoot, destabilise training, or increase loss;
- appropriately scheduled: updates can be larger early and smaller during later refinement.

The useful learning rate depends on optimiser, batch size, parameterisation, model size, precision, and training recipe.

# Beyond basic SGD: AdamW

Large language models are commonly trained with adaptive optimisers such as AdamW.

Conceptually, AdamW maintains moving statistics of gradients:

- a first-moment estimate related to the running mean;
- a second-moment estimate related to squared gradient magnitude.

It uses those statistics to scale parameter updates coordinate by coordinate.

AdamW also applies decoupled weight decay to selected parameters.

The optimiser changes how gradients become updates. It does not change how backpropagation calculates the gradients themselves.

# Weight decay is not applied blindly

Training recipes often exclude some parameters from weight decay, such as:

- bias vectors;
- normalisation scale parameters;
- sometimes embeddings or other architecture-specific groups.

The exact parameter grouping is an implementation choice.

Applying one global rule without checking the target architecture can silently change the training recipe.

# Gradient clipping

Deep networks can occasionally produce unusually large gradient norms.

Global norm clipping computes a norm such as:

$$
\|g\|_2
$$

and rescales the gradient when it exceeds a threshold \(c\):

$$
g_{\text{clipped}}
=
g\cdot
\min\left(1,\frac{c}{\|g\|_2}\right)
$$

Clipping limits an update's magnitude without changing the direction when a single global scaling factor is used.

It is a stability mechanism, not a substitute for a sensible learning rate or healthy data.

# Gradient accumulation

Hardware may not fit the desired batch in one forward pass.

Gradient accumulation processes several microbatches before one optimiser step:

```text
zero gradients
forward microbatch 1 -> backward -> accumulate
forward microbatch 2 -> backward -> accumulate
forward microbatch 3 -> backward -> accumulate
optimizer step
zero gradients
```

The implementation must scale losses or gradients consistently so the accumulated result matches the intended sum or mean over the effective batch.

# Mixed precision and loss scaling

Training often stores or computes many tensors in reduced precision to improve speed and memory use.

Very small gradients can underflow in low-precision formats.

Loss scaling multiplies the loss before backpropagation:

$$
\mathcal{L}_{\text{scaled}}
=s\mathcal{L}
$$

This scales gradients by \(s\).

Before the optimiser update, gradients are unscaled and checked for invalid values.

The technique changes numerical representation, not the mathematical objective.

# Gradients must be cleared deliberately

Most automatic-differentiation frameworks accumulate gradients into parameter buffers.

If old gradients are not cleared at the intended time, a new batch's gradients can be added to stale gradients accidentally.

A standard training loop therefore contains an explicit zeroing step, except when intentional gradient accumulation is in progress.

# One complete training step

A simplified pretraining step is:

```text
1. Load token sequences.
2. Create shifted input IDs and target IDs.
3. Build attention and loss masks.
4. Run the forward pass.
5. Calculate masked cross-entropy loss.
6. Backpropagate gradients.
7. Optionally unscale and clip gradients.
8. Apply the optimiser update.
9. Clear gradients for the next step.
```

Repeated over many batches, these small updates shape:

- token embeddings;
- positional parameters when trainable;
- Query, Key, Value, and output projections;
- MLP weights;
- normalisation parameters;
- vocabulary-head parameters.

# Backpropagation does not assign human concepts

A gradient does not say:

> This neuron should learn grammar.

It says:

> A small change in this quantity would change the current loss by this local amount.

Human-interpretable capabilities emerge from many distributed updates across many examples.

The mathematics provides credit assignment, not semantic job titles.

# Common backpropagation mistakes

## Mistake 1: saying the loss flows backward as a number

What flows backward are derivatives of the loss with respect to intermediate quantities.

## Mistake 2: updating activations instead of parameters

Activations are recomputed on later forward passes. The optimiser persistently updates learned parameters.

## Mistake 3: forgetting gradient contributions from branches

When one tensor feeds several branches, all incoming gradient contributions must be added.

## Mistake 4: reversing matrix multiplication without transposes

For \(y=xW\), the backward rules require \(x^Tg_y\) for \(g_W\) and \(g_yW^T\) for \(g_x\).

## Mistake 5: assuming one token updates only one layer

One target loss can generate gradients through the entire stack and all operations that affected that prediction.

## Mistake 6: treating the gradient as the update

The optimiser transforms gradients into updates using learning rates, moments, decay, clipping, and other rules.

## Mistake 7: forgetting shared-parameter accumulation

Repeated tokens, shared positions, batches, and tied weights can all contribute multiple gradients to one parameter.

## Mistake 8: stepping the optimiser before accumulation is complete

That changes the effective batch and training dynamics.

## Mistake 9: forgetting to clear gradients

Unintended accumulation mixes separate training steps.

## Mistake 10: assuming a negative gradient means the parameter must become negative

The sign describes the local loss slope. The updated parameter depends on its current value, optimiser, and step size.

# Checkpoint

<div class="exercise">

## 1. What starts backpropagation for softmax cross-entropy?

The logit gradient:

$$
p-y
$$

## 2. What is the vocabulary-weight gradient for \(z=hW+b\)?

$$
h^Tg_z
$$

## 3. What gradient continues into the hidden state?

$$
g_h=g_zW^T
$$

## 4. What happens to gradients at a residual addition?

The incoming gradient follows both branches, and contributions are added at the shared input.

## 5. Why are MLP gradients calculated in reverse operation order?

The chain rule requires the gradient of each later operation before computing gradients for quantities that fed it.

## 6. Which attention quantities receive gradients from \(Z=AV\)?

Both \(A\) and \(V\).

## 7. Why can one embedding row receive several contributions?

The same token ID may occur at multiple positions or examples, and tied output weights may add another gradient source.

## 8. What does the learning rate control?

The scale of the optimiser step derived from the gradient.

## 9. Why use gradient accumulation?

To obtain a larger effective batch when the full batch does not fit in memory at once.

## 10. Does backpropagation itself update parameters?

No. It calculates gradients. The optimiser applies updates.

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

The hidden-state gradient then travels backward through every dependent operation using the chain rule.

An optimiser converts accumulated parameter gradients into updates such as:

$$
w_{\text{new}}
=
w_{\text{old}}-\eta g_w
$$

In our story:

> **The Scorekeeper does not know which employee made the mistake. Backpropagation follows every dependency, measures each local contribution, and delivers a correction request to every parameter involved.**

# Coming next: training at scale and changing behaviour

We have now followed one model from token input through inference, loss, and a parameter update.

The next part of the book can explore:

- minibatches, epochs, data mixtures, and learning-rate schedules;
- distributed training and memory costs;
- pretraining checkpoints and validation;
- supervised fine-tuning;
- preference optimisation and alignment;
- parameter-efficient adaptation such as LoRA.