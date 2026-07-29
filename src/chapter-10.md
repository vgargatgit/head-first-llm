---
title: "Chapter 10 — The Residual Stream Climbs the Stack"
subtitle: "How many Transformer blocks repeatedly refine every token representation"
lang: en
---

# The question this chapter answers

Chapter 9 made the architecture's positional treatment explicit. We now take $X^{(0)}$ as the prepared, position-aware hidden-state matrix entering the stack and move directly to depth.

Chapter 8 calculated the output of the first simplified Transformer block. For the three-token sequence, that output was:

$$
X^{(1)}
\approx
\begin{bmatrix}
0.029725 & -0.600171 & 1.603583 & -1.033137\\
-1.331984 & 1.481456 & -0.174505 & 0.025033\\
0.006373 & -0.143686 & 1.477529 & -1.340215
\end{bmatrix}
$$

The rows still belong to THE, CAT, and SAT.

The shape is still:

$$
3\times4
$$

But a real LLM usually contains many Transformer blocks.

What happens when the output of one block becomes the input to the next block, dozens of times?

<div class="big-idea">

**A Transformer stack repeatedly updates one residual stream. Each layer receives contextual token states from the previous layer, applies its own learned attention and MLP transformations, and writes new information back into the same model-width pathway.**

</div>

# One block is one refinement step

Use the prepared starting state established in Chapter 9:

$$
X^{(0)}
$$

The first block produces:

$$
X^{(1)}
=
\operatorname{Block}_1(X^{(0)})
$$

The second block receives that result:

$$
X^{(2)}
=
\operatorname{Block}_2(X^{(1)})
$$

After \(L\) blocks:

$$
X^{(L)}
=
\operatorname{Block}_L(X^{(L-1)})
$$

The complete stack is:

$$
X^{(0)}
\rightarrow
X^{(1)}
\rightarrow
X^{(2)}
\rightarrow
\cdots
\rightarrow
X^{(L)}
$$

Every block preserves the outer shape:

$$
X^{(\ell)}
\in
\mathbb{R}^{n\times d_{\text{model}}}
$$

That shape compatibility is what makes deep stacking possible.

# What is the residual stream?

The term **residual stream** is a useful name for the evolving matrix of token representations that flows through the model.

At layer \(\ell\), the stream is:

$$
X^{(\ell)}
$$

Each attention or MLP sublayer calculates an update and adds it to the representation already flowing through the network.

Conceptually:

```text
current residual stream
        |
        +---- attention update
        |
updated residual stream
        |
        +---- MLP update
        |
next block's residual stream
```

The residual stream is not a separate copy of the hidden states stored somewhere else.

It is the hidden-state pathway itself, viewed as a document that every layer reads and amends.

<div class="translation">

## The evolving case file

Imagine every token carries a case file.

A block does not throw the file away and start again. Attention adds notes gathered from other visible positions. The MLP reorganises and develops the information already in the file.

The amended file then moves to the next floor of the building.

</div>

<!-- design-pattern-01:chapter-10:start -->
<div class="translation">

## Pattern Trail — Residual Connections Create a Stable Interface

Chapter 7 introduced the standard residual form:

$$
y=x+F(x)
$$

Across a Transformer stack, that pattern becomes a stable architectural interface. Every block receives an $n\times d_{\text{model}}$ residual stream, computes specialised updates, and returns another matrix with the same outer shape.

Depth therefore behaves like **repeated refinement**, not repeated reconstruction from raw embeddings.

</div>
<!-- design-pattern-01:chapter-10:end -->

# Modern pre-norm stack notation

Many modern decoder-only LLMs use a pre-normalisation arrangement.

A simplified block \(\ell\) can be written:

$$
R^{(\ell)}
=
X^{(\ell-1)}
+
\operatorname{MHA}_{\ell}
\left(
\operatorname{Norm}_{\ell,1}
\left(X^{(\ell-1)}\right)
\right)
$$

Then:

$$
X^{(\ell)}
=
R^{(\ell)}
+
\operatorname{MLP}_{\ell}
\left(
\operatorname{Norm}_{\ell,2}
\left(R^{(\ell)}\right)
\right)
$$

The two additions write into the residual stream.

