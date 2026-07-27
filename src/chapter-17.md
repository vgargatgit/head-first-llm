---
title: "Chapter 17 — From Completion Machine to Helpful Assistant"
subtitle: "How supervised fine-tuning, preference optimisation, and LoRA shape pretrained behaviour"
lang: en
---

# The question this chapter answers

Chapters 12–16 explained how a decoder-only model learns next-token prediction from large text collections.

That objective can produce a powerful completion model.

But a raw completion model has not necessarily learned to:

- follow a user's instruction;
- distinguish user text from assistant text;
- answer in a requested format;
- refuse unsafe requests appropriately;
- prefer a clear and useful response over a merely plausible continuation.

How does post-training turn general next-token capability into assistant-like behaviour?

<div class="big-idea">

**Post-training does not replace next-token prediction. It changes the examples and objectives so the model practises desired conversational behaviour, then uses preference signals to distinguish better responses from worse ones.**

</div>

# Cold open: pretraining saw conversations, not a job description

A pretrained model may have encountered dialogue on the web.

It can continue patterns such as:

```text
User: Explain gravity simply.
Assistant:
```

But ordinary pretraining does not provide one consistent contract saying:

> The text after `User` is an instruction, and the text after `Assistant` should be helpful, truthful, relevant, and safe.

The corpus contains many styles, intentions, and quality levels.

Post-training constructs more deliberate examples.

# Three stages with different roles

A simplified modern training path can be described as:

```text
pretraining
    -> learn broad token patterns and representations

supervised fine-tuning
    -> imitate curated demonstrations

preference optimisation
    -> favour responses judged better than alternatives
```

Not every model uses exactly these stages, and each stage has many variants.

The distinctions are more important than any one recipe.

# Supervised fine-tuning uses demonstrations

A supervised fine-tuning example contains an input and a desired response.

```text
system: You are a concise science tutor.
user: Why does the Moon not fall onto Earth?
assistant: It is continuously falling toward Earth, but its sideways speed makes it keep missing the surface. That curved fall is an orbit.
```

After applying the model's chat template and tokenizer, the conversation becomes one token sequence.

The training system creates shifted next-token targets exactly as in Chapter 12.

Cross-entropy remains the core objective.

# Chat templates make roles explicit

A chat model does not receive coloured message bubbles.

The application serialises roles and boundaries into tokens, conceptually like:

```text
<BOS>
<SYSTEM> You are a concise science tutor. <END>
<USER> Why does the Moon not fall onto Earth? <END>
<ASSISTANT> It is continuously falling ... <END>
```

The exact control tokens are tokenizer- and model-specific.

The template determines:

- where each role begins;
- where each message ends;
- where the assistant should start generating;
- which tokens may receive training loss.

<div class="warning">

## The chat template is part of the model interface

Using a different template at inference can place the model in a token pattern it did not practise during fine-tuning.

</div>

# Which tokens receive supervised loss?

There are two common conceptual choices.

## Loss on the complete sequence

The model is trained to predict system, user, and assistant tokens.

## Response-only loss

System and user tokens provide context, but only assistant-response tokens contribute to the objective.

Let a token-level mask be:

$$
m_i
\in
\{0,1\}
$$

The masked loss is:

$$
\mathcal{L}_{\mathrm{SFT}}
=
\frac{
\sum_i m_i\mathcal{L}_i
}{
\sum_i m_i
}
$$

For response-only training:

```text
system tokens:    mask 0
user tokens:      mask 0
assistant tokens: mask 1
```

The masked prompt still affects the assistant hidden states through attention. It simply does not receive direct next-token loss.

# A small response-mask example

Suppose the tokenised conversation is:

```text
<SYS> concise <USR> 2 + 2 ? <AST> 4 <EOS>
```

Use the mask:

```text
0     0       0     0 0 0   0     1 1
```

If the two assistant-region token losses are:

$$
0.30
\quad\mathrm{and}\quad
0.10
$$

then:

$$
\mathcal{L}_{\mathrm{SFT}}
=
\frac{0.30+0.10}{2}
=0.20
$$

The prompt tokens influence the prediction of `4`, but their own labels are ignored by this objective.

# Demonstration quality matters

Supervised fine-tuning teaches imitation.

If demonstrations are:

- verbose, the model practises verbosity;
- inconsistent, the model practises inconsistency;
- unsupported, the model practises unsupported claims;
- well structured, the model practises useful structure;
- narrow, the model can over-specialise.

Data curation is therefore behavioural specification.

# Fine-tuning can change style faster than knowledge

A small set of demonstrations can strongly change:

- tone;
- formatting;
- response length;
- refusal style;
- tool-call syntax;
- domain vocabulary.

