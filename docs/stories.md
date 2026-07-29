# Book Coherence Backlog

This document converts the current coherence review into five implementation epics. It is the canonical planning source for the work described here; individual GitHub issues or project-board stories may be created from these entries later.

## How to use this backlog

- **Epic IDs** use the form `EPIC-COH-N`.
- **Story IDs** use the form `COH-N.M`.
- All stories are initially **Planned**.
- A story should be implemented independently where possible and should leave the published book in a valid state.
- Canonical chapter prose remains under `src/`.
- Reader behaviour and presentation remain under `site/`.
- Visual and editorial production rules remain under `docs/`.
- New validation utilities should live under `scripts/`.
- Changes that affect the published reader must be checked on desktop and mobile and must pass the GitHub Pages build.

## Delivery principles

1. Preserve the current teaching sequence in Chapters 1–8: hidden states, Query, Key, scores and softmax, Value retrieval, multiple heads, output projection and residuals, then the MLP.
2. Prefer shared metadata and reusable rendering over copying the same navigation or workbook content into 24 chapter files.
3. Keep the main reading path approachable without deleting rigorous calculations.
4. Treat notation, terminology and visual metaphors as book-wide interfaces that should not drift.
5. Stabilise content anchors and terminology before producing new artwork.

---

# EPIC-COH-1 — Organise the book into visible learning parts

**Status:** Planned

## Epic outcome

Readers should no longer experience the book as one flat list of 24 chapters. The website, repository documentation and chapter reader should present a consistent five-part learning journey, show where the current chapter sits within that journey, and make movement within a part easier than scanning 24 chapter numbers.

## Proposed part model

| Part | Chapters | Working title | Reader promise |
|---|---:|---|---|
| I | 1–8 | Build One Transformer Block | Follow hidden states through attention, residual paths, normalisation and the MLP. |
| II | 9–11 | From Position to Prediction | Add position, stack blocks, use KV caches and generate the next token. |
| III | 12–17 | How the Model Learns | Build targets and loss, backpropagate, train at scale and perform post-training. |
| IV | 18–22 | Transformer Families and Applications | Compare architecture families, cross-attention, adaptation, RAG and multimodality. |
| V | 23–24 | Efficient and Trustworthy Systems | Improve serving efficiency and evaluate the complete production system. |

## Epic acceptance criteria

- The five parts are defined once in canonical metadata and reused by the site.
- The home page groups chapters by part and explains the purpose of each part.
- Every chapter page shows the current part and progress within that part.
- The compact reader navigation remains usable on mobile.
- `README.md` and `manifest.md` describe the same five-part structure as the site.
- Existing chapter URLs remain valid.
- No chapter prose is reordered as part of this epic.

---

## COH-1.1 — Introduce canonical book-part metadata

**Status:** Planned

### User story

As a maintainer, I want one canonical data model for chapters and book parts so that the home page, reader navigation, progress indicators and future tooling cannot drift apart.

### Planned changes

Create a shared metadata module that describes:

- part ID, Roman numeral and title;
- part summary and learning outcome;
- chapter number and title;
- chapter source path;
- chapter summary;
- part membership;
- position inside the part;
- optional stage label used by later workbook stories;
- existing asset aliases and artwork metadata currently held in `site/app.js`.

### Files and locations

- **Create:** `site/book-data.js`
- **Modify:** `site/app.js`
  - remove or reduce the inline `chapters` object;
  - import or read chapter metadata from `book-data.js`;
  - keep rendering-specific code in `app.js`.
- **Modify:** `site/chapter.html`
  - load `book-data.js` before `app.js`.
- **Modify:** `site/index.html`
  - load `book-data.js` if home-page chapter cards are generated dynamically.
- **Potentially modify:** `site/chapter-07-artwork.js`, `site/chapter-08-artwork.js`, `site/chapter-11-artwork.js`, and `site/chapter-10-supplemental-artwork.js`
  - only if artwork placement metadata is consolidated into `book-data.js`;
  - otherwise retain these files and document why artwork metadata remains separate.

### Detailed implementation notes

- Keep the data plain JavaScript that can run on GitHub Pages without a build step.
- Expose it through a deliberate namespace such as `window.BOOK_DATA`.
- Validate that chapter numbers 1–24 are unique and contiguous.
- Provide helper functions for:
  - `getChapter(number)`;
  - `getPartForChapter(number)`;
  - `getPartChapters(partId)`;
  - previous and next chapter lookup.
- Preserve all current asset path mappings and aliases, especially Chapter 2 aliases.
- Do not change chapter URLs or Markdown source paths.

### Acceptance criteria

- `site/app.js` no longer owns a second independent chapter catalogue.
- All 24 chapters resolve through the shared metadata.
- Current titles, summaries, source paths and asset rewrites behave exactly as before.
- A malformed or missing chapter entry produces a clear console or reader error.
- The shared metadata can be consumed by both `index.html` and `chapter.html`.

### Dependencies

None.

### Out of scope

- Rewriting chapter prose.
- Adding workbook stage metadata beyond placeholders needed by this epic.
- Moving images or renaming existing asset directories.

### Verification

- Open Chapters 1, 2, 7, 10, 11 and 24.
- Confirm Markdown and artwork load correctly.
- Confirm previous/next navigation still points to the expected chapters.
- Confirm Chapter 2 image aliases still resolve.

---

## COH-1.2 — Group the home page into five learning parts

**Status:** Planned

### User story

As a new reader, I want the home page to show a small number of meaningful learning arcs so that I understand the book’s structure before choosing a chapter.

### Planned changes

Replace the current single `chapter-grid` presentation with five part sections. Each section should contain:

- part number and title;
- a concise two-sentence orientation;
- chapter range;
- chapter cards for that part;
- an optional “Start Part” link to the first chapter;
- a short completion statement describing what the reader will be able to explain or calculate.

### Files and locations

- **Modify:** `site/index.html`
  - replace or prepare the current flat chapter-card markup for grouped rendering;
  - retain the hero and existing book introduction.
- **Modify:** `site/site.css`
  - add styles for `.book-part`, `.part-heading`, `.part-summary`, `.part-range`, and part-scoped chapter grids.
- **Modify:** `site/book-data.js`
  - provide part summaries and learning outcomes.
- **Optional create:** `site/home.js`
  - use this only if dynamic home-page rendering would make `index.html` substantially cleaner;
  - otherwise keep the rendering in a small inline script.

### Detailed implementation notes

- Keep every existing chapter card title and summary unless a separate editorial story changes it.
- Part sections should remain scannable; do not add long chapter descriptions.
- Use semantic markup: one heading for the chapters section, one heading per part and one heading per chapter card.
- Maintain keyboard navigation and visible focus states.
- On mobile, part descriptions should appear before their chapter cards without horizontal scrolling.
- The five parts should use a coherent visual distinction without assigning colours that conflict with Query, Key or Value visual semantics.

