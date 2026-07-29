from pathlib import Path


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{path}: expected one replacement target, found {count}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


chapter_path = Path('src/chapter-01.md')
replace_once(
    chapter_path,
    'We will return to this distinction when we study positional encoding. For now, the important point is simply:',
    'Chapter 9 will return to this distinction when it opens the positional mechanism in detail. For now, the important point is simply:'
)
replace_once(
    chapter_path,
    '''At the entrance to the first Transformer layer, a token state begins from something approximately like:

$$
\\text{token information} + \\text{position information}
$$''',
    '''At the entrance to the first Transformer layer, the initial state combines token identity with whatever positional treatment the architecture uses.'''
)

bridge = r'''# Where does the initial hidden state come from?

At the model entrance, the tokenizer produces token IDs. An embedding table maps each token ID to a **token embedding**. Token identity alone, however, does not tell the learned computation where that occurrence appears in the sequence.

In one common additive teaching model, the architecture also supplies a positional contribution:

$$
X^{(0)} = E + P
$$

| Object | Meaning | Shape in the running example |
|---|---|---|
| $E$ | token embeddings | $3 \times 4$ |
| $P$ | simple positional contribution | $3 \times 4$ |
| $X^{(0)}$ | initial hidden states | $3 \times 4$ |

Here, $E$ contributes token identity and $P$ makes position available. The addition is possible because the two matrices have the same shape.

This is a **useful teaching bridge, not a universal recipe**. Learned absolute positions and fixed sinusoidal encodings can be added to token embeddings. Other architectures inject position differently. RoPE, for example, normally rotates Query and Key coordinate pairs, while relative-position methods can modify attention scores.

For the calculations in Chapters 1–8, treat the provided matrix $X$ as the state entering the attention block, with the architecture's positional treatment already accounted for where applicable. We do not need to separate its displayed numbers back into a token-only part and a position-only part.

The tensor still preserves row alignment: row 2 belongs to `CAT`. That is bookkeeping. The learned projections receive the row's numerical values; they do not automatically receive a rich semantic feature saying “I am position 2.” A positional mechanism must make location or relative distance available to the computation.

After many layers, positional information need not remain as a separately identifiable subvector. It can be mixed into the evolving hidden state with token and contextual information.

**Chapter 9 opens this position box fully**, comparing learned absolute positions, sinusoidal encodings, relative methods, and RoPE.
'''
replace_once(
    chapter_path,
    '''These descriptions are human interpretations. Internally, the model still carries a vector.

# What does “contextual” mean?''',
    f'''These descriptions are human interpretations. Internally, the model still carries a vector.\n\n{bridge}\n# What does “contextual” mean?'''
)

plan_path = Path('docs/inference-loop-scene-master-plan.md')
replace_once(
    plan_path,
    '''Chapter 1: current hidden states
Chapter 2: Queries''',
    '''Chapter 1: current hidden states and the minimum token-plus-position scaffold
Chapter 2: Queries'''
)
replace_once(
    plan_path,
    '''Chapter 8: MLP and completed block
Chapter 9: rewind to positional information
Chapter 10: stack many blocks and reuse KV caches''',
    '''Chapter 8: MLP and completed block
Chapter 9: open and compare positional mechanisms in detail
Chapter 10: stack many blocks and reuse KV caches'''
)
replace_once(
    plan_path,
    '''Chapter 9 intentionally rewinds to an earlier computational stage. Its opening artwork must make that rewind explicit so the reader does not think position information is first added after a completed block.''',
    '''Chapter 1 now labels the earlier computational stage with a minimum scaffold: token identity and an architecture-specific positional treatment prepare the state that enters the first block. Chapter 9 remains later in the teaching sequence because readers can then understand how learned absolute positions, sinusoidal encodings, relative methods, and RoPE affect the computation. The transition should feel like opening a previously labelled position box, not introducing position after a completed block.'''
)
replace_once(
    plan_path,
    '''Purpose:

Distinguish the original embedding from the current hidden state at a later layer.

### Scene 4 — Before and after attention''',
    '''Purpose:

Distinguish the original embedding from the current hidden state at a later layer. The existing passport also supplies the minimum position bridge: identity and positional treatment are present at the model entrance, while Chapter 9 opens the architecture-specific mechanisms in detail. This prose update does not add or prescribe a new illustration; the dedicated position-bridge artwork remains a separate visual-production story.

### Scene 4 — Before and after attention'''
)

stories_path = Path('docs/stories.md')
replace_once(
    stories_path,
    '## COH-2.1 — Add the minimum positional scaffold to Chapter 1\n\n**Status:** Planned',
    '## COH-2.1 — Add the minimum positional scaffold to Chapter 1\n\n**Status:** Complete'
)

chapter = chapter_path.read_text(encoding='utf-8')
plan = plan_path.read_text(encoding='utf-8')
stories = stories_path.read_text(encoding='utf-8')
for required in [
    '# Where does the initial hidden state come from?',
    'X^{(0)} = E + P',
    '| $E$ | token embeddings | $3 \\times 4$ |',
    '| $P$ | simple positional contribution | $3 \\times 4$ |',
    '| $X^{(0)}$ | initial hidden states | $3 \\times 4$ |',
    'useful teaching bridge, not a universal recipe',
    'RoPE, for example, normally rotates Query and Key coordinate pairs',
    'Chapter 9 opens this position box fully',
    'row 2 belongs to `CAT`',
    '0.21 & -0.37 & 0.58 & -0.11',
    '-0.42 & 0.73 & -0.15 & 0.36',
    '0.14 & -0.22 & 0.67 & -0.31'
]:
    if required not in chapter:
        raise SystemExit(f'Chapter 1 validation failed: missing {required!r}')
if not chapter.index('# Is the vector still just an embedding?') < chapter.index('# Where does the initial hidden state come from?') < chapter.index('# What does “contextual” mean?'):
    raise SystemExit('The positional scaffold is not at the required Chapter 1 location.')
for required in [
    'minimum token-plus-position scaffold',
    'open and compare positional mechanisms in detail',
    'opening a previously labelled position box',
    'existing passport also supplies the minimum position bridge'
]:
    if required not in plan:
        raise SystemExit(f'Inference plan validation failed: missing {required!r}')
status = '## COH-2.1 — Add the minimum positional scaffold to Chapter 1\n\n**Status:** Complete'
if stories.count(status) != 1:
    raise SystemExit('COH-2.1 was not marked Complete exactly once.')
print('COH-2.1 edits and editorial checks passed.')
