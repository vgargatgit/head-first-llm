# Chapter 20 Graphics Scene Plan

## Chapter

**Chapter 20 — From Pretraining to Specialisation**  
**Subtitle:** Foundation models, base checkpoints, continued pretraining, fine-tuning, instruction tuning, adapters, and runtime adaptation

## Status

This document is the canonical production specification for all Chapter 20 graphics. Final artwork belongs under `assets/chapter-20/`.

---

# 1. Chapter visual objective

Separate broad capability training, persistent weight adaptation, checkpoint labels, and temporary runtime conditioning.

```text
pretraining -> base checkpoint -> weight-changing adaptation branches
                               -> runtime context, retrieval, and tools
```

Central lesson:

> Ask whether weights changed. Training and adapters persist changes; prompts, retrieved documents, and tool results condition a request without rewriting base weights.

---

# 2. Style and continuity locks

- Reuse the training factory, Post-Training Studio, adapter plates, and checkpoint archive.
- Weight-changing routes use gradient envelopes and optimiser tools; runtime routes use removable context trays.
- A foundation is a reusable role, not a special architecture-shaped building.
- LoRA changes trainable parameterisation, not the loss objective.
- Retrieval and tools remain external system components.
- Every lifecycle path includes provenance, evaluation, and regression gates.
- Chapter 21’s exam desk appears in the final handoff.

---

# 3. Reusable design elements

## Lifecycle railway

One broad pretraining trunk, several persistent adaptation branches, and removable runtime sidecars.

## Weight-change seal

`WEIGHTS CHANGED`, `ADAPTER CHANGED`, or `CONTEXT ONLY`.

## Checkpoint Archivist

Stores base, fully tuned, and adapter-linked versions with provenance.

## Regression gate

Tests intended gains and capabilities that may have degraded.

---

# 4. Scene inventory

The planned Chapter 20 set contains **11 artwork files**.

## Scene 01 — Chapter hero: model-development map

**Asset:** `assets/chapter-20/01_chapter_hero_model_lifecycle.png`  
**Placement:** Chapter opening.  
**Learning objective:** Orient the reader to lifecycle stages and runtime conditioning.

**Composition:** Raw data enters the training factory and produces a base checkpoint. Tracks branch to continued pretraining, SFT, preference tuning, and adapters; removable prompt, retrieval, and tool cars join only at runtime.

**Alt text draft:** A model lifecycle begins with broad pretraining, branches into persistent adaptations, and can later receive temporary prompts, retrieved documents, and tool results.

## Scene 02 — Broad pretraining and the base checkpoint

**Asset:** `assets/chapter-20/02_pretraining_to_base_checkpoint.png`  
**Placement:** Across pretraining and base-model sections.  
**Learning objective:** Define capability-building and the resulting checkpoint.

**Composition:** Diverse data feeds a scalable objective and training loop. The Archivist seals `BASE CHECKPOINT: CAPABLE CONTINUATION MODEL`, with a caution that it is not necessarily a reliable assistant.

**Do not show:** a clean fact database or finished chat behaviour.  
**Alt text draft:** Broad pretraining adjusts distributed parameters and produces a reusable base checkpoint that may not yet follow a stable assistant interaction contract.

## Scene 03 — Independent label axes

**Asset:** `assets/chapter-20/03_lifecycle_label_axes.png`  
**Placement:** Across foundation model and architecture axes.  
**Learning objective:** Stop lifecycle terms from replacing architecture terms.

**Composition:** A coordinate board has independent rows for architecture, checkpoint stage, training history, adaptation, interaction behaviour, modality, foundation role, and quantisation.

**Do not show:** foundation, chat, or quantised as architecture families.  
**Alt text draft:** One checkpoint can simultaneously be decoder-only, instruction-tuned, multimodal, quantised, and used as a foundation for downstream applications.

## Scene 04 — Continued pretraining versus fine-tuning

**Asset:** `assets/chapter-20/04_continued_pretraining_vs_fine_tuning.png`  
**Placement:** At the comparison table.  
**Learning objective:** Contrast data, objective, and intent.

**Composition:** Two branches start at the same base. One continues broad modelling on domain text using a pretraining-style objective; the other uses labelled examples or behaviour objectives for narrower outcomes.

**Do not show:** a perfectly sharp universal boundary.  
**Alt text draft:** Continued pretraining extends modelling of a data distribution, while fine-tuning targets a narrower task, format, or behaviour.

## Scene 05 — Full fine-tuning, SFT, instruction, and chat

**Asset:** `assets/chapter-20/05_supervised_adaptation_family.png`  
**Placement:** Across the fine-tuning sections.  
**Learning objective:** Nest related terms without treating them as synonyms.

