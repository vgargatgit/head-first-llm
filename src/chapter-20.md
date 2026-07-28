---
title: "Chapter 20 — From Pretraining to Specialisation"
subtitle: "Foundation models, base checkpoints, continued pretraining, fine-tuning, instruction tuning, adapters, and runtime adaptation"
lang: en
---

# The question this chapter answers

The words surrounding modern models are easy to blur together.

A model may be described as pretrained, foundational, base, instruct, chat, fine-tuned, aligned, adapted, retrieved, or prompted.

Some of those words describe how the weights were learned. Others describe which checkpoint we are holding. Others describe what happens only at runtime.

What exactly changes at each stage, and which terms should not be treated as synonyms?

<div class="big-idea">

**A model lifecycle has three distinct layers: broad training creates reusable capability, weight adaptation changes the checkpoint for narrower behaviour, and runtime conditioning supplies temporary instructions or information without rewriting the weights.**

</div>

# The model-development map

A simplified lifecycle is:

```text
raw data
   ↓
pretraining
   ↓
pretrained base checkpoint
   ├── continued pretraining
   ├── supervised fine-tuning
   ├── instruction tuning
   ├── preference tuning
   └── parameter-efficient adapters

at runtime, any checkpoint may also receive:
   prompts, examples, retrieved documents, tools, or external memory
```

The arrows are not a universal recipe.

Projects may skip stages, repeat stages, combine losses, train jointly, or use several adaptation branches from one shared base.

The map is still useful because it asks the right question at every step:

> **Did the model weights change, or did the application only change the context?**

# Pretraining

Pretraining learns broad statistical structure from large datasets using a scalable objective.

For a decoder-only language model, the objective is often next-token prediction:

$$
\mathcal{L}_{\mathrm{pretrain}}
=
-\sum_t
\log p_\theta(x_t\mid x_{<t})
$$

For an encoder, pretraining may use masked-token reconstruction or another representation objective.

For an encoder–decoder model, pretraining may corrupt an input and train the model to reconstruct or transform it.

For multimodal systems, pretraining may combine contrastive, matching, captioning, reconstruction, or generative objectives.

Pretraining is not defined by one architecture or one loss. It is the broad capability-building stage before narrower adaptation.

# What pretraining can teach

Large-scale pretraining can produce reusable abilities such as:

- syntax and local language patterns;
- semantic associations;
- factual correlations represented imperfectly in parameters;
- broad task patterns;
- code structure;
- multilingual correspondences;
- visual or acoustic features in multimodal systems;
- in-context pattern completion.

The model does not store a clean database of sentences. Training adjusts distributed parameters so that many contexts lead to useful probability distributions.

# The pretrained or base model

The checkpoint produced by broad pretraining is often called a **pretrained model** or **base model**.

For a decoder-only model, a base checkpoint may be very good at continuation but unreliable as an assistant.

Given:

```text
Write three reasons to recycle:
```

it might answer appropriately, continue with another example, imitate nearby web text, or drift into a different format.

The base model has capability, but it has not necessarily practised one stable interaction contract.

# Foundation model

A **foundation model** is a broadly trained model intended to support many downstream tasks, applications, or adaptations.

The term highlights two properties:

1. broad training creates reusable capability;
2. many later systems are built on top of the same model.

A foundation model is not necessarily:

- a language model;
- decoder-only;
- a chatbot;
- publicly released;
- the largest model available;
- safe for every downstream use.

A vision model, audio model, multimodal model, or scientific model can also serve as a foundation.

<div class="warning">

## Foundation does not mean finished

A building foundation is valuable because other structures depend on it. It is also incomplete. Errors, biases, limitations, and security weaknesses can propagate into many adapted systems.

</div>

# Architecture and lifecycle are different axes

Consider these labels:

```text
encoder-only      -> architecture
base               -> checkpoint stage
domain-adapted     -> training history
instruction-tuned  -> adaptation objective
chat               -> interaction behaviour
foundation model   -> broad reusable role
multimodal         -> supported modalities
quantised          -> numerical representation
```

