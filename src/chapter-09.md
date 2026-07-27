---
title: "Chapter 9 — Every Token Needs an Address"
subtitle: "How Transformers represent order with positional embeddings and rotary position encodings"
lang: en
---

# The question this chapter answers

The previous chapters began with a matrix of token states:

$$
X=
\begin{bmatrix}
x_1\\
x_2\\
\vdots\\
x_n
\end{bmatrix}
$$

Each row belonged to one token position.

But a token embedding by itself identifies **what token it is**, not **where that token occurs**.

Without some representation of order, how can a Transformer distinguish:

> The cat chased the dog

from:

> The dog chased the cat

<div class="big-idea">

**Attention can compare token representations, but order must be supplied to the model. Positional mechanisms make the same token behave differently when it appears at different locations.**

</div>

# A deliberate rewind

Chapter 8 completed one Transformer block. This chapter steps backward for a moment to expose an assumption that was already built into our running matrix.

Before the first block, a decoder-only Transformer typically begins with token IDs and creates token embeddings:

$$
E=
\begin{bmatrix}
e_1\\
e_2\\
\vdots\\
e_n
\end{bmatrix}
$$

It must then make position available somehow.

Different architectures do this differently. Common approaches include:

- learned absolute positional embeddings;
- fixed sinusoidal position encodings;
- relative-position biases;
- rotary position embeddings, usually called **RoPE**.

The mechanism is architecture-specific, but the requirement is universal: the model needs information that distinguishes one ordering from another.

# Token embeddings alone do not know order

Suppose a model sees three token embeddings:

$$
E=
\begin{bmatrix}
e_{\text{The}}\\
e_{\text{cat}}\\
e_{\text{sat}}
\end{bmatrix}
$$

If we reorder the tokens, we reorder the rows:

$$
E'=
\begin{bmatrix}
e_{\text{sat}}\\
e_{\text{cat}}\\
e_{\text{The}}
\end{bmatrix}
$$

Self-attention without position information applies the same projections to every row and compares rows symmetrically.

If the input rows are permuted, the output rows are permuted in the same way. The mechanism can process a set of token vectors, but it has not been told which row is first, second, or third.

<div class="warning">

## Attention is not automatically order-aware

Causal masking tells a position which other positions are allowed, but it does not by itself give each token a rich representation of distance and order.

A model still needs a positional mechanism so that position 2 and position 20 are not represented identically.

</div>

# Approach 1: learned absolute positional embeddings

One direct solution is to learn one vector for each supported position.

For position \(t\), let:

$$
p_t\in\mathbb{R}^{d_{\text{model}}}
$$

The initial representation is:

$$
x_t^{(0)}=e_t+p_t
$$

For the whole sequence:

$$
X^{(0)}=E+P
$$

where:

$$
P=
\begin{bmatrix}
p_1\\
p_2\\
\vdots\\
p_n
\end{bmatrix}
$$

The addition is element by element.

The token embedding contributes identity. The positional embedding contributes location.

# Recovering our running input matrix

The first eight chapters used:

$$
X^{(0)}=
\begin{bmatrix}
0.21 & -0.37 & 0.58 & -0.11\\
-0.42 & 0.73 & -0.15 & 0.36\\
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

The rows belong to THE, CAT, and SAT.

We can now imagine that this matrix was produced by adding token embeddings and learned position embeddings.

Suppose the token-embedding matrix is:

$$
E=
\begin{bmatrix}
0.25 & -0.30 & 0.50 & -0.05\\
-0.35 & 0.60 & -0.10 & 0.28\\
0.10 & -0.15 & 0.62 & -0.26
\end{bmatrix}
$$

and the positional-embedding matrix is:

$$
P=
\begin{bmatrix}
-0.04 & -0.07 & 0.08 & -0.06\\
-0.07 & 0.13 & -0.05 & 0.08\\
0.04 & -0.07 & 0.05 & -0.05
\end{bmatrix}
$$

Then:

$$
X^{(0)}=E+P
$$

For CAT at position 2:

$$
\begin{aligned}
x_{\text{cat}}^{(0)}
&=e_{\text{cat}}+p_2\\
&=
\begin{bmatrix}
-0.35 & 0.60 & -0.10 & 0.28
\end{bmatrix}
+
\begin{bmatrix}
-0.07 & 0.13 & -0.05 & 0.08
\end{bmatrix}\\
&=
\begin{bmatrix}
-0.42 & 0.73 & -0.15 & 0.36
\end{bmatrix}
\end{aligned}
$$

That is exactly the CAT row used in the earlier calculations.

# The same token at a different position