### Acceptance criteria

- The page visibly contains five parts in the agreed order.
- All 24 chapter cards are present exactly once.
- “Start with Chapter 1” continues to work.
- Each part has a clear summary and chapter range.
- The design works at approximately 375 px, 768 px and desktop widths.
- Screen-reader heading order is logical.

### Dependencies

- COH-1.1.

### Out of scope

- Tracking actual reader completion in browser storage.
- Search and filtering.
- Reordering chapters.

### Verification

- Count chapter cards programmatically or manually.
- Test keyboard-only navigation.
- Check that all chapter links preserve the current version query behaviour.

---

## COH-1.3 — Add part-aware chapter progress and navigation

**Status:** Planned

### User story

As a reader inside a chapter, I want to see the current part and my progress through it so that I know what I have completed and what comes next without scanning 24 numbered buttons.

### Planned changes

Add a compact part-aware progress component to the chapter reader. For example:

```text
PART III — HOW THE MODEL LEARNS
12 Targets → 13 Loss → [14 Backpropagation] → 15 Training Run → 16 Scale → 17 Post-training
```

The component should:

- identify the current part;
- list chapters within that part using short labels;
- highlight the active chapter;
- provide links to sibling chapters;
- expose a route back to all parts;
- preserve previous/next chapter links at the bottom.

### Files and locations

- **Modify:** `site/chapter.html`
  - add a container for part identity and progress;
  - simplify or replace the current 1–24 button strip in the sticky header.
- **Modify:** `site/app.js`
  - build the part progress component from canonical metadata;
  - add active state and `aria-current`.
- **Modify:** `site/site.css`
  - style desktop, tablet and mobile variants;
  - ensure the component can wrap or scroll accessibly without hiding chapter labels.
- **Modify:** `site/book-data.js`
  - add concise navigation labels where full titles are too long.

### Detailed implementation notes

- The header should not become taller than necessary.
- On small screens, use a part selector plus previous/current/next chapter controls rather than 24 buttons.
- Keep the left sidebar focused on headings inside the current chapter.
- The reader must still be able to jump directly to any chapter through the home page.
- The active part and chapter should be machine-readable with ARIA attributes.

### Acceptance criteria

- Every chapter page shows the correct part title.
- Every chapter page shows correct progress within its part.
- Current chapter state is visibly and semantically identified.
- Navigation from Chapter 8 to 9, 11 to 12, 17 to 18 and 22 to 23 makes the part transition explicit.
- Mobile navigation contains no clipped or unreachable controls.

### Dependencies

- COH-1.1.

### Out of scope

- Persisted completion state.
- User accounts or bookmarks.

### Verification

- Test the first, middle and final chapter of each part.
- Test boundary chapters 8, 9, 11, 12, 17, 18, 22 and 23.
- Check focus order and accessible names.

---

## COH-1.4 — Align repository documentation with the five-part structure

**Status:** Complete

### User story

As a contributor, I want the README and chapter manifest to use the same part structure as the website so that editorial planning and published navigation refer to the same book architecture.

### Planned changes

- Add part headings to the current chapter list in `README.md`.
- Add a `Part` column to `manifest.md`.
- Add a short learning outcome for each part.
- Update any “current workspace status” text that describes chapter ranges.
- Document that `site/book-data.js` is the canonical site metadata and `manifest.md` is the editorial publication record.

### Files and locations

- **Modify:** `README.md`
  - “Current chapters”;
  - “Current workspace status”;
  - “Repository layout”.
- **Modify:** `manifest.md`
  - chapter table;
  - learning sequence;
  - immediate production order if part-aware planning improves it.
- **Modify:** `docs/stories.md`
  - mark this story complete when implemented; do not rewrite the backlog scope.

### Acceptance criteria

- Chapter membership matches the site exactly.
- No chapter appears in two parts.
- Part names are identical across README, manifest and site metadata.
- Documentation clearly distinguishes canonical prose, site metadata and editorial status.

### Dependencies

- COH-1.1.

### Verification

- Compare all part ranges against `site/book-data.js`.
- Run any consistency checker introduced by EPIC-COH-5.

---

## COH-1.5 — Validate part navigation and responsive behaviour

**Status:** Planned

### User story

As a maintainer, I want automated and manual checks for part metadata and navigation so that future chapter additions do not silently break the book structure.

### Planned changes

Add checks for:

- all chapters assigned to exactly one part;
- contiguous chapter ranges;
- valid first and last chapter references;
- unique chapter numbers and source paths;
- valid previous and next relationships;
- every part having a title, summary and learning outcome.

### Files and locations

- **Create or extend:** `scripts/check-book-consistency.mjs`
- **Modify:** `.github/workflows/pages.yml`
  - run the metadata/navigation validation before assembling `_site`.
- **Modify:** `README.md`
  - document the local validation command.

### Acceptance criteria

- The build fails with a useful message if part metadata is inconsistent.
- A valid repository passes locally and in GitHub Actions.
- Manual responsive checks are recorded in the implementation PR or commit notes.

### Dependencies

- COH-1.1.
- May share infrastructure with COH-5.3 and COH-5.4.

### Verification

Temporarily test invalid metadata on a branch or locally, including a duplicate chapter and a missing part assignment, then restore valid data.

---

# EPIC-COH-2 — Make positional information continuous instead of a rewind

**Status:** Planned

## Epic outcome

Readers should understand from Chapter 1 that the initial hidden-state matrix contains or is affected by positional information, while Chapter 9 remains the detailed treatment of learned positions, sinusoidal encodings and RoPE. Chapter 9 should feel like opening a previously labelled box, not returning to a prerequisite that was omitted.

## Epic acceptance criteria

- Chapter 1 clearly distinguishes tensor row order from numerical position information available to the model.
- Chapters 2–8 consistently describe their input as a current hidden state that already includes the architecture’s position treatment where applicable.
- Chapter 9 no longer opens with “A deliberate rewind”.
- The detailed RoPE explanation remains after Query and Key have been taught.
- Visual plans and any new bridge artwork follow the established inference visual language.

---

## COH-2.1 — Add the minimum positional scaffold to Chapter 1

**Status:** Planned

### User story

As a first-time reader, I want to know where the initial hidden-state matrix comes from so that I do not confuse row order in a tensor with position information learned or used by the model.

### Planned changes

Insert a new section after **“Is the vector still just an embedding?”** in `src/chapter-01.md`.

The section should explain:

- token IDs are mapped to token embeddings;
- the architecture also makes position available;
- a simple teaching model can represent this as \(X^{(0)} = E + P\);
- other architectures, including RoPE-based models, inject position differently;
- the current Chapters 1–8 calculations treat the provided \(X\) as the state entering the attention block;
- the framework retains row alignment, but row index alone is not a rich learned positional representation.

Include one compact shape table:

