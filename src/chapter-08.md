---
title: "Chapter 8 — The Private Thinking Room"
subtitle: "How the position-wise MLP transforms each token and completes one Transformer block"
lang: en
---

# The question this chapter answers

Chapter 7 completed the attention sublayer and produced one updated representation for every token:

$$
N\approx
\begin{bmatrix}
-0.195555 & -0.563435 & 1.674888 & -0.915898\\
-1.143160 & 1.404068 & -0.716785 & 0.455877\\
-0.066680 & -0.316240 & 1.573850 & -1.190930
\end{bmatrix}
$$

Attention allowed each token position to retrieve information from other visible positions.

But a Transformer block contains another major sublayer: a feed-forward neural network, often called the **MLP**, **FFN**, or **position-wise feed-forward network**.

Why is this network needed after attention, and why is it applied separately to every token?

<div class="big-idea">

**Attention moves and combines information across token positions. The MLP transforms the feature representation inside each token position. A Transformer block needs both kinds of computation.**

</div>

# Cold open: the meeting ends, private work begins

During attention, THE, CAT, and SAT participated in a shared meeting.

Each position could retrieve a weighted blend of information from allowed positions.

After the meeting, every token enters the same private thinking room.

The room follows one learned procedure:

1. expand the token's feature vector;
2. apply a non-linear activation;
3. contract the result back to the model width.

The same room is used for every token, but each token enters with a different vector and therefore leaves with a different result.

# The position-wise MLP

For one token row \(n_t\), a simple two-layer feed-forward network is:

$$
p_t=n_tW_1+b_1
$$

$$
u_t=\phi(p_t)
$$

$$
f_t=u_tW_2+b_2
$$

Combining the steps:

$$
\operatorname{FFN}(n_t)
=
\phi(n_tW_1+b_1)W_2+b_2
$$

For the entire sequence matrix:

$$
P=NW_1+b_1
$$

$$
U=\phi(P)
$$

$$
F=UW_2+b_2
$$

The bias vectors are broadcast to every token row.

# Position-wise means no token mixing

Suppose:

$$
N=
\begin{bmatrix}
n_{\text{The}}\\
n_{\text{cat}}\\
n_{\text{sat}}
\end{bmatrix}
$$

Then:

$$
F=
\begin{bmatrix}
\operatorname{FFN}(n_{\text{The}})\\
\operatorname{FFN}(n_{\text{cat}})\\
\operatorname{FFN}(n_{\text{sat}})
\end{bmatrix}
$$

There is no term such as:

$$
n_{\text{The}}\cdot n_{\text{cat}}
$$

inside this MLP.

THE's row is transformed independently of CAT's row. CAT's row is transformed independently of SAT's row.

The same weights are reused across positions:

$$
W_1,\quad b_1,\quad W_2,\quad b_2
$$

<div class="translation">

## Communication versus private processing

Attention is the communication stage: token positions can influence one another.

The MLP is the private-processing stage: each position reorganises and transforms the information now stored in its own feature vector.

</div>

# Expand, activate, contract

Our model width is:

$$
d_{\text{model}}=4
$$

For a small worked example, choose an MLP hidden width:

$$
d_{\text{ff}}=6
$$

The first matrix expands four coordinates into six:

$$
W_1\in\mathbb{R}^{4\times6}
$$

The second matrix contracts six coordinates back into four:

$$
W_2\in\mathbb{R}^{6\times4}
$$

So each token follows:

$$
4\longrightarrow6\longrightarrow4
$$

In production Transformers, the intermediate width is often much larger than the model width. The exact ratio depends on the architecture, especially when gated MLPs are used.

# Why expand the feature space?

A single linear transformation cannot represent an arbitrary non-linear feature transformation.

The expansion creates a larger intermediate workspace in which the network can build many learned combinations of the token's current features.

The activation then introduces non-linearity.

The final projection recombines the activated intermediate features into the model's working width.

Without the activation, two consecutive linear layers would collapse into one linear operation:

$$
(nW_1)W_2=n(W_1W_2)
$$

The non-linearity is what prevents that collapse.

# The MLP parameters for our example

Use:

$$
W_1=
\begin{bmatrix}
0.4 & -0.2 & 0.1 & 0.5 & -0.3 & 0.2\\
-0.1 & 0.6 & -0.4 & 0.2 & 0.5 & -0.2\\
0.3 & 0.1 & 0.5 & -0.3 & 0.2 & 0.4\\
0.2 & -0.5 & 0.2 & 0.4 & -0.1 & 0.3
\end{bmatrix}
$$

