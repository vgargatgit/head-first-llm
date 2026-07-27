---
title: "Chapter 4 — When Queries Meet Keys"
subtitle: "How dot products become scaled, masked attention weights"
lang: en
---

# The question this chapter answers

The previous chapters created two learned views of every token state:

$$
Q=XW^Q
$$

and:

$$
K=XW^K
$$

A Query says what one token position is looking for. A Key says how one token position should participate in matching.

But the model still needs to answer:

> How strongly should each Query attend to each available Key?

That answer is produced in four stages:

1. compare Queries with Keys using dot products;
2. scale the scores by \(\sqrt{d_k}\);
3. mask forbidden positions;
4. apply softmax row by row.

<div class="big-idea">

**Queries and Keys do not move information by themselves. They produce weights that decide where information will later come from.**

</div>

# Cold open: SAT reaches the matching desk

SAT arrives with the Query created in Chapter 2:

$$
q_{\text{sat}}
=
\begin{bmatrix}
-0.364 & 0.060
\end{bmatrix}
$$

The matching desk has three available Keys from Chapter 3:

$$
K=
\begin{bmatrix}
0.510 & -0.152\\
-0.453 & 0.112\\
0.371 & -0.373
\end{bmatrix}
$$

The rows belong to:

$$
\text{The},\quad \text{cat},\quad \text{sat}
$$

SAT does not choose a single Key immediately. Its Query is compared with every allowed Key.

For one candidate position \(j\), the raw compatibility score is:

$$
s_{\text{sat},j}=q_{\text{sat}}\cdot k_j
$$

The matching desk produces one number per candidate.

# Stage 1: Query–Key dot products

For any querying position \(i\) and candidate position \(j\):

$$
s_{ij}=q_i\cdot k_j
$$

If the vectors have width \(d_k\), then:

$$
s_{ij}=\sum_{r=1}^{d_k}q_{ir}k_{jr}
$$

A dot product multiplies corresponding coordinates and adds the results.

For SAT and THE:

$$
\begin{aligned}
s_{\text{sat},\text{The}}
&=
(-0.364)(0.510)+(0.060)(-0.152)\\
&=-0.18564-0.00912\\
&=-0.19476
\end{aligned}
$$

For SAT and CAT:

$$
\begin{aligned}
s_{\text{sat},\text{cat}}
&=
(-0.364)(-0.453)+(0.060)(0.112)\\
&=0.164892+0.00672\\
&=0.171612
\end{aligned}
$$

For SAT and itself:

$$
\begin{aligned}
s_{\text{sat},\text{sat}}
&=
(-0.364)(0.371)+(0.060)(-0.373)\\
&=-0.135044-0.02238\\
&=-0.157424
\end{aligned}
$$

So SAT's raw score row is:

$$
\begin{bmatrix}
-0.194760 & 0.171612 & -0.157424
\end{bmatrix}
$$

The largest raw score is the score for CAT.

<div class="warning">

## A negative score is not automatically a rejection

Raw attention scores are not probabilities and do not need to lie between 0 and 1.

A negative score can still receive substantial attention if it is large relative to the other allowed scores in the same row.

Softmax cares about relative differences, not whether every input is positive.

</div>

# All comparisons in one matrix multiplication

The complete Query matrix is:

$$
Q=
\begin{bmatrix}
-0.167 & -0.044\\
0.013 & 0.628\\
-0.364 & 0.060
\end{bmatrix}
$$

The complete Key matrix is:

$$
K=
\begin{bmatrix}
0.510 & -0.152\\
-0.453 & 0.112\\
0.371 & -0.373
\end{bmatrix}
$$

To compare every Query with every Key, transpose \(K\):

$$
K^T=
\begin{bmatrix}
0.510 & -0.453 & 0.371\\
-0.152 & 0.112 & -0.373
\end{bmatrix}
$$

Then calculate:

$$
S=QK^T
$$

Using the rounded Query and Key values from the previous chapters:

$$
S=
\begin{bmatrix}
-0.078482 & 0.070723 & -0.045545\\
-0.088826 & 0.064447 & -0.229421\\
-0.194760 & 0.171612 & -0.157424
\end{bmatrix}
$$

