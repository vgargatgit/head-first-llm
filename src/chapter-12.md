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

But training begins with a different question:

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

The training document did not need a human to label eight separate questions.

Its ordering created the labels automatically.

# Shift the sequence by one position

Let the complete token sequence be:

$$
[t_0,t_1,t_2,\ldots,t_8]
$$

The model inputs are:

$$
X_{	ext{ids}}
=
[t_0,t_1,t_2,\ldots,t_7]
$$

The targets are the same sequence shifted one step to the left:

$$
Y_{	ext{ids}}
=
[t_1,t_2,t_3,\ldots,t_8]
$$

For our sentence:

$$
X_{	ext{ids}}
=
[	exttt{<BOS>},	exttt{The},	exttt{cat},	exttt{sat},	exttt{on},	exttt{the},	exttt{mat},	exttt{.}]
$$

and:

$$
Y_{	ext{ids}}
=
[	exttt{The},	exttt{cat},	exttt{sat},	exttt{on},	exttt{the},	exttt{mat},	exttt{.},	exttt{<EOS>}]
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

Then the model input is:

$$
X_{	ext{ids}}=[0,1,2,3,4,5,6,7]
$$

and the label sequence is:

$$
Y_{	ext{ids}}=[1,2,3,4,5,6,7,8]
$$

Nothing in this shift changes the vocabulary.

It changes which token ID is treated as the answer for each prediction row.

# One forward pass creates all prediction rows

Chapter 11 used the final row because generation needed only the token after the current prefix.

Training uses all valid rows at once.

For a sequence length:

$$
T=8
$$

and model width:

$$
d_{	ext{model}}
$$

the Transformer stack produces:

$$
H
\in
\mathbb{R}^{T	imes d_{	ext{model}}}
$$

The vocabulary projection produces:

$$
L
=
HW_{	ext{vocab}}+b
$$

with:

$$
L
\in
\mathbb{R}^{T	imes|\mathcal{V}|}
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

but it cannot use:

```text
on | the | mat | .
```

The target `on` is used only by the loss function after the model has produced position 3's logits.

<div class="warning">

## The answer is present in the batch, not visible through attention

Training software stores the complete sequence and its shifted labels together.

Causal masking prevents a prediction position from consulting future token states. The target participates in scoring the prediction; it is not supplied as an input feature to that prediction row.

</div>

# Teacher forcing

During standard next-token pretraining, each position receives the true earlier tokens from the training sequence.

For the question whose answer is `mat`, the model is given the true prefix:

```text
<BOS> The cat sat on the
```

It is not forced to continue from mistakes it may have predicted at previous training positions.

This practice is commonly called **teacher forcing**.

The teacher supplies the correct history; the model predicts the next item in that history.

# Teacher forcing is not the same as copying the answer

For position \(i\):

- input token \(t_i\) is visible at that position;
- previous tokens \(t_0,\ldots,t_{i-1}\) are visible through causal attention;
- target token \(t_{i+1}\) is not visible through the forward path;
- the loss compares the model's prediction with \(t_{i+1}\).

The model must infer the next token from the allowed prefix.

# Training and generation use prefixes differently

During training:

```text
true prefix from dataset
    -> predict every next token in parallel
```

During generation:

```text
prompt plus previously selected model tokens
    -> predict one new token
    -> append it
    -> repeat
```

This creates an important difference.

During training, the model normally sees clean ground-truth histories.

During generation, it may have to continue from its own imperfect earlier selections.

This difference is sometimes called **exposure bias**. It does not invalidate teacher forcing, but it explains why next-token accuracy on training-like prefixes is not the whole story of long-form generation quality.

# The batch dimension

Training rarely processes only one sequence.

Suppose a batch contains \(B\) sequences, each with training length \(T\).

Input IDs have shape:

$$
X_{	ext{ids}}
\in
\mathbb{N}^{B	imes T}
$$

Labels have shape:

$$
Y_{	ext{ids}}
\in
\mathbb{N}^{B	imes T}
$$

Final hidden states have shape:

$$
H
\in
\mathbb{R}^{B	imes T	imes d_{	ext{model}}}
$$

Vocabulary logits have shape:

$$
L
\in
\mathbb{R}^{B	imes T	imes|\mathcal{V}|}
$$

The loss function compares every valid \((b,t)\) logit row with one target token ID.

# Variable-length sequences and padding

Sequences in one batch may have different lengths.

A common solution pads shorter sequences to a shared length:

```text
Sequence A: <BOS> The cat sat . <EOS>
Sequence B: <BOS> The cat sat <PAD> <PAD>
```

Padding helps create rectangular tensors, but padding tokens should not normally contribute to the language-model loss.

A loss mask can mark valid target positions:

$$
m_{b,t}
\in
\{0,1\}
$$

where:

- \(m_{b,t}=1\) means score this target;
- \(m_{b,t}=0\) means ignore this target.

Many software libraries use a special ignored label value, often `-100`, to express the same idea. That number is a library convention, not a vocabulary token that the model must predict.

# Attention masks and loss masks solve different problems

These masks are related but not interchangeable.