The exact architecture may use:

- LayerNorm or RMSNorm;
- biases or no biases;
- ordinary multi-head attention, grouped-query attention, or multi-query attention;
- GELU, SiLU, or a gated MLP;
- other ordering and scaling choices.

The stack principle remains the same: each block consumes one model-width matrix and produces another.

# Every layer owns different parameters

Block 1 has its own learned projections:

$$
W_{1}^{Q},
W_{1}^{K},
W_{1}^{V},
W_{1}^{O}
$$

Block 2 has another set:

$$
W_{2}^{Q},
W_{2}^{K},
W_{2}^{V},
W_{2}^{O}
$$

Similarly, each block owns its own MLP and normalisation parameters.

In general:

$$
W_{1}^{Q}\neq W_{2}^{Q}\neq\cdots\neq W_{L}^{Q}
$$

The blocks share the same architectural pattern, but they do not normally share the same weights.

<div class="warning">

## Repeated structure does not mean repeated parameters

A 32-layer Transformer does not usually run one block 32 times with one shared parameter set.

It normally contains 32 separately learned blocks with compatible input and output shapes.

</div>

# Later layers do not see raw token embeddings

At the first layer:

$$
Q^{(1)}=X^{(0)}W_{1}^{Q}
$$

At the second layer:

$$
Q^{(2)}=X^{(1)}W_{2}^{Q}
$$

At layer \(\ell\):

$$
Q^{(\ell)}=X^{(\ell-1)}W_{\ell}^{Q}
$$

The same applies to Keys and Values:

$$
K^{(\ell)}=X^{(\ell-1)}W_{\ell}^{K}
$$

$$
V^{(\ell)}=X^{(\ell-1)}W_{\ell}^{V}
$$

Therefore, later attention operates on representations that already contain information gathered and transformed by earlier layers.

A later-layer Key for CAT is not created directly from CAT's original embedding. It is created from CAT's current contextual state.

# Following SAT through depth

We begin with SAT's input to the first block:

$$
x_{\text{sat}}^{(0)}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

Chapter 8 calculated the first block's output:

$$
x_{\text{sat}}^{(1)}
\approx
\begin{bmatrix}
0.006373 & -0.143686 & 1.477529 & -1.340215
\end{bmatrix}
$$

The coordinates changed substantially, but the width remained four.

We will now follow a **toy continuation** through two more blocks.

The next updates are illustrative. They show residual arithmetic and depth; they are not claimed to come from the Chapter 6–8 parameter matrices, because later blocks would own new learned weights.

# Block 2: attention adds another update

Suppose Block 2's attention sublayer produces this update for SAT:

$$
\Delta_{\text{attn}}^{(2)}
=
\begin{bmatrix}
0.08 & -0.03 & 0.12 & 0.05
\end{bmatrix}
$$

The residual addition gives:

$$
\begin{aligned}
r_{\text{sat}}^{(2)}
&=
x_{\text{sat}}^{(1)}
+
\Delta_{\text{attn}}^{(2)}\\
&=
\begin{bmatrix}
0.006373 & -0.143686 & 1.477529 & -1.340215
\end{bmatrix}
+
\begin{bmatrix}
0.08 & -0.03 & 0.12 & 0.05
\end{bmatrix}\\
&=
\begin{bmatrix}
0.086373 & -0.173686 & 1.597529 & -1.290215
\end{bmatrix}
\end{aligned}
$$

The attention update can contain information retrieved from all positions visible to SAT under the causal mask.

# Block 2: the MLP adds a private update

Suppose Block 2's MLP produces:

$$
\Delta_{\text{mlp}}^{(2)}
=
\begin{bmatrix}
-0.04 & 0.11 & -0.07 & 0.02
\end{bmatrix}
$$

Then:

$$
\begin{aligned}
x_{\text{sat}}^{(2)}
&=
r_{\text{sat}}^{(2)}
+
\Delta_{\text{mlp}}^{(2)}\\
&=
\begin{bmatrix}
0.086373 & -0.173686 & 1.597529 & -1.290215
\end{bmatrix}
+
\begin{bmatrix}
-0.04 & 0.11 & -0.07 & 0.02
\end{bmatrix}\\
&=
\begin{bmatrix}
0.046373 & -0.063686 & 1.527529 & -1.270215
\end{bmatrix}
\end{aligned}
$$

