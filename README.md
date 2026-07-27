# Head First LLMs

A versioned workspace and browsable website for the illustrated, Head First–inspired LLM and Transformer tutorial.

## Read the website

Once GitHub Pages is enabled, the book is published at:

**https://vgargatgit.github.io/head-first-llm/**

The website renders the chapter Markdown with a responsive book layout and MathJax equations. Each accepted change pushed to `main` triggers a new deployment automatically.

### One-time GitHub Pages setting

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and run **Deploy Head First LLMs website** if it did not start automatically.

## Current chapters

1. [A Token Enters the Dating World](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=1)
2. [Meet the Question Coach](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=2)
3. [Meet the Profile Writer](https://vgargatgit.github.io/head-first-llm/chapter.html?chapter=3)

## Repository layout

- `site/` — GitHub Pages home page, chapter reader, styling, and rendering logic
- `src/` — canonical editable Markdown for each chapter
- `assets/` — chapter-specific graphics
- `.github/workflows/pages.yml` — automatic Pages deployment
- `dist/` — earlier browser distribution pages retained for reference
- `styles/` — earlier shared chapter styling
- `CHANGELOG.md` — chronological project updates
- `manifest.md` — current chapter index

## Current workspace status

The complete Chapter 1–3 Markdown sources and the GitHub Pages reader are committed on `main`. The reader rewrites chapter image paths to `assets/chapter-01`, `assets/chapter-02`, and `assets/chapter-03`. Until the illustration binaries are committed, missing illustrations are shown as clearly labelled placeholders rather than broken-image icons.

## Working agreement

Each accepted chapter revision is committed on top of the previous version. The latest files on `main` are the current book state, Git history preserves earlier versions, and GitHub Pages publishes the latest website automatically.
