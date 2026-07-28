# Expert copy, rendering, and technical review — Chapters 1–24

**Review branch:** `audit/all-chapters-review`  
**Main branch modified:** No  
**Scope:** all 24 Markdown manuscripts, the current website reader, the Marked/MathJax rendering path, all manuscript image references, equation and matrix structure, running tensor dimensions, worked numerical examples, terminology, and chapter-to-chapter continuity.

## Executive assessment

The manuscript is technically strong overall. Its explanations of attention, residual streams, training, post-training, architecture families, retrieval, multimodality, efficient inference, and evaluation are generally accurate and unusually careful about caveats.

The current publication, however, has **book-wide rendering defects** serious enough to obscure otherwise correct content:

1. the reader removes every chapter title and subtitle from the rendered article;
2. Markdown placed inside the custom callout `<div>` blocks is not safely rendered;
3. inline mathematics written with `\(...\)` is damaged before MathJax sees it;
4. nearly every section is emitted as an H1, so document hierarchy and the table of contents are malformed;
5. five hidden ASCII control characters corrupt mathematical symbols in Chapters 7, 8, and 13.

These renderer defects should be corrected before doing broad prose polishing, because they affect every chapter and make correct source text appear incorrect on the page.

## Severity summary

| Severity | Finding | Scope |
|---|---|---|
| **Blocker** | YAML front matter is stripped without rendering `title` or `subtitle` | All 24 chapters |
| **Blocker** | Raw HTML callout blocks contain Markdown that the parser does not reliably process | 103 callout blocks |
| **Blocker** | `\(...\)` inline-math delimiters are not protected and are lost during Markdown rendering | 355 occurrences across Chapters 3–17 |
| **High** | Section headings are mostly H1s; chapters render with 16–38 competing H1 elements | All 24 chapters |
| **High** | Hidden control characters corrupt intended `\beta` and `\varepsilon` commands | Chapters 7, 8, and 13 |
| **Medium** | A few diagrams or equations use technically imprecise notation or break the running dimensional convention without enough warning | Chapters 4, 5, 6, 10, 18, 22, and 23 |
| **Low** | Inconsistent subscripts, row/column-vector conventions, and heading wording | Several chapters |

## Rendering review

### 1. Chapter titles and subtitles disappear

The reader removes YAML front matter in `prepareMarkdown`, but it never converts the front-matter `title` and `subtitle` into visible HTML. Most manuscripts then begin with:

```markdown
# The question this chapter answers
```

Consequently, the page opens with a section heading instead of the actual chapter title. The browser tab has the correct title because `app.js` sets `document.title`, but the chapter article itself does not.

**Correction:** parse the front matter and prepend one visible chapter-title H1 plus an optional subtitle paragraph before rendering the chapter body.

### 2. Markdown inside raw callout HTML is unsafe

The manuscripts use blocks such as:

```html
<div class="exercise">

## 1. What is the shape?

$$
Q\in\mathbb{R}^{T\times d_k}
$$

</div>
```

Under the current Marked pipeline, raw HTML blocks suppress ordinary Markdown parsing inside them. Headings, lists, bold text, and equations can therefore remain literal or acquire malformed structure. The static audit found **103 callouts, and every one contains Markdown syntax**.

**Correction options:**

- replace raw HTML callouts with a Markdown extension or fenced directive that the renderer understands; or
- temporarily extract each callout, render its inner Markdown separately, and then restore a safe wrapper such as `<aside class="exercise">…</aside>`.

The second option preserves the existing manuscripts with the least editing.

### 3. Inline mathematics is being damaged

The reader protects `$...$` and `$$...$$` before sending text to Marked, but does not protect `\(...\)` or `\[...\]`. Marked consumes the escaping backslashes, so MathJax no longer receives valid delimiters.

The rendered audit found **355 lost `\(...\)` pairs** across Chapters 3–17:

| Chapter | Lost inline-math delimiters |
|---:|---:|
| 3 | 28 |
| 4 | 44 |
| 5 | 49 |
| 6 | 7 |
| 7 | 33 |
| 8 | 20 |
| 9 | 12 |
| 10 | 27 |
| 11 | 30 |
| 12 | 18 |
| 13 | 14 |
| 14 | 27 |
| 15 | 24 |
| 16 | 10 |
| 17 | 12 |

**Correction:** protect and restore all four supported delimiter forms before and after Markdown parsing:

- `$...$`
- `$$...$$`
- `\(...\)`
- `\[...\]`

A simpler manuscript-wide alternative is to standardise on dollar delimiters, but the renderer should still be robust to all MathJax forms.

### 4. Heading hierarchy and table of contents are inverted

