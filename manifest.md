# LLMs from the Inside Out — Chapter Manifest

This file records the canonical chapter order and publication status for the book website.

| Chapter | Title | Source | Graphics status | Publication status |
|---:|---|---|---|---|
| 1 | A Token Enters the Dating World | `src/chapter-01.md` | Illustrated | Published |
| 2 | Meet the Question Coach | `src/chapter-02.md` | Illustrated | Published |
| 3 | Meet the Profile Writer | `src/chapter-03.md` | Illustrated | Published |
| 4 | When Queries Meet Keys | `src/chapter-04.md` | No graphics | Published |
| 5 | Meet the Information Courier | `src/chapter-05.md` | No graphics | Published |

## Learning sequence

1. Hidden states establish what each token currently knows.
2. Query projections express what each token position is seeking.
3. Key projections create searchable representations for matching.
4. Scaled dot products, causal masking, and softmax produce attention weights.
5. Value projections and weighted sums produce the output of one attention head.

## Planned continuation

Chapter 6 can introduce multi-head attention, concatenation, and the output projection \(W^O\).
