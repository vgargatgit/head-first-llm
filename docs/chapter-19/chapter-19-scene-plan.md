# Chapter 19 Graphics Scene Plan

## Chapter

**Chapter 19 — The Decoder Borrows the Encoder’s Notes**  
**Subtitle:** A complete cross-attention calculation from decoder Query to source-side retrieval

## Status

This document is the canonical production specification for all Chapter 19 graphics. Final artwork belongs under `assets/chapter-19/`.

---

# 1. Chapter visual objective

Follow one decoder position through a complete cross-attention operation without losing source/target ownership or tensor shapes.

```text
decoder hidden state -> Query
encoder outputs      -> Keys and Values
QKᵀ -> scale -> source mask -> softmax -> weighted Value sum
```

Central lesson:

> Cross-attention is directional: decoder-side Queries retrieve a learned mixture from fixed encoder-side Keys and Values.

---

# 2. Style and continuity locks

- Continue Chapter 18’s Translator desk and encoder note wall.
- Decoder objects are purple; encoder memory is blue; retrieved mixtures use both accents.
- Every numerical panel uses the chapter’s exact values and six-decimal results.
- Target rows and source columns remain visibly labelled in all matrices.
- Source padding masks are not drawn as decoder causal triangles.
- Attention weights are mixtures, not literal copying or explanations.
- The final scene turns from model origin to lifecycle language in Chapter 20.

---

# 3. Reusable design elements

## Translator

The decoder position that forms a Query after causal target-side processing.

## Encoder note wall

Fixed source rows, each holding a Key relevance card and Value payload.

## Shape ruler

Labels source length `S`, target length `T`, head width `d_k`, and Value width `d_v`.

## Cross-attention workbench

Five stations: compare, scale, mask, normalise, retrieve.

---

# 4. Scene inventory

The planned Chapter 19 set contains **11 artwork files**.

## Scene 01 — Chapter hero: Translator and note wall

**Asset:** `assets/chapter-19/01_chapter_hero_translator_note_wall.png`  
**Placement:** Chapter opening.  
**Learning objective:** Establish target-to-source consultation.

**Composition:** The Translator reads the target prefix at a causal desk, creates a Query card, and turns toward three source notes already prepared by the Encoder.

**Do not show:** the Encoder generating the target or source notes changing per target step.  
**Alt text draft:** A target-side Translator forms a Query and consults a fixed wall of encoder-prepared source Keys and Values.

## Scene 02 — Self-attention versus cross-attention provenance

**Asset:** `assets/chapter-19/02_self_vs_cross_attention_provenance.png`  
**Placement:** Across the provenance equations.  
**Learning objective:** Fix where Q, K, and V originate.

**Composition:** Two pipelines. Self-attention projects all three from decoder states. Cross-attention projects Q from decoder states and K/V from encoder outputs. Projection matrices remain separately labelled.

**Do not show:** shared projection weights unless explicitly stated.  
**Alt text draft:** Decoder self-attention obtains Queries, Keys, and Values from decoder states, while cross-attention obtains only Queries there and obtains Keys and Values from encoder outputs.

## Scene 03 — Shape bookkeeping board

**Asset:** `assets/chapter-19/03_cross_attention_shapes.png`  
**Placement:** Beside “Shape bookkeeping.”  
**Learning objective:** Explain why scores are `T × S` and outputs are `T × d_v`.

**Composition:** Rectangular cards for `H_enc: S × d_model`, `H_dec: T × d_model`, `Q: T × d_k`, `K: S × d_k`, `V: S × d_v`, `QKᵀ: T × S`, and `AV: T × d_v`.

**Do not show:** source and target lengths as interchangeable.  
**Alt text draft:** Cross-attention combines T decoder Queries with S encoder Keys to form a T-by-S score matrix and returns T Value-width outputs.

## Scene 04 — Full cross-attention assembly line

**Asset:** `assets/chapter-19/04_cross_attention_equation_pipeline.png`  
**Placement:** At the full equation.  
**Learning objective:** Preview every mathematical operation in order.

**Composition:** `QKᵀ`, divide by `√d_k`, add `M_source`, row-wise softmax, then multiply by `V`. Put the full equation beneath the strip.

**Do not show:** Value mixing before softmax.  
**Alt text draft:** Cross-attention compares Queries and Keys, scales and masks the scores, normalises across source positions, and uses the weights to mix source Values.

## Scene 05 — Exact raw dot products

**Asset:** `assets/chapter-19/05_exact_cross_attention_dot_products.png`  
**Placement:** Beside Step 1.  
**Learning objective:** Calculate one Query against three source Keys.

