# Inference Loop Scene Master Plan

## Purpose

This document is the canonical visual-planning source for the inference section of **LLMs from the Inside Out**, covering Chapters 1 through 11.

Chapters 1–3 already contain finished cartoon scenes and establish the visual language of the book. Those implemented scenes are the reference standard for Chapters 4–11.

This plan defines:

- the visual patterns already used in Chapters 1–3;
- the recurring inference characters, props, machines, and places;
- the distinction between the book’s teaching order and the model’s computational order;
- a master inference-loop storyboard;
- the existing scene inventory for Chapters 1–3;
- the planned scene inventory for Chapters 4–11;
- technical guardrails that every illustration must preserve;
- a repeatable production template for future artwork.

This document is a **character bible**, **visual metaphor system**, **storyboard map**, and **production brief**. It does not contain final artwork for Chapters 4–11.

---

# 1. The visual world already established

The first three chapters place Transformer computation inside an **Attention Dating Service**.

Token positions appear as recurring cartoon characters. Each token carries a numerical card representing its current hidden state. Learned projection matrices are represented by service professionals who apply the same learned procedure to different token clients.

The established visual language includes:

- cream-paper or warm off-white backgrounds;
- hand-drawn outlines and annotations;
- purple chapter labels and major accents;
- friendly token characters with clearly visible token labels;
- numerical cards attached to tokens;
- speech bubbles for intuition, never as literal internal model thoughts;
- arrows and compact process strips;
- technical calculation panels beside or below the story scene;
- warning panels that state where the analogy stops;
- a clear handoff from one chapter’s character to the next.

The inference illustrations should continue in the same world. Chapters 4–11 should feel like additional rooms, desks, departments, and floors inside the same organisation—not a new visual franchise.

---

# 2. The production pattern proven by Chapters 1–3

The existing chapters reveal a reusable scene structure.

## 2.1 Hero scene

A wide opening illustration introduces:

- the chapter’s main character or department;
- the token protagonist;
- the chapter question;
- the current input object and expected output object.

## 2.2 Story mechanism

A visual pipeline explains the concept in the book’s metaphor.

For example:

```text
current hidden state
        -> learned worker or department
        -> transformed representation
```

## 2.3 Exact calculation panel

The story is followed by a clean technical panel containing:

- input vector;
- learned matrix;
- matrix shapes;
- coordinate calculations;
- final numerical result.

The calculation panel should look more like an annotated workbook than a cartoon scene.

## 2.4 Shared-parameter scene

The current worker is shown serving several token clients with the same learned rule.

This establishes:

> Shared parameters do not imply identical outputs.

## 2.5 Variant or contrast scene

The chapter then clarifies an important distinction, such as:

- different heads use different coaches;
- Query and Key begin from the same state but perform different jobs;
- one token at different positions receives different positional information.

## 2.6 Handoff scene

The final scene points toward the next unanswered question and introduces the next character, machine, or department.

This pattern should be retained for Chapters 4–11, even when the number of illustrations varies.

---

# 3. Visual ontology

Every visual element should belong to one of four categories.

| Category | Meaning | Visual treatment |
|---|---|---|
| **Characters** | Recurring processes or roles that transform, combine, transport, or select information | Cartoon personas with stable clothing, tools, posture, and role |
| **Token protagonists** | Individual token positions moving through the model | Labelled token characters carrying changing numerical cards or case files |
| **Props and machines** | Tensors, scores, masks, probabilities, matrices, caches, and intermediate operations | Cards, scoreboards, grids, gates, gauges, machines, shelves, files, and control panels |
| **Places** | Stages in the inference computation | Offices, desks, service counters, private rooms, tower floors, archives, and audition stages |

Not every equation needs a mascot.

Processes that behave like recurring workers can become characters. Mathematical objects should usually remain props. This avoids inventing one-use characters such as Softmax Man, Dot Product Detective, or Logit Lady.

---

# 4. Recurring inference cast

## 4.1 THE, CAT, and SAT

### Represents

The three token positions used in the running numerical example.

### Existing treatment

- Each appears as a distinct coloured cartoon token.
- Each carries a visible numerical card.
- The card changes as the token moves through the model.
- The token label remains stable even when the representation changes.

### Production rule

The character is the token position. The card or case file is the current hidden state.

SAT must not visually transform into CAT after attending to CAT. SAT remains SAT and carries an amended state.

THE, CAT, and SAT are the core protagonists for Chapters 1–11. ON, the second THE, MAT, punctuation, and vocabulary candidates may appear when the scene needs the complete sentence or output vocabulary.

---

## 4.2 The Reader Guide

Chapter 1 uses a professor-like guide in explanatory and warning areas.

### Represents

The book’s narrator, not a Transformer component.

### Uses

- introduces a chapter question;
- points at a shape or matrix;
- delivers analogy warnings;
- appears in misconception panels;
- helps bridge the cartoon and technical views.

The Reader Guide must never be shown operating the model or choosing attention behaviour.

---

## 4.3 The Question Coach

### Represents

The Query projection matrix:

```text
W^Q
```

### Existing visual identity

- purple coach character;
- cap labelled with the Query projection;
- receives a token’s current-state card;
- returns a Query or search-preference card;
- serves every token in one attention head using the same learned method.

### Recurring rule

Different attention heads use different Question Coaches or clearly different head badges.

The Coach creates a Query. The Coach does not inspect candidate tokens, calculate scores, retrieve Values, or choose a match.

---

## 4.4 The Profile Writer

### Represents

The Key projection matrix:

```text
W^K
```

### Existing visual identity

- operates the Profile Writing Office;
- receives a token’s current-state card;
- returns a searchable profile card representing the Key;
- uses the same learned method for every token in one head.

### Recurring rule

The Profile Writer creates searchable descriptions. The Writer does not compare Queries, assign attention weights, or package the information that will later be retrieved.

---

## 4.5 The Information Courier

### Represents

The Value projection and the weighted retrieval stage.

```text
V = XW^V
Z = AV
```

### Appearance

A courier or dispatch worker who:

- follows one head’s Value-packing rule;
- collects a Value package from each allowed token;
- attaches the Query’s attention weight to each package;
- delivers a weighted combined package to the querying token.

### Production rule

The Courier should make the Key–Value distinction unmistakable:

