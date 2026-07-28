# Machine-Learning Design Patterns — Book Integration Master Plan

## Purpose

The book already explains many recurring machine-learning design decisions, but most of them currently appear as local Transformer mechanics. This plan turns the strongest recurring decisions into an explicit **Design Pattern** layer across the book.

A pattern page should help the reader answer four practical questions:

1. **What recurring problem is this design solving?**
2. **Why does the obvious or simpler design become fragile?**
3. **How does the pattern appear in the running LLM story?**
4. **Where else in machine learning would I recognise and reuse the same move?**

The goal is not to rename every equation as a pattern. The goal is to expose reusable engineering judgement.

---

## Editorial stance

### A design pattern is a recurring response to a recurring failure mode

A concept qualifies for a full pattern treatment when it has:

- a recognisable problem or failure signal;
- a reusable architectural or training response;
- at least one convincing non-LLM example;
- a meaningful trade-off or boundary condition;
- a practical decision rule such as **use this when...**.

Concepts that are useful but do not meet that threshold should become compact **Pattern Notes**, not full spreads.

### Avoid absolute explanations

For example, the residual-connection discussion should not say that gradients *normally* become smaller. In a deep composition, repeated Jacobian multiplication can attenuate **or amplify** signals and gradients. Residual paths add an identity route that makes information and gradients less dependent on every transformation being perfectly conditioned. They improve trainability; they do not guarantee it.

### Keep the pattern beside the concept that motivates it

The arithmetic and running story should teach the local Transformer operation first. The pattern page should appear after the reader understands that operation, then zoom out:

```text
local Transformer mechanism
        -> recurring failure mode
        -> reusable design pattern
        -> second ML example
        -> decision rule and trade-offs
```

### Keep the pattern layer visually distinct but stylistically native

Pattern pages should use the same cartoon grammar, characters, line quality, typography, and technical precision as the existing book. A small recurring **Design Pattern** badge can identify the feature without turning the book into a separate textbook inside the textbook.

---

## Standard pattern-page structure

Every flagship pattern should use the following structure.

### 1. Pattern name

A memorable, action-oriented name. Prefer names such as:

- **Learn an Update, Keep the State**
- **Route First, Carry the Payload Second**
- **Add the Structure the Model Cannot Infer**

Avoid abstract names that do not suggest a decision.

### 2. The recurring problem

Describe the situation in ordinary language before introducing formulas.

### 3. The tempting design

Show the simpler approach and why it can become limiting, unstable, expensive, or ambiguous.

### 4. The pattern

State the reusable move in one sentence and one compact formula or flow diagram.

### 5. In our LLM

Use the book's running example and chapter notation.

### 6. Somewhere else in ML

Use one strong comparison rather than a long list. The comparison should expose the same structural decision, not merely a vaguely related technique.

### 7. Use this when...

Give two to four observable conditions.

### 8. Watch out for...

State what the pattern does not solve, its cost, and one common misuse.

### 9. Illustration

Use a two-level visual:

- **metaphor panel:** immediate intuition;
- **technical panel:** tensors, arrows, or system stages that make the analogy precise.

### 10. Pattern trail

End with compact references:

```text
First seen: Chapter 2
Deep dive: Chapter 7
Reappears: Chapters 10, 14, 17, 22
Related: Specialists Then Fuse; Keep Signals in a Useful Range
```

---

# Part I — Flagship neural-network patterns

These should receive the fullest treatment: usually one full page or a two-page spread with a dedicated illustration.

## Pattern 1 — Learn an Update, Keep the State

**Primary home:** Chapter 7  
**Pattern trail:** Chapters 1, 7, 8, 10, and 14

### Recurring problem

A deep subnetwork is asked to replace an entire useful representation. Repeated transformations can distort information, and the backward signal must depend on every transformation along the route.

### Pattern

Let the subnetwork learn a correction or amendment:

$$
 y=x+F(x)
$$

The input retains an identity route while the learned branch contributes an update.

### In our LLM

Attention and the MLP write updates into the residual stream instead of rebuilding each token state from scratch.

### Somewhere else in ML

A ResNet block lets convolutional layers learn a residual feature update while the input feature map travels through a skip connection. U-Net skip connections provide a related preservation path between encoder and decoder resolutions, although their exact purpose and merge operation differ.

### Use this when

- useful information should survive a deep stack;
- the identity mapping is a sensible default;
- many transformations have compatible input and output shapes;
- optimisation becomes fragile as depth increases.

### Watch out for

- shape mismatches may require a projection on the skip path;
- residuals do not remove the need for sensible scale control, initialisation, and normalisation;
- an unrestricted update branch can still destabilise the stream;
- not every skip connection is semantically identical to a Transformer residual stream.

### Illustration brief

**Metaphor:** a case file travels on a straight highway while each specialist adds an amendment through a side lane. A second small panel shows the backward correction travelling directly down the highway as well as through the specialist.

