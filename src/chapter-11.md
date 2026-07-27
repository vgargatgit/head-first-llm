---
title: "Chapter 11 — The Final Audition"
subtitle: "How the last hidden state becomes logits, probabilities, and the next generated token"
lang: en
---

# The question this chapter answers

Chapter 10 followed SAT through a stack of Transformer blocks and a final normalisation.

The resulting hidden state was:

$$
\widetilde{h}_{\text{sat}}
\approx
\begin{bmatrix}
-0.008859 & -0.111600 & 1.470933 & -1.350474
\end{bmatrix}
$$

This vector contains contextual information produced by the model.

But it is not yet a token, a word, or a probability distribution.

How does the model turn four hidden coordinates into a decision among every token in its vocabulary?

<div class="big-idea">

**The language-model head projects the final hidden state into vocabulary space. The resulting logits score every vocabulary token, softmax converts those scores into probabilities, and a decoding rule selects the next token.**

</div>

# Cold open: SAT reaches the final audition

SAT's case file has travelled through:

- token and position representation;
- multiple attention heads;
- Value retrieval;
- output projections;
- residual connections;
- MLP transformations;
- a stack of Transformer blocks;
- final normalisation.

Now every vocabulary token auditions to be the next token.

Each candidate receives one score.

The model does not directly ask:

> Which English word should come next?

It asks:

> Which vocabulary token ID should come next?

A vocabulary token may be:

- a complete word;
- part of a word;
- punctuation;
- whitespace combined with text;
- a control or special token.

# The language-model output head

Let the vocabulary be:

$$
\mathcal{V}
$$

with size:

$$
|\mathcal{V}|
$$

The output projection has shape:

$$
W_{\text{vocab}}
\in
\mathbb{R}^{d_{\text{model}}\times|\mathcal{V}|}
$$

For one final hidden state:

$$
\widetilde{h}_t
\in
\mathbb{R}^{1\times d_{\text{model}}}
$$

the vocabulary logits are:

$$
\ell_t
=
\widetilde{h}_tW_{\text{vocab}}+b
$$

where:

$$
b\in\mathbb{R}^{1\times|\mathcal{V}|}
$$

The result has one coordinate per vocabulary entry:

$$
\ell_t
\in
\mathbb{R}^{1\times|\mathcal{V}|}
$$

# A tiny vocabulary

Real vocabularies can contain many thousands of tokens.

For a complete hand calculation, use only five candidates:

| Vocabulary ID | Token |
|---:|---|
| 0 | `on` |
| 1 | `quietly` |
| 2 | `.` |
| 3 | `the` |
| 4 | `mat` |

Thus:

$$
|\mathcal{V}|=5
$$

Our model width is:

$$
d_{\text{model}}=4
$$

Therefore:

$$
W_{\text{vocab}}
\in
\mathbb{R}^{4\times5}
$$

# The vocabulary projection matrix

Use this small learned matrix:

$$
W_{\text{vocab}}
=
\begin{bmatrix}
0.4 & -0.2 & 0.1 & 0.3 & -0.1\\
-0.1 & 0.5 & -0.2 & 0.2 & 0.3\\
0.2 & -0.1 & 0.6 & -0.4 & 0.5\\
-0.3 & 0.4 & -0.1 & 0.1 & -0.2
\end{bmatrix}
$$

and bias:

$$
b=
\begin{bmatrix}
0.05 & -0.02 & 0.10 & 0 & 0.03
\end{bmatrix}
$$

Each column of \(W_{\text{vocab}}\) belongs to one candidate token.

For example, the third column belongs to the period token:

$$
w_{.}
=
\begin{bmatrix}
0.1\\
-0.2\\
0.6\\
-0.1
\end{bmatrix}
$$

# Calculate the vocabulary logits

SAT's final state is:

$$
\widetilde{h}_{\text{sat}}
=
\begin{bmatrix}
-0.008859 & -0.111600 & 1.470933 & -1.350474
\end{bmatrix}
$$

