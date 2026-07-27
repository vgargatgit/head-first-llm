---
title: "Chapter 5 — Meet the Information Courier"
subtitle: "How Values and attention weights create the output of one head"
lang: en
---

# The question this chapter answers

Chapter 4 produced the attention-weight matrix:

$$
A
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}+M
\right)
$$

For our three-token example:

$$
A\approx
\begin{bmatrix}
1.000000 & 0 & 0\\
0.472931 & 0.527069 & 0\\
0.300981 & 0.389986 & 0.309033
\end{bmatrix}
$$

Those weights tell every Query how strongly it matched each allowed Key.

But a match score is not the information that should flow into the output.

What does each matched token actually contribute?

That is the job of the **Value projection**:

$$
W^V
$$

and the resulting Value vectors:

$$
v_t=x_tW^V
$$

<div class="big-idea">

**Queries and Keys decide where to look. Values provide the information that comes back.**

</div>

# Cold open: the match report reaches the courier

The matching desk gives SAT this distribution:

| Source position | SAT's attention weight |
|---|---:|
| THE | 0.300981 |
| CAT | 0.389986 |
| SAT | 0.309033 |

The report says how much each position should matter.

It does not contain the payload from those positions.

The Information Courier visits each allowed token, collects its Value vector, scales that vector by the assigned attention weight, and combines the pieces.

For SAT:

$$
z_{\text{sat}}
=
0.300981v_{\text{The}}
+
0.389986v_{\text{cat}}
+
0.309033v_{\text{sat}}
$$

The result \(z_{\text{sat}}\) is the output of this attention head for SAT.

# What a Value is

For token position \(t\):

$$
v_t=x_tW^V
$$

The ingredients are:

- \(x_t\): the token's current hidden state;
- \(W^V\): the learned Value projection for this head;
- \(v_t\): the token's Value vector.

The Value projection is applied independently to every token position, just like the Query and Key projections.

For the full sequence:

$$
V=XW^V
$$

In the story:

| Story role | Transformer operation |
|---|---|
| Token's current situation | Hidden state \(x_t\) |
| Information Courier's packing rule | Value projection \(W^V\) |
| Information package | Value vector \(v_t\) |
| Match strengths | Attention weights \(a_{ij}\) |
| Combined delivery | Head output \(z_i\) |

<div class="warning">

## Value does not mean importance

The word “Value” does not mean a score saying how valuable a token is.

Importance is represented by the attention weight.

A Value is the vector payload that will be multiplied by that weight.

</div>

# Query, Key, and Value are three views of one state

The same hidden state can be projected three different ways:

$$
q_t=x_tW^Q
$$

$$
k_t=x_tW^K
$$

$$
v_t=x_tW^V
$$

The three projections have different jobs:

| Representation | Job |
|---|---|
| Query \(q_t\) | Express what position \(t\) is seeking |
| Key \(k_t\) | Express when position \(t\) should match a search |
| Value \(v_t\) | Express what position \(t\) can contribute after matching |

Usually:

$$
W^Q\neq W^K\neq W^V
$$

and therefore:

$$
q_t,\;k_t,\;v_t
$$

are generally different even though they begin with the same \(x_t\).

# The Value projection for our example

We continue with the hidden-state matrix used throughout the book:

$$
X=
\begin{bmatrix}
0.21 & -0.37 & 0.58 & -0.11\\
-0.42 & 0.73 & -0.15 & 0.36\\
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

The rows belong to THE, CAT, and SAT.

For this attention head, suppose the learned Value projection is:

$$
W^V=
\begin{bmatrix}
0.6 & -0.2\\
0.1 & 0.5\\
-0.4 & 0.3\\
0.7 & 0.2
\end{bmatrix}
$$

Its shape is:

$$
W^V\in\mathbb{R}^{4\times2}
$$

We use two Value coordinates in this small example:

$$
d_v=2
$$

# Exact Value calculation for SAT

SAT's current hidden state is:

$$
x_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

Its Value is:

$$
v_{\text{sat}}=x_{\text{sat}}W^V
$$

Substituting the numbers:

$$
v_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
\begin{bmatrix}
0.6 & -0.2\\
0.1 & 0.5\\
-0.4 & 0.3\\
0.7 & 0.2
\end{bmatrix}
$$

## First Value coordinate

$$
\begin{aligned}
v_1
&=
0.14(0.6)
+
(-0.22)(0.1)
+
0.67(-0.4)
+
(-0.31)(0.7)\\
&=
0.084-0.022-0.268-0.217\\
&=-0.423
\end{aligned}
$$

## Second Value coordinate

$$
\begin{aligned}
v_2
&=
0.14(-0.2)
+
(-0.22)(0.5)
+
0.67(0.3)
+
(-0.31)(0.2)\\
&=
-0.028-0.110+0.201-0.062\\
&=0.001
\end{aligned}
$$

