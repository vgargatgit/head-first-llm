# LLMs from the Inside Out

A versioned workspace and browsable website for a visual LLM and Transformer tutorial.

## Read the website

The current GitHub Pages preview is published at:

**https://vgargatgit.github.io/head-first-llm/**

The website renders the chapter Markdown with a responsive book layout and MathJax equations. Each accepted change pushed to `main` triggers a new deployment automatically.

The Pages site includes a browser-side preview login. This is suitable only as a casual access gate: GitHub Pages and the repository remain public, so it is not a substitute for server-side authentication.

### One-time GitHub Pages setting

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and run **Deploy LLMs from the Inside Out website** if it did not start automatically.

## Current chapters

The published book follows five learning parts. Part membership and reader navigation are defined in `site/book-data.js`; the chapter links below follow that same structure.

### Part I — Build One Transformer Block (Chapters 1–8)

Follow hidden states through attention, residual paths, normalisation, and the position-wise MLP. **Learning outcome:** Trace the complete data flow through one simplified decoder-style Transformer block.

1. [A Token Enters the Dating World](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=1)
2. [Meet the Question Coach](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=2)
3. [Meet the Profile Writer](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=3)
4. [When Queries Meet Keys](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=4)
5. [Meet the Information Courier](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=5)
6. [Many Specialists at Work](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=6)
7. [The Team Lead Combines the Reports](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=7)
8. [The Private Thinking Room](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=8)

### Part II — From Position to Prediction (Chapters 9–11)

Add positional information, stack blocks, reuse KV caches, and generate the next token. **Learning outcome:** Explain how a trained decoder-only Transformer turns an ordered token sequence into a next-token distribution.

9. [Every Token Needs an Address](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=9)
10. [The Residual Stream Climbs the Stack](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=10)
11. [The Final Audition](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=11)

### Part III — How the Model Learns (Chapters 12–17)

Create training targets and loss, propagate gradients, run large training jobs, and shape assistant behaviour. **Learning outcome:** Connect one next-token error to parameter updates, distributed training, and post-training methods.

12. [The Answer Key Moves One Step Ahead](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=12)
13. [Meet the Scorekeeper](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=13)
14. [The Blame Travels Backward](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=14)
15. [The Training Factory Never Sees the Whole Library](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=15)
16. [The Model Outgrows One Machine](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=16)
17. [From Completion Machine to Helpful Assistant](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=17)

### Part IV — Transformer Families and Applications (Chapters 18–22)

Compare Transformer families and extend the core model through cross-attention, adaptation, retrieval, tools, and other modalities. **Learning outcome:** Choose and explain the architecture and adaptation pattern behind common language and multimodal systems.

18. [Three Transformer Families Move In](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=18)
19. [The Decoder Borrows the Encoder’s Notes](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=19)
20. [From Pretraining to Specialisation](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=20)
21. [Open Book, Closed Book, or Tool Belt?](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=21)
22. [Pictures, Audio, and Other Modalities](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=22)

### Part V — Efficient and Trustworthy Systems (Chapters 23–24)

Reduce serving cost and evaluate the capability, reliability, safety, and operational behaviour of the complete system. **Learning outcome:** Reason about the trade-offs required to deploy and continuously evaluate an LLM system.

23. [Smaller, Faster, Cheaper](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=23)
24. [Trust, but Verify](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=24)

Chapters 8–24 currently use equations, tables, text diagrams, and worked calculations without final illustration assets. Detailed production specifications are complete for Chapters 8–17; Parts IV and V are ready for visual planning.

## Repository layout

- `src/` — canonical editable chapter prose; chapter text changes are made here
- `site/book-data.js` — canonical site-facing metadata for parts, chapters, workbook stages, navigation, source paths, and reader artwork mappings
- `site/` — GitHub Pages home page, login page, chapter reader, styling, and rendering logic
- `manifest.md` — editorial publication record for canonical chapter order, part membership, graphics status, and publication status
- `assets/` — chapter-specific graphics where available
- `docs/` — the [canonical running-example ledger](docs/running-example-ledger.md), visual-development plans, character bibles, storyboard source documents, and the implementation backlog
- `scripts/` — dependency-free repository consistency, workbook-metadata, and numerical checks used locally and by GitHub Actions
- `.github/workflows/pages.yml` — automatic Pages deployment
- `dist/` — earlier browser distribution pages retained for reference
- `styles/` — earlier shared chapter styling
- `CHANGELOG.md` — chronological project updates

These sources have separate responsibilities: `src/` owns prose, `site/book-data.js` drives the published site structure, and `manifest.md` records editorial and production status. Their chapter titles, order, and part membership must remain aligned.