| Object | Meaning | Shape in the running example |
|---|---|---|
| \(E\) | token embeddings | \(3 \times 4\) |
| \(P\) | simple positional contribution | \(3 \times 4\) |
| \(X^{(0)}\) | initial states | \(3 \times 4\) |

### Files and locations

- **Modify:** `src/chapter-01.md`
  - after “Is the vector still just an embedding?”;
  - update nearby handoff text to point to Chapter 9.
- **Modify if needed:** `docs/chapter-01/` planning material, if such a chapter-specific plan exists.
- **Modify:** `docs/inference-loop-scene-master-plan.md`
  - document the new bridge and its visual role.

### Detailed implementation notes

- Keep this section short enough not to derail the hidden-state lesson.
- Do not introduce the sinusoidal formula or rotation matrices.
- Explicitly state that \(X^{(0)}=E+P\) is one common additive model, not a universal description of all modern Transformers.
- Preserve the existing `THE CAT SAT` numerical matrix.
- Do not imply that positional information is necessarily retained as a separately identifiable subvector after many layers.

### Acceptance criteria

- A reader can answer: “Why is row 2 not sufficient by itself to tell the learned computation that CAT is at position 2?”
- Chapter 1 names Chapter 9 as the full explanation.
- Existing equations and images still render.
- The new text does not claim that every architecture adds a positional vector directly to embeddings.

### Dependencies

None.

### Verification

Editorial review against Chapter 9 terminology and the Chapter 1 section “The framework knows the row; the model receives the vector”.

---

## COH-2.2 — Standardise positional wording across Chapters 2–8

**Status:** Planned

### User story

As a reader following the running example, I want every early chapter to describe \(X\) consistently so that I do not alternate between thinking of it as a raw embedding matrix and a fully contextual state.

### Planned changes

Perform a targeted terminology sweep of Chapters 2–8.

Preferred wording:

- “current hidden state” for the input to a sublayer;
- “initial hidden state” or \(X^{(0)}\) only at the model entrance;
- “token embedding” only for the embedding lookup output before position and later block updates;
- “row position” for tensor bookkeeping;
- “positional mechanism” for learned absolute positions, sinusoidal encodings, relative bias or RoPE.

### Files and locations

- **Modify:** `src/chapter-02.md`
- **Modify:** `src/chapter-03.md`
- **Modify:** `src/chapter-04.md`
- **Modify:** `src/chapter-05.md`
- **Modify:** `src/chapter-06.md`
- **Modify:** `src/chapter-07.md`
- **Modify:** `src/chapter-08.md`

### Detailed implementation notes

- Change only wording that is ambiguous or inconsistent.
- Preserve all numerical values and matrix symbols unless a clear notation defect is found.
- Add a one-line reminder in the first chapter that materially depends on position, not in every section.
- Confirm that causal-mask explanations distinguish permission to attend from positional representation.
- Do not turn this story into a broad prose rewrite.

### Acceptance criteria

- No chapter calls the running \(X\) “just the token embeddings” when it represents current or initial hidden states with position already accounted for.
- Causal masking is never presented as a complete substitute for positional representation.
- “Embedding”, “initial state” and “current hidden state” are used consistently.

### Dependencies

- COH-2.1 should define the preferred language first.

### Verification

Search all seven files for `embedding`, `position`, `row`, `state`, `causal` and manually inspect each occurrence.

---

## COH-2.3 — Reframe Chapter 9 as opening the position mechanism

**Status:** Planned

### User story

As a reader reaching Chapter 9, I want the chapter to deepen an earlier promise rather than announce that the book is stepping backwards.

### Planned changes

Replace the section **“A deliberate rewind”** with an opening such as **“Open the position box”** or **“How position entered the computation”**.

The revised opening should:

- refer back to Chapter 1’s minimal scaffold;
- state that Chapters 1–8 treated \(X\) as already prepared for the block;
- explain why detailed position mechanisms are taught now:
  - readers already understand Query and Key;
  - RoPE acts directly on Query and Key;
  - the distinction between row order, causal visibility and relative position is now meaningful;
- preserve the current learned absolute, sinusoidal and RoPE sections.

### Files and locations

- **Modify:** `src/chapter-09.md`
  - chapter opening;
  - transition into learned absolute positions;
  - “Recovering our running input matrix” wording;
  - final handoff if needed.
- **Modify:** `site/index.html` or `site/book-data.js`
  - only if the chapter summary should reflect the reframed promise.
- **Modify:** `manifest.md`
  - only if the Chapter 9 learning-sequence wording needs alignment.

### Acceptance criteria

- The phrase “A deliberate rewind” is removed.
- The chapter explicitly names the earlier assumption it is now unpacking.
- RoPE remains after Query and Key in the book sequence.
- The chapter does not imply that additive positions and RoPE are applied simultaneously in all architectures.

### Dependencies

- COH-2.1.
- COH-2.2.

### Verification

Read the end of Chapter 8, opening of Chapter 9 and opening of Chapter 10 as one continuous sequence.

---

## COH-2.4 — Plan and integrate a position bridge illustration

**Status:** Planned

### User story

As a visual learner, I want one compact image showing token identity and position combining into the initial state so that the Chapter 1 scaffold is memorable without pre-teaching all of Chapter 9.

### Planned changes

Design one illustration that shows:

```text
token identity card E
        +
position/address card P
        =
initial hidden-state card X⁽⁰⁾
```

The illustration must also include a small note:

> Some architectures inject position differently; Chapter 9 compares the main approaches.

### Files and locations

- **Modify:** `docs/inference-loop-scene-master-plan.md`
  - add asset purpose, placement, technical guardrails and alt-text draft.
- **Create or modify:** a Chapter 1 scene plan under `docs/chapter-01/` if the repository uses one.
- **Create later:** an asset under `assets/chapter-01/`.
- **Modify later:** `src/chapter-01.md` to reference the approved asset.

### Detailed implementation notes

- Reuse THE, CAT and SAT visual grammar.
- The token character remains the token position; the card represents the vector.
- Do not depict row numbers as if they are automatically read as semantic position features.
- Avoid showing RoPE as an additive card.
- The image should be useful at mobile width and should not require tiny matrix text.

### Acceptance criteria

- Scene plan is approved before generation.
- Alt text explains the conceptual operation without relying on colour.
- The final image matches the established cartoon style.
- The image does not make a universal architecture claim.

### Dependencies

- COH-2.1.
- Visual production can be scheduled after prose approval.

### Verification

Technical review against Chapter 9 and the inference visual master plan.

---

## COH-2.5 — Review the Chapter 8→9→10 continuity

**Status:** Planned

### User story

As a reader, I want the end of the completed-block chapter, the position chapter and the stacked-block chapter to form one continuous argument.

### Planned changes

