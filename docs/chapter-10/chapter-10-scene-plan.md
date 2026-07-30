# Chapter 10 Graphics Scene Plan

## Chapter

**Chapter 10 — The Residual Stream Climbs the Stack**  
**Subtitle:** How many Transformer blocks repeatedly refine every token representation

## Status

This document is the canonical production specification for all Chapter 10 graphics.
It expands the relevant master-plan entry into a scene-by-scene brief. Final artwork belongs under `assets/chapter-10/`.

The Chapter 1–3 illustrations remain the visual reference standard. The
implemented package contains ten core panels and four supplemental panels.

---

# 1. Chapter visual objective

Show one evolving residual stream moving through many separately learned Transformer blocks, then explain why autoregressive generation stores per-layer Keys and Values.

The chapter’s visual pipeline is:

```text
X^(0)
    -> Block 1 -> X^(1)
    -> Block 2 -> X^(2)
    -> ...
    -> Block L -> X^(L)
    -> final normalisation
during generation:
each layer stores prior K and V
    -> new token reuses cache
```

The central visual lesson is:

> A deep Transformer repeatedly amends the same token-by-model-width pathway; every layer has its own parameters, and generation caches each layer’s prior Keys and Values.

---

# 2. Continuity and style locks

- Warm cream-paper or off-white background.
- Hand-drawn outlines, annotations, and purple chapter accents.
- Reuse approved recurring characters, rooms, and proportions from earlier chapters.
- Keep generated artwork separate from exact mathematical typography; add verified labels as editable overlays.
- Use speech bubbles only for teaching intuition, never as literal tensor contents.
- Provide a clean “remove the costumes” mapping from story object to mathematical operation.

- Use the complete block blueprint from Chapter 8 as the standard tower floor.
- Use the evolving case-file metaphor introduced in Chapters 1 and 7.
- The final rooftop output enters the Final Audition in Chapter 11.

---

# 3. Reusable chapter design elements

## Transformer tower

A vertical stack with one Transformer block per floor. Every floor shares an architectural layout but has separate parameter badges.

## Evolving case file

The token’s residual-stream row, with the same number of slots but changing numerical contents at each floor.

## Per-layer KV archive

Separate K and V shelves on every floor, organised by previous token position.

## New-token elevator

During cached generation, only the newest token travels through every floor while older K/V folders stay stored.

---

# 4. Scene inventory

The Chapter 10 set contains **14 artwork files**: ten core panels and four
supplemental clarification panels.

---

## Scene 01 — Chapter hero: the Transformer tower

### Asset

```text
assets/chapter-10/01_the_transformer_tower_explained.png
```

### Intended placement

Chapter opening.

### Learning objective

Introduce depth as repeated refinement rather than one giant attention operation.

### Composition

- THE, CAT, and SAT enter the tower at the ground floor.
- Every floor contains attention and private-thinking areas.
- Each token carries a model-width case file upward.
- The final-normalisation rooftop and Final Audition theatre are visible.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Tower floor | one Transformer block |
| Case file | one row of residual stream X^(l) |

### Do not show

- Do not draw tokens changing order between floors.
- Do not imply floors share one parameter set.

### Alt text draft

> THE, CAT, and SAT carry evolving case files through a tower of Transformer blocks, each with attention and MLP rooms.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 02 — One floor is one refinement step

### Asset

```text
assets/chapter-10/02_one_floor_at_a_time_transformer_layer.png
```

### Intended placement

Near the stack equations.

### Learning objective

Show how a floor reads and amends the incoming residual stream while preserving outer shape.

### Composition

- A 3 x 4 case-file grid enters one floor.
- Attention writes one amendment; MLP writes another.
- A 3 x 4 grid exits.
- A small formula labels Block_l.

### Required labels or numerical reference

```text
X^(l)=Block_l(X^(l-1)); X^(l) in R^(n x d_model)
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Incoming file | X^(l-1) |
| Floor work | Block_l |
| Outgoing file | X^(l) |

### Do not show

- Do not concatenate new rows at every floor.
- Do not imply hidden width equals number of semantic facts.

### Alt text draft

> One Transformer floor reads a three-by-four residual stream, adds attention and MLP updates, and returns the same outer shape.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 03 — SAT’s evolving case file through three floors

### Asset

```text
assets/chapter-10/03_sat_state_evolution_cartoon_diagram.png
```

### Intended placement

Across the toy continuation through Blocks 2 and 3.

### Learning objective

Show numerical change through depth while token identity and width stay stable.

### Composition

- Four snapshots of SAT at stack input and after Blocks 1, 2, and 3.
- Use the same four-slot file frame at every stage.
- Small amendment sheets show the illustrative attention and MLP updates on Floors 2 and 3.

### Required labels or numerical reference

```text
x_sat^(0)=[0.140000,-0.220000,0.670000,-0.310000]
x_sat^(1)=[0.006373,-0.143686,1.477529,-1.340215]
x_sat^(2)=[0.046373,-0.063686,1.527529,-1.270215]
x_sat^(3)=[0.076373,-0.023686,1.517529,-1.230215]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| File snapshot | SAT row at layer l |
| Amendment | residual sublayer update |

