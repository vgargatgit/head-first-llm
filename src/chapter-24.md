---
title: "Chapter 24 — Trust, but Verify"
subtitle: "Evaluation, calibration, hallucination, bias, privacy, safety, contamination, and production monitoring"
lang: en
---

# The question this chapter answers

A model can produce impressive examples and still fail unpredictably.

A benchmark score can rise while factuality falls. A safer model can become less useful. A compressed model can preserve average accuracy while breaking tool syntax. A retrieval system can quote real documents but cite the wrong passage. A production model can drift even when its weights never change because the users, data, tools, and environment change around it.

How do we decide whether an LLM system is actually ready for its intended use?

<div class="big-idea">

**Evaluation is not one benchmark and not one final test. It is a continuing measurement system that connects a specific use case to capability, reliability, safety, privacy, efficiency, and real production outcomes.**

</div>

# Meet the Evaluation Clinic

The model enters a clinic with several specialists.

```text
Capability Examiner  -> Can it do the task?
Reliability Inspector-> Does it behave consistently?
Grounding Auditor    -> Are claims supported?
Calibration Nurse    -> Does confidence match correctness?
Safety Reviewer      -> Can it cause harm or misuse?
Privacy Officer      -> Does it expose protected data?
Operations Monitor   -> What happens in production?
```

A single score cannot replace the whole clinic.

# Start with the decision, not the benchmark

Before choosing a dataset, define:

- who will use the system;
- what decision or action it supports;
- what inputs it will receive;
- what outputs are acceptable;
- what errors are tolerable;
- what errors are catastrophic;
- whether humans review the output;
- whether the system can take actions;
- what latency and cost limits apply;
- what laws, policies, or contracts apply.

The same model can be acceptable for brainstorming and unacceptable for autonomous medical advice.

# Evaluate the whole system

A deployed LLM application may include:

```text
user interface
prompt template
retriever
reranker
model
safety filters
tools
permission checks
citation renderer
post-processing
human review
monitoring
```

Testing only the base model misses interactions among these components.

A retrieval bug can look like a model hallucination. A prompt-template change can look like a capability regression. A tool schema mismatch can look like reasoning failure.

# Build an evaluation matrix

Organise tests along at least four axes.

## Tasks

Examples: summarisation, extraction, question answering, code generation, classification, tool use.

## User and data slices

Examples: language, region, domain, document type, input length, accessibility need, device, customer tier.

## Failure modes

Examples: hallucination, refusal, leakage, bias, prompt injection, formatting error, stale retrieval.

## Operating conditions

Examples: long context, high load, missing documents, tool timeout, low-quality image, conflicting evidence.

The matrix prevents one easy benchmark from standing in for the actual deployment.

# Offline and online evaluation

## Offline evaluation

Runs on a fixed dataset before or between releases.

Benefits:

- reproducibility;
- fast comparison;
- controlled labels;
- regression tracking;
- safe testing of dangerous cases.

Limitations:

- datasets become stale;
- benchmarks may be contaminated;
- synthetic prompts may not match real users;
- fixed metrics may miss emergent behaviour.

## Online evaluation

Measures real or staged production behaviour.

Examples include:

- A/B tests;
- shadow deployments;
- human review queues;
- user-correction rates;
- task completion;
- escalation rates;
- tool success;
- latency and cost;
- incident reports.

Online experiments require guardrails because users bear the consequences of mistakes.

# Capability metrics

The metric should match the task.

## Classification

Possible metrics:

- accuracy;
- precision;
- recall;
- F1;
- area under a curve;
- cost-weighted error.

## Extraction

Possible metrics:

- exact match;
- token-level F1;
- field-level precision and recall;
- schema validity.

## Generation

Possible metrics:

- human rubric scores;
- factual consistency;
- groundedness;
- completeness;
- style adherence;
- edit distance;
- task-specific success.

Automatic overlap metrics can be useful but may reward wording similarity rather than correctness.

## Code and tools

Possible metrics:

- unit-test pass rate;
- compilation success;
- execution correctness;
- tool-call schema validity;
- argument accuracy;
- side-effect safety.

# Accuracy is not enough

Suppose a model answers 90% of routine questions correctly but fails nearly every question for one language or one document type.

The overall average hides the failure.

Always inspect slices such as:

- short versus long prompts;
- common versus rare categories;
- majority versus minority languages;
- clean versus noisy input;
- familiar versus new domains;
- seen versus unseen templates;
- authorised versus unauthorised requests.

# Hallucination

A hallucination is generated content that is unsupported, incorrect, or inconsistent with the available evidence or task constraints.

Different settings need different definitions.

## Closed-book factuality

Is the claim correct according to an external reference?

## Summarisation faithfulness

Is every claim supported by the source document?

## RAG groundedness

Is every answer claim supported by the retrieved passages?

## Tool-use faithfulness

Does the explanation match the actual tool result?

## Creative generation

Invented content may be expected. The failure is violating requested facts or constraints, not imagination itself.

# Claim-level groundedness

Long answers should be broken into atomic claims.

For each claim, label:

- supported;
- contradicted;
- not found;
- subjective or not externally verifiable.

An answer-level label can hide one dangerous unsupported sentence inside an otherwise correct response.

# Abstention and selective answering

A reliable system should sometimes say:

> The supplied evidence is insufficient.

Let coverage be the fraction of questions the system answers, and risk be the error rate among answered questions.

A selective system can trade coverage for lower risk by abstaining when confidence or evidence is weak.

The correct threshold depends on the cost of errors and the availability of human review.

# Calibration

A system is calibrated when events assigned probability $p$ occur about $p$ of the time.

Among predictions made with 80% confidence, roughly 80% should be correct under the evaluated distribution.

A common proper scoring rule for binary outcomes is the Brier score:

$$
\operatorname{Brier}
=
\frac{1}{N}
\sum_{i=1}^{N}(p_i-y_i)^2
$$

where $p_i$ is predicted probability and $y_i\in\{0,1\}$ is the outcome.

Lower is better.

# A Brier-score calculation

Suppose a system gives probabilities:

$$
p=
\begin{bmatrix}
0.9&0.7&0.6&0.8
\end{bmatrix}
$$

and the outcomes are:

$$
y=
\begin{bmatrix}
1&0&1&1
\end{bmatrix}
$$

The squared errors are:

$$
(0.9-1)^2=0.01
$$

$$
(0.7-0)^2=0.49
$$

$$
(0.6-1)^2=0.16
$$

$$
(0.8-1)^2=0.04
$$

Therefore:

$$
\operatorname{Brier}
=
\frac{0.01+0.49+0.16+0.04}{4}
=0.175
$$

The confident wrong second prediction is heavily penalised.

# Verbal confidence is not automatically calibrated

A model saying “I am 95% certain” does not establish a 95% empirical success rate.

Confidence can be estimated from:

- output probabilities where available;
- repeated sampling;
- self-consistency;
- auxiliary confidence models;
- evidence coverage;
- retrieval quality;
- task-specific verifiers;
- calibrated post-processors.

Every method needs evaluation on representative data.

# Benchmark contamination

A benchmark is contaminated when its questions, answers, or close variants appear in training or adaptation data.

The model may appear to generalise when it is recalling or matching familiar material.

Possible warning signs include:

- suspiciously exact benchmark phrasing;
- performance far above nearby variants;
- answers matching reference wording unusually closely;
- public test sets used repeatedly during development;
- benchmark content included in web-scale corpora.

Mitigations include:

- private or newly created test sets;
- held-out time periods;
- paraphrased and adversarial variants;
- canary strings;
- deduplication;
- contamination audits;
- reporting uncertainty about training data.

# Train, validation, and test separation

The training set updates parameters.

The validation set guides choices such as hyperparameters, prompts, thresholds, and checkpoints.

The test set should estimate final performance after those choices.

If a team repeatedly inspects test failures and changes the system, the test set has become part of development.

A new holdout is then needed.

# Human evaluation

Human reviewers are essential for nuanced qualities such as usefulness, tone, faithfulness, and harm.

A reliable process needs:

- a clear rubric;
- reviewer training;
- examples of each score;
- blinded comparisons where possible;
- multiple reviewers for subjective cases;
- disagreement measurement;
- expert reviewers for specialist domains;
- support for reviewer wellbeing on disturbing content.

Human judgement is not automatically objective. Reviewers can share biases, miss subtle errors, or prefer fluent style.

# Model-as-judge evaluation

Another model can score outputs at scale.

Benefits:

- speed;
- lower cost than full human review;
- consistent formatting;
- ability to explain rubric decisions.

Risks:

- position bias;
- verbosity bias;
- preference for its own style;
- sensitivity to judge prompts;
- shared errors with the evaluated model;
- weak specialist knowledge;
- vulnerability to text that manipulates the judge.

Model judges should be calibrated against human or programmatic ground truth where feasible.

# Pairwise and pointwise judging

## Pointwise

Score one answer against a rubric.

```text
correctness: 1–5
completeness: 1–5
style: 1–5
```

## Pairwise

Choose which of two answers is better.

Pairwise comparison can be easier for humans and models, but it still needs randomised order and tie handling.

# Programmatic evaluation

Some tasks allow exact checks.

Examples:

- JSON schema validation;
- unit tests;
- SQL execution against a test database;
- mathematical verification;
- citation-ID validation;
- forbidden-term detection;
- permission-policy simulation.

Programmatic checks are powerful because they are repeatable, but they cover only what has been encoded in the checker.

# Bias and fairness

Bias evaluation asks whether performance or treatment differs across relevant groups or contexts.

Possible concerns include:

- quality gaps across languages or dialects;
- stereotyped associations;
- unequal refusal rates;
- name or demographic sensitivity;
- accessibility barriers;
- harmful ranking differences;
- historical bias reproduced from data.

The correct groups and metrics depend on the use case and jurisdiction.

Aggregate fairness claims without task-specific analysis are rarely meaningful.

# Privacy evaluation

Test whether the system can expose:

- personal data from training;
- secrets from prompts or logs;
- another user’s retrieved documents;
- hidden system instructions;
- credentials in tool outputs;
- sensitive image or audio content;
- information beyond the user’s permission scope.

Privacy testing should include access-control failures, membership or memorisation risks where relevant, retention behaviour, and incident response.

# Safety evaluation

Safety is not one refusal benchmark.

Evaluate:

- harmful-content generation;
- assistance that increases real-world capability for misuse;
- self-harm response quality;
- discrimination and harassment;
- fraud and impersonation;
- cyber misuse;
- dangerous tool actions;
- over-refusal of benign requests;
- jailbreak and prompt-injection robustness;
- escalation and human handoff.

A useful system must balance preventing harm with serving legitimate requests.

# Red teaming

Red teaming actively searches for failures rather than sampling ordinary use.

A red team may vary:

- language;
- indirect phrasing;
- role-play;
- encoded text;
- multi-turn setup;
- tool results;
- retrieved documents;
- image text;
- long contexts;
- conflicting instructions.

Findings should become regression tests, not anecdotes that disappear after a report.

# RAG evaluation

Evaluate each stage.

## Retrieval

- Did the correct source enter the candidate set?
- Was it ranked high enough?
- Were permissions enforced?
- Were stale versions removed?

## Generation

- Did the answer use the evidence?
- Were claims supported?
- Were citations valid?
- Did the system abstain when evidence was missing?

## End to end

- Did the user complete the task?
- Was latency acceptable?
- Could the answer be audited?

# Tool-use evaluation

Test:

- whether the correct tool was selected;
- schema validity;
- argument accuracy;
- permission checks;
- confirmation behaviour;
- timeout and error recovery;
- idempotency;
- response consistency with tool results;
- resistance to malicious tool output;
- safe handling of write actions.

A model that calls the right API with the wrong account ID has failed even if its final prose is excellent.

# Long-context evaluation

Long context should be tested with more than one fact placed near the beginning.

Vary:

- relevant information position;
- distractor density;
- repeated entities;
- conflicting versions;
- tables and code;
- multi-document synthesis;
- context length;
- question order.

Measure whether the system retrieves, attributes, and combines the correct evidence.

# Robustness and distribution shift

A system may face inputs unlike its evaluation set.

Sources of shift include:

- new products;
- policy changes;
- new slang;
- different user populations;
- adversarial behaviour;
- document-format changes;
- OCR degradation;
- new tools;
- changed retrieval indexes;
- model-provider updates.

Robustness testing deliberately perturbs inputs and operating conditions.

# Production monitoring

After launch, monitor signals such as:

- request volume;
- latency percentiles;
- token usage;
- error and timeout rates;
- tool failures;
- retrieval empty-result rate;
- citation rate;
- abstention rate;
- user corrections;
- escalation rate;
- safety-filter triggers;
- cost per successful task;
- drift in input topics or languages.

Monitoring should respect privacy and data-minimisation requirements.

