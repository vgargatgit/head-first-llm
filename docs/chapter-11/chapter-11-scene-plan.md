# Chapter 11 Graphics Scene Plan

## Chapter

**Chapter 11 — The Final Audition**  
**Subtitle:** How the last hidden state becomes logits, probabilities, and the next generated token

## Status

This document is the canonical production specification for all Chapter 11 graphics. Final artwork belongs under `assets/chapter-11/`.

The Chapter 1–3 illustrations remain the visual reference standard. Chapter 11 must feel like the final department in the same visual world, not a separate decoding infographic.

---

# 1. Chapter visual objective

Show how SAT’s final contextual state becomes one score per vocabulary entry, how softmax creates a distribution, how decoding controls operate on that distribution, and how generation repeats one selected token at a time.

```text
final hidden state
    -> vocabulary projection
    -> logits
    -> vocabulary softmax
    -> probabilities
    -> decoding policy
    -> selected token
    -> append and repeat
```

Central lesson:

> The model produces a probability distribution over vocabulary token IDs. A separate decoding policy selects one next token from that distribution.

---

# 2. Style and continuity locks

- Use warm cream-paper backgrounds, hand-drawn outlines, purple accents, and established panel framing.
- SAT arrives directly from the Chapter 10 final-normalisation rooftop carrying the same four-coordinate hidden-state case file.
- Vocabulary candidates are token-ID characters, not necessarily complete English words.
- Reuse the probability-ticket visual language, but label this as **vocabulary softmax** and distinguish it from Chapter 4’s softmax over Key positions.
- Keep exact matrices and numbers as verified typography overlays.
- Decoding controls must remain visibly outside the learned model machinery.
- The final scene must hand the story to the Answer-Key Clerk in Chapter 12.

---

# 3. Reusable design elements

## Final Audition stage

A theatre where vocabulary-token candidates receive raw score placards.

## Vocabulary projection board

A `d_model × |V|` board with one column per candidate and one outgoing logit per column.

## Vocabulary softmax counter

One machine that accepts the whole logit row and prints probability tickets summing to one.

## Decoder control desk

Separate controls:

- greedy maximum pointer;
- categorical sampling wheel;
- temperature dial;
- top-k fixed-capacity gate;
- top-p cumulative-mass velvet rope.

## Generation loop track

A circular route from prefix to prediction to selected token to appended prefix.

---

# 4. Scene inventory

The planned Chapter 11 set contains **11 artwork files**.

---

## Scene 01 — Chapter hero: SAT reaches the Final Audition

**Asset**

```text
assets/chapter-11/01_chapter_hero_final_audition.png
```

**Placement:** Chapter opening.

**Learning objective:** Introduce the transition from one contextual vector to scores for every vocabulary candidate.

**Composition**

- SAT arrives with the Chapter 10 final hidden-state file.
- Candidates `on`, `quietly`, `.`, `the`, and `mat` wait on stage.
- Each candidate has a blank raw-score placard.
- A sign states `VOCABULARY TOKEN IDs — NOT WORDS ONLY`.
- The vocabulary projection board stands between SAT and the stage.

**Remove the costumes**

| Story object | Mathematical meaning |
|---|---|
| SAT case file | final hidden state `h_sat` |
| Candidate | vocabulary token ID |
| Blank placard | future logit |

**Do not show:** probabilities, winner selection, or a complete generated sentence.

**Alt text draft:** SAT’s final contextual state reaches a stage where five vocabulary-token candidates wait to receive raw scores.

---

## Scene 02 — Vocabulary projection mechanism

**Asset**

```text
assets/chapter-11/02_vocabulary_projection.png
```

**Placement:** Near “The language-model output head.”

**Learning objective:** Show that each vocabulary column produces one scalar logit.

**Composition**

- SAT’s four coordinates align with five columns of `W_vocab`.
- Each column has its own bias card.
- Five independent score lanes create a `1 × 5` logit row.
- Shape strip:

```text
(1 × 4)(4 × 5) + (1 × 5) -> (1 × 5)
```

**Do not show:** softmax inside the projection board or candidate-to-candidate comparisons.

**Alt text draft:** SAT’s four hidden coordinates are compared with five vocabulary columns and biases to produce one logit per token candidate.

---

## Scene 03 — Exact period logit

**Asset**

```text
assets/chapter-11/03_exact_period_logit.png
```

**Placement:** Inside “Verify the period logit.”

**Learning objective:** Anchor the vocabulary projection in one exact dot product.

**Required values**

```text
h_sat = [-0.008859,-0.111600,1.470933,-1.350474]
w_.   = [0.1,-0.2,0.6,-0.1]
b_.   = 0.10
logit(.) ≈ 1.139041
```

**Composition**