Therefore:

$$
\boxed{
v_{\text{sat}}
=
\begin{bmatrix}
-0.423 & 0.001
\end{bmatrix}
}
$$

# One Value projection, many tokens

The same \(W^V\) is applied to every row of \(X\):

$$
V=XW^V
$$

The result is:

$$
V=
\begin{bmatrix}
-0.220 & -0.075\\
0.133 & 0.476\\
-0.423 & 0.001
\end{bmatrix}
$$

So:

$$
v_{\text{The}}
=
\begin{bmatrix}
-0.220 & -0.075
\end{bmatrix}
$$

$$
v_{\text{cat}}
=
\begin{bmatrix}
0.133 & 0.476
\end{bmatrix}
$$

$$
v_{\text{sat}}
=
\begin{bmatrix}
-0.423 & 0.001
\end{bmatrix}
$$

The Value matrix has shape:

$$
V\in\mathbb{R}^{3\times2}
$$

That means:

- three token positions;
- one two-dimensional Value per position.

<div class="big-idea">

**The same Value projection is shared across positions in one head. Different hidden states produce different payloads.**

</div>

# Follow the Value shapes

For one token:

$$
x_t\in\mathbb{R}^{1\times d_{\text{model}}}
$$

The Value projection has shape:

$$
W^V\in\mathbb{R}^{d_{\text{model}}\times d_v}
$$

Therefore:

$$
v_t\in\mathbb{R}^{1\times d_v}
$$

For \(n\) tokens:

$$
X\in\mathbb{R}^{n\times d_{\text{model}}}
$$

$$
V=XW^V\in\mathbb{R}^{n\times d_v}
$$

The Value width \(d_v\) does not have to equal \(d_k\) for the weighted sum to be valid.

Queries and Keys need the same width because they take dot products:

$$
q_i\cdot k_j
$$

Values are not dotted with Queries. They are multiplied by scalar weights and added.

In many standard implementations, each head uses:

$$
d_k=d_v=\frac{d_{\text{model}}}{h}
$$

but equality is a design choice, not a mathematical requirement of the attention formula.

# From weights to a retrieved result

For Query position \(i\), the output of one attention head is:

$$
z_i=\sum_{j=1}^{n}a_{ij}v_j
$$

Here:

- \(a_{ij}\) is one scalar attention weight;
- \(v_j\) is one Value vector;
- \(z_i\) is one weighted combination of the available Values.

Because the weights in a softmax row are non-negative and sum to 1, \(z_i\) is a weighted average of the allowed Value vectors.

It is not usually an exact copy of one Value.

# Exact attention output for THE

THE's attention row is:

$$
\begin{bmatrix}
1 & 0 & 0
\end{bmatrix}
$$

Therefore:

$$
\begin{aligned}
z_{\text{The}}
&=
1v_{\text{The}}+0v_{\text{cat}}+0v_{\text{sat}}\\
&=v_{\text{The}}\\
&=
\begin{bmatrix}
-0.220 & -0.075
\end{bmatrix}
\end{aligned}
$$

THE cannot see later positions, so the first head output is simply its own Value.

# Exact attention output for CAT

CAT's attention row is:

$$
\begin{bmatrix}
0.472931 & 0.527069 & 0
\end{bmatrix}
$$

Therefore:

$$
z_{\text{cat}}
=
0.472931v_{\text{The}}
+
0.527069v_{\text{cat}}
$$

For the first coordinate:

$$
\begin{aligned}
z_{\text{cat},1}
&=
0.472931(-0.220)
+
0.527069(0.133)\\
&\approx
-0.104045+0.070100\\
&\approx-0.033945
\end{aligned}
$$

For the second coordinate:

$$
\begin{aligned}
z_{\text{cat},2}
&=
0.472931(-0.075)
+
0.527069(0.476)\\
&\approx
-0.035470+0.250885\\
&\approx0.215415
\end{aligned}
$$

So:

$$
\boxed{
z_{\text{cat}}
\approx
\begin{bmatrix}
-0.033945 & 0.215415
\end{bmatrix}
}
$$

CAT's output blends information from THE and CAT.

# Exact attention output for SAT

SAT's attention row is:

$$
\begin{bmatrix}
0.300981 & 0.389986 & 0.309033
\end{bmatrix}
$$

Therefore:

$$
z_{\text{sat}}
=
0.300981v_{\text{The}}
+
0.389986v_{\text{cat}}
+
0.309033v_{\text{sat}}
$$

For the first coordinate:

$$
\begin{aligned}
z_{\text{sat},1}
&=
0.300981(-0.220)
+
0.389986(0.133)
+
0.309033(-0.423)\\
&\approx
-0.066216
+
0.051868
-
0.130721\\
&\approx-0.145069
\end{aligned}
$$

