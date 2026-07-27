# Changelog

All notable changes to **LLMs from the Inside Out** are recorded here.

## 2026-07-27 — Chapters 15 through 17 added

- Added `src/chapter-15.md`: **The Training Factory Never Sees the Whole Library**.
- Calculated global sequence and token batches across devices and accumulation steps, distinguished valid-token means from unweighted microbatch means, and covered data mixtures, packing, warmup, cosine decay, validation, contamination, throughput, and resumable checkpoints.
- Added `src/chapter-16.md`: **The Model Outgrows One Machine**.
- Worked through synchronous data-parallel gradient averaging, an illustrative 16-bytes-per-parameter training-state estimate, sharded state, all-gather, reduce-scatter, tensor parallelism, pipeline scheduling, activation checkpointing, topology, scaling efficiency, and distributed recovery.
- Added `src/chapter-17.md`: **From Completion Machine to Helpful Assistant**.
- Explained chat templates, response-only supervised loss, preference pairs, reward modelling, RLHF, a numerical DPO example, full versus parameter-efficient fine-tuning, and a worked LoRA parameter-count comparison.
- Kept Chapters 15–17 free of image references while recording high-value graphics candidates for effective batches, distributed training, and LoRA.
- Extended the landing page, reader registry, numbered navigation, previous/next links, README, and manifest from fourteen chapters to seventeen.
- Bumped the reader build version to `20260727.7` so browsers load the seventeen-chapter registry and current Markdown sources.

## 2026-07-27 — Chapters 12 through 14 added

- Added `src/chapter-12.md`: **The Answer Key Moves One Step Ahead**.
- Converted a token sequence into shifted next-token inputs and labels, explained teacher forcing, and distinguished causal, padding, and loss masks, document boundaries, packing, and context windows.
- Added `src/chapter-13.md`: **Meet the Scorekeeper**.
- Calculated per-token negative log-likelihood, an eight-position masked mean loss of 1.041859, perplexity of 2.834481, and the exact softmax-cross-entropy logit gradient `p - y` from the Chapter 11 distribution.
- Added `src/chapter-14.md`: **The Blame Travels Backward**.
- Propagated the Chapter 13 gradient through the vocabulary projection, calculated the full vocabulary-weight and hidden-state gradients, traced residual, MLP, attention, and embedding gradients, and completed a worked gradient-descent parameter update.
- Added practical training notes covering AdamW, weight decay, clipping, gradient accumulation, mixed precision, loss scaling, and gradient clearing.
- Kept Chapters 12–14 free of image references while adding high-value training-graphics candidates to the manifest.
- Extended the landing page, reader registry, numbered navigation, previous/next links, README, and manifest from eleven chapters to fourteen.
- Bumped the reader build version to `20260727.6` so browsers load the fourteen-chapter registry and current source files.
- Widened responsive navigation handling so fourteen chapter links wrap safely before the mobile breakpoint.

## 2026-07-27 — Chapters 9 through 11 added

- Added `src/chapter-09.md`: **Every Token Needs an Address**.
- Reconstructed the running input matrix from token and absolute-position embeddings, introduced sinusoidal encodings, and added a complete two-dimensional RoPE calculation showing relative-position behaviour.
- Added `src/chapter-10.md`: **The Residual Stream Climbs the Stack**.
- Followed SAT through a toy multi-block continuation, calculated a final normalised hidden state, explained repeated contextualisation, and derived per-layer KV-cache shapes and an illustrative memory estimate.
- Added `src/chapter-11.md`: **The Final Audition**.
- Projected the Chapter 10 hidden state into a five-token vocabulary, calculated logits and softmax probabilities, and worked through greedy decoding, temperature, top-k, top-p, weight tying, and the autoregressive generation loop.
- Kept Chapters 9–11 free of image references while recording high-value illustration candidates in the manifest.
- Extended the landing page, reader registry, numbered navigation, previous/next links, README, and manifest from eight chapters to eleven.
- Bumped the reader build version to `20260727.5` so browsers load the eleven-chapter registry and current source files.
- Updated responsive reader navigation so two-digit chapter links wrap cleanly on narrow screens.

