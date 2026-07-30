# Chapter 18 Graphics Scene Plan

## Chapter

**Chapter 18 — Three Transformer Families Move In**  
**Subtitle:** Encoder-only, decoder-only, and encoder–decoder models compared by information flow, objective, and real-world use

## Status

This document is the canonical production specification for all Chapter 18 graphics. Final artwork belongs under `assets/chapter-18/`.

---

# 1. Chapter visual objective

Compare three Transformer families by information flow rather than size, branding, or interface.

```text
encoder-only       -> full-input representations
decoder-only       -> causal next-token generation
encoder–decoder    -> encoded source memory + causal target generation
```

Central lesson:

> The families reuse familiar components, but different attention permissions and hidden-state roles make different objectives and tasks natural.

---

# 2. Style and continuity locks

- Present three neighbouring houses built from the same warm-paper Transformer architecture.
- Reuse token characters, attention grids, causal curtains, Transformer floors, and source-note imagery from Chapters 1–17.
- Give each family a stable accent: blue encoder, purple decoder, split blue–purple encoder–decoder.
- Use filled/blocked attention cells consistently; padding is distinct from causal blocking.
- Architecture, lifecycle stage, behaviour, modality, and deployment format must remain separate labels.
- Public examples must be labelled only as documented; undisclosed systems get `ARCHITECTURE NOT PUBLICLY CONFIRMED`.
- The final scene opens the encoder–decoder house and hands off to Chapter 19’s cross-attention calculation.

---

# 3. Reusable design elements

## Three Transformer houses

The Full-View Library, Left-to-Right Writing Room, and Source-and-Translator Duplex.

## Attention-permission windows

A full square grid for encoder attention, lower triangle for decoder attention, and three linked grids for encoder–decoder flow.

## Architecture passport

Separate fields for architecture, checkpoint stage, adaptation, behaviour, modality, and numerical format.

## Task-selection signpost

A three-way sign based on input/output structure, not model popularity.

---

# 4. Scene inventory

The planned Chapter 18 set contains **11 artwork files**.

## Scene 01 — Chapter hero: the three houses

**Asset:** `assets/chapter-18/01_chapter_hero_three_transformer_houses.png`  
**Placement:** Chapter opening.  
**Learning objective:** Introduce the three families as different information-flow designs.

**Composition:** Three adjacent cutaway houses show all input tokens reading together; one writer behind a causal curtain; and an encoder preparing notes for a target-side Translator. Use the same Transformer bricks in all three.

**Do not show:** family as a parameter-count ranking.  
**Alt text draft:** Three Transformer houses use shared building blocks but route information through full-input encoding, causal generation, or source encoding followed by conditional decoding.

## Scene 02 — Three attention-permission maps

**Asset:** `assets/chapter-18/02_family_attention_permission_maps.png`  
**Placement:** Across “Meet the three houses.”  
**Learning objective:** Make the masks and information sources directly comparable.

**Composition:** Align three four-position diagrams: all-ones encoder matrix, lower-triangular decoder matrix, and an encoder–decoder triptych containing full source self-attention, causal target self-attention, and target-to-source cross-attention.

**Required matrices:** Use the exact `4 × 4` encoder and decoder matrices from the chapter.  
**Do not show:** cross-attention as another causal triangle.  
**Alt text draft:** Encoder positions see the full input, decoder positions see only their permitted prefix, and encoder–decoder targets may inspect the complete encoded source.

## Scene 03 — Bidirectional sense disambiguation

**Asset:** `assets/chapter-18/03_encoder_bank_context.png`  
**Placement:** Beside “Why bidirectional context is useful.”  
**Learning objective:** Show later context changing an encoder token representation.

**Composition:** Two `bank` token characters receive arrows from both sides in “approved the loan” and “rested beside the bank,” then leave with distinct contextual-state cards.

**Do not show:** the token identity changing or an encoder generating left to right.  
**Alt text draft:** Full left and right context gives the word bank different contextual representations in financial and river-edge sentences.

## Scene 04 — Masked-language-model reconstruction

**Asset:** `assets/chapter-18/04_encoder_masked_language_objective.png`  
**Placement:** Across the encoder pretraining section.  
**Learning objective:** Distinguish masked reconstruction from autoregressive prediction.

**Composition:** `The cat [MASK] on the mat` passes through full-view attention; only selected positions produce loss receipts, while all visible non-padding tokens supply context. Include the simplified MLM loss.

**Do not show:** every position necessarily masked or a causal curtain.  
**Alt text draft:** A bidirectional encoder reconstructs selected hidden tokens while loss is applied only at selected target positions.

## Scene 05 — Decoder causal generation loop

**Asset:** `assets/chapter-18/05_decoder_causal_generation.png`  
**Placement:** Across the decoder-only section.  
**Learning objective:** Connect causal training to iterative inference.