The logits are:

$$
\ell_{\text{sat}}
=
\widetilde{h}_{\text{sat}}W_{\text{vocab}}+b
$$

The result is:

$$
\boxed{
\ell_{\text{sat}}
\approx
\begin{bmatrix}
0.756945 & -0.761311 & 1.139041 & -0.748398 & 1.002967
\end{bmatrix}
}
$$

Mapped to the vocabulary:

| Token | Logit |
|---|---:|
| `on` | 0.756945 |
| `quietly` | -0.761311 |
| `.` | 1.139041 |
| `the` | -0.748398 |
| `mat` | 1.002967 |

The period has the highest logit, followed by `mat`, then `on`.

# Verify the period logit

The period column is:

$$
w_{.}
=
\begin{bmatrix}
0.1\\
-0.2\\
0.6\\
-0.1
\end{bmatrix}
$$

Its bias is:

$$
b_{.}=0.10
$$

Therefore:

$$
\begin{aligned}
\ell_{.}
&=
(-0.008859)(0.1)
+(-0.111600)(-0.2)\\
&\quad +(1.470933)(0.6)
+(-1.350474)(-0.1)
+0.10\\
&\approx
-0.000886
+0.022320
+0.882560
+0.135047
+0.100000\\
&\approx1.139041
\end{aligned}
$$

This is one ordinary dot product plus a bias.

The same hidden state is compared with every vocabulary column.

# Logits are scores, not probabilities

The logits include negative and positive values:

$$
\ell_{\text{sat}}
\approx
\begin{bmatrix}
0.756945 & -0.761311 & 1.139041 & -0.748398 & 1.002967
\end{bmatrix}
$$

They do not:

- lie between 0 and 1;
- sum to 1;
- directly represent percentages.

Only their relative values matter for the next softmax.

Adding the same constant to every logit does not change the probability distribution.

# Softmax over the vocabulary

For vocabulary token \(j\):

$$
p(j)
=
\frac{e^{\ell_j}}
{\sum_{r\in\mathcal{V}}e^{\ell_r}}
$$

For numerical stability, implementations subtract the largest logit:

$$
m=\max_j\ell_j
$$

$$
p(j)
=
\frac{e^{\ell_j-m}}
{\sum_r e^{\ell_r-m}}
$$

Here:

$$
m=1.139041
$$

Applying softmax gives:

$$
\boxed{
p
\approx
\begin{bmatrix}
0.238931 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
}
$$

Mapped back to tokens:

| Token | Probability |
|---|---:|
| `on` | 0.238931 |
| `quietly` | 0.052348 |
| `.` | 0.350118 |
| `the` | 0.053029 |
| `mat` | 0.305575 |

Apart from tiny rounding differences:

$$
\sum_jp(j)=1
$$

<div class="translation">

## The audition result

The logits are the judges' raw scores.

Softmax turns those scores into a distribution of selection chances. A candidate with a lower score can still receive a non-zero chance unless a decoding filter removes it.

</div>

# Follow the output shapes

For the full sequence after the final stack:

$$
X^{(L)}
\in
\mathbb{R}^{n\times d_{\text{model}}}
$$

The vocabulary matrix is:

$$
W_{\text{vocab}}
\in
\mathbb{R}^{d_{\text{model}}\times|\mathcal{V}|}
$$

Therefore, all positions can produce logits together:

$$
\mathcal{L}
=
X^{(L)}W_{\text{vocab}}+b
$$

with:

$$
\mathcal{L}
\in
\mathbb{R}^{n\times|\mathcal{V}|}
$$

There is one vocabulary-logit row for every sequence position.

# Which position predicts the next token?

During generation, the model uses the final row for the current last position.

If the current prefix is:

> The cat sat

then the hidden state at SAT's position produces the distribution for the token that follows SAT.

The earlier rows represent predictions that would have been made after earlier prefixes:

| Final-state row | Predicts token after prefix |
|---|---|
| THE | `The` |
| CAT | `The cat` |
| SAT | `The cat sat` |

During training, all these rows can be scored in parallel against shifted target tokens.

During one generation step, only the newest prediction is needed to choose the next token.

# Greedy decoding

The simplest rule chooses the token with the largest probability:

$$
\hat{j}
=
\arg\max_j p(j)
$$

For our distribution, the largest probability belongs to:

$$
\texttt{.}
$$

because:

$$
0.350118
>
0.305575
>
0.238931
$$

Greedy decoding therefore appends a period.

Greedy decoding is deterministic for a fixed model state and fixed numerical implementation.

It does not explore lower-probability alternatives.

# Sampling from the distribution

Instead of taking the maximum, the decoder can sample according to the probabilities.

Our distribution gives approximately:

- 35.0% chance to `.`;
- 30.6% chance to `mat`;
- 23.9% chance to `on`;
- about 5.3% each to `quietly` and `the`.

Sampling could choose `mat` even though the period has the highest probability.

<div class="warning">

## Highest probability does not mean guaranteed selection

The model produces a distribution. The decoding algorithm decides whether to take the maximum or draw a random sample.

Model probabilities and decoding policy are separate stages.

</div>

# Temperature

Temperature rescales logits before softmax:

$$
p_T(j)
=
\operatorname{softmax}
\left(
\frac{\ell_j}{T}
\right)
$$

where:

$$
T>0
$$

The effects are:

- \(T<1\): differences become larger and the distribution becomes sharper;
- \(T=1\): the original distribution is preserved;
- \(T>1\): differences shrink and the distribution becomes flatter.

# Temperature applied to our logits

Using the same five logits:

| Token | \(T=0.5\) | \(T=1.0\) | \(T=1.5\) |
|---|---:|---:|---:|
| `on` | 0.204911 | 0.238931 | 0.238189 |
| `quietly` | 0.009836 | 0.052348 | 0.086565 |
| `.` | 0.439996 | 0.350118 | 0.307291 |
| `the` | 0.010093 | 0.053029 | 0.087313 |
| `mat` | 0.335163 | 0.305575 | 0.280642 |

At \(T=0.5\), the leading candidates dominate more strongly.

At \(T=1.5\), the lower-scoring candidates receive more probability.

Temperature does not alter:

- model weights;
- hidden states already calculated;
- the vocabulary;
- what the model learned during training.

It changes the distribution used for decoding.

# What about temperature zero?

The formula divides by \(T\), so \(T=0\) is not a valid direct substitution.

User interfaces sometimes use “temperature 0” as shorthand for deterministic or near-greedy decoding.

Mathematically, greedy selection is better described as:

$$
\arg\max_j\ell_j
$$

or as the limiting behaviour as temperature approaches zero from above.

# Top-k sampling

Top-\(k\) sampling keeps only the \(k\) highest-scoring tokens.

For:

$$
k=2
$$

the retained candidates are:

- `.` with probability 0.350118;
- `mat` with probability 0.305575.

The other probabilities are set to zero, and the retained values are renormalised.

The new distribution is approximately:

| Token | Top-2 probability |
|---|---:|
| `.` | 0.533966 |
| `mat` | 0.466034 |
| all others | 0 |

Top-\(k\) limits the candidate count, regardless of how much total probability those candidates originally held.

# Top-p or nucleus sampling

Top-\(p\) sampling keeps the smallest set of highest-probability tokens whose cumulative probability reaches a threshold \(p\).

Let:

$$
p=0.8
$$

Sort the candidates:

| Rank | Token | Probability | Cumulative probability |
|---:|---|---:|---:|
| 1 | `.` | 0.350118 | 0.350118 |
| 2 | `mat` | 0.305575 | 0.655693 |
| 3 | `on` | 0.238931 | 0.894624 |
| 4 | `the` | 0.053029 | 0.947653 |
| 5 | `quietly` | 0.052348 | 1.000001 |