- Adjust Chapter 8’s final handoff so it says that the book has completed the block computation but has not yet opened the architecture-specific position mechanism.
- Adjust Chapter 9’s conclusion so it hands a position-aware block into the stack.
- Adjust Chapter 10’s opening so it assumes the Chapter 9 position treatment without re-explaining it.
- Add a compact three-step transition panel if the workbook epic is already available.

### Files and locations

- **Modify:** `src/chapter-08.md`
- **Modify:** `src/chapter-09.md`
- **Modify:** `src/chapter-10.md`

### Acceptance criteria

- The three chapters do not repeat the same position explanation.
- The transition makes clear that computational order and teaching order differ intentionally.
- Chapter 10 receives a well-defined state and can proceed directly to depth and KV caching.

### Dependencies

- COH-2.3.
- Can optionally use components from EPIC-COH-3.

### Verification

Read only the last two sections of Chapter 8, first and last two sections of Chapter 9, and first two sections of Chapter 10.

---

# EPIC-COH-3 — Add a cumulative Transformer Workbook

**Status:** Planned

## Epic outcome

Chapters 1–11 should visibly accumulate one running calculation. Readers should be able to identify what tensors already exist, what the current chapter creates, the shape of each object and where each numerical value originated.

## Epic acceptance criteria

- A canonical ledger defines the running example and derived objects.
- Every inference chapter shows “already available” and “created here” objects.
- Every inference chapter ends with a checkpoint and handoff.
- Ledger data is rendered from shared metadata rather than manually duplicated into every chapter.
- Numerical values in the ledger agree with chapter calculations.
- The component is readable on mobile and does not overwhelm the main narrative.

---

## COH-3.1 — Create the canonical running-example ledger

**Status:** Planned

### User story

As an author or reviewer, I want one source of truth for the `THE CAT SAT` calculation so that values and shapes do not drift between chapters.

### Planned changes

Create a document containing:

- fixed token sequence;
- model width, head count, \(d_k\), \(d_v\) and MLP width used in the worked path;
- input matrices and learned matrices;
- derived tensors in chapter order;
- numerical precision policy;
- owning chapter for every derived object;
- references to sections where each value is calculated;
- notes explaining where a later chapter uses rounded versus unrounded values.

### Files and locations

- **Create:** `docs/running-example-ledger.md`
- **Reference from:** `README.md`
- **Reference from:** `docs/editorial-and-notation-guide.md` when EPIC-COH-5 is implemented.
- **Potentially create:** `scripts/verify-running-example.mjs` or a Python equivalent if calculations are machine-checked.

### Required ledger entries

At minimum:

- \(X\);
- \(W^Q, Q\);
- \(W^K, K\);
- raw scores \(S\);
- scaled scores;
- causal mask \(M\);
- masked logits \(L\);
- attention weights \(A\);
- \(W^V, V\);
- Head 1 output \(Z_1\);
- Head 2 projections, weights and output \(Z_2\);
- concatenated output \(H\);
- \(W^O, Y\);
- residual and normalised states;
- MLP intermediate and output matrices;
- final completed-block state;
- any later state used for vocabulary logits.

### Acceptance criteria

- Every value is traceable to a chapter and section.
- Shapes are listed for every matrix.
- Precision and rounding rules are explicit.
- Machine verification reproduces values within the documented tolerance, if a verification script is included.

### Dependencies

None.

### Verification

Cross-check Chapters 1–8 line by line and run independent calculations.

---

## COH-3.2 — Add workbook stage metadata to the site data model

**Status:** Planned

### User story

As a site renderer, I need structured input/output metadata for each inference chapter so that workbook cards can be generated consistently.

### Planned changes

For Chapters 1–11, add metadata such as:

- stage number and short stage name;
- inputs already available;
- objects produced;
- shapes;
- concise operation;
- checkpoint summary;
- next unanswered question;
- link or anchor to the detailed calculation.

Example concept:

```js
{
  chapter: 5,
  stage: "Retrieve Values",
  available: ["X", "Q", "K", "A"],
  creates: ["V", "Z_1"],
  nextQuestion: "Why run more than one attention head?"
}
```

### Files and locations

- **Modify:** `site/book-data.js`
- **Modify:** `docs/running-example-ledger.md`
  - document the mapping from editorial ledger names to site labels.

### Detailed implementation notes

- Metadata should be concise; do not place complete matrices in JavaScript.
- Use MathJax-compatible labels or plain symbol strings that can be rendered safely.
- Support chapters that create conceptual rather than single tensor outputs, especially Chapters 9–11.
- Keep the metadata optional for Chapters 12–24 until a later training workbook is designed.

### Acceptance criteria

- Chapters 1–11 have complete stage metadata.
- Missing metadata fails gracefully without breaking chapter rendering.
- Labels use notation consistent with chapter prose.

### Dependencies

- COH-1.1.
- COH-3.1.

### Verification

Compare the metadata against the canonical ledger and each chapter opening.

---

## COH-3.3 — Render the workbook card at the start of inference chapters

**Status:** Planned

### User story

As a reader, I want a compact recap of available tensors and this chapter’s output so that I can resume the calculation without rereading previous chapters.

### Planned changes

Inject a workbook card near the beginning of Chapters 1–11, after the chapter hero and before or after “The question this chapter answers”, depending on visual testing.

The card should contain:

- part and stage;
- “Already available” objects;
- “Created in this chapter” objects;
- shapes where they add clarity;
- a one-line operation;
- progress through the inference path.

### Files and locations

- **Modify:** `site/app.js`
  - create and inject the component.
- **Modify:** `site/site.css`
  - add `.workbook-card`, `.workbook-available`, `.workbook-creates`, `.workbook-progress`, and responsive styles.
- **Modify:** `site/book-data.js`
  - consume stage metadata.

### Detailed implementation notes

- Use semantic lists or a small table, not an inaccessible visual-only diagram.
- Avoid duplicating long matrices.
- The card must not be confused with a warning, exercise or “Remove the costumes” box.
- Use established symbol semantics and neutral styling; do not invent colours that contradict chapter artwork.
- Provide print styles.

### Acceptance criteria

- Correct card appears in Chapters 1–11.
- No card appears in later chapters unless metadata is deliberately added.
- The active stage is clearly highlighted.
- The card fits a 375 px viewport without horizontal page scrolling.
- Screen readers announce the stage and lists in a logical order.

### Dependencies

- COH-3.2.

### Verification

Open all 11 chapters, especially 1, 5, 6, 9 and 11.

---

## COH-3.4 — Add chapter checkpoints and explicit handoffs

**Status:** Planned

### User story

As a reader finishing a chapter, I want a concise record of what was produced and the precise unanswered question for the next chapter.

### Planned changes

Add or standardise a final section in Chapters 1–11:

```text
Chapter checkpoint
- We started with ...
- We calculated ...
- The new object means ...
- It does not yet ...
- Next question: ...
```