- Key card: whether a token matches the search;
- Value package: what the token contributes after matching.

---

## 4.6 The Head Specialists

### Represents

Multiple independent attention heads.

Each specialist team contains its own conceptual:

- Question Coach;
- Profile Writer;
- Information Courier;
- matching and softmax machinery.

### Appearance

Each head uses a stable badge, desk colour, or uniform accent such as:

```text
HEAD 1
HEAD 2
```

The teams receive the same token rows but create different Queries, Keys, Values, attention reports, and retrieved outputs.

They are not manually labelled “grammar head” or “meaning head.”

---

## 4.7 The Team Lead

### Represents

The output projection:

```text
W^O
```

### Appearance

A team lead receives the completed reports from all attention heads, lays their feature pages side by side, and creates one combined recommendation for each token.

### Production rule

The Team Lead mixes feature coordinates from the head reports. The Team Lead does not perform another Query–Key comparison and does not mix token positions.

---

## 4.8 The Position Registrar

### Represents

The mechanism that supplies positional information.

### Appearance

An address clerk or registrar who gives each token a visible position stamp, badge, passport entry, or coordinate marker.

### Uses

- learned absolute position embeddings;
- token-plus-position addition;
- the same token at different positions;
- the distinction between token identity and token address.

RoPE itself should remain a rotary machine rather than becoming another character.

---

# 5. Supporting characters and optional personas

## 5.1 The Causal Gatekeeper

An optional supporting character who enforces the one-way visibility rule.

The Gatekeeper may operate a curtain, velvet rope, or permission board. The physical gate is the primary metaphor; the character is secondary.

The Gatekeeper must enforce position-based permissions, not judge whether a token is semantically relevant.

---

## 5.2 Vocabulary candidates

At the Final Audition, output vocabulary entries appear as candidate token characters.

Candidates may include:

- `on`;
- `quietly`;
- `.`;
- `the`;
- `mat`.

They are vocabulary token IDs, not necessarily whole English words.

---

# 6. Props and machines

## 6.1 Hidden-state card and evolving case file

The current hidden state should retain the visual language established in Chapter 1.

Early scenes may use a compact numerical card. Deeper-stack scenes should use the same object as an evolving passport or case file containing the latest numerical state.

The case file changes. The token identity does not.

---

## 6.2 Query card

A Query is a preference or search-request card produced by the Question Coach.

It contains numerical coordinates and a visible Q badge.

It must not contain:

- token indices to attend to;
- final percentages;
- retrieved information;
- a literal English question.

---

## 6.3 Key profile card

A Key is a searchable profile card produced by the Profile Writer.

It contains numerical coordinates and a visible K badge.

It must not be drawn as the payload that later enters the output.

---

## 6.4 Value package

A Value is a vector payload packaged according to one head’s Value projection.

The package should contain numerical coordinates and a V label. Its size or visual importance must not be confused with the attention weight.

---

## 6.5 Matching grid

The Query–Key score matrix should appear as a grid:

- one Query row per searching token;
- one Key column per candidate token;
- one compatibility score per cell.

Rows and columns must remain visibly labelled.

The grid should support both a single highlighted dot product and the full matrix multiplication view.

---

## 6.6 Score calibrator

Scaling by the square root of head width should be a calibration machine or gauge:

```text
raw score -> divide by √d_k -> calibrated score
```

The machine applies the same positive scale factor to every score in the row or matrix. It preserves ordering while reducing magnitude.

It is a numerical stabiliser, not a semantic penalty.

---

## 6.7 Causal curtain or permission gate

The causal mask should appear as a triangular permission system.

Possible treatment:

- later positions stand behind frosted panels;
- a one-way curtain blocks future candidate booths;
- forbidden score cells receive a grey or crossed-out overlay;
- allowed cells remain visible.

The same Key may be hidden from an earlier Query and visible to a later Query.

---

## 6.8 Softmax probability-ticket machine

Softmax should be a machine, not a person.

It receives the allowed logits for one Query row and distributes exactly one complete bundle of probability tickets:

```text
all tickets in one row sum to 1
```

Every Query row uses its own machine cycle or tray.

The machine must not normalise the entire score matrix as one distribution.

---

## 6.9 Weighted mixing table

Attention weights and Value packages meet at a mixing table.

For each source token:

```text
scalar attention weight × Value vector package
```

The weighted packages are added into one head-output package for the querying token.

---

## 6.10 Concatenation binder

Head outputs are joined feature-wise in a binder or report folder.

For SAT:

```text
Head 1 pages | Head 2 pages
```

The binder must align reports for the same token. It must not stack THE’s report beside CAT’s as though heads created extra token positions.

---

## 6.11 Residual document and amendment sheet

The residual stream is the token’s evolving working document.

A sublayer returns an amendment. Residual addition attaches the amendment to the existing file:

```text
existing state + update = amended state
```

The old state is preserved through a direct path.

---

## 6.12 Normalisation booth

LayerNorm should be a separate balancing booth for each token row.

Each booth:

- reads the coordinates of one token;
- calculates that row’s statistics;
- centres and rescales the features;
- applies learned scale and shift controls where relevant.

THE, CAT, and SAT must not share one combined mean-and-variance tank.

---

## 6.13 Private thinking-room machinery

The MLP room contains three visible stages:

```text
expand -> non-linear gate -> contract
```

For the toy chapter:

```text
4 features -> 6 features -> ReLU gate -> 4 features
```

Every token enters a separate booth that uses the same machinery.

---

## 6.14 Position cards and rotary turntables

Absolute position can be a position card added to the token-identity card.

RoPE should be a pair of rotary turntables:

- one rotates a Query coordinate pair according to the Query position;
- one rotates a Key coordinate pair according to the Key position;
- the final compatibility depends on their relative rotation.

Values should remain off the RoPE turntable in the standard scene.

---

## 6.15 Transformer tower and per-layer cache shelves

The block stack should appear as a tower with one floor per Transformer block.

Every floor has:

- its own attention department;
- its own MLP room;
- its own parameter badge;
- one Key cache shelf;
- one Value cache shelf.

The token’s case file moves upward while preserving model width.

---

## 6.16 Vocabulary projection board

The language-model head is a large board whose columns correspond to vocabulary candidates.