The first two candidates do not yet reach 0.8. Adding `on` crosses the threshold.

After filtering and renormalisation:

| Token | Top-\(p=0.8\) probability |
|---|---:|
| `.` | 0.391358 |
| `mat` | 0.341568 |
| `on` | 0.267074 |
| `the` | 0 |
| `quietly` | 0 |

Unlike top-\(k\), the number of retained tokens can change from one decoding step to another.

# Top-k and top-p are filters, not new model knowledge

The model produced the original logits.

The decoder then applies choices such as:

- temperature scaling;
- top-\(k\) filtering;
- top-\(p\) filtering;
- repetition-related penalties;
- greedy or random selection.

These choices can strongly affect generated text, but they do not modify the trained model parameters.

# The autoregressive generation loop

Suppose the current token sequence is:

```text
The | cat | sat
```

One generation step performs:

```text
current prefix
    -> newest token passes through the Transformer stack
    -> final hidden state
    -> vocabulary logits
    -> decoding distribution
    -> selected token
    -> append selected token to the prefix
```

If `mat` is selected, the new sequence becomes:

```text
The | cat | sat | mat
```

The model then performs another decoding step to predict the token after `mat`.

It does not usually generate a complete paragraph in one single next-token distribution.

It repeatedly predicts and appends one token.

# Where the KV cache fits

At the next generation step, the previous tokens are unchanged.

Their layer-specific Keys and Values can remain in the KV cache.

For the newly appended token, each layer calculates:

- one new Query;
- one new Key;
- one new Value.

The new Query attends to cached Keys. The resulting weights combine cached Values and the new Value.

The new Key and Value are then added to the cache for future steps.

The output head still runs after the newest token passes through the complete stack.

# Input embeddings and output weights can be tied

The input embedding table maps vocabulary IDs into model-width vectors.

Using row-oriented notation:

$$
E_{\text{token}}
\in
\mathbb{R}^{|\mathcal{V}|\times d_{\text{model}}}
$$

The output projection needs:

$$
W_{\text{vocab}}
\in
\mathbb{R}^{d_{\text{model}}\times|\mathcal{V}|}
$$

Some models share these parameters through weight tying:

$$
W_{\text{vocab}}
=
E_{\text{token}}^T
$$

This means the same learned vocabulary geometry participates in:

- mapping token IDs into hidden space;
- scoring hidden states against vocabulary candidates.

Weight tying is common, but it is an architecture choice rather than a requirement of the Transformer formula.

# Tokens are not necessarily words

The vocabulary table in this chapter used readable whole words for clarity.

A real tokenizer may represent text as fragments.

For example, a word could be split into several vocabulary tokens, or a token could include a leading space.

Therefore, next-token generation is not always equivalent to next-word generation.

The model predicts a token ID from its configured tokenizer vocabulary.

That token ID is decoded back into bytes or text according to the tokenizer.

# Special tokens

A vocabulary may also contain special tokens representing events such as:

- beginning of sequence;
- end of sequence;
- padding;
- separators;
- tool or control boundaries.

If an end-of-sequence token is selected, the generation system may stop.

The precise meaning and availability of special tokens depend on the model and tokenizer.

# Why all vocabulary probabilities are connected

Softmax uses one shared denominator:

$$
\sum_{r\in\mathcal{V}}e^{\ell_r}
$$

Increasing one token's logit tends to increase its probability and reduce the probability mass available to others.

The vocabulary probabilities are therefore not calculated as independent yes/no decisions.

They form one competing categorical distribution.

# Common output and decoding mistakes

## Mistake 1: calling logits probabilities

Logits are unconstrained scores. Softmax converts them into probabilities.

## Mistake 2: applying softmax over hidden coordinates

Softmax is applied over vocabulary logits, not over the \(d_{\text{model}}\) coordinates of the hidden state.

## Mistake 3: assuming the highest-probability token must be selected

