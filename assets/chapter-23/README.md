# Chapter 23 artwork

Production artwork for **Chapter 23 — Smaller, Faster, Cheaper**.

The canonical scene requirements, learning objectives, alt-text drafts, and
technical guardrails live in
[`docs/chapter-23/chapter-23-scene-plan.md`](../../docs/chapter-23/chapter-23-scene-plan.md).

## Asset inventory

1. `01_chapter_hero_deployment_workshop.png`
2. `02_exact_weight_memory.png`
3. `03_quantisation_scales_and_error.png`
4. `04_quantisation_variants_and_hardware.png`
5. `05_distillation_teacher_student.png`
6. `06_sparsity_and_moe.png`
7. `07_prefill_decode_kv_cache.png`
8. `08_kv_cache_and_prefix_optimisations.png`
9. `09_continuous_batching_and_padding.png`
10. `10_speculative_decoding_and_parallelism.png`
11. `11_efficiency_dashboard_and_handoff.png`

## Production prompt

The images were generated individually with the built-in image-generation
tool. Each prompt combined its scene specification from the canonical plan
with this shared art direction:

> Create a scientific-educational illustration for the same technical book as
> the supplied style reference. Use warm cream paper, imperfect hand-inked
> outlines, watercolor-pencil texture, muted purple/blue/orange/green accents,
> friendly workshop machinery, bold hand-lettered hierarchy, and dense but
> readable teaching panels. Preserve the exact technical distinctions,
> calculations, warnings, and required labels from the scene plan. Avoid
> photorealism, neon science fiction, generic corporate vector art, tiny prose,
> unsupported efficiency claims, and watermarks.

The Chapter 23 hero was then used as the local style reference for the
remaining ten scenes to keep the Deployment Engineer, Quality Inspector,
workshop palette, and visual grammar consistent.

## Canvas

Most scenes are `1448 × 1086` pixels. Scenes 07 and 10 use `1536 × 1024`
because their wide process diagrams need additional horizontal room.