and:

$$
b_1=
\begin{bmatrix}
0.05 & -0.10 & 0.08 & 0 & 0.03 & -0.04
\end{bmatrix}
$$

For the second layer, use:

$$
W_2=
\begin{bmatrix}
0.3 & -0.2 & 0.1 & 0.4\\
-0.1 & 0.5 & 0.2 & -0.3\\
0.4 & 0.1 & -0.2 & 0.2\\
0.2 & -0.4 & 0.3 & 0.1\\
-0.3 & 0.2 & 0.5 & -0.1\\
0.1 & 0.3 & -0.4 & 0.2
\end{bmatrix}
$$

and:

$$
b_2=
\begin{bmatrix}
0.02 & -0.01 & 0.03 & -0.02
\end{bmatrix}
$$

# The activation for the worked example

To keep every number easy to inspect, we use ReLU:

$$
\operatorname{ReLU}(x)=\max(0,x)
$$

ReLU leaves positive coordinates unchanged and replaces negative coordinates with zero.

This is a teaching choice, not a claim that modern LLMs generally use ReLU. We will compare common modern activations later in the chapter.

# Calculate SAT's expanded representation

SAT enters the MLP with the Chapter 7 output:

$$
n_{\text{sat}}
\approx
\begin{bmatrix}
-0.066680 & -0.316240 & 1.573850 & -1.190930
\end{bmatrix}
$$

The pre-activation vector is:

$$
p_{\text{sat}}=n_{\text{sat}}W_1+b_1
$$

The result is:

$$
p_{\text{sat}}
\approx
\begin{bmatrix}
0.288921 & 0.476442 & 0.748567 & -1.045115 & 0.325747 & 0.282173
\end{bmatrix}
$$

## Verify the first expanded coordinate

The first column of \(W_1\) is:

$$
\begin{bmatrix}
0.4\\
-0.1\\
0.3\\
0.2
\end{bmatrix}
$$

Therefore:

$$
\begin{aligned}
p_{\text{sat},1}
&=(-0.066680)(0.4)
+(-0.316240)(-0.1)\\
&\quad +(1.573850)(0.3)
+(-1.190930)(0.2)
+0.05\\
&\approx-0.026672+0.031624+0.472155-0.238186+0.05\\
&\approx0.288921
\end{aligned}
$$

# Apply the activation

Applying ReLU coordinate by coordinate:

$$
u_{\text{sat}}=\operatorname{ReLU}(p_{\text{sat}})
$$

The fourth coordinate is negative, so it becomes zero:

$$
\boxed{
u_{\text{sat}}
\approx
\begin{bmatrix}
0.288921 & 0.476442 & 0.748567 & 0 & 0.325747 & 0.282173
\end{bmatrix}
}
$$

The activation creates a non-linear gate. The contribution carried by the fourth intermediate feature is removed for this token on this forward pass.

Another token can activate a different subset of intermediate coordinates even though the weights are shared.

# Contract SAT back to the model width

The second linear layer calculates:

$$
f_{\text{sat}}=u_{\text{sat}}W_2+b_2
$$

The output is:

$$
\boxed{
f_{\text{sat}}
\approx
\begin{bmatrix}
0.288952 & 0.395095 & 0.054471 & 0.126209
\end{bmatrix}
}
$$

## Verify the first contracted coordinate

The first column of \(W_2\) is:

$$
\begin{bmatrix}
0.3\\
-0.1\\
0.4\\
0.2\\
-0.3\\
0.1
\end{bmatrix}
$$

Therefore:

$$
\begin{aligned}
f_{\text{sat},1}
&=0.288921(0.3)
+0.476442(-0.1)
+0.748567(0.4)\\
&\quad +0(0.2)
+0.325747(-0.3)
+0.282173(0.1)
+0.02\\
&\approx0.086676-0.047644+0.299427+0\\
&\quad -0.097724+0.028217+0.020000\\
&\approx0.288952
\end{aligned}
$$

The MLP has transformed SAT's four features through a six-dimensional non-linear workspace and returned a four-dimensional update.

# Calculate the MLP for every token

For all positions:

$$
P=NW_1+b_1
$$

The pre-activation matrix is:

$$
P\approx
\begin{bmatrix}
0.347408 & 0.226488 & 0.940083 & -1.079290 & 0.233517 & 0.428762\\
-0.671531 & 0.671456 & -0.863160 & 0.106620 & 0.886037 & -0.699397\\
0.288921 & 0.476442 & 0.748567 & -1.045115 & 0.325747 & 0.282173
\end{bmatrix}
$$

Applying ReLU gives:

$$
U\approx
\begin{bmatrix}
0.347408 & 0.226488 & 0.940083 & 0 & 0.233517 & 0.428762\\
0 & 0.671456 & 0 & 0.106620 & 0.886037 & 0\\
0.288921 & 0.476442 & 0.748567 & 0 & 0.325747 & 0.282173
\end{bmatrix}
$$

Then:

$$
F=UW_2+b_2
$$

which gives:

$$
\boxed{
F\approx
\begin{bmatrix}
0.450428 & 0.303103 & -0.132725 & 0.301434\\
-0.291633 & 0.460288 & 0.639296 & -0.299379\\
0.288952 & 0.395095 & 0.054471 & 0.126209
\end{bmatrix}
}
$$

The rows differ because the token inputs differ, even though the same MLP parameters are used for all positions.

<div class="big-idea">

**Shared MLP parameters do not produce identical token outputs. They apply one learned transformation rule to different token representations.**

</div>

# The second residual connection

Like the attention sublayer, the MLP produces an update rather than replacing its input.

In our post-norm-style example:

$$
R_2=N+F
$$

Substituting the matrices gives:

$$
\boxed{
R_2\approx
\begin{bmatrix}
0.254873 & -0.260332 & 1.542164 & -0.614464\\
-1.434793 & 1.864356 & -0.077489 & 0.156498\\
0.222272 & 0.078855 & 1.628321 & -1.064721
\end{bmatrix}
}
$$

For SAT:

$$
\begin{aligned}
r_{2,\text{sat}}
&=n_{\text{sat}}+f_{\text{sat}}\\
&=
\begin{bmatrix}
-0.066680 & -0.316240 & 1.573850 & -1.190930
\end{bmatrix}\\
&\quad+
\begin{bmatrix}
0.288952 & 0.395095 & 0.054471 & 0.126209
\end{bmatrix}\\
&=
\begin{bmatrix}
0.222272 & 0.078855 & 1.628321 & -1.064721
\end{bmatrix}
\end{aligned}
$$

<!-- design-pattern-01:chapter-08:start -->
<div class="translation">

## Pattern Trail — Residual Connection

The MLP repeats the standard residual pattern introduced in Chapter 7:

$$
\text{new state}=\text{current state}+\text{learned update}
$$

Attention writes a contextual update into the residual stream. The MLP writes a position-wise feature update into that same stream. Different branches perform different computations, but both **learn an update and keep the state**.

</div>
<!-- design-pattern-01:chapter-08:end -->

# The second normalisation

Applying LayerNorm row by row, again using identity \(\gamma\) and \(eta\) for the arithmetic, gives the block output:

$$
O=\operatorname{LayerNorm}(R_2)
$$

$$
\boxed{
O\approx
\begin{bmatrix}
0.029725 & -0.600171 & 1.603583 & -1.033137\\
-1.331984 & 1.481456 & -0.174505 & 0.025033\\
0.006373 & -0.143686 & 1.477529 & -1.340215
\end{bmatrix}
}
$$

This is the output of our simplified complete Transformer block.

It still contains:

- one row per token position;
- four features per position.

Therefore:

$$
O\in\mathbb{R}^{3\times4}
$$

# Follow every MLP shape

The input has shape:

$$
N\in\mathbb{R}^{n\times d_{\text{model}}}
$$

The first projection uses:

$$
W_1\in\mathbb{R}^{d_{\text{model}}\times d_{\text{ff}}}
$$

Therefore:

$$
P=NW_1+b_1
\in
\mathbb{R}^{n\times d_{\text{ff}}}
$$

The activation preserves the shape:

$$
U\in\mathbb{R}^{n\times d_{\text{ff}}}
$$

The second projection uses:

$$
W_2\in\mathbb{R}^{d_{\text{ff}}\times d_{\text{model}}}
$$

Therefore:

$$
F=UW_2+b_2
\in
\mathbb{R}^{n\times d_{\text{model}}}
$$

The residual addition is valid:

$$
N+F
$$

because both matrices have shape:

$$
n\times d_{\text{model}}
$$

For our example:

$$
(3\times4)(4\times6)=3\times6
$$

followed by:

$$
(3\times6)(6\times4)=3\times4
$$