**Technical:** compare $y=F(x)$ with $y=x+F(x)$; show the backward derivative as an identity contribution plus the learned-branch contribution. Add a parallel ResNet panel in which a feature map bypasses two convolutions.

---

## Pattern 2 — Keep Signals in a Useful Range

**Primary homes:** Chapters 4 and 7  
**Pattern trail:** Chapters 4, 7, 10, 11, 13, 15, 22, and 23

### Recurring problem

Scores or activations become so large, small, or unevenly scaled that a sensitive operation enters an unhelpful numerical regime. Softmax can become excessively sharp, exponentials can overflow, gradients can become uninformative, and layers can continually change the scale seen by later layers.

### Pattern

Control the operating range at the boundary where scale matters. Different instances include:

- divide attention dot products by $\sqrt{d_k}$;
- subtract the maximum logit before exponentiation;
- normalise each token representation at the intended axis;
- use a deliberate temperature in contrastive or decoding distributions;
- use warmup or gradient scaling when the optimiser or numeric format is not ready for full magnitude.

### In our LLM

Chapter 4 scales attention logits before softmax. Chapter 7 uses LayerNorm or RMSNorm to control feature scale. Chapters 11 and 13 use stable softmax and log-sum-exp.

### Somewhere else in ML

Contrastive learning uses temperature to control how sharply examples compete. CNNs often use BatchNorm or carefully chosen initialisation to keep activations in workable ranges, but the normalisation axis and training behaviour differ from LayerNorm.

### Use this when

- a downstream nonlinearity saturates or becomes too sharp;
- activation or gradient statistics drift with depth or width;
- numerical overflow, underflow, or unstable mixed-precision behaviour appears;
- changing a dimension unexpectedly changes score magnitude.

### Watch out for

- scaling, normalisation, and clipping are different tools;
- the correct axis matters;
- normalisation can remove information if applied at the wrong place;
- a stable number is not necessarily a well-calibrated or meaningful number.

### Illustration brief

**Metaphor:** an audio mixing desk receives whispers, normal voices, and shouting. A scale technician brings signals into the usable green band without deciding what the signals mean.

**Technical:** three mini-panels: attention logits with and without $\sqrt{d_k}$ scaling; stable softmax subtracting the maximum; LayerNorm operating within one token row rather than across tokens.

---

## Pattern 3 — Project One State into Role-Specific Views

**Primary home:** after Chapter 3  
**Pattern trail:** Chapters 2, 3, 5, 7, 11, 19, and 22

### Recurring problem

One representation must serve several incompatible roles. Using the same coordinates directly for every role forces one space to be simultaneously good at searching, being searched, carrying content, scoring outputs, and interfacing with other systems.

### Pattern

Learn a separate projection for each operational role:

$$
 z_r=xW_r
$$

The source state remains shared; each role receives a specialised view.

### In our LLM

The same token state becomes a Query, Key, and Value through different matrices. The vocabulary head projects the final state into token-score space. Cross-attention projects decoder and encoder states into a compatible matching interface.

### Somewhere else in ML

Two-tower retrieval systems learn one projection for users or queries and another for items or documents. The two sides enter a compatible matching space while retaining different encoders and responsibilities.

### Use this when

- the same source features must participate in different operations;
- matching roles are asymmetric;
- the receiving component expects a different width or geometry;
- direct comparison in the original feature space performs poorly.

### Watch out for

- matching tensor shapes does not guarantee semantic alignment;
- too many projections add parameters and can fragment learning;
- tied projections may be useful when symmetry is intentional;
- the projected coordinates should not be assigned simplistic human labels.

### Illustration brief

**Metaphor:** one character visits the Question Coach, Profile Writer, and Information Courier, receiving three different cards from the same case file.

**Technical:** place a two-tower search system beside Q/K projections: user query on the left, product or document on the right, both projected into one matching space.

---

## Pattern 4 — Route First, Carry the Payload Second

**Primary home:** Chapter 5  
**Pattern trail:** Chapters 4, 5, 19, 21, and 23

### Recurring problem

A system confuses *which source should matter* with *what that source should contribute*. A single score or representation is expected to perform both selection and content transfer.

### Pattern

Separate the control path from the data path:

```text
routing or relevance scores
        -> weights or selected sources
        -> payload retrieval and combination
```

### In our LLM

Queries and Keys create attention weights. Values carry the payload mixed by those weights.

### Somewhere else in ML

A mixture-of-experts router chooses which expert networks run, while the experts produce the actual transformed features. A retrieval system ranks documents, while the document text supplies the evidence.

### Use this when

- a small control signal can select among large payloads;
- relevance and content need different representations;
- sparse or weighted conditional computation is useful;
- debugging requires knowing whether selection or content failed.

### Watch out for

- a good router cannot repair a bad payload;
- a strong payload cannot help if routing never selects it;
- routing may collapse onto a few choices;
- attention weights are not automatically explanations.