**Composition:** A hierarchy shows fine-tuning as the broad room, SFT as input–target demonstrations, instruction tuning as diverse instructions, and chat tuning as role-formatted conversations. A full-update switch permits gradients across original parameters.

**Required formula:** Include the response-masked SFT loss.  
**Alt text draft:** Supervised fine-tuning learns from desired outputs, instruction tuning broadens the task mix, and chat tuning serialises role-based conversations.

## Scene 06 — Preference tuning and parameter-efficient adaptation

**Asset:** `assets/chapter-20/06_preference_and_peft.png`  
**Placement:** Across preference tuning, PEFT, and QLoRA.  
**Learning objective:** Distinguish objective from where updates are stored.

**Composition:** A Preference Judge supplies `(x,y_c,y_r)` to a loss station. Next door, the same loss sends gradients only into LoRA A/B plates attached to frozen `W₀`; a QLoRA inset shows a quantised frozen base with higher-precision trainable adapters.

**Do not show:** LoRA as a loss or no activation/gradient memory.  
**Alt text draft:** Preference data determines the learning signal, while PEFT controls which small parameter set stores the update and QLoRA keeps the frozen base quantised.

## Scene 07 — Runtime adaptation tray

**Asset:** `assets/chapter-20/07_runtime_conditioning_no_weight_change.png`  
**Placement:** Across prompting and in-context learning.  
**Learning objective:** Show temporary behaviour without gradient descent.

**Composition:** The same sealed checkpoint receives different removable trays containing instructions and examples, produces different outputs, then returns unchanged after the trays are removed.

**Do not show:** an optimiser or new checkpoint.  
**Alt text draft:** Prompts and in-context examples alter the current token context while leaving the checkpoint weights unchanged.

## Scene 08 — Retrieval and tools remain external

**Asset:** `assets/chapter-20/08_rag_and_tools_runtime.png`  
**Placement:** Across RAG and tool use.  
**Learning objective:** Distinguish supplied information from external execution.

**Composition:** RAG fetches versioned documents into context; a tool route sends a structured proposal to an application validation gate, executes externally, and returns a result. Both carry `NO MODEL-WEIGHT UPDATE`.

**Do not show:** the model executing privileged actions directly.  
**Alt text draft:** Retrieval supplies external evidence to the prompt, while tools perform validated operations outside the model and return results as runtime context.

## Scene 09 — What changes the weights?

**Asset:** `assets/chapter-20/09_weight_change_comparison.png`  
**Placement:** Beside the chapter table.  
**Learning objective:** Provide a durable taxonomy.

**Composition:** Three columns: base weights change; adapter weights change; context only. Place every method from the table into exactly one primary column and note how persistence depends on loading the adapter.

**Alt text draft:** Pretraining and full tuning alter model weights, PEFT alters adapter weights, and prompting, RAG, and tools supply temporary runtime context.

## Scene 10 — Decision tree, layered support assistant, and regression gate

**Asset:** `assets/chapter-20/10_adaptation_decision_tree.png`  
**Placement:** Across the decision tree and lifecycle example.  
**Learning objective:** Assign problems to the right mechanism.

**Composition:** Questions branch on missing information versus behaviour, persistence, training data, reusable base, and regression measurement. The support-assistant result layers instruction tuning, current-doc retrieval, account tools, and a format adapter.

**Do not show:** one mechanism solving every requirement.  
**Alt text draft:** A decision tree selects runtime or training mechanisms based on information freshness, behavioural persistence, data quality, reuse, and regression risk.

## Scene 11 — Governance, forgetting, and exam-desk handoff

**Asset:** `assets/chapter-20/11_governance_regressions_and_handoff.png`  
**Placement:** Across catastrophic forgetting, governance, mistakes, and “Coming next.”  
**Learning objective:** Make evaluation and provenance part of every stage.

**Composition:** Every lifecycle track passes through licence, privacy, deletion, provenance, target-quality, and regression gates. A narrow fine-tune improves one gauge while lowering multilingual and general gauges. The final checkpoint approaches an exam desk labelled closed book, notes, open book, and tool belt.

**Alt text draft:** Lifecycle stages carry data-governance and regression obligations before the model reaches four possible sources of support at runtime.

---

# 5. Production checklist

- [ ] Each method clearly states whether base weights, adapter weights, or only context changes.
- [ ] Foundation model is shown as a role, not an architecture.
- [ ] LoRA and QLoRA retain a real training objective and memory costs.
- [ ] Tool calls pass through application validation.
- [ ] Fine-tuning gains are paired with regression evaluation.
- [ ] Data provenance appears across the full lifecycle.

