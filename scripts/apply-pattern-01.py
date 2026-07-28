from pathlib import Path


def insert_once(path: str, anchor: str, insertion: str, *, before: bool = True) -> None:
    file_path = Path(path)
    text = file_path.read_text(encoding="utf-8")
    marker = "<!-- design-pattern-01:"

    if marker in text:
        print(f"skip {path}: pattern marker already present")
        return

    count = text.count(anchor)
    if count != 1:
        raise RuntimeError(f"Expected exactly one anchor in {path}, found {count}: {anchor[:80]!r}")

    replacement = insertion + "\n\n" + anchor if before else anchor + "\n\n" + insertion
    file_path.write_text(text.replace(anchor, replacement, 1), encoding="utf-8")
    print(f"updated {path}")


chapter_1_preview = r'''<!-- design-pattern-01:preview:start -->
<div class="translation">

## Design Pattern Preview — Residual Connection

The structure:

$$
X_{\text{updated}}=X+\Delta X_{\text{attention}}
$$

is a standard **residual connection**. The incoming state keeps a direct route to the output while attention contributes a learned update.

Chapter 7 develops this pattern fully and compares it with residual blocks used elsewhere in machine learning.

</div>
<!-- design-pattern-01:preview:end -->'''

insert_once(
    "src/chapter-01.md",
    "![Before and after the attention matchmaking session](../assets/chapter-01/04_before_and_after_attention.png)",
    chapter_1_preview,
    before=True,
)


chapter_7_pattern = r'''<!-- design-pattern-01:full:start -->
# Design Pattern — Residual Connections

## Learn an Update, Keep the State

The standard ML-community name for the structure used above is a **residual connection**.

The broader family is called **skip connections**. When the bypass carries $x$ unchanged, it is more specifically an **identity skip connection**.

<div class="big-idea">

**Preserve the current representation as a sensible default, and let the learned branch contribute a correction.**

</div>

## The recurring problem: replacement is a demanding job

Suppose a learned sublayer uses the replacement-only form:

$$
y=F(x)
$$

The branch $F$ must produce the complete next representation. Anything useful in $x$ survives only if the branch reconstructs or preserves it.

That raises three questions in a deep network:

- What happens to information that the branch does not reproduce?
- What should the layer do when very little change is useful?
- How does a correction signal travel through many composed transformations?

A replacement layer is not inherently wrong. The issue is that repeatedly rebuilding an already-useful state can make a deep architecture harder to optimise.

## The pattern

A residual connection keeps a direct route and adds the learned transformation:

$$
\boxed{y=x+F(x)}
$$

Here:

- $x$ is the incoming representation;
- $F(x)$ is the learned **residual update**;
- $y$ is the amended representation.

If the desired mapping is $H(x)$, the branch can be viewed as learning the difference:

$$
F(x)=H(x)-x
$$

so that:

$$
H(x)=x+F(x)
$$

This is an interpretation of what the architecture makes easy to learn. The model does not need to explicitly calculate a target residual during inference.

## In our Transformer

For this attention sublayer:

$$
R=X+Y
$$

where:

- $X$ is the incoming token-state matrix;
- $Y$ is the attention update returned to the model width;
- $R$ is the amended residual-stream state.

The important interpretation is:

> Attention writes into the token's evolving state. It does not replace the token with an attention report.

For SAT, the chapter already calculated:

$$
x_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

and:

$$
y_{\text{sat}}
\approx
\begin{bmatrix}
-0.102905 & 0.152723 & 0.053205 & -0.123094
\end{bmatrix}
$$

The residual result is:

$$
r_{\text{sat}}
=x_{\text{sat}}+y_{\text{sat}}
\approx
\begin{bmatrix}
0.037095 & -0.067277 & 0.723205 & -0.433094
\end{bmatrix}
$$

The attention output is being used as an **amendment**, not as a complete replacement state.

## A counterfactual: replacement versus residual

Compare the two designs:

```text
replacement-only: output = Y
residual:         output = X + Y
```

If the attention branch temporarily produced a near-zero update, the replacement-only form would produce a near-zero state. The residual form would preserve the current state.

## The zero-update sanity check

Let:

$$
x=
\begin{bmatrix}
2 & -1 & 0.5
\end{bmatrix}
$$

and suppose:

$$
F(x)=
\begin{bmatrix}
0 & 0 & 0
\end{bmatrix}
$$

With replacement:

$$
y=F(x)=0
$$

With a residual connection:

$$
y=x+F(x)=x
$$

Identity is therefore an easy fallback behaviour: if the branch initially contributes little, the block can behave approximately like “do no harm.”

## What the pattern buys us

### 1. The branch can focus on an update

The sublayer does not need to reconstruct everything already available in the incoming representation.

### 2. Useful information has a direct route

The output does not depend entirely on every useful coordinate being recreated by the learned branch.

### 3. Deep stacks gain additional optimisation routes

During backpropagation, the shared input receives a contribution through the direct addition and another through the learned branch. Chapter 14 develops that calculation.

Use cautious wording here: residual connections often make deep networks easier to train, but they do not guarantee that signals or gradients remain large, small, or stable. The branch can amplify, attenuate, reinforce, or oppose other contributions.

### 4. The architecture gains a stable interface

When sublayers return to $d_{\text{model}}$, many different transformations can read and write one shared representation format.

## The same standard pattern in a ResNet

Residual connections became widely known through residual networks for computer vision. A simplified ResNet block uses:

$$
y=x+F_{\text{conv}}(x)
$$

The convolutional branch learns a visual-feature update while the input feature map travels along the bypass.

Consider a tiny toy feature map:

$$
x=
\begin{bmatrix}
1.0 & 0.8\\
0.2 & 0.0
\end{bmatrix}
$$

Suppose the convolutional branch produces:

$$
F_{\text{conv}}(x)=
\begin{bmatrix}
0.1 & -0.1\\
0.3 & 0.2
\end{bmatrix}
$$

Then:

$$
y=x+F_{\text{conv}}(x)
=
\begin{bmatrix}
1.1 & 0.7\\
0.5 & 0.2
\end{bmatrix}
$$

This is toy arithmetic for the shared architectural idea, not a claim about the exact features learned by a particular ResNet.

| Transformer residual block | ResNet residual block |
|---|---|
| token-state matrix $X$ | image feature map $x$ |
| attention or MLP branch | convolutional branch |
| contextual or feature update | visual-feature update |
| element-wise addition | element-wise addition |
| stable model width | compatible channel and spatial shape inside an identity block |

## Residual connection versus other skip connections

Not every skip connection is the same operation.

- **Residual and identity skip connections** usually add compatible tensors.
- **Projection residual connections** use a transform $P(x)$ on the bypass when shapes differ:

$$
y=P(x)+F(x)
$$

- **U-Net skip connections** commonly concatenate encoder and decoder features.
- **DenseNet connections** concatenate features from multiple earlier layers.
- **Highway networks** use learned gates to control transformed and bypass paths.

These architectures are related because information bypasses transformations, but their merge operations and purposes are not identical.

## Use this pattern when

- the incoming representation is already useful;
- the desired operation is naturally a refinement or amendment;
- identity is a sensible fallback;
- a deep stack should preserve information across many transformations;
- the branch can return a compatible shape, or a deliberate projection can make it compatible.

## Watch out for

- residual addition requires compatible shapes;
- a projection bypass is not a pure identity route;
- large or poorly scaled updates can still destabilise the stream;
- residual connections do not replace normalisation, suitable initialisation, or sound optimisation choices;
- direct and branch gradient contributions can reinforce or cancel each other;
- “skip connection” is a broader term than “additive residual connection.”

<div class="translation">

## Remove the costumes

| Story element | ML meaning |
|---|---|
| original case file | input representation $x$ |
| straight highway | identity skip path |
| specialist office | learned branch $F$ |
| amendment sheet | residual update $F(x)$ |
| addition junction | element-wise sum |
| updated case file | output $y=x+F(x)$ |

</div>

<div class="exercise">

## Pattern check

1. If $F(x)=0$, what does an identity residual block return?
2. Why must $x$ and $F(x)$ normally have compatible shapes?
3. Is a U-Net concatenation skip exactly the same operation as $x+F(x)$?

**Answers:** It returns $x$; compatible shapes are required for element-wise addition; and no, U-Net skips belong to the broader skip-connection family but commonly use concatenation.

</div>

```text
Standard name: Residual connection
First preview: Chapter 1
Full pattern: Chapter 7
Reappears: Chapters 8 and 10
Backward-path deep dive: Chapter 14
Non-LLM analogue: ResNet identity block
```
<!-- design-pattern-01:full:end -->'''

