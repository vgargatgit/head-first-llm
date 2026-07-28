# LLMs from the Inside Out — Chapter Manifest

This file records the canonical chapter order and publication status for the book website.

| Chapter | Title | Main concepts | Source | Graphics status | Publication status |
|---:|---|---|---|---|---|
| 1 | A Token Enters the Dating World | Tokens, vectors, hidden states | `src/chapter-01.md` | Illustrated | Published |
| 2 | Meet the Question Coach | Query projections | `src/chapter-02.md` | Illustrated | Published |
| 3 | Meet the Profile Writer | Key projections | `src/chapter-03.md` | Illustrated | Published |
| 4 | Compatibility Scores — When Queries Meet Keys | Dot products, scaling, masking, softmax | `src/chapter-04.md` | Opener in progress | In progress |
| 5 | Meet the Information Courier | Value projections, weighted sums, context vectors | `src/chapter-05.md` | Planned | Planned |
| 6 | Many Specialists at Work | Multi-head attention and concatenation | `src/chapter-06.md` | Planned | Planned |
| 7 | The Team Lead Combines the Reports | Output projection, residual connections, normalisation | `src/chapter-07.md` | Planned | Planned |
| 8 | The Private Thinking Room | Position-wise MLP and non-linearity | `src/chapter-08.md` | Planned | Planned |
| 9 | Every Token Needs an Address | Positional embeddings, relative position, RoPE | `src/chapter-09.md` | Planned | Planned |
| 10 | The Residual Stream Climbs the Stack | Repeated Transformer blocks and evolving hidden states | `src/chapter-10.md` | Planned | Planned |
| 11 | Three Transformer Families Move In | Encoder-only, decoder-only, and encoder–decoder models | `src/chapter-11.md` | Planned | Planned |
| 12 | The Decoder Borrows the Encoder’s Notes | Cross-attention, source memory, conditional generation | `src/chapter-12.md` | Planned | Planned |
| 13 | The Final Audition | Vocabulary logits and next-token probabilities | `src/chapter-13.md` | Planned | Planned |
| 14 | One Token at a Time | Autoregressive decoding, temperature, top-k, top-p, beam search, KV cache | `src/chapter-14.md` | Planned | Planned |
| 15 | The Answer Key Moves One Step Ahead | Shifted inputs and next-token training labels | `src/chapter-15.md` | Planned | Planned |
| 16 | Meet the Scorekeeper | Cross-entropy, masking, mean loss, perplexity | `src/chapter-16.md` | Planned | Planned |
| 17 | The Blame Travels Backward | Backpropagation, gradients, optimisers | `src/chapter-17.md` | Planned | Planned |
| 18 | From Blank Slate to Foundation Model | Foundation models, self-supervised pretraining, broad data, scale, checkpoints | `src/chapter-18.md` | Planned | Planned |
| 19 | The Model Goes to Finishing School | Fine-tuning, supervised fine-tuning, instruction tuning, adapters, LoRA and QLoRA | `src/chapter-19.md` | Planned | Planned |
| 20 | Learning What People Prefer | Reward models, RLHF, preference tuning, DPO, safety tuning | `src/chapter-20.md` | Planned | Planned |
| 21 | The Training Factory Never Sees the Whole Library | Minibatches, accumulation, data mixtures, schedules, validation | `src/chapter-21.md` | Planned | Planned |
| 22 | The Model Outgrows One Machine | Data, tensor and pipeline parallelism; sharding and rematerialisation | `src/chapter-22.md` | Planned | Planned |
| 23 | Open Book, Closed Book, or Tool Belt? | Prompt context, model weights, RAG, tools and external memory | `src/chapter-23.md` | Planned | Planned |
| 24 | Pictures, Audio, and Other Languages | Multimodal encoders, projectors, modality tokens and cross-attention variants | `src/chapter-24.md` | Planned | Planned |
| 25 | Smaller, Faster, Cheaper | Quantisation, distillation, sparse and mixture-of-experts models, serving efficiency | `src/chapter-25.md` | Planned | Planned |
| 26 | Trust, but Verify | Evaluation, hallucination, calibration, bias, privacy, safety and benchmark contamination | `src/chapter-26.md` | Planned | Planned |

