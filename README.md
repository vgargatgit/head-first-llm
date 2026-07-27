# Head First LLMs

A versioned workspace for the illustrated, Head First–inspired LLM and Transformer tutorial.

## Current chapters

1. [A Token Enters the Dating World](dist/chapter-01.html)
2. [Meet the Question Coach](dist/chapter-02.html)
3. [Meet the Profile Writer](dist/chapter-03.html)

## Repository layout

- `dist/` — self-contained HTML chapters with graphics and MathML embedded
- `src/` — editable Markdown chapter source
- `assets/` — graphics extracted from the latest generated chapters
- `styles/` — shared chapter styling
- `CHANGELOG.md` — chronological project updates
- `manifest.json` — machine-readable chapter index

## Working agreement

Each accepted chapter revision is committed on top of the previous version. The latest files on `main` are the current book state; Git history preserves earlier versions.

For local reading, download the repository and open `dist/index.html`.
