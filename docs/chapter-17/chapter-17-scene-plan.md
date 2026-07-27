# Chapter 17 Graphics Scene Plan

## Chapter

**Chapter 17 — From Completion Machine to Helpful Assistant**  
**Subtitle:** How supervised fine-tuning, preferences, and adapters shape model behaviour

## Status

This document is the canonical production specification for all Chapter 17 graphics. Final artwork belongs under `assets/chapter-17/`.

The chapter moves the trained base model from the pretraining factory into a Post-Training Studio. It introduces the Fine-Tuning Coach, Chat Template Stage Manager, Preference Judge, frozen Reference Model, and Adapter Technician.

---

# 1. Chapter visual objective

Show how chat formatting creates the token sequence, supervised fine-tuning scores selected response targets, preference methods compare chosen and rejected completions, and LoRA changes which parameters are trained without changing the basic need for a loss and optimiser.

```text
pretrained completion model
    -> chat template and demonstrations
    -> supervised fine-tuning
    -> preference data / reference policy / preference objective
    -> optional parameter-efficient adapters
    -> evaluation and regression checks
    -> assistant behaviour during inference
```

Central lesson:

> Post-training does not write English rules directly into individual weights. It creates new training examples and objectives whose gradients reshape distributed model behaviour.

---

# 2. Style and continuity locks

- Preserve the warm paper, hand-drawn linework, purple accents, familiar Transformer machinery, green target cards, orange loss receipts, gradient envelopes, and Optimizer Engineer.
- The pretrained base model remains the same Transformer tower from inference and pretraining.
- Chat roles and separators are explicit tokens placed by a Stage Manager, not invisible prose formatting.
- Prompt tokens may remain visible as context while their loss boxes are covered.
- Preference labels use a visible rubric rather than unexplained good/bad signs.
- Frozen parameters remain active but use icy-blue locked controls.
- LoRA adapters use small trainable plates attached to a large frozen base matrix.
- The ending must reconnect post-training to inference and evaluation, not imply training is permanently active during ordinary generation.

---

# 3. Reusable design elements

## Post-Training Studio

A sequence of stations for chat formatting, demonstrations, preference comparison, adapter installation, and evaluation.

## Chat Template Stage Manager

A character placing system, user, assistant, separator, and end markers around messages before tokenisation/training.

## Fine-Tuning Coach

A coach carrying curated ideal-response scripts. This character must look clearly different from the Query-producing Question Coach.

## Preference Judge

A neutral evaluator comparing chosen and rejected responses using visible criteria such as correctness, helpfulness, clarity, safety, instruction following, and calibrated uncertainty.

## Frozen Reference Model

A locked copy used to measure how preference updates differ from a reference policy.

## Adapter Technician

A technician attaching trainable low-rank A and B plates to frozen base-weight machinery.

---

# 4. Scene inventory

The planned Chapter 17 set contains **11 artwork files**.

---

## Scene 01 — Chapter hero: the Post-Training Studio

**Asset**

```text
assets/chapter-17/01_chapter_hero_post_training_studio.png
```

**Placement:** Chapter opening.

**Learning objective:** Introduce post-training as continued optimisation of a capable completion model for desired interaction patterns.

**Composition**

- The pretrained Transformer tower arrives labelled `CAPABLE COMPLETION MODEL`.
- The Fine-Tuning Coach holds conversation demonstrations.
- The Stage Manager, Preference Judge, Adapter Technician, and Evaluation Inspector appear at later stations.
- A sign asks: `How does a completion model learn assistant behaviour?`

**Do not show:** a new model built from scratch or human-written rules inserted directly into isolated parameters.

**Alt text draft:** A pretrained completion model enters a Post-Training Studio containing demonstration, preference, adapter, and evaluation stations.

---

## Scene 02 — Chat template role tokens

**Asset**

```text
assets/chapter-17/02_chat_template_roles.png
```

**Placement:** Near the chat-template section.

**Learning objective:** Show that conversational structure is represented by an exact token sequence.

**Composition**

- The Stage Manager arranges system, user, and assistant message cards.
- Role markers, separators, start/end tokens, and generation prompt markers are added.
- A tokenizer conveyor turns the formatted text into IDs.
- A warning states that different model families use different templates.

**Remove the costumes**

| Story object | Mathematical meaning |
|---|---|
| Role placard | special role token(s) |
| Stage script | serialized chat sequence |
| Tokenizer conveyor | template text to token IDs |

**Do not show:** universal role-token syntax or templates applied only after tokenisation.

**Alt text draft:** A Stage Manager inserts role and boundary markers into a conversation before the formatted sequence is tokenised.

---

## Scene 03 — Response-only supervised loss mask

**Asset**

```text
assets/chapter-17/03_response_only_loss_mask.png
```

**Placement:** Across the response-only loss explanation.

**Learning objective:** Show that prompt tokens provide context even when their target-loss positions are ignored.

**Composition**