- Workbook-style panel.
- Four products and the bias are added explicitly.
- The result is placed on the period candidate’s placard.

**Do not show:** a percent sign or selected-winner badge.

**Alt text draft:** The period vocabulary column is dotted with SAT’s hidden state and bias to produce the raw logit 1.139041.

---

## Scene 04 — Logits are raw scores

**Asset**

```text
assets/chapter-11/04_logits_are_raw_scores.png
```

**Placement:** After the complete logit calculation.

**Learning objective:** Show that logits may be positive or negative and need not sum to one.

**Required board**

```text
on       0.756945
quietly -0.761311
.        1.139041
the     -0.748398
mat      1.002967
```

**Composition**

- Candidates hold their exact score placards.
- The period ranks first, but no one is selected yet.
- Negative scores use neutral colours, not danger or rejection styling.
- Warning: `RAW SCORES — NOT PERCENTAGES`.

**Alt text draft:** Five vocabulary candidates hold positive and negative logits that rank the candidates but do not yet form probabilities.

---

## Scene 05 — Vocabulary softmax

**Asset**

```text
assets/chapter-11/05_vocabulary_softmax.png
```

**Placement:** Inside “Softmax over the vocabulary.”

**Learning objective:** Convert the full logit row into one candidate distribution.

**Required probabilities**

```text
on       0.238931
quietly  0.052348
.        0.350118
the      0.053029
mat      0.305575
sum      1.000000
```

**Composition**

- All five logits enter one vocabulary-wide softmax counter.
- A small numerical-stability inset subtracts the maximum logit before exponentiation.
- Probability tickets return to candidates.
- Side comparison:

```text
Chapter 4 softmax: over visible Key positions
Chapter 11 softmax: over vocabulary entries
```

**Do not show:** one softmax per candidate or filtering before probabilities exist.

**Alt text draft:** Vocabulary softmax converts five raw scores into candidate probabilities summing to one.

---

## Scene 06 — Greedy decoding versus sampling

**Asset**

```text
assets/chapter-11/06_greedy_vs_sampling.png
```

**Placement:** Across greedy and sampling sections.

**Learning objective:** Separate the model’s distribution from the decoder’s selection rule.

**Composition**

- Duplicate the same probability board into two lanes.
- Greedy pointer selects `.` because it has the largest probability.
- Sampling wheel can select `.`, `mat`, `on`, or another retained candidate according to ticket shares.
- Banner: `SAME DISTRIBUTION — DIFFERENT SELECTION RULE`.

**Do not show:** different model probabilities for greedy and sampling or a claim that highest probability guarantees selection under sampling.

**Alt text draft:** Greedy decoding selects the highest-probability period, while sampling draws from the same probability distribution.

---

## Scene 07 — Temperature dial

**Asset**

```text
assets/chapter-11/07_temperature_dial.png
```

**Placement:** Inside the temperature section.

**Learning objective:** Show that temperature rescales logits before softmax.

**Composition**

- The same logit placards enter three lanes: low, normal, and high temperature.
- Low temperature creates a sharper ticket distribution.
- High temperature creates a flatter distribution.
- Model-weight machinery remains locked and unchanged.

**Required formula**

```text
p_T(j) = softmax(logit_j / T)
```

**Do not show:** temperature applied after final probabilities without renormalisation, or temperature as additional model knowledge.

**Alt text draft:** A temperature dial rescales the same logits before softmax to produce sharper or flatter candidate probabilities.

---

## Scene 08 — Top-k and top-p filters

**Asset**

```text
assets/chapter-11/08_topk_and_topp.png
```

**Placement:** Across the top-k and nucleus-sampling sections.

**Learning objective:** Distinguish fixed-count filtering from cumulative-probability filtering.

**Composition**

- Top-k gate admits a fixed number of highest-ranked candidates.
- Top-p velvet rope admits candidates in descending order until cumulative mass reaches the threshold.
- Rejected candidates are assigned zero and retained candidates are renormalised.
- The two admitted sets may differ.

**Do not show:** top-p as “keep every token whose individual probability exceeds p,” or sampling before renormalisation.

**Alt text draft:** Top-k retains a fixed number of candidates, while top-p retains the smallest leading set whose cumulative probability reaches a threshold.

---

## Scene 09 — Weight tying

**Asset**

```text
assets/chapter-11/09_weight_tying.png
```

**Placement:** Near the weight-tying discussion.

**Learning objective:** Show how input embeddings and the output vocabulary head may share parameters while doing different jobs.

**Composition**

- At the entrance, a token ID uses an embedding catalogue.
- At the Final Audition, a hidden state is compared with vocabulary columns.
- A shared underlying ledger connects the two stations when weights are tied.
- Different arrows and labels preserve the distinct computations.