The handoff should name the next chapter’s need, not merely say “coming next”.

### Files and locations

- **Modify:** `src/chapter-01.md` through `src/chapter-11.md`
- **Modify if needed:** chapter-specific scene plans for handoff art.
- **Modify:** `docs/inference-loop-scene-master-plan.md`
  - define the checkpoint/handoff textual pattern alongside the visual handoff pattern.

### Detailed implementation notes

- Reuse existing strong summary sections where present rather than adding duplicates.
- Keep checkpoints under roughly one screen on desktop.
- Include shapes only where they reinforce the chapter’s main result.
- For Chapter 11, hand off from inference to training by asking where correct next-token answers come from.

### Acceptance criteria

- Each chapter ends with a distinct product and next question.
- Handoffs match actual next-chapter content.
- Repetition between the checkpoint and existing chapter summary is removed.
- Chapter 11 creates a clear bridge to Chapter 12.

### Dependencies

- COH-3.1.
- Can be implemented before or after COH-3.3.

### Verification

Read only the checkpoint of Chapter N and opening question of Chapter N+1 for all boundaries 1→2 through 11→12.

---

## COH-3.5 — Verify workbook numbers and prevent drift

**Status:** Planned

### User story

As a maintainer, I want automated checks for the running example so that an editorial update cannot leave downstream matrices inconsistent.

### Planned changes

Create a verification script that:

- stores canonical input matrices;
- recomputes Queries, Keys, Values, attention weights and head outputs;
- compares calculated values with ledger values;
- applies the documented rounding tolerance;
- reports the chapter and symbol associated with a mismatch.

### Files and locations

- **Create:** `scripts/verify-running-example.py` or `scripts/verify-running-example.mjs`
- **Modify:** `.github/workflows/pages.yml`
  - invoke the script before deployment.
- **Modify:** `README.md`
  - add the local command and prerequisites.
- **Modify:** `docs/running-example-ledger.md`
  - state which values are machine-verified.

### Detailed implementation notes

- Prefer standard-library code where feasible.
- If Python is used, avoid adding a heavy dependency solely for small matrix operations unless justified.
- The script should distinguish source precision from display rounding.
- It should not parse arbitrary LaTeX from Markdown in the first version; canonical machine-readable values may live in the script or a small data file.

### Acceptance criteria

- Current calculations pass.
- A deliberate changed matrix entry produces a clear failure.
- The script executes reliably in GitHub Actions.
- Verification does not materially slow the Pages build.

### Dependencies

- COH-3.1.

### Verification

Run valid and intentionally invalid test cases.

---

# EPIC-COH-4 — Support a core reading path and optional calculation laboratories

**Status:** Planned

## Epic outcome

The book should retain rigorous, inspectable calculations while allowing a first-time reader to follow the conceptual path without being forced through every coordinate expansion, derivative chain or secondary reference table.

## Epic acceptance criteria

- The repository defines a clear content-depth taxonomy.
- Expandable calculation laboratories work in the web reader and expand in print.
- Core conceptual equations and at least one representative calculation remain visible.
- Detailed arithmetic is not deleted.
- TOC behaviour remains useful.
- Conversion is performed in controlled chapter groups and reviewed for accidental loss of context.

---

## COH-4.1 — Define the content-depth taxonomy

**Status:** Planned

### User story

As an editor, I want rules for what belongs in the core path versus an optional lab so that chapter shortening decisions are consistent and not subjective.

### Planned changes

Define four content classes:

1. **Core explanation**
   - required to understand the chapter’s purpose and result.
2. **Calculation lab**
   - coordinate-level verification, repeated rows or full numerical derivations.
3. **Implementation note**
   - framework layouts, fused projections, kernel details or production variants.
4. **Reference extension**
   - model catalogues, alternative methods, long comparison tables or historical notes.

Define mandatory core elements:

- chapter question;
- big idea;
- defining equation or system diagram;
- one representative exact example;
- shape or data-flow reasoning;
- misconception warning;
- checkpoint and handoff.

### Files and locations

- **Create or include in:** `docs/editorial-and-notation-guide.md`
- **Modify:** `docs/stories.md`
  - link this story’s implementation to the guide when complete.

### Acceptance criteria

- The guide contains examples drawn from Chapters 2, 6, 9, 14 and 23.
- Editors can classify a section without relying on word count alone.
- The guide states that optional does not mean unimportant or technically weaker.

### Dependencies

May be implemented alongside COH-5.1.

### Verification

Classify a sample of ten existing sections and review consistency.

---

## COH-4.2 — Add reusable calculation-lab rendering

**Status:** Planned

### User story

As a reader, I want optional detailed derivations to be expandable so that I can choose my level of depth without leaving the chapter.

### Planned changes

Support Markdown-authored HTML such as:

```html
<details class="calculation-lab">
  <summary>Calculation lab — verify both Query coordinates</summary>

  ...detailed derivation...

</details>
```

Add equivalent classes for implementation notes and reference extensions if useful.

### Files and locations

- **Modify:** `site/site.css`
  - accessible summary styling;
  - open/closed states;
  - nested equations and tables;
  - print styles that force content open.
- **Modify:** `site/app.js`
  - optional enhancement for stable anchors, open-on-deep-link and TOC markers.
- **Potentially modify:** `site/chapter.html`
  - add a reader control such as “Expand all labs” only if usability testing supports it.

### Detailed implementation notes

- Native `<details>` should remain usable without JavaScript.
- Keyboard focus must be visible.
- A URL fragment targeting a heading inside a closed lab should open the containing lab.
- Print CSS should display all lab contents and suppress disclosure markers that do not make sense on paper.
- The component should visually differ from exercises and warnings.

### Acceptance criteria

- Labs open and close with mouse and keyboard.
- Equations, tables and images render correctly inside labs.
- Deep links reveal their target.
- Printing or print preview includes all lab content.
- No JavaScript error occurs when a chapter contains no labs.

### Dependencies

- COH-4.1.

### Verification

Create a temporary sample containing equations, a table, code and a nested heading.

---

## COH-4.3 — Convert Chapters 2–9 to progressive reading depth

**Status:** Planned

### User story

As a reader learning attention for the first time, I want the conceptual calculation to stay visible while repeated arithmetic can be opened when I need it.

### Planned changes by chapter

- **Chapter 2**
  - keep the Query equation, matrix shapes, final SAT result and one coordinate derivation in core;
  - move the second coordinate derivation and optional full-sequence verification into labs;
  - keep shared-parameter meaning in core.
- **Chapter 3**
  - mirror Chapter 2’s structure for Key;
  - move repeated coordinate verification into labs;
  - keep Query-versus-Key distinction in core.
- **Chapter 4**
  - keep SAT’s three dot products, score-matrix meaning, scale, mask and one softmax row in core;
  - move repeated row calculations and extended numerical checks into labs.