- System and user tokens remain visible on the input rail.
- Their corresponding loss boxes are covered by grey tape.
- Assistant response target boxes remain open and produce loss receipts.
- The causal curtain still applies across the whole sequence.

**Do not show:** prompt tokens deleted from the input context or assistant tokens attending bidirectionally to future response tokens.

**Alt text draft:** System and user tokens remain available as context while only assistant response positions contribute to the supervised fine-tuning loss.

---

## Scene 04 — Exact SFT mask and mean loss

**Asset**

```text
assets/chapter-17/04_exact_sft_loss.png
```

**Placement:** Beside the explicit token-by-token mask example.

**Learning objective:** Anchor response-only SFT in exact alignment and arithmetic.

**Required result**

```text
scoreable assistant losses = [0.30, 0.10]
SFT mean loss = (0.30 + 0.10) / 2 = 0.20
```

**Composition**

- Use the chapter’s full ten-token sequence and ten mask entries.
- Every token, target, and loss-mask bit is aligned in a clean table.
- Only two valid receipts enter the mean calculator.

**Do not show:** nine mask entries for ten tokens, prompt losses entering the denominator, or target shift omitted.

**Alt text draft:** A ten-token conversation aligns with its response-only mask, and the two scored assistant-token losses average to 0.20.

---

## Scene 05 — Supervised fine-tuning Coach

**Asset**

```text
assets/chapter-17/05_supervised_fine_tuning_coach.png
```

**Placement:** Near the SFT process discussion.

**Learning objective:** Show how demonstrations change model behaviour through ordinary next-token loss.

**Composition**

- The Coach supplies multiple curated prompt-response scripts.
- The familiar Answer-Key Clerk, Scorekeeper, Courier, and Engineer process those examples.
- One model sees many demonstrations; the Coach does not directly operate parameter knobs.
- A side contrast distinguishes full-sequence and response-only loss.

**Do not show:** the Coach writing a rule into a weight or one example guaranteeing general behaviour.

**Alt text draft:** Curated assistant demonstrations pass through the ordinary target, loss, gradient, and optimiser pipeline during supervised fine-tuning.

---

## Scene 06 — Preference Judge and paired responses

**Asset**

```text
assets/chapter-17/06_preference_judge.png
```

**Placement:** Near preference-data construction.

**Learning objective:** Show the structure and subjectivity of a preference pair.

**Composition**

- One prompt produces a chosen response and a rejected response.
- The Judge uses a visible rubric:

```text
correctness
helpfulness
clarity
safety
instruction following
calibrated uncertainty
```

- The preference label is attached to the pair, not to individual words.
- A disagreement inset shows that annotation guidelines and quality matter.

**Do not show:** chosen as universally true/good or rejected as always unusable.

**Alt text draft:** A Preference Judge compares two responses to the same prompt using an explicit rubric and labels one as preferred.

---

## Scene 07 — Reward model and RLHF loop

**Asset**

```text
assets/chapter-17/07_reward_model_and_rlhf.png
```

**Placement:** Across reward modelling and RLHF.

**Learning objective:** Show the separation among preference data, learned reward model, policy optimisation, and reference constraints.

**Composition**

- Preference pairs train a reward-score model.
- The current policy generates responses.
- The reward model scores them.
- A reference-policy tether discourages excessive drift.
- The optimiser updates the current policy using the chosen RL objective.
- Labels state that implementations vary.

**Do not show:** reward score as objective truth, direct human feedback on every policy step, or the reference model being updated with the current policy.

**Alt text draft:** Preference data trains a reward model, which scores policy responses during an RLHF loop constrained relative to a frozen reference policy.

---

## Scene 08 — DPO relative margin and exact loss

**Asset**

```text
assets/chapter-17/08_dpo_relative_margin.png
```

**Placement:** Inside the DPO numerical example.

**Learning objective:** Show that DPO compares chosen-versus-rejected log-probability margins relative to a reference model.

**Composition**

- Current policy and frozen reference each score chosen and rejected responses.
- Two difference bars form the relative margin.
- Scaling by beta feeds a logistic loss gauge.
- Exact result appears in a workbook inset.

**Required values**

```text
scaled relative margin = 0.04
L_DPO = -log sigmoid(0.04) ≈ 0.673347
```

**Do not show:** DPO using one absolute reward score, reference weights changing, or the margin treated as probability before sigmoid.

**Alt text draft:** Current and reference policies compare chosen and rejected response log probabilities, producing a scaled DPO margin of 0.04 and loss about 0.673347.

---

## Scene 09 — LoRA Adapter Technician

**Asset**

```text
assets/chapter-17/09_lora_adapter_technician.png
```

**Placement:** Near the LoRA mechanism.

**Learning objective:** Show frozen base computation plus a small trainable low-rank update path.

**Composition**

- Large base matrix `W_0` remains active but is icy blue and locked.
- Technician attaches small trainable A and B plates.
- Input passes through both the base path and adapter path; outputs add.
- Gradient envelopes reach A and B but not the locked base matrix.

**Required formula**

