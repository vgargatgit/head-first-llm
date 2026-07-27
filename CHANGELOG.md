# Changelog

All notable changes to **LLMs from the Inside Out** are recorded here.

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