Adding reliable factual knowledge is harder.

A model may memorise new facts, but fine-tuning alone does not guarantee that facts are:

- recalled consistently;
- updated cleanly without conflicts;
- cited correctly;
- protected from later forgetting.

Post-training should not be described as a database update API.

# Why demonstrations are not enough

For many prompts, several responses can be acceptable.

A single demonstration says:

> Produce something like this answer.

It does not directly teach fine distinctions between alternatives such as:

- correct but confusing;
- helpful but too long;
- concise but incomplete;
- safe but needlessly refusing;
- fluent but factually unsupported.

Preference data supplies comparisons.

# Preference pairs

A preference example contains:

- a prompt \(x\);
- a chosen response \(y_c\);
- a rejected response \(y_r\).

```text
prompt: Explain why the sky looks blue.

chosen: Short-wavelength blue light is scattered more strongly by air molecules than most visible colours, so blue light reaches our eyes from many directions.

rejected: The sky is blue because it reflects the ocean.
```

The label says the chosen response is preferred under the annotation criteria.

It does not automatically reveal why unless rationale or rubric information is also collected.

# Preferences depend on a rubric

Annotators or automated judges need criteria.

A rubric may consider:

- correctness;
- relevance;
- clarity;
- completeness;
- harmlessness;
- instruction following;
- calibrated uncertainty;
- style requirements.

Different rubrics can rank the same two responses differently.

Preference data is therefore not a universal measure of goodness. It encodes a particular policy and evaluation process.

# The sequence log-probability of a response

For response tokens:

$$
y=(y_1,y_2,\ldots,y_T)
$$

conditioned on prompt \(x\), the model's response log-probability is:

$$
\log\pi_{\theta}(y\mid x)
=
\sum_{i=1}^{T}
\log\pi_{\theta}
(y_i\mid x,y_{<i})
$$

Long responses contain more summed terms, so implementations must be explicit about whether they use sums, averages, length normalisation, or other adjustments.

# Reward modelling and RLHF

One family of methods first trains a reward model from comparisons.

The reward model learns a scalar score:

$$
r_{\phi}(x,y)
$$

A preference likelihood can be written using the chosen and rejected reward difference:

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
\sigma(a)=\frac{1}{1+e^{-a}}
$$

A reinforcement-learning stage can then optimise the policy to obtain higher reward while constraining it from moving too far from a reference policy.

This broad pipeline is commonly called reinforcement learning from human feedback, or RLHF, when humans provide the underlying preference labels.

# Why constrain the policy?

If optimisation pursues only a learned reward score, the policy can exploit weaknesses in the reward model.

A reference-policy constraint discourages extreme movement away from a known model.

One common regularised objective has the conceptual form:

$$
\mathrm{reward}
-
\beta
D_{\mathrm{KL}}
(\pi_{\theta}\,\|\,\pi_{\mathrm{ref}})
$$

The coefficient \(\beta\) controls the strength of the reference constraint.

A larger constraint preserves more reference behaviour but can limit adaptation.

# Direct preference optimisation

Direct preference optimisation, or DPO, is one approach that trains the policy directly from chosen and rejected responses without first using the reward model as a separately deployed optimisation target.

Define the policy log-probability margin:

$$
\Delta_{\theta}
=
\log\pi_{\theta}(y_c\mid x)
-
\log\pi_{\theta}(y_r\mid x)
$$

and the reference margin:

$$
\Delta_{\mathrm{ref}}
=
\log\pi_{\mathrm{ref}}(y_c\mid x)
-
\log\pi_{\mathrm{ref}}(y_r\mid x)
$$

A simplified per-pair DPO loss is:

$$
\mathcal{L}_{\mathrm{DPO}}
=
-\log
\sigma
\left(
\beta
(\Delta_{\theta}-\Delta_{\mathrm{ref}})
\right)
$$

The objective rewards the policy for preferring the chosen response more strongly than the reference policy does.

# A small DPO calculation

Suppose the current policy assigns:

$$
\log\pi_{\theta}(y_c\mid x)=-1.2
$$

and:

$$
\log\pi_{\theta}(y_r\mid x)=-2.0
$$

Then:

$$
\Delta_{\theta}
=-1.2-(-2.0)
=0.8
$$

Suppose the reference policy gives:

$$
\log\pi_{\mathrm{ref}}(y_c\mid x)=-1.4
$$

and:

$$
\log\pi_{\mathrm{ref}}(y_r\mid x)=-1.8
$$

Then:

$$
\Delta_{\mathrm{ref}}
=-1.4-(-1.8)
=0.4
$$