# Why the MLP often contains many parameters

Ignoring biases, the two matrices contain:

$$
d_{\text{model}}d_{\text{ff}}
+
d_{\text{ff}}d_{\text{model}}
=
2d_{\text{model}}d_{\text{ff}}
$$

parameters in this simple two-matrix design.

When \(d_{\text{ff}}\) is several times \(d_{\text{model}}\), the MLP can contain a large fraction of a Transformer block's parameters.

This is easy to overlook because attention receives much of the conceptual attention, while the feed-forward network performs substantial learned feature computation at every position.

# Modern activations and gated MLPs

Our worked example used ReLU because it is easy to calculate by hand.

Modern LLMs commonly use smoother activations or gated structures.

## GELU

A GELU activation approximately weights an input according to how likely it is to be positive under a Gaussian view. It behaves like a smooth gate rather than ReLU's hard cutoff.

A common approximation is:

$$
\operatorname{GELU}(x)
\approx
\frac{x}{2}
\left[
1+
\tanh
\left(
\sqrt{\frac{2}{\pi}}
\left(x+0.044715x^3\right)
\right)
\right]
$$

## SiLU

SiLU, also called the swish activation, is:

$$
\operatorname{SiLU}(x)=x\sigma(x)
$$

where:

$$
\sigma(x)=\frac{1}{1+e^{-x}}
$$

## Gated MLPs

A gated structure creates two projections and multiplies them element by element.

A simplified gated form is:

$$
G=\phi(NW_g)\odot(NW_u)
$$

followed by:

$$
F=GW_d
$$

SwiGLU uses a SiLU-like gate:

$$
\operatorname{SwiGLU}(x)
=
\operatorname{SiLU}(xW_g)\odot(xW_u)
$$

and then applies a down projection.

The exact matrices and widths vary by architecture, but the conceptual purpose remains:

> build a rich non-linear transformation inside each token position.

<div class="warning">

## Do not treat ReLU as the universal LLM activation

ReLU is used only for our transparent numerical example. Always inspect the target architecture before reproducing its MLP.

</div>

# The complete simplified Transformer block

We can now follow one block from input to output.

## 1. Create per-head projections

For each head \(r\):

$$
Q_r=XW_r^Q
$$

$$
K_r=XW_r^K
$$

$$
V_r=XW_r^V
$$

## 2. Calculate each head's attention output

$$
Z_r
=
\operatorname{softmax}
\left(
\frac{Q_rK_r^T}{\sqrt{d_k}}+M
\right)V_r
$$

## 3. Concatenate the heads

$$
H=\operatorname{Concat}(Z_1,\ldots,Z_h)
$$

## 4. Mix the head features

$$
Y=HW^O
$$

## 5. Complete the attention residual path

In our post-norm example:

$$
N=\operatorname{LayerNorm}(X+Y)
$$

## 6. Run the position-wise MLP

$$
F=\phi(NW_1+b_1)W_2+b_2
$$

## 7. Complete the MLP residual path

$$
O=\operatorname{LayerNorm}(N+F)
$$

Combining the two sublayers conceptually:

```text
input token states
        |
        v
multi-head causal self-attention
        |
        v
output projection
        |
        +<---- residual input
        |
        v
normalisation
        |
        v
position-wise MLP
        |
        +<---- residual input to MLP
        |
        v
normalisation
        |
        v
block output
```

# What changes and what stays fixed through the block?

The number of token positions stays fixed:

$$
n=3
$$

The model width at the block boundary stays fixed:

$$
d_{\text{model}}=4
$$

Internally:

- each attention head temporarily uses width \(d_k\) and \(d_v\);
- concatenation restores \(hd_v\);
- \(W^O\) returns to \(d_{\text{model}}\);
- the MLP temporarily expands to \(d_{\text{ff}}\);
- the down projection returns to \(d_{\text{model}}\).

This repeated return to the model width allows many blocks to be stacked.

# What the block output means

The output row for SAT is:

$$
o_{\text{sat}}
\approx
\begin{bmatrix}
0.006373 & -0.143686 & 1.477529 & -1.340215
\end{bmatrix}
$$

It is not a probability distribution and does not directly spell out a word.

It is SAT's updated hidden state after:

- causal information retrieval from visible tokens;
- two attention heads;
- head mixing;
- residual preservation;
- non-linear position-wise processing;
- normalisation.

A later Transformer block can use this row as its next-layer input.

# Pre-norm form of the complete block

