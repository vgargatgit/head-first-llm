---
title: "Chapter 3 — Meet the Profile Writer"
subtitle: "How a token turns its current state into a searchable Key"
lang: en
---

![Chapter 3 — Meet the Profile Writer](../assets/chapter-03/01-chapter-3-meet-the-profile-writer.svg){.hero}

# The question this chapter answers

In Chapter 2, `SAT` visited the Question Coach and created a Query:

$$
q_{\text{sat}} = x_{\text{sat}}W^Q
$$

That Query expresses what `SAT` is looking for inside one attention head.

But a search request is useful only if the possible matches have searchable descriptions.

How does every token turn its current hidden state into a representation that a Query can match against?

That is the job of the **Key projection**:

$$
W^K
$$

In our dating-service story, it is the **Profile Writer**.

<div class="big-idea">

**A Query represents what a token is seeking. A Key represents how a token should appear to searches inside the same attention head.**

</div>

# Cold open: SAT visits the Profile Writer

`SAT` enters the Profile Writing Office carrying the same current hidden state it brought to the Question Coach:

$$
x_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

The Profile Writer says:

> “I will not decide who should match you. I will turn your current state into a profile that Queries can search.”

The completed profile is SAT's **Key**:

$$
k_{\text{sat}}
$$

The Key is not a biography written in English. It is a vector in the learned Key space of one attention head.

In the story:

- `SAT` is the client;
- $x_{\text{sat}}$ is its current situation;
- $W^K$ is the Profile Writer;
- $k_{\text{sat}}$ is the searchable profile.

# What the Profile Writer actually does

For any token position $t$:

$$
k_t = x_tW^K
$$

Read that from left to right:

```text
token's current hidden state
            ×
the head's learned Profile Writer
            =
the token's searchable Key
```

![The Profile Writer transforms a hidden state into a Key](../assets/chapter-03/02-the-profile-writer-transforms-a-hidden-state-into-a-key.svg)

The Profile Writer **does**:

- read one token's current hidden state;
- apply a learned linear transformation;
- produce a Key vector for one attention head.

It does **not yet**:

- inspect a Query;
- compare two tokens;
- calculate a compatibility score;
- assign attention weights;
- provide the information that will eventually be retrieved.

Those are later stages of attention.

<div class="warning">

## Analogy warning

Calling a Key a “profile” does not mean it stores a human-readable list of attributes. It is a learned vector whose purpose is to participate in Query–Key comparisons.

</div>

# Remove the costumes

| Dating-service story | Transformer operation |
|---|---|
| Token's current situation | Hidden state $x_t$ |
| Profile Writer | Key projection $W^K$ |
| Profile-writing session | Matrix multiplication |
| Searchable profile card | Key vector $k_t$ |
| “When should a search match me?” | A position in the head's learned Key space |

The compact operation is:

$$
k_t=x_tW^K
$$

# The exact SAT calculation

We use the same four-dimensional SAT state:

$$
x_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

For this attention head, suppose the learned Key projection is:

$$
W^K
=
\begin{bmatrix}
0.2 & 0.7\\
-0.6 & 0.1\\
0.5 & -0.3\\
0.4 & 0.8
\end{bmatrix}
$$

The matrix shape is:

$$
W^K\in\mathbb{R}^{4\times2}
$$

The Key calculation is:

$$
k_{\text{sat}}
=
x_{\text{sat}}W^K
$$

or, with the values substituted:

$$
k_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
\begin{bmatrix}
0.2 & 0.7\\
-0.6 & 0.1\\
0.5 & -0.3\\
0.4 & 0.8
\end{bmatrix}
$$