With:

$$
\beta=0.1
$$

the preference argument is:

$$
0.1(0.8-0.4)=0.04
$$

Therefore:

$$
\mathcal{L}_{\mathrm{DPO}}
=-\log\sigma(0.04)
\approx0.673347
$$

The policy already prefers the chosen response, but the reference comparison determines how much stronger that preference is relative to the starting point.

<div class="warning">

## Preference optimisation is not a truth oracle

It optimises the supplied comparisons and objective. Biased labels, weak rubrics, judge errors, or missing edge cases can produce undesirable behaviour even when training loss improves.

</div>

# SFT and preference loss teach different things

Supervised fine-tuning says:

> Increase the probability of this demonstrated response.

Preference optimisation says:

> Prefer this response over that alternative, relative to a reference or reward criterion.

They can be combined, alternated, or weighted in different recipes.

A preference method does not remove the need for high-quality demonstrations, and SFT does not make pairwise judgement unnecessary.

# Full fine-tuning updates every selected parameter

In full fine-tuning, gradients can update the model's original weights across:

- embeddings;
- attention projections;
- MLPs;
- normalisation parameters;
- output head.

This offers high adaptation capacity but requires substantial memory for gradients and optimiser state.

It also creates a complete new model checkpoint.

# Parameter-efficient fine-tuning

Parameter-efficient methods keep most pretrained parameters frozen and train a much smaller set of new parameters.

Benefits can include:

- lower optimiser-state memory;
- smaller saved adapters;
- easier storage of many task variants;
- reduced communication for trainable state.

The frozen base model still participates in forward and backward computation because gradients must pass through its operations to reach the trainable adapters.

# LoRA adds a low-rank update

For a frozen weight matrix:

$$
W_0
\in
\mathbb{R}^{d_{\mathrm{in}}\mathbin{×}d_{\mathrm{out}}}
$$

LoRA represents the trainable update as:

$$
\Delta W
=
\frac{\alpha}{r}AB
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
W_0+rac{\alpha}{r}AB
\right)
$$

The base \(W_0\) remains frozen. Gradients update \(A\) and \(B\).

# Why low rank saves parameters

A square projection with:

$$
d_{\mathrm{in}}=d_{\mathrm{out}}=4096
$$

contains:

$$
4096^2
=
16777216
$$

parameters.

With LoRA rank:

$$
r=16
$$

the two adapter matrices contain:

$$
4096\cdot16
+
16\cdot4096
=
131072
$$

trainable parameters.

The ratio is:

$$
\frac{131072}{16777216}
=0.0078125
$$

or about 0.78125% of the base matrix's parameter count.

This comparison excludes other trainable modules and implementation overhead, but it shows the low-rank saving.

# Rank controls adapter capacity

A larger rank \(r\):

- increases trainable parameters;
- increases adapter memory and compute;
- allows a higher-rank weight update.

A smaller rank is cheaper but may not express the required change.

Rank is a capacity choice, not a direct quality guarantee.

# Where LoRA can be attached

Adapters can be applied to selected projections such as:

- Query and Value matrices;
- all attention projections;
- MLP up and down projections;
- output heads or other linear layers.

Training only a few modules is cheaper but constrains where the model can adapt.

The module selection is part of the experiment.

# Merging a LoRA adapter

After training, the low-rank update can be combined with the base weight:

$$
W_{\mathrm{merged}}
=
W_0+rac{\alpha}{r}AB
$$

A merged model can run without separate adapter matrix multiplications.

Alternatively, adapters can remain separate so one base model can load different behaviours.

Merging changes deployment packaging, not the mathematical result when precision and scaling are handled consistently.

# Quantised bases and adapters

Some fine-tuning systems store the frozen base model in a quantised representation while training adapters in a higher precision.

This can reduce memory substantially.

The important distinction is:

- base weights are quantised and frozen;
- adapter parameters remain trainable;
- computation may temporarily use dequantised values or specialised kernels.

Quantisation introduces approximation and implementation constraints. It is not identical to ordinary full-precision LoRA.

# Adapters do not eliminate activation memory

Freezing base parameters removes their optimiser-state and gradient-storage requirements.

But training still needs:

- forward activations;
- backward signals through the network;
- trainable adapter gradients;
- optimiser state for adapters.

Long context lengths and large microbatches can still make activation memory the dominant cost.

# Behaviour changes can have side effects

Post-training can improve instruction following while degrading other capabilities.

Potential effects include:

- catastrophic forgetting;
- reduced diversity;
- excessive refusals;
- reward hacking;
- style overfitting;
- poorer performance outside the fine-tuning distribution;
- increased confidence without increased correctness.

