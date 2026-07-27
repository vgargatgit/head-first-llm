---
title: "Chapter 17 — From Completion Machine to Helpful Assistant"
subtitle: "How supervised fine-tuning, preference optimisation, and LoRA shape pretrained behaviour"
lang: en
---

# The question this chapter answers

Pretraining teaches a decoder-only model to predict the next token across broad text collections.

That can produce a powerful completion model, but it does not establish one consistent assistant contract.

A raw model has not necessarily learned to:

- follow a user's instruction;
- distinguish user text from assistant text;
- answer in a requested format;
- refuse unsafe requests appropriately;
- prefer a clear response over a merely plausible continuation.

How does post-training shape general next-token capability into assistant-like behaviour?

<div class="big-idea">

**Post-training keeps the language-model machinery but changes the practice. Demonstrations show desired responses, preference pairs compare alternatives, and parameter-efficient methods restrict where the resulting updates are stored.**

</div>

# From pretraining to post-training

A simplified path is:

```text
pretraining
    -> learn broad token patterns and representations

supervised fine-tuning
    -> imitate curated demonstrations

preference optimisation
    -> favour responses judged better than alternatives
```

Not every model uses exactly these stages, and each stage has many variants.

The distinctions matter more than any one recipe.

# Supervised fine-tuning uses demonstrations

A supervised example can look like:

```text
system: You are a concise science tutor.
user: Why does the Moon not fall onto Earth?
assistant: It is continuously falling toward Earth, but its sideways speed makes it keep missing the surface. That curved fall is an orbit.
```

After a chat template and tokenizer serialize the messages, the example becomes one token sequence.

The model still receives shifted next-token targets and cross-entropy loss.

The new ingredient is the curated behaviour represented by the response.

# Chat templates make roles explicit

A chat model does not receive coloured message bubbles. The application converts roles and boundaries into tokens, conceptually like:

```text
<BOS>
<SYSTEM> You are a concise science tutor. <END>
<USER> Why does the Moon not fall onto Earth? <END>
<ASSISTANT> It is continuously falling ... <END>
```

The exact tokens are model-specific.

The template determines:

- where each role begins;
- where each message ends;
- where assistant generation starts;
- which labels may receive loss.

<div class="warning">

## The chat template is part of the interface

Using a different template at inference can place the model in a token pattern it did not practise during fine-tuning.

</div>

# Complete-sequence loss versus response-only loss

Some supervised recipes score every next-token label in the serialized conversation.

Others keep the prompt as context but score only assistant-response labels.

Let:

$$
m_i\in\{0,1\}
$$

be the loss mask for target label \(i\).

The response-only mean can be written as:

$$
\mathcal{L}_{\mathrm{SFT}}
=
\left(\sum_i m_i\mathcal{L}_i\right)
\big/
\left(\sum_i m_i\right)
$$

Masked prompt labels do not receive direct loss, but prompt tokens still affect assistant hidden states through attention.

# An exactly aligned response-mask example

Suppose the sequence has ten conceptual tokens.

The mask below is attached to target tokens: a 1 beside `4` means the prediction of `4` from the preceding position is scored.

| Position | Token | Region | Target-token mask |
|---:|---|---|---:|
| 0 | `<SYS>` | System | 0 |
| 1 | `concise` | System | 0 |
| 2 | `<USR>` | User | 0 |
| 3 | `2` | User | 0 |
| 4 | `+` | User | 0 |
| 5 | `2` | User | 0 |
| 6 | `?` | User | 0 |
| 7 | `<AST>` | Assistant boundary | 0 |
| 8 | `4` | Assistant response | 1 |
| 9 | `<EOS>` | Assistant response | 1 |

If the included losses are:

$$
0.30
\quad\mathrm{and}\quad
0.10
$$

then:

$$
\mathcal{L}_{\mathrm{SFT}}
=(0.30+0.10)/2
=0.20
$$