For the second coordinate:

$$
\begin{aligned}
z_{\text{sat},2}
&=
0.300981(-0.075)
+
0.389986(0.476)
+
0.309033(0.001)\\
&\approx
-0.022574
+
0.185633
+
0.000309\\
&\approx0.163369
\end{aligned}
$$

So:

$$
\boxed{
z_{\text{sat}}
\approx
\begin{bmatrix}
-0.145069 & 0.163369
\end{bmatrix}
}
$$

SAT's head output is a new vector assembled from all three visible positions.

# All weighted sums in one matrix multiplication

Stacking every output row gives the head-output matrix:

$$
Z=
\begin{bmatrix}
z_{\text{The}}\\
z_{\text{cat}}\\
z_{\text{sat}}
\end{bmatrix}
$$

All outputs can be calculated at once:

$$
Z=AV
$$

Substituting our matrices:

$$
Z
=
\begin{bmatrix}
1.000000 & 0 & 0\\
0.472931 & 0.527069 & 0\\
0.300981 & 0.389986 & 0.309033
\end{bmatrix}
\begin{bmatrix}
-0.220 & -0.075\\
0.133 & 0.476\\
-0.423 & 0.001
\end{bmatrix}
$$

The result is:

$$
\boxed{
Z\approx
\begin{bmatrix}
-0.220000 & -0.075000\\
-0.033945 & 0.215415\\
-0.145069 & 0.163369
\end{bmatrix}
}
$$

# Follow the weighted-sum shapes

The attention matrix has shape:

$$
A\in\mathbb{R}^{n\times n}
$$

The Value matrix has shape:

$$
V\in\mathbb{R}^{n\times d_v}
$$

Therefore:

$$
(n\times n)(n\times d_v)=(n\times d_v)
$$

So:

$$
Z\in\mathbb{R}^{n\times d_v}
$$

For our example:

$$
(3\times3)(3\times2)=(3\times2)
$$

The output contains one \(d_v\)-dimensional result for every Query position.

<div class="translation">

## Read the multiplication by rows

Row \(i\) of \(A\) contains Query \(i\)'s retrieval weights.

Multiplying that row by \(V\) produces row \(i\) of \(Z\), the retrieved result for that Query.

</div>

# The complete formula for one attention head

We now have every major piece of scaled dot-product attention:

$$
Q=XW^Q
$$

$$
K=XW^K
$$

$$
V=XW^V
$$

$$
A
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}+M
\right)
$$

$$
Z=AV
$$

Combining the final two steps:

$$
\boxed{
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}+M
\right)V
}
$$

And substituting the projections from \(X\):

$$
\boxed{
Z
=
\operatorname{softmax}
\left(
\frac{(XW^Q)(XW^K)^T}{\sqrt{d_k}}+M
\right)
(XW^V)
}
$$

This is the core computation performed by one causal self-attention head.

# Why separate matching from payload?

Suppose a token is highly relevant to a search.

The features that make it easy to recognise need not be the same features that should be transferred into the output.

A simple database analogy helps:

- a Key is like an index used to find a record;
- a Value is like the record content returned after the match.

The analogy is incomplete because Transformer Keys and Values are learned vectors rather than literal database fields. But it captures the separation of responsibilities.

The model can learn:

- one representation that is effective for matching;
- another representation that is effective for communication.

# Attention is soft retrieval

A traditional lookup may return one record.

Attention usually retrieves a blend:

$$
z_i=\sum_j a_{ij}v_j
$$

If one weight is close to 1, attention behaves approximately like selecting one Value.

For example:

$$
\begin{bmatrix}
0.01 & 0.98 & 0.01
\end{bmatrix}V
\approx v_2
$$

If several weights are substantial, the output combines several Value vectors.

That allows a token position to gather multiple kinds of contextual evidence in one head.

<div class="warning">

## Do not read Value coordinates literally

A Value coordinate does not arrive with a label such as “subject information” or “past tense.”

Its meaning is distributed, learned, layer-dependent, and useful because later network operations know how to process it.

</div>

# Attention output is not yet the final token state

The matrix \(Z\) is the output of **one attention head**.

A real Transformer block normally performs additional work:

1. several heads calculate their own outputs;
2. the head outputs are concatenated;
3. an output projection \(W^O\) mixes them;
4. a residual connection combines the attention result with the block input;
5. normalisation and an MLP process the representation further.

Exact ordering depends on the architecture. For example, pre-normalisation and post-normalisation blocks place layer normalisation differently.

So it would be inaccurate to say:

> \(Z\) is the final contextual embedding produced by the entire Transformer.

A better statement is:

> \(Z\) is the contextual result produced by one attention head before the remaining block operations.

# What changes across attention heads?

In ordinary multi-head attention, head \(r\) has its own projections:

$$
W_r^Q,\quad W_r^K,\quad W_r^V
$$

It therefore produces its own:

$$
Q_r,\quad K_r,\quad V_r,\quad A_r,\quad Z_r
$$

The output of each head is:

$$
Z_r
=
\operatorname{softmax}
\left(
\frac{Q_rK_r^T}{\sqrt{d_k}}+M
\right)V_r
$$

Different heads can learn different matching spaces and different payload spaces.

One head may distribute its attention differently from another, and even identical weights would mix different information if the heads use different Value projections.

# Packed implementation versus conceptual heads

Implementations commonly compute all Query, Key, and Value projections with large matrix multiplications:

$$
Q_{\text{big}}=XW_{\text{big}}^Q
$$

$$
K_{\text{big}}=XW_{\text{big}}^K
$$

$$
V_{\text{big}}=XW_{\text{big}}^V
$$

The results are reshaped into head dimensions, often something like:

$$
(\text{batch},\;\text{heads},\;\text{tokens},\;\text{head width})
$$

This packed computation does not erase the conceptual distinction between heads. Separate slices of the larger matrices still contain separate learned projection parameters.

# Values during autoregressive generation

During token-by-token generation, the model repeatedly attends to previous positions.

Past Keys and Values can be cached because their hidden states at the current layer do not change when a new token is appended.

For the newest token, the model computes:

- a new Query;
- a new Key;
- a new Value.

It then compares the new Query with the cached Keys and combines the cached Values plus the new Value.

This is the basic reason a **KV cache** can accelerate autoregressive decoding.

The cache stores Keys and Values, not attention weights, because the newest Query creates a new set of weights at every generation step.

# Common mistakes at the delivery desk

## Mistake 1: treating Values as attention weights

Values are vectors. Attention weights are scalars.

The operation is:

$$
a_{ij}v_j
$$

not a comparison between two weights.

## Mistake 2: multiplying in the wrong order

The correct full-sequence operation is:

$$
AV
$$

with shapes:

$$
(n\times n)(n\times d_v)=(n\times d_v)
$$

## Mistake 3: using Keys as the payload

Keys decide matching. Values carry the information mixed into the output.

## Mistake 4: assuming attention copies one token

Softmax produces a distribution. Unless it is extremely sharp, the result is a blend of several Values.

## Mistake 5: assuming \(Z\) has width \(d_{\text{model}}\)

One head produces width \(d_v\). Multiple heads and the output projection restore or transform the combined representation into the model's working width.

## Mistake 6: forgetting that the mask affects retrieval

A masked position receives zero attention weight, so its Value contributes nothing to that Query's output even though the Value vector may have been computed.

# Checkpoint

<div class="exercise">

## 1. What does a Value represent?

A learned payload representation of one token position for one attention head.

## 2. Which vectors are compared to create attention scores?

Queries and Keys.

## 3. Which vectors are combined after softmax?

Values.

## 4. What does \(a_{ij}\) mean?

It is the scalar weight controlling how much Value \(v_j\) contributes to output \(z_i\).

## 5. What is the output for one Query position?

$$
z_i=\sum_j a_{ij}v_j
$$

## 6. What is the matrix form for all positions?

$$
Z=AV
$$

## 7. What is the shape of \(Z\)?

For \(n\) positions and Value width \(d_v\):

$$
Z\in\mathbb{R}^{n\times d_v}
$$

## 8. Why are Keys and Values separate?

The features useful for deciding relevance need not be the same features that should be transferred after a match.

## 9. Why can past Values be cached during generation?

Their layer inputs and projections do not change merely because a later token is appended.

## 10. Is one head's output the final Transformer output?

No. Multi-head combination, output projection, residual processing, normalisation, and the MLP still remain.

</div>

# Chapter takeaway

Every token creates a Value:

$$
v_t=x_tW^V
$$

For the whole sequence:

$$
V=XW^V
$$

The attention weights from Chapter 4 mix those Values:

$$
Z=AV
$$

For one Query position:

$$
z_i=\sum_j a_{ij}v_j
$$

The complete one-head operation is:

$$
\boxed{
Z
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}+M
\right)V
}
$$

In the dating-service story:

> **The Question Coach creates the search. The Profile Writer creates searchable descriptions. The matching desk assigns weights. The Information Courier delivers a weighted blend of the matched information.**

We have now completed one full attention head from input state to retrieved output.

# Coming next: many heads, one result

One head provides one learned view of relevance and one learned kind of payload.

Real Transformers usually run several heads in parallel:

$$
Z_1,\;Z_2,\;\ldots,\;Z_h
$$

Their outputs are concatenated and mixed through an output projection:

$$
\operatorname{Concat}(Z_1,\ldots,Z_h)W^O
$$

The next chapter can follow how multiple heads cooperate without losing the token dimension.