Sampling can select any retained token with non-zero probability.

## Mistake 4: saying temperature changes the model's knowledge

Temperature changes logit scaling during decoding. It does not retrain the model.

## Mistake 5: treating tokens as whole words

Tokens can be fragments, punctuation, whitespace-bearing pieces, bytes, or special symbols.

## Mistake 6: believing a sentence is produced in one forward decision

Autoregressive decoding repeatedly selects one next token and appends it.

## Mistake 7: projecting only after softmax

The order is hidden state, vocabulary projection, logits, then softmax.

## Mistake 8: assuming top-\(k\) and top-\(p\) are the same

Top-\(k\) fixes a candidate count. Top-\(p\) adapts the count to cumulative probability mass.

## Mistake 9: forgetting the final position rule

During generation, the final hidden row for the current prefix supplies the next-token distribution.

## Mistake 10: assuming every architecture ties embedding and output weights

Weight tying is common but optional.

# Checkpoint

<div class="exercise">

## 1. What is the shape of the vocabulary projection?

$$
W_{\text{vocab}}
\in
\mathbb{R}^{d_{\text{model}}\times|\mathcal{V}|}
$$

## 2. What does one logit represent?

One unnormalised score for one vocabulary token candidate.

## 3. Do logits need to be positive?

No. They can be any real values.

## 4. Along which dimension is output softmax applied?

Across the vocabulary candidates for one prediction position.

## 5. Which token does greedy decoding select in our example?

The period token, because it has the largest logit and probability.

## 6. What does temperature below 1 do?

It sharpens the distribution by enlarging relative logit differences before softmax.

## 7. Which tokens survive top-\(k\) with \(k=2\)?

The period and `mat`.

## 8. Which tokens survive top-\(p\) with \(p=0.8\) in our example?

The period, `mat`, and `on`.

## 9. What does weight tying mean?

The output vocabulary matrix shares parameters with the transpose of the input token-embedding table.

## 10. Does one generation step normally produce a complete response?

No. It selects one next token. Generation repeats the process autoregressively.

</div>

# Chapter takeaway

The final Transformer hidden state has model width:

$$
\widetilde{h}_t
\in
\mathbb{R}^{1\times d_{\text{model}}}
$$

The language-model head projects it into vocabulary space:

$$
\ell_t
=
\widetilde{h}_tW_{\text{vocab}}+b
$$

Softmax creates a categorical distribution:

$$
p_t
=
\operatorname{softmax}(\ell_t)
$$

A decoding strategy then selects one token.

For our example:

$$
\ell_{\text{sat}}
\approx
\begin{bmatrix}
0.756945 & -0.761311 & 1.139041 & -0.748398 & 1.002967
\end{bmatrix}
$$

and:

$$
p
\approx
\begin{bmatrix}
0.238931 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

In our story:

> **The final hidden state enters an audition against every vocabulary token. The output projection assigns scores, softmax turns them into chances, and the decoding rule chooses who steps onto the page next.**

# The complete inference path

We can now follow a decoder-only Transformer from text input to one generated token:

```text
text
  -> tokenizer
  -> token IDs
  -> token embeddings and position information
  -> stacked Transformer blocks
  -> final normalisation
  -> vocabulary projection
  -> logits
  -> decoding distribution
  -> selected next token
  -> append and repeat
```

In compact mathematical form:

$$
\text{token IDs}
\rightarrow
X^{(0)}
\rightarrow
X^{(L)}
\rightarrow
\widetilde{h}_t
\rightarrow
\ell_t
\rightarrow
p_t
\rightarrow
\text{next token}
$$

# Coming next: how the model learns

The forward path is now complete.

The next part of the book can reverse the question:

> How did all these matrices learn useful values?

That journey begins with:

- training examples made from token sequences;
- shifted next-token targets;
- cross-entropy loss;
- backpropagation;
- gradient-based updates to embeddings, attention projections, MLP weights, normalisation parameters, and the vocabulary head.