**Do not show:** the two operations as identical or weight tying as universal.

**Alt text draft:** The input embedding catalogue and output vocabulary projection share a parameter ledger while serving different computational roles.

---

## Scene 10 — Autoregressive generation loop

**Asset**

```text
assets/chapter-11/10_autoregressive_generation_loop.png
```

**Placement:** Near the chapter’s full generation-loop summary.

**Learning objective:** Show one-token-at-a-time generation with position assignment and KV-cache extension.

**Composition**

```text
prefix -> tower -> logits -> probabilities -> decoder -> selected token
      -> append -> assign next position -> cached tower -> repeat
```

- Prefix begins as `The cat sat`.
- The selected candidate joins the visible sequence.
- Only the newest token makes a new cached trip through the tower.
- The loop continues until a stopping rule.

**Do not show:** an entire response generated in one decoding step or prior context discarded after appending.

**Alt text draft:** A selected token is appended to the prefix, assigned the next position, processed using the KV cache, and used to generate another token.

---

## Scene 11 — Tokens are not always words; handoff to training

**Asset**

```text
assets/chapter-11/11_tokens_and_training_handoff.png
```

**Placement:** Chapter ending.

**Learning objective:** Correct vocabulary misconceptions and introduce the training perspective.

**Composition**

- Display examples of a full-word token, word fragment, punctuation, whitespace-prefixed token, and special token.
- Place the current probability board beside a sealed green correct-answer card.
- The Answer-Key Clerk waits at the entrance to Chapter 12.
- No loss or gradient is calculated yet.

**Do not show:** the model directly choosing an English word or backpropagation beginning in this chapter.

**Alt text draft:** Different kinds of vocabulary tokens are shown beside a known next-token answer card that previews training.

---

# 5. Chapter placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_final_audition.png` | Hero |
| 2 | `02_vocabulary_projection.png` | Projection mechanism |
| 3 | `03_exact_period_logit.png` | Exact calculation |
| 4 | `04_logits_are_raw_scores.png` | Misconception guardrail |
| 5 | `05_vocabulary_softmax.png` | Probability mechanism |
| 6 | `06_greedy_vs_sampling.png` | Selection-policy contrast |
| 7 | `07_temperature_dial.png` | Logit rescaling |
| 8 | `08_topk_and_topp.png` | Candidate filtering |
| 9 | `09_weight_tying.png` | Parameter-sharing variant |
| 10 | `10_autoregressive_generation_loop.png` | Complete inference loop |
| 11 | `11_tokens_and_training_handoff.png` | Vocabulary caution and training handoff |

---

# 6. Numerical source of truth

```text
Vocabulary IDs:
0 on
1 quietly
2 .
3 the
4 mat

h_sat = [-0.008859,-0.111600,1.470933,-1.350474]

logits = [0.756945,-0.761311,1.139041,-0.748398,1.002967]
probabilities = [0.238931,0.052348,0.350118,0.053029,0.305575]
```

Greedy decoding selects `.`. Sampling may select any candidate retained by the active decoding filters. Decoding controls do not update learned model parameters.

---

# 7. Production checklist

## Continuity

- [ ] Warm paper, hand-drawn linework, purple accents, and approved token designs are preserved.
- [ ] SAT’s final case file matches Chapter 10.
- [ ] Probability tickets match the established visual grammar.
- [ ] The Final Audition becomes a reusable location for Chapter 13.

## Technical accuracy

- [ ] Every score and probability matches the numerical reference.
- [ ] Logits are never labelled percentages.
- [ ] Vocabulary softmax operates over candidate entries.
- [ ] Model distribution and decoder policy remain separate.
- [ ] Temperature acts on logits before softmax.
- [ ] Top-k and top-p are represented correctly.
- [ ] Generation produces one token per decoding step.

## Readability

- [ ] Dense arithmetic appears in clean workbook panels.
- [ ] Verified typography is used for mathematical labels.
- [ ] Every scene has useful technical alt text.
- [ ] Mobile previews retain readable candidate names and values.

---

# 8. Chapter 11 definition of done

Chapter 11 graphics are complete only when:

1. all 11 assets have approved compositions;
2. numerical overlays match `src/chapter-11.md`;
3. images are committed under `assets/chapter-11/`;
4. the chapter source references all approved assets with alt text;
5. desktop and mobile previews are reviewed;
6. decoding controls remain visually separate from learned model computation;
7. the final panel hands the probability distribution to the training story;
8. the changelog records the Chapter 11 graphics release.

---

# 9. Current status

- Detailed scene planning: complete.
- Reusable prop specification: complete.
- Final artwork generation: not started.
- Asset integration: not started.
- Website review: pending final artwork.