The token embedding for CAT remains:

$$
e_{\text{cat}}=
\begin{bmatrix}
-0.35 & 0.60 & -0.10 & 0.28
\end{bmatrix}
$$

Suppose position 5 has:

$$
p_5=
\begin{bmatrix}
0.09 & 0.02 & -0.11 & 0.06
\end{bmatrix}
$$

Then CAT at position 5 begins with:

$$
\begin{aligned}
x_{\text{cat at }5}^{(0)}
&=e_{\text{cat}}+p_5\\
&=
\begin{bmatrix}
-0.26 & 0.62 & -0.21 & 0.34
\end{bmatrix}
\end{aligned}
$$

Therefore:

$$
x_{\text{cat at }2}^{(0)}
\neq
x_{\text{cat at }5}^{(0)}
$$

The token identity is the same. Its initial state differs because its address differs.

# Follow the additive shapes

For \(n\) token positions:

$$
E\in\mathbb{R}^{n\times d_{\text{model}}}
$$

$$
P\in\mathbb{R}^{n\times d_{\text{model}}}
$$

Therefore:

$$
X^{(0)}=E+P
\in\mathbb{R}^{n\times d_{\text{model}}}
$$

The operation does not change the sequence length or model width.

It enriches every row with position-dependent information.

# Strengths and limits of learned absolute positions

Learned absolute positional embeddings are simple:

- look up one token vector;
- look up one positional vector;
- add them.

They also have an important limitation.

If the model learned vectors only for positions:

$$
1,2,\ldots,N
$$

there is no automatically learned vector for position \(N+1\).

Architectures can extend, interpolate, or otherwise modify positional systems, but a table of learned absolute positions is naturally tied to the positions represented during training.

# Approach 2: sinusoidal position encodings

The original Transformer used fixed sine and cosine functions rather than a learned vector table.

For position \(p\) and feature-pair index \(i\):

$$
\operatorname{PE}(p,2i)
=
\sin\left(
\frac{p}{10000^{2i/d_{\text{model}}}}
\right)
$$

$$
\operatorname{PE}(p,2i+1)
=
\cos\left(
\frac{p}{10000^{2i/d_{\text{model}}}}
\right)
$$

Different coordinate pairs use different frequencies.

Some coordinates change rapidly with position. Others change slowly.

The resulting vector is added to the token embedding:

$$
x_t^{(0)}=e_t+\operatorname{PE}(t)
$$

The model can learn to use combinations of these periodic signals when reasoning about position and distance.

<div class="translation">

## Frequency intuition

Think of several clock hands turning at different speeds.

One hand changes quickly and helps distinguish nearby positions. Another changes slowly and provides information over a longer range.

The complete pattern acts like a structured positional signature.

</div>

# Absolute position is not the whole story

During attention, a Query at position \(i\) compares with a Key at position \(j\):

$$
q_i\cdot k_j
$$

Many useful relationships depend not only on the two absolute positions, but also on their separation:

$$
i-j
$$

Examples include:

- the immediately preceding token;
- the token five places earlier;
- the beginning of a nearby phrase;
- a repeated pattern at a particular distance.

This motivates positional methods that influence Query–Key compatibility through **relative position**.

# Approach 3: rotary position embeddings

RoPE does not normally add a position vector to the hidden state.

Instead, it rotates pairs of Query and Key coordinates by position-dependent angles.

Begin with:

$$
q_t=x_tW^Q
$$

and:

$$
k_t=x_tW^K
$$

RoPE transforms them into rotated versions:

$$
\widetilde{q}_t=R_tq_t
$$

$$
\widetilde{k}_t=R_tk_t
$$

The attention score is then calculated from:

$$
\widetilde{q}_i\cdot\widetilde{k}_j
$$

The rotation makes the score depend on the relative separation between positions.

# A two-dimensional rotation

For one coordinate pair, rotation by angle \(\phi\) uses:

$$
R(\phi)=
\begin{bmatrix}
\cos\phi & -\sin\phi\\
\sin\phi & \cos\phi
\end{bmatrix}
$$

At position \(m\), a frequency parameter \(	heta\) gives angle:

$$
m\theta
$$

For a two-coordinate Query:

$$
q=
\begin{bmatrix}
q_1\\q_2
\end{bmatrix}
$$

its rotated form is:

$$
\widetilde{q}_m=R(m\theta)q
$$

A Key at position \(n\) is rotated using:

$$
\widetilde{k}_n=R(n\theta)k
$$

# Exact RoPE calculation

Use:

$$
q=
\begin{bmatrix}
0.8\\0.6
\end{bmatrix}
$$