SAT’s final hidden-state card is compared with every vocabulary column, producing one logit per candidate.

---

## 6.17 Decoding controls

Decoding should be represented by separate controls after the probability board:

- greedy selection pointer;
- sampling wheel;
- temperature dial;
- top-k admission gate;
- top-p cumulative velvet rope.

These controls do not change the model weights. They act on the current output distribution.

---

# 7. Places in the inference universe

| Place | Purpose |
|---|---|
| **Attention Dating Service entrance** | Tokens arrive carrying their current hidden states |
| **Question Coach office** | Query projection |
| **Profile Writing Office** | Key projection |
| **Matching Desk** | Query–Key dot products and score matrix |
| **Calibration Station** | Division by √d_k |
| **Causal Permission Gate** | Future-position masking |
| **Softmax Ticket Counter** | Row-wise probability normalisation |
| **Courier Dispatch** | Value packaging and weighted retrieval |
| **Specialist Wing** | Parallel attention heads |
| **Team Lead desk** | Concatenation and output projection |
| **Residual Highway** | Existing token state carries forward while updates join it |
| **Normalisation Booths** | Per-token feature normalisation |
| **Private Thinking Rooms** | Position-wise MLP processing |
| **Position Registry** | Absolute position information and address assignment |
| **RoPE Turntable Room** | Position-dependent Query and Key rotation |
| **Transformer Tower** | Repeated blocks and evolving residual stream |
| **Per-Layer KV Archive** | Cached Keys and Values during generation |
| **Final Audition Stage** | Vocabulary logits, probabilities, and decoding |

---

# 8. Visual grammar

These conventions should remain stable throughout Chapters 1–11.

| Meaning | Visual treatment |
|---|---|
| Current token state | Numerical card or evolving case file carried by the token |
| Query | Purple Q preference card |
| Key | Searchable K profile card with a distinct colour from Query |
| Value | V-labelled package or parcel |
| Forward computation | Solid arrows, normally left to right |
| Stack depth | Bottom-to-top movement through tower floors |
| Allowed attention | Clear connecting lines or visible candidate booths |
| Masked future position | Greyed, curtained, crossed-out, or behind a one-way gate |
| Raw score | Unbounded number on a matching-grid cell |
| Attention probability | Percentage ticket, ribbon, or weight tag |
| Residual route | Continuous gold or purple highway carrying the old case file |
| Normalised state | Balanced card leaving an individual booth |
| Cached state | Labelled K and V folders on a floor-specific shelf |
| Logit | Raw audition score, possibly negative |
| Probability | Ticket share that participates in a distribution summing to one |
| Selected next token | Candidate holding a selection ticket and joining the sequence |

Additional rules:

1. Token order remains visually stable unless a scene explicitly demonstrates reordering.
2. Token rows never collapse into one sentence-level character.
3. Matrix shapes should appear near important technical panels.
4. Head identity should remain visible from Q/K/V projection through retrieval.
5. A later illustration must not change the established face, body, or main colour of a recurring character without a deliberate redesign pass.
6. Speech bubbles express teaching intuition, not literal text stored inside vectors.
7. Technical captions remain authoritative when the metaphor simplifies a process.

---

# 9. Teaching order versus computational order

The chapter sequence is pedagogical, not a literal execution trace.

## 9.1 Book teaching order

```text
Chapter 1: current hidden states and the minimum token-plus-position scaffold
Chapter 2: Queries
Chapter 3: Keys
Chapter 4: scores, scaling, masking, softmax
Chapter 5: Values and one-head output
Chapter 6: multiple heads
Chapter 7: output projection, residual, normalisation
Chapter 8: MLP and completed block
Chapter 9: open and compare positional mechanisms in detail
Chapter 10: stack many blocks and reuse KV caches
Chapter 11: vocabulary logits and next-token decoding
```

## 9.2 Actual forward-computation order

```text
token IDs
    -> token embeddings and positional mechanism
    -> Transformer block 1
    -> Transformer block 2
    -> ...
    -> Transformer block L
    -> final normalisation
    -> vocabulary logits
    -> vocabulary probabilities
    -> decoding rule
    -> selected next token
    -> append token and repeat
```

Chapter 1 now labels the earlier computational stage with a minimum scaffold: token identity and an architecture-specific positional treatment prepare the state that enters the first block. Chapter 9 remains later in the teaching sequence because readers can then understand how learned absolute positions, sinusoidal encodings, relative methods, and RoPE affect the computation. The transition should feel like opening a previously labelled position box, not introducing position after a completed block.

---

# 10. Existing implemented scene inventory

The scenes in Chapters 1–3 are the production reference for all later chapters.

## 10.1 Chapter 1 — A Token Enters the Dating World

### Scene 1 — Chapter cover

Current asset:

```text
assets/chapter-01/01_chapter_cover_token_enters_dating_world.png
```

Implemented composition:

- Attention Dating Service exterior;
- THE, CAT, SAT, ON, THE, and MAT as token characters;
- each token carrying its own numerical hidden-state card;
- SAT wondering how it fits into the group;
- Reader Guide introducing the chapter.

Purpose:

Establish that every token enters attention with one current state of its own.

### Scene 2 — One vector per token

Current asset:

```text
assets/chapter-01/02_one_vector_per_token.png
```

Implemented composition:

- THE, CAT, and SAT aligned as token rows;
- their cards stacked into matrix X;
- matrix shape shown explicitly;
- richer cards shown after attention;
- a causal-visibility strip for the longer sentence;
- a reminder that attention returns one output row per token.

Purpose:

Connect characters, token rows, matrix shape, and causal visibility.

### Scene 3 — The evolving hidden-state passport

Current asset:

```text
assets/chapter-01/03_evolving_hidden_state_passport.png
```

Implemented composition:

- SAT at the model entrance with a simpler identity-and-position passport;
- SAT after several layers carrying a richer contextual passport;
- layer stamps and accumulated contextual notes;
- Reader Guide warning that the same token can carry an increasingly contextual state.

Purpose:

Distinguish the original embedding from the current hidden state at a later layer. The existing passport also supplies the minimum position bridge: identity and positional treatment are present at the model entrance, while Chapter 9 opens the architecture-specific mechanisms in detail. This prose update does not add or prescribe a new illustration; the dedicated position-bridge artwork remains a separate visual-production story.