```text
W_effective = W_0 + (alpha / r) A B
```

**Do not show:** the frozen base skipped during forward computation, LoRA as a different loss function, or all training memory disappearing.

**Alt text draft:** A technician attaches trainable low-rank A and B plates to an active but frozen base matrix, adding a small learned update path.

---

## Scene 10 — Exact LoRA parameter count and adapter cartridges

**Asset**

```text
assets/chapter-17/10_exact_lora_parameter_count.png
```

**Placement:** Beside the LoRA parameter-count example.

**Learning objective:** Quantify parameter savings and show reusable adapters.

**Required values**

```text
base matrix: 4096 × 4096 = 16,777,216 parameters
rank-16 adapters: 4096×16 + 16×4096 = 131,072 parameters
trainable ratio = 0.78125%
```

**Composition**

- Large base control wall compared with two narrow adapter plates.
- Several task-specific adapter cartridges can be stored for one shared base model.
- Optional merge station shows adapter update folded into a copy of the base for deployment, with a caution that merging changes modularity.

**Do not show:** the ratio as total end-to-end memory reduction or adapters interchangeable without matching architecture/module names.

**Alt text draft:** Rank-16 LoRA plates add 131,072 trainable parameters to a 16,777,216-parameter matrix, about 0.78125 percent.

---

## Scene 11 — Post-training evaluation and reconnection to inference

**Asset**

```text
assets/chapter-17/11_evaluation_and_reconnection.png
```

**Placement:** Chapter ending.

**Learning objective:** Show that desired improvements must be evaluated alongside regressions and that trained parameters later operate during inference.

**Composition**

- Evaluation board covers instruction following, task correctness, safety, style, calibration, robustness, and retained base capabilities.
- One desired metric improves while a regression warning appears elsewhere.
- Human evaluation and automated tests occupy different lanes.
- Final panel reconnects the updated model to the Chapter 1–11 inference route: token states, attention, tower, Final Audition.
- Training personas step aside during ordinary inference.

**Do not show:** one benchmark proving universal assistant quality, preference optimisation guaranteeing truth or safety, or gradients active during ordinary generation.

**Alt text draft:** Post-training evaluation checks improvements and regressions before the updated model returns to the ordinary inference pipeline.

---

# 5. Placement map

| Order | Asset | Role |
|---:|---|---|
| 1 | `01_chapter_hero_post_training_studio.png` | Hero |
| 2 | `02_chat_template_roles.png` | Formatting mechanism |
| 3 | `03_response_only_loss_mask.png` | SFT mask concept |
| 4 | `04_exact_sft_loss.png` | Exact SFT calculation |
| 5 | `05_supervised_fine_tuning_coach.png` | SFT training system |
| 6 | `06_preference_judge.png` | Preference-data construction |
| 7 | `07_reward_model_and_rlhf.png` | RLHF system |
| 8 | `08_dpo_relative_margin.png` | Exact preference objective |
| 9 | `09_lora_adapter_technician.png` | LoRA mechanism |
| 10 | `10_exact_lora_parameter_count.png` | Exact parameter comparison |
| 11 | `11_evaluation_and_reconnection.png` | Evaluation and full-book reconnection |

---

# 6. Numerical and conceptual source of truth

```text
response-only SFT loss = (0.30 + 0.10) / 2 = 0.20
DPO scaled margin = 0.04
DPO loss ≈ 0.673347
base matrix parameters = 16,777,216
rank-16 LoRA parameters = 131,072
LoRA ratio = 0.78125%
```

SFT, RLHF, DPO, and LoRA are separate concepts:

- SFT defines examples and a next-token objective.
- RLHF is a family of policy-optimisation workflows using preference-derived reward signals.
- DPO is a direct preference objective relative to a reference policy.
- LoRA changes the trainable parameterisation, not the loss by itself.

---

# 7. Production checklist

- [ ] The Fine-Tuning Coach is visually distinct from the Question Coach.
- [ ] Chat templates include explicit role and boundary tokens.
- [ ] Response-only masks hide loss terms, not prompt context.
- [ ] Preference labels use a visible rubric.
- [ ] Current and reference policies are clearly separated.
- [ ] DPO uses relative chosen/rejected margins.
- [ ] Frozen base parameters remain active in computation.
- [ ] LoRA adapters receive gradients while the base remains locked.
- [ ] Parameter-count arithmetic is exact.
- [ ] Evaluation includes regressions and multiple measurement methods.
- [ ] Every scene has verified typography and alt text.

---

# 8. Chapter 17 definition of done

Chapter 17 graphics are complete only when all eleven assets are approved, committed under `assets/chapter-17/`, integrated into the chapter, checked against the SFT/DPO/LoRA numerical examples, and reviewed to ensure post-training objectives, parameterisation choices, and inference remain conceptually distinct.

---

# 9. Current status

- Detailed scene planning: complete.
- Post-training characters, props, and exact numerical panels specified.
- Final artwork generation: not started.
- Integration and website review: pending final artwork.