and:

$$
k=
\begin{bmatrix}
0.5\\-0.4
\end{bmatrix}
$$

Let:

$$
\theta=30^\circ
$$

Place the Query at position:

$$
m=1
$$

and the Key at position:

$$
n=3
$$

The Query rotates by \(30^\circ\):

$$
\widetilde{q}_1
=
R(30^\circ)q
\approx
\begin{bmatrix}
0.392820\\0.919615
\end{bmatrix}
$$

The Key rotates by \(90^\circ\):

$$
\widetilde{k}_3
=
R(90^\circ)k
=
\begin{bmatrix}
0.4\\0.5
\end{bmatrix}
$$

Their dot product is:

$$
\begin{aligned}
\widetilde{q}_1\cdot\widetilde{k}_3
&=0.392820(0.4)+0.919615(0.5)\\
&\approx0.157128+0.459808\\
&\approx0.616936
\end{aligned}
$$

# Shift both positions together

Now move both vectors one position later:

$$
m=2,\qquad n=4
$$

The separation remains:

$$
n-m=2
$$

The new rotated vectors are approximately:

$$
\widetilde{q}_2
=
\begin{bmatrix}
-0.119615\\0.992820
\end{bmatrix}
$$

and:

$$
\widetilde{k}_4
=
\begin{bmatrix}
0.096410\\0.633013
\end{bmatrix}
$$

Their dot product is again:

$$
\widetilde{q}_2\cdot\widetilde{k}_4
\approx0.616936
$$

The absolute positions changed, but the relative separation did not.

For this coordinate pair, the compatibility contribution is preserved under a shared shift.

# Change the relative separation

Return the Query to position 1, but place the Key at position 2:

$$
n-m=1
$$

The resulting dot product becomes approximately:

$$
\widetilde{q}_1\cdot\widetilde{k}_2
\approx0.448564
$$

Changing the relative distance changed the compatibility.

<div class="big-idea">

**RoPE injects position into Query–Key geometry. A shared shift of both positions preserves their relative separation, while changing the separation changes the rotated dot product.**

</div>

# Why the relative-distance property appears

Rotation matrices satisfy:

$$
R(a)^TR(b)=R(b-a)
$$

Therefore:

$$
\begin{aligned}
\widetilde{q}_m^T\widetilde{k}_n
&=(R(m\theta)q)^T(R(n\theta)k)\\
&=q^TR(m\theta)^TR(n\theta)k\\
&=q^TR((n-m)\theta)k
\end{aligned}
$$

The score depends on:

$$
n-m
$$

rather than requiring the attention mechanism to reconstruct relative distance only from two separately added absolute vectors.

# Real RoPE uses many coordinate pairs

A real head contains more than two coordinates.

RoPE divides Query and Key dimensions into pairs:

$$
(q_1,q_2),
(q_3,q_4),
\ldots
$$

Each pair rotates at a different frequency.

The complete rotation therefore encodes relative position at several scales.

Fast-changing pairs are sensitive to small positional differences. Slow-changing pairs vary over longer ranges.

# Why Values are normally not rotated

In the standard RoPE formulation:

- Queries are rotated;
- Keys are rotated;
- Values are not rotated.

RoPE is used to alter the matching geometry:

$$
\widetilde{Q}\widetilde{K}^T
$$

Values remain the payload mixed after the weights are known:

$$
Z=AV
$$

<div class="warning">

## Position affects retrieval without becoming the payload

Rotating Queries and Keys changes which positions match strongly.

The Value vector does not need the same rotation because it is not used in the compatibility dot product.

Architectures can differ, but this is the standard RoPE mental model.

</div>

# RoPE and causal masking solve different problems

RoPE answers:

> How should position and relative distance influence Query–Key compatibility?

The causal mask answers:

> Which Key positions is this Query allowed to use?

Both can operate in the same attention head:

$$
A=
\operatorname{softmax}
\left(
\frac{\widetilde{Q}\widetilde{K}^T}{\sqrt{d_k}}+M
\right)
$$

A future position can have a perfectly valid rotated Key and still be blocked by the causal mask.

# Relative-position bias: another design

Some architectures add a learned or computed bias directly to each attention logit:

$$
L_{ij}
=
\frac{q_i\cdot k_j}{\sqrt{d_k}}
+b(i,j)
$$

The bias can depend on:

- exact relative distance;
- a bucketed distance range;
- direction;
- other position-related rules.

This is different from RoPE.

RoPE changes the Query and Key vectors before their dot product. Relative-position bias adds a term after the dot product.

# Position methods compared

