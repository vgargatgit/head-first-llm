# Chapter 20 artwork

These eleven production assets implement the canonical scene inventory in
`docs/chapter-20/chapter-20-scene-plan.md`. All images use the book's standard
1448 × 1086 landscape canvas.

| Asset | Placement | Alt text |
|---|---|---|
| `01_chapter_hero_model_lifecycle.png` | Chapter opening | A model lifecycle begins with broad pretraining, branches into persistent adaptations, and can later receive temporary prompts, retrieved documents, and tool results. |
| `02_pretraining_to_base_checkpoint.png` | Pretraining and base models | Broad pretraining adjusts distributed parameters and produces a reusable base checkpoint that may not yet follow a stable assistant interaction contract. |
| `03_lifecycle_label_axes.png` | Architecture and lifecycle axes | One checkpoint can simultaneously be decoder-only, instruction-tuned, multimodal, quantised, and used as a foundation for downstream applications. |
| `04_continued_pretraining_vs_fine_tuning.png` | Continued pretraining versus fine-tuning | Continued pretraining extends modelling of a data distribution, while fine-tuning targets a narrower task, format, or behaviour. |
| `05_supervised_adaptation_family.png` | Supervised adaptation | Supervised fine-tuning learns from desired outputs, instruction tuning broadens the task mix, and chat tuning serialises role-based conversations. |
| `06_preference_and_peft.png` | Preference tuning and PEFT | Preference data determines the learning signal, while PEFT controls which small parameter set stores the update and QLoRA keeps the frozen base quantised. |
| `07_runtime_conditioning_no_weight_change.png` | Prompting and in-context learning | Prompts and in-context examples alter the current token context while leaving the checkpoint weights unchanged. |
| `08_rag_and_tools_runtime.png` | Retrieval and tool use | Retrieval supplies external evidence to the prompt, while tools perform validated operations outside the model and return results as runtime context. |
| `09_weight_change_comparison.png` | Weight-change taxonomy | Pretraining and full tuning alter model weights, PEFT alters adapter weights, and prompting, RAG, and tools supply temporary runtime context. |
| `10_adaptation_decision_tree.png` | Decision tree and lifecycle example | A decision tree selects runtime or training mechanisms based on information freshness, behavioural persistence, data quality, reuse, and regression risk. |
| `11_governance_regressions_and_handoff.png` | Governance and chapter handoff | Lifecycle stages carry data-governance and regression obligations before the model reaches four possible sources of support at runtime. |

## Production notes

- Generated with the built-in image-generation workflow.
- Style references: Chapters 15, 17, and 18, plus the inference and training
  visual-grammar master plans.
- Gold seals mark changed base weights; puzzle plates mark adapter changes;
  blue removable trays and snowflake seals mark context-only conditioning.
- Purple paths show forward computation, red-orange dashed paths show
  gradients, blue systems are frozen or external, and orange gates mark
  validation and regression checks.
- Technical guardrails and chapter-to-chapter continuity follow the canonical
  Chapter 20 scene plan.