**Required values:** `q=[0.2,0.9]`; raw scores `[0.25,1.03,0.37]`; source labels `THE`, `CAT`, `SLEEPS`.

**Composition:** Show all coordinate multiplications; highlight `CAT` as the strongest raw compatibility without declaring it the copied answer.

**Alt text draft:** The decoder Query dotted with three encoder Keys produces raw compatibility scores 0.25, 1.03, and 0.37.

## Scene 06 — Exact scale, mask, and softmax

**Asset:** `assets/chapter-19/06_exact_scale_mask_softmax.png`  
**Placement:** Across Steps 2–4.  
**Learning objective:** Turn raw scores into source attention weights.

**Required values:** scaled scores `[0.176777,0.728320,0.261630]`; unmasked source; weights `[0.261473,0.453899,0.284628]`; sum `1.000000`.

**Composition:** A second inset replaces the third source-mask entry with `−∞` and shows zero padding weight.

**Do not show:** a causal mask across source positions.  
**Alt text draft:** Scaling by square root of two and applying row-wise softmax gives source weights about 0.261473, 0.453899, and 0.284628.

## Scene 07 — Exact weighted Value retrieval

**Asset:** `assets/chapter-19/07_exact_weighted_value_retrieval.png`  
**Placement:** Beside Step 5.  
**Learning objective:** Compute the retrieved vector and preserve the mixture interpretation.

**Required result:** `z ≈ [0.143033,0.481601]`.

**Composition:** Three Value packages are resized by their weights and combined coordinate by coordinate. The output is a new mixed package, not any original row.

**Alt text draft:** The three weighted encoder Values combine into the cross-attention output vector approximately 0.143033 and 0.481601.

## Scene 08 — Many target positions and directional flow

**Asset:** `assets/chapter-19/08_many_target_positions_directionality.png`  
**Placement:** Across the extension and directionality sections.  
**Learning objective:** Generalise the one-row example.

**Composition:** Four target Query rows attend across three source columns, producing a `4 × 3` attention map and four output rows. Large one-way arrows run decoder Queries toward encoder memory and retrieved Values back.

**Do not show:** encoder tokens querying target tokens in the same sublayer.  
**Alt text draft:** Each target position has its own distribution across source positions, producing a target-by-source attention matrix and one retrieved vector per target row.

## Scene 09 — Fixed source cache versus growing target cache

**Asset:** `assets/chapter-19/09_source_and_target_cache_lifetimes.png`  
**Placement:** At “Source Keys and Values can be cached.”  
**Learning objective:** Distinguish cache lifetimes during autoregressive decoding.

**Composition:** Encoder cross-attention K/V shelves are filled once and stay fixed; decoder self-attention K/V shelves gain one entry per generated token. A clock spans multiple target steps.

**Do not show:** re-encoding the source every step.  
**Alt text draft:** Cross-attention source Keys and Values remain fixed for one encoded input, while decoder self-attention cache entries grow with the generated target.

## Scene 10 — Multi-head cross-attention and masks

**Asset:** `assets/chapter-19/10_multihead_cross_attention_and_masks.png`  
**Placement:** Across multi-head attention and mask taxonomy.  
**Learning objective:** Show independent head projections and three mask roles.

**Composition:** Several head specialists ask different learned questions of the same encoder outputs, concatenate reports, and pass through output projection. A side panel distinguishes encoder padding, decoder causal, and cross-attention source masks.

**Do not show:** manually assigned linguistic head roles.  
**Alt text draft:** Multiple cross-attention heads project the same decoder and encoder states differently, while encoder padding, decoder causality, and cross-attention source validity use distinct masks.

## Scene 11 — Misconception clinic and lifecycle handoff

**Asset:** `assets/chapter-19/11_cross_attention_mistakes_and_handoff.png`  
**Placement:** Before the checkpoint and final handoff.  
**Learning objective:** Correct the seven chapter mistakes.

**Composition:** Cards reject decoder-derived K/V, source causal triangles, wrong score shapes, winner-take-all copying, repeated source encoding, Values as logits, and cross-attention in every decoder. The completed model blueprint receives a tag asking, `How was this checkpoint trained and adapted?`

**Alt text draft:** A clinic corrects common cross-attention errors before the completed architecture moves to a model-lifecycle map.

---

# 5. Production checklist

- [ ] Q always comes from the decoder and K/V from encoder outputs.
- [ ] Exact dot products, weights, and retrieved vector match the manuscript.
- [ ] Softmax runs across source columns for each target row.
- [ ] Source and target cache lifetimes are distinct.
- [ ] Attention is described as weighted retrieval, not explanation or copying.
- [ ] All tensor shapes remain readable.