| Method | Where position enters | Learned? | Main intuition |
|---|---|---:|---|
| Learned absolute embedding | Added to token embedding | Yes | Each position owns a vector |
| Sinusoidal encoding | Added to token embedding | No | Multiple fixed positional frequencies |
| RoPE | Rotates Query and Key pairs | Usually fixed formula, sometimes modified | Relative distance affects dot products |
| Relative-position bias | Added to attention logits | Often | Distance directly adjusts compatibility |

No single row describes every modern implementation. Always inspect the target architecture.

# Position and context length

A model's advertised context length is not determined by one factor alone.

It depends on choices such as:

- the positional mechanism;
- the positions and lengths used during training;
- attention implementation;
- memory limits;
- architecture-specific scaling or interpolation methods.

A formula that can be evaluated at a larger position does not guarantee that the model will reason reliably there.

<div class="warning">

## Extrapolation is not automatic competence

RoPE can mathematically rotate a Query at a position beyond the training range.

That does not prove the model learned to use such positions well. Long-context behaviour must be established by training design and evaluation, not by the existence of a computable angle alone.

</div>

# Positional information becomes contextual

Position enters early, but it does not remain a separate label attached to the token.

After the first block, the hidden state has been transformed by:

- positional effects on attention;
- retrieved Values;
- output projection;
- residual updates;
- MLP processing.

Later layers create new Queries, Keys, and Values from these already contextual representations.

Thus, the model can build increasingly complex combinations of:

- token identity;
- absolute location;
- relative distance;
- surrounding context.

# Common positional mistakes

## Mistake 1: saying attention already knows sequence order

Attention compares vectors. Position must be represented or imposed by an additional mechanism.

## Mistake 2: confusing causal order with positional representation

The causal mask blocks future access. It does not replace positional embeddings or RoPE.

## Mistake 3: treating position as one extra integer feature

Production positional mechanisms usually distribute position information across many coordinates or attention scores.

## Mistake 4: saying RoPE rotates token IDs

RoPE normally rotates Query and Key coordinate pairs after projection.

## Mistake 5: rotating Values in the standard explanation

Standard RoPE affects Query–Key matching. Values remain the information payload.

## Mistake 6: claiming one coordinate stores the position number

Positional information is distributed across vector coordinates and frequencies.

## Mistake 7: claiming any computable position is reliable

Generalisation beyond trained context lengths is an empirical model property, not a guarantee from the formula.

# Checkpoint

<div class="exercise">

## 1. Why are token embeddings alone insufficient for sequence modelling?

They represent token identity but do not inherently distinguish the token's location or ordering.

## 2. What is the additive absolute-position formula?

$$
x_t^{(0)}=e_t+p_t
$$

## 3. Does adding a positional embedding change the model width?

No. The token and position vectors have the same width and are added element by element.

## 4. What does RoPE normally transform?

Pairs of Query and Key coordinates.

## 5. Why is relative position visible in a rotated dot product?

Because:

$$
R(m\theta)^TR(n\theta)=R((n-m)\theta)
$$

## 6. Are Values normally rotated in standard RoPE?

No. Values are mixed after Query–Key compatibility produces attention weights.

## 7. Does RoPE remove the need for causal masking?

No. Position representation and visibility constraints are separate concerns.

## 8. Does a model necessarily work well beyond its training context because its position formula can be extended?

No. Reliable long-context behaviour depends on training, architecture, scaling methods, and evaluation.

</div>

# Chapter takeaway

A token embedding answers:

> What token is this?

A positional mechanism helps answer:

> Where is this token, and how far is it from another position?

With additive positional embeddings:

$$
X^{(0)}=E+P
$$

With RoPE:

$$
\widetilde{Q}=R(Q)
$$

$$
\widetilde{K}=R(K)
$$

and attention uses:

$$
A=
\operatorname{softmax}
\left(
\frac{\widetilde{Q}\widetilde{K}^T}{\sqrt{d_k}}+M
\right)
$$

In our story:

> **The token embedding gives each character an identity. The positional mechanism gives each character an address. Attention can then reason about both who is present and where everyone stands.**

# Coming next: the residual stream climbs the stack

One Transformer block produces another matrix with the same outer shape:

$$
X^{(1)}\in\mathbb{R}^{n\times d_{\text{model}}}
$$

That matrix can enter another block, and then another:

$$
X^{(0)}
\rightarrow
X^{(1)}
\rightarrow
\cdots
\rightarrow
X^{(L)}
$$

Chapter 10 follows token representations through depth and shows why every layer owns its own attention, MLP, normalisation, and KV-cache state.