One checkpoint can have several labels at once.

For example, a model may be:

> decoder-only, pretrained, instruction-tuned, multimodal, quantised, and deployed with retrieval.

No single label replaces the others.

# Continued pretraining

Continued pretraining resumes a broad pretraining-style objective from an existing checkpoint.

The new data may be:

- more recent;
- from a specialised domain;
- in a new language;
- cleaned differently;
- longer-context;
- code-heavy;
- organisation-specific.

If the original objective was causal next-token prediction, continued pretraining may keep that objective while changing the data distribution.

Conceptually:

$$
\theta_{\mathrm{new}}
=
\operatorname{Train}
(\theta_{\mathrm{base}},D_{\mathrm{domain}},
\mathcal{L}_{\mathrm{causal}})
$$

This is often called domain-adaptive or task-adaptive pretraining when the data is selected for a domain or downstream setting.

# Continued pretraining versus fine-tuning

The boundary is sometimes fuzzy, but the intent differs.

| Question | Continued pretraining | Fine-tuning |
|---|---|---|
| Main aim | Extend broad modelling of a data distribution | Improve a narrower task, format, or behaviour |
| Typical data | Unlabelled or naturally occurring domain text | Labelled examples, demonstrations, preferences, or task records |
| Typical objective | Same or similar to pretraining | Task-specific or behaviour-specific objective |
| Output | More domain-adapted base capability | A specialised checkpoint or adapter |

A project should describe the actual data and objective instead of relying only on the label.

# Fine-tuning

Fine-tuning starts from a pretrained checkpoint and updates parameters for a narrower purpose.

Examples include:

- sentiment classification;
- medical coding;
- legal document extraction;
- summarisation;
- translation;
- response formatting;
- tool-call syntax;
- domain-specific assistant behaviour.

The fine-tuning objective may be classification loss, token-level loss, sequence loss, ranking loss, preference loss, or a combination.

# Full fine-tuning

Full fine-tuning allows updates across most or all original model parameters.

A gradient step is still:

$$
\theta
\leftarrow
\theta-\eta\nabla_\theta\mathcal{L}
$$

The difference from pretraining is the data, objective, scale, and intended behaviour.

Full fine-tuning offers high adaptation capacity but requires substantial memory for gradients and optimiser state and produces a complete new checkpoint.

# Supervised fine-tuning

Supervised fine-tuning, or SFT, learns from input–target examples.

For an assistant:

```text
instruction + context
        ↓
desired response
```

The common language-model implementation still uses next-token cross-entropy, often with a loss mask that scores only the desired response region.

$$
\mathcal{L}_{\mathrm{SFT}}
=
-\frac{1}{\sum_i m_i}
\sum_i m_i
\log p_\theta(y_i\mid x,y_{<i})
$$

SFT teaches imitation of the supplied demonstrations.

# Instruction tuning

Instruction tuning is supervised fine-tuning on a diverse collection of instructions and responses.

The goal is not merely to master one task. It is to practise the general pattern:

```text
read an instruction
identify the requested operation
produce an appropriate response
```

Instruction-tuning data may mix writing, extraction, classification, reasoning, dialogue, coding, formatting, and tool-use examples.

The breadth and consistency of the data strongly shape generalisation.

# Chat tuning

Chat tuning uses conversation-formatted examples with role boundaries such as system, user, assistant, and tool.

A chat template converts those roles into model-specific tokens.

Chat is therefore not a new architecture family. It is an interface and training distribution layered on top of an architecture.

# Preference tuning

Preference tuning uses comparisons or reward signals to favour some responses over others.

A preference record may contain:

$$
(x,y_c,y_r)
$$

where $y_c$ is chosen and $y_r$ is rejected.

Methods include reward-model-based reinforcement learning and direct comparison objectives such as DPO.

Preference tuning can shape helpfulness, style, safety behaviour, brevity, formatting, and other rubric-defined properties.

It does not automatically create factual truth. The result follows the quality and coverage of the feedback process.

# Parameter-efficient fine-tuning