## Validate book structure, workbook metadata, and the running example

Run all checks from the repository root:

```bash
node scripts/check-book-consistency.mjs
node scripts/check-workbook-metadata.mjs
node scripts/verify-running-example.mjs
```

The structure check evaluates `site/book-data.js` without a browser and verifies ordered, contiguous and unique parts and chapters; one-part-only chapter membership; source-file existence; previous/next lookup behaviour; and the required desktop/mobile part-navigation integration.

The workbook check verifies that Chapters 1–11 have complete stage metadata, ledger-backed shapes, valid detailed-calculation headings and anchors, and that later chapters safely expose `stage: null`.

The numerical check reads [`docs/running-example-ledger.md`](docs/running-example-ledger.md), validates every declared shape and source heading, and independently recomputes the `THE CAT SAT` path from Query, Key and Value projections through the final vocabulary probabilities. It exits with a precise object-level error when a value drifts beyond the documented tolerance.

The GitHub Pages workflow runs all three commands before assembling the published site, so invalid book metadata, workbook drift, or numerical drift blocks deployment.

## Current workspace status

The complete Chapter 1–24 Markdown sources and the GitHub Pages reader are committed on `main`.

- **Part I — Build One Transformer Block (Chapters 1–8):** hidden states, Query/Key/Value projections, causal attention, multiple heads, output projection, residual paths, normalisation, and the MLP. Readers should be able to trace one simplified Transformer block end to end.
- **Part II — From Position to Prediction (Chapters 9–11):** positional information, stacked blocks, per-layer KV caches, vocabulary logits, decoding, and autoregressive generation. Readers should be able to explain how an ordered token sequence becomes a next-token distribution.
- **Part III — How the Model Learns (Chapters 12–17):** shifted targets, teacher forcing, loss, perplexity, backpropagation, optimiser updates, controlled training runs, distributed training, and post-training. Readers should be able to connect one prediction error to model updates and assistant behaviour.
- **Part IV — Transformer Families and Applications (Chapters 18–22):** architecture families, numerical cross-attention, model adaptation, retrieval, tools, and multimodality. Readers should be able to select and explain common architecture and adaptation patterns.
- **Part V — Efficient and Trustworthy Systems (Chapters 23–24):** quantisation, distillation, MoE and serving techniques followed by evaluation, calibration, safety, privacy, release gates, and monitoring. Readers should be able to reason about production efficiency and trustworthiness trade-offs.

## Visual development plans

- [`docs/inference-loop-scene-master-plan.md`](docs/inference-loop-scene-master-plan.md) — canonical visual reference for Parts I and II (Chapters 1–11), grounded in the implemented Chapters 1–3 artwork.
- [`docs/training-loop-scene-master-plan.md`](docs/training-loop-scene-master-plan.md) — canonical character bible and storyboard map for Part III (Chapters 12–17).

### Chapter production specifications

Each chapter plan defines the chapter hero, recurring props, every planned asset, intended placement, exact numerical overlays, story-to-mathematics mapping, technical exclusions, alt-text drafts, review checklist, and definition of done.

- [Chapter 4](docs/chapter-04/chapter-04-scene-plan.md)
- [Chapter 5](docs/chapter-05/chapter-05-scene-plan.md)
- [Chapter 6](docs/chapter-06/chapter-06-scene-plan.md)
- [Chapter 7](docs/chapter-07/chapter-07-scene-plan.md)
- [Chapter 8](docs/chapter-08/chapter-08-scene-plan.md)
- [Chapter 9](docs/chapter-09/chapter-09-scene-plan.md)
- [Chapter 10](docs/chapter-10/chapter-10-scene-plan.md)
- [Chapter 11](docs/chapter-11/chapter-11-scene-plan.md)
- [Chapter 12](docs/chapter-12/chapter-12-scene-plan.md)
- [Chapter 13](docs/chapter-13/chapter-13-scene-plan.md)
- [Chapter 14](docs/chapter-14/chapter-14-scene-plan.md)
- [Chapter 15](docs/chapter-15/chapter-15-scene-plan.md)
- [Chapter 16](docs/chapter-16/chapter-16-scene-plan.md)
- [Chapter 17](docs/chapter-17/chapter-17-scene-plan.md)

The Chapter 5–17 plans contain 112 planned artwork targets in total. Final image generation and chapter integration remain separate production steps.

## Working agreement

Each accepted chapter revision is committed on top of the previous version. The latest files on `main` are the current book state, Git history preserves earlier versions, and GitHub Pages publishes the latest website automatically.
