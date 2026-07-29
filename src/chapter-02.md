---
title: "Chapter 2 — Meet the Question Coach"
subtitle: "How a token turns its current state into what it should look for"
lang: en
---

![Chapter 2 — Meet the Question Coach](chapter_2_graphics/01_chapter_hero.png){.hero}

# The question this chapter answers

At the beginning of an attention operation, every token already has a current hidden state.

For `SAT`, our running example is:

$$
x_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

But a hidden state is not yet a search request.

How does `SAT` turn:

> “This is what I currently know”

into:

> “This is the kind of information I should look for”?

That transformation is the job of the **Query Matrix**:

$$
W^Q
$$

In our dating-service story, it is the **Question Coach**.

<div class="big-idea">

**The token supplies its current state. The Question Coach transforms that state into a head-specific query vector.**

</div>

# Cold open: SAT visits the Question Coach

`SAT` arrives carrying its current hidden state:

$$
x_{\text{sat}}
\in
\mathbb{R}^{1 \times 4}
$$

The Question Coach says:

> “Tell me what you currently know. I will help turn that into what you should look for.”

The result of the coaching session is a new vector:

$$
q_{\text{sat}}
$$

The query is not a sentence in English. It is a learned numerical representation of SAT's **search intent inside one attention head**.

In the story:

- `SAT` is the client;
- its hidden state is its current situation;
- the Question Coach is the learned matrix $W^Q$;
- the finished preference card is the query vector $q_{\text{sat}}$.

# What the Question Coach actually does

The core operation is:

$$
q_{\text{sat}}
=
x_{\text{sat}} W^Q
$$

Read it from left to right:

```text
SAT's current state
        ×
the head's learned Question Coach
        =
SAT's query for this head
```

![The Question Coach pipeline](chapter_2_graphics/02_question_coach_story.png)

The Question Coach has a very specific job.

It **does**:

- read the token's current hidden state;
- apply a learned linear transformation;
- produce a query vector for this attention head.

It does **not yet**:

- inspect other tokens;
- compare SAT with candidates;
- decide which token is important;
- retrieve information;
- calculate attention weights.

Those later steps require Keys, compatibility scores, softmax, and Values.

<div class="warning">

## A useful correction to the analogy

The Question Coach does not personally know every token and does not choose SAT's matches.

It uses one learned transformation for every token inside this attention head. It only helps each token express a search request.

</div>

# Remove the costumes

| Dating-service story | Transformer operation |
|---|---|
| SAT's current situation | Hidden state $x_{sat}$ |
| Question Coach | Query projection $W^{Q}$ |
| Coaching session | Matrix multiplication |
| Search-preference card | Query vector $q_{sat}$ |
| “What am I looking for?” | A position in the head's learned matching space |

The compact mathematical form is:

$$
q_t = x_t W^Q
$$

for any token position $t$.

# The exact size-4 calculation

We will use the same four-dimensional current hidden state for SAT from Chapter 1:

$$
x_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

For this attention head, suppose the learned Question Coach is:

$$
W^Q
=
\begin{bmatrix}
0.8 & -0.2 \\
0.1 & 0.7 \\
-0.4 & 0.5 \\
0.6 & 0.3
\end{bmatrix}
$$

Its shape is:

$$
W^Q
\in
\mathbb{R}^{4 \times 2}
$$

The multiplication is:

$$
q_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
\begin{bmatrix}
0.8 & -0.2 \\
0.1 & 0.7 \\
-0.4 & 0.5 \\
0.6 & 0.3
\end{bmatrix}
$$

The result has two coordinates:

$$
q_{\text{sat}}
=
\begin{bmatrix}
q_1 & q_2
\end{bmatrix}
$$

![Exact query calculation](chapter_2_graphics/03_exact_query_calculation.png)

## First query coordinate

The first output coordinate uses the first column of $W^Q$:

$$
\begin{aligned}
q_1
&=
0.14(0.8)
+
(-0.22)(0.1)
+
0.67(-0.4)
+
(-0.31)(0.6) \\
&=
0.112
-
0.022
-
0.268
-
0.186 \\
&=
-0.364
\end{aligned}
$$

## Second query coordinate

The second output coordinate uses the second column of $W^Q$:

$$
\begin{aligned}
q_2
&=
0.14(-0.2)
+
(-0.22)(0.7)
+
0.67(0.5)
+
(-0.31)(0.3) \\
&=
-0.028
-
0.154
+
0.335
-
0.093 \\
&=
0.060
\end{aligned}
$$

Therefore:

$$
\boxed{
q_{\text{sat}}
=
\begin{bmatrix}
-0.364 & 0.060
\end{bmatrix}
}
$$

# Follow the shapes

The hidden state has shape:

$$
x_{\text{sat}}
\in
\mathbb{R}^{1 \times 4}
$$

The Question Coach has shape:

$$
W^Q
\in
\mathbb{R}^{4 \times 2}
$$

Therefore:

$$
(1 \times 4)(4 \times 2)
=
(1 \times 2)
$$

The inner dimensions match:

$$
4 = 4
$$

and disappear from the output shape.

The remaining dimensions tell us that one token now has a two-dimensional query for this head:

$$
q_{\text{sat}}
\in
\mathbb{R}^{1 \times 2}
$$

<div class="translation">

## Shape intuition

The token state lives in the shared four-dimensional model space.

The Question Coach projects it into this head's smaller two-dimensional **query space**.

The head will compare queries and keys inside that smaller space.

</div>

# What does the query vector mean?

We obtained:

$$
q_{\text{sat}}
=
\begin{bmatrix}
-0.364 & 0.060
\end{bmatrix}
$$

It is tempting to say:

```text
−0.364 means “find a subject”
0.060 means “look nearby”
```

That would be too literal.

The two coordinates do not come with human-assigned labels.

A more accurate interpretation is:

> This vector places SAT at a particular point in the learned query space of this attention head.

The query becomes meaningful operationally when it is compared with Key vectors:

$$
q_{\text{sat}} \cdot k_j
$$

That comparison answers:

> “How well does SAT's search request match token $j$'s searchable profile?”

Until Keys exist, the query is an unfinished request.

# Why transform the hidden state at all?

Why not compare token hidden states directly?

For example, why not compare:

$$
x_{\text{sat}} \cdot x_{\text{cat}}
$$

instead of creating queries and keys?

Because the token's hidden state serves many purposes at once. It contains information needed by:

- attention;
- later MLP computation;
- residual connections;
- later Transformer layers;
- the final prediction process.

The attention head needs a specialised view of that state.

The Query Matrix can learn:

> “Which combinations of the current hidden-state coordinates are useful when this token is searching?”

Later, the Key Matrix will learn a different view:

> “Which combinations are useful when this token is being searched?”

So the same hidden state can play different roles:

$$
x_t W^Q
\neq
x_t W^K
$$

in general.

# One coach, many clients

Within one attention head, the same Question Coach is applied to every token.

For our three-token sequence:

$$
X
=
\begin{bmatrix}
x_{\text{The}} \\
x_{\text{cat}} \\
x_{\text{sat}}
\end{bmatrix}
$$

the complete query matrix is:

$$
Q = XW^Q
$$

![One shared Question Coach creates different token queries](chapter_2_graphics/04_shared_coach.png)

Using the Chapter 1 hidden states:

$$
X =
\begin{bmatrix}
0.21 & -0.37 & 0.58 & -0.11 \\
-0.42 & 0.73 & -0.15 & 0.36 \\
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

and the same $W^Q$, we obtain:

$$
Q
=
\begin{bmatrix}
-0.167 & -0.044 \\
0.013 & 0.628 \\
-0.364 & 0.060
\end{bmatrix}
$$

The rows correspond to:

$$
Q
=
\begin{bmatrix}
q_{\text{The}} \\
q_{\text{cat}} \\
q_{\text{sat}}
\end{bmatrix}
$$

So the same coach produces different questions because the clients arrive with different current states.

This is similar to one career coach using the same method with three different clients. The process is shared; the advice differs because the inputs differ.

<div class="big-idea">

**Shared parameters do not imply identical outputs. The same $W^Q$ acts on different hidden states, producing different queries.**

</div>

# Why call $Q$ a matrix?

For one token, the result is a query vector:

$$
q_t
$$

For the entire sequence, we stack every query row:

$$
Q
=
\begin{bmatrix}
q_1 \\
q_2 \\
\vdots \\
q_n
\end{bmatrix}
$$

Therefore:

$$
Q \in \mathbb{R}^{n \times d_k}
$$

In our example:

$$
Q \in \mathbb{R}^{3 \times 2}
$$