The boundary token supplies the state used to predict `4`, while the target-token mask selects `4` and `<EOS>` for scoring.

# Demonstration quality becomes behavioural specification

Supervised fine-tuning teaches imitation.

If demonstrations are verbose, inconsistent, unsupported, or overly narrow, the model practises those traits.

High-quality demonstrations can teach:

- tone and formatting;
- response length;
- refusal style;
- tool-call syntax;
- domain terminology;
- step ordering and structure.

Fine-tuning can change style quickly. Reliably installing factual knowledge is harder and should not be treated as a database update operation.

# Why demonstrations are not enough

For many prompts, several responses are acceptable.

One demonstration says:

> Produce something like this answer.

It does not directly distinguish:

- correct but confusing;
- helpful but too long;
- concise but incomplete;
- safe but needlessly refusing;
- fluent but unsupported.

Preference data supplies comparisons.

# Preference pairs and rubrics

A preference example contains:

- prompt \(x\);
- chosen response \(y_c\);
- rejected response \(y_r\).

```text
prompt: Explain why the sky looks blue.

chosen: Short-wavelength blue light is scattered more strongly by air molecules than most visible colours, so blue light reaches our eyes from many directions.

rejected: The sky is blue because it reflects the ocean.
```

A rubric may consider correctness, relevance, clarity, completeness, harmlessness, instruction following, uncertainty, and style.

Different rubrics can rank the same pair differently. Preference data encodes a policy and evaluation process, not one universal definition of goodness.

# Response log-probability

For response tokens:

$$
y=(y_1,y_2,\ldots,y_T)
$$

the policy log-probability is:

$$
\log\pi_{\theta}(y\mid x)
=
\sum_{i=1}^{T}
\log\pi_{\theta}(y_i\mid x,y_{<i})
$$

Long responses contain more summed terms, so implementations must define masking and length treatment explicitly.

# Reward modelling and RLHF

One family of methods trains a reward model:

$$
r_{\phi}(x,y)
$$

A preference likelihood can be written as:

$$
P(y_c\succ y_r\mid x)
=
\sigma
\left(
 r_{\phi}(x,y_c)-r_{\phi}(x,y_r)
\right)
$$

where:

$$
\sigma(a)=1/(1+e^{-a})
$$

A reinforcement-learning stage can optimise the policy for higher reward while constraining movement away from a reference policy.

This broad pipeline is commonly called reinforcement learning from human feedback, or RLHF, when humans provide the preference labels.

# Why constrain the policy?

A policy optimised only for a learned reward can exploit weaknesses in that reward model.

A conceptual regularised objective is:

$$
\mathrm{reward}
-
\beta D_{\mathrm{KL}}
(\pi_{\theta}\,\|\,\pi_{\mathrm{ref}})
$$

The coefficient \(\beta\) controls how strongly the policy is held near the reference.

# Direct preference optimisation

Direct preference optimisation, or DPO, trains directly from chosen and rejected responses.

Define:

$$
\Delta_{\theta}
=
\log\pi_{\theta}(y_c\mid x)
-
\log\pi_{\theta}(y_r\mid x)
$$

and:

$$
\Delta_{\mathrm{ref}}
=
\log\pi_{\mathrm{ref}}(y_c\mid x)
-
\log\pi_{\mathrm{ref}}(y_r\mid x)
$$

A simplified pair loss is:

$$
\mathcal{L}_{\mathrm{DPO}}
=
-
\log\sigma
\left(
\beta(\Delta_{\theta}-\Delta_{\mathrm{ref}})
\right)
$$

The policy is rewarded for preferring the chosen response more strongly than the reference does.

# A small DPO calculation

Suppose:

$$
\log\pi_{\theta}(y_c\mid x)=-1.2,
\qquad
\log\pi_{\theta}(y_r\mid x)=-2.0
$$

Then:

$$
\Delta_{\theta}=0.8
$$

Suppose the reference gives:

$$
\log\pi_{\mathrm{ref}}(y_c\mid x)=-1.4,
\qquad
\log\pi_{\mathrm{ref}}(y_r\mid x)=-1.8
$$

Then:

$$
\Delta_{\mathrm{ref}}=0.4
$$

With:

$$
\beta=0.1
$$

the preference argument is:

$$
0.1(0.8-0.4)=0.04
$$

and:

$$
\mathcal{L}_{\mathrm{DPO}}
=-\log\sigma(0.04)
\approx0.673347
$$

<div class="warning">

## Preference optimisation is not a truth oracle

It optimises the supplied comparisons and objective. Weak rubrics, biased labels, judge errors, and missing edge cases can produce undesirable behaviour even when loss improves.

</div>

# SFT and preference loss teach different things

Supervised fine-tuning says:

> Increase the probability of this demonstrated response.

Preference optimisation says:

> Prefer this response over that alternative, relative to a reference or reward criterion.

Neither makes the other unnecessary.

# Full fine-tuning

Full fine-tuning can update original parameters across embeddings, attention, MLPs, normalisation, and the output head.

It offers high adaptation capacity but requires substantial gradient and optimiser memory and produces a complete new checkpoint.

# Parameter-efficient fine-tuning

Parameter-efficient methods freeze most pretrained parameters and train a smaller new parameter set.

Possible benefits include:

- lower optimiser-state memory;
- smaller saved adapters;
- easier storage of task variants;
- reduced communication for trainable state.

The frozen base still participates in forward and backward computation because signals must pass through it to reach the adapters.

# LoRA adds a low-rank update

For a frozen matrix:

$$
W_0
\in
\mathbb{R}^{d_{\mathrm{in}}\mathbin{×}d_{\mathrm{out}}}
$$

LoRA represents a trainable update as:

$$
\Delta W
=
\alpha r^{-1}AB
$$

where:

$$
A
\in
\mathbb{R}^{d_{\mathrm{in}}\mathbin{×}r}
$$

and:

$$
B
\in
\mathbb{R}^{r\mathbin{×}d_{\mathrm{out}}}
$$

The effective projection is:

$$
y
=
x
\left(
W_0+\alpha r^{-1}AB
\right)
$$

The base \(W_0\) remains frozen. Gradients update \(A\) and \(B\).

# Why low rank saves parameters

A square projection with width 4096 contains:

$$
4096^2=16777216
$$

parameters.

At rank:

$$
r=16
$$

the two adapter matrices contain:

$$
4096\cdot16+16\cdot4096
=131072
$$

parameters.

The ratio is:

$$
131072/16777216
=0.0078125
$$

or about 0.78125% of the base matrix's parameter count.

This excludes other trainable modules and implementation overhead, but it shows the low-rank saving.

# Rank and module choice control capacity

A larger rank increases trainable parameters and the possible rank of the update.

Adapters can target selected attention projections, MLP projections, or other linear layers.

Training fewer modules is cheaper but constrains where adaptation can occur.

# Merging and switching adapters

After training, the update can be merged:

$$
W_{\mathrm{merged}}
=
W_0+\alpha r^{-1}AB
$$

A merged model avoids separate adapter matrix multiplications.

Alternatively, adapters can remain separate so one base model can load different behaviours.

# Quantised bases and adapters

Some systems store the frozen base in a quantised representation while training adapters in higher precision.

This can reduce memory, but quantisation adds approximation, dequantisation behaviour, and kernel constraints.

# Adapters do not eliminate activation memory

Freezing base parameters removes their optimiser-state and parameter-gradient requirements.

Training still needs forward activations, backward signals, adapter gradients, and optimiser state for trainable parameters.

Long contexts and large microbatches can still make activation memory dominant.

# Evaluate improvements and regressions

Post-training can improve instruction following while causing:

- catastrophic forgetting;
- reduced diversity;
- excessive refusals;
- reward hacking;
- style overfitting;
- poorer out-of-distribution behaviour;
- increased confidence without increased correctness.