### Scene 4 — Before and after attention

Current asset:

```text
assets/chapter-01/04_before_and_after_attention.png
```

Implemented composition:

- CAT and SAT before the matchmaking session;
- CAT and SAT after attention with richer contextual cards;
- SAT remains SAT while gaining information related to CAT;
- warning that verbal interpretations are human explanations, not literal text stored in the vector.

Purpose:

Show that attention amends token states without replacing token identity.

---

## 10.2 Chapter 2 — Meet the Question Coach

The Chapter 2 asset inventory defines seven visual slots. The current Markdown directly uses the hero, pipeline, exact calculation, shared-coach, different-heads, and handoff scenes; the asset plan also reserves a packed/two-head implementation scene.

### Scene 1 — Chapter hero

Implemented purpose:

- SAT arrives at the Attention Dating Service;
- SAT presents its current-state card;
- the Question Coach is introduced as the learned Query projection;
- the output is a head-specific Query card.

### Scene 2 — Question Coach pipeline

Implemented purpose:

```text
SAT current state -> W^Q coaching process -> SAT Query
```

The wider scene also previews that the Query will later be compared with token Keys.

### Scene 3 — Exact Query calculation

Implemented purpose:

- four-coordinate SAT state;
- 4 × 2 Query matrix;
- two output-coordinate calculations;
- final two-coordinate Query;
- shapes and inner-dimension matching.

### Scene 4 — One shared Question Coach

Implemented purpose:

- one clean recurring Coach character;
- same learned method used for every token;
- different clients produce different Query cards because their input states differ.

### Scene 5 — Different heads, different coaches

Implemented purpose:

- two head-specific Coach variants;
- distinct labels such as W^Q_1 and W^Q_2;
- same SAT state can produce different head-specific Queries.

### Scene 6 — Packed implementation clarification

Reserved asset purpose:

- two head-specific Query matrices shown conceptually side by side;
- one combined implementation matrix shown as a packed calculation;
- output split or reshaped into head slices;
- conceptual heads remain distinct even when hardware uses one large multiplication.

### Scene 7 — Handoff to Keys

Implemented purpose:

- SAT now holds a Query;
- candidate tokens still need searchable profiles;
- the next stop is the Profile Writing Office.

---

## 10.3 Chapter 3 — Meet the Profile Writer

### Scene 1 — Chapter hero

Current asset purpose:

- introduce the Profile Writer;
- SAT presents the same current hidden state used by the Question Coach;
- the Profile Writer produces a searchable Key card.

### Scene 2 — Profile Writer pipeline

Current asset purpose:

```text
token hidden state -> W^K profile-writing process -> token Key
```

The Writer does not perform matching or retrieval.

### Scene 3 — Exact SAT Key calculation

Current asset purpose:

- SAT’s four-coordinate input;
- 4 × 2 Key matrix;
- two exact coordinate calculations;
- final Key vector;
- shape tracking.

### Scene 4 — One shared Profile Writer

Current asset purpose:

- THE, CAT, and SAT all use the same W^K within one head;
- different current states produce different Keys;
- the complete K matrix contains one row per token position.

### Scene 5 — Query versus Key

Current asset purpose:

- same hidden state sent to two different workers;
- Question Coach produces what the token seeks;
- Profile Writer produces when the token should match;
- Q and K cards have equal width but different roles and usually different values.

### Scene 6 — Handoff to scoring

Current asset purpose:

- Queries and Keys are ready;
- SAT brings its Query to the matching desk;
- the next calculation is Query–Key compatibility.

---

# 11. Master inference-loop storyboard

This sequence is the visual backbone for a complete decoding step.

## Scene 1 — Tokens receive identity and address

At model entry, each token receives:

- a token-identity representation;
- position information or a position-aware Query/Key transformation.

This scene belongs computationally before attention, even though Chapter 9 explains it later.

## Scene 2 — Tokens enter the Transformer block

THE, CAT, and SAT carry their current-state cards into one block.

The cards may already contain context from earlier floors.

## Scene 3 — Three learned views are created

Each token’s current state visits:

- the Question Coach for Q;
- the Profile Writer for K;
- the Information Courier’s packing rule for V.

No cross-token mixing has happened yet.

## Scene 4 — Queries meet Keys

Each Query row is compared with every candidate Key column.

The Matching Desk creates the raw score grid.

## Scene 5 — Scores are calibrated

The score grid passes through the √d_k calibrator.

The relative ordering remains, but the score magnitude becomes more stable.

## Scene 6 — Future positions are hidden

The Causal Gate blocks future Key booths for each Query row.

The visible region forms a lower-triangular pattern.

## Scene 7 — Every Query receives one weight distribution

The Softmax Ticket Counter processes each row separately.

Every allowed row receives one distribution summing to one.

## Scene 8 — Values are retrieved

The Information Courier:

- collects allowed Value packages;
- scales each package by the Query’s weight;
- adds the packages;
- returns one head output to each querying token.

## Scene 9 — Several specialist heads work in parallel

Every head repeats the complete Q/K/V, scoring, masking, softmax, and retrieval process with its own learned projections.

## Scene 10 — Head reports are bound and mixed

For each token:

- head outputs are concatenated by feature;
- the Team Lead applies W^O;
- one model-width attention update is produced.

## Scene 11 — The residual highway preserves the old state

The token’s existing case file travels directly around the attention sublayer.

The attention amendment joins it through residual addition.

## Scene 12 — Each token visits its own normalisation booth

LayerNorm or RMSNorm operates on each token row independently according to the architecture.

## Scene 13 — Private feature processing

Each token enters the same MLP machinery independently:

```text
expand -> activate or gate -> contract
```

The resulting MLP update joins the residual stream.

## Scene 14 — The case file climbs the tower

The updated token states enter the next block floor.

Every floor owns different parameters but preserves the same outer token-by-model-width shape.

## Scene 15 — Keys and Values are filed in each floor’s cache

During autoregressive generation, every layer stores prior Keys and Values.

On the next decoding step, only the new token’s layer-by-layer Q/K/V work is added while earlier K/V folders are reused.

## Scene 16 — SAT reaches the Final Audition

The final hidden state is projected against every vocabulary column.