This becomes SAT's input to Block 3.

# Block 3: repeat with new learned parameters

Suppose Block 3's attention update is:

$$
\Delta_{\text{attn}}^{(3)}
=
\begin{bmatrix}
-0.02 & 0.06 & 0.09 & -0.04
\end{bmatrix}
$$

The attention residual becomes:

$$
\begin{aligned}
r_{\text{sat}}^{(3)}
&=
x_{\text{sat}}^{(2)}
+
\Delta_{\text{attn}}^{(3)}\\
&=
\begin{bmatrix}
0.026373 & -0.003686 & 1.617529 & -1.310215
\end{bmatrix}
\end{aligned}
$$

Suppose the Block 3 MLP update is:

$$
\Delta_{\text{mlp}}^{(3)}
=
\begin{bmatrix}
0.05 & -0.02 & -0.10 & 0.08
\end{bmatrix}
$$

Then:

$$
\begin{aligned}
x_{\text{sat}}^{(3)}
&=
r_{\text{sat}}^{(3)}
+
\Delta_{\text{mlp}}^{(3)}\\
&=
\begin{bmatrix}
0.076373 & -0.023686 & 1.517529 & -1.230215
\end{bmatrix}
\end{aligned}
$$

# SAT's evolving case file

| Stage | SAT representation |
|---|---|
| Stack input \(x_{\text{sat}}^{(0)}\) | \([0.140000,-0.220000,0.670000,-0.310000]\) |
| After Block 1 \(x_{\text{sat}}^{(1)}\) | \([0.006373,-0.143686,1.477529,-1.340215]\) |
| After Block 2 \(x_{\text{sat}}^{(2)}\) | \([0.046373,-0.063686,1.527529,-1.270215]\) |
| After Block 3 \(x_{\text{sat}}^{(3)}\) | \([0.076373,-0.023686,1.517529,-1.230215]\) |

The coordinates are not independent human-readable counters.

The table simply demonstrates that the token's vector is repeatedly amended while preserving its model width.

# What repeated contextualisation buys the model

In the first block, a position can retrieve information from earlier positions.

The resulting state is then processed by later blocks.

That allows later layers to operate on relationships already constructed by earlier layers.

For example, a later Query can be built from a state that already reflects:

- token identity;
- position;
- nearby syntax;
- retrieved context;
- non-linear MLP transformations.

The architecture does not assign one fixed purpose to each depth.

Still, repeated transformation gives the model opportunities to construct progressively more useful representations.

<div class="warning">

## Do not turn depth into a rigid story

It is tempting to say:

- early layers do spelling;
- middle layers do grammar;
- late layers do reasoning.

Real models can show depth-related tendencies, but the architecture does not guarantee a clean one-job-per-layer pipeline.

Representations and computations are distributed and model-specific.

</div>

# Causal masking is required in every attention layer

A decoder-only model must prevent position \(i\) from using a future position \(j>i\).

That rule applies in every block:

$$
M_{ij}
=
\begin{cases}
0, & j\le i\\
-\infty, & j>i
\end{cases}
$$

At layer \(\ell\):

$$
A^{(\ell)}
=
\operatorname{softmax}
\left(
\frac{Q^{(\ell)}(K^{(\ell)})^T}{\sqrt{d_k}}
+M
\right)
$$

If only the first layer were masked, a later layer could read a future representation and leak forbidden information backward.

The causal constraint must be preserved throughout the stack.

# Can information move more than one step per layer?

Causal self-attention is not limited to immediate neighbours.

SAT can attend directly to THE in one layer because THE is an earlier visible position.

Depth is therefore not required merely to move information one token at a time.

Depth is useful because it lets the model repeatedly:

- retrieve different combinations;
- transform the retrieved information;
- form new Queries, Keys, and Values from the updated states;
- refine the residual stream.

This is richer than a simple message passed one position per layer.

# The final normalisation

Many decoder-only architectures apply one final normalisation after the last block.

Let the final block output for SAT in our toy three-block stack be:

$$
x_{\text{sat}}^{(3)}
=
\begin{bmatrix}
0.076373 & -0.023686 & 1.517529 & -1.230215
\end{bmatrix}
$$

For a simple LayerNorm illustration with:

$$
\gamma=1,\qquad\beta=0
$$

its mean is:

$$
\mu
=
\frac{0.076373-0.023686+1.517529-1.230215}{4}
\approx0.085000
$$

Its variance is approximately:

$$
\sigma^2\approx0.948454
$$

Using:

$$
\epsilon=10^{-5}
$$

we get:

$$
\sqrt{\sigma^2+\epsilon}
\approx0.973891
$$

Therefore:

$$
\boxed{
\widetilde{h}_{\text{sat}}
\approx
\begin{bmatrix}
-0.008859 & -0.111600 & 1.470933 & -1.350474
\end{bmatrix}
}
$$

This final hidden state will become the input to the vocabulary projection in Chapter 11.

# The final hidden state is still not a token

Even after the complete stack and final normalisation:

$$
\widetilde{h}_{\text{sat}}
\in
\mathbb{R}^{1\times d_{\text{model}}}
$$

It is still a hidden vector.

It is not:

- a vocabulary probability distribution;
- a token ID;
- a word;
- the final generated sentence.

The model still needs to project this vector into vocabulary space.

# Training computes all positions together

During training, the model can process a complete sequence in parallel while preserving causality with the mask.

For a sequence of length \(n\), the final stack produces:

$$
X^{(L)}
\in
\mathbb{R}^{n\times d_{\text{model}}}
$$

Each row can be projected into vocabulary logits.

Conceptually:

- row 1 predicts token 2;
- row 2 predicts token 3;
- row 3 predicts token 4;
- and so on.

The future target tokens are present in the training batch, but the causal mask prevents an earlier row from using their hidden representations.

# Generation processes one new position at a time

During autoregressive generation, the model repeatedly appends one selected token.

At decoding step \(t\):

1. the newest token receives an embedding and position information;
2. it passes through every Transformer layer;
3. the final hidden state produces next-token logits;
4. one token is selected;
5. the selected token becomes position \(t+1\).

Without caching, the model could recompute the complete prefix at every step.

A KV cache avoids much of that repeated attention work.

# One KV cache per layer

Chapter 5 introduced cached Keys and Values for one attention layer.

A deep model needs cached state for every layer:

$$
\left\{
K_{\ell}^{\text{past}},
V_{\ell}^{\text{past}}
\right\}_{\ell=1}^{L}
$$

For a common tensor layout:

$$
K_{\ell}^{\text{past}}
\in
\mathbb{R}^{B\times H_{\text{KV}}\times T\times d_{\text{head}}}
$$

and:

$$
V_{\ell}^{\text{past}}
\in
\mathbb{R}^{B\times H_{\text{KV}}\times T\times d_{\text{head}}}
$$

where:

- \(B\) is batch size;
- \(H_{\text{KV}}\) is the number of Key/Value heads;
- \(T\) is cached sequence length;
- \(d_{\text{head}}\) is the head width.

The approximate number of stored scalar values is:

$$
2LBTH_{\text{KV}}d_{\text{head}}
$$

The factor 2 represents Keys and Values.

# A small KV-cache memory estimate

Suppose an illustrative model has:

$$
L=32
$$

$$
B=1
$$

$$
T=4096
$$

$$
H_{\text{KV}}=8
$$

$$
d_{\text{head}}=128
$$

and stores each scalar using 2 bytes.

The approximate cache size is:

$$
2\cdot32\cdot1\cdot4096\cdot8\cdot128\cdot2
$$

bytes, which is:

$$
536{,}870{,}912\text{ bytes}
$$

or approximately:

$$
0.5\text{ GiB}
$$

This estimate excludes allocator overhead and other runtime tensors.

It shows why KV-cache memory grows linearly with sequence length and number of layers.

<div class="translation">

## Why grouped-query attention can reduce cache size

If many Query heads share a smaller number of Key/Value heads, then:

$$
H_{\text{KV}}<H_{Q}
$$

Fewer Key and Value vectors must be cached per layer and position.

That is one important practical motivation for grouped-query and multi-query attention.

