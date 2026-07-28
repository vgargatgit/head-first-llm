# LLMs from the Inside Out — Chapter Manifest

This file records the canonical chapter order and publication status for the book website.

| Chapter | Title | Source | Graphics status | Publication status |
|---:|---|---|---|---|
| 1 | A Token Enters the Dating World | `src/chapter-01.md` | Illustrated | Published |
| 2 | Meet the Question Coach | `src/chapter-02.md` | Illustrated | Published |
| 3 | Meet the Profile Writer | `src/chapter-03.md` | Illustrated | Published |
| 4 | When Queries Meet Keys | `src/chapter-04.md` | Illustrated | Published |
| 5 | Meet the Information Courier | `src/chapter-05.md` | Illustrated | Published |
| 6 | Many Specialists at Work | `src/chapter-06.md` | Illustrated | Published |
| 7 | The Team Lead Combines the Reports | `src/chapter-07.md` | Illustrated | Published |
| 8 | The Private Thinking Room | `src/chapter-08.md` | Planned high-value graphics | Published |
| 9 | Every Token Needs an Address | `src/chapter-09.md` | Planned high-value graphics | Published |
| 10 | The Residual Stream Climbs the Stack | `src/chapter-10.md` | Planned high-value graphics | Published |
| 11 | The Final Audition | `src/chapter-11.md` | Planned high-value graphics | Published |
| 12 | The Answer Key Moves One Step Ahead | `src/chapter-12.md` | Planned high-value graphics | Published |
| 13 | Meet the Scorekeeper | `src/chapter-13.md` | Planned high-value graphics | Published |
| 14 | The Blame Travels Backward | `src/chapter-14.md` | Planned high-value graphics | Published |
| 15 | The Training Factory Never Sees the Whole Library | `src/chapter-15.md` | Planned high-value graphics | Published |
| 16 | The Model Outgrows One Machine | `src/chapter-16.md` | Planned high-value graphics | Published |
| 17 | From Completion Machine to Helpful Assistant | `src/chapter-17.md` | Planned high-value graphics | Published |
| 18 | Three Transformer Families Move In | `src/chapter-18.md` | Planned high-value graphics | Published |
| 19 | The Decoder Borrows the Encoder’s Notes | `src/chapter-19.md` | Planned high-value graphics | Published |
| 20 | From Pretraining to Specialisation | `src/chapter-20.md` | Planned high-value graphics | Published |
| 21 | Open Book, Closed Book, or Tool Belt? | `src/chapter-21.md` | Planned high-value graphics | Published |
| 22 | Pictures, Audio, and Other Modalities | `src/chapter-22.md` | Planned high-value graphics | Published |
| 23 | Smaller, Faster, Cheaper | `src/chapter-23.md` | Planned high-value graphics | Published |
| 24 | Trust, but Verify | `src/chapter-24.md` | Planned high-value graphics | Published |

## Learning sequence

1. Hidden states establish what each token currently knows.
2. Query projections express what each token position is seeking.
3. Key projections create searchable representations for matching.
4. Scaled dot products, causal masking, and softmax produce attention weights.
5. Value projections and weighted sums produce the output of one attention head.
6. Multiple heads learn parallel matching-and-retrieval systems and concatenate their outputs.
7. The output projection mixes head features; residual connections and normalisation preserve a stable residual stream.
8. The position-wise MLP performs non-linear private processing and completes one simplified Transformer block.
9. Positional embeddings and RoPE supply order and relative-distance information.
10. A stack of independently learned blocks repeatedly refines the residual stream and maintains per-layer KV caches during generation.
11. The final hidden state is projected into vocabulary logits, converted into probabilities, and decoded into the next token.
12. Shifted token sequences create next-token inputs and labels while causal and loss masks preserve the intended training task.
13. Cross-entropy converts correct-target probabilities into a masked mean loss, perplexity, and the initial logit gradient.
14. Backpropagation applies the chain rule through the output head, residual stream, MLPs, attention, embeddings, and optimiser update.
15. Minibatches, accumulation, data mixtures, schedules, validation, and checkpoints turn repeated updates into a controlled training run.
16. Data parallelism, model-state sharding, tensor parallelism, pipelines, and rematerialisation distribute training across accelerators.
17. Supervised demonstrations, preference comparisons, and low-rank adapters shape a pretrained completion model into assistant-like behaviour.
18. Encoder-only, decoder-only, and encoder–decoder architectures are compared by attention pattern, training objective, strengths, and publicly documented real-world examples.
19. Cross-attention is derived explicitly: decoder Queries attend to encoder Keys and Values so generated output can consult an encoded source sequence.
20. The complete model lifecycle distinguishes broad pretraining, foundation models, base checkpoints, continued pretraining, full fine-tuning, supervised and instruction tuning, LoRA or QLoRA, preference tuning, prompting, retrieval, and tools.
21. Retrieval and tools distinguish information stored in weights from information supplied in context or fetched at runtime.
22. Multimodal systems connect language models to image, audio, and other modality encoders through projectors, shared token spaces, or cross-attention variants.
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

Strong candidates for Chapters 18–24 are:

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

1. Numerically and editorially review Chapters 18–24 against the established chapter style.
2. Create the Chapter 18–24 visual master plan and chapter-specific scene plans.
3. Produce the architecture-family and cross-attention graphics first.
4. Continue through the foundation-model lifecycle, RAG, multimodality, efficiency, and evaluation graphics.
5. Integrate approved assets with descriptive alt text and mobile review.