Each candidate receives one logit.

## Scene 17 — Scores become probabilities

Vocabulary softmax turns logits into a probability distribution.

## Scene 18 — The decoder selects one token

Greedy, temperature, top-k, top-p, or sampling controls determine how a candidate is selected.

The model distribution and the decoding rule remain visibly separate.

## Scene 19 — The selected token joins the sequence

The chosen token is appended to the visible prefix.

It receives an address, enters the stack, reuses the existing per-layer KV cache, and produces the next distribution.

The loop repeats one generated token at a time.

---

# 12. Planned scene inventory for Chapters 4–11

The following filenames are proposed production names. Final names can change, but numbering should preserve chapter order.

---

## 12.1 Chapter 4 — When Queries Meet Keys

### Core Scene 1 — Chapter hero: SAT reaches the matching desk

Proposed asset:

```text
assets/chapter-04/01_chapter_hero_matching_desk.png
```

Composition:

- SAT arrives holding its Query card;
- THE, CAT, and SAT profile cards are arranged behind the desk;
- the Matching Desk promises one score per candidate;
- the Question Coach and Profile Writer may appear in small continuity cameos.

### Core Scene 2 — One dot product, coordinate by coordinate

```text
assets/chapter-04/02_query_key_dot_product.png
```

Composition:

- SAT’s two Query coordinates aligned with CAT’s two Key coordinates;
- paired multiplication tags;
- products added into one raw compatibility score;
- negative and positive numbers shown without emotional “good/bad” faces.

### Core Scene 3 — Every Query meets every Key

```text
assets/chapter-04/03_full_score_matrix.png
```

Composition:

- three Query rows and three Key columns;
- the 3 × 3 score grid;
- highlighted SAT row;
- row and column labels visible;
- shape transformation from Q × K-transpose to S.

### Core Scene 4 — Score calibration

```text
assets/chapter-04/04_scale_by_sqrt_dk.png
```

Composition:

- raw score cards entering a calibrator;
- all divided by the same √2 setting;
- ordering preserved;
- a warning sign: “numerical stabiliser, not semantic penalty.”

### Core Scene 5 — The causal permission gate

```text
assets/chapter-04/05_causal_mask_by_row.png
```

Composition:

- THE sees only THE;
- CAT sees THE and CAT;
- SAT sees THE, CAT, and SAT;
- triangular permission board;
- future cells receive a forbidden overlay before softmax.

### Core Scene 6 — Row-wise softmax ticket counter

```text
assets/chapter-04/06_rowwise_softmax.png
```

Composition:

- CAT’s allowed logits enter one tray and receive two probability tickets;
- SAT’s row enters another tray and receives three tickets;
- each row’s ticket bundle sums to one;
- masked booths receive zero tickets.

### Core Scene 7 — Complete attention-weight report

```text
assets/chapter-04/07_attention_weight_matrix.png
```

Composition:

- final A matrix as a labelled report;
- SAT’s largest weight points to CAT but all allowed positions receive some weight;
- explicit note: “weights decide how Values will be mixed.”

### Optional misconception panel

```text
assets/chapter-04/08_scores_are_not_payloads_or_explanations.png
```

Contrast:

- raw scores are not probabilities;
- attention weights are not Value vectors;
- one high attention weight is not a complete explanation of model behaviour.

### Handoff

The final panel sends the attention report to the Information Courier.

---

## 12.2 Chapter 5 — Meet the Information Courier

### Core Scene 1 — Chapter hero: the match report reaches dispatch

```text
assets/chapter-05/01_chapter_hero_information_courier.png
```

Composition:

- SAT’s attention report arrives at Courier Dispatch;
- THE, CAT, and SAT each hold a Value package;
- the Courier explains that the weights say how much to collect, not what the packages contain.

### Core Scene 2 — The Value packing rule

```text
assets/chapter-05/02_value_projection_pipeline.png
```

Composition:

```text
current hidden state -> W^V packing rule -> Value package
```

Show the same state producing Q, K, and V through three different workers in a small side strip.

### Core Scene 3 — Exact SAT Value calculation

```text
assets/chapter-05/03_exact_value_calculation.png
```

Composition:

- 1 × 4 SAT state;
- 4 × 2 W^V;
- two coordinate calculations;
- final SAT Value package;
- shape labels.

### Core Scene 4 — One packing rule, many token packages

```text
assets/chapter-05/04_shared_value_projection.png
```

Composition:

- the same W^V rule applied to THE, CAT, and SAT;
- different numerical packages;
- full V matrix shown underneath.

### Core Scene 5 — Weighted delivery for SAT

```text
assets/chapter-05/05_weighted_value_retrieval.png
```

Composition:

- each Value package receives SAT’s attention-weight tag;
- package contents are proportionally scaled;
- the three weighted packages enter a mixing table;
- one two-coordinate head-output package leaves for SAT.

### Core Scene 6 — Matrix form A times V

```text
assets/chapter-05/06_attention_output_matrix.png
```

Composition:

- attention rows aligned with Value rows;
- A × V produces Z;
- one output row per querying token;
- shape progression 3 × 3 times 3 × 2 gives 3 × 2.

### Optional misconception panel

```text
assets/chapter-05/07_key_vs_value.png
```

Contrast:

- Key profile decides matching;
- Value package supplies payload;
- Query is never compared directly with Value.

### Handoff

One completed head report moves toward a specialist wing containing several parallel heads.

---

## 12.3 Chapter 6 — Many Specialists at Work

### Core Scene 1 — Chapter hero: one sentence, two agencies

```text
assets/chapter-06/01_chapter_hero_two_attention_heads.png
```

Composition:

- THE, CAT, and SAT enter two specialist agencies simultaneously;
- each agency has its own Q, K, and V badges;
- both receive the same current-state cards.

### Core Scene 2 — One head is a complete system

```text
assets/chapter-06/02_one_head_complete_pipeline.png
```

Composition:

```text
Q/K/V projections -> scores -> scale -> mask -> softmax -> weighted Values
```

Use a compact full-department blueprint for one head.

### Core Scene 3 — Head 1 and Head 2 compare differently

```text
assets/chapter-06/03_two_attention_maps.png
```

Composition:

- two side-by-side attention reports;
- same token labels and causal triangle;
- different weight distributions;
- no human-assigned “grammar” or “meaning” labels.

