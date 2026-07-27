---
title: "Chapter 13 — Meet the Scorekeeper"
subtitle: "How cross-entropy turns next-token predictions into a training loss"
lang: en
---

# The question this chapter answers

Chapter 12 created one correct target for every valid prediction row.

For example:

```text
prefix:  <BOS> The cat sat
answer:  on
```

The model does not return a single answer during training.

It returns a probability distribution over the entire vocabulary.

How do we score that distribution?

<div class="big-idea">

**Cross-entropy rewards probability assigned to the correct token. It does not care only about whether the correct token ranked first; it measures how confidently the model supported the answer.**

</div>

# Cold open: the scorekeeper ignores the excuses

Suppose two models both rank `on` first.

Model A assigns:

$$
p(\texttt{on})=0.55
$$

Model B assigns:

$$
p(\texttt{on})=0.95
$$

Both would be counted as correct by top-1 accuracy.

But Model B placed much more probability on the true target.

A language-model loss should recognise that difference.

The scorekeeper uses the negative logarithm:

$$
\mathcal{L}=-\log p(\text{correct token})
$$

# Negative log-likelihood for one target

For a target token \(y\), let the model assign probability:

$$
p_y
$$

The negative log-likelihood is:

$$
\mathcal{L}_{\text{NLL}}=-\log p_y
$$

Using natural logarithms:

| Correct-token probability | Loss |
|---:|---:|
| 1.00 | 0.000000 |
| 0.80 | 0.223144 |
| 0.50 | 0.693147 |
| 0.25 | 1.386294 |
| 0.10 | 2.302585 |
| 0.01 | 4.605170 |

The pattern is deliberate:

- high probability for the correct token gives low loss;
- low probability for the correct token gives high loss;
- perfect probability gives zero loss;
- probability approaching zero produces a very large loss.

# Why use a logarithm?

The logarithm provides several useful properties.

## Probabilities across a sequence become additive

If a model assigns probabilities:

$$
p_1,p_2,\ldots,p_T
$$

to the correct tokens, the joint likelihood under the autoregressive factorisation is:

$$
\prod_{t=1}^{T}p_t
$$

Taking the negative logarithm converts the product into a sum:

$$
-\log\left(\prod_{t=1}^{T}p_t\right)
=
-\sum_{t=1}^{T}\log p_t
$$

Sums are easier to accumulate, average, and differentiate than long products of small probabilities.

## Confident mistakes are penalised strongly

Assigning 0.10 to the answer is worse than assigning 0.50.

Assigning 0.001 is worse still.

The logarithm expands the penalty near zero probability.

## The objective matches maximum likelihood

Minimising negative log-likelihood is equivalent to maximising the probability assigned to the observed training sequence.

# Return to Chapter 11's distribution

Chapter 11 produced this distribution after the prefix:

> The cat sat

| Token | Probability |
|---|---:|
| `on` | 0.238931 |
| `quietly` | 0.052348 |
| `.` | 0.350118 |
| `the` | 0.053029 |
| `mat` | 0.305575 |

The training text says the correct next token is:

$$
y=\texttt{on}
$$

Therefore, the loss for this position is:

$$
\begin{aligned}
\mathcal{L}_{\text{sat}}
&=-\log p(\texttt{on})\\
&=-\log(0.238931)\\
&\approx1.431580
\end{aligned}
$$

The period had the highest model probability, but the answer key says `on`.

Cross-entropy therefore scores the probability assigned to `on`, not the probability assigned to the model's preferred candidate.

<div class="warning">

## The loss uses the target, not the argmax

Training does not first choose one token and then mark it right or wrong.

The complete probability distribution remains differentiable. The target ID selects which probability appears inside the negative logarithm.

</div>

# From one-hot targets to cross-entropy

Suppose the vocabulary has \(V\) entries.

Represent the correct target as a one-hot vector:

$$
y_j=
\begin{cases}
1, & j=\text{correct token}\\
0, & \text{otherwise}
\end{cases}
$$