Most section headings use `#`, producing many H1 elements per chapter. The rendered audit found between **16 and 38 H1s per chapter**. Meanwhile, the TOC builder labels H2 links as `level-1` and H1 links as `level-2`, which reverses the expected hierarchy.

**Recommended hierarchy:**

```text
H1  Chapter title
H2  Main section
H3  Subsection
H4  Rare nested subsection
```

The TOC should include H2 as the main level and H3 as the nested level. Headings inside exercises and other callouts should normally be excluded or demoted so ten checkpoint questions do not overwhelm the chapter TOC.

### 5. Hidden source characters corrupt equations

The control-character scan found five non-printing ASCII characters:

- Chapter 7: three U+0008 backspace characters where `\beta` was intended;
- Chapter 8: one U+0008 backspace character where `\beta` was intended;
- Chapter 13: one U+000B vertical-tab character inside the intended `\varepsilon` text.

These are source corruption, not MathJax mistakes. They should be replaced with ordinary text sequences and prevented by CI.

### 6. Image paths are healthy after reader resolution

The source-only checker initially reported six missing Chapter 2 images because it did not know about the website reader's legacy aliases. A second audit applied the same prefix rewrites and aliases as `site/app.js`.

**Result:** all **46** manuscript image references resolve to files that exist in the repository. There is no current missing-image blocker in Chapters 1–7.

## Tensor and dimensional consistency

### Running model width

The main THE/CAT/SAT worked example consistently uses:

```text
sequence length n = 3
d_model = 4
per-head d_k = d_v = 2
two heads concatenate back to width 4
```

The central path remains dimensionally coherent:

```text
X                 3 × 4
Q, K, V per head  3 × 2
QKᵀ               3 × 3
attention output  3 × 2
2-head concat     3 × 4
output projection 3 × 4
residual stream   3 × 4
MLP output        3 × 4
```

The matrix audit found **zero matrices with inconsistent row widths**. I also did not find a place in Chapters 1–17 where a stated four-coordinate running hidden state is accidentally multiplied as a three-coordinate vector.

### Smaller vectors in later chapters

Chapters 19, 21, and 22 introduce independent toy examples:

- Chapter 19 uses two-dimensional Query, Key, and Value vectors for cross-attention;
- Chapter 21 uses two-dimensional retrieval embeddings;
- Chapter 22 maps a three-dimensional visual feature to a two-dimensional bridge vector.

These calculations are mathematically valid, but Chapter 22 is the likeliest source of the concern that a width-4 model suddenly became width 3 or 2. It says “toy example,” but the reset is not visually emphatic enough.

**Correction:** add a standard notice before every standalone dimensional example:

> **New toy dimensions:** This calculation is independent of the running THE/CAT/SAT model. The smaller dimensions are chosen only to keep the arithmetic visible.

For even stronger continuity, change Chapter 22's projector example to map `3 → 4`, so the bridge visibly lands in the book's established model width.

## Numerical verification

I independently recalculated the main worked examples. The stated rounded results match the arithmetic in these chapters:

| Chapter | Recalculated item | Result |
|---:|---|---|
| 4 | `QKᵀ`, scaling by `√2`, causal masking, row-wise softmax | Matches |
| 5 | Value projection and `Z = AV` | Matches |
| 7 | Output projection, residual sum, SAT mean/variance, LayerNorm | Matches |
| 10 | Final four-coordinate normalisation | Matches |
| 11 | Vocabulary logits and five-token softmax | Matches |
| 13 | Eight token losses, mean loss, perplexity, bits/token, `p-y` | Matches |
| 14 | Vocabulary-weight outer product and hidden-state gradient | Matches |
| 19 | Cross-attention dot products, scaled scores, softmax, Value mixture | Matches |
| 21 | Retrieval cosine/dot-product example and calculator example | Matches |
| 22 | Three-to-two projector calculation | Matches mathematically; continuity issue noted above |
| 24 | Brier-score calculation | Matches |

## Chapter-by-chapter review

### Chapter 1 — A Token Enters the Dating World

- Running `3 × 4` hidden-state matrix is consistent.
- The conceptual distinction between token identity, hidden state, and contextualisation is sound.
- Main issues are renderer-wide: missing visible title, excessive H1s, and callout parsing.

### Chapter 2 — Meet the Question Coach

- `X(3 × 4)W^Q(4 × 2)=Q(3 × 2)` is consistent.
- Chapter 2 image aliases resolve successfully.
- Standardise subscripts such as `x_{sat}` versus `x_{\text{sat}}`, and likewise for `q`.
- State once whether vectors are represented as row vectors throughout the worked example.

### Chapter 3 — Meet the Profile Writer

- Key projection dimensions and arithmetic are consistent.
- Query-versus-Key role distinction is technically clear.
- Twenty-eight inline `\(...\)` expressions are currently vulnerable to the renderer.