### Illustration brief

**Metaphor:** a dispatcher assigns delivery percentages; couriers then bring packages. The dispatch sheet contains no package contents.

**Technical:** align three systems horizontally: attention $A\rightarrow AV$, MoE router $\rightarrow$ experts, and retriever $\rightarrow$ document passages.

---

## Pattern 5 — Enforce Constraints Before Competition

**Primary home:** Chapter 4  
**Pattern trail:** Chapters 4, 10, 12, 17, 19, 21, and 24

### Recurring problem

Forbidden, padded, unauthorised, or irrelevant candidates enter a normalisation or selection step and influence the result before being removed.

### Pattern

Apply the constraint at the earliest meaningful boundary, then normalise or aggregate only over allowed candidates.

### In our LLM

Causal and padding masks modify logits before softmax. Loss masks remove invalid targets from the objective and denominator. Source masks remove padding from cross-attention.

### Somewhere else in ML

Semantic-segmentation losses ignore unlabeled pixels before reducing the loss. A secure RAG system applies tenant and permission filters before protected passages reach the model context.

### Use this when

- some candidates are structurally impossible;
- padding should not consume probability or loss weight;
- permissions or task boundaries must be guaranteed;
- post-hoc zeroing would leave an invalid denominator or leaked information.

### Watch out for

- attention masks and loss masks solve different problems;
- a numerical mask must be implemented safely for the chosen precision;
- masking is not a substitute for validating upstream data;
- security filters must not rely on the model voluntarily ignoring forbidden text.

### Illustration brief

**Metaphor:** ineligible contestants are stopped at the door before ballots are counted, not erased after they have changed the vote total.

**Technical:** show mask $\rightarrow$ logits $\rightarrow$ softmax, loss mask $\rightarrow$ valid-token mean, and access filter $\rightarrow$ retrieval candidates.

---

## Pattern 6 — Let Specialists Work in Parallel, Then Learn the Fusion

**Primary home:** Chapters 6–7  
**Pattern trail:** Chapters 6, 7, 18, 22, and 23

### Recurring problem

One representation or model must capture several kinds of evidence, but forcing one monolithic pathway to do everything creates interference or a narrow view.

### Pattern

Give multiple specialists independent parameters or inputs, then use a learned or explicit fusion stage.

### In our LLM

Attention heads learn different Query, Key, and Value projections. Concatenation preserves the separate reports; $W^O$ learns how to mix them.

### Somewhere else in ML

A multi-scale vision model processes features at different resolutions before combining them. An ensemble combines models that fail differently. Multimodal systems use separate encoders before middle or late fusion.

### Use this when

- several relationships or scales may matter simultaneously;
- specialists can learn complementary representations;
- the fusion stage can preserve and combine useful distinctions;
- independent failure modes improve robustness.

### Watch out for

- concatenation alone is not learned fusion;
- specialists can become redundant;
- more branches increase compute and memory;
- human-readable specialist roles are not guaranteed to emerge.

### Illustration brief

**Metaphor:** several investigators inspect the same case with different instruments, then a team lead combines their reports.

**Technical:** attention heads and a multi-scale image pyramid flow into parallel fusion diagrams with a clear distinction between concatenation and learned mixing.

---

## Pattern 7 — Expand, Gate, Contract

**Primary home:** Chapter 8  
**Pattern trail:** Chapters 8, 17, 22, and 23

### Recurring problem

A single linear transformation cannot construct rich nonlinear feature interactions. Working only at the main representation width may also limit the number of intermediate features that can be tested.

### Pattern

Create a larger intermediate workspace, apply a nonlinearity or gate, then project back to the interface width:

$$
 d_{\text{model}}
 \rightarrow d_{\text{hidden}}
 \rightarrow d_{\text{model}}
$$

### In our LLM

The position-wise MLP expands each token, applies ReLU, GELU, SiLU, or a gated variant, and contracts the result into a residual update.

### Somewhere else in ML

MobileNet-style inverted residual blocks expand channels, apply nonlinear depthwise processing, and project back. Bottleneck adapters use a related down/up transformation for efficient adaptation, with a different width direction and purpose.

### Use this when

- a linear map is too restrictive;
- conditional feature activation is useful;
- the outer interface width must remain stable;
- additional representational capacity is worth the compute.

### Watch out for

- expansion width is a compute and parameter cost;
- activations can create dead or saturated regions;
- without a nonlinearity, consecutive linear maps collapse into one;
- gated variants change parameter and activation behaviour.

### Illustration brief

**Metaphor:** a token enters a large private workshop, opens many candidate workbenches, activates only useful ones, and returns with a compact report.

**Technical:** pair the Transformer MLP with an inverted residual CNN block, clearly labelling what is shared and what differs.

---

## Pattern 8 — Add the Structure the Model Cannot Infer

