---
title: "Chapter 12 — The Answer Key Moves One Step Ahead"
subtitle: "How token sequences become next-token training examples"
lang: en
---

# The question this chapter answers

Chapter 11 completed the inference path:

```text
current token sequence
    -> final hidden state
    -> vocabulary logits
    -> next-token distribution
    -> selected token
```

That explains how a trained model generates.

Training begins with a different question:

> Given ordinary text, where do the questions and correct answers come from?

A decoder-only language model learns by predicting the next token at every usable position.

<div class="big-idea">

**A token sequence supplies its own answer key. The tokens up to one position form the context, and the token immediately after that position is the target.**

</div>

# Cold open: the sentence becomes a classroom

Suppose the training text is:

> The cat sat on the mat.

After tokenisation and the addition of boundary tokens, imagine this sequence:

```text
<BOS> | The | cat | sat | on | the | mat | . | <EOS>
```

The model can turn this one sequence into several next-token questions:

| Context available so far | Correct next token |
|---|---|
| `<BOS>` | `The` |
| `<BOS> The` | `cat` |
| `<BOS> The cat` | `sat` |
| `<BOS> The cat sat` | `on` |
| `<BOS> The cat sat on` | `the` |
| `<BOS> The cat sat on the` | `mat` |
| `<BOS> The cat sat on the mat` | `.` |
| `<BOS> The cat sat on the mat .` | `<EOS>` |

One short sequence created eight prediction targets without a human writing eight separate labels.

# Shift the sequence by one position

Let the complete token sequence be:

$$
[t_0,t_1,t_2,\ldots,t_8]
$$

The model inputs are:

$$
X_{\mathrm{ids}}
=
[t_0,t_1,t_2,\ldots,t_7]
$$

The targets are the same sequence shifted one step ahead:

$$
Y_{\mathrm{ids}}
=
[t_1,t_2,t_3,\ldots,t_8]
$$

For our sentence:

$$
X_{\mathrm{ids}}
=
[\mathtt{<BOS>},\mathtt{The},\mathtt{cat},\mathtt{sat},\mathtt{on},\mathtt{the},\mathtt{mat},\mathtt{.}]
$$

and:

$$
Y_{\mathrm{ids}}
=
[\mathtt{The},\mathtt{cat},\mathtt{sat},\mathtt{on},\mathtt{the},\mathtt{mat},\mathtt{.},\mathtt{<EOS>}]
$$

The alignment is:

| Input position | Input token | Target token |
|---:|---|---|
| 0 | `<BOS>` | `The` |
| 1 | `The` | `cat` |
| 2 | `cat` | `sat` |
| 3 | `sat` | `on` |
| 4 | `on` | `the` |
| 5 | `the` | `mat` |
| 6 | `mat` | `.` |
| 7 | `.` | `<EOS>` |

<div class="translation">

## Read one row as a question

The row containing `sat` asks:

> After the prefix `<BOS> The cat sat`, which vocabulary token comes next?

Its correct label is `on`.

</div>

# Token IDs make the alignment concrete

Use this tiny vocabulary:

| Token ID | Token |
|---:|---|
| 0 | `<BOS>` |
| 1 | `The` |
| 2 | `cat` |
| 3 | `sat` |
| 4 | `on` |
| 5 | `the` |
| 6 | `mat` |
| 7 | `.` |
| 8 | `<EOS>` |

Then:

$$
X_{\mathrm{ids}}=[0,1,2,3,4,5,6,7]
$$

and:

$$
Y_{\mathrm{ids}}=[1,2,3,4,5,6,7,8]
$$

The shift changes the answer associated with each row. It does not change the vocabulary.

# One forward pass creates all prediction rows

Chapter 11 used only the final row because generation needed the token after the current prefix.

Training uses every valid row at once.

For sequence length:

$$
T=8
$$

and model width:

$$
d_{\mathrm{model}}
$$

the Transformer stack produces:

$$
H
\in
\mathbb{R}^{T\mathbin{×}d_{\mathrm{model}}}
$$

The vocabulary projection produces:

$$
L=HW_{\mathrm{vocab}}+b
$$

with:

$$
L
\in
\mathbb{R}^{T\mathbin{×}|\mathcal{V}|}
$$

Each row of \(L\) scores the vocabulary for one next-token target.