Many modern LLMs use a pre-norm layout. A simplified version is:

$$
R=X+\operatorname{MHA}(\operatorname{Norm}_1(X))
$$

$$
O=R+\operatorname{MLP}(\operatorname{Norm}_2(R))
$$

The residual stream is not normalised after every addition in the same way as our post-norm arithmetic.

The chapter's core distinctions still hold:

- attention mixes across positions;
- the MLP transforms within positions;
- both sublayers contribute residual updates;
- normalisation is placed according to the architecture.

# Common MLP and block mistakes

## Mistake 1: saying the MLP attends to tokens

The standard position-wise MLP does not calculate cross-token attention. It processes each row independently.

## Mistake 2: using different MLP weights for every position

The same learned MLP parameters are shared across token positions within the layer.

## Mistake 3: removing the activation

Without a non-linearity or gating operation, the two linear layers can collapse into one linear transformation.

## Mistake 4: forgetting the biases

Some architectures use biases and some omit them. A faithful implementation must follow the target model.

## Mistake 5: assuming \(d_{\text{ff}}=d_{\text{model}}\)

The MLP commonly expands to a larger intermediate width.

## Mistake 6: adding the MLP output to the wrong tensor

The residual connection adds the MLP update to the representation that entered that MLP sublayer.

## Mistake 7: treating the block output as logits

The block output is still a hidden representation. Many additional blocks and a final output head may remain.

## Mistake 8: assuming every model uses the same block order

Pre-norm, post-norm, LayerNorm, RMSNorm, GELU, SiLU, and gated MLP choices differ across architectures.

# Checkpoint

<div class="exercise">

## 1. What is the primary difference between attention and the MLP?

Attention mixes information across token positions. The MLP transforms features independently within each position.

## 2. Are the MLP parameters shared across token positions?

Yes. Every row uses the same \(W_1\), \(b_1\), \(W_2\), and \(b_2\) for that layer.

## 3. Why include a non-linear activation?

Without it, the two linear layers could be combined into one linear transformation, greatly limiting the network's expressive power.

## 4. What is the intermediate shape in our example?

$$
U\in\mathbb{R}^{3\times6}
$$

## 5. What is the final MLP output shape?

$$
F\in\mathbb{R}^{3\times4}
$$

## 6. Why does the second projection return to four coordinates?

It must return to the model width so the residual addition and the next Transformer block remain shape-compatible.

## 7. Does a zero ReLU coordinate mean the corresponding learned feature is permanently unused?

No. It is zero for that token on that forward pass. Other tokens or contexts can activate it.

## 8. Is ReLU the standard activation in every modern LLM?

No. GELU, SiLU, and gated variants such as SwiGLU are common.

## 9. What are the two residual updates in the simplified block?

One comes from multi-head attention, and the other comes from the position-wise MLP.

## 10. Can the output of this block become the input to another block?

Yes. Stacking such blocks is how a Transformer builds progressively richer hidden states.

</div>

# Chapter takeaway

Attention performs cross-token retrieval:

$$
\operatorname{MHA}(X)
$$

The MLP performs position-wise non-linear feature transformation:

$$
\operatorname{FFN}(n)
=
\phi(nW_1+b_1)W_2+b_2
$$

Both contribute residual updates.

Our complete post-norm-style block is:

$$
N=
\operatorname{LayerNorm}
\left(
X+
\operatorname{Concat}(Z_1,\ldots,Z_h)W^O
\right)
$$

$$
O=
\operatorname{LayerNorm}
\left(
N+
\phi(NW_1+b_1)W_2+b_2
\right)
$$

For our running example:

$$
O\approx
\begin{bmatrix}
0.029725 & -0.600171 & 1.603583 & -1.033137\\
-1.331984 & 1.481456 & -0.174505 & 0.025033\\
0.006373 & -0.143686 & 1.477529 & -1.340215
\end{bmatrix}
$$

In our story:

> **Attention is the group meeting. The MLP is private thinking. Residual connections preserve the evolving case file while each sublayer adds what it has learned.**

# Coming next: stack the blocks and predict a token

We have completed one Transformer block, but an LLM normally contains many such blocks.

The next stage of the book can follow:

- how hidden states evolve through a stack of layers;
- how the final position is converted into vocabulary logits;
- how softmax creates next-token probabilities;
- how greedy decoding, sampling, temperature, top-k, and top-p choose the next token.

The reader now has all the machinery needed to connect attention mechanics to actual text generation.