- **Chapter 5**
  - keep Value meaning and SAT’s weighted retrieval in core;
  - move repeated THE/CAT output verification or secondary rows into labs.
- **Chapter 6**
  - keep the need for multiple heads and the complete Head 2 result in core;
  - move most repeated Head 2 arithmetic into labs after one representative check.
- **Chapter 7**
  - keep output projection, residual and LayerNorm concepts plus one SAT calculation in core;
  - move full matrix verification and extended normalisation arithmetic into labs.
- **Chapter 8**
  - keep expand–activate–contract and one coordinate calculation in core;
  - move repeated token calculations into labs.
- **Chapter 9**
  - keep one RoPE rotation example and relative-position conclusion in core;
  - move extended trigonometric verification or variants into labs.

### Files and locations

- **Modify:** `src/chapter-02.md` through `src/chapter-09.md`

### Detailed implementation notes

- Do not hide a first occurrence of a new operation.
- Do not put “Follow the shapes” entirely inside a lab.
- Preserve all existing headings that are linked from artwork-placement scripts unless those scripts are updated in the same change.
- Check headings referenced by `afterHeading` metadata before renaming or moving them.
- Avoid placing a hero or essential explanatory image inside a closed lab.

### Acceptance criteria

- Core path remains mathematically complete.
- All removed-from-core material remains available in a labelled lab.
- Artwork injection still finds its target headings.
- Chapter checkpoints reflect the streamlined path.
- A reviewer can read Chapters 2–9 with labs closed and explain the complete Transformer block path.

### Dependencies

- COH-4.2.
- Prefer COH-3.4 first so chapter endings are stable.

### Verification

- Read with all labs closed.
- Expand every lab and compare against the pre-change chapter content.
- Check artwork placement and TOC anchors.

---

## COH-4.4 — Convert training and scaling chapters to progressive depth

**Status:** Planned

### User story

As a reader learning training, I want the main causal chain from labels to loss to gradients to updates to remain clear while full derivative and distributed-memory arithmetic remains available.

### Planned changes by chapter group

- **Chapters 12–13**
  - keep target shifting, teacher forcing, masked loss and one exact cross-entropy calculation in core;
  - move repeated rows and extended metric calculations into labs.
- **Chapter 14**
  - keep the chain-rule path and one representative gradient route in core;
  - place full derivative expansions and secondary parameter gradients in labs.
- **Chapter 15**
  - keep effective batch, schedule, validation and checkpoint concepts in core;
  - move extended scenario calculations and configuration variants into labs or implementation notes.
- **Chapter 16**
  - keep the reason for each parallelism strategy and one memory example in core;
  - move full memory arithmetic, alternative sharding cases and communication detail into labs.
- **Chapter 17**
  - keep the progression from base model to supervised and preference tuning in core;
  - place algorithmic variants and long comparisons in reference extensions.

### Files and locations

- **Modify:** `src/chapter-12.md` through `src/chapter-17.md`

### Acceptance criteria

- The training loop remains understandable with labs closed.
- No definition needed later is hidden without a visible core summary.
- Detailed derivations are preserved.
- Chapter transitions 12→13→14→15 remain explicit.

### Dependencies

- COH-4.2.
- Editorial terminology from COH-5.1 is preferred.

### Verification

Read the core path as a continuous training narrative, then compare expanded content against the prior version.

---

## COH-4.5 — Separate core guidance from reference depth in Chapters 18–24

**Status:** Planned

### User story

As a reader exploring the wider LLM system, I want the decision framework and architecture distinctions to remain prominent while long catalogues and variants remain available for reference.

### Planned changes

- **Chapter 18:** keep the three-family distinction and information-flow comparison in core; move extended model catalogues into reference sections.
- **Chapter 19:** keep the complete source of Query, Key and Value and one cross-attention calculation in core; move repeated arithmetic into a lab.
- **Chapter 20:** keep the lifecycle map and definitions in core; move extended adaptation comparisons into reference extensions.
- **Chapter 21:** keep weights versus prompt versus retrieval versus tools and one RAG pipeline in core; move extended chunking/retrieval variants and security checklists into implementation/reference notes.
- **Chapter 22:** keep modality encoder, projector and integration patterns in core; move architecture variants into reference extensions.
- **Chapter 23:** keep the principal efficiency trade-offs and decision framework in core; move technique catalogues and extended serving comparisons into reference extensions.
- **Chapter 24:** keep evaluation-as-a-system, slices, failure modes and release gates in core; move extended metric catalogues and checklists into reference extensions.

### Files and locations

- **Modify:** `src/chapter-18.md` through `src/chapter-24.md`

### Acceptance criteria

- Each chapter has a visible decision framework or central system model.
- Model names and technique lists do not dominate the opening half of a chapter.
- Reference content remains searchable and printable.
- Claims that can become time-sensitive are clearly framed for later source review.

### Dependencies

- COH-4.2.
- COH-5.1 and COH-5.2 are preferred.

### Verification

Read each chapter with reference sections closed and confirm the chapter still fulfils its opening question.

---

## COH-4.6 — Make TOC, deep links and print output lab-aware

**Status:** Planned

### User story

As a reader using the sidebar, a shared link or a printed copy, I want optional sections to behave predictably in every reading mode.

### Planned changes

- Mark TOC entries that live inside a lab.
- Open a containing lab when navigating to one of its anchors.
- Decide whether deeply nested lab headings appear in the main TOC or a lab-local mini-TOC.
- Add an “Expand all details” print rule.
- Ensure previous/next navigation remains outside labs.
- Ensure MathJax typesets content whether the lab is initially open or closed.

### Files and locations

- **Modify:** `site/app.js`
- **Modify:** `site/site.css`
- **Modify if needed:** `site/chapter.html`

### Acceptance criteria

- A copied deep link opens and reveals its target.
- TOC labels distinguish optional detail without devaluing it.
- Print preview contains all content.
- No layout shift makes the target inaccessible under the sticky header.

### Dependencies

- COH-4.2.

### Verification

Test links to headings inside closed labs in Chapters 2, 9 and 14, plus browser print preview.

---

# EPIC-COH-5 — Establish an enforceable editorial, notation and visual contract

**Status:** Planned

## Epic outcome

The book should have one explicit contract for terminology, symbols, chapter structure, numerical precision, visual metaphors and repository validation. Future chapters and revisions should be checked against that contract automatically where possible.

## Epic acceptance criteria

- A canonical editorial and notation guide exists.
- Visual worlds are defined for inference, training and broader systems chapters.
- A repository consistency script checks structural and asset rules.
- GitHub Pages runs validation before deployment.
- All 24 chapters receive a controlled normalisation pass.
- The contract distinguishes mandatory rules from chapter-specific flexibility.

---

## COH-5.1 — Create the editorial and notation guide

**Status:** Planned

### User story