**Primary home:** Chapter 9  
**Pattern trail:** Chapters 9, 12, 17, 18, 21, and 22

### Recurring problem

The core operation is invariant or equivariant to a transformation that matters to the task. The model cannot distinguish order, location, role, modality, boundary, or ownership from content alone.

### Pattern

Inject the missing structural signal explicitly through embeddings, encodings, masks, metadata, graph edges, coordinates, or interface tokens.

### In our LLM

Positional embeddings or RoPE provide order and relative-position information. Chat templates provide role boundaries. document and loss masks preserve example boundaries.

### Somewhere else in ML

Time-series models receive timestamps or cyclical time features. Vision models may receive coordinate channels or positional embeddings. Graph neural networks receive edges because a bag of node features does not specify graph structure.

### Use this when

- permuting inputs changes the task meaning but not the raw feature set;
- identical content plays different roles at different locations;
- boundaries or ownership affect allowed interactions;
- the architecture's default symmetry is too broad.

### Watch out for

- adding structure can hard-code the wrong inductive bias;
- absolute and relative representations generalise differently;
- metadata can leak target information;
- role or position conventions must match between training and inference.

### Illustration brief

**Metaphor:** identical houses without street addresses versus a map with addresses, roads, and neighbourhood boundaries.

**Technical:** show token identity plus position, time-series value plus timestamp, and graph node features plus edges.

---

## Pattern 9 — Refine Repeatedly Through a Stable Interface

**Primary home:** Chapter 10  
**Pattern trail:** Chapters 7, 8, 10, 16, 18, and 23

### Recurring problem

A complex result is difficult to compute in one transformation. Yet stacking stages becomes awkward if every stage changes the external shape or contract.

### Pattern

Keep a stable interface while applying a sequence of independently learned refinement steps:

$$
 x^{(\ell)}=\operatorname{Block}_{\ell}(x^{(\ell-1)})
$$

### In our LLM

Every Transformer block consumes and produces an $n\times d_{\text{model}}$ residual stream. Later layers work on representations already refined by earlier layers.

### Somewhere else in ML

Diffusion models repeatedly denoise a representation over timesteps. Iterative pose or bounding-box refiners repeatedly correct a current estimate. Boosting repeatedly adds corrections to the current predictor, although its training and interface differ.

### Use this when

- the task benefits from progressive correction;
- intermediate states remain meaningful inputs to the same broad operation;
- depth should increase capacity without redesigning every boundary;
- repeated stages can specialise independently.

### Watch out for

- stable shape does not imply shared weights;
- depth adds latency, memory, and optimisation difficulty;
- a rigid human story for every layer is usually unjustified;
- repeated errors can also accumulate.

### Illustration brief

**Metaphor:** the same case-file format moves through several floors; each floor adds a different amendment without changing the folder dimensions.

**Technical:** place a Transformer stack beside iterative image denoising, showing stable outer shape and changing internal content.

---

## Pattern 10 — Scores Are Not Decisions

**Primary home:** Chapter 11  
**Pattern trail:** Chapters 4, 11, 13, 17, 21, 23, and 24

### Recurring problem

A model's learned scores are treated as if they already encode the product's final action. This hides thresholds, costs, uncertainty, sampling policy, and safety constraints.

### Pattern

Separate:

```text
learned score or probability
        -> calibrated or filtered decision policy
        -> action
```

### In our LLM

The model produces logits and a token distribution. Greedy decoding, temperature, top-k, top-p, stopping rules, and tool policies decide what happens next.

### Somewhere else in ML

A fraud classifier outputs a risk score, while a business policy chooses thresholds for approval, review, or rejection. The threshold can change without retraining the model.

### Use this when

- false positives and false negatives have different costs;
- deterministic and exploratory behaviour are both useful;
- policy must change faster than model weights;
- actions require additional validation or human confirmation.

### Watch out for

- probabilities may be poorly calibrated;
- filtering can hide model weaknesses rather than repair them;
- policy changes alter user-visible behaviour and require evaluation;
- the highest score is not always the safest or most useful action.

### Illustration brief

**Metaphor:** judges produce a scorecard; a separate policy officer decides whether to select, sample, abstain, escalate, or request confirmation.

**Technical:** compare token decoding with a three-threshold risk classifier.

---

# Part II — Project and system design patterns

These can begin as one-page Pattern Notes. The strongest can later expand into full spreads.

## Pattern 11 — Turn Data Structure into Supervision

**Primary home:** Chapter 12

### Pattern

Construct labels from transformations or relationships already present in raw data rather than requiring a human label for every example.

### LLM instance

Shift a token sequence by one position so the sequence supplies its own next-token targets.

### Other ML instance

Mask image patches and reconstruct them, predict one augmented view from another, or create positive pairs from two views of the same item.

### Illustration

A sentence folds into a question strip and an answer strip; a parallel image panel hides patches and creates its own reconstruction task.

---