Let the model probabilities be:

$$
p_1,p_2,\ldots,p_V
$$

Categorical cross-entropy is:

$$
\mathcal{L}
=
-\sum_{j=1}^{V}y_j\log p_j
$$

Because only one \(y_j\) equals 1, every other term disappears:

$$
\mathcal{L}
=
-\log p_y
$$

So next-token cross-entropy and negative log-likelihood describe the same per-position objective for a one-hot target.

# Cross-entropy starts from logits in software

The model directly produces logits:

$$
z_1,z_2,\ldots,z_V
$$

Probabilities are:

$$
p_j
=
\frac{e^{z_j}}{\sum_{r=1}^{V}e^{z_r}}
$$

Substituting into the loss gives:

$$
\begin{aligned}
\mathcal{L}
&=-\log\left(
\frac{e^{z_y}}{\sum_r e^{z_r}}
\right)\\
&=-z_y+\log\left(\sum_r e^{z_r}\right)
\end{aligned}
$$

This is often implemented as a combined log-softmax and negative-log-likelihood operation.

The combination is more numerically stable than separately calculating ordinary exponentials, probabilities, and logarithms.

# Stable log-sum-exp

Large logits can overflow when exponentiated.

Let:

$$
m=\max_j z_j
$$

Then:

$$
\log\left(\sum_j e^{z_j}\right)
=
m+
\log\left(\sum_j e^{z_j-m}\right)
$$

Subtracting \(m\) keeps the largest exponent equal to 1 and the others at or below 1.

The loss becomes:

$$
\mathcal{L}
=
-z_y+m+
\log\left(\sum_j e^{z_j-m}\right)
$$

This transformation changes neither the softmax probabilities nor the loss.

# Score every valid position

Chapter 12 recorded these correct-target probabilities:

| Position | Correct target | Correct-target probability | Per-position loss |
|---:|---|---:|---:|
| 0 | `The` | 0.50 | 0.693147 |
| 1 | `cat` | 0.25 | 1.386294 |
| 2 | `sat` | 0.10 | 2.302585 |
| 3 | `on` | 0.40 | 0.916291 |
| 4 | `the` | 0.20 | 1.609438 |
| 5 | `mat` | 0.60 | 0.510826 |
| 6 | `.` | 0.80 | 0.223144 |
| 7 | `<EOS>` | 0.50 | 0.693147 |

The sequence's total negative log-likelihood is:

$$
\begin{aligned}
\mathcal{L}_{\text{sum}}
&=
0.693147+1.386294+2.302585+0.916291\\
&\quad+1.609438+0.510826+0.223144+0.693147\\
&\approx8.334872
\end{aligned}
$$

# Mean token loss

Training usually reports a mean over valid target positions.

With eight valid targets:

$$
\begin{aligned}
\mathcal{L}_{\text{mean}}
&=
\frac{8.334872}{8}\\
&\approx1.041859
\end{aligned}
$$

This mean gives each valid token target equal weight in the example.

If sequences have different numbers of valid tokens, averaging sequence-level means and averaging all valid tokens are not necessarily the same calculation.

# Masked cross-entropy

Let:

$$
m_{b,t}\in\{0,1\}
$$

indicate whether target position \(t\) in batch item \(b\) should contribute.

The masked mean loss is:

$$
\mathcal{L}_{\text{batch}}
=
\frac{
\sum_{b,t}m_{b,t}\mathcal{L}_{b,t}
}{
\sum_{b,t}m_{b,t}
}
$$

The denominator counts valid targets, not total tensor slots.

This prevents padding or intentionally ignored positions from reducing the reported loss simply by occupying space.

# Loss reduction matters

A software loss function may return:

- one loss per position;
- the sum of valid losses;
- the mean of valid losses.

These are commonly called reduction modes such as `none`, `sum`, and `mean`.

The choice affects gradient scale.

For example, doubling the batch size doubles a summed loss but need not double a properly averaged loss.