Each row belongs to a Query. Each column belongs to a Key.

| | Key: THE | Key: CAT | Key: SAT |
|---|---:|---:|---:|
| Query: THE | -0.078482 | 0.070723 | -0.045545 |
| Query: CAT | -0.088826 | 0.064447 | -0.229421 |
| Query: SAT | -0.194760 | 0.171612 | -0.157424 |

# Follow the shapes

For three tokens and a Query/Key width of two:

$$
Q\in\mathbb{R}^{3\times2}
$$

$$
K\in\mathbb{R}^{3\times2}
$$

Therefore:

$$
K^T\in\mathbb{R}^{2\times3}
$$

and:

$$
(3\times2)(2\times3)=(3\times3)
$$

So:

$$
S\in\mathbb{R}^{3\times3}
$$

More generally, for \(n\) token positions:

$$
Q\in\mathbb{R}^{n\times d_k}
$$

$$
K^T\in\mathbb{R}^{d_k\times n}
$$

and:

$$
QK^T\in\mathbb{R}^{n\times n}
$$

<div class="translation">

## Reading the score matrix

- row \(i\): the search performed by token position \(i\);
- column \(j\): the searchable Key belonging to token position \(j\);
- cell \((i,j)\): how compatible Query \(i\) is with Key \(j\).

</div>

# Stage 2: why divide by \(\sqrt{d_k}\)?

The Transformer does not normally send the raw dot products directly into softmax. It first scales them:

$$
\widetilde{S}=\frac{QK^T}{\sqrt{d_k}}
$$

Why?

As the vector width \(d_k\) grows, a dot product adds more products:

$$
q_i\cdot k_j
=
q_{i1}k_{j1}+q_{i2}k_{j2}+\cdots+q_{id_k}k_{jd_k}
$$

Under a simplified assumption that the coordinates are independent, centred, and have similar variance, the variance of that sum grows roughly in proportion to \(d_k\). Its standard deviation therefore grows roughly like:

$$
\sqrt{d_k}
$$

Large-magnitude logits can push softmax into a very sharp region where one position receives almost all the weight and the others receive almost none. That can make gradients through softmax less useful during training.

Dividing by \(\sqrt{d_k}\) keeps the score scale more stable as the head width changes.

<div class="big-idea">

**The scaling factor is not a semantic penalty. It is a numerical stabiliser for the logits entering softmax.**

</div>

In our example:

$$
d_k=2
$$

so:

$$
\sqrt{d_k}=\sqrt{2}\approx1.414214
$$

The scaled score matrix is:

$$
\widetilde{S}
=
\frac{S}{\sqrt{2}}
\approx
\begin{bmatrix}
-0.055495 & 0.050009 & -0.032205\\
-0.062809 & 0.045571 & -0.162225\\
-0.137716 & 0.121348 & -0.111316
\end{bmatrix}
$$

Scaling changes the distances between logits but preserves their ordering within a row because every score is divided by the same positive number.

# Stage 3: causal masking

Our running model is a causal language model. A token may use information from:

- itself;
- earlier positions.

It may not use information from future positions.

For the sequence:

> THE CAT SAT

THE may attend only to THE.

CAT may attend to THE and CAT.

SAT may attend to THE, CAT, and SAT.

We represent this rule with a causal mask \(M\):

$$
M=
\begin{bmatrix}
0 & -\infty & -\infty\\
0 & 0 & -\infty\\
0 & 0 & 0
\end{bmatrix}
$$

The zeros leave allowed scores unchanged. The \(-\infty\) entries eliminate forbidden scores before softmax.

Add the mask to the scaled scores:

$$
L=\frac{QK^T}{\sqrt{d_k}}+M
$$

For our example:

$$
L\approx
\begin{bmatrix}
-0.055495 & -\infty & -\infty\\
-0.062809 & 0.045571 & -\infty\\
-0.137716 & 0.121348 & -0.111316
\end{bmatrix}
$$

We will call \(L\) the matrix of **masked attention logits**.

<div class="warning">

## Mask before softmax, not after