## Pattern 12 — Optimise a Smooth Proxy, Evaluate the Real Goal

**Primary homes:** Chapters 13 and 24

### Pattern

Train with a differentiable objective that supplies useful gradients, then evaluate with the actual task, slice, risk, and product metrics.

### LLM instance

Cross-entropy trains next-token probabilities, while long-form quality, groundedness, tool correctness, safety, and task completion require separate evaluation.

### Other ML instance

An object detector optimises classification and box-regression losses but is evaluated with precision, recall, and mean average precision. A ranking system may optimise pairwise loss but be judged by NDCG and business outcomes.

### Illustration

A smooth training ramp guides the optimiser; a separate finish-line scoreboard measures the real race.

---

## Pattern 13 — Trade Memory, Compute, and Communication Explicitly

**Primary homes:** Chapters 15–16  
**Reappears:** Chapter 23

### Pattern

When a resource limit is reached, move cost deliberately rather than describing the technique as a free optimisation.

### Instances

- gradient accumulation: lower peak activation memory, same forward/backward arithmetic;
- activation checkpointing: less stored activation memory, more recomputation;
- sharding: less persistent state per worker, more communication;
- quantisation: less storage and bandwidth, more approximation and kernel constraints;
- caching: less repeated compute, more memory and invalidation complexity.

### Other ML instance

Large vision and recommender models use the same accumulation, rematerialisation, sharding, and quantisation decisions.

### Illustration

A three-pan balance labelled **memory**, **compute**, and **communication**. Moving a weight off one pan visibly loads another.

---

## Pattern 14 — The Sampler Defines the Curriculum

**Primary home:** Chapter 15  
**Pattern trail:** Chapters 15, 17, 21, and 24

### Pattern

The optimiser learns from the distribution it is shown, not from the abstract set of all available data. Sampling, weighting, deduplication, negative selection, and ordering are part of model design.

### LLM instance

Pretraining data mixtures upsample high-value sources and downsample repetitive ones. Fine-tuning demonstrations and preference pairs define the behaviours practised.

### Other ML instance

Class-balanced sampling protects rare classes; hard-negative mining changes what a detector or retriever learns to distinguish; prioritised replay changes an RL agent's practice distribution.

### Illustration

A training cafeteria menu changes the meals repeatedly served to the model. The warehouse may contain everything, but the serving line determines the diet.

---

## Pattern 15 — Adapt the Smallest Useful Subspace

**Primary home:** Chapter 17  
**Pattern trail:** Chapters 17, 20, 22, and 23

### Pattern

When the base representation is already useful, freeze most of it and train the smallest component that has enough capacity to express the required change.

### LLM instance

LoRA stores a low-rank update while the base matrix stays frozen. Multimodal systems may train only a bridge between a frozen encoder and language model.

### Other ML instance

Transfer learning often freezes a vision backbone and trains a linear probe or task head before deciding whether deeper layers need unfreezing.

### Illustration

Renovate one room or add an adapter wing to a large building rather than rebuilding the foundation.

---

## Pattern 16 — Choose Information Flow to Match the Task

**Primary homes:** Chapters 18–19

### Pattern

Architecture is partly a set of communication permissions. Choose who may see what, when, and through which memory according to the task.

### LLM instance

Encoder-only models use bidirectional attention, decoder-only models use causal attention, and encoder–decoder models separate full source encoding from target-side generation and cross-attention.

### Other ML instance

A causal time-series forecaster must not read future measurements. A graph network follows explicit edges. A U-Net lets decoder features consult matching encoder resolutions.

### Illustration

Three buildings with different doors and one-way corridors; a technical panel shows their attention-permission matrices.

---

## Pattern 17 — Put Knowledge in the Right Place

**Primary homes:** Chapters 20–21

### Pattern

Separate four different needs:

- broad capability in model weights;
- temporary instructions and examples in context;
- fresh or private evidence in retrieval or external memory;
- exact computation and side effects in tools.

### Decision rule

Ask:

1. Is the problem missing behaviour or missing information?
2. Must the change persist across requests?
3. Does the information change frequently?
4. Is an exact or authorised external action required?

### Other ML instance

A recommender separates learned embeddings from fresh inventory features and business rules. A forecasting model separates learned seasonality from live sensor inputs and external scenario data.

### Illustration

One character has a brain, desk notes, library card, and tool belt. Each source is labelled with persistence, freshness, provenance, and action capability.

---

## Pattern 18 — Retrieve Broadly, Rerank Narrowly

**Primary home:** Chapter 21

### Pattern

Use a cheap, high-recall stage to gather candidates, then spend expensive computation on a much smaller set to improve precision.

### LLM instance

Lexical or dense retrieval produces candidates; permission filters, metadata, and a cross-encoder or LLM reranker reduce them to the final context.

### Other ML instance

Search engines, recommender systems, face recognition, and two-stage object detectors use candidate generation followed by a more expensive scoring stage.