As an author or reviewer, I want one canonical guide for prose, symbols and chapter structure so that readers do not have to relearn conventions from chapter to chapter.

### Planned changes

Create `docs/editorial-and-notation-guide.md` with the following sections.

#### A. Book voice

- approachable but technically correct;
- story intuition before formal detail where appropriate;
- no claim that cartoon dialogue is literal model reasoning;
- concise warnings where analogies stop;
- avoid unnecessary metaphor switching.

#### B. Canonical notation

- one token state: \(x_t\);
- all token states: \(X\);
- learned projections: \(W^Q, W^K, W^V, W^O\);
- one projected vector: \(q_t, k_t, v_t\);
- matrices of projected vectors: \(Q, K, V\);
- pairwise indices: \(i,j\);
- sequence length: define when using \(n\) versus \(T\);
- model width and head widths: \(d_{\text{model}}, d_k, d_v\);
- token positions are rows unless a chapter explicitly declares another convention;
- use \(=\) for exact values and \(\approx\) for rounded values.

#### C. Terminology distinctions

- token ID;
- token embedding;
- initial hidden state;
- current hidden state;
- residual stream;
- attention score, logit and weight;
- Key versus Value;
- causal mask versus positional mechanism;
- model parameter versus activation;
- training objective versus evaluation metric.

#### D. Chapter contract

Recommended order:

1. question;
2. position in the book;
3. available inputs;
4. story or system intuition;
5. story-to-mechanism translation;
6. defining equation or data flow;
7. representative example;
8. shape or interface reasoning;
9. misconception;
10. optional lab, implementation note or reference extension;
11. checkpoint;
12. handoff.

The guide should explicitly permit exceptions for system-level chapters where a matrix shape would be artificial.

#### E. Numerical policy

- precision retained for source calculations;
- display rounding;
- tolerance for machine verification;
- no silent switch between rounded and unrounded matrices;
- units and dimensions named where relevant.

#### F. Accessibility and graphics

- meaningful alt text;
- no colour-only distinctions;
- minimum readable text size in images;
- illustrations must state where analogy ends;
- mathematical objects usually remain props rather than one-off mascots.

### Files and locations

- **Create:** `docs/editorial-and-notation-guide.md`
- **Modify:** `README.md`
  - link the guide under repository layout or contributor guidance.
- **Modify:** `docs/inference-loop-scene-master-plan.md`
  - reference the guide as the book-wide parent contract.
- **Modify:** `docs/training-loop-scene-master-plan.md`
  - reference the same guide.

### Acceptance criteria

- The guide covers prose, notation, structure, precision and accessibility.
- Examples use actual book chapters.
- It defines rules without forcing identical chapter layouts.
- Existing inference and training plans link to it rather than duplicating general rules.

### Dependencies

None.

### Verification

Review against Chapters 1, 4, 7, 9, 14, 18, 21 and 24.

---

## COH-5.2 — Define visual worlds for all five parts

**Status:** Planned

### User story

As an art director or chapter author, I want stable visual worlds for each book arc so that later illustrations feel related without forcing the dating-service metaphor into unrelated topics.

### Planned changes

Retain and connect three broad visual systems.

#### Inference world — Chapters 1–11

- Attention Dating Service;
- Question Coach, Profile Writer, Information Courier;
- Head Specialists and Team Lead;
- private thinking room;
- Transformer tower;
- audition or vocabulary stage.

#### Training world — Chapters 12–17

- classroom and answer key;
- Scorekeeper;
- backward blame trail;
- training factory;
- distributed factory floor;
- assistant finishing school or post-training workshop.

#### System world — Chapters 18–24

- architecture neighbourhood for model families;
- translator desk and encoder memory wall for cross-attention;
- foundation-model construction and adaptation workshop;
- open book, memory library and controlled tool belt;
- multimodal bridge;
- deployment workshop;
- evaluation clinic.

### Files and locations

- **Modify:** `docs/inference-loop-scene-master-plan.md`
  - clarify scope and parent contract.
- **Modify:** `docs/training-loop-scene-master-plan.md`
  - clarify scope and parent contract.
- **Create:** `docs/system-map-scene-master-plan.md`
  - Chapters 18–24 visual ontology, cast, places, recurring props, exclusions and handoffs.
- **Modify later:** chapter-specific scene plans for Chapters 18–24.

### Detailed implementation notes

- Stable metaphors may change at part boundaries, but the paper, line, typography and annotation grammar should remain recognisably one book.
- Do not create a mascot for every mathematical object.
- Distinguish characters that perform operations from props that represent tensors, caches, scores or documents.
- Include a part-transition scene where a visual world changes.
- Define colour semantics globally and identify any chapter-specific exceptions.

### Acceptance criteria

- Every chapter belongs to one declared visual world.
- Chapters 18–24 have a production-ready master plan.
- The system plan includes technical guardrails and alt-text patterns.
- The dating-service metaphor is not stretched into RAG, quantisation or evaluation.

### Dependencies

- COH-5.1.

### Verification

Map every planned or existing chapter hero to the appropriate world and review for metaphor collisions.

---

## COH-5.3 — Build the book consistency checker

**Status:** Planned

### User story

As a maintainer, I want structural and asset validation to run automatically so that editorial drift is caught before publishing.

### Planned checks

#### Chapter inventory

- Chapters 1–24 exist.
- Front matter contains title, subtitle and language.
- Chapter numbers in titles match filenames.
- Metadata catalogue points to existing source files.

#### Required structural anchors

- “The question this chapter answers” or an approved equivalent exists.
- A checkpoint/handoff exists when the chapter contract requires one.
- Duplicate heading IDs after slugification are detected or reported.
- Artwork placement headings referenced from JavaScript exist.

#### Assets

- Markdown image paths resolve.
- Images have non-empty alt text.
- Asset aliases point to existing destinations.
- No empty or zero-byte image is published.

#### Links and navigation

- Local Markdown links resolve.
- Chapter previous/next relationships are valid.
- Part membership is complete and unique.

#### Notation and content heuristics

Report, but do not necessarily fail immediately, on:

- inconsistent `x_sat` versus `x_{\text{sat}}` forms;
- mixed exact and approximate operators near rounded matrices;
- use of deprecated terminology recorded in the editorial guide;
- missing “analogy warning” where a scene plan requires one.

### Files and locations

- **Create:** `scripts/check-book-consistency.mjs`
- **Optional create:** `scripts/book-rules.json`
  - only if configuration becomes clearer outside code.
- **Modify:** `README.md`
  - document usage and failure categories.

### Detailed implementation notes

- Separate hard errors from advisory warnings.
- Produce file paths, headings and actionable messages.
- Avoid fragile full Markdown parsing if a simpler robust method works; use a maintained parser only if justified.
- The checker should run without network access.
- Return a non-zero exit status on hard failures.

### Acceptance criteria

