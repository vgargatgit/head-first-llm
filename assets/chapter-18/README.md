# Chapter 18 artwork

These eleven production assets implement the canonical scene inventory in
`docs/chapter-18/chapter-18-scene-plan.md`. All images use the book's standard
1448 × 1086 landscape canvas.

| Asset | Placement | Alt text |
|---|---|---|
| `01_chapter_hero_three_transformer_houses.png` | Chapter opening | Three Transformer houses use shared building blocks but route information through full-input encoding, causal generation, or source encoding followed by conditional decoding. |
| `02_family_attention_permission_maps.png` | Meet the three houses | Encoder positions see the full input, decoder positions see only their permitted prefix, and encoder–decoder targets may inspect the complete encoded source. |
| `03_encoder_bank_context.png` | Why bidirectional context is useful | Full left and right context gives the word bank different contextual representations in financial and river-edge sentences. |
| `04_encoder_masked_language_objective.png` | Encoder pretraining | A bidirectional encoder reconstructs selected hidden tokens while loss is applied only at selected target positions. |
| `05_decoder_causal_generation.png` | Decoder-only models | Causal self-attention blocks future tokens and supports a loop that predicts and appends one token at a time. |
| `06_encoder_decoder_source_memory.png` | Encoder–decoder models | An encoder builds source memory, while a causal decoder generates the target and consults that memory through cross-attention. |
| `07_seq2seq_teacher_forcing.png` | Encoder–decoder training | During teacher-forced sequence-to-sequence training, each target token is predicted from the encoded source and the shifted target prefix. |
| `08_two_decoder_block_layouts.png` | The two meanings of decoder | A decoder-only block uses causal self-attention, while an encoder–decoder decoder also contains cross-attention to separate encoder outputs. |
| `09_family_task_selection_field_guide.png` | Comparison and field guide | A task signpost routes full-input representation work, open-ended generation, and explicit source-to-target generation toward their most natural Transformer families. |
| `10_architecture_independent_axes.png` | Architecture and lifecycle labels | A model can carry independent labels for architecture, training stage, interaction behaviour, modality, and numerical format. |
| `11_family_mistakes_and_handoff.png` | Misconceptions and handoff | A misconception clinic separates architecture families, then the Translator prepares to calculate cross-attention over encoder notes. |

## Production notes

- Generated with the built-in image generation workflow.
- Style references: approved inference and training artwork from Chapters 1–15.
- Encoder objects are blue, decoder objects are purple, and cross-attention uses
  both accents with explicit directional arrows.
- Filled cells and blocked X cells make attention permissions readable without
  relying on colour alone.
- Mathematical layouts and conceptual guardrails follow the Chapter 18 source
  and canonical scene plan.