### Illustration

A wide funnel labelled `100 candidates -> 30 allowed -> 8 reranked -> 4 supplied`, with dropped items carrying explicit reasons.

---

## Pattern 19 — Learn the Bridge, Not Just the Shape

**Primary home:** Chapter 22  
**Pattern trail:** Chapters 3, 19, and 22

### Pattern

When two pretrained or heterogeneous representations must interact, dimensional compatibility is necessary but semantic alignment must be learned with an appropriate objective.

### LLM instance

A vision or audio encoder produces modality features; a projector, query bottleneck, or cross-attention module translates them into a representation the language system can use.

### Other ML instance

Domain adaptation aligns source-domain and target-domain representations. Sensor-fusion systems align camera, lidar, and temporal signals before combining them.

### Illustration

Two plugs are physically resized to fit, but their wire meanings still disagree. Training rewires the adapter until corresponding signals align.

---

## Pattern 20 — Optimise the Measured Bottleneck

**Primary home:** Chapter 23

### Pattern

Identify whether the actual constraint is weight memory, cache memory, arithmetic, bandwidth, first-token latency, decode latency, concurrency, or quality. Select techniques only after measuring the limiting resource.

### LLM instance

Quantisation helps when weight storage or bandwidth is limiting; GQA and cache quantisation target KV-cache pressure; continuous batching targets utilisation; speculative decoding targets repeated decode cost.

### Other ML instance

A mobile vision model may be limited by memory movement rather than nominal FLOPs. A recommender may be limited by embedding-table bandwidth rather than dense-layer compute.

### Illustration

A deployment dashboard highlights one red bottleneck pipe. Different workshop tools connect to different pipes; no tool connects to all of them.

---

## Pattern 21 — Evaluation Is a Continuous Control Loop

**Primary home:** Chapter 24  
**Pattern trail:** Chapters 13, 15, 17, 21, 23, and 24

### Pattern

Treat evaluation as a versioned loop that begins with the use-case decision, covers the complete system, gates releases, monitors production, and converts failures into regression tests.

```text
use case and risk
    -> evaluation matrix
    -> offline tests
    -> release gate
    -> staged or online observation
    -> production monitoring
    -> incident and user feedback
    -> new regression tests
```

### Other ML instance

The same MLOps loop applies to fraud, medical imaging, ranking, forecasting, and autonomous systems, with different slices and risk thresholds.

### Illustration

The Evaluation Clinic becomes a circular control room: offline lab, release gate, production monitor, incident desk, and regression library are connected by arrows. A single benchmark trophy sits outside the loop with a warning label.

---

# Chapter-by-chapter insertion map

The exact page numbers can be decided after layout. The sequence below identifies the strongest conceptual insertion point.

| Chapter | Pattern integration | New content | Illustration target |
|---:|---|---|---|
| 1 | Pattern seed: Learn an Update, Keep the State | Introduce the phrase “preserve the state, add an update” without a full pattern page | Small residual-stream badge beside the before/after token state |
| 2 | Project One State into Role-Specific Views | Introduce the general idea that a representation can be projected for a job | Question Coach card plus a faint preview of other role cards |
| 3 | Flagship Pattern 3 | Full Query/Key pattern page after both roles are known; compare with two-tower retrieval | Split LLM dating agency / query-document retrieval system |
| 4 | Flagship Patterns 2 and 5 | Explain scale control and constraint-before-softmax as reusable moves | Signal-range gauge and eligibility-before-voting diagram |
| 5 | Flagship Pattern 4 | Separate routing weights from Value payload | Dispatcher and package flow, plus MoE/RAG mini-panels |
| 6 | Flagship Pattern 6, part 1 | Why parallel specialists can learn complementary views | Several specialists inspect the same case |
| 7 | Flagship Patterns 1 and 6, part 2 | Residual deep dive; learned fusion; connect forward preservation to backward gradient route | Residual highway/ResNet spread and Team Lead fusion panel |
| 8 | Flagship Pattern 7 | Explain feature expansion, activation as a conditional gate, and contraction | Private workshop plus inverted residual comparison |
| 9 | Flagship Pattern 8 | Generalise position into explicit structural signals | Addressless town versus positioned tokens, timestamps, and graph edges |
| 10 | Flagship Pattern 9; compact cache note | Stable interfaces enable depth; cache unchanged intermediate state | Case-file floors and layer-specific K/V archive |
| 11 | Flagship Pattern 10 | Separate model distribution from decoding or action policy | Audition judges plus decision-policy officer |
| 12 | Pattern Note 11; Pattern 5 callback | Sequence-derived supervision; masks preserve the intended task | Sentence creates its own answer key; masked-image parallel |
| 13 | Pattern Note 12; Pattern 2 callback | Smooth differentiable loss versus discrete or system-level success | Training ramp versus task scoreboard |
| 14 | Pattern 1 backward callback | Show residual gradients as direct plus sublayer contributions; branches add gradients | Transparent overlay on residual-highway art |
| 15 | Pattern Notes 13 and 14 | Resource trade-offs; sampler as curriculum; validation as independent control | Three-resource balance and training cafeteria / validation lab |
| 16 | Pattern 13 continuation | Partition data, state, tensor operations, depth, or sequence according to the bottleneck | One factory split along five different axes |
| 17 | Pattern Note 15 | Adapt a small trainable subspace; demonstrations and preferences define practice | Building retrofit / LoRA adapter panel |
| 18 | Pattern Note 16 | Architecture as information-flow permissions and inductive bias | Three houses with permission matrices |
| 19 | Pattern 16 continuation; Pattern 4 callback | Directional interface: decoder asks, source memory supplies | Translator desk and encoder memory wall |
| 20 | Pattern Note 17 | Missing information versus missing behaviour; persistent versus temporary adaptation | Decision tree and four storage locations |
| 21 | Pattern Notes 17 and 18; Pattern 5 callback | Retrieval funnel, provenance, access filtering, tools as untrusted proposals | Brain/notes/library/tool belt and candidate funnel |
| 22 | Pattern Note 19; Pattern 15 callback | Shape compatibility versus semantic alignment; trainable bridge | Miswired adapter becomes aligned bridge |
| 23 | Pattern Notes 13 and 20 | Every efficiency technique spends another resource; measure the bottleneck first | Deployment Workshop dashboard and resource-pressure pipes |
| 24 | Pattern Note 21; Pattern 12 callback | Whole-system evaluation, slices, calibration, gates, monitoring, regression | Circular Evaluation Clinic control loop |