### Chapter 4 — When Queries Meet Keys

- Dot products, score matrix, scaling, masking, and softmax recalculate correctly.
- Write softmax shift invariance as `softmax(z)=softmax(z+c\mathbf{1})`; `z+c` is understandable but dimensionally informal.
- Renderer currently loses 44 inline-math delimiters.

### Chapter 5 — Meet the Information Courier

- Value projection and weighted retrieval are dimensionally and numerically correct.
- Replace chained notation such as `W^Q \neq W^K \neq W^V` with prose saying the matrices are independently learned and generally distinct, or write explicit pairwise inequalities. Chained `≠` does not formally assert that every pair is different.
- Renderer currently loses 49 inline-math delimiters.

### Chapter 6 — Many Specialists at Work

- Two-head calculations and concatenated `3 × 4` result are coherent.
- Replace shape notation resembling `(3 × 2) + (3 × 2) → 3 × 4` with `Concat[(3 × 2),(3 × 2)] → 3 × 4`; the plus sign can be mistaken for matrix addition.
- The distinction between separate conceptual head matrices and packed implementations is strong.

### Chapter 7 — The Team Lead Combines the Reports

- Output projection, residual addition, and LayerNorm arithmetic match.
- Three hidden backspace characters corrupt intended `\beta` symbols.
- Rename “Why normalise after residual?” to “In this post-norm example, why normalise after the residual?” because the chapter later correctly introduces pre-norm.
- Renderer currently loses 33 inline-math delimiters.

### Chapter 8 — The Private Thinking Room

- MLP expansion, non-linearity, contraction, and second residual path are coherent.
- One hidden backspace character corrupts an intended `\beta`.
- The chapter correctly distinguishes attention's cross-token communication from the MLP's per-token processing.

### Chapter 9 — Every Token Needs an Address

- Absolute-position and RoPE explanations are technically sound at the level presented.
- The two-dimensional RoPE example is explicitly a coordinate-pair operation and does not contradict the four-wide running hidden state.
- Renderer currently loses 12 inline-math delimiters.

### Chapter 10 — The Residual Stream Climbs the Stack

- Final four-coordinate hidden state and KV-cache shape reasoning are coherent.
- Replace `W_1^Q \neq W_2^Q \neq \cdots \neq W_L^Q` with “the layer matrices are independently learned and not tied.” The chained inequality is logically weaker than the intended statement.
- Renderer currently loses 27 inline-math delimiters.

### Chapter 11 — The Final Audition

- `1 × 4` hidden state times `4 × 5` vocabulary matrix gives `1 × 5` logits correctly.
- Logits, softmax, temperature, top-k, and top-p calculations match.
- The distinction between token and word is handled well.
- Renderer currently loses 30 inline-math delimiters.

### Chapter 12 — The Answer Key Moves One Step Ahead

- Shifted inputs/labels, teacher forcing, attention masks, and loss masks are correct.
- The batch and vocabulary-logit tensor shapes are consistent.
- Renderer currently loses 18 inline-math delimiters.

### Chapter 13 — Meet the Scorekeeper

- Negative log-likelihood, masked mean, perplexity, and `p-y` gradient match.
- One hidden vertical-tab character corrupts the phrase introducing `\varepsilon` in label smoothing.
- Clarify that label-smoothing conventions differ: some distribute smoothing mass over all classes and others only over incorrect classes.
- Renderer currently loses 14 inline-math delimiters.

### Chapter 14 — The Blame Travels Backward

- The vocabulary-weight gradient, bias gradient, hidden-state gradient, residual branch addition, and attention backward equations are coherent.
- The distinction between backpropagation and optimiser updates is especially clear.
- Renderer currently loses 27 inline-math delimiters.

### Chapter 15 — The Training Factory Never Sees the Whole Library

- Global batch and token-count arithmetic is correct.
- The valid-token weighted mean correctly warns against averaging unequal microbatch means.
- Validation, contamination, schedules, and resumable checkpoint state are explained accurately.
- Renderer currently loses 24 inline-math delimiters.

### Chapter 16 — The Model Outgrows One Machine

- Gradient averaging, illustrative memory calculation, sharding, tensor parallelism, pipeline parallelism, and scaling efficiency are sound.
- The text correctly labels the 16-bytes-per-parameter figure as illustrative rather than universal.
- Keep decimal GB versus binary GiB explicit wherever memory figures appear.
- Renderer currently loses 10 inline-math delimiters.

### Chapter 17 — From Completion Machine to Helpful Assistant

- Chat templates, response-only loss, preference learning, DPO, and LoRA are correctly separated.
- The DPO and LoRA parameter-count calculations match.
- The chapter properly states that LoRA changes parameterisation, not the training objective.
- Renderer currently loses 12 inline-math delimiters.