- Current valid repository passes hard checks.
- Deliberately broken front matter, image path and chapter metadata each produce clear failures.
- Warnings do not fail the build until the team deliberately promotes them to errors.
- Runtime is suitable for every Pages deployment.

### Dependencies

- COH-1.1 for metadata checks.
- COH-5.1 for terminology rules.
- Can absorb validation requested by COH-1.5 and COH-3.5 where appropriate.

### Verification

Maintain a documented set of temporary fault-injection tests or small fixtures.

---

## COH-5.4 — Run validation in the GitHub Pages workflow

**Status:** Planned

### User story

As a publisher, I want the Pages deployment to stop when the book is structurally invalid so that broken chapters are not presented as the latest accepted edition.

### Planned changes

Add steps before **“Assemble static website”**:

1. validate JavaScript syntax for all site scripts that require it;
2. run `scripts/check-book-consistency.mjs`;
3. run the running-example verifier from COH-3.5;
4. optionally report advisory warnings in the action summary.

### Files and locations

- **Modify:** `.github/workflows/pages.yml`
- **Modify:** `README.md`
  - list the commands developers should run before pushing.

### Detailed implementation notes

- Keep error output visible in the failed step.
- Do not publish `_site` if validation fails.
- Pin or use stable action versions.
- Avoid adding secrets or network-dependent validation.
- If Python is required for the running example, explicitly set up the supported Python version.

### Acceptance criteria

- A valid commit deploys normally.
- A hard consistency failure prevents deployment.
- Existing authentication-script validation remains in place.
- Workflow logs identify the failed file or rule.

### Dependencies

- COH-5.3.
- COH-3.5 if numerical verification is included in the same change.

### Verification

Run the workflow on a valid branch and a branch with one intentional hard failure.

---

## COH-5.5 — Perform the whole-book editorial and notation normalisation pass

**Status:** Planned

### User story

As a reader, I want symbols, terminology and chapter rhythm to remain stable across all 24 chapters so that later chapters build on learned conventions instead of redefining them.

### Planned changes

Review all chapters in controlled groups.

#### Pass A — Chapters 1–8

- hidden state, Query, Key, Value and residual terminology;
- row-vector orientation;
- exact versus approximate values;
- consistent “Remove the costumes” terminology.

#### Pass B — Chapters 9–11

- position terminology;
- layer-index notation;
- KV-cache naming;
- hidden state versus logits versus probability.

#### Pass C — Chapters 12–17

- token IDs versus hidden states;
- label, target, loss and metric terminology;
- gradient, parameter update and optimiser terminology;
- batch, microbatch and effective batch.

#### Pass D — Chapters 18–24

- architecture-family terminology;
- cross-attention tensor sources;
- pretraining, continued pretraining, fine-tuning and prompting;
- parametric memory, prompt context, retrieval and tools;
- model evaluation versus system evaluation.

### Files and locations

- **Modify:** `src/chapter-01.md` through `src/chapter-24.md`
- **Modify when required:** `site/book-data.js` summaries.
- **Modify when headings change:** artwork-placement scripts and chapter scene plans.
- **Modify:** `CHANGELOG.md`
  - record each completed pass.

### Detailed implementation notes

- Use separate commits or PRs per pass to reduce review risk.
- Do not mix large visual production work into the notation pass.
- Preserve verified numerical values unless the checker identifies an error.
- Update cross-references when terminology changes.
- Avoid replacing precise standard terms with friendlier but incorrect alternatives.

### Acceptance criteria

- All hard rules in the guide are satisfied.
- Advisory checker warnings are reviewed and either fixed or explicitly accepted.
- Cross-chapter handoffs use the same object names as the next chapter.
- No artwork placement is broken by heading changes.
- Each pass receives technical and pedagogical review.

### Dependencies

- COH-5.1.
- Prefer EPIC-COH-2 and EPIC-COH-3 terminology changes first to avoid duplicate editing.

### Verification

Run consistency and numerical checks, then perform a reader-flow review at every chapter boundary.

---

## COH-5.6 — Complete the coherence release review

**Status:** Planned

### User story

As the book owner, I want a final release review across navigation, prose, calculations and visuals so that the five coherence epics produce one integrated improvement rather than isolated features.

### Planned review matrix

| Area | Review questions |
|---|---|
| Book map | Can a new reader explain the five parts from the home page? |
| Continuity | Does Chapter 9 deepen position rather than rewind? |
| Running example | Can every tensor be traced to an owning chapter? |
| Reading depth | Is the core path complete with labs closed? |
| Notation | Are symbols and object names stable? |
| Visual grammar | Does each chapter use the correct world and role/prop distinction? |
| Accessibility | Do navigation, disclosures, images and equations work without colour-only cues? |
| Mobile | Are part navigation, workbook cards, tables and labs usable at narrow widths? |
| Publishing | Do all validation steps pass before deployment? |

### Files and locations

- **Create:** `docs/coherence-release-checklist.md`
- **Modify:** `CHANGELOG.md`
  - record the coherence release and completed epics.
- **Modify:** `docs/stories.md`
  - update epic and story statuses after completion.

### Acceptance criteria

- All five epic acceptance-criteria lists are satisfied.
- No high-severity issue remains in the release checklist.
- The published Pages site is manually reviewed at representative desktop and mobile widths.
- Chapter boundaries and part boundaries are explicitly reviewed.
- The release commit or PR references the completed checklist.

### Dependencies

All previous coherence stories selected for the release.

### Verification

Run the full automated suite and complete the manual checklist on the deployed preview.

---

# Recommended implementation order

The following order minimises rework:

1. **COH-5.1** — establish the editorial and notation contract.
2. **COH-1.1** — create canonical metadata.
3. **COH-1.2 to COH-1.4** — implement visible book parts.
4. **COH-2.1 to COH-2.5** — repair position continuity.
5. **COH-3.1 and COH-3.5** — establish and verify the numerical ledger.
6. **COH-3.2 to COH-3.4** — add workbook UI and chapter checkpoints.
7. **COH-4.1 and COH-4.2** — establish progressive-depth rules and rendering.
8. **COH-4.3 to COH-4.6** — convert chapters in controlled groups.
9. **COH-5.2** — complete the wider visual-world plan after content anchors stabilise.
10. **COH-5.3 and COH-5.4** — enforce repository rules in CI, incorporating earlier validation work.
11. **COH-5.5** — complete the whole-book normalisation pass.
12. **COH-5.6** — run the integrated coherence release review.

# Suggested issue-creation convention

When stories are later created as GitHub issues:

- use the story ID at the beginning of the issue title;
- link the issue to its epic heading in this document;
- copy the story’s user story, planned changes, file list and acceptance criteria;
- add explicit dependencies as linked issues;
- keep implementation discoveries in the issue without silently expanding the epic;
- update this document’s status when the issue is completed or deliberately descoped.