## 2026-07-27 — Chapters 6 through 8 added

- Added `src/chapter-06.md`: **Many Specialists at Work**.
- Continued the running THE/CAT/SAT example with a second independently learned attention head, a second causal attention matrix, and feature-wise concatenation.
- Added `src/chapter-07.md`: **The Team Lead Combines the Reports**.
- Calculated the output projection \(HW^O\), residual addition, and a complete per-token LayerNorm example; distinguished post-norm, pre-norm, LayerNorm, and RMSNorm.
- Added `src/chapter-08.md`: **The Private Thinking Room**.
- Calculated a complete position-wise MLP with expansion, ReLU, contraction, a second residual path, and the output of one simplified Transformer block.
- Kept Chapters 6–8 free of image references while recording the plan to add a small set of high-value graphics after technical review.
- Extended the landing page, reader registry, numbered navigation, previous/next links, README, and manifest from five chapters to eight.
- Bumped the reader build version so browsers do not retain the earlier five-chapter registry.
- Updated the mobile reader header so eight chapter links and the sign-out control can wrap safely.

## 2026-07-27 — Chapters 4 and 5 added

- Added `src/chapter-04.md`: **When Queries Meet Keys**.
- Continued the running THE/CAT/SAT calculation through Query–Key dot products, scaling by \(\sqrt{d_k}\), causal masking, and row-wise softmax.
- Added `src/chapter-05.md`: **Meet the Information Courier**.
- Added a worked Value projection and calculated the complete one-head output with \(Z=AV\).
- Kept both chapters intentionally free of illustration references.
- Extended the home page, reader configuration, numbered navigation, previous/next links, and README from three chapters to five.
- Adjusted the mobile reader header for the five-chapter navigation.
- Restored `manifest.md` as the canonical chapter index.

## 2026-07-27 — Book renamed and preview gate added

- Renamed the visible book identity to **LLMs from the Inside Out**.
- Added a browser-side preview login and sign-out controls.
- Updated the Pages workflow, README, home page, and chapter reader branding.

## 2026-07-27 — GitHub Pages book website added

- Added a responsive landing page under `site/index.html`.
- Added a reusable chapter reader under `site/chapter.html`.
- Added browser-side Markdown rendering, automatic table-of-contents generation, previous/next navigation, and MathJax equation rendering.
- Added graceful placeholders for illustration files that have not yet been committed under `assets/`.
- Added `.github/workflows/pages.yml` so every accepted change on `main` can deploy automatically to GitHub Pages.
- Documented the expected public URL: `https://vgargatgit.github.io/head-first-llm/`.

## 2026-07-27 — Chapter workspace populated

- Added canonical editable sources:
  - `src/chapter-01.md`
  - `src/chapter-02.md`
  - `src/chapter-03.md`
- Added browser distribution pages:
  - `dist/index.html`
  - `dist/chapter-01.html`
  - `dist/chapter-02.html`
  - `dist/chapter-03.html`
- Added the shared stylesheet at `styles/chapter.css`.
- Added chapter-specific asset directories and inventories under `assets/`.
- Corrected the README so it describes the repository's actual current state.

## 2026-07-27 — Workspace initialized

- Established this repository as the canonical, versioned book workspace.
- Registered the initial chapter set:
  1. Chapter 1 — A Token Enters the Dating World
  2. Chapter 2 — Meet the Question Coach
  3. Chapter 3 — Meet the Profile Writer
- Adopted direct, chronological commits on `main` for accepted revisions.
- Standardized the cream-paper, purple-accented, hand-drawn cartoon visual language for illustrated chapters.

## Working convention

Each accepted chapter revision should update:

- the relevant editable chapter source;
- the browser-facing chapter reader or navigation when needed;
- associated graphics when they changed;
- `manifest.md` when chapter metadata changes;
- this changelog with a concise summary.