Evaluation must cover both desired improvements and regressions.

# Build separate evaluation sets

A post-training evaluation suite can include:

- instruction-following tests;
- factuality checks;
- safety and refusal behaviour;
- coding or reasoning tasks;
- multilingual prompts;
- long-context cases;
- adversarial or ambiguous requests;
- style and formatting requirements;
- regression tests from pretraining capabilities.

Training loss alone cannot establish assistant quality.

# Offline preference accuracy is limited

A preference model can report how often it ranks held-out chosen responses above rejected responses.

That metric does not fully measure:

- open-ended generation quality;
- robustness to new prompt types;
- calibration;
- factual correctness;
- user satisfaction;
- safety under adversarial interaction.

Generated-output evaluation remains necessary.

# Human and automated feedback have different failure modes

Human feedback can be:

- expensive;
- inconsistent;
- influenced by presentation style;
- limited by annotator expertise.

Automated judges can be:

- scalable;
- reproducible;
- biased toward their own preferred style;
- vulnerable to prompt wording;
- incorrect on specialised facts.

A reliable process uses clear rubrics, quality control, diverse tests, and appropriate human oversight.

# Post-training does not remove inference controls

Even a well-aligned model still operates inside a system.

The deployed application may use:

- system instructions;
- input and output filters;
- tool permissions;
- retrieval systems;
- citation checks;
- rate limits;
- monitoring;
- human escalation.

Model training and runtime controls address different layers of behaviour and risk.

# A complete post-training path

```text
pretrained model
    -> prepare chat-formatted demonstrations
    -> supervised fine-tuning
    -> evaluate instruction-following baseline
    -> collect or generate response comparisons
    -> apply preference optimisation
    -> evaluate quality, safety, and regressions
    -> optionally package full weights or adapters
```

The actual path can include several rounds of data collection and model evaluation.

# Common post-training mistakes

## Mistake 1: saying pretraining directly creates an assistant

Pretraining learns continuation ability from broad text. Assistant behaviour requires additional conventions and examples.

## Mistake 2: forgetting the chat template

Role tokens and message boundaries are part of the input distribution.

## Mistake 3: assuming ignored prompt tokens have no effect

They still provide context through attention.

## Mistake 4: treating one demonstration as the only acceptable answer

Many prompts have several valid responses.

## Mistake 5: calling every preference method RLHF

Some methods use human labels and reinforcement learning; others optimise preferences directly or use automated feedback.

## Mistake 6: assuming a lower preference loss guarantees truth

The objective reflects the quality of comparisons and rubric.

## Mistake 7: claiming LoRA changes the objective

LoRA changes the trainable parameterisation. SFT or preference loss still defines what is optimised.

## Mistake 8: saying LoRA trains no gradients through the base network

The frozen base receives no parameter update, but backward signals pass through its computation to train adapters.

## Mistake 9: assuming adapter parameter count equals total training memory

Activations and temporary buffers can remain large.

## Mistake 10: evaluating only the target behaviour

Post-training can cause regressions elsewhere.

# Checkpoint

<div class="exercise">

## 1. What objective does supervised fine-tuning commonly use?

Masked next-token cross-entropy over curated demonstrations.

## 2. What does response-only masking ignore?

Direct loss on prompt-region tokens. The prompt still supplies context.

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

The low-rank matrices \(A\) and \(B\), plus any other modules deliberately left trainable.

## 9. How many LoRA parameters are used for a \(4096\mathbin{×}4096\) matrix with rank 16?

$$
131072
$$

## 10. Why evaluate regressions after post-training?

Behavioural improvements can reduce capability, calibration, diversity, or safety in other distributions.

</div>

# Chapter takeaway

Supervised fine-tuning imitates demonstrations using masked next-token loss:

$$
\mathcal{L}_{\mathrm{SFT}}
=
\frac{\sum_i m_i\mathcal{L}_i}{\sum_i m_i}
$$

Preference optimisation compares chosen and rejected responses. Parameter-efficient methods such as LoRA restrict updates to a small low-rank parameter set:

$$
W
=
W_0+rac{\alpha}{r}AB
$$

In our story:

> **Pretraining teaches the model the language of the world. Demonstrations show it how an assistant should respond. Preferences compare possible replies. Adapters provide a small, replaceable notebook in which to record the new behaviour.**

# Coming next: measure, compress, and deploy

The model now has an architecture, a training process, and assistant-like post-training.

The next part of the book can examine:

- evaluation and benchmark design;
- quantisation and efficient inference;
- batching, latency, throughput, and serving;
- retrieval-augmented generation and tool use;
- hallucination, grounding, and production safeguards.