A training implementation must know which reduction it uses before choosing learning rates or comparing metrics.

# Perplexity

For a mean cross-entropy measured with natural logarithms, perplexity is:

$$
\operatorname{PPL}
=
e^{\mathcal{L}_{\text{mean}}}
$$

For our sequence:

$$
\begin{aligned}
\operatorname{PPL}
&=e^{1.041859}\\
&\approx2.834481
\end{aligned}
$$

Lower perplexity means the model assigned more probability to the observed targets.

A useful intuition is an **equivalent uniform branching factor**.

A perplexity near 2.83 has the same average negative log-likelihood as repeatedly choosing the correct answer from about 2.83 equally likely possibilities.

That is an interpretation of the metric, not a claim that the model literally considered exactly 2.83 tokens at every position.

# Perplexity is not accuracy

Suppose two models both rank the correct token first.

| Model | Correct-token probability | Top-1 result | Loss |
|---|---:|---|---:|
| A | 0.35 | Correct | 1.049822 |
| B | 0.90 | Correct | 0.105361 |

Accuracy treats them equally.

Cross-entropy and perplexity distinguish their confidence.

The reverse can also happen: a model may place 0.40 on the correct token but 0.41 on an incorrect token. Top-1 accuracy is wrong, but the loss still recognises that substantial probability was assigned to the target.

# Perplexity comparisons require care

Perplexity depends on the tokenisation and evaluation setup.

Two models can segment the same text into different numbers and kinds of tokens.

Therefore, perplexities are most directly comparable when models use:

- the same tokenizer or equivalent unit of measurement;
- the same evaluation text;
- the same handling of boundaries and ignored positions;
- the same logarithm base and reduction convention.

A lower token-level perplexity under one tokenizer does not automatically prove better language modelling under a very different tokenizer.

# Bits per token

Natural-log loss is measured in **nats**.

To express the same uncertainty in bits:

$$
\operatorname{bits/token}
=
\frac{\mathcal{L}_{\text{mean}}}{\log 2}
$$

For our example:

$$
\operatorname{bits/token}
\approx
\frac{1.041859}{0.693147}
\approx1.503085
$$

This is another representation of the same average predictive uncertainty.

# What about label smoothing?

The one-hot target says:

$$
y_y=1
$$

and all other target entries are zero.

Some training objectives use label smoothing, which assigns most—but not all—target mass to the correct class.

For smoothing amount \(arepsilon\), one possible target is:

$$
y_y=1-\varepsilon
$$

with the remaining mass distributed across other vocabulary entries.

Label smoothing changes the objective and gradient. It is not part of the basic next-token cross-entropy calculation used in this chapter, and not every LLM pretraining recipe uses it.

# The gradient signal begins at the logits

For softmax probabilities \(p_j\) and one-hot target \(y_j\), the derivative of cross-entropy with respect to each logit is:

$$
\frac{\partial\mathcal{L}}{\partial z_j}
=
p_j-y_j
$$

This compact result is crucial.

For the correct token:

$$
\frac{\partial\mathcal{L}}{\partial z_y}
=
p_y-1
$$

which is negative unless \(p_y=1\).

Gradient descent will therefore tend to increase the correct token's logit.

For an incorrect token:

$$
\frac{\partial\mathcal{L}}{\partial z_j}
=p_j
$$

which is positive.

Gradient descent will tend to decrease logits of incorrect tokens in proportion to their probability.

# Exact logit gradient for Chapter 11

Chapter 11 produced:

$$
p
\approx
\begin{bmatrix}
0.238931 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
$$

The correct target is `on`, the first vocabulary entry:

$$
y=
\begin{bmatrix}
1 & 0 & 0 & 0 & 0
\end{bmatrix}
$$

Therefore:

$$
\boxed{
\frac{\partial\mathcal{L}}{\partial z}
=p-y
\approx
\begin{bmatrix}
-0.761069 & 0.052348 & 0.350118 & 0.053029 & 0.305575
\end{bmatrix}
}
$$