### Core Scene 4 — Different Values, different retrieved reports

```text
assets/chapter-06/04_two_head_outputs.png
```

Composition:

- Head 1 Courier and Head 2 Courier deliver different two-coordinate reports to SAT;
- both reports remain visibly attached to the same SAT row.

### Core Scene 5 — Concatenate by feature

```text
assets/chapter-06/05_concatenate_head_reports.png
```

Composition:

- SAT Head 1 report with two pages;
- SAT Head 2 report with two pages;
- pages bound side by side into a four-page report;
- THE and CAT shown doing the same row-preserving operation.

### Core Scene 6 — Packed implementation

```text
assets/chapter-06/06_packed_multihead_projection.png
```

Composition:

- conceptual separate head matrices;
- one large packed matrix multiplication;
- output reshaped into batch, head, token, and head-width axes;
- a caption clarifying that packing is an implementation organisation, not shared head parameters.

### Optional misconception panel

```text
assets/chapter-06/07_heads_do_not_split_tokens_or_average.png
```

Contrast:

- wrong: Head 1 gets THE and Head 2 gets CAT;
- right: every head gets every token row;
- wrong: average head coordinates;
- right: concatenate corresponding token features.

### Handoff

The bound specialist reports arrive at the Team Lead’s desk.

---

## 12.4 Chapter 7 — The Team Lead Combines the Reports

### Core Scene 1 — Chapter hero: specialist reports arrive

```text
assets/chapter-07/01_chapter_hero_team_lead.png
```

Composition:

- Head 1 and Head 2 deliver SAT’s report pages;
- the Team Lead reads the concatenated feature bundle;
- W^O appears as the Lead’s learned synthesis board.

### Core Scene 2 — Exact output projection

```text
assets/chapter-07/02_output_projection_calculation.png
```

Composition:

- SAT’s four concatenated head coordinates;
- 4 × 4 W^O;
- one verified output coordinate;
- final four-coordinate attention update.

### Core Scene 3 — W^O mixes features, not tokens

```text
assets/chapter-07/03_output_projection_feature_mixing.png
```

Composition:

- columns from both heads feed each output coordinate;
- each token row stays in its own lane;
- no new attention lines between tokens.

### Core Scene 4 — The residual highway

```text
assets/chapter-07/04_residual_highway.png
```

Composition:

- SAT’s original case file takes a direct route;
- the Team Lead’s attention amendment travels on a side route;
- they join through addition;
- SAT leaves with an amended four-coordinate file.

### Core Scene 5 — Shape compatibility

```text
assets/chapter-07/05_residual_shape_match.png
```

Composition:

- X and Y both shown as 3 × 4 documents;
- aligned cells added element by element;
- a mismatched-shape example marked as invalid.

### Core Scene 6 — Individual normalisation booths

```text
assets/chapter-07/06_layernorm_per_token.png
```

Composition:

- THE, CAT, and SAT enter separate booths;
- each booth calculates its own row mean and variance;
- no statistics cross between token booths.

### Core Scene 7 — Exact SAT LayerNorm

```text
assets/chapter-07/07_exact_sat_layernorm.png
```

Composition:

- SAT residual row;
- mean, centred values, variance, standard deviation;
- normalised coordinates;
- optional gamma and beta controls.

### Optional architecture comparison

```text
assets/chapter-07/08_prenorm_vs_postnorm.png
```

Composition:

- two compact floor plans;
- post-norm path used in the worked chapter;
- pre-norm path used by many modern decoder models;
- both clearly labelled as architecture variants.

### Handoff

After the shared attention meeting, each token approaches a private thinking room.

---

## 12.5 Chapter 8 — The Private Thinking Room

### Core Scene 1 — Chapter hero: the meeting ends

```text
assets/chapter-08/01_chapter_hero_private_thinking_room.png
```

Composition:

- THE, CAT, and SAT leave the shared attention meeting;
- each enters an individual booth;
- all booths contain identical machinery.

### Core Scene 2 — Expand, activate, contract

```text
assets/chapter-08/02_mlp_three_stage_machine.png
```

Composition:

```text
4-coordinate state -> 6-coordinate workspace -> activation gates -> 4-coordinate update
```

The machine is reused independently for every token.

### Core Scene 3 — Exact SAT expansion

```text
assets/chapter-08/03_exact_mlp_expansion.png
```

Composition:

- SAT input row;
- W1 and b1;
- six pre-activation outputs;
- one verified coordinate calculation.

### Core Scene 4 — ReLU gate

```text
assets/chapter-08/04_relu_activation_gate.png
```

Composition:

- six intermediate channels;
- positive channels pass;
- the negative fourth channel closes to zero;
- another token shown activating a different subset.

### Core Scene 5 — Contract and amend the residual stream

```text
assets/chapter-08/05_mlp_contraction_and_residual.png
```

Composition:

- six activated features enter W2;
- four-coordinate MLP update leaves;
- update joins the existing token file through a residual path;
- normalisation completes the block.

### Core Scene 6 — Communication versus private processing

```text
assets/chapter-08/06_attention_vs_mlp.png
```

Composition:

- attention room with cross-token connections;
- MLP booths with no cross-token doors;
- same token rows before and after both stages.

### Optional modern MLP panel

```text
assets/chapter-08/07_relu_gelu_silu_swiglu.png
```

Composition:

- ReLU identified as the hand-calculation choice;
- GELU, SiLU, and gated/SwiGLU designs shown as modern variants;
- no claim that all models use the same activation.

### Core Scene 8 — One complete Transformer block

```text
assets/chapter-08/08_complete_transformer_block.png
```

Composition:

- one end-to-end block blueprint;
- attention sublayer;
- first residual and norm;
- MLP sublayer;
- second residual and norm;
- model-width input and output.

### Handoff

A “deliberate rewind” sign points back to the model entrance and the missing question of token order.

---

## 12.6 Chapter 9 — Every Token Needs an Address

### Core Scene 1 — Chapter hero: deliberate rewind

```text
assets/chapter-09/01_chapter_hero_position_registry.png
```

Composition:

- completed block visible in the distance;
- the Reader Guide rewinds the story to the model entrance;
- the Position Registrar gives tokens address badges before the first block.