![Exact calculation of SAT's Key](../assets/chapter-03/03-exact-calculation-of-sat-s-key.svg)

## First Key coordinate

The first output coordinate uses the first column of $W^K$:

$$
\begin{aligned}
k_1
&=
0.14(0.2)
+
(-0.22)(-0.6)
+
0.67(0.5)
+
(-0.31)(0.4)\\
&=
0.028
+
0.132
+
0.335
-
0.124\\
&=
0.371
\end{aligned}
$$

## Second Key coordinate

The second output coordinate uses the second column of $W^K$:

$$
\begin{aligned}
k_2
&=
0.14(0.7)
+
(-0.22)(0.1)
+
0.67(-0.3)
+
(-0.31)(0.8)\\
&=
0.098
-
0.022
-
0.201
-
0.248\\
&=
-0.373
\end{aligned}
$$

Therefore:

$$
\boxed{
k_{\text{sat}}
=
\begin{bmatrix}
0.371 & -0.373
\end{bmatrix}
}
$$

# Follow the shapes

The current token state has shape:

$$
x_{\text{sat}}\in\mathbb{R}^{1\times4}
$$

The Key projection has shape:

$$
W^K\in\mathbb{R}^{4\times2}
$$

Therefore:

$$
(1\times4)(4\times2)=(1\times2)
$$

The inner dimensions match and disappear from the output shape. SAT receives one Key with two coordinates:

$$
k_{\text{sat}}\in\mathbb{R}^{1\times2}
$$

The Key and Query for a head must have the same width because they will eventually be compared using a dot product:

$$
q_i\cdot k_j
$$

In our example:

$$
d_k=2
$$

so both Query vectors and Key vectors contain two coordinates.

<div class="translation">

## Shape intuition

The hidden state lives in the shared model space of width $d_{\text{model}}$.

The Profile Writer projects it into this head's Key space of width $d_k$.

The Question Coach projects hidden states into the matching Query space, also of width $d_k$.

</div>

# One Profile Writer, many tokens

Within one attention head, the same $W^K$ is applied independently to every token position.

Our sequence matrix is:

$$
X=
\begin{bmatrix}
0.21 & -0.37 & 0.58 & -0.11\\
-0.42 & 0.73 & -0.15 & 0.36\\
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

The rows correspond to:

$$
X=
\begin{bmatrix}
x_{\text{The}}\\
x_{\text{cat}}\\
x_{\text{sat}}
\end{bmatrix}
$$

Instead of multiplying each row separately, we can transform the entire sequence:

$$
K=XW^K
$$

![The same Profile Writer creates a different Key for every token](../assets/chapter-03/04-the-same-profile-writer-creates-a-different-key-for-eve.svg)

Carrying out the multiplication gives:

$$
K=
\begin{bmatrix}
0.510 & -0.152\\
-0.453 & 0.112\\
0.371 & -0.373
\end{bmatrix}
$$

The rows are:

$$
k_{\text{The}}
=
\begin{bmatrix}
0.510 & -0.152
\end{bmatrix}
$$

$$
k_{\text{cat}}
=
\begin{bmatrix}
-0.453 & 0.112
\end{bmatrix}
$$

$$
k_{\text{sat}}
=
\begin{bmatrix}
0.371 & -0.373
\end{bmatrix}
$$

The complete Key matrix has shape:

$$
K\in\mathbb{R}^{3\times2}
$$

That means:

- three token positions;
- one two-dimensional Key per token.

<div class="big-idea">

**The Profile Writer is shared across token positions within the head. The profiles differ because the token states differ.**

</div>

# Why call $K$ a matrix?

For one token, we use a lowercase Key vector:

$$
k_t
$$

For the full sequence, we stack all Key vectors as rows:

$$
K=
\begin{bmatrix}
k_1\\
k_2\\
\vdots\\
k_n
\end{bmatrix}
$$

Therefore:

$$
K\in\mathbb{R}^{n\times d_k}
$$

Keep the three related symbols separate:

| Symbol | Meaning |
|---|---|
| $W^K$ | Learned Key projection |
| $k_t$ | Key vector for one token position |
| $K$ | Matrix containing all token Keys |

# Query and Key: same input, different jobs

Both transformations begin with the same current hidden state:

$$
x_t
$$

But they use different learned matrices:

$$
q_t=x_tW^Q
$$

$$
k_t=x_tW^K
$$

![Query and Key begin with the same state but serve different roles](../assets/chapter-03/05-query-and-key-begin-with-the-same-state-but-serve-diffe.svg)

The roles are deliberately asymmetric:

| Representation | Operational question |
|---|---|
| Query $q_t$ | “What information is this position looking for?” |
| Key $k_t$ | “When should this position match a search?” |

The two projections are usually different:

$$
W^Q\neq W^K
$$

Therefore, even for the same token state:

$$
q_t\neq k_t
$$

in general.

For SAT in our running example:

$$
q_{\text{sat}}
=
\begin{bmatrix}
-0.364 & 0.060
\end{bmatrix}
$$

while:

$$
k_{\text{sat}}
=
\begin{bmatrix}
0.371 & -0.373
\end{bmatrix}
$$

Same hidden state. Different transformations. Different roles.

# Why not use the hidden state directly?

Why create a Key instead of comparing hidden states directly?

For example, why not calculate:

$$
x_i\cdot x_j
$$

The hidden state is a general-purpose representation. It supports many parts of the network:

- attention;
- MLP computation;
- residual updates;
- later Transformer layers;
- final prediction.

An attention head needs specialised views of that shared state.

The Query projection can learn combinations useful for searching:

> “What should this position seek?”

The Key projection can learn combinations useful for being matched:

> “Under what search conditions should this position appear relevant?”

This gives the model more flexibility than forcing one representation to perform both roles.

# Keys do not contain the retrieved information

This distinction is crucial.

A Key helps determine **whether** a token is relevant.

It is not necessarily the information that should be transferred if the token is relevant.

That later payload is the **Value**:

$$
v_t=x_tW^V
$$

Using the dating-service analogy:

- **Query:** what the client seeks;
- **Key:** the searchable profile;
- **Value:** the information package provided after a match matters.

<div class="warning">

## Do not merge Key and Value in your mental model

The model compares Queries with Keys.

It does not compare Queries with Values.

Values are mixed only after the Query–Key comparisons have produced attention weights.

</div>

# A first preview of matching

SAT's Query from Chapter 2 is:

$$
q_{\text{sat}}
=
\begin{bmatrix}
-0.364 & 0.060
\end{bmatrix}
$$

The available Keys are:

$$
K=
\begin{bmatrix}
0.510 & -0.152\\
-0.453 & 0.112\\
0.371 & -0.373
\end{bmatrix}
$$

SAT can compare its Query with every Key:

$$
q_{\text{sat}}\cdot k_{\text{The}}
$$

$$
q_{\text{sat}}\cdot k_{\text{cat}}
$$

$$
q_{\text{sat}}\cdot k_{\text{sat}}
$$

The raw results are:

$$
\begin{aligned}
q_{\text{sat}}\cdot k_{\text{The}} &= -0.19476\\
q_{\text{sat}}\cdot k_{\text{cat}} &= 0.171612\\
q_{\text{sat}}\cdot k_{\text{sat}} &= -0.157424
\end{aligned}
$$

These are **raw compatibility scores**, not probabilities.

They have not yet been:

- scaled by $\sqrt{d_k}$;
- masked;
- passed through softmax.

We will do all three steps in the next chapter.

# From one Query to all Keys

For one Query row $q_i$, comparing against all Keys can be written:

$$
q_iK^T
$$

The transpose changes the Key matrix shape:

$$
K\in\mathbb{R}^{n\times d_k}
$$

into:

$$
K^T\in\mathbb{R}^{d_k\times n}
$$

Therefore:

$$
(1\times d_k)(d_k\times n)=(1\times n)
$$

One Query produces one score for every Key position.

For the entire sequence, all comparisons can be computed at once:

$$
QK^T
$$

The shapes are:

$$
(n\times d_k)(d_k\times n)=(n\times n)
$$

So the score matrix has:

- one row per querying token;
- one column per candidate Key.

This is the computational heart of self-attention.

# Different heads have different Profile Writers

In ordinary multi-head attention, every head conceptually has its own Key projection:

$$
W_1^K,\;
W_2^K,\;
\ldots,\;
W_h^K
$$

The same token state can therefore produce different Keys:

$$
k_t^{(1)}=x_tW_1^K
$$

$$
k_t^{(2)}=x_tW_2^K
$$

Each head learns its own matching space.

A token might be easy to match under one head's learned criteria and less relevant under another's.

The head roles are not manually assigned. Any apparent specialisation emerges during training and may not have a simple human description.

# How implementations compute all Keys efficiently

A software implementation often stores the per-head projections side by side:

$$
W_{\text{big}}^K=
\left[
W_1^K\mid W_2^K\mid\cdots\mid W_h^K
\right]
$$

Then it performs one large matrix multiplication:

$$
K_{\text{big}}=XW_{\text{big}}^K
$$

The result is reshaped into:

$$
(\text{tokens},\;\text{heads},\;d_k)
$$

This is an implementation convenience.

It does **not** mean that ordinary multi-head attention uses the same Key transformation for every head. Each head owns a different block of output columns.

<div class="translation">

## Standard and modern variants

In standard multi-head attention, each head has its own Query, Key, and Value projections.

Some modern architectures use **multi-query attention** or **grouped-query attention**, where several Query heads share Key and Value representations. We will revisit those variants after the standard mechanism is fully clear.

</div>

# What causal masking does to Keys

In a causal decoder, Keys can be computed for all positions in the current sequence tensor.

The causal rule is enforced during score processing:

- a Query may compare with its own position and earlier Keys;
- scores pointing to future positions are masked before softmax.

So the future Key vectors do not need to be “bad profiles.” Their scores are simply made unavailable to an earlier Query.

For the position `sat` in:

> The cat sat on the mat

the allowed Keys are:

> The, cat, sat

The Keys for:

> on, the, mat

are future positions and are masked for that Query.

# Reality check: a Key is contextual

A Key is created from the current hidden state:

$$
k_t=x_tW^K
$$

If the hidden state already contains contextual information from earlier layers, the Key is contextual too.

The Key for `bank` in:

> deposited money at the bank

can differ from the Key for `bank` in:

> sat beside the river bank

even though the token identity is the same.

This is why it is better to say:

> a Key represents one token occurrence at one layer

rather than:

> a Key represents a word in the dictionary.

# Brain check

<div class="exercise">

## 1. What does a Key represent?

A learned searchable representation of one token position inside one attention head.

## 2. Does the Profile Writer compare tokens?

No. It transforms each hidden state independently. Cross-token comparison begins with Query–Key dot products.

## 3. Why must Queries and Keys have the same width?

Because the model compares them using dot products. A Query and Key need the same number of coordinates.

## 4. Does $K$ contain one row for each head?

No. For one head, $K$ contains one row per token position. Multiple heads have separate Key matrices or separate slices of a packed tensor.

## 5. Is a Key the information that will be copied into the output?

Not necessarily. That payload role belongs to the Value.

## 6. Why do THE, CAT, and SAT receive different Keys when the same $W^K$ is used?

Because they enter the projection with different hidden-state vectors.

## 7. What is the shape of $K$ for three tokens and $d_k=2$?

$$
K\in\mathbb{R}^{3\times2}
$$

## 8. What is the shape of $QK^T$ for three tokens?

$$
QK^T\in\mathbb{R}^{3\times3}
$$

</div>

# Chapter takeaway

Every token begins with a current hidden state:

$$
x_t
$$

The Profile Writer transforms it:

$$
k_t=x_tW^K
$$

For the whole sequence:

$$
K=XW^K
$$

The resulting Key tells the attention head how that token should participate in matching.

In the dating-service story:

> **The Question Coach helps a token express what it seeks. The Profile Writer helps every token create a profile that those searches can match.**

![Queries are now ready to meet the available Keys](../assets/chapter-03/06-queries-are-now-ready-to-meet-the-available-keys.svg)

# Coming next: Query meets Key

We now have:

- a Query for every token;
- a Key for every token.

The next step is to calculate compatibility:

$$
\text{score}_{ij}=q_i\cdot k_j
$$

For the complete sequence:

$$
S=QK^T
$$

Then we will answer three questions:

1. Why divide the scores by $\sqrt{d_k}$?
2. How does causal masking remove forbidden future positions?
3. How does softmax turn raw scores into attention weights?

That is the job of Chapter 4:

# **Compatibility Scores — When Queries Meet Keys**
