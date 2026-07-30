# Chapter 22 Graphics Scene Plan

## Chapter

**Chapter 22 — Pictures, Audio, and Other Modalities**  
**Subtitle:** How modality encoders, projectors, shared token spaces, and cross-attention connect the world to a language model

## Status

This document is the canonical production specification for all Chapter 22 graphics. Final artwork belongs under `assets/chapter-22/`.

---

# 1. Chapter visual objective

Show how modality-specific preprocessing and encoders create vector sequences, how connector patterns align them with language computation, and why fluent output does not prove grounded perception.

```text
raw modality -> preprocessing -> modality encoder -> connector/fusion -> language model
```

Central lesson:

> Language models do not directly read pixels or waveforms. Multimodal systems create representations, connect and align them through training, and must evaluate perception, the bridge, and generation separately.

---

# 2. Style and continuity locks

- Introduce a Senses Department attached to the familiar Transformer tower.
- Raw pixels, patches, spectrogram frames, modality vectors, and text tokens must look distinct.
- Projectors change dimensions but do not automatically align semantics.
- Treat the four connector patterns as alternatives, not mandatory stacked stages.
- Preserve spatial layout and temporal order where the architecture requires them.
- Safety panels include privacy, spoofing, hidden content, and modality conflict.
- The final scene sends the multimodal system to Chapter 23’s Deployment Workshop.

---

# 3. Reusable design elements

## Senses Department

Vision, audio, document, and video intake desks that produce sequences of vector cards.

## Connector bridge

Projector, cross-attention, learned-query bottleneck, or unified latent route.

## Grounding Inspector

Checks whether generated claims are supported by modality evidence.

## Modality conflict alarm

Triggers when text, image, audio, metadata, or instructions disagree.

---

# 4. Scene inventory

The planned Chapter 22 set contains **11 artwork files**.

## Scene 01 — Chapter hero: the Senses Department

**Asset:** `assets/chapter-22/01_chapter_hero_senses_department.png`  
**Placement:** Chapter opening.  
**Learning objective:** Introduce modality encoders and connectors.

**Composition:** Images, audio, video, and documents enter separate intake desks, become vector sequences, cross labelled bridges, and join the language Transformer. A question sign asks how non-text becomes usable context.

**Alt text draft:** A Senses Department converts images, audio, video, and documents into vector sequences and connects them to a language model.

## Scene 02 — Image patch sequence

**Asset:** `assets/chapter-22/02_image_to_patch_vectors.png`  
**Placement:** Across “Images become sequences of vectors.”  
**Learning objective:** Explain patchification and positional information.

**Composition:** A `224 × 224` image is divided into a `14 × 14` grid of `16 × 16` patches, producing `196` ordered patch vectors plus visible spatial-position markers.

**Do not show:** patches as words or unordered tiles.  
**Alt text draft:** A 224-pixel square image divides into 196 sixteen-pixel-square patches that become an ordered sequence of visual vectors.

## Scene 03 — Audio time–frequency sequence

**Asset:** `assets/chapter-22/03_audio_to_time_frequency_vectors.png`  
**Placement:** At the audio section.  
**Learning objective:** Show waveform preprocessing and preserved time.

**Composition:** A waveform passes through framing and a spectrogram-like time–frequency panel, then an audio encoder emits ordered feature vectors. Speech, music, speaker, emotion, and environmental sounds appear as possible signals.

**Do not show:** transcript text as a complete replacement for audio.  
**Alt text draft:** Audio is transformed into time–frequency features and encoded as an ordered sequence that may carry speech and non-verbal information.

## Scene 04 — Four connector patterns

**Asset:** `assets/chapter-22/04_four_multimodal_connector_patterns.png`  
**Placement:** Across “Four common connection patterns.”  
**Learning objective:** Compare alternative integration architectures.

**Composition:** Four aligned mini-blueprints: projector into language width; language Queries cross-attending to modality K/V; learned queries compressing many features; unified token or latent space.

**Do not show:** every model using all four or every connector using cross-attention.  
**Alt text draft:** Multimodal systems may project features into language width, use cross-attention, compress them through learned queries, or train a unified token or latent space.

## Scene 05 — Exact projector calculation

**Asset:** `assets/chapter-22/05_exact_projector_calculation.png`  
**Placement:** Beside the numerical example.  
**Learning objective:** Anchor dimension conversion in exact arithmetic.

**Required result:** `v=[0.6,-0.2,0.5]`, `W_P=[[0.5,0.1],[-0.3,0.7],[0.4,-0.2]]`, and `p=[0.56,-0.18]`.

