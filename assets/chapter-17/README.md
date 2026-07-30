# Chapter 17 artwork

These eleven production assets implement the canonical inventory in
`docs/chapter-17/chapter-17-scene-plan.md`. All images use the book's standard
1448 × 1086 landscape canvas.

| Asset | Alt text |
|---|---|
| `01_chapter_hero_post_training_studio.png` | A pretrained completion model enters a Post-Training Studio containing chat-template, demonstration, preference, adapter, and evaluation stations. |
| `02_chat_template_roles.png` | A Stage Manager inserts model-specific role and boundary markers into a conversation before the serialized sequence is tokenized. |
| `03_response_only_loss_mask.png` | Prompt tokens remain available as causal context while only assistant-response target positions contribute direct supervised loss. |
| `04_exact_sft_loss.png` | Ten conversation tokens align with ten target-mask entries, and the two scored assistant targets average to an SFT loss of 0.20. |
| `05_supervised_fine_tuning_coach.png` | Curated demonstrations pass through chat formatting, shifted targets, masked cross-entropy, gradients, and optimizer updates. |
| `06_preference_judge.png` | A neutral judge compares chosen and rejected responses to the same prompt using an explicit six-part rubric. |
| `07_reward_model_and_rlhf.png` | Preference pairs train a reward model, which scores responses in a policy-optimization loop tethered to a frozen reference. |
| `08_dpo_relative_margin.png` | Current and frozen reference policies produce chosen-versus-rejected margins whose scaled difference is 0.04 and DPO loss is about 0.673347. |
| `09_lora_adapter_technician.png` | An active frozen base projection and a trainable low-rank A-to-B path process the same input and add their outputs. |
| `10_exact_lora_parameter_count.png` | Rank-16 LoRA plates contain 131,072 trainable parameters versus 16,777,216 in the base matrix, a ratio of 0.78125 percent. |
| `11_evaluation_and_reconnection.png` | Human and automated evaluation check improvements and regressions before the updated model returns to ordinary inference without gradients. |

## Production notes

- Generated with the built-in image-generation workflow.
- Style references: the training-loop cast and Chapters 12–15.
- Frozen systems use icy-blue locked controls; trainable adapters use gold and
  purple plates.
- SFT, RLHF, DPO, LoRA, evaluation, and inference remain visually distinct.