### Do not show

- Do not describe individual coordinates as fixed human-readable counters.
- Do not imply the later updates reuse Chapter 6–8 weights.

### Alt text draft

> SAT’s four-coordinate case file changes through three Transformer blocks while preserving its width and token identity.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 04 — Same floor plan, different parameters

### Asset

```text
assets/chapter-10/04_layers_and_parameters_explained_visually.png
```

### Intended placement

Near “Every layer owns different parameters.”

### Learning objective

Prevent the misconception that one learned block is simply looped many times.

### Composition

- Floor 1 and Floor 2 have the same room layout.
- Their Q/K/V/O, MLP, and norm boards carry different layer numbers and numerical patterns.
- A wrong panel shows one shared key ring copied to every floor and is crossed out.

### Required labels or numerical reference

```text
W_1^Q != W_2^Q != ... != W_L^Q
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Same architecture | repeated block design |
| Different staff ledgers | separately learned parameters |

### Do not show

- Do not imply parameter sharing in the ordinary stack.
- Do not make floor shapes different unless discussing an architecture variant.

### Alt text draft

> Transformer floors use the same architectural plan but carry different learned parameter boards.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 05 — Later layers use contextual states

### Asset

```text
assets/chapter-10/05_context_grows_with_visible_tokens.png
```

### Intended placement

Near “Later layers do not see raw token embeddings.”

### Learning objective

Show that Q/K/V at a later floor are derived from already contextualised representations.

### Composition

- Floor 1 builds a Query from a simpler incoming SAT file.
- Floor 3 builds a Query from a file stamped with earlier attention and MLP amendments.
- The original embedding remains at the building entrance rather than being reread on every floor.

### Required labels or numerical reference

```text
Q^(l)=X^(l-1)W_l^Q; K^(l)=X^(l-1)W_l^K; V^(l)=X^(l-1)W_l^V
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Stamped case file | contextual hidden state |
| Later Question Coach | layer-specific Q projection |

### Do not show

- Do not feed raw embeddings directly into every layer.
- Do not suggest later features are necessarily more interpretable.

### Alt text draft

> A later Transformer floor creates its Query, Key, and Value from a case file already enriched by earlier floors.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 06 — Per-layer KV archive

### Asset

```text
assets/chapter-10/06_key_value_memory_in_neural_layers.png
```

### Intended placement

At the KV-cache introduction.

### Learning objective

Show exactly what is cached and where.

### Composition

- Every tower floor has a K shelf and a V shelf.
- Folders are arranged by prior token position.
- Query cards are temporary and not stored as the primary cache.
- Attention matrices are absent from the cache shelves.

### Required labels or numerical reference

```text
per-layer cache contains prior K and V tensors by token position
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| K shelf | cached Keys for one layer |
| V shelf | cached Values for one layer |
| Folder position | sequence position |

### Do not show

- Do not create one global cache shared by all layers.
- Do not store hidden states or attention matrices as the named KV cache.

### Alt text draft

> Each Transformer layer keeps its own shelves of cached Key and Value folders for earlier token positions.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scene 07 — Only the newest token makes a new trip

### Asset

```text
assets/chapter-10/07_decoding_with_cached_keys_and_values.png
```

### Intended placement

Near cached autoregressive decoding.

### Learning objective

Show how KV caching avoids recomputing earlier token projections at each generation step.

### Composition

- Earlier tokens remain represented by stored K/V folders on every floor.
- Only the newest token rides the elevator.
- At each floor it creates a new Query, Key, and Value.
- Its Query consults old and new Keys; the new Key and Value are appended to shelves.

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| New-token elevator | incremental forward pass |
| Existing shelves | reused prior K/V |
| Appended folder | cache growth by one position |

### Do not show

- Do not imply earlier tokens are entirely absent from attention; their cached K/V remain active.
- Do not reuse one layer’s cache on another layer.

### Alt text draft

> During cached generation, only the newest token travels through the tower while each layer reuses stored Keys and Values from earlier positions.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

## Scenes 08–10 — Cache growth, final norm, and handoff

### Asset

```text
assets/chapter-10/08_token_generation_growth_in_transformers.png
assets/chapter-10/08b_sat_final_layernorm_example.png
assets/chapter-10/09_final_output_path_diagram_with_mascot.png
assets/chapter-10/10_chapter_11_from_final_state_to_next_token.png
```

### Intended placement

Chapter ending.

### Learning objective

Show the memory-growth dimensions, produce the final hidden state, and send it to Chapter 11.

### Composition

- KV shelves lengthen as sequence length grows.
- Labels identify layers, KV heads, head width, batch size, and precision.
- A variant inset shows fewer shared K/V shelves for GQA or MQA.
- SAT reaches the rooftop final-normalisation booth and exits toward the Final Audition.

### Required labels or numerical reference

```text
h_sat_final ≈ [-0.008859,-0.111600,1.470933,-1.350474]
```

### Remove the costumes

| Story or visual object | Mathematical meaning |
|---|---|
| Shelf length | cached sequence length |
| Number of floors | number of layers |
| Rooftop booth | final norm |
| Theatre entrance | vocabulary projection |

### Do not show

- Do not claim grouped-query attention changes the number of Query heads to match KV heads.
- Do not present cache memory as constant with sequence length.

### Alt text draft

> Per-layer Key and Value shelves grow with sequence length, and SAT’s final normalised hidden state leaves the tower for the vocabulary audition.

### Acceptance checks

- [ ] The primary learning objective is immediately visible.
- [ ] All displayed labels and values are accurate.
- [ ] The scene remains legible at mobile reading width.
- [ ] The scene preserves continuity with earlier artwork.

---

# 5. Chapter placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_the_transformer_tower_explained.png` | Hero |
| 2 | `02_one_floor_at_a_time_transformer_layer.png` | Shape-preserving block mechanism |
| 3 | `02b_why_residual_connections_help.png` | Residual clarification |
| 4 | `02c_why_layernorm.png` | LayerNorm clarification |
| 5 | `02d_pre_norm_vs_post_norm.png` | Norm-order contrast |
| 6 | `03_sat_state_evolution_cartoon_diagram.png` | Exact depth example |
| 7 | `04_layers_and_parameters_explained_visually.png` | Parameter-ownership guardrail |
| 8 | `05_context_grows_with_visible_tokens.png` | Contextual-state and causal-mask guardrail |
| 9 | `06_key_value_memory_in_neural_layers.png` | Cache object definition |
| 10 | `07_decoding_with_cached_keys_and_values.png` | Prefill and cache reuse mechanism |
| 11 | `08_token_generation_growth_in_transformers.png` | Cache memory growth |
| 12 | `08b_sat_final_layernorm_example.png` | Exact final LayerNorm |
| 13 | `09_final_output_path_diagram_with_mascot.png` | Logits-to-probabilities handoff |
| 14 | `10_chapter_11_from_final_state_to_next_token.png` | Chapter 11 banner |