### Core Scene 2 — Same token, different address

```text
assets/chapter-09/02_same_token_different_position.png
```

Composition:

- CAT at position 2 and CAT at position 5;
- same identity card;
- different position card;
- different combined initial state.

### Core Scene 3 — Token plus position

```text
assets/chapter-09/03_additive_position_embeddings.png
```

Composition:

```text
token embedding card + position card = initial hidden-state card
```

Include the exact CAT calculation used to recover the earlier running matrix.

### Core Scene 4 — Causal mask versus positional information

```text
assets/chapter-09/04_visibility_vs_address.png
```

Composition:

- causal gate answers “who may I see?”;
- position badge answers “where am I?”;
- relative-distance ruler answers “how far apart are we?”

The three ideas must not be merged.

### Supporting Scene 5 — Sinusoidal clocks

```text
assets/chapter-09/05_sinusoidal_position_clocks.png
```

Composition:

- several clock hands rotating at different speeds;
- fast frequencies distinguish nearby positions;
- slow frequencies vary over longer distances;
- resulting signature is added to the token embedding.

### Core Scene 6 — RoPE turntables

```text
assets/chapter-09/06_rope_query_key_rotation.png
```

Composition:

- Query coordinate pair rotates by its position angle;
- Key coordinate pair rotates by its position angle;
- compatibility is calculated after rotation;
- Value package remains off the turntable.

### Core Scene 7 — Relative-distance behaviour

```text
assets/chapter-09/07_rope_relative_distance.png
```

Composition:

- two Query–Key pairs shifted together by the same number of positions;
- same relative separation and same relative rotation;
- a second pair with changed separation produces a different comparison.

### Optional caution panel

```text
assets/chapter-09/08_context_extension_is_not_automatic.png
```

Composition:

- position mechanism continues beyond a familiar range;
- warning that usable long-context behaviour depends on training, scaling, architecture, and implementation—not only the existence of RoPE.

### Handoff

Tokens with identity and address enter the Transformer tower.

---

## 12.7 Chapter 10 — The Residual Stream Climbs the Stack

### Core Scene 1 — Chapter hero: the Transformer tower

```text
assets/chapter-10/01_chapter_hero_transformer_tower.png
```

Composition:

- several block floors stacked vertically;
- THE, CAT, and SAT carry case files upward;
- every floor has attention and private-thinking areas;
- a final-normalisation rooftop is visible.

### Core Scene 2 — The evolving case file

```text
assets/chapter-10/02_sat_case_file_through_layers.png
```

Composition:

- SAT at stack input;
- SAT after Block 1;
- SAT after Block 2;
- SAT after Block 3;
- same token label and same four-slot case-file shape;
- changed numerical contents.

### Core Scene 3 — Same floor plan, different staff parameters

```text
assets/chapter-10/03_layers_have_separate_parameters.png
```

Composition:

- Floor 1 and Floor 2 have the same room arrangement;
- Q/K/V/O, MLP, and norm badges differ by layer number;
- misconception panel rejects one shared block copied repeatedly.

### Core Scene 4 — Repeated contextualisation

```text
assets/chapter-10/04_later_layers_use_contextual_states.png
```

Composition:

- early Query built from a simpler file;
- later Query built from a file already amended by earlier attention and MLP work;
- later floors do not reread the original embedding directly.

### Core Scene 5 — Per-layer KV shelves

```text
assets/chapter-10/05_per_layer_kv_cache.png
```

Composition:

- every floor has its own K shelf and V shelf;
- folders arranged by previous token position;
- no shelf stores attention matrices as the primary cache object.

### Core Scene 6 — Next-token decoding with cache reuse

```text
assets/chapter-10/06_new_token_uses_existing_cache.png
```

Composition:

- old tokens’ K/V folders remain on each floor;
- only the new token rides the elevator;
- each floor creates the new token’s Query and appends its new K/V folders;
- the new Query consults the allowed cached Keys and Values.

### Core Scene 7 — Cache growth

```text
assets/chapter-10/07_kv_cache_growth.png
```

Composition:

- shelves lengthen with sequence length;
- floors multiply storage by number of layers;
- labels for KV heads, head dimension, precision, and batch size;
- grouped-query or multi-query variants shown as fewer shared K/V shelves.

### Optional Scene 8 — Final normalisation

```text
assets/chapter-10/08_final_norm_rooftop.png
```

Composition:

- SAT reaches the roof with its final residual case file;
- one final normalisation booth produces the hidden state sent to the vocabulary head.

### Handoff

The final hidden-state file enters the Final Audition theatre.

---

## 12.8 Chapter 11 — The Final Audition

### Core Scene 1 — Chapter hero: vocabulary candidates audition

```text
assets/chapter-11/01_chapter_hero_final_audition.png
```

Composition:

- SAT’s final hidden-state case file reaches a stage;
- candidates `on`, `quietly`, `.`, `the`, and `mat` line up;
- each candidate receives one raw score;
- a sign says “vocabulary token IDs,” not “English words only.”

### Core Scene 2 — Vocabulary projection board

```text
assets/chapter-11/02_vocabulary_projection.png
```

Composition:

- SAT’s four hidden coordinates;
- 4 × 5 vocabulary matrix;
- one column per candidate;
- five output logits;
- one verified candidate dot product and bias.

### Core Scene 3 — Logit scoreboard

```text
assets/chapter-11/03_logits_are_raw_scores.png
```

Composition:

- positive and negative candidate scores;
- values do not sum to one;
- period has highest raw score;
- warning that logits are not percentages.

### Core Scene 4 — Vocabulary softmax

```text
assets/chapter-11/04_vocabulary_softmax.png
```

Composition:

- all five logits enter one probability-ticket machine;
- output tickets sum to one;
- candidates retain non-zero probability unless filtered;
- distinguish this vocabulary softmax from the earlier row-wise attention softmax.

### Core Scene 5 — Greedy versus sampling

```text
assets/chapter-11/05_greedy_vs_sampling.png
```

Composition:

- greedy pointer selects the largest probability;
- sampling wheel can select a lower-probability candidate;
- the underlying distribution is identical before the decoding rule acts.

### Core Scene 6 — Temperature dial

```text
assets/chapter-11/06_temperature_dial.png
```