---

# Worked content specification — residual connection pattern

This is the first pattern to produce because it is the clearest example of the intended treatment.

## Proposed title

# Design Pattern: Learn an Update, Keep the State

## Opening intuition

A deep network often begins a stage with a representation that is already useful. Asking the next stage to recreate everything useful while also adding something new is unnecessary work.

The residual pattern changes the job:

> **Do not rebuild the whole representation. Keep it, and learn the amendment.**

## The tempting replacement design

$$
 y=F(x)
$$

Every useful part of $x$ must survive only through $F$. Across many layers, forward information and backward gradients depend on a long product of transformations. Depending on those transformations, signals can attenuate, amplify, or become poorly conditioned.

## The pattern

$$
 y=x+F(x)
$$

The learned branch still transforms the input, but the identity path gives the network a simple way to preserve the current representation.

During backpropagation:

$$
 \frac{\partial\mathcal L}{\partial x}
 =
 \frac{\partial\mathcal L}{\partial y}
 +
 \frac{\partial\mathcal L}{\partial y}
 \frac{\partial F}{\partial x}
$$

The first term is the direct route. The second term is the correction contributed through the learned branch.

## In our LLM

The attention sublayer produces an update:

$$
 R=X+\operatorname{AttentionUpdate}(X)
$$

The MLP then produces another update:

$$
 X'=R+\operatorname{MLPUpdate}(R)
$$

The token does not lose its case file. Each sublayer writes an amendment into the evolving residual stream.

## Somewhere else in ML — ResNet

A residual CNN block uses:

$$
 Y=X+\operatorname{ConvBlock}(X)
$$

If the convolutional block initially produces a small update, the network can behave close to an identity mapping and then learn useful corrections. The same reusable idea appears even though the features are image maps rather than token vectors.

## Use this when

- the network is deep;
- the current representation should remain available;
- a stage naturally produces a correction;
- input and update can be aligned to the same shape.

## Do not overclaim

Residual connections do not guarantee that gradients remain perfect, nor do they make normalisation, scaling, initialisation, or optimiser design irrelevant. They provide an easier route; the rest of the network still determines what travels along it.

## Illustration storyboard

### Panel A — Replacement road

A token case file enters a sequence of specialist booths. Each booth replaces the folder. By the far end, the original notes are faint and the backward correction must pass through every booth.

### Panel B — Residual highway

The original folder travels on a straight highway. Each booth has a side lane that returns an amendment. The outgoing folder is labelled:

```text
current file + amendment
```

### Panel C — Backward route

A red correction arrow splits:

- one arrow travels directly along the highway;
- one arrow travels through the booth;
- the arrows add when they return to the shared input.

### Panel D — Same pattern in vision

A small ResNet feature map bypasses two convolution blocks and is added to their output. Use the same visual grammar but different props so the reader sees structural equivalence without assuming the implementations are identical.

### Technical labels that must appear

- $x$
- $F(x)$
- $x+F(x)$
- direct gradient route
- learned-branch gradient
- matching shape or projected skip

---

# Visual design system

## Recurring visual markers

Create three small reusable markers:

1. **Design Pattern** — flagship pattern page;
2. **Pattern Note** — compact half-page or margin feature;
3. **Pattern Trail** — cross-chapter references.