| Logit row | Prefix represented by that row | Target |
|---:|---|---|
| 0 | `<BOS>` | `The` |
| 1 | `<BOS> The` | `cat` |
| 2 | `<BOS> The cat` | `sat` |
| 3 | `<BOS> The cat sat` | `on` |
| 4 | `<BOS> The cat sat on` | `the` |
| 5 | `<BOS> The cat sat on the` | `mat` |
| 6 | `<BOS> The cat sat on the mat` | `.` |
| 7 | `<BOS> The cat sat on the mat .` | `<EOS>` |

# Parallel calculation does not break causality

The entire matrix is processed in one forward pass during training.

That does **not** mean an early position can read its answer from a later position.

The causal mask still enforces:

$$
M_{ij}
=
\begin{cases}
0, & j\le i\\
-\infty, & j>i
\end{cases}
$$

So the hidden state at input position 3 can use:

```text
<BOS> | The | cat | sat
```

but cannot use:

```text
on | the | mat | .
```

The target `on` is used by the loss function only after position 3's logits have been produced.

<div class="warning">

## The answer is present in the batch, not visible through attention

Training software stores the complete sequence and shifted labels together. Causal masking prevents a prediction row from consulting future hidden states.

The label scores the prediction; it is not an input feature to that prediction.

</div>

# Teacher forcing

During standard next-token pretraining, each position receives the true earlier tokens from the training sequence.

For the question whose answer is `mat`, the model receives the true prefix:

```text
<BOS> The cat sat on the
```

It is not required to continue from mistakes it may have predicted at earlier training positions.

This practice is commonly called **teacher forcing**.

For position \(i\):

- token \(t_i\) is the current input token;
- tokens \(t_0,\ldots,t_{i-1}\) are visible through causal attention;
- token \(t_{i+1}\) is the target;
- the loss compares the model's row-\(i\) distribution with \(t_{i+1}\).

# Training and generation use prefixes differently

During training:

```text
true prefix from the dataset
    -> predict all next-token targets in parallel
```

During generation:

```text
prompt plus previously selected model tokens
    -> predict one new token
    -> append it
    -> repeat
```

During training, the model normally sees clean ground-truth histories.

During generation, it may need to continue from its own imperfect earlier selections.

This difference is often called **exposure bias**. It does not invalidate teacher forcing, but it helps explain why low next-token loss is not the whole story of long-form generation quality.

# The batch dimension

Suppose a batch contains \(B\) sequences, each with training length \(T\).

Input IDs have shape:

$$
X_{\mathrm{ids}}
\in
\mathbb{N}^{B\mathbin{×}T}
$$

Labels have shape:

$$
Y_{\mathrm{ids}}
\in
\mathbb{N}^{B\mathbin{×}T}
$$

Final hidden states have shape:

$$
H
\in
\mathbb{R}^{B\mathbin{×}T\mathbin{×}d_{\mathrm{model}}}
$$

Vocabulary logits have shape:

$$
L
\in
\mathbb{R}^{B\mathbin{×}T\mathbin{×}|\mathcal{V}|}
$$

The loss compares every valid \((b,t)\) logit row with one target token ID.

# Variable-length sequences and padding

Sequences in one batch may have different lengths.

A common solution pads shorter sequences to a shared tensor length:

```text
Sequence A: <BOS> The cat sat . <EOS>
Sequence B: <BOS> The cat sat <PAD> <PAD>
```

Padding creates rectangular tensors, but padding positions should not normally contribute to the language-model loss.

A loss mask can mark valid target positions:

$$
m_{b,t}\in\{0,1\}
$$

where:

- \(m_{b,t}=1\): score this target;
- \(m_{b,t}=0\): ignore this target.

Many software libraries use a special ignored label value, often `-100`. That is a library convention, not a vocabulary token the model must predict.

# Attention masks and loss masks solve different problems

| Mask | Purpose |
|---|---|
| Causal attention mask | Prevent a position from attending to future positions |
| Padding attention mask | Prevent attention from treating padding as meaningful context |
| Loss mask | Prevent selected target positions from contributing to the objective |

A padding position may need to be blocked in attention and ignored in the loss.

The two actions are related, but they are not the same operation.

# Document boundaries matter

Suppose two unrelated documents are joined:

```text
Document A ends here. Document B begins here.
```

Without a boundary convention, the model may be trained to predict the first token of Document B directly after the final token of Document A.

Pipelines can use:

- beginning- and end-of-sequence tokens;
- attention segmentation;
- packing metadata;
- loss masks around selected boundaries.