| Mask | Purpose |
|---|---|
| Causal attention mask | Prevent a position from attending to future positions |
| Padding attention mask | Prevent attention from treating padding as meaningful context |
| Loss mask | Prevent selected target positions from contributing to the loss |

A correct training pipeline may need more than one of them.

For example, a padding position might be blocked in attention and also ignored in the loss.

# Document boundaries matter

Suppose two unrelated documents are joined:

```text
Document A ends here. Document B begins here.
```

Without a boundary convention, the model may be trained to predict the first token of Document B directly after the final token of Document A.

Training pipelines can use:

- end-of-sequence tokens;
- beginning-of-sequence tokens;
- attention segmentation;
- packing metadata;
- loss masks around boundaries.

The exact choice depends on the model and data pipeline.

<div class="warning">

## Efficient packing must preserve meaning

Packing several short examples into one fixed-length tensor can reduce wasted padding.

But the implementation must decide whether examples may attend across boundaries and whether cross-boundary next-token targets should be scored. Efficiency should not silently change the intended training task.

</div>

# Long documents become context windows

If a document contains more tokens than the model's training context length \(C\), it must be divided into windows.

One possible decomposition is:

```text
window 1: t0 ... tC
window 2: tC ... t2C
window 3: t2C ... t3C
```

Pipelines may use:

- non-overlapping windows;
- overlapping windows;
- document-aware packing;
- variable sequence lengths.

Every choice affects which token relationships appear together during training and which targets contribute to the objective.

# Boundary tokens are part of the learning task

The `<BOS>` token can teach the model about sequence beginnings.

The `<EOS>` token can teach the model when a sequence or document should end.

For our example, the final training pair is:

```text
input row:  .
target:     <EOS>
```

Without an end target, the model would have less direct supervision about stopping at that boundary.

Not every architecture uses the same set of boundary tokens, so the tokenizer and training pipeline must agree.

# A probability record for the next chapter

Suppose one forward pass assigns these probabilities to the correct targets:

| Input token | Correct target | Probability assigned to correct target |
|---|---|---:|
| `<BOS>` | `The` | 0.50 |
| `The` | `cat` | 0.25 |
| `cat` | `sat` | 0.10 |
| `sat` | `on` | 0.40 |
| `on` | `the` | 0.20 |
| `the` | `mat` | 0.60 |
| `mat` | `.` | 0.80 |
| `.` | `<EOS>` | 0.50 |

A model that assigns higher probability to the correct target should receive a better score.

But how should eight probabilities be turned into one scalar training objective?

That is the job of cross-entropy loss.

# Common training-example mistakes

## Mistake 1: using the same token as both input and target

The target is normally the token one position ahead, not the token already occupying the input row.

## Mistake 2: shifting inputs and labels in the same direction

If both arrays are shifted together, the alignment does not change. The labels must be offset relative to the inputs.

## Mistake 3: believing parallel training reveals future tokens

Parallel tensor computation and causal visibility are different concepts. The causal mask still blocks future attention.

## Mistake 4: scoring padding tokens

Padding is usually structural filler, not a desired language target. Invalid positions should be masked from the loss.

## Mistake 5: confusing the attention mask with the loss mask

One controls information flow inside the model. The other controls which predictions contribute to the objective.

## Mistake 6: using model-generated tokens as the standard pretraining prefix

Standard teacher-forced next-token pretraining uses ground-truth previous tokens from the dataset.

## Mistake 7: forgetting document boundaries

Blind concatenation can create unintended cross-document contexts and targets.

## Mistake 8: assuming one text sequence creates one training label

A length-\(T+1\) token segment can produce up to \(T\) next-token labels.

# Checkpoint

<div class="exercise">

## 1. How are next-token labels created?

Copy the token sequence and shift the target sequence one position ahead relative to the inputs.

## 2. What is the target for the input row containing `sat`?

`on`.

## 3. Why can all positions be processed in parallel during training?

The causal mask enforces permitted information flow even though tensor operations for all rows run together.

## 4. What is teacher forcing?

Supplying the true previous tokens from the training data as the prefix for each next-token prediction.

## 5. Does teacher forcing reveal the current target to the predicting row?

No. The target is used to score the output after the causally restricted forward calculation.

## 6. What is the logit tensor shape for batch size \(B\), sequence length \(T\), and vocabulary size \(|\mathcal{V}|\)?

$$
B	imes T	imes|\mathcal{V}|
$$

## 7. Why are padding labels ignored?

They do not represent genuine next-token learning targets.

## 8. What is the difference between an attention mask and a loss mask?

An attention mask controls what information a position can use. A loss mask controls whether that position's prediction contributes to the training objective.

## 9. Why include an end-of-sequence target?

It gives the model direct supervision about sequence or document termination.

## 10. How many targets can nine ordered tokens provide after a one-position shift?

Eight targets.

</div>

# Chapter takeaway

Given:

$$
[t_0,t_1,\ldots,t_T]
$$

the training input is:

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

The model now produces one probability distribution per training position, and each position has one correct target ID.

The next chapter will turn those predictions into:

- negative log-likelihood;
- cross-entropy loss;
- a masked batch average;
- perplexity;
- the first gradient signal that tells the model which logits should move.