---

# 6. Numerical and conceptual source of truth

The stack preserves `n x d_model` at every block boundary. The toy later-block updates are illustrative and use different parameters from the worked first block.

Use these SAT states consistently:

```text
x_sat^(0)=[0.140000,-0.220000,0.670000,-0.310000]
x_sat^(1)=[0.006373,-0.143686,1.477529,-1.340215]
x_sat^(2)=[0.046373,-0.063686,1.527529,-1.270215]
x_sat^(3)=[0.076373,-0.023686,1.517529,-1.230215]
final normalised h_sat≈[-0.008859,-0.111600,1.470933,-1.350474]
```

The KV cache is per layer and stores Keys and Values from earlier positions.

---

## Production and review checklist

### Visual continuity
- [ ] Warm paper, hand-drawn linework, purple accents, and panel framing match Chapters 1–3.
- [ ] Returning characters, token colours, rooms, and props match approved earlier artwork.
- [ ] New characters have a stable design that can be reused in later scenes.
- [ ] The scene feels like another part of the same book, not a separate infographic series.

### Technical accuracy
- [ ] Every displayed number and tensor shape matches the chapter source.
- [ ] Inputs, intermediate objects, and outputs are visually distinct.
- [ ] The visual metaphor does not imply an operation that the model does not perform.
- [ ] The “remove the costumes” mapping is included for every major scene.
- [ ] Misconception panels correct the intended error without introducing a new one.

### Readability and accessibility
- [ ] Exact text is verified typography rather than unreviewed generated lettering.
- [ ] Labels and equations remain readable at mobile width.
- [ ] Dense arithmetic is isolated in workbook-style panels.
- [ ] Each image has useful technical alt text.
- [ ] One primary learning objective is visually dominant.

### Narrative flow
- [ ] The chapter begins with a clear hero scene.
- [ ] Mechanism scenes follow the chapter’s computational order.
- [ ] At least one exact numerical panel anchors the metaphor.
- [ ] The final scene hands the reader to the next chapter.

---

# Chapter 10 definition of done

Chapter 10 graphics are complete only when:

1. all 8 planned assets have approved final compositions;
2. every scene follows the approved book-wide style and character continuity;
3. all numerical overlays are checked against the chapter source;
4. images are committed under `assets/chapter-10/`;
5. `src/chapter-10.md` references the approved assets in the planned locations;
6. every image has useful alt text;
7. desktop and mobile previews show no clipping or unreadable labels;
8. the hero, mechanism, exact calculation, misconception guardrail, and chapter handoff are all represented;
9. a final technical review confirms that the metaphors preserve the chapter’s computation;
10. the changelog records the Chapter 10 graphics release.

---

# Current status

- Detailed scene planning: complete.
- Reusable prop specification: complete.
- Final artwork generation: complete.
- Asset integration into the chapter: complete through `site/book-data.js` and
  `site/chapter-10-supplemental-artwork.js`.
- Technical correction review: complete for causal visibility, residual shape,
  per-layer parameter ownership, cached decoding, cache growth, final
  LayerNorm, and the vocabulary-output path.
- Website and mobile review: pending deployment preview.