The largest positive incorrect gradient belongs to the period, because the model assigned the period the most incorrect probability.

The negative gradient for `on` says its logit needs upward pressure.

This vector is the starting point for backpropagation.

<div class="translation">

## Read the gradient as a correction request

- `on`: **raise this score**;
- `.`: **lower this score strongly**;
- `mat`: **lower this score**;
- low-probability alternatives: **smaller corrections**.

The gradient does not manually edit the logits. It flows backward to the parameters that produced them.

</div>

# Loss is a training signal, not a complete quality measure

Low cross-entropy is central to next-token pretraining, but it does not by itself measure every property users care about.

It does not directly guarantee:

- factual accuracy;
- harmlessness;
- instruction following;
- calibrated uncertainty;
- long-horizon coherence;
- usefulness for a specific downstream task.

Those properties depend on data, architecture, training procedures, post-training, decoding, and evaluation.

# Common loss mistakes

## Mistake 1: taking the logarithm of the highest probability

The loss uses the probability of the correct target, even when another token ranked first.

## Mistake 2: averaging over padding

Only valid target positions should normally contribute to the numerator and denominator.

## Mistake 3: applying cross-entropy to already selected token IDs

Cross-entropy needs logits or probabilities, not a non-differentiable argmax result.

## Mistake 4: manually applying softmax before a combined logits-based loss

Many libraries expect raw logits and internally use a stable log-softmax calculation. Applying softmax first can reduce numerical stability or produce the wrong API behaviour.

## Mistake 5: treating perplexity as accuracy

Perplexity reflects probability assigned to observed targets, not merely the fraction of top-1 predictions that were correct.

## Mistake 6: comparing perplexity across incompatible tokenizers without qualification

Different token units can make raw token-level perplexities misleading.

## Mistake 7: forgetting the reduction convention

Summed and averaged losses have different scales.

## Mistake 8: saying loss directly changes the weights

Loss is a scalar objective. Gradients computed from that loss guide an optimiser, which then updates parameters.

# Checkpoint

<div class="exercise">

## 1. What is the per-token negative log-likelihood?

$$
-\log p(\text{correct token})
$$

## 2. What happens to the loss as correct-token probability approaches 1?

It approaches zero.

## 3. What happens as correct-token probability approaches zero?

The loss grows without bound.

## 4. What is the mean loss for the eight-position example?

Approximately 1.041859 nats per valid token.

## 5. What is its perplexity?

Approximately 2.834481.

## 6. Why is the target represented as one-hot in the basic formulation?

Exactly one vocabulary token is the observed next token for that position.

## 7. What is the logit gradient for softmax cross-entropy?

$$
p-y
$$

## 8. Why does the correct token usually receive a negative logit gradient?

Its component is \(p_y-1\), which is negative whenever its probability is below 1.

## 9. Does low perplexity guarantee factual correctness?

No. It measures predictive likelihood on the evaluated token data.

## 10. Why should padding positions be masked?

They are structural tensor fillers rather than genuine language targets.

</div>

# Chapter takeaway

For target token \(y\):

$$
\mathcal{L}
=-\log p_y
$$

Across valid positions:

$$
\mathcal{L}_{\text{mean}}
=
\frac{1}{N}
\sum_{i=1}^{N}
-\log p_{i,y_i}
$$

Perplexity is:

$$
\operatorname{PPL}
=e^{\mathcal{L}_{\text{mean}}}
$$

And the derivative at the logits is:

$$
\frac{\partial\mathcal{L}}{\partial z}
=p-y
$$

In our story:

> **The Scorekeeper looks only at how much support the model gave the real next token. Confident support earns a small penalty; confident rejection earns a large one.**

# Coming next: the blame travels backward

We now have a scalar loss and an exact correction signal at the vocabulary logits.

The next chapter will follow that signal backward through:

- the vocabulary projection;
- the final hidden state;
- residual paths;
- MLPs and attention;
- shared parameters across positions;
- a gradient-based parameter update.