### Chapter 18 — Three Transformer Families Move In

- Encoder-only, decoder-only, and encoder–decoder distinctions are broadly accurate.
- Change the diagram label `source memory: K and V`. The encoder produces hidden states; each decoder cross-attention layer normally projects that memory into its own Keys and Values. Suggested label: `encoder hidden-state memory → layer-specific K and V projections`.
- Make the shifted target example position-aligned; the current abbreviated French example can look as though inputs and labels have different implied lengths.
- The guidance not to guess proprietary architectures is appropriate.

### Chapter 19 — The Decoder Borrows the Encoder's Notes

- The source of Q, K, and V is stated correctly and repeatedly.
- Score and output shapes are correct, and the full numerical example matches.
- The two-dimensional vectors are clearly part of a new standalone example, not the earlier four-wide residual stream.
- Distinction between fixed source-side cross-attention cache and growing decoder self-attention cache is strong.

### Chapter 20 — From Pretraining to Specialisation

- Pretraining, base checkpoints, foundation models, continued pretraining, SFT, instruction tuning, preference tuning, PEFT, prompting, RAG, and tools are clearly distinguished.
- In the “What changes the weights?” table, consider writing “persists imperfectly in weights” for full fine-tuning as well as pretraining; weight updates do not guarantee precise or reliable factual storage.
- The architecture-versus-lifecycle taxonomy is excellent.

### Chapter 21 — Open Book, Closed Book, or Tool Belt?

- Retrieval vectors and ranking arithmetic match.
- Dense, lexical, hybrid retrieval, reranking, provenance, citation validation, permissions, and prompt injection are handled well.
- The calculator example is correct.
- No substantive shape problem found.

### Chapter 22 — Pictures, Audio, and Other Modalities

- Patch-count calculation and projector multiplication are correct.
- The projector example changes from a 3-coordinate visual vector to a 2-coordinate receiving vector. This is valid linear algebra but breaks visual continuity with the book's established width-4 model. Either map `3 → 4` or add a prominent “new toy dimensions” note.
- The statement that shape compatibility is not semantic alignment is important and correct.

### Chapter 23 — Smaller, Faster, Cheaper

- Raw weight-memory calculations are correct and appropriately labelled as excluding overhead.
- Quantisation, distillation, MoE, prefill/decode, KV-cache memory, GQA/MQA, batching, paging, and speculative decoding are described carefully.
- The router formula `softmax(W_r x)` switches to a column-vector convention while the running book mostly uses row vectors. Either write `softmax(xW_r)` or explicitly announce the convention change.
- Keep “exact speculative decoding preserves the target distribution” qualified, as the chapter already does.

### Chapter 24 — Trust, but Verify

- Brier-score calculation is correct.
- The system-level evaluation framing, claim-level groundedness, abstention, contamination, judges, safety, RAG, tools, release gates, regression testing, and monitoring are strong.
- Label the numeric release-gate thresholds clearly as illustrative product-specific examples so readers do not treat them as standards.

## Recommended correction order

1. **Repair the renderer:** front matter, callout inner Markdown, all math delimiters, H1/H2/H3 hierarchy, and TOC construction.
2. **Remove hidden control characters** from Chapters 7, 8, and 13.
3. **Add CI gates** for control characters, unresolved math delimiters, literal Markdown residue, heading hierarchy, and reader-resolved asset paths.
4. **Apply the seven local technical/copy corrections:** Chapters 4, 5, 6, 7, 10, 18, 22, and the row/column convention in 23.
5. **Run a final visual regression pass** at desktop and mobile widths, checking equations, callouts, tables, images, TOC, previous/next navigation, and long chapter titles.

## Proposed acceptance checks

A corrected build should satisfy all of the following:

- exactly one visible H1 chapter title per chapter;
- title and subtitle agree with front matter and navigation;
- no literal `##`, `**`, list markers, or equation delimiters remain inside rendered callouts;
- no source `\(...\)`, `\[...\]`, `$...$`, or `$$...$$` math is lost;
- no unexpected ASCII control characters exist in chapter sources;
- every reader-resolved local image path exists;
- all matrices have consistent row widths;
- the TOC begins with H2 sections and nests only meaningful H3 subsections;
- the THE/CAT/SAT running example retains `d_model=4` unless a new toy dimension is explicitly announced;
- all worked numerical values remain within the stated rounding tolerance.

## Final verdict

The manuscript does **not** need a conceptual rebuild. The mathematical spine is coherent, the major worked examples recalculate correctly, and the later systems chapters are technically mature. The urgent work is to make the renderer faithfully display what the manuscripts already say, then clean up a small set of source corruptions and notation ambiguities.
