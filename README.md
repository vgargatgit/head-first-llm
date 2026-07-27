# Head First LLMs

A versioned workspace for the illustrated, Head First–inspired LLM and Transformer tutorial.

## Current chapters

1. [A Token Enters the Dating World](dist/chapter-01.html)
2. [Meet the Question Coach](dist/chapter-02.html)
3. [Meet the Profile Writer](dist/chapter-03.html)

## Repository layout

- `src/` — canonical editable Markdown for each chapter
- `dist/` — browser pages that load the current Markdown and render equations with MathJax
- `assets/` — chapter-specific graphic directories and their asset inventories
- `styles/` — shared chapter styling
- `CHANGELOG.md` — chronological project updates
- `manifest.md` — current chapter index

## Current workspace status

The full Chapter 1–3 Markdown sources and browser distribution pages are committed on `main`. The chapter asset directories are present with their inventories; importing the generated illustration binaries is tracked separately because the repository connector accepts text files directly but does not provide a mounted-file upload action.

## Working agreement

Each accepted chapter revision is committed on top of the previous version. The latest files on `main` are the current book state; Git history preserves earlier versions.

For local reading, serve the repository over HTTP and open `dist/index.html`. The chapter pages load `src/chapter-01.md`, `src/chapter-02.md`, and `src/chapter-03.md` rather than duplicating the chapter text.