insert_once(
    "src/chapter-07.md",
    "# Why normalise after the residual sum?",
    chapter_7_pattern,
    before=True,
)


chapter_8_trail = r'''<!-- design-pattern-01:chapter-08:start -->
<div class="translation">

## Pattern Trail — Residual Connection

The MLP repeats the standard residual pattern introduced in Chapter 7:

$$
\text{new state}=\text{current state}+\text{learned update}
$$

Attention writes a contextual update into the residual stream. The MLP writes a position-wise feature update into that same stream. Different branches perform different computations, but both **learn an update and keep the state**.

</div>
<!-- design-pattern-01:chapter-08:end -->'''

insert_once(
    "src/chapter-08.md",
    "# The second normalisation",
    chapter_8_trail,
    before=True,
)


chapter_10_trail = r'''<!-- design-pattern-01:chapter-10:start -->
<div class="translation">

## Pattern Trail — Residual Connections Create a Stable Interface

Chapter 7 introduced the standard residual form:

$$
y=x+F(x)
$$

Across a Transformer stack, that pattern becomes a stable architectural interface. Every block receives an $n\times d_{\text{model}}$ residual stream, computes specialised updates, and returns another matrix with the same outer shape.

Depth therefore behaves like **repeated refinement**, not repeated reconstruction from raw embeddings.

</div>
<!-- design-pattern-01:chapter-10:end -->'''

insert_once(
    "src/chapter-10.md",
    "# Modern pre-norm stack notation",
    chapter_10_trail,
    before=True,
)


chapter_14_revisit = r'''<!-- design-pattern-01:chapter-14:start -->
<div class="translation">

## Design Pattern Revisited — The Direct Route Also Exists Backward

Chapter 7 introduced the residual connection as:

$$
y=x+F(x)
$$

The forward value follows both the identity path and the learned branch. During backpropagation, the shared input likewise receives two contributions:

$$
\frac{\partial\mathcal L}{\partial x}
=
\frac{\partial\mathcal L}{\partial y}
+
\frac{\partial\mathcal L}{\partial y}
\frac{\partial F}{\partial x}
$$

The first term is the direct identity-path contribution. The second term travels through the learned branch.

This direct term is one reason residual architectures are easier to optimise at depth. It is not a guarantee that the total gradient will have a particular magnitude: the branch contribution may reinforce or oppose the direct contribution.

</div>
<!-- design-pattern-01:chapter-14:end -->'''

insert_once(
    "src/chapter-14.md",
    '<div class="warning">\n\n## Forward branches copy values; backward branches add gradients',
    chapter_14_revisit,
    before=True,
)