The tokenizer, model, and data pipeline must agree on the convention.

<div class="warning">

## Efficient packing must preserve the intended task

Packing several short examples into one fixed-length tensor reduces wasted padding.

But the implementation must decide whether examples may attend across boundaries and whether cross-boundary targets should be scored. Efficiency should not silently change the supervision.

</div>

# Long documents become context windows

If a document contains more tokens than the training context length \(C\), it must be divided into windows.

Pipelines may use:

- non-overlapping windows;
- overlapping windows;
- document-aware packing;
- variable sequence lengths.

These choices affect which relationships appear together and which targets contribute to the objective.

# Boundary tokens are learnable events

The `<BOS>` token can mark a sequence beginning.

The `<EOS>` token can teach the model when a sequence or document should end.

For our example, the final pair is:

```text
input row:  .
target:     <EOS>
```

Not every model uses the same special tokens, so this behaviour is architecture- and tokenizer-specific.

# A probability record for the next chapter

Suppose a separate illustrative forward pass assigns these probabilities to the correct targets:

| Input token | Correct target | Correct-target probability |
|---|---|---:|
| `<BOS>` | `The` | 0.50 |
| `The` | `cat` | 0.25 |
| `cat` | `sat` | 0.10 |
| `sat` | `on` | 0.40 |
| `on` | `the` | 0.20 |
| `the` | `mat` | 0.60 |
| `mat` | `.` | 0.80 |
| `.` | `<EOS>` | 0.50 |

This full-sequence table is deliberately separate from Chapter 11's focused five-token distribution. Chapter 13 will use both examples for different calculations.

A model that assigns higher probability to the correct target should receive a better score.

How should these probabilities become one scalar objective?

# Common training-example mistakes

## Mistake 1: using the same token as input and target

The target is normally the token one position ahead.

## Mistake 2: shifting inputs and labels together

If both arrays move by the same amount, their relative alignment does not change.

## Mistake 3: believing parallel training reveals future tokens

Parallel tensor execution and causal visibility are different concepts.

## Mistake 4: scoring padding tokens

Padding is structural filler, not normally a genuine language target.

## Mistake 5: confusing attention masks with loss masks

One controls information flow. The other controls which predictions contribute to the objective.

## Mistake 6: forgetting document boundaries

Blind concatenation can create unintended contexts and targets.

## Mistake 7: assuming one sequence creates one label

A segment containing \(T+1\) ordered tokens can supply up to \(T\) next-token targets.

# Checkpoint

<div class="exercise">

## 1. How are next-token labels created?

Shift the target sequence one position ahead relative to the inputs.

## 2. What is the target for the row containing `sat`?

`on`.

## 3. Why can all rows be processed in parallel?

The causal mask still restricts which positions each row can use.

## 4. What is teacher forcing?

Supplying the true previous tokens from the training data as the prediction prefix.

## 5. Does teacher forcing reveal the current target to the prediction row?

No. The target is used only to score the causally restricted output.

## 6. What is the logit tensor shape for batch size \(B\), length \(T\), and vocabulary size \(|\mathcal{V}|\)?

$$
B\mathbin{×}T\mathbin{×}|\mathcal{V}|
$$

## 7. Why ignore padding labels?

They do not represent genuine next-token targets.

## 8. What is the difference between an attention mask and a loss mask?

An attention mask controls accessible information. A loss mask controls whether a prediction is scored.

## 9. Why include an end-of-sequence target?

It provides direct supervision about termination at that boundary.

## 10. How many targets can nine ordered tokens provide after a one-position shift?

Eight.

</div>

# Chapter takeaway

Given:

$$
[t_0,t_1,\ldots,t_T]
$$

the input is:

$$
[t_0,t_1,\ldots,t_{T-1}]
$$

and the labels are:

$$
[t_1,t_2,\ldots,t_T]
$$

One causal forward pass produces a vocabulary distribution for every valid input position.

The next token in the dataset supplies the answer key.

In our story:

> **The text writes its own quiz. Every token row must predict the token standing one step ahead, while the causal mask keeps the answer out of sight.**

# Coming next: meet the scorekeeper

The model now produces one distribution per training position, and each position has one correct target.

The next chapter will turn those predictions into:

- negative log-likelihood;
- cross-entropy loss;
- a masked batch average;
- perplexity;
- the first gradient signal telling the model which logits should move.