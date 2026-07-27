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

1. [A Token Enters the Dating World](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=1)
2. [Meet the Question Coach](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=2)
3. [Meet the Profile Writer](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=3)
4. [When Queries Meet Keys](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=4)
5. [Meet the Information Courier](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=5)
6. [Many Specialists at Work](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=6)
7. [The Team Lead Combines the Reports](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=7)
8. [The Private Thinking Room](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=8)
9. [Every Token Needs an Address](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=9)
10. [The Residual Stream Climbs the Stack](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=10)
11. [The Final Audition](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=11)
12. [The Answer Key Moves One Step Ahead](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=12)
13. [Meet the Scorekeeper](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=13)
14. [The Blame Travels Backward](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=14)
15. [The Training Factory Never Sees the Whole Library](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=15)
16. [The Model Outgrows One Machine](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=16)
17. [From Completion Machine to Helpful Assistant](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=17)

Chapters 4–17 currently use equations, tables, text diagrams, and worked calculations without final illustration assets. Detailed production specifications are complete for the planned graphics.

## Repository layout

- `site/` — GitHub Pages home page, login page, chapter reader, styling, and rendering logic
- `src/` — canonical editable Markdown for each chapter
- `assets/` — chapter-specific graphics where available
- `docs/` — visual-development plans, character bibles, and storyboard source documents
- `.github/workflows/pages.yml` — automatic Pages deployment
- `dist/` — earlier browser distribution pages retained for reference
- `styles/` — earlier shared chapter styling
- `CHANGELOG.md` — chronological project updates
- `manifest.md` — canonical chapter order and publication status

## Current workspace status

The complete Chapter 1–17 Markdown sources and the GitHub Pages reader are committed on `main`. The reader rewrites image paths for the illustrated chapters and renders Chapters 4–17 directly without graphics.

Chapters 1–8 build one Transformer block from hidden states, Query/Key/Value projections, causal attention, multiple heads, residual paths, normalisation, and the MLP.

Chapters 9–11 complete inference through positional information, stacked blocks, KV caches, vocabulary logits, decoding, and autoregressive generation.

Chapters 12–14 begin learning through shifted targets, teacher forcing, cross-entropy, perplexity, backpropagation, and optimiser updates.

Chapters 15–17 expand that one update into a complete model-development system:

- effective token batches, gradient accumulation, data mixtures, learning-rate schedules, validation, and resumable checkpoints;
- data parallelism, model-state sharding, tensor parallelism, pipeline parallelism, activation checkpointing, and distributed communication;
- chat templates, supervised fine-tuning, response-only loss, preference data, reward modelling, RLHF, DPO, LoRA, and post-training evaluation.

## Visual development plans

- [`docs/inference-loop-scene-master-plan.md`](docs/inference-loop-scene-master-plan.md) — canonical visual reference for Chapters 1–11, grounded in the implemented Chapters 1–3 artwork.
- [`docs/training-loop-scene-master-plan.md`](docs/training-loop-scene-master-plan.md) — canonical character bible and storyboard map for Chapters 12–17.

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