Setting a forbidden probability to zero after softmax is incomplete because the remaining probabilities would no longer sum to 1 unless they were renormalised.

The standard approach removes forbidden positions at the logit stage. Since:

$$
e^{-\infty}=0
$$

those positions naturally receive zero probability during softmax.

</div>

# The mask is different for every row

Causal masking is based on position, not token identity.

The rule for row \(i\) and column \(j\) is:

$$
M_{ij}=
\begin{cases}
0, & j\le i\\
-\infty, & j>i
\end{cases}
$$

This means the same Key can be visible to a later Query and invisible to an earlier Query.

For example, SAT's Key is:

- invisible to THE;
- invisible to CAT;
- visible to SAT.

Nothing about SAT's Key itself changed. Only the permission relationship changed.

# Stage 4: softmax turns logits into weights

For one Query row \(i\), softmax is:

$$
a_{ij}
=
\frac{e^{L_{ij}}}{\sum_{r=1}^{n}e^{L_{ir}}}
$$

Softmax is applied **independently to each row**.

The resulting matrix is usually called the attention-weight matrix:

$$
A=\operatorname{softmax}(L)
$$

Every row of \(A\):

- contains non-negative values;
- sums to 1;
- assigns zero weight to masked positions.

# Exact softmax for CAT

CAT's allowed logits are:

$$
\begin{bmatrix}
-0.062809 & 0.045571
\end{bmatrix}
$$

Exponentiating gives approximately:

$$
\begin{bmatrix}
0.939122 & 1.046625
\end{bmatrix}
$$

Their sum is:

$$
0.939122+1.046625=1.985747
$$

Therefore:

$$
\begin{aligned}
a_{\text{cat},\text{The}}
&=\frac{0.939122}{1.985747}
\approx0.472931\\
a_{\text{cat},\text{cat}}
&=\frac{1.046625}{1.985747}
\approx0.527069
\end{aligned}
$$

CAT gives slightly more weight to itself than to THE.

# Exact softmax for SAT

SAT can see all three positions. Its logits are:

$$
\begin{bmatrix}
-0.137716 & 0.121348 & -0.111316
\end{bmatrix}
$$

Exponentiating gives approximately:

$$
\begin{bmatrix}
0.871346 & 1.129018 & 0.894656
\end{bmatrix}
$$

Their sum is:

$$
0.871346+1.129018+0.894656=2.895020
$$

Therefore:

$$
\begin{aligned}
a_{\text{sat},\text{The}}&\approx0.300981\\
a_{\text{sat},\text{cat}}&\approx0.389986\\
a_{\text{sat},\text{sat}}&\approx0.309033
\end{aligned}
$$

The largest weight goes to CAT, but the attention is distributed across all three allowed positions.

# The complete attention-weight matrix

Applying row-wise softmax to the masked logits gives:

$$
A\approx
\begin{bmatrix}
1.000000 & 0 & 0\\
0.472931 & 0.527069 & 0\\
0.300981 & 0.389986 & 0.309033
\end{bmatrix}
$$

Check each row:

$$
1.000000=1
$$

$$
0.472931+0.527069=1
$$

$$
0.300981+0.389986+0.309033=1
$$

The matrix now answers:

> For every Query, how much influence should each allowed token position have in this attention head?

# Why softmax is row-wise

Each row represents a different search.

THE's Query asks one question.

CAT's Query asks another.

SAT's Query asks another.

They must each receive their own probability distribution over candidate Keys.

Applying one softmax over the entire \(n\times n\) matrix would mix unrelated searches and would not make each Query's weights sum to 1.

# Softmax depends on differences

Adding the same constant \(c\) to every allowed logit in one row does not change the softmax result:

$$
\operatorname{softmax}(z)
=
\operatorname{softmax}(z+c)
$$

This is why implementations use a numerically stable form:

$$
\operatorname{softmax}(z)_j
=
\frac{e^{z_j-m}}{\sum_r e^{z_r-m}}
$$

where:

$$
m=\max_r z_r
$$

Subtracting the row maximum prevents unnecessarily large exponentials without changing the probabilities.

# The compact attention-weight formula