Parameter-efficient fine-tuning, or PEFT, freezes most base parameters and trains a smaller set.

Examples include:

- LoRA adapters;
- prefix or prompt parameters;
- bottleneck adapters;
- selected-layer tuning;
- bias-only updates;
- other low-dimensional update methods.

For LoRA:

$$
W
=
W_0+\frac{\alpha}{r}AB
$$

The base matrix $W_0$ stays frozen while low-rank matrices $A$ and $B$ are trained.

PEFT changes **where** updates are stored. The training objective still determines **what** behaviour is learned.

# QLoRA

QLoRA combines a quantised frozen base model with trainable low-rank adapters.

Conceptually:

```text
quantised base weights: frozen
adapter weights: trainable at higher precision
activations and gradients: still required
```

The technique can reduce memory pressure for adaptation, but it does not make training free. Activation memory, temporary buffers, adapter gradients, and optimiser state remain.

# Prompting

Prompting supplies instructions, examples, or context at runtime without updating weights.

```text
same checkpoint
+ different prompt
= different temporary behaviour
```

Prompting can be extremely flexible, but the effect disappears when the context is removed.

The model has not permanently learned the new instruction through gradient descent.

# In-context learning

In-context learning uses demonstrations inside the prompt.

```text
input: 2 + 3
output: 5

input: 4 + 6
output: 10

input: 7 + 8
output:
```

The model conditions on the pattern and predicts a continuation.

No parameter update is required during ordinary inference.

In-context learning is therefore runtime adaptation, not fine-tuning.

# Retrieval-augmented generation

Retrieval-augmented generation, or RAG, fetches external documents and adds relevant material to the model context.

The weights remain unchanged during ordinary retrieval and generation.

```text
question
  -> retrieve documents
  -> assemble context
  -> generate grounded answer
```

RAG can update available information without retraining the model, but it introduces new failure points: retrieval quality, document freshness, access control, prompt injection, citation alignment, and context limits.

# Tool use

Tool use lets a model request an external operation such as:

- calculator execution;
- database lookup;
- web search;
- code execution;
- calendar access;
- file retrieval;
- transaction initiation.

The model generally generates a structured call. An application validates and executes it, then returns a result to the model.

Tool use is an orchestration pattern. It is not proof that the model weights contain the tool’s information or capability.

# What changes the weights?

| Method | Weights change? | New information persists without context? | Typical purpose |
|---|---:|---:|---|
| Pretraining | Yes | Yes, imperfectly | Broad capability |
| Continued pretraining | Yes | Yes, imperfectly | New domain or distribution |
| Full fine-tuning | Yes | Yes | Narrow task or behaviour |
| LoRA or PEFT | Adapter weights change | Yes when adapter is loaded | Efficient specialisation |
| Preference tuning | Yes | Yes | Response ranking and policy shaping |
| Prompting | No | No | Temporary instruction |
| In-context examples | No | No | Temporary task pattern |
| RAG | No model-weight change | Documents remain external | Fresh or private grounding |
| Tool use | No model-weight change | Tool result is runtime context | External action or computation |

# A decision tree

Ask these questions in order.

## 1. Is the problem missing information or missing behaviour?

If the information changes frequently or lives in a private database, retrieval may be better than trying to bake it into weights.

If the model understands the domain but responds in the wrong format, SFT or prompting may be enough.

## 2. Must the change persist across requests?

If no, use prompting, examples, retrieval, or tools.

If yes, consider continued pretraining, fine-tuning, or an adapter.

## 3. Do you have high-quality training data?

Fine-tuning magnifies the data specification. A small clean dataset can be more valuable than a large inconsistent one.

## 4. Must the base remain reusable?

Adapters allow one base to support several specialised behaviours.

## 5. How will regressions be measured?

Every weight update can improve a target behaviour while damaging other capabilities.

# A lifecycle example

Suppose an organisation wants a support assistant.

A sensible path might be:

```text
1. Start with a broadly pretrained base model.
2. Choose an instruction-tuned checkpoint if general chat behaviour is useful.
3. Use retrieval for current product documentation.
4. Add a tool for account-specific actions.
5. Fine-tune or train an adapter for stable response format and escalation policy.
6. Use preference data to improve response quality where demonstrations are insufficient.
7. Evaluate factuality, access control, tool safety, latency, and regressions.
```

Trying to solve every requirement through fine-tuning would make current documentation hard to update.

Trying to solve every requirement through prompting could produce inconsistent behaviour.

A layered design assigns each problem to the mechanism best suited for it.

# Catastrophic forgetting

Fine-tuning on a narrow distribution can reduce performance elsewhere.

The model may over-specialise, lose multilingual ability, become stylistically repetitive, or forget rare behaviours.

Mitigations can include:

- mixing general and domain data;
- smaller learning rates;
- fewer update steps;
- regularisation;
- adapters;
- replay data;
- broad regression testing.

No mitigation removes the need to evaluate.

# Data governance travels through the lifecycle

At every stage, ask:

- Is the data licensed or authorised?
- Does it contain personal or confidential information?
- Can deletion or correction requests be honoured?
- Could memorisation expose sensitive examples?
- Are annotations consistent and appropriately reviewed?
- Are downstream users told what the model was trained or adapted on?

A model-development diagram without data provenance is incomplete.

# Common lifecycle mistakes

## Mistake 1: calling every pretrained model a foundation model

A narrowly pretrained model may not be intended for broad downstream adaptation.

## Mistake 2: calling prompting fine-tuning

Prompting changes context, not weights.

## Mistake 3: calling RAG training

Ordinary RAG retrieves external information at runtime.

## Mistake 4: assuming a base model is already a chat assistant

Assistant behaviour usually requires post-training, templates, or orchestration.

## Mistake 5: saying LoRA is a new loss function

LoRA is a parameterisation of the update. SFT or preference loss still defines the objective.

## Mistake 6: treating continued pretraining as guaranteed factual updating

The model learns statistical patterns. It does not become a perfectly editable database.

## Mistake 7: using fine-tuning for rapidly changing facts

Retrieval is often easier to refresh, inspect, and cite.

## Mistake 8: assuming runtime tools are safe because the model requested them

The application must validate permissions, arguments, and consequences.

# Checkpoint

<div class="exercise">

## 1. What is pretraining?

Broad capability learning from large datasets using a scalable objective.

## 2. What is a base model?

A checkpoint produced by pretraining before narrower adaptation.

## 3. What makes a model a foundation model?

Broad training and intended reuse across many downstream tasks or applications.

## 4. Does foundation model specify encoder-only or decoder-only?

No. Architecture is a separate axis.

## 5. What is continued pretraining?

Further training with a pretraining-style objective, often on new, recent, or domain-specific data.

## 6. What is instruction tuning?

Supervised fine-tuning on diverse instruction–response examples.

## 7. Does LoRA change the objective?

No. It changes where trainable updates are represented.

## 8. Do prompts permanently change model weights?

No.

## 9. When is retrieval attractive?

When information is current, private, inspectable, citeable, or frequently updated.

## 10. Why is regression testing necessary after fine-tuning?

Specialisation can damage capabilities outside the target dataset.

</div>

# Chapter takeaway

Pretraining creates broad capability.

A base checkpoint is the resulting starting point.

A foundation model is broadly reusable across downstream systems.

Continued pretraining and fine-tuning change weights. Prompting, retrieval, and tools change runtime context or available actions.

In our story:

> **Pretraining builds the general-purpose workshop. Fine-tuning retrains part of the crew for a specialised job. Adapters are removable instruction notebooks. Prompts are today’s work order. Retrieval opens the current manual. Tools let the crew operate machines outside the workshop.**

# Coming next: open book, closed book, or tool belt?

The next chapter examines runtime grounding in detail: parametric memory, prompts, embeddings, retrieval, reranking, context assembly, citations, tools, and the new failure modes introduced by external information.

# Further reading

- [On the Opportunities and Risks of Foundation Models](https://arxiv.org/abs/2108.07258)
- [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer](https://arxiv.org/abs/1910.10683)
- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
