# LLMs from the Inside Out — Chapter Manifest

This file is the editorial publication record for canonical chapter order, part membership, graphics status, and publication status.

Canonical chapter prose lives under `src/`. The published site’s part and chapter metadata live in `site/book-data.js`. The names, ranges, titles, source paths, and membership recorded here must remain aligned with that site metadata.

## Part learning outcomes

| Part | Chapters | Learning outcome |
|---|---:|---|
| I — Build One Transformer Block | 1–8 | Trace the complete data flow through one simplified decoder-style Transformer block. |
| II — From Position to Prediction | 9–11 | Explain how a trained decoder-only Transformer turns an ordered token sequence into a next-token distribution. |
| III — How the Model Learns | 12–17 | Connect one next-token error to parameter updates, distributed training, and post-training methods. |
| IV — Transformer Families and Applications | 18–22 | Choose and explain the architecture and adaptation pattern behind common language and multimodal systems. |
| V — Efficient and Trustworthy Systems | 23–24 | Reason about the trade-offs required to deploy and continuously evaluate an LLM system. |

## Chapter publication record

| Chapter | Part | Title | Source | Graphics status | Publication status |
|---:|---|---|---|---|---|
| 1 | I — Build One Transformer Block | A Token Enters the Dating World | `src/chapter-01.md` | Illustrated | Published |
| 2 | I — Build One Transformer Block | Meet the Question Coach | `src/chapter-02.md` | Illustrated | Published |
| 3 | I — Build One Transformer Block | Meet the Profile Writer | `src/chapter-03.md` | Illustrated | Published |
| 4 | I — Build One Transformer Block | When Queries Meet Keys | `src/chapter-04.md` | Illustrated | Published |
| 5 | I — Build One Transformer Block | Meet the Information Courier | `src/chapter-05.md` | Illustrated | Published |
| 6 | I — Build One Transformer Block | Many Specialists at Work | `src/chapter-06.md` | Illustrated | Published |
| 7 | I — Build One Transformer Block | The Team Lead Combines the Reports | `src/chapter-07.md` | Illustrated | Published |
| 8 | I — Build One Transformer Block | The Private Thinking Room | `src/chapter-08.md` | Planned high-value graphics | Published |
| 9 | II — From Position to Prediction | Every Token Needs an Address | `src/chapter-09.md` | Planned high-value graphics | Published |
| 10 | II — From Position to Prediction | The Residual Stream Climbs the Stack | `src/chapter-10.md` | Planned high-value graphics | Published |
| 11 | II — From Position to Prediction | The Final Audition | `src/chapter-11.md` | Planned high-value graphics | Published |
| 12 | III — How the Model Learns | The Answer Key Moves One Step Ahead | `src/chapter-12.md` | Planned high-value graphics | Published |
| 13 | III — How the Model Learns | Meet the Scorekeeper | `src/chapter-13.md` | Planned high-value graphics | Published |
| 14 | III — How the Model Learns | The Blame Travels Backward | `src/chapter-14.md` | Planned high-value graphics | Published |
| 15 | III — How the Model Learns | The Training Factory Never Sees the Whole Library | `src/chapter-15.md` | Planned high-value graphics | Published |
| 16 | III — How the Model Learns | The Model Outgrows One Machine | `src/chapter-16.md` | Planned high-value graphics | Published |
| 17 | III — How the Model Learns | From Completion Machine to Helpful Assistant | `src/chapter-17.md` | Planned high-value graphics | Published |
| 18 | IV — Transformer Families and Applications | Three Transformer Families Move In | `src/chapter-18.md` | Planned high-value graphics | Published |
| 19 | IV — Transformer Families and Applications | The Decoder Borrows the Encoder’s Notes | `src/chapter-19.md` | Planned high-value graphics | Published |
| 20 | IV — Transformer Families and Applications | From Pretraining to Specialisation | `src/chapter-20.md` | Planned high-value graphics | Published |
| 21 | IV — Transformer Families and Applications | Open Book, Closed Book, or Tool Belt? | `src/chapter-21.md` | Planned high-value graphics | Published |
| 22 | IV — Transformer Families and Applications | Pictures, Audio, and Other Modalities | `src/chapter-22.md` | Planned high-value graphics | Published |
| 23 | V — Efficient and Trustworthy Systems | Smaller, Faster, Cheaper | `src/chapter-23.md` | Planned high-value graphics | Published |
| 24 | V — Efficient and Trustworthy Systems | Trust, but Verify | `src/chapter-24.md` | Planned high-value graphics | Published |

## Learning sequence

### Part I — Build One Transformer Block (Chapters 1–8)

**Learning outcome:** Trace the complete data flow through one simplified decoder-style Transformer block.

1. Hidden states establish what each token currently knows.
2. Query projections express what each token position is seeking.
3. Key projections create searchable representations for matching.
4. Scaled dot products, causal masking, and softmax produce attention weights.
5. Value projections and weighted sums produce the output of one attention head.
6. Multiple heads learn parallel matching-and-retrieval systems and concatenate their outputs.
7. The output projection mixes head features; residual connections and normalisation preserve a stable residual stream.
8. The position-wise MLP performs non-linear private processing and completes one simplified Transformer block.

### Part II — From Position to Prediction (Chapters 9–11)

**Learning outcome:** Explain how a trained decoder-only Transformer turns an ordered token sequence into a next-token distribution.

9. Positional embeddings and RoPE supply order and relative-distance information.
10. A stack of independently learned blocks repeatedly refines the residual stream and maintains per-layer KV caches during generation.
11. The final hidden state is projected into vocabulary logits, converted into probabilities, and decoded into the next token.

### Part III — How the Model Learns (Chapters 12–17)

**Learning outcome:** Connect one next-token error to parameter updates, distributed training, and post-training methods.