# Feedback loops

Production feedback can improve the system, but naive logging can create new risks.

Before using interactions for training or evaluation, define:

- consent and notice;
- retention period;
- redaction;
- access controls;
- sampling policy;
- reviewer permissions;
- deletion handling;
- whether feedback is representative;
- how malicious examples are filtered.

User clicks are not automatically high-quality labels.

# Release gates

A release gate turns evaluation into a decision.

Example:

```text
ship only if:
- critical safety tests have zero unresolved severe failures
- grounded answer accuracy is at least 92%
- citation validity is at least 99%
- tool schema validity is at least 99.9%
- p95 latency remains below the product target
- no protected-slice regression exceeds the allowed threshold
```

Thresholds must come from the use case and risk tolerance, not from convenient round numbers.

# Regression testing

Every fixed bug should become a test.

A regression suite may include:

- previously failed user cases;
- safety incidents;
- retrieval misses;
- formatting errors;
- tool mistakes;
- language-specific failures;
- long-context failures;
- latency regressions.

Run the suite whenever the model, prompt, retriever, tools, index, safety policy, or application code changes.

# Version everything

Record:

- model and checkpoint;
- quantisation or adapter;
- tokenizer;
- system prompt;
- decoding settings;
- retriever and embedding model;
- index snapshot;
- tool versions;
- evaluation dataset version;
- rubric and judge version;
- code commit;
- date and environment.

Without versioning, a score cannot be reproduced.

# Common evaluation mistakes

## Mistake 1: choosing the benchmark before defining the use case

The metric may not represent the real decision.

## Mistake 2: reporting only averages

Important slices can fail badly.

## Mistake 3: treating fluent explanations as evidence

Style is not correctness.

## Mistake 4: using the test set repeatedly during development

The test set becomes contaminated by decisions.

## Mistake 5: trusting model judges without validation

Judges have biases and failure modes.

## Mistake 6: evaluating RAG only end to end

Retriever and generator errors need separate diagnosis.

## Mistake 7: measuring safety only by refusal rate

Both harmful compliance and unnecessary refusal matter.

## Mistake 8: ignoring latency and cost

A correct system that cannot meet operational limits is not ready.

## Mistake 9: stopping evaluation at launch

Production introduces new users, data, tools, and attacks.

## Mistake 10: failing to turn incidents into regression tests

The same failure returns.

# Checkpoint

<div class="exercise">

## 1. What should be defined before choosing a benchmark?

The use case, users, decisions, acceptable errors, and operating constraints.

## 2. Why evaluate the whole application rather than only the model?

Prompts, retrieval, tools, filters, permissions, and post-processing create their own failures.

## 3. What is claim-level groundedness?

Checking whether each atomic claim is supported by the available evidence.

## 4. What was the Brier score in the numerical example?

$$
0.175
$$

## 5. Does verbal confidence prove calibration?

No.

## 6. What is benchmark contamination?

Training or development exposure to benchmark content or close variants.

## 7. Why inspect evaluation slices?

Aggregate metrics can hide severe failures for particular groups or conditions.

## 8. What should happen to a discovered production failure?

It should be investigated, fixed where appropriate, and added to the regression suite.

## 9. What is a release gate?

A set of measurable conditions that must be satisfied before deployment.

## 10. Why version the retriever and index as well as the model?

Changing external evidence can change system behaviour even when model weights stay fixed.

</div>

# Chapter takeaway

Evaluation connects technical measurements to real consequences.

A responsible process tests capability, groundedness, calibration, fairness, privacy, safety, efficiency, and operational behaviour across relevant slices and conditions.

In our story:

> **The model does not graduate because it gave one brilliant answer. It graduates only after the clinic tests the right skills, checks the dangerous edge cases, records the exact version, and keeps watching after deployment.**

# The complete journey

We began with one token that needed context.

We followed Queries, Keys, Values, attention scores, multiple heads, residual streams, MLPs, positions, stacked blocks, logits, decoding, training targets, loss, gradients, distributed training, post-training, architecture families, cross-attention, foundation models, retrieval, multimodality, efficiency, and evaluation.

The recurring lesson is simple:

> **An LLM is not magic and not merely a matrix multiplication. It is a layered system of representations, objectives, data, software, hardware, interfaces, and human decisions. Understanding it means tracing each layer precisely enough to know both what it can do and where it can fail.**

# Further reading

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)