The four stages can be written in one expression:

$$
\boxed{
A
=
\operatorname{softmax}
\left(
\frac{QK^T}{\sqrt{d_k}}+M
\right)
}
$$

Read it from the inside out:

1. \(QK^T\): compare every Query with every Key;
2. divide by \(\sqrt{d_k}\): stabilise the score scale;
3. add \(M\): remove forbidden positions;
4. softmax: normalise each Query row into attention weights.

# Scores are not explanations

An attention matrix is mathematically observable, but it should not automatically be treated as a complete explanation of a model's behaviour.

A high weight tells us that a Value vector contributed strongly to this head's output at this layer and position. It does not by itself tell us:

- why the model produced its final answer;
- what a human-readable concept the head represents;
- whether changing that weight alone would preserve all other computations;
- how later layers transform the result.

Attention weights are part of the mechanism, not a guaranteed explanation of the entire network.

# Common mistakes at the matching desk

## Mistake 1: comparing Query with Value

Compatibility is calculated with Keys:

$$
QK^T
$$

not:

$$
QV^T
$$

Values are used only after the weights have been calculated.

## Mistake 2: forgetting the transpose

If:

$$
Q,K\in\mathbb{R}^{n\times d_k}
$$

then \(QK\) is generally not dimensionally valid. The required comparison is:

$$
QK^T
$$

## Mistake 3: applying softmax down columns

The normalisation is per Query row, not per Key column.

## Mistake 4: treating the largest raw score as a hard selection

Attention usually produces a distribution, not an argmax. Several positions can contribute simultaneously.

## Mistake 5: masking by multiplying scores by zero

Multiplying a forbidden logit by zero makes it zero, which may still receive positive softmax probability. Forbidden logits should be replaced by a very negative value, conceptually \(-\infty\).

# How implementations hold the tensors

With batches and multiple heads, the score tensor often has shape:

$$
(\text{batch},\;\text{heads},\;\text{query positions},\;\text{key positions})
$$

A common layout is:

$$
B\times H\times N\times N
$$

for self-attention over a sequence of length \(N\).

The matrix multiplication is performed independently for each batch item and head, even when the hardware executes the work in one fused operation.

The mask is broadcast across whichever dimensions share the same causal rule.

# Checkpoint

<div class="exercise">

## 1. What does one cell \(S_{ij}\) represent?

The raw dot-product compatibility between Query \(i\) and Key \(j\).

## 2. Why is \(K\) transposed?

So every Query row can take a dot product with every Key row, producing one score per Query–Key pair.

## 3. Why divide by \(\sqrt{d_k}\)?

To keep dot-product logits at a manageable scale as the Query/Key width grows, preventing softmax from becoming unnecessarily saturated.

## 4. When is a causal position forbidden?

For Query position \(i\), Key position \(j\) is forbidden when \(j>i\).

## 5. Why does a masked logit receive zero weight?

It is set conceptually to \(-\infty\), and \(e^{-\infty}=0\).

## 6. Along which dimension is softmax applied?

Across the candidate Key positions in each Query row.

## 7. Must a negative logit receive a small weight?

Not necessarily. Its weight depends on the other allowed logits in the same row.

## 8. What is the shape of the attention matrix for \(n\) tokens?

$$
A\in\mathbb{R}^{n\times n}
$$

for one self-attention head.

</div>

# Chapter takeaway

Queries and Keys create compatibility scores:

$$
S=QK^T
$$

The scores are scaled:

$$
\widetilde{S}=\frac{S}{\sqrt{d_k}}
$$

Forbidden future positions are masked:

$$
L=\widetilde{S}+M
$$

Softmax converts each row into attention weights:

$$
A=\operatorname{softmax}(L)
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

These weights decide **where to retrieve from**.

They do not yet tell us **what information is retrieved**.

# Coming next: the information behind the match

A strong match is useful only if the matched position has something to contribute.

Every token therefore creates a third learned representation:

$$
v_t=x_tW^V
$$

The attention weights will mix those Value vectors:

$$
Z=AV
$$

That is the job of Chapter 5:

# **Meet the Information Courier — Values and the Weighted Sum**