**Composition:** Reproduce the manuscript’s modality vector, projector matrix, coordinate calculations without bias, and final projected vector in a workbook panel. A warning below reads `MATCHED WIDTH ≠ MATCHED MEANING`.

**Do not show:** projection alone as semantic alignment.  
**Alt text draft:** A learned linear projector maps one modality feature vector into the language model width, but dimensional compatibility alone does not establish semantic alignment.

## Scene 06 — Multimodal training objectives

**Asset:** `assets/chapter-22/06_multimodal_training_objectives.png`  
**Placement:** Across the objective sections.  
**Learning objective:** Show how alignment and generation are learned.

**Composition:** Five stations: contrastive paired-item alignment, caption generation, matching classification, reconstruction, and multimodal instruction tuning. Positive and negative pairs are visibly data-defined.

**Do not show:** contrastive alignment as token-by-token identity.  
**Alt text draft:** Contrastive, generative, matching, reconstruction, and instruction objectives teach different parts of multimodal alignment and behaviour.

## Scene 07 — Frozen and trainable bridge configurations

**Asset:** `assets/chapter-22/07_frozen_and_trainable_components.png`  
**Placement:** Across frozen components and named bridge examples.  
**Learning objective:** Show possible training boundaries.

**Composition:** Icy locks and warm trainable controls distinguish frozen modality encoder, trainable connector, and frozen or partially trainable language model. Small documented examples show learned-query bottleneck, cross-attention insertion, and audio-encoder/text-decoder patterns without implying universality.

**Alt text draft:** Multimodal training may freeze large encoders and language models while training a connector, or may update selected components depending on the design.

## Scene 08 — Early, middle, and late fusion

**Asset:** `assets/chapter-22/08_fusion_timing_comparison.png`  
**Placement:** Across fusion timing.  
**Learning objective:** Compare where modalities interact.

**Composition:** Early fusion combines low-level or token-like inputs, middle fusion exchanges hidden features within the network, and late fusion combines independent predictions. Use one consistent two-modality example.

**Do not show:** timing labels as quality rankings.  
**Alt text draft:** Early, middle, and late fusion differ in whether modalities interact near input representation, inside the model, or after separate predictions.

## Scene 09 — Spatial, document, video, and audio structure

**Asset:** `assets/chapter-22/09_modality_structure_and_resolution.png`  
**Placement:** Across the modality-specific limitations.  
**Learning objective:** Preserve structure beyond generic vector sequences.

**Composition:** Four panels show spatial coordinates and resolution; OCR text plus page layout, tables, and reading order; video frames plus temporal sampling; and audio cues beyond words.

**Do not show:** a document as merely an image or video as an unordered photo set.  
**Alt text draft:** Multimodal representations must preserve spatial layout, document structure, video time, and non-verbal audio cues where those details matter.

## Scene 10 — Multimodal generation, grounding, and conflict

**Asset:** `assets/chapter-22/10_grounding_conflict_and_generation.png`  
**Placement:** Across generation, hallucination, and conflicts.  
**Learning objective:** Distinguish fluent language from verified perception.

**Composition:** A Grounding Inspector connects each generated claim to image regions, audio intervals, or document cells. A conflict alarm fires when caption text and visible evidence disagree; the system may qualify or abstain.

**Do not show:** attention alone as proof of grounding.  
**Alt text draft:** A grounding inspector checks generated claims against modality evidence and flags conflicts instead of treating fluent descriptions as proof of accurate perception.

## Scene 11 — Evaluation, safety, and deployment handoff

**Asset:** `assets/chapter-22/11_multimodal_evaluation_safety_handoff.png`  
**Placement:** Across safety, evaluation, mistakes, and “Coming next.”  
**Learning objective:** Evaluate each component and prepare for deployment optimisation.

**Composition:** Separate gauges test raw preprocessing, modality encoder, connector, language reasoning, subgroup performance, robustness, privacy, hidden instructions, spoofing, and end-to-end grounding. The resulting large system arrives at a workshop with memory, compute, latency, and bandwidth gauges.

**Alt text draft:** A multimodal evaluation line tests each modality, connector, generation, robustness, privacy, and grounding before the system enters deployment optimisation.

---

# 5. Production checklist

- [ ] Raw modality, encoder features, projected features, and language tokens are distinct.
- [ ] The `224/16 = 14`, `14 × 14 = 196` patch calculation is exact.
- [ ] The projector example matches the manuscript’s final vector.
- [ ] Connector patterns are alternatives and use correct Q/K/V provenance.
- [ ] Spatial and temporal information remains visible.
- [ ] Grounding and connector quality are evaluated separately from fluency.