</div>

# What the KV cache does not store

The cache normally stores past Keys and Values.

It does not need to store old attention matrices because the newest Query produces a new attention row.

It also does not simply store the final hidden states instead of layer-specific Keys and Values.

Each layer's newest Query must compare against Keys created in that same layer's learned space.

Therefore, each layer maintains its own cached projections.

# Why model depth costs memory and computation

More layers mean more parameter sets:

- more attention projections;
- more output projections;
- more MLP weights;
- more normalisation parameters.

During training, depth also increases the activations needed for backpropagation unless memory-saving techniques recompute or offload them.

During generation, depth means every new token must pass through every layer, and the KV cache contains entries for every layer.

Depth can increase representational capacity, but it is not free.

# Common stack-level mistakes

## Mistake 1: assuming all blocks share parameters

Blocks normally have distinct learned weights even though their structures look similar.

## Mistake 2: saying every layer rereads the original embeddings

Layer \(\ell\) receives the output of layer \(\ell-1\), not a fresh copy of the raw token embedding.

## Mistake 3: masking only the first layer

Causality must be enforced in every self-attention layer.

## Mistake 4: calling the residual stream a separate module

The residual stream is the evolving hidden-state pathway, not an extra neural-network component.

## Mistake 5: believing depth moves information only one token at a time

A causal Query can directly attend to any earlier visible Key in one layer.

## Mistake 6: storing attention weights in the KV cache

The cache stores layer-specific Keys and Values. New attention weights are calculated for each new Query.

## Mistake 7: treating the final hidden state as a probability distribution

It must still be projected into vocabulary logits and normalised over vocabulary entries.

## Mistake 8: assigning one guaranteed human-readable role to every layer

Layer specialisation is learned, distributed, and model-dependent.

# Checkpoint

<div class="exercise">

## 1. What becomes the input to Block 2?

The complete output matrix from Block 1:

$$
X^{(1)}
$$

## 2. Do different blocks normally share the same \(W^Q\)?

No. Each block normally owns its own learned Query projection and other parameters.

## 3. Why can blocks be stacked easily?

Every block preserves the outer shape:

$$
n\times d_{\text{model}}
$$

## 4. What is the residual stream?

The evolving matrix of token representations that receives residual updates as it passes through the model.

## 5. Must the causal mask be applied at every layer?

Yes. Otherwise later layers could access future information.

## 6. What does a later layer use to create its Queries?

The contextual hidden states produced by the previous layer.

## 7. What does the KV cache store for each layer?

Past Key and Value vectors in that layer's learned attention spaces.

## 8. Why does KV-cache memory grow with context length?

Every additional cached position adds Key and Value vectors in every layer.

## 9. Does the final hidden state directly identify a vocabulary token?

No. It must pass through the language-model output projection.

## 10. What is SAT's final normalised state in our toy stack?

$$
\widetilde{h}_{\text{sat}}
\approx
\begin{bmatrix}
-0.008859 & -0.111600 & 1.470933 & -1.350474
\end{bmatrix}
$$

</div>

# Chapter takeaway

A deep decoder repeatedly applies compatible Transformer blocks:

$$
X^{(\ell)}
=
\operatorname{Block}_{\ell}
\left(X^{(\ell-1)}\right)
$$

Each block:

- creates new Queries, Keys, and Values from contextual states;
- applies causal attention;
- transforms each position with an MLP;
- writes residual updates into the stream;
- preserves the model width.

During generation, every layer also maintains its own Key and Value cache.

In our story:

> **Every block is another floor of the investigation. The token's case file travels upward, collecting new evidence and private analysis without losing the work already written into it.**

# Coming next: the final audition

After the last block and final normalisation, SAT has:

$$
\widetilde{h}_{\text{sat}}
\approx
\begin{bmatrix}
-0.008859 & -0.111600 & 1.470933 & -1.350474
\end{bmatrix}
$$

Chapter 11 projects this four-coordinate hidden state into a tiny five-token vocabulary.

We will calculate:

- one logit per token;
- softmax probabilities;
- greedy decoding;
- temperature;
- top-\(k\) and top-\(p\) sampling;
- the repeated autoregressive generation loop.