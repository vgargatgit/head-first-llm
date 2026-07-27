# LLMs from the Inside Out — Chapter Manifest

This file records the canonical chapter order and publication status for the book website.

| Chapter | Title | Source | Graphics status | Publication status |
|---:|---|---|---|---|
| 1 | A Token Enters the Dating World | `src/chapter-01.md` | Illustrated | Published |
| 2 | Meet the Question Coach | `src/chapter-02.md` | Illustrated | Published |
| 3 | Meet the Profile Writer | `src/chapter-03.md` | Illustrated | Published |
| 4 | When Queries Meet Keys | `src/chapter-04.md` | Planned high-value graphics | Published |
| 5 | Meet the Information Courier | `src/chapter-05.md` | Planned high-value graphics | Published |
| 6 | Many Specialists at Work | `src/chapter-06.md` | Planned high-value graphics | Published |
| 7 | The Team Lead Combines the Reports | `src/chapter-07.md` | Planned high-value graphics | Published |
| 8 | The Private Thinking Room | `src/chapter-08.md` | Planned high-value graphics | Published |
| 9 | Every Token Needs an Address | `src/chapter-09.md` | Planned high-value graphics | Published |
| 10 | The Residual Stream Climbs the Stack | `src/chapter-10.md` | Planned high-value graphics | Published |
| 11 | The Final Audition | `src/chapter-11.md` | Planned high-value graphics | Published |

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

## Graphics approach

Chapters are written and numerically verified before illustration work begins. Graphics are then added selectively where they provide high instructional value, rather than as decoration.

Strong candidates across Chapters 6–11 are:

- parallel heads processing the same token rows and concatenating by feature;
- output projection plus the residual highway and normalisation;
- attention as cross-token communication versus the MLP as private per-token processing;
- one complete Transformer-block flow;
- additive position embeddings compared with rotating Query/Key pairs under RoPE;
- one token case file moving through a vertical stack with per-layer KV-cache shelves;
- a final hidden vector expanding into vocabulary logits, softmax probabilities, and the autoregressive loop.

## Planned continuation

The next sequence can move from inference to learning: shifted next-token targets, cross-entropy loss, backpropagation, gradients, optimisation, and how the model's parameters acquire useful values.