**Composition:** A lower-triangular permission grid feeds a loop: prompt, predict, append, repeat. A target token is visibly blocked from the token it must predict.

**Required formula:** `L_causal = -(1/T) Σ_t log pθ(x_t | x_<t)`.  
**Do not show:** earlier hidden states reading future positions.  
**Alt text draft:** Causal self-attention blocks future tokens and supports a loop that predicts and appends one token at a time.

## Scene 06 — Encoder–decoder source-memory duplex

**Asset:** `assets/chapter-18/06_encoder_decoder_source_memory.png`  
**Placement:** At “Family 3.”  
**Learning objective:** Show the separate source and target streams.

**Composition:** The encoder reads the complete source and pins Key and Value notes to a wall. The decoder first reads its target prefix causally, then sends Queries to the source wall.

**Do not show:** source and target as one undifferentiated causal sequence.  
**Alt text draft:** An encoder builds source memory, while a causal decoder generates the target and consults that memory through cross-attention.

## Scene 07 — Teacher-forced conditional training

**Asset:** `assets/chapter-18/07_seq2seq_teacher_forcing.png`  
**Placement:** Beside encoder–decoder training.  
**Learning objective:** Explain shifted target inputs conditioned on a complete source.

**Composition:** Align `source: The cat sat`, target input beginning with `<BOS>`, and next-token labels. Arrows connect every decoder step to source memory and only prior target tokens.

**Required formula:** `L_seq2seq = -Σ_t log pθ(y_t | y_<t, x)`.  
**Do not show:** the gold future target available through attention.  
**Alt text draft:** During teacher-forced sequence-to-sequence training, each target token is predicted from the encoded source and the shifted target prefix.

## Scene 08 — The two meanings of decoder

**Asset:** `assets/chapter-18/08_two_decoder_block_layouts.png`  
**Placement:** At “The same word decoder can mislead.”  
**Learning objective:** Contrast decoder-only and encoder–decoder decoder blocks.

**Composition:** Side-by-side cutaways. Both contain causal self-attention and MLP machinery; only the encoder–decoder block has a cross-attention balcony connected to source memory.

**Do not show:** cross-attention inside every decoder-only block.  
**Alt text draft:** A decoder-only block uses causal self-attention, while an encoder–decoder decoder also contains cross-attention to separate encoder outputs.

## Scene 09 — Family comparison and task signpost

**Asset:** `assets/chapter-18/09_family_task_selection_field_guide.png`  
**Placement:** Across the comparison table and field guide.  
**Learning objective:** Choose a family from task structure.

**Composition:** Three roads: complete-input representations and labels; open-ended left-to-right output; clear source-to-target conditional generation. Each road lists strengths and one limitation.

**Do not show:** hard capability boundaries or universal superiority.  
**Alt text draft:** A task signpost routes full-input representation work, open-ended generation, and explicit source-to-target generation toward their most natural Transformer families.

## Scene 10 — Architecture passport: independent axes

**Asset:** `assets/chapter-18/10_architecture_independent_axes.png`  
**Placement:** Across “Architecture is not destiny” and “Foundation model.”  
**Learning objective:** Separate architecture from lifecycle and product labels.

**Composition:** One checkpoint passport has independent stamp rows: `decoder-only`, `base/instruction-tuned`, `chat`, `foundation`, `multimodal`, and `quantised`. A second file is stamped `ARCHITECTURE NOT PUBLICLY CONFIRMED`.

**Do not show:** chat or foundation as architecture families.  
**Alt text draft:** A model can carry independent labels for architecture, training stage, interaction behaviour, modality, and numerical format.

## Scene 11 — Misconception clinic and cross-attention handoff

**Asset:** `assets/chapter-18/11_family_mistakes_and_handoff.png`  
**Placement:** Before the checkpoint and “Coming next.”  
**Learning objective:** Consolidate family distinctions and open Chapter 19.

**Composition:** The Reader Guide corrects six cards: not every Transformer is a decoder; encoders do not generate by seeing the future; MLM is not causal generation; chat does not imply encoder–decoder; cross-attention is not in every decoder; undocumented internals must not be guessed. The Translator points to one decoder Query and three encoder notes.

**Do not show:** speculative model classifications.  
**Alt text draft:** A misconception clinic separates architecture families, then the Translator prepares to calculate cross-attention over encoder notes.

---

# 5. Production checklist

- [ ] All three family masks are mathematically correct.
- [ ] Cross-attention direction is target Query to source Keys and Values.
- [ ] MLM loss and causal loss are visually distinct.
- [ ] Model examples are labelled as publicly documented examples, not exhaustive lists.
- [ ] Architecture and lifecycle labels never share one axis.
- [ ] Every scene includes readable alt text and remains legible on a narrow screen.