A post-training suite should test instruction following, factuality, safety, coding or reasoning, multilingual behaviour, long context, adversarial prompts, formatting, and retained base capabilities.

Training loss alone cannot establish assistant quality.

# Human and automated feedback

Human feedback can be expensive, inconsistent, style-sensitive, or limited by annotator expertise.

Automated judges can be scalable and reproducible but may prefer their own style, react to prompt wording, or fail on specialised facts.

A reliable process uses clear rubrics, quality control, diverse tests, and appropriate human oversight.

# Post-training does not remove runtime controls

A deployed application may still use system instructions, filters, tool permissions, retrieval, citation checks, rate limits, monitoring, and human escalation.

Model training and runtime controls address different layers of behaviour and risk.

# A complete post-training path

```text
pretrained model
    -> chat-formatted demonstrations
    -> supervised fine-tuning
    -> instruction-following evaluation
    -> response comparisons
    -> preference optimisation
    -> quality, safety, and regression evaluation
    -> full checkpoint or adapter packaging
```

# Common post-training mistakes

## Mistake 1: saying pretraining directly creates an assistant

Pretraining learns broad continuation behaviour. Assistant conventions require additional examples and objectives.

## Mistake 2: forgetting the chat template

Role tokens and message boundaries are part of the input distribution.

## Mistake 3: assuming ignored prompt labels have no effect

Prompt tokens still provide context through attention.

## Mistake 4: treating one demonstration as the only acceptable answer

Many prompts have several valid responses.

## Mistake 5: calling every preference method RLHF

Some methods use reinforcement learning; others optimise comparisons directly.

## Mistake 6: assuming lower preference loss guarantees truth

The objective reflects the comparisons and rubric.

## Mistake 7: claiming LoRA changes the objective

LoRA changes the trainable parameterisation. SFT or preference loss still defines what is optimised.

## Mistake 8: saying no gradient travels through the frozen base

The base receives no parameter update, but backward signals pass through its computation.

## Mistake 9: equating adapter parameter count with total training memory

Activations and temporary buffers remain.

## Mistake 10: evaluating only target behaviour

Post-training can cause regressions elsewhere.

# Checkpoint

<div class="exercise">

## 1. What objective does supervised fine-tuning commonly use?

Masked next-token cross-entropy over curated demonstrations.

## 2. What does response-only masking ignore?

Direct loss on prompt-region labels. The prompt still supplies context.

## 3. What does a preference pair contain?

A prompt, a chosen response, and a rejected response.

## 4. What does a reward model produce?

A scalar score for a prompt-response pair.

## 5. What does DPO compare?

The chosen-versus-rejected log-probability margin of the trained policy relative to a reference policy.

## 6. Does preference optimisation guarantee factual correctness?

No. It follows the supplied comparisons and objective.

## 7. What stays frozen in LoRA?

The original base weight \(W_0\).

## 8. Which LoRA parameters are trained?

The low-rank matrices \(A\) and \(B\), plus any other deliberately trainable modules.

## 9. How many adapter parameters are used for a \(4096\mathbin{×}4096\) matrix with rank 16?

$$
131072
$$

## 10. Why evaluate regressions after post-training?

Behavioural improvements can reduce capability, calibration, diversity, or safety elsewhere.

</div>

# Chapter takeaway

Supervised fine-tuning imitates demonstrations with masked next-token loss.

Preference optimisation compares chosen and rejected responses.

LoRA restricts updates to low-rank matrices:

$$
W
=
W_0+\alpha r^{-1}AB
$$

In our story:

> **Pretraining teaches the model the language of the world. Demonstrations show it how an assistant should respond. Preferences compare possible replies. Adapters provide a small, replaceable notebook in which to record the new behaviour.**

# Coming next: measure, compress, and deploy

The next part of the book can examine evaluation, quantisation, efficient inference, serving, retrieval augmentation, tool use, grounding, and production safeguards.