Be careful with the language:

- $W^Q$ is the learned **Query Matrix** or query projection;
- $q_t$ is one token's **query vector**;
- $Q$ is the **matrix of all token queries**.

These are related but not interchangeable.

# Different attention heads have different Question Coaches

One attention head is one specialised matching system.

In ordinary multi-head attention, every head has its own query projection:

$$
W_1^Q,\;
W_2^Q,\;
\ldots,\;
W_h^Q
$$

Therefore, the same SAT state may produce different queries:

$$
q_{\text{sat}}^{(1)}
=
x_{\text{sat}} W_1^Q
$$

$$
q_{\text{sat}}^{(2)}
=
x_{\text{sat}} W_2^Q
$$

and so on.

![Different heads employ different Question Coaches](chapter_2_graphics/05_different_heads.png)

In the dating-service story:

- Head 1 operates one specialist matchmaking agency;
- Head 2 operates another;
- each agency employs its own Question Coach;
- each coach helps SAT express a different kind of search preference.

One head may become useful for nearby relationships. Another may become useful for grammatical structure. Another may detect long-distance patterns.

But remember:

- these specialisations are learned;
- they are not manually assigned;
- real heads are not always cleanly interpretable;
- a head may participate in several overlapping computations.

<div class="warning">

## Analogy warning

The Question Coaches are not writing literal questions such as “find my subject.”

Each $W_h^Q$ creates a vector in a different learned query space. Human descriptions are interpretations of the behaviour that may emerge from those vectors.

</div>

# One implementation detail

Transformer implementations often compute all head queries using one large matrix multiplication.

Instead of visibly storing:

$$
W_1^Q,\;
W_2^Q,\;
\ldots,\;
W_h^Q
$$

the implementation may store a combined projection:

$$
W_{\text{combined}}^Q
$$

and then split the output into heads.

Conceptually, however, each head still receives its own slice of the query projection and produces its own query coordinates.

So the dating-service intuition remains useful:

> Every specialist matchmaking agency has its own Question Coach.

# What the query does not contain

The query does not contain:

- a list of matching token indices;
- attention percentages;
- information copied from another token;
- the final contextual update;
- the answer to the token's request.

It only represents what this token is looking for **inside this head's matching system**.

The sequence is:

```text
current hidden state
        ↓
Question Coach
        ↓
query
        ↓
compare against Keys
        ↓
compatibility scores
```

We have completed only the first three steps.

# Brain check

<div class="exercise">

## 1. What information does the Question Coach receive?

Only the current hidden state of the token being transformed.

## 2. Does $W^Q$ inspect all other tokens?

No. It independently transforms each token state into a query. Cross-token comparison happens later through $QK^T$.

## 3. Is $q_{\text{sat}}$ an English-language question?

No. It is a vector in a learned query space.

## 4. Why do THE, CAT, and SAT obtain different queries if the same $W^Q$ is used?

Because their hidden-state vectors are different.

## 5. Does every attention head use the same $W^Q$?

In ordinary multi-head attention, no. Each head conceptually has its own query projection.

## 6. What is the shape of the result of $(1 \times 4)(4 \times 2)$?

$$
1 \times 2
$$

## 7. What is the difference between $W^Q$, $q_t$, and $Q$?

- $W^Q$: learned query transformation;
- $q_t$: one token's query vector;
- $Q$: all token query vectors stacked as rows.

</div>

# Chapter takeaway

A token begins with its current hidden state:

$$
x_t
$$

The Question Coach transforms it:

$$
q_t = x_tW^Q
$$

The result is a head-specific query vector:

$$
q_t \in \mathbb{R}^{d_k}
$$

In the dating-service story:

> **The token explains its current situation. The Question Coach helps it express what kind of match it is looking for.**

But SAT still has a problem.

It has expressed what it wants, but the other tokens have not yet created searchable profiles.

![SAT now has a query, but matching requires Keys](chapter_2_graphics/06_handoff_to_keys.png)

# Coming next: Meet the Profile Writer

Every visible token needs a searchable description of what kinds of requests it can match.

That is the job of the Key Matrix:

$$
W^K
$$

In Chapter 3, every token will meet the **Profile Writer**, and we will calculate:

$$
k_t = x_tW^K
$$

Then, for the first time, SAT's query can be compared with another token's key:

$$
q_{\text{sat}} \cdot k_j
$$