12. Shifted token sequences create next-token inputs and labels while causal and loss masks preserve the intended training task.
13. Cross-entropy converts correct-target probabilities into a masked mean loss, perplexity, and the initial logit gradient.
14. Backpropagation applies the chain rule through the output head, residual stream, MLPs, attention, embeddings, and optimiser update.
15. Minibatches, accumulation, data mixtures, schedules, validation, and checkpoints turn repeated updates into a controlled training run.
16. Data parallelism, model-state sharding, tensor parallelism, pipelines, and rematerialisation distribute training across accelerators.
17. Supervised demonstrations, preference comparisons, and low-rank adapters shape a pretrained completion model into assistant-like behaviour.

### Part IV — Transformer Families and Applications (Chapters 18–22)

**Learning outcome:** Choose and explain the architecture and adaptation pattern behind common language and multimodal systems.

18. Encoder-only, decoder-only, and encoder–decoder architectures are compared by attention pattern, training objective, strengths, and publicly documented real-world examples.
19. Cross-attention is derived explicitly: decoder Queries attend to encoder Keys and Values so generated output can consult an encoded source sequence.
20. The complete model lifecycle distinguishes broad pretraining, foundation models, base checkpoints, continued pretraining, full fine-tuning, supervised and instruction tuning, LoRA or QLoRA, preference tuning, prompting, retrieval, and tools.
21. Retrieval and tools distinguish information stored in weights from information supplied in context or fetched at runtime.
22. Multimodal systems connect language models to image, audio, and other modality encoders through projectors, shared token spaces, or cross-attention variants.

### Part V — Efficient and Trustworthy Systems (Chapters 23–24)

**Learning outcome:** Reason about the trade-offs required to deploy and continuously evaluate an LLM system.

23. Quantisation, distillation, sparsity, mixture-of-experts routing, batching, caching, and speculative decoding reduce training and serving cost.
24. Evaluation covers hallucination, calibration, bias, privacy, safety, benchmark contamination, release gates, and production monitoring.

## Model-family examples for Chapter 18

| Family | Attention pattern | Publicly documented examples | Typical strengths |
|---|---|---|---|
| Encoder-only | Bidirectional self-attention | BERT, RoBERTa, DeBERTa, ModernBERT | Classification, tagging, retrieval, reranking, and embeddings |
| Decoder-only | Causal self-attention | GPT-3, Llama 3, Mistral 7B, Gemma | Text and code generation, chat, completion, and tool-oriented generation |
| Encoder–decoder | Encoder self-attention, decoder causal self-attention, and cross-attention | Original Transformer, T5, BART, Whisper | Translation, summarisation, transcription, and conditional generation |

Commercial frontier models whose current internals are not sufficiently disclosed should be labelled **architecture not publicly confirmed**, rather than being forced into a category.

## Chapter 19 — Cross-attention scope

The chapter makes the source of each tensor explicit:

- decoder hidden states produce the Queries;
- encoder outputs produce the Keys and Values;
- the score matrix compares each decoder position with every permitted encoder position;
- the weighted sum retrieves source information for the decoder;
- decoder causal self-attention and encoder–decoder cross-attention are separate sublayers with different jobs.

The running story uses a Translator at a writing desk: the decoder drafts one output token at a time, then consults a wall of encoder notes before completing each draft.

## Chapter 20 — Foundation-model and adaptation scope

The chapter distinguishes concepts that are often blurred together:

- **pretraining:** learning broad statistical structure from large datasets using a self-supervised or otherwise scalable objective;
- **pretrained or base model:** the checkpoint produced by pretraining;
- **foundation model:** a broadly trained model intended to support many downstream adaptations or applications;
- **continued pretraining:** further broad or domain-focused pretraining without changing the fundamental objective;
- **fine-tuning:** updating a pretrained model for a narrower task, domain, format, or behaviour;
- **instruction tuning:** supervised fine-tuning on instruction-and-response examples;
- **parameter-efficient fine-tuning:** adapting a small subset of parameters or added modules, including LoRA and QLoRA;
- **preference tuning:** shaping behaviour from comparisons or preference signals through methods such as RLHF or DPO;
- **prompting and RAG:** runtime adaptation methods that do not alter the model weights.

## Graphics approach

Chapters are written and numerically verified before final illustration work begins. Graphics are added selectively where they provide high instructional value rather than as decoration.

Strong candidates for Parts IV and V (Chapters 18–24) are:

- a three-house comparison of encoder-only, decoder-only, and encoder–decoder attention patterns;
- a model-family field guide matching public models to architecture and typical jobs;
- a cross-attention scene in which decoder Queries consult an encoder memory wall of Keys and Values;
- a foundation-model construction site showing broad pretraining followed by many adapted downstream buildings;
- a lifecycle map separating pretraining, continued pretraining, full fine-tuning, instruction tuning, LoRA or QLoRA, and preference tuning;
- a RAG scene contrasting knowledge in weights, information in the prompt, and documents retrieved at runtime;
- a multimodal bridge connecting image or audio encoders to a language decoder;
- a deployment workshop covering quantisation, distillation, MoE routing, batching, and KV-cache memory;
- an evaluation clinic for hallucination, calibration, bias, privacy, safety, and benchmark leakage.

## Immediate production order

1. Review Part IV and Part V (Chapters 18–24) numerically and editorially against the established chapter style.
2. Create a shared visual master plan for Part IV and Part V, followed by chapter-specific scene plans.
3. Produce Part IV’s architecture-family and cross-attention graphics first.
4. Continue through adaptation, RAG, and multimodality, then produce Part V’s efficiency and evaluation graphics.
5. Integrate approved assets with descriptive alt text and mobile review while preserving the part-aware reader navigation.
