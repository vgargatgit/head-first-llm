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

Chapters 4–8 currently use equations, tables, text diagrams, and worked calculations without illustration assets. High-value graphics can be added after the technical content is reviewed.

## Repository layout

- `site/` — GitHub Pages home page, login page, chapter reader, styling, and rendering logic
- `src/` — canonical editable Markdown for each chapter
- `assets/` — chapter-specific graphics where available
- `.github/workflows/pages.yml` — automatic Pages deployment
- `dist/` — earlier browser distribution pages retained for reference
- `styles/` — earlier shared chapter styling
- `CHANGELOG.md` — chronological project updates
- `manifest.md` — canonical chapter order and publication status

## Current workspace status

The complete Chapter 1–8 Markdown sources and the GitHub Pages reader are committed on `main`. The reader rewrites image paths for the illustrated chapters and renders Chapters 4–8 directly without graphics.

Chapters 6–8 carry one continuous numerical example through:

- two-head causal self-attention;
- concatenation and the output projection;
- residual addition and LayerNorm;
- a position-wise MLP;
- the output of one simplified Transformer block.

## Working agreement

Each accepted chapter revision is committed on top of the previous version. The latest files on `main` are the current book state, Git history preserves earlier versions, and GitHub Pages publishes the latest website automatically.