## Learning sequence

### Part I — Build attention from the vectors up

1. Hidden states establish what each token currently knows.
2. Query projections express what each token position is seeking.
3. Key projections create searchable representations for matching.
4. Scaled dot products, causal masking and softmax produce attention weights.
5. Value projections and weighted sums produce the output of one attention head.
6. Multiple heads learn parallel matching-and-retrieval systems.
7. Output projections, residual connections and normalisation return the result to the residual stream.
8. The position-wise MLP performs non-linear private processing.
9. Position information supplies order and relative distance.
10. A stack of independently learned blocks repeatedly refines every token representation.

### Part II — Meet the Transformer families

11. Encoder-only models read bidirectionally and excel at representation, classification and retrieval tasks.
12. Decoder-only models use causal attention and generate sequences autoregressively.
13. Encoder–decoder models separate source understanding from target generation.
14. Cross-attention uses decoder queries with encoder keys and values, allowing the output side to consult the encoded input.
15. Publicly documented examples and typical use cases are compared without guessing the undisclosed internals of closed models.

### Part III — Train and adapt a foundation model

16. Vocabulary logits and decoding convert hidden states into generated text.
17. Shifted labels, cross-entropy and backpropagation create the basic pretraining loop.
18. Broad self-supervised pretraining produces an adaptable checkpoint that can serve as a foundation for many downstream systems.
19. Full fine-tuning and parameter-efficient methods specialise that checkpoint.
20. Instruction and preference tuning shape behaviour rather than merely adding factual knowledge.
21. Data pipelines, schedules, validation and distributed systems turn the mathematics into a real training run.

### Part IV — Build useful and responsible systems

22. Retrieval and tools add information that is not stored reliably in model weights.
23. Multimodal systems connect language models to image, audio and other encoders.
24. Quantisation, distillation, sparsity and serving techniques reduce cost and latency.
25. Evaluation and safeguards measure capability, reliability and risk before deployment.

## Model-family examples for Chapter 11

| Family | Attention pattern | Publicly documented examples | Typical strengths |
|---|---|---|---|
| Encoder-only | Bidirectional self-attention | BERT, RoBERTa, DeBERTa, ModernBERT | Classification, tagging, retrieval, reranking and embeddings |
| Decoder-only | Causal self-attention | GPT-3, Llama 3, Mistral 7B, Gemma | Text and code generation, chat, completion and tool-oriented generation |
| Encoder–decoder | Encoder self-attention, decoder causal self-attention and cross-attention | Original Transformer, T5, BART, Whisper | Translation, summarisation, transcription and conditional generation |

Commercial frontier models whose current internal architecture is not sufficiently disclosed should be labelled **architecture not publicly confirmed**, rather than being forced into a category.

## Graphics approach

Chapters are written and numerically verified before final illustration work begins. Graphics are added where they carry instructional value rather than as decoration.

Strong candidates for the new chapters include:

- a three-house comparison of encoder-only, decoder-only and encoder–decoder attention patterns;
- a cross-attention scene in which decoder Queries consult an encoder memory wall of Keys and Values;
- a foundation-model construction site showing broad pretraining followed by many adapted downstream buildings;
- a training-path map separating pretraining, supervised fine-tuning, instruction tuning and preference tuning;
- a model-family field guide matching public models to their architecture and common jobs;
- a RAG scene contrasting knowledge in weights, information in the prompt and documents retrieved at runtime;
- a multimodal bridge connecting image or audio encoders to a language decoder;
- a deployment workshop covering quantisation, distillation, MoE routing and KV-cache memory;
- an evaluation clinic for hallucination, calibration, bias, privacy, safety and benchmark leakage.

## Immediate production order

1. Finish the Chapter 4 graphics pack.
2. Write and numerically verify Chapter 4.
3. Build the Chapter 4 HTML.
4. Continue through Values, multi-head attention and the complete Transformer block.
5. Produce the model-family and cross-attention chapters before beginning the training arc.