These should be visually recognisable but quieter than chapter heroes.

## Illustration grammar

Every pattern illustration should:

- use the established book characters and cartoon style where appropriate;
- include one metaphor panel and one technical panel;
- keep arrows directional and unambiguous;
- label which dimension or entity is being mixed;
- distinguish control signals from payloads;
- show failure and corrected design side by side when possible;
- avoid decorative machinery that implies a false computation;
- include concise alt text in the scene plan before image generation.

## Comparison discipline

The second ML example must show the same structural move and explicitly state where the analogy stops. For example:

- Transformer residual and ResNet skip: same update-plus-identity pattern, different data and block operations;
- attention routing and MoE routing: both separate selection from payload, but MoE often activates sparse compute while attention usually mixes token Values;
- LayerNorm and BatchNorm: both control scale, but they use different axes and have different train/evaluation behaviour.

## Asset naming

Use chapter-local assets for inserted pages:

```text
assets/chapter-XX/NN_design_pattern_<slug>.webp
```

When one pattern spans chapters, keep the full flagship asset in the primary chapter and use smaller callback assets or crops elsewhere rather than duplicating the complete image.

---

# Production sequence

## Phase 1 — Establish the pattern system

1. Add reusable Markdown/CSS treatment for `Design Pattern`, `Pattern Note`, and `Pattern Trail`.
2. Produce the residual-connection flagship page and illustration.
3. Review it for tone, density, mathematical accuracy, mobile layout, and visual continuity.
4. Treat the approved result as the reference template.

## Phase 2 — Complete the first Transformer-block cluster

Produce and integrate:

1. Project One State into Role-Specific Views;
2. Keep Signals in a Useful Range;
3. Route First, Carry the Payload Second;
4. Enforce Constraints Before Competition;
5. Let Specialists Work in Parallel, Then Learn the Fusion;
6. Expand, Gate, Contract.

These patterns are tightly connected to Chapters 2–8 and will establish the recurring feature early in the book.

## Phase 3 — Complete inference patterns

Produce and integrate:

1. Add the Structure the Model Cannot Infer;
2. Refine Repeatedly Through a Stable Interface;
3. Scores Are Not Decisions;
4. the compact cache-reuse note.

## Phase 4 — Complete training and scaling patterns

Produce and integrate:

1. Turn Data Structure into Supervision;
2. Optimise a Smooth Proxy, Evaluate the Real Goal;
3. Trade Memory, Compute, and Communication Explicitly;
4. The Sampler Defines the Curriculum;
5. Adapt the Smallest Useful Subspace.

## Phase 5 — Complete architecture and application-system patterns

Produce and integrate:

1. Choose Information Flow to Match the Task;
2. Put Knowledge in the Right Place;
3. Retrieve Broadly, Rerank Narrowly;
4. Learn the Bridge, Not Just the Shape;
5. Optimise the Measured Bottleneck;
6. Evaluation Is a Continuous Control Loop.

## Phase 6 — Add the book-wide index

Add a final **Design Pattern Index** with columns:

- pattern name;
- recurring problem;
- first chapter;
- later chapters;
- second ML example;
- related patterns.

Also add a small pattern list to each chapter's closing checkpoint or takeaway.

---

# Definition of done for each pattern

A pattern is complete only when all of the following are true.

## Content

- The recurring failure mode is clear before the solution.
- The LLM instance uses notation consistent with the chapter.
- The non-LLM example is structurally equivalent and not superficial.
- The page contains a practical **Use this when** rule.
- At least one trade-off or non-solution is stated.
- Claims avoid absolutes such as “gradients always vanish.”
- The pattern does not duplicate a neighbouring chapter explanation word for word.

## Illustration

- The metaphor maps cleanly to the computation.
- The technical panel contains the essential tensors or stages.
- Direction, ownership, masking, and aggregation are unambiguous.
- The image matches the established book style.
- The image remains readable on a mobile-width preview.
- Alt text describes the instructional point, not merely the visible objects.

## Integration

- The pattern appears only after its local mechanism has been explained.
- The chapter contains a Pattern Trail reference.
- Later chapters link back instead of repeating the full explanation.
- The pattern index is updated.
- Equations and labels render correctly in the GitHub Pages reader.

---

# Recommended first production batch

The highest-value initial batch is:

1. **Learn an Update, Keep the State** — Chapters 7, 10, and 14;
2. **Project One State into Role-Specific Views** — Chapters 2, 3, 5, and 19;
3. **Keep Signals in a Useful Range** — Chapters 4, 7, and 13;
4. **Route First, Carry the Payload Second** — Chapters 4, 5, 21, and 23;
5. **Scores Are Not Decisions** — Chapters 11 and 24.

This batch proves the full concept across architecture, optimisation, inference policy, and system design without waiting for every pattern to be produced.

The residual pattern should be made first and used as the quality bar for all later pattern pages.