Composition:

- same logits pass through low, normal, and high temperature settings;
- low temperature produces a sharper ticket distribution;
- high temperature produces a flatter distribution;
- no model-weight changes.

### Core Scene 7 — Top-k and top-p filters

```text
assets/chapter-11/07_topk_and_topp.png
```

Composition:

- top-k admission gate keeps a fixed number of candidates;
- top-p velvet rope admits candidates in descending probability until cumulative mass reaches the threshold;
- remaining candidates are renormalised before sampling.

### Supporting Scene 8 — Weight tying

```text
assets/chapter-11/08_weight_tying.png
```

Composition:

- the token-entry catalogue and final vocabulary projection share the same underlying parameter ledger when weights are tied;
- the two jobs remain distinct even though the parameter object is shared.

### Core Scene 9 — One autoregressive generation loop

```text
assets/chapter-11/09_autoregressive_generation_loop.png
```

Composition:

```text
prefix -> final distribution -> selected token -> append -> next step
```

The selected token joins the sequence, receives the next position, travels through the tower, and extends the per-layer KV cache.

### Core Scene 10 — Only the newest token needs a new trip

```text
assets/chapter-11/10_generation_with_kv_cache.png
```

Composition:

- previous token K/V folders remain on shelves;
- the newest token alone passes through every floor;
- its Query consults cached context;
- one new token is generated per decoding step.

### Optional misconception panel

```text
assets/chapter-11/11_tokens_are_not_always_words.png
```

Composition:

- full-word token;
- word fragment;
- punctuation;
- whitespace-prefixed token;
- special token.

### Handoff

The next section of the book changes perspective from inference to training: the selected output can be compared with a known next-token answer, creating a loss and a backward correction signal.

---

# 13. Initial design-production order

Existing Chapter 1–3 character designs should be reused directly.

Before producing complete Chapter 4–11 scenes, design or approve these reusable elements in this order:

1. Matching Desk and score grid.
2. Score calibrator.
3. Causal permission gate.
4. Softmax probability-ticket machine.
5. Information Courier.
6. Value package and weighted mixing table.
7. Head Specialist badges and two-agency layout.
8. Concatenation binder.
9. Team Lead.
10. Residual highway and amendment sheet.
11. Individual normalisation booth.
12. Private thinking-room machinery.
13. Position Registrar and address cards.
14. RoPE Query and Key turntables.
15. Transformer tower floor template.
16. Per-layer K/V cache shelves.
17. Final Audition stage and vocabulary projection board.
18. Decoding controls: greedy pointer, sampling wheel, temperature dial, top-k gate, and top-p rope.

Reusable elements should be approved before chapter-wide illustration generation so the same object does not change shape or role between scenes.

---

# 14. Technical guardrails

Every final illustration must satisfy these rules.

## Attention and representations

1. Attention produces one output row per token position.
2. A token’s hidden state is not a fixed dictionary definition.
3. Query, Key, and Value begin from the same current state but use different learned projections.
4. Query and Key create compatibility scores; they do not carry the retrieved payload.
5. Values carry the payload mixed into the head output.
6. Attention weights are scalars; Value vectors are vectors.
7. A high attention weight is not automatically a complete causal explanation.

## Causality

8. In causal self-attention, a token may use itself and earlier positions, not later positions.
9. The mask acts before softmax at the logit stage.
10. Causal visibility and positional representation are different concepts.

## Multiple heads

11. Every ordinary attention head receives all token rows.
12. Each head owns separate conceptual Q/K/V projections unless the chapter explicitly discusses a sharing variant.
13. Softmax is independent per head and per Query row.
14. Head outputs concatenate by feature for corresponding tokens.
15. W^O mixes head features at one token position; it does not add another attention operation.

## Residual, norm, and MLP

16. Residual addition preserves the incoming state and adds an update.
17. Residual operands must have compatible shapes.
18. LayerNorm operates within one token row, not across token positions.
19. The MLP uses the same learned weights at every token position but processes rows independently.
20. Attention communicates across tokens; the position-wise MLP does not.

## Position and depth

21. Positional information enters before or inside attention according to the architecture; Chapter 9 is a narrative rewind.
22. Standard RoPE rotates Query and Key coordinate pairs, not Value payloads.
23. Repeated block structure does not imply shared parameters across depth.
24. Later blocks receive contextual hidden states from earlier blocks, not raw embeddings.

## KV cache and generation

25. The KV cache stores prior Keys and Values for every layer.
26. It does not primarily store attention matrices or final hidden states.
27. With cache reuse, the new token still passes through every layer.
28. Generation produces one next-token distribution per decoding step.
29. Logits are not probabilities.
30. The decoding algorithm is separate from the model’s probability distribution.
31. Vocabulary tokens are not always complete words.

---

# 15. Scene specification template

Every scene should be specified before image generation using this template.

```text
Scene ID:
Chapter:
Working filename:
Core or optional:
Conceptual goal:
Characters present:
Props and machines:
Location:
Input object:
Output object:
Forward direction:
Exact labels or numbers that must appear:
Tensor shapes that must appear:
Speech bubble or caption:
Analogy warning:
Continuity references to earlier scenes:
Misconception this scene prevents:
Mobile crop requirement:
```

The visual brief should be approved before final rendering.

---

# 16. Definition of done for an inference illustration

A scene is complete only when:

1. its character design matches earlier appearances;
2. its numerical labels match the chapter source;
3. its matrix and tensor shapes are correct;
4. its arrows preserve actual data flow;
5. its metaphor does not merge Query, Key, Value, score, weight, or payload roles;
6. causal visibility is correct for every shown token row;
7. its caption states the technical concept directly;
8. any analogy limitation is visible in the chapter near the image;
9. the scene remains readable in the website’s chapter width;
10. a mobile crop does not hide the key equation or character action;
11. the image filename and Markdown reference follow the chapter asset convention;
12. the scene contributes instructional value rather than decoration.

---

# 17. Central inference story

The complete visual story should remain memorable in one sentence:

> **Each token enters with an identity and address, asks a head-specific question, presents searchable profiles and information packages, gathers weighted reports from visible tokens, privately transforms its updated case file through many floors, and finally uses that contextual state to audition the next vocabulary token—then repeats the journey for the newly selected token.**
